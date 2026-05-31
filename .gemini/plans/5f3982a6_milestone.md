# Implementation Plan: Milestone 2.1 - Suffix Snapper

## Objective
Implement Phase 2, Milestone 2.1: The "Suffix Snapper" mini-game. This feature teaches basic grammar (plurals and case markers) through a drag-and-drop interface, utilizing an in-game guided tutorial for first-time encounters.

## Assumptions & Clarifications
1.  **Tutorial State Detection:** The backend (`srsEngine.generateLessonPayload`) will be responsible for determining if a user needs the tutorial. If a user has `encounters: 0` for a specific suffix concept (or it's their first time playing the lesson), the backend will attach `showTutorial: true` to the item payload.
2.  **Schema Expansion:** The `Word` schema will be expanded to include fields specific to the suffix game (`baseWord`, `targetSuffix`, `distractorSuffixes`) without breaking existing Phase 1 word definitions.
3.  **Seed Data:** A new `seed-200.json` file will be created containing the first batch of grammar lessons, specifically targeting plurals (`കൾ`, `മാർ`) and simple locations (`ൽ`).

## Key Files & Context
-   `server/models/Word.js`: Schema needs expansion to support `suffix` lesson types.
-   `server/services/srsEngine.js`: `generateLessonPayload` needs to handle the `showTutorial` logic.
-   `server/data/seed-200.json`: (NEW) Seed data for Phase 2 grammar rules.
-   `server/seeder.js`: Needs to handle loading `seed-200.json`.
-   `client/src/components/games/SuffixSnapper.jsx`: (NEW) The React component for the mini-game.
-   `client/src/App.jsx`: Needs to route `lessonType === 'suffix'` to the new component.
-   `.gemini/docs/regression_checklist.md`: Needs to be updated with Phase 2 test criteria.
-   `.gemini/log/CHANGELOG.md`: Needs to be updated upon completion.

## Implementation Steps (TDD Approach)

### Phase 1: Backend & Data Structure
1.  **Update Schema:** Modify `server/models/Word.js`.
    *   Add `'suffix'` to the `lessonType` enum.
    *   Add new optional string fields: `baseWord`, `targetSuffix`.
    *   Add a new optional array field: `distractorSuffixes` `[String]`.
2.  **Create Seed Data:** Create `server/data/seed-200.json`.
    *   Define at least 2 targeted lessons (e.g., Lesson 10 for `കൾ`, Lesson 11 for `ൽ`) and 1 mixed review lesson.
    *   Ensure all entries have `lessonType: 'suffix'`, a valid `baseWord`, a `targetSuffix`, and appropriate `distractorSuffixes`.
3.  **Update Seeder:** Modify `server/seeder.js` to process and insert data from `seed-200.json` alongside `seed-100.json`.
4.  **Write Backend Tests (Red Phase):** Add tests to `server/tests/srsEngine.test.js` or `api.test.js` verifying that `generateLessonPayload` correctly returns the new suffix fields and correctly calculates the `showTutorial` boolean based on user progress.
5.  **Implement Backend Logic (Green Phase):** Update `srsEngine.js` to pass the tests. Calculate `showTutorial` by checking if the user has an existing `Progress` record for the item being served.

### Phase 2: Frontend Implementation
1.  **Write Frontend Component Tests (Red Phase):** Create `client/src/components/games/tests/SuffixSnapper.test.jsx`.
    *   Test that it renders the `baseWord` and draggable suffix choices.
    *   Test the `isTutorial` prop: When true, it should render the pointing hand animation/guide.
    *   Test the drag-and-drop interaction: Correct suffix triggers `onComplete(true)`, incorrect triggers `onComplete(false)` and bounces back.
2.  **Build SuffixSnapper Component (Green Phase):** Create `client/src/components/games/SuffixSnapper.jsx`.
    *   Implement layout: Base word center-left, empty snap zone center-right, draggable choices at the bottom.
    *   Use `@dnd-kit/core` for drag interactions (similar to `LetterPicker`).
    *   Implement the visual tutorial animation using CSS or a library if `props.showTutorial` is true.
3.  **Integrate Component:** Update `client/src/App.jsx` (or the main game loop component) to render `<SuffixSnapper>` when `currentItem.lessonType === 'suffix'`, passing down the payload data and `showTutorial` flag.

### Phase 3: Verification & Documentation
1.  **Run Full Test Suite:** Execute `npm test` in both `/client` and `/server`. Ensure 100% pass rate.
2.  **Manual UI QA:** Verify the game looks correct on tablet dimensions, the magnetic snap feels right, and the tutorial hand points accurately.
3.  **Update Checklist:** Append the Suffix Snapper criteria to `.gemini/docs/regression_checklist.md`.
4.  **Update Changelog:** Document all changes in `.gemini/log/CHANGELOG.md`.
5.  **Bump Version:** Increment the version in `client/src/config/version.js`.

## Verification & Testing Strategy
*   **Accuracy (Backend):** The `Word` schema must strictly enforce the presence of `baseWord` and `targetSuffix` if `lessonType` is `'suffix'`. The SRS engine must accurately deliver the `showTutorial` flag only on the first encounter.
*   **Visual Consistency (Frontend):** The component must adhere to the "Soft Premium Neo-Bento" aesthetic (dark pills, creamy background) and function seamlessly on touch devices without requiring scrolling.
*   **Functional Adherence:** The drag-and-drop state must correctly evaluate the answer, provide auditory feedback, and report success/failure back to the central `ProgressContext` for scoring and SRS updates.
*   **Process Faultlines:** The game must gracefully handle cases where `distractorSuffixes` might be missing or empty by providing fallback incorrect options.
