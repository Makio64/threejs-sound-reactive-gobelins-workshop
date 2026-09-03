import{t as e}from"./dropAnalysis.js";import t from"/sounds/Analyzer.js";import*as n from"three";import{Vector2 as r}from"three";import{GLTFLoader as i}from"three/addons/loaders/GLTFLoader.js";import{clone as a}from"three/addons/utils/SkeletonUtils.js";import{OrbitControls as o}from"three/addons/controls/OrbitControls.js";import{Pane as s}from"tweakpane";import{AfterimagePass as c}from"three/addons/postprocessing/AfterimagePass.js";import{EffectComposer as l}from"three/addons/postprocessing/EffectComposer.js";import{OutputPass as u}from"three/addons/postprocessing/OutputPass.js";import{RenderPass as d}from"three/addons/postprocessing/RenderPass.js";import{ShaderPass as f}from"three/addons/postprocessing/ShaderPass.js";import{UnrealBloomPass as p}from"three/addons/postprocessing/UnrealBloomPass.js";import{FullScreenQuad as m,Pass as h}from"three/addons/postprocessing/Pass.js";var g=class{constructor(e){this.params=e,this.bass=0,this.mid=0,this.high=0,this.energy=0,this.flow=0,this.bpm=100,this.pace=.5,this.rate=1,this.dropPulse=0,this.boost={wind:0,motes:0,rays:0,raysCount:0,bloom:0,afterimage:0,shatter:0,echo:0,multicam:0,crowd:0,twin:0},this.quietTime=0,this.riseTime=0,this.hotTime=0,this.bassQuiet=0,this.bassRise=0,this.dropCooldown=0,this.tSlow=1,this.kickAgo=9,this.dipTime=0,this.dipAgo=9,this.timelineActive=!1,this.dropIn=1/0,this.debugDrops=!1,this._dbgTimer=0,this._dbgWasHot=!1,this._dbgPrevBass=0,this.peaks={bass:.05,mid:.05,high:.05,energy:.05},this.refs={bass:.05,mid:.05,high:.05,energy:.05},this.floorLevel=.05,this.time=0,this.prevKick=0,this.lastKickAt=null,this.intervals=[]}normalized(e,t,n){let r=this.refs;r[e]=Math.max(.05,t,r[e]*Math.exp(-n/1500));let i=this.peaks;return i[e]=Math.max(.05,r[e]*.4,t,i[e]*.99985**(n*60)),t/i[e]}fireDrop(e=`external`){this.dropPulse=1,this.dropCooldown=8,this.quietTime=0,this.bassQuiet=0,this.debugDrops&&console.log(`[drop] FIRE via ${e} @${this.time.toFixed(1)}s`)}update(e,t){let n=this.params.audio,r=t.volumeByFrequency;this.bass=v(this.bass,this.normalized(`bass`,_(r,1,8),e),e,.04,.3),this.mid=v(this.mid,this.normalized(`mid`,_(r,8,60),e),e,.04,.3),this.high=v(this.high,this.normalized(`high`,_(r,60,200),e),e,.04,.3);let i=_(r,1,120);this.rawSmooth=v(this.rawSmooth??i,i,e,.35,.35);let a=this.peaks;this.refs.energy=Math.max(.05,this.rawSmooth,this.refs.energy*Math.exp(-e/1500)),a.energy=Math.max(.05,this.refs.energy*.4,this.rawSmooth,a.energy*.99985**(e*60));let o=this.rawSmooth<this.floorLevel?3:25;this.floorLevel+=(this.rawSmooth-this.floorLevel)*(1-Math.exp(-e/o));let s=Math.max(.02,a.energy-this.floorLevel),c=e=>{let t=Math.min(1,Math.max(0,(e-n.quiet)/Math.max(.01,n.loud-n.quiet)));return t*t*(3-2*t)},l=c((i-this.floorLevel)/s);this.energy=v(this.energy,c((this.rawSmooth-this.floorLevel)/s),e,n.attack,n.release),this.flow=v(this.flow,t.kick,e,.09,.35),this.time+=e;let u=t.kick>.9&&this.prevKick<=.9;if(this.prevKick=t.kick,u){if(this.lastKickAt!==null){let e=this.time-this.lastKickAt,t=60/this.bpm,n=e/t,r=Math.round(n);if(r>=2&&Math.abs(n-r)<.15*r&&(e/=r),e>=.25&&e<=2){this.intervals.push(e),this.intervals.length>6&&this.intervals.shift();let t=[...this.intervals].sort((e,t)=>e-t);this.bpmTarget=60/t[Math.floor(t.length/2)]}}this.lastKickAt=this.time}this.bpm=v(this.bpm,this.bpmTarget??this.bpm,e,1.5,1.5);let d=Math.min(1,Math.max(0,(this.bpm-n.bpmSlow)/Math.max(1,n.bpmFast-n.bpmSlow)));this.pace=v(this.pace,d,e,1,1.5),this.rate=n.rateMin+(n.rateMax-n.rateMin)*this.pace,this.energy<.4?(this.quietTime+=e,this.riseTime=0):(this.riseTime+=e,this.riseTime>1.2&&(this.quietTime=0)),this.hotTime=l>.8?this.hotTime+e:0,this.bass<.35?(this.bassQuiet+=e,this.bassRise=0):(this.bassRise+=e,this.bassRise>.8&&(this.bassQuiet=0)),this.dropCooldown=Math.max(0,this.dropCooldown-e),this.tSlow=v(this.tSlow,l,e,2.5,2.5),this.kickAgo=t.kickHard>.9?0:this.kickAgo+e,l<.55?(this.dipTime+=e,this.dipAgo=0):(this.dipAgo+=e,this.dipAgo>.3&&(this.dipTime=0));let f=this.hotTime>.1&&this.energy>.55&&this.quietTime>.5&&this.bass>.4,p=this.bass>.6&&l>.8&&this.bassQuiet>.45,m=l>.85&&l-this.tSlow>.3&&this.hotTime<.4&&this.kickAgo<.15&&this.energy>.3,h=l>.85&&this.dipTime>.2&&this.kickAgo<.15&&this.energy>.3,g=p&&this.bassQuiet>.9||f&&this.quietTime>1.5,y=this.dropCooldown<=0||g&&this.dropCooldown<=6,b=!this.timelineActive&&(f||p||m||h)&&y;if(b&&(this.dropPulse=1,this.dropCooldown=8,this.quietTime=0,this.bassQuiet=0),this.debugDrops&&!this.timelineActive){this._dbgTimer=Math.max(0,this._dbgTimer-e);let t=l>.8,n=this.bass>.6&&this._dbgPrevBass<=.6;b?console.log(`[drop] FIRE via ${p?`bass`:h?`breath`:m?`jump`:`quiet`} @${this.time.toFixed(1)}s`):(t&&!this._dbgWasHot||n)&&this._dbgTimer<=0&&(this._dbgTimer=2,console.log(`[drop] candidate NOT fired @${this.time.toFixed(1)}s- bass=${this.bass.toFixed(2)} bassQuiet=${this.bassQuiet.toFixed(2)}/0.45 quietTime=${this.quietTime.toFixed(2)}/0.5 energy=${this.energy.toFixed(2)} t=${l.toFixed(2)} tSlow=${this.tSlow.toFixed(2)} kickAgo=${this.kickAgo.toFixed(2)} cooldown=${this.dropCooldown.toFixed(1)}`)),this._dbgWasHot=t,this._dbgPrevBass=this.bass}this.dropPulse=Math.max(0,this.dropPulse-e*1.5),this.dropPulse>.88&&(this.rate*=.08)}};function _(e,t,n){let r=0;for(let i=t;i<n;i++)r+=e[i];return r/(n-t)}function v(e,t,n,r,i){let a=t>e?r:i;return e+(t-e)*(1-Math.exp(-n/a))}const y=[{radiusMin:2,radiusMax:6,yRange:8,scaleMin:.7,scaleMax:4.5,speedMult:1.9,countShare:.18},{radiusMin:5,radiusMax:12,yRange:12,scaleMin:1.4,scaleMax:8,speedMult:1,countShare:.22},{radiusMin:11,radiusMax:24,yRange:20,scaleMin:2.5,scaleMax:14,speedMult:.55,countShare:.2},{radiusMin:22,radiusMax:48,yRange:32,scaleMin:4.5,scaleMax:24,speedMult:.38,countShare:.17},{radiusMin:42,radiusMax:85,yRange:50,scaleMin:8,scaleMax:40,speedMult:.2,countShare:.13},{radiusMin:80,radiusMax:160,yRange:70,scaleMin:18,scaleMax:70,speedMult:.12,countShare:.1}],b=[{name:`Daylight`,weight:3,skyTop:new n.Color(5218303),skyBottom:new n.Color(12903423),skyCloudColor:new n.Color(16777215),cloudsColor:new n.Color(16777215),bodyRim:new n.Color(16738816)},{name:`Paradise`,weight:.4,skyTop:new n.Color(14062890),skyBottom:new n.Color(16774102),skyCloudColor:new n.Color(16775400),cloudsColor:new n.Color(15916198),bodyRim:new n.Color(3107839)},{name:`Dawn`,weight:3,skyTop:new n.Color(7311280),skyBottom:new n.Color(16176053),skyCloudColor:new n.Color(15786968),cloudsColor:new n.Color(14272445),bodyRim:new n.Color(16755517)},{name:`Sunset`,weight:3,skyTop:new n.Color(9392006),skyBottom:new n.Color(16095066),skyCloudColor:new n.Color(16298890),cloudsColor:new n.Color(15575678),bodyRim:new n.Color(2218495)},{name:`Candy`,weight:.4,skyTop:new n.Color(9126601),skyBottom:new n.Color(16761568),skyCloudColor:new n.Color(16770804),cloudsColor:new n.Color(16239080),bodyRim:new n.Color(3716863)},{name:`Twilight`,weight:1.2,skyTop:new n.Color(3354735),skyBottom:new n.Color(7623564),skyCloudColor:new n.Color(8213904),cloudsColor:new n.Color(5587066),bodyRim:new n.Color(16765286)},{name:`Aurora`,weight:1.2,skyTop:new n.Color(335935),skyBottom:new n.Color(1216628),skyCloudColor:new n.Color(9895908),cloudsColor:new n.Color(6550991),bodyRim:new n.Color(16747566)},{name:`Abyss`,weight:1.2,skyTop:new n.Color(199450),skyBottom:new n.Color(1458283),skyCloudColor:new n.Color(3104149),cloudsColor:new n.Color(2377583),bodyRim:new n.Color(58784)},{name:`Cosmos`,weight:.4,skyTop:new n.Color(66057),skyBottom:new n.Color(856112),skyCloudColor:new n.Color(2304604),cloudsColor:new n.Color(1448512),bodyRim:new n.Color(13625599)},{name:`Storm`,weight:3,skyTop:new n.Color(2304822),skyBottom:new n.Color(5924466),skyCloudColor:new n.Color(9082273),cloudsColor:new n.Color(7042689),bodyRim:new n.Color(16769357)},{name:`Ember`,weight:1.2,skyTop:new n.Color(2099475),skyBottom:new n.Color(13716011),skyCloudColor:new n.Color(15235407),cloudsColor:new n.Color(9188400),bodyRim:new n.Color(6735871)}];function x(e=-1){let t=0;for(let n=0;n<b.length;n++)n!==e&&(t+=b[n].weight);let n=Math.random()*t;for(let t=0;t<b.length;t++)if(t!==e&&(n-=b[t].weight,n<=0))return t;return(e+1)%b.length}function S(){return{audio:{quiet:.25,loud:.75,attack:.4,release:2,floor:.15,bpmSlow:90,bpmFast:165,rateMin:.7,rateMax:1.3},autopilot:{enabled:!0,speed:.5,colorCycle:!0,preset:0,dropMode:`random`},director:{enabled:!0,accentChance:.6,accentCooldown:6,accentMin:2.5,accentMax:5,minEnergy:.45,zoomDrift:.7,chainChance:.35,strobeChance:.35},drop:{shock:.06,kick:1,punch:1},quality:{renderScale:2},wind:{angle:0,auto:!0},events:{enabled:!0,chance:.2,cooldown:20,minEnergy:.3,onDrop:!0},body:{material:`rim`,bassScale:.55,drift:.35,slowMo:.35,rim:{baseColor:`#d5d5dd`,power:3,strength:1.4,kickHardMult:1.5,shading:.45,ambient:.65},normal:{wireframe:!1,flatShading:!1},basic:{color:`#ffffff`,wireframe:!1},wireframe:{color:`#ffffff`},depth:{wireframe:!1}},camera:{baseSpeed:.2,kickMult:2,verticalSpeed:.26,verticalAmp:.85,verticalEnergyMult:.5,shake:.035,rollAmp:.12,rollSpeed:.06},sky:{enabled:!0,scrollSpeedBase:.09,scrollEnergyMult:.025,scrollKickMult:.03,cloudScale:8,brightnessBase:.57,brightnessEnergyMult:.6,midCoverage:.12,topColor:`#6fb4ff`,bottomColor:`#bfe1ff`,cloudColor:`#ffffff`},clouds:{enabled:!0,count:290,riseSpeedBase:1.9,riseEnergyMult:2.4,riseKickMult:4,opacity:.85,color:`#ffffff`,haze:.7,weather:1},motes:{enabled:!0,count:120,opacity:.5,radius:6,rise:1.2},rays:{enabled:!0,count:8,opacity:.08},lines:{enabled:!0,count:70,opacity:.4,speedBase:5,speedEnergyMult:16,radius:6},bloom:{enabled:!0,strengthBase:.15,energyMult:.35,kickHardMult:2.2,radius:1.5,threshold:.85},afterimage:{enabled:!0,dampBase:.85,kickHardMult:.2},rgbShift:{enabled:!0,highMult:.006,angle:1.98},fisheye:{enabled:!0,strengthBase:1,energyMult:.45,kickHardMult:1.3}}}const C={wipe:{shaderMode:0,duration:1.4,body:e=>Math.min(1,e*1.6)},curtain:{shaderMode:1,duration:1.4,body:e=>e},iris:{shaderMode:2,duration:1.4,body:e=>Math.max(0,(e-.55)/.45)},dissolve:{shaderMode:3,duration:1.7,body:e=>e}},w={skyTop:new n.Color(16777215),skyBottom:new n.Color(16777215),skyCloudColor:new n.Color(16777215),cloudsColor:new n.Color(16777215),bodyRim:new n.Color(16777215)};var T=class{constructor(e,t,n,r){this.params=e,this.sky=t,this.clouds=n,this.body=r,this.phase=0,this.onPresetAdvanced=null}osc(e,t=0){return Math.sin(this.phase*(Math.PI*2)/e+t)}osc01(e,t=0){return this.osc(e,t)*.5+.5}resetPresetTimer(){this.transition=null}pickNext(e){let t=Math.floor(Math.random()*(b.length-1));return t>=e&&t++,t}skipToNext(){let e=this.params.autopilot,t=e.dropMode;if(t===`random`&&(t=[`snap`,`flash`,`wipe`,`curtain`,`iris`,`dissolve`][Math.floor(Math.random()*6)]),t===`snap`){e.preset=this.pickNext(e.preset),this.transition=null,this.onPresetAdvanced?.(e.preset);return}this.transition={mode:t,t:0,to:this.pickNext(e.preset)}}transitionMix(e){let t=this.transition,n=C[t.mode];return n?(t.t=Math.min(1,t.t+e/n.duration),t.mode===`dissolve`?t.t:1-(1-t.t)*(1-t.t)):(t.t=Math.min(1,t.t+e/1.2),t.t)}update(e){this.phase+=e*this.params.autopilot.speed;let t=this.params;if(t.camera.verticalAmp=.4+this.osc01(19,.4)*.9,t.sky.brightnessBase=.55+this.osc01(22,2.1)*.4,t.clouds.opacity=.75+this.osc(14,1.1)*.2,t.bloom.radius=.35+this.osc(18,.6)*.2,t.bloom.threshold=.8+this.osc01(24,.9)*.15,t.fisheye.strengthBase=.6+this.osc(28,2.4)*.6,t.rgbShift.angle=this.phase*.4%(Math.PI*2),!t.autopilot.colorCycle)return;let n=t.autopilot.preset,r=this.transition?this.transition.to:n,i=b[n],a=b[r],o=0;if(this.transition){o=this.transitionMix(e);let n=this.transition.mode,s=C[n];if(s&&this.transition.t<1){this.sky.setWipe(i,a,o,s.shaderMode),this.clouds.setWipe(i,a,o,s.shaderMode),this.body.lerpColors(i,a,s.body(o));return}n===`flash`&&(o<.35?(a=w,o/=.35):(i=w,a=b[r],o=(o-.35)/.65)),this.transition.t>=1&&(this.transition=null,t.autopilot.preset=r,this.onPresetAdvanced?.(r),i=b[r],o=0)}this.sky.lerpColors(i,a,o),this.clouds.lerpColors(i,a,o),this.body.lerpColors(i,a,o)}},E={uniforms:{baseColor:{value:new n.Color(15263984)},rimColor:{value:new n.Color(16738816)},rimPower:{value:2.5},rimStrength:{value:1.2},lightDir:{value:new n.Vector3(.5,.8,.3).normalize()},shading:{value:.45},ambientColor:{value:new n.Color(16777215)},ambientTint:{value:.5}},vertexShader:`
		#include <common>
		#include <skinning_pars_vertex>
		varying vec3 vNormal;
		varying vec3 vViewPos;
		void main() {
			#include <beginnormal_vertex>
			#include <skinbase_vertex>
			#include <skinnormal_vertex>
			#include <begin_vertex>
			#include <skinning_vertex>
			vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
			vNormal = normalize( normalMatrix * objectNormal );
			// Raw view position- normalized in the fragment shader. Normalizing here
			// NaNs when a vertex crosses the camera (length ~0), and the NaN varying
			// paints the whole triangle black; fragments are always past the near
			// plane, so the per-fragment normalize is safe.
			vViewPos = mvPosition.xyz;
			gl_Position = projectionMatrix * mvPosition;
		}
	`,fragmentShader:`
		uniform vec3 baseColor;
		uniform vec3 rimColor;
		uniform float rimPower;
		uniform float rimStrength;
		uniform vec3 lightDir;
		uniform float shading;
		uniform vec3 ambientColor;
		uniform float ambientTint;
		varying vec3 vNormal;
		varying vec3 vViewPos;
		void main() {
			vec3 n = normalize( vNormal );
			// clamp (not max): float error can push the dot past 1.0, and
			// pow(negative, x) is NaN- renders as a black triangle.
			float facing = clamp( dot( n, normalize( - vViewPos ) ), 0.0, 1.0 );
			float fresnel = pow( 1.0 - facing, rimPower );
			// Half-Lambert modeling from a fixed world light (rotated to view space
			// on the CPU): the lit side stays at full baseColor- luminance never
			// exceeds it, so the bloom threshold contract still holds- while the
			// far side falls off softly. As the camera orbits, the modeling sweeps
			// across the body.
			float ndl = dot( n, normalize( lightDir ) ) * 0.5 + 0.5;
			float shade = mix( 1.0 - shading, 1.0, ndl );
			// The body bathes in the scene's ambient light: the preset's horizon
			// color multiplies the base (never brightens- the bloom threshold
			// contract on max luminance still holds).
			vec3 tinted = baseColor * mix( vec3( 1.0 ), ambientColor, ambientTint );
			vec3 col = tinted * shade + rimColor * fresnel * rimStrength;
			gl_FragColor = vec4( col, 1.0 );
		}
	`};const D=`./assets/character.glb`,O=.35,k={backflip:{fade:.6,startAt:.15,endAt:.75,timeScale:.23,limbMix:2,returnFade:1.2},backfalling:{fade:.9},spin:{fade:.7,timeScale:.5,limbMix:.8,returnFade:.9}},A=/Arm|Hand|Shoulder|Leg|Foot|Toe/i,j=[`backflip`,`spin`];var M=class{constructor(e){this.params=e,this.object=null,this.clips={},this.actions={},this.currentAction=null,this.eventTimer=0,this.mixer=null,this.mat=null,this.lightDirWorld=new n.Vector3(.5,.8,.3).normalize(),this.lightScratch=new n.Vector3,this.headBone=null,this.handBone=null,this.hipsBone=null,this.limbClip=null,this.hipsClip=null,this.actionList=[],this.headPosWorld=new n.Vector3(0,.8,0),this.handPosWorld=new n.Vector3(0,.8,0),this.headQuatWorld=new n.Quaternion,this.scaleScratch=new n.Vector3}updateAnchors(){this.headBone&&(this.headBone.updateWorldMatrix(!0,!1),this.headBone.matrixWorld.decompose(this.headPosWorld,this.headQuatWorld,this.scaleScratch)),this.handBone&&(this.handBone.updateWorldMatrix(!0,!1),this.handPosWorld.setFromMatrixPosition(this.handBone.matrixWorld))}getHandPosition(e){return this.handBone?e.copy(this.handPosWorld):this.getHeadPosition(e)}getHeadPosition(e){return this.headBone?e.copy(this.headPosWorld):e.set(0,.8,0)}getHeadQuaternion(e){return this.headBone?e.copy(this.headQuatWorld):e.identity()}async load(){let e=await new i().loadAsync(D).catch(e=>(console.error(`[erin_benjamin] failed to load ${D}`,e),null));this.object=e?.scene??null;for(let t of e?.animations??[])this.clips[t.name]=t;console.log(`[erin_benjamin] clips loaded: ${Object.keys(this.clips).join(`, `)||`none`}`),this.object||console.error(`[erin_benjamin] body missing- scene will render empty`),this.clips.falling||console.warn(`[erin_benjamin] no base animation clip found`)}init(e){if(!this.object)return;this.normalize();let t=0;if(this.object.traverse(e=>{(e.isMesh||e.isSkinnedMesh)&&(e.frustumCulled=!1,e.layers.enable(1),t++)}),this.object.traverse(e=>{e.isBone&&(!this.headBone&&/head/i.test(e.name)&&(this.headBone=e),!this.handBone&&/hand/i.test(e.name)&&(this.handBone=e),!this.hipsBone&&/hips/i.test(e.name)&&(this.hipsBone=e))}),console.log(`[erin_benjamin] anchor bones: head=${this.headBone?.name??`none`} hand=${this.handBone?.name??`none`}`),this.setMaterial(this.params.body.material),console.log(`[erin_benjamin] body: ${t} mesh(es)`),t===0&&console.warn(`[erin_benjamin] body has no renderable meshes (skeleton only?)`),e.add(this.object),this.clips.falling){this.mixer=new n.AnimationMixer(this.object);for(let[e,t]of Object.entries(this.clips))this.actions[e]=this.mixer.clipAction(t);let e=this.clips.falling,t=e.tracks.filter(e=>A.test(e.name));t.length&&(this.limbClip=new n.AnimationClip(`fallingLimbs`,e.duration,t),this.actions.fallingLimbs=this.mixer.clipAction(this.limbClip));let r=e.tracks.filter(e=>/Hips/i.test(e.name)&&e.name.endsWith(`.position`));r.length&&(this.hipsClip=new n.AnimationClip(`fallingHips`,e.duration,r),this.actions.fallingHips=this.mixer.clipAction(this.hipsClip));for(let e of j){let t=this.actions[e];t&&(t.setLoop(n.LoopOnce),t.clampWhenFinished=!0)}this.mixer.addEventListener(`finished`,e=>{let t=j.find(t=>this.actions[t]===e.action);t&&this.endEvent(k[t]?.returnFade??k[t]?.fade??O)}),this.actions.falling.play(),this.currentAction=this.actions.falling,this.actionList=Object.values(this.actions)}}playEvent(e,t=0){if(!this.actions[e]||this.currentAction!==this.actions.falling)return!1;let n=k[e],r=n?.fade??O,i=this.actions.falling.time;return this.fadeTo(e,r,n?.startAt??0,n?.timeScale??1),this.startAux(this.actions.fallingHips,1,r,i),n?.limbMix&&this.startAux(this.actions.fallingLimbs,n.limbMix,r,i),this.eventTimer=t,this.eventName=e,this.eventFade=n?.returnFade??r,!0}startAux(e,t,n,r){e&&(e.reset().setEffectiveTimeScale(1).setEffectiveWeight(t).fadeIn(n).play(),e.time=r)}endEvent(e=O){this.eventName=null,this.fadeTo(`falling`,e),this.actions.fallingHips?.fadeOut(e),this.actions.fallingLimbs?.fadeOut(e)}fadeTo(e,t=O,n=0,r=1){let i=this.actions[e];!i||this.currentAction===i||(i.reset().setEffectiveTimeScale(r).setEffectiveWeight(1).fadeIn(t).play(),i.time=n,this.currentAction?.fadeOut(t),this.currentAction=i)}update(e,t,n,r){if(this.mixer){let t=this.params.body.slowMo;if(this.mixer.timeScale=n.rate*(t+(1-t)*n.energy),this.mixer.update(e),e*this.mixer.timeScale>0)for(let e of this.actionList)e!==this.currentAction&&e.isScheduled()&&e.getEffectiveWeight()===0&&e.stop()}this.eventTimer>0&&(this.eventTimer-=e,this.eventTimer<=0&&this.endEvent(this.eventFade));let i=k[this.eventName];i?.endAt&&this.currentAction===this.actions[this.eventName]&&this.currentAction.time>=i.endAt&&this.endEvent(this.eventFade);let a=this.mat?.uniforms;if(a?.rimStrength){let e=this.params.body.rim;a.rimStrength.value=e.strength+t.kickHard*e.kickHardMult*n.energy+n.dropPulse*2,a.rimPower.value=e.power,a.shading.value=e.shading,a.ambientTint.value=e.ambient,a.lightDir.value.copy(this.lightScratch.copy(this.lightDirWorld).transformDirection(r.matrixWorldInverse))}}lerpColors(e,t,n){let r=this.mat?.uniforms;r?.rimColor&&(r.rimColor.value.copy(e.bodyRim).lerp(t.bodyRim,n),r.ambientColor.value.copy(e.skyTop).lerp(t.skyTop,n).offsetHSL(0,.25,0))}normalize(){let e=new n.Box3().setFromObject(this.object),t=e.getSize(new n.Vector3);console.log(`[erin_benjamin] body raw size: ${t.x.toFixed(2)} × ${t.y.toFixed(2)} × ${t.z.toFixed(2)}`),t.y>0?this.object.scale.setScalar(2/t.y):console.warn(`[erin_benjamin] body has zero height- skipping normalization`),e.setFromObject(this.object);let r=e.getCenter(new n.Vector3);this.object.position.sub(r)}setMaterial(e){if(!this.object)return;let t=this.createMaterial(e);t&&(this.object.traverse(e=>{(e.isMesh||e.isSkinnedMesh)&&(e.material=t)}),this.mat&&this.mat!==t&&this.mat.dispose(),this.mat=t)}createMaterial(e){let t=this.params.body;switch(e){case`rim`:{let e=new n.ShaderMaterial({uniforms:n.UniformsUtils.clone(E.uniforms),vertexShader:E.vertexShader,fragmentShader:E.fragmentShader});e.uniforms.baseColor.value.set(t.rim.baseColor);let r=b[this.params.autopilot.preset];return r&&(e.uniforms.rimColor.value.copy(r.bodyRim),e.uniforms.ambientColor.value.copy(r.skyTop).offsetHSL(0,.25,0)),e}case`normal`:return new n.MeshNormalMaterial({wireframe:t.normal.wireframe,flatShading:t.normal.flatShading});case`basic`:return new n.MeshBasicMaterial({color:t.basic.color,wireframe:t.basic.wireframe});case`wireframe`:return new n.MeshBasicMaterial({color:t.wireframe.color,wireframe:!0});case`depth`:return new n.MeshDepthMaterial({wireframe:t.depth.wireframe});default:return console.warn(`[erin_benjamin] unknown material type "${e}"- falling back to normal`),new n.MeshNormalMaterial}}},ee=class{constructor(e){this.params=e,this.orbit={angle:0,radius:4.5,baseHeight:.95,verticalPhase:0},this.lookY=0,this.shotSpeedMult=1,this.shotBobMult=1,this.orbitDir=1,this.body=null,this.trackShot=null,this.lookTarget=null,this.lookSmooth=new n.Vector3,this.faceAxis=new n.Vector3(0,-1,0),this.headPos=new n.Vector3,this.handPos=new n.Vector3,this.headQuat=new n.Quaternion,this.faceDir=new n.Vector3,this.desiredPos=new n.Vector3,this.lookScratch=new n.Vector3,this.upNudge=new n.Vector3,this.camera=new n.PerspectiveCamera(50,innerWidth/innerHeight,.1,1e3);let{angle:t,radius:r,baseHeight:i}=this.orbit;this.camera.position.set(Math.sin(t)*r,i,Math.cos(t)*r),this.camera.lookAt(0,0,0)}applyFeel(e,t){let n=this.params.camera;this.feelTime=(this.feelTime??0)+e;let r=this.feelTime,i=50-t.dropPulse*t.dropPulse*this.params.drop.punch*14;i!==this.camera.fov&&(this.camera.fov=i,this.camera.updateProjectionMatrix());let a=Math.sin(r*n.rollSpeed*Math.PI*2)*n.rollAmp*(.4+.6*t.energy);this.camera.rotateZ(a),this.camera.userData.roll=a;let o=this.camera.position.distanceTo(this.lookScratch),s=Math.min(1,o/4.5),c=(n.shake*t.energy*t.energy*(.3+.7*t.pace)+t.dropPulse*t.dropPulse*this.params.drop.kick*.05)*s;if(c>1e-4){let e=r*t.rate;this.camera.position.x+=(Math.sin(e*39.7)+Math.sin(e*23.3)*.6)*c*.5,this.camera.position.y+=(Math.sin(e*31.9+1.7)+Math.sin(e*17.3)*.6)*c*.5,this.camera.position.z+=Math.sin(e*27.1+3.1)*c*.4}}update(e,t,n){let r=this.params.camera;if(this.trackShot&&this.body){let t=this.trackShot;this.body.updateAnchors(),this.body.getHeadPosition(this.headPos),this.body.getHeadQuaternion(this.headQuat),this.faceDir.copy(this.faceAxis).applyQuaternion(this.headQuat).normalize(),t.kind===`below`?(this.desiredPos.set(t.side,-t.dist,t.side2),this.lookScratch.copy(this.headPos)):t.kind===`hand`?(this.body.getHandPosition(this.handPos),this.faceDir.copy(this.handPos).sub(this.headPos).normalize(),this.desiredPos.copy(this.handPos).addScaledVector(this.faceDir,t.dist).add(this.upNudge.set(0,t.dist*.3,0)),this.lookScratch.copy(this.handPos)):(this.desiredPos.copy(this.headPos).addScaledVector(this.faceDir,t.dist),this.lookScratch.copy(this.headPos)),t.fresh?(this.camera.position.copy(this.desiredPos),t.fresh=!1):this.camera.position.lerp(this.desiredPos,1-Math.exp(-e/.15)),this.camera.lookAt(this.lookScratch),this.applyFeel(e,n);return}this.orbit.angle+=e*n.rate*this.orbitDir*(r.baseSpeed*this.shotSpeedMult+n.flow*r.kickMult*n.energy),this.orbit.verticalPhase+=e*r.verticalSpeed;let{angle:i,radius:a,baseHeight:o,verticalPhase:s}=this.orbit,c=(Math.sin(s)*r.verticalAmp+n.energy*r.verticalEnergyMult)*this.shotBobMult;this.camera.position.set(Math.sin(i)*a,o+c,Math.cos(i)*a),this.lookTarget&&this.lookSmooth.lerp(this.lookTarget.position,1-Math.exp(-e/.4));let l=Math.min(.5,Math.max(-.5,this.lookY+c*.6));this.lookScratch.set(this.lookSmooth.x,l+this.lookSmooth.y,this.lookSmooth.z),this.camera.lookAt(this.lookScratch),this.applyFeel(e,n)}resize(){this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix()}},N={uniforms:{opacity:{value:.85},time:{value:0},cloudColor:{value:new n.Color(16777215)},shadowColor:{value:new n.Color(12566463)},hazeColor:{value:new n.Color(12575231)},hazeAmount:{value:.7},cloudColorB:{value:new n.Color(16777215)},shadowColorB:{value:new n.Color(12566463)},hazeColorB:{value:new n.Color(12575231)},wipe:{value:0},wipeMode:{value:0},aspect:{value:1}},vertexShader:`
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
	`,fragmentShader:`
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
	`},te=class{constructor(e,t){this.params=t,this.group=new n.Group,e.add(this.group),this.material=new n.ShaderMaterial({uniforms:n.UniformsUtils.clone(N.uniforms),vertexShader:N.vertexShader,fragmentShader:N.fragmentShader,transparent:!0,depthWrite:!1}),this.material.uniforms.cloudColor.value.set(t.clouds.color),this.material.uniforms.shadowColor.value.set(t.clouds.color).multiplyScalar(.75),this.material.uniforms.hazeColor.value.set(t.sky.bottomColor),this.baseGeometry=new n.PlaneGeometry(1,1),this.mixScratch=new n.Color,this.shadowScratch=new n.Color,this.churn=0,this.weatherTime=0,this.weatherPhase1=Math.random()*Math.PI*2,this.weatherPhase2=Math.random()*Math.PI*2,this.build()}build(){let e=this.params.clouds.count,t=y.map(t=>Math.floor(e*t.countShare)),r=t.reduce((e,t)=>e+t,0);t[t.length-1]+=e-r,this.offsets=new Float32Array(e*3),this.scales=new Float32Array(e*2),this.sprite=new Float32Array(e*3),this.fades=new Float32Array(e),this.layerOf=new Uint8Array(e);let i=0;for(let e=0;e<y.length;e++)for(let n=0;n<t[e];n++,i++)this.layerOf[i]=e,this.spawn(i,!0),this.sprite[i*3]=Math.random(),this.sprite[i*3+1]=Math.random()*Math.PI*2,this.sprite[i*3+2]=.8+Math.random()*.4;let a=new n.InstancedBufferGeometry;a.index=this.baseGeometry.index,a.attributes.position=this.baseGeometry.attributes.position,a.attributes.uv=this.baseGeometry.attributes.uv,a.instanceCount=e,a.setAttribute(`aOffset`,new n.InstancedBufferAttribute(this.offsets,3)),a.setAttribute(`aScale`,new n.InstancedBufferAttribute(this.scales,2)),a.setAttribute(`aSprite`,new n.InstancedBufferAttribute(this.sprite,3)),a.setAttribute(`aFade`,new n.InstancedBufferAttribute(this.fades,1)),this.mesh=new n.Mesh(a,this.material),this.mesh.frustumCulled=!1,this.group.add(this.mesh)}spawn(e,t=!1){let n=y[this.layerOf[e]],r=Math.random()*Math.PI*2,i=n.radiusMin+Math.random()*(n.radiusMax-n.radiusMin);this.offsets[e*3]=Math.cos(r)*i,this.offsets[e*3+1]=t?(Math.random()*2-1)*n.yRange:-n.yRange,this.offsets[e*3+2]=Math.sin(r)*i;let a=n.scaleMin+Math.random()**1.7*(n.scaleMax-n.scaleMin);this.scales[e*2]=a*(.9+Math.random()*.6),this.scales[e*2+1]=a}rebuild(){this.group.remove(this.mesh),this.mesh.geometry.dispose(),this.build()}setColor(e){this.material.uniforms.cloudColor.value.set(e),this.material.uniforms.shadowColor.value.set(e).multiplyScalar(.75)}lerpColors(e,t,n){let r=this.material.uniforms;r.wipe.value=0;let i=this.mixScratch.copy(e.cloudsColor).lerp(t.cloudsColor,n);r.cloudColor.value.copy(i),r.shadowColor.value.copy(e.skyTop).lerp(t.skyTop,n).lerp(i,.55).multiplyScalar(.8),r.hazeColor.value.copy(e.skyBottom).lerp(t.skyBottom,n)}setWipe(e,t,n,r){let i=this.material.uniforms;i.wipeMode.value=r,i.cloudColor.value.copy(e.cloudsColor),i.shadowColor.value.copy(e.skyTop).lerp(e.cloudsColor,.55).multiplyScalar(.8),i.hazeColor.value.copy(e.skyBottom),i.cloudColorB.value.copy(t.cloudsColor),i.shadowColorB.value.copy(t.skyTop).lerp(t.cloudsColor,.55).multiplyScalar(.8),i.hazeColorB.value.copy(t.skyBottom),i.wipe.value=n}update(e,t,r,i){let a=this.params.clouds;if(this.group.visible=a.enabled,!a.enabled)return;this.group.position.y=i.position.y;let o=this.params.audio.floor,s=a.riseSpeedBase*(o+(1-o)*r.energy)+r.energy*a.riseEnergyMult+r.flow*a.riseKickMult*r.energy,c=e*r.rate*s;this.material.uniforms.opacity.value=a.opacity*(1-.25*r.energy)*(1-.5*r.dropPulse),this.material.uniforms.hazeAmount.value=a.haze,this.material.uniforms.aspect.value=i.aspect,this.churn+=e*(.06+r.energy*.3),this.material.uniforms.time.value=this.churn,this.weatherTime+=e;let l=.6*Math.sin(this.weatherTime*Math.PI*2/73+this.weatherPhase1)+.4*Math.sin(this.weatherTime*Math.PI*2/47+this.weatherPhase2),u=1-(a.weather??1)*.45*(1-l),d=this.params.wind.angle*Math.PI/180,f=Math.cos(d),p=c*Math.sin(d),m=this.layerOf.length,h=!1;for(let e=0;e<m;e++){let t=y[this.layerOf[e]];this.offsets[e*3]+=p;let r=this.offsets[e*3+1]+c*t.speedMult*f;r>t.yRange&&(this.spawn(e),r=-t.yRange,h=!0),this.offsets[e*3+1]=r;let i=Math.min(t.yRange*.5,Math.max(t.yRange*.15,s*t.speedMult*.5)),a=1-n.MathUtils.smoothstep(Math.abs(r),t.yRange-i,t.yRange);this.fades[e]=a*n.MathUtils.smoothstep(u,this.sprite[e*3]-.12,this.sprite[e*3])}let g=this.mesh.geometry.attributes;g.aOffset.needsUpdate=!0,g.aFade.needsUpdate=!0,h&&(g.aScale.needsUpdate=!0)}};const P=.6,F={spin:{timeScale:.5,startAt:0,limbMix:.8},backflip:{timeScale:.28,startAt:.15,limbMix:2}};var ne=class{constructor(e){this.params=e,this.body=null,this.group=null,this.clones=[],this.wasActive=!1,this.draining=!1}init(e,t){if(!(!t.object||!t.clips.falling)){this.body=t,this.group=new n.Group,this.group.visible=!1,e.add(this.group);for(let e=0;e<6;e++){let e=a(t.object);e.traverse(e=>{(e.isMesh||e.isSkinnedMesh)&&(e.frustumCulled=!1,e.layers.enable(1))});let r=new n.Group;r.add(e),this.group.add(r);let i=new n.AnimationMixer(e),o={falling:i.clipAction(t.clips.falling)};for(let e in F)t.clips[e]&&(o[e]=i.clipAction(t.clips[e]),o[e].setLoop(n.LoopOnce),o[e].clampWhenFinished=!0);o.falling.play();let s={wrapper:r,mixer:i,actions:o,aux:{hips:t.hipsClip?i.clipAction(t.hipsClip):null,limbs:t.limbClip?i.clipAction(t.limbClip):null},current:o.falling,vy:0,animSpeed:1,eventIn:0};i.addEventListener(`finished`,()=>this.endCloneEvent(s)),this.clones.push(s)}}}playCloneEvent(e){if(e.current!==e.actions.falling)return;let t=Object.keys(e.actions).filter(e=>e!==`falling`);if(!t.length)return;let n=t[Math.floor(Math.random()*t.length)],r=F[n],i=e.actions[n],a=e.actions.falling.time;i.reset().setEffectiveTimeScale(r.timeScale).setEffectiveWeight(1).fadeIn(P).play(),i.time=r.startAt,this.body.startAux(e.aux.hips,1,P,a),r.limbMix&&this.body.startAux(e.aux.limbs,r.limbMix,P,a),e.actions.falling.fadeOut(P),e.current=i}endCloneEvent(e){e.actions.falling.reset().setEffectiveWeight(1).fadeIn(P*1.5).play(),e.actions.falling.time=Math.random()*this.body.clips.falling.duration,e.current.fadeOut(P*1.5),e.aux.hips?.fadeOut(P*1.5),e.aux.limbs?.fadeOut(P*1.5),e.current=e.actions.falling}place(){let e=this.body.clips.falling.duration,t=[];for(let n of this.clones){let r=0,i=0,a=4;for(let e=0;e<20;e++){let e=Math.random()*Math.PI*2;if(a=4+Math.random()*26,r=Math.cos(e)*a,i=Math.sin(e)*a,t.every(e=>(e.x-r)*(e.x-r)+(e.z-i)*(e.z-i)>4.5*4.5))break}t.push({x:r,z:i});let o=Math.random()<.5?-1:1;n.vy=o*(1.2+Math.random()*1.8),n.animSpeed=Math.max(.4,1-n.vy*.25),n.yEdge=6+a*.5;let s=-o*(n.yEdge+Math.random()*2);n.wrapper.position.set(r,s,i),n.wrapper.visible=!0,n.wrapper.rotation.y=Math.random()*Math.PI*2;for(let e in n.actions)n.actions[e].stop();n.aux.hips?.stop(),n.aux.limbs?.stop(),n.actions.falling.reset().setEffectiveWeight(1).play(),n.actions.falling.time=Math.random()*e,n.current=n.actions.falling,n.eventIn=1.5+Math.random()*6,n.wrapper.traverse(e=>{(e.isMesh||e.isSkinnedMesh)&&(e.material=this.body.mat)})}this.peak=0,this.releasing=!1}update(e,t){if(!this.group)return;let n=t.boost.crowd,r=n>.001;if(r&&!this.wasActive&&this.place(),!r&&this.wasActive&&(this.draining=!0),this.wasActive=r,!r&&!this.draining){this.group.visible=!1;return}this.group.visible=!0,n>=this.peak?this.peak=n:n<this.peak-.05&&(this.releasing=!0);let i=this.releasing||this.draining?1+(1-n)*4:1,a=this.params.body.slowMo,o=t.rate*(a+(1-a)*t.energy),s=0;for(let t of this.clones)t.wrapper.visible&&(t.wrapper.position.y+=t.vy*i*o*e,t.mixer.update(e*o*t.animSpeed),t.eventIn-=e,t.eventIn<=0&&!this.draining&&(this.playCloneEvent(t),t.eventIn=4+Math.random()*8),this.draining&&Math.abs(t.wrapper.position.y)>t.yEdge+3?t.wrapper.visible=!1:s++);this.draining&&s===0&&(this.draining=!1,this.group.visible=!1)}},re=class{constructor(e,t,r){this.renderer=e,this.rigCamera=r,this.enabled=!1,this.camera=new n.PerspectiveCamera(60,innerWidth/innerHeight,.1,1e3),this.controls=new o(this.camera,e.domElement),this.controls.enableDamping=!0,this.controls.enabled=!1,this.helper=new n.CameraHelper(r),this.helper.visible=!1,t.add(this.helper),this.sceneRef=t}toggle(){this.enabled=!this.enabled,this.controls.enabled=this.enabled,this.helper.visible=this.enabled,this.enabled&&(this.camera.position.copy(this.rigCamera.position).multiplyScalar(1.6),this.camera.position.y+=2,this.controls.target.set(0,0,0)),console.log(`[debug-cam] ${this.enabled?`ON- mouse orbit, raw render without postfx, rig frustum as wireframe`:`OFF`}`)}render(){this.controls.update(),this.helper.update(),this.renderer.render(this.sceneRef,this.camera)}resize(){this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix()}};const I=[{name:`far`,radius:[9,15],height:[1,3.5],lookY:0,speedMult:.7,bobMult:1.6,calm:3,intense:2},{name:`closeup`,radius:[2.6,3.4],height:[.3,.9],lookY:.3,speedMult:.75,bobMult:.35,calm:1.5,intense:2.5},{name:`lowAngle`,radius:[2.5,3.5],height:[-2.2,-1.2],lookY:.2,speedMult:.8,bobMult:.4,calm:1,intense:2},{name:`topDown`,radius:[1.2,2],height:[2.6,3.4],lookY:-.3,speedMult:.9,bobMult:.3,calm:1,intense:2},{name:`dolly`,radius:[6.5,2.5],height:[.4,.9],lookY:.1,speedMult:.35,bobMult:.5,dolly:!0,calm:2,intense:1},{name:`face`,track:`face`,dist:[.9,1.4],calm:1,intense:2},{name:`below`,track:`below`,dist:[2.2,3.2],calm:2,intense:2},{name:`hand`,track:`hand`,dist:[.5,.9],calm:2,intense:1}],L=(e,t)=>e+Math.random()*(t-e),R=(e,t,n)=>Math.min(n,Math.max(t,e)),ie={face:.55,hand:.35,below:1.6};var ae=class{constructor(e,t){this.params=e,this.rig=t,this.mode=`base`,this.phase=L(0,100),this.prevKickHard=0,this.cooldown=0,this.accentTime=0,this.accentDur=0,this.dollyTau=0,this.drift=null,this.strobeLeft=0,this.strobeTimer=0,this.shot=null,this.state={shot:`base`},this.enterBase(!0)}update(e,t,n){let r=this.params.director;if(!r.enabled)return;this.phase+=e;let i=t.kickHard>.9&&this.prevKickHard<=.9;if(this.prevKickHard=t.kickHard,this.mode===`base`){let t=this.rig.orbit;t.radius=4.8+Math.sin(this.phase*(Math.PI*2)/32)*1.8,t.baseHeight=.4+Math.sin(this.phase*(Math.PI*2)/27+1.7)*.8,this.rig.lookY=(t.baseHeight-.4)*.6,this.cooldown-=e,this.baseTime+=e,this.baseTime>=this.baseRecutAt&&this.enterBase(),i&&this.cooldown<=0&&n.energy>=r.minEnergy&&Math.random()<r.accentChance&&this.enterAccent(n.energy);return}if(this.strobeLeft>0&&(this.strobeTimer+=e,this.strobeTimer>=.18&&(this.strobeTimer=0,this.strobeLeft--,this.enterAccent(n.energy))),this.accentTime+=e,this.shot.dolly){let t=this.rig.orbit;t.radius+=(this.shot.radius[1]-t.radius)*(1-Math.exp(-e/this.dollyTau))}if(this.drift){let t=1-Math.exp(-e/this.drift.tau);this.rig.trackShot?this.rig.trackShot.dist+=(this.drift.target-this.rig.trackShot.dist)*t:this.rig.orbit.radius+=(this.drift.target-this.rig.orbit.radius)*t}this.accentTime>=this.accentDur&&(Math.random()<r.chainChance?this.enterAccent(n.energy):(this.enterBase(),this.cooldown=r.accentCooldown))}enterBase(e=!1){this.mode=`base`,this.shot=null,this.state.shot=`base`,this.rig.trackShot=null,this.drift=null,this.rig.lookY=0,this.rig.shotSpeedMult=1,this.rig.shotBobMult=1,e||(this.rig.orbit.angle+=L(1.2,2.5)*(Math.random()<.5?-1:1)),this.rig.orbitDir=Math.random()<.5?-1:1,this.baseTime=0,this.baseRecutAt=L(15,25)}enterAccent(e,t=null){let n=t?I.find(e=>e.name===t):null;if(!n){let t=0,r=I.map(n=>{let r=n===this.shot?0:n.calm+(n.intense-n.calm)*e;return t+=r,r}),i=Math.random()*t;n=I[0];for(let e=0;e<I.length;e++)if(i-=r[e],i<=0){n=I[e];break}}if(this.mode=`accent`,this.shot=n,this.state.shot=n.name,this.accentTime=0,this.accentDur=L(this.params.director.accentMin,this.params.director.accentMax),n.track){this.rig.trackShot={kind:n.track,dist:L(n.dist[0],n.dist[1]),side:L(-1,1),side2:L(-1,1),fresh:!0},this.rollDrift(n);return}this.rig.trackShot=null;let r=this.rig.orbit;r.angle+=L(1.2,2.5)*(Math.random()<.5?-1:1),this.rig.orbitDir=Math.random()<.5?-1:1,r.radius=n.dolly?n.radius[0]:L(n.radius[0],n.radius[1]),r.baseHeight=L(n.height[0],n.height[1]),this.rig.lookY=n.lookY,this.rig.shotSpeedMult=n.speedMult,this.rig.shotBobMult=n.bobMult,n.dolly&&(this.dollyTau=L(2,4)),this.rollDrift(n)}strobe(e){this.strobeLeft=2+Math.floor(Math.random()*2),this.strobeTimer=0,this.enterAccent(e)}entrance(){let e=I.find(e=>e.name===`dolly`);this.mode=`accent`,this.shot=e,this.state.shot=`dolly`,this.accentTime=0,this.accentDur=4.5,this.drift=null,this.rig.trackShot=null;let t=this.rig.orbit;t.angle+=L(1.2,2.5)*(Math.random()<.5?-1:1),this.rig.orbitDir=Math.random()<.5?-1:1,t.radius=9,t.baseHeight=L(.4,.9),this.rig.lookY=e.lookY,this.rig.shotSpeedMult=e.speedMult,this.rig.shotBobMult=e.bobMult,this.dollyTau=2.5}rollDrift(e){if(this.drift=null,e.dolly)return;let t=Math.random();if(t>=this.params.director.zoomDrift)return;let n=t<this.params.director.zoomDrift*.5?-1:1,r=L(5,10);if(e.track){let t=this.rig.trackShot.dist;this.drift={tau:r,target:R(t*(1+n*L(.3,.6)),ie[e.track],t*1.8)}}else{let e=this.rig.orbit.radius;this.drift={tau:r,target:R(e*(1+n*L(.25,.55)),1.6,20)}}}};const z=`dropmap:v1:`;var oe=class{constructor(e){this.audio=e,this.src=null,this.times=null,this.idx=0,this.lastCt=-10,this.decodeCtx=null,this.worker=null,this.workerBroken=!1,this.analyzeId=0,this.state=`idle`,this.overridesReady=fetch(`./dropmaps.json`).then(e=>e.ok?e.json():{}).catch(()=>({}))}update(e){let t=this.audio.mode===`live`?this.audio.player:null,n=t?.audioEl,r=n&&t.source===`mp3`?n.src:null;r!==this.src&&(this.src=r,this.times=null,this.state=r?`analysing`:`idle`,r&&this.load(r));let i=!!(this.times&&n&&!n.paused);if(e.timelineActive=i,!i){e.dropIn=1/0;return}let a=n.currentTime;if(a<this.lastCt-.3||a>this.lastCt+1.5){let e=this.times.findIndex(e=>e>a+.05);this.idx=e<0?this.times.length:e}for(this.lastCt=a;this.idx<this.times.length&&this.times[this.idx]<=a;)a-this.times[this.idx]<.25&&e.fireDrop(`timeline`),this.idx++;e.dropIn=this.idx<this.times.length?this.times[this.idx]-a:1/0}analyze(t,n){if(!this.workerBroken&&!this.worker)try{this.worker=new Worker(new URL(`./dropWorker.js`,import.meta.url),{type:`module`})}catch{this.workerBroken=!0}return this.workerBroken?Promise.resolve(e(t,n)):new Promise(r=>{let i=++this.analyzeId,a=e=>{e.data.id===i&&(s(),r(e.data.times))},o=()=>{s(),this.workerBroken=!0,r(e(t,n))},s=()=>{this.worker.removeEventListener(`message`,a),this.worker.removeEventListener(`error`,o)};this.worker.addEventListener(`message`,a),this.worker.addEventListener(`error`,o),this.worker.postMessage({id:i,samples:t,sampleRate:n})})}async load(e){let t=e,n=decodeURIComponent(e.split(`/`).pop().replace(/\.mp3$/i,``));try{let r=(await this.overridesReady)?.[n];if(!r){let e=localStorage.getItem(z+n);e&&(r=JSON.parse(e))}if(!r){let t=await fetch(e).then(e=>e.arrayBuffer());this.decodeCtx??=new OfflineAudioContext(1,1,44100);let i=await this.decodeCtx.decodeAudioData(t),a=i.getChannelData(0);if(i.numberOfChannels>1){let e=i.getChannelData(1),t=new Float32Array(a.length);for(let n=0;n<a.length;n++)t[n]=(a[n]+e[n])*.5;a=t}r=(await this.analyze(a,i.sampleRate)).map(e=>Math.round(e*100)/100),localStorage.setItem(z+n,JSON.stringify(r))}if(this.src!==t)return;this.times=r,this.lastCt=-10,this.state=`ready`,console.log(`[dropmap] ${n}: ${r.length} drop(s) @ ${r.map(e=>e.toFixed(1)).join(`, `)}`)}catch(e){console.warn(`[dropmap] ${n}: analysis failed- live detector stays on`,e),this.src===t&&(this.state=`fallback`)}}};const B=[{name:`backflip`,hold:0,calm:.5,intense:3},{name:`backfalling`,hold:[8,13],calm:3,intense:2},{name:`spin`,hold:0,calm:1.5,intense:2.5},{name:`shatter`,fx:!0,hold:[6,9],calm:1.5,intense:2.5},{name:`multicam`,fx:!0,hold:[8,12],calm:1,intense:2.5},{name:`crowdfall`,fx:!0,hold:[12,18],calm:2,intense:1.5},{name:`echo`,fx:!0,hold:[8,12],calm:2,intense:2},{name:`twin`,fx:!0,hold:[13,19],calm:2,intense:2},{name:`lightning`,fx:!0,presets:[`Storm`],hold:0,calm:4,intense:6},{name:`zeroG`,fx:!0,presets:[`Cosmos`],hold:[9,14],calm:6,intense:4},{name:`sunburst`,fx:!0,presets:[`Dawn`],hold:[6,9],calm:5,intense:3},{name:`apnea`,fx:!0,presets:[`Abyss`],hold:[8,12],calm:5,intense:3},{name:`firstStar`,fx:!0,presets:[`Twilight`],hold:[6,9],calm:6,intense:2}],V={multicam:[`shatter`,`echo`],shatter:[`multicam`],echo:[`multicam`,`twin`],twin:[`echo`]},se={lightning:{strikes:!0},zeroG:{clip:`backfalling`,shot:`far`,attack:1,release:1.5,rateFloor:.2,boost:{wind:1,motes:1.5}},sunburst:{shot:`below`,attack:1.2,release:1.8,boost:{rays:7,raysCount:8,bloom:1.2}},apnea:{shot:`topDown`,attack:1.5,release:2,rateFloor:.45,boost:{afterimage:.12,wind:.7}},firstStar:{shot:`far`,attack:1.5,release:2,boost:{motes:2.5}},shatter:{attack:.4,release:1.2,boost:{shatter:1,bloom:.4}},multicam:{attack:.05,release:.05,boost:{multicam:1}},crowdfall:{shot:`far`,attack:1,release:1.5,boost:{crowd:1}},echo:{shot:`far`,attack:1.2,release:1.5,boost:{echo:1}},twin:{shot:`far`,attack:2.2,release:2.6,boost:{twin:1}}},H=(e,t)=>e+Math.random()*(t-e),U=e=>e*e*(3-2*e);var ce=class{constructor(e,t,n){this.params=e,this.body=t,this.director=n,this.cooldown=0,this.prevKickHard=0,this.prevDropPulse=0,this.fxList=[],this.prevPreset=null,this.signatureDone=!1,this.state={last:`-`}}trigger(e){let t=B.find(t=>t.name===e);if(!t)return;let n=Array.isArray(t.hold)?H(t.hold[0],t.hold[1]):t.hold;this.fire(t,n,.8)&&(this.state.last=e,t.presets?.includes(b[this.params.autopilot.preset]?.name)&&(this.signatureDone=!0))}fire(e,t,n){return e.fx?this.startFx(e.name,t,n):this.body.playEvent(e.name,t)?(this.director.mode===`base`&&this.director.enterAccent(n),!0):!1}startFx(e,t,n){let r=se[e];if(!r||this.fxList.some(t=>t.name===e)||this.fxList.some(t=>V[e]?.includes(t.name)))return!1;if(r.strikes){let t=[{at:0,amp:.85}],i=0,a=2+Math.floor(Math.random()*3);for(let e=0;e<a;e++)i+=H(.12,.45),t.push({at:i,amp:H(.55,.85)});return this.fxList.push({name:e,spec:r,t:0,dur:i+.5,strikes:t,next:0}),this.director.strobe(n),!0}return r.clip&&!this.body.playEvent(r.clip,t)?!1:(this.fxList.push({name:e,spec:r,t:0,dur:t}),r.shot?this.director.enterAccent(n,r.shot):this.director.mode===`base`&&this.director.enterAccent(n),!0)}updateFx(e,t){let n=t.boost;for(let e in n)n[e]=0;for(let r of this.fxList){r.t+=e;let i=r.spec;if(i.strikes)for(;r.next<r.strikes.length&&r.strikes[r.next].at<=r.t;)t.dropPulse=Math.max(t.dropPulse,r.strikes[r.next].amp),r.next++;else{let e=U(Math.min(1,r.t/i.attack))*U(Math.min(1,Math.max(0,(r.dur-r.t)/i.release)));for(let t in i.boost)n[t]+=i.boost[t]*e;i.rateFloor!==void 0&&(t.rate*=1-(1-i.rateFloor)*e)}}this.fxList=this.fxList.filter(e=>e.t<e.dur)}update(e,t,n){this.updateFx(e,n);let r=this.params.events;if(!r.enabled)return;this.cooldown-=e;let i=b[this.params.autopilot.preset]?.name;i!==this.prevPreset&&(this.prevPreset=i,this.signatureDone=!1);let a=t.kickHard>.9&&this.prevKickHard<=.9;this.prevKickHard=t.kickHard;let o=r.onDrop&&n.dropPulse>.9&&this.prevDropPulse<=.9;this.prevDropPulse=n.dropPulse;let s=this.fxList.length>0;if(!o&&(!a||n.energy<r.minEnergy||this.cooldown>0&&!s||Math.random()>=r.chance))return;let c=new Set(this.fxList.map(e=>e.name)),l=B.filter(e=>(!e.presets||e.presets.includes(i))&&!c.has(e.name)&&!V[e.name]?.some(e=>c.has(e)));if(!l.length)return;let u=0,d=l.map(e=>{let t=e.calm+(e.intense-e.calm)*n.energy;return e.name===this.state.last&&(t*=.35),e.presets&&!this.signatureDone&&(t*=6),u+=t,t}),f=Math.random()*u,p=l[0];for(let e=0;e<l.length;e++)if(f-=d[e],f<=0){p=l[e];break}let m=Array.isArray(p.hold)?H(p.hold[0],p.hold[1]):p.hold;this.fire(p,m,n.energy)&&(this.state.last=p.name,p.presets&&(this.signatureDone=!0),s||(this.cooldown=r.cooldown))}},le=class{constructor(e){this.scene=e,this.pane=null,this.bodyMatBindings=null,this.presetEditor={skyTop:`#`+b[0].skyTop.getHexString(),skyBottom:`#`+b[0].skyBottom.getHexString(),skyCloudColor:`#`+b[0].skyCloudColor.getHexString(),cloudsColor:`#`+b[0].cloudsColor.getHexString(),bodyRim:`#`+b[0].bodyRim.getHexString()},e.audio?.mode===`live`&&this.build()}onPresetAdvanced(e){this.pane&&(this.syncPresetEditor(e),this.pane.refresh())}build(){let{params:e,features:t,body:n,cameraRig:r,sky:i,clouds:a,autopilot:o}=this.scene;this.pane=new s({title:`Postprocessing`}),this.pane.addBinding(this.scene.director.state,`shot`,{readonly:!0,label:`current shot`}),this.pane.addBinding(this.scene.events.state,`last`,{readonly:!0,label:`last event`});let c=this.pane.addFolder({title:`Wind`});c.addBinding(e.wind,`auto`,{label:`auto director`}),c.addBinding(e.wind,`angle`,{min:-60,max:60,step:1,label:`angle (°)`}),this.pane.addBinding(e.quality,`renderScale`,{min:1,max:2,step:.25,label:`render scale`}).on(`change`,e=>this.scene.postfx.setRenderScale(e.value));let l=this.pane.addFolder({title:`Audio`,expanded:!1});l.addBinding(t,`energy`,{readonly:!0,view:`graph`,min:0,max:1}),l.addBinding(t,`bass`,{readonly:!0,view:`graph`,min:0,max:1}),l.addBinding(t,`mid`,{readonly:!0,view:`graph`,min:0,max:1}),l.addBinding(t,`high`,{readonly:!0,view:`graph`,min:0,max:1}),l.addBinding(t,`bpm`,{readonly:!0,view:`graph`,min:60,max:200}),l.addBinding(t,`rate`,{readonly:!0,view:`graph`,min:.5,max:1.6}),l.addBinding(t,`dropPulse`,{readonly:!0,view:`graph`,min:0,max:1});let u=l.addFolder({title:`Energy (calibration)`});u.addBinding(e.audio,`quiet`,{min:0,max:1,step:.01,label:`quiet threshold ↓`}),u.addBinding(e.audio,`loud`,{min:.1,max:1,step:.01,label:`loud threshold ↑`}),u.addBinding(e.audio,`attack`,{min:.05,max:2,step:.05,label:`attack (s)`}),u.addBinding(e.audio,`release`,{min:.2,max:6,step:.1,label:`release (s)`}),u.addBinding(e.audio,`floor`,{min:0,max:.6,step:.01,label:`silence floor`});let d=l.addFolder({title:`Tempo → speed`});d.addBinding(e.audio,`bpmSlow`,{min:50,max:140,step:1,label:`slow bpm =`}),d.addBinding(e.audio,`bpmFast`,{min:90,max:220,step:1,label:`fast bpm =`}),d.addBinding(e.audio,`rateMin`,{min:.3,max:1,step:.05,label:`→ min speed`}),d.addBinding(e.audio,`rateMax`,{min:1,max:2.5,step:.05,label:`→ max speed`});let f=this.pane.addFolder({title:`Autopilot`,expanded:!1});f.addBinding(e.autopilot,`enabled`),f.addBinding(e.autopilot,`speed`,{min:0,max:3,step:.01}),f.addBinding(e.autopilot,`colorCycle`,{label:`colors on drops`}),f.addButton({title:`⚡ simulate a drop`}).on(`click`,()=>{t.dropPulse=1}),f.addBinding(e.drop,`shock`,{min:0,max:.2,step:.005,label:`shockwave`}),f.addBinding(e.drop,`kick`,{min:0,max:3,step:.05,label:`camera kick`}),f.addBinding(e.drop,`punch`,{min:0,max:3,step:.05,label:`zoom punch`}),f.addBinding(e.autopilot,`dropMode`,{label:`drop transition`,options:{random:`random`,"hard cut":`snap`,"white flash":`flash`,"center wipe":`wipe`,"rising curtain":`curtain`,"inverted iris":`iris`,dissolve:`dissolve`}});let p=Object.fromEntries(b.map((e,t)=>[e.name,t]));f.addBinding(e.autopilot,`preset`,{options:p}).on(`change`,e=>{o.resetPresetTimer(),this.applyColorPreset(e.value)});let m=f.addFolder({title:`Edit preset`,expanded:!1});m.addBinding(this.presetEditor,`skyTop`,{view:`color`}).on(`change`,()=>this.editPresetColor(`skyTop`)),m.addBinding(this.presetEditor,`skyBottom`,{view:`color`}).on(`change`,()=>this.editPresetColor(`skyBottom`)),m.addBinding(this.presetEditor,`skyCloudColor`,{view:`color`}).on(`change`,()=>this.editPresetColor(`skyCloudColor`)),m.addBinding(this.presetEditor,`cloudsColor`,{view:`color`}).on(`change`,()=>this.editPresetColor(`cloudsColor`)),m.addBinding(this.presetEditor,`bodyRim`,{view:`color`}).on(`change`,()=>this.editPresetColor(`bodyRim`));let h=this.pane.addFolder({title:`Body`,expanded:!1});h.addBinding(e.body,`bassScale`,{min:0,max:2,step:.05}),h.addBinding(e.body,`drift`,{min:0,max:1.2,step:.05}),h.addBinding(e.body,`slowMo`,{min:.1,max:1,step:.05}),h.addBinding(e.body,`material`,{options:{rim:`rim`,normal:`normal`,basic:`basic`,wireframe:`wireframe`,depth:`depth`}}).on(`change`,e=>{n.setMaterial(e.value),this.refreshBodyMatBindings()});let g=(e,t)=>()=>{n.mat&&e in n.mat&&(n.mat[e]=t[e])},_=e=>()=>{n.mat?.color&&n.mat.color.set(e.color)},v=e=>()=>{!n.mat||!(`flatShading`in n.mat)||(n.mat.flatShading=e.flatShading,n.mat.needsUpdate=!0)},y=e.body;this.bodyMatBindings={rim:[h.addBinding(y.rim,`baseColor`,{view:`color`}).on(`change`,e=>{n.mat?.uniforms?.baseColor&&n.mat.uniforms.baseColor.value.set(e.value)}),h.addBinding(y.rim,`power`,{min:.5,max:8,step:.1}),h.addBinding(y.rim,`strength`,{min:0,max:4,step:.05}),h.addBinding(y.rim,`kickHardMult`,{min:0,max:4,step:.05}),h.addBinding(y.rim,`shading`,{min:0,max:.9,step:.01}),h.addBinding(y.rim,`ambient`,{min:0,max:1,step:.01})],normal:[h.addBinding(y.normal,`wireframe`).on(`change`,g(`wireframe`,y.normal)),h.addBinding(y.normal,`flatShading`).on(`change`,v(y.normal))],basic:[h.addBinding(y.basic,`color`,{view:`color`}).on(`change`,_(y.basic)),h.addBinding(y.basic,`wireframe`).on(`change`,g(`wireframe`,y.basic))],wireframe:[h.addBinding(y.wireframe,`color`,{view:`color`}).on(`change`,_(y.wireframe))],depth:[h.addBinding(y.depth,`wireframe`).on(`change`,g(`wireframe`,y.depth))]},this.refreshBodyMatBindings();let x=this.pane.addFolder({title:`Director`,expanded:!1});x.addBinding(this.scene.director.state,`shot`,{readonly:!0}),x.addButton({title:`🎬 cut accent`}).on(`click`,()=>this.scene.director.enterAccent(t.energy)),x.addButton({title:`📸 strobe`}).on(`click`,()=>this.scene.director.strobe(t.energy)),x.addBinding(e.director,`enabled`),x.addBinding(e.director,`accentChance`,{min:0,max:1,step:.05}),x.addBinding(e.director,`accentCooldown`,{min:0,max:20,step:.5}),x.addBinding(e.director,`accentMin`,{min:1,max:8,step:.1}),x.addBinding(e.director,`accentMax`,{min:2,max:12,step:.1}),x.addBinding(e.director,`minEnergy`,{min:0,max:1,step:.05}),x.addBinding(e.director,`zoomDrift`,{min:0,max:1,step:.05}),x.addBinding(e.director,`chainChance`,{min:0,max:.9,step:.05}),x.addBinding(e.director,`strobeChance`,{min:0,max:1,step:.05,label:`strobe (drop)`});let S=this.pane.addFolder({title:`Events`,expanded:!1});S.addBinding(this.scene.events.state,`last`,{readonly:!0}),S.addButton({title:`🤸 backflip`}).on(`click`,()=>this.scene.events.trigger(`backflip`)),S.addButton({title:`🔄 backfalling`}).on(`click`,()=>this.scene.events.trigger(`backfalling`)),S.addButton({title:`🌀 spin`}).on(`click`,()=>this.scene.events.trigger(`spin`)),S.addButton({title:`🪞 broken mirror`}).on(`click`,()=>this.scene.events.trigger(`shatter`)),S.addButton({title:`📺 multicam`}).on(`click`,()=>this.scene.events.trigger(`multicam`)),S.addButton({title:`🕴 crowd fall`}).on(`click`,()=>this.scene.events.trigger(`crowdfall`)),S.addButton({title:`🔳 droste echo`}).on(`click`,()=>this.scene.events.trigger(`echo`)),S.addButton({title:`👥 mirror twin`}).on(`click`,()=>this.scene.events.trigger(`twin`));let C=(t,n,r)=>{S.addButton({title:t}).on(`click`,()=>{let t=b.findIndex(e=>e.name===n);t>=0&&e.autopilot.preset!==t&&(e.autopilot.preset=t,o.resetPresetTimer(),this.applyColorPreset(t)),this.scene.events.trigger(r)})};C(`⛈ lightning (Storm)`,`Storm`,`lightning`),C(`🌌 zero-g (Cosmos)`,`Cosmos`,`zeroG`),C(`🌅 sunburst (Dawn)`,`Dawn`,`sunburst`),C(`🫧 apnea (Abyss)`,`Abyss`,`apnea`),C(`✨ first star (Twilight)`,`Twilight`,`firstStar`),S.addBinding(e.events,`enabled`),S.addBinding(e.events,`onDrop`,{label:`fire on drops`}),S.addBinding(e.events,`chance`,{min:0,max:1,step:.05}),S.addBinding(e.events,`cooldown`,{min:0,max:60,step:1}),S.addBinding(e.events,`minEnergy`,{min:0,max:1,step:.05});let w=this.pane.addFolder({title:`Camera`,expanded:!1});w.addBinding(e.camera,`baseSpeed`,{min:0,max:2,step:.01}),w.addBinding(e.camera,`kickMult`,{min:0,max:20,step:.1}),w.addBinding(e.camera,`verticalSpeed`,{min:0,max:2,step:.01}),w.addBinding(e.camera,`verticalAmp`,{min:0,max:6,step:.05}),w.addBinding(e.camera,`verticalEnergyMult`,{min:0,max:4,step:.05}),w.addBinding(r.orbit,`radius`,{min:1,max:10,step:.1}),w.addBinding(r.orbit,`baseHeight`,{min:-6,max:8,step:.05}),w.addBinding(e.camera,`shake`,{min:0,max:.2,step:.005}),w.addBinding(e.camera,`rollAmp`,{min:0,max:.35,step:.01}),w.addBinding(e.camera,`rollSpeed`,{min:0,max:.3,step:.005});let T=this.pane.addFolder({title:`Speed lines`,expanded:!1});T.addBinding(e.lines,`enabled`),T.addBinding(e.lines,`count`,{min:0,max:200,step:1}).on(`change`,e=>{e.last&&this.scene.speedLines.rebuild()}),T.addBinding(e.lines,`opacity`,{min:0,max:1,step:.01}),T.addBinding(e.lines,`speedBase`,{min:0,max:20,step:.5}),T.addBinding(e.lines,`speedEnergyMult`,{min:0,max:40,step:.5}),T.addBinding(e.lines,`radius`,{min:1,max:15,step:.5});let E=this.pane.addFolder({title:`Dreamy`,expanded:!1});E.addBinding(e.motes,`enabled`,{label:`motes`}),E.addBinding(e.motes,`count`,{min:0,max:400,step:1}).on(`change`,e=>{e.last&&this.scene.motes.rebuild()}),E.addBinding(e.motes,`opacity`,{min:0,max:1,step:.01}),E.addBinding(e.motes,`rise`,{min:0,max:4,step:.05,label:`rise speed`}),E.addBinding(e.motes,`radius`,{min:2,max:12,step:.5,label:`radius`}),E.addBinding(e.rays,`enabled`,{label:`rays`}),E.addBinding(e.rays,`count`,{min:0,max:20,step:1}).on(`change`,e=>{e.last&&this.scene.rays.rebuild()}),E.addBinding(e.rays,`opacity`,{min:0,max:.3,step:.005});let D=this.pane.addFolder({title:`Sky`,expanded:!1});D.addBinding(e.sky,`enabled`),D.addBinding(e.sky,`scrollSpeedBase`,{min:0,max:.5,step:.005}),D.addBinding(e.sky,`scrollEnergyMult`,{min:0,max:1,step:.01}),D.addBinding(e.sky,`scrollKickMult`,{min:0,max:3,step:.05}),D.addBinding(e.sky,`cloudScale`,{min:.5,max:10,step:.1}),D.addBinding(e.sky,`brightnessBase`,{min:0,max:1.5,step:.01}),D.addBinding(e.sky,`brightnessEnergyMult`,{min:0,max:1.5,step:.01}),D.addBinding(e.sky,`midCoverage`,{min:0,max:.3,step:.01,label:`mids → clouds`}),D.addBinding(e.sky,`topColor`,{view:`color`}).on(`change`,e=>{i.uniforms.skyTop.value.set(e.value)}),D.addBinding(e.sky,`bottomColor`,{view:`color`}).on(`change`,e=>{i.uniforms.skyBottom.value.set(e.value)}),D.addBinding(e.sky,`cloudColor`,{view:`color`}).on(`change`,e=>{i.uniforms.cloudColor.value.set(e.value)});let O=this.pane.addFolder({title:`Clouds`,expanded:!1});O.addBinding(e.clouds,`enabled`),O.addBinding(e.clouds,`count`,{min:0,max:400,step:1}).on(`change`,e=>{e.last&&a.rebuild()}),O.addBinding(e.clouds,`riseSpeedBase`,{min:0,max:6,step:.05}),O.addBinding(e.clouds,`riseEnergyMult`,{min:0,max:8,step:.05}),O.addBinding(e.clouds,`riseKickMult`,{min:0,max:12,step:.1}),O.addBinding(e.clouds,`opacity`,{min:0,max:1,step:.01}),O.addBinding(e.clouds,`haze`,{min:0,max:1,step:.01}),O.addBinding(e.clouds,`weather`,{min:0,max:1,step:.05}),O.addBinding(e.clouds,`color`,{view:`color`}).on(`change`,e=>{a.setColor(e.value)});let k=this.pane.addFolder({title:`Bloom`,expanded:!1});k.addBinding(e.bloom,`enabled`),k.addBinding(e.bloom,`strengthBase`,{min:0,max:3,step:.01}),k.addBinding(e.bloom,`energyMult`,{min:0,max:3,step:.01}),k.addBinding(e.bloom,`kickHardMult`,{min:0,max:3,step:.01}),k.addBinding(e.bloom,`radius`,{min:0,max:2,step:.01}),k.addBinding(e.bloom,`threshold`,{min:0,max:1,step:.01});let A=this.pane.addFolder({title:`Afterimage`,expanded:!1});A.addBinding(e.afterimage,`enabled`),A.addBinding(e.afterimage,`dampBase`,{min:0,max:.99,step:.01}),A.addBinding(e.afterimage,`kickHardMult`,{min:0,max:.2,step:.005});let j=this.pane.addFolder({title:`RGB Shift`,expanded:!1});j.addBinding(e.rgbShift,`enabled`),j.addBinding(e.rgbShift,`highMult`,{min:0,max:.02,step:5e-4}),j.addBinding(e.rgbShift,`angle`,{min:0,max:Math.PI*2,step:.01});let M=this.pane.addFolder({title:`Fisheye`,expanded:!1});M.addBinding(e.fisheye,`enabled`),M.addBinding(e.fisheye,`strengthBase`,{min:-.5,max:2,step:.01}),M.addBinding(e.fisheye,`energyMult`,{min:0,max:1,step:.01}),M.addBinding(e.fisheye,`kickHardMult`,{min:0,max:2,step:.01})}applyColorPreset(e){let t=b[e];if(!t)return;let{params:n,sky:r,clouds:i,body:a}=this.scene;r.lerpColors(t,t,0),i.lerpColors(t,t,0),a.lerpColors(t,t,0),n.sky.topColor=`#`+t.skyTop.getHexString(),n.sky.bottomColor=`#`+t.skyBottom.getHexString(),n.sky.cloudColor=`#`+t.skyCloudColor.getHexString(),n.clouds.color=`#`+t.cloudsColor.getHexString(),this.syncPresetEditor(e),this.pane?.refresh()}syncPresetEditor(e){let t=b[e];t&&(this.presetEditor.skyTop=`#`+t.skyTop.getHexString(),this.presetEditor.skyBottom=`#`+t.skyBottom.getHexString(),this.presetEditor.skyCloudColor=`#`+t.skyCloudColor.getHexString(),this.presetEditor.cloudsColor=`#`+t.cloudsColor.getHexString(),this.presetEditor.bodyRim=`#`+t.bodyRim.getHexString())}editPresetColor(e){let t=this.scene.params.autopilot.preset,n=b[t];n&&(n[e].set(this.presetEditor[e]),this.applyColorPreset(t))}refreshBodyMatBindings(){if(!this.bodyMatBindings)return;let e=this.scene.params.body.material;for(let[t,n]of Object.entries(this.bodyMatBindings))for(let r of n)r.hidden=t!==e}};const W={uniforms:{time:{value:0},globalOpacity:{value:0}},vertexShader:`
		attribute vec3 aOffset;
		attribute float aSeed;
		attribute float aSize;
		uniform float time;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			vUv = uv;
			vSeed = aSeed;
			// Slow per-mote wander- no CPU involved. Mostly HORIZONTAL: the motes
			// must ride the upward flow like everything else (we are falling)-
			// vertical bobbing read as them hanging still against the stream.
			vec3 wander = vec3(
				sin( time * 0.31 + aSeed * 17.0 ) * 0.35,
				sin( time * 0.23 + aSeed * 31.0 ) * 0.08,
				cos( time * 0.27 + aSeed * 23.0 ) * 0.35
			);
			// Screen-aligned billboard (a round dot has no orientation).
			vec4 mv = viewMatrix * vec4( aOffset + wander, 1.0 );
			mv.xy += position.xy * aSize;
			gl_Position = projectionMatrix * mv;
		}
	`,fragmentShader:`
		uniform float time;
		uniform float globalOpacity;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			float r = length( vUv - 0.5 ) * 2.0;
			float dot_ = 1.0 - smoothstep( 0.0, 1.0, r );
			float twinkle = 0.4 + 0.6 * ( sin( time * ( 1.0 + fract( vSeed * 7.0 ) * 2.0 ) + vSeed * 40.0 ) * 0.5 + 0.5 );
			float alpha = dot_ * dot_ * twinkle * globalOpacity;
			if ( alpha < 0.01 ) discard;
			gl_FragColor = vec4( vec3( 1.0 ), alpha );
		}
	`};var ue=class{constructor(e,t){this.params=t,this.scene=e,this.material=new n.ShaderMaterial({uniforms:n.UniformsUtils.clone(W.uniforms),vertexShader:W.vertexShader,fragmentShader:W.fragmentShader,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending}),this.baseGeometry=new n.PlaneGeometry(1,1),this.build()}build(){let e=this.params.motes.count;this.offsets=new Float32Array(e*3),this.seeds=new Float32Array(e),this.sizes=new Float32Array(e);for(let t=0;t<e;t++)this.spawn(t,0,0,!0);let t=new n.InstancedBufferGeometry;t.index=this.baseGeometry.index,t.attributes.position=this.baseGeometry.attributes.position,t.attributes.uv=this.baseGeometry.attributes.uv,t.instanceCount=e,t.setAttribute(`aOffset`,new n.InstancedBufferAttribute(this.offsets,3)),t.setAttribute(`aSeed`,new n.InstancedBufferAttribute(this.seeds,1)),t.setAttribute(`aSize`,new n.InstancedBufferAttribute(this.sizes,1)),this.mesh=new n.Mesh(t,this.material),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}rebuild(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.build()}spawn(e,t,n,r=!1){let i=this.params.motes,a=Math.random()*Math.PI*2,o=.5+Math.random()*i.radius;this.offsets[e*3]=t+Math.cos(a)*o,this.offsets[e*3+1]=r?(Math.random()*2-1)*6:-6,this.offsets[e*3+2]=n+Math.sin(a)*o,this.seeds[e]=Math.random(),this.sizes[e]=.012+Math.random()*.03}update(e,t,n){let r=this.params.motes,i=r.enabled?Math.min(1,r.opacity*(.5+.5*(1-t.energy))*(1+t.boost.motes)):0;if(this.mesh.visible=i>=.01,!this.mesh.visible)return;this.material.uniforms.globalOpacity.value=i,this.material.uniforms.time.value+=e*(1+t.boost.motes);let a=n.position.x,o=n.position.y,s=n.position.z,c=r.rise*t.rate*(.4+1.6*t.energy),l=this.params.wind.angle*Math.PI/180,u=Math.cos(l),d=Math.sin(l)*1.6,f=this.seeds.length,p=!1;for(let t=0;t<f;t++){let n=e*c*(.6+this.seeds[t]);this.offsets[t*3]+=n*d;let r=this.offsets[t*3+1]+n*u;r>o+6&&(this.spawn(t,a,s),r=o-6,p=!0),this.offsets[t*3+1]=r}let m=this.mesh.geometry.attributes;m.aOffset.needsUpdate=!0,p&&(m.aSeed.needsUpdate=!0,m.aSize.needsUpdate=!0)}};const G={uniforms:{atlas:{value:null},sites:{value:[new n.Vector2,new n.Vector2,new n.Vector2,new n.Vector2]},aspect:{value:1}},vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,fragmentShader:`
		uniform sampler2D atlas;
		uniform vec2 sites[ 4 ];
		uniform float aspect;
		varying vec2 vUv;
		void main() {
			// 4-region Voronoi: the pixel belongs to its nearest site's feed.
			// Aspect-corrected so the borders keep their angles on any window.
			// No seam decoration- the feeds meet edge to edge, the cut alone
			// separates the plans.
			vec2 p = vec2( vUv.x * aspect, vUv.y );
			int feed = 0;
			float d1 = 8.0;
			for ( int i = 0; i < 4; i++ ) {
				float dd = distance( p, vec2( sites[ i ].x * aspect, sites[ i ].y ) );
				if ( dd < d1 ) { d1 = dd; feed = i; }
			}
			// Each region shows the whole frame of its feed, stored in the atlas
			// quadrant matching the feed index.
			vec2 quad = vec2( mod( float( feed ), 2.0 ), floor( float( feed ) * 0.5 ) ) * 0.5;
			gl_FragColor = vec4( texture2D( atlas, vUv * 0.5 + quad ).rgb, 1.0 );
		}
	`};var K=class extends h{constructor(e,t,r=null){super(),this.scene=e,this.camera=t,this.source=r,this.anchor=null,this.lookScratch=new n.Vector3,this.needsSwap=!1,this.time=0,this.cam2=new n.PerspectiveCamera(50,1,.1,1e3),this.atlas=new n.WebGLRenderTarget(1,1),this.quad=new m(new n.ShaderMaterial({uniforms:n.UniformsUtils.clone(G.uniforms),vertexShader:G.vertexShader,fragmentShader:G.fragmentShader})),this.quad.material.uniforms.atlas.value=this.atlas.texture,r?this.quad.material.uniforms.sites.value=r.quad.material.uniforms.sites.value:this.reroll()}reroll(){let e=[[.25,.25],[.75,.25],[.25,.75],[.75,.75]];for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}let t=this.quad.material.uniforms.sites.value;for(let n=0;n<4;n++)t[n].set(e[n][0]+(Math.random()*2-1)*.16,e[n][1]+(Math.random()*2-1)*.16);this.specs=[1,2,3].map(()=>({radius:2+Math.random()*9,height:-1.5+Math.random()*4.5,lookY:-.3+Math.random()*.6,speed:(Math.random()<.5?-1:1)*(.04+Math.random()*.1),phase:Math.random()*Math.PI*2}))}render(e,t,n){let r=this.source??this,i=n.width,a=n.height;(this.atlas.width!==i||this.atlas.height!==a)&&this.atlas.setSize(i,a);let o=Math.floor(i/2),s=Math.floor(a/2),c=e.autoClear;e.autoClear=!1,r.anchor?(r.anchor.updateWorldMatrix(!0,!1),this.lookScratch.setFromMatrixPosition(r.anchor.matrixWorld)):this.lookScratch.set(0,0,0);let l=this.quad.material.uniforms.sites.value;this.cam2.aspect=this.camera.aspect,this.cam2.layers.mask=this.camera.layers.mask;for(let t=0;t<4;t++){let n=t%2*o,i=Math.floor(t/2)*s;this.atlas.viewport.set(n,i,o,s),this.atlas.scissor.set(n,i,o,s),this.atlas.scissorTest=!0,e.setRenderTarget(this.atlas),e.clear();let a=this.camera;if(t>0){let e=r.specs[t-1],n=e.phase+r.time*e.speed*Math.PI*2;this.cam2.position.set(Math.sin(n)*e.radius,e.height,Math.cos(n)*e.radius),this.cam2.lookAt(this.lookScratch.x,this.lookScratch.y+e.lookY,this.lookScratch.z),a=this.cam2}a.updateProjectionMatrix();let c=a.projectionMatrix.elements;c[8]=-(l[t].x*2-1),c[9]=-(l[t].y*2-1),e.render(this.scene,a)}this.camera.updateProjectionMatrix(),this.atlas.scissorTest=!1,this.atlas.viewport.set(0,0,i,a),this.atlas.scissor.set(0,0,i,a),this.quad.material.uniforms.aspect.value=this.camera.aspect,e.setRenderTarget(this.renderToScreen?null:n),this.quad.render(e),e.autoClear=c}},de={uniforms:{baseTexture:{value:null},bloomTexture:{value:null}},vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,fragmentShader:`
		uniform sampler2D baseTexture;
		uniform sampler2D bloomTexture;
		varying vec2 vUv;
		void main() {
			gl_FragColor = texture2D( baseTexture, vUv ) + texture2D( bloomTexture, vUv );
		}
	`},fe={uniforms:{tDiffuse:{value:null},strength:{value:0},amount:{value:0},angle:{value:0},shockR:{value:0},shockAmp:{value:0},shatter:{value:0},shatterSeed:{value:0},shatterTime:{value:0},echoAmt:{value:0},echoTexture:{value:null},echoCenter:{value:new r(.5,.5)},aspect:{value:1},bloomTexture:{value:null},bloomOn:{value:0}},vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,fragmentShader:`
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
	`};const pe=new n.Color,q=new n.Vector3;var me=class extends c{constructor(e){super(e);for(let e of[this._textureComp,this._textureOld])e.depthBuffer=!1,e.texture.magFilter=n.LinearFilter}setSize(e,t){super.setSize(Math.max(1,Math.round(e/2)),Math.max(1,Math.round(t/2)))}},he=class{constructor(e,t,r,i){this.renderer=e,this.scene=t,this.camera=r,this.params=i,this.echoTarget=new n.WebGLRenderTarget(1,1),this._echoActive=!1,this.echoAnchor=null,this.echoExclude=[],this._echoExcludeVis=[],this.bloomPass=new p(new n.Vector2(innerWidth,innerHeight),.6,.6,0),this.bloomComposer=new l(e),this.bloomComposer.setPixelRatio(Math.min(devicePixelRatio,i.quality.renderScale)/2),this.bloomComposer.setSize(innerWidth,innerHeight),this.bloomComposer.renderToScreen=!1,this.bloomScenePass=new d(t,r),this.bloomComposer.addPass(this.bloomScenePass),this.bloomComposer.addPass(this.bloomPass),this.composer=new l(e),this.composer.setPixelRatio(Math.min(devicePixelRatio,i.quality.renderScale)),this.composer.setSize(innerWidth,innerHeight),this.renderPass=new d(t,r),this.multiCamPass=new K(t,r),this.multiCamPass.enabled=!1,this.multiCamBloomPass=new K(t,r,this.multiCamPass),this.multiCamBloomPass.enabled=!1,this.bloomComposer.insertPass(this.multiCamBloomPass,1),this.afterimagePass=new me(.85),this.bloomMergePass=new f(new n.ShaderMaterial({uniforms:{baseTexture:{value:null},bloomTexture:{value:this.bloomComposer.renderTarget2.texture}},vertexShader:de.vertexShader,fragmentShader:de.fragmentShader}),`baseTexture`),this.lensPass=new f(fe),this.lensPass.uniforms.bloomTexture.value=this.bloomComposer.renderTarget2.texture,this.lensPass.uniforms.echoTexture.value=this.echoTarget.texture;let a=new u;this.composer.addPass(this.renderPass),this.composer.addPass(this.multiCamPass),this.composer.addPass(this.afterimagePass),this.composer.addPass(this.bloomMergePass),this.composer.addPass(this.lensPass),this.composer.addPass(a),this._bloomWanted=i.bloom.enabled,this._bloomActive=i.bloom.enabled,this._prevShatter=0}syncEchoTarget(){let e=this.renderer.getPixelRatio(),t=Math.round(innerWidth*e),n=Math.round(innerHeight*e);(this.echoTarget.width!==t||this.echoTarget.height!==n)&&this.echoTarget.setSize(t,n)}setRenderScale(e){let t=Math.min(devicePixelRatio,e);this.renderer.setPixelRatio(t),this.composer.setPixelRatio(t),this.bloomComposer.setPixelRatio(t/2)}warmup(){this.camera.layers.set(1),this.bloomComposer.render(),this.camera.layers.set(0),this.composer.render()}update(e,t){let n=this.params,r=t.energy;this.bloomPass.strength=n.bloom.strengthBase+r*n.bloom.energyMult+e.kickHard*n.bloom.kickHardMult*r+t.dropPulse*2.5+t.boost.bloom,this.bloomPass.radius=n.bloom.radius,this.bloomPass.threshold=n.bloom.threshold;let i=t.boost.multicam>.5;i&&!this.multiCamPass.enabled&&this.multiCamPass.reroll(),this.renderPass.enabled=!i,this.multiCamPass.enabled=i,this.bloomScenePass.enabled=!i,this.multiCamBloomPass.enabled=i;let a=n.bloom.enabled&&this.bloomPass.strength>=.05;a===this._bloomWanted&&(this._bloomActive=a),this._bloomWanted=a,this.afterimagePass.enabled=n.afterimage.enabled,this.afterimagePass.uniforms.damp.value=Math.min(.95,Math.min(.92,n.afterimage.dampBase+e.kickHard*n.afterimage.kickHardMult*r)+t.dropPulse*.12+t.boost.afterimage);let o=this.lensPass.uniforms;o.strength.value=n.fisheye.enabled?n.fisheye.strengthBase+r*n.fisheye.energyMult+e.kickHard*n.fisheye.kickHardMult*r:0,o.amount.value=n.rgbShift.enabled?t.high*n.rgbShift.highMult:0,o.angle.value=n.rgbShift.angle,o.shockR.value=(1-t.dropPulse)*1.3,o.shockAmp.value=t.dropPulse*n.drop.shock,o.shatter.value=t.boost.shatter,t.boost.shatter>.001&&this._prevShatter<=.001&&(o.shatterSeed.value=Math.random()*100,o.shatterTime.value=0),this._prevShatter=t.boost.shatter,o.echoAmt.value=t.boost.echo,this._echoActive=t.boost.echo>.001,this._echoActive&&this.echoAnchor&&(this.camera.updateMatrixWorld(),this.echoAnchor.updateWorldMatrix(!0,!1),q.setFromMatrixPosition(this.echoAnchor.matrixWorld).project(this.camera),o.echoCenter.value.set(q.x*.5+.5,q.y*.5+.5)),o.aspect.value=this.camera.aspect,this.lensPass.enabled=n.fisheye.enabled||n.rgbShift.enabled||o.shockAmp.value>1e-4||o.shatter.value>.001||o.echoAmt.value>.001,o.bloomOn.value=+!!this._bloomActive,this.bloomMergePass.enabled=this._bloomActive&&!this.lensPass.enabled}render(e){let t=this.lensPass.uniforms;if(t.shatter.value>.001&&(t.shatterTime.value+=e||0),this.multiCamPass.enabled&&(this.multiCamPass.time+=e||0),this._bloomActive&&(this.camera.layers.set(1),this.bloomComposer.render(),this.camera.layers.set(0)),this._echoActive){this.syncEchoTarget(),this.renderer.getClearColor(pe);let e=this.renderer.getClearAlpha();for(let e=0;e<this.echoExclude.length;e++)this._echoExcludeVis[e]=this.echoExclude[e].visible,this.echoExclude[e].visible=!1;this.renderer.setClearColor(0,0),this.camera.layers.set(1),this.renderer.setRenderTarget(this.echoTarget),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.camera.layers.set(0),this.renderer.setClearColor(pe,e);for(let e=0;e<this.echoExclude.length;e++)this.echoExclude[e].visible=this._echoExcludeVis[e]}this.composer.render(e)}resize(){this.composer.setSize(innerWidth,innerHeight),this.bloomComposer.setSize(innerWidth,innerHeight)}};const J={uniforms:{time:{value:0},globalOpacity:{value:0}},vertexShader:`
		attribute vec3 aRay;    // x: base angle · y: ring radius · z: seed
		attribute vec2 aSize;   // x: width · y: height
		uniform float time;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			vUv = uv;
			vSeed = aRay.z;
			// Slow orbit around the scene- each ray at its own pace.
			float angle = aRay.x + time * 0.012 * ( 0.5 + aRay.z );
			vec3 anchor = vec3( cos( angle ) * aRay.y, 14.0, sin( angle ) * aRay.y );
			// Cylindrical billboard (world-vertical shaft).
			vec3 fwd = cameraPosition - anchor;
			vec3 planar = vec3( fwd.z, 0.0, -fwd.x );
			vec3 right = length( planar ) < 1e-4 ? vec3( 1.0, 0.0, 0.0 ) : normalize( planar );
			vec3 world = anchor + right * position.x * aSize.x + vec3( 0.0, 1.0, 0.0 ) * position.y * aSize.y;
			gl_Position = projectionMatrix * viewMatrix * vec4( world, 1.0 );
		}
	`,fragmentShader:`
		uniform float time;
		uniform float globalOpacity;
		varying vec2 vUv;
		varying float vSeed;
		void main() {
			// Light falls from above: bright toward the top, dissolving downward,
			// soft on the top edge and across the width. The quad covers only
			// the [0.19, 0.81] slice of the full 0-to-1 fade span- the trimmed
			// extremes sit under the discard threshold and would only burn
			// additive blend bandwidth, so uv is remapped into the slice
			// instead (the shaft heights in build() are sized to this slice).
			// The slice does not reach zero at the quad edges, so each edge
			// carries its own guard fade to keep the border from printing a
			// hard line.
			float envY = pow( 0.19 + 0.62 * vUv.y, 1.6 ) * smoothstep( 1.0, 0.82, vUv.y ) * smoothstep( 0.0, 0.05, vUv.y );
			float across = 1.0 - abs( vUv.x - 0.5 ) * 2.0;
			float breath = 0.55 + 0.45 * sin( time * 0.2 + vSeed * 20.0 );
			float alpha = envY * across * across * breath * globalOpacity;
			if ( alpha < 0.005 ) discard;
			gl_FragColor = vec4( vec3( 1.0 ), alpha );
		}
	`};var ge=class{constructor(e,t){this.params=t,this.scene=e,this.material=new n.ShaderMaterial({uniforms:n.UniformsUtils.clone(J.uniforms),vertexShader:J.vertexShader,fragmentShader:J.fragmentShader,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending}),this.baseGeometry=new n.PlaneGeometry(1,1),this.build()}build(){let e=this.params.rays.count,t=e+10,r=new Float32Array(t*3),i=new Float32Array(t*2);for(let n=0;n<t;n++){let t=n<e?n/e:(n-e)/10;r[n*3]=t*Math.PI*2+Math.random()*.8,r[n*3+1]=8+Math.random()*28,r[n*3+2]=Math.random(),i[n*2]=1.5+Math.random()*4.5,i[n*2+1]=35+Math.random()*25}let a=new n.InstancedBufferGeometry;a.index=this.baseGeometry.index,a.attributes.position=this.baseGeometry.attributes.position,a.attributes.uv=this.baseGeometry.attributes.uv,a.instanceCount=e,a.setAttribute(`aRay`,new n.InstancedBufferAttribute(r,3)),a.setAttribute(`aSize`,new n.InstancedBufferAttribute(i,2)),this.mesh=new n.Mesh(a,this.material),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}rebuild(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.build()}update(e,t){let n=this.params.rays;this.mesh.visible=n.enabled&&n.opacity>=.005,this.mesh.visible&&(this.material.uniforms.time.value+=e*t.rate,this.mesh.geometry.instanceCount=n.count+Math.min(10,Math.round(t.boost.raysCount)),this.material.uniforms.globalOpacity.value=n.opacity*(1+t.boost.rays))}},Y={uniforms:{flowOff:{value:new n.Vector2(0,0)},panX:{value:0},panY:{value:0},rollAngle:{value:0},cloudScale:{value:3},coverageShift:{value:0},brightness:{value:.95},resolution:{value:new n.Vector2(1,1)},skyTop:{value:new n.Color(7320831)},skyBottom:{value:new n.Color(12575231)},cloudColor:{value:new n.Color(16777215)},skyTopB:{value:new n.Color(7320831)},skyBottomB:{value:new n.Color(12575231)},cloudColorB:{value:new n.Color(16777215)},wipe:{value:0},wipeMode:{value:0}},vertexShader:`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4( position.xy, 1.0, 1.0 );
		}
	`,fragmentShader:`
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
	`},_e=class{constructor(e,t){this.params=t,this.flow=new n.Vector2,this.pan=0,this.prevYaw=null,this.dirScratch=new n.Vector3;let r=new n.PlaneGeometry(2,2),i=new n.ShaderMaterial({uniforms:n.UniformsUtils.clone(Y.uniforms),vertexShader:Y.vertexShader,fragmentShader:Y.fragmentShader,depthTest:!1,depthWrite:!1});i.uniforms.resolution.value.set(innerWidth,innerHeight),i.uniforms.skyTop.value.set(t.sky.topColor),i.uniforms.skyBottom.value.set(t.sky.bottomColor),i.uniforms.cloudColor.value.set(t.sky.cloudColor),this.mesh=new n.Mesh(r,i),this.mesh.renderOrder=-1,this.mesh.frustumCulled=!1,e.add(this.mesh)}get uniforms(){return this.mesh.material.uniforms}update(e,t,r,i){let a=this.params.sky;this.mesh.visible=a.enabled;let o=this.params.audio.floor,s=a.scrollSpeedBase*(o+(1-o)*r.energy),c=e*Math.min(.15,r.rate*(s+r.energy*a.scrollEnergyMult+r.flow*a.scrollKickMult*r.energy)),l=n.MathUtils.degToRad(this.params.wind.angle);this.flow.x+=c*Math.sin(l),this.flow.y+=c*Math.cos(l);let u=Math.atan2(i.getWorldDirection(this.dirScratch).x,this.dirScratch.z);this.prevYaw===null&&(this.prevYaw=u);let d=u-this.prevYaw;d>Math.PI?d-=Math.PI*2:d<-Math.PI&&(d+=Math.PI*2),this.prevYaw=u;let f=2*Math.atan(Math.tan(n.MathUtils.degToRad(i.fov)/2)*i.aspect);this.pan-=d*(i.aspect/f);let p=this.uniforms;p.flowOff.value.copy(this.flow),p.panX.value=this.pan,p.panY.value=this.panYCur??0,p.rollAngle.value=0,p.cloudScale.value=a.cloudScale,p.brightness.value=Math.min(1,a.brightnessBase+r.energy*a.brightnessEnergyMult)+r.dropPulse*.8;let m=r.energy*.17-r.mid*a.midCoverage;this.coverCur??=m,this.coverCur+=(m-this.coverCur)*(1-Math.exp(-e/1.5)),p.coverageShift.value=this.coverCur}lerpColors(e,t,n){let r=this.uniforms;r.wipe.value=0,r.skyTop.value.copy(e.skyTop).lerp(t.skyTop,n),r.skyBottom.value.copy(e.skyBottom).lerp(t.skyBottom,n),r.cloudColor.value.copy(e.skyCloudColor).lerp(t.skyCloudColor,n)}setWipe(e,t,n,r){let i=this.uniforms;i.wipeMode.value=r,i.skyTop.value.copy(e.skyTop),i.skyBottom.value.copy(e.skyBottom),i.cloudColor.value.copy(e.skyCloudColor),i.skyTopB.value.copy(t.skyTop),i.skyBottomB.value.copy(t.skyBottom),i.cloudColorB.value.copy(t.skyCloudColor),i.wipe.value=n}resize(){this.uniforms.resolution.value.set(innerWidth,innerHeight)}};const X={uniforms:{globalOpacity:{value:0},stretch:{value:1},windDir:{value:new n.Vector3(0,1,0)}},vertexShader:`
		attribute vec3 aOffset;
		attribute vec2 aDim;   // x: width · y: base length
		uniform float stretch;
		uniform vec3 windDir;
		varying vec2 vUv;
		void main() {
			vUv = uv;
			// Filament along the WIND axis (vertical when the wind is off)- a
			// streak IS a velocity vector, so its orientation must follow the
			// motion. Yaw-billboarded toward the camera.
			vec3 fwd = cameraPosition - aOffset;
			vec3 planar = vec3( fwd.z, 0.0, -fwd.x );
			// Degenerate when the camera sits exactly above the streak- any
			// horizontal right works there (the filament is a vertical line).
			vec3 right = length( planar ) < 1e-4 ? vec3( 1.0, 0.0, 0.0 ) : normalize( planar );
			vec3 world = aOffset + right * position.x * aDim.x + windDir * position.y * aDim.y * stretch;
			gl_Position = projectionMatrix * viewMatrix * vec4( world, 1.0 );
		}
	`,fragmentShader:`
		uniform float globalOpacity;
		varying vec2 vUv;
		void main() {
			// Soft falloff along the streak (both ends) and across its width.
			float along = sin( vUv.y * 3.14159 );
			float across = 1.0 - abs( vUv.x - 0.5 ) * 2.0;
			float alpha = along * along * across * globalOpacity;
			if ( alpha < 0.01 ) discard;
			gl_FragColor = vec4( vec3( 1.0 ), alpha );
		}
	`};var ve=class{constructor(e,t){this.params=t,this.scene=e,this.material=new n.ShaderMaterial({uniforms:n.UniformsUtils.clone(X.uniforms),vertexShader:X.vertexShader,fragmentShader:X.fragmentShader,transparent:!0,depthWrite:!1}),this.baseGeometry=new n.PlaneGeometry(1,1),this.build()}build(){let e=this.params.lines.count;this.offsets=new Float32Array(e*3),this.dims=new Float32Array(e*2),this.mults=new Float32Array(e);for(let t=0;t<e;t++)this.spawn(t,0,0),this.offsets[t*3+1]=(Math.random()*2-1)*10;let t=new n.InstancedBufferGeometry;t.index=this.baseGeometry.index,t.attributes.position=this.baseGeometry.attributes.position,t.attributes.uv=this.baseGeometry.attributes.uv,t.instanceCount=e,t.setAttribute(`aOffset`,new n.InstancedBufferAttribute(this.offsets,3)),t.setAttribute(`aDim`,new n.InstancedBufferAttribute(this.dims,2)),this.mesh=new n.Mesh(t,this.material),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}rebuild(){this.scene.remove(this.mesh),this.mesh.geometry.dispose(),this.build()}spawn(e,t,n){let r=this.params.lines,i=Math.random()*Math.PI*2,a=.8+Math.random()*r.radius;this.offsets[e*3]=t+Math.cos(i)*a,this.offsets[e*3+2]=n+Math.sin(i)*a,this.dims[e*2]=.006+Math.random()*.014,this.dims[e*2+1]=1.2+Math.random()*2.2,this.mults[e]=.7+Math.random()*.6}update(e,t,n,r){let i=this.params.lines,a=n.energy,o=i.enabled?i.opacity*a*a+i.opacity*n.dropPulse:0;if(this.mesh.visible=o>=.01,!this.mesh.visible)return;this.material.uniforms.globalOpacity.value=o;let s=(i.speedBase+i.speedEnergyMult*a+n.flow*8*a)*n.rate*(1+n.dropPulse*1.5);this.material.uniforms.stretch.value=.5+s*.09;let c=r.position.x,l=r.position.y,u=r.position.z,d=this.params.wind.angle*Math.PI/180,f=Math.sin(d),p=Math.cos(d);this.material.uniforms.windDir.value.set(f,p,0);let m=this.mults.length,h=!1;for(let t=0;t<m;t++){let n=e*s*this.mults[t];this.offsets[t*3]+=n*f;let r=this.offsets[t*3+1]+n*p;r>l+10&&(this.spawn(t,c,u),r=l-10-Math.random()*4,h=!0),this.offsets[t*3+1]=r}let g=this.mesh.geometry.attributes;g.aOffset.needsUpdate=!0,h&&(g.aDim.needsUpdate=!0)}};const Z=3.2;var ye=class{constructor(e){this.params=e,this.body=null,this.pivot=null,this.wrapper=null,this.active=!1,this.wasActive=!1,this.srcBones=[],this.dstBones=[],this.dist=Z,this.focus=new n.Object3D}init(e,t,r){if(!t.object)return;this.body=t,this.pivot=r,this.wrapper=new n.Group,this.wrapper.visible=!1,e.add(this.wrapper),e.add(this.focus);let i=a(t.object);i.traverse(e=>{(e.isMesh||e.isSkinnedMesh)&&(e.frustumCulled=!1,e.layers.enable(1))}),this.wrapper.add(i),t.object.traverse(e=>{e.isBone&&this.srcBones.push(e)}),i.traverse(e=>{e.isBone&&this.dstBones.push(e)})}update(e,t){if(!this.wrapper)return;let n=t.boost.twin;if(this.active=n>.001,this.active&&!this.wasActive&&(this.dist=Z,this.wrapper.traverse(e=>{(e.isMesh||e.isSkinnedMesh)&&(e.material=this.body.mat)})),this.wasActive=this.active,this.wrapper.visible=this.active,!this.active)return;let r=this.pivot.position,i=this.body.eventName,a=i===`backflip`||i===`backfalling`?4.6:Z;this.dist+=(a-this.dist)*(1-Math.exp(-e/.3));let o=this.pivot.scale.x,s=(1-n)*(1-n)*12;this.wrapper.position.set(r.x,r.y,r.z+this.dist+s),this.wrapper.scale.set(o,o,-o);for(let e=0;e<this.srcBones.length;e++){let t=this.srcBones[e],n=this.dstBones[e];n.position.copy(t.position),n.quaternion.copy(t.quaternion),n.scale.copy(t.scale)}this.focus.position.set(r.x,r.y,r.z+(this.dist+s)/2)}},be=class{constructor(e){this.params=e,this.angle=0,this.vel=0,this.side=Math.random()<.5?-1:1,this.weavePhase=Math.random()*Math.PI*2,this.prevPulse=0}update(e,t){let r=this.params.wind;if(!r.auto)return;let i=0;if(t.dropIn<4){let e=1-t.dropIn/4;i=this.side*60*e**1.2}this.weavePhase+=e*(Math.PI*2/13),i+=Math.sin(this.weavePhase)*(3+10*t.energy),t.dropPulse>.9&&this.prevPulse<=.9&&(this.vel+=-Math.sign(this.angle||this.side)*600,this.side=Math.random()<.5?-1:1),this.prevPulse=t.dropPulse,this.vel+=(i-this.angle)*14*e-this.vel*5.5*e,this.angle+=this.vel*e,r.angle=n.MathUtils.clamp(this.angle,-60,60)*Math.max(0,1-t.boost.wind)}},xe=class{constructor(e){this.audio=e,this.params=S(),this.features=new g(this.params),this.dropTimeline=new oe(e),this.wind=new be(this.params),this.body=new M(this.params),this.renderer=null,this.scene=null,this.pivot=null,this.clock=null,this.cameraRig=null,this.sky=null,this.clouds=null,this.postfx=null,this.autopilot=null,this.gui=null,this.onResize=this.onResize.bind(this)}async load(){await this.body.load()}init(){this.renderer=new n.WebGLRenderer({antialias:!1}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.params.quality.renderScale)),this.renderer.setSize(innerWidth,innerHeight),document.body.appendChild(this.renderer.domElement),this.scene=new n.Scene,this.cameraRig=new ee(this.params),this.sky=new _e(this.scene,this.params),this.clouds=new te(this.scene,this.params),this.speedLines=new ve(this.scene,this.params),this.motes=new ue(this.scene,this.params),this.rays=new ge(this.scene,this.params),this.pivot=new n.Group,this.scene.add(this.pivot),this.body.init(this.pivot),this.cameraRig.body=this.body,this.cameraRig.lookTarget=this.pivot,this.crowd=new ne(this.params),this.crowd.init(this.scene,this.body),this.twin=new ye(this.params),this.twin.init(this.scene,this.body,this.pivot),this.postfx=new he(this.renderer,this.scene,this.cameraRig.camera,this.params),this.postfx.echoAnchor=this.body.hipsBone??this.pivot,this.postfx.multiCamPass.anchor=this.body.hipsBone??this.pivot,this.postfx.echoExclude=[this.crowd.group,this.twin.wrapper].filter(Boolean),this.director=new ae(this.params,this.cameraRig),this.events=new ce(this.params,this.body,this.director),this.autopilot=new T(this.params,this.sky,this.clouds,this.body),this.gui=new le(this),this.autopilot.onPresetAdvanced=e=>this.gui.onPresetAdvanced(e),this.debugView=new re(this.renderer,this.scene,this.cameraRig.camera),addEventListener(`resize`,this.onResize),addEventListener(`keydown`,e=>{e.ctrlKey&&(e.key===`c`||e.key===`C`)&&(e.preventDefault(),this.debugView.toggle())})}warmup(){this.postfx.warmup()}play(){this.clock=new n.Clock,this.params.autopilot.preset=x(this.params.autopilot.preset),this.autopilot.resetPresetTimer(),this.gui.onPresetAdvanced(this.params.autopilot.preset),this.director.entrance(),this.features.dropPulse=.85,this.prevDropPulse=.85,this.renderer.setAnimationLoop(()=>this.update())}stop(){this.renderer.setAnimationLoop(null)}update(){let e=this.audio,t=Math.min(this.clock.getDelta(),.1);this.dropTimeline.update(this.features),this.features.update(t,e),this.events.update(t,e,this.features),this.wind.update(t,this.features);let r=this.debugView?.enabled?this.debugView.camera:this.cameraRig.camera;this.body.update(t,e,this.features,r),this.crowd.update(t,this.features),this.params.autopilot.enabled&&this.autopilot.update(t),this.pivot.scale.setScalar(1+this.features.bass*this.params.body.bassScale),this.driftPhase=(this.driftPhase??0)+t;let i=this.params.body.drift,a=Math.sin(n.MathUtils.degToRad(this.params.wind.angle))*.9;this.pivot.position.set(Math.sin(this.driftPhase*.31)*i+a,0,Math.sin(this.driftPhase*.23+1.3)*i),this.twin.update(t,this.features),this.cameraRig.lookTarget=this.twin.active?this.twin.focus:this.pivot,this.postfx.multiCamPass.anchor=this.twin.active?this.twin.focus:this.body.hipsBone??this.pivot,this.features.dropPulse>.9&&this.prevDropPulse<=.9&&(this.autopilot.skipToNext(),Math.random()<this.params.director.strobeChance?this.director.strobe(this.features.energy):this.director.mode===`base`&&this.director.enterAccent(this.features.energy)),this.prevDropPulse=this.features.dropPulse,this.director.update(t,e,this.features),this.cameraRig.update(t,e,this.features),this.sky.update(t,e,this.features,r),this.clouds.update(t,e,this.features,this.cameraRig.camera),this.speedLines.update(t,e,this.features,r),this.motes.update(t,this.features,r),this.rays.update(t,this.features),this.debugView?.enabled?this.debugView.render():(this.postfx.update(e,this.features),this.postfx.render(t))}onResize(){this.cameraRig.resize(),this.renderer.setSize(innerWidth,innerHeight),this.postfx.resize(),this.sky.resize(),this.debugView?.resize()}};const Q=new t,$=new xe(Q);window.vjAudio=Q,window.vjScene=$;const Se=/tame/i;function Ce(){if(Q.mode!==`live`)return;let e=Q.player;if(!e){setTimeout(Ce,20);return}if(e._preferredPatched)return;e._preferredPatched=!0;let t=e.useTrack;e.useTrack=(n,r=0)=>{if(e.useTrack=t,e.tracks?.length){let t=e.trackNames.findIndex(e=>Se.test(e));t>=0&&(e.trackIndex=t,n=e.tracks[t])}return t(n,r)}}Q.onLoad(async()=>{await $.load(),$.init()}),Q.onWarmup(()=>$.warmup()),Q.onPlay(()=>{$.play(),Ce()}),Q.onStop(()=>$.stop());