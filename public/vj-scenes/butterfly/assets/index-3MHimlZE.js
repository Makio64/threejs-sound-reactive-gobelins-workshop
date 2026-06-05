const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Analyzer-cT00JDc9.js","assets/preload-helper-zJ_50EbN.js","assets/TrackTuningConfig-DkfS2GZt.js"])))=>i.map(i=>d[i]);
import{n as e}from"./TrackTuningConfig-DkfS2GZt.js";import{t}from"./preload-helper-zJ_50EbN.js";import{t as n}from"./PlayerControl-BxZqDwoG.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r=[],i={sceneSeconds:30,maxLive:4,eyeTransitionSeconds:1.2},a={trackIndex:`vj-last-track-index`,trackTime:`vj-last-track-time`,customScenes:`vj-custom-scenes`},o=e=>e*e*(3-2*e),s=(e,t,n)=>Math.min(n,Math.max(t,e)),c=class{constructor(e){this.show=e,this.active=!1,this.t=0,this.current=null,this.incoming=null}iris(e,t){if(t<=.001){e.style.webkitMaskImage=e.style.maskImage=`linear-gradient(transparent, transparent)`;return}let n=t*65;e.style.webkitMaskImage=e.style.maskImage=`radial-gradient(ellipse 100vmax ${n}vmax at 50% 50%, #000 95%, transparent 105%)`}reset(e){e.style.transform=`none`,e.style.webkitMaskImage=e.style.maskImage=`none`}start(e,t){return this.active?!1:(this.current=e,this.incoming=t,this.current.iframe.style.zIndex=`1`,this.incoming.iframe.style.zIndex=`2`,this.show.activate(this.incoming),this.t=0,this.active=!0,this.apply(0),!0)}apply(e){if(!this.current||!this.incoming)return;let t=o(s((.45-e)/.45,0,1)),n=o(s((e-.55)/.45,0,1));this.iris(this.current.iframe,t),this.iris(this.incoming.iframe,n),this.current.iframe.style.transform=`scale(${1+.04*(1-t)})`,this.incoming.iframe.style.transform=`scale(${1.05-.05*n})`}update(e){if(!this.active)return;this.t+=e/i.eyeTransitionSeconds;let t=Math.min(1,this.t);if(this.apply(t),t>=1){let e=this.current;this.show.current=this.incoming,this.show.incoming=null,this.active=!1,this.show.current.iframe.style.zIndex=`1`,this.reset(this.show.current.iframe),this.show.deactivate(e),this.reset(e.iframe),this.show.evict()}}},l=30,u=4,d=new class{constructor(){this.scenes=[],this.tracks=[],this.trackNames=[],this.trackIndex=0,this.layers=new Map,this.clock=0,this.current=null,this.incoming=null,this.eyeTransition=new c(this),this.index=0,this.elapsed=0,this.paused=!1,this.audio=null,this.debug=null,this.onTrack=null,this.audioEl=null,this.micStream=null,this.source=null,this.sceneSeconds=l,this.onScenesChanged=null,this.onConfigChanged=null}async init(){let{default:e}=await t(async()=>{let{default:e}=await import(`./Analyzer-cT00JDc9.js`);return{default:e}},__vite__mapDeps([0,1,2]));this.AnalyzerDebug=(await t(async()=>{let{default:e}=await import(`./AnalyzerDebug-BsNYi7-t.js`);return{default:e}},[])).default,this.audio=new e({mode:`live`,autoTick:!1}),this.audioEl=new Audio,this.audioEl.crossOrigin=`anonymous`,this.audioEl.addEventListener(`ended`,()=>this.nextTrack());try{let e=await fetch(`/tracks/tracks.json`);this.tracks=await e.json(),this.trackNames=this.tracks.map(e=>decodeURIComponent(e.split(`/`).pop().replace(/\.mp3$/i,``)))}catch(e){console.error(`[show] failed to fetch tracks.json`,e),this.tracks=[],this.trackNames=[]}let n=localStorage.getItem(`vj-last-track-index`);if(n!==null){let e=parseInt(n,10);e>=0&&e<this.tracks.length?this.trackIndex=e:this.trackIndex=Math.max(0,this.trackNames.findIndex(e=>/digeridoo/i.test(e)))}else this.trackIndex=Math.max(0,this.trackNames.findIndex(e=>/digeridoo/i.test(e)));let i=localStorage.getItem(`vj-custom-scenes`),a=i?JSON.parse(i):[];return this.scenes=[...r.filter(e=>e.id!==`template`).sort((e,t)=>e.id===`_warmup`?-1:t.id===`_warmup`?1:e.id.localeCompare(t.id)),...a],this.stage=document.body.appendChild(document.createElement(`div`)),this.stage.className=`vj-stage`,this}async start(){try{await this.audio.ctx.resume()}catch{}if(this.tracks.length){let e=parseFloat(localStorage.getItem(`vj-last-track-time`)||0);this.playTrack(this.tracks[this.trackIndex],e)}else this.playMic();this.notifyTrack(),this.setInitial(this.scenes[0]),this.preloadNext(),this.addKeys(),this.toggleDebug(),window.addEventListener(`beforeunload`,()=>{this.tracks.length&&this.source===`mp3`&&(localStorage.setItem(`vj-last-track-time`,this.audioEl.currentTime),localStorage.setItem(`vj-last-track-index`,this.trackIndex))});let e=performance.now(),t=n=>{let r=Math.min(.05,(n-e)/1e3);e=n,this.update(r),this.raf=requestAnimationFrame(t)};this.raf=requestAnimationFrame(t)}get transitioning(){return this.eyeTransition.active}update(e){this.audio.update(e),this.sendAudio(this.current),this.incoming&&this.sendAudio(this.incoming),this.eyeTransition.update(e),!this.paused&&!this.transitioning&&(this.elapsed+=e,this.elapsed>=this.sceneSeconds&&this.go(this.index+1)),this.tracks.length&&this.source===`mp3`&&(this.saveTimeTimer=(this.saveTimeTimer||0)+e,this.saveTimeTimer>=1&&(this.saveTimeTimer=0,localStorage.setItem(`vj-last-track-time`,this.audioEl.currentTime)))}playTrack(t,n=0){if(this.audio.connectMediaElement(this.audioEl),this.source=`mp3`,t){if(this.audioEl.src=t,n>0){let e=()=>{this.audioEl.currentTime=n,this.audioEl.removeEventListener(`loadedmetadata`,e)};this.audioEl.addEventListener(`loadedmetadata`,e)}this.audio.setTrackId(e(t))}this.audioEl.play()?.catch(()=>{})}async playMic(){this.micStream||=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}}),this.audioEl.pause(),this.audio.connectMic(this.micStream),this.source=`mic`,this.audio.setTrackId(``)}nextTrack(){this.tracks.length&&(this.trackIndex=(this.trackIndex+1)%this.tracks.length,localStorage.setItem(`vj-last-track-index`,this.trackIndex),localStorage.setItem(`vj-last-track-time`,0),this.playTrack(this.tracks[this.trackIndex]),this.notifyTrack())}useTrack(){this.tracks.length&&(this.playTrack(this.tracks[this.trackIndex]),this.notifyTrack())}notifyTrack(){this.onTrack&&this.tracks.length&&this.onTrack(this.trackNames[this.trackIndex])}send(e,t){if(e?.loaded)try{e.iframe.contentWindow?.postMessage({type:`vj`,kind:t},`*`)}catch{}}sendAudio(e){if(e?.loaded)try{e.iframe.contentWindow?.postMessage(this.audio.payload,`*`)}catch{}}makeLayer(e){let t=document.createElement(`iframe`);t.title=e.id,t.setAttribute(`allow`,`autoplay; fullscreen; microphone; xr-spatial-tracking`),t.className=`vj-layer`;let n={id:e.id,url:e.url,iframe:t,loaded:!1,timedOut:!1,shown:!1,used:++this.clock};return n.timeoutId=setTimeout(()=>{n.loaded||(n.timedOut=!0,this.onScenesChanged&&this.onScenesChanged())},5e3),t.addEventListener(`load`,()=>{clearTimeout(n.timeoutId),n.loaded=!0,n.timedOut=!1,this.send(n,`load`),this.send(n,`warmup`),this.send(n,n.shown?`play`:`stop`),this.onScenesChanged&&this.onScenesChanged()}),t.src=e.url,this.stage.appendChild(t),this.layers.set(e.id,n),this.evict(),this.onScenesChanged&&this.onScenesChanged(),n}ensure(e){let t=this.layers.get(e.id);return t||=this.makeLayer(e),t.used=++this.clock,t}evict(){if(this.layers.size<=u)return;let e=new Set([this.current?.id,this.incoming?.id]);for(let t of[...this.layers.values()].filter(t=>!e.has(t.id)).sort((e,t)=>e.used-t.used)){if(this.layers.size<=u)break;clearTimeout(t.timeoutId),t.iframe.remove(),this.layers.delete(t.id)}this.onScenesChanged&&this.onScenesChanged()}activate(e){e.shown=!0,e.iframe.style.display=`block`,this.send(e,`play`),this.onScenesChanged&&this.onScenesChanged()}deactivate(e){e.shown=!1,e.iframe.style.display=`none`,this.send(e,`stop`),this.onScenesChanged&&this.onScenesChanged()}addScene(e,t=``){if(!e)return;let n=e.trim();/^https?:\/\//i.test(n)||(n=`https://`+n);try{let e=new URL(n),r=t.trim()||e.hostname.replace(/^www\./i,``),i={id:`custom-${Date.now()}`,label:r,url:n,kind:`custom`};return this.scenes.push(i),this.saveCustomScenes(),this.preloadNext(),this.onScenesChanged&&this.onScenesChanged(),i}catch(e){console.error(`Invalid URL`,e)}}deleteScene(e){let t=this.scenes.findIndex(t=>t.id===e);if(t===-1)return;if(this.current?.id===e||this.incoming?.id===e){let e=(t+1)%this.scenes.length;this.go(e)}this.scenes.splice(t,1);let n=this.layers.get(e);n&&(clearTimeout(n.timeoutId),n.iframe.remove(),this.layers.delete(e)),this.index>=this.scenes.length?this.index=Math.max(0,this.scenes.length-1):t<this.index&&this.index--,this.saveCustomScenes(),this.preloadNext(),this.onScenesChanged&&this.onScenesChanged()}saveCustomScenes(){let e=this.scenes.filter(e=>e.kind===`custom`);localStorage.setItem(`vj-custom-scenes`,JSON.stringify(e))}setInitial(e){let t=this.ensure(e);this.current=t,t.iframe.style.zIndex=`1`,this.eyeTransition.reset(t.iframe),this.activate(t)}transitionTo(e){return this.transitioning||e.id===this.current?.id?!1:(this.incoming=this.ensure(e),this.eyeTransition.start(this.current,this.incoming))}preloadNext(){this.scenes.length>1&&this.ensure(this.scenes[(this.index+1)%this.scenes.length])}go(e){let t=this.scenes.length,n=(e%t+t)%t;n!==this.index&&this.transitionTo(this.scenes[n])&&(this.index=n,this.elapsed=0,this.preloadNext())}toggleDebug(){this.debug?this.debug.toggle():this.debug=new this.AnalyzerDebug(this.audio)}addKeys(){let e=``;addEventListener(`keydown`,t=>{if(!(document.activeElement&&(document.activeElement.tagName===`INPUT`||document.activeElement.tagName===`TEXTAREA`)))switch(t.key){case` `:t.preventDefault(),this.paused=!this.paused,this.onConfigChanged&&this.onConfigChanged();break;case`m`:this.source===`mic`?this.useTrack():this.playMic(),this.onConfigChanged&&this.onConfigChanged();break;case`d`:this.toggleDebug();break;case`ArrowLeft`:t.preventDefault(),this.go(this.index-1);break;case`ArrowRight`:t.preventDefault(),this.go(this.index+1);break;case`Enter`:e&&=(this.go(parseInt(e,10)),``);break;default:/^[0-9]$/.test(t.key)&&(e+=t.key)}})}},f=`<div class="vj-dashboard">
	<div class="vj-dash-header">
		<div class="vj-dash-logo">
			<span>CONTROL PANEL</span>
		</div>
	</div>
	<div class="vj-dash-scroll">
		<div class="vj-section">
			<div class="vj-flex-row">
				<span class="vj-title">PLAYBACK</span>
				<span class="vj-badge vj-badge-paused" id="vj-play-status" style="display: none;">PAUSED</span>
			</div>
			<div class="vj-progress">
				<div class="vj-progress-fill" id="vj-time-progress" style="width: 0%"></div>
			</div>
			<div class="vj-slider-container" style="margin-top: 14px;">
				<div class="vj-flex-row">
					<label>SCENE DURATION</label>
					<span id="vj-duration-val">30s</span>
				</div>
				<input type="range" class="vj-slider" id="vj-slider-duration" min="5" max="60" value="30">
			</div>
		</div>

		<div class="vj-section">
			<span class="vj-title">AUDIO STATE</span>
			<div class="vj-btn-group">
				<button class="vj-btn-tab" id="vj-audio-mic">MIC</button>
				<button class="vj-btn-tab" id="vj-audio-track">MP3</button>
			</div>
		</div>

		<div class="vj-section">
			<span class="vj-title">SCENES (<span id="vj-scenes-count">0</span>)</span>
			<div class="vj-scene-list" id="vj-scene-list-container"></div>
		</div>

		<div class="vj-section" style="border-bottom: none; padding-bottom: 0; margin-bottom: 0;">
			<span class="vj-title">KEYBOARD SHORTCUTS</span>
			<div class="vj-shortcuts">
				<div><span>H</span> Toggle Dashboard</div>
				<div><span>Space</span> Pause/Resume Auto-Advance</div>
				<div><span>M</span> Toggle Mic vs Track</div>
				<div><span>D</span> Toggle Audio Debug</div>
				<div><span>&larr;</span> / <span>&rarr;</span> Prev / Next Scene</div>
			</div>
		</div>
	</div>
