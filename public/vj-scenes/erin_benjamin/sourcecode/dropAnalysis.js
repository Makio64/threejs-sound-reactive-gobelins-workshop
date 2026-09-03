// Offline drop analysis- the whole track is in hand, so unlike the live
// detector this one SEES THE FUTURE: a candidate only counts as a drop if the
// level after it HOLDS (a fill spikes and falls back- auto-rejected), and the
// scores are relative to the full track's own dynamics (no thresholds to
// retune per mastering). Pure function over decoded PCM: runs in the browser
// (dropTimeline.js) and in Node (validation script) unchanged.

const HOP = 1024              // ~23ms at 44.1kHz
const SMOOTH = 0.35           // envelope window (s)- matches the runtime's passage smoothing
const GUARD = 0.3             // s excluded around the candidate when comparing before/after
const CONTEXT = 3.0           // s of before/after context that defines the step
const SUSTAIN_FROM = 0.5      // the after-level must HOLD over this window...
const SUSTAIN_TO = 4.0        // ...for the candidate to be a drop, not a fill
const MIN_SPACING = 8         // s between two drops
const MAX_DROPS = 12
const HOT_FLOOR = 0.55        // a drop lands hot: after-level, fraction of the track's p99
const SUSTAIN_FLOOR = 0.5     // and stays hot: sustain-level, fraction of the track's p99
const KEEP_RATIO = 0.45       // keep candidates scoring at least this fraction of the best
const SCORE_FLOOR = 0.22      // absolute score floor- a flat track yields few/no drops
const SNAP = 0.35             // s around the candidate searched for the exact bass impact

export function analyzeDrops(samples, sampleRate) {
	const hopDur = HOP / sampleRate
	const n = Math.floor(samples.length / HOP)
	if (n < Math.ceil(30 / hopDur) / 3) return []   // under ~10s of audio

	// Per-hop RMS, full band + one-pole ~150Hz low-pass (bass).
	const full = new Float32Array(n)
	const bassRaw = new Float32Array(n)
	const k = 1 - Math.exp(-2 * Math.PI * 150 / sampleRate)
	let lp = 0
	for (let h = 0; h < n; h++) {
		let sf = 0
		let sb = 0
		const off = h * HOP
		for (let i = 0; i < HOP; i++) {
			const s = samples[off + i]
			lp += (s - lp) * k
			sf += s * s
			sb += lp * lp
		}
		full[h] = Math.sqrt(sf / HOP)
		bassRaw[h] = Math.sqrt(sb / HOP)
	}

	const bass = bassRaw.slice()
	boxSmooth(full, Math.round(SMOOTH / hopDur))
	boxSmooth(bass, Math.round(SMOOTH / hopDur))
	normalizeByP99(full)
	normalizeByP99(bass)

	// Prefix sums for O(1) window means.
	const fullSum = prefixSum(full)
	const bassSum = prefixSum(bass)
	const mean = (sum, a, b) => (sum[b] - sum[a]) / Math.max(1, b - a)

	const wGuard = Math.round(GUARD / hopDur)
	const wCtx = Math.round(CONTEXT / hopDur)
	const wSusA = Math.round(SUSTAIN_FROM / hopDur)
	const wSusB = Math.round(SUSTAIN_TO / hopDur)

	// Step score per hop: how much louder the future is than the past, with a
	// bass bonus (drops slam the low end back), gated on landing AND staying hot.
	const score = new Float32Array(n)
	for (let h = wCtx; h < n - wSusB; h++) {
		const after = mean(fullSum, h + wGuard, h + wCtx)
		if (after < HOT_FLOOR) continue
		if (mean(fullSum, h + wSusA, h + wSusB) < SUSTAIN_FLOOR) continue
		const step = after - mean(fullSum, h - wCtx, h - wGuard)
		const bStep = mean(bassSum, h + wGuard, h + wCtx) - mean(bassSum, h - wCtx, h - wGuard)
		score[h] = step + 0.7 * bStep
	}

	// Greedy peak picking with spacing: best first, then anything strong enough
	// that is not inside an accepted drop's exclusion window.
	const order = []
	for (let h = 0; h < n; h++) if (score[h] > 0) order.push(h)
	order.sort((a, b) => score[b] - score[a])
	const wSpace = Math.round(MIN_SPACING / hopDur)
	const accepted = []
	const best = order.length ? score[order[0]] : 0
	for (const h of order) {
		if (score[h] < Math.max(SCORE_FLOOR, best * KEEP_RATIO)) break
		if (accepted.some((a) => Math.abs(a - h) < wSpace)) continue
		accepted.push(h)
		if (accepted.length >= MAX_DROPS) break
	}

	// Snap each drop to the strongest bass onset around it- the exact hit frame.
	const wSnap = Math.round(SNAP / hopDur)
	const times = accepted.map((h) => {
		let bestH = h
		let bestRise = -Infinity
		for (let i = Math.max(1, h - wSnap); i <= Math.min(n - 1, h + wSnap); i++) {
			const rise = bassRaw[i] - bassRaw[i - 1]
			if (rise > bestRise) {
				bestRise = rise
				bestH = i
			}
		}
		return bestH * hopDur
	})

	return times.sort((a, b) => a - b)
}

// Centered box filter (symmetric- an offline luxury: no phase lag).
function boxSmooth(arr, halfWidth) {
	if (halfWidth < 1) return
	const src = arr.slice()
	const sum = prefixSum(src)
	for (let i = 0; i < arr.length; i++) {
		const a = Math.max(0, i - halfWidth)
		const b = Math.min(arr.length, i + halfWidth + 1)
		arr[i] = (sum[b] - sum[a]) / (b - a)
	}
}

function prefixSum(arr) {
	const sum = new Float64Array(arr.length + 1)
	for (let i = 0; i < arr.length; i++) sum[i + 1] = sum[i] + arr[i]
	return sum
}

// Robust normalization: the 99th percentile stands in for the peak, so one
// stray transient cannot compress the whole track's scale.
function normalizeByP99(arr) {
	const sorted = arr.slice().sort()
	const p99 = Math.max(1e-6, sorted[Math.floor(sorted.length * 0.99)])
	for (let i = 0; i < arr.length; i++) arr[i] = Math.min(1.5, arr[i] / p99)
}
