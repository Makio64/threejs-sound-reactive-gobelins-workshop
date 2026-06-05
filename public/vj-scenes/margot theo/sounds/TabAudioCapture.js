/**
 * Capture audio d’un onglet Chrome via getDisplayMedia.
 * L’utilisateur doit choisir un onglet et cocher « Partager aussi l’audio de l’onglet ».
 */
export async function captureChromeTabAudio() {
  if ( ! navigator.mediaDevices?.getDisplayMedia ) {
    throw new Error(
      'Capture d’onglet non supportée. Utilise Google Chrome (desktop).'
    )
  }

  let stream
  try {
    stream = await navigator.mediaDevices.getDisplayMedia( {
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        suppressLocalAudioPlayback: false,
      },
      video: {
        displaySurface: 'browser',
      },
      preferCurrentTab: false,
      selfBrowserSurface: 'exclude',
    } )
  } catch ( err ) {
    if ( err?.name === 'NotAllowedError' ) throw new Error( 'Capture annulée.' )
    stream = await navigator.mediaDevices.getDisplayMedia( {
      audio: true,
      video: true,
    } )
  }

  if ( ! stream.getAudioTracks().length ) {
    stream.getTracks().forEach( ( t ) => t.stop() )
    throw new Error(
      'Aucun audio — dans Chrome, choisis un onglet et coche « Partager aussi l’audio de l’onglet ».'
    )
  }

  for ( const track of stream.getVideoTracks() ) {
    track.stop()
    stream.removeTrack( track )
  }

  return stream
}
