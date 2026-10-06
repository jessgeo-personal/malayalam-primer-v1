# Implementation Plan: Suffix Snapper UI Refinement (Tutorial Positioning)

## 🎯 Objective
Move the bouncing "Drag the correct ending!" tutorial guide in the `SuffixSnapper` component to the left mid-section of the page so it no longer obstructs the main word display.

## 📂 Key Files
*   `client/src/components/games/SuffixSnapper.jsx`

## 🛠️ Implementation Steps
1.  **Locate Tutorial Guide:** Find the `div` with `data-testid="tutorial-guide"` in `SuffixSnapper.jsx`.
2.  **Adjust CSS Positioning:** Change the positioning classes from a centered overlay (`absolute inset-0 flex-col items-center justify-center pt-32`) to a left-aligned, absolute positioned element (`absolute left-[-150px] top-[200px] flex-col items-center`).
3.  **Adjust Layout:** Rotate the pointing hand icon so it points towards the right (at the suffix choices or drop zone) rather than up.
4.  **Test:** Visually verify the positioning on a tablet layout.