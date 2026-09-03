// Additively merges a bloom-only render target on top of the base scene.
// Used by the selective-bloom pipeline (sky never bloomed; only body radiates).
export default {
	uniforms: {
		baseTexture: { value: null },
		bloomTexture: { value: null },
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform sampler2D baseTexture;
		uniform sampler2D bloomTexture;
		varying vec2 vUv;
		void main() {
			gl_FragColor = texture2D( baseTexture, vUv ) + texture2D( bloomTexture, vUv );
		}
	`,
}
