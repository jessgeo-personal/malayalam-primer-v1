# Implementation Plan: Time Machine Frontend Integration

## 🎯 Objective
Refactor the successful "Time Zones" (drag-and-drop) prototype into the production `TimeMachine.jsx` component. Integrate this component into the main `App.jsx` game loop so that words with `lessonType: 'tense'` are rendered correctly and progress is tracked via the SRS engine.

## 📂 Key Files & Context
*   **Target Component:** `client/src/components/games/TimeMachine.jsx`
*   **Exports:** `client/src/components/games/index.js`
*   **Routing & Dispatch:** `client/src/App.jsx`
*   **Testing:** `client/src/tests/TimeMachine.test.jsx`

## 🛠️ Implementation Steps

### Phase 1: Production Component Refactor (`TimeMachine.jsx`)
1.  Copy the logic and UI from `TimeMachineZones.jsx` into a new file `TimeMachine.jsx`.
2.  **Prop Updates:** 
    *   Remove `mockAction`.
    *   Accept `word` (the live database object) and `onComplete` (the callback function) as props.
3.  **Progression Logic:**
    *   On mount, randomly select a `targetTense` ('past', 'present', or 'future').
    *   Map the `word` data to the UI:
        *   Base Tile: `word.baseWord`
        *   Past Zone: `word.pastForm`
        *   Present Zone: `word.presentForm`
        *   Future Zone: `word.futureForm`
        *   Target English Text: `word.pastEnglish`, `word.presentEnglish`, or `word.futureEnglish`.
4.  **Handling Drops:**
    *   When the tile is dropped into a zone:
        *   Record response time.
        *   If the zone matches `targetTense`: Trigger audio `audioEngine.speak(morphedWord)`, display success UI, wait ~1.5s, then call `onComplete(true, responseTime)`.
        *   If incorrect: Play error sound (optional visual shake), call `onComplete(false, responseTime)`, and reset the tile so the user can try again.

### Phase 2: App Integration
1.  **Update `games/index.js`:** Export `TimeMachine`.
2.  **Update `App.jsx`:** Import `TimeMachine`.
3.  **Dispatcher Logic:** In `App.jsx`'s main `<main>` block, add the routing logic for the new lesson type:
    ```javascript
    currentItem.lessonType === 'tense' ? (
      <TimeMachine word={currentItem} onComplete={updateProgress} />
    )
    ```

### Phase 3: TDD & Cleanup
1.  **Update `TimeMachine.test.jsx`:** Refactor the tests to mock the `word` and `onComplete` props. Ensure that dragging to the correct zone fires `onComplete(true)` and dragging to the wrong zone fires `onComplete(false)`.
2.  **Cleanup (Optional):** We can retain the prototypes in `PrototypeLab` but they should remain visually distinct from the production component.

## 🧪 Verification Strategy
*   We will temporarily mock the active lesson in `App.jsx` or use a test account to trigger a 'tense' lesson type.
*   Verify the drag-and-drop interaction works with real schema data.
*   Verify `onComplete` correctly progresses the session.