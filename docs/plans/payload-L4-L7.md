# Implementation Plan: Phase 2A - Lessons 4-7 Data Payload

## Objective
Draft the JSON objects for the first half of the Cycle 1 expansion (Lessons 4-7). This payload establishes the foundation for interrogatives regarding People, Objects, Places, and Time.

## 1. Lesson 4: WHO? (ആര്?) - People & Kinship
### Traces (Act 1)
- t066: ര (ra), t067: സ (sa), t068: ു (u), t069: ഹ (ha), t070: ൃ (ru), t071: ത്ത (ttha), t072: ശ്ശ (ssha), t073: േ (E), t074: ട്ട (tta), t075: ് ( Chandrakala), t076: എ (e), t077: ന്റെ (nte)
### Words (Act 2)
- w016: ആര് ["ആ", "ര", "്"]
- w017: സുഹൃത്ത് ["സ", "ു", "ഹ", "ൃ", "ത്ത", "്"]
- w018: അനിയൻ ["അ", "ന", "ി", "യ", "ൻ"]
- w019: അനിയത്തി ["അ", "ന", "ി", "യ", "ത്ത", "ി"]
- w020: മുത്തശ്ശി ["മ", "ു", "ത്ത", "ശ്ശ", "ി"]
- w021: മുത്തശ്ശൻ ["മ", "ു", "ത്ത", "ശ്ശ", "ൻ"]
- w022: ചേട്ടൻ ["ച", "േ", "ട്ട", "ൻ"]
- w023: ചേച്ചി ["ച", "േ", "ച്ച", "ി"]
### Sentences (Act 3)
- ss010: അത് ആര്? ["അത്", "ആര്?"]
- ss011: എന്റെ സുഹൃത്ത്. ["എന്റെ", "സുഹൃത്ത്."]

## 2. Lesson 5: WHAT? (എന്ത്?) - Objects & Environment
### Traces (Act 1)
- t078: ന്ത (ntha), t079: പ (pa), t080: ല (la), t081: ൂ (uu), t082: ൻ (Chillu n), t083: ന്ന (nna)
### Words (Act 2)
- w024: എന്ത് ["എ", "ന്ത", "്"]
- w025: പാല് ["പ", "ാ", "ല", "്"]
- w026: പുലി ["പ", "ു", "ല", "ി"]
- w027: മാൻ ["മ", "ാ", "ൻ"]
- w028: പൂച്ച ["പ", "ൂ", "ച്ച"]
- w029: കിളി ["ക", "ി", "ള", "ി"]
- w030: പൂവ് ["പ", "ൂ", "വ", "്"]
- w031: ഇല ["ഇ", "ല"]
### Sentences (Act 3)
- ss012: അത് എന്ത്? ["അത്", "എന്ത്?"]
- ss013: പൂച്ച വന്നു. ["പൂച്ച", "വന്നു."]

## 3. Lesson 6: WHERE? (എവിടെ?) - Locations & Places
### Traces (Act 1)
- t084: ഡ (da), t085: ഴ (zha), t086: സ്ക (ska), t087: ൽ (Chillu l)
### Words (Act 2)
- w032: എവിടെ ["എ", "വ", "ി", "ട", "െ"]
- w033: കട ["ക", "ഡ"]
- w034: കാട് ["ക", "ാ", "ട", "്"]
- w035: വഴി ["വ", "ഴ", "ി"]
- w036: സ്കൂൾ ["സ്ക", "ൂ", "ൾ"]
- w037: കുന്നിൻ ["ക", "ു", "ന്ന", "ി", "ൻ"]
- w038: മുകളിൽ ["മ", "ു", "ക", "ള", "ി", "ൽ"]
- w039: താഴെ ["ത", "ാ", "ഴ", "െ"]
### Sentences (Act 3)
- ss014: സ്കൂൾ എവിടെ? ["സ്കൂൾ", "എവിടെ?"]
- ss015: അവൻ കാട്ടിൽ. ["അവൻ", "കാട്ടിൽ."]

## 4. Lesson 7: WHEN? (എപ്പോൾ?) - Time & Sequence
### Traces (Act 1)
- t089: ം (am), t090: റ (ra), t091: പ്പ (ppa), t092: ോ (oo), t093: ്ര (ra-sign)
### Words (Act 2)
- w040: എപ്പോൾ ["എ", "പ", "്പ", "ോ", "ൾ"]
- w041: ഇപ്പോൾ ["ഇ", "പ", "്പ", "ോ", "ൾ"]
- w042: അപ്പോൾ ["അ", "പ", "്പ", "ോ", "ൾ"]
- w043: ഇന്ന് ["ഇ", "ന്ന", "്"]
- w044: നാളെ ["ന", "ാ", "ള", "െ"]
- w045: ഇന്നലെ ["ഇ", "ന്ന", "ല", "െ"]
- w046: പകൽ ["പ", "ക", "ൽ"]
- w047: രാത്രി ["ര", "ാ", "ത", "്ര", "ി"]
- w048: സമയം ["സ", "മ", "യ", "ം"]
### Sentences (Act 3)
- ss016: അമ്മ എപ്പോൾ വന്നു? ["അമ്മ", "എപ്പോൾ", "വന്നു?"]
- ss017: ഇന്ന് പോയി. ["ഇന്ന്", "പോയി."]

## Verification Checklist
- [ ] Atomic splits for `ഹൃ`, `സ്ക`, `്ര` verified.
- [ ] Prerequisites chain for all `build` words mapped to `trace` items.
- [ ] Sentence parts join correctly with spaces.
