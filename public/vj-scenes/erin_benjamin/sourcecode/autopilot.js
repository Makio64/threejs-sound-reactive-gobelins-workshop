import * as THREE from 'three'

import { COLOR_PRESETS, pickPreset } from './config.js'

// Spatial transitions: shader wipeMode + per-mode duration and body factor
// (the body sits at screen center- it leads a center-out front, trails an
// edges-in one). Sky and clouds carry both palettes; see setWipe().
const SPATIAL = {
	wipe: { shaderMode: 0, duration: 1.4, body: (f) => Math.min(1, f * 1.6) },
	curtain: { shaderMode: 1, duration: 1.4, body: (f) => f },
	iris: { shaderMode: 2, duration: 1.4, body: (f) => Math.max(0, (f - 0.55) / 0.45) },
	dissolve: { shaderMode: 3, duration: 1.7, body: (f) => f },
}

// Waypoint for the 'flash' transition: everything blows out to white before
// the next palette reveals itself.
const WHITE_PRESET = {
	skyTop: new THREE.Color(0xffffff), skyBottom: new THREE.Color(0xffffff),
	skyCloudColor: new THREE.Color(0xffffff), cloudsColor: new THREE.Color(0xffffff),
	bodyRim: new THREE.Color(0xffffff),
}

// Layered LFOs over the static-feeling params. Writes go directly into the params
// struct (and into the sky/clouds colors), so the audio-reactive update() logic
// composes on top: autopilot sets the slow baseline, audio adds beat-driven spikes.
// Disabling autopilot lets the manual GUI values take over again instantly.
export default class Autopilot {

	constructor(params, sky, clouds, body) {
		this.params = params
		this.sky = sky
		this.clouds = clouds
		this.body = body
		this.phase = 0
		this.onPresetAdvanced = null   // wired by the scene- lets the GUI mirror the cycle
	}

	// Normalized sine [-1, 1] and [0, 1] over this.phase- period in seconds (at
	// speed=1). Methods, not per-update closures- update() runs in the hot loop
	// and must allocate nothing.
	osc(period, off = 0) {
		return Math.sin(this.phase * (Math.PI * 2) / period + off)
	}

	osc01(period, off = 0) {
		return this.osc(period, off) * 0.5 + 0.5
	}

	// Abort any running transition (manual GUI picks call this).
	resetPresetTimer() {
		this.transition = null
	}

	// Uniform draw over every preset EXCEPT the current one- the palette
	// wanders freely instead of looping the config order.
	pickNext(cur) {
		let n = Math.floor(Math.random() * (COLOR_PRESETS.length - 1))
		if (n >= cur) n++
		return n
	}

	// Palette change on a musical drop- the ONLY thing that moves the palette.
	// dropMode picks the style ('random' draws one per drop):
	// - snap: hard cut to the next preset, a deliberate color slam
	// - flash: colors blow out THROUGH white with the drop flash, the new
	//   palette reveals itself as it settles
	// - wipe: the new palette grows in a circle from screen center to the edges
	// - curtain: it rises from the bottom, riding the fall's upward stream
	// - iris: it closes in from the edges- the world swallows the body last
	// - dissolve: it eats the old palette along an FBM pattern- merging patches
	skipToNext() {
		const p = this.params.autopilot
		let mode = p.dropMode
		if (mode === 'random') mode = ['snap', 'flash', 'wipe', 'curtain', 'iris', 'dissolve'][Math.floor(Math.random() * 6)]
		if (mode === 'snap') {
			p.preset = this.pickNext(p.preset)
			this.transition = null   // a pending transition must not keep running
			this.onPresetAdvanced?.(p.preset)
			return
		}
		// The target is drawn ONCE here and stored- update() runs every frame
		// and a per-frame draw would flicker the destination palette.
		this.transition = { mode, t: 0, to: this.pickNext(p.preset) }
	}

	// Advance the running transition; returns the current mix factor (0..1).
	transitionMix(dt) {
		const tr = this.transition
		const spatial = SPATIAL[tr.mode]
		if (spatial) {
			tr.t = Math.min(1, tr.t + dt / spatial.duration)
			// Ease-out (fronts burst open then settle)- except the dissolve,
			// whose organic threshold reads better advancing linearly.
			return tr.mode === 'dissolve' ? tr.t : 1 - (1 - tr.t) * (1 - tr.t)
		}
		// flash: linear 1.2s clock, the waypoint split in update() shapes the
		// two phases.
		tr.t = Math.min(1, tr.t + dt / 1.2)
		return tr.t
	}

	update(dt) {
		this.phase += dt * this.params.autopilot.speed

		const p = this.params

		// Camera bob amplitude sweep (framing- radius/height- now belongs to the
		// Director, which hard-cuts between shots).
		p.camera.verticalAmp = 0.4 + this.osc01(19, 0.4) * 0.9

		// Sky atmosphere- brightness baseline pulse only. cloudScale stays OFF
		// the autopilot: breathing the scale zooms the backdrop pattern, moving
		// edge pixels laterally (and vertically off-stream)- the backdrop's
		// time-driven motion must be the upward flow and nothing else.
		p.sky.brightnessBase = 0.55 + this.osc01(22, 2.1) * 0.4

		// Cloud field veil density.
		p.clouds.opacity = 0.75 + this.osc(14, 1.1) * 0.2

		// Lens dynamics- bloom shape + lens distortion + RGB rotation. The bloom
		// threshold must stay ABOVE the white body's ~0.70 max luminance (see
		// config) so only the rim-boosted edges ever bloom.
		p.bloom.radius = 0.35 + this.osc(18, 0.6) * 0.2
		p.bloom.threshold = 0.8 + this.osc01(24, 0.9) * 0.15
		p.fisheye.strengthBase = 0.6 + this.osc(28, 2.4) * 0.6
		p.rgbShift.angle = (this.phase * 0.4) % (Math.PI * 2)

		if (!p.autopilot.colorCycle) return

		// The palette holds still- it only moves when a drop calls skipToNext().
		// `params.autopilot.preset` stays the source of truth, advanced +
		// mirrored into the GUI dropdown when a transition lands.
		const cur = p.autopilot.preset
		const nxt = this.transition ? this.transition.to : cur   // no transition: f stays 0, B is inert
		let A = COLOR_PRESETS[cur]
		let B = COLOR_PRESETS[nxt]
		let f = 0
		if (this.transition) {
			f = this.transitionMix(dt)
			const mode = this.transition.mode
			const spatial = SPATIAL[mode]
			if (spatial && this.transition.t < 1) {
				// Spatial: sky and clouds carry BOTH palettes with a moving front.
				this.sky.setWipe(A, B, f, spatial.shaderMode)
				this.clouds.setWipe(A, B, f, spatial.shaderMode)
				this.body.lerpColors(A, B, spatial.body(f))
				return
			}
			if (mode === 'flash') {
				// Through white: blow out over the first 35%, reveal over the rest.
				if (f < 0.35) { B = WHITE_PRESET; f = f / 0.35 }
				else { A = WHITE_PRESET; B = COLOR_PRESETS[nxt]; f = (f - 0.35) / 0.65 }
			}
			if (this.transition.t >= 1) {
				this.transition = null
				p.autopilot.preset = nxt
				this.onPresetAdvanced?.(nxt)
				A = COLOR_PRESETS[nxt]
				f = 0
			}
		}
		this.sky.lerpColors(A, B, f)
		this.clouds.lerpColors(A, B, f)
		this.body.lerpColors(A, B, f)
	}

}
