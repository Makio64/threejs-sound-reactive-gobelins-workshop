// The direction, structured like a music video: the HOME state is the
// original floating orbit (slow LFO breathing on radius/height- it can hold
// for a long time, with an occasional soft reframe), and on hard kicks the
// camera PUNCHES to an accent shot- held a few seconds, then cut back to the
// flow. Accents are gated by energy, a cooldown and a chance roll, so strong
// beats regain a precise visual meaning and special shots stay precious.
// The CameraRig stays the executor- this module only writes its state.
const ACCENT_SHOTS = [
	// radius/height: [min, max] picked at accent time. lookY: lookAt height.
	// speedMult/bobMult scale the rig's orbit speed and vertical bob.
	// calm/intense: rarity weights blended by energy (higher = more frequent).
	// far: the body becomes a small figure lost in the sky.
	{ name: 'far', radius: [9, 15], height: [1.0, 3.5], lookY: 0, speedMult: 0.7, bobMult: 1.6, calm: 3, intense: 2 },
	// closeup rework: the old 1.7-2.4 radius sat inside the arm span (~1.55 with
	// the bass pulse)- limbs kept sweeping the lens. Pulled back out of reach,
	// framed at the torso, livelier orbit.
	{ name: 'closeup', radius: [2.6, 3.4], height: [0.3, 0.9], lookY: 0.3, speedMult: 0.75, bobMult: 0.35, calm: 1.5, intense: 2.5 },
	{ name: 'lowAngle', radius: [2.5, 3.5], height: [-2.2, -1.2], lookY: 0.2, speedMult: 0.8, bobMult: 0.4, calm: 1, intense: 2 },
	{ name: 'topDown', radius: [1.2, 2.0], height: [2.6, 3.4], lookY: -0.3, speedMult: 0.9, bobMult: 0.3, calm: 1, intense: 2 },
	// dolly: radius glides from radius[0] toward radius[1] over the accent.
	{ name: 'dolly', radius: [6.5, 2.5], height: [0.4, 0.9], lookY: 0.1, speedMult: 0.35, bobMult: 0.5, dolly: true, calm: 2, intense: 1 },
	// Bone-tracked shots (kind handled by the CameraRig):
	// face- in front of the head, looking at it. below- under the falling
	// body, silhouette against the sky. hand- close on a hand, the body behind.
	{ name: 'face', track: 'face', dist: [0.9, 1.4], calm: 1, intense: 2 },
	{ name: 'below', track: 'below', dist: [2.2, 3.2], calm: 2, intense: 2 },
	{ name: 'hand', track: 'hand', dist: [0.5, 0.9], calm: 2, intense: 1 },
]

const rand = (min, max) => min + Math.random() * (max - min)
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Closest the zoom drift may come, per shot kind- outside the body even with
// arms spread and the bass scale pulse (~1.55x on a ~1 unit half arm-span).
const ORBIT_MIN_RADIUS = 1.6
const TRACK_MIN_DIST = { face: 0.55, hand: 0.35, below: 1.6 }
const ORBIT_MAX_RADIUS = 20

export default class Director {

	constructor(params, rig) {
		this.params = params
		this.rig = rig
		this.mode = 'base'
		this.phase = rand(0, 100)   // LFO phase for the base orbit's breathing
		this.prevKickHard = 0
		this.cooldown = 0
		this.accentTime = 0
		this.accentDur = 0
		this.dollyTau = 0
		this.drift = null
		this.strobeLeft = 0
		this.strobeTimer = 0
		this.shot = null
		this.state = { shot: 'base' }   // GUI monitor binds to this
		this.enterBase(true)
	}

	update(dt, audio, features) {
		const p = this.params.director
		if (!p.enabled) return
		this.phase += dt

		// Rising edge of the hard kick (it decays from 1 every frame).
		const kickHit = audio.kickHard > 0.9 && this.prevKickHard <= 0.9
		this.prevKickHard = audio.kickHard

		if (this.mode === 'base') {
			// The home flow: slow LFO breathing on radius/height (different
			// periods avoid lock-in- the eye reads it as wandering). Height swing
			// kept modest (±0.8 around 0.4): the old ±1.5 topped out at 2.1 and
			// the high half was a steep plunge that lost the body in the frame.
			const r = this.rig.orbit
			r.radius = 4.8 + Math.sin(this.phase * (Math.PI * 2) / 32) * 1.8
			r.baseHeight = 0.4 + Math.sin(this.phase * (Math.PI * 2) / 27 + 1.7) * 0.8
			// The look target rides 60% of the height LFO: with lookAt pinned, the
			// LFO's descending half became a sustained PITCH sweep dragging the
			// whole world- background included- down the screen (the slowed sky
			// scroll no longer masks it). Following most of it keeps the framing
			// breathing while the horizon stays quiet.
			this.rig.lookY = (r.baseHeight - 0.4) * 0.6

			this.cooldown -= dt
			this.baseTime += dt
			if (this.baseTime >= this.baseRecutAt) this.enterBase()   // occasional soft reframe

			const wants = kickHit && this.cooldown <= 0 && features.energy >= p.minEnergy
			if (wants && Math.random() < p.accentChance) this.enterAccent(features.energy)
			return
		}

		// Accent shot running.
		// Strobe: a burst of ultra-fast cuts (one every 0.18s)- after the last
		// one, the current accent lives its normal life then returns to base.
		if (this.strobeLeft > 0) {
			this.strobeTimer += dt
			if (this.strobeTimer >= 0.18) {
				this.strobeTimer = 0
				this.strobeLeft--
				this.enterAccent(features.energy)
			}
		}
		this.accentTime += dt
		if (this.shot.dolly) {
			const r = this.rig.orbit
			r.radius += (this.shot.radius[1] - r.radius) * (1 - Math.exp(-dt / this.dollyTau))
		}
		// Random per-accent zoom drift (in / out / hold, rolled at accent time).
		if (this.drift) {
			const k = 1 - Math.exp(-dt / this.drift.tau)
			if (this.rig.trackShot) this.rig.trackShot.dist += (this.drift.target - this.rig.trackShot.dist) * k
			else this.rig.orbit.radius += (this.drift.target - this.rig.orbit.radius) * k
		}
		if (this.accentTime >= this.accentDur) {
			// An expiring accent may chain straight into another shot (montage
			// burst)- the chance decays geometrically, so base stays the norm.
			// The cooldown only arms when the camera actually returns home.
			if (Math.random() < p.chainChance) {
				this.enterAccent(features.energy)
			} else {
				this.enterBase()
				this.cooldown = p.accentCooldown
			}
		}
	}

