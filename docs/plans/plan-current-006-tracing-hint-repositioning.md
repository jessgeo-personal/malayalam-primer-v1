# Plan: 006 - Tracing Hint Repositioning

## Objective
Move the "Trace the line" instructional hint from the center of the tracing pad to the bottom-right corner to prevent it from being obscured by the ghost letter.

## Context
The user observed that the hint text was hidden behind the impression of the letter they are supposed to trace. Repositioning it to the corner improves visual clarity and usability.

## Key Files & Context
- `client/src/components/games/TracingCanvas.jsx`: Instructional hint location and text.

## Implementation Steps
### 1. Refactor `TracingCanvas.jsx`
- Update the hint container from `absolute inset-0 flex flex-col items-center justify-center` to `absolute bottom-8 right-8 flex flex-col items-end`.
- Increase the `z-index` to `z-20` to ensure it stays on top of the ghost letter but under the drawing stroke if necessary (or just clearly visible).
- Update the text from "Follow the lines" to "Trace the line".
- Remove the redundant `span` showing a faint background letter.

## Verification & Testing
- **Visual Check:** Confirm the "Trace the line" pill is now in the bottom-right corner.
- **Functionality Check:** Ensure the pill still pulses and correctly disappears once tracing starts (`!hasStarted`).
