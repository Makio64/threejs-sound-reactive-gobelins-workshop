import{n as e,r as t}from"./index-Dk_uo1Xr.js";var n=`
<div class="vj-track-name">♪ —</div>
<div class="vj-track-transport">
  <button type="button" class="vj-track-pause-btn">Pause</button>
  <label class="vj-track-volume">
    <span class="vj-track-volume-label">Vol</span>
    <input type="range" class="vj-track-volume-slider" min="0" max="1" step="0.01" value="1" />
  </label>
</div>
<div class="vj-track-progress-container">
  <div class="vj-track-progress-hover"></div>
  <div class="vj-track-progress-fill"></div>
</div>
<div class="vj-track-time"></div>
`,r=({fillBackground:e,fillShadow:t,nameHoverColor:n,idleOpacity:r})=>`
.vj-track-widget {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 10000;
  min-width: 200px;
  max-width: 280px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(6, 6, 23, 0.82);
  border: 1px solid rgba(184, 184, 255, 0.2);
  font: 12px/1.3 system-ui, sans-serif;
  color: #e8e8ff;
  opacity: ${r};
  user-select: none;
}
.vj-track-name {
  cursor: pointer;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vj-track-name:hover { color: ${n}; }
.vj-track-transport {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.vj-track-pause-btn {
  flex: 0 0 auto;
  padding: 4px 10px;
  border: 1px solid rgba(184, 184, 255, 0.35);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  color: #e8e8ff;
  font: 11px/1.2 system-ui, sans-serif;
  cursor: pointer;
}
.vj-track-pause-btn:hover:not(:disabled) {
  border-color: ${n};
  color: ${n};
}
.vj-track-pause-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.vj-track-volume {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}
.vj-track-volume-label {
  font-size: 10px;
  opacity: 0.7;
  flex: 0 0 auto;
}
.vj-track-volume-slider {
  flex: 1;
  min-width: 60px;
  height: 4px;
  accent-color: #00ffaa;
  cursor: pointer;
}
.vj-track-volume-slider:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.vj-track-progress-container {
  position: relative;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
  touch-action: none;
}
.vj-track-progress-fill,
.vj-track-progress-hover {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  border-radius: 3px;
  pointer-events: none;
}
.vj-track-progress-fill {
  background: ${e};
  box-shadow: ${t};
}
.vj-track-progress-hover {
  background: rgba(255, 255, 255, 0.22);
}
.vj-track-time {
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.75;
}
`,i=class{constructor({getAudioEl:e,getSource:t,getTrackName:i,onSkip:a,onSeek:o,onTogglePause:s,getIsPaused:c,onVolumeChange:l,getVolume:u,fillBackground:d=`linear-gradient(90deg, #00ff66, #00ffcc)`,fillShadow:f=`0 0 6px rgba(0, 255, 102, 0.5)`,nameHoverColor:p=`#00ff66`,idleOpacity:m=1}={}){if(this.getAudioEl=e,this.getSource=t,this.getTrackName=i,this.onSkip=a,this.onSeek=o,this.onTogglePause=s,this.getIsPaused=c,this.onVolumeChange=l,this.getVolume=u,this.disposed=!1,this.dragging=!1,this.hovering=!1,this.hoverPct=0,this.dragPct=0,document.querySelector(`.vj-track-widget`))return;this.style=document.createElement(`style`),this.style.textContent=r({fillBackground:d,fillShadow:f,nameHoverColor:p,idleOpacity:m}),document.head.appendChild(this.style);let h=this.widget=document.createElement(`div`);h.className=`vj-track-widget`,h.innerHTML=n,document.body.appendChild(h),this.container=h.querySelector(`.vj-track-progress-container`),this.nameEl=h.querySelector(`.vj-track-name`),this.timeEl=h.querySelector(`.vj-track-time`),this.fillEl=h.querySelector(`.vj-track-progress-fill`),this.hoverEl=h.querySelector(`.vj-track-progress-hover`),this.pauseBtn=h.querySelector(`.vj-track-pause-btn`),this.volumeSlider=h.querySelector(`.vj-track-volume-slider`),this.nameEl.addEventListener(`click`,()=>this.onSkip?.()),this.pauseBtn.addEventListener(`click`,()=>this.onTogglePause?.()),this.volumeSlider.addEventListener(`input`,()=>{let e=Number(this.volumeSlider.value);this.onVolumeChange?.(e)}),this.container.addEventListener(`pointerenter`,()=>{this.hovering=!0}),this.container.addEventListener(`pointerleave`,()=>{this.hovering=!1,this.dragging||this.setWidth(this.hoverEl,0)}),this.container.addEventListener(`pointerdown`,this.onPointerDown),this.container.addEventListener(`pointermove`,this.onPointerMove),this.container.addEventListener(`pointerup`,this.onPointerUp),this.container.addEventListener(`pointercancel`,this.onPointerUp),this.tick()}setWidth=(e,t)=>{e.style.width=`${t*100}%`};pctFromEvent=e=>{let t=this.container.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-t.left)/t.width))};format=e=>{if(isNaN(e)||!isFinite(e))return`0:00`;let t=Math.floor(e/60),n=Math.floor(e%60);return`${t}:${n<10?`0`:``}${n}`};previewSeek=e=>{let t=this.getAudioEl?.();t?.duration&&(this.timeEl.textContent=`seek: ${this.format(e*t.duration)}`)};commitSeek=e=>{let t=this.getAudioEl?.();t?.duration&&this.onSeek?.(e*t.duration)};onPointerDown=e=>{this.dragging=!0,this.container.setPointerCapture(e.pointerId),this.dragPct=this.pctFromEvent(e),this.setWidth(this.fillEl,this.dragPct),this.setWidth(this.hoverEl,0),this.previewSeek(this.dragPct),e.preventDefault()};onPointerMove=e=>{this.dragging?(this.dragPct=this.pctFromEvent(e),this.setWidth(this.fillEl,this.dragPct),this.previewSeek(this.dragPct)):this.hovering&&(this.hoverPct=this.pctFromEvent(e),this.setWidth(this.hoverEl,this.hoverPct))};onPointerUp=e=>{this.dragging&&(this.dragging=!1,this.container.releasePointerCapture?.(e.pointerId),this.commitSeek(this.dragPct),this.hovering||this.setWidth(this.hoverEl,0))};render=()=>{let e=this.getSource?.(),t=this.getAudioEl?.();if(e===`mic`||e===`tab`){let t=e===`tab`?`Onglet Chrome (live)`:`Microphone (live)`;this.nameEl.textContent=`♪ ${t}`,this.timeEl.textContent=e===`tab`?`Partage d’onglet actif`:``,this.setWidth(this.fillEl,0),this.container.style.pointerEvents=`none`,this.container.style.opacity=`0.3`,this.pauseBtn.disabled=!0,this.pauseBtn.textContent=`Pause`,this.volumeSlider.disabled=!0;return}this.container.style.pointerEvents=`auto`,this.container.style.opacity=`1`,this.pauseBtn.disabled=!1,this.volumeSlider.disabled=!1;let n=this.getIsPaused?.()??!1;this.pauseBtn.textContent=n?`Lecture`:`Pause`;let r=this.getVolume?.();typeof r==`number`&&(this.volumeSlider.value=String(r));let i=this.getTrackName?.();if(i&&(this.nameEl.textContent=`♪ ${i}`),!t)return;let a=t.duration||0,o=t.currentTime||0;this.dragging||(this.setWidth(this.fillEl,a>0?o/a:0),this.hovering?this.timeEl.textContent=`seek: ${this.format(this.hoverPct*a)}`:this.timeEl.textContent=`${this.format(o)} / ${this.format(a)}`)};tick=()=>{this.disposed||(this.render(),this.raf=requestAnimationFrame(this.tick))};dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),this.widget?.remove(),this.style?.remove()}};async function a(){if(!navigator.mediaDevices?.getDisplayMedia)throw Error(`Capture d’onglet non supportée. Utilise Google Chrome (desktop).`);let e;try{e=await navigator.mediaDevices.getDisplayMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1,suppressLocalAudioPlayback:!1},video:{displaySurface:`browser`},preferCurrentTab:!1,selfBrowserSurface:`exclude`})}catch(t){if(t?.name===`NotAllowedError`)throw Error(`Capture annulée.`);e=await navigator.mediaDevices.getDisplayMedia({audio:!0,video:!0})}if(!e.getAudioTracks().length)throw e.getTracks().forEach(e=>e.stop()),Error(`Aucun audio — dans Chrome, choisis un onglet et coche « Partager aussi l’audio de l’onglet ».`);for(let t of e.getVideoTracks())t.stop(),e.removeTrack(t);return e}var o=class{constructor(e){this.analyzer=e,this.tracks=[],this.trackNames=[],this.trackIndex=0,this.source=`mp3`,this.trackName=``,this.micStream=null,this.tabStream=null,this.audioEl=new Audio,this.audioEl.crossOrigin=`anonymous`;let t=parseFloat(localStorage.getItem(`vj-volume`)??`1`);this.audioEl.volume=Number.isFinite(t)?Math.min(1,Math.max(0,t)):1,this.audioEl.addEventListener(`ended`,()=>this.nextTrack()),window.addEventListener(`keydown`,this.onKey),this.start()}start=async()=>{try{let{tracks:e}=await t();this.tracks=e,this.trackNames=this.tracks.map(e=>decodeURIComponent(e.split(`/`).pop().replace(/\.mp3$/i,``)));let n=this.trackNames.findIndex(e=>/digeridoo/i.test(e));this.trackIndex=n>=0?n:0,await this.useTrack(this.tracks[this.trackIndex])}catch(e){console.warn(`[player] playlist MP3 indisponible — ajoute des .mp3 dans public/tracks/`,e)}this.control=new i({fillBackground:`linear-gradient(90deg, #8b2fc9, #ff2d6f)`,fillShadow:`0 0 8px rgba(255, 45, 111, 0.35)`,nameHoverColor:`#ff2d6f`,idleOpacity:.92,getAudioEl:()=>this.audioEl,getSource:()=>this.source,getTrackName:()=>this.trackName,onSkip:()=>this.nextTrack(),onSeek:e=>{this.audioEl.currentTime=e,localStorage.setItem(`vj-last-track-time`,this.audioEl.currentTime)},onTogglePause:()=>this.togglePause(),getIsPaused:()=>this.source===`mp3`&&this.audioEl.paused,onVolumeChange:e=>this.setVolume(e),getVolume:()=>this.audioEl.volume})};setVolume=e=>{let t=Math.min(1,Math.max(0,e));this.audioEl.volume=t,localStorage.setItem(`vj-volume`,String(t))};togglePause=()=>{this.source===`mp3`&&(this.audioEl.paused?this.audioEl.play()?.catch(()=>{}):this.audioEl.pause())};stopLiveCapture=()=>{this.tabStream&&=(this.tabStream.getTracks().forEach(e=>e.stop()),null)};useTrack=(t,n=0)=>{if(this.stopLiveCapture(),this.analyzer.connectMediaElement(this.audioEl),this.source=`mp3`,t){if(this.audioEl.src=t,n>0){let e=()=>{this.audioEl.currentTime=n,this.audioEl.removeEventListener(`loadedmetadata`,e)};this.audioEl.addEventListener(`loadedmetadata`,e)}this.trackName=decodeURIComponent(t.split(`/`).pop().replace(/\.mp3$/i,``)),this.analyzer.setTrackId(e(t))}return this.audioEl.play()?.catch(()=>{})};useMic=async()=>{this.stopLiveCapture(),this.micStream||=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}}),this.audioEl.pause(),this.analyzer.connectStream(this.micStream),this.source=`mic`,this.trackName=`Micro`,this.analyzer.setTrackId(``)};useTabAudio=async()=>{this.stopLiveCapture();let e=await a();this.tabStream=e,this.audioEl.pause(),this.analyzer.connectStream(e),this.source=`tab`,this.trackName=`Onglet Chrome`;let t=e.getAudioTracks()[0];t&&(t.onended=()=>{this.source===`tab`&&(this.tracks.length?this.useTrack(this.tracks[this.trackIndex]):this.useMic().catch(()=>{}))}),this.analyzer.setTrackId(``)};useSystemAudio=()=>this.useTabAudio();selectTrack=e=>{if(this.tracks.length)return this.trackIndex=(e%this.tracks.length+this.tracks.length)%this.tracks.length,this.useTrack(this.tracks[this.trackIndex])};getTrackOptions=()=>{let e={"Onglet Chrome":`__tab__`,Micro:`__mic__`};for(let t of this.trackNames)e[t]=t;return e};getCurrentTrackKey=()=>this.source===`mic`?`__mic__`:this.source===`tab`?`__tab__`:this.trackName||this.trackNames[this.trackIndex]||``;nextTrack=()=>{this.tracks.length&&this.selectTrack(this.trackIndex+1)};prevTrack=()=>{this.tracks.length&&this.selectTrack(this.trackIndex-1)};onKey=e=>{if(!(document.activeElement&&(document.activeElement.tagName===`INPUT`||document.activeElement.tagName===`TEXTAREA`)))switch(e.key){case` `:e.preventDefault(),this.togglePause();break;case`m`:this.source===`mic`?this.tracks.length&&this.useTrack(this.tracks[this.trackIndex]):this.useMic();break;case`t`:this.useTabAudio().catch(e=>console.warn(`[player] tab audio`,e.message));break;case`.`:case`>`:this.nextTrack();break;case`,`:case`<`:this.prevTrack();break}};dispose=()=>{this.onKey&&window.removeEventListener(`keydown`,this.onKey),this.stopLiveCapture(),this.micStream&&=(this.micStream.getTracks().forEach(e=>e.stop()),null),this.audioEl.pause(),this.audioEl.src=``,this.control?.dispose()}};export{o as default};