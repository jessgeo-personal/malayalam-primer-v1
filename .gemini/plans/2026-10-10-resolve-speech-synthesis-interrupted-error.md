# Plan: Resolve SpeechSynthesis 'interrupted' Error in audioEngine.js

## 1. Problem Statement & Impact Analysis
- **Root Cause:**
  In Chromium (desktop and Android WebView/Chrome), synchronously invoking `window.speechSynthesis.cancel()` immediately before `window.speechSynthesis.speak(utterance)` triggers an IPC queue race where the newly queued utterance is canceled with `error: "interrupted"`, causing total audio silence.
- **Solution:**
  Implement an asynchronous cancel-safe queue:
  1. If `window.speechSynthesis.speaking` or `window.speechSynthesis.pending` is active, call `window.speechSynthesis.cancel()` and defer utterance dispatch by 50ms (`setTimeout`) to give Chromium's IPC queue time to clear.
  2. If the engine is idle (neither speaking nor pending), dispatch immediately without calling `cancel()`, avoiding any cancel penalty.
  3. If rapid taps occur, clear any pending dispatch timeout (`this.speechTimeout`).
  4. In `onerror`, gracefully suppress warnings for standard rapid-switching errors (`interrupted` and `canceled`).
- **SRS & Architectural Impact:**
  - Zero regression risk to SRS database scoring, buckets, or curriculum logic.
  - Fixes speech audio dropouts on Android tablets and Chrome browsers when learners tap speaker buttons.

## 2. Proposed Architecture & Changes

### A. Update `client/src/services/audioEngine.js` and `client/src/utils/audioEngine.js`
- **Constructor:**
  - Add `this.speechTimeout = null;`.
- **Method `speakText(text)`:**
  - Clear pending `this.speechTimeout`.
  - Encapsulate dispatch logic in `dispatchSpeech()`:
    - Check and resume `speechSynthesis.paused`.
    - Create utterance (with safe fallback for environments without `window.SpeechSynthesisUtterance`).
    - Configure `utterance.lang = 'ml-IN'`, `utterance.rate = 0.85`, and assign `mlVoice`.
    - Retain strong references on `this.activeUtterance` and `window.__currentSpeechUtterance` (V8 GC shield).
    - Handle `utterance.onend` and `utterance.onerror` (suppressing warning for `interrupted` and `canceled`).
    - Invoke `window.speechSynthesis.speak(utterance)`.
  - Condition:
    - If `window.speechSynthesis.speaking || window.speechSynthesis.pending`:
      - Call `window.speechSynthesis.cancel()`.
      - Set `this.speechTimeout = setTimeout(dispatchSpeech, 50)`.
    - Else:
      - Call `dispatchSpeech()`.
- **Maintain Full API Compatibility:**
  - Retain `this.isMuted`, `setMuted(muted)`, `playSound(filename)`, `speak(...)`, `playWord(...)`, `getAudioUrlForWord(...)`, `playWordSound(...)`, and `playPhoneticSound(...)`.
  - Ensure exact 1:1 code parity between `client/src/services/audioEngine.js` and `client/src/utils/audioEngine.js`.

### B. Update Unit Tests (`client/src/tests/audioEngine.test.js`)
- Test immediate dispatch without cancel penalty when `speechSynthesis` is idle.
- Test deferred 50ms dispatch and `cancel()` invocation when `speaking` or `pending` is true.
- Test debounce/cancellation of pending timeout on rapid successive `speakText` calls.
- Test error handler suppression of `interrupted` and `canceled` events.
- Test GC shield retention and cleanup on completion.

## 3. Testing Strategy (4-Pillar Evaluation Matrix)
- **1. Accuracy:** Utterance properties (`ml-IN`, rate `0.85`, correct Malayalam text extraction across all data shapes).
- **2. Visual Consistency:** Speaker button triggers produce reliable, non-failing audio playback.
- **3. Functional Adherence:** Cancel penalty bypassed when idle; 50ms buffer enforced when speaking; rapid consecutive clicks debounced cleanly.
- **4. Process Faultlines (Edge Cases):**
  - Paused audio queues correctly resumed.
  - Safe in SSR / headless environments where `window.speechSynthesis` or `SpeechSynthesisUtterance` is missing.
  - Error events `interrupted` and `canceled` handled cleanly without noisy console warnings.

## 4. Execution Steps
1. Create plan file in `.gemini/plans/2026-10-10-resolve-speech-synthesis-interrupted-error.md`.
2. Update `.gemini/log/CHANGELOG.md` with Planning phase entry.
3. Update `client/src/services/audioEngine.js`.
4. Update `client/src/utils/audioEngine.js`.
5. Update `client/src/tests/audioEngine.test.js` to test async cancel-safety and idle dispatch.
6. Run `npm test` in `client` and `server`.
7. Bump version in `client/src/config/version.js` to `2026.10.10.013`.
8. Update `.gemini/docs/regression_checklist.md` and `.gemini/log/CHANGELOG.md` with final verification status.
