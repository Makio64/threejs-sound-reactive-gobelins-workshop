import * as THREE from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js'
import { Pane } from 'tweakpane'
import Analyzer from '/sounds/Analyzer.js'

const BODY_URL = './assets/body.glb'
const FALLING_URL = './assets/falling.fbx'
const TARGET_HEIGHT = 2   // body normalized to ~2 world units tall
const BLOOM_LAYER = 1     // body meshes get this layer- bloomComposer renders only it
// Default total cloud count- live-tunable via params.clouds.count.
const CLOUD_COUNT_DEFAULT = 180

// Discrete parallax depth layers (near -> horizon). Each band gets its own
// radius/scale/height range and speed multiplier. Far layers are slower and
// larger, near ones are fast and small: same world rise speed × per-layer
// multiplier × audio reactivity produces the layered parallax. `countShare`
// splits the total count across layers (must roughly sum to 1). Weights are
// biased toward far layers so the depth dominates the visual.
const CLOUD_LAYERS = [
	{ radiusMin: 2, radiusMax: 6, yRange: 8, scaleMin: 1.0, scaleMax: 2.2, speedMult: 1.9, countShare: 0.18 },
	{ radiusMin: 5, radiusMax: 12, yRange: 12, scaleMin: 1.8, scaleMax: 3.8, speedMult: 1.0, countShare: 0.22 },
	{ radiusMin: 11, radiusMax: 24, yRange: 20, scaleMin: 3.2, scaleMax: 6.5, speedMult: 0.55, countShare: 0.22 },
	{ radiusMin: 22, radiusMax: 48, yRange: 32, scaleMin: 5.5, scaleMax: 11.0, speedMult: 0.28, countShare: 0.20 },
	{ radiusMin: 42, radiusMax: 85, yRange: 50, scaleMin: 9.0, scaleMax: 18.0, speedMult: 0.13, countShare: 0.18 },
]

// Sky + cloud color palettes. Autopilot cycles between them (smooth lerp) when
// colorCycle is on; the GUI dropdown picks one manually when it's off.
// Each preset defines: sky top/bottom gradient, sky's internal FBM cloud tint,
// and the 3D cloud sprite tint.
const COLOR_PRESETS = [
	{
		name: 'Daylight',
		skyTop: new THREE.Color(0x6fb4ff), skyBottom: new THREE.Color(0xbfe1ff),
		skyCloudColor: new THREE.Color(0xffffff), cloudsColor: new THREE.Color(0xffffff),
	},
	{
		name: 'Sunset',
		skyTop: new THREE.Color(0xeca36a), skyBottom: new THREE.Color(0xd895c6),
		skyCloudColor: new THREE.Color(0xf4aea6), cloudsColor: new THREE.Color(0xeba599),
	},
	{
		name: 'Twilight',
		skyTop: new THREE.Color(0x383679), skyBottom: new THREE.Color(0x6c558d),
		skyCloudColor: new THREE.Color(0x78528c), cloudsColor: new THREE.Color(0x58407b),
	},
	// {
	// 	name: 'Storm',
	// 	skyTop: new THREE.Color(0x141b22), skyBottom: new THREE.Color(0x4d5b6b),
	// 	skyCloudColor: new THREE.Color(0xa8b4c0), cloudsColor: new THREE.Color(0x6e7e90),
	// },
	{
		name: 'Aurora',
		skyTop: new THREE.Color(0x041a36), skyBottom: new THREE.Color(0x118a72),
		skyCloudColor: new THREE.Color(0x9affe6), cloudsColor: new THREE.Color(0x55ffd0),
	},
]
const PRESET_HOLD_SECONDS = 22   // dwell on one preset before lerping to the next (at autopilot speed=1)

