// --- sounds/ui/player-control.css ---------------------------------------------
// The control's styles, as a themeable JS module (a string export) rather than a
// raw .css file- so it travels with /sounds and is served straight to standalone
// scenes with no bundler step. A few values are themed so the host (subtle, grey)
// and standalone (green accent) controls can differ. See ../PlayerControl.js.
export default ( { fillBackground, fillShadow, nameHoverColor, idleOpacity } ) => `
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
		opacity: ${ idleOpacity };
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
		color: ${ nameHoverColor };
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
		background: ${ fillBackground };
		border-radius: 3px; box-shadow: ${ fillShadow };
		position: absolute; left: 0; top: 0;
	}
	.vj-track-progress-hover {
		position: absolute; top: 0; bottom: 0; left: 0; width: 0;
		background: rgba(255, 255, 255, 0.15); pointer-events: none;
		border-radius: 3px;
	}
`
