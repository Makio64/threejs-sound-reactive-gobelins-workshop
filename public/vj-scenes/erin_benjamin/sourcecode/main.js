import Analyzer from '/sounds/Analyzer.js'

import ErinBenjaminScene from './scene.js'

const audio = new Analyzer()
const scene = new ErinBenjaminScene(audio)

// Console access while iterating (harmless in the host- just two globals in our iframe).
window.vjAudio = audio
window.vjScene = scene

const PREFERRED_TRACK = /tame/i

// Redirect the SoundPlayer's first useTrack() call to our preferred track,
// so the default never starts playing in parallel.
function patchPreferredTrack() {
	// Embedded in the host the Analyzer runs in 'receive' mode: the host owns the
	// audio and audio.player will never exist- bail instead of polling forever.
	if (audio.mode !== 'live') return
	const player = audio.player
	if (!player) { setTimeout(patchPreferredTrack, 20); return }
	if (player._preferredPatched) return
	player._preferredPatched = true
	const original = player.useTrack
	player.useTrack = (url, startTime = 0) => {
		player.useTrack = original   // one-shot: subsequent calls are untouched
		if (player.tracks?.length) {
			const idx = player.trackNames.findIndex((n) => PREFERRED_TRACK.test(n))
			if (idx >= 0) {
				player.trackIndex = idx
				url = player.tracks[idx]
			}
		}
		return original(url, startTime)
	}
}

audio.onLoad(async () => {
	await scene.load()
	scene.init()
})
audio.onWarmup(() => scene.warmup())
audio.onPlay(() => {
	scene.play()
	patchPreferredTrack()
})
audio.onStop(() => scene.stop())
