# Product Requirements & Technical Architecture: Project "Malayalam Prime"

## 1. Executive Summary
**Objective:** To develop an adaptive, gamified language-learning application that brings an 8-year-old child to functional Malayalam literacy within a 3-month timeframe.
**Target Outcome:** Mastery of ~300 high-frequency structural words, allowing the user to decode sentence intent (statements vs. questions vs. commands) and actively ask contextual questions about unknown vocabulary.
**Deployment Environment:** Self-hosted on a Synology NAS via Docker (Container Manager) on a local network. Accessible via an Android tablet running a PWA.

---

## 2. The Pedagogical Progression Engine (Unified Framework)

The app abandons traditional A-Z linear alphabet learning. Instead, it relies on a two-part system: a **Micro-Loop** (the daily interactive gameplay sequence) and a **Macro-Loop** (the backend algorithm that scales the curriculum across the 300 core words and 11 linguistic buckets).

### 2.1 The Micro-Loop (Daily Gameplay Sequence)
This is the moment-to-moment interactive cycle. The backend engine will not allow the user to progress to the next sequence until the Spaced Repetition System (SRS) registers high confidence.

1. **Targeted Character Acquisition:** The app introduces only the 2 to 3 specific Malayalam characters required for the day's target words (e.g., tracing മ, ന, and the ാ modifier).
2. **Instant Word Blending:** The user immediately combines those characters into high-frequency structural words (e.g., building മാൻ - Deer) through puzzle mechanics.
3. **Sentence Slotting (Contextualization):** The user drags newly built words into dynamic sentences (Mad Libs style) to decode grammar and intent. 
4. **Adaptive Scoring Assessment (SRS):** The backend tracks time-to-answer and error rates. High scores unlock the next Macro-Loop cycle; low scores trigger reinforcement games using the same words.

### 2.2 The Macro-Loop (The Cyclic Curriculum Algorithm)
The backend pulls words from 11 distinct grammatical "Buckets" across 4 distinct phases (Cycles). The AI is restricted to generating sentences using *only* the buckets allowed in the current cycle.

**Cycle 1: The "Fact & Identity" Loop (Words 1 - 50)**
* **Allowed Buckets:** Bucket 1 (Pronouns: ഞാൻ, ഇത്), Bucket 2 (Existence: ഉണ്ട്, ആണ്), Bucket 10/11 (Basic Nouns: അമ്മ, വീട്).
* **System Logic:** Generates simple 2 to 3-word identity statements.
* **Example Output:** "ഇത് വീട് ആണ്." (This is a house.) / "അമ്മ ഉണ്ട്." (Mother is present/exists.)
* **User Goal:** Master the concept that sentences resolve at the end with ആണ്/അല്ല (Is/Is not) or ഉണ്ട്/ഇല്ല (Exists/Does not exist).

**Cycle 2: The "Action & Inquiry" Loop (Words 51 - 120)**
* **Allowed Buckets:** Adds Bucket 3 (Verbs: പോയി, വന്നു) + Bucket 4 (Interrogatives: എവിടെ, ആര്, -ഓ).
* **System Logic:** Begins forming past/present tense sentences and introduces the `-ഓ` suffix to change statements into questions.
* **Example Output:** "അവൻ വന്നോ?" (Did he come?) / "അമ്മ എവിടെ പോയി?" (Where did mother go?)
* **User Goal:** Successfully swipe sentences into "Question" or "Statement" bins based entirely on recognizing the verb ending or suffix.

**Cycle 3: The "Directional" Loop (Words 121 - 200)**
* **Allowed Buckets:** Adds Bucket 5 (Space/Time: ഇവിടെ, നാളെ) + Bucket 6 (Case Markers: -ൽ, -ലേക്ക്).
* **System Logic:** Introduces structural suffixes as standalone drag-and-drop puzzle pieces.
* **Example Output:** അവൻ ഇവിടെ [ ___ ] വന്നു. (He came [ ___ ] here.) -> User snaps the `-ലേക്ക്` (Towards) suffix onto a noun.
* **User Goal:** Understand how words physically mutate based on direction, location, or possession.

**Cycle 4: The "Narrative" Loop (Words 201 - 300)**
* **Allowed Buckets:** Adds Bucket 7 (Connectors: പക്ഷേ, കാരണം) + Bucket 8 (Modals: വേണം, കഴിയും) + Bucket 9 (Adjectives/Quantifiers).
* **System Logic:** Instructs the Gemini API to generate complex, two-clause sentences using connectives.
* **Example Output:** "എനിക്ക് വെള്ളം വേണം, പക്ഷേ അവിടെ ഇല്ല." (I want water, but it is not there.)
* **User Goal:** Read continuous narrative flow and deduce context, using their 300-word structural framework to ask targeted questions about unknown nouns.

