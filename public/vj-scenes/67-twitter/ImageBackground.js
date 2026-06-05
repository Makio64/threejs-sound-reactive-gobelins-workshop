import * as THREE from 'three'
import { fragmentShader_imageBackground, vertexShader_imageBackground } from './shaders/imageBackground/imageBackground.js'

export default class ImageBackground {
    constructor(scene, path) {
        this.scene = scene; 
        this.mesh = null  
        this.path = path

        this.setMesh()
    }

    _mediaUrl(path) {
        return new URL(path, window.location.href).href
    }

    async loadTexture(path) {
        const url = this._mediaUrl(path)
        const video = document.createElement('video')
        video.src         = url
        video.loop        = true
        video.muted       = true
        video.playsInline = true
        video.preload     = 'auto'

        await new Promise((resolve, reject) => {
            video.addEventListener('loadeddata', resolve, { once: true })
            video.addEventListener('error', () => {
                reject(new Error(`Vidéo introuvable: ${url}`))
            }, { once: true })
        })
        await video.play()

        const texture = new THREE.VideoTexture(video)
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    }

    async setMesh() {
        const texture = await this.loadTexture(this.path)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_tex: { value: texture },
                u_volume: { value: 0 },
            },
            vertexShader: vertexShader_imageBackground,
            fragmentShader: fragmentShader_imageBackground
        })
        const geometry = new THREE.PlaneGeometry(4/2.5, 3/2.5)
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(0, 0, -1)
        this.mesh.visible = false
        this.mesh.frustumCulled = false
        this.scene.add(this.mesh)
    }
    
    update(audio, dt) {
        if (!this.mesh) return
        const volume = audio.volume ?? 0
        this.mesh.material.uniforms.u_volume.value = volume
    }

    dispose () {
        if (this.mesh) {
            this.mesh.geometry.dispose()
            this.mesh.material.dispose()
            this.scene.remove(this.mesh)
            this.mesh = null
        }
    }
}
