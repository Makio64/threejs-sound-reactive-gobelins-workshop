import * as THREE from 'three'

// White body + colored fresnel rim: view-facing surfaces stay bright (with a
// soft facing-based shading so the white reads as volume, not a flat blob),
// grazing angles tint toward the rim color- a saturated contour that
// contrasts with the active preset's sky and separates the body from the
// white clouds. rimStrength pulses on hard kicks; the rim pushes edge
// luminance past the (raised) bloom threshold, so only the contour halos.
// Skinning chunks make it work on the animated SkinnedMesh (three supplies
// the bone uniforms for any material on a SkinnedMesh).
export default {
	uniforms: {
		baseColor: { value: new THREE.Color(0xe8e8f0) },
		rimColor: { value: new THREE.Color(0xff6a00) },
		rimPower: { value: 2.5 },
		rimStrength: { value: 1.2 },
		lightDir: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },   // VIEW space- set per frame
		shading: { value: 0.45 },   // 0 = flat, →1 = high-contrast modeling
		ambientColor: { value: new THREE.Color(0xffffff) },   // the preset's skyTop- lerped with the color cycle
		ambientTint: { value: 0.5 },   // 0 = pure white body, →1 = fully bathed in the scene's light
	},
	vertexShader: /* glsl */`
		#include <common>
		#include <skinning_pars_vertex>
		varying vec3 vNormal;
		varying vec3 vViewPos;
		void main() {
			#include <beginnormal_vertex>
			#include <skinbase_vertex>
			#include <skinnormal_vertex>
			#include <begin_vertex>
			#include <skinning_vertex>
			vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
			vNormal = normalize( normalMatrix * objectNormal );
			// Raw view position- normalized in the fragment shader. Normalizing here
			// NaNs when a vertex crosses the camera (length ~0), and the NaN varying
			// paints the whole triangle black; fragments are always past the near
			// plane, so the per-fragment normalize is safe.
			vViewPos = mvPosition.xyz;
			gl_Position = projectionMatrix * mvPosition;
		}
	`,
	fragmentShader: /* glsl */`
		uniform vec3 baseColor;
		uniform vec3 rimColor;
		uniform float rimPower;
		uniform float rimStrength;
		uniform vec3 lightDir;
		uniform float shading;
		uniform vec3 ambientColor;
		uniform float ambientTint;
		varying vec3 vNormal;
		varying vec3 vViewPos;
		void main() {
			vec3 n = normalize( vNormal );
			// clamp (not max): float error can push the dot past 1.0, and
			// pow(negative, x) is NaN- renders as a black triangle.
			float facing = clamp( dot( n, normalize( - vViewPos ) ), 0.0, 1.0 );
			float fresnel = pow( 1.0 - facing, rimPower );
			// Half-Lambert modeling from a fixed world light (rotated to view space
			// on the CPU): the lit side stays at full baseColor- luminance never
			// exceeds it, so the bloom threshold contract still holds- while the
			// far side falls off softly. As the camera orbits, the modeling sweeps
			// across the body.
			float ndl = dot( n, normalize( lightDir ) ) * 0.5 + 0.5;
			float shade = mix( 1.0 - shading, 1.0, ndl );
			// The body bathes in the scene's ambient light: the preset's horizon
			// color multiplies the base (never brightens- the bloom threshold
			// contract on max luminance still holds).
			vec3 tinted = baseColor * mix( vec3( 1.0 ), ambientColor, ambientTint );
			vec3 col = tinted * shade + rimColor * fresnel * rimStrength;
			gl_FragColor = vec4( col, 1.0 );
		}
	`,
}
