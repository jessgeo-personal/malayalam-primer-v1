# Plan: UI Charter Adherence & Contrast Fix

## Objective
To resolve the reported UI issues by strictly adhering to the `UI_CHARTER.md`, fixing color contrast problems in game components, and ensuring the application flow is intuitive.

## Scope & Analysis
1.  **Backend Disconnect**: This refers to the hardcoded "78%" and the non-functional cycle progression. My previous fix addressed this by making the backend calculate real-time stats and the frontend consume them. This part is **already complete** but I will re-verify it.
2.  **Color Contrast & Professionalism:** The charter specifies a "Neo-Bento Minimalism" with high contrast (`#111827` dark text on `#FFFDF6` canvas). My previous implementation had some low-contrast elements.
    *   **Tracing Canvas:** The `#F8FAFC` ghost letter on a `bg-white` canvas is nearly invisible.
    *   **Letter Picker:** The Periwinkle (`#8F94FB`) tiles might have insufficient contrast for the white text inside them.
3.  **Functionality Breakage**: The "Daily Sync" button being non-responsive is a critical flow issue that needs to be fixed.

## Fix Implementation Plan

### Phase 1: High-Contrast Component Refactoring
- **`TracingCanvas.jsx`:**
    - The main canvas hub will now use a high-contrast background: `bg-prime-warm-base` (`#FFF5E9`).
    - The ghost letter fill style will be changed to a much more visible light gray: `context.fillStyle = '#e2e8f0';` (slate-200). This ensures the letter shape is clear without being distracting.
- **`LetterPicker.jsx`:**
    - **Draggable Tiles:** I will change the tile background from `bg-prime-periwinkle` to `bg-prime-action-dark` (`#1A1E26`). This provides maximum contrast for the white text, as mandated by the charter for primary action elements.
    - **Drop Zones:** Enhance the `isOver` state. Instead of just changing the border, I will apply a subtle, glowing background (`bg-prime-coral-pink/10`) to make the active drop target much more obvious.

### Phase 2: Application Flow & Functionality
- **"Daily Sync" Button (`AdventureMap.jsx`):**
    - The `onClick` handler will now be disabled if `needsRevision` is `false`. The button will still be visible but will have `cursor-not-allowed` and a muted appearance to clearly signal that the task is complete for the day.
- **"Restart Session" Button (`App.jsx`):**
    - This button was correctly added to the HUD in the last turn, but I will ensure it is styled as a secondary, non-intrusive action (e.g., a simple icon) to avoid distracting from the main game loop, while remaining accessible.

### Phase 3: Verification
- **Manual Testing:**
    1.  **Tracing:** Verify the ghost letter is clearly visible on the warm base canvas.
    2.  **Picking:** Verify the dark charcoal tiles are easy to read and the drop zone 'glow' is effective.
    3.  **Sync Button:** After completing a revision, verify the "Daily Sync" button becomes disabled.
    4.  **Reset:** Click the reset button and confirm all progress (stats, cycles) resets to zero.
- **Regression Testing:** Run the full `npm test` suite in `/client` to ensure no component logic was broken.
- **Documentation:** Update `regression_checklist.md` and `CHANGELOG.md` with the new contrast fixes.

## Final Word
This plan surgically addresses the contrast and flow issues, bringing the UI into full compliance with the "Soft Premium" charter without requiring another full-scale rewrite, thus conserving our session context.