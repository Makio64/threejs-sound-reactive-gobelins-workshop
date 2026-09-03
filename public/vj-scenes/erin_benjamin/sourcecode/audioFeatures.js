// Derives musically-meaningful signals from the Analyzer's raw spectrum.
// Unlike analyzer.volume (AGC: a quiet passage is renormalized toward 1),
// `energy` tracks the passage intensity- quiet music reads low, drops read
// high. It gates every punctual reaction in the scene, so the visuals ramp
// up when the music ramps up and settle when it settles.
//
// Every signal is normalized by its own slow-decaying peak: a loud master
// doesn't pin everything at 1- what matters is the level RELATIVE to the
// track's own recent maximum, so variation survives any mastering level.
// The peak floor keeps true silence reading as ~0 instead of being boosted.
export default class AudioFeatures {

	constructor(params) {
		this.params = params
		this.bass = 0     // ~86-690 Hz     body breathing
		this.mid = 0      // ~0.7-5 kHz     (unused yet- exposed for future effects)
		this.high = 0     // ~5-17 kHz      hats/cymbals → RGB shift
		this.energy = 0   // passage intensity → global reactivity gate
		this.flow = 0     // smoothed kick- a bell-shaped swell per beat, for VELOCITIES
		this.bpm = 100    // live tempo estimate from kick intervals
		this.pace = 0.5   // bpm normalized between bpmSlow..bpmFast, eased
		this.rate = 1     // global world-speed multiplier derived from pace
		this.dropPulse = 0   // 1 on a detected drop, decays over ~0.7s
		// FX boost channels- written by MusicEvents every frame (preset-signature
		// event envelopes), not by the audio. Consumers: Wind (wind: 0..1 output
		// flattening), Motes (motes: presence + twinkle), Rays (rays: opacity
		// mult · raysCount: extra shafts), PostFX (bloom / afterimage adds,
		// shatter / echo: LensShader amounts, multicam: grid-pass gate),
		// Crowd (crowd: falling-clones presence).
		this.boost = { wind: 0, motes: 0, rays: 0, raysCount: 0, bloom: 0, afterimage: 0, shatter: 0, echo: 0, multicam: 0, crowd: 0, twin: 0 }
		this.quietTime = 0   // seconds spent below the quiet threshold
		this.riseTime = 0    // seconds since the energy left the quiet zone
		this.hotTime = 0     // seconds the INSTANT signal has been hot
		this.bassQuiet = 0   // seconds the bass band has been ducked
		this.bassRise = 0    // seconds since the bass came back
		this.dropCooldown = 0   // refractory shared by the drop paths
		this.tSlow = 1       // slow follower of the instant signal- onset-path baseline.
		// Starts HIGH: starting at 0 made the session's very first loud second
		// read as a giant jump and fire a phantom drop at play start.
		this.kickAgo = 9     // seconds since the last hard kick
		this.dipTime = 0     // seconds the instant signal has been in a deep dip
		this.dipAgo = 9      // seconds since the signal left the dip
		this.timelineActive = false   // set each frame by DropTimeline- true = it owns the drops
		this.dropIn = Infinity        // seconds to the next mapped drop (anticipation hook)
		this.debugDrops = false   // console gate-traces for missed-drop hunting- flip on to tune
		this._dbgTimer = 0
		this._dbgWasHot = false
		this._dbgPrevBass = 0
		this.peaks = { bass: 0.05, mid: 0.05, high: 0.05, energy: 0.05 }
		// Track-lifetime reference peaks (instant attack, ~4%/min decay)- the
		// fast peaks may not sink below 40% of them. Unanchored, a long quiet
		// passage decays a fast peak INTO the quiet level and the ratio pins
		// every signal at ~1: silence reads as a drop. Anchored, the quiet is
		// boosted at most 2.5x, and a real peak still snaps the ratio to 1
		// instantly.
		this.refs = { bass: 0.05, mid: 0.05, high: 0.05, energy: 0.05 }
		this.floorLevel = 0.05   // slow-rising minimum tracker- see update()
		this.time = 0
		this.prevKick = 0
		this.lastKickAt = null
		this.intervals = []
	}

	// Normalize a raw band level by its slow-decaying peak (instant attack,
	// ~40% decay per minute of silence), floored at 40% of the track-lifetime
	// reference so sustained quiet can never renormalize itself to ~1.
	normalized(key, raw, dt) {
		const refs = this.refs
		refs[key] = Math.max(0.05, raw, refs[key] * Math.exp(-dt / 1500))
		const peaks = this.peaks
		peaks[key] = Math.max(0.05, refs[key] * 0.4, raw, peaks[key] * Math.pow(0.99985, dt * 60))
		return raw / peaks[key]
	}

