# Plan: 005 - UI Language Simplification & Navigation Fix

## Objective
Remove overly technical and "cyber-pop" jargon from the UI to ensure the app is easily understandable for an 8-year-old child and a 45-year-old adult. Fix the non-functional "Settings" button in the navigation dock.

## Context
The user identified technical terms like 'daily sync', 'deploys', 'graphemes', and 'calibrate' as confusing. The UI should use simple, friendly, and pedagogical language.

## Terminology Suggestions (Simple vs. Current)
| Current Term | Simplified Suggestion |
| :--- | :--- |
| Daily Sync / Maintenance | Daily Practice / Daily Review |
| Grapheme | Letter / Sound |
| Collected Graphemes | Letters Learned / My Letters |
| Deploys: [X] Nodes | Lessons: [X] Games |
| Calibrate / Calibrate Grapheme | Trace the Letter |
| Signal Match | Sound Match / Listen & Pick |
| Signal Valid / Invalid Bit | Correct! / Try Again! |
| Perfect Sync / Stable Link | Great Job! / Good Work! |
| Initialize Trip | Start Lesson |
| Deployment Nodes | Lessons Completed |
| Sequence Synchronized | Session Complete |

## Key Files & Context
- `client/src/App.jsx`: Main UI headers, labels, and navigation dock.
- `client/src/components/ui/AdventureMap.jsx`: Revision card and lesson node labels.
- `client/src/components/games/SoundMatcher.jsx`: Feedback text and titles.
- `client/src/components/games/TracingCanvas.jsx`: Tracing hints and titles.
- `client/src/components/ui/MasteryStrip.jsx`: Headers (if applicable).

## Implementation Steps
### 1. Refactor `App.jsx`
- Replace "Collected Graphemes" with "My Letters".
- Replace "Perfect Sync" / "Stable Link" with "Excellent!" / "Well Done!".
- Replace "Sequence synchronized successfully" with "Great job completing your session!".
- **Navigation Dock:** Change ⚙️ button tooltip/label to "Restart Session" and ensure it triggers `resetSession` with a clear confirmation (using `window.confirm`).

### 2. Refactor `AdventureMap.jsx`
- Replace "Maintenance / Daily Sync" with "Daily Practice".
- Replace "Calibrate your local memory buffer" with "Review what you've learned today".
- Replace "DEPLOYS: [X] NODES" with "[X] Lessons Ready".
- Replace "INITIALIZE TRIP" with "START LESSON".

### 3. Refactor Game Components
- **SoundMatcher.jsx**: Change "Signal Match" to "Sound Match" and feedback to "Correct!" / "Not quite!".
- **TracingCanvas.jsx**: Change "Grapheme Trace" to "Trace the Letter" and "Calibrate Grapheme" to "Letter Trace".

### 4. Documentation Update
- Update `UI_CHARTER.md` to reflect the "Simple Language" philosophy.
- Update `regression_checklist.md` to include "Friendly Language Check".

## Verification & Testing
- **Visual Audit:** Manually check every screen to ensure no technical jargon remains.
- **User Flow:** Confirm the "Restart" button in the dock works as expected.
- **Responsive Check:** Ensure longer labels (e.g., "Lessons Completed" vs "Nodes") don't break layouts.
