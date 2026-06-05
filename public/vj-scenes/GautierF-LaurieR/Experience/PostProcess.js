import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { PERFORMANCE } from './Utils/Performance.js'
import Glitch from './postProcess/Glitch.js'
import RgbShift from './postProcess/RgbShift.js'
import RadialBlur from './postProcess/RadialBlur.js'
import Vignette from './postProcess/Vignette.js'

export default class PostProcess
{
    constructor(renderer, scene, camera, sizes, debug, experience)
    {
        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.sizes = sizes
        this.debug = debug
        this.experience = experience

        this.enabled = true

        this.composer = new EffectComposer(this.renderer)

        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.composer.addPass(this.renderPass)

        this.glitch = new Glitch(this.composer)
        this.rgbShift = new RgbShift(this.composer)
        this.radialBlur = new RadialBlur(this.composer, this.experience)
        this.vignette = new Vignette(this.composer)

        this.outputPass = new OutputPass()
        this.composer.addPass(this.outputPass)

        this.setDebug()
    }

    setDebug()
    {
        if(!this.debug.active)
            return

        this.debugFolder = this.debug.ui.addFolder('postprocess')
        this.debugFolder.add(this, 'enabled').name('activer')

        this.glitch.setDebug(this.debugFolder)
        this.rgbShift.setDebug(this.debugFolder)
        this.radialBlur.setDebug(this.debugFolder)
        this.vignette.setDebug(this.debugFolder)
    }

    resize()
    {
        this.composer.setSize(this.sizes.width, this.sizes.height)
        this.composer.setPixelRatio(
            this.sizes.pixelRatio * PERFORMANCE.postProcessPixelScale
        )
    }

    update()
    {
        if(this.enabled)
        {
            this.glitch.update()
            this.radialBlur.update()
        }

        if(this.enabled)
            this.composer.render()
        else
            this.renderer.render(this.scene, this.camera.instance)
    }
}
