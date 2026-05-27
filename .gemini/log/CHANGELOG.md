# Changelog - Malayalam Prime

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
