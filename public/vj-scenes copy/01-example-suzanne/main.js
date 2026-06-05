import * as THREE from 'three/webgpu'
import {
	Fn,
	float,
	color,
	mix,
	dot,
	normalize,
	pow,
	cameraPosition,
	positionWorld,
	normalWorld,
	uniform,
	time,
	sin,
	positionLocal,
	normalLocal,
	vec3
} from 'three/tsl'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Analyzer from '/sounds/Analyzer.js'

class SuzanneScene {

	constructor( audio ) {
		this.audio = audio
		this.renderer = null
		this.scene = null
		this.camera = null
		this.mesh = null
		this.material = null
		this.wireMesh = null
		this.wireMaterial = null
		this.suzanneGroup = null
		this.controls = null
		this.keyLight = null
		this.fillLight = null
		this.lastKick = false
		this.modelData = null

		// Starfield Particles
		this.starfield = null
		this.starMaterial = null
		this.starCount = 300
		this.starSpeeds = new Float32Array( this.starCount )

		// Camera and orbit state
		this.targetFov = 42
		this.currentFov = 42
		this.baseOrbitSpeed = 0.4
		this.lastTime = 0
		this.cameraPhase = 0
		this.cameraDistanceOffset = 0.0

		// Wireframe dynamic state
		this.targetWireOpacity = 0.0
		this.currentWireOpacity = 0.0

		// Mesh white-flash state ( black at rest, flashes white on kick then fades back to black )
		this.baseAlbedoColor = new THREE.Color( 0x000000 )
		this.whiteAlbedoColor = new THREE.Color( 0xffffff )
		this.meshWhiteStrength = 0.0

		// Premium HD Metal Presets
		this.metalPresets = [
			{ name: 'Chrome', roughness: 0.06, metalness: 1.0 },
			{ name: 'Gold', roughness: 0.10, metalness: 1.0 },
			{ name: 'Copper', roughness: 0.14, metalness: 1.0 },
			{ name: 'Steel', roughness: 0.20, metalness: 0.9 }
		]
		this.currentPresetIndex = 0

		// --- TSL Uniforms --------------------------------------------------------
		this.volumeUniform = uniform( 0.0 )
		this.kickUniform = uniform( 0.0 )
		this.timeUniform = uniform( 0.0 )
		this.rimColorUniform = uniform( new THREE.Color( 0xffffff ) )
		this.albedoColorUniform = uniform( new THREE.Color( 0x000000 ) )
		this.roughnessUniform = uniform( 0.06 )
		this.metalnessUniform = uniform( 1.0 )

		// Define custom TSL nodes within class context (so they reference this.*Uniform)
		this.initTSLNodes()
	}

	initTSLNodes() {
		// Custom Emissive Glow: Fresnel edges scaled by volume and beats
		this.customEmissiveNode = Fn( () => {
			const viewDir = normalize( cameraPosition.sub( positionWorld ) )
			const NdotV = dot( normalWorld, viewDir )
			const fresnel = pow( float( 1.0 ).sub( NdotV ), float( 3.5 ) )
			const glow = this.rimColorUniform.mul( fresnel.mul( this.kickUniform.mul( 1.5 ).add( 0.3 ) ) )
			const volumeFactor = this.volumeUniform.add( 0.15 ).clamp( 0.0, 1.0 )
			return glow.mul( volumeFactor )
		} )

		// Custom Albedo Color: Black to white flash
		this.customColorNode = Fn( () => {
			return this.albedoColorUniform
		} )

		// Custom Displacement Node: Dynamic wave scaling with volume
		this.customDisplacementNode = Fn( () => {
			const frequency = float( 4.5 )
			const speed = float( 6.0 )
			const wave = sin( positionLocal.y.mul( frequency ).add( this.timeUniform.mul( speed ) ) )
			const reactiveVolume = this.volumeUniform.mul( this.volumeUniform )
			const strength = float( 0.03 ).mul( reactiveVolume )
			const displacement = wave.mul( strength )
			return positionLocal.add( normalLocal.mul( displacement ) )
		} )

		// Custom Wire Displacement Node: Concentric offset from displacement
		this.customWireDisplacementNode = Fn( () => {
			const frequency = float( 4.5 )
			const speed = float( 6.0 )
			const wave = sin( positionLocal.y.mul( frequency ).add( this.timeUniform.mul( speed ) ) )
			const reactiveVolume = this.volumeUniform.mul( this.volumeUniform )
			const innerStrength = float( 0.03 ).mul( reactiveVolume )
			const innerDisplacement = wave.mul( innerStrength )
			const offset = float( 0.015 ).add( reactiveVolume.mul( 0.025 ) )
			const displacement = innerDisplacement.add( offset )
			return positionLocal.add( normalLocal.mul( displacement ) )
		} )
	}

	async load() {
		try {
			const res = await fetch( 'models/suzanne_buffergeometry.json' )
			this.modelData = await res.json()
		} catch ( err ) {
			console.error( 'Failed to load model, falling back to sphere', err )
			this.modelData = null
		}
	}

