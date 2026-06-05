// --- sounds/ui/player-control.html --------------------------------------------
// The control's markup. Kept as a JS module (a string export) rather than a raw
// .html file so it travels with /sounds and is served straight to standalone
// scenes- no bundler step needed. See ../PlayerControl.js.
export default `
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
`
