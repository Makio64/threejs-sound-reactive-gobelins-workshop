import { defineConfig } from 'rolldown'

// Build of the erin_benjamin scene: the readable source lives here in
// sourcecode/, the experience only ever loads the minified bundles emitted
// at the scene root (main.js + dropWorker.js- the worker must stay its own
// file, dropTimeline spawns it by URL relative to the built main).
// three / tweakpane stay external: the scene's index.html import map serves
// them from the CDN, and /sounds/Analyzer.js belongs to the host.
// Run from the scene folder: `npm run build:erin_benjamin` (repo root).
export default defineConfig({
	input: {
		main: 'sourcecode/main.js',
		dropWorker: 'sourcecode/dropWorker.js',
	},
	external: [/^three($|\/)/, 'tweakpane', '/sounds/Analyzer.js'],
	output: {
		dir: '.',
		format: 'esm',
		minify: true,
		entryFileNames: '[name].js',
		chunkFileNames: '[name].js',
	},
})
