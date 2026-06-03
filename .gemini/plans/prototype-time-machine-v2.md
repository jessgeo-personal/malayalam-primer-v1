# Prototype Plan: Time Machine V2 (Dual Prototypes)

## 🎯 Objective
Build and compare two standalone UI prototypes for teaching verb tense transformations (Past, Present, Future). The prototypes must remain entirely isolated from the main game loop, SRS engine, and live curriculum data. 

## 📂 Key Files & Context
*   **Modified Component:** `client/src/components/games/TimeMachine.jsx` (will act as the container/toggle)
*   **New Component (Option 1):** `client/src/components/games/TimeMachineSlider.jsx` (Refined 3-point slider)
*   **New Component (Option 2):** `client/src/components/games/TimeMachineZones.jsx` (Drag-and-Drop)
*   **Routing (Temporary):** `client/src/App.jsx` (maintained isolated prototype access)
*   **Test Suites:** Updates to `TimeMachine.test.jsx`

## 🛠️ Implementation Steps

### Phase 1: Prototype Isolation & Data Mocking
*   Ensure all components rely exclusively on hardcoded mock data.
*   **Mock Data Expansion:** Expand the mock object to include Future tense.
    *   `{ base: "പോ", past: "പോയി", present: "പോകുന്നു", future: "പോകും", pastEnglish: "Went", presentEnglish: "Going", futureEnglish: "Will go", ...phonetics }`

### Phase 2: Option 1 (Refined Slider)
*   Create `TimeMachineSlider.jsx`.
*   **Layout:** Expand to use `max-w-[1400px]` for full tablet width.
*   **Interaction:** 3-stop slider (-1: Yesterday/Past, 0: Today/Present, 1: Tomorrow/Future).
*   **Feedback:** Remove auto-play audio. When the word is fully morphed and matches the target tense, display a large 🔊 speaker button beneath the word.

### Phase 3: Option 2 (Drag & Drop "Time Zones")
*   Create `TimeMachineZones.jsx`.
*   **Layout:** Three large drop zones (Yesterday, Today, Tomorrow) horizontally aligned.
*   **Interaction:** A draggable "Base Word" tile at the bottom. User drags the tile into the target zone.
*   **Feedback:** Upon dropping, the tile morphs into the correct tense. If it matches the target instruction, a 🔊 speaker button appears.

### Phase 4: Container & Routing
*   Refactor the existing `TimeMachine.jsx` to act as a wrapper.
*   Add a toggle switch (e.g., "Switch to Option 2") at the top of the wrapper to allow the user to instantly swap between the Slider and Drag-and-Drop interfaces.
*   Keep the existing "TIME MACHINE PROTOTYPE" button in `App.jsx` untouched.

## 🧪 Verification Strategy
*   **TDD:** Ensure both Option 1 and Option 2 can be rendered in isolation and their specific interactions (slider vs. dnd) trigger the correct success states.
*   **User Testing:** The user will test both options on their tablet to determine which mechanical interaction (Sliding vs. Dropping) feels more intuitive and pedagogical for an 8-year-old. No live lessons will be affected during this test.