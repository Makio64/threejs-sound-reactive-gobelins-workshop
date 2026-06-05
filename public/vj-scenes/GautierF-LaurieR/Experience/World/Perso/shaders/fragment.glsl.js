export default /* glsl */ `
uniform float uTime;
uniform float uLineAngle;
uniform vec3 uColor;
uniform vec3 uLineColor;

varying vec2 vUv;

#include <common>
#include <fog_pars_fragment>

void main()
{
    vec2 centered = vUv - 0.5;
    float c = cos(uLineAngle);
    float s = sin(uLineAngle);
    vec2 rotated = vec2(
        c * centered.x - s * centered.y,
        s * centered.x + c * centered.y
    );

    float strength = mod(rotated.y * 10.0 + uTime * 0.4, 1.0);
    strength = step(0.8, strength);

    vec3 color = mix(uColor, uLineColor, strength);

    gl_FragColor = vec4(color, 1.0);

    #include <fog_fragment>
}
`;
