# GEMINI.md - Project "Malayalam Prime" Development Charter

## 🎯 Product Overview
* **Project:** Malayalam Prime (Self-hosted PWA)
* **Core Objective:** An adaptive, gamified application designed to bring an 8-year-old child to functional Malayalam literacy (300 core words) in 3 months.
* **Target User:** An 8-year-old boy using an Android Tablet.
* **Deployment Context:** 100% Local / Self-Hosted. Runs on a Synology NAS via Docker (Container Manager) accessed over a local home Wi-Fi network.
* **Product Requirements Document (PRD):** is available in ".gemini\docs\ProductBrief-TechnicalArchitecture-v1.md"

## 🛠 Tech Stack & Environment
* **Frontend:** React 18, Vite, Tailwind CSS, `@dnd-kit/core` (for drag-and-drop mechanics), configured as a Progressive Web App (PWA).
* **Backend:** Node.js, Express.
* **Database:** MongoDB (Local Docker instance).
* **AI Engine:** Google Gemini API (`@google/genai` SDK using `gemini-2.5-flash`).
* **Infrastructure:** Synology NAS (Docker Compose). No cloud hosting. No external cloud databases.

## 🛡 High-Priority Guardrails
1. **THE "NO CLOUD BILL" RULE:** Aside from the Gemini API free tier, this project must incur zero recurring costs. Do not suggest or install AWS, Vercel, or external database drivers. Everything must run in the `docker-compose.yml` environment.
2. **TABLET-FIRST UX:** The primary interface is an Android tablet. The frontend must rely entirely on touch events, drag-and-drop, and large tap targets. Avoid complex keyboard inputs. 
3. **PLAN EVERYTIME:** Ensure every approved plan creates a markdown file in .gemini/plans before performing any changes.
4. **NO AUTO-COMMIT:** Never commit code directly to `main`. Use the `dev` branch for all agentic work.
5. **IMPACT ANALYSIS:** You MUST use `/plan` before writing code. I am paranoid about breaking the SRS (Spaced Repetition) algorithm.
6. **TEST PLANS AND TESTING:** Create and maintain a unified regression test checklist in `.gemini/docs`, adding to it everytime a feature has been confirmed, implemented, approved and we move on to a new feature.  As part of every plan ensure there is a unit 
7. **STRICT AI CONSTRAINTS:** The Gemini API must NEVER be allowed to hallucinate vocabulary. It must only be prompted using the user's unlocked words fetched from MongoDB.
8. **CHANGELOG:**  Ensure during planning, build, implementation and testing, a running changelog should be created under .gemini/log as markdown.  It should be updated at every stage.

## 🧪 Testing & Quality Assurance Protocol (Zero-Regression Mandate)
You operate under a strict Test-Driven Development (TDD) framework. Every single feature addition or modification must pass through this rigorous testing pipeline.

**1. The Planning Phase (The Test Plan):**
Every time you generate a `/plan`, it MUST include a dedicated "Testing Strategy" block. You are forbidden from writing application code until the unit tests and regression checks are defined.

**2. The 4-Pillar Evaluation Matrix:**
All test suites (Vitest for the React frontend, Jest for the Node backend) must explicitly account for the following criteria:
* **Accuracy:** Does the backend logic correctly enforce the Spaced Repetition System (SRS) scores and respect the 4 Cycles/11 Buckets without hallucinating words?
* **Visual Consistency:** Do the React components strictly adhere to the Tablet-First constraints (large touch targets, responsive layouts, clear haptic/visual feedback)?
* **Functional Adherence:** Does the core gameplay loop work as intended? (e.g., Does the drag-and-drop state reset correctly on a failed answer? Does the correct audio/visual trigger fire?)
* **Process Faultlines (Edge Cases):** You must write tests for system failures. What happens if the Gemini API times out or returns malformed JSON? What happens if the Synology MongoDB connection drops? The app must fail gracefully.

