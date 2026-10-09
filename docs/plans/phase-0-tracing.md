# Plan: Phase 0 - The Alphabet Foundation (Tracing & Phonetics)

## Objective
Before diving into word building, the child must learn the shape and sound of individual Malayalam graphemes. This phase introduces an HTML5 Tracing Canvas and a Phonetic audio integration so the child can trace and hear individual letters, vowel modifiers, and chillu characters.

## Scope & Context
- `development_roadmap.md`: Needs updating to formally insert Phase 0.
- `client/src/components/games/TracingCanvas.jsx`: A new mini-game component.
- `client/src/App.jsx`: Needs routing or state management to determine when to show the `TracingCanvas` vs. the `LetterPicker`.
- `client/src/utils/audio.js`: A new utility to handle Web Audio API / HTML5 Audio playback for phonetic sounds.

## Implementation Steps
1. **Roadmap Update:** Formally insert Phase 0 into `.gemini/docs/development_roadmap.md`.
2. **Audio Setup:** Create an audio utility (`client/src/utils/audioEngine.js`) that uses basic SpeechSynthesis (browser TTS) as a placeholder for Malayalam phonetics, or sets up the scaffolding to play `.mp3` files (which can be added later).
3. **Tracing Component (`TracingCanvas.jsx`):**
   - Create an HTML5 Canvas component that scales to tablet dimensions.
   - Draw a large "ghosted" grapheme (e.g., 'അ') in the center of the canvas.
   - Implement `onTouchStart`, `onTouchMove`, and `onTouchEnd` event listeners to allow the child to draw over the canvas.
   - Implement a basic bounding-box or pixel-overlap check to determine if the user "traced" enough of the letter.
4. **App Routing:** Update `App.jsx` and `ProgressContext` to support a "Lesson Type". If a word has `lessonType: "trace"`, load `TracingCanvas`. If `lessonType: "build"`, load `LetterPicker`.
5. **Database Updates:** Update the seed data to include an initial set of tracing challenges for basic vowels and chillus.

## Verification & Testing
- Write Vitest tests for the `TracingCanvas` rendering and the `audioEngine` utilities.
- Manually test the tracing interaction in Chrome Device Toolbar (set to Tablet/Touch mode) to ensure the touch lines render smoothly without lagging.
- Verify the roadmap, changelog, and regression checklist are updated upon completion.