# Changelog - Malayalam Prime

## [2026.06.02.029] - 2026-06-02
### Fixed
- **3-Act Structure Gating:** Refactored the backend to return only the first available concept screen, preventing context page stacking.
- **Act-Specific Summaries:** Implemented a new preview filtering logic that ensures context pages only list letters/words/sentences relevant to the current Act.
- **Dynamic Session Unlocking:** Updated the frontend to dynamically fetch the next "unlocked" chunk of a lesson, allowing for real-time progression through Act gates.

## [2026.06.02.028] - 2026-06-02
### Fixed
- **Dependency Restoration:** Reinstalled `@dnd-kit/core` and `@dnd-kit/utilities` required by LetterPicker, SuffixSnapper, and TimeMachine.

## [2026.06.02.025] - 2026-06-02
### Fixed
- **Sentence Scrambler Progression:** Fixed an infinite loop where correct answers were treated as failures due to a missing boolean flag in the `onComplete` callback.
- **Component State Refresh:** Resolved the "random refresh" issue by adding unique keys to mini-games in `App.jsx`, ensuring clean mounting/unmounting between session items.
- **Response Time Tracking:** Added `startTime` logic to correctly report performance data for `scramble` items.

## [2026.06.02.024] - 2026-06-02
### Added
- **Curriculum Restructure (Lessons 1-3):** Completely re-aligned the first three lessons to introduce functional sentence building from Day 1.
- **Micro-Scrambles:** Injected basic 2-word and 3-word "Tap-to-Build" exercises into early lessons to bridge the gap to complex grammar.
- **Immediate Utility:** Added high-frequency words like 'Aana' (Elephant) and family terms to Lesson 1 to make initial learning more engaging.

## [2026.06.01.022] - 2026-06-01
