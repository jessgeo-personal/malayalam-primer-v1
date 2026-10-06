# Prototype Plan: The Tense Time Machine (Milestone 2.3)

## 🎯 Objective
Build a standalone, testable UI prototype for teaching verb tense transformations (Past vs. Present). This fulfills Milestone 2.3 of the Grammar Factory. The prototype will use a **Slider (Dial)** interaction model and will be temporarily accessible for the user to test before we integrate it into the SRS engine and create official database lessons.

## 📂 Key Files & Context
*   **New Component:** `client/src/components/games/TimeMachine.jsx`
*   **Routing (Temporary):** `client/src/App.jsx` (to expose the prototype)
*   **Test Suite:** `client/src/components/tests/TimeMachine.test.jsx`
*   **Data Mock:** Hardcoded state within the component for testing (no backend dependency yet).

## 🎨 UI/UX Design: The Time Machine Slider
*   **Concept:** A central "Dashboard" showing a base action. Below it, a horizontal slider track.
*   **The Slider:** A draggable handle (thumb).
    *   **Left Side (Yesterday/ഇന്നലെ):** Represents the Past tense (e.g., പോയി - Went). Color: Muted/Cool (e.g., Slate or Blue).
    *   **Right Side (Today/ഇന്ന്):** Represents the Present tense (e.g., പോകുന്നു - Going). Color: Active/Warm (e.g., Orange or Green).
*   **Interaction:**
    *   The user drags the slider to match the requested English translation (e.g., "Match: Went").
    *   As the slider moves, the Malayalam text in the central dashboard dynamically morphs (using simple CSS opacity crossfading or text replacement) to show the tense change.
*   **Feedback:**
    *   **Visual:** The drop zones highlight when the slider snaps into place.
    *   **Audio:** Plays the phonetic TTS *only* on successful placement in the correct tense.

## 🛠️ Implementation Steps

### Phase 1: The Component Build
1.  Create `TimeMachine.jsx` in the `games` folder.
2.  Implement the UI structure matching the "Soft Premium Neo-Bento" style (rounded cards, thick borders, large typography).
3.  Use a standard HTML `<input type="range">` customized with Tailwind, OR a basic `@dnd-kit/core` implementation restricted to horizontal movement. (Given our tablet focus and need for snap-to-zones, a controlled `touch/mouse` event or a 3-step range slider `[-1, 0, 1]` is often more reliable than complex drag physics). Let's use a stylized HTML range slider for the prototype for maximum touch compatibility.
4.  Mock internal data: `[{ base: 'പോ', past: 'പോയി', present: 'പോകുന്നു', englishPast: 'Went', englishPresent: 'Going' }]`.

### Phase 2: Temporary Prototype Routing
1.  Modify `App.jsx` or the `WordAudit.jsx` area to include a temporary "TEST TIME MACHINE" button.
2.  When clicked, bypass the standard SRS loop and mount the `TimeMachine` component with the mocked data so the user can test the feel.

### Phase 3: TDD & Guardrails
1.  Create `TimeMachine.test.jsx`.
2.  Write tests to ensure:
    *   The component renders the English prompt correctly.
    *   Moving the slider updates the displayed Malayalam text.
    *   Reaching the target triggers the success callback (which will eventually be `updateProgress`).

## 🧪 Verification Strategy
*   User will test the prototype on their tablet to ensure the slider feels "juicy" and responsive.
*   Once the physical interaction is approved, we will proceed to Phase 2: defining the backend payload schema (`lessonType: 'tense'`) and seeding the new Cycle 2 tense lessons.