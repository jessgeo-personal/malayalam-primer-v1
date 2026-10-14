# Plan: UI-04 — Mobile Portrait Tracing Hierarchy & Intra-Lesson Scroll Guard

## 1. Problem Statement
- **Issue 1 (Intra-Lesson Scroll Lag / Disorientation)**: When a learner completes a challenge on mobile and taps "Done", the next lesson item renders while the viewport remains scrolled to the bottom. This leaves the learner confused and feeling "stuck" below the fold.
- **Issue 2 (Mobile Portrait Visual Hierarchy)**: In `TracingCanvas.jsx`, the "Clear" and "Done" action buttons are rendered at the bottom of the right control column. On mobile portrait viewports (`< md`), the columns stack vertically, pushing Clear and Done beneath phonetic sound details and example words. Learners have to scroll down past secondary reference material just to submit their tracing.

## 2. Solution Architecture

### 2.1 Intra-Lesson Scroll-to-Top Guard (`client/src/App.jsx`)
- Extend the `useEffect` scroll guard in `App.jsx` to include `currentIndex` alongside `[activeView, activeLesson, currentAct]`.
- Execute instant multi-target scroll reset:
  - `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`
  - `document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' })`
  - `document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' })`
  - `mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' })` / `mainEl.scrollTop = 0`
- Also invoke this scroll reset inside `handleDone` in `TracingCanvas.jsx` right before calling `onComplete(true, 5000)`.

### 2.2 Portrait Viewport Re-ordering (`client/src/components/games/TracingCanvas.jsx`)
Refactor `TracingCanvas.jsx` using responsive Tailwind flex order:
- **Row 1 (Top Navigation / Header - Mobile `md:hidden`)**:
  - Dark pill control cluster (Home / Restart / Exit buttons).
- **Row 2 (Status HUD - Mobile `md:hidden`)**:
  - Left: Active Lesson bubble indicator (`Lesson: X` or `Practice: C{cycle}`).
  - Right: Learned letters progress strip (`masteredCharacters`).
- **Row 3 (Header & Drawing Pad Column)**:
  - Heading: "Trace the Letter" with English translation/subtitle.
  - Interactive Canvas Container: responsive width, height `h-[320px] sm:h-[400px]`, rounded corners, touch-none, calibrated headroom and optical centering.
- **Row 4 (Primary Action Buttons - Immediately Adjacent to Canvas)**:
  - Side-by-side "Clear" (secondary outline) and "Done →" (emerald tactile action button, disabled until drawing begins).
  - Placed in the drawing column immediately below the canvas container.
- **Row 5 (Secondary Reference Content - Below Fold on Mobile)**:
  - Phonetic breakdown, 🔊 speaker replay button, and example vocabulary words rendered below the action buttons on `< md`, and in the right-hand panel (`w-full md:w-80`) on `>= md`.
- **Desktop Parity (`>= md`)**:
  - Side-by-side flex layout (`md:flex-row`). Drawing column on the left, reference panel on the right.
  - Top header in `App.jsx` handles desktop navigation seamlessly.

## 3. Testing Strategy
- **Unit / Component Tests (`client/src/tests/TracingCanvas.test.jsx`)**:
  - Test that "Clear" and "Done" buttons render immediately adjacent to the canvas container in the DOM hierarchy.
  - Test that the action buttons precede secondary reference content (phonetics/example words) in the DOM order.
  - Test that clicking "Done" calls the scroll reset functions and invokes `onComplete(true, 5000)`.
  - Ensure all 12 existing tests pass with updated structure.
- **Regression Suite**:
  - Run full client suite (`npm test` in `client`).
  - Run full server suite (`npm test` in `server`).
  - Verify 100% green pass with zero regressions.

## 4. Documentation & Versioning
- Increment version to `2026.10.14.020` in `client/src/config/version.js`.
- Add `UI-04` to `docs/EXECUTION_TRACKER.md`.
- Update `.gemini/docs/regression_checklist.md`.
- Update `.gemini/log/CHANGELOG.md` under `[2026.10.14.020]`.
