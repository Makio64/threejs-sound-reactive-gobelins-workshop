import * as THREE from 'three'
import Analyzer from '/sounds/Analyzer.js'

class TemplateScene {

	constructor( audio ) {
		this.audio = audio
		this.renderer = null
		this.scene = null
		this.camera = null
		this.mesh = null
		this.mat = null
	}

	async load() {
		// No external assets to load in template
	}

	init() {
		this.renderer = new THREE.WebGLRenderer( { antialias: true } )
		this.renderer.setPixelRatio( Math.min( devicePixelRatio, 2 ) )
		this.renderer.setSize( innerWidth, innerHeight )
		document.body.appendChild( this.renderer.domElement )
		
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera( 50, innerWidth / innerHeight, 0.1, 100 )
		this.camera.position.z = 3.4
		
		this.mat = new THREE.MeshStandardMaterial( { color: 0x151515, roughness: 0.3, metalness: 0.6 } )
		this.mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 1, 8 ), this.mat )
		this.scene.add( this.mesh, new THREE.AmbientLight( 0x222222, 1.2 ) )
		
		const key = new THREE.DirectionalLight( 0xffffff, 2.5 )
		key.position.set( 3, 4, 5 )
		this.scene.add( key )
		
		addEventListener( 'resize', () => {
			if ( ! this.camera || ! this.renderer ) return
			this.camera.aspect = innerWidth / innerHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize( innerWidth, innerHeight )
		} )
	}

	warmup() {
		this.renderer.render( this.scene, this.camera )
	}

	play() {
		this.renderer.setAnimationLoop( ( t ) => this.update( t ) )
	}

	stop() {
		this.renderer.setAnimationLoop( null )
	}

	update( t ) {
		const a = this.audio // ← volume · volumeSmooth · kick · volumeByFrequency
		this.mesh.rotation.y = t * 0.0003
		this.mesh.rotation.x = t * 0.00012
		this.mesh.scale.setScalar( 1 + a.volume * 0.5 + a.kick * 0.3 )
		this.mat.emissive.setRGB( a.kick * 0.8, a.kick * 0.8, a.kick * 0.8 )
		this.renderer.render( this.scene, this.camera )
	}

}

const audio = new Analyzer()
const scene = new TemplateScene( audio )

audio.onLoad( async () => {
	await scene.load()
	scene.init()
} )
audio.onWarmup( () => scene.warmup() )
audio.onPlay( () => scene.play() )
audio.onStop( () => scene.stop() )
