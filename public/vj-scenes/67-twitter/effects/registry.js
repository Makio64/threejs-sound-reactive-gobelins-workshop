import {
    vertexShader_blocsFragmentation,
    fragmentShader_blocsFragmentation,
} from '../shaders/blocsFragmentation/blocsFragmentation.js'
import {
    vertexShader_luminanceGlitch,
    fragmentShader_luminanceGlitch,
} from '../shaders/luminanceGlitch/luminanceGlitch.js'
import {
    vertexShader_crtLinesChelou,
    fragmentShader_crtLinesChelou,
} from '../shaders/crtLinesChelou/crtLinesChelou.js'

export const BACKGROUND_VIDEOS = [
    { id: 'feu_1', path: 'assets/video/feu_1.mp4' },
    { id: 'feu_2', path: 'assets/video/feu_2.mp4' },
    { id: 'feu_3', path: 'assets/video/feu_3.mp4' },
    { id: 'feu_4', path: 'assets/video/feu_4.mp4' },
    { id: 'giletJaune', path: 'assets/video/giletJaune.mp4' },
    { id: 'iPodShuffle', path: 'assets/video/iPodShuffle.mp4' },
]

export const CLIP_VIDEOS = [
    { id: 'attentionGrenades', path: 'assets/clip/attentionGrenades.mp4' },
    { id: 'badApple', path: 'assets/clip/badApple.mp4' },
    { id: 'bearSideEyeEu', path: 'assets/clip/bearSideEyeEu.mp4' },
    { id: 'cbat', path: 'assets/clip/cbat.mp4' },
    { id: 'ceSoirErrWalou', path: 'assets/clip/CE SOIR - err walou.mp4' },
    { id: 'chansonPoirreau', path: 'assets/clip/chansonPoirreau.mp4' },
    { id: 'feldup', path: 'assets/clip/feldup.mp4' },
    { id: 'feuArtifice', path: 'assets/clip/feuArtifice.mp4' },
    { id: 'fleursEclosion', path: 'assets/clip/fleursEclosion.mp4' },
    { id: 'jesterSmokingFreeway', path: 'assets/clip/jesterSmokingFreeway.mp4' },
    { id: 'lobotomy', path: 'assets/clip/lobotomy.mp4' },
    { id: 'minecraftPVP', path: 'assets/clip/minecraftPVP.mp4' },
    { id: 'nosferatuVogueing', path: 'assets/clip/nosferatuVogueing.mp4' },
    { id: 'nowhere', path: 'assets/clip/nowhere.mp4' },
    { id: 'osu', path: 'assets/clip/OSU.mp4' },
    { id: 'theEndOfEvangelion', path: 'assets/clip/theEndOfEvangelion.mp4' },
    { id: 'tokyoGhoul', path: 'assets/clip/tokyoGhoul.mp4' },
    { id: 'trumpetsRunAgnesTachyonUmamusume', path: 'assets/clip/trumpetsRunAgnesTachyonUmamusume.mp4' },
    { id: 'twinPeaks', path: 'assets/clip/twinPeaks.mp4' },
    { id: 'wasIstDeinLieblingsfach', path: 'assets/clip/wasIstDeinLieblingsfach.mp4' },
    { id: 'zaraLarsonMidnightSunRollSea', path: 'assets/clip/ZaraLarsonMidnightSunRollSea.mp4' },
    { id: 'zez', path: 'assets/clip/zez.mp4' },
]

export const VIDEOS = [...CLIP_VIDEOS]

export const CLIPS = CLIP_VIDEOS

export const EFFECTS = [
    {
        id: 'luminanceGlitch',
        name: 'Luminance Glitch',
        vertexShader: vertexShader_luminanceGlitch,
        fragmentShader: fragmentShader_luminanceGlitch,
    },
    {
        id: 'blocsFragmentation',
        name: 'Blocs Fragmentation',
        vertexShader: vertexShader_blocsFragmentation,
        fragmentShader: fragmentShader_blocsFragmentation,
    },
    {
        id: 'crtLinesChelou',
        name: 'CRT Lines',
        vertexShader: vertexShader_crtLinesChelou,
        fragmentShader: fragmentShader_crtLinesChelou,
    },
]

export function getEffect(id) {
    return EFFECTS.find((e) => e.id === id) ?? EFFECTS[0]
}

export function getVideo(id) {
    return VIDEOS.find((v) => v.id === id) ?? BACKGROUND_VIDEOS[0]
}

export function getClip(id) {
    return CLIPS.find((v) => v.id === id) ?? CLIPS[0]
}
