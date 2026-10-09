# Plan: Cyber-Pop UI Rebuild

## Objective
Rebuild the frontend to adhere to the standardized `UI_CHARTER.md`, adopting a "Sleek Gamified" Cyber-Pop aesthetic suitable for 8-16 year olds. This includes a dark mode default (`#0f172a`), vibrant neon accents, tactile arcade-style UI elements, and fixing the tracing screen sizing issue.

## Scope
1. **Tailwind Configuration (`client/tailwind.config.js`):**
   * Integrate the exact theme configuration specified in the UI Charter (colors: `app-bg`, `app-surface`, `app-primary`, etc., box shadows: `arcade`, `arcade-pressed`, and animations: `wiggle`, `pop`).

2. **Global Styling (`client/src/App.css` & `client/src/index.css`):**
   * Remove the previous sky-blue gradient background.
   * Apply `bg-app-bg` and `text-app-textMain` globally.
   * Create new utility classes for the arcade buttons (e.g., `.btn-arcade`) utilizing the new custom shadows and transition effects.

3. **Component Refactoring (Cyber-Pop Theme):**
   * **`App.jsx`:** Update headers, containers, and backgrounds to use `app-surface` and neon accents. 
   * **`AdventureMap.jsx`:** Refactor the train and track to a neon-grid or sleek dark aesthetic. Replace old 3D buttons with `.btn-arcade` styles.
   * **`LetterPicker.jsx`:** Update tiles to use dark/neon themes with sharp arcade shadows.
   * **`SoundMatcher.jsx`:** Apply the new theme to the choice grid.
   * **`MasteryStrip.jsx`:** Convert the badge shelf to a sleek, dark-themed indicator strip.

4. **Bug Fixes & Usability:**
   * **TracingCanvas Sizing:** The user reported the tracing screen is too small for the letters. I will increase the container's `max-w` to `max-w-lg` and adjust the ghost letter font scaling to ensure it fits perfectly within the bounds without clipping.

## Implementation Steps
1. Update `client/tailwind.config.js`.
2. Rewrite `client/src/App.css` to define the new global styling and `.btn-arcade` classes.
3. Apply changes to `client/src/App.jsx`.
4. Apply changes to `client/src/components/ui/AdventureMap.jsx` & `MasteryStrip.jsx`.
5. Apply changes to `client/src/components/games/LetterPicker.jsx`, `SoundMatcher.jsx`, and `TracingCanvas.jsx`.
6. Run tests to ensure no regressions.

## Verification
* Ensure all text maintains the WCAG AA 4.5:1 contrast ratio mandate from the charter.
* Verify the TracingCanvas fits the letter properly on a tablet layout.
* Check that DND (drag and drop) functionality remains intact with the new styling.