# Plan: 009 - Phonetic Restoration & HUD Synchronization

## Objective
Restore phonetic guidance in the "Build" mini-game, fix the lagging "My Progress" HUD, and consolidate the fragmented Cycle 1 lessons.

## 1. Phonetic Restoration (`LetterPicker.jsx`)
- Replace the "Module_ID" label with the actual `phonetic` string from the word data.
- Ensure the phonetic text is large and clear to assist in the auditory-to-visual mapping for learners.

## 2. HUD Synchronization (`ProgressContext.jsx`)
- The "My Progress" HUD is currently only updating at the end of a lesson.
- Refactor `updateProgress` to ensure that if a `trace` item is completed correctly, it immediately updates the `masteredCharacters` state in the context, ensuring the HUD reflects the newly learned letter instantly.

## 3. Lesson Consolidation (`seed-100.json`)
- The previous automated refactor created 14 lessons, some likely very thin.
- I will manually consolidate these into the intended ~9 robust lessons (5-6 characters + related words) to ensure the learner isn't overwhelmed by empty/tiny lessons and the map remains clean.

## 4. Implementation Steps
1. **Refactor `LetterPicker.jsx`**: Swap ID label for Phonetic label.
2. **Refactor `ProgressContext.jsx`**: Trigger HUD state update on correct answer.
3. **Refine `seed-100.json`**: Manually audit and consolidate lesson IDs 10-14 into earlier lessons or new logical blocks.
4. **Run Seeder & Test**: Ensure the new counts are reflected in the UI.

## Verification & Testing
- **Visual Check:** Confirm "njan" or "nee" appears instead of "Module_w001" in the building game.
- **HUD Check:** Verify the "My Progress" strip updates *immediately* after finishing a character trace.
- **Map Check:** Confirm Cycle 1 shows the correct number of consolidated lessons.
