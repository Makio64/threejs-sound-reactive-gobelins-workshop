export const vertexShader_crtLinesChelou = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const fragmentShader_crtLinesChelou = `
uniform sampler2D u_tex;
uniform float u_time;
uniform float u_glitchStrength;
uniform float u_volume;
uniform vec2 u_resolution;

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
        vec2(12.9898,78.233))) *
        43758.5453123);
}

void main()
{
    vec2 uv = vUv;

    // --- GRID (lignes horizontales) ---
    vec2 st = uv;
    st.y *= 20.0*u_volume*(u_glitchStrength*0.6); // plus de lignes = glitch plus fin

    float row = floor(st.y);

    // random stable par ligne
    float r = random(vec2(row, 0.0));

    // direction gauche/droite
    float dir = step(0.5, r) * 2.0 - 1.0;

    // intensité du glitch par ligne
    float strength = pow(r, 3.0);

    // animation dans le temps (variation continue)
    float timeShift = sin(u_glitchStrength * 0.5 + row * 2.0);

    // offset final (le cœur du glitch)
    float offset = dir * strength * timeShift * 0.15;

    // on applique un offset PAR BANDE
    vec2 glitchUV = uv;
    glitchUV.x += offset * 0.2;

    // léger "wiggle" secondaire pour casser la rigidité
    glitchUV.y += sin(u_glitchStrength * 0.5 + row) * 0.002;

    vec3 tex = texture2D(u_tex, glitchUV).rgb;

    gl_FragColor = vec4(tex, 1.0);
}
`