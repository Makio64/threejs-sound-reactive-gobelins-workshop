import * as THREE from 'three'
import Experience from '../Experience.js'

export default class IleFlotante
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.resource = this.resources.items.ileFlotanteModel

        this.float = {
            amplitude: 0.4,
            speed: 0.001
        }

        this.setModel()

        // if(this.debug.active)
        //     this.setDebug()
    }

    setModel()
    {
        this.models = []
        this.islands = []

        const initialPositions = [
            [-10, 6, 5],
            [30, 2, -16],
            [11.7, 2, -2],
            [-12, 2, 10]
        ]

        const initialScales = [
            2,
            2.5,
            1.5,
            2
        ]

        for(let i = 0; i < 4; i++)
        {
            const model = this.resource.scene.clone()
            model.position.set(...initialPositions[i])
            model.scale.set(initialScales[i], initialScales[i], initialScales[i])
            this.models.push(model)
            this.islands.push({
                basePosition: model.position.clone(),
                phase: i * Math.PI * 0.5
            })
            this.scene.add(model)

            model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = false
                    child.receiveShadow = true
                }
            })
        }
    }

    /* setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('ileFlotante')
        this.debugFolder.open()

        for(let i = 0; i < this.models.length; i++)
        {
            const model = this.models[i]
            const island = this.islands[i]
            const islandFolder = this.debugFolder.addFolder(`île ${i + 1}`)
            islandFolder.open()

            const debugObject = {
                positionX: island.basePosition.x,
                positionY: island.basePosition.y,
                positionZ: island.basePosition.z,
                scale: model.scale.x
            }

            islandFolder
                .add(debugObject, 'positionX')
                .min(- 20)
                .max(30)
                .step(0.01)
                .onChange(() =>
                {
                    island.basePosition.x = debugObject.positionX
                    model.position.x = debugObject.positionX
                })

            islandFolder
                .add(debugObject, 'positionY')
                .min(- 5)
                .max(20)
                .step(0.01)
                .onChange(() =>
                {
                    island.basePosition.y = debugObject.positionY
                })

            islandFolder
                .add(debugObject, 'positionZ')
                .min(- 20)
                .max(20)
                .step(0.01)
                .onChange(() =>
                {
                    island.basePosition.z = debugObject.positionZ
                    model.position.z = debugObject.positionZ
                })

            islandFolder
                .add(debugObject, 'scale')
                .min(0.001)
                .max(10)
                .step(0.001)
                .onChange(() =>
                {
                    model.scale.set(debugObject.scale, debugObject.scale, debugObject.scale)
                })
        }

        const floatFolder = this.debugFolder.addFolder('flottement')
        floatFolder.open()
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
    } */

    update()
    {
        const elapsed = this.time.elapsed

        for(let i = 0; i < this.models.length; i++)
        {
            const model = this.models[i]
            const island = this.islands[i]

            model.position.y = island.basePosition.y + Math.sin(elapsed * this.float.speed + island.phase) * this.float.amplitude
        }
    }
}
