uniform sampler2D uTexture;
uniform sampler2D uMask;

uniform float uTime;
uniform float uVolume;
uniform float uFlash;

uniform float uBaseBrightness;
uniform float uVolumeBrightness;
uniform float uGlowStrength;
uniform float uSaturation;
uniform float uIntroPower;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uFlashColor;

varying vec2 vUv;

vec3 saturateColor(vec3 color, float saturation) {
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  return mix(vec3(gray), color, saturation);
}

void main() {
  vec4 glass = texture2D(uTexture, vUv);
  float mask = texture2D(uMask, vUv).r;

  vec3 glassColor = glass.rgb;

  float volume = clamp(uVolume, 0.0, 1.0);
  float reactiveVolume = smoothstep(0.4, 1.0, volume);

  float flash = clamp(uFlash, 0.0, 1.0);

  float wave =
    sin((vUv.x + vUv.y) * 8.0 + uTime * 1.2) * 0.5 + 0.5;

  float movingLight = mix(0.85, 1.15, wave);
  vec3 tint = mix(uColorA, uColorB, wave);

  float brightness = max(
    0.0,
    uBaseBrightness + reactiveVolume * 2.0 + uVolumeBrightness - 3.0
  );

  vec3 finalColor = glassColor;

  finalColor *= mix(vec3(1.0), tint, 0.28);
  finalColor *= brightness;
  finalColor += glassColor * reactiveVolume * uGlowStrength * movingLight;

  // center pulse
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(vUv, center);

  float pulsePosition = 1.0 - flash;
  float ring = 1.0 - smoothstep(0.0, 0.12, abs(dist - pulsePosition * 0.7));

  float centerGlow = 1.0 - smoothstep(0.0, 0.65, dist);
  float pulse = max(ring, centerGlow * flash);

  float maskedPulse = pulse * flash * mask;

  finalColor += glassColor * maskedPulse * 2.0;
  finalColor += uFlashColor * maskedPulse * 2.2;

  finalColor = mix(
    finalColor,
    (finalColor - 0.5) * 1.35 + 0.5,
    maskedPulse * 0.7
  );

  finalColor = saturateColor(
    finalColor,
    uSaturation + reactiveVolume * 0.35 + maskedPulse * 0.6
  );

  finalColor *= uIntroPower;

  gl_FragColor = vec4(finalColor, glass.a);
}