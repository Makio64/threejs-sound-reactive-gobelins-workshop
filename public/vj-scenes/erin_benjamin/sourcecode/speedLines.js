import * as THREE from 'three'

// Thin vertical streaks rushing up past the camera- the classic freefall
// speed cue. The field recycles in a cylinder around the CAMERA (whatever
// shot is running), and the whole layer's opacity follows energy squared:
// invisible in calm passages, a rain of streaks in the drops. Each streak
// fades softly at both ends and across its width (a light filament, not a
// hard-edged bar) and STRETCHES with the current speed- motion-blur feel.
// INSTANCED: one draw call for the whole field, and the mesh is hidden
// entirely while the layer is invisible- zero GPU work in calm passages.
const StreakShader = {
	uniforms: {
		globalOpacity: { value: 0 },
		stretch: { value: 1 },   // speed-driven length multiplier
		windDir: { value: new THREE.Vector3(0, 1, 0) },   // filament axis = velocity direction (wind test knob)
	},
	vertexShader: /* glsl */`
		attribute vec3 aOffset;
		attribute vec2 aDim;   // x: width · y: base length
		uniform float stretch;
		uniform vec3 windDir;
		varying vec2 vUv;
		void main() {
			vUv = uv;
			// Filament along the WIND axis (vertical when the wind is off)- a
			// streak IS a velocity vector, so its orientation must follow the
			// motion. Yaw-billboarded toward the camera.
			vec3 fwd = cameraPosition - aOffset;
			vec3 planar = vec3( fwd.z, 0.0, -fwd.x );
			// Degenerate when the camera sits exactly above the streak- any
			// horizontal right works there (the filament is a vertical line).
			vec3 right = length( planar ) < 1e-4 ? vec3( 1.0, 0.0, 0.0 ) : normalize( planar );
			vec3 world = aOffset + right * position.x * aDim.x + windDir * position.y * aDim.y * stretch;
			gl_Position = projectionMatrix * viewMatrix * vec4( world, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform float globalOpacity;
		varying vec2 vUv;
		void main() {
			// Soft falloff along the streak (both ends) and across its width.
			float along = sin( vUv.y * 3.14159 );
			float across = 1.0 - abs( vUv.x - 0.5 ) * 2.0;
			float alpha = along * along * across * globalOpacity;
			if ( alpha < 0.01 ) discard;
			gl_FragColor = vec4( vec3( 1.0 ), alpha );
		}
	`,
}

export default class SpeedLines {

	constructor(scene, params) {
		this.params = params
		this.scene = scene
		this.material = new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(StreakShader.uniforms),
			vertexShader: StreakShader.vertexShader,
			fragmentShader: StreakShader.fragmentShader,
			transparent: true,
			depthWrite: false,
		})
		this.baseGeometry = new THREE.PlaneGeometry(1, 1)
		this.build()
	}

	build() {
		const count = this.params.lines.count
		this.offsets = new Float32Array(count * 3)
		this.dims = new Float32Array(count * 2)
		this.mults = new Float32Array(count)
		for (let i = 0; i < count; i++) {
			this.spawn(i, 0, 0)
			this.offsets[i * 3 + 1] = (Math.random() * 2 - 1) * 10
		}
		const geometry = new THREE.InstancedBufferGeometry()
		geometry.index = this.baseGeometry.index
		geometry.attributes.position = this.baseGeometry.attributes.position
		geometry.attributes.uv = this.baseGeometry.attributes.uv
		geometry.instanceCount = count
		geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(this.offsets, 3))
		geometry.setAttribute('aDim', new THREE.InstancedBufferAttribute(this.dims, 2))
		this.mesh = new THREE.Mesh(geometry, this.material)
		this.mesh.frustumCulled = false
		this.scene.add(this.mesh)
	}

	rebuild() {
		this.scene.remove(this.mesh)
		this.mesh.geometry.dispose()   // shared base geometry/material stay alive
		this.build()
	}

	spawn(i, cx, cz) {
		const p = this.params.lines
		const angle = Math.random() * Math.PI * 2
		const r = 0.8 + Math.random() * p.radius
		this.offsets[i * 3] = cx + Math.cos(angle) * r
		this.offsets[i * 3 + 2] = cz + Math.sin(angle) * r
		this.dims[i * 2] = 0.006 + Math.random() * 0.014
		this.dims[i * 2 + 1] = 1.2 + Math.random() * 2.2
		this.mults[i] = 0.7 + Math.random() * 0.6   // per-streak speed variation
	}

	update(dt, audio, features, camera) {
		const p = this.params.lines
		const e = features.energy
		// Quadratic gate: the layer only exists when the music pushes- and the
		// mesh is fully hidden below the threshold, skipping all GPU work.
		// A drop bursts the streaks on regardless of the gate.
		const opacity = p.enabled ? p.opacity * e * e + p.opacity * features.dropPulse : 0
		this.mesh.visible = opacity >= 0.01
		if (!this.mesh.visible) return
		this.material.uniforms.globalOpacity.value = opacity
		const speed = (p.speedBase + p.speedEnergyMult * e + features.flow * 8 * e) * features.rate * (1 + features.dropPulse * 1.5)
		// Faster = longer streaks (motion-blur feel).
		this.material.uniforms.stretch.value = 0.5 + speed * 0.09
		const cx = camera.position.x
		const cy = camera.position.y
		const cz = camera.position.z
		// Wind (test knob): motion AND filament orientation lean together, on
		// the same WORLD-fixed azimuth (+X) as the cloud field- streaks are
		// velocity vectors, they must agree with the clouds' trajectories.
		const windRad = (this.params.wind.angle * Math.PI) / 180
		const windX = Math.sin(windRad)
		const windY = Math.cos(windRad)
		this.material.uniforms.windDir.value.set(windX, windY, 0)
		const count = this.mults.length
		let recycled = false
		for (let i = 0; i < count; i++) {
			const step = dt * speed * this.mults[i]
			this.offsets[i * 3] += step * windX
			let y = this.offsets[i * 3 + 1] + step * windY
			if (y > cy + 10) {
				this.spawn(i, cx, cz)
				y = cy - 10 - Math.random() * 4
				recycled = true
			}
			this.offsets[i * 3 + 1] = y
		}
		const attrs = this.mesh.geometry.attributes
		attrs.aOffset.needsUpdate = true
		if (recycled) attrs.aDim.needsUpdate = true   // dims only change on recycle
	}

}
