# Implementation Plan: Time Machine Integration (Milestone 2.3)

## 🎯 Objective
Transition the successful "Time Zones" (drag-and-drop) prototype into a fully functional, SRS-tracked mini-game within the core learning loop. This component will officially teach the Past, Present, and Future verb tenses (Bucket 3) to fulfill Milestone 2.3.

## 📂 Key Files & Context
*   **New Game Component:** `client/src/components/games/TimeMachine.jsx` (Refactored from the prototype `TimeMachineZones.jsx`).
*   **App Routing:** `client/src/App.jsx`
*   **Database Schema:** `server/models/Word.js`
*   **Seed Data:** `server/data/seed-200.json` (Adding the new tense lessons).
*   **Test Suite:** `client/src/tests/TimeMachine.test.jsx`, `server/tests/integrity.test.js`

## 🛠️ Implementation Steps

### Phase 1: Database Schema Expansion
1.  **Update `Word.js` Model:** The current schema supports `lessonType: 'concept' | 'trace' | 'match' | 'build' | 'suffix'`. We must explicitly support `lessonType: 'tense'`.
2.  **Add Tense Payload Fields:** The game requires a base word, its morphed forms, and English translations. Add the following fields to `WordItemSchema` if they don't cleanly map to existing fields:
    *   `pastForm`: String
    *   `presentForm`: String
    *   `futureForm`: String
    *   `pastEnglish`: String
    *   `presentEnglish`: String
    *   `futureEnglish`: String

### Phase 2: Seed Data Injection (Cycle 2)
1.  **Update `seed-200.json`:** Add new lesson entries (e.g., `lessonId: 18`) that introduce verb tenses.
2.  *Example Entry:*
    ```json
    {
      "wordId": "tm001",
      "malayalamText": "പോ",
      "englishTranslation": "Go",
      "bucketId": 3,
      "unlockCycle": 2,
      "lessonId": 18,
      "lessonType": "tense",
      "baseWord": "പോ",
      "pastForm": "പോയി",
      "presentForm": "പോകുന്നു",
      "futureForm": "പോകും",
      "pastEnglish": "Went",
      "presentEnglish": "Going",
      "futureEnglish": "Will go"
    }
    ```

### Phase 3: The Component Refactor
1.  **Rename & Refactor:** Copy `TimeMachineZones.jsx` to `TimeMachine.jsx` inside the `games` folder.
2.  **Remove Prototype Scaffolding:** Strip out the `mockAction` and manual "Next" button logic.
3.  **Hook into Progression:** The component must now accept `word` and `onComplete` props.
    *   `const targetTense` should be randomly assigned on mount (e.g., 'past').
    *   When the child successfully drags the tile to the correct target zone:
        *   Trigger `audioEngine.speak()`.
        *   Wait 1.5 seconds for the audio to finish.
        *   Call `onComplete(true, responseTime)`.
    *   If dragged to the WRONG zone:
        *   Play an error sound (or visual shake).
        *   Call `onComplete(false, responseTime)`.
        *   Reset the tile to the pool.

### Phase 4: App Dispatcher Integration
1.  **Update `App.jsx`:** Add `TimeMachine` to the `games` imports.
2.  **Render Logic:** In the `main` game switch statement, add:
    ```javascript
    currentItem.lessonType === 'tense' ? (
      <TimeMachine word={currentItem} onComplete={updateProgress} />
    )
    ```

### Phase 5: TDD & Regression
1.  **Backend Integrity:** Update `integrity.test.js` to ensure words with `lessonType: 'tense'` have the required `pastForm`, `presentForm`, and `futureForm` fields.
2.  **Frontend Unit Test:** Re-write `TimeMachine.test.jsx` to mount the live component with a mock `word` prop and verify `onComplete(true)` fires upon correct drag-and-drop.

## 🧪 Verification Strategy
*   Seed the database.
*   The user will play through a live Cycle 2 session until they encounter the new Time Machine lesson.
*   Verify that correct/incorrect drops correctly update the SRS engine and trigger the Celebration Manager events.