</div>
<button class="vj-btn-toggle" title="Toggle Controls (H)">
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
</button>
`,p=class{constructor(e){this.vjHost=e,this.dom={},this.lastIndex=-1,this.lastSource=``,this.lastPaused=null,this.lastDuration=-1,this.init()}init(){this.createDOM(),this.bindEvents();let e=this.vjHost.onScenesChanged;this.vjHost.onScenesChanged=()=>{e&&e(),this.renderScenes()};let t=this.vjHost.onConfigChanged;this.vjHost.onConfigChanged=()=>{t&&t(),this.renderConfig()};let n=this.vjHost.onTrack;this.vjHost.onTrack=e=>{n&&n(e),this.dom.activeTrackName&&(this.dom.activeTrackName.textContent=`♪ ${e}`)},this.renderScenes(),this.renderConfig(),this.vjHost.tracks.length&&this.dom.activeTrackName&&(this.dom.activeTrackName.textContent=`♪ ${this.vjHost.trackNames[this.vjHost.trackIndex]}`),this.startSync()}createDOM(){let e=document.createElement(`div`);e.innerHTML=f,document.body.appendChild(e),this.dom.dashboard=e.querySelector(`.vj-dashboard`),this.dom.toggleBtn=e.querySelector(`.vj-btn-toggle`),this.dom.durationSlider=e.querySelector(`#vj-slider-duration`),this.dom.durationVal=e.querySelector(`#vj-duration-val`),this.dom.audioMic=e.querySelector(`#vj-audio-mic`),this.dom.audioTrack=e.querySelector(`#vj-audio-track`),this.dom.sceneListContainer=e.querySelector(`#vj-scene-list-container`),this.dom.scenesCount=e.querySelector(`#vj-scenes-count`),this.dom.progressFill=e.querySelector(`#vj-time-progress`),this.dom.playStatus=e.querySelector(`#vj-play-status`)}toggleDashboard(){this.dom.dashboard.classList.toggle(`open`)}bindEvents(){let e=()=>this.toggleDashboard();this.dom.toggleBtn.addEventListener(`click`,e),addEventListener(`keydown`,t=>{if(t.key===`h`||t.key===`H`){if(document.activeElement&&(document.activeElement.tagName===`INPUT`||document.activeElement.tagName===`TEXTAREA`))return;e()}}),this.dom.durationSlider.addEventListener(`input`,e=>{let t=parseInt(e.target.value,3);this.vjHost.sceneSeconds=t,this.dom.durationVal.textContent=`${t}s`}),this.dom.audioMic.addEventListener(`click`,()=>{this.vjHost.playMic(),this.vjHost.onConfigChanged&&this.vjHost.onConfigChanged()}),this.dom.audioTrack.addEventListener(`click`,()=>{this.vjHost.useTrack(),this.vjHost.onConfigChanged&&this.vjHost.onConfigChanged()})}renderScenes(){this.dom.sceneListContainer&&(this.dom.scenesCount.textContent=this.vjHost.scenes.length,this.dom.sceneListContainer.innerHTML=``,this.vjHost.scenes.forEach((e,t)=>{let n=document.createElement(`div`),r=t===this.vjHost.index;n.className=`vj-scene-item ${r?`active`:``}`;let i=`vj-status-inactive`,a=this.vjHost.layers.get(e.id);a&&(r||a.shown?i=`vj-status-playing`:a.timedOut?i=`vj-status-error`:a.loaded&&(i=`vj-status-preloaded`));let o=e.label||e.id,s=e.kind||`local`;if(n.innerHTML=`
				<div class="vj-scene-info" style="min-width: 0; flex: 1;">
					<span class="vj-status-dot ${i}"></span>
					<span class="vj-scene-label" title="${e.url}" style="display: inline-block; max-width: calc(100% - 20px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
						${o} <span class="vj-scene-type">${s}</span>
					</span>
				</div>
			`,e.kind===`custom`){let t=document.createElement(`button`);t.className=`vj-scene-del`,t.title=`Remove scene`,t.innerHTML=`
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
				`,t.addEventListener(`click`,t=>{t.stopPropagation(),this.vjHost.deleteScene(e.id)}),n.appendChild(t)}n.addEventListener(`click`,()=>{this.vjHost.go(t)}),this.dom.sceneListContainer.appendChild(n)}))}renderConfig(){let e=this.vjHost.source;this.dom.audioMic.classList.toggle(`active`,e===`mic`),this.dom.audioTrack.classList.toggle(`active`,e===`mp3`),this.dom.durationSlider.value=this.vjHost.sceneSeconds,this.dom.durationVal.textContent=`${this.vjHost.sceneSeconds}s`}startSync(){let e=()=>{let t=Math.min(100,this.vjHost.elapsed/this.vjHost.sceneSeconds*100);this.dom.progressFill&&(this.dom.progressFill.style.width=`${this.vjHost.transitioning?100:t}%`),this.dom.playStatus&&(this.vjHost.paused?(this.dom.playStatus.textContent=`PAUSED`,this.dom.playStatus.className=`vj-badge vj-badge-paused`,this.dom.playStatus.style.display=`inline-block`):this.dom.playStatus.style.display=`none`),this.vjHost.index!==this.lastIndex&&(this.lastIndex=this.vjHost.index,this.renderScenes()),(this.vjHost.source!==this.lastSource||this.vjHost.paused!==this.lastPaused||this.vjHost.sceneSeconds!==this.lastDuration)&&(this.lastSource=this.vjHost.source,this.lastPaused=this.vjHost.paused,this.lastDuration=this.vjHost.sceneSeconds,this.renderConfig()),requestAnimationFrame(e)};requestAnimationFrame(e)}},m=`<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
	<h1 id="vj-show-title" style="margin:0;font-family:'Outfit',sans-serif;font-size:clamp(32px,8vw,64px);font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:#fff;text-align:center">Humanity</h1>
	<p style="margin:0;font-family:'Inter',sans-serif;font-size:10px;font-weight:400;letter-spacing:.5em;text-transform:uppercase;color:rgba(255,255,255,.45)">Sound reactive Threejs Workshop</p>
