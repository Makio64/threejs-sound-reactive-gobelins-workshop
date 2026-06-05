import { EFFECTS } from './effects/registry.js'
import ImageBackground from './ImageBackground.js'

export default class EffectSequencer {
    constructor(videoMesh, scene, { autoInterval = 5, kickThreshold = 0.6, maxImages = 5 } = {}) {
        this.videoMesh          = videoMesh
        this.scene              = scene
        this.index              = 0
        this.mode               = 'kick'
        this.autoInterval       = autoInterval
        this.kickThreshold      = kickThreshold
        this._elapsed           = 0
        this._kickWasHigh       = false

        this._transitioning      = false
        this._transitionTimer    = 0
        this._transitionDuration = 0.10
        this._glitchBurstValue   = 4.0

        this._kickCount      = 0
        this._nextThreshold  = this._randomIndex()

        // images
        this.maxImages   = maxImages
        this.images      = []       // ImageBackground[]
        this._frameCount = 0

        this.nbKicks = 0
    }

    // appelé depuis main.js après le load des chemins
    async loadImages(paths) {
        for (const path of paths) {
            const img = new ImageBackground(this.scene, path)
            await img.setMesh()
            if (img.mesh) img.mesh.visible = false
            this.images.push(img)
        }
    }

    _updateImages(audio) {
        if (!this.images.length) return

        const kick   = audio.kickHard ?? audio.kick ?? 0
        const volume = audio.volumeSmooth ?? 0
        const isHit  = kick > 0.5 || volume > 0.8

        if (!isHit) {
            return
        }
        this._imageKickWasHigh = true

        const visible = this.images.filter(i => i.mesh?.visible)
        const hidden  = this.images.filter(i => i.mesh && !i.mesh.visible)
        if (visible.length >= this.maxImages) {
            // max atteint : on retire une au hasard
            const pick = visible[Math.floor(Math.random() * visible.length)]
            pick.mesh.visible = false
        } 
        if (hidden.length) {
            // on en ajoute une
            const pick = hidden[Math.floor(Math.random() * hidden.length)]
            pick.mesh.visible = true
            pick.mesh.position.set(
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4,
                -1 + Math.random() * 1.5
            )
        }
    }

    _randomIndex() {
        return 1 + Math.floor(Math.random() * 3)
    }

    get current() {
        return EFFECTS[this.index]
    }

    setEffect(effectId) {
        const i = EFFECTS.findIndex((e) => e.id === effectId)
        if (i < 0) return
        this.index = i
        this.videoMesh.setEffect(effectId)
    }

    next() {
        if (this._transitioning) return
        this._transitioning   = true
        this._transitionTimer = 0
        this._pendingIndex    = (this.index + 1) % EFFECTS.length
    }

    prev() {
        if (this._transitioning) return
        this._transitioning   = true
        this._transitionTimer = 0
        this._pendingIndex    = (this.index - 1 + EFFECTS.length) % EFFECTS.length
    }

    update(audio, dt = 0.016) {
        if (this._transitioning) {
            this._transitionTimer += dt
            if (this.videoMesh.material?.uniforms?.u_glitchStrength) {
                this.videoMesh.material.uniforms.u_glitchStrength.value = this._glitchBurstValue
            }
            if (this._transitionTimer >= this._transitionDuration) {
                this.index = this._pendingIndex
                this.videoMesh.applyEffect(EFFECTS[this.index])
                this._transitioning = false
            }
            return
        }

        this._updateImages(audio)

        for (const img of this.images) {
            if (img.mesh?.visible) {
                img.update(audio, dt)
            }
        }

        if (this.mode === 'auto') {
            this._elapsed += dt
            if (this._elapsed >= this.autoInterval) {
                this._elapsed = 0
                this.next()
            }
        }

        if (this.mode === 'kick' && audio) {
            const kick = audio.kickHard ?? audio.kick ?? 0
            if (kick > 0.5 && !this._kickWasHigh) {
                this._kickCount++
                if (this._kickCount >= this._nextThreshold) {
                    this._kickCount    = 0
                    this._nextThreshold = this._randomIndex()
                    this.videoMesh.nextVideo()
                }
            }
            this._kickWasHigh = kick > 0.5
        }
    }
}