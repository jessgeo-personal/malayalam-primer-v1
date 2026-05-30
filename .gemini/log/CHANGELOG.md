# Changelog - Malayalam Prime

## [2026.05.29.002] - 2026-05-29
### Added
- **Milestone 2.2: Concept Screens & Grammar Expansion:** Added explicit visual instruction pages and massively expanded Cycle 2 vocabulary.
- **ConceptScreen Component:** A dedicated instructional screen that precedes gameplay, featuring automated CSS animations to visually demonstrate Sandhi transformations (e.g. `വീട്` + `ുകൾ` -> `വീടുകൾ`).
- **Suffix-Led Sandhi:** Refactored pedagogical data so suffix tiles carry the mathra (e.g. `ുകൾ`) and the base word sheds its terminal modifier (e.g. `വീട`), teaching causality.
- **Vocabulary Expansion:** Added 40+ new suffix puzzles across Lessons 10-14, ensuring a minimum of 10 playable words per lesson.
- **New Grammar Rules Taught:** Anunaasika Sandhi (`ങ്ങൾ`), Kinship (`മാർ`), and Locative Case (`ിൽ`/`ത്തിൽ`).
- **TDD Capacity Guardrails:** Added a `Database Capacity Integrity` test to guarantee no curriculum lesson ever ships with fewer than 10 words.

## [2026.05.29.001] - 2026-05-29
### Fixed
- **Curriculum Alignment:** Performed a full database purge and re-normalization to strictly align `lessonId` ranges with `unlockCycle` boundaries (Cycle 1: 1-9, Cycle 2: 10-15, etc.).
- **Map Visual Contrast:** Updated locked lesson nodes in the Adventure Map to use high-contrast styling (`grayscale` and `bg-white/30`), ensuring they are visible on all backgrounds.
- **TDD Integrity Guardrail:** Added `integrity.test.js` to the backend to automatically verify that lesson ranges never overlap across cycles.
- **Cycle Routing:** Fixed a bug where Cycle 2 incorrectly displayed and launched Cycle 1 lessons.
- **Magnetic Snap Mechanics:** Drag-and-drop UI where suffixes visually "snap" and merge with base words.
- **In-Game Guided Tutorial:** Animated hand guide that teaches new grammar concepts on the first encounter (Option B pedagogy).
- **Expanded Word Schema:** Added `baseWord`, `targetSuffix`, and `distractorSuffixes` to the MongoDB model.
- **Automated Tutorial Logic:** SRS engine now dynamically calculates the `showTutorial` flag based on user encounter history.
- **Seed Data (seed-200.json):** Initial curriculum for Plurals (`-കൾ`, `-മാർ`) and Locations (`-ൽ`).
- **TDD Suite:** Added `suffix.test.js` (backend) and `SuffixSnapper.test.jsx` (client) to ensure 100% test coverage for grammar features.

## [2026.05.28.021] - 2026-05-28
### Fixed
- **Lesson Pointer Logic:** Fixed a critical bug where replaying an old lesson would incorrectly unlock future lessons. Current progress is now safely tracked via `activeLessonId`.
- **Bounded Scoring System:** Migrated from infinite point accumulation to a Star-based score: 1 Star = 100, 2 Stars = 200, 3 Stars = 300 (Max 300 per lesson).
- **Passing Thresholds:** Implemented a strict 75% accuracy requirement to pass a lesson. Users with 3+ initial mistakes earn 0 Stars and the next lesson remains locked.
- **Reinforcement Queue:** Incorrect answers are now automatically duplicated and pushed to the end of the current session, forcing the student to demonstrate mastery before completion.
- **HUD Synchronization:** Updated the "Active Lesson" bubble to use the explicit lesson ID currently being played.

## [2026.05.28.020] - 2026-05-28
### Fixed
- **Progress Integrity:** Fixed a bug where replaying a lesson would incorrectly increment the `currentLesson` pointer, marking future lessons as complete. 
- **Accurate Mastery Calculation:** Refined the "Cycle Mastery" logic to include all mastered items (trace, match, build) within a cycle, ensuring the percentage reflects actual effort.
- **Stat Box Correction:** Fixed the "Lessons Completed" dashboard statistic to show the count of unique completed lessons from history, rather than the next lesson index.
- **TDD Guardrails:** Added backend unit tests to ensure idempotent lesson completion and accurate progress stats.

