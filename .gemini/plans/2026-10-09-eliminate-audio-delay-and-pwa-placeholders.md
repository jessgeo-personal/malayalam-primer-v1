# Plan: Eliminate Audio Delay & Add PWA Icon Placeholders

## 1. Problem Statement & Impact Analysis
- **Problem 1 (Audio Latency):** Speaker clicks exhibit a 1-2 second delay because `audioEngine.js` attempts a network fetch for non-existent `/audio/words/*.mp3` files, waits for a 404 response from the server, and only then falls back to `speechSynthesis`.
- **Problem 2 (PWA Manifest 404):** The browser console logs a 404 error for `pwa-192x192.png` (and `pwa-512x512.png`) referenced by VitePWA's manifest in `client/vite.config.js`.
- **SRS & Architectural Impact:**
  - Zero regression risk to SRS scheduling algorithms or SuperMemo scoring.
  - High positive UX impact: Child tapping the speaker gets immediate, responsive auditory feedback without network latency. Eliminates console network errors.

## 2. Proposed Architecture & Changes

### A. Instant Speech Fallback (`client/src/services/audioEngine.js`)
- Add a configuration flag at the top:
  `export const HAS_STATIC_AUDIO_ASSETS = false;` (Easily toggled to `true` once Track C audio assets are placed in `public/audio/words/`).
- In `playWord(wordObjOrText, fallbackText)`:
  - If `!HAS_STATIC_AUDIO_ASSETS`, bypass `new Audio()` and network checks entirely, invoking `this.speakText(textToSpeak)` immediately.
  - If `HAS_STATIC_AUDIO_ASSETS`, retain static audio fetch with the existing fallback.
- Update `client/src/utils/audioEngine.js` to re-export `HAS_STATIC_AUDIO_ASSETS`.

### B. Valid PWA Icon Placeholders (`client/public/`)
- Generate valid PNG files in `client/public/` using Node.js built-in `zlib` (no external dependencies):
  - `client/public/pwa-192x192.png` (192x192 PNG placeholder matching app theme #863BFF)
  - `client/public/pwa-512x512.png` (512x512 PNG placeholder matching app theme #863BFF)
- Optionally add SVG icon declaration in `client/vite.config.js` manifest:
  - `{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }`

## 3. Testing Strategy (Zero-Regression Mandate)
- **Unit Testing:**
  - Update `client/src/tests/audioEngine.test.js` to verify:
    1. When `HAS_STATIC_AUDIO_ASSETS` is false, `playWord` does not instantiate `Audio` and directly calls `speakText`.
    2. When `HAS_STATIC_AUDIO_ASSETS` is true, static audio attempt and fallback work as expected.
  - Run all 15 Vitest suites in `client` to verify 100% green tests.
  - Run all 11 Jest suites in `server` to verify 100% green tests.
- **PWA Integrity Check:**
  - Verify `pwa-192x192.png` and `pwa-512x512.png` exist and are valid PNG headers (magic bytes `89 50 4E 47`).
  - Run `npm run build` in `client` to verify Vite and VitePWA build cleanly without manifest errors.

## 4. Execution Steps
1. Write failing/updated tests in `client/src/tests/audioEngine.test.js`.
2. Update `client/src/services/audioEngine.js` with `HAS_STATIC_AUDIO_ASSETS` toggle.
3. Update `client/src/utils/audioEngine.js`.
4. Generate `pwa-192x192.png` and `pwa-512x512.png` in `client/public/`.
5. Update `client/vite.config.js` if needed.
6. Run client and server test suites.
7. Increment `client/src/config/version.js` to `2026.10.09.011`.
8. Update `.gemini/log/CHANGELOG.md` and `.gemini/docs/regression_checklist.md`.
