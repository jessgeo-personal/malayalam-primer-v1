# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [2026.10.08.004] - 2026-10-08
### Changed
- **Mobile-First Vertical Stacking for 'Your Progress' Card (`client/src/components/ui/AdventureMap.jsx`)**:
  - Configured upper grid container to mobile-first single column with tablet/desktop expansion (`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch`), allowing major blocks to take 100% width on phone screens (< md).
  - Enforced strict vertical stacking for Column 3 Stat Cards (`flex flex-col gap-3 sm:gap-4 justify-between h-full`) ensuring 'LESSONS COMPLETED' sits directly above 'TOTAL POINTS' across all viewports.
  - Scaled container padding responsive hierarchy (`p-4 sm:p-6 md:p-8`) and text sizes (`text-xl sm:text-2xl` for cycle header, `text-sm sm:text-base md:text-lg` for lesson title) to eliminate mobile clipping and overflow.
  - Verified exact top-to-bottom mobile order: 1. Cycle & Level Information, 2. 'NEXT UP' Card, 3. 'LESSONS COMPLETED' Card, 4. 'TOTAL POINTS' Card, 5. Full-Width Progress Bar.

## [2026.10.08.003] - 2026-10-08
### Changed
- **Emerald Green Theme for 'Your Progress' Hero Card (`client/src/components/ui/AdventureMap.jsx`)**:
  - Replaced container styling with rich emerald green palette (`bg-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-500`).
  - Header Row: Set title to bold white uppercase (`text-white font-black text-sm uppercase tracking-[0.2em]`), cycle badge to mint (`text-emerald-100 font-semibold`), and divider to `border-b border-emerald-500/50 pb-4 mb-6`.
  - Column 1 (Left): High-contrast dark emerald pill for Level (`bg-emerald-800/60 text-white border border-emerald-400/40 font-bold px-3 py-1 rounded-full text-xs`), cycle title in `text-2xl font-black text-white`, and guidance box in `bg-emerald-700/50 border border-emerald-400/30 text-white rounded-2xl p-4 text-xs font-medium leading-relaxed`.
  - Column 2 (Center - 'NEXT UP'): Crisp white island card (`bg-white text-slate-900 rounded-2xl p-5 shadow-md border border-emerald-100`) with emerald badge (`bg-emerald-600 text-white px-2 py-0.5 rounded-full`), bold title (`text-slate-900 font-black text-base sm:text-lg mt-1`), and dark action pill (`bg-[#1A1E26] hover:bg-slate-800 text-white font-bold rounded-xl`).
  - Column 3 (Right - Stacked Stats): Matching emerald cards (`bg-emerald-700/40 border border-emerald-400/30 rounded-2xl p-4 text-white`) with light mint labels (`text-emerald-100 text-xs font-bold uppercase tracking-wider`) and white values (`text-2xl font-black text-white mt-1`).
  - Progress Bar: Dark emerald track (`bg-emerald-950/40 border border-emerald-400/30 h-4 rounded-full overflow-hidden p-0.5`) with vibrant amber fill (`bg-amber-400 h-full rounded-full transition-all duration-700`), mint label, and white percentage text.

## [2026.10.08.002] - 2026-10-08
### Changed
- **High-Contrast Dark Color Scheme for 'Your Progress' Card (`client/src/components/ui/AdventureMap.jsx`)**:
  - Inverted outer hero card container to obsidian/charcoal theme (`bg-[#1A1E26] text-[#FFFDF6] border border-slate-700/60`).
  - Styled header and typography: High-contrast emerald badge (`text-emerald-400`), cream cycle title (`text-[#FFFDF6]`), muted slate labels (`text-slate-300`, `text-slate-400`).
  - Upgraded guidance box: Light amber/cream typography with translucent background (`text-amber-200/90 bg-amber-500/10 border border-amber-400/20`).
  - High-contrast level badge: Translucent pill with crisp white text (`bg-white/10 text-white border border-white/20`).
  - Enhanced internal cards:
    * 'NEXT UP' card: Dark translucent container (`bg-white/10 border border-white/15 text-white`) with high-contrast tactile action button (`bg-white hover:bg-slate-100 text-[#1A1E26]`).
    * Column 3 Stat Cards ('LESSONS COMPLETED', 'TOTAL POINTS'): Matching translucent containers (`bg-white/10 border border-white/15 text-white`) with clear slate labels (`text-slate-300`) and glowing white values (`text-white`).
    * Full-Width Progress Bar: High-contrast translucent track (`bg-white/20 border border-white/10`) with vibrant emerald fill (`bg-emerald-400`) and pure white percentage label (`text-white`).

