import { defineConfig } from 'vite'
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import vjTracksPlugin from './vite-plugin-vj-tracks.js'

// The reusable audio brain lives in src/sounds/ (one self-contained folder; copy
// it into a project's public/sounds/ to reuse). The host's static iframe scenes are served
// verbatim from public/ and import it by the absolute URL `/sounds/Analyzer.js`,
// which src/ doesn't serve- so bridge `/sounds/*` → `src/sounds/*` in dev, and
// emit the files to `dist/sounds/*` at build. Self-contained ESM, served raw.
function vjSoundsPlugin() {

	const dir = resolve( process.cwd(), 'src/sounds' )
	// recurse so subfolders (e.g. src/sounds/ui/*.js) are served & emitted too
	const files = () => existsSync( dir ) ? readdirSync( dir, { recursive: true } ).filter( ( f ) => String( f ).endsWith( '.js' ) ) : []

	return {
		name: 'vj-sounds',
		generateBundle() {
			for ( const f of files() ) this.emitFile( { type: 'asset', fileName: `sounds/${ String( f ).split( /[\\/]/ ).join( '/' ) }`, source: readFileSync( resolve( dir, f ), 'utf8' ) } )
		},
		configureServer( server ) {
			server.middlewares.use( ( req, res, next ) => {
				const m = req.url && req.url.match( /^\/sounds\/([^?#]+)/ )
				if ( ! m ) return next()
				const file = resolve( dir, m[ 1 ] )
				if ( ! file.startsWith( dir ) || ! existsSync( file ) ) return next()
				res.setHeader( 'Content-Type', 'text/javascript; charset=utf-8' )
				res.end( readFileSync( file ) )
			} )
			server.watcher.add( dir )
			server.watcher.on( 'change', ( p ) => { if ( String( p ).includes( 'src/sounds' ) ) server.ws.send( { type: 'full-reload' } ) } )
		},
	}

}

// Discover self-contained embed pages in public/embeds/<name>/index.html and
// expose them as a virtual module. public/ is served verbatim (dev === build),
// so each embed's own importmap / CDN deps work exactly as authored. Drop a
// folder → the dev server reloads and it joins the show.
function vjScenesPlugin() {

	const VIRTUAL = 'virtual:vj-scenes'
	const RESOLVED = '\0' + VIRTUAL
	const dir = resolve( process.cwd(), 'public/vj-scenes' )

	const scan = () => existsSync( dir )
		? readdirSync( dir, { withFileTypes: true } )
			.filter( ( d ) => d.isDirectory() && existsSync( resolve( dir, d.name, 'index.html' ) ) )
			.map( ( d ) => ( { id: d.name, url: `/vj-scenes/${ d.name }/index.html`, kind: 'local' } ) )
			.sort( ( a, b ) => a.id.localeCompare( b.id ) )
		: []

	return {
		name: 'vj-scenes',
		resolveId( id ) { if ( id === VIRTUAL ) return RESOLVED },
		load( id ) { if ( id === RESOLVED ) return `export const localScenes = ${ JSON.stringify( scan() ) }` },
		configureServer( server ) {

			// Redirect /vj-scenes/<name> to /vj-scenes/<name>/, and rewrite /vj-scenes/<name>/ to index.html to bypass SPA fallback
			server.middlewares.use( ( req, res, next ) => {
				const host = req.headers.host || 'localhost'
				const url = new URL( req.url, `http://${ host }` )
				const matchNoSlash = url.pathname.match( /^\/vj-scenes\/([^\/]+)$/ )
				if ( matchNoSlash ) {
					res.writeHead( 301, { Location: `/vj-scenes/${ matchNoSlash[ 1 ] }/` + url.search } )
					res.end()
					return
				}
				const matchSlash = url.pathname.match( /^\/vj-scenes\/([^\/]+)\/$/ )
				if ( matchSlash ) {
					req.url = `/vj-scenes/${ matchSlash[ 1 ] }/index.html` + url.search
				}
				next()
			} )

			server.watcher.add( dir )
			const reload = ( p ) => {

				if ( ! String( p ).includes( 'public/vj-scenes' ) ) return
				const mod = server.moduleGraph.getModuleById( RESOLVED )
				if ( mod ) server.moduleGraph.invalidateModule( mod )
				server.ws.send( { type: 'full-reload' } )

			}
			for ( const ev of [ 'add', 'unlink', 'addDir', 'unlinkDir' ] ) server.watcher.on( ev, reload )

		},
	}

}

export default defineConfig( {
	plugins: [ vjScenesPlugin(), vjTracksPlugin(), vjSoundsPlugin() ],
	// Student scenes in public/vj-scenes/ resolve deps via their own importmaps (CDN).
	// Limit pre-bundling to the host entry so Vite doesn't try to resolve gsap, lil-gui, etc.
	optimizeDeps: { entries: [ 'index.html' ] },
	server: { host: true, open: false },
	build: { target: 'es2022', outDir: 'dist' },
	assetsInclude: [ '**/*.mp3' ],
} )
