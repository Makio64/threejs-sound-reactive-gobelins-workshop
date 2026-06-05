import * as THREE from 'three'
import Experience from './Experience.js'
import PostProcess from './PostProcess.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug

        this.setInstance()
        this.postProcess = new PostProcess(
            this.instance,
            this.scene,
            this.camera,
            this.sizes,
            this.debug,
            this.experience
        )
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: false,
            powerPreference: 'high-performance'
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFShadowMap
        this.instance.setClearColor('#c46852')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.postProcess.update()
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.postProcess.resize()
    }

    destroy()
    {
        this.postProcess.composer?.dispose()
        this.instance.dispose()
        this.instance.forceContextLoss?.()
    }
}