---

## 3. Expanded Curriculum Progression (The 300-Word Engine)

The database seed must be structured around **9 Interlocking Linguistic Buckets**. The learning engine will not teach these buckets sequentially (i.e., it will not teach all pronouns before moving to verbs). Instead, it uses a **Cyclic Progression Algorithm** that pulls the highest-frequency words from multiple buckets to form functional sentences immediately.

### Part A: The 9 Linguistic Buckets (Database Seed Framework)

The CLI must populate the MongoDB `WordItem` collection using the following categories and high-priority entries.

**Bucket 1: Pointers & Pronouns (The Subjects)**
*Identifies who or what the sentence is about.*
* ഞാൻ (Njan - I), നീ (Nee - You), അവൻ (Avan - He), അവൾ (Aval - She), അവർ (Avar - They)
* ഇത് (Ithu - This), അത് (Athu - That), ഇവ (Iva - These), അവ (Ava - Those)

**Bucket 2: Existence & Polarity (The Anchors)**
*The most critical bucket for basic statements.*
* ഉണ്ട് (Undu - Is/Exists/Has), ഇല്ല (Illa - Is not/Does not exist/Does not have)
* ആണ് (Aanu - Is [Identity]), അല്ല (Alla - Is not [Identity])
* അതെ (Athe - Yes)

**Bucket 3: High-Frequency Core Actions (The Verbs)**
*Taught in Past and Present forms first to establish timeline.*
* പോയി (Poyi - Went), പോകുന്നു (Pokunnu - Going)
* വന്നു (Vannu - Came), വരുന്നു (Varunnu - Coming)
* ചെയ്തു (Cheythu - Did), ചെയ്യുന്നു (Cheyyunnu - Doing)
* പറഞ്ഞു (Paranju - Said), പറയുന്നു (Parayunnu - Saying)
* കണ്ടു (Kandu - Saw), കാണുന്നു (Kaanunnu - Seeing)

**Bucket 4: Interrogatives & Modifiers (The Question Keys)**
*Used to trigger the "Sentence Intent" decoding loops.*
* ആര്? (Aaru - Who?), എന്ത്? (Enthu - What?), എവിടെ? (Evide - Where?)
* എപ്പോൾ? (Eppol - When?), എങ്ങനെ? (Engane - How?), എന്തുകൊണ്ട്? (Enthukond - Why?)
* **Crucial Suffix:** -ഓ (-o / The Yes-No question glue)

**Bucket 5: Spatial & Temporal Anchors (Time & Space)**
* ഇവിടെ (Ivide - Here), അവിടെ (Avide - There)
* ഇപ്പോൾ (Ippol - Now), അപ്പോൾ (Appol - Then), പിന്നെ (Pinne - Later/Then)
* ഇന്ന് (Innu - Today), നാളെ (Naale - Tomorrow), ഇന്നലെ (Innale - Yesterday)

**Bucket 6: Case Markers / Postpositions (The Glue)**
*Malayalam adds these to the end of nouns. The app must teach these as standalone "snap-on" puzzle pieces.*
* -ൽ (-il / In, On) -> e.g., *Veett-il* (In the house)
* -ലേക്ക് (-lekk / Towards, To) -> e.g., *Veetti-lekk* (To the house)
* -ഓട് (-odu / With, To a person) -> e.g., *Ammay-odu* (To mother)
* -ഉം (-um / And) -> e.g., *Ammay-um* (And mother)

**Bucket 7: Structural Connectors (Conjunctions)**
* പക്ഷേ (Pakshe - But)
* അതുകൊണ്ട് (Athukond - Therefore / So)
* അല്ലെങ്കിൽ (Allengil - Or else / Otherwise)
* കാരണം (Kaaranam - Because)

**Bucket 8: Modals & Imperatives (Intent/Desire)**
* വേണം (Venam - Want / Need)
* വേണ്ട (Venda - Don't want / Don't need)
* കഴിയും (Kazhiyum - Can / Able to)
* മതി (Mathi - Enough)

**Bucket 9: Core Quantifiers & Adjectives**
* എല്ലാം (Ellam - All / Everything), കുറച്ച് (Kurachu - A little / Some)
* വലിയ (Valiya - Big), ചെറിയ (Cheriya - Small)
* വളരെ (Valare - Very), കൂടുതൽ (Kooduthal - More)

