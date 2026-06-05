varying float vLife;
varying float vAlpha;
varying vec3 vColor;

void main() {

  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // bright center
  float core = 1.0 -
    smoothstep(0.0, 0.22, d);

  // soft halo
  float glow = 1.0 -
    smoothstep(0.12, 0.5, d);

  // strong colored flash at birth
  float flash = 1.0 +
    (1.0 -
    smoothstep(0.0, 0.18, vLife)) * 2.8;

  vec3 color = vColor *
    flash;

  float alpha = core * 0.95 +
    glow * 0.5;

  alpha *= vAlpha;

  gl_FragColor = vec4(color, alpha);
}