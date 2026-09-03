import * as THREE from 'three'

// The wind director: ONE scalar (the lean angle, degrees from vertical) that
// the whole world obeys- sky flow, cloud field, streaks, body drift. Three
// drivers compose into params.wind.angle:
// - anticipation: a MAPPED drop approaching (features.dropIn, known from the
//   precomputed timeline) lays the world down over the last ~2.5s- the
//   tension becomes visible before the hit, which no realtime detector
//   could do
// - the gust: at the impact the angle is KICKED toward the opposite side,
//   and a damped spring settles it back- slam, overshoot, recover
// - the weave: a slow energy-scaled wobble keeps calm passages near-vertical
//   and intense ones gently swaying
// With params.wind.auto off, the GUI slider owns the angle untouched.
export default class Wind {

	constructor(params) {
		this.params = params
		this.angle = 0   // current lean- integrated by the spring below
		this.vel = 0
		this.side = Math.random() < 0.5 ? -1 : 1   // which way the next approach leans
		this.weavePhase = Math.random() * Math.PI * 2
		this.prevPulse = 0
	}

	update(dt, features) {
		const p = this.params.wind
		if (!p.auto) return

		// Anticipation: lay-down over the 4s approach window. The 60/1.2 target
		// is deliberately hotter than the intended lean: the spring lags a fast
		// ramp, and bench-tuned this lands the OUTPUT at ~37° on the hit.
		// dropIn is Infinity without a timeline, so the fallback live detector
		// simply skips this driver.
		let target = 0
		if (features.dropIn < 4) {
			const t = 1 - features.dropIn / 4
			target = this.side * 60 * Math.pow(t, 1.2)
		}
		// Weave: 13s period, amplitude riding the energy.
		this.weavePhase += dt * (Math.PI * 2 / 13)
		target += Math.sin(this.weavePhase) * (3 + 10 * features.energy)

		// Gust on the drop's rising edge: a velocity KICK away from the current
		// lean- the spring then crosses vertical fast, overshoots on the other
		// side and settles. A fresh side is drawn for the next approach.
		if (features.dropPulse > 0.9 && this.prevPulse <= 0.9) {
			this.vel += -Math.sign(this.angle || this.side) * 600   // bench-tuned: ~-45° gust peak
			this.side = Math.random() < 0.5 ? -1 : 1
		}
		this.prevPulse = features.dropPulse

		// Damped spring (w ~ 3.7 rad/s, ratio ~ 0.73): elastic but composed-
		// one slight overshoot, settled in ~2s.
		this.vel += (target - this.angle) * 14 * dt - this.vel * 5.5 * dt
		this.angle += this.vel * dt
		// The +-60 clamp keeps cos(angle) > 0 everywhere: the world's vertical
		// component can never vanish or flip, whatever the spring does.
		// The suspension events (Cosmos zero-G, Abyss apnea) flatten the output-
		// space and deep water have no weather; the spring keeps integrating
		// underneath, so the lean is simply back when the envelope releases.
		p.angle = THREE.MathUtils.clamp(this.angle, -60, 60) * Math.max(0, 1 - features.boost.wind)
	}

}
