import controlHtml from './ui/player-control.html.js'
import controlCss from './ui/player-control.css.js'

export default class PlayerControl {

	constructor( {
		getAudioEl,
		getSource,
		getTrackName,
		onSkip,
		onSeek,
		onTogglePause,
		getIsPaused,
		onVolumeChange,
		getVolume,
		fillBackground = 'linear-gradient(90deg, #00ff66, #00ffcc)',
		fillShadow = '0 0 6px rgba(0, 255, 102, 0.5)',
		nameHoverColor = '#00ff66',
		idleOpacity = 1,
	} = {} ) {
		this.getAudioEl = getAudioEl
		this.getSource = getSource
		this.getTrackName = getTrackName
		this.onSkip = onSkip
		this.onSeek = onSeek
		this.onTogglePause = onTogglePause
		this.getIsPaused = getIsPaused
		this.onVolumeChange = onVolumeChange
		this.getVolume = getVolume

		this.disposed = false
		this.dragging = false
		this.hovering = false
		this.hoverPct = 0
		this.dragPct = 0

		if ( document.querySelector( '.vj-track-widget' ) ) return

		this.style = document.createElement( 'style' )
		this.style.textContent = controlCss( { fillBackground, fillShadow, nameHoverColor, idleOpacity } )
		document.head.appendChild( this.style )

		const widget = this.widget = document.createElement( 'div' )
		widget.className = 'vj-track-widget'
		widget.innerHTML = controlHtml
		document.body.appendChild( widget )

		this.container = widget.querySelector( '.vj-track-progress-container' )
		this.nameEl = widget.querySelector( '.vj-track-name' )
		this.timeEl = widget.querySelector( '.vj-track-time' )
		this.fillEl = widget.querySelector( '.vj-track-progress-fill' )
		this.hoverEl = widget.querySelector( '.vj-track-progress-hover' )
		this.pauseBtn = widget.querySelector( '.vj-track-pause-btn' )
		this.volumeSlider = widget.querySelector( '.vj-track-volume-slider' )

		this.nameEl.addEventListener( 'click', () => this.onSkip?.() )
		this.pauseBtn.addEventListener( 'click', () => this.onTogglePause?.() )
		this.volumeSlider.addEventListener( 'input', () => {
			const value = Number( this.volumeSlider.value )
			this.onVolumeChange?.( value )
		} )
		this.container.addEventListener( 'pointerenter', () => { this.hovering = true } )
		this.container.addEventListener( 'pointerleave', () => {
			this.hovering = false
			if ( ! this.dragging ) this.setWidth( this.hoverEl, 0 )
		} )
		this.container.addEventListener( 'pointerdown', this.onPointerDown )
		this.container.addEventListener( 'pointermove', this.onPointerMove )
		this.container.addEventListener( 'pointerup', this.onPointerUp )
		this.container.addEventListener( 'pointercancel', this.onPointerUp )

		this.tick()
	}

	setWidth = ( el, pct ) => { el.style.width = `${ pct * 100 }%` }

	pctFromEvent = ( e ) => {
		const rect = this.container.getBoundingClientRect()
		return Math.max( 0, Math.min( 1, ( e.clientX - rect.left ) / rect.width ) )
	}

	format = ( secs ) => {
		if ( isNaN( secs ) || ! isFinite( secs ) ) return '0:00'
		const m = Math.floor( secs / 60 )
		const s = Math.floor( secs % 60 )
		return `${ m }:${ s < 10 ? '0' : '' }${ s }`
	}

	previewSeek = ( pct ) => {
		const audioEl = this.getAudioEl?.()
		if ( audioEl?.duration ) this.timeEl.textContent = `seek: ${ this.format( pct * audioEl.duration ) }`
	}

	commitSeek = ( pct ) => {
		const audioEl = this.getAudioEl?.()
		if ( audioEl?.duration ) this.onSeek?.( pct * audioEl.duration )
	}

	onPointerDown = ( e ) => {
		this.dragging = true
		this.container.setPointerCapture( e.pointerId )
		this.dragPct = this.pctFromEvent( e )
		this.setWidth( this.fillEl, this.dragPct )
		this.setWidth( this.hoverEl, 0 )
		this.previewSeek( this.dragPct )
		e.preventDefault()
	}

	onPointerMove = ( e ) => {
		if ( this.dragging ) {
			this.dragPct = this.pctFromEvent( e )
			this.setWidth( this.fillEl, this.dragPct )
			this.previewSeek( this.dragPct )
		} else if ( this.hovering ) {
			this.hoverPct = this.pctFromEvent( e )
			this.setWidth( this.hoverEl, this.hoverPct )
		}
	}

	onPointerUp = ( e ) => {
		if ( ! this.dragging ) return
		this.dragging = false
		this.container.releasePointerCapture?.( e.pointerId )
		this.commitSeek( this.dragPct )
		if ( ! this.hovering ) this.setWidth( this.hoverEl, 0 )
	}

	render = () => {
		const source = this.getSource?.()
		const audioEl = this.getAudioEl?.()

		if ( source === 'mic' || source === 'tab' ) {
			const label =
				source === 'tab' ? 'Onglet Chrome (live)' : 'Microphone (live)'
			this.nameEl.textContent = `♪ ${ label }`
			this.timeEl.textContent =
				source === 'tab' ? 'Partage d’onglet actif' : ''
			this.setWidth( this.fillEl, 0 )
			this.container.style.pointerEvents = 'none'
			this.container.style.opacity = '0.3'
			this.pauseBtn.disabled = true
			this.pauseBtn.textContent = 'Pause'
			this.volumeSlider.disabled = true
			return
		}
		this.container.style.pointerEvents = 'auto'
		this.container.style.opacity = '1'
		this.pauseBtn.disabled = false
		this.volumeSlider.disabled = false
		const paused = this.getIsPaused?.() ?? false
		this.pauseBtn.textContent = paused ? 'Lecture' : 'Pause'
		const volume = this.getVolume?.()
		if ( typeof volume === 'number' ) this.volumeSlider.value = String( volume )

		const name = this.getTrackName?.()
		if ( name ) this.nameEl.textContent = `♪ ${ name }`

		if ( ! audioEl ) return
		const duration = audioEl.duration || 0
		const currentTime = audioEl.currentTime || 0

		if ( ! this.dragging ) {
			this.setWidth( this.fillEl, duration > 0 ? currentTime / duration : 0 )
			if ( this.hovering ) this.timeEl.textContent = `seek: ${ this.format( this.hoverPct * duration ) }`
			else this.timeEl.textContent = `${ this.format( currentTime ) } / ${ this.format( duration ) }`
		}
	}

	tick = () => {
		if ( this.disposed ) return
		this.render()
		this.raf = requestAnimationFrame( this.tick )
	}

	dispose() {
		this.disposed = true
		cancelAnimationFrame( this.raf )
		this.widget?.remove()
		this.style?.remove()
	}

}
