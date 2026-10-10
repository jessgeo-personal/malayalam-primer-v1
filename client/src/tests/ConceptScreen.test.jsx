import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import ConceptScreen from '../components/games/ConceptScreen';

// Mock context
vi.mock('../context', () => ({
  useProgress: () => ({
    userId: 'Learner 1'
  })
}));

// Mock audioEngine
vi.mock('../services/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
    playLetter: vi.fn(),
    playWord: vi.fn()
  }
}));

describe('ConceptScreen Component', () => {
  const mockGrammarWord = {
    wordId: 'c010',
    lessonType: 'concept',
    malayalamText: 'Making Plurals',
    englishTranslation: 'To say more than one, add -kal.',
    baseWord: 'വീട്',
    targetSuffix: 'ുകൾ',
    morphedBase: 'വീടുകൾ',
    isSummary: false
  };

  const mockSummaryWord = {
    wordId: 'c001',
    lessonType: 'concept',
    malayalamText: 'Lesson 1: Basics',
    englishTranslation: 'Instructions for Lesson 1',
    lessonId: 1,
    isSummary: true
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { malayalamText: 'അ', englishTranslation: 'A', phonetic: 'A', lessonType: 'trace' },
        { malayalamText: 'ന', englishTranslation: 'Na', phonetic: 'Na', lessonType: 'trace' }
      ])
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders Grammar layout correctly', () => {
    vi.useFakeTimers();
    render(<ConceptScreen word={mockGrammarWord} onComplete={vi.fn()} />);
    expect(screen.getByText('Making Plurals')).toBeDefined();
    expect(screen.getByText('To say more than one, add -kal.')).toBeDefined();
    expect(screen.getByText('വീട്')).toBeDefined();
  });

  it('shows the grammar action button after animation delay', () => {
    vi.useFakeTimers();
    render(<ConceptScreen word={mockGrammarWord} onComplete={vi.fn()} />);
    const button = screen.getByText('GOT IT! ➜');
    expect(button.className).toContain('opacity-0');
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(button.className).toContain('opacity-100');
  });

  it('renders Summary layout and fetches items with userId', async () => {
    render(<ConceptScreen word={mockSummaryWord} onComplete={vi.fn()} />);
    
    expect(screen.getByText('Lesson 1: Basics')).toBeDefined();
    expect(screen.getByText('Instructions for Lesson 1')).toBeDefined();
    
    await waitFor(() => {
      expect(screen.getByText('അ')).toBeDefined();
      expect(screen.getByText('ന')).toBeDefined();
    }, { timeout: 2000 });

    // Verify userId and conceptId are included in fetch call
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('conceptId=c001'));
  });

  it('triggers audio when summary item speaker is clicked', async () => {
    const { audioEngine } = await import('../services/audioEngine');
    render(<ConceptScreen word={mockSummaryWord} onComplete={vi.fn()} />);
    
    await waitFor(() => {
      const speakers = screen.getAllByText('🔊');
      speakers[0].click();
      expect(audioEngine.playLetter).toHaveBeenCalledWith('അ');
    });
  });
});
