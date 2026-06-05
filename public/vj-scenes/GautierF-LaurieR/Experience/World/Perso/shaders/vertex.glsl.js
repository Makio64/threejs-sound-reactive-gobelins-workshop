export default /* glsl */ `
varying vec2 vUv;

#include <common>
#include <skinning_pars_vertex>
#include <fog_pars_vertex>

void main()
{
    #include <begin_vertex>
    #include <skinbase_vertex>
    #include <skinning_vertex>

    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
}
`;
