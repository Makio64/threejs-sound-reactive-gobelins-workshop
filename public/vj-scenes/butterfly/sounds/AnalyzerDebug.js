// --- sounds/AnalyzerDebug -----------------------------------------------------
// A small draggable overlay that shows what an Analyzer is feeling: the
// volumeByFrequency spectrum on top, and volume / volumeSmooth / kick meters below.
// Works with a live OR a receive Analyzer- it only reads the signals.
//
//   import Analyzer from '/sounds/Analyzer.js'
//   import AnalyzerDebug from '/sounds/AnalyzerDebug.js'
//   const audio = new Analyzer()
//   const debug = new AnalyzerDebug( audio )   // visible; debug.toggle() to hide
// --------------------------------------------------------------------------------

const PAD = 8

export default class AnalyzerDebug {

	constructor( analyzer, { width = 160, height = 95, bins = 8 } = {} ) {
		this.analyzer = analyzer
		this.width = width
		this.height = height
		this.bins = bins

		this.canvas = document.createElement( 'canvas' )
		const dpr = Math.min( 2, window.devicePixelRatio || 1 )
		this.canvas.width = width * dpr
		this.canvas.height = height * dpr
		this.canvas.style.cssText = `position:fixed;right:14px;bottom:60px;z-index:9999;width:${ width }px;height:${ height }px;border:1px solid #2a2a2a;border-radius:8px;background:rgba(8,10,18,.82);backdrop-filter:blur(6px);filter:grayscale(1);opacity:.35;transition:opacity .25s ease,filter .25s ease`
		this.ctx = this.canvas.getContext( '2d' )
		this.ctx.scale( dpr, dpr )
		this.ctx.font = '10px ui-monospace,Menlo,monospace'

		this.canvas.addEventListener( 'pointerenter', () => { this.canvas.style.opacity = '1'; this.canvas.style.filter = 'grayscale(0)' } )
		this.canvas.addEventListener( 'pointerleave', () => { this.canvas.style.opacity = '.35'; this.canvas.style.filter = 'grayscale(1)' } )
		document.body.appendChild( this.canvas )
		this.raf = requestAnimationFrame( this.update )
	}

	update = () => { 
		if ( this.disposed ) return;
		this.draw();
		this.raf = requestAnimationFrame( this.update ) 
	}

	draw = () => {
		const a = this.analyzer, ctx = this.ctx, W = this.width, H = this.height
		ctx.clearRect( 0, 0, W, H )

		// meters (bottom): volume, volumeSmooth, kick, kickHard
		const meters = [
			[ 'volume', a.volume, '#3498db' ],
			[ 'smooth', a.volumeSmooth, '#2ecc71' ],
			[ 'kick', a.kickEnergy ?? 0, '#ff5aa0' ],
			[ 'kickHard', a.kickHardEnergy ?? 0, '#f1c40f' ],
		]

		// spectrum (top portion)
		const specH = H - ( 8 + meters.length * 12 ), f = a.volumeByFrequency, N = this.bins
		const bw = ( W - PAD * 2 ) / N
		for ( let i = 0; i < N; i ++ ) {
			const bin = Math.floor( ( i / N ) * 0.5 * f.length )   // lower half = musical range
			const v = f[ bin ] ?? 0, h = v * ( specH - PAD )
			ctx.fillStyle = `hsl(${ 200 + ( i / N ) * 130 }, 85%, ${ 34 + v * 42 }%)`
			ctx.fillRect( PAD + i * bw, specH - h, bw * 0.85, h )
		}

		const y0 = specH + 4, rowH = ( H - y0 - PAD ) / meters.length
		for ( let i = 0; i < meters.length; i ++ ) {
			const [ label, val, col ] = meters[ i ]
			const y = y0 + i * rowH + 2, barX = 58, barW = W - barX - PAD, barH = rowH - 4
			
			// Draw bar background
			ctx.fillStyle = '#1b2030'
			ctx.fillRect( barX, y, barW, barH )

			// Draw filled bar
			ctx.fillStyle = col
			ctx.fillRect( barX, y, barW * Math.min( 1, val ), barH )
			
			// Draw threshold line for kick/kickHard
			if ( label === 'kick' && a.kickThreshold ) {
				const tx = barX + barW * Math.min( 1, a.kickThreshold )
				ctx.fillStyle = '#ffffff'
				ctx.fillRect( tx - 1, y, 2, barH )
			} else if ( label === 'kickHard' && a.kickHardThreshold ) {
				const tx = barX + barW * Math.min( 1, a.kickHardThreshold )
				ctx.fillStyle = '#ffffff'
				ctx.fillRect( tx - 1, y, 2, barH )
			}
			
			// Flash label if kick triggers
			if ( label === 'kick' && a.kick > 0.05 ) {
				ctx.fillStyle = '#ff5aa0'
				ctx.fillText( 'KICK!', PAD, y + barH - 1 )
			} else if ( label === 'kickHard' && a.kickHard > 0.05 ) {
				ctx.fillStyle = '#f1c40f'
				ctx.fillText( 'HARD!', PAD, y + barH - 1 )
			} else {
				ctx.fillStyle = '#9fb0d8'
				ctx.fillText( label, PAD, y + barH - 1 )
			}
			
			ctx.fillStyle = '#dfe7ff'
			ctx.fillText( val.toFixed( 2 ), barX + 3, y + barH - 1 )
		}

		// If audio context is not running, overlay a help message
		if ( a.ctx?.state !== 'running' ) {
			ctx.fillStyle = 'rgba(8, 10, 18, 0.85)'
			ctx.fillRect( 0, 0, W, H )
			ctx.fillStyle = '#ff5aa0'
			ctx.textAlign = 'center'
			ctx.fillText( 'CLICK TO UNLOCK AUDIO', W / 2, H / 2 - 4 )
			ctx.fillStyle = '#9fb0d8'
			ctx.fillText( '(or press any key)', W / 2, H / 2 + 10 )
			ctx.textAlign = 'left' // reset
		}
	}

	show = () => {
		if ( ! this.canvas.parentNode ) document.body.appendChild( this.canvas )
		this.canvas.style.display = 'block'
	}

	hide = () => {
		this.canvas.style.display = 'none'
	}

	toggle = () => {
		this.canvas.style.display === 'none' ? this.show() : this.hide()
	}

	dispose = () => {
		this.disposed = true
		cancelAnimationFrame( this.raf )
		this.canvas.remove()
	}

}
