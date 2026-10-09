# Implementation Plan: Data Parity & SRS Fixes

## Objective
Address three core issues identified post-Milestone 1.3:
1.  **SRS Revision Clutter:** Prevent instructional `concept` screens from appearing as flashcards in the Daily Revision loop.
2.  **Summary Grid Mismatch:** Fix the bug where Lesson 1 and Lesson 2 render the exact same summary grid by utilizing a more reliable `lessonId` reference.
3.  **Missing Double Consonants ("ല്ല" and "മ്മ"):** Add explicit tracing and matching lessons for long LLa ("ല്ല") and long MMa ("മ്മ") in Lesson 3, and update the associated words ("ഇല്ല", "അല്ല", "അമ്മ", "നമ്മൾ") to use these consolidated characters instead of individual components.

## Scope & Impact
*   **Backend:** `srsEngine.js` will filter out `lessonType: 'concept'` from the Daily Revision payload.
*   **Frontend:** `ConceptScreen.jsx` will be updated to use the globally reliable `activeLessonId` from `ProgressContext` instead of relying on `word.lessonId`, guaranteeing the correct preview fetch.
*   **Seed Data (`seed-100.json`):**
    *   Inject new trace/match entries for "ല്ല" (t045, m045) and "മ്മ" (t046, m046).
    *   Update `requiredCharacters` for w008 (നമ്മൾ), w012 (ഇല്ല), w014 (അല്ല), w086 (അമ്മ) to use the consolidated double consonants.
    *   Rewrite `c001`-`c009` descriptions to accurately reflect the re-mapped 9-lesson curriculum.

## Implementation Steps

### Phase 1: SRS Engine Patch (Green Phase)
1.  **Modify `server/services/srsEngine.js`:**
    *   Update `generateRevisionPayload` to exclude concept items:
        ```javascript
        if (wordData && wordData.lessonType !== 'concept') {
        ```

### Phase 2: ConceptScreen Context Fix
1.  **Modify `client/src/components/games/ConceptScreen.jsx`:**
    *   Extract `activeLessonId` from `useProgress()` and use it in the `fetchSummary` API call instead of `word.lessonId`:
        ```javascript
        const { userId, activeLessonId } = useProgress();
        ...
        const response = await fetch(`/api/session/lesson/preview?lessonId=${activeLessonId || word.lessonId}&userId=${userId}`);
        ```

### Phase 3: Data Consolidation & Injection
1.  **Update `seed-100.json`:**
    *   Inject `t045`/`m045` ("ല്ല") and `t046`/`m046` ("മ്മ") assigned to `lessonId: 3`.
    *   Modify `requiredCharacters` for affected words to use the new graphemes.
    *   Rewrite concept descriptions (`c001`-`c009`) to match the actual words in each lesson.
2.  **Re-seed Database:** Run `node seeder.js` in `/server`.

### Phase 4: Verification
1.  Run `npm test` across `/client` and `/server`.

## Verification & Testing Strategy
*   **Accuracy:** The SRS patch ensures children are tested on vocabulary, not instructions.
*   **Pedagogical Alignment:** Teaching double consonants as single tracing blocks prevents visual confusion and aligns with how Malayalam is naturally written.
*   **Process Faultlines:** Relying on `activeLessonId` from the React Context provides a safer fallback for the fetch call, eliminating edge cases where Mongoose object mapping might drop the nested `lessonId`.