</div>
<img src="/img/gobelins-logo.svg" alt="Gobelins" class="home-logo" draggable="false">
<div class="home-actions">
	<button class="home-start">start</button>
	<button class="home-guide-btn">Integration Guide</button>
</div>
`,h=`<form method="dialog">
	<button class="guide-close-btn" type="submit" aria-label="Close dialog">&times;</button>
</form>
<div class="guide-content">
	<h2 id="guide-title" class="guide-title">Integration Guide</h2>

	<div class="guide-section">
		<h3 class="guide-section-title">1. Getting started</h3>
		<p class="guide-text">
			The engine is dependency-free.
		</p>
		<div class="guide-pre">
			<code>Copy:
src/sounds/  →  your src/sounds/
public/tracks/  →  your public/tracks/

import Analyzer from './sounds/Analyzer.js'</code>
		</div>
		<p class="guide-text">
			Register <code class="guide-code">vite-plugin-vj-tracks.js</code> too. It keeps <code class="guide-code">tracks.json</code> in sync, so dropping an <code class="guide-code">.mp3</code> in <code class="guide-code">public/tracks/</code> adds it to the playlist:
		</p>
		<div class="guide-pre">
			<code>import vjTracksPlugin from './vite-plugin-vj-tracks.js'
export default defineConfig( { plugins: [ vjTracksPlugin() ] } )</code>
		</div>
		<p class="guide-text">
			On a brand-new project the first <code class="guide-code">pnpm dev</code> falls back to the mic, because <code class="guide-code">tracks.json</code> is written just after the initial scan. Restart once, or commit a generated <code class="guide-code">tracks.json</code>.
		</p>
		<p class="guide-text">
			Then read the signals each frame:
		</p>
		<div class="guide-pre">
			<code>const audio = new Analyzer()

