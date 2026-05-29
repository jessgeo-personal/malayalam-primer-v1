import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { SoundMatcher } from '../components/games';

// Mock audio engine
vi.mock('../../utils/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
  },
}));

describe('SoundMatcher Mini-game', () => {
  const mockWord = {
    wordId: 'w001',
    malayalamText: 'ഞാൻ',
    englishTranslation: 'I',
    phonetic: 'njan',
    lessonType: 'match',
  };

  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show success feedback and a CONTINUE button when the correct option is clicked', async () => {
    render(<SoundMatcher word={mockWord} onComplete={onComplete} />);
    
    // In Sound Match, the correct option is the one with the correct Malayalam text
    const correctOption = screen.getByText(mockWord.malayalamText);
    
    await act(async () => {
      fireEvent.click(correctOption);
    });

    expect(screen.getByText('Correct!')).toBeDefined();
    const continueBtn = screen.getByText(/CONTINUE/i);
    expect(continueBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(continueBtn);
    });

    expect(onComplete).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('should show error feedback and a RETRY button when the wrong option is clicked', async () => {
    render(<SoundMatcher word={mockWord} onComplete={onComplete} />);
    
    // We need to find an incorrect option. Our seeder-like logic generates them.
    // Let's find one that isn't the correct text.
    const allOptions = screen.getAllByRole('button').filter(b => b.textContent !== mockWord.malayalamText && !b.textContent.includes('🔊'));
    
    await act(async () => {
      fireEvent.click(allOptions[0]);
    });

    expect(screen.getByText('Not Quite!')).toBeDefined();
    const retryBtn = screen.getByText(/RETRY/i);
    expect(retryBtn).toBeDefined();

    await act(async () => {
      fireEvent.click(retryBtn);
    });

    expect(onComplete).toHaveBeenCalledWith(false, expect.any(Number));
  });
});
