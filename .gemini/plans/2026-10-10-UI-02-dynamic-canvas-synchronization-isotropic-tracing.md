# UI-02 Plan: Dynamic Canvas Synchronization & Isotropic Tracing Calibration

## 1. Problem Statement & Objectives
`client/src/components/games/TracingCanvas.jsx` previously used a fixed internal canvas resolution (`1400x800`) scaled via CSS (`100%`). On responsive viewports and varying tablet screen ratios, this causes bitmap stretching and squishing of Malayalam graphemes and drawn tracing paths.

### Objectives:
1. Wrap `<canvas>` in a responsive container with `ref={containerRef}` and dynamically observe its dimensions via `ResizeObserver`.
2. Synchronize `canvas.width` and `canvas.height` with device pixel ratio (`dpr = window.devicePixelRatio || 1`) while setting CSS styles to rendered width/height in px.
3. Fit the ghost letter isotropically using bounding-box scaling (`availWidth = width * 0.82`, `availHeight = height * 0.68`) and `ctx.measureText` so wide conjuncts and standard characters preserve native typographic aspect ratios.
4. Record touch/pointer stroke paths as normalized coordinates $[0, 1]$ relative to the canvas dimensions, re-projecting them dynamically upon redrawing/resizing without distortion.
5. Provide round line caps and joins with proportionate stroke styling for tablet finger tracing.

---

## 2. Testing Strategy (4-Pillar Evaluation Matrix)

### Pillar 1: Accuracy (Isotropic & Coordinate Calibration)
- Verify `measureText` is called with baseline test size (100px) and calculates `scaleX`, `scaleY`, and `uniformScale = Math.min(scaleX, scaleY)` correctly.
- Verify `finalFontSize` scales the ghost letter without stretching or exceeding `availWidth`/`availHeight`.
- Verify touch points are normalized into range $[0, 1]$: `x = (clientX - rect.left) / width`, `y = (clientY - rect.top) / height`.

### Pillar 2: Visual Consistency (Tablet-First Neo-Bento)
- Container provides responsive flex-centered layout with min-height (`min-h-[300px]`).
- Line caps and joins use `'round'`, and ghost fill uses `#94a3b8` (Slate-400).

### Pillar 3: Functional Adherence (Gameplay & Lifecycle)
- `ResizeObserver` observes `containerRef` and triggers canvas buffer resizing and redrawing on dimension change.
- Strokes are preserved across resize events and re-rendered at new dimensions.
- Clearing the canvas resets stored strokes and disables the "DONE" button.
- Drawing activates the "DONE" button (`hasStarted = true`).
- Audio playback for letter and example words continues to function without regression.

### Pillar 4: Process Faultlines & Edge Cases
- Handles `entry.contentRect` width/height equal to 0 without division by zero or errors.
- Handles environments without `ResizeObserver` gracefully (e.g. fallback or mock in SSR/tests).
- Handles empty or missing `word.malayalamText` gracefully.

---

## 3. Implementation Steps

1. **Test-First (TDD Red Phase):**
   - Update `client/src/tests/TracingCanvas.test.jsx` with tests for:
     - ResizeObserver event triggering dynamic buffer dimensions and DPI scaling.
     - Isotropic font size calculation using `measureText`.
     - Normalized stroke recording and redrawing upon resize.
     - Canvas clearing and completion button state.
   - Run tests to verify the new test suite fails against current implementation.

2. **Component Implementation (Green Phase):**
   - Refactor `client/src/components/games/TracingCanvas.jsx`:
     - Container `containerRef` with `<div ref={containerRef} className="relative w-full h-full min-h-[300px] flex items-center justify-center">`.
     - `useEffect` attaching `ResizeObserver` to `containerRef`.
     - `redrawCanvas(width, height, dpr)` implementing isotropic ghost letter scaling and normalized strokes projection.
     - Normalized stroke handlers (`startDrawing`, `draw`, `stopDrawing`) saving paths to `strokesRef`.
     - Reset and cleanup handlers.
   - Verify tests pass with 100% green.

3. **Documentation & Version Bump:**
   - Update `client/src/config/version.js` to increment `NNN` (`2026.10.10.016`).
   - Update `docs/EXECUTION_TRACKER.md` (mark UI-02 Completed).
   - Update `docs/regression_checklist.md` with UI-02 verification item.
   - Update `.gemini/log/CHANGELOG.md` with planning, build, and verification entries.
   - Run full client and server test suites.
