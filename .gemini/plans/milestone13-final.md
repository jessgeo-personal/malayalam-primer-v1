# Implementation Plan: Milestone 1.3 - Cycle 1 Intro Screens

## Background & Motivation
In accordance with the project roadmap (Phase 1), we need to add an instructional summary page before every interactive lesson in Cycle 1. This provides the 8-year-old user with a clear explanation of what they are about to learn and interactively previews the vocabulary (with audio) before they are tested on it. This aligns with the approach established in Cycle 2 for Grammar Rules (Concept Screens), maintaining architectural consistency.

## Scope & Impact
*   **Database:** `seed-100.json` will receive 9 new entries (`lessonType: 'concept'`).
*   **Frontend:** `ConceptScreen.jsx` will be upgraded to support a new "Summary" visual mode, complementing its existing "Grammar/Animation" mode used in Cycle 2.
*   **API:** The frontend will utilize the existing `/api/session/lesson/preview` endpoint to dynamically fetch the vocabulary for the summary grid.
*   **No DB Schema change:** The `Word` model handles flexible fields well, so adding an `isSummary: true` flag will not require a strict schema update.

## Implementation Steps (TDD Approach)

### Phase 1: Data Seeding & Logic Validation
1.  **Update `seed-100.json`:**
    *   Inject 9 new items (e.g., `wordId: "c001"` through `"c009"`) at the start of Lessons 1 through 9.
    *   Structure:
        ```json
        {
          "wordId": "c001",
          "malayalamText": "Lesson 1: The Basics",
          "englishTranslation": "First trace the letters, then match the sounds, and finally build the words!",
          "bucketId": 0,
          "unlockCycle": 1,
          "lessonId": 1,
          "lessonType": "concept",
          "isSummary": true,
          "prerequisites": []
        }
        ```
    *   Run `node seeder.js` in the backend.
2.  **Backend Verification (Red/Green Phase):**
    *   Update `srsEngine.test.js` to assert that when `generateLessonPayload` is called for Lesson 1, the first returned item is the new concept screen item.

### Phase 2: Frontend ConceptScreen Enhancement
1.  **Frontend Test (Red Phase):**
    *   Update `ConceptScreen.test.jsx`. Add a test block describing the new `isSummary` behavior.
    *   Assert that when `word.isSummary === true`, it displays the target vocabulary grid and speaker icons, and that clicking a speaker icon triggers `audioEngine.speak`.
2.  **Component Build (Green Phase):**
    *   Modify `client/src/components/games/ConceptScreen.jsx`.
    *   If `word.isSummary` is true, use `useEffect` to fetch the lesson payload from `/api/session/lesson/preview?lessonId=${word.lessonId}`.
    *   Filter out the concept item itself, leaving only the interactive words (traces, matches, builds).
    *   Render a "Soft Premium Neo-Bento" grid layout displaying each word's `malayalamText` and `englishTranslation`.
    *   Integrate `audioEngine.speak` on an interactive 🔊 button for each grid item.

### Phase 3: Regression & Validation
1.  **Test Suite Execution:** Run `npm test` in both `/client` and `/server`. Ensure absolute 100% green output.
2.  **UI/UX QA (Tablet Focus):** Verify the grid layout scales well on tablet viewports and touch targets for the audio buttons are large enough.
3.  **Documentation:** Append "Cycle 1 Intro Screens" to `.gemini/docs/regression_checklist.md` and document the update in `.gemini/log/CHANGELOG.md`.
4.  **Version Bump:** Increment the build version in `client/src/config/version.js`.

## Verification & Testing Strategy
*   **Accuracy:** Ensure the API fetch in `ConceptScreen` correctly returns the isolated lesson data without mutating the user's SRS progress prematurely.
*   **Visual Consistency:** The new grid must match the project's standard 32px rounded bento cards and creamy background colors.
*   **Process Faultlines:** If the API fetch for the preview fails in `ConceptScreen`, it must degrade gracefully (e.g., showing just the instruction text and the "GOT IT!" button so the user is not soft-locked).