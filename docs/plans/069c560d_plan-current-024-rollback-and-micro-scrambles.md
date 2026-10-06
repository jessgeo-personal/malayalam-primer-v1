# Plan: Rollback & Sentence Scrambler Revision

## Background & Apology
I incorrectly bypassed the prototyping feedback phase and deployed experimental capstone data directly into the live curriculum (`seed-100.json` / `seed-200.json`). Furthermore, the proposed Capstone (Lesson 10) presented too steep of a pedagogical jump, requiring the user to build 3-word SOV sentences using words they hadn't adequately practiced in a sentence context.

## Objective
1. **Rollback:** Revert the live database to its original state (Cycle 1 ends at Lesson 9, Cycle 2 covers Lessons 10-15).
2. **Prototype Refinement:** Refactor the `SentenceScrambler` component to exclusively use the user-approved "Tap-to-Build" (Duolingo-style) variant and clean up the Prototype Lab.
3. **Pedagogical Pivot (Micro-Scrambles):** Instead of a Capstone lesson, we will plan to introduce "Micro-Scrambles" directly into early lessons (Lessons 3-9) immediately after the required anchor words (like `ഇത്`, `ആണ്`) are taught.

## Implementation Steps

### Phase 1: Database Rollback (Restoring Integrity)
1. **Remove Capstone Data:** Delete `c016` and all `sc001`-`sc005` items from `seed-100.json`.
2. **Un-shift Cycle 2:** Decrement the `lessonId` by 1 for all items in `seed-200.json` and the affected Cycle 2 items at the end of `seed-100.json`, restoring the Lesson 10-15 range.
3. **Revert Tests:** Restore the expected lesson ranges in `integrity.test.js` back to `[10, 11, 12, 13, 14, 15]`.
4. **Validation:** Run `node seeder.js` and `npm test tests/integrity.test.js` to confirm the curriculum is identical to its state prior to this session.

### Phase 2: Prototype Refinement (The "Tap" Variant)
1. **Refactor `SentenceScrambler.jsx`:** 
   - Strip out `dnd-kit` dependencies and the horizontal sorting logic (Magnets/Puzzle).
   - Solidify the "Tap-to-Build" UI as the singular, highly polished interaction model.
2. **Update `PrototypeLab.jsx`:** 
   - Reduce the scrambler testing tabs to a single "SCRAMBLER (TAP)" entry.
   - Use a simpler 2-word sentence for the mock data (e.g., `ഇത് അമ്മ` - This is mother) to reflect the new pedagogical direction.

### Phase 3: The New Pedagogical Strategy (For Future Execution)
*Note: This phase outlines the strategy to be implemented in a subsequent milestone, keeping this current PR focused on the rollback and prototype cleanup.*
Instead of waiting until Lesson 10, we will integrate `scramble` items as the final exercises of existing lessons:
- **Lesson 3:** User learns `ഇത്`, `അമ്മ`, `അച്ചൻ`. We will add a 2-word scramble: `[ഇത്] [അമ്മ]` (This is mother).
- **Lesson 4:** User learns `ഉണ്ട്`, `ഇല്ല`, `ആണ്`. We will add a 3-word scramble enforcing SOV: `[ഇത്] [അമ്മ] [ആണ്]` (This is mother).
- **Lesson 5-9:** Gradually introduce longer sentences as verbs and adjectives are introduced, enforcing the verb-at-the-end rule iteratively.

## Validation
- Ensure `npm test` passes for the frontend (with the refactored Scrambler).
- Ensure `npm test tests/integrity.test.js` passes for the backend, confirming the rollback.
