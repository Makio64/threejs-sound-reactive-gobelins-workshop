import * as THREE from 'three'
import Experience from '../Experience.js'
import { createKickState, wasKicked } from '../Utils/audioReactive.js'

import vertexShader from './Perso/shaders/vertex.glsl.js'
import fragmentShader from './Perso/shaders/fragment.glsl.js'

const CLIMB_ANIMATION = 'climbingstairs'
const JUMP_ANIMATION = 'jump'
const STANDING_POSE_ANIMATION = 'standing pose 4'
const CLIMB_LOOP_COUNT = 6

/** Déplacement par boucle complète de climbingstairs */
const CLIMB_STEP_HEIGHT = 0.69
const CLIMB_STEP_FORWARD = 0.75
const JUMP_OFFSET_Z = 3
const JUMP_OFFSET_Y = 1.2
const INITIAL_POSITION = { x: 0.7, y: -5, z: -7 }

export default class Perso
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.lineColorCycle = ['#FFFFFF', '#F1F1F1']
        this.currentLineColorIndex = 0
        this.kickState = createKickState()
        this._climbDirection = new THREE.Vector3()

        this.resource = this.resources.items.persoModel

        this.setMaterial()
        this.setModel()
        this.setAnimation()

        if(this.debug.active)
            this.setDebug()
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.fog,
                {
                    uTime: { value: 0 },
                    uLineAngle: { value: Math.PI * 0.25 },
                    uColor: { value: new THREE.Color('#050505') },
                    uLineColor: { value: new THREE.Color(this.lineColorCycle[0]) }
                }
            ]),
            vertexShader,
            fragmentShader,
            fog: true,
            skinning: true
        })
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.position.set(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_POSITION.z)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                if(child.material)
                {
                    const materials = Array.isArray(child.material) ? child.material : [child.material]

                    for(const material of materials)
                    {
                        if(material.map)
                            material.map.dispose()

                        material.dispose()
                    }
                }

                child.material = this.material
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}

        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.actions = {}

        for(const clip of this.resource.animations)
        {
            const action = this.animation.mixer.clipAction(clip)
            action.setLoop(THREE.LoopRepeat, Infinity)
            this.animation.actions[clip.name] = action
        }

        const climbClip =
            this.resource.animations.find((clip) => clip.name === CLIMB_ANIMATION) ??
            this.resource.animations[0]

        this.climbLoopCount = 0
        this.climbFinished = false
        this.jumpFinished = false
        this.isJumping = false
        this.jump = {
            offsetZ: JUMP_OFFSET_Z,
            offsetY: JUMP_OFFSET_Y,
            startZ: 0,
            startY: 0
        }

        this.animation.actions.current = this.animation.actions[climbClip.name]
        this.animation.actions.current.play()

        this.climbAction = this.animation.actions[CLIMB_ANIMATION]

        if(this.climbAction)
        {
            this.climbAction.zeroSlopeAtStart = true
            this.climbAction.zeroSlopeAtEnd = true
        }

        this.climb = {
            enabled: true,
            stepHeight: CLIMB_STEP_HEIGHT,
            stepForward: CLIMB_STEP_FORWARD,
            timeScale: 1
        }

        if(this.climbAction)
            this.climbAction.timeScale = this.climb.timeScale

        this.animation.mixer.addEventListener('loop', (event) =>
        {
            if(this.climbFinished)
                return

            if(event.action !== this.climbAction)
                return

            this.climbLoopCount++

            if(this.climb.enabled)
                this.applyClimbStep()

            if(this.climbLoopCount >= CLIMB_LOOP_COUNT)
                this.finishClimbing()
        })

        this.animation.mixer.addEventListener('finished', (event) =>
        {
            if(event.action?.getClip().name !== JUMP_ANIMATION)
                return

            if(this.jumpFinished)
                return

            this.jumpFinished = true
            this.isJumping = false
            this.playStandingPose()
        })

        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]

            if(!newAction)
                return

            const oldAction = this.animation.actions.current

            if(name === CLIMB_ANIMATION)
            {
                this.climbLoopCount = 0
                this.climbFinished = false
                this.jumpFinished = false
                this.isJumping = false
            }
            else if(name === JUMP_ANIMATION)
            {
                this.climbFinished = true
                this.jumpFinished = false
                this.startJump()
            }
            else
            {
                this.climbFinished = true
                this.isJumping = false
            }

            const isOneShot = name === JUMP_ANIMATION || name === STANDING_POSE_ANIMATION

            newAction.reset()
            newAction.setLoop(
                isOneShot ? THREE.LoopOnce : THREE.LoopRepeat,
                isOneShot ? 1 : Infinity
            )
            newAction.clampWhenFinished = isOneShot
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

    }

    finishClimbing()
    {
        if(this.climbFinished)
            return

        this.climbFinished = true
        this.climb.enabled = false

        const jumpAction = this.animation.actions[JUMP_ANIMATION]

        if(!jumpAction)
            return

        const climbAction = this.climbAction

        jumpAction.reset()
        jumpAction.setLoop(THREE.LoopOnce, 1)
        jumpAction.clampWhenFinished = true
        jumpAction.play()
        jumpAction.crossFadeFrom(climbAction, 0.5)

        this.jumpFinished = false
        this.animation.actions.current = jumpAction
        this.startJump()
    }

    playStandingPose()
    {
        const poseAction = this.animation.actions[STANDING_POSE_ANIMATION]

        if(!poseAction)
            return

        const previousAction = this.animation.actions.current

        poseAction.reset()
        poseAction.setLoop(THREE.LoopOnce, 1)
        poseAction.clampWhenFinished = true
        poseAction.play()
        poseAction.crossFadeFrom(previousAction, 0.5)

        this.animation.actions.current = poseAction
    }

    startJump()
    {
        this.isJumping = true
        this.jump.startZ = this.model.position.z
        this.jump.startY = this.model.position.y
        this.experience.world?.environment?.enableKickStrobe()
    }

    /** Reprend la montée depuis le bas (changement de scène VJ). */
    resetToStart()
    {
        if(!this.climbAction)
            return

        this.model.position.set(INITIAL_POSITION.x, INITIAL_POSITION.y, INITIAL_POSITION.z)

        for(const action of Object.values(this.animation.actions))
        {
            action.stop()
            action.reset()
        }

        this.climbLoopCount = 0
        this.climbFinished = false
        this.jumpFinished = false
        this.isJumping = false
        this.climb.enabled = true

        this.climbAction.setLoop(THREE.LoopRepeat, Infinity)
        this.climbAction.clampWhenFinished = false
        this.climbAction.timeScale = this.climb.timeScale
        this.climbAction.play()

        this.animation.actions.current = this.climbAction
        this.animation.mixer.update(0)

        this.currentLineColorIndex = 0
        this.material.uniforms.uLineColor.value.set(this.lineColorCycle[0])
        this.kickState.prevKick = 0
    }

    updateJumpPosition()
    {
        const action = this.animation.actions.current

        if(!action || action.getClip().name !== JUMP_ANIMATION)
        {
            this.isJumping = false
            return
        }

        const clip = action.getClip()
        const animProgress = THREE.MathUtils.clamp(action.time / clip.duration, 0, 1)
        const moveProgress = THREE.MathUtils.clamp(animProgress * 2, 0, 1)

        this.model.position.z = this.jump.startZ + this.jump.offsetZ * moveProgress
        this.model.position.y = this.jump.startY + this.jump.offsetY * moveProgress

        if(animProgress >= 1)
        {
            this.model.position.z = this.jump.startZ + this.jump.offsetZ
            this.model.position.y = this.jump.startY + this.jump.offsetY
        }
    }

    applyClimbStep()
    {
        this.model.position.y += this.climb.stepHeight
        this.model.getWorldDirection(this._climbDirection)
        this.model.position.addScaledVector(this._climbDirection, this.climb.stepForward)
    }

    setDebug()
    {
        this.debugFolder = this.debug.ui.addFolder('perso')

        const debugObject = {
            positionX: this.model.position.x,
            positionY: this.model.position.y,
            positionZ: this.model.position.z,
            rotationX: THREE.MathUtils.radToDeg(this.model.rotation.x),
            rotationY: THREE.MathUtils.radToDeg(this.model.rotation.y),
            rotationZ: THREE.MathUtils.radToDeg(this.model.rotation.z),
            scale: this.model.scale.x,
            animation: this.animation.actions.current.getClip().name
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
        this.debugFolder.add(debugObject, 'scale').name('scale').min(0.01).max(5).step(0.01).onChange(applyScale)

        const animationNames = this.resource.animations.map((clip) => clip.name)

        this.debugFolder
            .add(debugObject, 'animation', animationNames)
            .name('animation')
            .onChange((name) =>
            {
                this.animation.play(name)
            })

        this.debugFolder
            .add(this.material.uniforms.uLineAngle, 'value', -Math.PI, Math.PI, 0.01)
            .name('rotationLignes')

        const climbFolder = this.debugFolder.addFolder('montée (boucle)')
        climbFolder.open()

        climbFolder
            .add(this.climb, 'enabled')
            .name('compensation active')

        climbFolder
            .add(this.climb, 'stepHeight')
            .name('hauteur / boucle (y)')
            .min(-1)
            .max(3)
            .step(0.01)

        climbFolder
            .add(this.climb, 'stepForward')
            .name('avancée / boucle')
            .min(-3)
            .max(3)
            .step(0.01)

        if(this.climbAction)
        {
            climbFolder
                .add(this.climb, 'timeScale')
                .name('vitesse anim')
                .min(0.1)
                .max(2)
                .step(0.01)
                .onChange(() =>
                {
                    this.climbAction.timeScale = this.climb.timeScale
                })
        }

        const climbDebug = {
            testerUnPas: () =>
            {
                this.applyClimbStep()
            }
        }

        climbFolder.add(climbDebug, 'testerUnPas').name('▶ tester un pas')
    }

    cycleLineColorOnKick()
    {
        this.currentLineColorIndex = (this.currentLineColorIndex + 1) % this.lineColorCycle.length
        this.material.uniforms.uLineColor.value.set(this.lineColorCycle[this.currentLineColorIndex])
    }

    update()
    {
        const audio = this.experience.audio

        if ( wasKicked( audio, this.kickState ) )
            this.cycleLineColorOnKick()

        this.material.uniforms.uTime.value = this.time.elapsed * 0.001

        this.animation.mixer.update(this.time.delta * 0.001)

        if(this.isJumping)
            this.updateJumpPosition()
    }
}
