# Plan: Refine 3-Act Structure (Gating & Act-Specific Summaries)

## Diagnosis
The current implementation of the 3-Act Structure has two critical logic flaws:
1.  **Concept Stacking:** The backend (`generateLessonPayload`) returns ALL unlocked concepts at once. If a user has mastered Act 1, the backend serves both Act 2 and Act 3 Concepts at the start of the next session.
2.  **Summary Overfetch:** The Concept Screen calls `/api/session/lesson/preview`, which returns a summary of the *entire* lesson's unlocked items. This causes the Act 1 context page to show words and sentences from Acts 2 and 3, which is confusing and spoils the progression.

## Objective
To enforce a "Single-Act" view. Each Act should feel like a distinct mini-session within the lesson.

---

## Implementation Steps

### 1. Refactor `srsEngine.js` (Backend)
- **`generateLessonPayload`:** Modify it to return only the **FIRST** available concept screen. If multiple concepts are unlocked, only the earliest one in the sequence should be served.
- **New Method `generateActPreview(userId, lessonId, conceptId)`:**
  - Fetches all items for the lesson.
  - Filters them to return only items that list the specific `conceptId` in their `prerequisites` array.
  - This ensures the summary grid is "Act-Specific."

### 2. Refactor `api.js` (Backend)
- Update `GET /api/session/lesson/preview`:
  - Accept an optional `conceptId` query parameter.
  - Call the new `generateActPreview` method if `conceptId` is provided.

### 3. Refactor `ConceptScreen.jsx` (Frontend)
- Update the `fetchSummary` logic:
  - Pass the current concept's ID to the preview API: 
    `fetch(`/api/session/lesson/preview?lessonId=...&conceptId=${word.wordId}&userId=...`)`
  - This ensures that the context page only lists the letters/words/sentences relevant to that specific Act.

### 4. Regression & Verification
- **TDD Test:** Add a test in `integrity.test.js` to verify that `preview` for `c001_a1` only returns tracing/matching items, and NOT words or sentences.
- **Visual Audit:** Confirm that starting Lesson 1 only shows ONE context page, and that page only lists the 12 alphabets for Act 1.

---
**[APPROVAL REQUIRED]: Please approve this plan to fix the 3-Act Structure gating and summary behavior.**