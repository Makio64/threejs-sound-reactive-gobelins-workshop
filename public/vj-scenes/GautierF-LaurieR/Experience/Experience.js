import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'

import sources from './sources.js'

let instance = null

export function resetExperienceSingleton() {
    instance = null
    delete window.experience
}

export default class Experience
{
    constructor( _canvas, preloadedResources = null )
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = preloadedResources ?? new Resources( sources )
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.running = false

        this.time.on( 'tick', () => this.update() )
    }

    play()
    {
        if ( this.running ) return
        this.running = true
        this.time.start()
    }

    stop()
    {
        if ( ! this.running ) return
        this.running = false
        this.time.stop()
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        if ( ! this.running ) return

        if ( this.debug.active )
            this.debug.stats.update()

        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy()
    {
        this.stop()

        this.sizes.off( 'resize' )
        this.sizes.destroy()
        this.time.off( 'tick' )

        const disposedGeometries = new Set()
        const disposedMaterials = new Set()

        this.scene.traverse( ( child ) => {
            if ( ! ( child instanceof THREE.Mesh ) ) return

            if ( child.geometry && ! disposedGeometries.has( child.geometry ) ) {
                child.geometry.dispose()
                disposedGeometries.add( child.geometry )
            }

            const materials = Array.isArray( child.material ) ? child.material : [ child.material ]
            for ( const material of materials ) {
                if ( ! material || disposedMaterials.has( material ) ) continue
                disposedMaterials.add( material )

                for ( const key in material ) {
                    const value = material[ key ]
                    if ( value && typeof value.dispose === 'function' )
                        value.dispose()
                }

                if ( typeof material.dispose === 'function' )
                    material.dispose()
            }
        } )

        this.resources?.loaders?.dracoLoader?.dispose()

        this.camera.controls.dispose()
        this.renderer.destroy()

        if ( this.debug.active ) {
            this.debug.ui.destroy()
            this.debug.stats.dom.remove()
        }

        this.canvas?.remove()
        resetExperienceSingleton()
    }
}