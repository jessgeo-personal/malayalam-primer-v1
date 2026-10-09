# Prototype Plan: The Prototype Lab (Sandboxing)

## 🎯 Objective
Create a dedicated "Prototype Lab" screen accessible from the global footer. This lab will serve as a permanent, isolated testing environment for new UI experiments (like the Time Machine) and provide interactive sandboxes for past mechanics (like Tracing and Word Assembly) without risking corruption of the user's live curriculum or SRS progress.

## 📂 Key Files & Context
*   **New Component:** `client/src/components/ui/PrototypeLab.jsx`
*   **Modified Routing:** `client/src/App.jsx`
*   **Existing Prototypes:** `TimeMachineZones.jsx`, `TimeMachineSlider.jsx`
*   **New Sandboxes:** Wrappers for `TracingCanvas`, `LetterPicker`, etc.

## 🎨 UI/UX Design: The Lab Dashboard
*   **Layout:** A two-column or tabbed interface.
    *   **Sidebar/Nav:** A list of available prototypes (e.g., "Time Zones (V2)", "Time Slider (V1)", "Tracing Sandbox", "Assembly Sandbox").
    *   **Main View:** Renders the selected prototype.
*   **Visual Distinction:** The Lab should have a distinct background color or "blueprint" grid styling to clearly differentiate it from the live game (preventing user confusion).
*   **Warning Banner:** A persistent header explicitly stating "LAB MODE: Progress is not saved."

## 🛠️ Implementation Steps

### Phase 1: App Routing & Footer Integration
1.  In `client/src/App.jsx`, remove the temporary `showTimeMachine` state and the button from the top header.
2.  Add a new `showLab` state.
3.  In the footer, add a **"PROTOTYPE LAB"** button next to the existing **"DATABASE AUDIT"** button.
4.  When `showLab` is true, render the `PrototypeLab` component instead of the main game loop or map.

### Phase 2: Building the PrototypeLab Component
1.  Create `client/src/components/ui/PrototypeLab.jsx`.
2.  Implement a state variable to track the `activeExperiment`.
3.  Build a simple navigation menu to switch between experiments.

### Phase 3: Integrating Experiments (Current & Past)
1.  **Time Machine:** Move both `TimeMachineZones` and `TimeMachineSlider` into the Lab as selectable options.
2.  **Past Test 1 (Tracing Sandbox):** Create a simple wrapper that feeds a hardcoded mock word (e.g., `t001` - "അ") to the existing `TracingCanvas` component.
3.  **Past Test 2 (Assembly Sandbox):** Create a simple wrapper that feeds a hardcoded mock word (e.g., `w001` - "ഞാൻ") to the existing `LetterPicker` component.
4.  Ensure all wrappers pass a dummy `onComplete` function so they do not attempt to call the backend API.

### Phase 4: TDD & Guardrails
1.  Write `PrototypeLab.test.jsx`.
2.  Assert that navigating between the different tabs successfully renders the child components without crashing.
3.  Assert that the Lab is completely isolated and does not use `ProgressContext` mutating functions.

## 🧪 Verification Strategy
*   User will click the footer button to enter the Lab.
*   User will be able to freely test the Time Machine mechanics and the classic Tracing/Assembly mechanics using dummy data.
*   Exiting the Lab will return the user safely to the Adventure Map with their live session state intact.