# Changelog - Malayalam Prime

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

## [2026.06.02.023] - 2026-06-02
### Added
- **Milestone 2.4: Sentence Scrambler:** Introduced the Cycle 1 Capstone (Lesson 10) to teach SOV word order.
- **UX Prototyping:** Added 3 distinct interaction models to the Prototype Lab: 'Fridge Magnets', 'Puzzle Box', and 'Tap-to-Build'.
- **Dictionary Audit Enhancement:** Updated the audit tool to verify sentence parts and space-based assembly logic.
- **Curriculum Shift:** Programmatically shifted Cycle 2 lessons (11-16) to make room for the new capstone.
- **DND Dependencies:** Added `@dnd-kit/sortable` and `@dnd-kit/utilities` for horizontal list reordering.

## [2026.06.01.022] - 2026-06-01
