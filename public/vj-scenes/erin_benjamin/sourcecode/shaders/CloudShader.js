import * as THREE from 'three'

// Instanced cloud sprite: ONE draw call for the whole field. Per-sprite
// variation (seed, noise rotation, shadow depth, edge fade, position, aspect
// scale) rides instanced attributes; palette colors, churn clock and global
// opacity are shared uniforms. The vertex builds a point-facing billboard
// with world-up (same orientation lookAt gave the per-mesh version), and the
// fragment is a puffy FBM lit as a VOLUME: domain warp, bumpy-sphere normal
// with half-Lambert modeling in the preset's palette, crease occlusion,
// sunlit crests, near-lens dissolve.
export default {
	uniforms: {
		opacity: { value: 0.85 },
		time: { value: 0 },        // churn clock- integrated in clouds.js, energy-driven
		cloudColor: { value: new THREE.Color(0xffffff) },
		shadowColor: { value: new THREE.Color(0xbfbfbf) },   // kept in-palette by clouds.js (preset skyTop pull)
		hazeColor: { value: new THREE.Color(0xbfe1ff) },     // the preset's horizon- lerped with the color cycle
		hazeAmount: { value: 0.7 },
		// Second palette + front for the 'wipe' transition (see SkyShader)-
		// wipe stays 0 outside transitions.
		cloudColorB: { value: new THREE.Color(0xffffff) },
		shadowColorB: { value: new THREE.Color(0xbfbfbf) },
		hazeColorB: { value: new THREE.Color(0xbfe1ff) },
		wipe: { value: 0 },
		wipeMode: { value: 0 },   // 0 circle · 1 curtain · 2 iris · 3 dissolve
		aspect: { value: 1 },
	},
	vertexShader: /* glsl */`
		uniform float time;
		attribute vec3 aOffset;
		attribute vec2 aScale;
		attribute vec3 aSprite;   // x: seed · y: noise rotation · z: shadow depth
		attribute float aFade;    // band-edge envelope, updated per frame
		varying vec2 vUv;
		varying vec3 vViewPos;
		varying float vShadowMult;
		varying float vFade;
		varying vec4 vClip;
		varying vec2 vW;
		varying vec2 vChurnOff;
		void main() {
			vUv = uv;
			vShadowMult = aSprite.z;
			vFade = aFade;
			// Per-sprite rotation of the noise domain- breaks the clone look
			// without touching the lighting: the fragment's normal is built in
			// QUAD space (p), which this rotation never touches.
			float ca = cos( aSprite.y );
			float sa = sin( aSprite.y );
			vec2 p = uv - 0.5;
			vec2 seedOff = vec2( aSprite.x * 7.3, aSprite.x * 2.1 );
			// Billow frequency grows with the sprite's size (2.4 for the small
			// puffs, up to 4.2 for the giants): a giant is a MASS of lobes, not
			// a zoomed-up puff- zoomed noise reads soft and empty at 40 units.
			float freq = 2.4 + 1.8 * clamp( aScale.y / 30.0, 0.0, 1.0 );
			// Rotated+scaled noise domain- affine in uv, so the varying
			// interpolates to the exact per-pixel value.
			vW = vec2( ca * p.x - sa * p.y, sa * p.x + ca * p.y ) * freq + seedOff;
			// Churn clock offset for the fragment's domain warp (energy-driven
			// clock, integrated in clouds.js). It is (a) COUNTER-ROTATED into
			// the noise domain so the drift
			// reads as screen-UP for every sprite- unrotated, each sprite
			// drifted in a random direction and half the field visibly sank-
			// and (b) divided by the sprite scale so the world-equivalent
			// drift speed is identical for a 1-unit puff and a 45-unit
			// backdrop giant (unscaled, the drift out-ran the far layers'
			// real rise 10-90x). Per-instance constant, so it interpolates
			// flat as a varying.
			vChurnOff = vec2( sa, -ca ) * ( time / aScale.y );
			// The group carries the camera's vertical lock- bring the anchor
			// through the model matrix before billboarding around it.
			vec3 anchor = ( modelMatrix * vec4( aOffset, 1.0 ) ).xyz;
			vec3 fwd = normalize( cameraPosition - anchor );
			// World-up billboard (matches lookAt with default up); fall back to Z
			// when looking straight down/up, where the cross degenerates.
			vec3 upRef = abs( fwd.y ) > 0.99 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 0.0, 1.0, 0.0 );
			vec3 right = normalize( cross( upRef, fwd ) );
			vec3 up = cross( fwd, right );
			vec3 world = anchor + right * position.x * aScale.x + up * position.y * aScale.y;
			vec4 mv = viewMatrix * vec4( world, 1.0 );
			vViewPos = mv.xyz;
			gl_Position = projectionMatrix * mv;
			vClip = gl_Position;
		}
	`,
	fragmentShader: /* glsl */`
		uniform float opacity;
		uniform vec3 cloudColor;
		uniform vec3 shadowColor;
		uniform vec3 hazeColor;
		uniform float hazeAmount;
		uniform vec3 cloudColorB;
		uniform vec3 shadowColorB;
		uniform vec3 hazeColorB;
		uniform float wipe;
		uniform float wipeMode;
		uniform float aspect;
		varying vec2 vUv;
		varying vec3 vViewPos;
		varying float vShadowMult;
		varying float vFade;
		varying vec4 vClip;
		varying vec2 vW;
		varying vec2 vChurnOff;

		float hash( vec2 p ) {
			return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );
		}
		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			f = f * f * ( 3.0 - 2.0 * f );
			return mix(
				mix( hash( i ), hash( i + vec2( 1.0, 0.0 ) ), f.x ),
				mix( hash( i + vec2( 0.0, 1.0 ) ), hash( i + vec2( 1.0, 1.0 ) ), f.x ),
				f.y
			);
		}
		float fbm( vec2 p ) {
			float v = 0.0;
			float a = 0.5;
			for ( int i = 0; i < 4; i ++ ) {
				v += a * noise( p );
				p *= 2.0;
				a *= 0.5;
			}
			return v;
		}
		// 3-octave variant for the domain warp- the warp only displaces the
		// domain of the 4-octave density fbm, where the missing top octave is
		// sub-pixel, and the field is the scene's biggest fragment cost.
		// +0.03125 restores the dropped octave's expected value, so the
		// ( warp - 0.5 ) remap keeps an unbiased mean.
		float fbm3( vec2 p ) {
			return 0.5 * noise( p ) + 0.25 * noise( p * 2.0 ) + 0.125 * noise( p * 4.0 ) + 0.03125;
		}

		void main() {
			// Aerial perspective: distant sprites melt toward the preset's horizon
			// color and thin out- the depth turns milky instead of staying crisp
			// to the last layer. THE dreamy ingredient.
			float dist = length( vViewPos );
			float haze = smoothstep( 25.0, 110.0, dist ) * hazeAmount;
			// The close camera shots orbit INSIDE the near cloud band, so sprites
			// can cross the lens: without this they pop in as huge dark blobs the
			// instant the billboard flips past the camera. Dissolve them over the
			// last 2 world units instead- fully gone before the near plane.
			float nearFade = smoothstep( 0.7, 2.0, dist );
			// Alpha ceiling from the noise-free factors only- body*puff never
			// exceeds 1, so pixels that cannot reach the write threshold
			// (band-faded sprites, lens-crossing sprites) bail before any
			// noise octave runs.
			float alphaCeil = opacity * vFade * nearFade * ( 1.0 - haze * 0.35 );
			if ( alphaCeil < 0.01 ) discard;
			// Spatial palette transitions: same screen-space metrics as the sky
			// shader, so each front crosses background and sprites as ONE shape.
			float wm = 0.0;
			if ( wipe > 0.0 ) {
				vec2 ndc = vClip.xy / vClip.w;
				vec2 suv = ndc * 0.5 + 0.5;   // matches the sky's vUv
				float wd = length( vec2( ndc.x * aspect, ndc.y ) ) * 0.5;
				if ( wipeMode < 0.5 ) {          // circle bursting from center
					float front = wipe * 1.25;
					wm = 1.0 - smoothstep( front - 0.18, front, wd );
				} else if ( wipeMode < 1.5 ) {   // curtain rising with the fall stream
					float front = wipe * 1.3;
					wm = 1.0 - smoothstep( front - 0.25, front, suv.y );
				} else if ( wipeMode < 2.5 ) {   // inverse iris- closes on the center
					float inner = ( 1.0 - wipe ) * 1.25 - 0.18;
					wm = smoothstep( inner, inner + 0.18, wd );
				} else {                         // organic FBM dissolve
					float th = 1.05 - wipe * 1.2;
					wm = smoothstep( th - 0.08, th + 0.08, fbm( vec2( suv.x * aspect, suv.y ) * 3.5 ) );
				}
			}
			vec3 cloudColorM = mix( cloudColor, cloudColorB, wm );
			vec3 shadowColorM = mix( shadowColor, shadowColorB, wm );
			vec3 hazeColorM = mix( hazeColor, hazeColorB, wm );
			vec2 p = vUv - 0.5;
			// Domain warp: the field curls on itself- organic billows instead of
			// raw noise- and vChurnOff drifts the warp so the cloud churns from
			// the inside (screen-up, scale-normalized- see the vertex stage).
			vec2 warp = vec2( fbm3( vW + vChurnOff ), fbm3( vW + vec2( 5.2, 1.3 ) + vChurnOff ) );
			float n = fbm( vW + ( warp - 0.5 ) * 1.4 );
			// FBM-warped radius: the silhouette turns jagged and organic instead of
			// showing the quad's circular falloff. Dense core, soft ragged edge.
			float r = length( p ) * 2.0 + ( n - 0.5 ) * 0.8;
			// pow 0.8 densifies the core without touching the soft edge- the
			// sprite reads as a MASS, not a veil.
			float body = pow( 1.0 - smoothstep( 0.1, 0.95, r ), 0.8 );
			// Wider soft window (0.12-0.5): the interior saturates sooner- the
			// sprite reads as cloud MATTER, not a translucent veil.
			float puff = smoothstep( 0.12, 0.5, n );
			// Fluffy modeling: a bumpy SPHERE normal (the warped radius carries
			// the cauliflower bumps into it) perturbed by the two warp channels-
			// a free detail normal, they are already computed- lit half-Lambert
			// from a fixed top-front sun. Per-pixel rounded volume for LESS ALU
			// than the density probe it replaces (the whole block reuses existing
			// values- zero extra noise taps).
			float r01 = clamp( r, 0.0, 1.0 );
			vec3 nrm = normalize( vec3( p * 2.0 + ( warp - 0.5 ) * 1.1, 0.5 + 0.5 * sqrt( 1.0 - r01 * r01 ) ) );
			float lambert = dot( nrm, vec3( 0.28, 0.72, 0.63 ) ) * 0.5 + 0.5;
			// vShadowMult (0.8-1.2 per sprite) now varies the modeling CONTRAST-
			// same role it had on the old shadow depth.
			float shade = pow( lambert, 1.5 * vShadowMult );
			// Crease occlusion: the folds between billows (low detail noise
			// inside the body) sink slightly- the cauliflower reads as depth.
			float ao = 0.78 + 0.22 * smoothstep( 0.25, 0.7, n );
			vec3 col = mix( shadowColorM, cloudColorM, shade ) * ao;
			// Sunlit crest: the lobes facing the light catch a near-white
			// highlight- the fluffy top, echoing the body's rim language.
			float crest = pow( max( 0.0, dot( nrm, vec3( 0.28, 0.72, 0.63 ) ) ), 4.0 );
			col += mix( cloudColorM, vec3( 1.0 ), 0.5 ) * crest * 0.3;
			col = mix( col, hazeColorM, haze );
			float alpha = body * puff * alphaCeil;
			if ( alpha < 0.01 ) discard;   // avoid sorting artifacts on near-empty pixels
			gl_FragColor = vec4( col, alpha );
		}
	`,
}