## [2026.05.28.019] - 2026-05-28
### Changed
- **Word Assembly Refactor:** Rebranded "Letter Picker" to "Word Assembly" with a side-by-side tablet layout to eliminate scrolling.
- **Instructional Focus:** Added a compact instruction header: "Drag the tiles in the correct order to build the word."
- **Improved Reference Info:** Added explicit "English meaning:" and "Phonetic:" labels in a dedicated reference column.
- **DND UX Overhaul:** 
    - Switched to `pointerWithin` collision detection to prevent accidental snaps on simple taps.
    - Implemented draggable placed tiles, allowing users to move tiles between boxes or back to the pool for mistake correction.
    - Enabled automatic "slide back" for tiles dropped outside valid boxes.

## [2026.05.28.018] - 2026-05-28
### Changed
- **Sound Match UX Refactor:** Relocated the "CONTINUE/RETRY" button to the top header of the feedback box to eliminate scrolling.
- **TDD Enhancement:** Added `SoundMatcher.test.jsx` to the client test suite to ensure robust feedback interaction.

## [2026.05.28.017] - 2026-05-28
### Changed
- **Nav Dock Relocation:** Moved the global bottom navigation dock (Home, Restart, Status) into the top header of the active lesson card to prevent visual obstruction on tablets.
- **Header Consolidation:** Merged Home, Restart, and Status controls into a single dark capsule grouping in the top-left of the game card.
- **Conditional Visibility:** Updated the bottom nav dock to only render when the user is on the Adventure Map.

## [2026.05.28.016] - 2026-05-28
### Changed
- **Tracing Redesign:** Implemented a side-by-side layout for the tracing pad and control panel to eliminate scrolling on tablets.
- **Phonetic Focus:** Added a prominent "Phonetic sound" section next to the tracing pad with a large replay speaker button.
- **HUD Detail:** Updated the "Active Lesson" bubble to display the specific lesson ID (e.g., "Active Lesson: 1").
- **Empty State UX:** Added a "No letters yet" placeholder to the Progress HUD to clarify initial empty states.
- **Vertical Actions:** Optimized button placement for thumb-access, grouping CLEAR and DONE actions vertically on the right.

## [2026.05.28.015] - 2026-05-28
### Added
- **Multi-User Support:** Implemented independent progress tracking for up to 3 learners (Learner 1, 2, 3) with a top-right profile switcher.
- **TDD Guardrails:** Created unit tests for context switching and integration tests for data isolation.

### Changed
- **Phonetic Restoration:** Restored English phonetic labels in the "Build" mini-game to assist auditory-visual mapping.
- **Real-time HUD Update:** Refactored the progress context to update the "My Progress" strip immediately upon correct character tracing.
- **Lesson Consolidation:** Re-mapped Cycle 1 into 9 robust lessons (down from 14 fragments) for better pedagogical density.

## [2026.05.28.014] - 2026-05-28
### Changed
- **Curriculum Consolidation:** Reduced Cycle 1 from 14 fragments to 9 intentional lessons to improve map pacing and content density.
- **Character Expansion:** Added 5 missing characters (ൽ, ൂ, സ, ഷ, ഭ) with trace/match support to complete the Cycle 1 vocabulary.
- **Data Integrity Fix:** Populated `requiredCharacters` and `prerequisites` for all 100 core words, ensuring 100% pedagogical adherence and preventing empty puzzle states.
- **Re-mapping:** Re-assigned all 100 words and 44 characters to the new 9-lesson structure based on logical character introduction and word complexity.

## [2026.05.28.012] - 2026-05-28
### Changed
- **Micro-Loop Pedagogical Refactor:** Grouped all 'Trace' tasks at the start of a lesson to introduce 5-6 characters as a batch. 'Match' and 'Build' tasks are now randomized afterwards to improve active recall and kill predictability.
- **UI Layout Update:** Moved the "EXIT" button to the top-left for standard tablet navigation.
- **My Progress HUD:** Implemented a new "My Progress" HUD in the top-right of the game screen, showing a high-contrast list of recently mastered letters.
- **Increased Bundle Capacity:** Adjusted the backend to serve up to 8 items per lesson bundle to accommodate larger character sets.

## [2026.05.28.011] - 2026-05-28
### Changed
- **Repositioned Tracing Hint:** Moved the "Trace the line" instructional pill from the center to the bottom-right corner of the tracing pad to prevent obscurement.
- **Visual Cleanup:** Removed redundant background character from the tracing canvas hint for a cleaner workspace.

