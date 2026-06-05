export default /* glsl */ `
uniform int byp;
uniform sampler2D tDiffuse;
uniform float amount;
uniform float angle;
uniform float shiftX;

varying vec2 vUv;

void main() {
    if(byp >= 1) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
    }

    vec2 offset = amount * vec2(cos(angle), sin(angle));
    vec2 p = vUv + vec2(shiftX, 0.0);

    float r = texture2D(tDiffuse, p + offset).r;
    float g = texture2D(tDiffuse, p).g;
    float b = texture2D(tDiffuse, p - offset).b;
    float a = texture2D(tDiffuse, p).a;

    gl_FragColor = vec4(r, g, b, a);
}
`;
