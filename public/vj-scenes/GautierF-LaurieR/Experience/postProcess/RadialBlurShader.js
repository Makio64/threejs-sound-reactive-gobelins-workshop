import { Vector2 } from 'three'

const RadialBlurShader = {
    name: 'RadialBlurShader',

    uniforms: {
        tDiffuse: { value: null },
        center: { value: new Vector2(0.5, 0.5) },
        strength: { value: 0.12 },
        decay: { value: 0.95 },
        weight: { value: 0.9 },
        exposure: { value: 2.5 },
        samples: { value: 32 }
    },

    vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /* glsl */ `
        #define MAX_SAMPLES 64

        uniform sampler2D tDiffuse;
        uniform vec2 center;
        uniform float strength;
        uniform float decay;
        uniform float weight;
        uniform float exposure;
        uniform int samples;

        varying vec2 vUv;

        void main() {
            vec2 delta = center - vUv;
            vec4 color = texture2D(tDiffuse, vUv) * weight;
            float illumination = 1.0;

            for(int i = 0; i < MAX_SAMPLES; i++) {
                if(i >= samples) break;

                float t = float(i) / float(samples);
                vec2 sampleUv = vUv + delta * t * strength;
                vec4 sampleColor = texture2D(tDiffuse, sampleUv);
                sampleColor *= illumination * weight;
                color += sampleColor;
                illumination *= decay;
            }

            gl_FragColor = color * exposure;
        }
    `
}

export default RadialBlurShader
