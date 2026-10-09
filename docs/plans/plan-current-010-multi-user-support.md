# Plan: 010 - Multi-User Support & Progress Isolation

## Objective
Implement multi-user support allowing up to 3 separate learners to track their progress independently. Switch between users via a dropdown in the Home dashboard.

## 1. Context Refactor (`ProgressContext.jsx`)
- **Dynamic User ID:** Replace the hardcoded `default_user` with a `userId` state variable initialized from `localStorage` (defaulting to "Learner 1").
- **`switchUser` Function:** Implement logic that updates the `userId`, resets the current session state, and re-fetches all stats.

## 2. UI Update (`App.jsx`)
- **User Dropdown:** Add a styled dropdown in the top-right corner of the Home screen.
- **User Slots:** Initialize with "Learner 1", "Learner 2", and "Learner 3".

## 3. TDD & Quality Guardrails (Zero-Regression)
### Unit Testing (Vitest)
- **`ProgressContext.test.jsx`**: 
    - Verify `switchUser` correctly updates the `userId` state.
    - Verify `switchUser` clears `sessionItems` and resets `sessionMode` to 'map'.
    - Verify `localStorage` is updated with the new `userId`.

### Integration Testing (Supertest)
- **`multiuser.test.js`**:
    - Scenario: User A traces a letter. User B logs in. Verify User B has 0 mastered letters.
    - Scenario: User A score is 10. User B score is 0. Verify persistence after switching back.

### Documentation & Process
- **Changelog**: Add entry for Version 2026.05.28.015.
- **Regression Checklist**: Add "Phase 12: Multi-User Isolation" and verify all items.

## 4. Implementation Steps
1. **Write Failing Tests**: Create unit/integration tests for user switching and data isolation.
2. **Refactor Context**: Implement `userId` state and persistence logic.
3. **Update UI**: Add the dropdown to the Hero header in `App.jsx`.
4. **Fix Previews**: Ensure `AdventureMap.jsx` uses the context `userId` for lesson previews.
5. **Final Audit**: Run all tests to ensure 100% green status.

## Verification & Testing
- **Visual Audit**: Confirm dropdown renders and functions correctly on tablet resolution.
- **Data Audit**: Verify no progress "leaks" between users in MongoDB.
