# Implementation Plan: Comprehensive Curriculum Alignment & Grapheme Refactor (Cycle 1)

## Objective
Fix pedagogical and data alignment issues across all 9 lessons in Cycle 1:
1.  **Grapheme Consolidation:** Ensure all words using double consonants (ല്ല, മ്മ, ന്ന, ട്ട, റ്റ, പ്പ, ച്ച, ക്ക, ങ്ങ, ന്ത, ന്ദ, മ്പ, ഞ്ച, ങ്ക) use consolidated character tiles instead of individual components.
2.  **Full Lesson Re-Mapping:** Re-map every word in Cycle 1 (approx. 100 items) to Lessons 1-9 to ensure they follow a strict prerequisite trace -> build flow and match the concept screen descriptions.
3.  **Audit & Inject Missing Traces:** Add explicit tracing/matching for all consolidated double consonants used throughout Cycle 1.

## Scope & Impact
*   **Seed Data (`seed-100.json`):** Total refactor of `lessonId`, `requiredCharacters`, and `prerequisites` for all items.
*   **Database:** Re-seeding required.

## Phased Implementation Plan

### Phase 1: Global Character Trace Injection
1.  **Audit `seed-100.json` for all double consonants.**
2.  **Inject Traces (t-series) and Matches (m-series) for:**
    *   **ല്ല, മ്മ, ന്ന, ട്ട, റ്റ, പ്പ്പ, ച്ച, ക്ക, ങ്ങ, ന്ത, ന്ദ, മ്പ, ഞ്ച, ങ്ക**.
    *   Assign these to the earliest possible lesson where a word requires them.

### Phase 2: Systematic Lesson Re-Mapping (1-9)
We will re-distribute the 100 core words across 9 lessons based on character complexity:
1.  **Lesson 1:** Basics (He, Va, Na)
2.  **Lesson 2:** People (I, You, She, They, We)
3.  **Lesson 3:** Our World (This, That, Mother, Father, Good, No)
4.  **Lesson 4:** Existence & Identity (Is, Is not, Yes, No)
5.  **Lesson 5:** Basic Actions (Go, Come, See, Hear)
6.  **Lesson 6:** Daily Life (Eat, Drink, Sleep, Wake)
7.  **Lesson 7:** Desires & Questions (Want, Need, Who, What)
8.  **Lesson 8:** Places & Pointers (Home, School, Here, There)
9.  **Lesson 9:** Descriptions & Qualities (Big, Small, Fast, Slow)

### Phase 3: Character Refactor (Global)
1.  Iterate through all `build` items in `seed-100.json`.
2.  Update `requiredCharacters` to use the new consolidated graphemes.
3.  Update `prerequisites` to point to the new `m` (match) IDs.
4.  Ensure no word has an empty `requiredCharacters` array.

### Phase 4: Database Synchronization
1.  Run `node seeder.js` in `/server`.
2.  Verify payload integrity for all 9 lessons.

## Verification & Testing Strategy
*   **Accuracy Audit:** Manual check of Lessons 1-9 summary grids to ensure they display the intended vocabulary.
*   **Touch UX:** Ensure large tiles for double consonants fit well in the `LetterPicker` layout.
*   **Regression:** Run `npm test` in `/server` to ensure no schema violations or duplicate wordIds.
*   **Zero-Regression:** Confirm that Cycle 2 remains unaffected by the Cycle 1 data purge.