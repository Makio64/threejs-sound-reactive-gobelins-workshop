import { analyzeDrops } from './dropAnalysis.js'

// Off-main-thread drop analysis: the ~80ms burst on the first-ever play of a
// track would otherwise land as a visible hitch right at track start. The id
// rides along so a stale result (track changed mid-analysis) can be ignored.
onmessage = (e) => {
	const { id, samples, sampleRate } = e.data
	postMessage({ id, times: analyzeDrops(samples, sampleRate) })
}
