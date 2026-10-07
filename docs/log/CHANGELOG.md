# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.10.06.001] - 2026-10-06
### Added
- **Task DEV-01: Auto-Seed on Boot & Single-Command Dev Runner:**
  - **Auto-Seed on Startup**: Refactored `server/seeder.js` to export an idempotent `seedDatabaseIfNeeded()` checking `Word.countDocuments()`. If count is 0 or less than Cycle 1 count in `seed-100.json`, populates MongoDB dictionary and logs `[AutoSeed] Dictionary populated successfully`. If already populated, logs `[AutoSeed] Dictionary up to date, skipping seed`.
  - **Server Integration**: Integrated `await seedDatabaseIfNeeded()` into `server/server.js` immediately following `mongoose.connect()`, prior to `app.listen()`.
  - **CLI Backwards Compatibility**: Maintained standalone `node seeder.js` and `npm run seed` CLI execution via `if (require.main === module)`.
  - **Monorepo Dev Runner**: Added root `package.json` with `concurrently` managing simultaneous boot of `server` (port 5000) and `client` (port 3000) with colored logs.
  - **Testing & Verification**: Added unit tests in `server/tests/seeder.test.js` validating auto-seed logic and skipping conditions. 100% green test pass across server (30 tests) and client (34 tests). Verified live concurrent boot with HTTP 200 OK responses.

## [2026.07.21.004] - 2026-07-21
### Fixed
- **Synology NAS Port Allocation Error (`Bind for 0.0.0.0:8080 failed`):** Updated `docker-compose.yml` frontend port mapping to `"${WEB_PORT:-3080}:80"` to avoid default port 8080 collisions on Synology NAS DSM.

## [2026.07.21.003] - 2026-07-21

### Fixed
- **Synology NAS "Server Offline" Connection Fix:** Migrated `docker-compose.yml` to a managed Docker volume (`mongodb_data`) to prevent host directory ACL/permission failures on Synology DSM 7.2. Added `GET /api/health` diagnostic route in `server/routes/api.js`.

## [2026.07.21.002] - 2026-07-21

### Fixed
- **Synology NAS SSL / Invalid Response Error (`ERR_SSL_PROTOCOL_ERROR`):** Resolved HTTPS vs HTTP browser mismatch on Synology NAS DSM by changing default frontend container port to `8080:80` and documenting explicit `http://` access & Reverse Proxy options in `.gemini/plans/034-fix-synology-ssl-connection-error.md`.

## [2026.07.21.001] - 2026-07-21

### Added
- **Synology NAS (DSM 7.2.2) Zero-Config Auto-Seeding:** Updated `server/server.js` to automatically import all seed files (`seed-100.json`, `seed-200.json`, `seed-300.json`) if MongoDB is empty on container startup.
- **Docker Compose Healthchecks:** Added `mongo:4.4` healthcheck and `service_healthy` dependency condition in `docker-compose.yml` to prevent backend race conditions on cold boot.
- **Deployment Documentation:** Formatted step-by-step instructions for Synology Container Manager deployment in `.gemini/plans/033-synology-nas-dsm722-migration.md`.

## [2026.06.05.001] - 2026-06-05

### Added
- **Cycle 1 Bridge Expansion (L11-14):** Appended four new high-density vocabulary lessons to Cycle 1 to provide the character and word foundations for Cycle 2 grammar.
- **New Lesson 11 (Nature):** Teaches Tree (മരം), Sea (കടൽ), Forest (കാട്), Stone (കല്ല്).
- **New Lesson 12 (Objects):** Teaches Book (പുസ്തകം), Box (പെട്ടി), Goat (ആട്), Tooth (പല്ല്) and the 'STa' (സ്ത) conjunct.
- **New Lesson 13 (Action Roots):** Teaches Go (പോ), Come (വാ), Play (കളി), Run (ഓടു) and the 'O' (ഓ), 'Da' (ഡ) characters.
- **New Lesson 14 (Past Tense):** Teaches Went (പോയി), Came (വന്നു), Played (കളിച്ചു).

### Changed
- **Lesson 7 Idiomatic Refactor:** Replaced unnatural English-transliterated sentences with functional, native-sounding Malayalam phrasing (e.g., "What time is it now?", "I have no time today").
- **Curriculum Sequential Shift:** Re-indexed Cycle 2 to Lessons 15-20 and Cycle 3 to Lessons 21+ to accommodate the new Cycle 1 bridge.
- **Global ID Safety:** Migrated bridge vocabulary to a namespaced ID system (`wb/tb/mb/ssb`) to prevent MongoDB duplicate key errors.

### Removed
- **Orphaned Seed Data:** Purged incorrectly placed Cycle 2-4 traces from `seed-100.json` to ensure clean pedagogical boundaries.

## [2026.06.03.003] - 2026-06-03
### Added
- **Lesson 8 Pedagogical Refinement:** Consolidated the separate 'nga' fragments into the full **`ങ്ങ`** (nnga) conjunct for a more intuitive and visually consistent tracing experience.

### Fixed
- **Lesson 8 Grammatical Accuracy:** Corrected the scramble sentences "സന്തോഷം ഉണ്ട്" to **"സന്തോഷം ആണ്"** (I am happy) and "അത് നല്ലത്" to **"അത് നല്ലതാണ്"** (That is good) to align with idiomatic Malayalam.
- **Word Building Refactor (L8):** Updated "engane" (`എങ്ങനെ`) to use the unified `ങ്ങ` block, matching the trace exactly.

## [2026.06.03.002] - 2026-06-03
### Added
- **Cycle 1 Expansion Completion:** Implemented Lessons 9 and 10 (Which? and How Many?), bringing the Cycle 1 core structural vocabulary to ~75 words.
- **New Adjective & Quantifier Vocabulary:** Added high-frequency words covering properties (Big, Small, Black, Red, Green, Blue, White) and quantities (One, Two, Three, Ten, All, Many, Few).
- **Grapheme Trace Additions:** Added specific trace sequences for `ഏ` (Ae), `റ` (Ra), `ള്ള` (Lla), and `ഒ` (O) to support the new vocabulary.

### Fixed
- **Trace Uniqueness:** Fixed duplicate `wordId` conflicts for newly introduced traces to prevent DB insertion failures.

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