audio.onAudio( a => {
  a.volume             // instant loudness        0..1
  a.volumeSmooth       // loudness, smoothed       0..1
  a.kick               // spikes on each kick      0..1
  a.kickHard           // strong beats only        0..1
  a.volumeByFrequency  // per-frequency loudness   Float32Array(256), 0..1
} )</code>
		</div>
		<p class="guide-text">
			Run <code class="guide-code">pnpm dev</code> and open your page. It plays the tracks (or mic), so your visuals react on their own.
		</p>
		<p class="guide-text">
			Press <code class="guide-code">d</code> for a live debug overlay of every signal (spectrum + meters). Drop more <code class="guide-code">.mp3</code>s in <code class="guide-code">public/tracks/</code>, switch with <code class="guide-code">.</code> / <code class="guide-code">,</code>, and toggle the mic with <code class="guide-code">m</code>.
		</p>
	</div>

	<div class="guide-section">
		<h3 class="guide-section-title">2. The helper modules</h3>
		<p class="guide-text">
			The <code class="guide-code">Analyzer</code> lazy-loads these in standalone mode, so reach for them only when you want manual control. All three live in <code class="guide-code">src/sounds/</code>.
		</p>
		<div class="guide-pre">
			<code>// AnalyzerDebug- live overlay
import AnalyzerDebug from '/sounds/AnalyzerDebug.js'
const debug = new AnalyzerDebug( audio )
debug.toggle()
debug.show()
debug.hide()
debug.dispose()