## [2026.10.08.001] - 2026-10-08
### Added & Changed
- **Task UI-01: AdventureMap Bento Structure & Section Layout Refactor:**
  - **3-Column Hero Progress Card (`client/src/components/ui/AdventureMap.jsx`)**:
    - Transformed upper hero container into a responsive 3-column Neo-Bento grid (`grid-cols-1 md:grid-cols-3`):
      * **Col 1 (Left)**: Active Cycle metadata (`Cycle {activeCycle}: {cycleName}`), Learner Level badge, and replay guidance note (`⭐ Tap any completed train bogie below to replay and earn 3 stars!`).
      * **Col 2 (Center)**: 'NEXT UP' card featuring active target lesson indicator, lesson number/title, and prominent context-aware CTA pill (`🚀 Start Lesson X` or `▶ Resume Lesson X`).
      * **Col 3 (Right)**: Stacked stat cards for `📚 LESSONS COMPLETED` (`{completed} / {total}`) and `⭐ TOTAL POINTS` (`{points} pts`).
    - Added full-width (`w-full`) Cycle progress bar spanning the bottom of the hero card with percentage display.
  - **Eliminated Redundancies**:
    - Removed redundant learning plan cards, duplicate stats rows, and standalone `<h2>Lessons</h2>` header from `App.jsx`.
  - **Strict Vertical Page Hierarchy**:
    - Enforced the 5-step vertical section progression:
      1. **Your Progress** (Hero with embedded Next Up, Stacked Stats, and Full-Width Progress Bar)
      2. **Practice** (Daily Review / SRS revision card)
      3. **Adventure Map** (Malayalam Express Engine and Lesson Bogeys)
      4. **Fluency Master** (Milestone Badges & Cycle Streaks)
      5. **My Letters** (Mastery Strip / Learned Graphemes Shelf at the bottom)
  - **TDD Green State & Zero Regression**:
    - Backend: 10/10 test suites (54/54 tests) passing.
    - Frontend: 13/13 test suites (46/46 tests) passing.