// Additively merges a bloom-only render target on top of the base scene.
// Used by the selective-bloom pipeline (sky never bloomed; only body radiates).
const BloomMergeShader = {
	uniforms: {
		baseTexture: { value: null },
		bloomTexture: { value: null },
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform sampler2D baseTexture;
		uniform sampler2D bloomTexture;
		varying vec2 vUv;
		void main() {
			gl_FragColor = texture2D( baseTexture, vUv ) + texture2D( bloomTexture, vUv );
		}
	`,
}

// Fullscreen background quad rendered in clip space (vertex bypasses projection),
// so the sky is screen-stable regardless of camera orbit. Vertical UV scroll +
// FBM noise = clouds rising = sensation of falling.
const SkyShader = {
	uniforms: {
		time: { value: 0 },
		cloudScale: { value: 3.0 },
		brightness: { value: 0.95 },
		resolution: { value: new THREE.Vector2(1, 1) },
		skyTop: { value: new THREE.Color(0x6fb4ff) },
		skyBottom: { value: new THREE.Color(0xbfe1ff) },
		cloudColor: { value: new THREE.Color(0xffffff) },
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4( position.xy, 1.0, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform float time;
		uniform float cloudScale;
		uniform float brightness;
		uniform vec2 resolution;
		uniform vec3 skyTop;
		uniform vec3 skyBottom;
		uniform vec3 cloudColor;
		varying vec2 vUv;

		float hash( vec2 p ) {
			return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
		}
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			f = f * f * ( 3.0 - 2.0 * f );
			return mix(
				mix( hash( i ), hash( i + vec2( 1.0, 0.0 ) ), f.x ),
				mix( hash( i + vec2( 0.0, 1.0 ) ), hash( i + vec2( 1.0, 1.0 ) ), f.x ),
				f.y
			);
		}
		float fbm( vec2 p ) {
			float v = 0.0;
			float a = 0.5;
			for ( int i = 0; i < 5; i ++ ) {
				v += a * noise( p );
				p *= 2.0;
				a *= 0.5;
			}
			return v;
		}

		void main() {
			// Aspect correction keeps clouds round; subtracting from y samples lower
			// rows over time, which reads as upward motion.
			vec2 uv = vUv;
			uv.x *= resolution.x / resolution.y;
			uv.y -= time;

			vec3 sky = mix( skyBottom, skyTop, vUv.y );
			float n = fbm( uv * cloudScale );
			float clouds = smoothstep( 0.45, 0.75, n );
			vec3 col = mix( sky, cloudColor * brightness, clouds );
			gl_FragColor = vec4( col, 1.0 );
		}
	`,
}

// Per-cloud billboard quad: soft radial falloff masked by FBM for a puffy,
// non-uniform alpha. Seed uniform varies the noise per instance.
const CloudShader = {
	uniforms: {
		seed: { value: 0 },
		opacity: { value: 0.85 },
		cloudColor: { value: new THREE.Color(0xffffff) },
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform float seed;
		uniform float opacity;
		uniform vec3 cloudColor;
		varying vec2 vUv;

		float hash( vec2 p ) {
			return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
		}
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			f = f * f * ( 3.0 - 2.0 * f );
			return mix(
				mix( hash( i ), hash( i + vec2( 1.0, 0.0 ) ), f.x ),
				mix( hash( i + vec2( 0.0, 1.0 ) ), hash( i + vec2( 1.0, 1.0 ) ), f.x ),
				f.y
			);
		}
		float fbm( vec2 p ) {
			float v = 0.0;
			float a = 0.5;
			for ( int i = 0; i < 4; i ++ ) {
				v += a * noise( p );
				p *= 2.0;
				a *= 0.5;
			}
			return v;
		}

		void main() {
			vec2 uv = vUv - 0.5;
			float r = length( uv ) * 2.0;
			// Radial soft mask (1 at center, 0 at edge) keeps the quad invisible.
			float disk = 1.0 - smoothstep( 0.0, 1.0, r );
			// Per-instance noise sample with seed offset for variation.
			float n = fbm( vUv * 3.0 + vec2( seed * 7.3, seed * 2.1 ) );
			float puff = smoothstep( 0.3, 0.7, n );
			float alpha = disk * puff * opacity;
			if ( alpha < 0.01 ) discard;   // avoid sorting artifacts on near-empty pixels
			gl_FragColor = vec4( cloudColor, alpha );
		}
	`,
}

// Barrel-distortion fisheye. Sampling formula uv = c / (1 + k·r²) magnifies
// the centre and pulls source edges off-screen as k grows; k=0 is identity,
// k<0 reverses to pincushion (corners go out of bounds, clamped to edge).
const FisheyeShader = {
	uniforms: {
		tDiffuse: { value: null },
		strength: { value: 0 },
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		uniform float strength;
		varying vec2 vUv;
		void main() {
			vec2 c = vUv - 0.5;
			float r2 = dot( c, c );
			vec2 uv = c / ( 1.0 + strength * r2 ) + 0.5;
			gl_FragColor = texture2D( tDiffuse, clamp( uv, 0.0, 1.0 ) );
		}
	`,
}

class ErinBenjaminScene {

	constructor(audio) {
		this.audio = audio
		this.renderer = null
		this.scene = null
		this.camera = null
		this.pivot = null
		this.body = null
		this.mat = null
		this.mixer = null
		this.clock = null
		this.fallingClip = null
		this.composer = null
		this.bloomComposer = null   // selective bloom: renders body-only into texture
		this.bloomMergePass = null
		this.bloomPass = null
		this.afterimagePass = null
		this.rgbShiftPass = null
		this.fisheyePass = null
		this.skyMesh = null
		this.skyTime = 0
		this.cloudGroup = null
		this.pane = null
		this.cameraOrbit = { angle: 0, radius: 4.5, baseHeight: 0.95, verticalPhase: 0 }
		this.autopilotPhase = 0
		this.autopilotColor = new THREE.Color()   // scratch- reused per-frame to avoid GC
		this.presetTimer = 0   // seconds spent on current preset (autopilot cycle)
		// Hex mirrors of the currently-selected preset; bound to the "Edit preset" GUI.
		// Initialized from preset 0 to match params.autopilot.preset default.
		this.presetEditor = {
			skyTop: '#' + COLOR_PRESETS[0].skyTop.getHexString(),
			skyBottom: '#' + COLOR_PRESETS[0].skyBottom.getHexString(),
			skyCloudColor: '#' + COLOR_PRESETS[0].skyCloudColor.getHexString(),
			cloudsColor: '#' + COLOR_PRESETS[0].cloudsColor.getHexString(),
		}
		this.params = {
			autopilot: { enabled: true, speed: 0.5, colorCycle: true, preset: 0, switchInterval: PRESET_HOLD_SECONDS },
			body: {
				material: 'normal',
				normal: { wireframe: false, flatShading: false },
				basic: { color: '#ffffff', wireframe: false },
				wireframe: { color: '#ffffff' },
				depth: { wireframe: false },
			},
			camera: { baseSpeed: 0.2, kickMult: 2.0, verticalSpeed: 0.26, verticalAmp: 0.85, verticalVolumeMult: 0.5 },
			sky: {
				enabled: true,
				scrollSpeedBase: 0.36,
				scrollVolumeMult: 0.27,
				scrollKickMult: 0.7,
				cloudScale: 8.0,
				brightnessBase: 0.57,
				brightnessVolumeMult: 0.6,
				topColor: '#6fb4ff',
				bottomColor: '#bfe1ff',
				cloudColor: '#ffffff',
			},
			clouds: {
				enabled: true,
				count: CLOUD_COUNT_DEFAULT,
				riseSpeedBase: 1.6,
				riseVolumeMult: 2.4,
				riseKickMult: 4.0,
				opacity: 0.85,
				color: '#ffffff',
			},
			bloom: { enabled: true, strengthBase: 0.15, volumeMult: 0.50, kickMult: 1.50, radius: 1.50, threshold: 0.10 },
			afterimage: { enabled: true, dampBase: 0.85, kickHardMult: 0.2 },
			rgbShift: { enabled: true, kickMult: 0.005, angle: 1.98 },
			fisheye: { enabled: true, strengthBase: 1.0, volumeMult: 0.2, kickMult: 0.65, kickHardMult: 1.46 },
		}
		this.onResize = this.onResize.bind(this)
	}

	async load() {
		const gltfLoader = new GLTFLoader()
		const fbxLoader = new FBXLoader()
		const safeLoad = (loader, url) => loader.loadAsync(url).catch((err) => {
			console.error(`[erin_benjamin] failed to load ${url}`, err)
			return null
		})
		const [gltf, falling] = await Promise.all([
			safeLoad(gltfLoader, BODY_URL),
			safeLoad(fbxLoader, FALLING_URL),
		])
		this.body = gltf?.scene ?? null
		// The user-provided falling.fbx is the intended animation; body.glb may also
		// embed a T-pose/idle clip we want to ignore.
		const fbxClip = falling?.animations?.[0] ?? null
		const gltfClip = gltf?.animations?.[0] ?? null
		this.fallingClip = fbxClip ?? gltfClip
		console.log(`[erin_benjamin] clip source: ${fbxClip ? 'falling.fbx' : gltfClip ? 'body.glb (fallback)' : 'none'}`)
		if (!this.body) console.error('[erin_benjamin] body missing- scene will render empty')
		if (!this.fallingClip) console.warn('[erin_benjamin] no animation clip found')
	}

	init() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true })
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
		this.renderer.setSize(innerWidth, innerHeight)
		document.body.appendChild(this.renderer.domElement)

		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000)
		// Initial pose- update() recomputes from cameraOrbit each frame
		const { angle, radius, baseHeight } = this.cameraOrbit
		this.camera.position.set(Math.sin(angle) * radius, baseHeight, Math.cos(angle) * radius)
		this.camera.lookAt(0, 0, 0)

		this.initSky()
		this.initClouds()

		this.pivot = new THREE.Group()
		this.scene.add(this.pivot)

		if (this.body) {
			this.normalizeBody()

			let meshCount = 0
			this.body.traverse((child) => {
				if (child.isMesh || child.isSkinnedMesh) {
					child.frustumCulled = false   // SkinnedMesh bounds in bind pose can clip the model out
					child.layers.enable(BLOOM_LAYER)   // keeps default layer 0 + adds bloom layer
					meshCount++
				}
			})
			this.setBodyMaterial(this.params.body.material)
			console.log(`[erin_benjamin] body: ${meshCount} mesh(es)`)
			if (meshCount === 0) console.warn('[erin_benjamin] body has no renderable meshes (skeleton only?)')

			this.pivot.add(this.body)

			if (this.fallingClip) {
				this.remapClipToBody()
				this.mixer = new THREE.AnimationMixer(this.body)
				this.mixer.clipAction(this.fallingClip).play()
				this.diagnoseRetarget()
			}
		}

		this.initPostprocessing()
		this.initGUI()

		addEventListener('resize', this.onResize)
	}

	initGUI() {
		// Standalone-only: in host iframes Analyzer runs in 'receive' mode.
		// (audio.player would be a wrong gate- it's lazy-created only after
		// the first user gesture, well after init().)
		if (this.audio?.mode !== 'live') return
		this.pane = new Pane({ title: 'Postprocessing' })

		const auto = this.pane.addFolder({ title: 'Autopilot' })
		auto.addBinding(this.params.autopilot, 'enabled')
		auto.addBinding(this.params.autopilot, 'speed', { min: 0, max: 3, step: 0.01 })
		auto.addBinding(this.params.autopilot, 'colorCycle')
		auto.addBinding(this.params.autopilot, 'switchInterval', { min: 2, max: 60, step: 0.5 })
		// Manual preset selector- overridden live when colorCycle is on (the cycle
		// keeps writing into the uniforms each frame).
		const presetOptions = Object.fromEntries(COLOR_PRESETS.map((pst, i) => [pst.name, i]))
		auto.addBinding(this.params.autopilot, 'preset', { options: presetOptions })
			.on('change', (ev) => {
				this.presetTimer = 0   // restart dwell window from this preset
				this.applyColorPreset(ev.value)
			})

		// Edit the currently-selected preset live. Edits persist into COLOR_PRESETS
		// so the autopilot cycle picks up the new values on the next loop.
		const edit = auto.addFolder({ title: 'Edit preset', expanded: false })
		edit.addBinding(this.presetEditor, 'skyTop', { view: 'color' }).on('change', () => this.editPresetColor('skyTop'))
		edit.addBinding(this.presetEditor, 'skyBottom', { view: 'color' }).on('change', () => this.editPresetColor('skyBottom'))
		edit.addBinding(this.presetEditor, 'skyCloudColor', { view: 'color' }).on('change', () => this.editPresetColor('skyCloudColor'))
		edit.addBinding(this.presetEditor, 'cloudsColor', { view: 'color' }).on('change', () => this.editPresetColor('cloudsColor'))

		const bodyFolder = this.pane.addFolder({ title: 'Body' })
		bodyFolder.addBinding(this.params.body, 'material', {
			options: { normal: 'normal', basic: 'basic', wireframe: 'wireframe', depth: 'depth' },
		}).on('change', (ev) => {
			this.setBodyMaterial(ev.value)
			this.refreshBodyMatBindings()
		})

		// Live updates: per-type bindings mutate the active material directly when
		// it matches; switching types rebuilds the material from these stored params,
		// so each preset keeps its own state across toggles.
		const onProp = (prop, src) => () => {
			if (this.mat && prop in this.mat) this.mat[prop] = src[prop]
		}
		const onColor = (src) => () => {
			if (this.mat?.color) this.mat.color.set(src.color)
		}
		const onFlat = (src) => () => {
			if (!this.mat || !('flatShading' in this.mat)) return
			this.mat.flatShading = src.flatShading
			this.mat.needsUpdate = true   // shader recompile- flatShading is a #define
		}

		const b = this.params.body
		this.bodyMatBindings = {
			normal: [
				bodyFolder.addBinding(b.normal, 'wireframe').on('change', onProp('wireframe', b.normal)),
				bodyFolder.addBinding(b.normal, 'flatShading').on('change', onFlat(b.normal)),
			],
			basic: [
				bodyFolder.addBinding(b.basic, 'color', { view: 'color' }).on('change', onColor(b.basic)),
				bodyFolder.addBinding(b.basic, 'wireframe').on('change', onProp('wireframe', b.basic)),
			],
			wireframe: [
				bodyFolder.addBinding(b.wireframe, 'color', { view: 'color' }).on('change', onColor(b.wireframe)),
			],
			depth: [
				bodyFolder.addBinding(b.depth, 'wireframe').on('change', onProp('wireframe', b.depth)),
			],
		}
		this.refreshBodyMatBindings()

		const cam = this.pane.addFolder({ title: 'Camera' })
		cam.addBinding(this.params.camera, 'baseSpeed', { min: 0, max: 2, step: 0.01 })
		cam.addBinding(this.params.camera, 'kickMult', { min: 0, max: 20, step: 0.1 })
		cam.addBinding(this.params.camera, 'verticalSpeed', { min: 0, max: 2, step: 0.01 })
		cam.addBinding(this.params.camera, 'verticalAmp', { min: 0, max: 6, step: 0.05 })
		cam.addBinding(this.params.camera, 'verticalVolumeMult', { min: 0, max: 4, step: 0.05 })
		cam.addBinding(this.cameraOrbit, 'radius', { min: 1, max: 10, step: 0.1 })
		cam.addBinding(this.cameraOrbit, 'baseHeight', { min: -6, max: 8, step: 0.05 })

		const sky = this.pane.addFolder({ title: 'Sky' })
		sky.addBinding(this.params.sky, 'enabled')
		sky.addBinding(this.params.sky, 'scrollSpeedBase', { min: 0, max: 0.5, step: 0.005 })
		sky.addBinding(this.params.sky, 'scrollVolumeMult', { min: 0, max: 1, step: 0.01 })
		sky.addBinding(this.params.sky, 'scrollKickMult', { min: 0, max: 3, step: 0.05 })
		sky.addBinding(this.params.sky, 'cloudScale', { min: 0.5, max: 10, step: 0.1 })
		sky.addBinding(this.params.sky, 'brightnessBase', { min: 0, max: 1.5, step: 0.01 })
		sky.addBinding(this.params.sky, 'brightnessVolumeMult', { min: 0, max: 1.5, step: 0.01 })
		sky.addBinding(this.params.sky, 'topColor', { view: 'color' }).on('change', (ev) => {
			this.skyMesh?.material.uniforms.skyTop.value.set(ev.value)
		})
		sky.addBinding(this.params.sky, 'bottomColor', { view: 'color' }).on('change', (ev) => {
			this.skyMesh?.material.uniforms.skyBottom.value.set(ev.value)
		})
		sky.addBinding(this.params.sky, 'cloudColor', { view: 'color' }).on('change', (ev) => {
			this.skyMesh?.material.uniforms.cloudColor.value.set(ev.value)
		})

		const clouds = this.pane.addFolder({ title: 'Clouds' })
		clouds.addBinding(this.params.clouds, 'enabled')
		clouds.addBinding(this.params.clouds, 'count', { min: 0, max: 200, step: 1 }).on('change', (ev) => {
			if (ev.last) this.rebuildClouds()   // rebuild only on release, not every tick
		})
		clouds.addBinding(this.params.clouds, 'riseSpeedBase', { min: 0, max: 6, step: 0.05 })
		clouds.addBinding(this.params.clouds, 'riseVolumeMult', { min: 0, max: 8, step: 0.05 })
		clouds.addBinding(this.params.clouds, 'riseKickMult', { min: 0, max: 12, step: 0.1 })
		clouds.addBinding(this.params.clouds, 'opacity', { min: 0, max: 1, step: 0.01 })
		clouds.addBinding(this.params.clouds, 'color', { view: 'color' }).on('change', (ev) => {
			// Per-cloud material clones- propagate to every instance's uniform.
			if (!this.cloudGroup) return
			for (const cloud of this.cloudGroup.children) cloud.material.uniforms.cloudColor.value.set(ev.value)
		})

		const bloom = this.pane.addFolder({ title: 'Bloom' })
		bloom.addBinding(this.params.bloom, 'enabled')
		bloom.addBinding(this.params.bloom, 'strengthBase', { min: 0, max: 3, step: 0.01 })
		bloom.addBinding(this.params.bloom, 'volumeMult', { min: 0, max: 3, step: 0.01 })
		bloom.addBinding(this.params.bloom, 'kickMult', { min: 0, max: 3, step: 0.01 })
		bloom.addBinding(this.params.bloom, 'radius', { min: 0, max: 2, step: 0.01 })
		bloom.addBinding(this.params.bloom, 'threshold', { min: 0, max: 1, step: 0.01 })

		const after = this.pane.addFolder({ title: 'Afterimage' })
		after.addBinding(this.params.afterimage, 'enabled')
		after.addBinding(this.params.afterimage, 'dampBase', { min: 0, max: 0.99, step: 0.01 })
		after.addBinding(this.params.afterimage, 'kickHardMult', { min: 0, max: 0.2, step: 0.005 })

		const rgb = this.pane.addFolder({ title: 'RGB Shift' })
		rgb.addBinding(this.params.rgbShift, 'enabled')
		rgb.addBinding(this.params.rgbShift, 'kickMult', { min: 0, max: 0.02, step: 0.0005 })
		rgb.addBinding(this.params.rgbShift, 'angle', { min: 0, max: Math.PI * 2, step: 0.01 })

		const fish = this.pane.addFolder({ title: 'Fisheye' })
		fish.addBinding(this.params.fisheye, 'enabled')
		fish.addBinding(this.params.fisheye, 'strengthBase', { min: -0.5, max: 2, step: 0.01 })
		fish.addBinding(this.params.fisheye, 'volumeMult', { min: 0, max: 1, step: 0.01 })
		fish.addBinding(this.params.fisheye, 'kickMult', { min: 0, max: 1, step: 0.01 })
		fish.addBinding(this.params.fisheye, 'kickHardMult', { min: 0, max: 2, step: 0.01 })
	}

	initSky() {
		const geometry = new THREE.PlaneGeometry(2, 2)
		const material = new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(SkyShader.uniforms),
			vertexShader: SkyShader.vertexShader,
			fragmentShader: SkyShader.fragmentShader,
			depthTest: false,
			depthWrite: false,
		})
		material.uniforms.resolution.value.set(innerWidth, innerHeight)
		material.uniforms.skyTop.value.set(this.params.sky.topColor)
		material.uniforms.skyBottom.value.set(this.params.sky.bottomColor)
		material.uniforms.cloudColor.value.set(this.params.sky.cloudColor)
		this.skyMesh = new THREE.Mesh(geometry, material)
		this.skyMesh.renderOrder = -1   // draws before body- depth disabled so body still occludes
		this.skyMesh.frustumCulled = false
		this.scene.add(this.skyMesh)
	}

	initClouds() {
		this.cloudGroup = new THREE.Group()
		// World-space (not pivot) so the pivot's audio-driven scale doesn't pulse them.
		this.scene.add(this.cloudGroup)
		// Shared geometry- only materials clone per instance (unique seed/color uniforms).
		this.cloudGeometry = new THREE.PlaneGeometry(1, 1)
		this.populateClouds()
	}

	populateClouds() {
		const total = this.params.clouds.count
		// Distribute total across layers per countShare; round each, push leftover into
		// last layer so the exact total is respected.
		const perLayer = CLOUD_LAYERS.map((L) => Math.floor(total * L.countShare))
		const assigned = perLayer.reduce((s, n) => s + n, 0)
		perLayer[perLayer.length - 1] += total - assigned

		for (let li = 0; li < CLOUD_LAYERS.length; li++) {
			const layer = CLOUD_LAYERS[li]
			for (let i = 0; i < perLayer[li]; i++) {
				const material = new THREE.ShaderMaterial({
					uniforms: THREE.UniformsUtils.clone(CloudShader.uniforms),
					vertexShader: CloudShader.vertexShader,
					fragmentShader: CloudShader.fragmentShader,
					transparent: true,
					depthWrite: false,
				})
				material.uniforms.seed.value = Math.random()
				material.uniforms.cloudColor.value.set(this.params.clouds.color)
				material.uniforms.opacity.value = this.params.clouds.opacity
				const mesh = new THREE.Mesh(this.cloudGeometry, material)
				const angle = Math.random() * Math.PI * 2
				const radius = layer.radiusMin + Math.random() * (layer.radiusMax - layer.radiusMin)
				const y = (Math.random() * 2 - 1) * layer.yRange
				const scale = layer.scaleMin + Math.random() * (layer.scaleMax - layer.scaleMin)
				mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
				mesh.scale.setScalar(scale)
				// Stash layer index- needed at recycle time to respawn in the same band
				// and at update time to apply per-layer speed multiplier.
				mesh.userData.layerIndex = li
				this.cloudGroup.add(mesh)
			}
		}
	}

	rebuildClouds() {
		if (!this.cloudGroup) return
		// Dispose per-instance materials- shared geometry stays alive.
		for (const cloud of this.cloudGroup.children) cloud.material.dispose()
		this.cloudGroup.clear()
		this.populateClouds()
	}

	// Snap to a named preset and sync params + GUI. Used for manual selection.
	applyColorPreset(idx) {
		const preset = COLOR_PRESETS[idx]
		if (!preset) return
		this.applyColorMix(preset, preset, 0)
		// Sync hex params so the Sky/Clouds color pickers reflect the new state.
		this.params.sky.topColor = '#' + preset.skyTop.getHexString()
		this.params.sky.bottomColor = '#' + preset.skyBottom.getHexString()
		this.params.sky.cloudColor = '#' + preset.skyCloudColor.getHexString()
		this.params.clouds.color = '#' + preset.cloudsColor.getHexString()
		this.syncPresetEditor(idx)
		this.pane?.refresh()
	}

	// Mirror the selected preset's THREE.Color values into the editor hex proxy.
	// Called when the dropdown changes; the GUI then refresh()'s to show new swatches.
	syncPresetEditor(idx) {
		const preset = COLOR_PRESETS[idx]
		if (!preset) return
		this.presetEditor.skyTop = '#' + preset.skyTop.getHexString()
		this.presetEditor.skyBottom = '#' + preset.skyBottom.getHexString()
		this.presetEditor.skyCloudColor = '#' + preset.skyCloudColor.getHexString()
		this.presetEditor.cloudsColor = '#' + preset.cloudsColor.getHexString()
	}

	// Persist an editor hex back into the active preset's THREE.Color, then snap
	// uniforms so the change is visible immediately (overridden next frame if the
	// autopilot color cycle is running- toggle colorCycle off while editing).
	editPresetColor(key) {
		const idx = this.params.autopilot.preset
		const preset = COLOR_PRESETS[idx]
		if (!preset) return
		preset[key].set(this.presetEditor[key])
		this.applyColorPreset(idx)   // snap + sync both Sky/Clouds pickers and editor
	}

	// Lerp uniforms between two presets at factor f (0=A, 1=B). Called per-frame
	// by the autopilot color cycle; with A===B and f=0 it just snaps to A.
	applyColorMix(A, B, f) {
		if (this.skyMesh) {
			const u = this.skyMesh.material.uniforms
			u.skyTop.value.copy(A.skyTop).lerp(B.skyTop, f)
			u.skyBottom.value.copy(A.skyBottom).lerp(B.skyBottom, f)
			u.cloudColor.value.copy(A.skyCloudColor).lerp(B.skyCloudColor, f)
		}
		if (this.cloudGroup) {
			const mixed = this.autopilotColor.copy(A.cloudsColor).lerp(B.cloudsColor, f)
			for (const cloud of this.cloudGroup.children) cloud.material.uniforms.cloudColor.value.copy(mixed)
		}
	}

	// Cylindrical billboard: rotate only around world Y to face camera. Keeps clouds
	// upright (no roll) even when the camera bobs, which matches "real" cloud sprites.
	billboardClouds() {
		if (!this.cloudGroup || !this.camera) return
		const cx = this.camera.position.x
		const cz = this.camera.position.z
		for (const cloud of this.cloudGroup.children) {
			cloud.rotation.y = Math.atan2(cx - cloud.position.x, cz - cloud.position.z)
		}
	}

	initPostprocessing() {
		this.bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.6, 0.0)   // strength, radius, threshold

		// Bloom composer: renders only BLOOM_LAYER (body) into a render target.
		// Camera layer mask is flipped per-frame in update() so the sky is excluded.
		this.bloomComposer = new EffectComposer(this.renderer)
		this.bloomComposer.setPixelRatio(Math.min(devicePixelRatio, 2))
		this.bloomComposer.setSize(innerWidth, innerHeight)
		this.bloomComposer.renderToScreen = false
		this.bloomComposer.addPass(new RenderPass(this.scene, this.camera))
		this.bloomComposer.addPass(this.bloomPass)

		// Main composer
		this.composer = new EffectComposer(this.renderer)
		this.composer.setPixelRatio(Math.min(devicePixelRatio, 2))
		this.composer.setSize(innerWidth, innerHeight)

		const renderPass = new RenderPass(this.scene, this.camera)
		this.afterimagePass = new AfterimagePass(0.85)   // damp- updated per-frame
		this.bloomMergePass = new ShaderPass(new THREE.ShaderMaterial({
			uniforms: {
				baseTexture: { value: null },   // wired by ShaderPass via textureID below
				bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
			},
			vertexShader: BloomMergeShader.vertexShader,
			fragmentShader: BloomMergeShader.fragmentShader,
		}), 'baseTexture')
		this.rgbShiftPass = new ShaderPass(RGBShiftShader)
		this.rgbShiftPass.uniforms.amount.value = 0
		this.fisheyePass = new ShaderPass(FisheyeShader)   // last lens before output
		const outputPass = new OutputPass()   // tone mapping + sRGB- required after bloom

		this.composer.addPass(renderPass)
		this.composer.addPass(this.afterimagePass)
		this.composer.addPass(this.bloomMergePass)
		this.composer.addPass(this.rgbShiftPass)
		this.composer.addPass(this.fisheyePass)
		this.composer.addPass(outputPass)
	}

	remapClipToBody() {
		// Body bones may carry a numeric suffix (e.g. "MaleBaseMeshHips_01") absent
		// from the clip's track names ("MaleBaseMeshHips"). Build a stripped-key map
		// then rewrite each track name to the matching body bone.
		const bodyByStrippedName = new Map()
		this.body.traverse((o) => {
			if (!o.isBone) return
			const stripped = o.name.replace(/_\d+$/, '')
			if (!bodyByStrippedName.has(stripped)) bodyByStrippedName.set(stripped, o.name)
		})
		let remapped = 0
		for (const track of this.fallingClip.tracks) {
			const lastDot = track.name.lastIndexOf('.')
			if (lastDot < 0) continue
			const trackBone = track.name.slice(0, lastDot)
			const prop = track.name.slice(lastDot)
			const mapped = bodyByStrippedName.get(trackBone)
			if (mapped && mapped !== trackBone) {
				track.name = mapped + prop
				remapped++
			}
		}
		console.log(`[erin_benjamin] remapped ${remapped}/${this.fallingClip.tracks.length} tracks to body bones`)
	}

	diagnoseRetarget() {
		const clip = this.fallingClip
		const bodyBones = new Set()
		this.body.traverse((o) => { if (o.isBone) bodyBones.add(o.name) })
		const clipTargets = new Set(clip.tracks.map((t) => t.name.split('.')[0]))
		const matched = [...clipTargets].filter((n) => bodyBones.has(n)).length
		console.log(`[erin_benjamin] clip "${clip.name}" - ${clip.duration.toFixed(2)}s, ${clip.tracks.length} tracks`)
		console.log(`[erin_benjamin] body has ${bodyBones.size} bones, clip targets ${clipTargets.size} bones, ${matched} match`)
		if (matched === 0) {
			console.error('[erin_benjamin] zero matching bones- animation will not affect body. Sample names:')
			console.error('  body bones:', [...bodyBones].slice(0, 6))
			console.error('  clip targets:', [...clipTargets].slice(0, 6))
		}
	}

	setBodyMaterial(type) {
		if (!this.body) return
		const next = this.createBodyMaterial(type)
		if (!next) return
		this.body.traverse((child) => {
			if (child.isMesh || child.isSkinnedMesh) child.material = next
		})
		if (this.mat && this.mat !== next) this.mat.dispose()
		this.mat = next
	}

	createBodyMaterial(type) {
		const b = this.params.body
		switch (type) {
			case 'normal': return new THREE.MeshNormalMaterial({ wireframe: b.normal.wireframe, flatShading: b.normal.flatShading })
			case 'basic': return new THREE.MeshBasicMaterial({ color: b.basic.color, wireframe: b.basic.wireframe })
			case 'wireframe': return new THREE.MeshBasicMaterial({ color: b.wireframe.color, wireframe: true })
			case 'depth': return new THREE.MeshDepthMaterial({ wireframe: b.depth.wireframe })
			default:
				console.warn(`[erin_benjamin] unknown material type "${type}"- falling back to normal`)
				return new THREE.MeshNormalMaterial()
		}
	}

	refreshBodyMatBindings() {
		if (!this.bodyMatBindings) return
		const active = this.params.body.material
		for (const [key, list] of Object.entries(this.bodyMatBindings)) {
			for (const binding of list) binding.hidden = key !== active
		}
	}

	// Layered LFOs over the static-feeling params. Writes go directly into the params
	// struct (and into uniforms for colors), so the audio-reactive update() logic
	// composes on top: autopilot sets the slow baseline, audio adds beat-driven spikes.
	// Disabling autopilot lets the manual GUI values take over again instantly.
	updateAutopilot(dt) {
		this.autopilotPhase += dt * this.params.autopilot.speed
		const phase = this.autopilotPhase
		// Normalized sine [-1, 1] and [0, 1] helpers- period in seconds (at speed=1).
		const osc = (period, off = 0) => Math.sin(phase * (Math.PI * 2) / period + off)
		const osc01 = (period, off = 0) => osc(period, off) * 0.5 + 0.5

		const p = this.params

		// Camera framing- slow orbit-radius breath + height drift + amp sweep.
		// Different periods avoid Lissajous lock-in; the eye reads it as wandering.
		this.cameraOrbit.radius = 4.8 + osc(32, 0.0) * 1.8
		this.cameraOrbit.baseHeight = 0.6 + osc(27, 1.7) * 1.5
		p.camera.verticalAmp = 0.4 + osc01(19, 0.4) * 0.9

		// Sky atmosphere- scale + brightness baseline pulse.
		p.sky.cloudScale = 6.0 + osc(40, 0.2) * 3.0
		p.sky.brightnessBase = 0.55 + osc01(22, 2.1) * 0.4

		// Cloud field veil density.
		p.clouds.opacity = 0.75 + osc(14, 1.1) * 0.2

		// Lens dynamics- bloom shape + lens distortion + RGB rotation.
		p.bloom.radius = 0.35 + osc(18, 0.6) * 0.2
		p.bloom.threshold = 0.15 + osc01(24, 0.9) * 0.15
		p.fisheye.strengthBase = 0.6 + osc(28, 2.4) * 0.6
		p.rgbShift.angle = (phase * 0.4) % (Math.PI * 2)

		if (!p.autopilot.colorCycle) return

		// Preset cycle: dwell `switchInterval` seconds on each preset, smooth-lerp to
		// the next. `params.autopilot.preset` is the SOURCE OF TRUTH for the current
		// preset and is advanced + reflected in the GUI dropdown as the cycle ticks-
		// so the user always sees which preset is active. Manual dropdown picks reset
		// the timer (see the GUI handler) so the lerp starts fresh from the chosen one.
		const interval = Math.max(0.5, p.autopilot.switchInterval)
		this.presetTimer += dt * p.autopilot.speed
		if (this.presetTimer >= interval) {
			this.presetTimer -= interval
			p.autopilot.preset = (p.autopilot.preset + 1) % COLOR_PRESETS.length
			this.syncPresetEditor(p.autopilot.preset)
			this.pane?.refresh()
		}
		const cur = p.autopilot.preset
		const nxt = (cur + 1) % COLOR_PRESETS.length
		const f = this.presetTimer / interval
		const smooth = f * f * (3 - 2 * f)   // ease so each preset feels held, not constantly drifting
		this.applyColorMix(COLOR_PRESETS[cur], COLOR_PRESETS[nxt], smooth)
	}

	normalizeBody() {
		// Mixamo-style FBX is typically ~100 units tall- scale to TARGET_HEIGHT, recenter.
		const box = new THREE.Box3().setFromObject(this.body)
		const size = box.getSize(new THREE.Vector3())
		console.log(`[erin_benjamin] body raw size: ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}`)
		if (size.y > 0) this.body.scale.setScalar(TARGET_HEIGHT / size.y)
		else console.warn('[erin_benjamin] body has zero height- skipping normalization')
		box.setFromObject(this.body)
		const center = box.getCenter(new THREE.Vector3())
		this.body.position.sub(center)
	}

	onResize() {
		if (!this.camera || !this.renderer) return
		this.camera.aspect = innerWidth / innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(innerWidth, innerHeight)
		if (this.composer) this.composer.setSize(innerWidth, innerHeight)
		if (this.bloomComposer) this.bloomComposer.setSize(innerWidth, innerHeight)
		if (this.skyMesh) this.skyMesh.material.uniforms.resolution.value.set(innerWidth, innerHeight)
	}

	warmup() {
		if (this.composer) this.composer.render()
		else this.renderer.render(this.scene, this.camera)
	}

	play() {
		this.clock = new THREE.Clock()   // fresh delta on every resume- no jump after a long stop()
		this.renderer.setAnimationLoop((t) => this.update(t))
	}

	stop() {
		this.renderer.setAnimationLoop(null)
	}

	update(t) {
		const a = this.audio // volume · volumeSmooth · kick · kickHard · volumeByFrequency
		const dt = this.clock.getDelta()
		if (this.mixer) this.mixer.update(dt)

		// Autopilot first- mutates params so the audio-reactive logic below adds on top.
		if (this.params.autopilot.enabled) this.updateAutopilot(dt)

		if (this.pivot) {
			this.pivot.scale.setScalar(1 + a.volume * 0.4 + a.kick * 0.25)
		}

		const p = this.params

		// Orbit camera around the body- base speed + kick-driven impulses.
		// Integrating into angular *velocity* (not angle directly) keeps motion
		// smooth: a.kick spikes then decays, so each beat reads as an accelerator
		// rather than a teleport. Vertical motion: slow sine bob + volume push.
		// lookAt(0,0,0) is fixed so the body stays framed as the cam rises/falls.
		if (this.camera) {
			this.cameraOrbit.angle += dt * (p.camera.baseSpeed + a.kick * p.camera.kickMult)
			this.cameraOrbit.verticalPhase += dt * p.camera.verticalSpeed
			const { angle, radius, baseHeight, verticalPhase } = this.cameraOrbit
			const height = baseHeight + Math.sin(verticalPhase) * p.camera.verticalAmp + a.volumeSmooth * p.camera.verticalVolumeMult
			this.camera.position.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius)
			this.camera.lookAt(0, 0, 0)
		}
		if (this.skyMesh) {
			this.skyMesh.visible = p.sky.enabled
			// Integrate speed·dt (not raw clock time) so kick spikes register as
			// transient accelerators, mirroring the cameraOrbit.angle pattern above.
			this.skyTime += dt * (p.sky.scrollSpeedBase + a.volumeSmooth * p.sky.scrollVolumeMult + a.kick * p.sky.scrollKickMult)
			const u = this.skyMesh.material.uniforms
			u.time.value = this.skyTime
			u.cloudScale.value = p.sky.cloudScale
			u.brightness.value = p.sky.brightnessBase + a.volumeSmooth * p.sky.brightnessVolumeMult
		}
		if (this.cloudGroup) {
			this.cloudGroup.visible = p.clouds.enabled
			if (p.clouds.enabled) {
				// World-space rise scaled by per-layer speedMult: near layers run faster
				// than far ones, multiplying the natural perspective parallax into a true
				// layered effect. Each cloud recycles within its own band so layers stay
				// visually coherent over time.
				const baseRise = p.clouds.riseSpeedBase + a.volumeSmooth * p.clouds.riseVolumeMult + a.kick * p.clouds.riseKickMult
				const baseDy = dt * baseRise
				for (const cloud of this.cloudGroup.children) {
					const layer = CLOUD_LAYERS[cloud.userData.layerIndex]
					cloud.position.y += baseDy * layer.speedMult
					if (cloud.position.y > layer.yRange) {
						cloud.position.y = -layer.yRange
						const angle = Math.random() * Math.PI * 2
						const radius = layer.radiusMin + Math.random() * (layer.radiusMax - layer.radiusMin)
						cloud.position.x = Math.cos(angle) * radius
						cloud.position.z = Math.sin(angle) * radius
					}
					cloud.material.uniforms.opacity.value = p.clouds.opacity
				}
				this.billboardClouds()
			}
		}
		if (this.bloomPass) {
			// bloomPass lives in bloomComposer- merge pass gates the visual on/off.
			this.bloomPass.strength = p.bloom.strengthBase + a.volume * p.bloom.volumeMult + a.kick * p.bloom.kickMult
			this.bloomPass.radius = p.bloom.radius
			this.bloomPass.threshold = p.bloom.threshold
		}
		if (this.bloomMergePass) this.bloomMergePass.enabled = p.bloom.enabled
		if (this.afterimagePass) {
			this.afterimagePass.enabled = p.afterimage.enabled
			this.afterimagePass.uniforms.damp.value = Math.min(0.96, p.afterimage.dampBase + a.kickHard * p.afterimage.kickHardMult)
		}
		if (this.rgbShiftPass) {
			this.rgbShiftPass.enabled = p.rgbShift.enabled
			this.rgbShiftPass.uniforms.amount.value = a.kick * p.rgbShift.kickMult
			this.rgbShiftPass.uniforms.angle.value = p.rgbShift.angle
		}
		if (this.fisheyePass) {
			this.fisheyePass.enabled = p.fisheye.enabled
			this.fisheyePass.uniforms.strength.value = p.fisheye.strengthBase + a.volume * p.fisheye.volumeMult + a.kick * p.fisheye.kickMult + a.kickHard * p.fisheye.kickHardMult
		}

		if (this.composer) {
			// Selective bloom: render only the body layer into bloomComposer's target,
			// then run the main composer which merges that bloom on top of the full scene.
			// Skip the bloom render when disabled- mergePass.enabled is also false so the
			// stale texture from the last enabled frame is not added.
			if (this.bloomComposer && p.bloom.enabled) {
				this.camera.layers.set(BLOOM_LAYER)
				this.bloomComposer.render()
				this.camera.layers.set(0)
			}
			this.composer.render(dt)
		} else {
			this.renderer.render(this.scene, this.camera)
		}
	}

}

const audio = new Analyzer()
const scene = new ErinBenjaminScene(audio)

const PREFERRED_TRACK = /tame/i

// Redirect the SoundPlayer's first useTrack() call to our preferred track,
// so the default never starts playing in parallel.
function patchPreferredTrack() {
	const player = audio.player
	if (!player) { setTimeout(patchPreferredTrack, 20); return }
	if (player._preferredPatched) return
	player._preferredPatched = true
	const original = player.useTrack
	player.useTrack = (url, startTime = 0) => {
		player.useTrack = original   // one-shot: subsequent calls are untouched
		if (player.tracks?.length) {
			const idx = player.trackNames.findIndex((n) => PREFERRED_TRACK.test(n))
			if (idx >= 0) {
				player.trackIndex = idx
				url = player.tracks[idx]
			}
		}
		return original(url, startTime)
	}
}

audio.onLoad(async () => {
	await scene.load()
	scene.init()
})
audio.onWarmup(() => scene.warmup())
audio.onPlay(() => {
	scene.play()
	patchPreferredTrack()   // standalone only- no-op when embedded (audio.player is undefined in host mode)
})
audio.onStop(() => scene.stop())
