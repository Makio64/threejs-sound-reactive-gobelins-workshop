import * as THREE from 'three'
import Analyzer from '/sounds/Analyzer.js'

class SpectrumLandscapeScene {

	constructor( audio ) {
		this.audio = audio
		this.renderer = null
		this.scene = null
		this.camera = null
		
		this.gridGeom = null
		this.gridPosAttr = null
		this.topGridGeom = null
		this.topGridPosAttr = null
		
		this.meshOuter = null
		this.meshMiddle = null
		this.starsGeom = null
		this.starsPosAttr = null
		this.pulseLight = null

		this.COLS = 48
		this.ROWS = 48
		this.heights = Array.from( { length: this.ROWS }, () => new Float32Array( this.COLS ) )

		this.starCount = 300
		this.starPositions = new Float32Array( this.starCount * 3 )
	}

	async load() {
		// No external assets to load in spectrum-land
	}

	init() {
		this.renderer = new THREE.WebGLRenderer( { antialias: true } )
		this.renderer.setPixelRatio( Math.min( devicePixelRatio, 2 ) )
		this.renderer.setSize( innerWidth, innerHeight )
		document.body.appendChild( this.renderer.domElement )

		this.scene = new THREE.Scene()
		this.scene.fog = new THREE.FogExp2( 0x000000, 0.12 )

		this.camera = new THREE.PerspectiveCamera( 42, innerWidth / innerHeight, 0.1, 25 )
		this.camera.position.set( 0, 0, 5.5 )

		// Create mirrored grids for bottom & top landscape
		this.gridGeom = new THREE.PlaneGeometry( 14, 10, this.COLS - 1, this.ROWS - 1 )
		this.gridGeom.rotateX( - Math.PI / 2 )
		this.gridPosAttr = this.gridGeom.attributes.position

		this.topGridGeom = new THREE.PlaneGeometry( 14, 10, this.COLS - 1, this.ROWS - 1 )
		this.topGridGeom.rotateX( Math.PI / 2 )
		this.topGridPosAttr = this.topGridGeom.attributes.position

		const gridMat = new THREE.MeshStandardMaterial( { color: 0x333333, wireframe: true, roughness: 0.8 } )

		const bottomMesh = new THREE.Mesh( this.gridGeom, gridMat )
		bottomMesh.position.y = - 1.5
		this.scene.add( bottomMesh )

		const topMesh = new THREE.Mesh( this.topGridGeom, gridMat )
		topMesh.position.y = 1.5
		this.scene.add( topMesh )

		// Concentric reactive inner shapes
		const matOuter = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
		const matMiddle = new THREE.MeshBasicMaterial( { color: 0x666666, wireframe: true } )

		this.meshOuter = new THREE.Mesh( new THREE.IcosahedronGeometry( 1.1, 2 ), matOuter )
		this.meshMiddle = new THREE.Mesh( new THREE.OctahedronGeometry( 0.75, 1 ), matMiddle )

		this.scene.add( this.meshOuter )
		this.scene.add( this.meshMiddle )

		// Starfield/particle tunnel
		this.starsGeom = new THREE.BufferGeometry()
		for ( let i = 0; i < this.starCount; i ++ ) {
			this.starPositions[ i * 3 ] = ( Math.random() - 0.5 ) * 12
			this.starPositions[ i * 3 + 1 ] = ( Math.random() - 0.5 ) * 8
			this.starPositions[ i * 3 + 2 ] = Math.random() * 20 - 15
		}
		this.starsGeom.setAttribute( 'position', new THREE.BufferAttribute( this.starPositions, 3 ) )
		this.starsPosAttr = this.starsGeom.attributes.position

		const starsMat = new THREE.PointsMaterial( { color: 0xffffff, size: 0.018, sizeAttenuation: true } )
		const starfield = new THREE.Points( this.starsGeom, starsMat )
		this.scene.add( starfield )

		// Lighting
		this.scene.add( new THREE.AmbientLight( 0x050505 ) )
		const mainLight = new THREE.DirectionalLight( 0xffffff, 2.5 )
		mainLight.position.set( 2, 4, 3 )
		this.scene.add( mainLight )

		this.pulseLight = new THREE.PointLight( 0xffffff, 0, 8 )
		this.pulseLight.position.set( 0, 0, 0 )
		this.scene.add( this.pulseLight )

		addEventListener( 'resize', () => this.handleResize() )
	}

