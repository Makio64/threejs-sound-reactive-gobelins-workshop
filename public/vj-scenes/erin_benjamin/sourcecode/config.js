import * as THREE from 'three'

export const TARGET_HEIGHT = 2   // body normalized to ~2 world units tall
export const BLOOM_LAYER = 1     // body meshes get this layer- bloomComposer renders only it
// Default total cloud count- live-tunable via params.clouds.count.
export const CLOUD_COUNT_DEFAULT = 290

// Discrete parallax depth layers (near -> horizon). Each band gets its own
// radius/scale/height range and speed multiplier. Far layers are slower and
// larger, near ones are fast and small: same world rise speed × per-layer
// multiplier × audio reactivity produces the layered parallax. `countShare`
// splits the total count across layers (must roughly sum to 1). Weights are
// biased toward far layers so the depth dominates the visual.
export const CLOUD_LAYERS = [
	// Scale ranges span ~x6 (was ~x2): a REAL sky mixes small puffs and rare
	// giants at every depth. The spawn draw is power-law biased toward the
	// small end (clouds.js), so the giants punctuate without exploding the
	// overdraw.
	{ radiusMin: 2, radiusMax: 6, yRange: 8, scaleMin: 0.7, scaleMax: 4.5, speedMult: 1.9, countShare: 0.18 },
	{ radiusMin: 5, radiusMax: 12, yRange: 12, scaleMin: 1.4, scaleMax: 8.0, speedMult: 1.0, countShare: 0.22 },
	{ radiusMin: 11, radiusMax: 24, yRange: 20, scaleMin: 2.5, scaleMax: 14.0, speedMult: 0.55, countShare: 0.20 },
	{ radiusMin: 22, radiusMax: 48, yRange: 32, scaleMin: 4.5, scaleMax: 24.0, speedMult: 0.38, countShare: 0.17 },
	{ radiusMin: 42, radiusMax: 85, yRange: 50, scaleMin: 8.0, scaleMax: 40.0, speedMult: 0.20, countShare: 0.13 },
	// Horizon backdrop: few but HUGE and near-static- fills the far background
	// so wide shots never face a bare sky gradient.
	{ radiusMin: 80, radiusMax: 160, yRange: 70, scaleMin: 18.0, scaleMax: 70.0, speedMult: 0.12, countShare: 0.10 },
]

// Sky + cloud color palettes- drawn by weighted rarity on each drop (see
// pickPreset below); the GUI dropdown picks one manually when colorCycle is off.
// Each preset defines: sky top/bottom gradient, sky's internal FBM cloud tint,
// the 3D cloud sprite tint, and the body's rim color- picked to CONTRAST with
// that preset's sky so the silhouette always separates from the background.
export const COLOR_PRESETS = [
	{
		// Deeper zenith than before- the gradient actually reads on wide shots.
		name: 'Daylight', weight: 3,
		skyTop: new THREE.Color(0x4f9fff), skyBottom: new THREE.Color(0xc4e3ff),
		skyCloudColor: new THREE.Color(0xffffff), cloudsColor: new THREE.Color(0xffffff),
		bodyRim: new THREE.Color(0xff6a00),
	},
	{
		// Golden heaven: warm gold zenith dissolving into cream light, gilded
		// clouds- the divine card. Royal-blue rim: the classic gold pairing.
		name: 'Paradise', weight: 0.4,
		skyTop: new THREE.Color(0xd6952a), skyBottom: new THREE.Color(0xfff3d6),
		skyCloudColor: new THREE.Color(0xfff8e8), cloudsColor: new THREE.Color(0xf2dca6),
		bodyRim: new THREE.Color(0x2f6bff),
	},
	{
		// Cold pale morning: gray-blue zenith over a peach glow, warm gray clouds.
		name: 'Dawn', weight: 3,
		skyTop: new THREE.Color(0x6f8fb0), skyBottom: new THREE.Color(0xf6d3b5),
		skyCloudColor: new THREE.Color(0xf0e3d8), cloudsColor: new THREE.Color(0xd9c7bd),
		bodyRim: new THREE.Color(0xffab3d),
	},
	{
		// Gradient un-inverted: dusky mauve zenith over a glowing orange horizon
		// (the old version put the orange on top). Peach clouds catch the low sun.
		name: 'Sunset', weight: 3,
		skyTop: new THREE.Color(0x8f4f86), skyBottom: new THREE.Color(0xf5975a),
		skyCloudColor: new THREE.Color(0xf8b38a), cloudsColor: new THREE.Color(0xedaa7e),
		bodyRim: new THREE.Color(0x21d9ff),
	},
	{
		// Bubblegum dream: lavender over pink, candy-blue rim.
		name: 'Candy', weight: 0.4,
		skyTop: new THREE.Color(0x8b42c9), skyBottom: new THREE.Color(0xffc2e0),
		skyCloudColor: new THREE.Color(0xffe6f4), cloudsColor: new THREE.Color(0xf7c9e8),
		bodyRim: new THREE.Color(0x38b6ff),
	},
	{
		name: 'Twilight', weight: 1.2,
		skyTop: new THREE.Color(0x33306f), skyBottom: new THREE.Color(0x74538c),
		skyCloudColor: new THREE.Color(0x7d5590), cloudsColor: new THREE.Color(0x55407a),
		bodyRim: new THREE.Color(0xffd166),
	},
	{
		name: 'Aurora', weight: 1.2,
		skyTop: new THREE.Color(0x05203f), skyBottom: new THREE.Color(0x129074),
		skyCloudColor: new THREE.Color(0x96ffe4), cloudsColor: new THREE.Color(0x63f5cf),
		bodyRim: new THREE.Color(0xff8c2e),
	},
	{
		// Deep ocean night: near-black over drowned indigo, cold heavy clouds.
		name: 'Abyss', weight: 1.2,
		skyTop: new THREE.Color(0x030b1a), skyBottom: new THREE.Color(0x16406b),
		skyCloudColor: new THREE.Color(0x2f5d95), cloudsColor: new THREE.Color(0x24476f),
		bodyRim: new THREE.Color(0x00e5a0),
	},
	{
		// Deep space: near-black over drowned violet-indigo, nebula-tinted
		// clouds- and the white dust motes read as stars. Starlight rim.
		name: 'Cosmos', weight: 0.4,
		skyTop: new THREE.Color(0x010209), skyBottom: new THREE.Color(0x0d1030),
		skyCloudColor: new THREE.Color(0x232a5c), cloudsColor: new THREE.Color(0x161a40),
		bodyRim: new THREE.Color(0xcfe8ff),
	},
	{
		// Graphite storm front: slate gradient, steel clouds, electric-yellow rim.
		name: 'Storm', weight: 3,
		skyTop: new THREE.Color(0x232b36), skyBottom: new THREE.Color(0x5a6672),
		skyCloudColor: new THREE.Color(0x8a95a1), cloudsColor: new THREE.Color(0x6b7681),
		bodyRim: new THREE.Color(0xffe14d),
	},
	{
		// The danger card for the drop-driven palette slams: near-black plum over
		// a burning horizon, scorched clouds, glacier-blue rim cutting through the heat.
		name: 'Ember', weight: 1.2,
		skyTop: new THREE.Color(0x200913), skyBottom: new THREE.Color(0xd14a2b),
		skyCloudColor: new THREE.Color(0xe8794f), cloudsColor: new THREE.Color(0x8c3430),
		bodyRim: new THREE.Color(0x66c7ff),
	},
]

