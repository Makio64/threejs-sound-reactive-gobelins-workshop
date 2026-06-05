import * as THREE from 'three'
import Experience from '../Experience.js'

export default class BigStone
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.resource = this.resources.items.bigStoneModel

        this.setModel()

        // if(this.debug.active)
        //     this.setDebug()
    }

    setModel()
    {
        this.model = this.resource.scene.clone()
        this.model.position.set(0.5, -4.2, -2.45)
        this.model.rotation.set(0, Math.PI, 0)
        this.model.scale.set(5, 5, 5)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = false
                child.receiveShadow = true
            }
        })

        this.scene.add(this.model)
    }

    /* setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('big stone')

        const debugObject = {
            positionX: this.model.position.x,
            positionY: this.model.position.y,
            positionZ: this.model.position.z,
            rotationX: THREE.MathUtils.radToDeg(this.model.rotation.x),
            rotationY: THREE.MathUtils.radToDeg(this.model.rotation.y),
            rotationZ: THREE.MathUtils.radToDeg(this.model.rotation.z),
            scale: this.model.scale.x
        }

        const applyPosition = () =>
        {
            this.model.position.set(debugObject.positionX, debugObject.positionY, debugObject.positionZ)
        }

        const applyRotation = () =>
        {
            this.model.rotation.set(
                THREE.MathUtils.degToRad(debugObject.rotationX),
                THREE.MathUtils.degToRad(debugObject.rotationY),
                THREE.MathUtils.degToRad(debugObject.rotationZ)
            )
        }

        const applyScale = () =>
        {
            this.model.scale.set(debugObject.scale, debugObject.scale, debugObject.scale)
        }

        this.debugFolder.add(debugObject, 'positionX').name('x').min(-30).max(30).step(0.01).onChange(applyPosition)
        this.debugFolder.add(debugObject, 'positionY').name('y').min(-10).max(30).step(0.01).onChange(applyPosition)
        this.debugFolder.add(debugObject, 'positionZ').name('z').min(-30).max(30).step(0.01).onChange(applyPosition)
        this.debugFolder.add(debugObject, 'rotationX').name('rotX').min(-180).max(180).step(1).onChange(applyRotation)
        this.debugFolder.add(debugObject, 'rotationY').name('rotY').min(-180).max(180).step(1).onChange(applyRotation)
        this.debugFolder.add(debugObject, 'rotationZ').name('rotZ').min(-180).max(180).step(1).onChange(applyRotation)
        this.debugFolder.add(debugObject, 'scale').name('scale').min(0.01).max(20).step(0.01).onChange(applyScale)
    } */
}
