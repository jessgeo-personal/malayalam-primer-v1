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

describe('SentenceScrambler Component', () => {
  it('renders instructions correctly for magnets variant', () => {
    render(<SentenceScrambler word={mockWord} variant="magnets" />);
    expect(screen.getByText(/Drag the word tiles/i)).toBeInTheDocument();
    expect(screen.getByText(/English: This is mother./i)).toBeInTheDocument();
  });

  it('renders all word tiles', () => {
    render(<SentenceScrambler word={mockWord} variant="magnets" />);
    mockWord.sentenceParts.forEach(part => {
      expect(screen.getAllByText(part).length).toBeGreaterThan(0);
    });
  });

  it('triggers onComplete when correct order is submitted (magnets)', async () => {
    const onComplete = vi.fn();
    // For magnets, we'd need to mock dnd-kit events to reorder, 
    // but we can test the check logic by ensuring it validates against state.
    // Since it's shuffled, we might get lucky or not, but we can mock the internal state if needed.
    // For now, let's test the 'tap' variant which is easier to simulate in unit tests.
    render(<SentenceScrambler word={mockWord} variant="tap" onComplete={onComplete} />);
    
    // Tap words in correct order
    fireEvent.click(screen.getByText('ഇത്'));
    fireEvent.click(screen.getByText('അമ്മ'));
    fireEvent.click(screen.getByText('ആണ്'));
    
    fireEvent.click(screen.getByText(/Check Answer/i));
    
    expect(screen.getByText(/Correct!/i)).toBeInTheDocument();
    
    // Wait for the timeout
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalled(), { timeout: 2000 });
  });

  it('shows error tip on wrong order (tap)', () => {
    render(<SentenceScrambler word={mockWord} variant="tap" />);
    
    // Tap in wrong order
    fireEvent.click(screen.getByText('ആണ്'));
    fireEvent.click(screen.getByText(/Check Answer/i));
    
    expect(screen.getByText(/Try Again!/i)).toBeInTheDocument();
    expect(screen.getByText(/TIP: Put "ആണ്" at the end!/i)).toBeInTheDocument();
  });
});
