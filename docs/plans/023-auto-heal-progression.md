# Plan: 023 - Auto-Heal Cycle Progression

## Objective
Fix the "stuck cycle" issue for users who completed lessons *before* the dynamic cycle progression logic was introduced in Plan 022. We need to implement a "self-healing" mechanism that automatically resyncs the user's `currentCycle` based on their `currentLesson` every time the app loads.

## Investigation Summary (The Deep Dive)
- **How it works now:** The cycle shift is triggered *only* at the exact moment a user finishes a lesson (`POST /api/session/lesson/complete`). The backend calculates the next lesson, checks which cycle that lesson belongs to, and updates the user's profile.
- **Why it failed for the user:** The user completed Lesson 9 *before* this new trigger was added. Therefore, their database record advanced to `currentLesson: 10`, but their `currentCycle` remained `1`. Simply restarting the server doesn't retroactively fire the "lesson complete" trigger.
- **The Solution:** Add a check to `GET /api/progress/stats` (which runs every time the app opens). If `currentLesson: 10` belongs to Cycle 2, but the user is stuck on Cycle 1, it will automatically bump them to Cycle 2 and save the fix to the database.

## Implementation Steps

### Step 1: Add Auto-Heal Logic to Stats Endpoint (`api.js`)
1. Open `server/routes/api.js`.
2. Locate the `GET /api/progress/stats` route.
3. Before calculating `activeCycle` and `cycleProgress`, add a self-healing check:
   - Query the `Word` collection for any item matching `user.currentLesson`.
   - If the item's `unlockCycle` is greater than `user.currentCycle`, update `user.currentCycle` to match the item's `unlockCycle`.
   - Call `await user.save()` to persist the retroactive fix.
4. Continue with the rest of the stats calculation using the newly synced cycle.

### Step 2: Verification
- Review the code to ensure the `user.save()` call does not introduce significant latency to the app load time.
- Update the regression checklist.