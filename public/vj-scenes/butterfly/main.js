import Analyzer from '/sounds/Analyzer.js'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

const WRIGGLE_VERT = `
uniform float uTime;
uniform float uKick;
uniform float uVolume;
uniform float uFlapBoost;
varying vec2 vUv;
void main() {
	vUv = uv;
	vec3 p = position;
	float wing = smoothstep( 0.15, 1.0, abs( uv.x - 0.5 ) * 2.0 );
	float spine = 1.0 - wing;
	float side = sign( uv.x - 0.5 );
	float kickSoft = smoothstep( 0.0, 1.0, uKick );
	float beat = 0.65 + kickSoft * 0.45 + uVolume * 0.30;
	float flapPhase = 0.5 + 0.5 * sin( uTime * 0.78 );
	float flapCurve = flapPhase * flapPhase * ( 3.0 - 2.0 * flapPhase );
	float flap = ( flapCurve * 2.0 - 1.0 ) * beat * uFlapBoost;
	float yAmp = 0.040 + kickSoft * 0.075 + uVolume * 0.040;
	float phaseSkew = side * ( 0.75 + sin( uTime * 0.31 ) * 0.45 ) + ( uv.y - 0.5 ) * 1.9;
	float yWaveA = sin( uv.x * 7.8 + uTime * ( 1.22 + side * 0.33 ) + phaseSkew );
	float yWaveB = cos( uv.y * 8.1 - uTime * ( 1.83 - side * 0.27 ) - phaseSkew * 0.7 );
	float yWaveC = sin( ( uv.x + uv.y ) * 4.7 + uTime * 0.97 + side * 1.3 );
	float yWave = yWaveA * yWaveB + yWaveC * 0.55;
	float breathe = 1.0 + sin( uTime * ( 0.52 + side * 0.10 ) + uv.x * 1.7 ) * ( 0.020 + kickSoft * 0.028 + uVolume * 0.014 );
	// Wing tips go far on Z, and fold slightly toward center.
	p.z += side * wing * flap * 0.95;
	p.x *= 1.0 - wing * abs( flap ) * 0.36;
	// Vertical deformation: intentionally desynced and asymmetric.
	p.y += yWave * yAmp * ( 0.38 + wing * 0.70 ) + sin( uTime * 2.21 - uv.y * 4.9 + side * 0.9 ) * spine * ( 0.020 + kickSoft * 0.028 );
	p.y *= breathe;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}`

const WRIGGLE_FRAG = `
uniform sampler2D uTex;
uniform float     uTime;
uniform float     uKick;
uniform float     uVolume;
uniform float     uTransparent;
varying vec2 vUv;
void main() {
	vec4 base = texture2D( uTex, vUv );
	float edge = 1.0 - smoothstep( 0.12, 0.95, base.a );
	float amp  = ( 0.0014 + uKick * 0.006 + uVolume * 0.0024 ) * edge;
	vec2  disp = vec2(
		sin( vUv.y * 9.42 + uTime * 2.1 ) * amp,
		cos( vUv.x * 7.54 + uTime * 1.7 ) * amp
	);
	vec2  blobDisp = vec2(
		sin( ( vUv.y + vUv.x ) * 6.0 + uTime * 1.4 ),
		cos( ( vUv.x - vUv.y ) * 5.0 - uTime * 1.1 )
	) * ( 0.0042 + uKick * 0.010 ) * edge;
	vec4 tex = texture2D( uTex, clamp( vUv + disp, 0.001, 0.999 ) );
	vec4 blob = texture2D( uTex, clamp( vUv + blobDisp, 0.001, 0.999 ) );
	float morph = 0.35 + uKick * 0.30 + uVolume * 0.20;
	vec4 mixTex = mix( tex, blob, morph );
	float field = sin( vUv.x * 12.0 + uTime * 1.2 ) * cos( vUv.y * 10.0 - uTime * 1.0 );
	float wobble = ( 0.06 + uKick * 0.10 + uVolume * 0.05 ) * edge;
	float alpha = smoothstep( 0.05, 0.95, mixTex.a + field * wobble );
	vec3 bg  = vec3( 0.957, 0.957, 0.941 );
	vec3 fg  = vec3( 0.110, 0.110, 0.133 );
	vec3 outColor = mix( bg, fg, alpha );
	float outAlpha = 1.0;
	if ( uTransparent > 0.5 ) {
		outColor = fg;
		outAlpha = alpha;
	}
	gl_FragColor = vec4( outColor, outAlpha );
}`

const PALETTE = [
	'#E9D3FB', '#BEB8EA', '#BAC2D7', '#B09C69',
	'#AA3F3D', '#683D73', '#75A8BD', '#60A779',
	'#D738A9', '#C47448', '#A1A590', '#92428B',
	'#CEB1B1', '#404027', '#7F7467', '#3F211C',
	'#F3B3EB',
]

const MODES = [ 'mono', /*'couleur',*/ 'réseau', 'chaos' ]
const BACKGROUND_COLORS = [ '#06060a', '#06060a', '#061a0a', '#160824' ]   // noir, noir, vert, violet
const BUTTERFLY_SHARED_SCALE = 0.56

const LOCAL_BUTTERFLY_POOL = [
	...Array.from( { length: 100 }, ( _, i ) => `./images butterfly /_ (${i + 1}).jpeg` ),
	'./images butterfly /_.jpeg',
	'./images butterfly /_(.jpeg',
	'./images butterfly /_92476390_hi036431778.jpg',
	'./images butterfly /_ - 2026-06-03T235650.718.jpeg',
	'./images butterfly /_ - 2026-06-03T235709.579.jpeg',
	'./images butterfly /_ - 2026-06-03T235732.743.jpeg',
	'./images butterfly /_ - 2026-06-03T235751.613.jpeg',
	'./images butterfly /_ - 2026-06-03T235825.287.jpeg',
	'./images butterfly /_ - 2026-06-03T235837.408.jpeg',
	'./images butterfly /_ - 2026-06-03T235851.327.jpeg',
	'./images butterfly /_ - 2026-06-03T235924.356.jpeg',
	'./images butterfly /_ - 2026-06-03T235937.354.jpeg',
	'./images butterfly /_ - 2026-06-03T235948.671.jpeg',
	'./images butterfly /_ - 2026-06-04T000002.529.jpeg',
]

// Scripted track — stages advance when kick count reaches kicksToNext
const TRACK = [
	{ mode: 'mono',  bgType: 'white',   blendMode: 'normal',   kicksToNext: 3 },                     // 0 – intro blanc (raccourci)
	{ mode: 'mono',  bgType: 'sky',     blendMode: 'multiply', kicksToNext: 4 },                     // 1 – ciel (raccourci)
	{ mode: 'réseau', bgType: 'color',  blendMode: 'normal',   kicksToNext: 4 },                     // 2 – réseau (raccourci)
	{ mode: 'mono',  bgType: 'tornado', blendMode: 'multiply', kicksToNext: 6, textAfterKick: 3 },  // 3 – tornade (plus court)
	{ mode: 'chaos',  bgType: 'color',  blendMode: 'normal',  heavy: true, kicksToNext: 6 },        // 4 – chaos puis boucle
]

