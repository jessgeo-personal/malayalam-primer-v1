# Implementation Plan: Lesson 4 Expansion (High-Density Sentences)

## Objective
Increase the density of Lesson 4 (WHO?) by adding 3 more contextual sentences. This reinforces the usage of family terms with pointers ("Athu") and possessives ("Ente").

## 1. New Sentences (Act 3)
| ID | Malayalam | English | Parts |
| :--- | :--- | :--- | :--- |
| ss012 | എൻ്റെ ചേട്ടൻ | My elder brother. | ["എൻ്റെ", "ചേട്ടൻ"] |
| ss013 | അത് മുത്തശ്ശി | That is grandmother. | ["അത്", "മുത്തശ്ശി"] |
| ss014 | അത് എൻ്റെ അച്ചൻ | That is my father. | ["അത്", "എൻ്റെ", "അച്ചൻ"] |

## 2. Subsequent ID Re-indexing
To prevent collisions, all scramble items from Lesson 5 onwards will be shifted:
- **Lesson 5 (WHAT?):** `ss015` (athu enthu), `ss016` (poocha vannu)
- **Lesson 6 (WHERE?):** `ss017` (school evide), `ss018` (avan kaattil)
- **Lesson 7 (WHEN?):** `ss019` (amma eppol vannu), `ss020` (innu poyi)

## 3. Technical Integrity
- **Prerequisites:** All 3 new sentences will be gated by `c004_a3` (Act 3 Intro).
- **Grapheme Consistency:** All instances of 'nta' in these sentences will use the Chillu-N form `ൻ്റ`.
- **TDD:** Re-run `npm test integrity.test.js` to ensure unique IDs and valid prerequisites.

## 4. Implementation Steps
1.  **Shift IDs:** Update the IDs for Lesson 5-7 scrambles in `seed-100.json`.
2.  **Insert New Data:** Add the 3 Lesson 4 sentences.
3.  **Audit:** Verify the new density (5 sentences total for L4) in the Word Audit tool.

## 5. Regression Testing
- **L4 Dry Run:** Verify that the Scramble Act now presents 5 items instead of 2.
- **L5-L7 Lock Check:** Ensure shifting IDs didn't break the lesson unlocking sequence for subsequent bogeys on the map.
