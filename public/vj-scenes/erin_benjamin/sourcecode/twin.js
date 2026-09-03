import * as THREE from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'

import { BLOOM_LAYER } from './config.js'

// The twin event: a MIRRORED double facing the hero, doing everything he
// does. No animation logic of its own- every frame the hero's bone locals
// are copied onto the clone's skeleton, so events, aux layers and one-shots
// mirror for free. The mirroring itself is geometric: the wrapper reflects
// across the vertical plane z = DIST/2 (negative z scale + mirrored pivot
// transform- three flips the winding automatically), bass pulse and drift
// included. `focus` sits at the midpoint between the two- the scene points
// the camera rig and the multicam feeds at it while the event runs.
// Entrance/exit: the double ARRIVES from deep inside the mirror- far behind
// the plane on the envelope's attack, gliding into place facing the hero-
// and sinks back into the depths on the release. Full size throughout; the
// distance falloff is squared so the approach lands softly.
//
// Collision guard: a mirrored pair closes SYMMETRICALLY- a pose reaching
// past the mirror plane would interpenetrate. The resting distance is right
// for the plain falling loop; only the roll-over clips (backflip,
// backfalling- also held by zeroG/apnea) sweep limbs far enough to touch,
// so those ease the distance out by TRICK_BUMP and it glides back after.
const DIST = 3.2        // resting hero-to-twin distance- the mirror plane sits at half
const TRICK_BUMP = 1.4  // extra room during backflip / backfalling
const APPROACH = 12     // depth behind the mirror the twin arrives from and retreats to

export default class Twin {

	constructor(params) {
		this.params = params
		this.body = null
		this.pivot = null
		this.wrapper = null
		this.active = false
		this.wasActive = false
		this.srcBones = []
		this.dstBones = []
		this.dist = DIST   // live mirror distance- eased toward the collision-free floor
		this.focus = new THREE.Object3D()   // camera midpoint- exists even if init bails
	}

	init(scene, body, pivot) {
		if (!body.object) return
		this.body = body
		this.pivot = pivot
		this.wrapper = new THREE.Group()
		this.wrapper.visible = false
		scene.add(this.wrapper)
		scene.add(this.focus)
		const obj = clone(body.object)   // keeps normalize()'s scale + centering
		obj.traverse((child) => {
			if (child.isMesh || child.isSkinnedMesh) {
				child.frustumCulled = false
				child.layers.enable(BLOOM_LAYER)
			}
		})
		this.wrapper.add(obj)
		// Parallel bone lists- clone() preserves traversal order.
		body.object.traverse((o) => { if (o.isBone) this.srcBones.push(o) })
		obj.traverse((o) => { if (o.isBone) this.dstBones.push(o) })
	}

	update(dt, features) {
		if (!this.wrapper) return
		const presence = features.boost.twin
		this.active = presence > 0.001
		if (this.active && !this.wasActive) {
			this.dist = DIST   // fresh event starts at the resting distance
			// Re-grab the hero's CURRENT material (the GUI can swap it).
			this.wrapper.traverse((child) => {
				if (child.isMesh || child.isSkinnedMesh) child.material = this.body.mat
			})
		}
		this.wasActive = this.active
		this.wrapper.visible = this.active
		if (!this.active) return
		// Extra room while a roll-over clip plays (see TRICK_BUMP), eased both
		// ways so the mirror glides out for the trick and drifts back after.
		const p = this.pivot.position
		const ev = this.body.eventName
		const distTarget = ev === 'backflip' || ev === 'backfalling' ? DIST + TRICK_BUMP : DIST
		this.dist += (distTarget - this.dist) * (1 - Math.exp(-dt / 0.3))
		// The mirror plane FOLLOWS the hero's drift (z = p.z + dist/2)- with a
		// world-fixed plane the pair's separation breathed by twice the drift,
		// which read as the twins closing in and backing off for no reason.
		// Reflected z scale mirrors the pose about the plane. The envelope
		// drives the APPROACH depth: far behind the plane at 0, in place at 1-
		// the double walks out of the mirror's depths and sinks back into them.
		const s = this.pivot.scale.x
		const depth = (1 - presence) * (1 - presence) * APPROACH
		this.wrapper.position.set(p.x, p.y, p.z + this.dist + depth)
		this.wrapper.scale.set(s, s, -s)
		// The pose transfer: bone locals verbatim- the wrapper's reflection
		// does the mirroring.
		for (let i = 0; i < this.srcBones.length; i++) {
			const src = this.srcBones[i]
			const dst = this.dstBones[i]
			dst.position.copy(src.position)
			dst.quaternion.copy(src.quaternion)
			dst.scale.copy(src.scale)
		}
		// True midpoint of the pair, approach included- the camera watches him come.
		this.focus.position.set(p.x, p.y, p.z + (this.dist + depth) / 2)
	}

}
