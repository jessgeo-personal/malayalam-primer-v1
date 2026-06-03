# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.06.03.001] - 2026-06-03
### Added
- **Cycle 1 High-Density Expansion:** Completed expansion for Lessons 1-7 with 5 sentences per lesson.
- **Locative Case Extension:** Introduced 'yil' (**യിൽ**) as a character sequence extension in Lesson 6 to support location-based sentences (e.g., **കടയിൽ**).
- **Interrogative Vocabulary:** Added 32+ new high-density words and 15+ new sentences across Who, What, Where, and When.
- **Word Audit Tool v2:** Upgraded `WordAudit.jsx` with a Prerequisite Trace Checker, Atomic Split Visualizer, and Sequence Validator.
- **TDD Validation:** Created `client/src/tests/WordAudit.test.jsx` with 5 passing unit tests for audit logic.
- **Backend Integrity Tests:** Added sequential lesson validation, orphan character detection, and 3-Act structure auditing to `server/tests/integrity.test.js`.
- **Documentation Consolidation:** Mirrored 199 historical plans from temporary folders to `.gemini/plans/`.

### Fixed
- **Surround Mathra UX Regression:** Reverted `LetterPicker.jsx` rendering logic to restore the "hide until placed" behavior for surround mathras (like 'ോ'), maintaining the pedagogical challenge.
- **Visual Mathra Alignment:** Added the 'ra-subscript' (്ര) to the `LEFT_MATHRAS` array to visually reorder it before the consonant without breaking phonetic database integrity.
- **Idiomatic Grammar:** Corrected Lesson 7 translations, replacing literal phrasing with conversational Malayalam (e.g., "സമയം എത്രയായി?").
- **Future Tense Correction:** Corrected tense mismatch in Lesson 7 by replacing "പോയി" (went) with "പോകാം" (will go) for future contexts.
- **Lesson 6 Conjunct Alignment:** Added 'സ്ക' (ska) as an explicit trace and corrected the assembly of 'സ്കൂൾ' (school) to use this conjunct as a recognizable block.
- **Vocabulary Correction:** Corrected the word for "Hill" in Lesson 6 from the genitive form 'kunnin' to the base nominative form 'kunnu' (കുന്ന്).
- **Character Standardization:** Standardized the 'nta' conjunct to the Chillu-N form `ൻ്റ` throughout the dictionary for improved visual clarity.
- **Pedagogical Orphan Fixes:** Resolved missing traces for characters 'യ', 'എ', and 'ൻ്റ' in Lesson 4, ensuring all sentence components are explicitly taught in Act 1.
- **Standardized Conjuncts:** Standardized 'പ്പ' conjunct sequences across Cycle 1 vocabulary for zero-error assembly.
- **Duplicate Record Cleanup:** Resolved MongoBulkWriteError by re-indexing and cleaning redundant scramble IDs in `seed-100.json`.
- **Lesson Sequencing & Replay Integrity:** Fixed a critical bug where replaying a lesson caused Concept screens to appear out of order. Prerequisites now strictly check the current session progress during replays, guaranteeing the 3-Act (Alphabets -> Words -> Sentences) sequence.

## [2026.06.02.xxx] - 2026-06-02
### Added
- **3-Act Structure Gating:** Refactored the backend to return only the first available concept screen, preventing context page stacking.
- **Act-Specific Summaries:** Implemented a new preview filtering logic that ensures context pages only list letters/words/sentences relevant to the current Act.
- **Sentence Scrambler (Tap UI):** Refactored the scrambler to use a high-performance tap mechanic instead of drag-and-drop for sentences.
- **Time Machine (Prototype):** Initial interactive drag-and-drop game for verb tenses.
- **Prototype Lab:** Isolated environment for UI experiments and user testing.

### Fixed
- **Lesson Infinite Loops:** Resolved issue where incorrect scrambler answers caused infinite loops in Lesson 1.
- **Contrast Enhancements:** Updated SoundMatcher and Scrambler UI with higher contrast backgrounds for legibility.
- **Component State Refresh:** Resolved the "random refresh" issue by adding unique keys to mini-games in `App.jsx`, ensuring clean mounting/unmounting between session items.

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
- **Docker Setup:** Configured `docker-compose.yml` for local Synology deployment.
