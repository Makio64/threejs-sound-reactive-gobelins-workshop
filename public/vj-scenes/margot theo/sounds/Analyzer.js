import { paramsForTrack } from './TrackTuningConfig.js'
import { getFrequencyBands } from './frequencyBands.js'

export default class Analyzer {

	constructor( { mode = 'auto', fftSize = 512, autoTick = true, debug = false } = {} ) {
		this.debug = debug
		const embedded = window.self !== window.top
		this.mode = mode === 'auto' ? ( embedded ? 'receive' : 'live' ) : mode
		this.fftSize = fftSize
		this.autoTick = autoTick

		this.binCount = fftSize / 2
		this.volume = 0
		this.volumeSmooth = 0
		this.volumeByFrequency = new Float32Array( this.binCount )

		this.kick = 0
		this.kickEnergy = 0
		this.kickThreshold = 0.15
		this.kickTimer = 0

		this.kickHard = 0
		this.kickHardEnergy = 0
		this.kickHardThreshold = 0.3
		this.kickHardTimer = 0

		this.onCallbacks = { load: [], warmup: [], play: [], stop: [], audio: [] }
		this.queue = Promise.resolve()

		this.agc = 0.2
		this.activeTrackId = ''

		if ( this.mode === 'receive' ) this.initReceive()
		else this.initLive()
	}

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
				this.volumeByFrequency.set( d.volumeByFrequency )
			}
			this.emitAudio()
		} else if ( this.onCallbacks[ d.kind ] ) {
			this.fire( d.kind )
		}
	}

	initReceive = () => { window.addEventListener( 'message', this.onMessage ) }

	gesture = () => this.start()

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

		this.mediaNode = null
		this.mediaEl = null
		this.streamNode = null

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
			volumeByFrequency: this.volumeByFrequency,
		}

		if ( this.autoTick ) {
			for ( const ev of [ 'pointerdown', 'keydown', 'touchstart' ] ) window.addEventListener( ev, this.gesture )

			this.fire( 'load' )
			this.fire( 'warmup' )

			window.addEventListener( 'keydown', this.onKey )

			if ( this.debug ) this.toggleDebug()

			this.start()
			this.last = 0
			this.raf = requestAnimationFrame( this.tick )
		}
	}

	start = async () => {
		if ( this.started ) return
		if ( this.ctx.state !== 'running' ) { try { await this.ctx.resume() } catch {} }
		if ( this.ctx.state !== 'running' ) return
		this.started = true
		for ( const ev of [ 'pointerdown', 'keydown', 'touchstart' ] ) window.removeEventListener( ev, this.gesture )

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

	connectMediaElement = ( audioEl ) => {
		if ( this.mediaEl !== audioEl ) {
			this.mediaNode = this.ctx.createMediaElementSource( audioEl )
			this.mediaEl = audioEl
		}
		this.disconnectSources()
		this.mediaNode.connect( this.analyser )
		this.mediaNode.connect( this.ctx.destination )
	}

	connectStream = ( stream ) => {
		this.disconnectSources()
		if ( this.streamNode ) {
			try { this.streamNode.disconnect() } catch {}
			this.streamNode = null
		}
		this.streamNode = this.ctx.createMediaStreamSource( stream )
		this.streamNode.connect( this.analyser )
	}

	/** @deprecated alias */
	connectMic = ( stream ) => this.connectStream( stream )

	/** Audio d’un autre onglet Chrome (getDisplayMedia). */
	captureTabAudio = async () => {
		await this.start()
		const player = this.getPlayer()
		if ( ! player?.useTabAudio ) {
			throw new Error( 'Lecteur audio non prêt.' )
		}
		return player.useTabAudio()
	}

	disconnectSources = () => {
		try { this.mediaNode?.disconnect() } catch {}
		try { this.streamNode?.disconnect() } catch {}
	}

	setTrackId = ( id ) => { this.activeTrackId = id ?? '' }

	getPlayer = () => this.player ?? null

	/** Graves / médiums / aigus (0..1), moyenne par bande du spectre. */
	getFrequencyBands = () => getFrequencyBands( this.volumeByFrequency )

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
		this.agc = Math.max( rms, this.agc * 0.999 )

		const params = paramsForTrack( this.activeTrackId )
		let norm = ( rms / Math.max( this.agc, 0.05 ) ) * params.volumeMult
		// Silence / bruit de fond : évite que l'AGC gonfle artificiellement vol & smooth.
		if ( rms < 0.028 ) norm *= rms / 0.028
		this.volume = Math.min( norm, 1 )
		const rate = this.volume > this.volumeSmooth ? 0.5 : 0.08
		this.volumeSmooth += ( this.volume - this.volumeSmooth ) * ( 1 - Math.pow( 1 - rate, dt * 120 ) )

		let low = 0
		for ( let i = params.startBin; i < params.endBin; i ++ ) low += this.freqBytes[ i ]
		low /= ( ( params.endBin - params.startBin ) * 255 )

		const beatVolumeMin = params.beatVolumeMin ?? 0.1
		const allowBeat = this.volumeSmooth >= beatVolumeMin

		this.kickTimer += dt
		if ( allowBeat && this.kickTimer >= params.beatHold && low > this.kickThreshold && low > params.beatMin ) {
			this.kick = 1
			this.kickThreshold = low * params.beatMult
			this.kickTimer = 0
		} else if ( this.kickTimer > params.beatHold ) {
			this.kickThreshold *= Math.pow( params.beatDecay, dt * 60 )
			this.kickThreshold = Math.max( this.kickThreshold, params.beatMin )
		}
		this.kick = Math.max( 0, this.kick - dt * ( allowBeat ? 6 : 14 ) )
		this.kickEnergy = low

		this.kickHardTimer += dt
		if ( allowBeat && this.kickHardTimer >= params.beat2Hold && low > this.kickHardThreshold && low > params.beat2Min ) {
			this.kickHard = 1
			this.kickHardThreshold = low * params.beat2Mult
			this.kickHardTimer = 0
		} else if ( this.kickHardTimer > params.beat2Hold ) {
			this.kickHardThreshold *= Math.pow( params.beat2Decay, dt * 60 )
			this.kickHardThreshold = Math.max( this.kickHardThreshold, params.beat2Min )
		}
		this.kickHard = Math.max( 0, this.kickHard - dt * ( allowBeat ? 2.5 : 10 ) )
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
