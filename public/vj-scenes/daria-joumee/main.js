import * as THREE from 'three'
import { gsap } from 'gsap'
import Analyzer from '/sounds/Analyzer.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'


import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.18.0/dist/lil-gui.esm.js'

import { createTrapezoidGeometry, createParticleBurst, createGlassMaterial, animateCamera } from './utils.js'


class VitrageScene {

	constructor(audio) {
		this.audio = audio
		this.renderer = null
		this.scene = null
		this.camera = null
		this.controls = null

		//models
		this.glassModel = null
		this.wallsModel = null

		//mesh and material
		this.mesh = null
		this.shaderMaterial = null

		//shaders
		this.vertexGlass = null
		this.fragmentGlass = null
		this.vertexRays = null
		this.fragmentRays = null
		this.vertexFloor = null
		this.fragmentFloor = null

		//textures
		this.allTextures = []

		//matherials
		this.glassMaterials = {}
		this.raysMaterial = null

		//rays
		this.ray = null
		this.rayGroup = null


		//postprocessing
		this.composer = null
		this.bloomPass = null

		//particles
		this.activeBursts = []
		this.lastTime = 0
		this.lastKickHard = false

		//lighting 
		this.red = null
		this.blue = null
		this.green = null
		this.lune = null

		this.key = null
		this.point = null

		//scenography
		this.timeline = null
		this.musicLightPower = 0

		this.activeBursts = []
		this.lastTime = 0
		this.waitingForKickMove = false
		this.kickMoveStarted = false
		this.startParticles = false
	}


	async load() {
		const [vertexGlass, fragmentGlass, vertexRays, fragmentRays, vertexParticles, fragmentParticles] = await Promise.all([
			fetch('./shaders/glass/vertex.glsl'),
			fetch('./shaders/glass/fragment.glsl'),
			fetch('./shaders/rays/vertex.glsl'),
			fetch('./shaders/rays/fragment.glsl'),
			fetch('./shaders/particles/vertex.glsl'),
			fetch('./shaders/particles/fragment.glsl'),
		])

		this.vertexGlass = await vertexGlass.text()
		this.fragmentGlass = await fragmentGlass.text()
		this.vertexRays = await vertexRays.text()
		this.fragmentRays = await fragmentRays.text()
		this.vertexParticles = await vertexParticles.text()
		this.fragmentParticles = await fragmentParticles.text()

		const texturesLoader = new THREE.TextureLoader()
		const [
			waterTexture,
			waterMask,
			waterReflection,
			fireTexture,
			fireMask,
			fireReflection,
			earthTexture,
			earthMask,
			earthReflection,
			airTexture,
			airMask,
			airReflection,
			skyTexture,
			shineTexture
		] = await Promise.all([
			texturesLoader.loadAsync('./textures/water.webp'),
			texturesLoader.loadAsync('./textures/water.jpg'),
			texturesLoader.loadAsync('./textures/water_reflection.webp'),

			texturesLoader.loadAsync('./textures/fire.webp'),
			texturesLoader.loadAsync('./textures/fire.jpg'),
			texturesLoader.loadAsync('./textures/fire_reflection.webp'),

			texturesLoader.loadAsync('./textures/terre.webp'),
			texturesLoader.loadAsync('./textures/terre.jpg'),
			texturesLoader.loadAsync('./textures/terre_reflection.webp'),

			texturesLoader.loadAsync('./textures/air.webp'),
			texturesLoader.loadAsync('./textures/air.jpg'),
			texturesLoader.loadAsync('./textures/air_reflection.webp'),

			texturesLoader.loadAsync('./textures/sky.jpg'),
			texturesLoader.loadAsync('./textures/shine2.webp'),
		])

		this.allTextures = {
			water: [waterTexture, waterMask, waterReflection],
			fire: [fireTexture, fireMask, fireReflection],
			earth: [earthTexture, earthMask, earthReflection],
			air: [airTexture, airMask, airReflection],
			sky: [skyTexture],
			shine: [shineTexture],
		}

		Object.values(this.allTextures)
			.flat()
			.forEach((texture) => {
				texture.flipY = false
				texture.needsUpdate = true
			})

		const loader = new GLTFLoader()
		const [glass, walls, rays] = await Promise.all([
			loader.loadAsync('./models/glass.glb'),
			loader.loadAsync('./models/walls3.glb'),
			loader.loadAsync('./models/rays.glb'),
		])

		this.glassModel = glass.scene
		this.wallsModel = walls.scene
		this.raysModel = rays.scene
	}

	init() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true })
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
		this.renderer.setSize(innerWidth, innerHeight)
		document.body.appendChild(this.renderer.domElement)

