# Plan: Fix 3-Act Lesson Gating (Backend Logic)

## Diagnosis
The reason all 3 context pages appear at the start is that `srsEngine.generateLessonPayload` is built to return an entire lesson's contents in one big array. It currently uses a simple grouping logic: 
1. `Concepts` first.
2. `Tracing` second.
3. `Others` randomized last.

Because all 3 Concepts in our new structure (Act 1, 2, and 3) are technically "unlocked" from a database perspective, the backend serves them all at the top of the session. The backend currently **ignores the prerequisite chain** within a single session fetch.

## Objective
To refactor the backend and frontend to respect "Dynamic Item Unlocking." Instead of pre-loading 40 items for a lesson, we will move towards a model where the frontend asks: "What is the next available item in this lesson?" 

## Implementation Steps

### 1. Refactor `srsEngine.js` (Backend)
- Modify `generateLessonPayload(userId, lessonId)`:
  - It must no longer return the full lesson. 
  - It should find ALL items in the lesson.
  - It must then filter these items based on the user's mastered progress.
  - An item is "Available" ONLY IF its `prerequisites` list is empty OR all IDs in its `prerequisites` list have a `correctCount > 0` in the `Progress` collection.
  - Return only the **first 5** available items to maintain the "5-Game Bundle" guardrail.

### 2. Update `ProgressContext.jsx` (Frontend)
- Update `startLesson(lessonId)`:
  - Since the backend now only returns a small "unlocked" chunk, the frontend must be ready to re-fetch when it runs out of items.
- Update `updateProgress()`:
  - When the user finishes the last item in the current `sessionItems` array, instead of completing the lesson, the frontend should check if there are more items to fetch for the current `activeLessonId`.
  - If more items exist, append them to the session. 
  - If no more items are returned, *then* call `completeSession`.

### 3. Verification & TDD
- **Integrity Test:** Add a test that simulates a fresh user and asserts that `GET /api/session/lesson?lessonId=1` returns ONLY the Act 1 Concept and the first few tracing tasks, and **NOT** the Act 2/3 concepts.
- **Frontend Test:** Verify that mastering an Act 1 character correctly triggers a state update that allows the next item to be fetched.

## Benefits
- **Zero Premature Sentences:** Act 2 and Act 3 Concepts (and their games) will be physically invisible to the frontend until the user has actually finished the preceding requirements.
- **True SRS:** If a user fails an item, it remains "un-mastered," keeping the next Act gated until they fix it.

---
**[APPROVAL REQUIRED]: Please approve this logic refactor plan so I can fix the 3-Act Structure behavior.**