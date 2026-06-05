import * as THREE from 'three'
import Experience from '../Experience.js'
import { createKickState, wasKicked } from '../Utils/audioReactive.js'

export default class Stones
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.rotationEaseMs = 100
        this.minRotationStepDeg = 15
        this.maxRotationStepDeg = 70
        this._rotationAxis = new THREE.Vector3()
        this._deltaQuaternion = new THREE.Quaternion()
        this.kickState = createKickState()

        this.float = {
            amplitude: 1,
            speed: 0.003
        }

        this.resource = this.resources.items.stoneModel

        this.setModel()

        // if(this.debug.active)
        //     this.setDebug()
    }

    setModel()
    {
        this.stones = []

        const transforms = [
            { position: [-8.3, 2.3, -4], rotation: [0, 0.2, 0], scale: 1 },
            { position: [8.86, 0.75, -4], rotation: [0, -0.35, 0], scale: 1 },
            { position: [-6.8, 0, 7.3], rotation: [0, 0.6, 0], scale: 1 },
            { position: [9.6, 0, 3.5], rotation: [0, -0.5, 0], scale: 1 }
        ]

        for(let i = 0; i < transforms.length; i++)
        {
            const transform = transforms[i]
            const model = this.resource.scene.clone()
            model.position.set(...transform.position)
            model.rotation.set(...transform.rotation)
            model.scale.set(transform.scale, transform.scale, transform.scale)

            model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })

            this.scene.add(model)

            model.userData.basePosition = model.position.clone()
            model.userData.phase = i * Math.PI * 0.5
            model.userData.startQuaternion = model.quaternion.clone()
            model.userData.targetQuaternion = model.quaternion.clone()
            model.userData.rotationStartMs = 0

            this.stones.push(model)
        }
    }

    setStoneRotationTarget(stone, elapsedMs)
    {
        stone.userData.startQuaternion.copy(stone.quaternion)

        this._rotationAxis.set(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize()

        const stepDeg = THREE.MathUtils.randFloat(this.minRotationStepDeg, this.maxRotationStepDeg)
        const direction = Math.random() < 0.5 ? -1 : 1
        const angle = THREE.MathUtils.degToRad(stepDeg) * direction

        this._deltaQuaternion.setFromAxisAngle(this._rotationAxis, angle)
        stone.userData.targetQuaternion
            .copy(stone.userData.startQuaternion)
            .multiply(this._deltaQuaternion)
        stone.userData.rotationStartMs = elapsedMs
    }

    update()
    {
        const elapsed = this.time.elapsed
        const elapsedMs = elapsed
        const audio = this.experience.audio

        if ( wasKicked( audio, this.kickState ) ) {
            for ( const stone of this.stones )
                this.setStoneRotationTarget( stone, elapsedMs )
        }

        for(const stone of this.stones)
        {
            const rotationElapsed = elapsedMs - stone.userData.rotationStartMs
            const t = THREE.MathUtils.clamp(rotationElapsed / this.rotationEaseMs, 0, 1)
            const eased = t * t * (3 - 2 * t)

            stone.quaternion.slerpQuaternions(
                stone.userData.startQuaternion,
                stone.userData.targetQuaternion,
                eased
            )

            stone.position.y = stone.userData.basePosition.y + Math.sin(elapsed * this.float.speed + stone.userData.phase) * this.float.amplitude
        }
    }
}