console.log(
	this.renderer.domElement.width,
	this.renderer.domElement.height
)
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100)

		this.composer = new EffectComposer(this.renderer)
		this.composer.setSize(
			window.innerWidth,
			window.innerHeight
		)

		const renderPass = new RenderPass(this.scene, this.camera)
		this.composer.addPass(renderPass)

		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(innerWidth, innerHeight),
			0.51,  // strength
			0.0, // radius
			0.97  // threshold
		)

		this.composer.addPass(this.bloomPass)

		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = true
		this.controls.target.set(0, 1, 0)
		
		// block user control
		this.controls.enableRotate = false
		this.controls.enableZoom = false
		this.controls.enablePan = false

		this.controls.update()


		this.scene.background = new THREE.Color('#020403')

		// this.scene.fog = new THREE.FogExp2('#020403', 1.08)
		this.scene.fog =
			new THREE.Fog(
				'#020403',
				7,
				22
			)

		//--------------------------------------------
		//
		// --- Add a glowing ray of light in front of the glass ---
		//
		//--------------------------------------------
		this.rayMeshes = []

		const raySettings = {
			water: {
				texture: this.allTextures.shine[0],
				opacity: 0.025,
				brightness: 10,
				color: '#1f8bb6',
			},

			fire: {
				texture: this.allTextures.shine[0],
				opacity: 0.025,
				brightness: 1.5,
				color: '#bc1916',
			},

			earth: {
				texture: this.allTextures.shine[0],
				opacity: 0.025,
				brightness: 1.7,
				color: '#408e1b',
			},
			air: {
				texture: this.allTextures.shine[0],
				opacity: 0.01,
				brightness: 0.1,
				color: '#e2d589',
			},
		}

		const createRaysMaterial = (settings) => {
			return new THREE.ShaderMaterial({
				transparent: true,
				depthWrite: false,
				side: THREE.DoubleSide,
				blending: THREE.AdditiveBlending,

				uniforms: {
					uRayTexture: {
						value: settings.texture,
					},

					uVolume: {
						value: 0,
					},

					uIntroPower: { value: 0 },

					uTime: { value: 0 },
					uBrightness: { value: settings.brightness ?? 1.0 },

					uOpacity: {
						value: settings.opacity ?? 0.35,
					},

					uBrightness: {
						value: settings.brightness ?? 1.0,
					},

					uTintColor: {
						value: new THREE.Color(
							settings.color ?? '#ffffff'
						),
					},
				},

				vertexShader: this.vertexRays,
				fragmentShader: this.fragmentRays,
			})
		}

		this.raysModel.traverse((obj) => {
			if (!obj.isMesh) return

			const name = obj.name.toLowerCase()

			let settings = raySettings.default

			if (name.includes('water')) settings = raySettings.water
			if (name.includes('fire')) settings = raySettings.fire
			if (name.includes('terre')) settings = raySettings.earth
			if (name.includes('air')) settings = raySettings.air

			obj.material = createRaysMaterial(settings)

			obj.castShadow = false
			obj.receiveShadow = false

			this.rayMeshes.push(obj)
		})

		this.scene.add(this.raysModel)

		//--------------------------------------------
		//
		// --- Add a floor reflection ---
		//
		//--------------------------------------------


		const floorLightGeometry = createTrapezoidGeometry(
			2.4, // width next to window
			7, // width at the end of the ray
			9  // length of the shadow
		)

		const floorCircleGeometry = createTrapezoidGeometry(
			5, // width next to window
			6, // width at the end of the ray
			6  // length of the shadow
		)

		this.floorReflections = []

		const reflectionSettings = [
			{
				texture: this.allTextures.water[2],
				position: [-2.7, 0.23, -3],
				color: '#58cfff',
			},
			{
				texture: this.allTextures.earth[2],
				position: [3, 0.23, -3],
				color: '#b7e85a',
			},
			{
				texture: this.allTextures.fire[2],
				position: [0, 0.23, -3],
				color: '#ffb24a',
			},
			{
				texture: this.allTextures.air[2],
				position: [-1.5, 0.23, 4.9],
				color: 'rgb(237, 237, 115)',
			},
		]

		reflectionSettings.forEach((settings) => {
			const floorLightMaterial = new THREE.ShaderMaterial({
				transparent: true,
				depthWrite: false,
				side: THREE.DoubleSide,
				blending: THREE.CustomBlending,

				blendEquation: THREE.AddEquation,

				blendSrc: THREE.SrcAlphaFactor,
				blendDst: THREE.OneMinusSrcAlphaFactor,

				uniforms: {
					uRayTexture: {
						value: settings.texture,
					},

					uVolume: {
						value: 0,
					},

					uTime: { value: 0 },
					uBrightness: { value: 0 },

					uOpacity: {
						value: 0.02,
					},
					uTintColor: {
						value: new THREE.Color(
							'#202020'
						),
					},
				},

				vertexShader: this.vertexRays,
				fragmentShader: this.fragmentRays,
			})

			let floorLight;

			if (settings.texture === this.allTextures.air[2]) {
				floorLight = new THREE.Mesh(floorCircleGeometry, floorLightMaterial)
			} else {
				floorLight = new THREE.Mesh(floorLightGeometry, floorLightMaterial)
			}

			floorLight.material.depthTest = false
			floorLight.material.depthWrite = false

			floorLight.position.set(settings.position[0], settings.position[1], settings.position[2])

			this.scene.add(floorLight)
			this.floorReflections.push(floorLight)

		})

		//--------------------------------------------
		//
		// --- Glasses ---
		//
		//--------------------------------------------

		//matherials
		this.glassMaterials = {
			water: createGlassMaterial(this.allTextures.water[0], this.allTextures.water[1], {
				brightness: 0,
				volumeBrightness: 1.5,
				glowStrength: 0.2,
				colorA: '#577681',
				colorB: '#2e5b9f',
				saturation: 0.5,
				flashColor: '#92aece',
			}, this.vertexGlass, this.fragmentGlass),

			fire: createGlassMaterial(this.allTextures.fire[0], this.allTextures.fire[1], {
				brightness: 0,
				volumeBrightness: 1.5,
				glowStrength: 0.2,
				colorA: '#ffcc66',
				colorB: '#511c0e',
				saturation: 0.5,
				flashColor: '#c69898',
			}, this.vertexGlass, this.fragmentGlass),

			earth: createGlassMaterial(this.allTextures.earth[0], this.allTextures.earth[1], {
				brightness: 0,
				volumeBrightness: 1.5,
				glowStrength: 0.2,
				colorA: '#cfff6b',
				colorB: '#155523',
				saturation: 0.5,
				flashColor: '#8cb495',
			}, this.vertexGlass, this.fragmentGlass),

			air: createGlassMaterial(this.allTextures.air[0], this.allTextures.air[1], {
				brightness: 0,
				volumeBrightness: 1.5,
				glowStrength: 0.2,
				colorA: '#ffffff',
				colorB: '#114152',
				saturation: 0.95,
				flashColor: '#ffffff',
			}, this.vertexGlass, this.fragmentGlass),
		}

		this.glassModel.traverse((obj) => {
			if (!obj.isMesh) return

			if (obj.name.includes('water')) {
				obj.material = this.glassMaterials.water
			} else if (obj.name.includes('fire')) {
				obj.material = this.glassMaterials.fire
			} else if (obj.name.includes('terre')) {
				obj.material = this.glassMaterials.earth
			} else if (obj.name.includes('air')) {
				obj.material = this.glassMaterials.air
			}

			obj.castShadow = false
			obj.receiveShadow = false
		})

		this.scene.add(this.glassModel, this.wallsModel)

		//--------------------------------------------
		//
		// --- Lighting ---
		//
		//--------------------------------------------

		const key = new THREE.DirectionalLight(0xffffff, 0.04)
		key.position.set(0, 2, 0)
		this.key = key

		this.scene.add(key)

		const point = new THREE.PointLight(0xffffff, 0.2, 25, 0.5)
		point.position.set(0, 0.5, 7)
		this.point = point

		this.scene.add(point)

		this.red = new THREE.PointLight(0xd14917, 0, 7)
		this.red.position.set(0, 3.2, -3)

		// this.scene.add(
		// new THREE.PointLightHelper(
		// 	this.red,
		// 	0.5
		// )
		// )

		this.scene.add(this.red)

		this.blue = new THREE.PointLight(0x2e5ac2, 0, 7)
		this.blue.position.set(-3, 3.2, -3)

		// this.scene.add(
		// new THREE.PointLightHelper(
		// 	this.blue,
		// 	0.5
		// )
		// )

		this.scene.add(this.blue)

		this.green = new THREE.PointLight(0x1e7a32, 0, 7)
		this.green.position.set(3, 3.2, -3)

		// this.scene.add(
		// new THREE.PointLightHelper(
		// 	this.green,
		// 	0.5
		// )
		// )

		this.scene.add(this.green)

		//--------------------------------------------
		//
		// --- Background ---
		//
		//--------------------------------------------

		const backgroundGeometry = new THREE.PlaneGeometry(40, 35)
		const backgroundMaterial = new THREE.MeshStandardMaterial({
			map: this.allTextures.sky[0],
			emissive: new THREE.Color(0xffffff),
			emissiveMap: this.allTextures.sky[0],
			emissiveIntensity: 10,
			side: THREE.DoubleSide,
		})
		const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
		background.position.set(0, 10, -6)
		background.rotation.x = -Math.PI
		this.scene.add(background)

		this.lune = new THREE.PointLight(0xffffff, 120, 0, 10)
		this.lune.position.set(0, 8, -5.5)
		this.scene.add(this.lune) 

		this.createTimeline()

		addEventListener('resize', () => {
			if (!this.camera || !this.renderer || !this.composer) return

			const width = window.innerWidth
			const height = window.innerHeight

			this.camera.aspect = width / height
			this.camera.updateProjectionMatrix()

			this.renderer.setSize(width, height)
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

			this.composer.setSize(width, height)

			if (this.bloomPass) {
				this.bloomPass.setSize(width, height)
			}
		})
	}

	warmup() {
	}

	play() {
		this.renderer?.setAnimationLoop((t) => this.update(t))
		this.timeline?.restart()
	}

	stop() {
		this.renderer?.setAnimationLoop(null)
	}

	update(t) {
		const a = this.audio // ← volume · volumeSmooth · kick · volumeByFrequency
		const time = t / 1000
		const delta = this.lastTime ? time - this.lastTime : 0
		this.lastTime = time

		//------------------------------------------------
		// Update glasses
		//------------------------------------------------
		Object.values(this.glassMaterials).forEach((material) => {
			const u = material.uniforms

			u.uTime.value = time
			u.uVolume.value = a.volumeSmooth

			u.uFlash.value = Math.max(
				u.uFlash.value * 0.88,
				a.kickHard
			)
		})

		//------------------------------------------------
		//update particles
		//------------------------------------------------

		const isKickHard = a.kickHard > 0.5

		console.log(this.startParticles, "SSSSSSSSSSSSS")

		if (isKickHard && !this.lastKickHard && this.startParticles) {

			this.activeBursts.push(
				createParticleBurst({
					scene: this.scene,
					vertexParticles: this.vertexParticles,
					fragmentParticles: this.fragmentParticles,

					particleCount: 150,

					//center of the glasses
					originX: -2.5,
					originY: 2.5,
					originZ: -3.2,

					width: 1.8,
					height: 3.5,

					life: Math.random() * 0.4 + 2.4,
					kick: 1 + a.kick * 2.5,

					palette: [
						'#6b6ca4',
						'#659bb0',
						'#375b8d',
					],
				})
			)

			this.activeBursts.push(
				createParticleBurst({
					scene: this.scene,
					vertexParticles: this.vertexParticles,
					fragmentParticles: this.fragmentParticles,

					particleCount: 150,

					originX: 0.1,
					originY: 2.5,
					originZ: -3.2,

					width: 1.8,
					height: 3.5,

					life: 2.6,
					kick: 1 + a.kick * 2.5,

					palette: [
						'#b3b07d',
						'#ffb24a',
						'#7f2d2d',
					],
				})
			)

			this.activeBursts.push(
				createParticleBurst({
					scene: this.scene,
					vertexParticles: this.vertexParticles,
					fragmentParticles: this.fragmentParticles,

					particleCount: 150,

					originX: 2.8,
					originY: 2.5,
					originZ: -3.2,

					width: 1.8,
					height: 3.5,

					life: 2.6,
					kick: 1 + a.kick * 2.5,

					palette: [
						'#438e56',
						'#436309',
						'#a0672b',
					],
				})
			)
		}

		for (let i = this.activeBursts.length - 1; i >= 0; i--) {
			const burst = this.activeBursts[i]

			const alive = burst.update(delta)

			if (!alive) {
				burst.dispose()
				this.activeBursts.splice(i, 1)
			}
		}

		this.lastKickHard = isKickHard
		//------------------------------------------------
		//update rays
		//------------------------------------------------

		this.rayMeshes.forEach((ray) => {
			const u = ray.material.uniforms

			u.uTime.value = time
			u.uVolume.value = a.volumeSmooth
		})

		//------------------------------------------------
		//update reflections
		//------------------------------------------------

		this.floorReflections.forEach((reflection) => {
			const u = reflection.material.uniforms

			u.uTime.value = time
			u.uVolume.value = a.volumeSmooth
		})

		//------------------------------------------------
		//update lighting
		//------------------------------------------------

		const volume =
			THREE.MathUtils.smoothstep(
				a.volumeSmooth, 0.5, 1.0
			)

		const intensity = 10 + volume * 30.2

		this.red.intensity = intensity * this.musicLightPower
		this.blue.intensity = intensity * this.musicLightPower
		this.green.intensity = intensity * this.musicLightPower

		this.lune.intensity = (120 + volume * 2000)


		//------------------------------------------------
		this.controls?.update()
		this.composer.render()
	}

	createTimeline() {
		const tl = gsap.timeline({
			paused: true,
			defaults: {
				ease: 'power2.inOut',
			},
		})

		this.timeline = tl

		// -----------------------------
		// Initial state
		// -----------------------------

		this.camera.position.set(0, 0.5, 17)
		this.controls.target.set(0, 2.5, 0)
		this.controls.update()

		tl.to(
			this.key,
			{
				intensity: 1,
				duration: 5,
				ease: 'sine.inOut',
			},
			2
		)

		tl.to(
			this.point,
			{
				intensity: 2.1,
				duration: 5,
				ease: 'sine.inOut',
			},
			2
		)

		//-------------------------------
		// 1. Moving camera front and turning on glasses
		//-------------------------------


		tl.to(
			this.camera.position,
			{
				x: -7,
				y: 3.2,
				z: 5,
				duration: 2,
				ease: 'sine.inOut',
			},
			'1'
		)

		
		Object.values(this.glassMaterials).forEach((material, index) => {
			tl.to(
				material.uniforms.uIntroPower,
				{
					value: 1,
					duration: 0.002,
					ease: 'ease2.inOut',
				},
				3.5 + index * 0.7
			)
		})

		this.rayMeshes.forEach((ray, index) => {
			tl.to(
				ray.material.uniforms.uIntroPower,
				{
					value: 1,
					duration: 0.002,
					ease: 'ease2.inOut',
				},
				3.5 + index * 0.7
			)
		})

		tl.to(
			this,
			{
				musicLightPower: 1,
			},
			'>'
		)


		//-------------------------------
		// 2. Moving camera to the right to be ready for the flyby
		//-------------------------------

		tl.to(
			this.camera.position,
			{
				x: 10,
				y: 3.2,
				z: 5,
				duration: 1.5,
				ease: 'power2.inOut',
			},
			'+=1'
		)

		tl.to(
			this,
			{
				startParticles: true, 
			},
			'<'
		)




		//-------------------------------
		// 3. Flying to top
		//-------------------------------

		tl.to(
			this.camera.position,
			{
				x: 0,
				y: 9,
				z: 4,
				duration: 3,
				ease: 'power2.inOut',
			},
			'+=2'
		)

		tl.to(
			this.controls.target,
			{
				x: -0.2,
				y: 10,
				z: 0,
				duration: 3,
				ease: 'power2.out',
				onUpdate: () => this.controls.update(),
			},
			'<+0.5'
		)

		//-------------------------------
		// 4. turn camera around
		//-------------------------------

		const roll = {
			value: 0
		}

		tl.to(
			roll,
			{
				value: Math.PI * 6,
				ease: 'power2.inOut',
				duration: 2.5,

				onUpdate: () => {

					this.camera.up.set(
						Math.sin(roll.value),
						Math.cos(roll.value),
						0
					)

					this.controls.update()
				},
			},
			'<+4'
		)

		//-------------------------------
		// 5.return back
		//-------------------------------


		tl.to(
			this.camera.position,
			{
				x: 0,
				y: 1,
				z: 17,
				duration: 5,
				ease: 'power2.out',
			},
			'<'
		)


		tl.to(
			this.controls.target,
			{
				x: 0,
				y: 4,
				z: 0,
				duration: 5,
				ease: 'power2.inOut',
				onUpdate: () => this.controls.update(),
			},
			'<'
		)


		//-------------------------------
		// 6.little move at the end
		//-------------------------------

		tl.to(
			this.camera.position,
			{
				x: 0,
				y: 6,
				z: 17,
				duration: 4,
				ease: 'sine.in',
			},
			'>-1'
		)

		tl.to(
			this.camera.position,
			{
				x: 0,
				y: 0.5,
				z: 3,
				duration: 6,
				ease: 'sine.inOut',
			},
			'>'
		)

		tl.to(
			this.controls.target,
			{
				x: 0,
				y: 1.5,
				z: 0,
				duration: 5,
				ease: 'sine.inOut',
				onUpdate: () => this.controls.update(),
			},
			'<'
		)

	}
}

const audio = new Analyzer()
const scene = new VitrageScene(audio)

audio.onLoad(async () => {
	await scene.load()
	scene.init()
})

audio.onWarmup(() => scene.warmup())
audio.onPlay(() => scene.play())
audio.onStop(() => scene.stop())