class ButterflyBlobsScene {

	constructor( audio ) {
		this.audio = audio
		this._raf  = null
		this.t     = 0

		this.canvas = null
		this.ctx    = null
		this.wrap   = null
		this._three = null   // Three.js background renderer

		this._trackStage      = 0
		this._kickCount       = 0
		this._lastKickTime    = -999   // cooldown between counted kicks
		this._skyWordIdx      = 0      // mot affiché en stage sky
		this._tornadoWordIdx  = 0      // mot affiché en phase texte du stage tornado
		this._scribble        = { x: 0, y: 0, angle: 0, angVel: 0 }  // gribouillis mode heavy


	this.params = {
			blobs:     350,
			taille:    1,
			vitesse:   0.6,
			pulseAmp:  0.12,
			flou:      0,
			contraste: 14,
			seuil:     0.05,
			mode:      'mono',    
			variation: 0.1,
		}

		// sampling state
		this.blobs       = []
		this.samplePts   = []
		this.cumWeights  = []
		this.totalWeight = 0
		this.imgW        = 400
		this.imgH        = 360
		this.imgData     = null
		this._vectorImg  = null   // HTMLImageElement conservé pour Three.js texture

		// Lorenz attractor state — persists across mode switches
		this._lorenz = {
			x: 0.1, y: 0, z: 0,
			trail:    [],
			maxTrail: 4000,
		}

		// Image wall state — persists across mode switches
		this._chaosWall = {
			pool:    [],
			cache:   new Map(),
			poolIdx: 0,
			active:  [],
			lastPop: -999,
			lastKickEdge: -999,
			prevKick: 0,
			nextRevealAt: 0,
		}

		// Background state
		this._bg = {
			colorIdx: 1,   // index dans BACKGROUND_COLORS (le canvas crème couvre le bg en stage blanc)
		}
	}

	// ── Lifecycle ──────────────────────────────────────────────────────────────

	async load() {
		try {
			const fonts = [
				new FontFace( 'HelveticaNow', 'url(./HelveticaNowDisplay-Bold.woff2)' ),
				new FontFace( 'HelveticaNowLight', 'url(./HelveticaNowDisplay-Light.woff2)' ),
			]
			const loaded = await Promise.all( fonts.map( ( f ) => f.load() ) )
			for ( const f of loaded ) document.fonts.add( f )
		} catch { /* fallback si le fichier est absent */ }
		this._fetchArtworkPool()    // fire-and-forget; fills butterfly image pool
		return new Promise( ( resolve ) => {
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.src = './Vector.png'
			img.onload = () => {
				this.imgW = img.naturalWidth  || img.width  || 400
				this.imgH = img.naturalHeight || img.height || 360
				const off    = document.createElement( 'canvas' )
				off.width    = this.imgW
				off.height   = this.imgH
				const offCtx = off.getContext( '2d' )
				offCtx.drawImage( img, 0, 0 )
				this.imgData    = offCtx.getImageData( 0, 0, this.imgW, this.imgH ).data
				this._vectorImg = img   // conservé pour créer la texture Three.js dans init()
				resolve()
			}
			img.onerror = resolve   // graceful fallback - blobs will be skipped
		} )
	}

	async _fetchArtworkPool() {
		const wall = this._chaosWall
		wall.pool = LOCAL_BUTTERFLY_POOL
			.map( ( p ) => encodeURI( p ) )
			.sort( () => Math.random() - 0.5 )

		for ( const url of wall.pool ) {
			if ( wall.cache.has( url ) ) continue
			const img = new Image()
			img.crossOrigin = 'anonymous'
			img.onload = () => wall.cache.set( url, img )
			img.src = url
		}
	}

	_loadImageFromPool( urls, fit = 'cover' ) {
		if ( ! urls.length ) { this._switchToColor(); return }
		const url = urls[ Math.floor( Math.random() * urls.length ) ]
		new THREE.TextureLoader().load(
			url,
			( tex ) => {
				tex.colorSpace = THREE.SRGBColorSpace
				const img       = tex.image
				const vpAspect  = innerWidth / innerHeight
				const imgAspect = img.naturalWidth / img.naturalHeight
				if ( fit === 'contain' ) {
					// image entière visible, centrée — le mesh est réduit pour conserver l'aspect
					tex.repeat.set( 1, 1 )
					tex.offset.set( 0, 0 )
					const scaleX = vpAspect > imgAspect ? imgAspect / vpAspect : 1
					const scaleY = vpAspect > imgAspect ? 1 : vpAspect / imgAspect
					const containZoom = BUTTERFLY_SHARED_SCALE
					this._three.mesh.scale.set( scaleX * containZoom, scaleY * containZoom, 1 )
					// fond blanc hors image (multiply : blanc × canvas = canvas passe à travers)
					this._three.scene.background = new THREE.Color( 0xE8E8E8 )
				} else {
					// cover UV — l'image remplit tout le viewport, recadrée si nécessaire
					if ( vpAspect > imgAspect ) {
						tex.repeat.set( 1, imgAspect / vpAspect )
						tex.offset.set( 0, ( 1 - imgAspect / vpAspect ) / 2 )
					} else {
						tex.repeat.set( vpAspect / imgAspect, 1 )
						tex.offset.set( ( 1 - vpAspect / imgAspect ) / 2, 0 )
					}
					this._three.mesh.scale.set( 1, 1, 1 )
					this._three.scene.background = null
				}
				if ( this._three.imageTexture ) this._three.imageTexture.dispose()
				this._three.imageTexture      = tex
				this._three.mesh.material     = this._three.material   // sort du mode wriggle si actif
				this._three.material.map      = tex
				this._three.material.color.set( 0xE8E8E8 )
				this._three.material.needsUpdate = true
			},
			undefined,
			() => this._switchToColor(),
		)
	}

