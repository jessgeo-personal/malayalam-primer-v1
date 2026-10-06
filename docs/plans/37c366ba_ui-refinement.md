# Plan: Professional UI Refinement & Bug Fixes

## Objective
Refine the UI to look more professional while retaining a fun, consumer-grade game aesthetic (like Angry Birds or Tetris). Address the oversized elements to better fit a tablet screen and fix the tracing canvas bug where the ghost letter guide does not render.

## Scope
1. **Tracing Canvas Bug Fix:** 
   * **Root Cause:** The `context.font` assignment in `TracingCanvas.jsx` uses an invalid font weight string (`'black 500px sans-serif'`), causing the canvas context to reject the font setting and fail to render the ghost letter.
   * **Fix:** Change it to valid CSS font syntax (e.g., `'900 300px sans-serif'`) and adjust the canvas internal rendering scale to fit the new, more compact component size.

2. **Global Component Scaling (Tablet Optimization):**
   * Reduce oversized typography (e.g., scale `text-7xl/9xl` down to `text-5xl/6xl`).
   * Reduce large structural elements (e.g., change `w-40 h-40` to `w-24 h-24` or `w-20 h-20`).
   * Scale down border radii and border widths (e.g., `rounded-[3rem]` to `rounded-2xl`, `border-[12px]` to `border-4` or `border-8`).

3. **Color Palette & Professional Polish:**
   * Refine the CSS gradients and `btn-3d` classes in `App.css` to use a tighter, more cohesive color scheme (deep blues, vivid oranges, bright greens).
   * Soften the background pattern to be less distracting while maintaining the game-like feel.

4. **Component Updates:**
   * `AdventureMap.jsx`: Scale down the train bogeys, tracks, and fonts.
   * `LetterPicker.jsx` & `SoundMatcher.jsx`: Scale down tiles and slots. Ensure the audio buttons fit neatly on the smaller tiles.
   * `TracingCanvas.jsx`: Scale down the canvas container and reposition the "Start Here" hint so it doesn't look like an error state.

## Implementation Steps
1. Update `client/src/App.css` to refine the 3D buttons and background.
2. Update `client/src/components/games/TracingCanvas.jsx` to fix the canvas context font bug and scale down the UI.
3. Update `client/src/components/ui/AdventureMap.jsx` to make the train and nodes ~50% smaller.
4. Update `client/src/components/games/LetterPicker.jsx` and `SoundMatcher.jsx` to shrink the interactive tiles.
5. Update `client/src/App.jsx` to reduce global header sizes and padding.

## Verification
* Verify that the ghost letter guide renders correctly on the Tracing Canvas.
* Verify that all screens fit within a standard tablet resolution (e.g., 1024x768) without vertical scrolling (except where intended on the map).