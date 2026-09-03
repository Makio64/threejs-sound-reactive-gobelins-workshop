import * as THREE from 'three'

// The orbiting camera: base rotation + kick-driven angular impulses, sine bob
// + volume push on the vertical. Owns the PerspectiveCamera and its orbit state.
export default class CameraRig {

	constructor(params) {
		this.params = params
		this.orbit = { angle: 0, radius: 4.5, baseHeight: 0.95, verticalPhase: 0 }
		// Framing state written by the Director on each cut.
		this.lookY = 0
		this.shotSpeedMult = 1
		this.shotBobMult = 1
		this.orbitDir = 1   // +1 / -1, re-rolled by the Director on each cut
		// Head-tracked "face" shot: set by the Director ({dist, fresh}), null = orbit.
		// this.body is wired by the scene after construction.
		this.body = null
		this.trackShot = null
		// Orbit shots LOOK AT the body, not the world origin: the drift and the
		// wind lean push him around, and a fixed-origin lookAt lets him slide to
		// the frame edge. Smoothed follow (lookSmooth)- tracking him rigidly
		// would counter-steer every sway and kill the handheld feel.
		this.lookTarget = null   // the body pivot- wired by the scene after init
		this.lookSmooth = new THREE.Vector3()
		this.faceAxis = new THREE.Vector3(0, -1, 0)   // head-bone local axis pointing out of the face (verified visually on this rig)
		this.headPos = new THREE.Vector3()
		this.handPos = new THREE.Vector3()
		this.headQuat = new THREE.Quaternion()
		this.faceDir = new THREE.Vector3()
		this.desiredPos = new THREE.Vector3()
		this.lookScratch = new THREE.Vector3()
		this.upNudge = new THREE.Vector3()
		this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000)
		// Initial pose- update() recomputes from orbit each frame
		const { angle, radius, baseHeight } = this.orbit
		this.camera.position.set(Math.sin(angle) * radius, baseHeight, Math.cos(angle) * radius)
		this.camera.lookAt(0, 0, 0)
	}

	// Freefall "feel" applied to every shot after framing: a slow horizon roll
	// (no up in freefall- gentle disorientation) and a high-frequency wind
	// turbulence gated by energy SQUARED, so calm passages stay rock steady.
	applyFeel(dt, features) {
		const p = this.params.camera
		this.feelTime = (this.feelTime ?? 0) + dt
		const t = this.feelTime
		// Drop zoom punch: the lens snaps tighter on the hit, springs back with
		// the pulse. 50 is the rig's base fov.
		const fov = 50 - features.dropPulse * features.dropPulse * this.params.drop.punch * 14
		if (fov !== this.camera.fov) {
			this.camera.fov = fov
			this.camera.updateProjectionMatrix()
		}
		const roll = Math.sin(t * p.rollSpeed * Math.PI * 2) * p.rollAmp * (0.4 + 0.6 * features.energy)
		this.camera.rotateZ(roll)
		this.camera.userData.roll = roll   // read by Sky- the background rolls with the horizon
		// Amplitude follows the tempo too (pace 0..1): a slow track buffets
		// gently even when loud, a fast one shakes fully. And it scales with the
		// distance to the subject: a fixed world-space jitter that reads as a
		// breeze on a wide shot is a violent judder at face/hand distance.
		const dist = this.camera.position.distanceTo(this.lookScratch)
		const distScale = Math.min(1, dist / 4.5)
		// The drop lands a single hard kick on top of the wind turbulence.
		const amp = (p.shake * features.energy * features.energy * (0.3 + 0.7 * features.pace)
			+ features.dropPulse * features.dropPulse * this.params.drop.kick * 0.05) * distScale
		if (amp > 0.0001) {
			const ts = t * features.rate   // jitter frequency rides the world rate as well
			this.camera.position.x += (Math.sin(ts * 39.7) + Math.sin(ts * 23.3) * 0.6) * amp * 0.5
			this.camera.position.y += (Math.sin(ts * 31.9 + 1.7) + Math.sin(ts * 17.3) * 0.6) * amp * 0.5
			this.camera.position.z += Math.sin(ts * 27.1 + 3.1) * amp * 0.4
		}
	}

	update(dt, audio, features) {
		const p = this.params.camera
		// Bone-tracked shots: anchored to the skeleton, following it with a
		// slight lag (handheld feel- snap on the cut itself).
		if (this.trackShot && this.body) {
			const t = this.trackShot
			this.body.updateAnchors()   // one bone-chain composition serves every getter below
			this.body.getHeadPosition(this.headPos)
			this.body.getHeadQuaternion(this.headQuat)
			this.faceDir.copy(this.faceAxis).applyQuaternion(this.headQuat).normalize()
			if (t.kind === 'below') {
				// Under the falling body, silhouetted against the sky above.
				this.desiredPos.set(t.side, -t.dist, t.side2)
				this.lookScratch.copy(this.headPos)
			} else if (t.kind === 'hand') {
				// Close on a hand, the body falling behind it.
				this.body.getHandPosition(this.handPos)
				this.faceDir.copy(this.handPos).sub(this.headPos).normalize()
				this.desiredPos.copy(this.handPos).addScaledVector(this.faceDir, t.dist).add(this.upNudge.set(0, t.dist * 0.3, 0))
				this.lookScratch.copy(this.handPos)
			} else {
				// face: in front of the head, looking straight at it.
				this.desiredPos.copy(this.headPos).addScaledVector(this.faceDir, t.dist)
				this.lookScratch.copy(this.headPos)
			}
			if (t.fresh) { this.camera.position.copy(this.desiredPos); t.fresh = false }
			else this.camera.position.lerp(this.desiredPos, 1 - Math.exp(-dt / 0.15))
			this.camera.lookAt(this.lookScratch)
			this.applyFeel(dt, features)
			return
		}
		// Integrating into angular *velocity* (not angle directly) keeps motion
		// smooth, and the beat impulse comes from features.flow (the smoothed
		// kick)- the raw kick is a velocity STEP, which reads as a stutter.
		// Impulses are gated by the passage energy: no whip-pans during quiet
		// sections. Vertical motion: slow sine bob + energy push. lookAt(0,0,0)
		// is fixed so the body stays framed.
		this.orbit.angle += dt * features.rate * this.orbitDir * (p.baseSpeed * this.shotSpeedMult + features.flow * p.kickMult * features.energy)
		this.orbit.verticalPhase += dt * p.verticalSpeed
		const { angle, radius, baseHeight, verticalPhase } = this.orbit
		const bob = (Math.sin(verticalPhase) * p.verticalAmp + features.energy * p.verticalEnergyMult) * this.shotBobMult
		this.camera.position.set(Math.sin(angle) * radius, baseHeight + bob, Math.cos(angle) * radius)
		// The target rides 60% of the bob (same cure as the director's height
		// LFO): pure-pinned lookAt turned every vertical oscillation into a
		// pitch sweep of the whole world. applyFeel scales the shake by the
		// distance to this target. The x/z follow the drifting body (eased over
		// ~0.4s) so the framing wanders WITH him instead of losing him.
		// The lift is CLAMPED to ±0.5 around him: at full bob + energy push the
		// unclamped ride climbed ~1.3- above his head- and the frame filled
		// with sky while he sank off the bottom.
		if (this.lookTarget) this.lookSmooth.lerp(this.lookTarget.position, 1 - Math.exp(-dt / 0.4))
		const lift = Math.min(0.5, Math.max(-0.5, this.lookY + bob * 0.6))
		this.lookScratch.set(this.lookSmooth.x, lift + this.lookSmooth.y, this.lookSmooth.z)
		this.camera.lookAt(this.lookScratch)
		this.applyFeel(dt, features)
	}

	resize() {
		this.camera.aspect = innerWidth / innerHeight
		this.camera.updateProjectionMatrix()
	}

}
