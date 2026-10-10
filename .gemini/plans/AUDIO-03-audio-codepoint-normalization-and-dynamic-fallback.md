# AUDIO-03: Audio Codepoint Normalization, Resilient Dynamic Fallback, & Batch Asset Generation

## 1. Objective & Scope
1. **ASCII Codepoint Normalization:** Eliminate browser/filesystem URI encoding mismatches (such as `%E0%B4%A4.mp3` vs `ത.mp3` causing `NotSupportedError`) by standardizing letter audio asset filenames on hex Unicode code points via `getLetterAudioFilename(char)` (e.g. `letter_0d24.mp3`).
2. **Resilient Dynamic Fallback:** Enhance `client/src/services/audioEngine.js` so that if static audio playback fails (404, network drop, unplayable file), it automatically falls back on-the-fly to `/api/audio/preview?text=...&tl=ml`, while suppressing loud `NotSupportedError` console aborts.
3. **Backend Preview Lazy-Caching:** Update `server/routes/audio.js` `GET /api/audio/preview` to optionally write fetched MP3 buffers to disk under `client/public/audio/` so that dynamic fallbacks automatically populate missing static assets for subsequent requests.
4. **Batch Asset Generation Execution:** Refactor `server/scripts/generate-audio.js` with the codepoint normalization naming and execute it to generate all static MP3s across `seed-100.json`, `seed-200.json`, and `seed-300.json` into `client/public/audio/words/` and `client/public/audio/letters/`.
5. **Component Call Site Polish:** Audit and update game components (`ConceptScreen.jsx`, `LetterPicker.jsx`, `WordAudit.jsx`, etc.) to pass fallback Malayalam text to `audioEngine.playWord` and use `audioEngine.playLetter`.
6. **Zero Regressions:** Maintain 100% green test suites on both client (Vitest) and server (Jest).

## 2. Testing Strategy (The 4 Pillars)
* **Accuracy:**
  - `getLetterAudioFilename('ത')` returns `letter_0d24.mp3`.
  - Conjunct characters (e.g. `മ്മ`) map to `letter_0d2e_0d4d_0d2e.mp3`.
  - Empty or missing characters return `unknown.mp3`.
* **Visual Consistency:**
  - Game components continue to render large tap targets with instant visual and audio feedback on tablet screens without UI stutter or error dialogs.
* **Functional Adherence:**
  - `playLetter(char)` attempts `/audio/letters/${getLetterAudioFilename(char)}`, and on failure calls `/api/audio/preview?text=${encodeURIComponent(char)}&tl=ml`.
  - `playWord(wordId, fallbackText)` attempts `/audio/words/${wordId}.mp3`, and on failure with `fallbackText` calls `/api/audio/preview?text=${encodeURIComponent(fallbackText)}&tl=ml`.
  - `playUrl` cleans up references and silences unhandled `NotSupportedError`.
* **Process Faultlines (Edge Cases):**
  - Offline or missing static file recovers seamlessly through TTS preview.
  - Rate limiting on TTS preview handled without unhandled promise rejections.

## 3. Implementation Steps
1. Add `getLetterAudioFilename` utility to `client/src/services/audioEngine.js`, `server/services/audioService.js`, and `server/scripts/generate-audio.js`.
2. Refactor `client/src/services/audioEngine.js` with dynamic fallback and `NotSupportedError` shielding.
3. Update `server/routes/audio.js` with optional lazy-caching.
4. Update `server/scripts/generate-audio.js` to use `getLetterAudioFilename` and run `npm run audio:generate`.
5. Update component call sites (`ConceptScreen.jsx`, `LetterPicker.jsx`, `WordAudit.jsx`).
6. Update test suites and verify 100% green pass.
7. Update `docs/EXECUTION_TRACKER.md` and `.gemini/log/CHANGELOG.md`.
