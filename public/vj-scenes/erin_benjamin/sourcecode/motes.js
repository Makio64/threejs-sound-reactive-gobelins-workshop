import * as THREE from 'three'

// Luminous dust motes: tiny additive specks drifting slowly around the camera,
// twinkling- pollen in the light. They wander in the SHADER (sine offsets per
// seed), so the only CPU work is a slow rise + recycling around the camera.
// Slightly MORE present in calm passages: the dreamy counterpart of the speed
// lines, which own the intense ones.
const MoteShader = {
	uniforms: {
		time: { value: 0 },
		globalOpacity: { value: 0 },
	},
	vertexShader: /* glsl */`
		attribute vec3 aOffset;
		attribute float aSeed;
		attribute float aSize;
		uniform float time;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			vUv = uv;
			vSeed = aSeed;
			// Slow per-mote wander- no CPU involved. Mostly HORIZONTAL: the motes
			// must ride the upward flow like everything else (we are falling)-
			// vertical bobbing read as them hanging still against the stream.
			vec3 wander = vec3(
				sin( time * 0.31 + aSeed * 17.0 ) * 0.35,
				sin( time * 0.23 + aSeed * 31.0 ) * 0.08,
				cos( time * 0.27 + aSeed * 23.0 ) * 0.35
			);
			// Screen-aligned billboard (a round dot has no orientation).
			vec4 mv = viewMatrix * vec4( aOffset + wander, 1.0 );
			mv.xy += position.xy * aSize;
			gl_Position = projectionMatrix * mv;
		}
	`,
	fragmentShader: /* glsl */`
		uniform float time;
		uniform float globalOpacity;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			float r = length( vUv - 0.5 ) * 2.0;
			float dot_ = 1.0 - smoothstep( 0.0, 1.0, r );
			float twinkle = 0.4 + 0.6 * ( sin( time * ( 1.0 + fract( vSeed * 7.0 ) * 2.0 ) + vSeed * 40.0 ) * 0.5 + 0.5 );
			float alpha = dot_ * dot_ * twinkle * globalOpacity;
			if ( alpha < 0.01 ) discard;
			gl_FragColor = vec4( vec3( 1.0 ), alpha );
		}
	`,
}

export default class Motes {

	constructor(scene, params) {
		this.params = params
		this.scene = scene
		this.material = new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(MoteShader.uniforms),
			vertexShader: MoteShader.vertexShader,
			fragmentShader: MoteShader.fragmentShader,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		})
		this.baseGeometry = new THREE.PlaneGeometry(1, 1)
		this.build()
	}

	build() {
		const count = this.params.motes.count
		this.offsets = new Float32Array(count * 3)
		this.seeds = new Float32Array(count)
		this.sizes = new Float32Array(count)
		for (let i = 0; i < count; i++) this.spawn(i, 0, 0, true)
		const geometry = new THREE.InstancedBufferGeometry()
		geometry.index = this.baseGeometry.index
		geometry.attributes.position = this.baseGeometry.attributes.position
		geometry.attributes.uv = this.baseGeometry.attributes.uv
		geometry.instanceCount = count
		geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(this.offsets, 3))
		geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(this.seeds, 1))
		geometry.setAttribute('aSize', new THREE.InstancedBufferAttribute(this.sizes, 1))
		this.mesh = new THREE.Mesh(geometry, this.material)
		this.mesh.frustumCulled = false
		this.scene.add(this.mesh)
	}

	rebuild() {
		this.scene.remove(this.mesh)
		this.mesh.geometry.dispose()   // shared base geometry/material stay alive
		this.build()
	}

	spawn(i, cx, cz, anywhere = false) {
		const p = this.params.motes
		const angle = Math.random() * Math.PI * 2
		const r = 0.5 + Math.random() * p.radius
		this.offsets[i * 3] = cx + Math.cos(angle) * r
		this.offsets[i * 3 + 1] = anywhere ? (Math.random() * 2 - 1) * 6 : -6
		this.offsets[i * 3 + 2] = cz + Math.sin(angle) * r
		this.seeds[i] = Math.random()
		this.sizes[i] = 0.012 + Math.random() * 0.03
	}

	update(dt, features, camera) {
		const p = this.params.motes
		// More present when the music breathes- the calm counterpart of the lines.
		// The motes boost channel (Cosmos zero-G, Twilight first star) turns the
		// dust into a starfield: more presence, faster twinkle.
		const opacity = p.enabled
			? Math.min(1, p.opacity * (0.5 + 0.5 * (1 - features.energy)) * (1 + features.boost.motes))
			: 0
		this.mesh.visible = opacity >= 0.01
		if (!this.mesh.visible) return
		this.material.uniforms.globalOpacity.value = opacity
		this.material.uniforms.time.value += dt * (1 + features.boost.motes)
		const cx = camera.position.x
		const cy = camera.position.y
		const cz = camera.position.z
		// The motes ride the fall's upward stream- slower than the clouds (they
		// are weightless specks) but clearly directional, scaled by tempo and
		// energy like everything else that moves.
		const rise = p.rise * features.rate * (0.4 + 1.6 * features.energy)
		// Same wind as the clouds/streaks (world +X axis)- weightless dust is
		// the FIRST thing a gust should visibly carry, amplified 1.6x so the
		// pre-drop lean and the slam sweep the specks hardest of all.
		const windRad = (this.params.wind.angle * Math.PI) / 180
		const windY = Math.cos(windRad)
		const windLat = Math.sin(windRad) * 1.6
		const count = this.seeds.length
		let recycled = false
		for (let i = 0; i < count; i++) {
			const step = dt * rise * (0.6 + this.seeds[i])
			this.offsets[i * 3] += step * windLat
			let y = this.offsets[i * 3 + 1] + step * windY
			if (y > cy + 6) {
				this.spawn(i, cx, cz)
				y = cy - 6
				recycled = true
			}
			this.offsets[i * 3 + 1] = y
		}
		const attrs = this.mesh.geometry.attributes
		attrs.aOffset.needsUpdate = true
		if (recycled) {   // seeds/sizes only change on recycle
			attrs.aSeed.needsUpdate = true
			attrs.aSize.needsUpdate = true
		}
	}

}
