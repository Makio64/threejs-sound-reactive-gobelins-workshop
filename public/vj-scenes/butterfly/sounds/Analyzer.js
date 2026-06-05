// --- sounds/Analyzer ----------------------------------------------------------
// Audio analysis only - reads a source and outputs per-frame signals for visuals.
// Auto-detected mode: 'receive' (embedded in VJ host iframe, reads broadcast
// signals) or 'live' (standalone - own AudioContext + lazy-loaded SoundPlayer).
//
// Read every frame (all 0..1):  volume · volumeSmooth · kick · kickHard
//                               volumeByFrequency (Float32Array per bin)
// Lifecycle hooks:  onLoad · onWarmup · onPlay · onStop · onAudio
//
//   const audio = new Analyzer()
// --------------------------------------------------------------------------------

// Per-track tuning (the knobs a human edits by ear) lives in its own config module.
import { paramsForTrack } from './TrackTuningConfig.js'

export default class Analyzer {

	// mode 'auto'|'live'|'receive' · autoTick: live mode self-runs (rAF + SoundPlayer)
	constructor( { mode = 'auto', fftSize = 512, autoTick = true } = {} ) {
		const embedded = window.self !== window.top
		this.mode = mode === 'auto' ? ( embedded ? 'receive' : 'live' ) : mode
		this.fftSize = fftSize
		this.autoTick = autoTick

		// the signals- same model whichever mode we're in
		this.binCount = fftSize / 2
		this.volume = 0
		this.volumeSmooth = 0
		this.volumeByFrequency = new Float32Array( this.binCount )

		// soft kick detector
		this.kick = 0                  // decays after each hit (read this for beats)
		this.kickEnergy = 0            // raw band energy feeding the detector (debug)
		this.kickThreshold = 0.15      // adaptive trigger level (debug)
		this.kickTimer = 0             // seconds since last hit (refractory)

		// hard kick detector (stricter- fires on the strong beats only)
		this.kickHard = 0
		this.kickHardEnergy = 0
		this.kickHardThreshold = 0.3
		this.kickHardTimer = 0

		// lifecycle hooks, fired in order (load before warmup before play), async-aware
		this.onCallbacks = { load: [], warmup: [], play: [], stop: [], audio: [] }
		this.queue = Promise.resolve()

		// analysis state (live)
		this.agc = 0.2
		this.activeTrackId = ''        // which TRACK_PARAMS to use- set via setTrackId()

		if ( this.mode === 'receive' ) this.initReceive()
		else this.initLive()
	}

	// -- lifecycle ---------------------------------------------------------------
	onLoad = ( f ) => {
		this.onCallbacks.load.push( f )
		return f
	}
	onWarmup = ( f ) => {
		this.onCallbacks.warmup.push( f )
		return f
	}
	onPlay = ( f ) => {
		this.onCallbacks.play.push( f )
		return f
	}
	onStop = ( f ) => {
		this.onCallbacks.stop.push( f )
		return f
	}
	onAudio = ( f ) => {
		this.onCallbacks.audio.push( f )
		return f
	}

	fire = ( name ) => {
		this.queue = this.queue
			.then( () => Promise.all( this.onCallbacks[ name ].map( ( f ) => f() ) ) )
			.catch( ( e ) => console.error( '[analyzer] ' + name, e ) )
	}
	emitAudio = () => {
		for ( let i = 0; i < this.onCallbacks.audio.length; i ++ ) this.onCallbacks.audio[ i ]( this )
	}

	// -- RECEIVE: the master broadcasts, we just listen --------------------------
	onMessage = ( e ) => {
		const d = e.data
		if ( d?.type !== 'vj' ) return
		if ( d.kind === 'audio' ) {
			this.volume = d.volume
			this.volumeSmooth = d.volumeSmooth
			this.kick = d.kick
			this.kickEnergy = d.kickEnergy ?? 0
			this.kickThreshold = d.kickThreshold ?? 0
			this.kickHard = d.kickHard ?? 0
			this.kickHardEnergy = d.kickHardEnergy ?? 0
			this.kickHardThreshold = d.kickHardThreshold ?? 0
			if ( d.volumeByFrequency ) {
				// Copy in-place to preserve reference for cached student variables
				this.volumeByFrequency.set( d.volumeByFrequency )
			}
			this.emitAudio()
		} else if ( this.onCallbacks[ d.kind ] ) {
			this.fire( d.kind )
		}
	}

