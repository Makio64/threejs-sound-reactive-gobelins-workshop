import { analyzeDrops } from './dropAnalysis.js'

// Bump when the analysis algorithm changes- stale cached maps must re-analyse.
const CACHE_PREFIX = 'dropmap:v1:'

// Maps each local track to its drop timestamps and fires them sample-tight at
// playback. Resolution order per track: hand overrides (dropmaps.json next to
// the scene- editable by ear, wins always) → localStorage cache → fresh
// in-browser analysis of the mp3 (dropAnalysis.js, full-lookahead). When no
// timeline applies (mic, host iframe, analysis pending/failed) the features'
// live detector keeps watch- this module only STANDS IT DOWN when it owns the
// current track.
export default class DropTimeline {

	constructor(audio) {
		this.audio = audio
		this.src = null
		this.times = null
		this.idx = 0
		this.lastCt = -10
		this.decodeCtx = null
		this.worker = null
		this.workerBroken = false
		this.analyzeId = 0
		this.state = 'idle'   // idle | analysing | ready | fallback
		this.overridesReady = fetch('./dropmaps.json')
			.then((r) => (r.ok ? r.json() : {}))
			.catch(() => ({}))
	}

	// Every frame, BEFORE features.update(): fires features.fireDrop() at the
	// mapped instants and flags whether the live detector should stand down.
	update(features) {
		const player = this.audio.mode === 'live' ? this.audio.player : null
		const el = player?.audioEl
		const src = el && player.source === 'mp3' ? el.src : null
		if (src !== this.src) {
			this.src = src
			this.times = null
			this.state = src ? 'analysing' : 'idle'
			if (src) this.load(src)
		}
		const active = !!(this.times && el && !el.paused)
		features.timelineActive = active
		if (!active) {
			features.dropIn = Infinity
			return
		}
		const ct = el.currentTime
		// Seeks, loops and track restarts all land here: re-anchor the cursor.
		if (ct < this.lastCt - 0.3 || ct > this.lastCt + 1.5) {
			const next = this.times.findIndex((t) => t > ct + 0.05)
			this.idx = next < 0 ? this.times.length : next
		}
		this.lastCt = ct
		while (this.idx < this.times.length && this.times[this.idx] <= ct) {
			// Freshness guard: after a tab stall the missed instant must not fire late.
			if (ct - this.times[this.idx] < 0.25) features.fireDrop('timeline')
			this.idx++
		}
		features.dropIn = this.idx < this.times.length ? this.times[this.idx] - ct : Infinity
	}

	// The heavy analysis runs in a Worker so the first-ever play of a track
	// cannot hitch the frame loop (only the mono mixdown, ~30ms, stays on the
	// main thread). Samples are cloned rather than transferred: on a worker
	// failure they are still intact for the inline fallback, and future
	// requests then skip the worker entirely.
	analyze(samples, sampleRate) {
		if (!this.workerBroken && !this.worker) {
			try {
				this.worker = new Worker(new URL('./dropWorker.js', import.meta.url), { type: 'module' })
			} catch {
				this.workerBroken = true
			}
		}
		if (this.workerBroken) return Promise.resolve(analyzeDrops(samples, sampleRate))
		return new Promise((resolve) => {
			const id = ++this.analyzeId
			const onMessage = (e) => {
				if (e.data.id !== id) return
				cleanup()
				resolve(e.data.times)
			}
			const onError = () => {
				cleanup()
				this.workerBroken = true
				resolve(analyzeDrops(samples, sampleRate))
			}
			const cleanup = () => {
				this.worker.removeEventListener('message', onMessage)
				this.worker.removeEventListener('error', onError)
			}
			this.worker.addEventListener('message', onMessage)
			this.worker.addEventListener('error', onError)
			this.worker.postMessage({ id, samples, sampleRate })
		})
	}

	async load(src) {
		const requested = src
		const name = decodeURIComponent(src.split('/').pop().replace(/\.mp3$/i, ''))
		try {
			const overrides = await this.overridesReady
			let times = overrides?.[name]
			if (!times) {
				const cached = localStorage.getItem(CACHE_PREFIX + name)
				if (cached) times = JSON.parse(cached)
			}
			if (!times) {
				const buf = await fetch(src).then((r) => r.arrayBuffer())
				// Decoder-only context: decodeAudioData resamples to its rate, so
				// the analysis is deterministic whatever the file's native rate.
				this.decodeCtx ??= new OfflineAudioContext(1, 1, 44100)
				const audioBuf = await this.decodeCtx.decodeAudioData(buf)
				let samples = audioBuf.getChannelData(0)
				if (audioBuf.numberOfChannels > 1) {
					const right = audioBuf.getChannelData(1)
					const mixed = new Float32Array(samples.length)
					for (let i = 0; i < samples.length; i++) mixed[i] = (samples[i] + right[i]) * 0.5
					samples = mixed
				}
				times = (await this.analyze(samples, audioBuf.sampleRate)).map((t) => Math.round(t * 100) / 100)
				localStorage.setItem(CACHE_PREFIX + name, JSON.stringify(times))
			}
			if (this.src !== requested) return   // the track changed while analysing
			this.times = times
			this.lastCt = -10   // forces the cursor re-anchor on the next update
			this.state = 'ready'
			console.log(`[dropmap] ${name}: ${times.length} drop(s) @ ${times.map((t) => t.toFixed(1)).join(', ')}`)
		} catch (e) {
			console.warn(`[dropmap] ${name}: analysis failed- live detector stays on`, e)
			if (this.src === requested) this.state = 'fallback'
		}
	}

}