	async init() {
		this.renderer = new THREE.WebGPURenderer( { antialias: true } )
		this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
		this.renderer.setSize( window.innerWidth, window.innerHeight )
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping
		this.renderer.toneMappingExposure = 1.1
		document.body.appendChild( this.renderer.domElement )

		await this.renderer.init()

		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color( 0x010102 )
		this.camera = new THREE.PerspectiveCamera( 42, window.innerWidth / window.innerHeight, 0.1, 100 )
		this.camera.position.set( 0, 0, 7.0 )

		this.controls = new OrbitControls( this.camera, this.renderer.domElement )
		this.controls.enableDamping = true
		this.controls.dampingFactor = 0.05
		this.controls.autoRotate = false
		this.controls.minDistance = 4.0
		this.controls.maxDistance = 10.0

		const environment = new RoomEnvironment( this.renderer )
		const pmremGenerator = new THREE.PMREMGenerator( this.renderer )
		this.scene.environment = pmremGenerator.fromScene( environment ).texture
		pmremGenerator.dispose()

		const starsGeometry = new THREE.BufferGeometry()
		const starPositions = new Float32Array( this.starCount * 3 )
		for ( let i = 0; i < this.starCount; i ++ ) {
			starPositions[ i * 3 ] = ( Math.random() - 0.5 ) * 15
			starPositions[ i * 3 + 1 ] = ( Math.random() - 0.5 ) * 10
			starPositions[ i * 3 + 2 ] = Math.random() * 20 - 15
			this.starSpeeds[ i ] = 0.2 + Math.random() * 0.8
		}
		starsGeometry.setAttribute( 'position', new THREE.BufferAttribute( starPositions, 3 ) )
		this.starMaterial = new THREE.PointsMaterial( {
			color: 0xffffff,
			size: 0.04,
			transparent: true,
			opacity: 0.5,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		} )
		this.starfield = new THREE.Points( starsGeometry, this.starMaterial )
		this.scene.add( this.starfield )

		let geometry
		if ( this.modelData ) {
			const loader = new THREE.BufferGeometryLoader()
			geometry = loader.parse( this.modelData )
			geometry.computeVertexNormals()
		} else {
			geometry = new THREE.IcosahedronGeometry( 1, 5 )
		}

		this.material = new THREE.MeshStandardNodeMaterial()
		this.material.colorNode = this.customColorNode()
		this.material.emissiveNode = this.customEmissiveNode()
		this.material.roughnessNode = this.roughnessUniform
		this.material.metalnessNode = this.metalnessUniform
		this.material.positionNode = this.customDisplacementNode()

		this.wireMaterial = new THREE.MeshBasicNodeMaterial( {
			wireframe: true,
			transparent: true,
			opacity: 0.35
		} )
		this.wireMaterial.colorNode = this.rimColorUniform
		this.wireMaterial.positionNode = this.customWireDisplacementNode()

		this.suzanneGroup = new THREE.Group()
		this.scene.add( this.suzanneGroup )

		this.mesh = new THREE.Mesh( geometry, this.material )
		this.mesh.rotation.set( 0.15, 0.15, 0.0 )
		this.suzanneGroup.add( this.mesh )

		this.wireMesh = new THREE.Mesh( geometry, this.wireMaterial )
		this.wireMesh.rotation.set( 0.15, 0.15, 0.0 )
		this.suzanneGroup.add( this.wireMesh )

		this.scene.add( new THREE.AmbientLight( 0x050505, 0.1 ) )

		this.keyLight = new THREE.DirectionalLight( 0xffffff, 2.0 )
		this.keyLight.position.set( 5, 5, 4 )
		this.scene.add( this.keyLight )

		this.fillLight = new THREE.DirectionalLight( 0xffffff, 1.5 )
		this.fillLight.position.set( -5, 3, -4 )
		this.scene.add( this.fillLight )

		addEventListener( 'resize', () => this.onResize() )
	}

	onResize() {
		if ( ! this.renderer || ! this.camera ) return
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize( window.innerWidth, window.innerHeight )
	}

	warmup() {
		this.renderer.render( this.scene, this.camera )
	}

	play() {
		this.renderer.setAnimationLoop( ( t ) => this.frame( t ) )
	}

	stop() {
		this.renderer.setAnimationLoop( null )
	}

