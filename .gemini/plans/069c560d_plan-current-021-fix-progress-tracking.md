# Plan: 021 - Fix Progress Tracking & Mastery HUD

## Objective
Fix the "My Letters" and "My Progress" sections which are currently empty despite user progress. The root cause is a mismatch in the `itemType` field: trace items (letters) are being saved with `itemType: 'word'` in the database, but the stats logic looks for `itemType: 'letter'`.

## Investigation Summary
- **Data Reality:** All trace items (e.g., `t001`) are currently stored with `itemType: 'word'` in the `Progress` collection because the payload generator hardcodes it.
- **Code Assumption:** `server/routes/api.js` filters for `itemType: 'letter'` to populate `masteredCharacters`.
- **UI Assumption:** The frontend relies on `masteredCharacters` from the stats API to show learned letters in the Mastery Strip and HUD.

## Implementation Steps

### Step 1: Fix `srsEngine.js` Payload Generation
1. Modify `server/services/srsEngine.js`.
2. In `generateLessonPayload`, update the item construction to dynamically assign `itemType`. If `w.lessonType === 'trace'`, set `itemType: 'letter'`. Otherwise, use `itemType: 'word'`.

### Step 2: Fix Backend API Stats (`api.js`)
1. Modify `server/routes/api.js`.
2. In the `masteredCharacters` calculation (within both `POST /api/progress/update` and `GET /api/progress/stats`), update the query to find progress items that are actually letters. 
3. **Consistent Query:** Query where `itemType: 'letter'` OR `itemId` begins with "t".

### Step 3: Backend Data Migration
1. Run a one-time migration script to update existing `Progress` documents.
2. Any document with `itemId` starting with "t" should have `itemType` set to "letter".

### Step 4: Verification
1. Run backend tests.
2. Audit database for "Learner 1" to confirm `masteredCharacters` now returns data.

## Testing Strategy
- **Unit Test:** Update `server/tests/session.test.js` to assert that trace items in the payload have `itemType: 'letter'`.
- **Integration Test:** Verify `GET /api/progress/stats` returns characters if they exist in `Progress` under either type/prefix combo.
