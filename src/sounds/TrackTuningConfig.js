// --- sounds/TrackTuningConfig -------------------------------------------------
// Per-track tuning for the Analyzer's kick detectors and volume - the knobs a human
// edits by ear, kept out of the engine (Analyzer.js) so the analysis code stays clean.
//
// Hand-tuned by ear per track (detected from filename via trackIdFromUrl → setTrackId;
// unknown sources fall back to `default`). fftSize 512 ⇒ 256 bins, ~86 Hz each.
//   [startBin, endBin)  band the kick detectors watch (bin 0 / DC excluded)
//   beat*  → soft kick (analyzer.kick)   beat2* → hard kick (analyzer.kickHard, stricter)
//   *Hold refractory secs · *Min threshold floor · *Mult hit boost · *Decay idle decay
//   volumeMult scales analyzer.volume after AGC
// --------------------------------------------------------------------------------

export const TRACK_PARAMS = {
	tame: {
		startBin: 1,
		endBin: 8,
		beatHold: 0.28,
		beatDecay: 0.98,
		beatMin: 0.15,
		beatMult: 1.15,
		beat2Hold: 0.35,
		beat2Decay: 0.993,
		beat2Min: 0.26,
		beat2Mult: 1.32,
		volumeMult: 1.25,
	},
	stones: {
		startBin: 2,
		endBin: 9,
		beatHold: 0.18,
		beatDecay: 0.968,
		beatMin: 0.12,
		beatMult: 1.12,
		beat2Hold: 0.22,
		beat2Decay: 0.988,
		beat2Min: 0.22,
		beat2Mult: 1.28,
		volumeMult: 1.15,
	},
	digeridoo: {
		startBin: 4, // skip drone frequencies in lower bins
		endBin: 10,
		beatHold: 0.26,
		beatDecay: 0.975,
		beatMin: 0.18,
		beatMult: 1.18,
		beat2Hold: 0.32,
		beat2Decay: 0.994,
		beat2Min: 0.30,
		beat2Mult: 1.35,
		volumeMult: 1.3,
	},
	default: {
		startBin: 1,
		endBin: 8,
		beatHold: 0.3,
		beatDecay: 0.982,
		beatMin: 0.15,
		beatMult: 1.15,
		beat2Hold: 0.4,
		beat2Decay: 0.994,
		beat2Min: 0.28,
		beat2Mult: 1.35,
		volumeMult: 1.0,
	}
}

// Resolve a track id to its tuning, falling back to `default` for unknown/empty ids.
export function paramsForTrack( id ) {
	return TRACK_PARAMS[ id ] ?? TRACK_PARAMS.default
}

// Map a track URL → its TRACK_PARAMS key (lives here, next to the tuning it selects).
// The player/host pass the result to analyzer.setTrackId(). Unknown → '' (default).
export function trackIdFromUrl( url ) {
	const decoded = decodeURIComponent( url )
	if ( /01-Tame/i.test( decoded ) ) return 'tame'
	if ( /02-The/i.test( decoded ) ) return 'stones'
	if ( /03-Digeridoo/i.test( decoded ) ) return 'digeridoo'
	return ''
}
