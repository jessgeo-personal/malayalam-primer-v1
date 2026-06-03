# Implementation Plan: Fix Lesson 15 Blank Page (Import Error)

## 🎯 Objective
Fix the React crash (blank page) occurring in Lesson 15. The issue was traced to a missing import in `App.jsx`. When the `TimeMachine` component was promoted from a prototype wrapper to a production component, its import was accidentally removed during cleanup.

## 📂 Key Files & Context
*   **Component:** `client/src/App.jsx`

## 🛠️ Implementation Steps

### Phase 1: Fix `App.jsx` Import
1.  **Locate Import:** Find the line importing the mini-games from `./components/games`.
2.  **Add TimeMachine:** 
    *   *Current:* `import { LetterPicker, TracingCanvas, SoundMatcher, SuffixSnapper, ConceptScreen } from './components/games';`
    *   *New:* `import { LetterPicker, TracingCanvas, SoundMatcher, SuffixSnapper, ConceptScreen, TimeMachine } from './components/games';`

### Phase 2: Verification
*   Run `npm run build` to ensure no other references are missing.
*   Run the test suite.

## 🧪 Verification Strategy
*   The user will test Lesson 15 again.
*   Upon completing the `c015` concept screen, the `TimeMachine` game will successfully mount and render instead of throwing a ReferenceError and causing a blank page.