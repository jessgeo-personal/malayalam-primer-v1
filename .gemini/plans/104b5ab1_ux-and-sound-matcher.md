# Plan: UX Fixes, Top Mastery Strip, & New SoundMatcher Game

## Objective
1. **Fix Touch UX:** Resolve the jerky drag-and-drop experience on tablets by implementing DND-Kit touch sensors and active drop zone highlighting.
2. **Backend Restart:** Ensure the Node server restarts so the Gamification API (`/api/progress/stats`) begins functioning.
3. **UI Adjustments:** Move the Mastery Strip from the bottom to the top of the screen to serve as a prominent achievement indicator alongside the points.
4. **Pedagogical Addition:** Introduce a new `SoundMatcher` mini-game (lessonType: `match`) where the child hears a sound and picks the correct Malayalam character from 3 choices. This bridges the gap between tracing and word building.

## Scope & Context
- `client/src/components/games/LetterPicker.jsx`: Import `TouchSensor`, use `isOver` for highlighting.
- `client/src/components/games/SoundMatcher.jsx`: Create the new multiple-choice game.
- `client/src/App.jsx`: Relocate `MasteryStrip` to the top, under the header. Add routing logic for `lessonType === 'match'`.
- `server/data/seed-100.json`: Add `match` lessons for all existing `trace` characters. Update the `build` prerequisites to require the `match` lessons instead of just the `trace` lessons.

## Implementation Steps
1. **DND UX Enhancements (`LetterPicker.jsx`):**
   - Add `TouchSensor` with delay/tolerance to prevent scroll conflicts.
   - Use `collisionDetection={closestCenter}`.
   - Use `isOver` to highlight the `DroppableSlot` when a tile is dragged over it.
2. **Mastery Strip Relocation (`App.jsx`):**
   - Move `<MasteryStrip />` from the `<footer>` to directly under the header gamification row so it acts as a constant achievement indicator.
3. **Sound Matcher Component (`SoundMatcher.jsx`):**
   - A new game that receives `word` (the character to match).
   - Generates 2 random incorrect characters from a list to act as distractors.
   - Plays the audio of the correct character via `audioEngine`.
   - The user must tap the correct character out of 3.
4. **Curriculum Update (`seed-100.json`):**
   - For every `trace` lesson (e.g., `t001` for 'അ'), create a corresponding `match` lesson (`m001` for 'അ') that lists `t001` as its prerequisite.
   - Change the prerequisites of the word-building puzzles to require the `m` (match) lessons. This enforces the flow: Trace -> Match -> Build.
5. **Backend Restart & Verification:**
   - Restart `node server.js` to ensure the stats API is loaded.
   - Re-run `node seeder.js` and `npm run reset`.
   - Test all 3 lesson types sequentially.