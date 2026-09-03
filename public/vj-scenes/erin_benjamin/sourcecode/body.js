import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { BLOOM_LAYER, COLOR_PRESETS, TARGET_HEIGHT } from './config.js'
import RimShader from './shaders/RimShader.js'

// One GLB carries the mesh AND the three clips, retargeted offline in Blender
// onto this skeleton (no runtime retargeting needed- see the repo history for
// the FBX + SkeletonUtils era this replaces).
const BODY_URL = './assets/character.glb'
const FADE = 0.35   // crossfade duration between animations (seconds)
// The backflip clip starts grounded (crouch + push-off) and lasts barely 1s:
// longer fades in AND out + skipping the first instants + slowed playback, so
// mid-air it reads as a floating flip- not a jump off an invisible floor.
// limbMix blends the falling clip's LIMB tracks over the flip (weight ratio
// limbMix/(1+limbMix)): the body still fully rotates, but arms and legs keep
// flailing- an involuntary tumble instead of a deliberate gymnast tuck.
const EVENT_TUNING = {
	// endAt cuts the clip before its grounded landing recovery (a pose far from
	// falling- blending from it read as a jolt); returnFade glides back long.
	backflip: { fade: 0.6, startAt: 0.15, endAt: 0.75, timeScale: 0.23, limbMix: 2.0, returnFade: 1.2 },
	// Back-first fall: already a falling clip, so no limb mix needed- just a
	// slow roll-over blend.
	backfalling: { fade: 0.9 },
	// Flat helicopter spin, one-shot at half speed: one graceful rotation
	// (~3.2s), slight flail bleed so it stays involuntary.
	spin: { fade: 0.7, timeScale: 0.5, limbMix: 0.8, returnFade: 0.9 },
}
const LIMB_RE = /Arm|Hand|Shoulder|Leg|Foot|Toe/i   // everything but Hips/Spine/Neck/Head
const ONE_SHOTS = ['backflip', 'spin']   // play once, return by themselves

// The falling character. `falling` loops as the base state; playEvent()
// crossfades to a rare event clip (backflip one-shot, flying held) and back.
// Owns the skinned model, its animation mixer and its (single, shared) material.
export default class Body {

	constructor(params) {
		this.params = params
		this.object = null
		this.clips = {}
		this.actions = {}
		this.currentAction = null
		this.eventTimer = 0   // seconds left on a held event (flying)
		this.mixer = null
		this.mat = null
		// Fixed world-space light for the rim material's modeling (above, slightly
		// right and front); rotated into view space each frame in update().
		this.lightDirWorld = new THREE.Vector3(0.5, 0.8, 0.3).normalize()
		this.lightScratch = new THREE.Vector3()
		this.headBone = null   // found in init()- anchors for the tracked camera shots
		this.handBone = null
		this.hipsBone = null   // the body's visual center- anchors the echo event's screen projection
		// Derived clips built in init()- shared with Crowd so the clones layer
		// the same hips/limb weights over their one-shots as the hero does.
		this.limbClip = null
		this.hipsClip = null
		this.actionList = []   // frozen in init()- iterated per frame, so no Object.values() there
		// World-space anchor cache filled by updateAnchors()- the getters below
		// only copy from it, never touch the bone chain.
		this.headPosWorld = new THREE.Vector3(0, 0.8, 0)
		this.handPosWorld = new THREE.Vector3(0, 0.8, 0)
		this.headQuatWorld = new THREE.Quaternion()
		this.scaleScratch = new THREE.Vector3()
	}

	// Compose the bone chains ONCE and cache the anchor transforms- the tracked
	// camera reads head position, head orientation and hand position in the same
	// frame, and each getWorldX() call re-composes the whole chain. The caller
	// (the rig, on tracked frames only) must invoke this after the mixer update
	// AND the pivot's drift/scale writes, so the cache matches the frame's pose.
	updateAnchors() {
		if (this.headBone) {
			this.headBone.updateWorldMatrix(true, false)
			this.headBone.matrixWorld.decompose(this.headPosWorld, this.headQuatWorld, this.scaleScratch)
		}
		if (this.handBone) {
			this.handBone.updateWorldMatrix(true, false)
			this.handPosWorld.setFromMatrixPosition(this.handBone.matrixWorld)
		}
	}