**Bucket 10: Kinship & Human Anchors**
*Malayalam relies heavily on relational titles rather than names. These provide the 'Who' for the verbs.*
* അമ്മ (Amma - Mother), അച്ഛൻ (Achan - Father)
* മകൻ (Makan - Son), മകൾ (Makal - Daughter)
* ചേട്ടൻ (Chettan - Older brother), അനിയൻ (Aniyan - Younger brother)
* കുട്ടി (Kutti - Child), ആൾ (Aal - Person), സുഹൃത്ത് (Suhruth - Friend)

**Bucket 11: Universal Environment & Concepts**
*The absolute bare-minimum nouns required to navigate the physical world and time, allowing for contextual Mad Libs.*
* Sustenance: വെള്ളം (Vellam - Water), ഭക്ഷണം (Bakshanam - Food)
* Places: വീട് (Veedu - House/Home), സ്കൂൾ (School), വഴി (Vazhi - Road/Path), കട (Kada - Shop)
* Abstract Anchors: സമയം (Samayam - Time), ദിവസം (Divasam - Day), പേര് (Peru - Name), കാര്യം (Kaaryam - Matter/Thing)


### Part B: The Cyclic Progression Algorithm (How the App Teaches)

The Node.js backend must utilize an algorithm that combines these buckets in specific phases, scaling in complexity. 

**Cycle 1: The "Fact & Identity" Loop (Top 50 Words)**
* **Allowed Buckets:** Bucket 1 (Pointers) + Bucket 2 (Existence) + 5 Basic Nouns (e.g., Amma, Aana, Makan).
* **System Logic:** Generates 2 to 3-word sentences. 
* **Example Output:** "ഇത് ആന ആണ്." (This is an elephant.) / "ആന ഉണ്ട്." (There is an elephant.)
* **User Goal:** Master the concept that sentences end in ആണ്/അല്ല or ഉണ്ട്/ഇല്ല.

**Cycle 2: The "Action & Inquiry" Loop (Words 51 - 120)**
* **Allowed Buckets:** Adds Bucket 3 (Verbs) + Bucket 4 (Interrogatives).
* **System Logic:** Starts appending the `-ഓ` suffix to verbs and introduces `E-` question words.
* **Example Output:** "അവൻ വന്നോ?" (Did he come?) / "അവൻ എവിടെ പോയി?" (Where did he go?)
* **User Goal:** User must successfully swipe sentences into "Question" or "Statement" UI bins.

**Cycle 3: The "Directional" Loop (Words 121 - 200)**
* **Allowed Buckets:** Adds Bucket 5 (Space) + Bucket 6 (Case Markers).
* **System Logic:** Introduces Mad Libs UI. The user must drag the correct `-il` or `-lekk` suffix onto a noun to complete the sentence's logic based on the verb.
* **Example Output:** അവൻ ഇവിടെ [ ___ ] വന്നു. (He came [ ___ ] here.) -> User snaps on the correct structural pieces.
* **User Goal:** Understand how words physically connect and mutate based on direction/location.

**Cycle 4: The "Narrative" Loop (Words 201 - 300)**
* **Allowed Buckets:** Adds Bucket 7 (Connectors) + Bucket 8 (Modals) + Bucket 9 (Quantifiers).
* **System Logic:** Gemini API is instructed to generate two-clause sentences using connectives like `പക്ഷേ` (But) or `അതുകൊണ്ട്` (Therefore).
* **Example Output:** "എനിക്ക് വേണം, പക്ഷേ അവിടെ ഇല്ല." (I want [it], but [it] is not there.)
* **User Goal:** Reading continuous flow and deducing context without needing to know specific nouns.

---

### Part C: Updates to Database Schema Requirements
To support this logic, the CLI must ensure the `WordItem` schema in Mongoose includes relational properties:

```javascript
const wordItemSchema = new mongoose.Schema({
  wordId: { type: String, required: true, unique: true },
  malayalamText: { type: String, required: true },
  englishTranslation: { type: String, required: true },
  phonetic: { type: String, required: true },
  bucketId: { type: Number, required: true },
  isSuffix: { type: Boolean, default: false },
  requiredCharacters: [{ type: String }], 
  unlockCycle: { type: Number, required: true }
});
```

## 4. UI/UX & Gamification Requirements
The React frontend must implement touch-friendly, drag-and-drop mechanics suitable for an 8-year-old on an Android tablet.

