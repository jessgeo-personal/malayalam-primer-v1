# Implementation Plan: Fix Lesson 1-3 Sequencing and Replay Logic

## Background & Motivation
The recent addition of the 3-Act structure (Concept Screens gating sections of a lesson) introduced a bug where the backend `srsEngine.js` entered an infinite loop for the Act 1 Concept screen. This was caused by a rule that prevented 'concept' items from ever being skipped in subsequent lesson chunks.
Simultaneously, the frontend and backend lacked a way to communicate which items were completed in the *current* session, causing Replay mode to either be broken or incorrectly skip items.

The goal is to fix the chunking logic so that:
1. First-time players progress naturally from Act 1 -> Act 2 -> Act 3.
2. Replay mode plays the entire lesson again.
3. In Replay mode, Concept screens correctly appear immediately before their respective game modes (Tracing, Building, Scrambling).

## Scope & Impact
- `client/src/context/ProgressContext.jsx`
- `server/routes/api.js`
- `server/services/srsEngine.js`

## Proposed Solution

### 1. Frontend: Track and Send Current Session Progress
Modify `ProgressContext.jsx` to pass the `completedItems` set to the backend when fetching the next lesson chunk. This tells the backend exactly what the user has already played *in this specific session*, preventing infinite loops.

### 2. Backend: Detect Replay Mode
Update `srsEngine.js` (and import the `User` model) to check if the `lessonId` being requested is already present in the `user.lessonHistory`. If it is, `isReplay` is `true`.

### 3. Backend: Dynamic Skip Logic
Refactor `generateLessonPayload` to handle the skip logic conditionally:
- **Skip if completed this session:** If an item's ID is in the `completedIds` array sent by the frontend, ALWAYS skip it.
- **Skip if previously mastered (First-Time Play only):** If `isReplay` is false, and the item has a `correctCount > 0` in the database, skip it (so the user resumes where they left off).
- **Remove the Concept Hack:** Remove the hardcoded `&& w.lessonType !== 'concept'` rule. The new `completedIds` logic handles concept skipping elegantly.

## Implementation Steps

1. **Update Frontend API Calls:**
   - In `ProgressContext.jsx`, inside `updateProgress`, calculate the current `completedItems` (including the item just finished) and append it as a query parameter `completed=${completedParam}` to the `/api/session/lesson` fetch.

2. **Update Backend API Route:**
   - In `server/routes/api.js` (`GET /api/session/lesson`), extract `req.query.completed`, split it into an array, and pass it to `generateLessonPayload`.

3. **Refactor SRS Engine:**
   - In `server/services/srsEngine.js`, import the `User` model.
   - Update `generateLessonPayload(userId, lessonId, completedIds = [])`.
   - Fetch the user to determine `isReplay`.
   - Update the `for (const w of words)` loop to apply the new skip logic.

## Verification & Testing
1. **First-Time Flow:** Start Lesson 1 with a new user. Verify Act 1 Concept -> Traces -> Act 2 Concept -> Builds -> Act 3 Concept -> Scrambles works without getting stuck on Act 1 Concept.
2. **Replay Flow:** Complete Lesson 1. Replay it. Verify the exact same Act 1 -> Act 2 -> Act 3 sequence occurs perfectly.
3. **Session Resumption:** Start Lesson 2. Play half of it. Reload the page. Start Lesson 2 again. Verify it resumes from where it left off.
4. **Automated Tests:** Ensure Vitest and Jest suites (`npm test`) remain 100% green.