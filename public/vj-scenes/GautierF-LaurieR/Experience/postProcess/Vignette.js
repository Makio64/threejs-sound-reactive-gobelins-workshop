import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js'

export default class Vignette
{
    constructor(composer)
    {
        this.composer = composer

        this.params = {
            enabled: true,
            offset: 1.2,
            darkness: 1.2
        }

        this.pass = new ShaderPass(VignetteShader)
        this.pass.enabled = this.params.enabled
        this.pass.uniforms.offset.value = this.params.offset
        this.pass.uniforms.darkness.value = this.params.darkness
        this.composer.addPass(this.pass)
    }

    setDebug(folder)
    {
        folder
            .add(this.params, 'enabled')
            .name('vignette')
            .onChange((value) =>
            {
                this.pass.enabled = value
            })

        folder
            .add(this.params, 'offset', 0, 3, 0.01)
            .name('vignette offset')
            .onChange((value) =>
            {
                this.pass.uniforms.offset.value = value
            })

        folder
            .add(this.params, 'darkness', 0, 3, 0.01)
            .name('vignette darkness')
            .onChange((value) =>
            {
                this.pass.uniforms.darkness.value = value
            })
    }
}
