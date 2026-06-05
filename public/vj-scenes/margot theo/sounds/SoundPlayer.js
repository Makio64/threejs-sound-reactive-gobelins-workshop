import { fetchTracksManifest } from '../assetBase.js'
import { trackIdFromUrl } from './TrackTuningConfig.js'
import PlayerControl from './PlayerControl.js'
import { captureChromeTabAudio } from './TabAudioCapture.js'

export default class SoundPlayer {

	constructor( analyzer ) {
		this.analyzer = analyzer
		this.tracks = []
		this.trackNames = []
		this.trackIndex = 0
		this.source = 'mp3'
		this.trackName = ''
		this.micStream = null
		this.tabStream = null

		this.audioEl = new Audio()
		this.audioEl.crossOrigin = 'anonymous'
		const savedVolume = parseFloat( localStorage.getItem( 'vj-volume' ) ?? '1' )
		this.audioEl.volume = Number.isFinite( savedVolume ) ? Math.min( 1, Math.max( 0, savedVolume ) ) : 1
		this.audioEl.addEventListener( 'ended', () => this.nextTrack() )

		window.addEventListener( 'keydown', this.onKey )
		this.start()
	}

	start = async () => {
		try {
			const { tracks } = await fetchTracksManifest()
			this.tracks = tracks
			this.trackNames = this.tracks.map( ( t ) =>
				decodeURIComponent( t.split( '/' ).pop().replace( /\.mp3$/i, '' ) )
			)
			const digeridooIndex = this.trackNames.findIndex( ( n ) => /digeridoo/i.test( n ) )
			this.trackIndex = digeridooIndex >= 0 ? digeridooIndex : 0
			await this.useTrack( this.tracks[ this.trackIndex ] )
		} catch ( e ) {
			console.warn( '[player] playlist MP3 indisponible — ajoute des .mp3 dans public/tracks/', e )
		}
		this.control = new PlayerControl( {
			fillBackground: 'linear-gradient(90deg, #8b2fc9, #ff2d6f)',
			fillShadow: '0 0 8px rgba(255, 45, 111, 0.35)',
			nameHoverColor: '#ff2d6f',
			idleOpacity: 0.92,
			getAudioEl: () => this.audioEl,
			getSource: () => this.source,
			getTrackName: () => this.trackName,
			onSkip: () => this.nextTrack(),
			onSeek: ( seconds ) => {
				this.audioEl.currentTime = seconds
				localStorage.setItem( 'vj-last-track-time', this.audioEl.currentTime )
			},
			onTogglePause: () => this.togglePause(),
			getIsPaused: () => this.source === 'mp3' && this.audioEl.paused,
			onVolumeChange: ( value ) => this.setVolume( value ),
			getVolume: () => this.audioEl.volume,
		} )
	}

	setVolume = ( value ) => {
		const volume = Math.min( 1, Math.max( 0, value ) )
		this.audioEl.volume = volume
		localStorage.setItem( 'vj-volume', String( volume ) )
	}

	togglePause = () => {
		if ( this.source !== 'mp3' ) return
		if ( this.audioEl.paused ) this.audioEl.play()?.catch( () => {} )
		else this.audioEl.pause()
	}

	stopLiveCapture = () => {
		if ( this.tabStream ) {
			this.tabStream.getTracks().forEach( ( t ) => t.stop() )
			this.tabStream = null
		}
	}

	useTrack = ( url, startTime = 0 ) => {
		this.stopLiveCapture()
		this.analyzer.connectMediaElement( this.audioEl )
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
			this.trackName = decodeURIComponent( url.split( '/' ).pop().replace( /\.mp3$/i, '' ) )
			this.analyzer.setTrackId( trackIdFromUrl( url ) )
		}
		return this.audioEl.play()?.catch( () => {} )
	}

	useMic = async () => {
		this.stopLiveCapture()
		if ( ! this.micStream ) {
			this.micStream = await navigator.mediaDevices.getUserMedia( {
				audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
			} )
		}
		this.audioEl.pause()
		this.analyzer.connectStream( this.micStream )
		this.source = 'mic'
		this.trackName = 'Micro'
		this.analyzer.setTrackId( '' )
	}

	/** Audio d’un onglet Chrome (YouTube, Spotify web, etc.). */
	useTabAudio = async () => {
		this.stopLiveCapture()
		const stream = await captureChromeTabAudio()

		this.tabStream = stream
		this.audioEl.pause()
		this.analyzer.connectStream( stream )
		this.source = 'tab'
		this.trackName = 'Onglet Chrome'

		const audioTrack = stream.getAudioTracks()[ 0 ]
		if ( audioTrack ) {
			audioTrack.onended = () => {
				if ( this.source !== 'tab' ) return
				if ( this.tracks.length ) this.useTrack( this.tracks[ this.trackIndex ] )
				else this.useMic().catch( () => {} )
			}
		}

		this.analyzer.setTrackId( '' )
	}

	/** @deprecated */
	useSystemAudio = () => this.useTabAudio()

	selectTrack = ( index ) => {
		if ( ! this.tracks.length ) return
		this.trackIndex =
			( ( index % this.tracks.length ) + this.tracks.length ) % this.tracks.length
		return this.useTrack( this.tracks[ this.trackIndex ] )
	}

	getTrackOptions = () => {
		const options = {
			'Onglet Chrome': '__tab__',
			Micro: '__mic__',
		}
		for ( const name of this.trackNames ) options[ name ] = name
		return options
	}

	getCurrentTrackKey = () => {
		if ( this.source === 'mic' ) return '__mic__'
		if ( this.source === 'tab' ) return '__tab__'
		return this.trackName || this.trackNames[ this.trackIndex ] || ''
	}

	nextTrack = () => {
		if ( ! this.tracks.length ) return
		this.selectTrack( this.trackIndex + 1 )
	}

	prevTrack = () => {
		if ( ! this.tracks.length ) return
		this.selectTrack( this.trackIndex - 1 )
	}

	onKey = ( e ) => {
		if ( document.activeElement && ( document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' ) ) return
		switch ( e.key ) {
			case ' ':
				e.preventDefault()
				this.togglePause()
				break
			case 'm':
				if ( this.source === 'mic' ) { if ( this.tracks.length ) this.useTrack( this.tracks[ this.trackIndex ] ) }
				else this.useMic()
				break
			case 't':
				this.useTabAudio().catch( ( err ) => console.warn( '[player] tab audio', err.message ) )
				break
			case '.':
			case '>':
				this.nextTrack()
				break
			case ',':
			case '<':
				this.prevTrack()
				break
		}
	}

	dispose = () => {
		if ( this.onKey ) window.removeEventListener( 'keydown', this.onKey )
		this.stopLiveCapture()
		if ( this.micStream ) {
			this.micStream.getTracks().forEach( ( t ) => t.stop() )
			this.micStream = null
		}
		this.audioEl.pause()
		this.audioEl.src = ''
		this.control?.dispose()
	}

}