## [2026.10.07.005] - 2026-10-07
### Added
- **Task AUTH-05: Auth & Navigation UX Polish (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-05-auth-and-navigation-ux-polish.md` (mirrored in `.gemini/plans/`) detailing onboarding name customization, profile dismissability, global scroll guarding, and context-aware adventure map CTAs.
  - **First Learner Onboarding (`POST /api/auth/verify-otp` & `PUT /api/auth/profiles/:profileId`)**:
    - Backend detects freshly created accounts or single-profile accounts with default name `'Learner 1'` and 0 progress, returning `isNewAccount: true`.
    - Implemented protected `PUT /api/auth/profiles/:profileId` validating name input, updating profile name within account, and enforcing account ownership boundaries (returning 404 for alien profiles).
    - `AuthContext.jsx` provides `updateProfileName` syncing state and local storage.
    - `AuthModal.jsx` introduces Step 3 ("Learner Onboarding") asking "What is your learner's name?" with placeholders ('Aarav', 'Diya') and a "Save & Start" CTA.
  - **Profile Selector Dismissability (`client/src/components/ui/ProfileSelector.jsx`)**:
    - Added styled "Cancel" button beside "Add Learner" and card header close button invoking `onClose` callback to dismiss the selector in `App.jsx`.
  - **Global Scroll Guard (`client/src/App.jsx`)**:
    - Added `useEffect` hook listening to `[activeView, activeLesson, currentAct]` executing instant top scroll on both window and main container elements across view/lesson/act transitions.
  - **Smart Hero CTAs (`client/src/components/ui/AdventureMap.jsx`)**:
    - Context-aware Hero card displaying `▶ Resume Lesson {currentLesson}` when lesson is active/paused, and `🚀 Start Lesson {currentLesson}` when starting fresh or completing previous lessons.
    - Included secondary motivation prompt: `"⭐ Want to improve your score? Tap any completed bogie on the train map below to replay for 3 stars!"`.
  - **TDD Green State & Zero Regression**:
    - Backend: 10/10 test suites (54/54 tests) passing in `server`.
    - Frontend: 13/13 test suites (45/45 tests) passing in `client`.

## [2026.10.07.004] - 2026-10-07
### Added
- **Task AUTH-04: Frontend Auth Flow (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-04-frontend-auth-flow-green-phase.md` (mirrored in `.gemini/plans/`) detailing Option 1 architecture, state models, UI component structures, and verification gates.
  - **AuthContext (`client/src/context/AuthContext.jsx`)**: Implemented dedicated authentication state provider managing JWT tokens, account data, active profile selection, OTP request/verification pipelines, profile creation, switching, and progress reset endpoints with dual `mp_*` and standard key localStorage persistence.
  - **AuthModal Component (`client/src/components/ui/AuthModal.jsx`)**: Built a tablet-first Neo-Bento 2-step modal supporting seamless email submission, 6-digit OTP verification, back navigation, and inline error feedback.
  - **ProfileSelector Component (`client/src/components/ui/ProfileSelector.jsx`)**: Implemented responsive 3-profile card grid with active indicators, profile switching, ceiling limit enforcement (disabling additions at 3 profiles), and confirmed per-profile progress resets.
  - **System Integration (`client/src/App.jsx` & `client/src/context/ProgressContext.jsx`)**: Connected `AuthProvider` to the application hierarchy, added an active profile/login badge to the header, and synced learner progress state to the active profile with safe fallback for unauthenticated play.
  - **TDD Green State & Zero Regression**: Verified 100% green pass on targeted tests (`client/src/tests/AuthFlow.test.jsx`, 6/6 tests), full client test suite (12/12 suites, 40 tests), and full server test suite (10/10 suites, 49 tests).

## [2026.10.07.003] - 2026-10-07
### Added
- **Task AUTH-03: Profile Independent Reset Endpoint & Handlers (GREEN PHASE):**
  - **Plan Documentation**: Created `docs/plans/AUTH-03-profile-reset-green-phase.md` (mirrored in `.gemini/plans/`) detailing route specification, multi-tenant isolation, Progress wipe mechanics, and verification criteria.
  - **Profile Reset Endpoint (`POST /api/auth/profiles/:profileId/reset`)**: Implemented protected route in `server/routes/auth.js` applying `authMiddleware`, verifying profile ownership within `req.account.profiles`, and returning `404 Not Found` if the profile is invalid or belongs to another account.
  - **Isolated Progress Purge**: Integrated `Progress.deleteMany({ userId: profileId })` to completely wipe spaced repetition and attempt logs exclusively for the target learner, preserving sibling profiles and alien account records intact.
  - **TDD Green State & Zero Regression**: Verified 100% green pass on `tests/profile_reset.test.js` (5/5 tests), full server test suite (10/10 suites, 49 tests), and full client test suite (11/11 suites, 34 tests).

## [2026.10.07.002] - 2026-10-07
### Added
- **Task AUTH-02: Profile Management & Switching (GREEN PHASE):**
  - **Auth Middleware (`server/middleware/auth.js`)**: Created reusable JWT Bearer token authentication middleware validating token integrity and attaching MongoDB account instance to `req.account`.
  - **Profile Listing (`GET /api/auth/profiles`)**: Protected endpoint returning authenticated account's profiles array.
  - **Profile Creation (`POST /api/auth/profiles`)**: Implemented profile creation with name validation, unique timestamp-based `profileId` generation, and strict enforcement of the 3-profile maximum ceiling (`400 Bad Request` with `Maximum of 3 profiles reached`).
  - **Active Profile Switching (`POST /api/auth/profiles/switch`)**: Protected endpoint verifying profile existence under authenticated account and returning active profile object.
  - **Atomic Query Refactor (`server/routes/auth.js`)**: Updated `POST /request-otp` to use atomic `findOneAndUpdate` with `returnDocument: 'after'` to prevent concurrent race conditions.
  - **TDD Green State**: Verified 100% green state on `server/tests/profiles.test.js` (8/8 tests passing), full backend test suite (9/9 suites, 44 tests passing), and full frontend test suite (11/11 suites, 34 tests passing).

## [2026.10.07.001] - 2026-10-07
### Added
- **Task AUTH-01: Backend Email + OTP Auth (GREEN PHASE):**
  - **Account Model (`server/models/Account.js`)**: Implemented Mongoose model with email indexing, OTP token/expiry timestamps, default profile initialization (`p1`, `'Learner 1'`), and auto-timestamps.
  - **Auth Router (`server/routes/auth.js`)**: Implemented Express endpoints `POST /request-otp` and `POST /verify-otp` with regex email verification, 6-digit numeric OTP generation, 10-minute expiry window, and replay protection (nullifying OTP upon verification).
  - **JWT Token Generation**: Successfully signed and issued 30-day JWT authentication tokens upon valid OTP verification.
  - **Server Integration (`server/server.js`)**: Mounted `/api/auth` onto the Express application.
  - **TDD Green State**: Verified 100% green state on `server/tests/auth.test.js` (6/6 tests passing), full backend test suite (8/8 suites, 36 tests passing), and full frontend test suite (11/11 suites, 34 tests passing).

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
