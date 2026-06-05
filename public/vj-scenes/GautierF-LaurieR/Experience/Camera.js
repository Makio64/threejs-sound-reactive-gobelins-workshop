import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createKickState, wasKicked } from './Utils/audioReactive.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.centerTarget = new THREE.Vector3(0, 0, 0)
        this.cameraTargetPosition = new THREE.Vector3(6, 4, 8)
        this.orbitJitter = new THREE.Vector3()
        this.orbitJump = { radius: 22, height: 4.5 }
        this.kickState = createKickState()
        this.orbit = {
            lerpSpeed: 0.2,
            angularSpeed: 0.6,
            radius: 22,
            height: 4.5,
            heightWobble: 0.35,
            heightWobbleSpeed: 0.0008,
            jitterX: 10,
            jitterY: 10,
            jitterZ: 10,
            radiusJitter: 2,
            heightJitter: 0.6
        }
        this.orbitAngle = Math.atan2(this.cameraTargetPosition.z, this.cameraTargetPosition.x)
        this.autoOrbitEnabled = false
        this.orbitControlsEnabled = true

        this.followPerso = {
            enabled: true,
            distance: 10,
            height: -2,
            sideOffset: 0,
            lookAtOffsetY: 1.2,
            lerpSpeed: 0.06
        }
        this._followForward = new THREE.Vector3()
        this._followSide = new THREE.Vector3()
        this._followTargetPosition = new THREE.Vector3()
        this._persoLookAt = new THREE.Vector3()

        this.fixedCamera = {
            enabled: false,
            positionX: -2.2,
            positionY: 6,
            positionZ: -25,
            lookAtX: 0,
            lookAtY: 0,
            lookAtZ: 0
        }
        this._fixedLookAt = new THREE.Vector3()

        this.setInstance()
        this.setControls()
        this.applyControlsState()

        if(this.debug.active)
            this.setDebug()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.enabled = this.orbitControlsEnabled
        this.controls.target.copy(this.centerTarget)
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('camera')

        const fixedFolder = this.debugFolder.addFolder('caméra fixe')
        fixedFolder.open()

        fixedFolder
            .add(this.fixedCamera, 'enabled')
            .name('activer')
            .onChange(() => this.applyControlsState())

        const applyFixedCamera = () =>
        {
            if(!this.fixedCamera.enabled)
                return

            this.instance.position.set(
                this.fixedCamera.positionX,
                this.fixedCamera.positionY,
                this.fixedCamera.positionZ
            )
            this._fixedLookAt.set(
                this.fixedCamera.lookAtX,
                this.fixedCamera.lookAtY,
                this.fixedCamera.lookAtZ
            )
            this.instance.lookAt(this._fixedLookAt)
            this.controls.target.copy(this._fixedLookAt)
        }

        fixedFolder
            .add(this.fixedCamera, 'positionX')
            .name('x')
            .min(-50)
            .max(50)
            .step(0.01)
            .onChange(applyFixedCamera)

        fixedFolder
            .add(this.fixedCamera, 'positionY')
            .name('y')
            .min(-50)
            .max(50)
            .step(0.01)
            .onChange(applyFixedCamera)

        fixedFolder
            .add(this.fixedCamera, 'positionZ')
            .name('z')
            .min(-50)
            .max(50)
            .step(0.01)
            .onChange(applyFixedCamera)

        fixedFolder
            .add(this.fixedCamera, 'lookAtX')
            .name('regard x')
            .min(-50)
            .max(50)
            .step(0.01)
            .onChange(applyFixedCamera)

        fixedFolder
            .add(this.fixedCamera, 'lookAtY')
            .name('regard y')
            .min(-50)
            .max(50)
            .step(0.01)
            .onChange(applyFixedCamera)

        fixedFolder
            .add(this.fixedCamera, 'lookAtZ')
            .name('regard z')
            .min(-50)
            .max(50)
            .step(0.01)
            .onChange(applyFixedCamera)

        this.debugFolder
            .add(this, 'orbitControlsEnabled')
            .name('orbitControls')
            .onChange(() => this.applyControlsState())

        this.debugFolder
            .add(this, 'autoOrbitEnabled')
            .name('rotation auto')

        const followFolder = this.debugFolder.addFolder('suivi perso')
        followFolder.open()

        followFolder
            .add(this.followPerso, 'enabled')
            .name('activer')
            .onChange(() => this.applyControlsState())

        followFolder
            .add(this.followPerso, 'distance')
            .name('distance derrière')
            .min(1)
            .max(20)
            .step(0.1)

        followFolder
            .add(this.followPerso, 'height')
            .name('hauteur')
            .min(-2)
            .max(20)
            .step(0.1)

        followFolder
            .add(this.followPerso, 'sideOffset')
            .name('décalage latéral')
            .min(-10)
            .max(10)
            .step(0.1)

        followFolder
            .add(this.followPerso, 'lookAtOffsetY')
            .name('regard y')
            .min(-2)
            .max(5)
            .step(0.1)

        followFolder
            .add(this.followPerso, 'lerpSpeed')
            .name('fluidité (lerp)')
            .min(0.01)
            .max(0.3)
            .step(0.01)

        const moveFolder = this.debugFolder.addFolder('déplacement')
        moveFolder.open()

        moveFolder
            .add(this.orbit, 'angularSpeed')
            .name('vitesse rotation')
            .min(0.02)
            .max(1)
            .step(0.01)

        moveFolder
            .add(this.orbit, 'lerpSpeed')
            .name('fluidité (lerp)')
            .min(0.01)
            .max(0.3)
            .step(0.01)

        moveFolder
            .add(this.orbit, 'radius')
            .name('distance')
            .min(5)
            .max(50)
            .step(0.5)

        moveFolder
            .add(this.orbit, 'height')
            .name('hauteur')
            .min(0)
            .max(20)
            .step(0.1)

        moveFolder
            .add(this.orbit, 'heightWobble')
            .name('oscillation hauteur')
            .min(0)
            .max(3)
            .step(0.05)

        moveFolder
            .add(this.orbit, 'heightWobbleSpeed')
            .name('vitesse oscillation')
            .min(0.0001)
            .max(0.01)
            .step(0.0001)

        const jitterFolder = moveFolder.addFolder('saccades (kick)')
        jitterFolder.open()
        jitterFolder.add(this.orbit, 'jitterX').name('écart x').min(0).max(10).step(0.1)
        jitterFolder.add(this.orbit, 'jitterY').name('écart y').min(0).max(10).step(0.1)
        jitterFolder.add(this.orbit, 'jitterZ').name('écart z').min(0).max(10).step(0.1)
        jitterFolder.add(this.orbit, 'radiusJitter').name('écart distance').min(0).max(8).step(0.1)
        jitterFolder.add(this.orbit, 'heightJitter').name('écart hauteur').min(0).max(3).step(0.1)
    }

    applyOrbitJump()
    {
        this.orbitJump.radius = THREE.MathUtils.clamp(
            this.orbit.radius + THREE.MathUtils.randFloatSpread(this.orbit.radiusJitter),
            5,
            50
        )

        this.orbitJump.height = THREE.MathUtils.clamp(
            this.orbit.height + THREE.MathUtils.randFloatSpread(this.orbit.heightJitter),
            0,
            20
        )

        this.orbitJitter.set(
            THREE.MathUtils.randFloatSpread(this.orbit.jitterX),
            THREE.MathUtils.randFloatSpread(this.orbit.jitterY),
            THREE.MathUtils.randFloatSpread(this.orbit.jitterZ)
        )
    }

    applyControlsState()
    {
        this.controls.enabled = this.orbitControlsEnabled && !this.fixedCamera.enabled && !this.followPerso.enabled
    }

    resetOnSceneEntry()
    {
        this.followPerso.enabled = true
        this.autoOrbitEnabled = false
        this.fixedCamera.enabled = false
        this.orbitJitter.set(0, 0, 0)
        this.cameraTargetPosition.set(6, 4, 8)
        this.instance.position.set(6, 4, 8)
        this.controls.target.set(0, 0, 0)
        this.kickState.prevKick = 0
        this.applyControlsState()
    }

    transitionToOrbit()
    {
        this.followPerso.enabled = false
        this.autoOrbitEnabled = true
        this.applyControlsState()

        this.orbitAngle = Math.atan2(
            this.instance.position.z - this.centerTarget.z,
            this.instance.position.x - this.centerTarget.x
        )
        this.applyOrbitJump()
    }

    updateFollowPerso(perso)
    {
        const model = perso.model

        model.getWorldDirection(this._followForward)

        this._followTargetPosition
            .copy(model.position)
            .addScaledVector(this._followForward, -this.followPerso.distance)

        this._followTargetPosition.y += this.followPerso.height

        if(this.followPerso.sideOffset !== 0)
        {
            this._followSide.set(-this._followForward.z, 0, this._followForward.x).normalize()
            this._followTargetPosition.addScaledVector(this._followSide, this.followPerso.sideOffset)
        }

        this.instance.position.lerp(this._followTargetPosition, this.followPerso.lerpSpeed)

        this._persoLookAt.set(
            model.position.x,
            model.position.y + this.followPerso.lookAtOffsetY,
            model.position.z
        )
        this.controls.target.copy(this._persoLookAt)
        this.instance.lookAt(this._persoLookAt)
    }

    update()
    {
        if(this.fixedCamera.enabled)
        {
            this.instance.position.set(
                this.fixedCamera.positionX,
                this.fixedCamera.positionY,
                this.fixedCamera.positionZ
            )
            this._fixedLookAt.set(
                this.fixedCamera.lookAtX,
                this.fixedCamera.lookAtY,
                this.fixedCamera.lookAtZ
            )
            this.instance.lookAt(this._fixedLookAt)
            this.controls.target.copy(this._fixedLookAt)
            return
        }

        const perso = this.experience.world?.perso

        if(this.followPerso.enabled && perso?.model)
        {
            if(perso.isJumping)
            {
                this.transitionToOrbit()
            }
            else
            {
                this.updateFollowPerso(perso)

                if(this.controls.enabled)
                    this.controls.update()

                return
            }
        }

        if(this.autoOrbitEnabled)
        {
            const deltaSeconds = this.time.delta * 0.001
            const audio = this.experience.audio

            if ( wasKicked( audio, this.kickState ) )
                this.applyOrbitJump()

            this.orbitAngle += this.orbit.angularSpeed * deltaSeconds

            const height = this.orbitJump.height + Math.sin(this.time.elapsed * this.orbit.heightWobbleSpeed) * this.orbit.heightWobble

            this.cameraTargetPosition.set(
                Math.cos(this.orbitAngle) * this.orbitJump.radius,
                height,
                Math.sin(this.orbitAngle) * this.orbitJump.radius
            )
            this.cameraTargetPosition.add(this.orbitJitter)
        }

        this.instance.position.lerp(this.cameraTargetPosition, this.orbit.lerpSpeed)
        this.controls.target.copy(this.centerTarget)
        this.instance.lookAt(this.centerTarget)

        if(this.controls.enabled)
            this.controls.update()
    }
}