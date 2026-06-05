export const vertexShader_blocsFragmentation = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const fragmentShader_blocsFragmentation = `
uniform sampler2D u_tex;
uniform float     u_count;
uniform float     u_stretch;

varying vec2 vUv;

float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv  = vUv;
    vec3 col = texture2D(u_tex, uv).rgb;

    for (float i = 0.0; i < 128.0; i++) {
        float visible = step(i, u_count - 1.0);   // 1.0 si actif, 0.0 sinon — pas de break

        float cx = random(vec2(i, 0.0));
        float cy = random(vec2(i, 1.0));
        float hw = random(vec2(i, 2.0)) * 0.12 + 0.02;
        float hh = (random(vec2(i, 3.0)) * 0.12 + 0.02) * u_stretch;

        vec2 d   = abs(uv - vec2(cx, cy));
        float ox = (random(vec2(i, 4.0)) - 0.5) * 0.06;
        float oy = (random(vec2(i, 5.0)) - 0.5) * 0.06;
        vec3 sq  = texture2D(u_tex, uv + vec2(ox, oy)).rgb;

        float inside = step(d.x, hw) * step(d.y, hh) * visible;
        col = mix(col, sq, inside);
    }

    gl_FragColor = vec4(col, 1.0);
}
`
