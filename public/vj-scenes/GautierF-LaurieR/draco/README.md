# Draco (décodeur GLTF)

Fichier unique pour `DRACOLoader` de cette scène :

- `draco_decoder.js` — build **glTF** (extension KHR_draco_mesh_compression), chargé en mode JS via `Resources.js`.

Pas d’encodeur ni de WASM ici : seul le décodage des `.glb` compressés est nécessaire.

Pour passer en WASM plus tard, ajouter `draco_wasm_wrapper.js` + `draco_decoder.wasm` (variante glTF) depuis `three/examples/jsm/libs/draco/gltf/` et retirer `setDecoderConfig({ type: 'js' })`.