	frame( t ) {
		const a = this.audio
		const dt = this.lastTime === 0 ? 0.016 : ( t - this.lastTime ) / 1000.0
		this.lastTime = t

		this.volumeUniform.value = a.volumeSmooth
		this.kickUniform.value = a.kick
		this.timeUniform.value = t / 1000.0

		this.keyLight.intensity = 1.5 + a.volumeSmooth * 3.0
		this.fillLight.intensity = 0.8 + a.kick * 2.5

		const lightAngle = t * 0.0008
		this.keyLight.position.set( Math.cos( lightAngle ) * 5.0, 5.0, Math.sin( lightAngle ) * 5.0 )

		const isKick = a.kick > 0.4
		if ( isKick && ! this.lastKick ) {
			// Cycles through premium HD metal presets on beat
			this.currentPresetIndex = ( this.currentPresetIndex + 1 ) % this.metalPresets.length
			const preset = this.metalPresets[ this.currentPresetIndex ]
			
			this.roughnessUniform.value = preset.roughness
			this.metalnessUniform.value = preset.metalness

			this.targetWireOpacity = 0.8 + Math.random() * 0.2
			this.meshWhiteStrength = 1.0
			if ( Math.random() < 0.35 ) {
				this.cameraDistanceOffset = 5.0
			}
		}
		this.lastKick = isKick

		this.targetWireOpacity *= Math.pow( 0.08, dt )
		this.currentWireOpacity += ( this.targetWireOpacity - this.currentWireOpacity ) * 0.12

		if ( this.wireMaterial ) {
			this.wireMaterial.opacity = this.currentWireOpacity * Math.min( a.volumeSmooth * 1.5, 1.0 )
		}

		this.meshWhiteStrength *= Math.pow( 0.01, dt )
		this.albedoColorUniform.value.copy( this.baseAlbedoColor ).lerp( this.whiteAlbedoColor, this.meshWhiteStrength )

		this.scene.background.setHex( 0x010102 )
		document.body.style.backgroundColor = '#010102'

		const volumeSmoothSq = a.volumeSmooth * a.volumeSmooth
		const groupScale = 1.0 + volumeSmoothSq * 0.15
		if ( this.suzanneGroup ) {
			this.suzanneGroup.scale.setScalar( groupScale )
			this.suzanneGroup.rotation.y = Math.sin( t * 0.0003 ) * 0.15 + a.volumeSmooth * 0.15
			this.suzanneGroup.rotation.x = Math.sin( t * 0.0005 ) * 0.08
			if ( this.wireMesh ) {
				this.wireMesh.rotation.set( 0.15, 0.15, 0.0 )
			}
		}

		if ( this.starfield && this.starMaterial ) {
			const speedMultiplier = 0.03 + a.volumeSmooth * 0.14 + a.kick * 0.08
			const pArr = this.starfield.geometry.attributes.position.array
			for ( let i = 0; i < this.starCount; i ++ ) {
				pArr[ i * 3 + 2 ] += this.starSpeeds[ i ] * speedMultiplier
				if ( pArr[ i * 3 + 2 ] > 6.0 ) {
					pArr[ i * 3 ] = ( Math.random() - 0.5 ) * 15
					pArr[ i * 3 + 1 ] = ( Math.random() - 0.5 ) * 10
					pArr[ i * 3 + 2 ] = - 15
				}
			}
			this.starfield.geometry.attributes.position.needsUpdate = true
			this.starMaterial.size = 0.02 + a.volumeSmooth * 0.05 + a.kick * 0.03
			this.starMaterial.opacity = 0.15 + a.volumeSmooth * 0.55
		}

		this.targetFov = 42 - ( a.volumeSmooth * a.volumeSmooth ) * 5.0
		this.currentFov += ( this.targetFov - this.currentFov ) * 0.12
		this.camera.fov = this.currentFov
		this.camera.updateProjectionMatrix()

		this.controls.target.set( 0, 0, 0 )
		this.controls.update()

		this.cameraPhase += dt * ( 0.45 + a.volumeSmooth * 1.2 + a.kick * 0.8 )

		const camX = Math.sin( this.cameraPhase ) * 2.8
		const camY = Math.sin( this.cameraPhase * 2.0 ) * 1.3
		const baseZ = 5.8 + Math.cos( this.cameraPhase ) * 0.8
		
		this.cameraDistanceOffset *= Math.pow( 0.05, dt )

		const basePos = new THREE.Vector3( camX, camY, baseZ )
		const dir = basePos.clone().normalize()

		this.camera.position.copy( basePos ).addScaledVector( dir, this.cameraDistanceOffset )
		this.camera.lookAt( 0, 0, 0 )

		const originalCamPos = this.camera.position.clone()

		const shakeForce = a.kick * 0.07 + a.volumeSmooth * 0.025
		if ( shakeForce > 0.005 ) {
			this.camera.position.x += ( Math.random() - 0.5 ) * shakeForce
			this.camera.position.y += ( Math.random() - 0.5 ) * shakeForce
			this.camera.position.z += ( Math.random() - 0.5 ) * shakeForce
		}

		this.renderer.render( this.scene, this.camera )
		this.camera.position.copy( originalCamPos )
	}

}

const audio = new Analyzer()
const scene = new SuzanneScene( audio )

audio.onLoad( async () => {
	await scene.load()
	await scene.init()
} )
audio.onWarmup( () => scene.warmup() )
audio.onPlay( () => scene.play() )
audio.onStop( () => scene.stop() )
