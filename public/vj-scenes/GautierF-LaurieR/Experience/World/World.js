import Experience from '../Experience.js'
import Environment from './Environment.js'
import Perso from './Perso.js'
import IleFlotante from './IleFlotante.js'
import Status from './Status.js'
import Cloud from './Cloud.js'
import Birds from './Birds.js'
import Particles from './Particles.js'
import Poutres from './Poutres.js'
import Stones from './Stones.js'
import BigStone from './BigStone.js'
import FrontStone from './FrontStone.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        const setup = () => {
            this.ileFlotante = new IleFlotante()
            this.frontStone = new FrontStone()
            this.status = new Status( this.ileFlotante, this.frontStone )
            this.perso = new Perso()
            this.environment = new Environment()
            this.cloud = new Cloud()
            this.birds = new Birds()
            this.particles = new Particles()
            this.poutres = new Poutres()
            this.stones = new Stones()
            this.bigStone = new BigStone()
        }

        if ( this.resources.isReady ) setup()
        else this.resources.on( 'ready', setup )
    }

    update()
    {
        if(this.perso)
            this.perso.update()

        if(this.ileFlotante)
            this.ileFlotante.update()

        if(this.frontStone)
            this.frontStone.update()

        if(this.status)
            this.status.update()

        if(this.cloud)
            this.cloud.update()

        if(this.birds)
            this.birds.update()

        if(this.particles)
            this.particles.update()

        if(this.poutres)
            this.poutres.update()

        if(this.stones)
            this.stones.update()

        if(this.environment)
            this.environment.update()
    }

    resetOnSceneEntry()
    {
        this.perso?.resetToStart()
        this.environment?.resetOnSceneEntry()
        this.experience.camera?.resetOnSceneEntry()
        this.experience.renderer?.postProcess?.radialBlur?.resetOnSceneEntry?.()
    }
}