## [2026.05.28.010] - 2026-05-28
### Changed
- **UI Language Simplification:** Replaced technical jargon (Daily Sync, Grapheme, Deploys, Calibrate) with friendly, learner-focused terms (Daily Practice, Letter, Lessons, Trace).
- **Contrast Improvements:** Darkened drop zone borders and tracing ghost guides to Slate-400 for better visibility for children and accessibility compliance.
- **Navigation Dock Fix:** Replaced non-functional Settings button with a "Restart Session" action featuring a safety confirmation dialog.
- **Friendly Feedback:** Updated game success/fail messages to be more encouraging ("Excellent!", "Correct!", "Try Again!").

## [2026.05.28.009] - 2026-05-28
### Added
- **Soft Premium "Neo-Bento" UI:** Complete visual overhaul based on the updated `UI_CHARTER.md`, featuring a "Sleek Minimalist" game aesthetic.
- **Bento Dashboard:** Implemented a card-stack based home screen with Hero slots, profile indicators, and high-impact numeric stat cards.
- **Premium Palette:** Migrated to a warm creamy canvas (`#FFFDF6`) with sophisticated Coral Pink, Teal Green, and Mango Orange accents.
- **Action Pill Buttons:** Replaced arcade buttons with sleek, dark charcoal (`#1A1E26`) interactive capsules.
- **Dynamic Course Deck:** Re-imagined the Adventure Map as a stack of Cycle cards with horizontal scrolling lesson nodes.
- **High-Res Tracing Matrix:** Enlarged and centrally-aligned the tracing canvas within a premium feature block for better tablet usability.
- **Floating Navigation Dock:** Added a persistent, dark floating menu capsule at the bottom of the screen for global navigation.
### Fixed
- **Typography Hierarchy:** Standardized all font weights and sizes to ensure numbers and metrics drive user confidence (7xl font-extrabold).

## [2026.05.28.007] - 2026-05-28
### Fixed
- **Tailwind v4 Alignment:** Resolved a critical `compileCSS` error by migrating all theme configurations from the legacy `tailwind.config.js` to the native `@theme` directive in `index.css`.
- **CSS Cross-Referencing:** Implemented `@reference` directives in `App.css` to ensure Tailwind v4 can correctly resolve custom utility classes during the compilation phase.

## [2026.05.28.006] - 2026-05-28
### Added
- **Cyber-Pop UI Rebuild:** Complete frontend reconstruction adhering to the `UI_CHARTER.md` for a "Sleek Gamified" aesthetic.
- **Dark Mode HUD:** Implemented a slate-900 based dark theme with high-contrast slate-50 text for better professional polish and visibility.
- **Arcade Tactical UI:** Replaced the previous 3D buttons with a more professional "Arcade" button system (`.btn-arcade`) with sharp 4px shadows and precise hover/active states.
- **Enlarged Tracing Matrix:** Increased the size of the tracing canvas and optimized the ghost letter scaling (400px) to ensure no clipping and a better drawing experience.
- **Neon Grid Map:** Redesigned the Adventure Map with a subtle neon grid and blue/violet track lines, optimized to show 20+ lesson nodes per screen.
- **Accessibility Sync:** Audited all new theme colors to ensure WCAG AA contrast compliance across the entire interface.

## [2026.05.28.005] - 2026-05-28
### Added
- **Professional Refinement:** Migrated to a cleaner, more professional color palette with muted sky blues and refined button states.
- **Tablet Optimization:** Scaled down global UI elements (fonts, buttons, cards) by ~50% to ensure high visibility and more content per screen on tablets.
- **Improved Map View:** Reduced bogey sizes to show 15+ lessons on the tracks simultaneously.
### Fixed
- **Tracing Guide Bug:** Fixed a bug where the Malayalam character ghost guide was not rendering on the canvas due to an invalid font string.
- **Repositioned Canvas Hints:** Moved the "Start Drawing" hint to the bottom of the canvas to prevent it from obscuring the character being traced.

## [2026.05.28.004] - 2026-05-28
### Added
- **Consumer-Grade UI Overhaul:** Complete redesign of the app with a "game-first" aesthetic suitable for an 8-year-old.
- **3D Chunky Buttons:** Implemented `.btn-3d` utility classes with thick borders and satisfying press-down animations.
- **Game Background:** Added a vibrant sky/cloud patterned background to all screens.
- **Railway Map Redesign:** Enhanced the Adventure Map with high-quality train car (bogey) graphics, wheels, and a stylized railway track.
- **Polished Components:** Refactored all game screens (LetterPicker, TracingCanvas, SoundMatcher) to use high-contrast, rounded card layouts with improved typography.
- **Badge Shelf:** Redesigned the Mastery Strip into a physical "Badge Shelf" with pop-in animations and better spacing.
### Fixed
- **Headless Test Support:** Updated `AudioEngine` to safely handle environments where `speechSynthesis` is missing, preventing Vitest crashes.