### Core Mini-Games to Implement:
1. **Haptic Tracing(Motor Memory):** Animated glowing paths guide the finger to trace new characters, building the visual-spatial connection. Canvas-based interactive tracing with directional arrows for stroke order.
2. **Sound Bubble Pop (Auditory Processing):** The app speaks a sound or word. The user must quickly tap the floating bubble containing the correct Malayalam text before it floats away.
3. **Suffix Snapping(Grammar Mechanics):** Verbs and suffixes are puzzle pieces. The user snaps a suffix (like -ഓ) onto a verb (like വന്നു) to visually transform a flat sentence into a question.  Drag-and-drop mechanics where dragging a suffix (e.g., -ഓ) onto a verb visually alters the sentence meaning (Statement -> Question).
4. **Mad Libs Slot Machine(Structural Awareness):** A sentence with a missing connector or verb is displayed. The user drags the correct structural word into the slot to make the animation play.
5. **Word-Building Tetris (Phonics/Blending):** Characters drop from the top of the screen. The user aligns them in the correct sequence to build the target core word.  Falling letters that must be tapped/aligned in order to spell the target core word.
6. **The "Vibe" Decoder (Reading Comprehension):** A sentence is presented (with nouns obscured or represented by simple shapes). The user must swipe the sentence into a specific bucket: "Question," "Statement," or "Command."
7. **Modifier Sliders (Vowel Integration):** A base consonant (e.g., ക) sits in the center. The user slides a dial to add vowel modifiers (കി, കാ, കു) and hears the sound change in real-time.
8. **Meaning Matcher (Vocabulary Fast-Twitch):** A split-screen matching game connecting a core Malayalam word to its visual representation or functional icon.
9. **Memory Card Flip (Active Recall):** Classic concentration game matching Malayalam text to audio clips or English equivalents for quick review sessions.
10. **Boss Battles (Milestone Testing):** At the end of a word loop, a multi-stage challenge combines reading, listening, and sentence building to "unlock" the next set of letters.

### The Adaptive Engine (3-Month Pacing)
The app must not rely on a rigid calendar. Instead, it uses an Adaptive Spaced Repetition System (SRS) to gauge confidence.

**Confidence Scoring:** Every interaction is logged. Fast, accurate drag-and-drops score highly. Hesitations or incorrect taps lower the score.
**Dynamic Pacing:** If the score threshold is high, the system accelerates, skipping repetitive games and introducing new letters/words. If the score drops, the engine automatically throttles new inputs and resurfaces weak words through different game formats to reinforce learning.

---

## 5. Technical Architecture
**Stack:** React (Vite) + Node.js/Express + MongoDB + Gemini API.

* **Frontend (Client):**
  * React 18, built with Vite.
  * Configured as a Progressive Web App (PWA) using `vite-plugin-pwa` for fullscreen Android tablet installation.
  * State management: Context API or Zustand.
  * Drag-and-Drop: `@dnd-kit/core` or `react-beautiful-dnd`.
* **Backend (API):**
  * Node.js with Express.
  * Mongoose for MongoDB object modeling.
  * Middleware for CORS (allowing the tablet IP to hit the NAS IP).
* **Database:**
  * MongoDB (NoSQL) for flexible user progress and log tracking.
* **AI Engine (Gemini API):** 
  * Backend securely holds the Gemini API key.
  * Generates dynamic sentence structures based strictly on the user's unlocked vocabulary array.
* **Hosting:**
  * Synology NAS via Docker Compose.

---

## 6. Data Models (Mongoose Schemas)

The CLI must scaffold the following MongoDB schemas:

**1. UserProfile:**
* `userId`: String (UUID)
* `currentLevel`: Number
* `unlockedCharacters`: Array of Strings
* `unlockedWords`: Array of Strings

**2. WordItem (The Dictionary):**
refer to section 3

**3. ProgressLog (The SRS Engine):**
* `userId`: String
* `wordId`: String
* `encounters`: Number
* `correctCount`: Number
* `averageResponseTimeMs`: Number
* `lastReviewed`: Date
* `srsWeight`: Number (Calculated field to determine when to show it next)

---

## 7. Backend API Routes
The Express server must expose the following RESTful endpoints:
* `GET /api/user/progress` -> Fetches current level and unlocked items.
* `POST /api/user/log` -> Receives interaction data from the tablet (correct/incorrect, time taken) and updates the SRS weight in `ProgressLog`.
* `GET /api/game/next-challenge` -> The core engine. Calculates which words need review based on `srsWeight`, selects an appropriate mini-game type, and returns the payload.
* `POST /api/ai/generate-sentence` -> Triggers Gemini API. Sends `unlockedWords` to Gemini to return a dynamically generated sentence and English translation as a JSON object.

