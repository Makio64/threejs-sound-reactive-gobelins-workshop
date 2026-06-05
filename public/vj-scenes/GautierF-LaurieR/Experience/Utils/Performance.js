/** Réglages perf — impact visuel limité, gain GPU/CPU notable. */
export const PERFORMANCE = {
    maxPixelRatio: 1.25,
    /** Résolution interne du composer (< 1 = post-process plus léger). */
    postProcessPixelScale: 0.85,
    particleCount: 1500,
    cloudSteps: 18,
    cloudMinSteps: 12,
    radialBlurSamples: 4,
    rgbShiftEnabled: false,
    shadowMapSize: 256,
    /** 1 = chaque frame, 2 = une ombre sur deux, etc. */
    shadowUpdateInterval: 2
}
