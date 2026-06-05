import * as THREE from 'three'
import gsap from 'gsap'

export function createTrapezoidGeometry(topWidth, bottomWidth, length) {
  const geometry = new THREE.BufferGeometry()

  const top = topWidth / 2
  const bottom = bottomWidth / 2
  const z0 = 0
  const z1 = length

  const vertices = new Float32Array([
    -top, 0, z0,
    top, 0, z0,
    -bottom, 0, z1,

    top, 0, z0,
    bottom, 0, z1,
    -bottom, 0, z1,
  ])

  const uvs = new Float32Array([
    0, 1,
    1, 1,
    0, 0,

    1, 1,
    1, 0,
    0, 0,
  ])

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.computeVertexNormals()

  return geometry
}

export function createParticleBurst({
  scene,
  vertexParticles,
  fragmentParticles,

  particleCount = 180,

  originX = 0,
  originY = 3,
  originZ = -2.55,

  width = 1.2,
  height = 2,

  life = 2.6,
  kick = 1,

  palette = ['#2a2929'],
}) {
  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  const randoms = new Float32Array(particleCount)
  const sizes = new Float32Array(particleCount)
  const colors = new Float32Array(particleCount * 3)

  const colorPalette = palette.map((color) => new THREE.Color(color))

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    positions[i3 + 0] = originX + (Math.random() - 0.5) * width
    positions[i3 + 1] = originY + (Math.random() - 0.5) * height
    positions[i3 + 2] = originZ + Math.random() * 0.01

    velocities[i3 + 0] = (Math.random() - 0.5) * 1.1
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.75
    velocities[i3 + 2] = 1 + Math.random() * 3.2

    randoms[i] = Math.random()
    sizes[i] = 0.08 + Math.random() * 0.2 * kick;

    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    colors[i3 + 0] = c.r
    colors[i3 + 1] = c.g
    colors[i3 + 2] = c.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,

    uniforms: {
      uAge: { value: 0 },
      uLife: { value: life },
      uKick: { value: kick },
      uIntroPower: { value: 0 },
    },

    vertexShader: vertexParticles,
    fragmentShader: fragmentParticles,
  })

  const particles = new THREE.Points(geometry, material)
  particles.frustumCulled = false
  scene.add(particles)

  return {
    geometry,
    material,
    particles,
    age: 0,
    life,

    update(delta) {
      this.age += delta
      this.material.uniforms.uAge.value = this.age
      return this.age < this.life
    },

    dispose() {
      scene.remove(this.particles)
      this.geometry.dispose()
      this.material.dispose()
    },
  }
} 

export function createGlassMaterial(
  texture, maskTexture,
  settings = {},
  vertexShader,
  fragmentShader
) {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,

    uniforms: {
      uTexture: { value: texture },

      uMask: { value: maskTexture },

      uTime: { value: 0 },
      uVolume: { value: 0 },
      uFlash: { value: 0 },
      uFlashColor: {
        value: new THREE.Color(settings.flashColor ?? '#ffffff'),
      },

      uBaseBrightness: {
        value: settings.brightness ?? 2,
      },

      uVolumeBrightness: {
        value: settings.volumeBrightness ?? 1.2,
      },

      uGlowStrength: {
        value: settings.glowStrength ?? 0.8,
      },

      uSaturation: {
        value: settings.saturation ?? 1,
      },
      uIntroPower: { value: 0 },

      uColorA: {
        value: new THREE.Color(settings.colorA ?? '#ffffff'),
      },

      uColorB: {
        value: new THREE.Color(settings.colorB ?? '#ffffff'),
      },
    },

    vertexShader,
    fragmentShader,
  })
} 

export function animateCamera(tl, shot) {
  const { position, target, duration, at } = shot

  tl.to(
    this.camera.position,
    {
      x: position[0],
      y: position[1],
      z: position[2],
      duration,
    },
    at
  )

  tl.to(
    this.controls.target,
    {
      x: target[0],
      y: target[1],
      z: target[2],
      duration,
      onUpdate: () => {
        this.controls.update()
      },
    },
    at
  )
}