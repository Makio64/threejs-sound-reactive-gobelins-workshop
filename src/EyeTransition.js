import { config } from './config.js'

const ease = ( x ) => x * x * ( 3 - 2 * x )
const clampf = ( x, a, b ) => Math.min( b, Math.max( a, x ) )

export default class EyeTransition {
	constructor( show ) {
		this.show = show
		this.active = false
		this.t = 0
		this.current = null
		this.incoming = null
	}

	iris( f, open ) {
		if ( open <= 0.001 ) {
			f.style.webkitMaskImage = f.style.maskImage = 'linear-gradient(transparent, transparent)'
			return
		}
		// A realistic eye transition doesn't scale horizontally. We keep the horizontal corner-to-corner
		// width constant (rx), and only scale the vertical height of the eyelids (ry).
		const rx = 100
		const ry = open * 65
		f.style.webkitMaskImage = f.style.maskImage = `radial-gradient(ellipse ${ rx }vmax ${ ry }vmax at 50% 50%, #000 95%, transparent 105%)`
	}

	reset( f ) {
		f.style.transform = 'none'
		f.style.webkitMaskImage = f.style.maskImage = 'none'
	}

	start( current, incoming ) {
		if ( this.active ) return false
		this.current = current
		this.incoming = incoming
		this.current.iframe.style.zIndex = '1'
		this.incoming.iframe.style.zIndex = '2'
		this.show.activate( this.incoming )
		this.t = 0
		this.active = true
		this.apply( 0 )
		return true
	}

	apply( p ) {
		if ( ! this.current || ! this.incoming ) return
		const close = ease( clampf( ( 0.45 - p ) / 0.45, 0, 1 ) )   // 1 (open) → 0 (shut to black)
		const open = ease( clampf( ( p - 0.55 ) / 0.45, 0, 1 ) )    // 0 (shut) → 1 (open from black)
		this.iris( this.current.iframe, close )
		this.iris( this.incoming.iframe, open )
		this.current.iframe.style.transform = `scale(${ 1 + 0.04 * ( 1 - close ) })`
		this.incoming.iframe.style.transform = `scale(${ 1.05 - 0.05 * open })`
	}

	update( dt ) {
		if ( ! this.active ) return
		this.t += dt / config.eyeTransitionSeconds
		const p = Math.min( 1, this.t )
		this.apply( p )
		if ( p >= 1 ) {
			const old = this.current
			this.show.current = this.incoming
			this.show.incoming = null
			this.active = false
			this.show.current.iframe.style.zIndex = '1'
			this.reset( this.show.current.iframe )
			this.show.deactivate( old )
			this.reset( old.iframe )
			this.show.evict()
		}
	}
}
