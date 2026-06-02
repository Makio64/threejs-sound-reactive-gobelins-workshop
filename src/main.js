import vjHost from './VJHost.js'
import PanelManager from './PanelManager.js'
import PlayerControl from './sounds/PlayerControl.js'
import { STORAGE_KEYS } from './config.js'

import './ui/base.css'
import './ui/home.css'
import './ui/guide.css'
import homeHtml from './ui/home.html?raw'
import guideHtml from './ui/guide.html?raw'

class VJApp {

	overlay = null
	guideDialog = null
	activeTrackName = ''

	async start() {
		await vjHost.init()
		this.showStartOverlay()
	}

	showStartOverlay() {
		this.overlay = document.body.appendChild( document.createElement( 'div' ) )
		this.overlay.className = 'vj-home-overlay'

		if ( ! vjHost.scenes.length ) {
			this.overlay.innerHTML = '<div style="color:rgba(255,255,255,.6)">No scenes. Add public/vj-scenes/&lt;name&gt;/index.html, or a URL in src/VJHost.js.</div>'
			return
		}

		this.overlay.innerHTML = homeHtml
		this.guideDialog = this.createGuideDialog()

		this.overlay.querySelector( '.home-guide-btn' ).addEventListener( 'click', () => this.guideDialog.showModal() )
		this.overlay.querySelector( '.home-start' ).addEventListener( 'click', () => this.beginShow(), { once: true } )
	}

	createGuideDialog() {
		const dialog = document.createElement( 'dialog' )
		dialog.id = 'integration-guide'
		dialog.setAttribute( 'closedby', 'any' )
		dialog.setAttribute( 'aria-labelledby', 'guide-title' )
		dialog.innerHTML = guideHtml
		document.body.appendChild( dialog )

		this.addDialogCloseFallback( dialog )
		return dialog
	}

	// click-outside-to-close for browsers without native `closedBy`
	addDialogCloseFallback( dialog ) {
		if ( 'closedBy' in HTMLDialogElement.prototype ) return
		dialog.addEventListener( 'click', ( event ) => {
			if ( event.target !== dialog ) return
			const r = dialog.getBoundingClientRect()
			const inside = r.top <= event.clientY && event.clientY <= r.top + r.height && r.left <= event.clientX && event.clientX <= r.left + r.width
			if ( ! inside ) dialog.close()
		} )
	}

	async beginShow() {
		this.overlay.remove()
		this.guideDialog.remove()
		if ( vjHost.tracks.length ) this.createPlayerControl()
		await vjHost.start()
		new PanelManager( vjHost )
	}

	createPlayerControl() {
		vjHost.onTrack = this.updateTrackName
		this.updateTrackName( vjHost.trackNames[ vjHost.trackIndex ] )

		return new PlayerControl( {
			getAudioEl: () => vjHost.audioEl,
			getSource: () => vjHost.source,
			getTrackName: () => this.activeTrackName,
			onSkip: () => vjHost.nextTrack(),
			onSeek: ( seconds ) => {
				vjHost.audioEl.currentTime = seconds
				localStorage.setItem( STORAGE_KEYS.trackTime, vjHost.audioEl.currentTime )   // store the clamped read-back, not the raw input
			},
			fillBackground: '#94a3b8',
			fillShadow: 'none',
			nameHoverColor: '#fff',
			idleOpacity: 0.15,
		} )
	}

	updateTrackName = ( name ) => {
		this.activeTrackName = name
		const dashTrackName = document.getElementById( 'vj-active-track-name' )
		if ( dashTrackName ) dashTrackName.textContent = `♪ ${ name }`
	}

}

await new VJApp().start()
