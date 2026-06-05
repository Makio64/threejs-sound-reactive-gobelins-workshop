export default /* glsl */ `
varying vec4 vColor;
varying float z;

uniform vec3 color;

void main()
{
    float shade = 0.25 + (1000.0 - z) / 1000.0 * vColor.x * 0.5;
    gl_FragColor = vec4(color * shade, 1.0);
}
`;
