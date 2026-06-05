export default /* glsl */ `
uniform float uTime;
uniform float uSize;

attribute vec3 aRandom;
attribute vec3 aSpeed;

#include <fog_pars_vertex>

void main()
{
    vec3 pos = position;
    pos.x += sin(uTime * aSpeed.x + aRandom.x) * 0.35;
    pos.y += sin(uTime * aSpeed.y + aRandom.y) * 0.2;
    pos.z += cos(uTime * aSpeed.z + aRandom.z) * 0.35;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * (300.0 / -mvPosition.z);

    #include <fog_vertex>
}
`;
