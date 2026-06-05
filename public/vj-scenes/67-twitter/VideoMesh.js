import * as THREE from 'three'
import { getEffect, getVideo, VIDEOS } from './effects/registry.js'

function createBaseUniforms() {
    return {
        u_tex: { value: null },
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(1, 1) },
        u_count: { value: 0 },
        u_volume: { value: 1.0 },

        // blocsFragmentation
        u_stretch: { value: 1.0 },
        // luminanceGlitch
        u_glitchStrength: { value: 0.0 },
    }
}

export default class VideoMesh {
    constructor({ speed = 0.4, kickBurst = 0.4 } = {}) {
        this.mesh         = null
        this.material     = null
        this.currentScale = 1.0
        this.squareCount  = 0
        this.kickWasHigh  = false
        this.speed        = speed
        this.kickBurst    = kickBurst
        this.effectId     = null
        this.videoId      = null
        this._videoIndex  = 0

        this.stretchParams = {
            stretchBass: 2.8,
            stretchMid: 0.6,
            stretchKick: 1.2,
            stretchBase: 1.0,
            stretchSmooth: 0.18,
            bassBinStart: 2,
            bassBinEnd: 18,
            midBinStart: 18,
            midBinEnd: 55,
            volumeSmooth: 1.,
        }
        this._stretchCurrent = 1
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

    _resolveVideo(videoIdOrPath) {
        if (typeof videoIdOrPath !== 'string') return VIDEOS[0]
        if (videoIdOrPath.includes('/')) return { id: null, path: videoIdOrPath }
        return getVideo(videoIdOrPath)
    }

    applyEffect(effect) {
        if (!this.material || !effect) return
        this.material.vertexShader   = effect.vertexShader
        this.material.fragmentShader = effect.fragmentShader
        this.material.needsUpdate    = true
        this.effectId = effect.id
    }

    setEffect(effectId) {
        this.applyEffect(getEffect(effectId))
    }

    _setResolutionFromTexture(texture) {
        const img = texture?.image
        if (!img) return
        const w = img.videoWidth  || 1
        const h = img.videoHeight || 1
        this.material.uniforms.u_resolution.value.set(w, h)
    }

    _disposeTexture(texture) {
        if (!texture) return
        texture.image?.pause?.()
        texture.dispose()
    }

    async setVideo(videoIdOrPath) {
        const entry = this._resolveVideo(videoIdOrPath)
        let texture
        try {
            texture = await this.loadTexture(entry.path)
        } catch (err) {
            console.error('[VideoMesh]', entry.id ?? entry.path, err.message)
            throw err
        }

        if (this.material) {
            this._disposeTexture(this.material.uniforms.u_tex.value)
            this.material.uniforms.u_tex.value = texture
            this._setResolutionFromTexture(texture)
        }

        this.videoId = entry.id
        if (entry.id) {
            const i = VIDEOS.findIndex((v) => v.id === entry.id)
            if (i >= 0) this._videoIndex = i
        }
        return texture
    }

    async nextVideo() {
        this._videoIndex = (this._videoIndex + 1) % VIDEOS.length
        await this.setVideo(VIDEOS[this._videoIndex].id)
    }

    async build(videoIdOrPath = VIDEOS[0].id, effectId = 'luminanceGlitch') {
        const entry  = this._resolveVideo(videoIdOrPath)
        const effect = getEffect(effectId)
        const texture = await this.loadTexture(entry.path)

        this.material = new THREE.ShaderMaterial({
            uniforms: createBaseUniforms(),
            vertexShader: effect.vertexShader,
            fragmentShader: effect.fragmentShader,
        })
        this.material.uniforms.u_tex.value = texture
        this._setResolutionFromTexture(texture)
        this.effectId = effect.id
        this.videoId  = entry.id

        const i = VIDEOS.findIndex((v) => v.path === entry.path)
        if (i >= 0) this._videoIndex = i

        const geometry = new THREE.PlaneGeometry(1, 1)
        this.mesh = new THREE.Mesh(geometry, this.material)
        this.mesh.position.set(0, 0, -3)
        return this.mesh
    }

    fitToScreen(camera) {
        if (!this.mesh) return

        const distance = Math.abs(camera.position.z - this.mesh.position.z)
        const vFov = THREE.MathUtils.degToRad(camera.fov)
        const height = 2 * Math.tan(vFov / 2) * distance
        const width  = height * camera.aspect
        console.log(this.mesh.position)
        this.mesh.scale.set(width, height, 1)
    }

    updateStretch(audio) {
        const p = this.stretchParams
        const freq = audio.volumeByFrequency
        const bass = this.moy(freq, p.bassBinStart, p.bassBinEnd)
        const mid  = this.moy(freq, p.midBinStart, p.midBinEnd)
        const kick = audio.kick ?? 0

        const target =
            p.stretchBase +
            bass * p.stretchBass +
            mid  * p.stretchMid +
            kick * p.stretchKick

        this._stretchCurrent += (target - this._stretchCurrent) * p.stretchSmooth
        return this._stretchCurrent
    }

    moy(array, start, end) {
        let sum = 0
        let count = 0
        for (let i = start; i <= end; i++) {
            sum += array[i] ?? 0
            count++
        }
        return count > 0 ? sum / count : 0
    }

    update(audio, dt = 0.016) {
        if (!this.material) return

        const kick   = audio.kick         ?? 0
        const volume = audio.volumeSmooth ?? 0

        this.squareCount += volume * this.speed * dt * 60

        if (kick > 0.5 && !this.kickWasHigh) {
            this.squareCount += this.kickBurst
        }
        this.kickWasHigh = kick > 0.5

        this.squareCount = Math.min(this.squareCount, 128)

        this.material.uniforms.u_count.value = this.squareCount
        this.material.uniforms.u_time.value  = performance.now() / 1000
        this.material.uniforms.u_volume.value = volume

        const stretch = this.updateStretch(audio)

        this.material.uniforms.u_stretch.value = stretch * volume
        this.material.uniforms.u_glitchStrength.value = volume * (this.stretchParams.volumeSmooth + kick * 4) * stretch
    }
}
