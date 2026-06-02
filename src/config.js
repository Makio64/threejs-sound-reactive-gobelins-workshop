// ════════════════════════════════════════════════════════════════════════════════
//  Shared tunables + the localStorage key names, in one place so behaviour can be
//  changed (and keys refactored) without hunting through the codebase.
// ════════════════════════════════════════════════════════════════════════════════

export const config = {
	sceneSeconds: 30,    // time a scene stays on screen before auto-advancing
	maxLive: 4,          // how many scene iframes we keep alive (LRU)
	eyeTransitionSeconds: 1.2,   // iris eye-transition duration
}

export const STORAGE_KEYS = {
	trackIndex:   'vj-last-track-index',
	trackTime:    'vj-last-track-time',
	customScenes: 'vj-custom-scenes',
}
