import * as THREE from 'three'
import Experience from '../Experience.js'

export default class FrontStone
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.resource = this.resources.items.frontStoneModel

        this.float = {
            amplitude: 0.4,
            speed: 0.001
        }

        this.setModel()

        if(this.debug.active)
            this.setDebug()
    }

    setModel()
    {
        this.model = this.resource.scene.clone()
        this.model.position.set(3, -10, 27)
        this.model.rotation.set(0, 0, 0)
        this.model.scale.set(6, 6, 6)

        this.basePosition = this.model.position.clone()
        this.phase = 0

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        this.scene.add(this.model)
    }

    setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('front stone')

        const debugObject = {
            positionX: this.basePosition.x,
            positionY: this.basePosition.y,
            positionZ: this.basePosition.z,
            scale: this.model.scale.x
        }

        this.debugFolder
            .add(debugObject, 'positionX')
            .name('x')
            .min(-30)
            .max(30)
            .step(0.01)
            .onChange(() =>
            {
                this.basePosition.x = debugObject.positionX
                this.model.position.x = debugObject.positionX
            })

        this.debugFolder
            .add(debugObject, 'positionY')
            .name('y')
            .min(-10)
            .max(30)
            .step(0.01)
            .onChange(() =>
            {
                this.basePosition.y = debugObject.positionY
            })

        this.debugFolder
            .add(debugObject, 'positionZ')
            .name('z')
            .min(-30)
            .max(30)
            .step(0.01)
            .onChange(() =>
            {
                this.basePosition.z = debugObject.positionZ
                this.model.position.z = debugObject.positionZ
            })

        this.debugFolder
            .add(debugObject, 'scale')
            .name('scale')
            .min(0.01)
            .max(20)
            .step(0.01)
            .onChange(() =>
            {
                this.model.scale.set(debugObject.scale, debugObject.scale, debugObject.scale)
            })

        const floatFolder = this.debugFolder.addFolder('flottement')
        floatFolder
            .add(this.float, 'amplitude')
            .name('amplitude')
            .min(0)
            .max(2)
            .step(0.01)

        floatFolder
            .add(this.float, 'speed')
            .name('speed')
            .min(0.0001)
            .max(0.01)
            .step(0.0001)
    } 

    update()
    {
        const elapsed = this.time.elapsed

        this.model.position.y = this.basePosition.y + Math.sin(elapsed * this.float.speed + this.phase) * this.float.amplitude
    }
}
