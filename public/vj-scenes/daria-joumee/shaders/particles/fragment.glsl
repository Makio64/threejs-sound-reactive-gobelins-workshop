precision mediump float;

varying float vLife;
varying float vAlpha;
varying vec3 vColor;
varying float vRandom;

float edgeFunction(vec2 a, vec2 b, vec2 p) {
  return (p.x - a.x) * (b.y - a.y) -
         (p.y - a.y) * (b.x - a.x);
}

mat2 rotate2D(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_PointCoord - 0.5;

  // random rotation
  float angle = vRandom * 6.28318;
  uv = rotate2D(angle) * uv;

  // random triangle shape
  vec2 p0 = vec2(-0.45, -0.35);
  vec2 p1 = vec2( 0.45, -0.25 + vRandom * 0.25);
  vec2 p2 = vec2(-0.15 + vRandom * 0.35, 0.45);

  float e0 = edgeFunction(p0, p1, uv);
  float e1 = edgeFunction(p1, p2, uv);
  float e2 = edgeFunction(p2, p0, uv);

  bool inside =
    (e0 >= 0.0 && e1 >= 0.0 && e2 >= 0.0) ||
    (e0 <= 0.0 && e1 <= 0.0 && e2 <= 0.0);

  if (!inside) discard;

  // distance from center for glass glow
  float d = length(uv);

  float centerGlow = 1.0 - smoothstep(0.0, 0.45, d);

  // bright flash at birth
  float flash =
    1.0 +
    (1.0 - smoothstep(0.0, 0.18, vLife)) * 2.5;

  // fake sharp glass edge
  float edgeGlow =
    1.0 - smoothstep(0.35, 0.52, d);

  vec3 color = vColor * flash;
  color += vec3(1.0, 0.95, 0.75) * centerGlow * 0.35;

  float alpha = vAlpha;
  alpha *= 0.75 + edgeGlow * 0.35;

  gl_FragColor = vec4(color, alpha);
}