	handleResize() {
		if ( ! this.camera || ! this.renderer ) return
		this.camera.aspect = innerWidth / innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize( innerWidth, innerHeight )
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
		const a = this.audio
		const f = a.volumeByFrequency ?? new Float32Array( 256 )

		// 1. Shift heightmap history
		for ( let r = this.ROWS - 1; r > 0; r -- ) {
			this.heights[ r ].set( this.heights[ r - 1 ] )
		}

		// 2. Populate front row using mirrored spectrum
		const half = this.COLS / 2
		for ( let c = 0; c < this.COLS; c ++ ) {
			const distFromCenter = Math.abs( c - half ) / half
			const binIdx = Math.min( f.length - 1, Math.floor( ( 1.0 - distFromCenter ) * f.length * 0.45 ) )
			const val = f[ binIdx ] ?? 0
			this.heights[ 0 ][ c ] = Math.pow( val, 2.2 ) * 1.5
		}

		// 3. Update bottom & top geometries
		for ( let r = 0; r < this.ROWS; r ++ ) {
			for ( let c = 0; c < this.COLS; c ++ ) {
				const idx = r * this.COLS + c
				const h = this.heights[ r ][ c ] * ( 1.0 + ( a.kick ?? 0 ) * 0.5 )
				this.gridPosAttr.setY( idx, h )
				this.topGridPosAttr.setY( idx, - h )
			}
		}
		this.gridPosAttr.needsUpdate = true
		this.topGridPosAttr.needsUpdate = true

		// 4. Particle tunnel movement
		const pArr = this.starsPosAttr.array
		const speed = 0.03 + ( a.volumeSmooth ?? 0 ) * 0.15
		for ( let i = 0; i < this.starCount; i ++ ) {
			pArr[ i * 3 + 2 ] += speed
			if ( pArr[ i * 3 + 2 ] > 4.0 ) {
				pArr[ i * 3 ] = ( Math.random() - 0.5 ) * 12
				pArr[ i * 3 + 1 ] = ( Math.random() - 0.5 ) * 8
				pArr[ i * 3 + 2 ] = - 15
			}
		}
		this.starsPosAttr.needsUpdate = true

		// 5. Rotate inner shapes
		const rotSpeed = 0.0002 * t
		this.meshOuter.rotation.x = rotSpeed * 0.5 + ( a.volumeSmooth ?? 0 ) * 0.4
		this.meshOuter.rotation.y = - rotSpeed * 0.3
		this.meshMiddle.rotation.y = rotSpeed * 0.8 + ( a.volumeSmooth ?? 0 ) * 0.6
		this.meshMiddle.rotation.z = - rotSpeed * 0.4

		// Scale shapes
		const baseScale = 1.0 + ( a.volumeSmooth ?? 0 ) * 0.4
		this.meshOuter.scale.setScalar( baseScale * ( 1.0 + ( a.kick ?? 0 ) * 0.15 ) )
		this.meshMiddle.scale.setScalar( baseScale * ( 1.0 + ( a.kickHard ?? 0 ) * 0.25 ) * 0.7 )

		// Dynamic point light
		this.pulseLight.intensity = ( a.kick ?? 0 ) * 5.0 + ( a.volumeSmooth ?? 0 ) * 2.5

		// 6. Camera shake and sway
		this.camera.position.x = Math.sin( t * 0.0006 ) * 0.25
		this.camera.position.y = Math.cos( t * 0.0004 ) * 0.18
		this.camera.position.z = 5.5

		const shake = ( a.kickHard ?? 0 ) * 0.16 + ( a.kick ?? 0 ) * 0.06
		if ( shake > 0.01 ) {
			this.camera.position.x += ( Math.random() - 0.5 ) * shake
			this.camera.position.y += ( Math.random() - 0.5 ) * shake
			this.camera.position.z += ( Math.random() - 0.5 ) * shake
		}

		// 7. Background flash / strobe on heavy kicks
		const flash = ( a.kickHard ?? 0 ) * 0.25 + ( a.kick ?? 0 ) * 0.08
		this.renderer.setClearColor( new THREE.Color( flash, flash, flash ), 1.0 )

		this.renderer.render( this.scene, this.camera )
	}

}

const audio = new Analyzer()
const scene = new SpectrumLandscapeScene( audio )

audio.onLoad( async () => {
	await scene.load()
	scene.init()
} )
audio.onWarmup( () => scene.warmup() )
audio.onPlay( () => scene.play() )
audio.onStop( () => scene.stop() )
