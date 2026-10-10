import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import WordAudit from '../components/ui/WordAudit';
import { audioEngine } from '../services/audioEngine';

// Mock audioEngine
vi.mock('../services/audioEngine', () => ({
  audioEngine: {
    playWord: vi.fn(),
    playLetter: vi.fn(),
    speak: vi.fn()
  }
}));

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

describe('WordAudit UI & Pronunciation Tuning Studio', () => {
    const mockWordList = [
        {
            wordId: 't001',
            malayalamText: 'അ',
            englishTranslation: 'A (Vowel)',
            phonetic: 'a',
            lessonType: 'trace',
            lessonId: 1,
            unlockCycle: 1,
            requiredCharacters: ['അ']
        },
        {
            wordId: 'w001',
            malayalamText: 'അമ്മ',
            englishTranslation: 'Mother',
            phonetic: 'amma',
            lessonType: 'build',
            lessonId: 1,
            unlockCycle: 1,
            requiredCharacters: ['അ']
        }
    ];

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.stubGlobal('fetch', vi.fn().mockImplementation((url, options) => {
            if (options && options.method === 'POST') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true, url: '/audio/words/w001.mp3' })
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockWordList)
            });
        }));

        class MockAudio {
            constructor(url) {
                this.url = url;
                this.play = vi.fn().mockResolvedValue(undefined);
                this.pause = vi.fn();
            }
        }
        window.Audio = MockAudio;
    });

    it('renders audit table with 🔊 Play button and Tweak Sound button for word items', async () => {
        render(<WordAudit />);

        await waitFor(() => {
            expect(screen.getByText('Curriculum Audit v2')).toBeInTheDocument();
        });

        const playButtons = screen.getAllByTitle('Play Audio');
        expect(playButtons.length).toBeGreaterThan(0);

        const tweakButtons = screen.getAllByText('Tweak Sound');
        expect(tweakButtons.length).toBeGreaterThan(0);
    });

    it('clicking 🔊 Play button triggers audioEngine.playWord with row wordId', async () => {
        render(<WordAudit />);

        await waitFor(() => {
            expect(screen.getByText('Mother')).toBeInTheDocument();
        });

        const playWordBtn = screen.getByLabelText('Play Audio w001');
        fireEvent.click(playWordBtn);

        expect(audioEngine.playWord).toHaveBeenCalledWith('w001', 'അമ്മ');
    });

    it('opens Tune Pronunciation modal when Tweak Sound is clicked and allows previewing and committing', async () => {
        render(<WordAudit />);

        await waitFor(() => {
            expect(screen.getByText('Mother')).toBeInTheDocument();
        });

        const tweakBtn = screen.getAllByText('Tweak Sound')[0];
        fireEvent.click(tweakBtn);

        // Modal should now be visible
        expect(screen.getByText('Tune Pronunciation')).toBeInTheDocument();
        expect(screen.getByText(/TTS Curation Studio/)).toBeInTheDocument();
        expect(screen.getByDisplayValue('അമ്മ')).toBeInTheDocument();

        // Test Preview Sound
        const previewBtn = screen.getByText(/Preview Sound/);
        fireEvent.click(previewBtn);

        // Test Commit & Save
        const saveBtn = screen.getByText(/Save & Replace Audio/);
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(screen.getByText(/Static audio generated & saved successfully!/)).toBeInTheDocument();
        });
    });
});
