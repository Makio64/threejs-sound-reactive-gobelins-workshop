import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Free inspection camera (ctrl+C toggles it): renders the RAW scene- no
// postfx, no trails, no lens- from a mouse-orbitable viewpoint while the
// director and its rig keep running, their frustum drawn live as a wireframe.
// Purpose: separating camera-relative illusions ("clouds falling") from true
// world motion- from a HELD-STILL debug view every sprite must rise; anything
// descending here is a real world-space bug, anything that only descends in
// the rig view is coupling. Note the world modules re-couple to this camera
// while it is active (y-lock, billboards, near-fades)- that is the system
// behaving normally around the new viewpoint.
export default class DebugView {

	constructor(renderer, scene, rigCamera) {
		this.renderer = renderer
		this.rigCamera = rigCamera
		this.enabled = false
		this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000)
		this.controls = new OrbitControls(this.camera, renderer.domElement)
		this.controls.enableDamping = true
		this.controls.enabled = false
		this.helper = new THREE.CameraHelper(rigCamera)
		this.helper.visible = false
		scene.add(this.helper)
		this.sceneRef = scene
	}

	toggle() {
		this.enabled = !this.enabled
		this.controls.enabled = this.enabled
		this.helper.visible = this.enabled
		if (this.enabled) {
			// Start from the rig's pose pulled back and up- the action framed,
			// the rig frustum in view.
			this.camera.position.copy(this.rigCamera.position).multiplyScalar(1.6)
			this.camera.position.y += 2
			this.controls.target.set(0, 0, 0)
		}
		console.log(`[debug-cam] ${this.enabled ? 'ON- mouse orbit, raw render without postfx, rig frustum as wireframe' : 'OFF'}`)
	}

	render() {
		this.controls.update()
		this.helper.update()
		this.renderer.render(this.sceneRef, this.camera)
	}

	resize() {
		this.camera.aspect = innerWidth / innerHeight
		this.camera.updateProjectionMatrix()
	}

}
