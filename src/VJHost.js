import { localScenes } from 'virtual:vj-scenes'
import EyeTransition from './EyeTransition.js'
import { trackIdFromUrl } from './sounds/TrackTuningConfig.js'

// ════════════════════════════════════════════════════════════════════════════════
//  VJHost- the VJ host, as one singleton.
//   • cycles through participant scenes (each an <iframe>) in an infinite loop
//   • transitions between them (iris closes to black → opens)
//   • runs one live Analyzer and broadcasts its 4 signals to the on-screen scene
//   • drives each scene's load() / warmup() / play() / stop() lifecycle
//  The audio brain lives in src/sounds/Analyzer.js (served to scenes at
//  /sounds/Analyzer.js)- the very same module each scene imports- so a scene
//  runs standalone or receives this host's broadcast unchanged.
// ════════════════════════════════════════════════════════════════════════════════

const SCENE_SECONDS = 30       // time on screen before auto-advancing
const MAX_LIVE = 4             // how many iframes we keep alive (LRU)

class VJHost {

	constructor() {
		this.scenes = []
		this.tracks = []
		this.trackNames = []
		this.trackIndex = 0
		this.layers = new Map()
		this.clock = 0
		this.current = null
		this.incoming = null
		this.eyeTransition = new EyeTransition( this )
		this.index = 0
		this.elapsed = 0
		this.paused = false
		this.audio = null
		this.debug = null
		this.onTrack = null   // host UI subscribes to onTrack
		this.audioEl = null   // host owns the music; the analyzer just analyses it
		this.micStream = null
		this.source = null

		this.sceneSeconds = SCENE_SECONDS
		this.onScenesChanged = null
		this.onConfigChanged = null
	}

	// -- boot: discover scenes + tracks, create the live analyzer (host drives its loop) --
	async init() {
		const { default: Analyzer } = await import( './sounds/Analyzer.js' )
		this.AnalyzerDebug = ( await import( './sounds/AnalyzerDebug.js' ) ).default
		this.audio = new Analyzer( { mode: 'live', autoTick: false } )

		// the host owns the <audio> element (the analyzer only analyses what we connect)
		this.audioEl = new Audio()
		this.audioEl.crossOrigin = 'anonymous'
		this.audioEl.addEventListener( 'ended', () => this.nextTrack() )

		try {
			const response = await fetch( '/tracks/tracks.json' )
			this.tracks = await response.json()
			this.trackNames = this.tracks.map( ( t ) => decodeURIComponent( t.split( '/' ).pop().replace( /\.mp3$/i, '' ) ) )
		} catch ( e ) {
			console.error( '[show] failed to fetch tracks.json', e )
			this.tracks = []
			this.trackNames = []
		}

		const savedTrackIndex = localStorage.getItem( 'vj-last-track-index' )
		if ( savedTrackIndex !== null ) {
			const idx = parseInt( savedTrackIndex, 10 )
			if ( idx >= 0 && idx < this.tracks.length ) {
				this.trackIndex = idx
			} else {
				this.trackIndex = Math.max( 0, this.trackNames.findIndex( ( n ) => /digeridoo/i.test( n ) ) )
			}
		} else {
			this.trackIndex = Math.max( 0, this.trackNames.findIndex( ( n ) => /digeridoo/i.test( n ) ) )   // Digeridoo plays first
		}

		// show order: local folders (_warmup first, template hidden), then custom localStorage URLs
		const saved = localStorage.getItem( 'vj-custom-scenes' )
		const customScenes = saved ? JSON.parse( saved ) : []

		this.scenes = [
			...localScenes
				.filter( ( e ) => e.id !== 'template' )
				.sort( ( a, b ) => a.id === '_warmup' ? - 1 : b.id === '_warmup' ? 1 : a.id.localeCompare( b.id ) ),
			...customScenes
		]

		this.stage = document.body.appendChild( document.createElement( 'div' ) )
		this.stage.className = 'vj-stage'
		return this
	}

	// -- start (after the click unlocks audio) + the loop ------------------------
	async start() {
		try { await this.audio.ctx.resume() } catch {}
		if ( this.tracks.length ) {
			const savedTime = parseFloat( localStorage.getItem( 'vj-last-track-time' ) || 0 )
			this.playTrack( this.tracks[ this.trackIndex ], savedTime )
		} else {
			this.playMic()
		}
		this.notifyTrack()
		this.setInitial( this.scenes[ 0 ] )
		this.preloadNext()
		this.addKeys()
		this.toggleDebug() // Show debug overlay by default

		window.addEventListener( 'beforeunload', () => {
			if ( this.tracks.length && this.source === 'mp3' ) {
				localStorage.setItem( 'vj-last-track-time', this.audioEl.currentTime )
				localStorage.setItem( 'vj-last-track-index', this.trackIndex )
			}
		} )

		let last = performance.now()
		const loop = ( now ) => {
			const dt = Math.min( 0.05, ( now - last ) / 1000 )
			last = now
			this.update( dt )
			this.raf = requestAnimationFrame( loop )
		}
		this.raf = requestAnimationFrame( loop )
	}

