import * as THREE from 'three'

// Fake volumetric light shafts: a handful of huge, faint additive gradient
// billboards hanging from above, slowly orbiting and breathing. Everything
// animates in the shader (orbit, sway, breath)- zero per-frame CPU beyond two
// uniforms. White additive light reads as sun through Daylight and as
// moonlight through the dark presets.
const RayShader = {
	uniforms: {
		time: { value: 0 },
		globalOpacity: { value: 0 },
	},
	vertexShader: /* glsl */`
		attribute vec3 aRay;    // x: base angle · y: ring radius · z: seed
		attribute vec2 aSize;   // x: width · y: height
		uniform float time;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			vUv = uv;
			vSeed = aRay.z;
			// Slow orbit around the scene- each ray at its own pace.
			float angle = aRay.x + time * 0.012 * ( 0.5 + aRay.z );
			vec3 anchor = vec3( cos( angle ) * aRay.y, 14.0, sin( angle ) * aRay.y );
			// Cylindrical billboard (world-vertical shaft).
			vec3 fwd = cameraPosition - anchor;
			vec3 planar = vec3( fwd.z, 0.0, -fwd.x );
			vec3 right = length( planar ) < 1e-4 ? vec3( 1.0, 0.0, 0.0 ) : normalize( planar );
			vec3 world = anchor + right * position.x * aSize.x + vec3( 0.0, 1.0, 0.0 ) * position.y * aSize.y;
			gl_Position = projectionMatrix * viewMatrix * vec4( world, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform float time;
		uniform float globalOpacity;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			// Light falls from above: bright toward the top, dissolving downward,
			// soft on the top edge and across the width. The quad covers only
			// the [0.19, 0.81] slice of the full 0-to-1 fade span- the trimmed
			// extremes sit under the discard threshold and would only burn
			// additive blend bandwidth, so uv is remapped into the slice
			// instead (the shaft heights in build() are sized to this slice).
			// The slice does not reach zero at the quad edges, so each edge
			// carries its own guard fade to keep the border from printing a
			// hard line.
			float envY = pow( 0.19 + 0.62 * vUv.y, 1.6 ) * smoothstep( 1.0, 0.82, vUv.y ) * smoothstep( 0.0, 0.05, vUv.y );
			float across = 1.0 - abs( vUv.x - 0.5 ) * 2.0;
			float breath = 0.55 + 0.45 * sin( time * 0.2 + vSeed * 20.0 );
			float alpha = envY * across * across * breath * globalOpacity;
			if ( alpha < 0.005 ) discard;
			gl_FragColor = vec4( vec3( 1.0 ), alpha );
		}
	`,
}

// Extra shafts allocated up front for the Dawn sunburst (boost.raysCount)-
// the spec's peak must stay at or under this.
const BURST_RESERVE = 10

export default class Rays {

	constructor(scene, params) {
		this.params = params
		this.scene = scene
		this.material = new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(RayShader.uniforms),
			vertexShader: RayShader.vertexShader,
			fragmentShader: RayShader.fragmentShader,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		})
		this.baseGeometry = new THREE.PlaneGeometry(1, 1)
		this.build()
	}

	build() {
		// The reserve shafts live past instanceCount: invisible for free until
		// the sunburst raises the draw count (see update)- no rebuild mid-event.
		// Both populations are spread over the FULL ring independently, so the
		// base field stays uniform and the burst pierces everywhere at once.
		const count = this.params.rays.count
		const total = count + BURST_RESERVE
		const ray = new Float32Array(total * 3)
		const size = new Float32Array(total * 2)
		for (let i = 0; i < total; i++) {
			const ringT = i < count ? i / count : (i - count) / BURST_RESERVE
			ray[i * 3] = ringT * Math.PI * 2 + Math.random() * 0.8   // spread around the ring
			ray[i * 3 + 1] = 8 + Math.random() * 28
			ray[i * 3 + 2] = Math.random()
			size[i * 2] = 1.5 + Math.random() * 4.5
			size[i * 2 + 1] = 35 + Math.random() * 25   // paired with the fragment envelope's uv slice- resize both together
		}
		const geometry = new THREE.InstancedBufferGeometry()
		geometry.index = this.baseGeometry.index
		geometry.attributes.position = this.baseGeometry.attributes.position
		geometry.attributes.uv = this.baseGeometry.attributes.uv
		geometry.instanceCount = count
		geometry.setAttribute('aRay', new THREE.InstancedBufferAttribute(ray, 3))
		geometry.setAttribute('aSize', new THREE.InstancedBufferAttribute(size, 2))
		this.mesh = new THREE.Mesh(geometry, this.material)
		this.mesh.frustumCulled = false
		this.scene.add(this.mesh)
	}

	rebuild() {
		this.scene.remove(this.mesh)
		this.mesh.geometry.dispose()   // shared base geometry/material stay alive
		this.build()
	}

	update(dt, features) {
		const p = this.params.rays
		this.mesh.visible = p.enabled && p.opacity >= 0.005
		if (!this.mesh.visible) return
		this.material.uniforms.time.value += dt * features.rate
		// The rays boost channels (Dawn sunburst): the shafts blaze and extra
		// ones pierce through- drawn from the build-time reserve, appearing
		// staggered along the envelope ramp, masked by the swelling light.
		this.mesh.geometry.instanceCount = p.count + Math.min(BURST_RESERVE, Math.round(features.boost.raysCount))
		this.material.uniforms.globalOpacity.value = p.opacity * (1 + features.boost.rays)
	}

}
