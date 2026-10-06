# Plan: The 3-Act Lesson Structure (L1-L3 Fix)

## Diagnosis of the Scrambler Bug
You correctly identified a major flaw in how the curriculum was being served. While the database established prerequisites (e.g., `s001` requires `w001`), the backend engine groups available items into "5-Game Bundles." If a user happened to master `w001` early in a session, the backend immediately saw `s001` as "unlocked" and served it in the very same bundle, long before the user had a chance to absorb the vocabulary.

## The Solution: The "3-Act" Hard Gates
Your proposed methodology is brilliant and perfectly solves this. By splitting every lesson into 3 distinct acts, each introduced by a Concept Screen, we can use those Concept Screens as "Hard Gates" in the prerequisite graph. 
The backend will be physically unable to serve Words until the "Act 2 Concept" is unlocked, and it cannot unlock the "Act 2 Concept" until *all* alphabets in Act 1 are mastered.

### The Standard Methodology (To be replicated for all future lessons):
*   **Act 1 (Alphabets):** Starts with `Concept_A`. Teaches Tracing & Matching.
*   **Act 2 (Words):** Starts with `Concept_B` (Prerequisite: ALL Matches from Act 1). Teaches Building.
*   **Act 3 (Sentences):** Starts with `Concept_C` (Prerequisite: ALL Builds from Act 2). Teaches Scrambling and encourages real-world practice.

---

## Implementation Steps

### Phase 1: Documentation & Standards
1.  **Update `GEMINI.md`:** Formally declare the "3-Act Lesson Structure" as a mandatory pedagogical standard for all content generation.
2.  **Update Product Brief:** Update Section 2.1 to reflect this specific chunking methodology within the Micro-Loop.

### Phase 2: Restructure Lesson 1 (Pointing, People & Animals)
We will rewrite the seed data for Lesson 1 to follow this exact graph:
1.  **`c001_alpha`** (Listen & Trace) -> Unlocks all `t0XX` and `m0XX` for Lesson 1.
2.  **`c001_words`** (Building with Mathras) -> Prerequisite: `[m001...m012]`. Unlocks all `w0XX` for Lesson 1.
3.  **`c001_sentences`** (Putting it together) -> Prerequisite: `[w001...w005]`. Unlocks all `ss0XX` for Lesson 1. Concept text will encourage pointing at things in real life.

### Phase 3: Restructure Lessons 2 & 3
1.  **Lesson 2 (Family):** Apply the identical 3-Act gate structure. `c002_alpha` -> `c002_words` -> `c002_sentences`.
2.  **Lesson 3 (Anchor Verbs):** Apply the identical 3-Act gate structure. `c003_alpha` -> `c003_words` -> `c003_sentences`.

### Phase 4: Validation
- Run a custom verification script over `seed-100.json` to programmatically assert that the Hard Gates are correctly chained and no Scramble can bypass an Act 2 concept.
- Run `npm test tests/integrity.test.js` to verify standard database rules.

---
**Approval Request:** Do you approve of this plan to establish the 3-Act Structure and apply it to Lessons 1-3?