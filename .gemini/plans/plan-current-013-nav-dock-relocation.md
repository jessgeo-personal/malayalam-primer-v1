# Plan: 013 - Navigation Dock Relocation & TDD Verification

## Objective
Move the global bottom navigation dock (Home, Restart, Status) into the top header of the active lesson card (the white square) to prevent it from obstructing the tracing canvas on smaller tablet screens. This change should only apply when the user is actively playing a lesson.

## 1. UI Refactor (`App.jsx`)
- **Conditional Global Dock:** The current `nav` element fixed at the bottom of the screen will be updated to only render when the user is on the Adventure Map (`sessionMode === 'map'`). It will be hidden during active lessons and completion screens.
- **Game Card Header Update:**
    - We will place the contents of the dark bubble (Restart 🔄, Status: ACTIVE) right next to the existing `EXIT` button in the top-left corner of the white game card.
- **Redundancy Consolidation:** Since both the `EXIT` button and the `Home 🏠` button return the user to the map, we will consolidate them into a clean grouping alongside the Restart button to avoid clutter.

## 2. TDD & Quality Guardrails (Zero-Regression)
### Unit Testing (Vitest)
- **`App.test.jsx` (New or Updated)**: 
    - Verify that when `sessionMode` is 'map', the global bottom navigation dock is rendered.
    - Verify that when `sessionMode` is 'lesson', the global bottom navigation dock is NOT rendered.
    - Verify that the local Restart button inside the game card correctly triggers the restart logic (via mocking).

### Documentation & Process
- **Changelog**: Add an entry for Version 2026.05.28.017 detailing the Nav Dock relocation.
- **Regression Checklist**: Add "Phase 14: Nav Dock Relocation" to `regression_checklist.md` and verify all items.
- **Full Test Pass**: Run `npm test` in `/client` and `/server` to guarantee 100% green status.

## 3. Implementation Steps
1. **Write Failing Tests**: Implement the conditional rendering tests in Vitest.
2. **Refactor `App.jsx`**: Apply the conditional logic to the bottom `<nav>` and inject the consolidated controls into the game card header.
3. **Run Regression Suite**: Ensure frontend tests pass and no backend dependencies are broken.
4. **Update Documentation**: Synchronize the Changelog, Version file, and Regression Checklist.

## Verification & Testing
- **Visual Audit**: Confirm the tracing canvas is completely unobstructed during a lesson.
- **Functionality**: Verify the consolidated Exit/Home and Restart buttons work flawlessly.
