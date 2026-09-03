# Tracks

Drop `.mp3` files in this folder- they're auto-discovered and become the
playlist (auto-advance + loop, alphabetical order). No list to edit.

```
public/tracks/
  01-warmup.mp3
  02-peak.mp3
```

No mp3 here yet? The app falls back to a built-in sweeping **test tone** so you
still see the visuals react. Press `T` anytime to hear it, `,` to go back to mp3.

mp3s are git-ignored by default (they're big). To commit one with the repo:
`git add -f public/tracks/yourtrack.mp3`.
