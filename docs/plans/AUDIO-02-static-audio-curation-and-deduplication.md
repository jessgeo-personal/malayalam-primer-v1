# AUDIO-02: Static Audio Asset Pipeline, TTS Curation Studio, & Engine Deduplication

## 1. Objective & Scope
1. **Engine Deduplication:** Remove redundant `client/src/utils/audioEngine.js` and standardize all components and tests on `client/src/services/audioEngine.js`.
2. **HTML5 Audio Player Refactor:** Refactor `client/src/services/audioEngine.js` to rely strictly on promise-based HTML5 `Audio()` playback of pre-generated static audio files (`/audio/words/{id}.mp3` and `/audio/letters/{safeId}.mp3`), eliminating Web Speech API fragility, GC drops, and queue locks.
3. **Static Generation Script:** Implement `server/scripts/generate-audio.js` to batch-generate static MP3s for all words and characters across `seed-100.json`, `seed-200.json`, and `seed-300.json` into `client/public/audio/words/` and `client/public/audio/letters/` using Google Translate TTS endpoint (`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ml&client=tw-ob`).
4. **Backend Audio Curation Service & Routes:** Implement `server/services/audioService.js` and `server/routes/audio.js`:
   - `GET /api/audio/preview?text=...&tl=ml`: Stream MP3 buffer on-the-fly for auditioning.
   - `POST /api/audio/commit`: Accept `{ id, type, text, phonetic }`, generate MP3, save to `client/public/audio/{words|letters}/{id}.mp3`, update MongoDB word entry if modified, and return `{ success: true, url }`.
5. **WordAudit Studio Enhancement:** In `client/src/components/ui/WordAudit.jsx`, add a functional 🔊 button and a "Tweak Sound" curation drawer/modal to preview and commit pronunciation overrides.
6. **Zero Regressions:** Maintain 100% green pass on all client (Vitest) and server (Jest) test suites.

## 2. Testing Strategy (The 4 Pillars)
* **Accuracy:**
  - TTS endpoint fetcher returns an ArrayBuffer/Buffer and handles errors cleanly.
  - Preview route sets `Content-Type: audio/mpeg` and streams the buffer.
  - Commit route saves the file to the exact public directory path (`words/` or `letters/`), sanitizing filenames.
  - When updating a word, MongoDB `Word` document is updated with modified `phonetic` / `malayalamText`.
* **Visual Consistency:**
  - WordAudit tuning modal/drawer follows Neo-Bento styling, with clear high-contrast action pills, touch-friendly tap targets, and smooth state transitions.
* **Functional Adherence:**
  - `audioEngine.playWord(id)` attempts `/audio/words/${id}.mp3` and returns a promise resolving on `onended` or resolving cleanly on `onerror`.
  - `audioEngine.playLetter(char)` attempts `/audio/letters/${encodeURIComponent(char)}.mp3`.
  - All existing game components (`LetterPicker`, `SoundMatcher`, `TracingCanvas`, etc.) invoke audio without errors.
* **Process Faultlines (Edge Cases):**
  - Network failure or rate limiting on TTS fetch falls back gracefully without unhandled rejections.
  - Missing parameters in preview or commit routes return HTTP 400 with descriptive errors.
  - Unplayable audio or 404 in `AudioEngine` logs a warning and resolves `false` without crashing.

## 3. Implementation Steps
1. **Phase 1: Planning & Deduplication Cleanup**
   - Write plan markdown to `docs/plans/` and `.gemini/plans/`.
   - Update `CHANGELOG.md`.
   - Ensure directories `client/public/audio/words/` and `client/public/audio/letters/` exist with `.gitkeep`.
   - Delete `client/src/utils/audioEngine.js`.
   - Update all imports in `client/src/components/` and `client/src/tests/` to point to `services/audioEngine`.
2. **Phase 2: Audio Engine Standardization**
   - Refactor `client/src/services/audioEngine.js` using the promise-based HTML5 `Audio()` implementation with backward-compatible method aliases (`speak`, `playSound`, `setMuted`).
   - Rewrite `client/src/tests/audioEngine.test.js` to assert `playWord`, `playLetter`, `playUrl`, `stop`, and resolving cleanly on `onended`/`onerror`.
3. **Phase 3: Backend Audio Curation Service & Routes**
   - Create `server/services/audioService.js` with `fetchTTSBuffer` and `saveAudioFile`.
   - Create `server/routes/audio.js` with `GET /preview` and `POST /commit`.
   - Mount route in `server/server.js`.
   - Write test suite `server/tests/audio.test.js`.
4. **Phase 4: Batch Seed Audio Generator Script**
   - Create `server/scripts/generate-audio.js`.
   - Add `"audio:generate": "node scripts/generate-audio.js"` to `server/package.json`.
5. **Phase 5: WordAudit Tuning Studio**
   - Add 🔊 Play button and "Tweak Sound" modal in `client/src/components/ui/WordAudit.jsx`.
   - Update `client/src/tests/WordAudit.test.jsx`.
6. **Phase 6: Verification & Execution Tracker**
   - Run `npm test` in `client` and `server`.
   - Update `docs/EXECUTION_TRACKER.md`, `.gemini/log/CHANGELOG.md`, `.gemini/docs/regression_checklist.md`, and bump `client/src/config/version.js`.