	_playVideo( url ) {
		const { video, material } = this._three
		this._three.mesh.material = material   // sort du mode wriggle si actif
		if ( this._three.overlayMesh ) this._three.overlayMesh.visible = false
		if ( this._three.overlayRenderer ) this._three.overlayRenderer.domElement.style.display = 'none'

		if ( this._three._onVideoCanPlay ) {
			video.removeEventListener( 'loadeddata', this._three._onVideoCanPlay )
			this._three._onVideoCanPlay = null
		}
		if ( this._three._onVideoError ) {
			video.removeEventListener( 'error', this._three._onVideoError )
			this._three._onVideoError = null
		}

		video.pause()
		video.src = url
		video.load()
		if ( this._three.videoTexture ) this._three.videoTexture.dispose()
		this._three.videoTexture = null
		material.map = null
		material.color.set( 0xE8E8E8 )
		material.needsUpdate = true

		const onVideoError = () => {
			video.removeEventListener( 'loadeddata', onVideoCanPlay )
			video.removeEventListener( 'error', onVideoError )
			this._three._onVideoCanPlay = null
			this._three._onVideoError = null
			this._switchToColor()
		}

		const onVideoCanPlay = () => {
			video.removeEventListener( 'loadeddata', onVideoCanPlay )
			video.removeEventListener( 'error', onVideoError )
			this._three._onVideoCanPlay = null
			this._three._onVideoError = null

			if ( this._three.videoTexture ) this._three.videoTexture.dispose()
			const tex = new THREE.VideoTexture( video )
			tex.colorSpace = THREE.SRGBColorSpace
			this._three.videoTexture = tex
			material.map = tex
			material.color.set( 0xE8E8E8 )
			material.needsUpdate = true
			video.play().catch( () => this._switchToColor() )
		}

		this._three._onVideoCanPlay = onVideoCanPlay
		this._three._onVideoError = onVideoError
		video.addEventListener( 'loadeddata', onVideoCanPlay, { once: true } )
		video.addEventListener( 'error', onVideoError, { once: true } )
	}

	_switchToColor() {
		const { video, material, mesh } = this._three
		mesh.material = material   // sort du mode wriggle si actif
		if ( this._three.overlayMesh ) this._three.overlayMesh.visible = false
		if ( this._three.overlayRenderer ) this._three.overlayRenderer.domElement.style.display = 'none'
		if ( this._three._onVideoCanPlay ) {
			video.removeEventListener( 'loadeddata', this._three._onVideoCanPlay )
			this._three._onVideoCanPlay = null
		}
		if ( this._three._onVideoError ) {
			video.removeEventListener( 'error', this._three._onVideoError )
			this._three._onVideoError = null
		}
		video.pause()
		video.src = ''
		video.load()
		if ( this._three.videoTexture ) {
			this._three.videoTexture.dispose()
			this._three.videoTexture = null
		}
		if ( this._three.imageTexture ) {
			this._three.imageTexture.dispose()
			this._three.imageTexture = null
		}
		material.map = null
		material.color.setStyle( BACKGROUND_COLORS[ this._bg.colorIdx ] )
		material.needsUpdate = true
		// reset mesh scale and scene background (peut avoir été modifié en mode contain)
		this._three.mesh.scale.set( 1, 1, 1 )
		this._three.scene.background = null
	}

	_applyBgColor() {
		if ( ! this._three ) return
		this._switchToColor()
	}

	_activateWriggle() {
		const three = this._three
		if ( ! three?.wriggleMaterial?.uniforms.uTex.value ) return
		const imgAspect = this.imgW / ( this.imgH || 1 )
		const vpAspect  = innerWidth / innerHeight
		const fitX      = vpAspect > imgAspect ? imgAspect / vpAspect : 1
		const fitY      = vpAspect > imgAspect ? 1 : vpAspect / imgAspect
		const shrink    = this._trackStage === 0 ? 0.53 : 0.40
		three.mesh.scale.set( fitX * shrink, fitY * shrink, 1 )
		three.scene.background = new THREE.Color( 0xf4f4f0 )
		three.mesh.material = three.wriggleMaterial
		if ( three.overlayMesh ) three.overlayMesh.visible = false
		if ( three.overlayRenderer ) three.overlayRenderer.domElement.style.display = 'none'
	}

	_activateTornadoWriggleOverlay() {
		const three = this._three
		if ( ! three?.overlayMesh || ! three?.wriggleMaterial?.uniforms.uTex.value ) return
		const imgAspect = this.imgW / ( this.imgH || 1 )
		const vpAspect  = innerWidth / innerHeight
		const fitX      = vpAspect > imgAspect ? imgAspect / vpAspect : 1
		const fitY      = vpAspect > imgAspect ? 1 : vpAspect / imgAspect
		const safeScale = BUTTERFLY_SHARED_SCALE * 0.82
		three.overlayMesh.scale.set( fitX * safeScale, fitY * safeScale, 1 )
		three.overlayMesh.visible = true
		if ( three.overlayRenderer ) three.overlayRenderer.domElement.style.display = 'block'
	}

	_advanceStage() {
		const next = ( this._trackStage + 1 ) % TRACK.length
		this._trackStage     = next
		this._kickCount      = 0
		this._lastKickTime   = -999
		this._skyWordIdx     = 0
		this._tornadoWordIdx = 0
		this._chaosWall.active = []
		if ( this._three?.overlayMesh ) this._three.overlayMesh.visible = false
		if ( this._three?.overlayRenderer ) this._three.overlayRenderer.domElement.style.display = 'none'
		this._chaosWall.prevKick = 0
		this._chaosWall.lastKickEdge = -999
		this._chaosWall.nextRevealAt = this.t
		const stage      = TRACK[ this._trackStage ]
		this.params.mode = stage.mode

		if ( stage.mode === 'mono'  ) { this.params.contraste = 14; this.params.flou = 8 }
		if ( stage.mode === 'chaos' ) {
			this.params.contraste = 1
			this.params.flou = 0
			// reset canvas pour un départ propre
			if ( this.canvas ) this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height )
			this._lorenz.trail = []
			// Initialise la particule du gribouillis au centre
			if ( stage.heavy && this.canvas ) {
				const cw = this.canvas.width
				const ch = this.canvas.height
				this._scribble = {
					x:      cw / 2 + ( Math.random() - 0.5 ) * cw * 0.4,
					y:      ch / 2 + ( Math.random() - 0.5 ) * ch * 0.4,
					angle:  Math.random() * Math.PI * 2,
					angVel: ( Math.random() - 0.5 ) * 0.1,
				}
			}
		}

		// mix-blend-mode géré dynamiquement dans _updateFilter selon la phase

		// fallback color index before potentially playing video (in case video fails)
		if      ( stage.bgType === 'white'   ) this._bg.colorIdx = 1
		else if ( stage.bgType === 'sky'     ) this._bg.colorIdx = 1
		else if ( stage.bgType === 'tornado' ) this._bg.colorIdx = 0
		else if ( stage.bgType === 'color'   ) this._bg.colorIdx = 0

		if      ( stage.bgType === 'white'   ) this._activateWriggle()
		else if ( stage.bgType === 'sky'     ) this._loadImageFromPool( [ './girlButterfly.png' ], 'cover' )
		else if ( stage.bgType === 'tornado' ) this._playVideo( './tornados.mp4' )
		else                                    this._switchToColor()

