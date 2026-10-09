import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SentenceScrambler from '../components/games/SentenceScrambler';

const mockWord = {
  wordId: "test-scramble",
  malayalamText: "ഇത് അമ്മ ആണ്",
  englishTranslation: "This is mother.",
  sentenceParts: ["ഇത്", "അമ്മ", "ആണ്"],
  lessonType: "scramble"
};

describe('SentenceScrambler Component (Tap Variant)', () => {
  it('renders instructions correctly', () => {
    render(<SentenceScrambler word={mockWord} onComplete={vi.fn()} />);
    expect(screen.getByText(/Tap the words in the right order/i)).toBeInTheDocument();
    expect(screen.getByText(/English: This is mother./i)).toBeInTheDocument();
  });

  it('renders all word tiles in the bank', () => {
    render(<SentenceScrambler word={mockWord} onComplete={vi.fn()} />);
    mockWord.sentenceParts.forEach(part => {
      expect(screen.getByRole('button', { name: part })).toBeInTheDocument();
    });
  });

  it('triggers onComplete(true, time) when correct order is submitted', async () => {
    const onComplete = vi.fn();
    render(<SentenceScrambler word={mockWord} onComplete={onComplete} />);
    
    // Tap words in correct order
    fireEvent.click(screen.getByText('ഇത്'));
    fireEvent.click(screen.getByText('അമ്മ'));
    fireEvent.click(screen.getByText('ആണ്'));
    
    // Overlay should appear automatically
    expect(screen.getByText(/Perfect!/i)).toBeInTheDocument();
    
    // Click Continue
    fireEvent.click(screen.getByText(/CONTINUE/i));
    
    expect(onComplete).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('shows correction on wrong order', () => {
    const onComplete = vi.fn();
    render(<SentenceScrambler word={mockWord} onComplete={onComplete} />);
    
    // Tap all words in WRONG order to trigger auto-check
    fireEvent.click(screen.getByText('ആണ്'));
    fireEvent.click(screen.getByText('അമ്മ'));
    fireEvent.click(screen.getByText('ഇത്'));
    
    expect(screen.getByText(/Try Again!/i)).toBeInTheDocument();
    expect(screen.getByText(/Correct sentence:/i)).toBeInTheDocument();
    expect(screen.getByText(mockWord.sentenceParts.join(' '))).toBeInTheDocument();

    // Click Retry
    fireEvent.click(screen.getByText(/RETRY/i));
    expect(onComplete).toHaveBeenCalledWith(false, expect.any(Number));
  });
});
