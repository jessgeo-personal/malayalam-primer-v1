# Plan AUDIO-01: Bounded Audio Pipeline & Fallback Engine

## 📌 Context & Objectives
In Track C of Project Malayalam Prime, Task **AUDIO-01** introduces the bounded audio asset pipeline for the 300+ core vocabulary words.
Currently, the client uses speech synthesis in `client/src/utils/audioEngine.js` for sound playback, which can be inconsistent, unsupported, or crash on certain mobile/headless environments without clean fallbacks.

The goal of AUDIO-01 is to establish a robust audio playback service (`client/src/services/audioEngine.js` or re-exported from `client/src/utils/audioEngine.js` for backwards compatibility) that:
1. Resolves and prioritizes pre-generated static audio assets: `/audio/words/${wordId}.mp3`.
2. Gracefully falls back to `window.speechSynthesis` if static audio is missing or fails to play.
3. Operates safely in headless or restricted browser environments without unhandled rejections or crashes.

---

## 🎯 Pedagogical & Technical Constraints
1. **Zero-Crash Audio Playback**: Headless test runners (Vitest / JSDOM) and mobile browsers without audio drivers or TTS voices must not crash.
2. **Deterministic Path Resolution**:
   - For any word item `{ wordId: 'w001', malayalamText: 'ഞാൻ' }`, `getAudioUrlForWord(word)` must return `/audio/words/w001.mp3`.
   - Missing or non-word objects should handle gracefully.
3. **Fallback Priority**:
   - Primary: HTML5 `Audio` playback of `/audio/words/${wordId}.mp3`.
   - Secondary / Fallback: `window.speechSynthesis.speak()`.
   - Safe no-op if both are unavailable or throw.
4. **No Cloud Bills / 100% Local**: No external CDN or cloud TTS APIs.

---

## 🧪 Testing Strategy (BDD / Red-Green-Refactor)

### 1. Red Phase (Current Task)
- Create `client/src/tests/audioEngine.test.js` specifying the contract:
  - Exports `playWordSound` and `getAudioUrlForWord`.
  - `getAudioUrlForWord(word)` resolves `/audio/words/${word.wordId}.mp3`.
  - `playWordSound(word)` falls back cleanly to speech synthesis if static audio is unavailable or errors out.
- Run `npx vitest run src/tests/audioEngine.test.js` in `client/` to verify RED failure (missing module `client/src/services/audioEngine.js` or missing functions).
- Halt and present failing test trace.

### 2. Green Phase (Next Task)
- Implement `client/src/services/audioEngine.js` with:
  - `getAudioUrlForWord(word)`
  - `playWordSound(word)`
  - `audioEngine` class instance with full backward compatibility.
  - Bridge `client/src/utils/audioEngine.js` to ensure zero regressions across existing components (`ConceptScreen`, `LetterPicker`, `SoundMatcher`, `SuffixSnapper`, `TimeMachine`, `TracingCanvas`).
- Run Vitest to verify all tests turn green.

### 3. Verification & Zero-Regression Phase
- Run full client and server test suites.
- Update `docs/EXECUTION_TRACKER.md` and `.gemini/log/CHANGELOG.md`.
