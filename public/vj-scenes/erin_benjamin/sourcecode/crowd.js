import * as THREE from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'

import { BLOOM_LAYER } from './config.js'

// The crowdfall event: other bodies falling around the hero. A fixed pool of
// skinned clones (built once at init, hidden outside events) scattered at
// random distances, each with its own animation phase and a RELATIVE fall
// speed- the world moves with the hero, so a clone falling faster than him
// drifts DOWN the frame, a slower one floats up past. Anim speed follows the
// relative speed so a faster faller also tumbles faster.
// No pop-in: everyone spawns OFFSCREEN and enters the frame by their own
// motion- fast fallers from above, risers from below. When the envelope
// (features.boost.crowd) releases, the relative speeds swell so the flock
// clears the frame the same way it arrived instead of vanishing.
// Clones share the hero's material (re-grabbed each event- the GUI can swap
// it live), so the rim/preset colors stay one single source of truth.
// And they LIVE: each clone occasionally throws a one-shot clip (spin,
// backflip) on its own random schedule, crossfaded like the hero's events.
const COUNT = 6
const FADE = 0.6
// Simplified cuts of the hero's EVENT_TUNING (body.js): slowed one-shots,
// the backflip skipping its grounded crouch, and the SAME limbMix weights-
// the falling clip's limb tracks layered over the trick keep the flailing,
// so a clone's figure stays involuntary like the hero's. At clone distances
// the clamp pose at the clip end reads fine through the long return fade.
const CLONE_CLIPS = {
	spin: { timeScale: 0.5, startAt: 0, limbMix: 0.8 },
	backflip: { timeScale: 0.28, startAt: 0.15, limbMix: 2.0 },
}

export default class Crowd {

	constructor(params) {
		this.params = params
		this.body = null
		this.group = null
		this.clones = []
		this.wasActive = false
		this.draining = false   // envelope landed but clones still in frame- keep them flying out
	}

	init(scene, body) {
		if (!body.object || !body.clips.falling) return
		this.body = body
		this.group = new THREE.Group()
		this.group.visible = false
		scene.add(this.group)
		for (let i = 0; i < COUNT; i++) {
			// clone() runs after body.normalize(): the copies inherit the hero's
			// scale + centering. Same render setup as the hero (no frustum cull on
			// skinned bounds, bloom layer) so they read as the same being.
			const obj = clone(body.object)
			obj.traverse((child) => {
				if (child.isMesh || child.isSkinnedMesh) {
					child.frustumCulled = false
					child.layers.enable(BLOOM_LAYER)
				}
			})
			const wrapper = new THREE.Group()
			wrapper.add(obj)
			this.group.add(wrapper)   // hidden with the group- clones enter by moving into frame
			const mixer = new THREE.AnimationMixer(obj)
			const actions = { falling: mixer.clipAction(body.clips.falling) }
			for (const name in CLONE_CLIPS) {
				if (!body.clips[name]) continue
				actions[name] = mixer.clipAction(body.clips[name])
				actions[name].setLoop(THREE.LoopOnce)
				actions[name].clampWhenFinished = true
			}
			actions.falling.play()
			// Aux layers, kept OUT of `actions` so the one-shot picker never
			// draws them: hips position (event clips are rotation-only) and the
			// flailing limbs- same contract as the hero's playEvent.
			const aux = {
				hips: body.hipsClip ? mixer.clipAction(body.hipsClip) : null,
				limbs: body.limbClip ? mixer.clipAction(body.limbClip) : null,
			}
			const c = { wrapper, mixer, actions, aux, current: actions.falling, vy: 0, animSpeed: 1, eventIn: 0 }
			mixer.addEventListener('finished', () => this.endCloneEvent(c))
			this.clones.push(c)
		}
	}

	// A clone throws a one-shot: crossfade from its falling loop with the
	// hero's aux layering (hips height held, limbs flailing at limbMix), the
	// mixer's 'finished' listener brings it back by itself.
	playCloneEvent(c) {
		if (c.current !== c.actions.falling) return
		const names = Object.keys(c.actions).filter((n) => n !== 'falling')
		if (!names.length) return
		const name = names[Math.floor(Math.random() * names.length)]
		const tuning = CLONE_CLIPS[name]
		const action = c.actions[name]
		const fallingTime = c.actions.falling.time   // aux layers stay in phase with the loop
		action.reset().setEffectiveTimeScale(tuning.timeScale).setEffectiveWeight(1).fadeIn(FADE).play()
		action.time = tuning.startAt
		this.body.startAux(c.aux.hips, 1, FADE, fallingTime)
		if (tuning.limbMix) this.body.startAux(c.aux.limbs, tuning.limbMix, FADE, fallingTime)
		c.actions.falling.fadeOut(FADE)
		c.current = action
	}

