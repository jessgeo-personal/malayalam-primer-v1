# Plan: 021 - Fix Progress Tracking & Mastery HUD

## Objective
Fix the "My Letters" and "My Progress" sections which are currently empty despite user progress. The root cause is a mismatch in the `itemType` field: trace items (letters) are being saved with `itemType: 'word'` in the database, but the stats logic looks for `itemType: 'letter'`.

## Investigation Summary
- **Data Reality:** All trace items (e.g., `t001`) are stored with `itemType: 'word'` in the `Progress` collection.
- **Code Assumption:** `server/routes/api.js` filters for `itemType: 'letter'` to populate `masteredCharacters`.
- **UI Assumption:** The frontend relies on `masteredCharacters` from the stats API to show learned letters.

## Implementation Steps

### Step 1: Fix `srsEngine.js` Payload Generation
The `generateLessonPayload` function explicitly hardcodes `itemType: 'word'` for all items, including traces.
1. Modify `server/services/srsEngine.js`.
2. Update the payload loop to assign `itemType: 'letter'` if `w.lessonType === 'trace'`.

### Step 2: Fix Backend API Stats (`api.js`)
The stats logic currently queries by `itemType: 'letter'`. While Step 1 fixes future progress, we should also handle the existing data or unify the query.
1. Modify `server/routes/api.js`.
2. In the `masteredCharacters` calculation (used in both `POST /api/progress/update` and `GET /api/progress/stats`), update the query to find progress items where the `itemId` starts with "t" (trace) OR the `itemType` is 'letter'.
3. **Preferred Fix:** Update the query to identify "mastered characters" by finding items where the associated `Word` has `lessonType: 'trace'`.

### Step 3: Backend Data Migration (Optional but Recommended)
Clean up existing "corrupted" progress entries to ensure immediate UI feedback.
1. Create a temporary migration script or run a one-liner to update all `Progress` entries where `itemId` starts with "t" to have `itemType: 'letter'`.

### Step 4: Verification
1. Run backend tests to ensure `itemType` is correctly assigned in payloads.
2. Run a database audit to verify `masteredCharacters` is now populated for "Learner 1".
3. Check the UI to confirm "My Letters" shows the tracked characters.

## Testing Strategy
- **Unit Test:** Update `server/tests/session.test.js` to assert that trace items in the payload have `itemType: 'letter'`.
- **Integration Test:** Mock a trace completion and verify `masteredCharacters` in the response includes the character.
