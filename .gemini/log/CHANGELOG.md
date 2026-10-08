# Malayalam Prime - Project Changelog

All notable changes to this project will be documented in this file.

## [DATA-02-GREEN] - 2026-10-08
### Added & Changed
- **Track B, Task DATA-02 (Green Phase - Cycle 2 Grapheme Splits & Lessons 15–20 Bundling)**:
  - Curated and populated atomic grapheme splits (`requiredCharacters`) in `server/data/seed-200.json` for all 50 vocabulary items across Lessons 15 to 20 adhering strictly to `docs/word_splitting_protocol.md`.
  - Enforced Zero-Empty-Boxes Rule across all plural suffixes (`-ുകൾ`, `-ങ്ങൾ`, `-മാർ`), locatives (`-ൽ`, `-ിൽ`, `-യിൽ`, `-ത്തിൽ`), and tense transformation roots (`പോ`, `വാ`, `കളി`, `ഓടു`, `വായിക്കു`).
  - Set `isSuffix: true` for concept items and `isSuffix: false` for vocabulary/build items.
  - Verified 100% green pass on `server/tests/integrity.test.js` (6/6 tests passing) and full server test suite (10/10 test suites, 56/56 tests passing).
  - Verified 100% green pass on client test suite (13/13 test suites, 46/46 tests passing).
  - Re-seeded MongoDB database via `node seeder.js` cleanly importing 466 words without validation or unique key errors.
  - Updated `docs/EXECUTION_TRACKER.md` setting DATA-02 to 🟢 Completed.

## [DATA-02-RED] - 2026-10-08
### Added
- **Track B, Task DATA-02 (Red Phase - Cycle 2 Grapheme Splits & Lessons 15–20 Bundling)**:
  - Created plan documents at `docs/plans/DATA-02-seed-200-grapheme-splits-and-lesson-bundling.md` and `.gemini/plans/DATA-02-seed-200-grapheme-splits-and-lesson-bundling.md`.
  - Added new test suite `DATA-02: Cycle 2 (Lessons 15-20) Data Integrity & Zero-Empty-Boxes` to `server/tests/integrity.test.js`.
  - Asserted that all Cycle 2 vocabulary items have valid `lessonId` between 15 and 20 and strictly adhere to the Zero-Empty-Boxes rule on `requiredCharacters`.
  - Confirmed expected Red Phase failure (`expect(Array.isArray(word.requiredCharacters)).toBe(true)` received `false`) without modifying `seed-200.json`.

## [DATA-01-GREEN] - 2026-10-08
### Added
- **Track B, Task DATA-01 (Green Phase - Automated Transliteration Utility & Verification)**:
  - Implemented phonetic transliteration engine in `server/utils/transliterate.js` leveraging `@indic-transliteration/sanscript` and custom phonetic rule sets for Malayalam vowels, vowel signs, consonants, geminates, chillu letters (`ൻ`, `ൽ`, `ൾ`, `ർ`, `ൺ`), anusvara (`ം`), terminal virama suppression/schwa mapping, and affixes (e.g. `-ൽ` -> `'-il'`, `-ഓ` -> `'-o'`).
  - Unit tests passed 100% green via `npx vitest run tests/transliterate.test.js`.
  - Added standalone verification script `server/scripts/verify-transliteration.js` and npm script `npm run verify:transliterate`.
  - Evaluated against all 268 phonetic items in `server/data/seed-100.json`, achieving 99.63% compatibility (267/268 matches) with sole expected discrepancy being internal seed variance on sentence "അമ്മ ഇന്നലെ വന്നു" (innalle vs innale).
  - Maintained 100% green pass on full backend Jest regression test suite (10/10 test suites passed, 54/54 tests).
  - Updated `docs/EXECUTION_TRACKER.md` setting DATA-01 to 🟢 Completed.

## [DATA-01-RED] - 2026-10-08
### Added
- **Track B, Task DATA-01 (Red Phase - Automated Transliteration Utility)**:
  - Created plan documents at `docs/plans/DATA-01-automated-phonetic-transliteration.md` and `.gemini/plans/DATA-01-automated-phonetic-transliteration.md`.
  - Installed `@indic-transliteration/sanscript` in server dependencies and `vitest` in server devDependencies.
  - Created failing test suite at `server/tests/transliterate.test.js` specifying expected phonetic output for pronouns (`ഞാൻ` -> `'njan'`, `അവൻ` -> `'avan'`), conjuncts & chillu letters (`ഉണ്ട്` -> `'undu'`, `അമ്മ` -> `'amma'`, `എന്തുകൊണ്ട്` -> `'enthukond'`), and grammatical suffixes (`-ൽ` -> `'-il'`, `-ഓ` -> `'-o'`).
  - Verified test failure in Red Phase (`Cannot find module '../utils/transliterate.js'`).

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
