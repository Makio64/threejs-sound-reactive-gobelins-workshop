import { Pane } from 'tweakpane'

import { COLOR_PRESETS } from './config.js'

// The Tweakpane debug panel. Standalone-only: in host iframes the Analyzer runs
// in 'receive' mode and no pane is built (every public method guards on it).
// (audio.player would be a wrong gate- it's lazy-created only after the first
// user gesture, well after init().)
export default class Gui {

	constructor(scene) {
		this.scene = scene
		this.pane = null
		this.bodyMatBindings = null
		// Hex mirrors of the currently-selected preset; bound to the "Edit preset" GUI.
		// Initialized from preset 0 to match params.autopilot.preset default.
		this.presetEditor = {
			skyTop: '#' + COLOR_PRESETS[0].skyTop.getHexString(),
			skyBottom: '#' + COLOR_PRESETS[0].skyBottom.getHexString(),
			skyCloudColor: '#' + COLOR_PRESETS[0].skyCloudColor.getHexString(),
			cloudsColor: '#' + COLOR_PRESETS[0].cloudsColor.getHexString(),
			bodyRim: '#' + COLOR_PRESETS[0].bodyRim.getHexString(),
		}
		if (scene.audio?.mode !== 'live') return
		this.build()
	}

	// Called by the autopilot color cycle each time it advances to the next preset.
	onPresetAdvanced(idx) {
		if (!this.pane) return
		this.syncPresetEditor(idx)
		this.pane.refresh()
	}

