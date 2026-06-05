uniform sampler2D uRayTexture;

uniform float uTime;
uniform float uVolume;
uniform float uOpacity;
uniform float uBrightness;
uniform float uIntroPower;

uniform vec3 uTintColor;

varying vec2 vUv;

void main() {

  vec4 ray = texture2D(
    uRayTexture,
    vUv
  );

  float volume =
    clamp(
      uVolume,
      0.0,
      1.0
    );

  float reactiveVolume =
    smoothstep(
      0.5,
      1.0,
      volume
    );

  float opacity =
    uOpacity *
    reactiveVolume ;

  float brightness =
    uBrightness
    +
    reactiveVolume * 1.5
    +
      reactiveVolume * 0.8;

  vec3 finalColor =
    ray.rgb;

  finalColor =
    mix(
      finalColor,
      finalColor * uTintColor,
      0.22
    );

  finalColor *= brightness;

  finalColor *= uIntroPower;

  float alpha =
    ray.a *
    opacity;

  gl_FragColor =
    vec4(
      finalColor,
      alpha
    );
}