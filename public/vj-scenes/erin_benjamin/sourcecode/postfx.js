import * as THREE from 'three'
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

import { BLOOM_LAYER } from './config.js'

const _clearScratch = new THREE.Color()
const _projScratch = new THREE.Vector3()
import MultiCamPass from './multiCamPass.js'
import BloomMergeShader from './shaders/BloomMergeShader.js'
import LensShader from './shaders/LensShader.js'

// Trails are a smear by nature- accumulating them at half resolution with a
// linear upscale reads the same while costing a quarter of the fill, and the
// pass only ever draws fullscreen quads so its targets never need depth.
// setSize is the single owner of the halving so window resizes keep the policy.
class HalfResAfterimagePass extends AfterimagePass {

	constructor(damp) {
		super(damp)
		for (const target of [this._textureComp, this._textureOld]) {
			target.depthBuffer = false
			target.texture.magFilter = THREE.LinearFilter
		}
	}

	setSize(width, height) {
		super.setSize(Math.max(1, Math.round(width / 2)), Math.max(1, Math.round(height / 2)))
	}

}

// The postprocessing chain: selective bloom (body layer only, merged additively
// over the base render), afterimage trails, RGB shift and a fisheye lens.
export default class PostFX {

	constructor(renderer, scene, camera, params) {
		this.renderer = renderer
		this.scene = scene
		this.camera = camera
		this.params = params

		// Echo event: the body layer alone, on transparent black- the lens pass
		// composites its growing copies around the real body (see LensShader).
		// Rendered per-frame in render() only while the event runs.
		this.echoTarget = new THREE.WebGLRenderTarget(1, 1)
		this._echoActive = false
		this.echoAnchor = null   // the body pivot- wired by the scene after init
		// Hidden during the echo layer render: the crowd clones and the twin
		// share the body's layer (for bloom), but the Droste copies must repeat
		// the HERO alone- stacked events would get echoed too otherwise.
		this.echoExclude = []
		this._echoExcludeVis = []

		this.bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.6, 0.0)   // strength, radius, threshold

		// Bloom composer: renders only BLOOM_LAYER (body) into a render target.
		// Camera layer mask is flipped per-frame in render() so the sky is excluded.
		// HALF resolution: bloom is a blur by nature- the halved pipeline (scene
		// pass + UnrealBloom's mip chain) is visually identical for a glow and
		// costs a quarter of the fragments.
		this.bloomComposer = new EffectComposer(renderer)
		this.bloomComposer.setPixelRatio(Math.min(devicePixelRatio, params.quality.renderScale) / 2)
		this.bloomComposer.setSize(innerWidth, innerHeight)
		this.bloomComposer.renderToScreen = false
		this.bloomScenePass = new RenderPass(scene, camera)
		this.bloomComposer.addPass(this.bloomScenePass)
		// Multicam twin (wired to the main mosaic below): during the event the
		// bloom layer renders through the SAME mosaic- per-feed cameras, lens
		// shift, regions- so the glow stays glued to every pane and the look
		// matches the rest of the show.
		this.bloomComposer.addPass(this.bloomPass)

		// Main composer
		this.composer = new EffectComposer(renderer)
		this.composer.setPixelRatio(Math.min(devicePixelRatio, params.quality.renderScale))
		this.composer.setSize(innerWidth, innerHeight)

		this.renderPass = new RenderPass(scene, camera)
		// Multicam event: swapped in for the render pass (same contract- renders
		// into readBuffer, no swap) so the rest of the chain sees the mosaic.
		this.multiCamPass = new MultiCamPass(scene, camera)
		this.multiCamPass.enabled = false
		// The bloom composer's twin, sharing the master's layout and clock.
		this.multiCamBloomPass = new MultiCamPass(scene, camera, this.multiCamPass)
		this.multiCamBloomPass.enabled = false
		this.bloomComposer.insertPass(this.multiCamBloomPass, 1)   // between the scene pass and UnrealBloom
		this.afterimagePass = new HalfResAfterimagePass(0.85)   // damp- updated per-frame
		this.bloomMergePass = new ShaderPass(new THREE.ShaderMaterial({
			uniforms: {
				baseTexture: { value: null },   // wired by ShaderPass via textureID below
				bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
			},
			vertexShader: BloomMergeShader.vertexShader,
			fragmentShader: BloomMergeShader.fragmentShader,
		}), 'baseTexture')
		// One combined lens pass (fisheye + RGB shift)- was two fullscreen passes.
		// It also carries the bloom add whenever it runs, so the standalone merge
		// pass only wakes up as a fallback when the lens is disabled at runtime.
		this.lensPass = new ShaderPass(LensShader)
		this.lensPass.uniforms.bloomTexture.value = this.bloomComposer.renderTarget2.texture
		this.lensPass.uniforms.echoTexture.value = this.echoTarget.texture
		const outputPass = new OutputPass()   // tone mapping + sRGB- required after bloom

