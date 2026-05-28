# Changelog - Malayalam Prime

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
