// --- sounds/TrackTuningConfig -------------------------------------------------

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
		startBin: 4,
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
		beatHold: 0.22,
		beatDecay: 0.982,
		beatMin: 0.15,
		beatMult: 1.15,
		beat2Hold: 0.28,
		beat2Decay: 0.994,
		beat2Min: 0.28,
		beat2Mult: 1.35,
		volumeMult: 1.0,
		/** Pas de kick tant que le volume lissé est sous ce seuil (évite bruit / silence clip). */
		beatVolumeMin: 0.14,
	},
}

export function paramsForTrack( id ) {
	return TRACK_PARAMS[ id ] ?? TRACK_PARAMS.default
}

export function trackIdFromUrl( url ) {
	const decoded = decodeURIComponent( url )
	if ( /01-Tame/i.test( decoded ) ) return 'tame'
	if ( /02-The/i.test( decoded ) ) return 'stones'
	if ( /03-Digeridoo/i.test( decoded ) ) return 'digeridoo'
	return ''
}