// Weighted preset pick (excluding the current one): `weight` is the rarity
// dial- everyday skies draw often, the special cards (Paradise, Cosmos,
// Ember) stay rare treats.
export function pickPreset(excludeIndex = -1) {
	let total = 0
	for (let i = 0; i < COLOR_PRESETS.length; i++) if (i !== excludeIndex) total += COLOR_PRESETS[i].weight
	let roll = Math.random() * total
	for (let i = 0; i < COLOR_PRESETS.length; i++) {
		if (i === excludeIndex) continue
		roll -= COLOR_PRESETS[i].weight
		if (roll <= 0) return i
	}
	return (excludeIndex + 1) % COLOR_PRESETS.length
}

// One mutable params tree per scene instance- mutated live by the GUI and the
// autopilot, read every frame by the modules' update() methods.
export function createDefaultParams() {
	return {
		// AudioFeatures calibration: quiet/loud bracket the spectrum level as
		// FRACTIONS of the track's own recent peak (watch the GUI meters);
		// attack/release are the energy envelope's ramp-up / settle times (seconds);
		// floor is the share of base background speed kept when the music is silent.
		// bpmSlow/bpmFast bracket the tempo estimate into `pace`; rateMin/rateMax
		// is the resulting world-speed multiplier applied scene-wide.
		audio: { quiet: 0.25, loud: 0.75, attack: 0.4, release: 2.0, floor: 0.15, bpmSlow: 90, bpmFast: 165, rateMin: 0.7, rateMax: 1.3 },
		// dropMode: palette transition style on a drop- 'random' draws one per
		// drop among snap (hard cut), flash (through white)
		// and the spatial fronts: wipe (circle from center), curtain (rising),
		// iris (closing from the edges), dissolve (FBM-eaten).
		autopilot: { enabled: true, speed: 0.5, colorCycle: true, preset: 0, dropMode: 'random' },
		// Director (base flow + hard-kick accents): a hard kick punches to an
		// accent shot when energy >= minEnergy, the cooldown has elapsed and the
		// accentChance roll passes; the accent holds accentMin..accentMax seconds
		// then cuts back to the base flow. zoomDrift: chance an accent slowly
		// zooms during its run (half in, half out).
		// chainChance: an expiring accent may cut straight to another shot
		// instead of returning to base (geometric decay- base stays the norm).
		director: { enabled: true, accentChance: 0.6, accentCooldown: 6, accentMin: 2.5, accentMax: 5, minEnergy: 0.45, zoomDrift: 0.7, chainChance: 0.35, strobeChance: 0.35 },
		// Drop impact: shock = the expanding lens shockwave's displacement;
		// kick = the single hard camera hit; punch = the fov zoom snap.
		drop: { shock: 0.06, kick: 1.0, punch: 1.0 },
		// THE master perf lever: cap on the devicePixelRatio used by the whole
		// render chain- fragment cost scales with its SQUARE (2 → 1.5 ≈ -44%).
		quality: { renderScale: 2 },
		// Global wind- leans the whole fall (sky flow, sprite rise, streaks,
		// body drift) by this angle from vertical. auto = the Wind director
		// drives it (drop anticipation + impact gusts + energy weave); off =
		// the GUI slider owns it. 0 = the pure vertical contract.
		wind: { angle: 0, auto: true },
		// Animation + fx events on the hard kicks ⇒ roughly one event every
		// 30-50s. Frequent enough to carry the show, spaced enough to stay
		// moments (and overlaps stack on top- see events.js).
		// onDrop: every detected drop fires an event outright (chance/cooldown
		// bypassed- the drop IS the moment); the kick path keeps its rolls.
		events: { enabled: true, chance: 0.2, cooldown: 20, minEnergy: 0.3, onDrop: true },
		body: {
			material: 'rim',
			bassScale: 0.55,
			drift: 0.35,   // lateral wind-drift amplitude of the whole body
			slowMo: 0.35,  // animation speed floor at zero energy- breakdowns suspend the fall
			rim: { baseColor: '#d5d5dd', power: 3.0, strength: 1.4, kickHardMult: 1.5, shading: 0.45, ambient: 0.65 },
			normal: { wireframe: false, flatShading: false },
			basic: { color: '#ffffff', wireframe: false },
			wireframe: { color: '#ffffff' },
			depth: { wireframe: false },
		},
		// shake: wind turbulence amplitude (energy²-gated); rollAmp/rollSpeed:
		// slow horizon roll- freefall has no up.
		camera: { baseSpeed: 0.2, kickMult: 2.0, verticalSpeed: 0.26, verticalAmp: 0.85, verticalEnergyMult: 0.5, shake: 0.035, rollAmp: 0.12, rollSpeed: 0.06 },
		sky: {
			enabled: true,
			// The FBM background plays the INFINITELY FAR layer: it must be the
			// slowest thing on screen. At the old rates (~0.34 screen/s mid-energy)
			// it out-ran every sprite layer beyond ~10 units, so the big far clouds
			// read as FALLING against it. The speed feeling now belongs to the
			// sprite field (riseSpeedBase below); the sky just breathes.
			scrollSpeedBase: 0.09,   // floor high enough that residual pitch sweeps never net the sky downward
			// DISTANT clouds barely accelerate with the music: the speed feeling
			// belongs to the sprites and speed lines. At the old 0.05/0.12 the
			// background quadrupled its pace on drops and out-ran every sprite
			// layer again.
			scrollEnergyMult: 0.025,
			scrollKickMult: 0.03,
			cloudScale: 8.0,
			brightnessBase: 0.57,
			brightnessEnergyMult: 0.6,
			midCoverage: 0.12,   // the mids (melody) thicken the FBM cloud cover
			topColor: '#6fb4ff',
			bottomColor: '#bfe1ff',
			cloudColor: '#ffffff',
		},
		clouds: {
			enabled: true,
			count: CLOUD_COUNT_DEFAULT,
			riseSpeedBase: 1.9,   // slightly up- the sprites carry the speed the sky gave up
			riseEnergyMult: 2.4,
			riseKickMult: 4.0,
			opacity: 0.85,
			color: '#ffffff',
			haze: 0.7,   // aerial perspective- distant sprites melt into the horizon color
			weather: 1,  // density-weather swing: 0 = always-full field · 1 = sparse↔crowded breathing
		},
		// Luminous dust riding the fall's upward stream- stronger in calm passages.
		motes: { enabled: true, count: 120, opacity: 0.5, radius: 6, rise: 1.2 },
		// Fake volumetric shafts hanging from above, slowly orbiting.
		rays: { enabled: true, count: 8, opacity: 0.08 },
		// Freefall speed streaks near the camera- opacity gated by energy².
		lines: { enabled: true, count: 70, opacity: 0.4, speedBase: 5, speedEnergyMult: 16, radius: 6 },
		// threshold must stay ABOVE the white body's max luminance (~0.70 with the
		// #d5d5dd base): only the rim-boosted edges cross it, so the bloom halos
		// the contour instead of flaring the whole body.
		bloom: { enabled: true, strengthBase: 0.15, energyMult: 0.35, kickHardMult: 2.2, radius: 1.50, threshold: 0.85 },
		afterimage: { enabled: true, dampBase: 0.85, kickHardMult: 0.2 },
		rgbShift: { enabled: true, highMult: 0.006, angle: 1.98 },
		fisheye: { enabled: true, strengthBase: 1.0, energyMult: 0.45, kickHardMult: 1.3 },
	}
}
