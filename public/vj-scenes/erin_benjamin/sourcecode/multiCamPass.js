import * as THREE from 'three'
import { FullScreenQuad, Pass } from 'three/addons/postprocessing/Pass.js'

// VJ control-room cut with organic frames: the screen is a 4-region Voronoi
// partition- one region per camera, so each plan stays big and readable-
// whose borders are irregular polygon seams instead of straight grid lines.
// The feeds: the live rig camera (the director keeps cutting it) plus three
// slow independent orbits. reroll() (called by PostFX on each event start)
// re-scatters the region sites (jittered + shuffled quadrant anchors, so
// every feed keeps real estate) and rolls fresh orbits.
//
// Two steps per frame: the four feeds render into the quadrants of one
// half-res atlas (total fill ≈ one full-res render), then a fullscreen quad
// picks the feed per pixel from the shard's hash. Sits in the composer where
// RenderPass sits and honors the same contract (renders into readBuffer,
// needsSwap false)- trails/lens/output then apply to the mosaic. Selective
// bloom is gated off while this runs (postfx.js): its layer render only
// matches the live camera's single angle.
const CompositeShader = {
	uniforms: {
		atlas: { value: null },
		sites: { value: [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()] },
		aspect: { value: 1 },
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform sampler2D atlas;
		uniform vec2 sites[ 4 ];
		uniform float aspect;
		varying vec2 vUv;
		void main() {
			// 4-region Voronoi: the pixel belongs to its nearest site's feed.
			// Aspect-corrected so the borders keep their angles on any window.
			// No seam decoration- the feeds meet edge to edge, the cut alone
			// separates the plans.
			vec2 p = vec2( vUv.x * aspect, vUv.y );
			int feed = 0;
			float d1 = 8.0;
			for ( int i = 0; i < 4; i++ ) {
				float dd = distance( p, vec2( sites[ i ].x * aspect, sites[ i ].y ) );
				if ( dd < d1 ) { d1 = dd; feed = i; }
			}
			// Each region shows the whole frame of its feed, stored in the atlas
			// quadrant matching the feed index.
			vec2 quad = vec2( mod( float( feed ), 2.0 ), floor( float( feed ) * 0.5 ) ) * 0.5;
			gl_FragColor = vec4( texture2D( atlas, vUv * 0.5 + quad ).rgb, 1.0 );
		}
	`,
}

export default class MultiCamPass extends Pass {

	// `source`: a twin pass to mirror. The bloom composer runs a second
	// instance over the body layer only- it shares the master's layout
	// (sites array by reference, specs and clock read live) so both mosaics
	// stay pixel-aligned, while owning its atlas (the buffers differ in size).
	constructor(scene, camera, source = null) {
		super()
		this.scene = scene
		this.camera = camera   // the live rig camera (feed 0)
		this.source = source
		this.anchor = null     // the body (hips bone)- wired by the scene; orbit feeds LOOK AT him
		this.lookScratch = new THREE.Vector3()
		this.needsSwap = false
		this.time = 0
		this.cam2 = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
		this.atlas = new THREE.WebGLRenderTarget(1, 1)
		this.quad = new FullScreenQuad(new THREE.ShaderMaterial({
			uniforms: THREE.UniformsUtils.clone(CompositeShader.uniforms),
			vertexShader: CompositeShader.vertexShader,
			fragmentShader: CompositeShader.fragmentShader,
		}))
		this.quad.material.uniforms.atlas.value = this.atlas.texture
		if (source) this.quad.material.uniforms.sites.value = source.quad.material.uniforms.sites.value
		else this.reroll()
	}

	// Fresh region layout + three fresh slow orbits (near silhouette to
	// lost-in-the-sky wide). Sites are jittered quadrant anchors, shuffled so
	// the live feed lands in a different corner each time- every feed keeps a
	// big readable region, but the borders and the layout never repeat.
	reroll() {
		const anchors = [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]
		for (let i = anchors.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[anchors[i], anchors[j]] = [anchors[j], anchors[i]]
		}
		const sites = this.quad.material.uniforms.sites.value
		for (let i = 0; i < 4; i++) {
			sites[i].set(
				anchors[i][0] + (Math.random() * 2 - 1) * 0.16,
				anchors[i][1] + (Math.random() * 2 - 1) * 0.16,
			)
		}
		this.specs = [1, 2, 3].map(() => ({
			radius: 2 + Math.random() * 9,
			height: -1.5 + Math.random() * 4.5,
			lookY: -0.3 + Math.random() * 0.6,
			speed: (Math.random() < 0.5 ? -1 : 1) * (0.04 + Math.random() * 0.1),
			phase: Math.random() * Math.PI * 2,
		}))
	}

	render(renderer, writeBuffer, readBuffer /* , deltaTime */) {
		// A twin mirrors the master's clock, layout AND anchor- and the clock
		// is advanced externally (PostFX.render), so the bloom mosaic and the
		// main mosaic render the exact same instant.
		const src = this.source ?? this
		const w = readBuffer.width
		const h = readBuffer.height
		if (this.atlas.width !== w || this.atlas.height !== h) this.atlas.setSize(w, h)
		const hw = Math.floor(w / 2)
		const hh = Math.floor(h / 2)
		const oldAutoClear = renderer.autoClear
		renderer.autoClear = false

		// Step 1: the four feeds, each a full frame at half res in its quadrant.
		// The orbit feeds track the BODY, not the world origin- the animation
		// and the drift swing him around the pivot, and the close framings
		// would lose him otherwise. Compose his bone chain once for the frame.
		if (src.anchor) {
			src.anchor.updateWorldMatrix(true, false)
			this.lookScratch.setFromMatrixPosition(src.anchor.matrixWorld)
		} else {
			this.lookScratch.set(0, 0, 0)
		}
		const sites = this.quad.material.uniforms.sites.value
		this.cam2.aspect = this.camera.aspect
		// Match the live camera's layer mask: the bloom twin renders while the
		// caller has masked the camera to the body layer- the orbit feeds must
		// see the same world slice.
		this.cam2.layers.mask = this.camera.layers.mask
		for (let i = 0; i < 4; i++) {
			const x = (i % 2) * hw
			const y = Math.floor(i / 2) * hh
			this.atlas.viewport.set(x, y, hw, hh)
			this.atlas.scissor.set(x, y, hw, hh)
			this.atlas.scissorTest = true
			renderer.setRenderTarget(this.atlas)
			renderer.clear()
			let cam = this.camera
			if (i > 0) {
				const s = src.specs[i - 1]
				const angle = s.phase + src.time * s.speed * Math.PI * 2
				this.cam2.position.set(Math.sin(angle) * s.radius, s.height, Math.cos(angle) * s.radius)
				// lookY keeps its role as a small per-feed framing offset.
				this.cam2.lookAt(this.lookScratch.x, this.lookScratch.y + s.lookY, this.lookScratch.z)
				cam = this.cam2
			}
			// Lens shift: skew the projection so what the camera aims at lands
			// at its OWN pane's screen position (the region site)- the pane then
			// shows its subject centered, whatever corner of the frame it covers.
			// A view-center point projects to ndc (-e8, -e9), so e8/e9 get the
			// negated site in ndc. The live camera is rebuilt clean after the loop.
			cam.updateProjectionMatrix()
			const e = cam.projectionMatrix.elements
			e[8] = -(sites[i].x * 2 - 1)
			e[9] = -(sites[i].y * 2 - 1)
			renderer.render(this.scene, cam)
		}
		this.camera.updateProjectionMatrix()   // drop the live feed's lens shift- the main pipeline reuses this camera
		this.atlas.scissorTest = false
		this.atlas.viewport.set(0, 0, w, h)
		this.atlas.scissor.set(0, 0, w, h)

		// Step 2: shard-composite the feeds into the composer's buffer.
		this.quad.material.uniforms.aspect.value = this.camera.aspect
		renderer.setRenderTarget(this.renderToScreen ? null : readBuffer)
		this.quad.render(renderer)
		renderer.autoClear = oldAutoClear
	}

}
