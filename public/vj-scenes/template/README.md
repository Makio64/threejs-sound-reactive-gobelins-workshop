# Standalone VJ Scene Template

This template helps you build a self-contained sound-reactive scene that integrates seamlessly into the main VJ host.

## Getting Started: Test in your own directory

You can build and test your scene inside an entirely separate project directory. To set this up:

1. **Create your project folder** and copy this template's files (`index.html` and `main.js`) into it.
2. **Copy the audio tools** from the main workshop repository to your project:
   - Copy the **entire** `src/sounds/` folder (`Analyzer.js`, `SoundPlayer.js`, `PlayerControl.js`, `AnalyzerDebug.js`, and `ui/`) to your project root as `sounds/` (so it's accessible at `/sounds/`). The analyzer lazy-loads the player/control, so all of them must travel together.
   - Copy `public/tracks/` (the `.mp3` files and the generated `tracks.json` inside it) to your project root as `tracks/` (so they are accessible at `/tracks/`, and `tracks.json` at `/tracks/tracks.json`).
3. **Run a local development server** in your project folder:
   - If using VS Code, you can use the **Live Server** extension.
   - Or, run in your terminal:
     ```bash
     npx serve
     ```
4. **Open the local server URL** (e.g. `http://localhost:3000`) in your browser.
5. **Click or press any key** on the page to unlock the browser's audio context. The analyzer will automatically fetch `tracks.json` and start playing the show's tracks!

## Keyboard Shortcuts in Standalone
Use these keys while testing standalone to adjust the audio state:
* `M`- Toggle between microphone and MP3 track playback.
* `,` / `.`- Previous / Next audio track.
* `D`- Toggle the sound debug visualizer panel.

## Integration: Adding your scene back to the loop
Once your scene is finished, add it as a local folder and open a pull request:
- Drop your scene's folder inside `public/vj-scenes/` in the main workshop repository. The dev server automatically detects it- no list to edit!
- Open a **pull request** with your folder against the workshop repo. Once merged, it joins the rotating VJ loop.