	initReceive = () => { window.addEventListener( 'message', this.onMessage ) }

	// -- LIVE: own the audio graph and analyse whatever source is connected -------
	gesture = () => this.start()   // unlock the AudioContext on the first user gesture

	// 'd' toggles the debug overlay; the player owns the music keys (m / . / ,)
	onKey = ( e ) => {
		if ( document.activeElement && ( document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' ) ) return
		if ( e.key === 'd' ) this.toggleDebug()
	}

	initLive = () => {
		this.ctx = new ( window.AudioContext || window.webkitAudioContext )()
		this.analyser = this.ctx.createAnalyser()
		this.analyser.fftSize = this.fftSize
		this.binCount = this.analyser.frequencyBinCount
		this.volumeByFrequency = new Float32Array( this.binCount )
		this.freqBytes = new Uint8Array( this.binCount )
		this.waveBytes = new Uint8Array( this.binCount )

		// source nodes are created lazily by connectMediaElement()/connectMic()
		this.mediaNode = null
		this.mediaEl = null
		this.micNode = null

		// payload the host broadcasts to its child iframes (shares the freq array, no copy)
		this.payload = {
			type: 'vj',
			kind: 'audio',
			volume: 0,
			volumeSmooth: 0,
			kick: 0,
			kickEnergy: 0,
			kickThreshold: 0,
			kickHard: 0,
			kickHardEnergy: 0,
			kickHardThreshold: 0,
			volumeByFrequency: this.volumeByFrequency
		}

		// standalone scenes drive themselves: unlock on first gesture, then run a loop
		if ( this.autoTick ) {
			for ( const ev of [ 'pointerdown', 'keydown', 'touchstart' ] ) window.addEventListener( ev, this.gesture )

			// Fire load & warmup immediately so scene compiles and draws static frame on load
			this.fire( 'load' )
			this.fire( 'warmup' )

			window.addEventListener( 'keydown', this.onKey )

			this.toggleDebug()   // Display by default the sound debug overlay

			this.start()        // in case the context is already running
			this.last = 0
			this.raf = requestAnimationFrame( this.tick )
		}
	}

	start = async () => {
		if ( this.started ) return
		if ( this.ctx.state !== 'running' ) { try { await this.ctx.resume() } catch {} }
		if ( this.ctx.state !== 'running' ) return       // still locked- wait for a gesture
		this.started = true
		for ( const ev of [ 'pointerdown', 'keydown', 'touchstart' ] ) window.removeEventListener( ev, this.gesture )

		// standalone convenience: hand off "choose & play the music" to the player
		// (lazy import, exactly like toggleDebug() loads AnalyzerDebug)
		if ( this.autoTick && ! this.player ) {
			try {
				const { default: SoundPlayer } = await import( './SoundPlayer.js' )
				this.player = new SoundPlayer( this )
			} catch ( err ) {
				console.error( '[analyzer] failed to load SoundPlayer', err )
			}
		}
		this.fire( 'play' )
	}

	// -- source connection- the player/host owns the <audio> element & mic; we own
	//    the graph nodes (they must be created from THIS AudioContext) -------------
	connectMediaElement = ( audioEl ) => {
		if ( this.mediaEl !== audioEl ) {
			this.mediaNode = this.ctx.createMediaElementSource( audioEl )   // once per element
			this.mediaEl = audioEl
		}
		this.disconnectSources()
		this.mediaNode.connect( this.analyser )
		this.mediaNode.connect( this.ctx.destination )   // audible
	}

	connectMic = ( stream ) => {
		if ( ! this.micNode ) this.micNode = this.ctx.createMediaStreamSource( stream )
		this.disconnectSources()
		this.micNode.connect( this.analyser )            // not routed to destination- no feedback
	}

	disconnectSources = () => {
		try { this.mediaNode?.disconnect() } catch {}
		try { this.micNode?.disconnect() } catch {}
	}

	setTrackId = ( id ) => { this.activeTrackId = id ?? '' }

	toggleDebug = async () => {
		if ( ! this.debugOverlay ) {
			try {
				const { default: AnalyzerDebug } = await import( './AnalyzerDebug.js' )
				this.debugOverlay = new AnalyzerDebug( this )
			} catch ( err ) {
				console.error( 'Failed to load AnalyzerDebug', err )
			}
		} else {
			this.debugOverlay.toggle()
		}
	}

	tick = ( now = 0 ) => {
		if ( this.disposed ) return
		const dt = this.last ? Math.min( 0.05, ( now - this.last ) / 1000 ) : 0
		this.last = now
		if ( this.started ) this.update( dt )
		this.raf = requestAnimationFrame( this.tick )
	}

	// -- the analysis- instant volume (RMS+AGC), smoothed, and kick detection ----
	update = ( dt ) => {
		if ( this.mode !== 'live' || ! this.analyser ) return
		const BINS = this.binCount
		this.analyser.getByteFrequencyData( this.freqBytes )
		this.analyser.getByteTimeDomainData( this.waveBytes )
		for ( let i = 0; i < BINS; i ++ ) this.volumeByFrequency[ i ] = this.freqBytes[ i ] / 255
		let s = 0
		for ( let i = 0; i < BINS; i ++ ) {
			const v = ( this.waveBytes[ i ] - 128 ) / 128
			s += v * v
		}
		const rms = Math.sqrt( s / BINS )
		this.agc = Math.max( rms, this.agc * 0.999 )                                  // auto-gain: quiet + loud both reach ~1

		const params = paramsForTrack( this.activeTrackId )
		this.volume = Math.min( ( rms / Math.max( this.agc, 0.05 ) ) * params.volumeMult, 1 )
		// attack fast (0.5), release slow (0.08); dt*120 makes the rate frame-rate independent
		const rate = this.volume > this.volumeSmooth ? 0.5 : 0.08
		this.volumeSmooth += ( this.volume - this.volumeSmooth ) * ( 1 - Math.pow( 1 - rate, dt * 120 ) )

		// average energy over [startBin, endBin)- the per-track band (≈86 Hz/bin, see TRACK_PARAMS)
		let low = 0
		for ( let i = params.startBin; i < params.endBin; i ++ ) low += this.freqBytes[ i ]
		low /= ( ( params.endBin - params.startBin ) * 255 )

		// soft kick: fire when the band energy crosses the adaptive threshold (after the hold),
		// then raise the threshold (beatMult) and decay it back toward beatMin while idle.
		this.kickTimer += dt
		if ( this.kickTimer >= params.beatHold && low > this.kickThreshold && low > params.beatMin ) {
			this.kick = 1
			this.kickThreshold = low * params.beatMult
			this.kickTimer = 0
		} else if ( this.kickTimer > params.beatHold ) {
			this.kickThreshold *= Math.pow( params.beatDecay, dt * 60 )   // dt*60 → frame-rate independent
			this.kickThreshold = Math.max( this.kickThreshold, params.beatMin )
		}
		this.kick = Math.max( 0, this.kick - dt * 6 )   // visible spike that fades over ~1/6 s
		this.kickEnergy = low

		// hard kick: same shape, stricter thresholds → only the strong beats
		this.kickHardTimer += dt
		if ( this.kickHardTimer >= params.beat2Hold && low > this.kickHardThreshold && low > params.beat2Min ) {
			this.kickHard = 1
			this.kickHardThreshold = low * params.beat2Mult
			this.kickHardTimer = 0
		} else if ( this.kickHardTimer > params.beat2Hold ) {
			this.kickHardThreshold *= Math.pow( params.beat2Decay, dt * 60 )
			this.kickHardThreshold = Math.max( this.kickHardThreshold, params.beat2Min )
		}
		this.kickHard = Math.max( 0, this.kickHard - dt * 2.5 )   // fades slower than the soft kick
		this.kickHardEnergy = low

		const p = this.payload
		p.volume = this.volume
		p.volumeSmooth = this.volumeSmooth
		p.kick = this.kick
		p.kickEnergy = this.kickEnergy
		p.kickThreshold = this.kickThreshold
		p.kickHard = this.kickHard
		p.kickHardEnergy = this.kickHardEnergy
		p.kickHardThreshold = this.kickHardThreshold
		this.emitAudio()
	}

	dispose = () => {
		this.disposed = true
		if ( this.raf ) cancelAnimationFrame( this.raf )
		if ( this.onMessage ) window.removeEventListener( 'message', this.onMessage )
		if ( this.onKey ) window.removeEventListener( 'keydown', this.onKey )
		if ( this.gesture ) for ( const ev of [ 'pointerdown', 'keydown', 'touchstart' ] ) window.removeEventListener( ev, this.gesture )
		this.player?.dispose()
		this.disconnectSources()
		if ( this.ctx ) try { this.ctx.close() } catch {}
	}

}
