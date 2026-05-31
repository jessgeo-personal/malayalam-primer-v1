# Implementation Plan: Fix Missing Lesson Summary

## Objective
Fix a bug where the `ConceptScreen` does not display the vocabulary summary grid for Cycle 1 lessons because the `/api/session/lesson/preview` fetch call is missing the required `userId` parameter.

## Scope & Impact
*   **Frontend Component:** `ConceptScreen.jsx` will be updated to consume the `ProgressContext` to access the active `userId` and include it in the API request.
*   **Frontend Tests:** `ConceptScreen.test.jsx` will be updated to mock the `useProgress` hook.

## Implementation Steps (TDD Approach)

### Phase 1: Frontend Test Updates (Red Phase)
1.  **Update `ConceptScreen.test.jsx`:**
    *   Mock the `../../context` module to return a dummy `userId` (e.g., `'Learner 1'`) from `useProgress`.
    *   Ensure existing tests continue to pass and specifically verify the fetch URL includes `&userId=Learner 1`.

### Phase 2: Component Fix (Green Phase)
1.  **Modify `client/src/components/games/ConceptScreen.jsx`:**
    *   Import `useProgress` from `../../context`.
    *   Extract `userId` from `useProgress()`.
    *   Update the `fetch` call:
        ```javascript
        const response = await fetch(`/api/session/lesson/preview?lessonId=${word.lessonId}&userId=${userId}`);
        ```

### Phase 3: Verification
1.  **Test Suite Execution:** Run `npm test` in `/client` to verify the frontend changes.
2.  **Changelog:** Add an entry documenting the bug fix in `.gemini/log/CHANGELOG.md`.

## Verification & Testing Strategy
*   **Accuracy:** The correct fetch URL ensures the backend accurately queries the user's progress state and returns the expected lesson items without failing or skipping items due to missing context.
*   **Process Faultlines:** The `userId` must always be present in the `ProgressContext`, preventing any undefined variable errors during the fetch.