import './ui/panel.css'
import panelHtml from './ui/dashboard.html?raw'

export default class PanelManager {
	constructor( vjHost ) {
		this.vjHost = vjHost
		this.dom = {}
		this.lastIndex = -1
		this.lastSource = ''
		this.lastPaused = null
		this.lastDuration = -1

		this.init()
	}

	init() {
		this.createDOM()
		this.bindEvents()

		// Hook into vjHost's callbacks to update dashboard reactively
		const originalOnScenesChanged = this.vjHost.onScenesChanged
		this.vjHost.onScenesChanged = () => {
			if ( originalOnScenesChanged ) originalOnScenesChanged()
			this.renderScenes()
		}

		const originalOnConfigChanged = this.vjHost.onConfigChanged
		this.vjHost.onConfigChanged = () => {
			if ( originalOnConfigChanged ) originalOnConfigChanged()
			this.renderConfig()
		}

		const originalOnTrack = this.vjHost.onTrack
		this.vjHost.onTrack = ( name ) => {
			if ( originalOnTrack ) originalOnTrack( name )
			if ( this.dom.activeTrackName ) {
				this.dom.activeTrackName.textContent = `♪ ${ name }`
			}
		}

		// Initial render of HUD controls
		this.renderScenes()
		this.renderConfig()

		if ( this.vjHost.tracks.length && this.dom.activeTrackName ) {
			this.dom.activeTrackName.textContent = `♪ ${ this.vjHost.trackNames[ this.vjHost.trackIndex ] }`
		}

		this.startSync()
	}

	createDOM() {
		const container = document.createElement( 'div' )
		container.innerHTML = panelHtml
		document.body.appendChild( container )

		// Cache DOM references
		this.dom.dashboard = container.querySelector( '.vj-dashboard' )
		this.dom.toggleBtn = container.querySelector( '.vj-btn-toggle' )
		this.dom.durationSlider = container.querySelector( '#vj-slider-duration' )
		this.dom.durationVal = container.querySelector( '#vj-duration-val' )
		this.dom.audioMic = container.querySelector( '#vj-audio-mic' )
		this.dom.audioTrack = container.querySelector( '#vj-audio-track' )
		this.dom.sceneListContainer = container.querySelector( '#vj-scene-list-container' )
		this.dom.scenesCount = container.querySelector( '#vj-scenes-count' )
		this.dom.progressFill = container.querySelector( '#vj-time-progress' )
		this.dom.playStatus = container.querySelector( '#vj-play-status' )
	}

	toggleDashboard() {
		this.dom.dashboard.classList.toggle( 'open' )
	}

	bindEvents() {
		const toggle = () => this.toggleDashboard()
		this.dom.toggleBtn.addEventListener( 'click', toggle )

		// Keyboard shortcut H for dashboard toggle
		addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'h' || e.key === 'H' ) {
				if ( document.activeElement && ( document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' ) ) {
					return
				}
				toggle()
			}
		} )

		// Slider scene duration
		this.dom.durationSlider.addEventListener( 'input', ( e ) => {
			const val = parseInt( e.target.value, 10 )
			this.vjHost.sceneSeconds = val
			this.dom.durationVal.textContent = `${ val }s`
		} )

		// Audio triggers
		this.dom.audioMic.addEventListener( 'click', () => {
			this.vjHost.playMic()
			if ( this.vjHost.onConfigChanged ) this.vjHost.onConfigChanged()
		} )

		this.dom.audioTrack.addEventListener( 'click', () => {
			this.vjHost.useTrack()
			if ( this.vjHost.onConfigChanged ) this.vjHost.onConfigChanged()
		} )
	}

	renderScenes() {
		if ( ! this.dom.sceneListContainer ) return

		this.dom.scenesCount.textContent = this.vjHost.scenes.length
		this.dom.sceneListContainer.innerHTML = ''

		this.vjHost.scenes.forEach( ( scene, idx ) => {
			const item = document.createElement( 'div' )
			const isActive = idx === this.vjHost.index
			item.className = `vj-scene-item ${ isActive ? 'active' : '' }`

			let statusClass = 'vj-status-inactive'
			const L = this.vjHost.layers.get( scene.id )
			if ( L ) {
				if ( isActive || L.shown ) {
					statusClass = 'vj-status-playing'
				} else if ( L.timedOut ) {
					statusClass = 'vj-status-error'
				} else if ( L.loaded ) {
					statusClass = 'vj-status-preloaded'
				}
			}

			const labelText = scene.label || scene.id
			const sceneKind = scene.kind || 'local'

			item.innerHTML = `
				<div class="vj-scene-info" style="min-width: 0; flex: 1;">
					<span class="vj-status-dot ${ statusClass }"></span>
					<span class="vj-scene-label" title="${ scene.url }" style="display: inline-block; max-width: calc(100% - 20px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
						${ labelText } <span class="vj-scene-type">${ sceneKind }</span>
					</span>
				</div>
			`

			if ( scene.kind === 'custom' ) {
				const delBtn = document.createElement( 'button' )
				delBtn.className = 'vj-scene-del'
				delBtn.title = 'Remove scene'
				delBtn.innerHTML = `
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				`
				delBtn.addEventListener( 'click', ( e ) => {
					e.stopPropagation()
					this.vjHost.deleteScene( scene.id )
				} )
				item.appendChild( delBtn )
			}

			item.addEventListener( 'click', () => {
				this.vjHost.go( idx )
			} )

			this.dom.sceneListContainer.appendChild( item )
		} )
	}

	renderConfig() {
		const audioSource = this.vjHost.source
		this.dom.audioMic.classList.toggle( 'active', audioSource === 'mic' )
		this.dom.audioTrack.classList.toggle( 'active', audioSource === 'mp3' )

		this.dom.durationSlider.value = this.vjHost.sceneSeconds
		this.dom.durationVal.textContent = `${ this.vjHost.sceneSeconds }s`
	}

	startSync() {
		const sync = () => {
			const pct = Math.min( 100, ( this.vjHost.elapsed / this.vjHost.sceneSeconds ) * 100 )
			if ( this.dom.progressFill ) {
				this.dom.progressFill.style.width = `${ this.vjHost.transitioning ? 100 : pct }%`
			}

			if ( this.dom.playStatus ) {
				if ( this.vjHost.paused ) {
					this.dom.playStatus.textContent = 'PAUSED'
					this.dom.playStatus.className = 'vj-badge vj-badge-paused'
					this.dom.playStatus.style.display = 'inline-block'
				} else {
					this.dom.playStatus.style.display = 'none'
				}
			}

			if ( this.vjHost.index !== this.lastIndex ) {
				this.lastIndex = this.vjHost.index
				this.renderScenes()
			}

			if ( this.vjHost.source !== this.lastSource || this.vjHost.paused !== this.lastPaused || this.vjHost.sceneSeconds !== this.lastDuration ) {
				this.lastSource = this.vjHost.source
				this.lastPaused = this.vjHost.paused
				this.lastDuration = this.vjHost.sceneSeconds
				this.renderConfig()
			}

			requestAnimationFrame( sync )
		}
		requestAnimationFrame( sync )
	}
}