	endCloneEvent(c) {
		c.actions.falling.reset().setEffectiveWeight(1).fadeIn(FADE * 1.5).play()
		c.actions.falling.time = Math.random() * this.body.clips.falling.duration
		c.current.fadeOut(FADE * 1.5)
		c.aux.hips?.fadeOut(FADE * 1.5)
		c.aux.limbs?.fadeOut(FADE * 1.5)
		c.current = c.actions.falling
	}

	// Re-roll every clone for a fresh event: random ring around the hero (near
	// silhouettes to far specks), a relative fall speed with its offscreen
	// entry point matched to it, and the hero's CURRENT material.
	place() {
		const duration = this.body.clips.falling.duration
		const placed = []   // accepted x/z spots- rejection sampling keeps clones apart
		for (const c of this.clones) {
			// Truly scattered ring, from near passers-by to specks deep in the
			// background (up to 30 units out), with a minimum x/z separation so
			// no two clones read as a pair: re-roll up to 20 times, keep the
			// last try if the ring is too crowded.
			let x = 0
			let z = 0
			let radius = 4
			for (let tries = 0; tries < 20; tries++) {
				const angle = Math.random() * Math.PI * 2
				radius = 4 + Math.random() * 26
				x = Math.cos(angle) * radius
				z = Math.sin(angle) * radius
				if (placed.every((p) => (p.x - x) * (p.x - x) + (p.z - z) * (p.z - z) > 4.5 * 4.5)) break
			}
			placed.push({ x, z })
			// Bounded away from 0 so everyone actually crosses into frame during
			// the event. vy < 0 = falls faster than the hero (drifts down).
			const dir = Math.random() < 0.5 ? -1 : 1
			c.vy = dir * (1.2 + Math.random() * 1.8)
			c.animSpeed = Math.max(0.4, 1 - c.vy * 0.25)
			// Offscreen entry matched to the motion: fast fallers above the frame
			// coming down, risers below it coming up. The hidden band SCALES with
			// the distance- the camera's vertical cone widens with depth, so a
			// background clone needs a far higher |y| to start (and later exit)
			// out of view than a near one.
			c.yEdge = 6 + radius * 0.5
			const y = -dir * (c.yEdge + Math.random() * 2)
			c.wrapper.position.set(x, y, z)
			c.wrapper.visible = true   // may have been culled by the previous event's drain
			c.wrapper.rotation.y = Math.random() * Math.PI * 2
			// Clean animation slate: back on the falling loop at a fresh phase
			// (a previous event may have left the clone mid-clip), and a first
			// one-shot scheduled- each clone lives on its own clock.
			for (const name in c.actions) c.actions[name].stop()
			c.aux.hips?.stop()
			c.aux.limbs?.stop()
			c.actions.falling.reset().setEffectiveWeight(1).play()
			c.actions.falling.time = Math.random() * duration
			c.current = c.actions.falling
			c.eventIn = 1.5 + Math.random() * 6
			c.wrapper.traverse((child) => {
				if (child.isMesh || child.isSkinnedMesh) child.material = this.body.mat
			})
		}
		this.peak = 0
		this.releasing = false
	}

	update(dt, features) {
		if (!this.group) return
		const presence = features.boost.crowd
		const active = presence > 0.001
		if (active && !this.wasActive) this.place()
		if (!active && this.wasActive) this.draining = true   // envelope landed- fly everyone OUT before hiding
		this.wasActive = active
		if (!active && !this.draining) {
			this.group.visible = false
			return
		}
		this.group.visible = true
		// Envelope phase: once presence turns down from its peak the event is
		// releasing- speeds swell so the flock exits through the top and bottom
		// of the frame. The drain then keeps each clone flying until it is
		// GENUINELY offscreen (past its own depth-scaled yEdge, beyond the
		// band it spawned in)- a despawn can never happen in view.
		if (presence >= this.peak) this.peak = presence
		else if (presence < this.peak - 0.05) this.releasing = true
		const exitBoost = this.releasing || this.draining ? 1 + (1 - presence) * 4 : 1
		// Same world-speed contract as the hero's mixer (rate × slowMo blend)-
		// the whole flock suspends and releases with the music together.
		const s = this.params.body.slowMo
		const base = features.rate * (s + (1 - s) * features.energy)
		let inFlight = 0
		for (const c of this.clones) {
			if (!c.wrapper.visible) continue
			c.wrapper.position.y += c.vy * exitBoost * base * dt
			c.mixer.update(dt * base * c.animSpeed)
			// Personal one-shot clock: a spin or backflip now and then- but not
			// while draining, an exit is no moment to start a trick.
			c.eventIn -= dt
			if (c.eventIn <= 0 && !this.draining) {
				this.playCloneEvent(c)
				c.eventIn = 4 + Math.random() * 8
			}
			if (this.draining && Math.abs(c.wrapper.position.y) > c.yEdge + 3) c.wrapper.visible = false
			else inFlight++
		}
		if (this.draining && inFlight === 0) {
			this.draining = false
			this.group.visible = false
		}
	}

}
