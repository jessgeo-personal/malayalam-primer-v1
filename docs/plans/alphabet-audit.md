# Plan: Expand Audit to Include Alphabets

## Objective
Enhance the existing `WordAudit.jsx` tool to provide a dedicated, structured view for reviewing all foundational alphabet lessons (Trace and Match). This allows the user to easily verify that all individual graphemes, mathras, and conjuncts are correctly staged in the curriculum.

## Key Files
- `client/src/components/ui/WordAudit.jsx`

## Implementation Steps

### 1. Add Tab State
Introduce a state variable to manage which audit view is currently active:
```javascript
const [activeTab, setActiveTab] = useState('words'); // 'words' | 'alphabets'
```

### 2. Filter Alphabet Data
Create a new derived array for alphabet lessons, similar to how we filter `buildWords`:
```javascript
const alphabetLessons = words.filter(w => w.lessonType === 'trace' || w.lessonType === 'match');
```

### 3. Build Toggle UI
Add a simple tab toggle switch below the header:
- Button 1: "Word Splits" (Active if `activeTab === 'words'`)
- Button 2: "Alphabets & Mathras" (Active if `activeTab === 'alphabets'`)

### 4. Create Alphabet Table View
When `activeTab === 'alphabets'`, render a new table designed specifically for single characters:
- **Columns**: `ID`, `Cycle/Lesson`, `Type` (Trace/Match), `Character` (malayalamText), and `Phonetic`.
- **Logic**: No validation logic is required here since letters don't use `requiredCharacters` arrays. It is purely for visual review and confirmation of the curriculum sequence.

### 5. Retain Existing Word Audit
When `activeTab === 'words'`, render the existing validation table exactly as it is now.

## Verification
- Open the "DATABASE AUDIT" page.
- Verify the toggle exists.
- Switch to "Alphabets & Mathras".
- Scroll through to confirm `യ്യ` (t066/m066) and `സ്കൂ` (t067/m067) are correctly listed alongside standard letters.