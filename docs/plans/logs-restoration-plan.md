# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.06.03.001] - 2026-06-03
### Added
- **Word Audit Tool v2:** Upgraded `WordAudit.jsx` with a Prerequisite Trace Checker, Atomic Split Visualizer, and Sequence Validator.
- **TDD Validation:** Created `client/src/tests/WordAudit.test.jsx` with 5 passing unit tests for audit logic.
- **Documentation Consolidation:** Mirrored 199 historical plans from temporary folders to `.gemini/plans/`.

## [2026.06.02.xxx] - 2026-06-02
### Added
- **3-Act Lesson Structure:** Standardized lessons into Act 1 (Alphabets), Act 2 (Words), and Act 3 (Sentences) with Hard-Gate Concept Screens.
- **Sentence Scrambler (Tap UI):** Refactored the scrambler to use a high-performance tap mechanic instead of drag-and-drop for sentences.
- **Time Machine (Prototype):** Initial interactive drag-and-drop game for verb tenses.
- **Prototype Lab:** Isolated environment for UI experiments and user testing.

### Fixed
- **Lesson Infinite Loops:** Resolved issue where incorrect scrambler answers caused infinite loops in Lesson 1.
- **Contrast Enhancements:** Updated SoundMatcher and Scrambler UI with higher contrast backgrounds for legibility.

## [2026.06.01.xxx] - 2026-06-01
### Added
- **Global Width Expansion:** Application container expanded to `max-w-[1600px]` to fill tablet screens.
- **Word Assembly Side-by-Side:** Redesigned word building with Assembly area (left) and Reference info (right).
- **Phonetic Split Audit:** Established the first comprehensive audit of Cycle 1 grapheme clusters.

### Fixed
- **Progress Tracking Sync:** Fixed `itemType` mismatch where letters were saved as words, causing empty "My Progress" strips.
- **Cycle Progression:** Updated backend logic to dynamically advance `user.currentCycle` upon lesson completion.

## [2026.05.31.xxx] - 2026-05-31
### Added
- **Mathra Reordering Logic:** Frontend now handles visual reordering of left-side (െ, േ) and surround mathras while maintaining phonetic order in the database.
- **Audit Dictionary (v1):** Initial implementation of the dictionary audit tool as a permanent feature.

### Fixed
- **Shortcut Grapheme Removal:** Removed shortcut characters (like 'ukha') from tracing; replaced with atomic 'u' modifier and 'ka' alphabet.
- **Complex Splitting:** Refactored splitting for complex ligatures like `YYa`, `nta`, and `sku`.

## [2026.05.30.xxx] - 2026-05-30
### Added
- **Suffix Snapper:** Interactive mini-game for plural markers and locative case markers.
- **Sandhi Morphing:** Visual animation support for Malayalam stem changes (e.g., Veedu -> Veeduu).
- **Concept Summaries:** Automated UI animations to explain grammatical rules before gameplay.

### Fixed
- **Database Normalization:** Purged and re-ingested dictionary to align Cycle/Lesson boundaries.
- **Adventure Map Alignment:** Fixed lesson ranges in Cycle 2 to prevent duplication and locking issues.

## [2026.05.29.xxx] - 2026-05-29
### Added
- **Multi-User Isolation:** Support for 3 independent learners with persistent state per user.
- **Tablet-First Tracing:** Side-by-side layout for drawing pad and controls (No-scroll UX).

### Fixed
- **Scoring Bounds:** Total score strictly tied to lesson stars (1*=100, 2*=200, 3*=300).
- **Restart Session:** Implemented global reset button with confirmation safety.

## [2026.05.28.xxx] - 2026-05-28
### Added
- **Soft Premium "Neo-Bento" UI:** Warm creamy background, high-resolution cards, and dark charcoal action pills.
- **Malayalam Express UI:** Adventure Map reskinned as a train with Engine (Revision) and Bogeys (Lessons).
- **Terminology Simplification:** Replaced technical jargon (Grapheme, Sync) with learner-friendly terms (Letter, Practice).

## [2026.05.27.xxx] - 2026-05-27
### Added
- **Phase 0 (Tracing):** Implementation of HTML5 tracing canvas for Malayalam graphemes.
- **SRS Engine Implementation:** Initial 3-tier adaptive scoring logic (Letter/Word/Sentence).
- **Word Splitting Protocol:** Established the atomic grapheme cluster strategy for database seeding.

## [2026.05.26.xxx] - 2026-05-26
### Added
- **Monorepo Scaffolding:** Initialized React/Vite client and Node/Express server.
- **Core Schemas:** Defined Mongoose models for User, Word, and Progress.
- **Docker Setup:** Configured `docker-compose.yml` for localSynology deployment.
