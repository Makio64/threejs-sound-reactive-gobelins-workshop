// Rare animation events: on a hard kick- gated by a LOW chance, a LONG
// cooldown and a minimum energy- the body breaks its fall for a special
// clip, then glides back. Rarity is the point: one event every ~30-60s
// keeps them precious. When one fires, the director punches to an accent
// shot at the same moment (if it was idling in base) so the move is staged.
//
// Two kinds of entries:
// - body events: a clip crossfade handled by Body (backflip, backfalling, spin)
// - fx events (fx: true): no clip of their own- an envelope run here each
//   frame drives the world through the features.boost channels (and the rate).
//   Each has a spec in FX_SPECS below. `presets` restricts an event to the
//   named skies: the rare cards get a signature you only ever see under them.
import { COLOR_PRESETS } from './config.js'

const EVENTS = [
	// calm/intense: selection weights blended by energy. Events mostly fire at
	// high energy (hard kicks live there), so flying keeps real weight in
	// intense too- otherwise backflip wins nearly every roll.
	// (the flying clip is still in character.glb- re-add a line here to bring it back)
	{ name: 'backflip', hold: 0, calm: 0.5, intense: 3 },        // one-shot- returns by itself
	{ name: 'backfalling', hold: [8, 13], calm: 3, intense: 2 }, // rolls onto his back- held then released
	{ name: 'spin', hold: 0, calm: 1.5, intense: 2.5 },          // flat helicopter spin- one-shot, returns by itself
	// Global fx events- no preset gate, any sky can play them.
	{ name: 'shatter', fx: true, hold: [6, 9], calm: 1.5, intense: 2.5 },   // broken-mirror shards (LensShader)
	{ name: 'multicam', fx: true, hold: [8, 12], calm: 1, intense: 2.5 },   // control-room mosaic (MultiCamPass)
	{ name: 'crowdfall', fx: true, hold: [12, 18], calm: 2, intense: 1.5 }, // other bodies falling around (Crowd)
	{ name: 'echo', fx: true, hold: [8, 12], calm: 2, intense: 2 },         // Droste layers- the body repeats bigger around itself
	{ name: 'twin', fx: true, hold: [13, 19], calm: 2, intense: 2 },        // a mirrored double facing the hero (Twin)- long ramps need the room
	// Preset signatures- weighted heavy so the rare sky usually plays its own card.
	{ name: 'lightning', fx: true, presets: ['Storm'], hold: 0, calm: 4, intense: 6 },
	{ name: 'zeroG', fx: true, presets: ['Cosmos'], hold: [9, 14], calm: 6, intense: 4 },
	{ name: 'sunburst', fx: true, presets: ['Dawn'], hold: [6, 9], calm: 5, intense: 3 },
	{ name: 'apnea', fx: true, presets: ['Abyss'], hold: [8, 12], calm: 5, intense: 3 },
	{ name: 'firstStar', fx: true, presets: ['Twilight'], hold: [6, 9], calm: 6, intense: 2 },
]
const REPEAT_PENALTY = 0.35   // last-played event's weight multiplier- variety without strict alternation
// Stacking conflicts: multicam owns the whole frame, so neither full-screen
// Voronoi break nor the Droste copies may share it (and vice versa); the
// Droste copies and the mirrored twin also never mix (the echo repeats the
// hero alone- a twin on screen would read as ignored). Every other
// combination stacks freely.
const FX_CONFLICTS = {
	multicam: ['shatter', 'echo'],
	shatter: ['multicam'],
	echo: ['multicam', 'twin'],
	twin: ['echo'],
}
// Signature pity: while the active preset's own card has not played yet, its
// selection weight is multiplied by this- the rare sky all but guarantees its
// signature at least once (~70% on the first roll, ~98% by the third), then
// the boost drops and the normal rotation resumes.
const SIGNATURE_PITY = 6

