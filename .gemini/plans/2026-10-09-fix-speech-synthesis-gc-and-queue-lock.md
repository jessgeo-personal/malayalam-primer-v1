# Plan: Fix SpeechSynthesis Audio Engine Silence (Garbage Collection & Queue Lock)

## 1. Problem Statement & Impact Analysis
- **Root Causes:**
  1. **V8 Garbage Collection:** In Chromium browsers, `SpeechSynthesisUtterance` created in a local function scope is reclaimed by the V8 garbage collector before the online voice engine streams/synthesizes speech, aborting playback with zero sound.
  2. **Queue Lock / Paused State:** `window.speechSynthesis` can enter a stuck `paused` or `busy` state. It needs unsticking via `cancel()` followed by resuming if `paused`.
  3. **Data Shape Variations:** UI components pass various object shapes (`character`, `letter`, `char`, `text`, `word`, `malayalamText`). `playWord` previously only inspected `malayalamText` and `word`, causing other properties to resolve to `undefined`.
- **SRS & Architectural Impact:**
  - Zero regression risk to SRS database scoring or curriculum.
  - High positive impact on child pronunciation learning by eliminating silent audio failures across Android tablet Chrome browsers.

## 2. Proposed Architecture & Changes

### A. Update `client/src/services/audioEngine.js` & `client/src/utils/audioEngine.js`
- **Instance GC Shield:**
  - Initialize `this.activeUtterance = null;` in `AudioEngine.constructor()`.
  - When creating `utterance`:
    - Assign `this.activeUtterance = utterance;`
    - Assign `window.__currentSpeechUtterance = utterance;`
  - In `utterance.onend` and `utterance.onerror`:
    - Reset `this.activeUtterance = null;`
    - Reset `window.__currentSpeechUtterance = null;`
- **Queue Unsticking:**
  - In `speakText(text)`:
    ```javascript
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    ```
- **Robust Multi-Shape Property Extraction:**
  - In `playWord`:
    ```javascript
    let textToSpeak = '';
    if (typeof wordObjOrText === 'string') {
      textToSpeak = wordObjOrText;
    } else if (wordObjOrText && typeof wordObjOrText === 'object') {
      textToSpeak =
        wordObjOrText.malayalamText ||
        wordObjOrText.character ||
        wordObjOrText.letter ||
        wordObjOrText.char ||
        wordObjOrText.word ||
        wordObjOrText.text ||
        fallbackText;
    } else {
      textToSpeak = fallbackText;
    }
    ```
- **File Parity:**
  - Ensure both `client/src/services/audioEngine.js` and `client/src/utils/audioEngine.js` are identical and robust, with named exports (`AudioEngine`, `audioEngine`, `HAS_STATIC_AUDIO_ASSETS`, `getAudioUrlForWord`, `playWordSound`, `playPhoneticSound`, and default export).

## 3. Testing Strategy (Zero-Regression Mandate)
- **Unit Testing (`client/src/tests/audioEngine.test.js`):**
  - Verify queue unsticking calls `cancel()` and `resume()` when paused.
  - Verify strong GC reference on `engine.activeUtterance` and `window.__currentSpeechUtterance`.
  - Verify `onend` and `onerror` clear both references.
  - Verify multi-property extraction for `{ character: 'അ' }`, `{ letter: 'ന' }`, `{ char: 'ക' }`, `{ text: 'മാൻ' }`, `{ word: 'ആന' }`, and `{ malayalamText: 'ഞാൻ' }`.
- **Full Suite Integrity:**
  - Run all 15 Vitest suites in `client` (64+ tests).
  - Run all 11 Jest suites in `server` (73 tests).

## 4. Execution Steps
1. Expand unit tests in `client/src/tests/audioEngine.test.js`.
2. Update `client/src/services/audioEngine.js`.
3. Update `client/src/utils/audioEngine.js`.
4. Run client tests and server tests.
5. Increment version in `client/src/config/version.js` to `2026.10.09.012`.
6. Update `.gemini/log/CHANGELOG.md` and `.gemini/docs/regression_checklist.md`.