// SoundPlayer- music, at audio.player
audio.player?.useTrack( url )
audio.player?.nextTrack()
audio.player?.prevTrack()
audio.player?.useMic()

// PlayerControl- now playing widget
import PlayerControl from '/sounds/PlayerControl.js'
new PlayerControl( { getAudioEl, getSource, getTrackName, onSkip, onSeek } )</code>
		</div>
	</div>

	<div class="guide-section">
		<h3 class="guide-section-title">3. Integrate it here</h3>
		<p class="guide-text">
			Add your scene as a <strong>local folder</strong> and open a <strong>pull request</strong> (no list to edit). Copy the template, rename it, and edit its <code class="guide-code">index.html</code>:
		</p>
		<div class="guide-pre">
			<code>public/vj-scenes/template/  →  public/vj-scenes/00-your-name/</code>
		</div>
		<p class="guide-text">
			Save and the dev server auto-detects the folder. Open a PR when ready, once merged it joins the loop: the host loads it in an iframe and the same <code class="guide-code">Analyzer</code> switches to <strong>receive</strong> mode, reading the show's live audio instead of its own. Nothing in your code changes.
		</p>
	</div>
</div>
`;await new class{overlay=null;guideDialog=null;activeTrackName=``;async start(){await d.init(),this.showStartOverlay()}showStartOverlay(){if(this.overlay=document.body.appendChild(document.createElement(`div`)),this.overlay.className=`vj-home-overlay`,!d.scenes.length){this.overlay.innerHTML=`<div style="color:rgba(255,255,255,.6)">No scenes. Add public/vj-scenes/&lt;name&gt;/index.html, or a URL in src/VJHost.js.</div>`;return}this.overlay.innerHTML=m,this.guideDialog=this.createGuideDialog(),this.overlay.querySelector(`.home-guide-btn`).addEventListener(`click`,()=>this.guideDialog.showModal()),this.overlay.querySelector(`.home-start`).addEventListener(`click`,()=>this.beginShow(),{once:!0})}createGuideDialog(){let e=document.createElement(`dialog`);return e.id=`integration-guide`,e.setAttribute(`closedby`,`any`),e.setAttribute(`aria-labelledby`,`guide-title`),e.innerHTML=h,document.body.appendChild(e),this.addDialogCloseFallback(e),e}addDialogCloseFallback(e){`closedBy`in HTMLDialogElement.prototype||e.addEventListener(`click`,t=>{if(t.target!==e)return;let n=e.getBoundingClientRect();n.top<=t.clientY&&t.clientY<=n.top+n.height&&n.left<=t.clientX&&t.clientX<=n.left+n.width||e.close()})}async beginShow(){this.overlay.remove(),this.guideDialog.remove(),d.tracks.length&&this.createPlayerControl(),await d.start(),new p(d)}createPlayerControl(){return d.onTrack=this.updateTrackName,this.updateTrackName(d.trackNames[d.trackIndex]),new n({getAudioEl:()=>d.audioEl,getSource:()=>d.source,getTrackName:()=>this.activeTrackName,onSkip:()=>d.nextTrack(),onSeek:e=>{d.audioEl.currentTime=e,localStorage.setItem(a.trackTime,d.audioEl.currentTime)},fillBackground:`#94a3b8`,fillShadow:`none`,nameHoverColor:`#fff`,idleOpacity:.15})}updateTrackName=e=>{this.activeTrackName=e;let t=document.getElementById(`vj-active-track-name`);t&&(t.textContent=`♪ ${e}`)}}().start();