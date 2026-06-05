var u=Object.defineProperty;var k=(a,t,e)=>t in a?u(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var s=(a,t,e)=>k(a,typeof t!="symbol"?t+"":t,e);import{t as m}from"./index-DWsq2_eC.js";const g=`
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
`,v=({fillBackground:a,fillShadow:t,nameHoverColor:e,idleOpacity:i})=>`
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
		opacity: ${i};
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
		color: ${e};
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
		background: ${a};
		border-radius: 3px; box-shadow: ${t};
		position: absolute; left: 0; top: 0;
	}
	.vj-track-progress-hover {
		position: absolute; top: 0; bottom: 0; left: 0; width: 0;
		background: rgba(255, 255, 255, 0.15); pointer-events: none;
		border-radius: 3px;
	}
`;class f{constructor({getAudioEl:t,getSource:e,getTrackName:i,onSkip:r,onSeek:n,fillBackground:c="linear-gradient(90deg, #00ff66, #00ffcc)",fillShadow:h="0 0 6px rgba(0, 255, 102, 0.5)",nameHoverColor:d="#00ff66",idleOpacity:p=1}={}){s(this,"setWidth",(t,e)=>{t.style.width=`${e*100}%`});s(this,"pctFromEvent",t=>{const e=this.container.getBoundingClientRect();return Math.max(0,Math.min(1,(t.clientX-e.left)/e.width))});s(this,"format",t=>{if(isNaN(t)||!isFinite(t))return"0:00";const e=Math.floor(t/60),i=Math.floor(t%60);return`${e}:${i<10?"0":""}${i}`});s(this,"previewSeek",t=>{var i;const e=(i=this.getAudioEl)==null?void 0:i.call(this);e!=null&&e.duration&&(this.timeEl.textContent=`seek: ${this.format(t*e.duration)}`)});s(this,"commitSeek",t=>{var i,r;const e=(i=this.getAudioEl)==null?void 0:i.call(this);e!=null&&e.duration&&((r=this.onSeek)==null||r.call(this,t*e.duration))});s(this,"onPointerDown",t=>{this.dragging=!0,this.container.setPointerCapture(t.pointerId),this.dragPct=this.pctFromEvent(t),this.setWidth(this.fillEl,this.dragPct),this.setWidth(this.hoverEl,0),this.previewSeek(this.dragPct),t.preventDefault()});s(this,"onPointerMove",t=>{this.dragging?(this.dragPct=this.pctFromEvent(t),this.setWidth(this.fillEl,this.dragPct),this.previewSeek(this.dragPct)):this.hovering&&(this.hoverPct=this.pctFromEvent(t),this.setWidth(this.hoverEl,this.hoverPct))});s(this,"onPointerUp",t=>{var e,i;this.dragging&&(this.dragging=!1,(i=(e=this.container).releasePointerCapture)==null||i.call(e,t.pointerId),this.commitSeek(this.dragPct),this.hovering||this.setWidth(this.hoverEl,0))});s(this,"render",()=>{var c,h,d;const t=(c=this.getSource)==null?void 0:c.call(this),e=(h=this.getAudioEl)==null?void 0:h.call(this);if(t==="mic"){this.nameEl.textContent="♪ Microphone (live)",this.timeEl.textContent="",this.setWidth(this.fillEl,0),this.container.style.pointerEvents="none",this.container.style.opacity="0.3";return}this.container.style.pointerEvents="auto",this.container.style.opacity="1";const i=(d=this.getTrackName)==null?void 0:d.call(this);if(i&&(this.nameEl.textContent=`♪ ${i}`),!e)return;const r=e.duration||0,n=e.currentTime||0;this.dragging||(this.setWidth(this.fillEl,r>0?n/r:0),this.hovering?this.timeEl.textContent=`seek: ${this.format(this.hoverPct*r)}`:this.timeEl.textContent=`${this.format(n)} / ${this.format(r)}`)});s(this,"tick",()=>{this.disposed||(this.render(),this.raf=requestAnimationFrame(this.tick))});if(this.getAudioEl=t,this.getSource=e,this.getTrackName=i,this.onSkip=r,this.onSeek=n,this.disposed=!1,this.dragging=!1,this.hovering=!1,this.hoverPct=0,this.dragPct=0,document.querySelector(".vj-track-widget"))return;this.style=document.createElement("style"),this.style.textContent=v({fillBackground:c,fillShadow:h,nameHoverColor:d,idleOpacity:p}),document.head.appendChild(this.style);const o=this.widget=document.createElement("div");o.className="vj-track-widget",o.innerHTML=g,document.body.appendChild(o),this.container=o.querySelector(".vj-track-progress-container"),this.nameEl=o.querySelector(".vj-track-name"),this.timeEl=o.querySelector(".vj-track-time"),this.fillEl=o.querySelector(".vj-track-progress-fill"),this.hoverEl=o.querySelector(".vj-track-progress-hover"),this.nameEl.addEventListener("click",()=>{var l;return(l=this.onSkip)==null?void 0:l.call(this)}),this.container.addEventListener("pointerenter",()=>{this.hovering=!0}),this.container.addEventListener("pointerleave",()=>{this.hovering=!1,this.dragging||this.setWidth(this.hoverEl,0)}),this.container.addEventListener("pointerdown",this.onPointerDown),this.container.addEventListener("pointermove",this.onPointerMove),this.container.addEventListener("pointerup",this.onPointerUp),this.container.addEventListener("pointercancel",this.onPointerUp),this.tick()}dispose(){var t,e;this.disposed=!0,cancelAnimationFrame(this.raf),(t=this.widget)==null||t.remove(),(e=this.style)==null||e.remove()}}class w{constructor(t){s(this,"start",async()=>{try{const t=await fetch("/tracks/tracks.json");this.tracks=await t.json(),this.trackNames=this.tracks.map(e=>decodeURIComponent(e.split("/").pop().replace(/\.mp3$/i,""))),this.trackIndex=Math.max(0,this.trackNames.findIndex(e=>/digeridoo/i.test(e))),this.tracks.length?this.useTrack(this.tracks[this.trackIndex]):await this.useMic()}catch(t){console.warn("[player] failed to fetch tracks.json, using mic",t),await this.useMic()}this.control=new f({getAudioEl:()=>this.audioEl,getSource:()=>this.source,getTrackName:()=>this.trackName,onSkip:()=>this.nextTrack(),onSeek:t=>{this.audioEl.currentTime=t,localStorage.setItem("vj-last-track-time",this.audioEl.currentTime)}})});s(this,"useTrack",(t,e=0)=>{var i;if(this.analyzer.connectMediaElement(this.audioEl),this.source="mp3",t){if(this.audioEl.src=t,e>0){const r=()=>{this.audioEl.currentTime=e,this.audioEl.removeEventListener("loadedmetadata",r)};this.audioEl.addEventListener("loadedmetadata",r)}this.trackName=decodeURIComponent(t.split("/").pop().replace(/\.mp3$/i,"")),this.analyzer.setTrackId(m(t))}return(i=this.audioEl.play())==null?void 0:i.catch(()=>{})});s(this,"useMic",async()=>{this.micStream||(this.micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}})),this.audioEl.pause(),this.analyzer.connectMic(this.micStream),this.source="mic",this.analyzer.setTrackId("")});s(this,"nextTrack",()=>{this.tracks.length&&(this.trackIndex=(this.trackIndex+1)%this.tracks.length,this.useTrack(this.tracks[this.trackIndex]))});s(this,"prevTrack",()=>{this.tracks.length&&(this.trackIndex=(this.trackIndex-1+this.tracks.length)%this.tracks.length,this.useTrack(this.tracks[this.trackIndex]))});s(this,"onKey",t=>{if(!(document.activeElement&&(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="TEXTAREA")))switch(t.key){case"m":this.source==="mic"?this.tracks.length&&this.useTrack(this.tracks[this.trackIndex]):this.useMic();break;case".":case">":this.nextTrack();break;case",":case"<":this.prevTrack();break}});s(this,"dispose",()=>{var t;this.onKey&&window.removeEventListener("keydown",this.onKey),this.audioEl.pause(),this.audioEl.src="",(t=this.control)==null||t.dispose()});this.analyzer=t,this.tracks=[],this.trackNames=[],this.trackIndex=0,this.source="mp3",this.trackName="",this.micStream=null,this.audioEl=new Audio,this.audioEl.crossOrigin="anonymous",this.audioEl.addEventListener("ended",()=>this.nextTrack()),window.addEventListener("keydown",this.onKey),this.start()}}export{w as default};
//# sourceMappingURL=SoundPlayer-1Do7-54t.js.map
