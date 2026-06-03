# Plan: 007 - Micro-Loop Refactor & UI HUD Implementation

## Objective
Refactor the Micro-Loop pedagogy to support 5-6 character acquisition per bundle, randomize the sound-match timing, and update the game HUD for better accessibility and progress awareness.

## Context
The "Educational Architect" persona identifies that a linear "Trace -> Match" sequence is too predictable. By tracing a group of letters before testing them via sound-matching, the learner must rely on active recall rather than immediate sensory memory. 

## Key Changes
### 1. Pedagogical Logic (Backend & State)
- **Grouping:** Refactor `srsEngine.js` or the session generation logic to serve all "Trace" games for the 5-6 characters before triggering "Match" games.
- **Randomization:** Ensure "Match" games for the 5-6 characters are interleaved or presented as a challenge block after the tracing phase, rather than immediately following each trace.

### 2. UI Layout Adjustments (`App.jsx`)
- **Exit Button:** Move the "EXIT" button from the top-right to the **top-left** corner of the game container.
- **Mastery HUD:** Implement a small, high-contrast "Learned Letters" horizontal strip in the **top-right** corner of the game container. This HUD will show all characters mastered from the start of the curriculum up to the current moment.

## Key Files & Context
- `server/services/srsEngine.js`: Payload generation logic.
- `client/src/App.jsx`: Game layout, Exit button, and new HUD placement.
- `client/src/components/ui/MasteryStrip.jsx`: Potentially reuse this component or a mini version of it for the HUD.

## Implementation Steps
### 1. HUD & Layout (Frontend)
- Create a `MiniMasteryHUD.jsx` or refactor `App.jsx` to include the HUD in the top-right.
- Reposition the "EXIT" button in the `App.jsx` game container.
- Ensure the HUD is responsive and doesn't obscure game elements.

### 2. Session Logic (Backend)
- Modify `generateLessonPayload` in `srsEngine.js` to prioritize "Trace" items for a character set before "Match" items.
- Increase the targeted characters per bundle logic in the seeder/engine as per the updated `GEMINI.md`.

## Verification & Testing
### Testing Strategy
- **Pedagogical Audit:** Confirm that a single session now presents multiple trace tasks followed by a randomized set of match tasks.
- **Visual Audit:** Verify "EXIT" is top-left and the "Mastery HUD" is top-right on an Android tablet simulation.
- **Regression Check:** Ensure the "Build" phase still correctly follows the character acquisition phase.