	// Cut (back) to the home flow: fresh angle + direction, LFOs take over.
	enterBase(initial = false) {
		this.mode = 'base'
		this.shot = null
		this.state.shot = 'base'
		this.rig.trackShot = null
		this.drift = null
		this.rig.lookY = 0
		this.rig.shotSpeedMult = 1
		this.rig.shotBobMult = 1
		if (!initial) this.rig.orbit.angle += rand(1.2, 2.5) * (Math.random() < 0.5 ? -1 : 1)
		this.rig.orbitDir = Math.random() < 0.5 ? -1 : 1
		this.baseTime = 0
		this.baseRecutAt = rand(15, 25)
	}

	// Hard-cut to an accent shot, picked by energy-blended rarity weights
	// (never the shot already running- matters when accents chain). A
	// signature event may force a named shot instead (zero-G stages on 'far').
	enterAccent(energy, forceName = null) {
		let next = forceName ? ACCENT_SHOTS.find((s) => s.name === forceName) : null
		if (!next) {
			let total = 0
			const weights = ACCENT_SHOTS.map((s) => {
				const w = s === this.shot ? 0 : s.calm + (s.intense - s.calm) * energy
				total += w
				return w
			})
			let roll = Math.random() * total
			next = ACCENT_SHOTS[0]
			for (let i = 0; i < ACCENT_SHOTS.length; i++) {
				roll -= weights[i]
				if (roll <= 0) { next = ACCENT_SHOTS[i]; break }
			}
		}
		this.mode = 'accent'
		this.shot = next
		this.state.shot = next.name
		this.accentTime = 0
		this.accentDur = rand(this.params.director.accentMin, this.params.director.accentMax)

		if (next.track) {
			this.rig.trackShot = {
				kind: next.track,
				dist: rand(next.dist[0], next.dist[1]),
				side: rand(-1, 1), side2: rand(-1, 1),
				fresh: true,
			}
			this.rollDrift(next)
			return
		}
		this.rig.trackShot = null
		const r = this.rig.orbit
		r.angle += rand(1.2, 2.5) * (Math.random() < 0.5 ? -1 : 1)
		this.rig.orbitDir = Math.random() < 0.5 ? -1 : 1
		r.radius = next.dolly ? next.radius[0] : rand(next.radius[0], next.radius[1])
		r.baseHeight = rand(next.height[0], next.height[1])
		this.rig.lookY = next.lookY
		this.rig.shotSpeedMult = next.speedMult
		this.rig.shotBobMult = next.bobMult
		if (next.dolly) this.dollyTau = rand(2, 4)   // short accent- close the distance fast
		this.rollDrift(next)
	}

	// Strobe montage: 3-4 hard cuts in ~0.7s- fired on some drops.
	strobe(energy) {
		this.strobeLeft = 2 + Math.floor(Math.random() * 2)   // cuts AFTER the first one
		this.strobeTimer = 0
		this.enterAccent(energy)
	}

	// Signature entrance (scene.play- every time the host loop brings us back
	// on screen, and the standalone start): a dive- the dolly launched from
	// farther out than usual, held longer, closing fast on the body.
	entrance() {
		const dolly = ACCENT_SHOTS.find((s) => s.name === 'dolly')
		this.mode = 'accent'
		this.shot = dolly
		this.state.shot = 'dolly'
		this.accentTime = 0
		this.accentDur = 4.5
		this.drift = null
		this.rig.trackShot = null
		const r = this.rig.orbit
		r.angle += rand(1.2, 2.5) * (Math.random() < 0.5 ? -1 : 1)
		this.rig.orbitDir = Math.random() < 0.5 ? -1 : 1
		r.radius = 9
		r.baseHeight = rand(0.4, 0.9)
		this.rig.lookY = dolly.lookY
		this.rig.shotSpeedMult = dolly.speedMult
		this.rig.shotBobMult = dolly.bobMult
		this.dollyTau = 2.5
	}

	// Roll the zoom drift for the accent that was just cut to: zoom in, zoom out
	// or hold, gliding toward a clamped target so the lens never enters the body.
	rollDrift(next) {
		this.drift = null
		if (next.dolly) return   // the dolly IS a zoom- don't stack another one
		const roll = Math.random()
		if (roll >= this.params.director.zoomDrift) return
		const dir = roll < this.params.director.zoomDrift * 0.5 ? -1 : 1
		const tau = rand(5, 10)
		if (next.track) {
			const base = this.rig.trackShot.dist
			this.drift = { tau, target: clamp(base * (1 + dir * rand(0.3, 0.6)), TRACK_MIN_DIST[next.track], base * 1.8) }
		} else {
			const base = this.rig.orbit.radius
			this.drift = { tau, target: clamp(base * (1 + dir * rand(0.25, 0.55)), ORBIT_MIN_RADIUS, ORBIT_MAX_RADIUS) }
		}
	}

}
