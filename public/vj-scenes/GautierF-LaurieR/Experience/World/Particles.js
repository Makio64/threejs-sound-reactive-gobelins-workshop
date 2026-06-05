import * as THREE from 'three'
import Experience from '../Experience.js'
import { PERFORMANCE } from '../Utils/Performance.js'

import vertexShader from './Particles/shaders/vertex.glsl.js'
import fragmentShader from './Particles/shaders/fragment.glsl.js'

export default class Particles
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time

        this.count = PERFORMANCE.particleCount
        this.area = {
            x: 55,
            y: 24,
            z: 55,
            centerY: 8
        }

        this.setTexture()
        this.setGeometry()
        this.setMaterial()
        this.setPoints()
    }

    setTexture()
    {
        const size = 64
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size

        const context = canvas.getContext('2d')
        const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.5)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        context.fillStyle = gradient
        context.fillRect(0, 0, size, size)

        this.texture = new THREE.CanvasTexture(canvas)
    }

    setGeometry()
    {
        const positions = new Float32Array(this.count * 3)
        const randoms = new Float32Array(this.count * 3)
        const speeds = new Float32Array(this.count * 3)

        for(let i = 0; i < this.count; i++)
        {
            const i3 = i * 3

            positions[i3] = (Math.random() - 0.5) * this.area.x
            positions[i3 + 1] = this.area.centerY + (Math.random() - 0.5) * this.area.y
            positions[i3 + 2] = (Math.random() - 0.5) * this.area.z

            randoms[i3] = Math.random() * Math.PI * 2
            randoms[i3 + 1] = Math.random() * Math.PI * 2
            randoms[i3 + 2] = Math.random() * Math.PI * 2

            speeds[i3] = 0.08 + Math.random() * 0.12
            speeds[i3 + 1] = 0.04 + Math.random() * 0.08
            speeds[i3 + 2] = 0.08 + Math.random() * 0.12
        }

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))
        this.geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 3))
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.fog,
                {
                    uTime: { value: 0 },
                    uSize: { value: 0.18 },
                    uMap: { value: this.texture },
                    uColor: { value: new THREE.Color('#ffffff') },
                    uOpacity: { value: 0.42 }
                }
            ]),
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            fog: true
        })
    }

    setPoints()
    {
        this.points = new THREE.Points(this.geometry, this.material)
        this.points.renderOrder = 2
        this.scene.add(this.points)
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}
