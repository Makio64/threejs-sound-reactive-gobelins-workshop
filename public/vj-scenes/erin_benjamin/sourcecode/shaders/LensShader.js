import { Vector2 } from 'three'

// Combined lens pass: barrel-distortion fisheye + RGB shift + drop shockwave
// + broken-mirror shatter + Droste echo in ONE fullscreen pass. The shift
// offsets are applied in the pre-fisheye source space- sampling
// src(fisheye(uv) ± off)- which is exactly equivalent to the old two-pass
// chain (shift first, then fisheye warping the result).
//
// Fisheye: uv = c / (1 + k·r²) magnifies the centre and pulls source edges
// off-screen as k grows; k=0 is identity, k<0 reverses to pincushion.
// Shockwave: a gaussian ring of radial displacement expanding from screen
// center (radius shockR, strength shockAmp- driven by the drop pulse in
// postfx.js), with chromatic aberration riding its front. Zero cost when
// shockAmp is 0.
// Shatter: giant ORGANIC Voronoi shards (a handful of irregular polygons-
// no geometric web). Each shard rigidly tilts hard around its own site and
// slides apart. Nothing is drawn or shaded on top: the image mismatch
// between neighboring shards IS the whole break. The 0.4s attack animates
// the give, shatterTime keeps the pieces creeping apart while it holds, and
// everything heals on the release. Seed re-rolled per event.
// Echo (Droste): the BODY ALONE repeats in growing copies around the real
// one. echoTexture is the body layer rendered on transparent black (see
// postfx.js); copies are composited by priority- the real body first, then
// each bigger copy only where nothing nearer covers it- so the layers nest
// like frames, every one carrying the hero's exact colors.
// Both amounts are event envelopes (features.boost.*), zero cost at 0.
export default {
	uniforms: {
		tDiffuse: { value: null },
		strength: { value: 0 },   // fisheye k
		amount: { value: 0 },     // rgb shift offset length
		angle: { value: 0 },      // rgb shift offset angle
		shockR: { value: 0 },     // shockwave ring radius (aspect-corrected screen units)
		shockAmp: { value: 0 },   // shockwave displacement strength
		shatter: { value: 0 },    // broken-mirror amount (event envelope)
		shatterSeed: { value: 0 },// re-rolled per shatter event- a fresh crack pattern each time
		shatterTime: { value: 0 },// seconds since the break- the shards keep drifting apart while it holds
		echoAmt: { value: 0 },    // Droste layer amount (event envelope)
		echoTexture: { value: null },   // body layer alone on transparent black- wired by PostFX
		echoCenter: { value: new Vector2(0.5, 0.5) },   // the body's projected screen position- the copies nest around HIM
		aspect: { value: 1 },
		// Selective-bloom layer, added at the warped uv so the glow bends with
		// the lens instead of floating over it; bloomOn gates the add so the
		// stale target of an inactive bloom never leaks in.
		bloomTexture: { value: null },
		bloomOn: { value: 0 },
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		uniform float strength;
		uniform float amount;
		uniform float angle;
		uniform float shockR;
		uniform float shockAmp;
		uniform float shatter;
		uniform float shatterSeed;
		uniform float shatterTime;
		uniform float echoAmt;
		uniform sampler2D echoTexture;
		uniform vec2 echoCenter;
		uniform float aspect;
		uniform sampler2D bloomTexture;
		uniform float bloomOn;
		varying vec2 vUv;
		vec2 hash2( vec2 q ) {
			return fract( sin( vec2( dot( q, vec2( 127.1, 311.7 ) ), dot( q, vec2( 269.5, 183.3 ) ) ) ) * 43758.5453 );
		}
		void main() {
			vec2 c = vUv - 0.5;
			float r2 = dot( c, c );
			vec2 uv = clamp( c / ( 1.0 + strength * r2 ) + 0.5, 0.0, 1.0 );
			vec2 off = amount * vec2( cos( angle ), sin( angle ) );
			vec2 chroma = vec2( 0.0 );
			if ( shockAmp > 0.0001 ) {
				// Expanding gaussian ring: pixels on the front get pushed outward,
				// and the chromatic split rides the wave.
				float d = length( vec2( c.x * aspect, c.y ) );
				vec2 rd = d < 1e-4 ? vec2( 0.0 ) : c / d;
				// Main front + a trailing echo at half amplitude: double detonation.
				float ring = exp( -pow( ( d - shockR ) * 11.0, 2.0 ) )
					+ 0.45 * exp( -pow( ( d - shockR * 0.55 ) * 11.0, 2.0 ) );
				uv = clamp( uv + rd * ring * shockAmp, 0.0, 1.0 );
				chroma = rd * ring * shockAmp * 0.5;
			}
			if ( shatter > 0.001 ) {
				// Giant organic Voronoi shards (~1.1 cells across- a handful of
				// irregular pieces, aspect-corrected). Nearest site in the 3×3
				// hood; the seed shifts the whole lattice per event.
				vec2 p = vec2( vUv.x * aspect, vUv.y ) * 1.1 + shatterSeed;
				vec2 cell = floor( p );
				vec2 f = p - cell;
				vec2 toSite = vec2( 0.0 );
				vec2 siteId = vec2( 0.0 );
				float d1 = 8.0;
				for ( int y = -1; y <= 1; y++ )
				for ( int x = -1; x <= 1; x++ ) {
					vec2 n = vec2( float( x ), float( y ) );
					vec2 o = n + hash2( cell + n ) - f;
					float dd = dot( o, o );
					if ( dd < d1 ) { d1 = dd; toSite = o; siteId = cell + n; }
				}
				// Rigid per-shard motion: a tilt around the shard's own site
				// (up to ~±17°) + a slide. Displacement = o - rot(a)·o plus
				// the slide. The attack animates the give, shatterTime keeps the
				// pieces creeping apart while the event holds (+8%/s), and it all
				// heals on the release. Applied to the sampling uv AFTER
				// fisheye/shock, so the chroma and bloom taps inherit the break.
				float spread = shatter * ( 1.0 + shatterTime * 0.08 );
				vec2 rnd = hash2( siteId * 1.7 + 3.1 ) - 0.5;
				float a = rnd.x * 0.6 * spread;
				vec2 rotated = vec2( cos( a ) * toSite.x - sin( a ) * toSite.y, sin( a ) * toSite.x + cos( a ) * toSite.y );
				vec2 disp = ( toSite - rotated + rnd * 0.3 * spread ) / 1.1;
				uv = clamp( uv + vec2( disp.x / aspect, disp.y ), 0.0, 1.0 );
			}
			vec4 base = texture2D( tDiffuse, uv );
			vec2 uvR = clamp( uv + off + chroma, 0.0, 1.0 );
			vec2 uvB = clamp( uv - off - chroma, 0.0, 1.0 );
			float cr = texture2D( tDiffuse, uvR ).r;
			float cb = texture2D( tDiffuse, uvB ).b;
			// The bloom gets the SAME per-channel shift as the base- sampling the
			// sum equals summing the samples, so this matches the old
			// merge-before-lens pipeline exactly. Added unshifted instead, thin
			// bright rims go green: the R/B taps land beside the un-haloed line
			// and lose the glow that used to fill them. Uniform branch: three
			// fullscreen fetches skipped whenever the bloom gate is off.
			vec3 bloom = vec3( 0.0 );
			if ( bloomOn > 0.5 ) {
				bloom = vec3(
					texture2D( bloomTexture, uvR ).r,
					texture2D( bloomTexture, uv ).g,
					texture2D( bloomTexture, uvB ).b );
			}
			vec3 col = vec3( cr, base.g, cb ) + bloom;
			if ( echoAmt > 0.001 ) {
				// Body-only Droste: copies of the body grow around the real one,
				// each zoom easing out from 1 with the envelope so the layers
				// bloom outward and retract. Zoomed around echoCenter- the body's
				// projected screen position- so the stack always faces the camera,
				// nested on HIM wherever the framing puts him. The occupied mask
				// enforces the paint priority: real body > copy 1 > 2 > 3.
				// Exact-color copies: echoTexture only MASKS where the body is-
				// the copy's color is read from the composed frame itself (base +
				// bloom) at the zoomed point, so every layer shows the hero
				// precisely as he appears on screen, glow included.
				float occupied = texture2D( echoTexture, uv ).a;
				for ( int k = 1; k <= 3; k++ ) {
					float z = mix( 1.0, pow( 1.4, float( k ) ), echoAmt );
					vec2 q = ( uv - echoCenter ) / z + echoCenter;
					float copyA = texture2D( echoTexture, q ).a;
					vec3 copyCol = texture2D( tDiffuse, q ).rgb + texture2D( bloomTexture, q ).rgb * bloomOn;
					col = mix( col, copyCol, copyA * ( 1.0 - occupied ) );
					occupied = min( 1.0, occupied + copyA );
				}
			}
			gl_FragColor = vec4( col, base.a );
		}
	`,
}
