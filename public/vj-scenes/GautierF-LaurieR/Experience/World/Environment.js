import * as THREE from 'three'
import Experience from '../Experience.js'
import { createKickState, wasKicked } from '../Utils/audioReactive.js'
import { PERFORMANCE } from '../Utils/Performance.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.colors = {
            skyTop: '#0a1628',
            skyUpper: '#1a3a5c',
            skyMiddle: '#a84a30',
            skyLower: '#e88a4f',
            skyWarm: '#f4b86a',
            skyBottom: '#ffd9a8',
            horizon: '#c46852',
            sun: '#ffffff'
        }

        this.lights = {
            sunIntensity: 2,
            sunIntensityMin: 2,
            sunIntensityMax: 10,
            sunKickFlashDurationMs: 100
        }

        // 2e fond : noir + flash blanc 100 ms à chaque kick (si strobeEnabled)
        this.backgroundAnimation = {
            strobeEnabled: false,
            strobeFlashDurationMs: 100
        }
        this._strobeBlack = new THREE.Color('#000000')
        this._strobeWhite = new THREE.Color('#ffffff')
        this.kickState = createKickState()
        this._flashEndMs = 0
        this._sunFlashEndMs = 0
        this._shadowFrame = 0

        this.setSunsetSky()
        this.setSunLight()

        if(this.debug.active)
            this.setDebug()
    }

    setSunsetSky()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512

        this.skyCanvas = canvas
        this.skyContext = canvas.getContext('2d')
        this.skyTexture = new THREE.CanvasTexture(canvas)
        this.skyTexture.colorSpace = THREE.SRGBColorSpace

        this.horizonColor = new THREE.Color(this.colors.horizon)
        this.scene.background = this.skyTexture
        this.scene.fog = null

        this.updateSkyGradient()
        this.updateHorizonColor()
    }

    updateSkyGradient()
    {
        const gradient = this.skyContext.createLinearGradient(0, 0, 0, this.skyCanvas.height)

        gradient.addColorStop(0.0, this.colors.skyTop)
        gradient.addColorStop(0.3, this.colors.skyUpper)
        gradient.addColorStop(0.55, this.colors.skyMiddle)
        gradient.addColorStop(0.75, this.colors.skyLower)
        gradient.addColorStop(0.9, this.colors.skyWarm)
        gradient.addColorStop(1.0, this.colors.skyBottom)

        this.skyContext.fillStyle = gradient
        this.skyContext.fillRect(0, 0, this.skyCanvas.width, this.skyCanvas.height)
        this.skyTexture.needsUpdate = true
    }

    updateHorizonColor()
    {
        this.horizonColor.set(this.colors.horizon)

        if(this.experience.renderer?.instance)
            this.experience.renderer.instance.setClearColor(this.colors.horizon)
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight(this.colors.sun, this.lights.sunIntensity)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(PERFORMANCE.shadowMapSize, PERFORMANCE.shadowMapSize)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.shadow.autoUpdate = false
        this.sunLight.shadow.needsUpdate = true
        this.sunLight.position.set(-12, 4, -4)
        this.scene.add(this.sunLight)
    }

    updateShadowMap()
    {
        const interval = Math.max(1, PERFORMANCE.shadowUpdateInterval)

        this._shadowFrame++

        if(this._shadowFrame % interval === 0)
            this.sunLight.shadow.needsUpdate = true
    }

    restoreDefaultEnvironment()
    {
        this.backgroundAnimation.strobeEnabled = false
        this.scene.background = this.skyTexture
        this.scene.environment = null
        this.updateHorizonColor()
    }

    resetOnSceneEntry()
    {
        this._flashEndMs = 0
        this._sunFlashEndMs = 0
        this.kickState.prevKick = 0
        this.restoreDefaultEnvironment()
        this.applySunIntensityFromKick()
    }

    /** Passe au fond noir/blanc clignotant sur les kicks (après le saut du perso). */
    enableKickStrobe()
    {
        if(this.backgroundAnimation.strobeEnabled)
            return

        this.backgroundAnimation.strobeEnabled = true
        this._flashEndMs = 0
        this.applyStrobeColors(false)
    }

    applyStrobeColors(isWhite)
    {
        const color = isWhite ? this._strobeWhite : this._strobeBlack

        this.scene.background = color

        if(this.experience.renderer?.instance)
            this.experience.renderer.instance.setClearColor(color)
    }

    applySunIntensityFromKick()
    {
        const { sunIntensityMin, sunIntensityMax } = this.lights
        const inSunFlash = this.experience.time.elapsed < this._sunFlashEndMs
        const intensity = inSunFlash ? sunIntensityMax : sunIntensityMin

        this.lights.sunIntensity = intensity
        this.sunLight.intensity = intensity
    }

    update()
    {
        const audio = this.experience.audio
        const elapsed = this.experience.time.elapsed

        if ( wasKicked( audio, this.kickState ) )
        {
            this._sunFlashEndMs = elapsed + this.lights.sunKickFlashDurationMs

            if(this.backgroundAnimation.strobeEnabled)
                this._flashEndMs = elapsed + this.backgroundAnimation.strobeFlashDurationMs
        }

        this.applySunIntensityFromKick()
        this.updateShadowMap()

        if(!this.backgroundAnimation.strobeEnabled)
            return

        const inFlash = elapsed < this._flashEndMs
        this.applyStrobeColors(inFlash)
    }

    setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('environment')
        this.debugFolder.open()

        const skyFolder = this.debugFolder.addFolder('ciel (dégradé)')
        skyFolder.open()

        skyFolder.addColor(this.colors, 'skyTop').name('haut').onChange(() => this.updateSkyGradient())
        skyFolder.addColor(this.colors, 'skyUpper').name('haut-milieu').onChange(() => this.updateSkyGradient())
        skyFolder.addColor(this.colors, 'skyMiddle').name('milieu').onChange(() => this.updateSkyGradient())
        skyFolder.addColor(this.colors, 'skyLower').name('bas-milieu').onChange(() => this.updateSkyGradient())
        skyFolder.addColor(this.colors, 'skyWarm').name('chaud').onChange(() => this.updateSkyGradient())
        skyFolder.addColor(this.colors, 'skyBottom').name('bas').onChange(() => this.updateSkyGradient())
        skyFolder.addColor(this.colors, 'horizon').name('horizon (clear)').onChange(() => this.updateHorizonColor())

        const lightsFolder = this.debugFolder.addFolder('lumières')
        lightsFolder.open()

        lightsFolder
            .addColor(this.colors, 'sun')
            .name('soleil')
            .onChange(() =>
            {
                this.sunLight.color.set(this.colors.sun)
            })

        lightsFolder
            .add(this.lights, 'sunIntensityMin')
            .name('intensité soleil (repos)')
            .min(0)
            .max(10)
            .step(0.01)
            .onChange(() => this.applySunIntensityFromKick())

        lightsFolder
            .add(this.lights, 'sunIntensityMax')
            .name('intensité soleil (kick)')
            .min(0)
            .max(20)
            .step(0.01)
            .onChange(() => this.applySunIntensityFromKick())

        lightsFolder
            .add(this.lights, 'sunKickFlashDurationMs')
            .name('durée flash soleil (ms)')
            .min(10)
            .max(500)
            .step(1)

        const backgroundAnimFolder = this.debugFolder.addFolder('animation fond (kick)')
        backgroundAnimFolder.open()

        backgroundAnimFolder
            .add(this.backgroundAnimation, 'strobeEnabled')
            .name('clignotement noir/blanc')
            .onChange((value) =>
            {
                if(!value)
                    this.restoreDefaultEnvironment()
            })

        backgroundAnimFolder
            .add(this.backgroundAnimation, 'strobeFlashDurationMs')
            .name('durée flash blanc (ms)')
            .min(10)
            .max(500)
            .step(1)
    }
}
