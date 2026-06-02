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
    
    const checkBtn = screen.getByText(/Check Answer/i);
    fireEvent.click(checkBtn);
    
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
    
    // Wait for the timeout
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledWith(true, expect.any(Number)), { timeout: 2000 });
  });

  it('shows error tip on wrong order', () => {
    render(<SentenceScrambler word={mockWord} onComplete={vi.fn()} />);
    
    // Tap in wrong order
    fireEvent.click(screen.getByText('ആണ്'));
    const checkBtn = screen.getByText(/Check Answer/i);
    fireEvent.click(checkBtn);
    
    expect(screen.getByText(/Try Again!/i)).toBeInTheDocument();
    expect(screen.getByText(/TIP: Put "ആണ്" at the end!/i)).toBeInTheDocument();
  });
});
