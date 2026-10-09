# Implementation Plan: Fix Schema for isSummary Flag

## Objective
Fix a bug where the `isSummary` flag is being stripped from the database objects because it is missing from the Mongoose `Word` schema. This prevents the `ConceptScreen` from rendering the interactive vocabulary summary grid.

## Scope & Impact
*   **Database Schema:** `server/models/Word.js` will be updated to include the `isSummary: { type: Boolean, default: false }` field.
*   **Data Integrity:** The seeder script must be re-run to ensure the 9 new `concept` items in `seed-100.json` are properly imported with the `isSummary` flag intact.

## Implementation Steps (TDD Approach)

### Phase 1: Schema Update (Green Phase)
1.  **Modify `server/models/Word.js`:**
    *   Add `isSummary: { type: Boolean, default: false }` to the schema definition.

### Phase 2: Database Seeding & Verification
1.  **Re-seed Database:**
    *   Run `node seeder.js` in the `/server` directory to purge and re-import all seed data.
2.  **Verify Persistence:**
    *   Run a quick script to query MongoDB and ensure that `lessonId: 1` returns a concept object where `isSummary` is strictly `true`.
3.  **Test Suite Execution:** Run `npm test` in `/server` to ensure the schema change didn't break any backend integrity tests.

## Verification & Testing Strategy
*   **Accuracy:** By explicitly declaring `isSummary` in the Mongoose schema, we guarantee that the `toObject()` call in `srsEngine.generateLessonPayload` preserves the flag and passes it to the frontend via the API.
*   **Process Faultlines:** Relying on Mongoose's strict schema means any undeclared fields in JSON seed files are silently dropped. This explicit declaration prevents silent failures.