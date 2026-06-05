export default ( { fillBackground, fillShadow, nameHoverColor, idleOpacity } ) => `
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
  opacity: ${ idleOpacity };
  user-select: none;
}
.vj-track-name {
  cursor: pointer;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vj-track-name:hover { color: ${ nameHoverColor }; }
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
  border-color: ${ nameHoverColor };
  color: ${ nameHoverColor };
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
  background: ${ fillBackground };
  box-shadow: ${ fillShadow };
}
.vj-track-progress-hover {
  background: rgba(255, 255, 255, 0.22);
}
.vj-track-time {
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.75;
}
`
