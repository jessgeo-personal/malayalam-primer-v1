# Implementation Plan: Milestone 2.2 - Chunk 3 (Data Expansion)

## Objective
Populate Cycle 2 (Lessons 10-14) with a robust curriculum. We will add 5 instructional `concept` screens and significantly expand the `suffix` puzzles to meet the user requirement of **at least 10 playable words per lesson**. This expansion will strictly adhere to the Suffix-Led Sandhi logic (e.g., placing the vowel mathra on the suffix tile).

## TDD & Guardrail Strategy
Before writing raw JSON data, we must ensure our backend test suite enforces the architectural constraints requested by the user.

1.  **Constraint 1: Minimum Lesson Volume.** We will write a Jest test in `server/tests/integrity.test.js` to mathematically assert that every lesson defined in `seed-200.json` contains a minimum of 10 items.
2.  **Constraint 2: Concept Screen Priority.** We already wrote a test in Chunk 1 to ensure `generateLessonPayload` always serves `concept` items first.
3.  **Constraint 3: Pedagogical Alignment.** All new words must strictly use Phase 1 (Cycle 1) vocabulary as their `baseWord`, preventing the introduction of unfamiliar root words during a grammar test.

## Execution Steps

### Phase 1: Test-Driven Guardrails (Red Phase)
1.  Update `server/tests/integrity.test.js` to include a new assertion block: `Database Capacity Integrity`.
2.  This test will parse `server/data/seed-200.json` directly and assert that for every unique `lessonId` found, the count of items assigned to that `lessonId` is `>= 10`.
3.  *Expected Result:* The test will fail (Red) because current lessons only have 2-3 items.

### Phase 2: Data Expansion (Green Phase)
1.  Modify `server/data/seed-200.json` to include the following structure:
    *   **Lesson 10 (Plurals - കൾ/ുകൾ):** 1 Concept Screen + 10 Suffix Puzzles.
    *   **Lesson 11 (Anunaasika Sandhi - ങ്ങൾ):** 1 Concept Screen + 10 Suffix Puzzles (using 'am' ending words).
    *   **Lesson 12 (Kinship - മാർ):** 1 Concept Screen + 10 Suffix Puzzles.
    *   **Lesson 13 (Locative - ിൽ/ത്തിൽ):** 1 Concept Screen + 10 Suffix Puzzles.
    *   **Lesson 14 (Mixed Review):** 1 Concept Review Screen + 12 Suffix Puzzles (mixed grammar rules).
2.  Ensure every puzzle strictly uses the `morphedBase` architecture to properly handle Sandhi.

### Phase 3: Validation & Database Sync
1.  Run `npm test server/tests/integrity.test.js`. *Expected Result:* Pass (Green).
2.  Run `node normalize_data.js` to guarantee boundary alignment across all cycles.
3.  Run `node seeder.js` to purge and populate the local MongoDB instance.
4.  Update `.gemini/docs/regression_checklist.md` and `.gemini/log/CHANGELOG.md`.

## Rollback Plan
If the 50+ item expansion causes performance or UI rendering issues, we will checkout the Git `dev` branch to the commit prior to this Chunk 3 modification and revert the JSON payload.