---

## 8. Gemini API Prompt Definition
When the Node backend calls Gemini, it must use this system prompt structure:
`System: You are an educational API. Generate one simple Malayalam sentence using ONLY the following words: [Array of unlockedWords]. The sentence must be grammatically correct. Output strictly as JSON: { "malayalam": "...", "english": "...", "sentenceType": "question|statement|command" }`

## 8.1 AI Service Implementation Details (`/server/services/geminiService.js`)

The CLI must generate a dedicated service file for the Gemini API using the `@google/genai` SDK. This function is the core of the dynamic "Mad Libs" engine.

**Function Requirements:**
1. **Name:** `generateDynamicSentence(userId, targetCycle)`
2. **Database Query:** It must query MongoDB for all `WordItem` documents where `unlockCycle <= targetCycle`.
3. **Data Formatting:** It must map the resulting words into a single comma-separated string format: `malayalamText (englishTranslation)` to feed into the prompt.
4. **API Configuration:**
   - **Model:** `gemini-2.5-flash`
   - **Temperature:** `0.2` (Must be low to prevent vocabulary hallucination).
   - **responseMimeType:** `"application/json"` (Crucial: The SDK must force a strict JSON return).
5. **System Instruction Prompt:**
   The CLI must hardcode the following prompt structure into the configuration:
   "You are an educational engine. Generate a SINGLE, grammatically correct Malayalam sentence.
   STRICT RULES:
   1. You may ONLY use words from this exact list: [INJECT_VOCAB_LIST_HERE]. Do not invent words.
   2. If using a suffix (like -ൽ or -ലേക്ക്), attach it correctly.
   3. Keep the sentence short (2 to 5 words).
   OUTPUT FORMAT: JSON object containing 'malayalam', 'english', 'sentenceType', and 'wordsUsed' (array)."

---

## 9. Project structure

/malayalam-decode
├── docker-compose.yml
├── /client (React/Vite PWA)
│   ├── /src
│   │   ├── /components
│   │   │   ├── /games (HapticTrace, SuffixSnap, MadLibs, etc.)
│   │   │   ├── /ui
│   │   ├── /context
│   │   ├── /hooks
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
└── /server (Node/Express)
    ├── /models
    │   ├── User.js
    │   ├── Word.js
    │   └── Progress.js
    ├── /routes
    │   ├── api.js
    │   └── ai.js
    ├── /services
    │   ├── srsEngine.js
    │   └── geminiService.js
    ├── server.js
    ├── package.json
    ├── /data
    │   ├── seed-100.json   <-- Array 1
    │   ├── seed-200.json   <-- Array 2
    │   └── seed-300.json   <-- Array 3
    ├── seeder.js           <-- The script below
    ├── .env                <-- Environment variables
    └── Dockerfile
	
## 10. Three-pillar learning Milestone Roadmap

### Pillar 1: The Foundation
**Focus area:** 10 Core Consonants, 4 Vowels, Top 50 Structural Words (Pronouns, Basic Verbs).
**Expected User Milestone:** Can read simple 3-word statements. Understands how verbs sit at the end of the sentence.

### Pillar 2: The Question Engine
**Focus area:** Interrogative Words (Who, What, Where), Suffixes, Next 100 Core Words.
**Expected User Milestone:** Can actively decode when a sentence is asking for information vs. stating a fact. Understands prefixes/suffixes.

### Pillar 3: The Synthesizer
**Focus area:** Complex Connectors (But, Because, Then), Remaining Consonants, Final 150 Core Words.
**Expected User Milestone:** Can read a short paragraph, identify the narrative flow, and ask targeted questions about unknown nouns.

## 11. Deployment Infrastructure (Docker Compose)
The repository must include a `docker-compose.yml` mapped for Synology:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: malayalam_db
    ports:
      - "27017:27017"
    volumes:
      - ./data/db:/data/db
    restart: unless-stopped

  backend:
    build: ./server
    container_name: malayalam_api
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/malayalam_decode
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    depends_on:
      - mongodb
    restart: unless-stopped

  frontend:
    build: ./client
    container_name: malayalam_web
    ports:
      - "3000:80" # Nginx serves the built Vite app
    depends_on:
      - backend
    restart: unless-stopped
```
---


	