	getHandPosition(target) {
		if (this.handBone) return target.copy(this.handPosWorld)
		return this.getHeadPosition(target)   // fallback: track the head instead
	}

	// Head world position/orientation for the face shot (fallback: rough head
	// height at the pivot). Valid only after updateAnchors() ran this frame.
	getHeadPosition(target) {
		if (this.headBone) return target.copy(this.headPosWorld)
		return target.set(0, 0.8, 0)
	}

	getHeadQuaternion(target) {
		if (this.headBone) return target.copy(this.headQuatWorld)
		return target.identity()
	}

	async load() {
		const gltf = await new GLTFLoader().loadAsync(BODY_URL).catch((err) => {
			console.error(`[erin_benjamin] failed to load ${BODY_URL}`, err)
			return null
		})
		this.object = gltf?.scene ?? null
		for (const clip of gltf?.animations ?? []) this.clips[clip.name] = clip
		console.log(`[erin_benjamin] clips loaded: ${Object.keys(this.clips).join(', ') || 'none'}`)
		if (!this.object) console.error('[erin_benjamin] body missing- scene will render empty')
		if (!this.clips.falling) console.warn('[erin_benjamin] no base animation clip found')
	}

	init(pivot) {
		if (!this.object) return
		this.normalize()

		let meshCount = 0
		this.object.traverse((child) => {
			if (child.isMesh || child.isSkinnedMesh) {
				child.frustumCulled = false   // SkinnedMesh bounds in bind pose can clip the model out
				child.layers.enable(BLOOM_LAYER)   // keeps default layer 0 + adds bloom layer
				meshCount++
			}
		})
		this.object.traverse((o) => {
			if (!o.isBone) return
			if (!this.headBone && /head/i.test(o.name)) this.headBone = o
			if (!this.handBone && /hand/i.test(o.name)) this.handBone = o
			if (!this.hipsBone && /hips/i.test(o.name)) this.hipsBone = o
		})
		console.log(`[erin_benjamin] anchor bones: head=${this.headBone?.name ?? 'none'} hand=${this.handBone?.name ?? 'none'}`)
		this.setMaterial(this.params.body.material)
		console.log(`[erin_benjamin] body: ${meshCount} mesh(es)`)
		if (meshCount === 0) console.warn('[erin_benjamin] body has no renderable meshes (skeleton only?)')

		pivot.add(this.object)

		if (this.clips.falling) {
			this.mixer = new THREE.AnimationMixer(this.object)
			for (const [name, clip] of Object.entries(this.clips)) {
				this.actions[name] = this.mixer.clipAction(clip)
			}
			// Derived clips from the falling loop:
			// - fallingLimbs: limb tracks alone, layered over the backflip so the
			//   tumble keeps the helpless flailing (see EVENT_TUNING)
			// - fallingHips: the hips POSITION track alone, layered during every
			//   event- the event clips are rotation-only, so without it the hips
			//   drift toward the rest height as the falling action fades out
			const falling = this.clips.falling
			const limbTracks = falling.tracks.filter((t) => LIMB_RE.test(t.name))
			if (limbTracks.length) {
				this.limbClip = new THREE.AnimationClip('fallingLimbs', falling.duration, limbTracks)
				this.actions.fallingLimbs = this.mixer.clipAction(this.limbClip)
			}
			const hipsTracks = falling.tracks.filter((t) => /Hips/i.test(t.name) && t.name.endsWith('.position'))
			if (hipsTracks.length) {
				this.hipsClip = new THREE.AnimationClip('fallingHips', falling.duration, hipsTracks)
				this.actions.fallingHips = this.mixer.clipAction(this.hipsClip)
			}
			// One-shots (backflip, spin): clamp on the last frame while fading back-
			// the 'finished' listener triggers the return to falling by itself.
			for (const name of ONE_SHOTS) {
				const action = this.actions[name]
				if (!action) continue
				action.setLoop(THREE.LoopOnce)
				action.clampWhenFinished = true
			}
			this.mixer.addEventListener('finished', (e) => {
				const name = ONE_SHOTS.find((n) => this.actions[n] === e.action)
				if (name) this.endEvent(EVENT_TUNING[name]?.returnFade ?? EVENT_TUNING[name]?.fade ?? FADE)
			})
			this.actions.falling.play()
			this.currentAction = this.actions.falling
			this.actionList = Object.values(this.actions)   // no action is created after init
		}
	}