## [2026.05.28.003] - 2026-05-28
### Added
- **Malayalam Express UI:** Reskinned Adventure Map with a Train-and-Bogeys aesthetic.
- **Phonetic Audio Tiles:** Added "🔊" buttons to individual letter tiles in the Word Building game to help children map sound to position.
- **Lesson Info Popups:** Added an 'i' info dot to each lesson bogey that shows the Malayalam text and translations covered in that lesson.
- **Replayable Bogeys:** Confirmed and styled replayability for all completed lessons to allow star improvement.
- **Backend Preview API:** Added `/api/session/lesson/preview` to serve lesson content summaries.

## [2026.05.28.002] - 2026-05-28
### Added
- **Adventure Map Dashboard:** Implemented a visual, winding path UI (`AdventureMap.jsx`) for progress tracking.
- **3-Tier SRS Engine:** Refactored backend to track Letter, Word, and Sentence levels independently.
- **Graduation Logic:** Mastered letters used successfully in words are automatically removed from isolated letter revision.
- **Lesson System:** Renamed "Bundles" to "Lessons" and added a 1-3 star rating system for each lesson completion.
- **Session Complete Screen:** Added a high-engagement reward screen for Revision (Daily Prize) and Lessons (Stars).
- **Empty Revision Auto-Fix:** Logic to detect empty revision payloads and auto-complete them to prevent user lockout.
- **Star Persistence:** User history now tracks and saves stars earned for every lesson.

## [2026.05.28.001] - 2026-05-28
### Added
- Created `.geminiignore` file at the root to optimize agent context usage by ignoring dependencies, build artifacts, environment secrets, and binary assets.

## [2026.05.27.015] - 2026-05-27
### Fixed
- Resolved schema validation error during seeding by adding `match` to the `lessonType` enum in `server/models/Word.js`.

## [2026.05.27.014] - 2026-05-27
### Fixed
- Improved tablet DND UX: Added `TouchSensor` with activation constraints and switched to `closestCenter` collision for smoother snapping.
- Added active highlighting to drop zones when a tile is hovered over them (`isOver`).
- Relocated **Mastery Strip** to the top of the screen to serve as a constant achievement indicator.
### Added
- Implemented **SoundMatcher** mini-game (`lessonType: 'match'`): A multiple-choice game where the child identifies characters based on sound.
- Refined pedagogical sequence: **Trace -> Match -> Build**. Word building now requires completion of the Sound Match lesson for every component character.
- Updated `seed-100.json` to support the new prerequisite chain.

## [2026.05.27.013] - 2026-05-27
### Added
- Implemented **Mastery Strip**: A persistent UI element at the bottom of the screen showing all learned alphabets/chillus.
- Implemented **Gamification (Points)**: Users now earn 10 points for every correct answer, displayed in a persistent header counter.
- Implemented **Phase Badges**: Added visual badges to distinguish between "✨ New Sound" and "🌟 Revision" puzzles.
- Added `/api/progress/stats` backend endpoint to track global user achievements.
- Updated `ProgressContext` to manage global score and mastered character states.

## [2026.05.27.012] - 2026-05-27
### Added
- Created `.gemini/docs/future_enhancements.md` to track user feedback regarding pedagogical pacing (tracing ratio), learner dashboard UI, and daily revision planning.

## [2026.05.27.011] - 2026-05-27
### Added
- Implemented pedagogical Prerequisite System: users must now complete character tracing before building words with those characters.
- Enhanced `TracingCanvas.jsx` to display phonetic text visually under the English translation.
- Restructured `seed-100.json` to link base consonants, vowel signs, and chillus to their respective words (e.g. tracing "ഞ", "ാ", "ൻ" before building "ഞാൻ").
- Updated backend API and unit tests to enforce prerequisite logic.

