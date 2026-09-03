import * as THREE from 'three'

import AudioFeatures from './audioFeatures.js'
import Autopilot from './autopilot.js'
import Body from './body.js'
import CameraRig from './cameraRig.js'
import Clouds from './clouds.js'
import { createDefaultParams, pickPreset } from './config.js'
import Crowd from './crowd.js'
import DebugView from './debugView.js'
import Director from './director.js'
import DropTimeline from './dropTimeline.js'
import MusicEvents from './events.js'
import Gui from './gui.js'
import Motes from './motes.js'
import PostFX from './postfx.js'
import Rays from './rays.js'
import Sky from './sky.js'
import SpeedLines from './speedLines.js'
import Twin from './twin.js'
import Wind from './wind.js'

// Orchestrator: owns the renderer + the shared params tree, wires the modules
// together and drives the Analyzer lifecycle (load → init/warmup → play/stop).
export default class ErinBenjaminScene {

	constructor(audio) {
		this.audio = audio
		this.params = createDefaultParams()
		this.features = new AudioFeatures(this.params)
		this.dropTimeline = new DropTimeline(audio)   // early: the overrides fetch starts now
		this.wind = new Wind(this.params)
		this.body = new Body(this.params)
		this.renderer = null
		this.scene = null
		this.pivot = null
		this.clock = null
		this.cameraRig = null
		this.sky = null
		this.clouds = null
		this.postfx = null
		this.autopilot = null
		this.gui = null
		this.onResize = this.onResize.bind(this)
	}

	async load() {
		await this.body.load()
	}

