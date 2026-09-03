import * as THREE from 'three'

import SkyShader from './shaders/SkyShader.js'

// The screen-space FBM sky background. Owns its fullscreen quad + the scroll
// time integration (audio-reactive rise speed).
export default class Sky {

	constructor(scene, params) {
		this.params = params
		// THE single animated pattern input: the vertical fall displacement.
		// No parallel clocks (scroll/churn/stretch/yaw-pan used to each carry
		// their own- their interactions are what kept sneaking lateral and
		// downward motion into the shapes). flow.x and pan are frozen legacy
		// offsets- see update() for the Y-only contract.
		this.flow = new THREE.Vector2()
		this.pan = 0
		this.prevYaw = null
		this.dirScratch = new THREE.Vector3()   // reused by the yaw coupling in update()
		const geometry = new THREE.PlaneGeometry(2, 2)
		const material = new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(SkyShader.uniforms),
			vertexShader: SkyShader.vertexShader,
			fragmentShader: SkyShader.fragmentShader,
			depthTest: false,
			depthWrite: false,
		})
		material.uniforms.resolution.value.set(innerWidth, innerHeight)
		material.uniforms.skyTop.value.set(params.sky.topColor)
		material.uniforms.skyBottom.value.set(params.sky.bottomColor)
		material.uniforms.cloudColor.value.set(params.sky.cloudColor)
		this.mesh = new THREE.Mesh(geometry, material)
		this.mesh.renderOrder = -1   // draws before body- depth disabled so body still occludes
		this.mesh.frustumCulled = false
		scene.add(this.mesh)
	}

	get uniforms() {
		return this.mesh.material.uniforms
	}

	update(dt, audio, features, camera) {
		const p = this.params.sky
		this.mesh.visible = p.enabled
		// Integrate speed·dt (not raw clock time) so kick spikes register as
		// transient accelerators, mirroring the camera-orbit pattern. The fall
		// speed follows the passage energy: intense music = faster fall, and the
		// BASE speed itself sinks toward `floor` when the music goes silent.
		const floor = this.params.audio.floor
		const base = p.scrollSpeedBase * (floor + (1 - floor) * features.energy)
		// Hard ceiling at 0.15 screen/s: whatever the GUI sliders say, the
		// infinitely-far background can never rush- distance IS slowness.
		const scrollStep = dt * Math.min(0.15, features.rate * (base + features.energy * p.scrollEnergyMult + features.flow * p.scrollKickMult * features.energy))
		// THE backdrop contract (final): its own motion is the upward fall
		// stream, nothing else- flow.x is frozen forever. The ONE camera
		// coupling it keeps is the view yaw: looking elsewhere pans the
		// backdrop so the view direction stays coherent. Pitch and roll stay
		// uncoupled- the axes that bred every downward-motion bug (their
		// accumulated offsets are frozen, zeroing would teleport the pattern).
		// Wind (test knob): leans the flow by params.wind.angle- at 0 the pure
		// vertical contract holds exactly (sin 0 = 0, flow.x untouched).
		const windRad = THREE.MathUtils.degToRad(this.params.wind.angle)
		this.flow.x += scrollStep * Math.sin(windRad)
		this.flow.y += scrollStep * Math.cos(windRad)
		// View-yaw pan, calibrated on the horizontal FOV (a sweep of one FOV
		// pans one screen width). The VIEW yaw, not the position azimuth: they
		// match on orbit shots, but on bone-tracked shots the camera sits near
		// the axis and its position azimuth whips erratically. Unwrapped so the
		// ±π seam never jumps; hard cuts do, masked by the cut itself.
		const yaw = Math.atan2(camera.getWorldDirection(this.dirScratch).x, this.dirScratch.z)
		if (this.prevYaw === null) this.prevYaw = yaw
		let dYaw = yaw - this.prevYaw
		if (dYaw > Math.PI) dYaw -= Math.PI * 2
		else if (dYaw < -Math.PI) dYaw += Math.PI * 2
		this.prevYaw = yaw
		const hFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect)
		this.pan -= dYaw * (camera.aspect / hFov)
		const u = this.uniforms
		u.flowOff.value.copy(this.flow)
		u.panX.value = this.pan
		u.panY.value = this.panYCur ?? 0
		u.rollAngle.value = 0
		u.cloudScale.value = p.cloudScale
		// Clamped at white: past 1.0 the cloud tint burns the whole frame out and
		// the sky gradient disappears- the "wall of white" during intense passages.
		// The drop flash rides ABOVE the white clamp on purpose- a brief burst.
		u.brightness.value = Math.min(1, p.brightnessBase + features.energy * p.brightnessEnergyMult) + features.dropPulse * 0.8
		// Intense passages thin the cloud cover (see SkyShader): speed reads
		// through fewer, denser clouds- not through more noise. The MIDS pull
		// cover back in: the melody (voice, synths, guitars) thickens the sky
		// while the rhythm section drives everything else.
		// SLEWED (1.5s): coverage moves the contours, and an instant coverage
		// step makes every cloud edge JUMP- the fast mid term had the outlines
		// flicker-breathing at audio rate, the last measured source of
		// downward edge motion. Slewed, coverage reads as dissolve, not travel.
		const coverTarget = features.energy * 0.17 - features.mid * p.midCoverage
		this.coverCur ??= coverTarget
		this.coverCur += (coverTarget - this.coverCur) * (1 - Math.exp(-dt / 1.5))
		u.coverageShift.value = this.coverCur
	}

	// Lerp the sky uniforms between two color presets at factor f (0=A, 1=B).
	// With A===B and f=0 it just snaps to A.
	lerpColors(A, B, f) {
		const u = this.uniforms
		u.wipe.value = 0
		u.skyTop.value.copy(A.skyTop).lerp(B.skyTop, f)
		u.skyBottom.value.copy(A.skyBottom).lerp(B.skyBottom, f)
		u.cloudColor.value.copy(A.skyCloudColor).lerp(B.skyCloudColor, f)
	}

	// Wipe transition: both palettes live in the shader, the B set grows from
	// screen center as `front` goes 0 → 1.
	setWipe(A, B, front, mode) {
		const u = this.uniforms
		u.wipeMode.value = mode
		u.skyTop.value.copy(A.skyTop)
		u.skyBottom.value.copy(A.skyBottom)
		u.cloudColor.value.copy(A.skyCloudColor)
		u.skyTopB.value.copy(B.skyTop)
		u.skyBottomB.value.copy(B.skyBottom)
		u.cloudColorB.value.copy(B.skyCloudColor)
		u.wipe.value = front
	}

	resize() {
		this.uniforms.resolution.value.set(innerWidth, innerHeight)
	}

}
