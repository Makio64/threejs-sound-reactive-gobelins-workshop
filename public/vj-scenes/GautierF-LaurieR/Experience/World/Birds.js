import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import Experience from '../Experience.js'
import BirdGeometry from './Birds/BirdGeometry.js'

import positionFragmentShader from './Birds/shaders/position.glsl.js'
import velocityFragmentShader from './Birds/shaders/velocity.glsl.js'
import birdVertexShader from './Birds/shaders/vertex.glsl.js'
import birdFragmentShader from './Birds/shaders/fragment.glsl.js'

const BIRD_COUNT = 5
const TEXTURE_WIDTH = 4
const BOUNDS = 16
const FLOCK_CENTER = new THREE.Vector3(0, 5, 0)

export default class Birds
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.renderer = this.experience.renderer.instance
        this.time = this.experience.time

        this.last = performance.now()
        this.predator = new THREE.Vector3(10000, 10000, 0)

        this.flockParams = {
            separation: 10,
            alignment: 12,
            cohesion: 14
        }

        this.initCompute()
        this.initMesh()
    }

    initCompute()
    {
        this.gpuCompute = new GPUComputationRenderer(TEXTURE_WIDTH, TEXTURE_WIDTH, this.renderer)

        const dtPosition = this.gpuCompute.createTexture()
        const dtVelocity = this.gpuCompute.createTexture()

        this.fillPositionTexture(dtPosition)
        this.fillVelocityTexture(dtVelocity)

        this.velocityVariable = this.gpuCompute.addVariable(
            'textureVelocity',
            velocityFragmentShader,
            dtVelocity
        )
        this.positionVariable = this.gpuCompute.addVariable(
            'texturePosition',
            positionFragmentShader,
            dtPosition
        )

        this.gpuCompute.setVariableDependencies(this.velocityVariable, [
            this.positionVariable,
            this.velocityVariable
        ])
        this.gpuCompute.setVariableDependencies(this.positionVariable, [
            this.positionVariable,
            this.velocityVariable
        ])

        this.positionUniforms = this.positionVariable.material.uniforms
        this.velocityUniforms = this.velocityVariable.material.uniforms

        this.positionUniforms.time = { value: 0 }
        this.positionUniforms.delta = { value: 0 }

        this.velocityUniforms.time = { value: 1 }
        this.velocityUniforms.delta = { value: 0 }
        this.velocityUniforms.testing = { value: 1 }
        this.velocityUniforms.separationDistance = { value: this.flockParams.separation }
        this.velocityUniforms.alignmentDistance = { value: this.flockParams.alignment }
        this.velocityUniforms.cohesionDistance = { value: this.flockParams.cohesion }
        this.velocityUniforms.freedomFactor = { value: 0.75 }
        this.velocityUniforms.predator = { value: this.predator }
        this.velocityUniforms.flockCenter = { value: FLOCK_CENTER.clone() }

        this.velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2)

        this.velocityVariable.wrapS = THREE.RepeatWrapping
        this.velocityVariable.wrapT = THREE.RepeatWrapping
        this.positionVariable.wrapS = THREE.RepeatWrapping
        this.positionVariable.wrapT = THREE.RepeatWrapping

        const error = this.gpuCompute.init()

        if(error !== null)
            console.error('Birds GPU compute:', error)
    }

    fillPositionTexture(texture)
    {
        const theArray = texture.image.data
        const total = TEXTURE_WIDTH * TEXTURE_WIDTH

        for(let i = 0; i < total; i++)
        {
            const k = i * 4

            if(i < BIRD_COUNT)
            {
                theArray[k + 0] = FLOCK_CENTER.x + (Math.random() - 0.5) * BOUNDS * 0.7
                theArray[k + 1] = FLOCK_CENTER.y + (Math.random() - 0.5) * BOUNDS * 0.35
                theArray[k + 2] = FLOCK_CENTER.z + (Math.random() - 0.5) * BOUNDS * 0.7
                theArray[k + 3] = Math.random() * Math.PI * 2
            }
            else
            {
                theArray[k + 0] = 5000
                theArray[k + 1] = 5000
                theArray[k + 2] = 5000
                theArray[k + 3] = 0
            }
        }
    }

    fillVelocityTexture(texture)
    {
        const theArray = texture.image.data
        const total = TEXTURE_WIDTH * TEXTURE_WIDTH

        for(let i = 0; i < total; i++)
        {
            const k = i * 4

            if(i < BIRD_COUNT)
            {
                const angle = Math.random() * Math.PI * 2
                const speed = 4 + Math.random() * 4

                theArray[k + 0] = Math.cos(angle) * speed
                theArray[k + 1] = (Math.random() - 0.5) * 2
                theArray[k + 2] = Math.sin(angle) * speed
                theArray[k + 3] = 1
            }
            else
            {
                theArray[k + 0] = 0
                theArray[k + 1] = 0
                theArray[k + 2] = 0
                theArray[k + 3] = 1
            }
        }
    }

    initMesh()
    {
        const geometry = new BirdGeometry(BIRD_COUNT, TEXTURE_WIDTH)

        this.birdUniforms = {
            color: { value: new THREE.Color('#2a2420') },
            texturePosition: { value: null },
            textureVelocity: { value: null },
            time: { value: 0 },
            delta: { value: 0 }
        }

        const material = new THREE.ShaderMaterial({
            uniforms: this.birdUniforms,
            vertexShader: birdVertexShader,
            fragmentShader: birdFragmentShader,
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true
        })

        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.rotation.y = Math.PI / 2
        this.mesh.matrixAutoUpdate = false
        this.mesh.updateMatrix()
        this.mesh.renderOrder = 5

        this.scene.add(this.mesh)
    }

    update()
    {
        const now = performance.now()
        let delta = (now - this.last) / 1000
        this.last = now

        if(delta > 1)
            delta = 1

        this.positionUniforms.time.value = now
        this.positionUniforms.delta.value = delta
        this.velocityUniforms.time.value = now
        this.velocityUniforms.delta.value = delta
        this.birdUniforms.time.value = now
        this.birdUniforms.delta.value = delta

        this.velocityUniforms.separationDistance.value = this.flockParams.separation
        this.velocityUniforms.alignmentDistance.value = this.flockParams.alignment
        this.velocityUniforms.cohesionDistance.value = this.flockParams.cohesion

        this.predator.copy(this.experience.camera.instance.position)
        this.predator.sub(FLOCK_CENTER)

        this.gpuCompute.compute()

        this.birdUniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(
            this.positionVariable
        ).texture
        this.birdUniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(
            this.velocityVariable
        ).texture
    }
}