	init() {
		this.renderer = new THREE.WebGLRenderer({ antialias: false }) // no MSAA- every frame goes through EffectComposer targets, the canvas only shows the OutputPass quad
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.params.quality.renderScale))
		this.renderer.setSize(innerWidth, innerHeight)
		document.body.appendChild(this.renderer.domElement)

		this.scene = new THREE.Scene()
		this.cameraRig = new CameraRig(this.params)
		this.sky = new Sky(this.scene, this.params)
		this.clouds = new Clouds(this.scene, this.params)
		this.speedLines = new SpeedLines(this.scene, this.params)
		this.motes = new Motes(this.scene, this.params)
		this.rays = new Rays(this.scene, this.params)

		this.pivot = new THREE.Group()
		this.scene.add(this.pivot)
		this.body.init(this.pivot)
		this.cameraRig.body = this.body   // head anchor for the director's face shot
		this.cameraRig.lookTarget = this.pivot   // orbit shots follow the drifting body, not the origin
		// Clone pool for the crowdfall event- built from the normalized body, so
		// it must come after body.init().
		this.crowd = new Crowd(this.params)
		this.crowd.init(this.scene, this.body)
		this.twin = new Twin(this.params)
		this.twin.init(this.scene, this.body, this.pivot)

		this.postfx = new PostFX(this.renderer, this.scene, this.cameraRig.camera, this.params)
		// The echo copies nest around the body's screen position. The hips bone
		// is his visual center in the CURRENT pose- the animation swings the
		// body around the pivot, and on close shots that world offset is a huge
		// screen offset. Pivot only as a fallback if the rig has no such bone.
		this.postfx.echoAnchor = this.body.hipsBone ?? this.pivot
		this.postfx.multiCamPass.anchor = this.body.hipsBone ?? this.pivot   // the orbit feeds look AT him too
		// The echo copies never repeat the clones or the twin- hero only.
		this.postfx.echoExclude = [this.crowd.group, this.twin.wrapper].filter(Boolean)
		this.director = new Director(this.params, this.cameraRig)
		this.events = new MusicEvents(this.params, this.body, this.director)
		this.autopilot = new Autopilot(this.params, this.sky, this.clouds, this.body)
		this.gui = new Gui(this)
		this.autopilot.onPresetAdvanced = (idx) => this.gui.onPresetAdvanced(idx)
		this.debugView = new DebugView(this.renderer, this.scene, this.cameraRig.camera)

		addEventListener('resize', this.onResize)
		addEventListener('keydown', (e) => {
			if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
				e.preventDefault()
				this.debugView.toggle()
			}
		})
	}

	warmup() {
		this.postfx.warmup()
	}

	play() {
		this.clock = new THREE.Clock()   // fresh delta on every resume- no jump after a long stop()
		// Signature entrance- fires on EVERY activation (each time the host loop
		// brings the scene back on screen, and the standalone start): a fresh
		// random palette, a dive-in dolly, and a soft burst (0.85 stays under the
		// 0.9 rising edge, so it flashes and shocks WITHOUT re-switching the
		// palette we just picked).
		this.params.autopilot.preset = pickPreset(this.params.autopilot.preset)   // weighted rarity draw
		this.autopilot.resetPresetTimer()
		this.gui.onPresetAdvanced(this.params.autopilot.preset)
		this.director.entrance()
		this.features.dropPulse = 0.85
		this.prevDropPulse = 0.85
		this.renderer.setAnimationLoop(() => this.update())
	}

	stop() {
		this.renderer.setAnimationLoop(null)
	}

	update() {
		const a = this.audio // volume · volumeSmooth · kick · kickHard · volumeByFrequency
		// Clamped: coming back from a hidden tab hands one giant delta, which
		// used to teleport EVERY cloud past its band top- whole-field recycle,
		// sky emptied for minutes. Capped, a long absence is just one slow frame.
		const dt = Math.min(this.clock.getDelta(), 0.1)

		// Derived signals first- everything below reads them. The timeline runs
		// ahead of the features: it fires the mapped drops into them and stands
		// the live detector down while it owns the current track.
		this.dropTimeline.update(this.features)
		this.features.update(dt, a)
		// Musical events: rare animation triggers + their camera staging. Before
		// the wind and the world modules: the zero-G envelope they read
		// (features.zeroG, the rate scale) must be this frame's, not last frame's.
		this.events.update(dt, a, this.features)
		this.wind.update(dt, this.features)   // writes params.wind.angle- sky/clouds/lines read it below
		// Inspection mode: the world modules follow the debug camera instead of
		// the rig's, and the postfx chain is bypassed (raw render + rig frustum).
		const cam = this.debugView?.enabled ? this.debugView.camera : this.cameraRig.camera
		this.body.update(dt, a, this.features, cam)
		this.crowd.update(dt, this.features)   // reads boost.crowd- events ran above

		// Autopilot next- mutates params so the audio-reactive logic below adds on top.
		if (this.params.autopilot.enabled) this.autopilot.update(dt)

		// The body breathes with the bass, and slowly drifts on air currents
		// (two incommensurate periods- reads as wandering, not oscillating).
		this.pivot.scale.setScalar(1 + this.features.bass * this.params.body.bassScale)
		this.driftPhase = (this.driftPhase ?? 0) + dt
		const drift = this.params.body.drift
		// The body rides the same wind as the clouds (world +X axis): gusts and
		// the pre-drop lean push the character too- one weather for everyone.
		const windLean = Math.sin(THREE.MathUtils.degToRad(this.params.wind.angle)) * 0.9
		this.pivot.position.set(Math.sin(this.driftPhase * 0.31) * drift + windLean, 0, Math.sin(this.driftPhase * 0.23 + 1.3) * drift)
		// The mirrored twin- AFTER the pivot writes (it reflects them) and the
		// body's mixer (it copies the pose). While it runs, the rig and the
		// multicam feeds aim at the midpoint of the pair instead of the hero.
		this.twin.update(dt, this.features)
		this.cameraRig.lookTarget = this.twin.active ? this.twin.focus : this.pivot
		this.postfx.multiCamPass.anchor = this.twin.active ? this.twin.focus : (this.body.hipsBone ?? this.pivot)
		// A detected drop is a MOMENT: hard palette switch + camera accent (the
		// flash itself rides features.dropPulse inside sky/bloom/rim).
		if (this.features.dropPulse > 0.9 && this.prevDropPulse <= 0.9) {
			this.autopilot.skipToNext()
			// Some drops land as a strobe montage instead of a single accent.
			if (Math.random() < this.params.director.strobeChance) this.director.strobe(this.features.energy)
			else if (this.director.mode === 'base') this.director.enterAccent(this.features.energy)
		}
		this.prevDropPulse = this.features.dropPulse

		this.director.update(dt, a, this.features)
		this.cameraRig.update(dt, a, this.features)
		this.sky.update(dt, a, this.features, cam)   // backdrop: own motion Y-only, X follows the view yaw- see sky.js
		// Clouds: the WORLD (y-lock) always follows the rig- the show's camera-
		// even in debug view, or orbiting the free camera would drag the whole
		// field along. The billboards need no camera here: the vertex shader
		// builds them from the RENDERING camera's position, debug included.
		this.clouds.update(dt, a, this.features, this.cameraRig.camera)
		this.speedLines.update(dt, a, this.features, cam)
		this.motes.update(dt, this.features, cam)
		this.rays.update(dt, this.features)
		if (this.debugView?.enabled) {
			this.debugView.render()
		} else {
			this.postfx.update(a, this.features)
			this.postfx.render(dt)
		}
	}

	onResize() {
		this.cameraRig.resize()
		this.renderer.setSize(innerWidth, innerHeight)
		this.postfx.resize()
		this.sky.resize()
		this.debugView?.resize()
	}

}
