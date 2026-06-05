import Analyzer from '/sounds/Analyzer.js'
import Experience from './Experience/Experience.js'
import Resources from './Experience/Utils/Resources.js'
import sources from './Experience/sources.js'

/** Frames de rendu pendant le preload (shaders / post-process avant l’iris). */
async function primeGpu( experience, frames = 6 ) {
    for ( let i = 0; i < frames; i++ ) {
        experience.renderer.update()
        await new Promise( ( resolve ) => requestAnimationFrame( resolve ) )
    }
}

class TemplateScene {

    constructor( audio ) {
        this.audio = audio
        this.experience = null
        this.resources = null
        this.prepared = false
    }

    async load() {
        try {
            this.resources = await Resources.preload( sources )
        } catch ( err ) {
            console.error( '[GautierF-LaurieR] preload failed', err )
            this.resources = null
        }
    }

    init() {
        const canvas = document.createElement( 'canvas' )
        document.body.appendChild( canvas )
        this.experience = new Experience( canvas, this.resources )
        this.experience.audio = this.audio
    }

    async prepare() {
        if ( this.prepared || ! this.experience ) return
        await primeGpu( this.experience )
        this.prepared = true
    }

    warmup() {
        this.experience?.renderer?.update()
    }

    play() {
        if ( ! this.experience ) this.init()
        else this.experience.world?.resetOnSceneEntry?.()

        this.experience.play()
    }

    /** Pause seulement — monde conservé pour transition depuis le preload host. */
    stop() {
        this.experience?.stop()
    }
}

const audio = new Analyzer()
const scene = new TemplateScene( audio )

audio.onLoad(async () => {
    await scene.load()
    scene.init()
    await scene.prepare()
})

audio.onWarmup( () => scene.warmup() )
audio.onPlay( () => scene.play() )
audio.onStop( () => scene.stop() )


