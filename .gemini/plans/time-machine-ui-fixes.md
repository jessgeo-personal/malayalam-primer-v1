# Implementation Plan: Time Machine UI & Feedback Refinement

## 🎯 Objective
Refine the `TimeMachine` game UI to fix layout constraints on tablet screens, resolve drag-and-drop z-index clipping, and implement the standardized feedback overlay used across the rest of the application.

## 📂 Key Files & Context
*   **Component:** `client/src/components/games/TimeMachine.jsx`

## 🛠️ Implementation Steps

### Phase 1: UI Resizing & Layout Fixes
1.  **Drop Zone Height:** In the `DropZone` component, reduce `min-h-[400px]` to `min-h-[280px]` to free up vertical space on the tablet screen.
2.  **Draggable Tile Width:** In the `DraggableTile` component, replace `w-48` with `px-8 min-w-[240px] w-auto` to allow the tile to expand naturally for longer words without clipping the text.
3.  **Z-Index Clipping Fix:** In the main `TimeMachine` render block, the "Tile Pool" container has `overflow-hidden` applied. This is causing the draggable tile to be visually clipped/hidden behind the zones when it is dragged out of its container. Remove the `overflow-hidden` class.

### Phase 2: Standardized Feedback Overlay
1.  **State Management:** Introduce a new `feedback` state object (`{ isCorrect: boolean, time: number }`), similar to `SuffixSnapper`.
2.  **Logic Update:** In `handleDragEnd`:
    *   Instead of `setTimeout(() => onComplete...)`, immediately update the `feedback` state when a tile is dropped.
    *   If correct, trigger `audioEngine.speak(morphed)` and `setIsSuccess(true)`.
3.  **UI Overlay:** Add the full-screen semi-transparent overlay at the bottom of the component.
    *   Show "✨ Excellent!" / "You made [Word]" for success.
    *   Show "🩹 Not Quite!" / "Try dragging to a different tense!" for errors.
    *   Include primary action buttons: `CONTINUE ➜` (calls `onComplete(true)`) or `TRY AGAIN ➜` (calls `onComplete(false)` and clears the board).

### Phase 3: Verification
*   Execute frontend unit tests.
*   Start the dev server and test the layout and overlay rendering.

## 🧪 Verification Strategy
*   User will load Lesson 15 on the tablet.
*   Verify the tile no longer gets hidden during dragging.
*   Verify the "Yesterday/Today/Tomorrow" boxes are shorter, bringing the bottom tile up.
*   Verify dropping the tile triggers the full-screen popup requiring manual progression.