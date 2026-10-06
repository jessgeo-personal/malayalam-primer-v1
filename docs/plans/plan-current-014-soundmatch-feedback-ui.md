# Plan: 014 - Sound Match Feedback UI Refactor & TDD

## Objective
Relocate the "Continue ➜" / "Retry ➜" action button in the `SoundMatcher.jsx` feedback box from the bottom to the top header (next to the "Correct!" / "Not Quite!" text). This eliminates the need for users to scroll down on smaller tablet screens to proceed to the next puzzle.

## 1. UI Refactor (`SoundMatcher.jsx`)
- **Current State:** The feedback box renders the Icon/Text at the top, the correct answer in the middle, and a full-width button at the bottom.
- **New Layout:**
    - Change the top container of the feedback box to a `flex justify-between items-start` (or `items-center`) layout.
    - Left side: Icon (✅/❌) and Result Text ("Correct!" / "Not Quite!").
    - Right side: A compact, pill-shaped action button ("CONTINUE ➜" or "RETRY ➜").
    - Remove the bottom full-width button.

## 2. TDD & Quality Guardrails (Zero-Regression)
### Unit Testing (Vitest)
- **`SoundMatcher.test.jsx` (New Test Suite)**: 
    - Render the `SoundMatcher` component with mock word data.
    - Simulate clicking the correct option.
    - Assert that the feedback state appears.
    - Assert that clicking the "CONTINUE ➜" button correctly triggers the `onComplete` callback with `(true, time)`.
    - Simulate clicking the wrong option, verify the "RETRY ➜" button triggers `onComplete(false, time)`.

### Documentation & Process
- **Changelog**: Add an entry for Version 2026.05.28.018 detailing the Sound Match UI refactor.
- **Regression Checklist**: Add "Phase 15: Sound Match Ergonomics" to `regression_checklist.md` and verify all items.
- **Full Test Pass**: Run `npm test` in `/client` to guarantee 100% green status for the new and existing tests.

## 3. Implementation Steps
1. **Write Failing Tests**: Implement `SoundMatcher.test.jsx` first to establish the expected behavioral contract.
2. **Refactor UI**: Update the JSX in `client/src/components/games/SoundMatcher.jsx` to move the button into the top flex container.
3. **Run Regression Suite**: Verify tests pass.
4. **Update Documentation**: Synchronize the Changelog, Version file, and Regression Checklist.

## Verification & Testing
- **Visual Audit**: Confirm the feedback box fits comfortably on the screen without scrolling and the button is easily accessible next to the status text.
- **Test Output**: Confirm `vitest` reports 100% passing for the new Sound Match suite.
