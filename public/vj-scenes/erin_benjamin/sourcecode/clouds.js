import * as THREE from 'three'

import { CLOUD_LAYERS } from './config.js'
import CloudShader from './shaders/CloudShader.js'

// The 3D parallax cloud field: billboarded FBM sprites distributed over the
// depth layers of CLOUD_LAYERS, rising with the music and recycling in-band.
// INSTANCED: the whole field is one draw call- per-sprite variation lives in
// instanced attributes, palette/churn/opacity in shared uniforms. The only
// per-frame CPU work is the rise integration and the band-edge fade, written
// into two attribute arrays.
export default class Clouds {

	constructor(scene, params) {
		this.params = params
		this.group = new THREE.Group()
		// World-space (not pivot) so the pivot's audio-driven scale doesn't pulse them.
		scene.add(this.group)
		this.material = new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(CloudShader.uniforms),
			vertexShader: CloudShader.vertexShader,
			fragmentShader: CloudShader.fragmentShader,
			transparent: true,
			depthWrite: false,
		})
		this.material.uniforms.cloudColor.value.set(params.clouds.color)
		// Neutral shadow fallback- the autopilot color cycle (lerpColors)
		// replaces it with the palette-derived tint on the first frame.
		this.material.uniforms.shadowColor.value.set(params.clouds.color).multiplyScalar(0.75)
		this.material.uniforms.hazeColor.value.set(params.sky.bottomColor)
		this.baseGeometry = new THREE.PlaneGeometry(1, 1)
		this.mixScratch = new THREE.Color()      // reused per-frame by lerpColors to avoid GC
		this.shadowScratch = new THREE.Color()   // same, for the sprites' underside tint
		this.churn = 0   // internal-billow clock- advances with the energy (see update)
		// Density-weather state: random phases per session, so WHEN the sky is
		// crowded or sparse differs on every run.
		this.weatherTime = 0
		this.weatherPhase1 = Math.random() * Math.PI * 2
		this.weatherPhase2 = Math.random() * Math.PI * 2
		this.build()
	}

	build() {
		const total = this.params.clouds.count
		// Distribute total across layers per countShare; round each, push leftover into
		// last layer so the exact total is respected.
		const perLayer = CLOUD_LAYERS.map((L) => Math.floor(total * L.countShare))
		const assigned = perLayer.reduce((s, n) => s + n, 0)
		perLayer[perLayer.length - 1] += total - assigned

		this.offsets = new Float32Array(total * 3)
		this.scales = new Float32Array(total * 2)
		this.sprite = new Float32Array(total * 3)   // seed · noiseRot · shadowMult
		this.fades = new Float32Array(total)
		this.layerOf = new Uint8Array(total)

		let i = 0
		for (let li = 0; li < CLOUD_LAYERS.length; li++) {
			for (let k = 0; k < perLayer[li]; k++, i++) {
				this.layerOf[i] = li
				this.spawn(i, true)
				this.sprite[i * 3] = Math.random()                     // seed
				this.sprite[i * 3 + 1] = Math.random() * Math.PI * 2   // noise-domain rotation
				this.sprite[i * 3 + 2] = 0.8 + Math.random() * 0.4     // shadow depth variation
			}
		}

		const geometry = new THREE.InstancedBufferGeometry()
		geometry.index = this.baseGeometry.index
		geometry.attributes.position = this.baseGeometry.attributes.position
		geometry.attributes.uv = this.baseGeometry.attributes.uv
		geometry.instanceCount = total
		geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(this.offsets, 3))
		geometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(this.scales, 2))
		geometry.setAttribute('aSprite', new THREE.InstancedBufferAttribute(this.sprite, 3))
		geometry.setAttribute('aFade', new THREE.InstancedBufferAttribute(this.fades, 1))
		this.mesh = new THREE.Mesh(geometry, this.material)
		this.mesh.frustumCulled = false   // the field surrounds the camera- always on screen
		this.group.add(this.mesh)
	}

	// (Re)position sprite i inside its layer band; randomY spreads the initial
	// population over the whole band instead of stacking everyone at the bottom.
	spawn(i, randomY = false) {
		const layer = CLOUD_LAYERS[this.layerOf[i]]
		const angle = Math.random() * Math.PI * 2
		const radius = layer.radiusMin + Math.random() * (layer.radiusMax - layer.radiusMin)
		this.offsets[i * 3] = Math.cos(angle) * radius
		this.offsets[i * 3 + 1] = randomY ? (Math.random() * 2 - 1) * layer.yRange : -layer.yRange
		this.offsets[i * 3 + 2] = Math.sin(angle) * radius
		// Power-law size draw (u^1.7): the wide scaleMin..scaleMax band mostly
		// yields small/medium puffs, with RARE giants punctuating each layer-
		// a real sky's distribution, without the overdraw a uniform draw over
		// the widened band would cost.
		const scale = layer.scaleMin + Math.pow(Math.random(), 1.7) * (layer.scaleMax - layer.scaleMin)
		// Aspect 0.9-1.5: most cumulus run wider than tall, some grow TALLER
		// (congestus)- and the spread breaks the clone look across the field.
		this.scales[i * 2] = scale * (0.9 + Math.random() * 0.6)
		this.scales[i * 2 + 1] = scale
	}

	rebuild() {
		this.group.remove(this.mesh)
		this.mesh.geometry.dispose()   // shared base geometry/material stay alive
		this.build()
	}

	setColor(value) {
		this.material.uniforms.cloudColor.value.set(value)
		this.material.uniforms.shadowColor.value.set(value).multiplyScalar(0.75)
	}

	// Lerp the sprite tint between two color presets at factor f (0=A, 1=B).
	// The underside tint pulls the cloud color toward the preset's skyTop (same
	// rule as the sky shader), so sprites and background share one light.
	lerpColors(A, B, f) {
		const u = this.material.uniforms
		u.wipe.value = 0
		const mixed = this.mixScratch.copy(A.cloudsColor).lerp(B.cloudsColor, f)
		u.cloudColor.value.copy(mixed)
		u.shadowColor.value.copy(A.skyTop).lerp(B.skyTop, f).lerp(mixed, 0.55).multiplyScalar(0.8)
		// Distant sprites melt toward the horizon color (aerial perspective).
		u.hazeColor.value.copy(A.skyBottom).lerp(B.skyBottom, f)
	}

	// Wipe transition: both palettes live in the shader, the B set grows from
	// screen center as `front` goes 0 → 1 (same metric as the sky).
	setWipe(A, B, front, mode) {
		const u = this.material.uniforms
		u.wipeMode.value = mode
		u.cloudColor.value.copy(A.cloudsColor)
		u.shadowColor.value.copy(A.skyTop).lerp(A.cloudsColor, 0.55).multiplyScalar(0.8)
		u.hazeColor.value.copy(A.skyBottom)
		u.cloudColorB.value.copy(B.cloudsColor)
		u.shadowColorB.value.copy(B.skyTop).lerp(B.cloudsColor, 0.55).multiplyScalar(0.8)
		u.hazeColorB.value.copy(B.skyBottom)
		u.wipe.value = front
	}

	update(dt, audio, features, camera) {
		const p = this.params.clouds
		this.group.visible = p.enabled
		if (!p.enabled) return
		// The field is vertically LOCKED to the camera (bob, bone-tracked shots,
		// director height changes- all of it): otherwise camera vertical motion
		// overtakes the slow far layers and they visibly fall on screen, reading
		// as broken. Locked, the only apparent vertical motion left is the
		// clouds' own world rise- and the band stays centered on the camera at
		// any shot height. Horizontal parallax (orbit, dolly) is untouched.
		this.group.position.y = camera.position.y
		// World-space rise scaled by per-layer speedMult: near layers run faster
		// than far ones, multiplying the natural perspective parallax into a true
		// layered effect. Each cloud recycles within its own band so layers stay
		// visually coherent over time. Rise speed follows the passage energy, and
		// the BASE speed itself sinks toward `floor` when the music goes silent.
		const floor = this.params.audio.floor
		const base = p.riseSpeedBase * (floor + (1 - floor) * features.energy)
		const baseRise = base + features.energy * p.riseEnergyMult + features.flow * p.riseKickMult * features.energy
		const baseDy = dt * features.rate * baseRise
		// Sprites ease back as the energy rises: at full intensity they streak as
		// translucent accents instead of stacking a second wall over the FBM sky.
		// The drop's blast wave thins the field for an instant (it re-forms as
		// the pulse fades)- with the lens shockwave it reads as blown apart.
		this.material.uniforms.opacity.value = p.opacity * (1 - 0.25 * features.energy) * (1 - 0.5 * features.dropPulse)
		this.material.uniforms.hazeAmount.value = p.haze
		this.material.uniforms.aspect.value = camera.aspect   // wipe's screen metric
		// Placid billows when calm, boiling on the drops.
		this.churn += dt * (0.06 + features.energy * 0.3)
		this.material.uniforms.time.value = this.churn
		// Density weather: the field breathes between sparse and crowded over
		// two slow incommensurate periods (73s/47s, random phases per session)-
		// moments with a handful of clouds, moments with a packed sky. Applied
		// through the fade attribute, each sprite's own seed as its rank, so
		// hidden sprites also EARLY-DISCARD in the shader: sparse moments are
		// cheaper, not just emptier.
		this.weatherTime += dt
		const wave = 0.6 * Math.sin(this.weatherTime * Math.PI * 2 / 73 + this.weatherPhase1)
			+ 0.4 * Math.sin(this.weatherTime * Math.PI * 2 / 47 + this.weatherPhase2)
		const density = 1 - (p.weather ?? 1) * 0.45 * (1 - wave)

		// Wind (test knob): WORLD-fixed azimuth (+X)- a camera-relative lateral
		// swirled with the orbit and integrated to nothing on world objects.
		// And the lateral speed is UNIFORM across layers: wind pushes every
		// cloud at the same world speed whatever its distance- speedMult is a
		// parallax factor for the RISE only. 0 = pure vertical rise.
		const windRad = (this.params.wind.angle * Math.PI) / 180
		const windY = Math.cos(windRad)
		const latStep = baseDy * Math.sin(windRad)

		const count = this.layerOf.length
		let recycled = false
		for (let i = 0; i < count; i++) {
			const layer = CLOUD_LAYERS[this.layerOf[i]]
			this.offsets[i * 3] += latStep
			let y = this.offsets[i * 3 + 1] + baseDy * layer.speedMult * windY
			if (y > layer.yRange) {
				this.spawn(i)
				y = -layer.yRange
				recycled = true
			}
			this.offsets[i * 3 + 1] = y
			// Vertical edge envelope: sprites are born transparent at the bottom of
			// their band and dissolve before the recycle teleport at the top- no
			// visible spawn/despawn pop whatever the camera angle. Respawn happens
			// exactly at ±yRange, where this envelope is zero.
			// The fade distance follows the layer's CURRENT rise speed (at least
			// half a second of travel inside the fade, capped at half the band):
			// a fixed slice reads as a hard pop when kicks push the rise fast.
			const fadeDist = Math.min(layer.yRange * 0.5, Math.max(layer.yRange * 0.15, baseRise * layer.speedMult * 0.5))
			const edgeFade = 1 - THREE.MathUtils.smoothstep(Math.abs(y), layer.yRange - fadeDist, layer.yRange)
			// Weather visibility: the sprite exists while the density stands
			// above its rank (its seed), melting in/out over a 0.12 density
			// band- the wave moves slowly, so each cloud takes seconds to form
			// or dissolve. Never pops.
			this.fades[i] = edgeFade * THREE.MathUtils.smoothstep(density, this.sprite[i * 3] - 0.12, this.sprite[i * 3])
		}
		const attrs = this.mesh.geometry.attributes
		attrs.aOffset.needsUpdate = true
		attrs.aFade.needsUpdate = true
		if (recycled) attrs.aScale.needsUpdate = true   // scales only change on recycle
	}

}
