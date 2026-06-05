import { MathUtils } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import GlitchShader from './GlitchShader.js'

export default class Glitch
{
    constructor(composer)
    {
        this.composer = composer

        this.state = {
            curF: 0,
            randX: 300,
            wild: false
        }

        this.params = {
            enabled: true,
            minInterval: 240,
            maxInterval: 480,
            amount: 0.006,
            angle: 0,
            shiftX: 0
        }

        this.pass = new ShaderPass(GlitchShader)
        this.pass.enabled = this.params.enabled
        this.syncUniforms()
        this.composer.addPass(this.pass)
        this.regenerateTrigger()
    }

    syncUniforms()
    {
        const uniforms = this.pass.uniforms

        uniforms.amount.value = this.params.amount
        uniforms.angle.value = this.params.angle
        uniforms.shiftX.value = this.params.shiftX
    }

    regenerateTrigger()
    {
        const min = Math.min(this.params.minInterval, this.params.maxInterval)
        const max = Math.max(this.params.minInterval, this.params.maxInterval)

        this.state.randX = MathUtils.randInt(min, max)
    }

    update()
    {
        if(!this.pass.enabled)
            return

        const uniforms = this.pass.uniforms

        uniforms.byp.value = 0

        if(this.state.curF % this.state.randX === 0 || this.state.wild)
        {
            uniforms.amount.value = MathUtils.randFloat(0.008, 0.018)
            uniforms.angle.value = MathUtils.randFloat(-Math.PI, Math.PI)
            uniforms.shiftX.value = MathUtils.randFloat(-0.015, 0.015)
            this.state.curF = 0
            this.regenerateTrigger()
        }
        else if(this.state.curF % this.state.randX < this.state.randX / 5)
        {
            uniforms.amount.value = MathUtils.randFloat(0.003, 0.008)
            uniforms.angle.value = MathUtils.randFloat(-0.5, 0.5)
            uniforms.shiftX.value = MathUtils.randFloat(-0.006, 0.006)
        }
        else if(!this.state.wild)
        {
            uniforms.byp.value = 1
            this.syncUniforms()
        }

        this.state.curF++
    }

    setDebug(folder)
    {
        folder
            .add(this.params, 'enabled')
            .name('glitch')
            .onChange((value) =>
            {
                this.pass.enabled = value
            })

        const glitchFolder = folder.addFolder('glitch')
        glitchFolder.open()

        glitchFolder
            .add(this.state, 'wild')
            .name('wild (continu)')

        glitchFolder
            .add(this.params, 'minInterval')
            .name('intervalle min (frames)')
            .min(1)
            .max(600)
            .step(1)
            .onChange(() => this.regenerateTrigger())

        glitchFolder
            .add(this.params, 'maxInterval')
            .name('intervalle max (frames)')
            .min(1)
            .max(600)
            .step(1)
            .onChange(() => this.regenerateTrigger())

        glitchFolder
            .add(this.params, 'amount')
            .name('aberration')
            .min(0)
            .max(0.03)
            .step(0.001)
            .onChange(() => this.syncUniforms())

        glitchFolder
            .add(this.params, 'angle')
            .name('angle')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.01)
            .onChange(() => this.syncUniforms())

        glitchFolder
            .add(this.params, 'shiftX')
            .name('décalage X')
            .min(-0.05)
            .max(0.05)
            .step(0.001)
            .onChange(() => this.syncUniforms())
    }
}
