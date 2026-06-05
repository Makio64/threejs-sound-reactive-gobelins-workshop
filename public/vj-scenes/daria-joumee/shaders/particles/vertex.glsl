uniform float uAge;
uniform float uLife;
uniform float uKick;

attribute vec3 aVelocity;
attribute float aRandom;
attribute float aSize;
attribute vec3 aColor;

varying float vLife;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float t = clamp(uAge / uLife, 0.0, 1.0);

  vLife = t;
  vColor = aColor;

  // fast push at beginning, then speed becomes much lower
  float fastDistance = (1.0 - exp(-uAge * 7.0)) * 0.9 * uKick;

  // slow floating after initial push
  float slowDistance = max(uAge - 0.18, 0.0) * 0.35;

  vec3 dir = normalize(aVelocity);

  vec3 pos = position;

  pos += dir * uKick * 0.5  * fastDistance;
  pos += dir * uKick * 0.5 * slowDistance;

  // curly random trajectory after the first impact
  float curlAmount = smoothstep(0.001, 0.45, t);

  vec3 curl = vec3(
    sin(uAge * 6.0 + aRandom * 40.0),
    cos(uAge * 4.5 + aRandom * 31.0),
    sin(uAge * 5.2 + aRandom * 25.0)
  );

  pos += curl * curlAmount * (0.12 + aRandom * 0.28);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  float startGlow = exp(-uAge * 5.0);
  float size = aSize * 180.0 * (1.0 + startGlow * 2.5);

  gl_PointSize = size;
  gl_PointSize *= 1.0 / -mvPosition.z;

  vAlpha =
    smoothstep(0.0, 0.08, t) *
    (1.0 - smoothstep(0.68, 1.0, t));

  gl_Position = projectionMatrix * mvPosition;
}