	// External drop trigger (the precomputed timeline)- shares the pulse and
	// the refractory with the live paths so a handover between the two can
	// never double-fire.
	fireDrop(source = 'external') {
		this.dropPulse = 1
		this.dropCooldown = 8
		this.quietTime = 0
		this.bassQuiet = 0
		if (this.debugDrops) console.log(`[drop] FIRE via ${source} @${this.time.toFixed(1)}s`)
	}

	update(dt, audio) {
		const p = this.params.audio
		const f = audio.volumeByFrequency
		// Band means over fftSize 512 ⇒ 256 bins of ~86 Hz each.
		this.bass = follow(this.bass, this.normalized('bass', mean(f, 1, 8), dt), dt, 0.04, 0.3)
		this.mid = follow(this.mid, this.normalized('mid', mean(f, 8, 60), dt), dt, 0.04, 0.3)
		this.high = follow(this.high, this.normalized('high', mean(f, 60, 200), dt), dt, 0.04, 0.3)

		// Intensity: where the spectrum sits inside the track's ACTUAL dynamic
		// range- (raw - floor) / (peak - floor). Peak-only normalization pinned
		// compressed music (which lives in a narrow band near its peak) at ~1
		// permanently; tracking the floor too (rises slowly toward raw over
		// ~25s, snaps down instantly) re-spreads that band over 0..1. Then
		// shaped between quiet/loud and eased asymmetrically: a drop ramps the
		// scene up in ~attack seconds, a breakdown settles over ~release.
		const raw = mean(f, 1, 120)
		// The per-frame mean is transient-dominated: in a drums-only bridge one
		// kick spikes it to the section peak for ~50ms, so floor/peak/energy
		// read a 0.35s average instead- a sparse passage AVERAGES low. The
		// instant rel (t below) keeps the raw transients: the hot/jump/breath
		// drop paths need them.
		this.rawSmooth = follow(this.rawSmooth ?? raw, raw, dt, 0.35, 0.35)
		const peaks = this.peaks
		// Same lifetime anchor as normalized(): without it a long breakdown
		// shrinks (peak - floor) to the 0.02 clamp and the tiniest flutter
		// saturates the energy.
		this.refs.energy = Math.max(0.05, this.rawSmooth, this.refs.energy * Math.exp(-dt / 1500))
		peaks.energy = Math.max(0.05, this.refs.energy * 0.4, this.rawSmooth, peaks.energy * Math.pow(0.99985, dt * 60))
		// The floor tracks DOWN fast but NOT instantly (3s vs 25s up): snapping
		// to every inter-beat trough turned rel into a beat detector- any
		// passage WITH a beat read hot, so perceived-calm sections pinned the
		// energy at ~1 and armed nothing for the next drop.
		const floorTau = this.rawSmooth < this.floorLevel ? 3 : 25
		this.floorLevel += (this.rawSmooth - this.floorLevel) * (1 - Math.exp(-dt / floorTau))
		const denom = Math.max(0.02, peaks.energy - this.floorLevel)
		const shape = (x) => {
			const s = Math.min(1, Math.max(0, (x - p.quiet) / Math.max(0.01, p.loud - p.quiet)))
			return s * s * (3 - 2 * s)
		}
		// t: instantaneous heat (transients kept)- drives the drop paths below.
		// The passage-averaged flavor drives the energy envelope.
		const t = shape((raw - this.floorLevel) / denom)
		this.energy = follow(this.energy, shape((this.rawSmooth - this.floorLevel) / denom), dt, p.attack, p.release)

		// Smoothed kick for anything driving a VELOCITY (camera orbit, sky scroll,
		// cloud rise): the raw kick is a step- stepping a velocity reads as a
		// stutter- while this swells and settles. Raw kick stays for flashes.
		this.flow = follow(this.flow, audio.kick, dt, 0.09, 0.35)

		// Live BPM from the soft-kick intervals (median of the last 6, outliers
		// rejected), then a normalized pace and a WORLD-SPEED multiplier: the
		// whole scene- animation, sky, clouds, streaks, orbit- accelerates and
		// settles with the track's tempo.
		this.time += dt
		const kickHit = audio.kick > 0.9 && this.prevKick <= 0.9
		this.prevKick = audio.kick
		if (kickHit) {
			if (this.lastKickAt !== null) {
				let gap = this.time - this.lastKickAt
				// Octave folding, but ONLY for gaps near an integer multiple of the
				// current period (±15%- the signature of MISSED beats on the same
				// grid, i.e. a breakdown). A gap that fits no multiple is a genuine
				// tempo change and must pass through raw, or the estimate can never
				// move. No folding on SHORT gaps: the kick detector's refractory
				// hold already prevents double-fires, and folding there swallowed
				// genuine tempo doublings.
				const period = 60 / this.bpm
				const ratio = gap / period
				const nearest = Math.round(ratio)
				if (nearest >= 2 && Math.abs(ratio - nearest) < 0.15 * nearest) gap /= nearest
				if (gap >= 0.25 && gap <= 2.0) {   // 30-240 bpm plausibility window
					this.intervals.push(gap)
					if (this.intervals.length > 6) this.intervals.shift()
					const sorted = [...this.intervals].sort((a, b) => a - b)
					this.bpmTarget = 60 / sorted[Math.floor(sorted.length / 2)]
				}
			}
			this.lastKickAt = this.time
		}
		this.bpm = follow(this.bpm, this.bpmTarget ?? this.bpm, dt, 1.5, 1.5)
		const pt = Math.min(1, Math.max(0, (this.bpm - p.bpmSlow) / Math.max(1, p.bpmFast - p.bpmSlow)))
		this.pace = follow(this.pace, pt, dt, 1.0, 1.5)
		this.rate = p.rateMin + (p.rateMax - p.rateMin) * this.pace

		// Drop detection: the INSTANT signal (t- the smoothed energy lags ~attack
		// behind the hit) lands hot right after a sustained quiet stretch.
		// quietTime survives the rise for 1.2s: a real drop fires inside that
		// window, a creeping build-up expires it- no more pulses fired mid-build
		// or on the build's slow arrival. Two confirmations filter the fakes:
		// hotTime rejects one-frame flickers, and the smoothed-energy floor
		// rejects one-shot stabs (a lone snare in a breakdown spikes t but
		// cannot move the smoothed energy in 0.3s). dropPulse spikes to 1 and
		// decays- consumers watch its rising edge for one-shot moments (palette
		// switch, camera accent) and use its value as a flash envelope.
		if (this.energy < 0.4) {
			this.quietTime += dt
			this.riseTime = 0
		} else {
			this.riseTime += dt
			if (this.riseTime > 1.2) this.quietTime = 0
		}
		this.hotTime = t > 0.8 ? this.hotTime + dt : 0
		// Second arming path, for the classic breakdown → LOUD build → drop:
		// the build keeps the overall energy high (which expires quietTime
		// above), but producers pull the low end out before the hit- so "bass
		// ducked for a while, then slamming back while the full band is hot"
		// marks the drop the full-band path cannot see. A steady groove never
		// keeps the smoothed bass under the duck threshold, so it cannot arm;
		// a slow bass swell overruns the 0.5s return grace, so it cannot fire.
		if (this.bass < 0.35) {
			this.bassQuiet += dt
			this.bassRise = 0
		} else {
			this.bassRise += dt
			if (this.bassRise > 0.8) this.bassQuiet = 0
		}
		this.dropCooldown = Math.max(0, this.dropCooldown - dt)
		// Symmetric slow baseline: a pumping section averages out (peaks never
		// clear the jump bar over their own mean), while a sustained lower
		// plateau- a build- settles it low enough for the slam to jump over.
		this.tSlow = follow(this.tSlow, t, dt, 2.5, 2.5)
		this.kickAgo = audio.kickHard > 0.9 ? 0 : this.kickAgo + dt
		// Deep-breath tracker: a genuine pre-drop breath sits under 0.55 for a
		// sustained beat; the fast 0.3s expiry is the anti-pumping guard- the
		// brief per-cycle dips of sidechain pumping cannot chain across cycles.
		if (t < 0.55) {
			this.dipTime += dt
			this.dipAgo = 0
		} else {
			this.dipAgo += dt
			if (this.dipAgo > 0.3) this.dipTime = 0
		}
		// The bass floor on the quiet path is what separates a drop from a loud
		// SECTION START (an abrupt build entry, a bassless fill): both land hot
		// after quiet, only the drop brings the low end with it.
		// 0.5s under the quiet line is enough: with the 2s energy release, even
		// reaching the line means the track pulled back for ~2 real seconds-
		// short-breath drops (one quiet bar, then the slam) must fire.
		const dropQuiet = this.hotTime > 0.1 && this.energy > 0.55 && this.quietTime > 0.5 && this.bass > 0.4
		// 0.9s duck threshold: the smoothed bass needs ~0.3s to register the cut,
		// so a 1.5s (one-bar) pre-drop cut arms with margin- a single skipped
		// beat does not. The return bar is 0.6, not higher: the instant-attack
		// peak ratchets on the track's LOUDEST drop, and a later, slightly
		// softer drop must still clear it- the arming already guarantees the
		// bass sat under 0.35 less than half a second ago, so reaching 0.6 is
		// a slam by slope, whatever the absolute level.
		const dropBass = this.bass > 0.6 && t > 0.8 && this.bassQuiet > 0.45
		// Third path, for the drops the other two cannot arm (no breakdown, no
		// bass cut- e.g. a bass-riding build): the instant signal leaping far
		// above its own 2s average, landing ON a hard kick. A steady groove
		// keeps t glued to tSlow, so it can never fire here; the energy floor
		// keeps lone accents in true silence out (the other paths own those).
		// Recall over precision throughout: a missed drop is a dead climax, an
		// extra pulse is a flash on an already-hot moment.
		// Two onset flavors, both anchored on a recent hard kick (150ms window-
		// demanding the exact kick frame missed slams landing a few frames off).
		// Jump: the signal leaps over its own slow average- catches the slam at
		// the end of a sustained-but-not-hot build plateau; hotTime<0.4 keeps a
		// section that STAYS hot from refiring at every cooldown expiry.
		// Breath: the slam right after a deep short dip- the one-bar breath
		// climaxes inside loud sections that no other path can arm on.
		const dropJump = t > 0.85 && t - this.tSlow > 0.3 && this.hotTime < 0.4 && this.kickAgo < 0.15 && this.energy > 0.3
		const dropBreath = t > 0.85 && this.dipTime > 0.2 && this.kickAgo < 0.15 && this.energy > 0.3
		// Graduated spacing: 2s of absolute refractory, then until 8s only a
		// STRUCTURAL candidate may punch through (a full pre-drop bass cut or a
		// real breakdown- a legitimate double drop has one); the reflex paths
		// (jump/breath/short-quiet) wait out the full window, so one musical
		// moment can no longer machine-gun pulses every 2s.
		const strong = (dropBass && this.bassQuiet > 0.9) || (dropQuiet && this.quietTime > 1.5)
		const spaced = this.dropCooldown <= 0 || (strong && this.dropCooldown <= 6)
		// The live paths stand down while the precomputed timeline owns the
		// current track- they only cover mic input, the host iframe and tracks
		// whose analysis is pending or failed.
		const canFire = !this.timelineActive && (dropQuiet || dropBass || dropJump || dropBreath) && spaced
		if (canFire) {
			this.dropPulse = 1
			this.dropCooldown = 8   // see the spaced gate: first 2s absolute, then structural-only
			this.quietTime = 0
			this.bassQuiet = 0
		}
		// Missed-drop diagnostics: one line per FIRE, and one per candidate
		// moment (full band turning hot, or the bass surging back) that did NOT
		// fire, with every gate's value- play the track, and the reason a given
		// drop was ignored reads straight off the console. Throttled to one
		// line per 2s so loud sections cannot spam.
		if (this.debugDrops && !this.timelineActive) {
			this._dbgTimer = Math.max(0, this._dbgTimer - dt)
			const hot = t > 0.8
			const bassSurge = this.bass > 0.6 && this._dbgPrevBass <= 0.6
			if (canFire) {
				console.log(`[drop] FIRE via ${dropBass ? 'bass' : dropBreath ? 'breath' : dropJump ? 'jump' : 'quiet'} @${this.time.toFixed(1)}s`)
			} else if (((hot && !this._dbgWasHot) || bassSurge) && this._dbgTimer <= 0) {
				this._dbgTimer = 2
				console.log(`[drop] candidate NOT fired @${this.time.toFixed(1)}s` +
					`- bass=${this.bass.toFixed(2)} bassQuiet=${this.bassQuiet.toFixed(2)}/0.45` +
					` quietTime=${this.quietTime.toFixed(2)}/0.5 energy=${this.energy.toFixed(2)}` +
					` t=${t.toFixed(2)} tSlow=${this.tSlow.toFixed(2)} kickAgo=${this.kickAgo.toFixed(2)}` +
					` cooldown=${this.dropCooldown.toFixed(1)}`)
			}
			this._dbgWasHot = hot
			this._dbgPrevBass = this.bass
		}
		this.dropPulse = Math.max(0, this.dropPulse - dt * 1.5)
		// Impact frame: the whole world (rate drives everything that moves)
		// freezes for the first ~80ms of the drop hit, then blasts back- the
		// breath before the explosion.
		if (this.dropPulse > 0.88) this.rate *= 0.08
	}

}

function mean(arr, start, end) {
	let s = 0
	for (let i = start; i < end; i++) s += arr[i]
	return s / (end - start)
}

// Frame-rate independent exponential follower with separate attack/release time constants.
function follow(current, target, dt, attackTau, releaseTau) {
	const tau = target > current ? attackTau : releaseTau
	return current + (target - current) * (1 - Math.exp(-dt / tau))
}