	// Crossfade to a rare event clip: backflip plays once then returns by
	// itself; flying holds `hold` seconds (counted down in update()) before
	// returning. False if the clip is missing or an event is already running.
	playEvent(name, hold = 0) {
		if (!this.actions[name] || this.currentAction !== this.actions.falling) return false
		const tuning = EVENT_TUNING[name]
		const fade = tuning?.fade ?? FADE
		const fallingTime = this.actions.falling.time   // for aux-layer continuity
		this.fadeTo(name, fade, tuning?.startAt ?? 0, tuning?.timeScale ?? 1)
		// Aux layers, in phase with where the falling loop just was so nothing
		// pops at the blend start: the hips position always (event clips are
		// rotation-only- he must stay at falling height), the flailing limbs
		// only where the tuning asks for them.
		this.startAux(this.actions.fallingHips, 1, fade, fallingTime)
		if (tuning?.limbMix) this.startAux(this.actions.fallingLimbs, tuning.limbMix, fade, fallingTime)
		this.eventTimer = hold
		this.eventName = name
		this.eventFade = tuning?.returnFade ?? fade   // used by the timer/endAt returns
		return true
	}

	startAux(action, weight, fade, time) {
		if (!action) return
		action.reset().setEffectiveTimeScale(1).setEffectiveWeight(weight).fadeIn(fade).play()
		action.time = time
	}

	// An event is over: back to the base fall, aux layers out with it.
	endEvent(fade = FADE) {
		this.eventName = null
		this.fadeTo('falling', fade)
		this.actions.fallingHips?.fadeOut(fade)
		this.actions.fallingLimbs?.fadeOut(fade)
	}

	fadeTo(name, duration = FADE, startAt = 0, timeScale = 1) {
		const to = this.actions[name]
		if (!to || this.currentAction === to) return
		to.reset().setEffectiveTimeScale(timeScale).setEffectiveWeight(1).fadeIn(duration).play()
		to.time = startAt
		this.currentAction?.fadeOut(duration)
		this.currentAction = to
	}

	update(dt, audio, features, camera) {
		if (this.mixer) {
			// The fall follows the track's tempo AND its intensity: a breakdown
			// suspends the body in slow motion, the drop releases it full speed.
			const s = this.params.body.slowMo
			this.mixer.timeScale = features.rate * (s + (1 - s) * features.energy)
			this.mixer.update(dt)
			// A crossfaded-out action stays scheduled and keeps sampling its
			// tracks at weight zero- release it once its fade has landed. The
			// mixer-time guard keeps a fade scheduled THIS frame (still at
			// weight zero until time advances) alive.
			if (dt * this.mixer.timeScale > 0) {
				for (const action of this.actionList) {
					if (action !== this.currentAction && action.isScheduled() && action.getEffectiveWeight() === 0) action.stop()
				}
			}
		}
		// Held event (flying) running out → glide back to the base fall.
		if (this.eventTimer > 0) {
			this.eventTimer -= dt
			if (this.eventTimer <= 0) this.endEvent(this.eventFade)
		}
		// endAt: leave a one-shot event BEFORE its final pose (the backflip's
		// grounded landing)- the return blend starts from a mid-air pose instead.
		const tuning = EVENT_TUNING[this.eventName]
		if (tuning?.endAt && this.currentAction === this.actions[this.eventName] && this.currentAction.time >= tuning.endAt) {
			this.endEvent(this.eventFade)
		}
		// Rim material: the contour glow pulses on the strong beats (energy-gated,
		// like the other flash effects), and the fixed world light is rotated into
		// view space so the modeling sweeps across the body as the camera orbits.
		const u = this.mat?.uniforms
		if (u?.rimStrength) {
			const r = this.params.body.rim
			u.rimStrength.value = r.strength + audio.kickHard * r.kickHardMult * features.energy + features.dropPulse * 2
			u.rimPower.value = r.power
			u.shading.value = r.shading
			u.ambientTint.value = r.ambient
			u.lightDir.value.copy(this.lightScratch.copy(this.lightDirWorld).transformDirection(camera.matrixWorldInverse))
		}
	}

