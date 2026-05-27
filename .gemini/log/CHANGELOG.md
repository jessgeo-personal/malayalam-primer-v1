# Changelog - Malayalam Prime

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