	build() {
		const { params, features, body, cameraRig, sky, clouds, autopilot } = this.scene
		this.pane = new Pane({ title: 'Postprocessing' })

		// Always-visible monitors (the folders below are collapsed): the shot the
		// director is holding right now, and the last animation event fired.
		this.pane.addBinding(this.scene.director.state, 'shot', { readonly: true, label: 'current shot' })
		this.pane.addBinding(this.scene.events.state, 'last', { readonly: true, label: 'last event' })

		// Wind test knob- leans the whole fall (sky, clouds, streaks), degrees
		// from vertical, screen-coherent. 0 = the pure vertical contract.
		const windFolder = this.pane.addFolder({ title: 'Wind' })
		windFolder.addBinding(params.wind, 'auto', { label: 'auto director' })
		// Manual when auto is off; while auto runs, the director overwrites the
		// value each frame (the slider then shows its last drawn state only).
		windFolder.addBinding(params.wind, 'angle', { min: -60, max: 60, step: 1, label: 'angle (°)' })

		// THE master perf slider- render resolution cap (see PostFX.setRenderScale).
		this.pane.addBinding(params.quality, 'renderScale', { min: 1, max: 2, step: 0.25, label: 'render scale' })
			.on('change', (ev) => this.scene.postfx.setRenderScale(ev.value))

		// Live meters of the derived signals + their calibration. Watch `energy`
		// while the track plays: it should hug 0 in quiet passages and ~1 on drops-
		// adjust quiet/loud until it does.
		const audioFolder = this.pane.addFolder({ title: 'Audio', expanded: false })
		audioFolder.addBinding(features, 'energy', { readonly: true, view: 'graph', min: 0, max: 1 })
		audioFolder.addBinding(features, 'bass', { readonly: true, view: 'graph', min: 0, max: 1 })
		audioFolder.addBinding(features, 'mid', { readonly: true, view: 'graph', min: 0, max: 1 })
		audioFolder.addBinding(features, 'high', { readonly: true, view: 'graph', min: 0, max: 1 })
		audioFolder.addBinding(features, 'bpm', { readonly: true, view: 'graph', min: 60, max: 200 })
		audioFolder.addBinding(features, 'rate', { readonly: true, view: 'graph', min: 0.5, max: 1.6 })
		audioFolder.addBinding(features, 'dropPulse', { readonly: true, view: 'graph', min: 0, max: 1 })
		// Energy: where "quiet" and "loud" sit inside the track's dynamics, and
		// how fast the scene ramps up / settles down.
		const nrj = audioFolder.addFolder({ title: 'Energy (calibration)' })
		nrj.addBinding(params.audio, 'quiet', { min: 0, max: 1, step: 0.01, label: 'quiet threshold ↓' })
		nrj.addBinding(params.audio, 'loud', { min: 0.1, max: 1, step: 0.01, label: 'loud threshold ↑' })
		nrj.addBinding(params.audio, 'attack', { min: 0.05, max: 2, step: 0.05, label: 'attack (s)' })
		nrj.addBinding(params.audio, 'release', { min: 0.2, max: 6, step: 0.1, label: 'release (s)' })
		nrj.addBinding(params.audio, 'floor', { min: 0, max: 0.6, step: 0.01, label: 'silence floor' })
		// Tempo: the expected BPM range, and the world speed derived from it.
		const tempo = audioFolder.addFolder({ title: 'Tempo → speed' })
		tempo.addBinding(params.audio, 'bpmSlow', { min: 50, max: 140, step: 1, label: 'slow bpm =' })
		tempo.addBinding(params.audio, 'bpmFast', { min: 90, max: 220, step: 1, label: 'fast bpm =' })
		tempo.addBinding(params.audio, 'rateMin', { min: 0.3, max: 1, step: 0.05, label: '→ min speed' })
		tempo.addBinding(params.audio, 'rateMax', { min: 1, max: 2.5, step: 0.05, label: '→ max speed' })

		const auto = this.pane.addFolder({ title: 'Autopilot', expanded: false })
		auto.addBinding(params.autopilot, 'enabled')
		auto.addBinding(params.autopilot, 'speed', { min: 0, max: 3, step: 0.01 })
		auto.addBinding(params.autopilot, 'colorCycle', { label: 'colors on drops' })
		// Fires the REAL drop path (flash + palette transition + camera accent)
		// via the same rising edge the detector uses- for auditioning the
		// transition styles without waiting for the music to provide drops.
		auto.addButton({ title: '⚡ simulate a drop' }).on('click', () => {
			features.dropPulse = 1
		})
		auto.addBinding(params.drop, 'shock', { min: 0, max: 0.2, step: 0.005, label: 'shockwave' })
		auto.addBinding(params.drop, 'kick', { min: 0, max: 3, step: 0.05, label: 'camera kick' })
		auto.addBinding(params.drop, 'punch', { min: 0, max: 3, step: 0.05, label: 'zoom punch' })
		auto.addBinding(params.autopilot, 'dropMode', {
			label: 'drop transition',
			options: { 'random': 'random', 'hard cut': 'snap', 'white flash': 'flash', 'center wipe': 'wipe', 'rising curtain': 'curtain', 'inverted iris': 'iris', 'dissolve': 'dissolve' },
		})
		// Manual preset selector- overridden live when colorCycle is on (the cycle
		// keeps writing into the uniforms each frame).
		const presetOptions = Object.fromEntries(COLOR_PRESETS.map((pst, i) => [pst.name, i]))
		auto.addBinding(params.autopilot, 'preset', { options: presetOptions })
			.on('change', (ev) => {
				autopilot.resetPresetTimer()   // restart dwell window from this preset
				this.applyColorPreset(ev.value)
			})

		// Edit the currently-selected preset live. Edits persist into COLOR_PRESETS
		// so the autopilot cycle picks up the new values on the next loop.
		const edit = auto.addFolder({ title: 'Edit preset', expanded: false })
		edit.addBinding(this.presetEditor, 'skyTop', { view: 'color' }).on('change', () => this.editPresetColor('skyTop'))
		edit.addBinding(this.presetEditor, 'skyBottom', { view: 'color' }).on('change', () => this.editPresetColor('skyBottom'))
		edit.addBinding(this.presetEditor, 'skyCloudColor', { view: 'color' }).on('change', () => this.editPresetColor('skyCloudColor'))
		edit.addBinding(this.presetEditor, 'cloudsColor', { view: 'color' }).on('change', () => this.editPresetColor('cloudsColor'))
		edit.addBinding(this.presetEditor, 'bodyRim', { view: 'color' }).on('change', () => this.editPresetColor('bodyRim'))

		const bodyFolder = this.pane.addFolder({ title: 'Body', expanded: false })
		bodyFolder.addBinding(params.body, 'bassScale', { min: 0, max: 2, step: 0.05 })
		bodyFolder.addBinding(params.body, 'drift', { min: 0, max: 1.2, step: 0.05 })
		bodyFolder.addBinding(params.body, 'slowMo', { min: 0.1, max: 1, step: 0.05 })
		bodyFolder.addBinding(params.body, 'material', {
			options: { rim: 'rim', normal: 'normal', basic: 'basic', wireframe: 'wireframe', depth: 'depth' },
		}).on('change', (ev) => {
			body.setMaterial(ev.value)
			this.refreshBodyMatBindings()
		})

		// Live updates: per-type bindings mutate the active material directly when
		// it matches; switching types rebuilds the material from these stored params,
		// so each preset keeps its own state across toggles.
		const onProp = (prop, src) => () => {
			if (body.mat && prop in body.mat) body.mat[prop] = src[prop]
		}
		const onColor = (src) => () => {
			if (body.mat?.color) body.mat.color.set(src.color)
		}
		const onFlat = (src) => () => {
			if (!body.mat || !('flatShading' in body.mat)) return
			body.mat.flatShading = src.flatShading
			body.mat.needsUpdate = true   // shader recompile- flatShading is a #define
		}

		const b = params.body
		this.bodyMatBindings = {
			rim: [
				bodyFolder.addBinding(b.rim, 'baseColor', { view: 'color' }).on('change', (ev) => {
					if (body.mat?.uniforms?.baseColor) body.mat.uniforms.baseColor.value.set(ev.value)
				}),
				// power/strength/kickHardMult are read every frame by body.update()
				bodyFolder.addBinding(b.rim, 'power', { min: 0.5, max: 8, step: 0.1 }),
				bodyFolder.addBinding(b.rim, 'strength', { min: 0, max: 4, step: 0.05 }),
				bodyFolder.addBinding(b.rim, 'kickHardMult', { min: 0, max: 4, step: 0.05 }),
				bodyFolder.addBinding(b.rim, 'shading', { min: 0, max: 0.9, step: 0.01 }),
				bodyFolder.addBinding(b.rim, 'ambient', { min: 0, max: 1, step: 0.01 }),
			],
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

		const director = this.pane.addFolder({ title: 'Director', expanded: false })
		director.addBinding(this.scene.director.state, 'shot', { readonly: true })
		director.addButton({ title: '🎬 cut accent' }).on('click', () => this.scene.director.enterAccent(features.energy))
		director.addButton({ title: '📸 strobe' }).on('click', () => this.scene.director.strobe(features.energy))
		director.addBinding(params.director, 'enabled')
		director.addBinding(params.director, 'accentChance', { min: 0, max: 1, step: 0.05 })
		director.addBinding(params.director, 'accentCooldown', { min: 0, max: 20, step: 0.5 })
		director.addBinding(params.director, 'accentMin', { min: 1, max: 8, step: 0.1 })
		director.addBinding(params.director, 'accentMax', { min: 2, max: 12, step: 0.1 })
		director.addBinding(params.director, 'minEnergy', { min: 0, max: 1, step: 0.05 })
		director.addBinding(params.director, 'zoomDrift', { min: 0, max: 1, step: 0.05 })
		director.addBinding(params.director, 'chainChance', { min: 0, max: 0.9, step: 0.05 })
		director.addBinding(params.director, 'strobeChance', { min: 0, max: 1, step: 0.05, label: 'strobe (drop)' })

		const events = this.pane.addFolder({ title: 'Events', expanded: false })
		events.addBinding(this.scene.events.state, 'last', { readonly: true })
		events.addButton({ title: '🤸 backflip' }).on('click', () => this.scene.events.trigger('backflip'))
		events.addButton({ title: '🔄 backfalling' }).on('click', () => this.scene.events.trigger('backfalling'))
		events.addButton({ title: '🌀 spin' }).on('click', () => this.scene.events.trigger('spin'))
		// Global fx events- playable under any sky.
		events.addButton({ title: '🪞 broken mirror' }).on('click', () => this.scene.events.trigger('shatter'))
		events.addButton({ title: '📺 multicam' }).on('click', () => this.scene.events.trigger('multicam'))
		events.addButton({ title: '🕴 crowd fall' }).on('click', () => this.scene.events.trigger('crowdfall'))
		events.addButton({ title: '🔳 droste echo' }).on('click', () => this.scene.events.trigger('echo'))
		events.addButton({ title: '👥 mirror twin' }).on('click', () => this.scene.events.trigger('twin'))
		// Preset signatures: each button first snaps to the event's own sky
		// (the signature only makes sense under it), then fires the full real
		// path- staging included.
		const signature = (title, presetName, eventName) => {
			events.addButton({ title }).on('click', () => {
				const idx = COLOR_PRESETS.findIndex((pst) => pst.name === presetName)
				if (idx >= 0 && params.autopilot.preset !== idx) {
					params.autopilot.preset = idx
					autopilot.resetPresetTimer()
					this.applyColorPreset(idx)
				}
				this.scene.events.trigger(eventName)
			})
		}
		signature('⛈ lightning (Storm)', 'Storm', 'lightning')
		signature('🌌 zero-g (Cosmos)', 'Cosmos', 'zeroG')
		signature('🌅 sunburst (Dawn)', 'Dawn', 'sunburst')
		signature('🫧 apnea (Abyss)', 'Abyss', 'apnea')
		signature('✨ first star (Twilight)', 'Twilight', 'firstStar')
		events.addBinding(params.events, 'enabled')
		events.addBinding(params.events, 'onDrop', { label: 'fire on drops' })
		events.addBinding(params.events, 'chance', { min: 0, max: 1, step: 0.05 })
		events.addBinding(params.events, 'cooldown', { min: 0, max: 60, step: 1 })
		events.addBinding(params.events, 'minEnergy', { min: 0, max: 1, step: 0.05 })

		const cam = this.pane.addFolder({ title: 'Camera', expanded: false })
		cam.addBinding(params.camera, 'baseSpeed', { min: 0, max: 2, step: 0.01 })
		cam.addBinding(params.camera, 'kickMult', { min: 0, max: 20, step: 0.1 })
		cam.addBinding(params.camera, 'verticalSpeed', { min: 0, max: 2, step: 0.01 })
		cam.addBinding(params.camera, 'verticalAmp', { min: 0, max: 6, step: 0.05 })
		cam.addBinding(params.camera, 'verticalEnergyMult', { min: 0, max: 4, step: 0.05 })
		cam.addBinding(cameraRig.orbit, 'radius', { min: 1, max: 10, step: 0.1 })
		cam.addBinding(cameraRig.orbit, 'baseHeight', { min: -6, max: 8, step: 0.05 })
		cam.addBinding(params.camera, 'shake', { min: 0, max: 0.2, step: 0.005 })
		cam.addBinding(params.camera, 'rollAmp', { min: 0, max: 0.35, step: 0.01 })
		cam.addBinding(params.camera, 'rollSpeed', { min: 0, max: 0.3, step: 0.005 })

		const lines = this.pane.addFolder({ title: 'Speed lines', expanded: false })
		lines.addBinding(params.lines, 'enabled')
		lines.addBinding(params.lines, 'count', { min: 0, max: 200, step: 1 }).on('change', (ev) => {
			if (ev.last) this.scene.speedLines.rebuild()
		})
		lines.addBinding(params.lines, 'opacity', { min: 0, max: 1, step: 0.01 })
		lines.addBinding(params.lines, 'speedBase', { min: 0, max: 20, step: 0.5 })
		lines.addBinding(params.lines, 'speedEnergyMult', { min: 0, max: 40, step: 0.5 })
		lines.addBinding(params.lines, 'radius', { min: 1, max: 15, step: 0.5 })

		const dreamy = this.pane.addFolder({ title: 'Dreamy', expanded: false })
		dreamy.addBinding(params.motes, 'enabled', { label: 'motes' })
		dreamy.addBinding(params.motes, 'count', { min: 0, max: 400, step: 1 }).on('change', (ev) => {
			if (ev.last) this.scene.motes.rebuild()
		})
		dreamy.addBinding(params.motes, 'opacity', { min: 0, max: 1, step: 0.01 })
		dreamy.addBinding(params.motes, 'rise', { min: 0, max: 4, step: 0.05, label: 'rise speed' })
		// Spawn-time param: new specks pick it up as they recycle (seconds)- no rebuild needed.
		dreamy.addBinding(params.motes, 'radius', { min: 2, max: 12, step: 0.5, label: 'radius' })
		dreamy.addBinding(params.rays, 'enabled', { label: 'rays' })
		dreamy.addBinding(params.rays, 'count', { min: 0, max: 20, step: 1 }).on('change', (ev) => {
			if (ev.last) this.scene.rays.rebuild()
		})
		dreamy.addBinding(params.rays, 'opacity', { min: 0, max: 0.3, step: 0.005 })

		const skyFolder = this.pane.addFolder({ title: 'Sky', expanded: false })
		skyFolder.addBinding(params.sky, 'enabled')
		skyFolder.addBinding(params.sky, 'scrollSpeedBase', { min: 0, max: 0.5, step: 0.005 })
		skyFolder.addBinding(params.sky, 'scrollEnergyMult', { min: 0, max: 1, step: 0.01 })
		skyFolder.addBinding(params.sky, 'scrollKickMult', { min: 0, max: 3, step: 0.05 })
		skyFolder.addBinding(params.sky, 'cloudScale', { min: 0.5, max: 10, step: 0.1 })
		skyFolder.addBinding(params.sky, 'brightnessBase', { min: 0, max: 1.5, step: 0.01 })
		skyFolder.addBinding(params.sky, 'brightnessEnergyMult', { min: 0, max: 1.5, step: 0.01 })
		skyFolder.addBinding(params.sky, 'midCoverage', { min: 0, max: 0.3, step: 0.01, label: 'mids → clouds' })
		skyFolder.addBinding(params.sky, 'topColor', { view: 'color' }).on('change', (ev) => {
			sky.uniforms.skyTop.value.set(ev.value)
		})
		skyFolder.addBinding(params.sky, 'bottomColor', { view: 'color' }).on('change', (ev) => {
			sky.uniforms.skyBottom.value.set(ev.value)
		})
		skyFolder.addBinding(params.sky, 'cloudColor', { view: 'color' }).on('change', (ev) => {
			sky.uniforms.cloudColor.value.set(ev.value)
		})

		const cloudsFolder = this.pane.addFolder({ title: 'Clouds', expanded: false })
		cloudsFolder.addBinding(params.clouds, 'enabled')
		cloudsFolder.addBinding(params.clouds, 'count', { min: 0, max: 400, step: 1 }).on('change', (ev) => {
			if (ev.last) clouds.rebuild()   // rebuild only on release, not every tick
		})
		cloudsFolder.addBinding(params.clouds, 'riseSpeedBase', { min: 0, max: 6, step: 0.05 })
		cloudsFolder.addBinding(params.clouds, 'riseEnergyMult', { min: 0, max: 8, step: 0.05 })
		cloudsFolder.addBinding(params.clouds, 'riseKickMult', { min: 0, max: 12, step: 0.1 })
		cloudsFolder.addBinding(params.clouds, 'opacity', { min: 0, max: 1, step: 0.01 })
		cloudsFolder.addBinding(params.clouds, 'haze', { min: 0, max: 1, step: 0.01 })
		cloudsFolder.addBinding(params.clouds, 'weather', { min: 0, max: 1, step: 0.05 })
		cloudsFolder.addBinding(params.clouds, 'color', { view: 'color' }).on('change', (ev) => {
			clouds.setColor(ev.value)
		})

		const bloom = this.pane.addFolder({ title: 'Bloom', expanded: false })
		bloom.addBinding(params.bloom, 'enabled')
		bloom.addBinding(params.bloom, 'strengthBase', { min: 0, max: 3, step: 0.01 })
		bloom.addBinding(params.bloom, 'energyMult', { min: 0, max: 3, step: 0.01 })
		bloom.addBinding(params.bloom, 'kickHardMult', { min: 0, max: 3, step: 0.01 })
		bloom.addBinding(params.bloom, 'radius', { min: 0, max: 2, step: 0.01 })
		bloom.addBinding(params.bloom, 'threshold', { min: 0, max: 1, step: 0.01 })

		const after = this.pane.addFolder({ title: 'Afterimage', expanded: false })
		after.addBinding(params.afterimage, 'enabled')
		after.addBinding(params.afterimage, 'dampBase', { min: 0, max: 0.99, step: 0.01 })
		after.addBinding(params.afterimage, 'kickHardMult', { min: 0, max: 0.2, step: 0.005 })

		const rgb = this.pane.addFolder({ title: 'RGB Shift', expanded: false })
		rgb.addBinding(params.rgbShift, 'enabled')
		rgb.addBinding(params.rgbShift, 'highMult', { min: 0, max: 0.02, step: 0.0005 })
		rgb.addBinding(params.rgbShift, 'angle', { min: 0, max: Math.PI * 2, step: 0.01 })

		const fish = this.pane.addFolder({ title: 'Fisheye', expanded: false })
		fish.addBinding(params.fisheye, 'enabled')
		fish.addBinding(params.fisheye, 'strengthBase', { min: -0.5, max: 2, step: 0.01 })
		fish.addBinding(params.fisheye, 'energyMult', { min: 0, max: 1, step: 0.01 })
		fish.addBinding(params.fisheye, 'kickHardMult', { min: 0, max: 2, step: 0.01 })
	}

	// Snap to a named preset and sync params + GUI. Used for manual selection.
	applyColorPreset(idx) {
		const preset = COLOR_PRESETS[idx]
		if (!preset) return
		const { params, sky, clouds, body } = this.scene
		sky.lerpColors(preset, preset, 0)
		clouds.lerpColors(preset, preset, 0)
		body.lerpColors(preset, preset, 0)
		// Sync hex params so the Sky/Clouds color pickers reflect the new state.
		params.sky.topColor = '#' + preset.skyTop.getHexString()
		params.sky.bottomColor = '#' + preset.skyBottom.getHexString()
		params.sky.cloudColor = '#' + preset.skyCloudColor.getHexString()
		params.clouds.color = '#' + preset.cloudsColor.getHexString()
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
		this.presetEditor.bodyRim = '#' + preset.bodyRim.getHexString()
	}

	// Persist an editor hex back into the active preset's THREE.Color, then snap
	// uniforms so the change is visible immediately (overridden next frame if the
	// autopilot color cycle is running- toggle colorCycle off while editing).
	editPresetColor(key) {
		const idx = this.scene.params.autopilot.preset
		const preset = COLOR_PRESETS[idx]
		if (!preset) return
		preset[key].set(this.presetEditor[key])
		this.applyColorPreset(idx)   // snap + sync both Sky/Clouds pickers and editor
	}

	refreshBodyMatBindings() {
		if (!this.bodyMatBindings) return
		const active = this.scene.params.body.material
		for (const [key, list] of Object.entries(this.bodyMatBindings)) {
			for (const binding of list) binding.hidden = key !== active
		}
	}

}
