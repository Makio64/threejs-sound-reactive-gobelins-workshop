import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import RadialBlurShader from './RadialBlurShader.js'
import { PERFORMANCE } from '../Utils/Performance.js'
import { createKickState, wasKicked } from '../Utils/audioReactive.js'

export default class RadialBlur
{
    constructor(composer, experience)
    {
        this.composer = composer
        this.experience = experience

        this.params = {
            enabled: false,
            centerX: 0.7,
            centerY: 0.45,
            strength: 0.3,
            decay: 0.3,
            weight: 0.1,
            exposure: 4.3,
            samples: PERFORMANCE.radialBlurSamples
        }

        this.kickAnimation = {
            enabled: true,
            flashDurationMs: 100
        }

        this.kickState = createKickState()
        this._flashEndMs = 0

        this.pass = new ShaderPass(RadialBlurShader)
        this.pass.enabled = false
        this.pass.uniforms.center.value.set(
            this.params.centerX,
            this.params.centerY
        )
        this.pass.uniforms.strength.value = this.params.strength
        this.pass.uniforms.decay.value = this.params.decay
        this.pass.uniforms.weight.value = this.params.weight
        this.pass.uniforms.exposure.value = this.params.exposure
        this.pass.uniforms.samples.value = this.params.samples
        this.composer.addPass(this.pass)
    }

    resetOnSceneEntry()
    {
        this._flashEndMs = 0
        this.kickState.prevKick = 0
        this.applyPassEnabled()
    }

    applyPassEnabled()
    {
        if(!this.experience?.time)
        {
            this.pass.enabled = this.params.enabled
            return
        }

        const inKickFlash = this.experience.time.elapsed < this._flashEndMs
        const active = this.params.enabled || (this.kickAnimation.enabled && inKickFlash)

        this.pass.enabled = active
    }

    update()
    {
        if(!this.experience?.time)
        {
            this.applyPassEnabled()
            return
        }

        if(this.kickAnimation.enabled)
        {
            const audio = this.experience.audio

            if ( wasKicked( audio, this.kickState ) )
                this._flashEndMs = this.experience.time.elapsed + this.kickAnimation.flashDurationMs
        }

        this.applyPassEnabled()
    }

    setDebug(folder)
    {
        const kickFolder = folder.addFolder('radial blur (kick)')
        kickFolder.open()

        kickFolder
            .add(this.kickAnimation, 'enabled')
            .name('activer sur kick')
            .onChange(() => this.applyPassEnabled())

        kickFolder
            .add(this.kickAnimation, 'flashDurationMs')
            .name('durée (ms)')
            .min(10)
            .max(500)
            .step(1)

        folder
            .add(this.params, 'enabled')
            .name('radial blur (toujours)')
            .onChange(() => this.applyPassEnabled())

        folder
            .add(this.params, 'centerX', 0, 1, 0.01)
            .name('blur centerX')
            .onChange((value) =>
            {
                this.pass.uniforms.center.value.x = value
            })

        folder
            .add(this.params, 'centerY', 0, 1, 0.01)
            .name('blur centerY')
            .onChange((value) =>
            {
                this.pass.uniforms.center.value.y = value
            })

        folder
            .add(this.params, 'strength', 0, 0.5, 0.001)
            .name('blur strength')
            .onChange((value) =>
            {
                this.pass.uniforms.strength.value = value
            })

        folder
            .add(this.params, 'decay', 0, 1, 0.01)
            .name('blur decay')
            .onChange((value) =>
            {
                this.pass.uniforms.decay.value = value
            })

        folder
            .add(this.params, 'weight', 0, 1, 0.01)
            .name('blur weight')
            .onChange((value) =>
            {
                this.pass.uniforms.weight.value = value
            })

        folder
            .add(this.params, 'exposure', 0.5, 10, 0.1)
            .name('blur exposure')
            .onChange((value) =>
            {
                this.pass.uniforms.exposure.value = value
            })

        folder
            .add(this.params, 'samples', 8, 64, 1)
            .name('blur samples')
            .onChange((value) =>
            {
                this.pass.uniforms.samples.value = Math.floor(value)
            })
    }
}