## [2026.05.27.010] - 2026-05-27
### Added
- Implemented Phase 0: Alphabet Foundation (Tracing & Phonetics).
- Created `TracingCanvas.jsx` with HTML5 Canvas and touch event support.
- Developed `audioEngine.js` for phonetic audio playback using Web Speech TTS.
- Updated `Word` schema and seed data to support `lessonType: 'trace'`.
- Added initial tracing lessons for vowels and chillus.

## [2026.05.27.009] - 2026-05-27
### Added
- Implemented pedagogical feedback loop in `LetterPicker.jsx`.
- Game now halts on completion to show Success/Failure status and correct spelling.
- Added phonetic and Malayalam corrections for wrong answers.
- Added manual "Next Word" / "Got it" confirmation to resume the learning loop.

## [2026.05.27.008] - 2026-05-27
### Added
- Implemented global "Restart Session" feature to prevent users from getting stuck on misconfigured words.
- Added `POST /api/progress/reset` backend endpoint.
- Added `resetSession` to `ProgressContext` for dynamic session clearing.
- Placed a persistent "Restart Session" button in the top-right corner of the app, visible in all states (including error fallbacks).
### Changed
- Renamed internal puzzle "Reset" button to "Clear Tiles" to distinguish it from the session restart.

## [2026.05.27.007] - 2026-05-27
### Changed
- Shifted pedagogical splitting protocol to strictly detach dependent vowel signs (e.g., ാ, ി, ീ) from base consonants to teach character modification.
- Updated `seed-100.json` for "നീ" (You) to follow the new 2-piece split (`["ന", "ീ"]`).
- Updated official `.gemini/docs/word_splitting_protocol.md` with the new rules and examples.

## [2026.05.27.006] - 2026-05-27
### Fixed
- Resolved styling issue where Tailwind CSS utility classes were not being applied (added `@import "tailwindcss"` to `index.css`).
- Cleaned up legacy Vite boilerplate CSS to prevent layout interference.
- Updated pedagogical split for "ഞാൻ" (w001) to 3 pieces (`["ഞ", "ാ", "ൻ"]`) as per user request.

## [2026.05.27.005] - 2026-05-27
### Fixed
- Resolved blank screen in `LetterPicker` by populating `requiredCharacters` for initial seed words.
- Added UI fallback/error message for words with missing grapheme splits.
### Added
- Created `.gemini/docs/word_splitting_protocol.md` to document the AI-assisted Malayalam splitting process.
- Initialized Git repository and created a checkpoint commit on the `dev` branch.

## [2026.05.27.004] - 2026-05-27
### Added
- Phase 1 Milestone 1.2 (Frontend Foundation) completed.
- Implemented TDD framework for frontend with Vitest and JSDOM.
- Developed `ProgressContext` for global state management and API integration.
- Built the `LetterPicker` mini-game with tablet-optimized drag-and-drop mechanics using `@dnd-kit/core`.
- Refactored `App.jsx` to host the core learning loop.
- Integrated success/failure feedback loop with automated SRS updates.

## [2026.05.27.003] - 2026-05-27
### Added
- Phase 1 Milestone 1.1 (Backend Foundation) completed.
- Implemented TDD framework for backend with Jest and Supertest.
- Developed SRS Engine logic in `server/services/srsEngine.js`.
- Implemented and verified `GET /api/words/next` and `POST /api/progress/update` API routes.
- Verified seed data integrity and successfully populated local MongoDB.
- Fixed Mongoose v9 connection compatibility in `seeder.js`.

## [2026.05.27.002] - 2026-05-27
### Fixed
- Resolved Vite/PostCSS build error by installing `@tailwindcss/postcss` and updating `postcss.config.js` for Tailwind CSS v4 compatibility.

## [2026.05.27.001] - 2026-05-27
### Added
- Created `.gemini/log` directory and initialized `CHANGELOG.md`.
- Synchronized project state with `GEMINI.md` requirements.
- Incremented version to `2026.05.27.001`.

## [2026.05.26.001] - 2026-05-26
### Added
- Backend scaffolding with Express and Mongoose.
- Database models: `Word.js`, `User.js`, `Progress.js`.
- AI Service: `geminiService.js` and `ai.js` routes.
- Frontend scaffolding with React 19, Vite, and Tailwind CSS.
- PWA configuration and `vite-plugin-pwa`.
- Drag-and-drop support with `@dnd-kit/core`.
- Database seeder logic and initial word data (`seed-100.json`, etc.).
- Docker Compose configuration for local hosting.
- Project charter `GEMINI.md` and technical architecture docs.
- Version control file `client/src/config/version.js`.
