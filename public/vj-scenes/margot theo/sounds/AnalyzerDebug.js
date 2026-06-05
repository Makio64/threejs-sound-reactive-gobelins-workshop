import { getFrequencyBands } from './frequencyBands.js'

export default class AnalyzerDebug {

	constructor( analyzer, { width = 180, bins = 8 } = {} ) {
		this.analyzer = analyzer
		this.visible = true
		this.bins = bins

		this.root = document.createElement( 'div' )
		this.root.className = 'vj-analyzer-debug'
		this.root.style.cssText = `
			position:fixed;left:16px;top:16px;z-index:10001;
			width:${ width }px;padding:10px 12px;
			background:rgba(6,6,23,0.88);border:1px solid rgba(184,184,255,0.25);
			border-radius:8px;font:11px/1.3 system-ui,sans-serif;color:#e8e8ff;
			pointer-events:none;
		`

		this.spectrumEl = document.createElement( 'div' )
		this.spectrumEl.style.cssText = 'display:flex;align-items:flex-end;gap:2px;height:36px;margin-bottom:8px;'
		this.bars = []
		for ( let i = 0; i < bins; i += 1 ) {
			const bar = document.createElement( 'div' )
			bar.style.cssText = 'flex:1;border-radius:2px 2px 0 0;min-height:2px;'
			this.spectrumEl.appendChild( bar )
			this.bars.push( bar )
		}

		this.bandsEl = document.createElement( 'div' )
		this.bandsEl.style.cssText = 'display:flex;align-items:flex-end;gap:6px;height:32px;margin-bottom:8px;'
		this.bandBars = {}
		for ( const [ key, color ] of [
			[ 'graves', '#ff6b4a' ],
			[ 'mediums', '#c8c8ff' ],
			[ 'aigues', '#5ad4ff' ],
		] ) {
			const wrap = document.createElement( 'div' )
			wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;'
			const label = document.createElement( 'span' )
			label.style.cssText = 'font-size:9px;opacity:0.75;text-transform:uppercase;'
			label.textContent = key === 'graves' ? 'Graves' : key === 'mediums' ? 'Médiums' : 'Aigus'
			const bar = document.createElement( 'div' )
			bar.style.cssText = `width:100%;background:linear-gradient(180deg,${ color },transparent);border-radius:2px 2px 0 0;min-height:2px;height:4px;`
			const val = document.createElement( 'span' )
			val.style.cssText = 'font-size:10px;'
			val.dataset.band = key
			wrap.appendChild( label )
			wrap.appendChild( bar )
			wrap.appendChild( val )
			this.bandsEl.appendChild( wrap )
			this.bandBars[ key ] = { bar, val }
		}

		this.metersEl = document.createElement( 'div' )
		this.metersEl.innerHTML = `
			<div>vol <span data-m="vol">0</span> · smooth <span data-m="smooth">0</span></div>
			<div>kick <span data-m="kick">0</span> · hard <span data-m="hard">0</span></div>
		`

		this.root.appendChild( this.spectrumEl )
		this.root.appendChild( this.bandsEl )
		this.root.appendChild( this.metersEl )
		document.body.appendChild( this.root )

		this.raf = requestAnimationFrame( this.tick )
	}

	tick = () => {
		if ( this.disposed ) return
		const a = this.analyzer
		const bins = this.bins
		const step = Math.max( 1, Math.floor( a.volumeByFrequency.length / bins ) )

		for ( let i = 0; i < bins; i += 1 ) {
			let peak = 0
			for ( let j = 0; j < step; j += 1 ) {
				peak = Math.max( peak, a.volumeByFrequency[ i * step + j ] ?? 0 )
			}
			const t = i / Math.max( 1, bins - 1 )
			const r = Math.round( 255 * ( 1 - t * 0.6 ) )
			const g = Math.round( 120 + 80 * ( 1 - Math.abs( t - 0.5 ) * 2 ) )
			const b = Math.round( 255 * t )
			this.bars[ i ].style.height = `${ Math.max( 4, peak * 100 ) }%`
			this.bars[ i ].style.background = `linear-gradient(180deg, rgb(${ r },${ g },${ b }), #0066ff)`
		}

		const bands = getFrequencyBands( a.volumeByFrequency )
		for ( const key of [ 'graves', 'mediums', 'aigues' ] ) {
			const v = bands[ key ]
			this.bandBars[ key ].bar.style.height = `${ Math.max( 4, v * 100 ) }%`
			this.bandBars[ key ].val.textContent = v.toFixed( 2 )
		}

		this.root.querySelector( '[data-m="vol"]' ).textContent = a.volume.toFixed( 2 )
		this.root.querySelector( '[data-m="smooth"]' ).textContent = a.volumeSmooth.toFixed( 2 )
		this.root.querySelector( '[data-m="kick"]' ).textContent = a.kick.toFixed( 2 )
		this.root.querySelector( '[data-m="hard"]' ).textContent = a.kickHard.toFixed( 2 )

		this.raf = requestAnimationFrame( this.tick )
	}

	toggle = () => {
		this.visible = ! this.visible
		this.root.style.display = this.visible ? 'block' : 'none'
	}

	show = () => {
		this.visible = true
		this.root.style.display = 'block'
	}

	hide = () => {
		this.visible = false
		this.root.style.display = 'none'
	}

	dispose = () => {
		this.disposed = true
		cancelAnimationFrame( this.raf )
		this.root.remove()
	}

}