**3. The Build Phase Execution:**
* You must write the failing tests first.
* No feature is considered "done" until the terminal output for `npm test` in both `/client` and `/server` is 100% green. 
* If a test fails, you must fix the application code. You are strictly forbidden from deleting or bypassing a failing test.

**4. The Regression Mandate:**
Before completing any build or declaring a task finished, you must execute the entire test suite. You must explicitly confirm in your output that no existing UI components, database schemas, or API routes were corrupted by your new code.

## 🤖 Agent Personas & Workflow

### 1. The Educational Architect (Default Mode)
* **Goal:** Map PRD requirements to code changes and ensure the 300-word curriculum remains intact.
* **Requirement:** Before proposing any database changes, explicitly check the 11 Grammatical Buckets and 4 Cycles defined in the PRD.
* **Dependency Audit:** Ensure `vite-plugin-pwa` is active for the frontend, and `mongoose` is active for the backend. 
* **Pedagogical Sequence (STRICT):** All vocabulary MUST be taught in a 3-step sequence defined in the Word schema `lessonType`: Trace (`trace`) -> Sound Match (`match`) -> Word Build (`build`). Word building puzzles must list the component characters as `prerequisites`.
* **Grapheme Splitting:** NEVER use standard JavaScript string splitting for Malayalam. Always refer to `.gemini/docs/word_splitting_protocol.md` and manually define `requiredCharacters` (detaching dependent vowel signs from base consonants).
* **Audit Requirement:** For every plan, you MUST perform an Architectural Integrity Check:
  * **PWA Safety:** Verify that the frontend can be installed to the Android home screen (manifest/service worker parity).
  * **Local Pathing:** Verify that frontend-to-backend API calls use environment-based local IPs (e.g., hitting the NAS IP `192.168.x.x`), NOT `localhost` (which fails on a tablet).


### 2. The Gamification Engineer (Build Phase)
* **Goal:** Build engaging, anti-rote learning UI mechanics.
* **Task:** When building frontend components, prioritize haptic feedback, fluid animations, and clear state changes (Success/Fail sounds/visuals).
* **Documentation Requirement:** Every new mini-game component (e.g., `MadLibs.jsx`, `SuffixSnapper.jsx`) MUST include a JSDoc block explaining what specific Grammatical Bucket it is teaching.

### 3. The Backend Seeder (Database Phase)
* **Goal:** Maintain the integrity of the Malayalam dictionary.
* **Task:** If the dictionary needs updating, you MUST modify `/server/data/seed-[x].json` and run `node seeder.js`. 
* **Rule:** Never hardcode Malayalam vocabulary directly into React components. All words must flow from MongoDB to the frontend.

## 2. The Pedagogical Progression Engine (Unified Framework)

The app abandons traditional A-Z linear alphabet learning. Instead, it relies on a two-part system: a **Micro-Loop** (the daily interactive gameplay sequence) and a **Macro-Loop** (the backend algorithm that scales the curriculum across the 300 core words and 11 linguistic buckets).

### 2.1 The Micro-Loop (Daily Gameplay Sequence)
This is the moment-to-moment interactive cycle. The gameplay is strictly structured into Sessions and Bundles to manage playtime and enforce active recall.

1. **Mandatory Daily Revision:** Every day begins with a dynamic revision session containing items (letters, words, sentences) that need reinforcement based on the SRS algorithm.
2. **5-Game Bundles:** New content is delivered in short, ~4-minute bundles (3 mini-games per bundle). The child can play multiple bundles a day if engaged, but the short bundle structure prevents fatigue.
3. **Targeted Character Acquisition:** The app introduces only the 5 to 6 specific Malayalam characters required for the day's target words (e.g., tracing മ, ന, and the ാ modifier).
4. **Instant Word Blending & Sentence Building:** The user immediately combines those characters into high-frequency structural words (e.g., building മാൻ - Deer) and basic 2-word sentences (e.g., ഇത് അമ്മ - This is mother) starting from Lesson 1.
5. **Formal Sentence Slotting (Contextualization):** As early as Lesson 3, the user builds formal SOV sentences using the 'Tap-to-Build' mechanic to decode grammar and intent.

