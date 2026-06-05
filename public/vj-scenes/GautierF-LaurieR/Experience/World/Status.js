import * as THREE from 'three'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import Experience from '../Experience.js'
import { createKickState, wasKicked } from '../Utils/audioReactive.js'

export default class Status
{
    constructor(ileFlotante, frontStone = null)
    {
        this.experience = new Experience()
        this.ileFlotante = ileFlotante
        this.frontStone = frontStone
        this.debug = this.experience.debug
        this.minRotationStepDeg = 25
        this.maxRotationStepDeg = 70
        this.kickState = createKickState()
        this.resource = this.experience.resources.items.statusModel

        this.setModel()

        // if(this.debug.active)
        //     this.setDebug()
    }

    setModel()
    {
        this.statues = []

        const initialTransforms = [
            { position: [0.8, 0.53, 0], rotation: [0, 150, 0], scale: 5 },
            { position: [0, 2.5, 0], rotation: [0, 30, 0], scale: 5 },
            { position: [0.3, 2.26, 0], rotation: [0, -60, 0], scale: 3.5 },
            { position: [0, 2.26, 0], rotation: [0, -110, 0], scale: 4.2 }
        ]

        for(let i = 0; i < 4; i++)
        {
            const island = this.ileFlotante.models[i]
            const transform = initialTransforms[i]

            const container = new THREE.Group()
            container.position.set(...transform.position)
            container.rotation.set(...transform.rotation)
            container.scale.set(transform.scale, transform.scale, transform.scale)

            const model = cloneSkinned(this.resource.scene)
            container.add(model)
            island.add(container)

            model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = false
                    child.receiveShadow = true
                }
            })

            this.statues.push({ container, islandIndex: i })
        }

        if(this.frontStone)
        {
            const transform = { position: [0, 2.26, 0], rotation: [0, 0, 0], scale: 4 }

            const container = new THREE.Group()
            container.position.set(...transform.position)
            container.rotation.set(...transform.rotation)
            container.scale.set(transform.scale, transform.scale, transform.scale)

            const model = cloneSkinned(this.resource.scene)
            container.add(model)
            this.frontStone.model.add(container)

            model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    child.castShadow = false
                    child.receiveShadow = true
                }
            })

            this.statues.push({ container, islandIndex: null, isFrontStone: true })
        }
    }

    /* setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('status')
        this.debugFolder.open()

        for(const statue of this.statues)
        {
            const { container, islandIndex } = statue
            const statueFolder = this.debugFolder.addFolder(`île ${islandIndex + 1}`)

            if(islandIndex === 0)
                statueFolder.open()

            const debugObject = {
                positionX: container.position.x,
                positionY: container.position.y,
                positionZ: container.position.z,
                rotationX: THREE.MathUtils.radToDeg(container.rotation.x),
                rotationY: THREE.MathUtils.radToDeg(container.rotation.y),
                rotationZ: THREE.MathUtils.radToDeg(container.rotation.z),
                scale: container.scale.x
            }

            const applyPosition = () =>
            {
                container.position.set(debugObject.positionX, debugObject.positionY, debugObject.positionZ)
            }

            const applyRotation = () =>
            {
                container.rotation.set(
                    THREE.MathUtils.degToRad(debugObject.rotationX),
                    THREE.MathUtils.degToRad(debugObject.rotationY),
                    THREE.MathUtils.degToRad(debugObject.rotationZ)
                )
            }

            const applyScale = () =>
            {
                container.scale.set(debugObject.scale, debugObject.scale, debugObject.scale)
            }

            statueFolder.add(debugObject, 'positionX').name('localX').min(- 5).max(5).step(0.01).onChange(applyPosition)
            statueFolder.add(debugObject, 'positionY').name('localY').min(- 2).max(5).step(0.01).onChange(applyPosition)
            statueFolder.add(debugObject, 'positionZ').name('localZ').min(- 5).max(5).step(0.01).onChange(applyPosition)

            statueFolder.add(debugObject, 'rotationX').name('rotationX').min(- 180).max(180).step(1).onChange(applyRotation)
            statueFolder.add(debugObject, 'rotationY').name('rotationY').min(- 180).max(180).step(1).onChange(applyRotation)
            statueFolder.add(debugObject, 'rotationZ').name('rotationZ').min(- 180).max(180).step(1).onChange(applyRotation)

            statueFolder.add(debugObject, 'scale').min(0.001).max(5).step(0.001).onChange(applyScale)
        }
    } */

    rotateOnKick()
    {
        const direction = Math.random() < 0.5 ? -1 : 1
        const stepDeg = THREE.MathUtils.randFloat(this.minRotationStepDeg, this.maxRotationStepDeg)
        const stepY = THREE.MathUtils.degToRad(stepDeg) * direction

        for(const statue of this.statues)
            statue.container.rotation.y += stepY
    }

    update()
    {
        const audio = this.experience.audio
        if(!audio)
            return

        if ( wasKicked( audio, this.kickState ) )
            this.rotateOnKick()
    }
}