	get transitioning() {
		return this.eyeTransition.active
	}

	update( dt ) {
		this.audio.update( dt )
		this.sendAudio( this.current )
		if ( this.incoming ) this.sendAudio( this.incoming )
		this.eyeTransition.update( dt )
		if ( ! this.paused && ! this.transitioning ) {
			this.elapsed += dt
			if ( this.elapsed >= this.sceneSeconds ) this.go( this.index + 1 )
		}

		// Throttled save of the track time
		if ( this.tracks.length && this.source === 'mp3' ) {
			this.saveTimeTimer = ( this.saveTimeTimer || 0 ) + dt
			if ( this.saveTimeTimer >= 1.0 ) {
				this.saveTimeTimer = 0
				localStorage.setItem( 'vj-last-track-time', this.audioEl.currentTime )
			}
		}
	}

	// -- playback (host owns the playlist + <audio> element; the analyzer just
	//    analyses whatever source we connect) --------------------------------------
	playTrack( url, startTime = 0 ) {
		this.audio.connectMediaElement( this.audioEl )   // route this element into the analyser
		this.source = 'mp3'
		if ( url ) {
			this.audioEl.src = url
			if ( startTime > 0 ) {
				const onLoadedMetadata = () => {
					this.audioEl.currentTime = startTime
					this.audioEl.removeEventListener( 'loadedmetadata', onLoadedMetadata )
				}
				this.audioEl.addEventListener( 'loadedmetadata', onLoadedMetadata )
			}
			this.audio.setTrackId( trackIdFromUrl( url ) )   // pick the per-track tuning
		}
		this.audioEl.play()?.catch( () => {} )
	}
	async playMic() {
		if ( ! this.micStream ) this.micStream = await navigator.mediaDevices.getUserMedia( { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } } )
		this.audioEl.pause()
		this.audio.connectMic( this.micStream )
		this.source = 'mic'
		this.audio.setTrackId( '' )
	}

	// -- tracks (host owns the playlist; playback goes through playTrack/playMic) --
	nextTrack() {
		if ( ! this.tracks.length ) return
		this.trackIndex = ( this.trackIndex + 1 ) % this.tracks.length
		localStorage.setItem( 'vj-last-track-index', this.trackIndex )
		localStorage.setItem( 'vj-last-track-time', 0 )
		this.playTrack( this.tracks[ this.trackIndex ] )
		this.notifyTrack()
	}
	useTrack() {
		if ( this.tracks.length ) {
			this.playTrack( this.tracks[ this.trackIndex ] )
			this.notifyTrack()
		}
	}
	notifyTrack() { if ( this.onTrack && this.tracks.length ) this.onTrack( this.trackNames[ this.trackIndex ] ) }

	// -- broadcast to the on-screen iframe(s) ------------------------------------
	send( L, kind ) { if ( L?.loaded ) try { L.iframe.contentWindow?.postMessage( { type: 'vj', kind }, '*' ) } catch {} }
	sendAudio( L ) { if ( L?.loaded ) try { L.iframe.contentWindow?.postMessage( this.audio.payload, '*' ) } catch {} }

	// -- layers- each scene is an <iframe>; keep a few alive (LRU) ---------------
	makeLayer( scene ) {
		const f = document.createElement( 'iframe' )
		f.title = scene.id
		f.setAttribute( 'allow', 'autoplay; fullscreen; microphone; xr-spatial-tracking' )
		f.className = 'vj-layer'
		const L = { id: scene.id, url: scene.url, iframe: f, loaded: false, timedOut: false, shown: false, used: ++ this.clock }

		L.timeoutId = setTimeout( () => {
			if ( ! L.loaded ) {
				L.timedOut = true
				if ( this.onScenesChanged ) this.onScenesChanged()
			}
		}, 5000 )

		f.addEventListener( 'load', () => {
			clearTimeout( L.timeoutId )
			L.loaded = true
			L.timedOut = false
			this.send( L, 'load' )
			this.send( L, 'warmup' )
			this.send( L, L.shown ? 'play' : 'stop' )
			if ( this.onScenesChanged ) this.onScenesChanged()
		} )
		f.src = scene.url
		this.stage.appendChild( f )
		this.layers.set( scene.id, L )
		this.evict()
		if ( this.onScenesChanged ) this.onScenesChanged()
		return L
	}
	ensure( scene ) { // preload = ensure
		let L = this.layers.get( scene.id )
		if ( ! L ) L = this.makeLayer( scene )
		L.used = ++ this.clock
		return L
	}
	evict() {
		if ( this.layers.size <= MAX_LIVE ) return
		const keep = new Set( [ this.current?.id, this.incoming?.id ] )
		for ( const L of [ ...this.layers.values() ].filter( ( l ) => ! keep.has( l.id ) ).sort( ( a, b ) => a.used - b.used ) ) {
			if ( this.layers.size <= MAX_LIVE ) break
			clearTimeout( L.timeoutId )
			L.iframe.remove()
			this.layers.delete( L.id )
		}
		if ( this.onScenesChanged ) this.onScenesChanged()
	}
	activate( L ) {
		L.shown = true
		L.iframe.style.display = 'block'
		this.send( L, 'play' )
		if ( this.onScenesChanged ) this.onScenesChanged()
	}
	deactivate( L ) {
		L.shown = false
		L.iframe.style.display = 'none'
		this.send( L, 'stop' )
		if ( this.onScenesChanged ) this.onScenesChanged()
	}

	// -- custom scenes management ------------------------------------------------
	addScene( url, name = '' ) {
		if ( ! url ) return
		let cleanUrl = url.trim()
		if ( ! /^https?:\/\//i.test( cleanUrl ) ) {
			cleanUrl = 'https://' + cleanUrl
		}
		try {
			const parsed = new URL( cleanUrl )
			const id = name.trim() || parsed.hostname.replace( /^www\./i, '' )
			const scene = { id: `custom-${ Date.now() }`, label: id, url: cleanUrl, kind: 'custom' }
			
			this.scenes.push( scene )
			this.saveCustomScenes()
			this.preloadNext()
			if ( this.onScenesChanged ) this.onScenesChanged()
			return scene
		} catch ( e ) {
			console.error( 'Invalid URL', e )
		}
	}

	deleteScene( id ) {
		const idx = this.scenes.findIndex( ( s ) => s.id === id )
		if ( idx === - 1 ) return
		
		// If we are currently playing or incoming this scene, switch to another first
		if ( this.current?.id === id || this.incoming?.id === id ) {
			const nextIdx = ( idx + 1 ) % this.scenes.length
			this.go( nextIdx )
		}
		
		this.scenes.splice( idx, 1 )
		
		// Remove iframe layer if exists
		const L = this.layers.get( id )
		if ( L ) {
			clearTimeout( L.timeoutId )
			L.iframe.remove()
			this.layers.delete( id )
		}
		
		// Adjust current index if it shifted
		if ( this.index >= this.scenes.length ) {
			this.index = Math.max( 0, this.scenes.length - 1 )
		} else if ( idx < this.index ) {
			this.index --
		}
		
		this.saveCustomScenes()
		this.preloadNext()
		if ( this.onScenesChanged ) this.onScenesChanged()
	}

	saveCustomScenes() {
		const custom = this.scenes.filter( ( s ) => s.kind === 'custom' )
		localStorage.setItem( 'vj-custom-scenes', JSON.stringify( custom ) )
	}
	setInitial( scene ) {
		const L = this.ensure( scene )
		this.current = L
		L.iframe.style.zIndex = '1'
		this.eyeTransition.reset( L.iframe )
		this.activate( L )
	}
	transitionTo( scene ) {
		if ( this.transitioning || scene.id === this.current?.id ) return false
		this.incoming = this.ensure( scene )
		return this.eyeTransition.start( this.current, this.incoming )
	}

	// -- sequencer- the infinite loop + manual control --------------------------
	preloadNext() { if ( this.scenes.length > 1 ) this.ensure( this.scenes[ ( this.index + 1 ) % this.scenes.length ] ) }
	go( i ) {
		const n = this.scenes.length, idx = ( ( i % n ) + n ) % n
		if ( idx === this.index ) return
		if ( this.transitionTo( this.scenes[ idx ] ) ) {
			this.index = idx
			this.elapsed = 0
			this.preloadNext()
		}
	}

	toggleDebug() {
		if ( ! this.debug ) this.debug = new this.AnalyzerDebug( this.audio )
		else this.debug.toggle()
	}

	addKeys() {
		let numBuf = ''
		addEventListener( 'keydown', ( e ) => {
			if ( document.activeElement && ( document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' ) ) {
				return
			}
			switch ( e.key ) {
				case ' ':
					e.preventDefault()
					this.paused = ! this.paused
					if ( this.onConfigChanged ) this.onConfigChanged()
					break
				case 'm':
					this.source === 'mic' ? this.useTrack() : this.playMic()
					if ( this.onConfigChanged ) this.onConfigChanged()
					break
				case 'd':
					this.toggleDebug()
					break
				case 'ArrowLeft':
					e.preventDefault()
					this.go( this.index - 1 )
					break
				case 'ArrowRight':
					e.preventDefault()
					this.go( this.index + 1 )
					break
				case 'Enter':
					if ( numBuf ) {
						this.go( parseInt( numBuf, 10 ) )
						numBuf = ''
					}
					break
				default:
					if ( /^[0-9]$/.test( e.key ) ) numBuf += e.key
			}
		} )
	}

}

export default new VJHost()
