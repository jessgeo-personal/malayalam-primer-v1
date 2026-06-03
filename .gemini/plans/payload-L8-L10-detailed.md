# Implementation Plan: Phase 2B - Lessons 8-10 Expansion

## Objective
Finalize Cycle 1 by expanding Lessons 8, 9, and 10 to a high-density format (5 sentences per lesson). This covers States (How?), Properties (Which?), and Quantities (How Many?).

## 1. Lesson 8: HOW? (എങ്ങനെ?) - High Density
**Sentences (Act 3):**
- ss031: എങ്ങനെ ഉണ്ട്? (How is it?)
- ss032: സന്തോഷം ഉണ്ട്. (I am happy.)
- ss033: പുതിയ വീട്. (New house.)
- ss034: പഴയ കട. (Old shop.)
- ss035: അത് നല്ലത്. (That is good.)

**Words (Act 2):**
- w052: എങ്ങനെ `["എ", "ങ", "്ങ", "ന", "െ"]`
- w053: നല്ല `["ന", "ല്ല"]`
- w054: സന്തോഷം `["സ", "ന്ത", "ോ", "ഷ", "ം"]`
- w055: വിഷമം `["വ", "ി", "ഷ", "മ", "ം"]`
- w056: പുതിയ `["പ", "ു", "ത", "ി", "യ"]`
- w057: പഴയ `["പ", "ഴ", "യ"]`
- w058: സുഖം `["സ", "ു", "ഖ", "ം"]`
- w059: ചീത്ത `["ച", "ീ", "ത്ത"]`

**Traces (Act 1):**
- ങ, ല്ല, ഷ, ഖ

## 2. Lesson 9: WHICH? (ഏത്?) - High Density
**Sentences (Act 3):**
- ss036: ഏത് പൂവ്? (Which flower?)
- ss037: ചുവന്ന പൂവ്. (Red flower.)
- ss038: വലിയ ആന. (Big elephant.)
- ss039: ചെറിയ കിളി. (Small bird.)
- ss040: പച്ച ഇല. (Green leaf.)

**Words (Act 2):**
- w060: ഏത് `["ഏ", "ത", "്"]`
- w061: വലിയ `["വ", "ല", "ി", "യ"]`
- w062: ചെറിയ `["ച", "െ", "റ", "ി", "യ"]`
- w063: കറുത്ത `["ക", "റ", "ു", "ത്ത"]`
- w064: ചുവന്ന `["ച", "ു", "വ", "ന്ന"]`
- w065: നീല `["ന", "ീ", "ല"]`
- w066: പച്ച `["പ", "ച്ച"]`
- w067: വെള്ള `["വ", "െ", "ള്ള"]`

**Traces (Act 1):**
- ഏ
- (Review: ത, റ, വ, ച, ല)

## 3. Lesson 10: HOW MANY? (എത്ര?) - High Density
**Sentences (Act 3):**
- ss041: എത്ര ഉണ്ട്? (How many are there?)
- ss042: രണ്ട് കിളി. (Two birds.)
- ss043: ഒത്തിരി പൂവ്. (Many flowers.)
- ss044: ഒന്ന് വേണം. (Want one.)
- ss045: പത്ത് വീട്. (Ten houses.)

**Words (Act 2):**
- w068: എത്ര `["എ", "ത", "്ര"]`
- w069: ഒത്തിരി `["ഒ", "ത്ത", "ി", "ര", "ി"]`
- w070: കുറച്ച് `["ക", "ു", "റ", "ച്ച", "്"]`
- w071: എല്ലാം `["എ", "ല്ല", "ാ", "ം"]`
- w072: ഒന്ന് `["ഒ", "ന്ന", "്"]`
- w073: രണ്ട് `["ര", "ണ്ട", "്"]`
- w074: മൂന്ന് `["മ", "ൂ", "ന്ന", "്"]`
- w075: പത്ത് `["പ", "ത്ത", "്"]`
- w076: വേണം `["വ", "േ", "ണ", "ം"]` *(Added for sentence context)*

**Traces (Act 1):**
- ഒ, ണ
- (Review: ്ര, ണ്ട, ന്ന, ത്ത)

## 4. Technical Safeguards
- Scramble IDs continue from `ss031` to `ss045`.
- Word IDs continue from `w052` to `w076`.
- `്ര` alignment verification via frontend audit tool.

## 5. Implementation Steps
1. Draft payload for L8, L9, L10 into `seed-100.json`.
2. Execute `node seeder.js`.
3. Run backend integrity checks to verify all orphaned letters are traced.
