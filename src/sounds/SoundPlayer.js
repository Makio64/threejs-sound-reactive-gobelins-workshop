// --- sounds/SoundPlayer -------------------------------------------------------
// "Choose & play the music" for a scene opened on its OWN (not embedded in the
// host). It owns the playlist + the <audio> element + the keyboard shortcuts and
// feeds whatever is playing into the Analyzer to be analysed. The Analyzer itself
// stays pure: it just receives a source and produces signals.
//
// You never new this directly- Analyzer lazy-loads it in standalone (live) mode,
// the same way it lazy-loads AnalyzerDebug. So a scene is still just:
//   const audio = new Analyzer()
//
// Keyboard (standalone only):  m = mic/tracks · . / , = next / prev track
// --------------------------------------------------------------------------------

import { trackIdFromUrl } from './TrackTuningConfig.js'
import PlayerControl from './PlayerControl.js'

export default class SoundPlayer {

	constructor( analyzer ) {
		this.analyzer = analyzer
		this.tracks = []
		this.trackNames = []
		this.trackIndex = 0
		this.source = 'mp3'        // 'mic' | 'mp3'
		this.trackName = ''
		this.micStream = null

		this.audioEl = new Audio()
		this.audioEl.crossOrigin = 'anonymous'
		this.audioEl.addEventListener( 'ended', () => this.nextTrack() )

		window.addEventListener( 'keydown', this.onKey )
		this.start()
	}

	start = async () => {
		try {
			const response = await fetch( '/tracks/tracks.json' )
			this.tracks = await response.json()
			this.trackNames = this.tracks.map( ( t ) => decodeURIComponent( t.split( '/' ).pop().replace( /\.mp3$/i, '' ) ) )
			this.trackIndex = Math.max( 0, this.trackNames.findIndex( ( n ) => /digeridoo/i.test( n ) ) )   // Digeridoo plays first
			if ( this.tracks.length ) this.useTrack( this.tracks[ this.trackIndex ] )
			else await this.useMic()
		} catch ( e ) {
			console.warn( '[player] failed to fetch tracks.json, using mic', e )
			await this.useMic()
		}
		this.control = new PlayerControl( {
			getAudioEl: () => this.audioEl,
			getSource: () => this.source,
			getTrackName: () => this.trackName,
			onSkip: () => this.nextTrack(),
			onSeek: ( seconds ) => {
				this.audioEl.currentTime = seconds
				localStorage.setItem( 'vj-last-track-time', this.audioEl.currentTime )
			},
		} )
	}

	useTrack = ( url, startTime = 0 ) => {
		this.analyzer.connectMediaElement( this.audioEl )   // route this element into the analyser
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
			this.analyzer.setTrackId( trackIdFromUrl( url ) )   // pick the per-track tuning
		}
		return this.audioEl.play()?.catch( () => {} )
	}

	useMic = async () => {
		if ( ! this.micStream ) {
			this.micStream = await navigator.mediaDevices.getUserMedia( { audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } } )
		}
		this.audioEl.pause()
		this.analyzer.connectMic( this.micStream )
		this.source = 'mic'
		this.analyzer.setTrackId( '' )
	}

	nextTrack = () => {
		if ( ! this.tracks.length ) return
		this.trackIndex = ( this.trackIndex + 1 ) % this.tracks.length
		this.useTrack( this.tracks[ this.trackIndex ] )
	}

	prevTrack = () => {
		if ( ! this.tracks.length ) return
		this.trackIndex = ( this.trackIndex - 1 + this.tracks.length ) % this.tracks.length
		this.useTrack( this.tracks[ this.trackIndex ] )
	}

	onKey = ( e ) => {
		if ( document.activeElement && ( document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' ) ) return
		switch ( e.key ) {
			case 'm':
				if ( this.source === 'mic' ) { if ( this.tracks.length ) this.useTrack( this.tracks[ this.trackIndex ] ) }
				else this.useMic()
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
		this.audioEl.pause()
		this.audioEl.src = ''
		this.control?.dispose()
	}

}
