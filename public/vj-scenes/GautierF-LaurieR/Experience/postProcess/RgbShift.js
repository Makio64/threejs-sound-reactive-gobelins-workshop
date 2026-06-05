import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { PERFORMANCE } from '../Utils/Performance.js'

export default class RgbShift
{
    constructor(composer)
    {
        this.composer = composer

        this.params = {
            enabled: PERFORMANCE.rgbShiftEnabled,
            amount: 0.003,
            angle: 0
        }

        this.pass = new ShaderPass(RGBShiftShader)
        this.pass.enabled = this.params.enabled
        this.pass.uniforms.amount.value = this.params.amount
        this.pass.uniforms.angle.value = this.params.angle
        this.composer.addPass(this.pass)
    }

    setDebug(folder)
    {
        folder
            .add(this.params, 'enabled')
            .name('rgb shift')
            .onChange((value) =>
            {
                this.pass.enabled = value
            })

        folder
            .add(this.params, 'amount', 0, 0.02, 0.0001)
            .name('rgb amount')
            .onChange((value) =>
            {
                this.pass.uniforms.amount.value = value
            })

        folder
            .add(this.params, 'angle', 0, Math.PI * 2, 0.01)
            .name('rgb angle')
            .onChange((value) =>
            {
                this.pass.uniforms.angle.value = value
            })
    }
}
