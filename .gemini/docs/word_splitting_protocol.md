# Protocol: AI-Assisted Malayalam Word Splitting

To ensure pedagogical accuracy and technical safety when adding new words to the Malayalam Prime database, follow this protocol using the Gemini CLI.

## 1. Why we use this protocol
Malayalam Unicode is complex. Simple character splitting (e.g., `.split('')`) will break ligatures and vowel modifiers, confusing the user. We use Gemini to identify the correct "grapheme clusters" (visual units) for the child to rebuild.

## 2. The Splitting Procedure
When you have a list of new words to seed:

1.  **Prepare the List**: Group your words by Cycle or Bucket.
2.  **Prompt Gemini**: Use the following template to generate the JSON.

### Prompt Template:
> "I am seeding the Malayalam Prime database. Please split the following words into their pedagogically correct visual graphemes for a drag-and-drop puzzle. 
> 
> **Rules**:
> 1. Separate dependent vowel signs (modifiers like ാ, ി, ീ, ു, ൂ) from their base consonants. This teaches the child how the alphabet is modified by sounds.
> 2. Keep conjunct consonants (like ണ്ട, ന്ത, മ്മ) as a single unit if they are taught as one sound.
> 3. Output as a JSON array of `requiredCharacters`.
> 4. **Maintain Strict Phonetic Order**: Modifiers must ALWAYS follow the consonant they modify in the array, even if they visually appear to the left (e.g., േ, െ) or surround the consonant (e.g., ോ, ൊ). The UI will handle the visual reordering.
> 5. **No Shortcut Suffixes**: Never group multiple phonetic units into a single block (e.g., NEVER use `ുക` as a single unit). You must split them into atomic components (e.g., `["ു", "ക"]`).
> 
> **Words to split**: [LIST_YOUR_WORDS_HERE]"

## 3. Reference Example
**Word**: അമ്മ (Mother)
**Split**: `["അ", "മ്മ"]`

**Word**: ഞാൻ (I)
**Split**: `["ഞ", "ാ", "ൻ"]`

**Word**: നീ (You)
**Split**: `["ന", "ീ"]`

**Word**: അത് (That)
**Split**: `["അ", "ത", "്"]`

**Word**: അതെ (Yes)
**Split**: `["അ", "ത", "െ"]` (Left Mathra 'e' follows 'tha')

**Word**: പോകുക (Go)
**Split**: `["പ", "ോ", "ക", "ുക"]` (Surround Mathra 'oo' follows 'pa')

## 4. Integration
Once Gemini provides the split, copy the array into the `requiredCharacters` field of the corresponding word in `server/data/seed-[x].json` and run the seeder:
```bash
cd server
node seeder.js
```
