import { describe, it, expect } from 'vitest';

// We will test the logic used in WordAudit.jsx
// Since the component uses a local checkValidity function, we'll replicate the core logic for the test
// or we could refactor the component to export this function. For now, we'll replicate to verify the algorithm.

const checkValidityLogic = (word, allWords) => {
    const results = { valid: true, issues: [] };

    if (word.lessonType === 'scramble') {
        if (!word.sentenceParts || word.sentenceParts.length === 0) {
          results.valid = false;
          results.issues.push('Empty sentenceParts');
        } else {
          const assembled = word.sentenceParts.join(' ');
          if (assembled !== word.malayalamText) {
            results.valid = false;
            results.issues.push('Space Mismatch');
            results.assembled = assembled;
          }
        }
    } 
    else if (['build', 'trace', 'match', 'suffix'].includes(word.lessonType)) {
      if (!word.requiredCharacters || word.requiredCharacters.length === 0) {
        if (word.lessonType !== 'concept') {
          results.valid = false;
          results.issues.push('Empty characters');
        }
      } else {
        const assembled = word.requiredCharacters.join('');
        if (assembled !== word.malayalamText) {
          results.valid = false;
          results.issues.push('Join Mismatch');
          results.assembled = assembled;
        }
      }
    }

    if (word.lessonType === 'build' && word.requiredCharacters) {
      const traces = allWords.filter(w => w.lessonType === 'trace');
      const tracedChars = new Set(traces.map(t => t.malayalamText));
      
      const missing = word.requiredCharacters.filter(char => !tracedChars.has(char));
      if (missing.length > 0) {
        results.valid = false;
        results.issues.push(`Missing Traces: ${missing.join(', ')}`);
      }

      const invalidTiming = word.requiredCharacters.some(char => {
        const trace = traces.find(t => t.malayalamText === char);
        return trace && trace.lessonId > word.lessonId;
      });
      if (invalidTiming) {
        results.valid = false;
        results.issues.push('Prereq in Future Lesson');
      }
    }

    if (typeof word.lessonId !== 'number' || word.lessonId <= 0) {
      results.valid = false;
      results.issues.push('Invalid lessonId');
    }

    return results;
};

describe('WordAudit Logic', () => {
    it('should validate a correct build word', () => {
        const allWords = [
            { wordId: 't1', malayalamText: 'അ', lessonType: 'trace', lessonId: 1 },
            { wordId: 't2', malayalamText: 'മ്മ', lessonType: 'trace', lessonId: 1 },
            { wordId: 'w1', malayalamText: 'അമ്മ', lessonType: 'build', lessonId: 1, requiredCharacters: ['അ', 'മ്മ'] }
        ];
        const result = checkValidityLogic(allWords[2], allWords);
        expect(result.valid).toBe(true);
    });

    it('should flag missing traces', () => {
        const allWords = [
            { wordId: 't1', malayalamText: 'അ', lessonType: 'trace', lessonId: 1 },
            { wordId: 'w1', malayalamText: 'അമ്മ', lessonType: 'build', lessonId: 1, requiredCharacters: ['അ', 'മ്മ'] }
        ];
        const result = checkValidityLogic(allWords[1], allWords);
        expect(result.valid).toBe(false);
        expect(result.issues).toContain('Missing Traces: മ്മ');
    });

    it('should flag prerequisites introduced in future lessons', () => {
        const allWords = [
            { wordId: 't1', malayalamText: 'അ', lessonType: 'trace', lessonId: 1 },
            { wordId: 't2', malayalamText: 'മ്മ', lessonType: 'trace', lessonId: 2 },
            { wordId: 'w1', malayalamText: 'അമ്മ', lessonType: 'build', lessonId: 1, requiredCharacters: ['അ', 'മ്മ'] }
        ];
        const result = checkValidityLogic(allWords[2], allWords);
        expect(result.valid).toBe(false);
        expect(result.issues).toContain('Prereq in Future Lesson');
    });

    it('should flag join mismatches', () => {
        const allWords = [
            { wordId: 't1', malayalamText: 'അ', lessonType: 'trace', lessonId: 1 },
            { wordId: 'w1', malayalamText: 'അമ്മ', lessonType: 'build', lessonId: 1, requiredCharacters: ['അ', 'മ'] }
        ];
        const result = checkValidityLogic(allWords[1], allWords);
        expect(result.valid).toBe(false);
        expect(result.issues).toContain('Join Mismatch');
    });

    it('should flag invalid lessonId', () => {
        const word = { wordId: 'w1', malayalamText: 'അമ്മ', lessonType: 'build', lessonId: 0, requiredCharacters: ['അ', 'മ്മ'] };
        const result = checkValidityLogic(word, []);
        expect(result.valid).toBe(false);
        expect(result.issues).toContain('Invalid lessonId');
    });
});
