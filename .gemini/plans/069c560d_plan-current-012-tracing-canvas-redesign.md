# Plan: 012 - Tracing Canvas Redesign & HUD Enhancements

## Objective
Redesign the `TracingCanvas.jsx` to a side-by-side tablet layout to eliminate scrolling. Update the global game HUD (`App.jsx`) to display specific lesson details and clarify the "My Progress" state.

## 1. HUD Enhancements (`App.jsx`)
- **Active Lesson Bubble:** Change the static "Active Lesson" text to include the actual lesson ID, e.g., "Active Lesson: {currentLesson}".
- **My Progress:** If the user hasn't mastered any letters yet (empty state), display a subtle placeholder like "No letters yet" so it doesn't look broken or missing.

## 2. Tracing Canvas Redesign (`TracingCanvas.jsx`)
- **Header:** Keep "Trace the Letter" at the top center.
- **Side-by-Side Layout:** Split the main content into two columns (using Flexbox `md:flex-row`):
    - **Left Column:** The Tracing Canvas (pad).
    - **Right Column:** A vertical control panel.
- **Right Column Contents (Top to Bottom):**
    - Subheading: "Phonetic sound"
    - The phonetic representation (large text).
    - **Speaker Button (New):** A button to replay the Malayalam audio (`audioEngine.speak`).
    - **Clear Button:** Moved from below the canvas to here.
    - **Done Button:** Moved from below the canvas to here.

## 3. Implementation Steps
1. **Refactor `App.jsx`**: Update the header bubble logic in the game view.
2. **Refactor `TracingCanvas.jsx`**: Restructure the JSX layout. Add the `audioEngine` import and speaker button functionality.
3. **Responsive Audit**: Ensure the layout scales well on tablet landscape/portrait without needing to scroll.

## Verification & Testing
- **Visual Check:** Confirm the Tracing Canvas and buttons fit on a single tablet screen without vertical scrolling.
- **Functional Check:** Verify the new Speaker button correctly plays the audio for the current character.
- **HUD Check:** Confirm the Active Lesson bubble shows the correct number (e.g., "Active Lesson: 1").
