import vertexShader from './glitch/vertex.glsl.js'
import fragmentShader from './glitch/fragment.glsl.js'

const GlitchShader = {
    name: 'GlitchShader',

    uniforms: {
        tDiffuse: { value: null },
        byp: { value: 1 },
        amount: { value: 0.006 },
        angle: { value: 0 },
        shiftX: { value: 0 }
    },

    vertexShader,
    fragmentShader
}

export default GlitchShader
