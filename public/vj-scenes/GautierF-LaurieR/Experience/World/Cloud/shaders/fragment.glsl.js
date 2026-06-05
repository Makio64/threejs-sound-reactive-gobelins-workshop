export default /* glsl */ `
precision highp float;
precision highp sampler3D;

in vec3 vOrigin;
in vec3 vDirection;

out vec4 color;

uniform vec3 base;
uniform vec3 sunDirection;
uniform sampler3D map;

uniform float threshold;
uniform float range;
uniform float opacity;
uniform float intensity;
uniform float steps;
uniform float frame;
uniform float time;

float hash21(vec2 p)
{
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 hitBox(vec3 orig, vec3 dir)
{
    const vec3 box_min = vec3(-0.5);
    const vec3 box_max = vec3(0.5);
    vec3 inv_dir = 1.0 / dir;
    vec3 tmin_tmp = (box_min - orig) * inv_dir;
    vec3 tmax_tmp = (box_max - orig) * inv_dir;
    vec3 tmin = min(tmin_tmp, tmax_tmp);
    vec3 tmax = max(tmin_tmp, tmax_tmp);
    float t0 = max(tmin.x, max(tmin.y, tmin.z));
    float t1 = min(tmax.x, min(tmax.y, tmax.z));
    return vec2(t0, t1);
}

float boxFalloff(vec3 p)
{
    vec3 edge = 1.0 - smoothstep(0.52, 0.94, abs(p) * 2.0);
    return edge.x * edge.y * edge.z;
}

float sampleDensity(vec3 p)
{
    // Dérive périodique : une dérive linéaire finit par sortir de la zone utile de la texture (nuages invisibles)
    vec3 drift = vec3(
        sin(time * 0.12) * 0.06,
        sin(time * 0.09) * 0.04,
        cos(time * 0.1) * 0.05
    );
    return texture(map, clamp(p + drift + 0.5, 0.001, 0.999)).r;
}

void main()
{
    vec3 rayDir = normalize(vDirection);
    vec2 bounds = hitBox(vOrigin, rayDir);

    if(bounds.x > bounds.y)
        discard;

    bounds.x = max(bounds.x, 0.0);

    float stepSize = (bounds.y - bounds.x) / steps;
    float jitter = hash21(gl_FragCoord.xy + frame) * 2.0 - 1.0;
    vec3 p = vOrigin + bounds.x * rayDir + rayDir * jitter * stepSize;

    float densityMin = threshold - range;
    float densityMax = threshold + range;
    vec3 sunDir = normalize(sunDirection);

    vec4 ac = vec4(base, 0.0);

    for(float i = 0.0; i < steps; i += 1.0)
    {
        float falloff = boxFalloff(p);
        float raw = sampleDensity(p);

        if(raw > densityMin && falloff > 0.001)
        {
            float d = smoothstep(densityMin, densityMax, raw) * opacity * falloff * intensity;

            float sunFactor = clamp(dot(normalize(p + vec3(0.01)), sunDir) * 0.45 + 0.55, 0.45, 1.0);
            float heightGlow = clamp(-p.y * 0.35 + 0.65, 0.5, 1.0);
            vec3 litColor = mix(base * 0.82, base * 1.18, sunFactor) * heightGlow;

            ac.rgb += (1.0 - ac.a) * d * litColor;
            ac.a += (1.0 - ac.a) * d;

            if(ac.a >= 0.92)
                break;
        }

        p += rayDir * stepSize;
    }

    if(ac.a < 0.01)
        discard;

    color = ac;
}
`;
