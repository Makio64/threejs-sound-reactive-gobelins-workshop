export default class CameraController {
    constructor( camera ) {
        this.camera = camera
        this.targetX   = 0
        this.targetY   = 0
        this.targetZ   = 5.5
        this.targetFov = 42
        this.lastJump  = 0
        this.cooldown  = 100
    }

    tryJump( t, kickHard ) {
        if ( kickHard > 0.6 && ( t - this.lastJump ) > this.cooldown ) {
            this.lastJump  = t
            this.targetX   = ( Math.random() - 0.5 ) * 6
            this.targetY   = ( Math.random() - 0.5 ) * 5
            this.targetZ   = 4.5 + Math.random() * 2
            this.targetFov = 42 + kickHard * 8
        }
    }

    applyShake( kickHard ) {
        const shake = kickHard * 0.5
        if ( shake > 0.01 ) {
            this.camera.position.x += ( Math.random() - 0.5 ) * shake
            this.camera.position.y += ( Math.random() - 0.5 ) * shake
        }
    }

    update( t, audio, lookAt ) {
        if (true) return;
        this.tryJump( t, audio.kickHard ?? 0 )

        const lerp = 0.5
        this.camera.position.x += ( this.targetX   - this.camera.position.x ) * lerp
        this.camera.position.y += ( this.targetY   - this.camera.position.y ) * lerp
        this.camera.position.z += ( this.targetZ   - this.camera.position.z ) * lerp
        this.camera.fov        += ( this.targetFov - this.camera.fov )        * lerp
        this.camera.updateProjectionMatrix()

        this.applyShake( audio.kickHard ?? 0 )
        this.camera.lookAt( lookAt )
    }
}