// How each fx event runs. attack/release: envelope ramp seconds (smoothstepped,
// peaking at 1 in between). boost: peak values written into features.boost-
// the channel consumers: wind (Wind flattens its output), motes (presence +
// twinkle rate), rays (opacity mult) + raysCount (extra shafts drawn from the
// reserve- see rays.js), bloom (strength add), afterimage (damp add, capped
// in PostFX). rateFloor: the world-speed scale at full envelope (same
// features.rate channel as the drop's impact frame- everything that moves
// hangs together). clip: a body clip held for the event's duration.
// shot: the accent the director is forced to- the signature stages itself.
const FX_SPECS = {
	// 3-5 staggered sky strikes + a strobe montage- handled specially below.
	lightning: { strikes: true },
	// Cosmos: the world suspends- the body hangs on its back, wind dies, the
	// dust becomes a starfield.
	zeroG: { clip: 'backfalling', shot: 'far', attack: 1, release: 1.5, rateFloor: 0.2, boost: { wind: 1, motes: 1.5 } },
	// Dawn: the sun breaks through- the shafts blaze, extra ones pierce the
	// clouds, silhouette staged against the light.
	sunburst: { shot: 'below', attack: 1.2, release: 1.8, boost: { rays: 7, raysCount: 8, bloom: 1.2 } },
	// Abyss: drowning- the fall itself slows underwater, heavy trails,
	// watched sinking from the surface. No clip: the base fall reads as
	// sinking by itself once the world drags.
	apnea: { shot: 'topDown', attack: 1.5, release: 2, rateFloor: 0.45, boost: { afterimage: 0.12, wind: 0.7 } },
	// Twilight: the first stars light up- the mote field sparkles wide.
	firstStar: { shot: 'far', attack: 1.5, release: 2, boost: { motes: 2.5 } },
	// Global events (no preset gate):
	// One hit and every pane goes at once- but the 0.4s attack ANIMATES the
	// going: the pieces visibly fly apart, keep drifting while it holds (the
	// shatterTime uniform, postfx.js), then heal on the release.
	shatter: { attack: 0.4, release: 1.2, boost: { shatter: 1, bloom: 0.4 } },
	// Near-binary envelope: PostFX gates the grid swap at 0.5- effectively a
	// hard cut in and out, the native language of a split-screen.
	multicam: { attack: 0.05, release: 0.05, boost: { multicam: 1 } },
	// Staged wide- the flock reads best with the hero small among the others.
	crowdfall: { shot: 'far', attack: 1, release: 1.5, boost: { crowd: 1 } },
	// The body's copies bloom outward and retract- staged wide so the layers
	// have room to nest around the small centered figure.
	echo: { shot: 'far', attack: 1.2, release: 1.5, boost: { echo: 1 } },
	// The mirrored double glides in from deep inside the mirror facing the
	// hero and sinks back out; the rig and the multicam feeds re-aim at the
	// midpoint of the pair (scene.js). Long ramps: the approach and the
	// retreat read as unhurried drifts, not arrivals. Staged wide so both
	// bodies fit the frame.
	twin: { shot: 'far', attack: 2.2, release: 2.6, boost: { twin: 1 } },
}

const rand = (min, max) => min + Math.random() * (max - min)
const smooth = (x) => x * x * (3 - 2 * x)

export default class MusicEvents {

	constructor(params, body, director) {
		this.params = params
		this.body = body
		this.director = director
		this.cooldown = 0
		this.prevKickHard = 0
		this.prevDropPulse = 0
		// Running fx envelopes. Several may stack (their boosts add up)- the
		// only rules live in startFx: no fx doubles itself, and shatter and
		// multicam never share the frame (two full-screen Voronoi treatments).
		this.fxList = []
		this.prevPreset = null    // signature-pity tracking- reset on every preset change
		this.signatureDone = false
		this.state = { last: '-' }   // GUI monitor binds to this
	}

	// Manual trigger (GUI test buttons): the full real path- camera staging,
	// monitor- bypassing only the chance roll, the cooldown and the preset
	// gate (the buttons audition a signature under any sky).
	trigger(name) {
		const ev = EVENTS.find((e) => e.name === name)
		if (!ev) return
		const hold = Array.isArray(ev.hold) ? rand(ev.hold[0], ev.hold[1]) : ev.hold
		if (!this.fire(ev, hold, 0.8)) return
		this.state.last = name
		// Auditioning a signature under its own sky satisfies the pity too.
		if (ev.presets?.includes(COLOR_PRESETS[this.params.autopilot.preset]?.name)) this.signatureDone = true
	}

	// Dispatch one event: body events crossfade a clip (staged with a camera
	// punch if the director idles in base); fx events start their envelope and
	// stage their own shot. False if the event could not start.
	fire(ev, hold, energy) {
		if (ev.fx) return this.startFx(ev.name, hold, energy)
		if (!this.body.playEvent(ev.name, hold)) return false
		if (this.director.mode === 'base') this.director.enterAccent(energy)
		return true
	}

	startFx(name, hold, energy) {
		const spec = FX_SPECS[name]
		if (!spec) return false
		// Stacking rules: an fx never doubles itself, and FX_CONFLICTS bars the
		// frame-owning combinations- anything else piles up, boosts adding in
		// updateFx.
		if (this.fxList.some((fx) => fx.name === name)) return false
		if (this.fxList.some((fx) => FX_CONFLICTS[name]?.includes(fx.name))) return false
		if (spec.strikes) {
			// 3-5 strikes: the first full-blast, the rest staggered close- real
			// lightning stutters. Amps stay under 0.88 on purpose: above it the
			// features' impact-frame freeze kicks in, and the 0.9 rising edge
			// would slam the palette (same contract as the entrance's 0.85 burst).
			const strikes = [{ at: 0, amp: 0.85 }]
			let t = 0
			const extra = 2 + Math.floor(Math.random() * 3)
			for (let i = 0; i < extra; i++) {
				t += rand(0.12, 0.45)
				strikes.push({ at: t, amp: rand(0.55, 0.85) })
			}
			this.fxList.push({ name, spec, t: 0, dur: t + 0.5, strikes, next: 0 })
			// Thunder montage: the strobe's jump cuts read as lightning-lit frames.
			this.director.strobe(energy)
			return true
		}
		if (spec.clip && !this.body.playEvent(spec.clip, hold)) return false
		this.fxList.push({ name, spec, t: 0, dur: hold })
		if (spec.shot) this.director.enterAccent(energy, spec.shot)
		else if (this.director.mode === 'base') this.director.enterAccent(energy)
		return true
	}

