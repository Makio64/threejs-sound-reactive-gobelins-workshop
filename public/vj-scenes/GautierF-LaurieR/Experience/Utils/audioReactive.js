/** Seuils par défaut : front montant quand kick passe au-dessus de ON depuis sous OFF. */
export const KICK_ON = 0.9
export const KICK_OFF = 0.5

export function createKickState() {
    return { prevKick: 0 }
}

/** @param {{ prevKick: number }} state — createKickState() */
export function wasKicked( audio, state, thresholds = {} ) {
    if ( ! audio || ! state ) return false

    const on = thresholds.on ?? KICK_ON
    const off = thresholds.off ?? KICK_OFF
    const kicked = audio.kick >= on && state.prevKick < off

    state.prevKick = audio.kick
    return kicked
}
