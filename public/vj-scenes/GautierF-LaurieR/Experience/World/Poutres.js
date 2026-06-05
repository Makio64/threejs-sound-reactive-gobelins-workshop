import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Poutres
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.baseBottomY = 0
        this.minRestingScale = 0.7
        this.maxRestingScale = 1.4
        this.volumeStretchMax = 1.2

        this.resource = this.resources.items.poutreModel

        this.setModel()

        // if(this.debug.active)
        //     this.setDebug()
    }

    setModel()
    {
        this.poutres = []

        const transforms = [
            { position: [-2.5, 1.47, -0.5], rotation: [0, 0, 0], scale: 1 },
            { position: [4, 1.47, -0.5], rotation: [0, 0, 0], scale: 1 },
            { position: [-1, 1.47, 2.5], rotation: [0, 0, 0], scale: 1 },
            { position: [2.5, 1.47, 2], rotation: [0, 0, 0], scale: 1 },
        ]

        for(const transform of transforms)
        {
            const model = this.resource.scene.clone()
            model.position.set(...transform.position)
            model.rotation.set(...transform.rotation)
            const restingScale = THREE.MathUtils.randFloat(this.minRestingScale, this.maxRestingScale)
            model.scale.set(restingScale, restingScale, restingScale)

            model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = false
                    child.receiveShadow = true
                }
            })

            this.scene.add(model)

            const bounds = new THREE.Box3().setFromObject(model)
            const modelHeight = bounds.max.y - bounds.min.y
            const unitHalfHeight = modelHeight / (2 * restingScale)

            model.userData.restingScale = restingScale
            model.userData.unitHalfHeight = unitHalfHeight
            model.userData.baseBottomY = this.baseBottomY
            model.position.y = this.baseBottomY + unitHalfHeight * restingScale

            this.poutres.push(model)
        }
    }

    update()
    {
        const audio = this.experience.audio
        const volume = audio ? audio.volumeSmooth : 0

        for(const poutre of this.poutres)
        {
            const resting = poutre.userData.restingScale
            const scaleY = resting + volume * this.volumeStretchMax

            poutre.scale.y = scaleY
            poutre.position.y = poutre.userData.baseBottomY + poutre.userData.unitHalfHeight * scaleY
        }
    }
}
