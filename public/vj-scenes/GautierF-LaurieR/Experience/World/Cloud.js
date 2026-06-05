import * as THREE from 'three'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'
import Experience from '../Experience.js'

import vertexShader from './Cloud/shaders/vertex.glsl.js'
import fragmentShader from './Cloud/shaders/fragment.glsl.js'
import { PERFORMANCE } from '../Utils/Performance.js'

const TEXTURE_SIZE = 96
const DEFAULT_STEPS = PERFORMANCE.cloudSteps
const MIN_STEPS = PERFORMANCE.cloudMinSteps

export default class Cloud
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.debug = this.experience.debug

        this.perlin = new ImprovedNoise()
        this.vector = new THREE.Vector3()
        this._cameraPosition = new THREE.Vector3()

        this.sunDirection = new THREE.Vector3(-12, 4, -4).normalize()

        this.sharedUniforms = {
            cameraPos: { value: new THREE.Vector3() },
            base: { value: new THREE.Color('#f2dcc8') },
            sunDirection: { value: this.sunDirection },
            frame: { value: 0 },
            time: { value: 0 }
        }

        this.volumeParams = {
            threshold: 0.24,
            opacity: 0.14,
            range: 0.08,
            steps: DEFAULT_STEPS,
            lod: true
        }

        this.clouds = [
            {
                positionX: -10,
                positionY: 5.5,
                positionZ: -5,
                scaleX: 10,
                scaleY: 5,
                scaleZ: 9,
                intensity: 0.35,
                noiseOffset: 0
            },
            {
                positionX: 0,
                positionY: 7,
                positionZ: 6,
                scaleX: 11,
                scaleY: 5,
                scaleZ: 10,
                intensity: 0.35,
                noiseOffset: 42
            },
            {
                positionX: 12,
                positionY: 4.5,
                positionZ: -12,
                scaleX: 9,
                scaleY: 4.5,
                scaleZ: 8,
                intensity: 0.38,
                noiseOffset: 97
            }
        ]

        this.meshes = []
        this.materials = []
        this.geometry = new THREE.BoxGeometry(1, 1, 1)

        this.setMeshes()

        // if(this.debug.active)
        //     this.setDebug()
    }

    createTexture(noiseOffset)
    {
        const size = TEXTURE_SIZE
        const data = new Uint8Array(size * size * size)

        let i = 0
        const scale = 0.05

        for(let z = 0; z < size; z++)
        {
            for(let y = 0; y < size; y++)
            {
                for(let x = 0; x < size; x++)
                {
                    const radius = this.vector.set(x, y, z).subScalar(size / 2).divideScalar(size).length()
                    const d = Math.max(1.0 - radius, 0)
                    const falloff = d * d * d
                    data[i] = (128 + 128 * this.perlin.noise(
                        x * scale / 1.5 + noiseOffset,
                        y * scale + noiseOffset * 0.5,
                        z * scale / 1.5 + noiseOffset * 1.3
                    )) * falloff
                    i++
                }
            }
        }

        const texture = new THREE.Data3DTexture(data, size, size, size)
        texture.format = THREE.RedFormat
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.wrapR = THREE.ClampToEdgeWrapping
        texture.unpackAlignment = 1
        texture.needsUpdate = true

        return texture
    }

    createMaterial(texture, intensity)
    {
        return new THREE.RawShaderMaterial({
            glslVersion: THREE.GLSL3,
            uniforms: {
                base: this.sharedUniforms.base,
                sunDirection: this.sharedUniforms.sunDirection,
                map: { value: texture },
                cameraPos: this.sharedUniforms.cameraPos,
                frame: this.sharedUniforms.frame,
                time: this.sharedUniforms.time,
                threshold: { value: this.volumeParams.threshold },
                opacity: { value: this.volumeParams.opacity },
                range: { value: this.volumeParams.range },
                intensity: { value: intensity },
                steps: { value: this.volumeParams.steps }
            },
            vertexShader,
            fragmentShader,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
            depthTest: true
        })
    }

    setMeshes()
    {
        for(const params of this.clouds)
        {
            const texture = this.createTexture(params.noiseOffset)
            const material = this.createMaterial(texture, params.intensity)
            const mesh = new THREE.Mesh(this.geometry, material)

            mesh.position.set(params.positionX, params.positionY, params.positionZ)
            mesh.scale.set(params.scaleX, params.scaleY, params.scaleZ)
            mesh.renderOrder = 10
            mesh.frustumCulled = true

            this.scene.add(mesh)
            this.meshes.push(mesh)
            this.materials.push({ material, params })
        }
    }

    getLodSteps(mesh)
    {
        const base = this.volumeParams.steps

        if(!this.volumeParams.lod)
            return base

        const distance = this._cameraPosition.distanceTo(mesh.position)
        const maxScale = Math.max(mesh.scale.x, mesh.scale.y, mesh.scale.z)
        const apparentSize = maxScale / Math.max(distance, 1)

        if(apparentSize < 0.25)
            return Math.max(MIN_STEPS, Math.floor(base * 0.55))

        if(apparentSize < 0.5)
            return Math.max(MIN_STEPS, Math.floor(base * 0.75))

        return base
    }

    /* setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('nuages')
        this.debugFolder.open()

        this.materials.forEach(({ params }, index) =>
        {
            const folder = this.debugFolder.addFolder(`nuage ${index + 1}`)
            if(index === 0)
                folder.open()

            folder.add(params, 'positionX', -30, 30, 0.1).onChange(() => this.applyTransform(index))
            folder.add(params, 'positionY', -5, 40, 0.1).onChange(() => this.applyTransform(index))
            folder.add(params, 'positionZ', -30, 30, 0.1).onChange(() => this.applyTransform(index))
            folder.add(params, 'scaleX', 1, 40, 0.1).onChange(() => this.applyTransform(index))
            folder.add(params, 'scaleY', 1, 20, 0.1).onChange(() => this.applyTransform(index))
            folder.add(params, 'scaleZ', 1, 40, 0.1).onChange(() => this.applyTransform(index))
            folder
                .add(params, 'intensity', 0.3, 2.5, 0.05)
                .name('intensité')
                .onChange(() => this.updateCloudIntensity(index))
        })

        const volumeFolder = this.debugFolder.addFolder('réglages globaux')
        volumeFolder.open()
        volumeFolder
            .add(this.volumeParams, 'opacity', 0.05, 1, 0.01)
            .name('densité (opacity)')
            .onChange(() => this.updateVolumeUniforms())
        volumeFolder
            .add(this.volumeParams, 'threshold', 0, 0.6, 0.01)
            .name('seuil (threshold)')
            .onChange(() => this.updateVolumeUniforms())
        volumeFolder
            .add(this.volumeParams, 'range', 0.02, 0.35, 0.01)
            .name('douceur (range)')
            .onChange(() => this.updateVolumeUniforms())
        volumeFolder
            .add(this.volumeParams, 'steps', 24, 80, 1)
            .name('qualité (steps)')
            .onChange(() => this.updateVolumeUniforms())
        volumeFolder
            .add(this.volumeParams, 'lod')
            .name('LOD distance')
            .onChange(() => this.updateVolumeUniforms())

        const colorControl = { couleur: '#f2dcc8' }
        volumeFolder
            .addColor(colorControl, 'couleur')
            .name('teinte')
            .onChange(() => this.sharedUniforms.base.value.set(colorControl.couleur))
    } */

    applyTransform(index)
    {
        const params = this.materials[index].params
        const mesh = this.meshes[index]

        mesh.position.set(params.positionX, params.positionY, params.positionZ)
        mesh.scale.set(params.scaleX, params.scaleY, params.scaleZ)
    }

    updateCloudIntensity(index)
    {
        const { material, params } = this.materials[index]
        material.uniforms.intensity.value = params.intensity
    }

    updateVolumeUniforms()
    {
        for(const { material } of this.materials)
        {
            material.uniforms.threshold.value = this.volumeParams.threshold
            material.uniforms.opacity.value = this.volumeParams.opacity
            material.uniforms.range.value = this.volumeParams.range
        }
    }

    updateSunDirection()
    {
        const sunLight = this.experience.world?.environment?.sunLight

        if(sunLight)
            this.sunDirection.copy(sunLight.position).normalize()
    }

    update()
    {
        this._cameraPosition.copy(this.camera.position)
        this.sharedUniforms.cameraPos.value.copy(this._cameraPosition)
        this.sharedUniforms.frame.value = (this.sharedUniforms.frame.value + 1) % 10000
        this.sharedUniforms.time.value = this.experience.time.elapsed * 0.001

        this.updateSunDirection()

        for(let i = 0; i < this.meshes.length; i++)
            this.materials[i].material.uniforms.steps.value = this.getLodSteps(this.meshes[i])
    }
}