		if ( stage.heavy ) this._lorenz.maxTrail = 30000
		if ( stage.mode !== 'chaos' ) this._initBlobs()
	}

	_pushWallImage( img, revealAt ) {
		const wall = this._chaosWall
		const isHeavy = TRACK[ this._trackStage ]?.heavy ?? false
		const aspect  = img.naturalWidth / ( img.naturalHeight || 1 )
		const w = isHeavy ? ( 55 + Math.random() * 55 ) : ( 22 + Math.random() * 28 )
		const h = w / aspect
		wall.active.push( {
			img,
			x:   Math.random() * innerWidth,
			y:   Math.random() * innerHeight,
			w, h,
			rot: 0,
			t0:  revealAt,
			revealed: false,
		} )
		if ( wall.active.length > ( isHeavy ? 800 : 400 ) ) wall.active.shift()
	}

	_popImage( revealGap = 0.55 ) {
		const wall = this._chaosWall
		if ( ! wall.pool.length ) return
		const revealAt = Math.max( this.t, wall.nextRevealAt )
		wall.nextRevealAt = revealAt + revealGap
		const url = wall.pool[ wall.poolIdx % wall.pool.length ]
		wall.poolIdx++
		const cached = wall.cache.get( url )
		if ( cached?.naturalWidth ) {
			this._pushWallImage( cached, revealAt )
			return
		}
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.onload = () => {
			wall.cache.set( url, img )
			this._pushWallImage( img, revealAt )
		}
		img.src = url
	}

	_tryPopImageOnKick( threshold, edgeReset, kickGap, revealGap, burstCount = 1, burstGap = revealGap ) {
		const wall = this._chaosWall
		const kick = this.audio.kick
		const risingEdge = kick > threshold && wall.prevKick <= edgeReset
		if ( risingEdge && this.t - wall.lastKickEdge > kickGap ) {
			wall.lastKickEdge = this.t
			for ( let i = 0; i < burstCount; i++ ) {
				this._popImage( i === 0 ? revealGap : burstGap )
			}
		}
		wall.prevKick = kick
	}

	init() {
		// ── Three.js background — video plane ou couleur unie ─────────────────
		const renderer = new THREE.WebGLRenderer( { antialias: false } )
		renderer.setPixelRatio( 1 )
		renderer.setSize( innerWidth, innerHeight )
		renderer.domElement.style.cssText = 'position:fixed;inset:0;z-index:0;display:block;'
		document.body.appendChild( renderer.domElement )

		const overlayRenderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } )
		overlayRenderer.setPixelRatio( 1 )
		overlayRenderer.setSize( innerWidth, innerHeight )
		overlayRenderer.setClearColor( 0x000000, 0 )
		overlayRenderer.domElement.style.cssText = 'position:fixed;inset:0;z-index:1;display:none;pointer-events:none;mix-blend-mode:difference;'
		document.body.appendChild( overlayRenderer.domElement )

		const scene    = new THREE.Scene()
		const camera   = new THREE.OrthographicCamera( -1, 1, 1, -1, -4, 4 )
		const overlayScene = new THREE.Scene()
		const overlayCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, -4, 4 )
		const geo      = new THREE.PlaneGeometry( 2, 2, 120, 80 )
		const material = new THREE.MeshBasicMaterial( { color: 0x06060a } )
		const mesh     = new THREE.Mesh( geo, material )
		scene.add( mesh )

		const video = document.createElement( 'video' )
		video.loop   = true
		video.muted  = true
		video.setAttribute( 'playsinline', '' )

		const composer = new EffectComposer( renderer )
		const renderPass = new RenderPass( scene, camera )
		const bloomPass = new UnrealBloomPass( new THREE.Vector2( innerWidth, innerHeight ), 0.42, 0.55, 0.62 )
		const rgbShiftPass = new ShaderPass( RGBShiftShader )
		rgbShiftPass.uniforms.amount.value = 0.0008
		composer.addPass( renderPass )
		composer.addPass( bloomPass )
		composer.addPass( rgbShiftPass )

		this._three = {
			renderer,
			overlayRenderer,
			scene,
			camera,
			overlayScene,
			overlayCamera,
			mesh,
			material,
			imageTexture: null,
			video,
			videoTexture: null,
			composer,
			bloomPass,
			rgbShiftPass,
		}

		// ── Wriggle ShaderMaterial — butterfly PNG + displacement GLSL ───────────────
		const wriggleMat = new THREE.ShaderMaterial( {
			uniforms: {
				uTex:    { value: null },
				uTime:   { value: 0 },
				uKick:   { value: 0 },
				uVolume: { value: 0 },
				uFlapBoost: { value: 1.0 },
				uTransparent: { value: 0.0 },
			},
			vertexShader:   WRIGGLE_VERT,
			fragmentShader: WRIGGLE_FRAG,
			transparent: true,
		} )
		if ( this._vectorImg ) {
			const wTex = new THREE.Texture( this._vectorImg )
			wTex.colorSpace  = THREE.SRGBColorSpace
			wTex.needsUpdate = true
			wriggleMat.uniforms.uTex.value = wTex
			this._three.wriggleTex = wTex
		}
		this._three.wriggleMaterial = wriggleMat
		const overlayMesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2, 120, 80 ), wriggleMat )
		overlayMesh.visible = false
		overlayMesh.renderOrder = 2
		overlayScene.add( overlayMesh )
		this._three.overlayMesh = overlayMesh

		this._applyBgColor()
		if ( TRACK[ this._trackStage ]?.bgType === 'white' ) this._activateWriggle()

		// ── Canvas 2-D pour le rendu metaball (par-dessus le bg Three.js) ─────
		this.wrap = document.createElement( 'div' )
		this.wrap.style.cssText = 'position:fixed;inset:0;z-index:2;overflow:visible;'
		document.body.appendChild( this.wrap )

		this.canvas = document.createElement( 'canvas' )
		this.wrap.appendChild( this.canvas )
		this.ctx = this.canvas.getContext( '2d' )

		this._resize()
		addEventListener( 'resize', () => this._resize() )
		addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'ArrowRight' ) this._advanceStage()
		} )

		this._updateFilter()
		this._reSample()
	}

	warmup() { this._draw() }

	play() {
		const loop = () => {
			this._draw()
			this._raf = requestAnimationFrame( loop )
		}
		this._raf = requestAnimationFrame( loop )
	}

	stop() {
		cancelAnimationFrame( this._raf )
		this._raf = null
	}

	// ── Internal ───────────────────────────────────────────────────────────────

	_resize() {
		const dpr   = Math.min( devicePixelRatio, 2 )
		const bleed = 20   // px — dépasse le rayon du blur CSS pour éviter le vignetage noir aux bords
		this.canvas.width  = ( innerWidth  + bleed * 2 ) * dpr
		this.canvas.height = ( innerHeight + bleed * 2 ) * dpr
		this.canvas.style.cssText = `display:block;position:absolute;left:${-bleed}px;top:${-bleed}px;width:${innerWidth + bleed * 2}px;height:${innerHeight + bleed * 2}px;`
		if ( this._three ) {
			this._three.renderer.setSize( innerWidth, innerHeight )
			this._three.overlayRenderer?.setSize( innerWidth, innerHeight )
			this._three.composer?.setSize( innerWidth, innerHeight )
			this._three.bloomPass?.setSize( innerWidth, innerHeight )
		}
		if ( this._three?.mesh?.material === this._three?.wriggleMaterial ) this._activateWriggle()
		if ( this._three?.overlayMesh?.visible ) this._activateTornadoWriggleOverlay()
	}

	_updateFilter( dynContraste ) {
		const bgType       = TRACK[ this._trackStage ]?.bgType
		const tornadoText  = bgType === 'tornado' && this._tornadoWordIdx > 0
		const skyText      = bgType === 'sky'     && this._skyWordIdx     > 0
		const useWriggle   = this.params.mode === 'mono' && bgType !== 'sky' && bgType !== 'tornado' && !tornadoText

		// phases texte : mix-blend-mode difference + pas de filtre blur/contrast
		if ( skyText || tornadoText ) {
			this.wrap.style.mixBlendMode = 'difference'
			this.wrap.style.filter       = 'none'
			return
		}
		// sky avant le premier mot : pas de blend mode, l'image passe à travers le canvas transparent
		if ( bgType === 'sky' ) {
			this.wrap.style.mixBlendMode = ''
			this.wrap.style.filter       = 'none'
			return
		}
		// wriggle : shader Three.js, canvas transparent, pas de filtre
		if ( useWriggle ) {
			this.wrap.style.mixBlendMode = ''
			this.wrap.style.filter       = 'none'
			return
		}
		// tornado (avant texte) : PNG en difference par-dessus la video
		if ( bgType === 'tornado' && !tornadoText ) {
			this.wrap.style.mixBlendMode = 'difference'
			this.wrap.style.filter       = 'none'
			return
		}
		// tous les autres stages
		this.wrap.style.mixBlendMode = ''
		const { mode, flou, contraste } = this.params
		this.wrap.style.filter = ( mode === 'réseau' || mode === 'chaos' )
			? 'none'
			: `blur(${flou}px) contrast(${dynContraste ?? contraste})`
	}

	_renderThreeBg() {
		const t = this._three
		if ( ! t ) return
		if ( t.videoTexture && t.video?.readyState >= t.video.HAVE_CURRENT_DATA ) t.videoTexture.needsUpdate = true

		const bgType = TRACK[ this._trackStage ]?.bgType
		const isButterflyWriggle = this.params.mode === 'mono' && bgType === 'white' && t.mesh.material === t.wriggleMaterial
		const useButterflyFx = isButterflyWriggle

		if ( t.bloomPass ) {
			t.bloomPass.enabled = useButterflyFx
			if ( useButterflyFx ) {
				t.bloomPass.strength = 0.26 + this.audio.kick * 0.70 + this.audio.volumeSmooth * 0.22
				t.bloomPass.radius = 0.45 + this.audio.volumeSmooth * 0.20
				t.bloomPass.threshold = 0.62 - this.audio.volumeSmooth * 0.18
			}
		}
		if ( t.rgbShiftPass ) {
			t.rgbShiftPass.enabled = useButterflyFx
			if ( useButterflyFx ) {
				t.rgbShiftPass.uniforms.amount.value = 0.00055 + this.audio.kick * 0.0016 + this.audio.volumeSmooth * 0.0007
			}
		}

		t.composer?.render()
		if ( t.overlayRenderer ) {
			if ( t.overlayMesh?.visible ) {
				t.overlayRenderer.render( t.overlayScene, t.overlayCamera )
			} else {
				t.overlayRenderer.clear()
			}
		}
	}

	_reSample() {
		if ( ! this.imgData ) return
		this.samplePts   = []
		this.cumWeights  = []
		this.totalWeight = 0
		const { seuil } = this.params
		const step = 3
		for ( let py = 0; py < this.imgH; py += step ) {
			for ( let px = 0; px < this.imgW; px += step ) {
				const i = ( py * this.imgW + px ) * 4
				if ( this.imgData[ i + 3 ] < 30 ) continue           // transparent pixel
				const brightness = ( this.imgData[ i ] + this.imgData[ i + 1 ] + this.imgData[ i + 2 ] ) / 3
				const darkness   = 1 - brightness / 255
				if ( darkness < seuil ) continue
				const w = Math.sqrt( darkness )
				this.totalWeight += w
				this.samplePts.push( { normX: px / this.imgW, normY: py / this.imgH, darkness } )
				this.cumWeights.push( this.totalWeight )
			}
		}
		this._initBlobs()
	}

	_weightedSample() {
		const r  = Math.random() * this.totalWeight
		let lo   = 0
		let hi   = this.cumWeights.length - 1
		while ( lo < hi ) {
			const mid = ( lo + hi ) >> 1
			this.cumWeights[ mid ] < r ? ( lo = mid + 1 ) : ( hi = mid )
		}
		return this.samplePts[ lo ]
	}

	_initBlobs() {
		if ( ! this.samplePts.length ) return
		this.blobs = []
		const n = Math.round( this.params.blobs )
		for ( let i = 0; i < n; i++ ) {
			const p = this._weightedSample()
			this.blobs.push( {
				normX:      p.normX + ( Math.random() - 0.5 ) * 0.005,
				normY:      p.normY + ( Math.random() - 0.5 ) * 0.005,
				darkness:   p.darkness,
				baseR:      0.5 + Math.random() * 0.9,
				pulseFreq:  0.5 + Math.random() * 1.5,
				pulsePhase: Math.random() * Math.PI * 2,
				color:      PALETTE[ Math.floor( Math.random() * PALETTE.length ) ],
			} )
		}
	}

	// ── Drawing ────────────────────────────────────────────────────────────────

	_drawBlob( x, y, r, d, color ) {
		const size = r * ( 0.22 + 0.78 * d )
		const grad = this.ctx.createRadialGradient( x, y, 0, x, y, size )
		if ( this.params.mode === 'couleur' ) {
			grad.addColorStop( 0.00, color + 'ff' )
			grad.addColorStop( 0.50, color + 'ee' )
			grad.addColorStop( 1.00, color + '00' )
		} else {
			// dark on white - CSS blur+contrast snaps to clean metaballs
			grad.addColorStop( 0.00, 'hsla(220, 8%, 10%, 1.00)' )
			grad.addColorStop( 0.55, 'hsla(220, 6%, 12%, 0.85)' )
			grad.addColorStop( 1.00, 'hsla(220, 4%, 15%, 0.00)' )
		}
		this.ctx.beginPath()
		this.ctx.arc( x, y, size, 0, Math.PI * 2 )
		this.ctx.fillStyle = grad
		this.ctx.fill()
	}

	_drawReseau( dynVitesse, kickMult, freqs, dynDisplaySeuil ) {
		const { canvas, ctx, params, blobs, t } = this

		// temporal trail
		ctx.fillStyle = 'rgba(0, 0, 0, 0.07)'
		ctx.fillRect( 0, 0, canvas.width, canvas.height )
		if ( ! blobs.length ) return

		// audio-driven seuil (from _draw) + oscillation for réseau breathing
		const wave2     = Math.sin( t * 0.53 * dynVitesse + 1.3 )
		const dynCount  = Math.round( blobs.length * ( 1 - params.variation * 0.4 * ( wave2 * 0.5 + 0.5 ) ) )
		const active    = blobs.filter( b => b.darkness >= dynDisplaySeuil ).slice( 0, dynCount )

		const scale     = Math.min( canvas.width * BUTTERFLY_SHARED_SCALE / this.imgW, canvas.height * BUTTERFLY_SHARED_SCALE / this.imgH )
		const ox        = ( canvas.width  - this.imgW * scale ) / 2
		const oy        = ( canvas.height - this.imgH * scale ) / 2
		const minDist   = Math.min( canvas.width, canvas.height ) * 0.02
		const maxDist   = Math.min( canvas.width, canvas.height ) * 0.18
		const minDistSq = minDist * minDist
		const maxDistSq = maxDist * maxDist

		// positions with frequency-driven jitter
		const pts = active.map( b => {
			const binIdx    = Math.min( freqs.length - 1, Math.floor( b.normX * freqs.length * 0.8 ) )
			const freqJit   = 1 + freqs[ binIdx ] * 0.6 * kickMult
			return {
				x: b.normX * this.imgW * scale + ox
					+ Math.sin( t * b.pulseFreq * dynVitesse + b.pulsePhase ) * 5 * params.taille * freqJit,
				y: b.normY * this.imgH * scale + oy
					+ Math.cos( t * b.pulseFreq * dynVitesse * 0.7 + b.pulsePhase ) * 5 * params.taille * freqJit,
				d: b.darkness,
			}
		} )

		// arcs amples entre points éloignés
		for ( let i = 0; i < pts.length; i++ ) {
			let conn = 0
			for ( let j = i + 1; j < pts.length; j++ ) {
				if ( conn >= 2 ) break
				const dx     = pts[ j ].x - pts[ i ].x
				const dy     = pts[ j ].y - pts[ i ].y
				const distSq = dx * dx + dy * dy
				if ( distSq > minDistSq && distSq < maxDistSq ) {
					const dist  = Math.sqrt( distSq )
					const alpha = ( 1 - dist / maxDist ) * 0.25
					ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed( 3 )})`
					ctx.lineWidth   = 0.3
					const mx   = ( pts[ i ].x + pts[ j ].x ) / 2
					const my   = ( pts[ i ].y + pts[ j ].y ) / 2
					const sign = ( i + j ) % 2 === 0 ? 1 : -1
					const bend = dist * 1.3 * sign
					ctx.beginPath()
					ctx.moveTo( pts[ i ].x, pts[ i ].y )
					ctx.quadraticCurveTo(
						mx - ( dy / dist ) * bend,
						my + ( dx / dist ) * bend,
						pts[ j ].x, pts[ j ].y,
					)
					ctx.stroke()
					conn++
				}
			}
		}

		// dots
		for ( let i = 0; i < pts.length; i++ ) {
			const b = active[ i ]
			const r = ( 1.2 + b.darkness * 2.5 ) * params.taille * kickMult
			ctx.fillStyle = `rgba(255,255,255,${( 0.5 + b.darkness * 0.5 ).toFixed( 2 )})`
			ctx.beginPath()
			ctx.arc( pts[ i ].x, pts[ i ].y, r, 0, Math.PI * 2 )
			ctx.fill()
		}

		// ── Pop image sur chaque kick ─────────────────────────────────────────
		const wall = this._chaosWall
		const dpr  = Math.min( devicePixelRatio, 2 )
		this._tryPopImageOnKick( 0.16, 0.11, 1.0, 0.002, 80, 0.001 )

		// ── Mur d'images par dessus le réseau ────────────────────────────────
		let revealsThisFrame = 0
		const maxRevealsPerFrame = 1
		for ( const im of wall.active ) {
			if ( ! im.revealed ) {
				if ( this.t < im.t0 || revealsThisFrame >= maxRevealsPerFrame ) continue
				im.revealed = true
				revealsThisFrame++
			}
			const w      = im.w * dpr
			const h      = im.h * dpr
			ctx.save()
			ctx.globalAlpha = 1
			ctx.translate( im.x * dpr, im.y * dpr )
			ctx.rotate( im.rot )
			ctx.scale( 1, 1 )
			ctx.drawImage( im.img, -w / 2, -h / 2, w, h )
			ctx.restore()
		}
	}

	_drawTornadoText() {
		const { canvas, ctx } = this
		const WORDS = [ 'EVERYTHING', 'REACTS.' ]

		// Fond transparent — la vidéo tornado montre à travers, le texte clair se pose dessus
		ctx.clearRect( 0, 0, canvas.width, canvas.height )

		ctx.save()
		ctx.textAlign    = 'left'
		ctx.textBaseline = 'middle'
		ctx.fillStyle    = '#f0ece4'

		let size = Math.round( canvas.height * 0.12 )
		ctx.font = `${size}px 'HelveticaNow', Helvetica, Arial, sans-serif`
		let gap    = size * 0.32
		let ws     = WORDS.map( w => ctx.measureText( w ).width )
		let totalW = ws.reduce( ( a, b ) => a + b, 0 ) + gap * ( WORDS.length - 1 )
		const maxW = canvas.width * 0.92
		if ( totalW > maxW ) {
			const ratio = maxW / totalW
			size   = Math.round( size * ratio )
			ctx.font = `${size}px 'HelveticaNow', Helvetica, Arial, sans-serif`
			gap    = size * 0.32
			ws     = WORDS.map( w => ctx.measureText( w ).width )
			totalW = ws.reduce( ( a, b ) => a + b, 0 ) + gap * ( WORDS.length - 1 )
		}

		let x = ( canvas.width - totalW ) / 2
		const y = canvas.height / 2
		for ( let i = 0; i < Math.min( this._tornadoWordIdx, WORDS.length ); i++ ) {
			ctx.fillText( WORDS[ i ], x, y )
			x += ws[ i ] + gap
		}
		ctx.restore()
	}

	_drawSkyText() {
		const { canvas, ctx } = this
		const WORDS = [ 'NOTHING', 'IS', 'ISOLATED.' ]

		// Canvas transparent — l'image butterfly passe normalement, seul le texte se blende en difference
		ctx.clearRect( 0, 0, canvas.width, canvas.height )

		if ( ! this._skyWordIdx ) return

		ctx.save()
		ctx.textAlign    = 'left'
		ctx.textBaseline = 'middle'
		ctx.fillStyle    = '#9C8484'   // blanc : difference sur l'image = couleurs inversées sous le texte

		// Taille auto-fit : part de 12 % hauteur, réduit si la phrase entière dépasse 92 % largeur
		let size = Math.round( canvas.height * 0.12 )
		ctx.font = `${size}px 'HelveticaNow', Helvetica, Arial, sans-serif`
		let gap    = size * 0.32
		let ws     = WORDS.map( w => ctx.measureText( w ).width )
		let totalW = ws.reduce( ( a, b ) => a + b, 0 ) + gap * ( WORDS.length - 1 )
		const maxW = canvas.width * 0.92
		if ( totalW > maxW ) {
			const ratio = maxW / totalW
			size   = Math.round( size * ratio )
			ctx.font = `${size}px 'HelveticaNow', Helvetica, Arial, sans-serif`
			gap    = size * 0.32
			ws     = WORDS.map( w => ctx.measureText( w ).width )
			totalW = ws.reduce( ( a, b ) => a + b, 0 ) + gap * ( WORDS.length - 1 )
		}

		// Les mots se révèlent de gauche à droite, alignés sur la phrase complète centrée
		let x = ( canvas.width - totalW ) / 2
		const y = canvas.height / 2
		for ( let i = 0; i < Math.min( this._skyWordIdx, WORDS.length ); i++ ) {
			ctx.fillText( WORDS[ i ], x, y )
			x += ws[ i ] + gap
		}
		ctx.restore()
	}

	_drawIntroText() {
		const { canvas, ctx } = this
		const lines = [

			'* THE BUTTERFLY EFFECT:',
			'THE SENSITIVE DEPENDENCE',
			'ON INITIAL CONDITIONS',
			'IN WHICH A SMALL',
			'CHANGE IN ONE STATE',
			'OF A SYSTEM CAN RESULT IN',
			'LARGE DIFFERENCES IN A',
			'LATER STATE.',
		]

		ctx.save()
		ctx.textAlign    = 'left'
		ctx.textBaseline = 'alphabetic'
		const introColor = 'rgba(0, 0, 0, 0.045)'
		const starColor  = 'rgba(220, 36, 36, 0.90)'
		ctx.fillStyle    = introColor

		let size = Math.round( canvas.height * 0.112 )
		ctx.font = `${size}px 'HelveticaNowLight', 'Helvetica Neue', Helvetica, Arial, sans-serif`
		let maxW = 0
		for ( const line of lines ) maxW = Math.max( maxW, ctx.measureText( line ).width )
		const targetW = canvas.width * 0.92
		if ( maxW > targetW ) {
			const ratio = targetW / maxW
			size = Math.round( size * ratio )
			ctx.font = `${size}px 'HelveticaNowLight', 'Helvetica Neue', Helvetica, Arial, sans-serif`
		}

		const drawJustifiedLine = ( line, x, y, width ) => {
			const words = line.trim().split( /\s+/ ).filter( Boolean )
			if ( words.length > 1 ) {
				const wordsW = words.reduce( ( sum, w ) => sum + ctx.measureText( w ).width, 0 )
				const gap = ( width - wordsW ) / ( words.length - 1 )
				let cx = x
				for ( let i = 0; i < words.length; i++ ) {
					ctx.fillStyle = words[ i ].includes( '*' ) ? starColor : introColor
					ctx.fillText( words[ i ], cx, y )
					cx += ctx.measureText( words[ i ] ).width + gap
				}
				ctx.fillStyle = introColor
				return
			}

			const chars = [ ...line ]
			if ( chars.length <= 1 ) {
				ctx.fillText( line, x, y )
				return
			}
			const charsW = chars.reduce( ( sum, ch ) => sum + ctx.measureText( ch ).width, 0 )
			const gap = ( width - charsW ) / ( chars.length - 1 )
			let cx = x
			for ( const ch of chars ) {
				ctx.fillStyle = ch === '*' ? starColor : introColor
				ctx.fillText( ch, cx, y )
				cx += ctx.measureText( ch ).width + gap
			}
			ctx.fillStyle = introColor
		}

		const lineGap = size * 0.07
		const blockH  = lines.length * ( size + lineGap )
		let y = ( canvas.height - blockH ) * 0.52 + size
		const x = canvas.width * 0.04
		for ( const line of lines ) {
			drawJustifiedLine( line, x, y, targetW )
			y += size + lineGap
		}
		ctx.restore()
	}

	_drawChaos( dynVitesse, kickMult, freqs ) {
		const { canvas, ctx } = this
		const a       = this.audio
		const l       = this._lorenz
		const wall    = this._chaosWall
		const dpr     = Math.min( devicePixelRatio, 2 )
		const isHeavy = TRACK[ this._trackStage ]?.heavy ?? false

		if ( isHeavy ) {
			// ── MODE GRIBOUILLI — particule errante, lignes fines, permanent ───────
			// Fondu quasi nul — les traits restent indéfiniment
			ctx.fillStyle = 'rgba(0,0,0,0.001)'
			ctx.fillRect( 0, 0, canvas.width, canvas.height )

			const sc  = this._scribble
			// Vitesse de base très lente, accélère sur les kicks
			const spd = canvas.width * ( 0.02 + a.volumeSmooth * 0.008 + a.kick * 0.020 )
			// 2 segments de base, +3 sur les gros kicks
			const nSteps = 2 + ( a.kick > 0.5 ? 3 : 0 )

			ctx.globalCompositeOperation = 'lighter'
			ctx.strokeStyle = `rgba(255,255,255,${( 0.22 + a.kick * 0.45 ).toFixed( 3 )})`
			ctx.lineWidth   = 2.4 + a.kick * 1.6
			ctx.lineCap     = 'round'
			ctx.beginPath()
			ctx.moveTo( sc.x, sc.y )

			for ( let s = 0; s < nSteps; s++ ) {
				// Marche aléatoire angulaire avec momentum
				sc.angVel += ( Math.random() - 0.5 ) * 0.18
				sc.angVel *= 0.91
				sc.angle  += sc.angVel
				// Changement de direction brusque occasionnel
				if ( Math.random() < 0.015 ) sc.angle += ( Math.random() - 0.5 ) * Math.PI * 1.8
				// Déplacement
				sc.x += Math.cos( sc.angle ) * spd
				sc.y += Math.sin( sc.angle ) * spd
				// Rebond sur les bords
				if ( sc.x < 0 )             { sc.x = 0;             sc.angle = Math.PI - sc.angle }
				if ( sc.x > canvas.width  ) { sc.x = canvas.width;  sc.angle = Math.PI - sc.angle }
				if ( sc.y < 0 )             { sc.y = 0;             sc.angle = -sc.angle }
				if ( sc.y > canvas.height ) { sc.y = canvas.height; sc.angle = -sc.angle }
				ctx.lineTo( sc.x, sc.y )
			}
			ctx.stroke()
			ctx.globalCompositeOperation = 'source-over'

		} else {
			// ── MODE LORENZ NORMAL — attracteur papillon coloré ────────────────
			const σ  = 10, ρ = 28, β = 8 / 3
			const dt = 0.005 * ( 1 + a.volumeSmooth * 0.8 ) * dynVitesse
			for ( let s = 0; s < 5; s++ ) {
				const { x, y, z } = l
				l.x += σ * ( y - x ) * dt
				l.y += ( x * ( ρ - z ) - y ) * dt
				l.z += ( x * y - β * z ) * dt
				const sx = ( l.x / 35 * 0.85 + 0.5 ) * canvas.width
				const sy = ( 1 - ( l.z - 2 ) / 58 ) * canvas.height * 0.88 + canvas.height * 0.06
				l.trail.push( [ sx, sy ] )
			}
			if ( l.trail.length > l.maxTrail ) l.trail.splice( 0, l.trail.length - l.maxTrail )
			ctx.clearRect( 0, 0, canvas.width, canvas.height )
			const trail   = l.trail
			const n       = trail.length
			const BUCKETS = 18
			if ( n > 2 ) {
				for ( let b = 0; b < BUCKETS; b++ ) {
					const i0  = Math.floor( b / BUCKETS * n )
					const i1  = Math.floor( ( b + 1 ) / BUCKETS * n )
					if ( i1 <= i0 ) continue
					const age   = ( b + 1 ) / BUCKETS
					const alpha = age * age * 0.82
					const hue   = 28 + age * 28 + ( freqs[ Math.floor( age * 40 ) ] || 0 ) * 18
					ctx.beginPath()
					ctx.strokeStyle = `hsla(${hue.toFixed( 0 )}, 85%, ${( 38 + age * 26 ).toFixed( 0 )}%, ${alpha.toFixed( 3 )})`
					ctx.lineWidth   = 0.4 + age * 1.8 * kickMult
					ctx.moveTo( trail[ i0 ][ 0 ], trail[ i0 ][ 1 ] )
					for ( let i = i0 + 1; i < i1; i++ ) ctx.lineTo( trail[ i ][ 0 ], trail[ i ][ 1 ] )
					ctx.stroke()
				}
			}
		}

		// ── Pop image sur chaque kick ─────────────────────────────────────────
		this._tryPopImageOnKick( 0.16, 0.11, isHeavy ? 0.8 : 1.0, isHeavy ? 0.0015 : 0.002, isHeavy ? 120 : 80, isHeavy ? 0.001 : 0.001 )

		// ── Mur d'images par dessus le tracé ─────────────────────────────────
		let revealsThisFrame = 0
		const maxRevealsPerFrame = 1
		for ( const im of wall.active ) {
			if ( ! im.revealed ) {
				if ( this.t < im.t0 || revealsThisFrame >= maxRevealsPerFrame ) continue
				im.revealed = true
				revealsThisFrame++
			}
			const w = im.w * dpr
			const h = im.h * dpr
			ctx.save()
			ctx.globalAlpha = 1
			ctx.translate( im.x * dpr, im.y * dpr )
			ctx.rotate( im.rot )
			ctx.scale( 1, 1 )
			ctx.drawImage( im.img, -w / 2, -h / 2, w, h )
			ctx.restore()
		}
	}

	_draw() {
		const { canvas, ctx, params, blobs } = this
		const a = this.audio
		const bgType = TRACK[ this._trackStage ]?.bgType
		const minKickGap = bgType === 'sky' ? 3.2 : 10
		const minKickVal = bgType === 'sky' ? 0.26 : 0.4

		// ── track stage advancement — count significant kicks ────────────────
		if ( a.kick > minKickVal && this.t - this._lastKickTime > minKickGap ) {
			this._lastKickTime = this.t
			// sky : chaque kick révèle le mot suivant
			if ( bgType === 'sky' ) {
				this._skyWordIdx = Math.min( this._skyWordIdx + 1, 3 )
			}
			// tornado : après textAfterKick kicks, révèle les mots de la 2e phase
			if ( bgType === 'tornado' ) {
				const { textAfterKick } = TRACK[ this._trackStage ]
				if ( textAfterKick && this._kickCount + 1 >= textAfterKick ) {
					this._tornadoWordIdx = Math.min( this._tornadoWordIdx + 1, 2 )
				}
			}
			this._kickCount++
			const stage = TRACK[ this._trackStage ]
			if ( stage.kicksToNext && this._kickCount >= stage.kicksToNext ) {
				this._advanceStage()
			}
		}

		// ── sound-driven modulation ──────────────────────────────────────────
		// Pulse amplitude swells with loudness
		const dynPulseAmp = params.pulseAmp + a.volumeSmooth * 0.32
		// Speed increases with loudness
		const dynVitesse  = params.vitesse  * ( 1 + a.volumeSmooth * 0.7 )
		// Sharp size burst on kick
		const kickMult    = 1 + a.kick * 0.55 + a.kickHard * 0.35
		// Per-frequency bin values for per-blob reactivity
		const freqs       = a.volumeByFrequency

		const dynContraste = params.mode === 'mono'
			? params.contraste + a.volumeSmooth * 6 + a.kick * 5
			: params.mode === 'couleur'
				? params.contraste + a.volumeSmooth * 1.5 + a.kick * 1.2
				: params.contraste

		const dynDisplaySeuil = params.seuil + ( 1 - a.volumeSmooth ) * 0.45

		this._updateFilter( dynContraste )

		if ( params.mode === 'chaos' ) {
			this._drawChaos( dynVitesse, kickMult, freqs )
		} else if ( params.mode === 'réseau' ) {
			this._drawReseau( dynVitesse, kickMult, freqs, dynDisplaySeuil )
		} else {
			const bgType = TRACK[ this._trackStage ]?.bgType
			if ( bgType === 'sky' ) {
				this._drawSkyText()
			} else if ( bgType === 'tornado' && this._tornadoWordIdx > 0 ) {
				if ( this._three?.overlayMesh ) this._three.overlayMesh.visible = false
				if ( this._three?.overlayRenderer ) this._three.overlayRenderer.domElement.style.display = 'none'
				this._drawTornadoText()
			} else if ( bgType === 'tornado' ) {
				ctx.clearRect( 0, 0, canvas.width, canvas.height )
				this._activateTornadoWriggleOverlay()
				const m = this._three?.wriggleMaterial
				if ( m ) {
					m.uniforms.uTime.value   = 0.0
					m.uniforms.uKick.value   = 0.0
					m.uniforms.uVolume.value = 0.0
					m.uniforms.uFlapBoost.value = 0.0
					m.uniforms.uTransparent.value = 1.0
				}
			} else {
				ctx.clearRect( 0, 0, canvas.width, canvas.height )
				this._activateWriggle()
				const m = this._three?.wriggleMaterial
				if ( m ) {
					m.uniforms.uTime.value   = this.t
					m.uniforms.uKick.value   = a.kick
					m.uniforms.uVolume.value = a.volumeSmooth
					m.uniforms.uFlapBoost.value = 1.0
					m.uniforms.uTransparent.value = 0.0
				}
				if ( bgType === 'white' && this._trackStage === 0 ) this._drawIntroText()
			}
		}

		this._renderThreeBg()
		this.t += 0.16
	}

}

// ── Bootstrap ────────────────────────────────────────────────────────────────

const audio = new Analyzer()
const scene = new ButterflyBlobsScene( audio )

audio.onLoad( async () => {
	await scene.load()
	scene.init()
} )
audio.onWarmup( () => scene.warmup() )
audio.onPlay(   () => scene.play()   )
audio.onStop(   () => scene.stop()   )
