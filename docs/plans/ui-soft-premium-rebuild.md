# Plan: Soft Premium "Neo-Bento" UI Rebuild

## Objective
Rebuild the frontend to adhere to the updated `UI_CHARTER.md`, transitioning from "Cyber-Pop" to a "Soft Premium" Neo-Bento aesthetic. This design emphasizes warm canvases, hyper-rounded corners (`32px`), deep text contrast, and high-quality minimalist layouts suitable for 8-16 year olds.

## Scope
1. **Tailwind v4 Configuration (`index.css`):**
   * Replace `app-*` colors with the new `prime-*` palette: `canvas`, `warmBase`, `darkText`, `actionDark`, `coralPink`, `tealGreen`, `mangoOrange`, and `periwinkle`.
   * Add `bento` (`32px`) and `pill` (`100px`) border radii.
   * Configure "Plus Jakarta Sans" as the primary font.

2. **Core Layout (`App.jsx`):**
   * **Hero Slot:** Top section with a vibrant background (Coral/Teal) and the child's welcome header.
   * **Bento Grid:** Stat cards showing "Lessons Unlocked", "Completed Items", and "Active Progress."
   * **Global Navigation Dock:** A dark charcoal floating menu capsule at the bottom.

3. **Game Component Refactoring:**
   * **`AdventureMap.jsx`:** Refactor the train into a "Course Deck" of stacked cards with alternating background accents.
   * **`LetterPicker.jsx` & `SoundMatcher.jsx`:** Use clean white interior cards with dark pill action buttons.
   * **`TracingCanvas.jsx`:** Fix sizing by utilizing a large Bento Feature Block container, ensuring the ghost letter is high-contrast and centrally scaled.

4. **Typography & Styling:**
   * Implement the "Number-First" hierarchy (7xl font-extrabold for metrics).
   * Replace arcade buttons with `btn-pill` styles (Dark charcoal, high contrast).

## Guardrails & Testing
* **Contrast Compliance:** Verify that white text only appears on vibrant backgrounds and dark text on warm canvases.
* **Tablet UX:** Ensure the floating navigation dock doesn't obscure interactive game elements.
* **Regression:** Verify that the 3-Tier SRS logic and Lesson/Bogey state management remain intact despite the visual overhaul.

## Implementation Steps
1. Update `client/src/index.css` with the new `@theme` variables.
2. Refactor `client/src/App.css` for Bento utility classes.
3. Overhaul `client/src/App.jsx` layout structure (Header, Bento Grid, Dock).
4. Update `client/src/components/ui/AdventureMap.jsx`.
5. Update game components: `LetterPicker.jsx`, `SoundMatcher.jsx`, `TracingCanvas.jsx`.
6. Final build and regression check.