		this.composer.addPass(this.renderPass)
		this.composer.addPass(this.multiCamPass)
		this.composer.addPass(this.afterimagePass)
		this.composer.addPass(this.bloomMergePass)
		this.composer.addPass(this.lensPass)
		this.composer.addPass(outputPass)

		// Debounced bloom gate: both flags agree with the last applied decision
		// so the very first update() cannot force a spurious toggle.
		this._bloomWanted = params.bloom.enabled
		this._bloomActive = params.bloom.enabled
		this._prevShatter = 0
	}

	// Lazy echo target: it stays 1×1 (no VRAM) until the first echo event,
	// then tracks the main buffer size (window × pixel-ratio cap). Called
	// per-frame while the event runs- the size compare costs nothing and
	// covers window resizes and render-scale changes mid-event. The target
	// keeps its allocation between events: re-triggering must not hitch.
	syncEchoTarget() {
		const ratio = this.renderer.getPixelRatio()
		const w = Math.round(innerWidth * ratio)
		const h = Math.round(innerHeight * ratio)
		if (this.echoTarget.width !== w || this.echoTarget.height !== h) this.echoTarget.setSize(w, h)
	}

	// THE master perf lever: every fragment cost scales with pixelRatio². The
	// chain already softens the frame (trails, lens warp), so a cap below the
	// display's ratio is well hidden. Bloom keeps its half-ratio relationship.
	setRenderScale(cap) {
		const ratio = Math.min(devicePixelRatio, cap)
		this.renderer.setPixelRatio(ratio)
		this.composer.setPixelRatio(ratio)
		this.bloomComposer.setPixelRatio(ratio / 2)
	}

	warmup() {
		// The bloom pipeline compiles its programs only when its composer actually
		// renders- without this mirror of the per-frame layer flip the first real
		// frame pays a multi-hundred-ms compilation hitch at play start.
		this.camera.layers.set(BLOOM_LAYER)
		this.bloomComposer.render()
		this.camera.layers.set(0)
		this.composer.render()
	}

	update(audio, features) {
		const p = this.params
		const e = features.energy
		// One driver per effect, every punctual reaction gated by the passage
		// energy: bloom swells with intensity and flares on the strong beats only,
		// RGB shift follows the highs (hats/cymbals), the fisheye breathes with
		// the energy and only kickHard still punches it.
		// bloomPass lives in bloomComposer- the gate below owns the visual on/off.
		// features.boost.*: the preset-signature event envelopes (see events.js)-
		// each adds on top of its effect's audio-reactive drive.
		this.bloomPass.strength = p.bloom.strengthBase + e * p.bloom.energyMult + audio.kickHard * p.bloom.kickHardMult * e + features.dropPulse * 2.5 + features.boost.bloom
		this.bloomPass.radius = p.bloom.radius
		this.bloomPass.threshold = p.bloom.threshold
		// Multicam event: hard swap of the scene render for the mosaic pass
		// (split-screen has no meaningful fade- the envelope is near-binary and
		// gated at 0.5). The bloom composer swaps to its mosaic twin in the
		// same breath, so the glow renders per-feed and the look stays
		// identical to the rest of the show.
		const multicam = features.boost.multicam > 0.5
		if (multicam && !this.multiCamPass.enabled) this.multiCamPass.reroll()   // fresh layout + angles per event
		this.renderPass.enabled = !multicam
		this.multiCamPass.enabled = multicam
		this.bloomScenePass.enabled = !multicam
		this.multiCamBloomPass.enabled = multicam
		// Below ~0.05 strength nothing survives the high-pass threshold, yet the
		// pipeline would still pay a second skinned-body render plus the mip
		// chain for an invisible layer. The toggle waits for two agreeing frames
		// so a strength oscillating across the cutoff cannot flicker the glow.
		const bloomWanted = p.bloom.enabled && this.bloomPass.strength >= 0.05
		if (bloomWanted === this._bloomWanted) this._bloomActive = bloomWanted
		this._bloomWanted = bloomWanted
		this.afterimagePass.enabled = p.afterimage.enabled
		// Capped at 0.92 (was 0.96): above that the trails stop reading as speed
		// and smear the whole frame into radial mush during intense passages.
		// The drop burst may exceed the usual 0.92 smear cap- explosion trails.
		this.afterimagePass.uniforms.damp.value = Math.min(0.95,
			Math.min(0.92, p.afterimage.dampBase + audio.kickHard * p.afterimage.kickHardMult * e) + features.dropPulse * 0.12 + features.boost.afterimage)
		// The lens pass carries all three effects; a disabled one just zeroes its
		// term. The drop shockwave: the ring starts at screen center at the drop
		// (dropPulse=1) and travels to the edges as the pulse fades- the palette
		// change BURSTS out instead of just happening.
		const u = this.lensPass.uniforms
		u.strength.value = p.fisheye.enabled ? p.fisheye.strengthBase + e * p.fisheye.energyMult + audio.kickHard * p.fisheye.kickHardMult * e : 0
		u.amount.value = p.rgbShift.enabled ? features.high * p.rgbShift.highMult : 0
		u.angle.value = p.rgbShift.angle
		u.shockR.value = (1 - features.dropPulse) * 1.3
		u.shockAmp.value = features.dropPulse * p.drop.shock
		// Event envelopes for the lens's screen-space events: broken mirror and
		// Droste echo (see LensShader). A fresh crack pattern per shatter event.
		u.shatter.value = features.boost.shatter
		if (features.boost.shatter > 0.001 && this._prevShatter <= 0.001) {
			u.shatterSeed.value = Math.random() * 100
			u.shatterTime.value = 0   // fresh break- the drift-apart clock restarts (advanced in render())
		}
		this._prevShatter = features.boost.shatter
		u.echoAmt.value = features.boost.echo
		this._echoActive = features.boost.echo > 0.001
		// The copies zoom around the body's PROJECTED screen position, so the
		// echo stack always faces the camera, nested on him wherever the
		// framing puts him. The anchor is the hips BONE (his visual center in
		// the current pose)- both its bone chain and the camera moved this
		// frame but world matrices only refresh at render time, so compose
		// them here or the projection lags and the origin drifts off the body.
		if (this._echoActive && this.echoAnchor) {
			this.camera.updateMatrixWorld()
			this.echoAnchor.updateWorldMatrix(true, false)
			_projScratch.setFromMatrixPosition(this.echoAnchor.matrixWorld).project(this.camera)
			u.echoCenter.value.set(_projScratch.x * 0.5 + 0.5, _projScratch.y * 0.5 + 0.5)
		}
		u.aspect.value = this.camera.aspect
		this.lensPass.enabled = p.fisheye.enabled || p.rgbShift.enabled || u.shockAmp.value > 0.0001
			|| u.shatter.value > 0.001 || u.echoAmt.value > 0.001
		// Bloom rides the lens pass when it runs (added at the warped uv, so the
		// glow bends with the distortion); the standalone merge only covers the
		// lens-off case. Both are gated by the same decision as the bloom render
		// so a stale target from the last active frame can never be added.
		u.bloomOn.value = this._bloomActive ? 1 : 0
		this.bloomMergePass.enabled = this._bloomActive && !this.lensPass.enabled
	}

	render(dt) {
		// The shards' drift-apart clock (see LensShader)- render() is the one
		// postfx entry that receives dt. The multicam orbit clock advances here
		// too, ONCE per frame and before either composer runs- the bloom twin
		// and the main mosaic must render the exact same instant.
		const lensU = this.lensPass.uniforms
		if (lensU.shatter.value > 0.001) lensU.shatterTime.value += dt || 0
		if (this.multiCamPass.enabled) this.multiCamPass.time += dt || 0
		// Selective bloom: render only the body layer into bloomComposer's target,
		// then run the main composer which merges that bloom on top of the full scene.
		// Skip the bloom render when the debounced gate is off- the merge fallback
		// and the lens bloom term are both off with it, so the stale texture from
		// the last active frame is never added.
		if (this._bloomActive) {
			this.camera.layers.set(BLOOM_LAYER)
			this.bloomComposer.render()
			this.camera.layers.set(0)
		}
		// Echo event: the body alone on transparent black, same camera as the
		// main render so the copies stay registered with the real body.
		if (this._echoActive) {
			this.syncEchoTarget()
			this.renderer.getClearColor(_clearScratch)
			const oldAlpha = this.renderer.getClearAlpha()
			for (let i = 0; i < this.echoExclude.length; i++) {
				this._echoExcludeVis[i] = this.echoExclude[i].visible
				this.echoExclude[i].visible = false   // the copies repeat the hero ALONE
			}
			this.renderer.setClearColor(0x000000, 0)
			this.camera.layers.set(BLOOM_LAYER)   // the body's layer- only him and the (hidden) clones live there
			this.renderer.setRenderTarget(this.echoTarget)
			this.renderer.clear()
			this.renderer.render(this.scene, this.camera)
			this.renderer.setRenderTarget(null)
			this.camera.layers.set(0)
			this.renderer.setClearColor(_clearScratch, oldAlpha)
			for (let i = 0; i < this.echoExclude.length; i++) this.echoExclude[i].visible = this._echoExcludeVis[i]
		}
		this.composer.render(dt)
	}

	resize() {
		this.composer.setSize(innerWidth, innerHeight)
		this.bloomComposer.setSize(innerWidth, innerHeight)
	}

}
