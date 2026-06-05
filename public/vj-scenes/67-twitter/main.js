import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';
import * as postprocessing from 'https://cdn.jsdelivr.net/npm/postprocessing@6.39.1/+esm'

import Analyzer from '/sounds/Analyzer.js'
import VideoMesh from './VideoMesh.js'
import CameraController from './CameraController.js'
import EffectSequencer from './EffectSequencer.js'
import ImageBackground from './ImageBackground.js'
import { EFFECTS, VIDEOS, BACKGROUND_VIDEOS } from './effects/registry.js'

/**
	Voici tous les paramètres audio disponibles dans l'objet `audio` que vous pouvez utiliser pour rendre votre scène réactive au son :
    
	volume: 0,
	volumeSmooth: 0,
	kick: 0,
	kickEnergy: 0,
	kickThreshold: 0,
	kickHard: 0,
	kickHardEnergy: 0,
	kickHardThreshold: 0,
	volumeByFrequency: this.volumeByFrequency
 */


class VJburningBabylone {
    constructor( audio ) {
		// debug
        this.debug    = new GUI()
		this.stats = new Stats()
		document.body.appendChild( this.stats.dom )

        this.audio    = audio
        this.renderer = null
        this.scene    = null
        this.camera   = null

        this.videoMesh  = new VideoMesh()
        this.sequencer  = new EffectSequencer( this.videoMesh, null )
        this.camCtrl    = null
    }

    async load() {
        try {
            await this.videoMesh.build( 'aled', 'luminanceGlitch' )
        } catch ( err ) {
            console.error( 'Failed to load video', err )
        }
    }

    async init() {
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
            depth: false
        });
        this.renderer.setPixelRatio( Math.min( devicePixelRatio, 2 ) )
        this.renderer.setSize( innerWidth, innerHeight )
        document.body.appendChild( this.renderer.domElement )

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0xffffff )

        this.camera = new THREE.PerspectiveCamera( 42, innerWidth / innerHeight, 0.1, 25 )
        this.camera.position.set( 0, 0, 5.5 )
        this.camCtrl = new CameraController( this.camera )
		
        // Video background mesh
		this.videoMesh.fitToScreen(this.camera)
        this.scene.add( this.videoMesh.mesh )

        // sequencer d'images background 
        this.sequencer.scene = this.scene

        // dans load(), après videoMesh.build()
        await this.sequencer.loadImages([
            BACKGROUND_VIDEOS[0].path,
            BACKGROUND_VIDEOS[1].path,
            BACKGROUND_VIDEOS[2].path,
            BACKGROUND_VIDEOS[3].path,
            BACKGROUND_VIDEOS[4].path,
            BACKGROUND_VIDEOS[5].path,
        ])

        // Lighting
        this.scene.add( new THREE.AmbientLight( 0x050505 ) )
        const mainLight = new THREE.DirectionalLight( 0xffffff, 2.5 )
        mainLight.position.set( 2, 4, 3 )
        this.scene.add( mainLight )


        // debug
        this._setupDebug()

        // postprocessing
        this.postprocessing()

        addEventListener( 'resize', () => this.handleResize() )
    }

    postprocessing() {
        this.composer = new postprocessing.EffectComposer(this.renderer);
        this.composer.addPass(new postprocessing.RenderPass(this.scene, this.camera));

        this.composer.addPass(new postprocessing.EffectPass(
            this.camera,
            new postprocessing.VignetteEffect({}),
        ));
        this.colordepth =new postprocessing.ColorDepthEffect({
            bits: 2,
        }),
        this.composer.addPass(new postprocessing.EffectPass(
            this.camera,
            this.colordepth
        ));
    }

    _setupDebug() {
        const fx = { effect: this.sequencer.current.id, mode: this.sequencer.mode }
        const media = { video: this.videoMesh.videoId ?? VIDEOS[0].id }

        // général
        this.debug.add( fx, 'effect', EFFECTS.map( ( e ) => e.id ) )
            .name( 'Effet' )
            .onChange( ( id ) => this.sequencer.setEffect( id ) )

        this.debug.add( fx, 'mode', [ 'manual', 'auto', 'kick' ] )
            .name( 'Mode effet' )
            .onChange( ( m ) => { this.sequencer.mode = m } )

        this.debug.add( this.sequencer, 'autoInterval', 2, 30, 0.5 )
            .name( 'Intervalle auto (s)' )

        this.debug.add( media, 'video', VIDEOS.map( ( v ) => v.id ) )
            .name( 'Vidéo' )
            .onChange( ( id ) => this.videoMesh.setVideo( id ).catch( console.error ) )


        // stretch params
        const sp = this.videoMesh.stretchParams
        const folder = this.debug.addFolder('Stretch')
        folder.add(sp, 'stretchBass', 0, 6, 0.05)
        folder.add(sp, 'stretchMid', 0, 3, 0.05)
        folder.add(sp, 'stretchKick', 0, 3, 0.05)
        folder.add(sp, 'stretchSmooth', 0.01, 1, 0.01)
        folder.add(sp, 'bassBinStart', 0, 128, 1)
        folder.add(sp, 'bassBinEnd', 0, 128, 1)
        folder.add(sp, 'volumeSmooth', 0, 5, 0.1)
        // idem midBinStart / midBinEnd
        folder.add(this.videoMesh, '_stretchCurrent', 1, 10).listen() // lecture seule
    }

    handleResize() {
        if ( !this.camera || !this.renderer ) return
        this.camera.aspect = innerWidth / innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( innerWidth, innerHeight )

		this.videoMesh.fitToScreen(this.camera)
    }

    warmup() { this.renderer.render( this.scene, this.camera ) }
    play()   { this.renderer.setAnimationLoop( ( t ) => this.update( t ) ) }
    stop()   { this.renderer.setAnimationLoop( null ) }

    update( t ) {
        if ( !this.composer ) return
        const a = this.audio
        const dt = 0.016

		// debug
		this.stats.update()
        a.update()

        this.videoMesh.update( a, dt )
        this.sequencer.update( a, dt )

        const flash = ( a.kickHard ?? 0 ) * 0.25 + ( a.kick ?? 0 ) * 0.08
        this.renderer.setClearColor( new THREE.Color( flash, flash, flash ), 1.0 )

        this.camCtrl.update( t, a, this.videoMesh.mesh.position )

        if (this.effectId === 'blocsFragmentation') {
            this.material.uniforms.u_stretch.value = this.updateStretch(audio)
        } else if (this.effectId === 'luminanceGlitch') {
            const volume = a.volume ?? 0
            this.material.uniforms.u_glitchStrength.value = volume * this.videoMesh.stretchParams.volumeSmooth
        }

        // update colordepth with volume for a posterization effect
        if (this.colordepth) {
            const bits = Math.max(2, 32 - (a.volume ?? 0) * 40)
            this.colordepth.setBitDepth(bits)
        }

        this.composer.render()
    }
}

const audio = new Analyzer()
const scene = new VJburningBabylone( audio )

audio.onLoad( async () => { await scene.load(); await scene.init() } )
audio.onWarmup( () => scene.warmup() )
audio.onPlay(   () => scene.play() )
audio.onStop(   () => scene.stop() )
