export const vertexShader_imageBackground = `
uniform float u_volume;

varying vec2 vUv;

void main() {
    vUv = uv;

    // on fait crée une forme d'onde de volume pour faire du "pumping"
    float scale = 1.0 + u_volume * 0.5; // plus le volume est fort, plus on agrandit l'image
    vec3 pos = position * vec3(scale, scale, 1.0); // on scale en X et Y seulement

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

export const fragmentShader_imageBackground = `
uniform sampler2D u_tex;
uniform float u_volume;

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
        vec2(12.9898,78.233))) *
        43758.5453123);
}

void main()
{
    vec2 uv = vUv;

    vec3 tex = texture2D(u_tex, uv).rgb;

    gl_FragColor = vec4(tex, 1.0);
}
`