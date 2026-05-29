# Milestone Audit: Cycle 1 "Go-Live" Readiness Report
**Date:** 2026-05-28 | **Version:** 2026.05.28.015 | **Phase:** End of Phase 1 (Foundation)

## 1. Executive Summary
Malayalam Prime is structurally sound and **cleared for a "Cycle 1 Live Beta"** with the target 8-year-old user. The core learning micro-loop (Trace -> Match -> Build) is highly polished, strictly enforces TDD/Zero-Regression mandates, and accurately implements the 3-Tier SRS algorithm. 

However, **the application is NOT ready for Cycle 2**. There are critical data, hardware, and networking loose ends that must be addressed either prior to handing the tablet to the child, or immediately parallel to their Cycle 1 gameplay.

---

## 2. Charter Alignment & Architecture Status
*   🟢 **"No Cloud Bill" Rule:** 100% Compliant. The entire stack (React/Vite, Node/Express, MongoDB) runs locally. No external DB drivers or cloud hosting services are present.
*   🟢 **Tablet-First UX:** 100% Compliant. The "Neo-Bento" UI utilizes large touch targets (minimum `w-16 h-16`), high-contrast slate-400 boundaries, and tablet-optimized `@dnd-kit/core` drag-and-drop mechanics.
*   🟢 **Multi-User Isolation:** 100% Compliant. Progress, scores, and graduated characters are strictly siloed in MongoDB by `userId`.
*   🟡 **PWA & Network Connectivity (Loose End):** The frontend is built as a Vite PWA, but for a tablet to communicate with the Synology NAS backend, the frontend MUST NOT use `localhost`. 
    *   **Action Required:** Before deployment, ensure `VITE_API_URL` (or your Nginx/Vite proxy config) points to the static local IP of the Synology NAS (e.g., `http://192.168.1.X:5000`).

---

## 3. Database & Pedagogical Readiness
### 🟢 Cycle 1: The Foundation (Ready)
*   The "Great Split" is complete for the first 100 words.
*   9 cohesive lessons exist with explicit `lessonId` mappings.
*   The backend SRS Engine successfully groups 5-6 Traces -> Randomized Matches -> Randomized Builds.

### 🔴 Cycle 2 & 3: The Danger Zone (Critical Loose End)
*   `seed-200.json` and `seed-300.json` currently contain raw dumps.
*   **The Threat:** Words from `w101` to `w300` have empty `requiredCharacters` arrays, missing `prerequisites`, and lack `lessonId` mappings. If a user completes Cycle 1, the app will attempt to load Cycle 2 and **the "Build" game will crash or display empty boxes.**
*   **Action Required:** The "Great Split" protocol must be executed on Cycle 2 before the child finishes Cycle 1.

---

## 4. Device Hardware Risks (Android Tablet)
### 🔴 Text-To-Speech (TTS) Engine Risk
*   The app relies on the browser's native `window.speechSynthesis` API (`audioEngine.js`) to provide phonetic clues.
*   **The Threat:** Android tablets often default to a basic Google TTS engine that may not have the **Malayalam Voice Data** downloaded locally. If missing, the tablet will either remain silent or attempt to read Malayalam script with an English accent.
*   **Action Required Before Play:** Go to the Android Tablet Settings -> Accessibility -> Text-to-Speech Output -> Install Voice Data -> Download Malayalam (India). Test this in Chrome before handing it to the child.

---

## 5. Missing Charter Features (Next Steps for Phase 2)
While the foundational loop is complete, the application currently lacks the specialized mini-games required for grammatical mastery (Buckets 4-11).

1.  **Missing Mini-Games (The "Grammar Factory"):**
    *   We only have `TracingCanvas`, `SoundMatcher`, and `LetterPicker`. 
    *   We must build **SuffixSnapper.jsx** (to teach plurals/case markers like -കൾ, -ൽ) and **SentenceScrambler.jsx** (for basic Subject-Object-Verb ordering).
2.  **Missing AI Integration (Vibe Decoder):**
    *   `server/services/geminiService.js` is built and capable of fetching JSON payloads from Gemini.
    *   **The Loose End:** It is not wired to any frontend component or backend route. The AI is currently dormant. Cycle 2 requires the AI to generate dynamic Mad-Libs/Intent recognition games based on the child's unlocked vocabulary.

---

## 6. Recommended "Go-Live" Action Plan

1.  **Hardware Check (Day 0):** Install Malayalam TTS voice data on the target Android tablet.
2.  **Network Check (Day 0):** Verify the tablet can access the Synology NAS via local IP, and that API calls resolve correctly.
3.  **Deploy Cycle 1 (Day 1):** Allow the child to begin the 9 curated lessons in Cycle 1.
4.  **Parallel Development (Days 1-14):**
    *   Agent Task 1: Execute the "Great Split" and Lesson Bundling for `seed-200.json` (Cycle 2).
    *   Agent Task 2: Build `SuffixSnapper.jsx` for Cycle 2 grammar mechanics.
    *   Agent Task 3: Wire `geminiService.js` to a new `VibeDecoder.jsx` mini-game for intent recognition.
