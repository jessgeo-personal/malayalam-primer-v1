# UI-03 Plan: Browser Tab Identity Polish & Tracing Canvas Headroom Calibration

## 1. Problem Statement & Objectives
1. **Browser Tab Identity**: `client/index.html` currently shows `<title>client</title>`, lacking branding and application clarity for tablet PWA and desktop browsers.
2. **Tracing Canvas Headroom Clipping**: In `client/src/components/games/TracingCanvas.jsx`, tall Malayalam graphemes and compound mathras (e.g. ു, ൂ, ണ്ണ, ന്ന) can get clipped at the top of the canvas during tracing due to insufficient vertical safety margins and lack of ink-bounds vertical offset.

### Objectives:
- Update `client/index.html` to set `<title>Malayalam Primer v1.0</title>` and appropriate description/application metadata.
- Increase safety margins in `TracingCanvas.jsx`:
  - `availWidth = width * 0.74` (26% horizontal margin)
  - `availHeight = height * 0.52` (48% vertical margin)
- Compute `charHeight` using `actualBoundingBoxAscent` and `actualBoundingBoxDescent` with robust fallback (`testFontSize * 0.95` and `testFontSize * 0.30`).
- Adjust optical center: `verticalOffset = (finalAscent - finalDescent) / 2` and render at `renderY = (height / 2) + (verticalOffset * 0.3)`.
- Update tests in `client/src/tests/TracingCanvas.test.jsx` and `index.html` inspection.
- Ensure all tests in `client/` and `server/` pass.

---

## 2. Testing Strategy (4-Pillar Evaluation Matrix)

### Pillar 1: Accuracy (Glyph Metrics & Headroom)
- Verify `availWidth` uses 0.74 and `availHeight` uses 0.52 safety margins.
- Verify `measureText` actualBoundingBoxAscent/Descent calculation and fallback logic.
- Verify `renderY` incorporates optical center offset preventing ascender clipping.

### Pillar 2: Visual Consistency (Branding & Neo-Bento Tablet UX)
- Tab title reads `"Malayalam Primer v1.0"`.
- Meta application-name and description align cleanly with Malayalam Primer.

### Pillar 3: Functional Adherence (Drawing & Tracing)
- Canvas continues to support smooth touch/mouse drawing, normalized $[0, 1]$ stroke retention, CLEAR and DONE actions.

### Pillar 4: Process Faultlines & Edge Cases
- Missing `actualBoundingBox` properties fall back cleanly to 0.95/0.30 ratios without crashing or producing `NaN`.
- Handles canvas resize, unmount, and empty characters gracefully.

---

## 3. Implementation Steps

1. **Step 1: Planning & Changelog Initialization**
   - Create plan file in `.gemini/plans/`.
   - Update `.gemini/log/CHANGELOG.md` with UI-03 planned entry.

2. **Step 2: Update `client/index.html`**
   - Change title to `Malayalam Primer v1.0`.
   - Add meta description and application-name tags.

3. **Step 3: Update `client/src/components/games/TracingCanvas.jsx`**
   - Implement headroom calibration with 0.74 width and 0.52 height margins.
   - Implement actualBoundingBox measurement, verticalOffset, and renderY calculation.

4. **Step 4: Update Tests & TDD Verification**
   - Update `client/src/tests/TracingCanvas.test.jsx` with tests for the new headroom bounds and renderY optical offset.
   - Run Vitest tests (`npm test` in `client/`).
   - Run server test suite.

5. **Step 5: Documentation & Version Bump**
   - Bump version in `client/src/config/version.js` to `2026.10.10.017`.
   - Update `docs/EXECUTION_TRACKER.md` (add UI-03).
   - Update `docs/regression_checklist.md`.
   - Update `.gemini/log/CHANGELOG.md`.
