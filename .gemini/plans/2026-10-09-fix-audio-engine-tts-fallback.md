# Plan: Fix audioEngine.js Async Voice Loading & SpeechSynthesis Fallback

## 1. Problem Statement & Impact Analysis
- **Symptom:** In-app speaker buttons produce no sound in browser environments. Direct browser `speechSynthesis` with `ml-IN` works, but `audioEngine.js` fails silently.
- **Root Causes:**
  1. Static audio files (`/audio/words/${wordId}.mp3`) return 404 and the audio playback error handler does not cleanly transition to SpeechSynthesis.
  2. `speechSynthesis.getVoices()` is called synchronously on startup before the browser finishes asynchronous voice population and fires `voiceschanged`.
  3. UI speaker buttons pass either word objects or raw text strings; `audioEngine` must handle both gracefully without unhandled promise rejections or undefined variables.
- **SRS & Architectural Impact:**
  - Zero regression risk to SRS algorithm scoring or cycle advancement.
  - High positive impact on child pedagogy: Audio feedback is critical for phoneme-to-grapheme association in Malayalam.

## 2. Proposed Architecture & Changes

### A. Core Audio Engine (`client/src/services/audioEngine.js` & `client/src/utils/audioEngine.js`)
- Refactor `AudioEngine` class:
  - `initVoices()`: Initialize voices asynchronously; attach listener for `voiceschanged` event on `window.speechSynthesis`.
  - `getMalayalamVoice()`: Locate `ml-IN` or `ml*` voice, dynamically refreshing voice list if initially empty.
  - `speakText(text)`: Clear hung queue with `speechSynthesis.cancel()`, configure `SpeechSynthesisUtterance` with `ml-IN`, rate `0.85`, attach Malayalam voice if present, handle errors gracefully.
  - `playWord(wordObjOrText, fallbackText)`:
    - Extract text from string or object (`malayalamText` / `word` / fallback).
    - If `wordId` exists, attempt static playback with clean Promise error trapping.
    - If static audio 404s/fails, seamlessly fall back to `speakText(textToSpeak)`.
  - Maintain compatibility methods:
    - `speak(wordObjOrText)` delegating to `playWord`.
    - `playWordSound(wordItem)` and `getAudioUrlForWord(wordItem)` for existing tests.
- Verify `client/src/utils/audioEngine.js` re-exports all members cleanly.

### B. Component Audits
- Audit speaker buttons in:
  - `ConceptScreen.jsx`: Ensure speaker calls `audioEngine.playWord(item)` or `audioEngine.speak(item.malayalamText)`.
  - `LetterPicker.jsx`: Word speaker button and letter tile handlers pass valid strings.
  - `TracingCanvas.jsx`: Letter and example word speaker buttons pass valid strings.
  - `SoundMatcher.jsx`: Speaker button calls `audioEngine.playWord(word)`.
  - `AdventureMap.jsx`: Ensure preview vocabulary list has audible speaker buttons calling `audioEngine.playWord(item)`.

## 3. Testing Strategy (Zero-Regression Mandate)
- **Accuracy & Fallbacks:**
  - Test static audio asset resolution (`/audio/words/w001.mp3`).
  - Test clean SpeechSynthesis fallback when audio fails or is missing.
  - Test voice loading on `voiceschanged` event.
  - Test `playWord` with string input and object input.
- **Visual & Functional Consistency:**
  - All existing UI tests mocking `audioEngine.speak` or rendering components must remain green.
- **Suite Execution:**
  - Run all 15 client Vitest suites (59+ tests).
  - Run all 11 server Jest suites (73 tests).

## 4. Execution Steps
1. Write failing/expanded unit tests in `client/src/tests/audioEngine.test.js`.
2. Update `client/src/services/audioEngine.js` and verify `client/src/utils/audioEngine.js`.
3. Audit and update component speaker handlers in `AdventureMap.jsx`, `ConceptScreen.jsx`, `LetterPicker.jsx`, `TracingCanvas.jsx`, and `SoundMatcher.jsx`.
4. Run client and server test suites.
5. Increment version in `client/src/config/version.js` to `2026.10.09.010`.
6. Update `.gemini/log/CHANGELOG.md` and `.gemini/docs/regression_checklist.md`.
