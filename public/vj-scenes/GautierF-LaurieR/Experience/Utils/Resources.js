import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import EventEmitter from './EventEmitter.js'

// Racine scène : public/vj-scenes/GautierF-LaurieR/ (deux niveaux au-dessus de Utils/)
const sceneRoot = new URL( '../../', import.meta.url )

function assetUrl( path ) {
	return new URL( path, sceneRoot ).href
}

export default class Resources extends EventEmitter
{
    /** Précharge toutes les entrées de sources.js (appelé depuis main.load() avant init). */
    static preload( sources ) {
        return new Promise( ( resolve, reject ) => {
            const resources = new Resources( sources )
            resources.on( 'ready', () => {
                if ( resources.failed > 0 ) {
                    console.warn(
                        `[Resources] ${ resources.failed }/${ resources.toLoad } asset(s) failed — scene may be incomplete`
                    )
                }
                if ( resources.toLoad > 0 && resources.failed === resources.toLoad ) {
                    reject( new Error( '[Resources] all assets failed to load' ) )
                    return
                }
                resolve( resources )
            } )
        } )
    }

    constructor( sources )
    {
        super()

        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0
        this.failed = 0

        this.setLoaders()
        this.startLoading()

        if ( this.toLoad === 0 )
            this.trigger( 'ready' )
    }

    get isReady() {
        return this.loaded === this.toLoad
    }

    setLoaders()
    {
        this.loaders = {}

        this.loaders.dracoLoader = new DRACOLoader()
        this.loaders.dracoLoader.setDecoderPath( assetUrl( 'draco/' ) )
        this.loaders.dracoLoader.setDecoderConfig({ type: 'js' })

        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader( this.loaders.dracoLoader )

        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    onLoadError( source, err ) {
        console.error(
            `[Resources] failed to load "${ source.name }" (${ source.type }) from ${ assetUrl( source.path ) }`,
            err
        )
        this.items[ source.name ] = null
        this.failed++
        this.finishedLoading()
    }

    finishedLoading() {
        this.loaded++
        if ( this.loaded === this.toLoad )
            this.trigger( 'ready' )
    }

    startLoading()
    {
        for ( const source of this.sources ) {
            const url = Array.isArray( source.path )
                ? source.path.map( ( p ) => assetUrl( p ) )
                : assetUrl( source.path )

            if ( source.type === 'gltfModel' ) {
                this.loaders.gltfLoader.load(
                    url,
                    ( file ) => this.sourceLoaded( source, file ),
                    undefined,
                    ( err ) => this.onLoadError( source, err )
                )
            }
            else if ( source.type === 'texture' ) {
                this.loaders.textureLoader.load(
                    url,
                    ( file ) => this.sourceLoaded( source, file ),
                    undefined,
                    ( err ) => this.onLoadError( source, err )
                )
            }
            else if ( source.type === 'cubeTexture' ) {
                this.loaders.cubeTextureLoader.load(
                    url,
                    ( file ) => this.sourceLoaded( source, file ),
                    undefined,
                    ( err ) => this.onLoadError( source, err )
                )
            }
            else {
                this.onLoadError( source, new Error( `unknown source type: ${ source.type }` ) )
            }
        }
    }

    sourceLoaded( source, file ) {
        this.items[ source.name ] = file
        this.finishedLoading()
    }
}