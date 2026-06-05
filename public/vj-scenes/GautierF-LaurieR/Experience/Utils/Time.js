import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        this.startTime = Date.now()
        this.current = this.startTime
        this.elapsed = 0
        this.delta = 16

        this.active = false
        this._raf = null
    }

    start()
    {
        if ( this.active ) return
        this.active = true
        this._raf = requestAnimationFrame( () => this.tick() )
    }

    stop()
    {
        this.active = false
        if ( this._raf != null ) {
            cancelAnimationFrame( this._raf )
            this._raf = null
        }
    }

    tick()
    {
        if ( ! this.active ) return

        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.startTime

        this.trigger( 'tick' )

        this._raf = requestAnimationFrame( () => this.tick() )
    }
}