# Plan: Fix Word Schema Validation Error

## Objective
Resolve the MongoDB validation error (`lessonType: 'match' is not a valid enum value`) by updating the Mongoose schema to recognize the new `SoundMatcher` game type.

## Scope & Context
- `server/models/Word.js`: Update the `lessonType` enum.

## Implementation Steps
1. **Schema Update:** Edit `server/models/Word.js`. Change the `lessonType` enum from `['trace', 'build']` to `['trace', 'match', 'build']`.
2. **Backend Restart:** Run `node seeder.js` in the `/server` directory to confirm the data imports successfully without validation errors.
3. **Closing Actions:** 
   - Commit the hotfix to the `dev` branch.
   - Update `client/src/config/version.js` to `2026.05.27.015`.
   - Update `.gemini/log/CHANGELOG.md`.

## Verification
- Observe the console output of `node seeder.js`. It should report "✅ Data import completely successful!" instead of a validation error.