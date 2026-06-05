import EventEmitter from './EventEmitter.js'
import { PERFORMANCE } from './Performance.js'

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, PERFORMANCE.maxPixelRatio)

        this._onResize = () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, PERFORMANCE.maxPixelRatio)
            this.trigger( 'resize' )
        }

        window.addEventListener( 'resize', this._onResize )
    }

    destroy()
    {
        window.removeEventListener( 'resize', this._onResize )
    }
}