// --- sounds/PlayerControl -----------------------------------------------------
// The little bottom-right "now playing" control: track name (click to skip),
// hover/scrub progress bar, mm:ss time. It is PURE UI- it does not choose, load,
// or analyse anything. You hand it a few accessors and callbacks and it draws.
//
// Used by two owners (so the markup/CSS lives in ONE place):
//   • SoundPlayer- a scene opened on its own
//   • src/main.js- the VJ host's master player
//
//   new PlayerControl( {
//     getAudioEl,   // () => HTMLAudioElement | null   (read duration/currentTime)
//     getSource,    // () => 'mic' | 'mp3'             (mic hides the scrubber)
//     getTrackName, // () => string                    (display name, no extension)
//     onSkip,       // () => void                      (clicked the track name)
//     onSeek,       // ( seconds ) => void             (released a scrub- commit it)
//     // optional theming so host & standalone can differ:
//     fillBackground, fillShadow, nameHoverColor, idleOpacity,
//   } )
//
// One Pointer Events path covers mouse AND touch; setPointerCapture keeps a drag
// tracking outside the bar, so there are no window-level listeners to clean up.
//
// Markup & styles live next door in ./ui/ (string modules, so they ride along with
// /sounds and need no bundler- see those files).
// --------------------------------------------------------------------------------

import controlHtml from './ui/player-control.html.js'
import controlCss from './ui/player-control.css.js'

export default class PlayerControl {

	constructor( {
		getAudioEl,
		getSource,
		getTrackName,
		onSkip,
		onSeek,
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

		this.nameEl.addEventListener( 'click', () => this.onSkip?.() )
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

	// -- tiny helpers ----------------------------------------------------------
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

	// -- pointer interaction (one path for mouse + touch) ------------------------
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
		// releasing capture re-fires pointerenter/leave, so `hovering` self-corrects;
		// just clear the ghost if the pointer ended up off the bar.
		if ( ! this.hovering ) this.setWidth( this.hoverEl, 0 )
	}

	// -- per-frame draw ----------------------------------------------------------
	render = () => {
		const source = this.getSource?.()
		const audioEl = this.getAudioEl?.()

		if ( source === 'mic' ) {
			this.nameEl.textContent = `♪ Microphone (live)`
			this.timeEl.textContent = ``
			this.setWidth( this.fillEl, 0 )
			this.container.style.pointerEvents = 'none'
			this.container.style.opacity = '0.3'
			return
		}
		this.container.style.pointerEvents = 'auto'
		this.container.style.opacity = '1'

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
		this.widget?.remove()      // detaches every listener with it (none on window)
		this.style?.remove()
	}

}