### 2.2 The 3-Tier Adaptive SRS & Graduation Logic
The backend tracks progress at three distinct levels: Letter, Word, and Sentence.
* **The Hierarchy:** Learn Letter -> Revise Letter -> Use in Words -> Revise Words -> Use in Sentences -> Revise Sentences.
* **Graduation Protocol:** Once a user successfully identifies and uses a specific letter within a word-building context, that isolated letter is **Graduated** (removed from isolated letter revision) to focus on higher-level recall.

### 2.3 The Macro-Loop (The Cyclic Curriculum Algorithm)
The backend pulls words from 11 distinct grammatical "Buckets" across 4 distinct phases (Cycles). The AI is restricted to generating sentences using *only* the buckets allowed in the current cycle. Refer to the Product Brief for cycle definitions.

## 4. UI/UX & Gamification Requirements (Neo-Bento System)
The React frontend implements a **Soft Premium Neo-Bento** aesthetic, optimized for Android tablets.

### 4.1 Aesthetic Pillars
* **Canvas:** Warm creamy off-white (`#FFFDF6`) backdrop.
* **Bento Layout:** Card-stack dashboard with hyper-rounded corners (32px).
* **Action Pills:** Primary buttons are dark charcoal (`#1A1E26`) capsules.
* **Floating Dock:** A persistent navigation dock at the bottom of the screen.

### 4.2 Visual Progress: The Adventure Map
The primary dashboard is a **Dynamic Course Deck** visually depicting progress.
* The first required stop is the **"Daily Sync"** (Revision) node.
* Subsequent unlocked nodes represent **"Game Lessons"** (5 mini-games each).
* Progress is visualized through Cycle cards that expand to show lesson horizontal scrolls.

## 📝 Coding Standards & AI Integration
* **Styling:** Use standard Tailwind utility classes. Use bright, high-contrast colors suitable for an 8-year-old.
* **AI-Forward Architecture (MANDATORY):** 1. The `geminiService.js` file MUST explicitly use `responseMimeType: "application/json"`.
    2. The temperature must remain at `0.2`.
    3. The prompt MUST force the model to output the keys: `malayalam`, `english`, `sentenceType`, and `wordsUsed`.

## 🌲 Environment Variable Parity (The "No-Gap" Rule)
* **The Goal:** Prevent Synology deployment failures.
* **The Audit Task:** 1. Update `.env.example` immediately if a new variable is added.
    2. Ensure `MONGO_URI` defaults to `mongodb://mongodb:27017/malayalam_decode` for Docker, but allows a local override for testing.
* **Sensitive Data:** NEVER write the `GEMINI_API_KEY` into `GEMINI.md` or `.env.example`. 

## 📂 Project Structure
* **Root:** Contains `docker-compose.yml` and `GEMINI.md`.
* **Backend:** Located in `./server`. Exposes REST API on port `5000`.
* **Frontend:** Located in `./client`. Exposes Vite/React on port `3000`.

## 🏷️ Agentic Versioning Protocol
* **The Location:** The version is stored in `client/src/config/version.js`.
* **The Format:** `YYYY.MM.DD.NNN` (e.g., `2026.05.25.001`). Increment `NNN` for every completed coding task.

## A. Technical Debt Definitions
* **API Breakage:** Any backend route that does not handle a Gemini API timeout gracefully (e.g., falling back to a hardcoded local puzzle) is high-risk debt.
* **State Corruption:** Any frontend drag-and-drop game that does not correctly reset its state after a successful/failed answer is critical debt.
* **Schema Violation:** Adding a word to the database without assigning it an `unlockCycle`, `bucketId`, or correct `lessonType` sequence is a violation of the pedagogy.
* **Data Violation:** Using an empty `requiredCharacters` array for a word-building puzzle is critical technical debt.