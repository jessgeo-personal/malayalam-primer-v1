# Plan: UI Refinements (Canvas Width & Feedback Contrast)

## Objective
Address two specific UI/UX issues reported during testing:
1.  **Feedback Contrast:** Fix the failure feedback overlay in `LetterPicker.jsx` so that the white text is readable and does not merge with the background.
2.  **Tracing Canvas Width:** Increase the width of the drawing area in `TracingCanvas.jsx` by approximately 35% to accommodate long Malayalam alphabets (especially conjuncts) without cutting them off on tablets.

## Key Files & Context
- `client/src/components/games/LetterPicker.jsx`
- `client/src/components/games/TracingCanvas.jsx`

## Implementation Steps

### 1. Fix LetterPicker Feedback Contrast
The current feedback overlay inside the right column uses `bg-prime-error`, but it appears it's not contrasting well or the structure allows it to bleed into the background.
- **Action:** Update the feedback UI block in `LetterPicker.jsx`. 
- **Details:** Wrap the inner content of the feedback overlay in a high-contrast container. Instead of just setting the background on the absolute overlay, ensure it has a solid, opaque background (e.g., `bg-prime-error`) and perhaps a dark semi-transparent backdrop (`bg-black/80`) if it spans the whole area, ensuring the white text pops. I will refine the CSS classes in the `feedback && (...)` render block.

### 2. Increase TracingCanvas Width
The current layout in `TracingCanvas.jsx` is:
```html
<div className="flex flex-col md:flex-row items-stretch gap-8 w-full">
  <div className="flex-1 ..."> <!-- Canvas Area -->
  <div className="w-full md:w-80 ..."> <!-- Controls Area -->
```
On a standard tablet (e.g., iPad Air width 820px), a `max-w-5xl` container minus an 80px gap minus a 320px (`w-80`) right column leaves the canvas relatively narrow.
- **Action:** Adjust the flex layout to give the canvas significantly more relative space.
- **Details:** 
  - Change the `max-w-5xl` container on the root `div` to `max-w-6xl` or `w-full` to allow more screen usage.
  - Reduce the right column's width from `md:w-80` (320px) to `md:w-64` (256px).
  - Modify the canvas aspect ratio logic if necessary. Currently, the internal resolution is hardcoded to `1000x1000` (1:1 square). If Malayalam letters are long, they are horizontal. I should change the internal canvas resolution to a wider aspect ratio, e.g., `1200x800` or `1400x800`, so the rendering isn't cramped horizontally.
  - Update `canvas.width = 1400` and `canvas.height = 800` inside the `useEffect`.

## Verification & Testing
- **Contrast Check:** Fail a word assembly intentionally and verify the "Correct spelling" text is highly visible against its new background box.
- **Canvas Check:** Open a tracing lesson for a long character (like `ക്ഷ` or `ള്ള`) and verify that the drawing area is noticeably wider and the character fits comfortably within the bounds.