	// Advance every running fx envelope. Called even with events disabled: an
	// envelope in flight must land, not stick. Zeroes every features.boost
	// channel first- wind, motes, rays, postfx, the rim and the crowd read
	// them unconditionally every frame- then the stacked envelopes ADD up.
	updateFx(dt, features) {
		const boost = features.boost
		for (const k in boost) boost[k] = 0
		for (const fx of this.fxList) {
			fx.t += dt
			const spec = fx.spec
			if (spec.strikes) {
				// Each due strike re-arms the drop flash channel: sky burst, bloom
				// surge, camera hit, shockwave- everything the value drives.
				while (fx.next < fx.strikes.length && fx.strikes[fx.next].at <= fx.t) {
					features.dropPulse = Math.max(features.dropPulse, fx.strikes[fx.next].amp)
					fx.next++
				}
			} else {
				// Smoothstepped ease in over `attack`, release over the last
				// `release` seconds- the world sinks into the event and exhales out.
				const env = smooth(Math.min(1, fx.t / spec.attack))
					* smooth(Math.min(1, Math.max(0, (fx.dur - fx.t) / spec.release)))
				for (const k in spec.boost) boost[k] += spec.boost[k] * env
				if (spec.rateFloor !== undefined) features.rate *= 1 - (1 - spec.rateFloor) * env
			}
		}
		this.fxList = this.fxList.filter((fx) => fx.t < fx.dur)
	}

	update(dt, audio, features) {
		this.updateFx(dt, features)
		const p = this.params.events
		if (!p.enabled) return
		this.cooldown -= dt

		// Signature pity bookkeeping- must run every frame (the kick gates
		// below return early): a fresh preset re-arms its signature.
		const presetName = COLOR_PRESETS[this.params.autopilot.preset]?.name
		if (presetName !== this.prevPreset) {
			this.prevPreset = presetName
			this.signatureDone = false
		}

		// Rising edges: the hard kick (the usual roll-gated path) and the drop
		// pulse (both decay from 1 every frame).
		const kickHit = audio.kickHard > 0.9 && this.prevKickHard <= 0.9
		this.prevKickHard = audio.kickHard
		const dropHit = p.onDrop && features.dropPulse > 0.9 && this.prevDropPulse <= 0.9
		this.prevDropPulse = features.dropPulse
		// Running fx events do not silence the rest: on the usual kick+chance
		// roll, clip events AND other fx may still fire over them- startFx's
		// stacking rules are the only bar (no fx doubles itself, shatter and
		// multicam never together). The main cooldown is left untouched on an
		// overlap fire, so the baseline event pacing is unaffected.
		// A DROP bypasses the chance roll, the cooldown and the energy gate
		// entirely: the climax always lands an event on top of its palette
		// switch and camera accent.
		const overlap = this.fxList.length > 0
		if (!dropHit) {
			if (!kickHit || features.energy < p.minEnergy) return
			if (this.cooldown > 0 && !overlap) return
			if (Math.random() >= p.chance) return
		}

		// Preset gate first (signatures only exist under their sky), then the
		// energy-blended weighted pick, repeat-penalized. Already-running fx
		// and FX_CONFLICTS pairs are culled here too, so an overlap roll never
		// wastes itself on an event startFx would refuse.
		const running = new Set(this.fxList.map((fx) => fx.name))
		const pool = EVENTS.filter((ev) => (!ev.presets || ev.presets.includes(presetName))
			&& !running.has(ev.name)
			&& !FX_CONFLICTS[ev.name]?.some((name) => running.has(name)))
		if (!pool.length) return
		let total = 0
		const weights = pool.map((ev) => {
			let w = ev.calm + (ev.intense - ev.calm) * features.energy
			if (ev.name === this.state.last) w *= REPEAT_PENALTY
			// A pooled event WITH a preset gate IS this sky's signature- boosted
			// hard until it has played once under this preset.
			if (ev.presets && !this.signatureDone) w *= SIGNATURE_PITY
			total += w
			return w
		})
		let roll = Math.random() * total
		let picked = pool[0]
		for (let i = 0; i < pool.length; i++) {
			roll -= weights[i]
			if (roll <= 0) { picked = pool[i]; break }
		}

		const hold = Array.isArray(picked.hold) ? rand(picked.hold[0], picked.hold[1]) : picked.hold
		if (!this.fire(picked, hold, features.energy)) return
		this.state.last = picked.name
		if (picked.presets) this.signatureDone = true   // pity satisfied for this preset
		if (!overlap) this.cooldown = p.cooldown
	}

}
