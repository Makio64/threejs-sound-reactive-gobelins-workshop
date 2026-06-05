/**
 * Énergie par bande (0..1) à partir de volumeByFrequency.
 * Graves/médiums : moyenne · Aigus : pic + moyenne (les aigus sont souvent faibles en moyenne).
 */
export function getFrequencyBands( volumeByFrequency ) {
	const n = volumeByFrequency?.length ?? 0
	if ( n < 4 ) {
		return { graves: 0, mediums: 0, aigues: 0 }
	}

	const avg = ( from, to ) => {
		let sum = 0
		let count = 0
		for ( let i = from; i < to; i += 1 ) {
			sum += volumeByFrequency[ i ] ?? 0
			count += 1
		}
		return count ? sum / count : 0
	}

	const peak = ( from, to ) => {
		let max = 0
		for ( let i = from; i < to; i += 1 ) {
			max = Math.max( max, volumeByFrequency[ i ] ?? 0 )
		}
		return max
	}

	const bassEnd = Math.max( 3, Math.floor( n * 0.08 ) )
	const midEnd = Math.max( bassEnd + 2, Math.floor( n * 0.28 ) )
	const highFrom = midEnd

	const graves = avg( 1, bassEnd )
	const mediums = avg( bassEnd, midEnd )
	const aiguesPeak = peak( highFrom, n )
	const aiguesAvg = avg( highFrom, n )
	const aigues = Math.min( 1, aiguesPeak * 0.7 + aiguesAvg * 0.3 * 2.0 )

	return { graves, mediums, aigues }
}
