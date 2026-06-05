export default /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uColor;
uniform float uOpacity;

#include <fog_pars_fragment>

void main()
{
    vec4 tex = texture2D(uMap, gl_PointCoord);

    if(tex.a < 0.01)
        discard;

    vec4 color = vec4(uColor, uOpacity) * tex;
    gl_FragColor = color;

    #include <fog_fragment>
}
`;