	// Lerp the rim + ambient colors between two presets at factor f (0=A, 1=B).
	// The ambient is the preset's skyTop- the palette's signature color, far
	// more saturated than the pale horizon- so the body visibly carries the
	// scene's mood. No-op for the non-rim materials.
	lerpColors(A, B, f) {
		const u = this.mat?.uniforms
		if (!u?.rimColor) return
		u.rimColor.value.copy(A.bodyRim).lerp(B.bodyRim, f)
		// Saturation boost: skyTop values are airy pastels- multiplied over a
		// white body they read as barely-there. Recomputed from the presets
		// every frame, so the offset never accumulates.
		u.ambientColor.value.copy(A.skyTop).lerp(B.skyTop, f).offsetHSL(0, 0.25, 0)
	}

	normalize() {
		// Mixamo-style FBX is typically ~100 units tall- scale to TARGET_HEIGHT, recenter.
		const box = new THREE.Box3().setFromObject(this.object)
		const size = box.getSize(new THREE.Vector3())
		console.log(`[erin_benjamin] body raw size: ${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}`)
		if (size.y > 0) this.object.scale.setScalar(TARGET_HEIGHT / size.y)
		else console.warn('[erin_benjamin] body has zero height- skipping normalization')
		box.setFromObject(this.object)
		const center = box.getCenter(new THREE.Vector3())
		this.object.position.sub(center)
	}


	setMaterial(type) {
		if (!this.object) return
		const next = this.createMaterial(type)
		if (!next) return
		this.object.traverse((child) => {
			if (child.isMesh || child.isSkinnedMesh) child.material = next
		})
		if (this.mat && this.mat !== next) this.mat.dispose()
		this.mat = next
	}

	createMaterial(type) {
		const b = this.params.body
		switch (type) {
			case 'rim': {
				const mat = new THREE.ShaderMaterial({
					uniforms: THREE.UniformsUtils.clone(RimShader.uniforms),
					vertexShader: RimShader.vertexShader,
					fragmentShader: RimShader.fragmentShader,
				})
				mat.uniforms.baseColor.value.set(b.rim.baseColor)
				// Start from the active preset's colors- the autopilot color cycle
				// keeps them in sync afterwards.
				const preset = COLOR_PRESETS[this.params.autopilot.preset]
				if (preset) {
					mat.uniforms.rimColor.value.copy(preset.bodyRim)
					mat.uniforms.ambientColor.value.copy(preset.skyTop).offsetHSL(0, 0.25, 0)   // same boost as lerpColors
				}
				return mat
			}
			case 'normal': return new THREE.MeshNormalMaterial({ wireframe: b.normal.wireframe, flatShading: b.normal.flatShading })
			case 'basic': return new THREE.MeshBasicMaterial({ color: b.basic.color, wireframe: b.basic.wireframe })
			case 'wireframe': return new THREE.MeshBasicMaterial({ color: b.wireframe.color, wireframe: true })
			case 'depth': return new THREE.MeshDepthMaterial({ wireframe: b.depth.wireframe })
			default:
				console.warn(`[erin_benjamin] unknown material type "${type}"- falling back to normal`)
				return new THREE.MeshNormalMaterial()
		}
	}

}
