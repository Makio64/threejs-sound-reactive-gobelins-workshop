import * as THREE from 'three'

// Fullscreen background quad rendered in clip space (vertex bypasses projection),
// so the sky is screen-stable regardless of camera orbit. Vertical UV scroll +
// FBM noise = clouds rising = sensation of falling.
export default {
	uniforms: {
		// The ONLY animated pattern input: integrated displacement along the
		// flow compass (sky.js)- its direction lives inside the allowed cone by
		// construction, so the shapes cannot move any other way.
		flowOff: { value: new THREE.Vector2(0, 0) },
		panX: { value: 0 },            // horizontal world-pan- follows the camera azimuth (sky.js)
		panY: { value: 0 },            // vertical world-shift- follows the camera pitch (sky.js)
		rollAngle: { value: 0 },       // screen-space rotation- follows the camera roll (sky.js)
		cloudScale: { value: 3.0 },
		coverageShift: { value: 0 },   // raises the FBM threshold- sparser clouds at high energy
		brightness: { value: 0.95 },
		resolution: { value: new THREE.Vector2(1, 1) },
		skyTop: { value: new THREE.Color(0x6fb4ff) },
		skyBottom: { value: new THREE.Color(0xbfe1ff) },
		cloudColor: { value: new THREE.Color(0xffffff) },
		// Second palette + front for the 'wipe' transition: the new colors grow
		// from screen center outward. wipe stays 0 outside transitions.
		skyTopB: { value: new THREE.Color(0x6fb4ff) },
		skyBottomB: { value: new THREE.Color(0xbfe1ff) },
		cloudColorB: { value: new THREE.Color(0xffffff) },
		wipe: { value: 0 },
		wipeMode: { value: 0 },   // 0 circle · 1 curtain · 2 iris · 3 dissolve
	},
	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4( position.xy, 1.0, 1.0 );
		}
	`,
	fragmentShader: /* glsl */`
		uniform vec2 flowOff;
		uniform float panX;
		uniform float panY;
		uniform float rollAngle;
		uniform float cloudScale;
		uniform float coverageShift;
		uniform float brightness;
		uniform vec2 resolution;
		uniform vec3 skyTop;
		uniform vec3 skyBottom;
		uniform vec3 cloudColor;
		uniform vec3 skyTopB;
		uniform vec3 skyBottomB;
		uniform vec3 cloudColorB;
		uniform float wipe;
		uniform float wipeMode;
		varying vec2 vUv;

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
			for ( int i = 0; i < 5; i ++ ) {
				v += a * noise( p );
				p *= 2.0;
				a *= 0.5;
			}
			return v;
		}
		// 3-octave variant for the smoothstepped channels- the warp displacement,
		// the mass-gated detail field and the self-shadow probe all land inside
		// wide smoothstep windows where the two missing high octaves are invisible,
		// and this runs fullscreen so the trimmed octaves are real ALU. The full
		// 5-octave fbm must stay on the mass field: it sets the cloud silhouette.
		// +0.046875 restores the dropped octaves' expected value, so deltas
		// against the 5-octave fbm keep an unbiased mean.
		float fbm3( vec2 p ) {
			return 0.5 * noise( p ) + 0.25 * noise( p * 2.0 ) + 0.125 * noise( p * 4.0 ) + 0.046875;
		}
		// 2-octave variant for the SECONDARY mass layer: it only interferes with
		// massA to animate the cover, its own micro-detail is invisible under
		// massA's- and it runs fullscreen. +0.109375 = the dropped octaves'
		// expected value, keeping the 0.62/0.38 blend mean-unbiased.
		float fbm2( vec2 p ) {
			return 0.5 * noise( p ) + 0.25 * noise( p * 2.0 ) + 0.109375;
		}

		void main() {
			// Aspect correction keeps clouds round; subtracting from y samples lower
			// rows over time, which reads as upward motion.
			vec2 uv = vUv;
			uv.x *= resolution.x / resolution.y;
			// Camera coupling (yaw=panX, pitch=panY, roll=rollAngle- all set in
			// sky.js): the background moves as part of the same world the sprites
			// live in, instead of sitting frozen behind their sweeps. Roll first,
			// around the screen center, so the fall scroll below runs along the
			// tilted world vertical; then the yaw/pitch shifts; then the fall.
			vec2 ctr = vec2( 0.5 * resolution.x / resolution.y, 0.5 );
			float cr = cos( rollAngle );
			float sr = sin( rollAngle );
			vec2 rd = uv - ctr;
			uv = ctr + vec2( cr * rd.x - sr * rd.y, sr * rd.x + cr * rd.y );
			uv.x += panX;
			uv.y += panY;

			// Spatial palette transitions: the B palette advances behind a moving
			// front (metric picked by wipeMode). Skipped entirely outside
			// transitions (wipe stays 0).
			float wm = 0.0;
			if ( wipe > 0.0 ) {
				float aspectW = resolution.x / resolution.y;
				float wd = length( vec2( ( vUv.x - 0.5 ) * aspectW, vUv.y - 0.5 ) );
				if ( wipeMode < 0.5 ) {          // circle bursting from center
					float front = wipe * 1.25;
					wm = 1.0 - smoothstep( front - 0.18, front, wd );
				} else if ( wipeMode < 1.5 ) {   // curtain rising with the fall stream
					float front = wipe * 1.3;
					wm = 1.0 - smoothstep( front - 0.25, front, vUv.y );
				} else if ( wipeMode < 2.5 ) {   // inverse iris- closes on the center
					float inner = ( 1.0 - wipe ) * 1.25 - 0.18;
					wm = smoothstep( inner, inner + 0.18, wd );
				} else {                         // organic FBM dissolve
					float th = 1.05 - wipe * 1.2;
					wm = smoothstep( th - 0.08, th + 0.08, fbm( vec2( vUv.x * aspectW, vUv.y ) * 3.5 ) );
				}
			}
			vec3 topC = mix( skyTop, skyTopB, wm );
			vec3 bottomC = mix( skyBottom, skyBottomB, wm );
			vec3 cloudC = mix( cloudColor, cloudColorB, wm );

			vec3 sky = mix( bottomC, topC, vUv.y );
			// Motion contract of the rework: the shapes' ONLY animation is the
			// advection of two layers along flowOff at different speeds (1x and
			// 1.55x- an internal parallax whose interference makes the cover
			// boil organically), and the domain warp is STATIC (billowy shapes,
			// zero drift of its own). Nothing here can carry a lobe outside the
			// flow cone- downward is unreachable by construction.
			// cloudScale zooms ONLY the bounded screen coordinate, anchored on
			// the screen center; the accumulated flow is stored scale-invariant
			// (constant reference multipliers- ref scale 6, the autopilot LFO's
			// midpoint). Multiplying the unbounded accumulated flow by a
			// BREATHING cloudScale sent the whole pattern rushing off-axis-
			// downward half the time (measured: up to 43% of cloud blocks
			// descending; anchored: zero).
			vec2 fb = uv - ctr;
			vec2 mA = fb * cloudScale * 0.35 - flowOff * 2.1;
			vec2 warp = vec2( fbm3( mA + vec2( 17.3, 3.1 ) ), fbm3( mA + vec2( 5.2, 11.7 ) ) );
			vec2 mw = mA + ( warp - 0.5 ) * 1.2;
			float massA = fbm( mw );
			float massB = fbm2( fb * cloudScale * 0.8 - flowOff * 7.44 + vec2( 41.7, 7.9 ) );
			float mass = massA * 0.62 + massB * 0.38;
			// The fine detail lives only INSIDE the dominant masses (modulated)-
			// no uniform full-screen grain.
			float detail = fbm3( fb * cloudScale - flowOff * 6.0 + vec2( 37.2, 11.7 ) );
			float density = mass + ( detail - 0.5 ) * 0.55 * massA;
			// coverageShift raises the window at high energy: only the dense FBM
			// cores survive, so the sky gradient stays visible behind the speed
			// streaks instead of drowning under a full-frame noise wall.
			float clouds = smoothstep( 0.36 + coverageShift, 0.68 + coverageShift, density );
			// Top-lit self-shadowing on the dominant layer: a denser field just
			// above means this pixel is an underside. The shadow tint comes from
			// the preset palette, so the color cycle carries through.
			float above = fbm3( mw + vec2( 0.0, 0.12 * cloudScale * 0.35 ) );
			float shadow = smoothstep( 0.0, 0.25, above - massA ) * 0.55;
			vec3 shadowCol = mix( cloudC, topC, 0.45 ) * 0.8;
			vec3 cloudCol = mix( cloudC * brightness, shadowCol, shadow );
			vec3 col = mix( sky, cloudCol, clouds );
			gl_FragColor = vec4( col, 1.0 );
		}
	`,
}
