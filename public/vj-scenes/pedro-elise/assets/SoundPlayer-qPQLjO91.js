import{t as e}from"./index-B-N9TK64.js";var t=`
	<div class="vj-track-top">
		<span class="vj-track-name" title="Click to skip">♪ ...</span>
		<span class="vj-track-time">0:00 / 0:00</span>
	</div>
	<div class="vj-track-progress-container" title="Seek track">
		<div class="vj-track-progress-bar">
			<div class="vj-track-progress-fill"></div>
			<div class="vj-track-progress-hover"></div>
		</div>
	</div>
`,n=({fillBackground:e,fillShadow:t,nameHoverColor:n,idleOpacity:r})=>`
	.vj-track-widget {
		position: fixed; bottom: 8px; right: 8px; z-index: 1010;
		width: 280px; max-width: calc(100vw - 16px);
		background: rgba(8, 10, 18, 0.75);
		backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 8px;
		padding: 6px 12px; color: #e2e8f0;
		font-family: ui-monospace, Menlo, monospace; font-size: 11px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		display: flex; flex-direction: column; gap: 4px;
		cursor: default; overflow: hidden; user-select: none;
		opacity: ${r};
	}
	.vj-track-widget:hover {
		background: rgba(8, 10, 18, 0.85);
		border-color: rgba(255, 255, 255, 0.25);
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6);
		opacity: 1;
	}
	.vj-track-top {
		display: flex; align-items: center; justify-content: space-between;
		gap: 16px; width: 100%;
	}
	.vj-track-name {
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
		cursor: pointer; flex: 1; transition: color 0.2s; min-width: 0;
	}
	.vj-track-name:hover {
		color: ${n};
	}
	.vj-track-time {
		font-size: 10px; color: rgba(255, 255, 255, 0.4);
		opacity: 0; transition: opacity 0.3s ease; white-space: nowrap;
		flex-shrink: 0;
	}
	.vj-track-widget:hover .vj-track-time {
		opacity: 1;
	}
	.vj-track-progress-container {
		height: 12px; margin-top: 2px; cursor: pointer; touch-action: none;
		display: flex; align-items: center; position: relative;
	}
	.vj-track-progress-bar {
		width: 100%; height: 2px; background: rgba(255, 255, 255, 0.12);
		border-radius: 3px; position: relative; overflow: hidden;
		transition: height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.vj-track-widget:hover .vj-track-progress-bar {
		height: 6px;
	}
	.vj-track-progress-fill {
		height: 100%; width: 0%;
		background: ${e};
		border-radius: 3px; box-shadow: ${t};
		position: absolute; left: 0; top: 0;
	}
	.vj-track-progress-hover {
		position: absolute; top: 0; bottom: 0; left: 0; width: 0;
		background: rgba(255, 255, 255, 0.15); pointer-events: none;
		border-radius: 3px;
	}
`,r=class{constructor({getAudioEl:e,getSource:r,getTrackName:i,onSkip:a,onSeek:o,fillBackground:s=`linear-gradient(90deg, #00ff66, #00ffcc)`,fillShadow:c=`0 0 6px rgba(0, 255, 102, 0.5)`,nameHoverColor:l=`#00ff66`,idleOpacity:u=1}={}){if(this.getAudioEl=e,this.getSource=r,this.getTrackName=i,this.onSkip=a,this.onSeek=o,this.disposed=!1,this.dragging=!1,this.hovering=!1,this.hoverPct=0,this.dragPct=0,document.querySelector(`.vj-track-widget`))return;this.style=document.createElement(`style`),this.style.textContent=n({fillBackground:s,fillShadow:c,nameHoverColor:l,idleOpacity:u}),document.head.appendChild(this.style);let d=this.widget=document.createElement(`div`);d.className=`vj-track-widget`,d.innerHTML=t,document.body.appendChild(d),this.container=d.querySelector(`.vj-track-progress-container`),this.nameEl=d.querySelector(`.vj-track-name`),this.timeEl=d.querySelector(`.vj-track-time`),this.fillEl=d.querySelector(`.vj-track-progress-fill`),this.hoverEl=d.querySelector(`.vj-track-progress-hover`),this.nameEl.addEventListener(`click`,()=>this.onSkip?.()),this.container.addEventListener(`pointerenter`,()=>{this.hovering=!0}),this.container.addEventListener(`pointerleave`,()=>{this.hovering=!1,this.dragging||this.setWidth(this.hoverEl,0)}),this.container.addEventListener(`pointerdown`,this.onPointerDown),this.container.addEventListener(`pointermove`,this.onPointerMove),this.container.addEventListener(`pointerup`,this.onPointerUp),this.container.addEventListener(`pointercancel`,this.onPointerUp),this.tick()}setWidth=(e,t)=>{e.style.width=`${t*100}%`};pctFromEvent=e=>{let t=this.container.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-t.left)/t.width))};format=e=>{if(isNaN(e)||!isFinite(e))return`0:00`;let t=Math.floor(e/60),n=Math.floor(e%60);return`${t}:${n<10?`0`:``}${n}`};previewSeek=e=>{let t=this.getAudioEl?.();t?.duration&&(this.timeEl.textContent=`seek: ${this.format(e*t.duration)}`)};commitSeek=e=>{let t=this.getAudioEl?.();t?.duration&&this.onSeek?.(e*t.duration)};onPointerDown=e=>{this.dragging=!0,this.container.setPointerCapture(e.pointerId),this.dragPct=this.pctFromEvent(e),this.setWidth(this.fillEl,this.dragPct),this.setWidth(this.hoverEl,0),this.previewSeek(this.dragPct),e.preventDefault()};onPointerMove=e=>{this.dragging?(this.dragPct=this.pctFromEvent(e),this.setWidth(this.fillEl,this.dragPct),this.previewSeek(this.dragPct)):this.hovering&&(this.hoverPct=this.pctFromEvent(e),this.setWidth(this.hoverEl,this.hoverPct))};onPointerUp=e=>{this.dragging&&(this.dragging=!1,this.container.releasePointerCapture?.(e.pointerId),this.commitSeek(this.dragPct),this.hovering||this.setWidth(this.hoverEl,0))};render=()=>{let e=this.getSource?.(),t=this.getAudioEl?.();if(e===`mic`){this.nameEl.textContent=`♪ Microphone (live)`,this.timeEl.textContent=``,this.setWidth(this.fillEl,0),this.container.style.pointerEvents=`none`,this.container.style.opacity=`0.3`;return}this.container.style.pointerEvents=`auto`,this.container.style.opacity=`1`;let n=this.getTrackName?.();if(n&&(this.nameEl.textContent=`♪ ${n}`),!t)return;let r=t.duration||0,i=t.currentTime||0;this.dragging||(this.setWidth(this.fillEl,r>0?i/r:0),this.hovering?this.timeEl.textContent=`seek: ${this.format(this.hoverPct*r)}`:this.timeEl.textContent=`${this.format(i)} / ${this.format(r)}`)};tick=()=>{this.disposed||(this.render(),this.raf=requestAnimationFrame(this.tick))};dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),this.widget?.remove(),this.style?.remove()}},i=class{constructor(e){this.analyzer=e,this.tracks=[],this.trackNames=[],this.trackIndex=0,this.source=`mp3`,this.trackName=``,this.micStream=null,this.audioEl=new Audio,this.audioEl.crossOrigin=`anonymous`,this.audioEl.addEventListener(`ended`,()=>this.nextTrack()),window.addEventListener(`keydown`,this.onKey),this.start()}start=async()=>{try{let e=await fetch(`/tracks/tracks.json`);this.tracks=await e.json(),this.trackNames=this.tracks.map(e=>decodeURIComponent(e.split(`/`).pop().replace(/\.mp3$/i,``))),this.trackIndex=Math.max(0,this.trackNames.findIndex(e=>/digeridoo/i.test(e))),this.tracks.length?this.useTrack(this.tracks[this.trackIndex]):await this.useMic()}catch(e){console.warn(`[player] failed to fetch tracks.json, using mic`,e),await this.useMic()}this.control=new r({getAudioEl:()=>this.audioEl,getSource:()=>this.source,getTrackName:()=>this.trackName,onSkip:()=>this.nextTrack(),onSeek:e=>{this.audioEl.currentTime=e,localStorage.setItem(`vj-last-track-time`,this.audioEl.currentTime)}})};useTrack=(t,n=0)=>{if(this.analyzer.connectMediaElement(this.audioEl),this.source=`mp3`,t){if(this.audioEl.src=t,n>0){let e=()=>{this.audioEl.currentTime=n,this.audioEl.removeEventListener(`loadedmetadata`,e)};this.audioEl.addEventListener(`loadedmetadata`,e)}this.trackName=decodeURIComponent(t.split(`/`).pop().replace(/\.mp3$/i,``)),this.analyzer.setTrackId(e(t))}return this.audioEl.play()?.catch(()=>{})};useMic=async()=>{this.micStream||=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}}),this.audioEl.pause(),this.analyzer.connectMic(this.micStream),this.source=`mic`,this.analyzer.setTrackId(``)};nextTrack=()=>{this.tracks.length&&(this.trackIndex=(this.trackIndex+1)%this.tracks.length,this.useTrack(this.tracks[this.trackIndex]))};prevTrack=()=>{this.tracks.length&&(this.trackIndex=(this.trackIndex-1+this.tracks.length)%this.tracks.length,this.useTrack(this.tracks[this.trackIndex]))};onKey=e=>{if(!(document.activeElement&&(document.activeElement.tagName===`INPUT`||document.activeElement.tagName===`TEXTAREA`)))switch(e.key){case`m`:this.source===`mic`?this.tracks.length&&this.useTrack(this.tracks[this.trackIndex]):this.useMic();break;case`.`:case`>`:this.nextTrack();break;case`,`:case`<`:this.prevTrack();break}};dispose=()=>{this.onKey&&window.removeEventListener(`keydown`,this.onKey),this.audioEl.pause(),this.audioEl.src=``,this.control?.dispose()}};export{i as default};