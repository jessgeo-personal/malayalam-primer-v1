# Plan: Fix ReferenceError in App.jsx

## Diagnosis
Even without seeing the exact console error, I audited the recent changes and identified a critical bug introduced in the previous "Component State Refresh" fix. 

To prevent state bleeding between identical mini-games, I added a `key={`game-${currentIndex}`}` to the dynamic component renderer in `client/src/App.jsx`. However, `currentIndex` was never destructured from the `useProgress()` hook in that file. This results in a fatal `ReferenceError: currentIndex is not defined` whenever the app attempts to render a game component, crashing the client entirely.

## Implementation Steps
1.  **Update `client/src/App.jsx`:**
    *   Add `currentIndex` to the destructuring assignment of the `useProgress()` hook at the top of the `App` component.

## Validation
*   The application should immediately compile and render without crashing, allowing you to successfully interact with the new Lesson 1.

---
**[APPROVAL REQUIRED]: Please approve this plan so I can quickly patch this critical import error and restore the frontend.**