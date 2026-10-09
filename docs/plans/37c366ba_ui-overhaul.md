# Plan: Consumer-Grade UI Overhaul

## Objective
Transform the amateurish UI into a polished, game-like experience (similar to Angry Birds or Tetris) appealing to an 8-year-old. This involves overhauling the color palette, introducing chunky 3D buttons, improving animations, and making the layout more compact and vibrant.

## Scope
1. **Global CSS (`client/src/App.css`):** Introduce a fun sky/cloud patterned background, chunky 3D button utility classes (`.btn-3d`, `.btn-3d-blue`, etc.), and bouncy animations.
2. **Adventure Map (`client/src/components/ui/AdventureMap.jsx`):** Redesign the train aesthetic to be tighter, more colorful, and use the new 3D button styles. Add a better track visualization.
3. **Word Building (`client/src/components/games/LetterPicker.jsx`):** Redesign draggable tiles to look like physical, rounded 3D blocks (Tetris-style) with a satisfying press state. Ensure the audio button integrates seamlessly.
4. **App Container (`client/src/App.jsx`):** Update the header, score counter, and session summary screens to use bold fonts, heavier shadows, and the new 3D button classes.

## Key Changes
* Replace flat Tailwind buttons with custom CSS `.btn-3d-*` classes that use `border-bottom-width: 8px` and transform on `:active` to simulate physical pushing.
* Use `font-black` globally for headers and buttons.
* Implement a repeating radial-gradient background in CSS for a dynamic but lightweight sky feel.

## Guardrails, Testing & Documentation (Mandatory)
* **Regression Checklist (`.gemini/docs/regression_checklist.md`):** Will add verification points for the new 3D UI, ensuring tablet touch mechanics (DND) are not broken by the new CSS classes.
* **Changelog (`.gemini/log/CHANGELOG.md`):** Will update the log to reflect the global UI overhaul (Version 2026.05.28.004).
* **Unit Testing:** Will run the frontend Vitest suite after applying CSS changes to ensure component rendering hasn't failed.
* **Functional Adherence:** Ensure that all existing SRS progression and API routes remain entirely untouched and fully functional during this visual reskin.