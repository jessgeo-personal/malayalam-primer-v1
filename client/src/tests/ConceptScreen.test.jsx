import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { ConceptScreen } from '../components/games';

describe('ConceptScreen Component', () => {
  const mockWord = {
    wordId: 'c001',
    lessonType: 'concept',
    malayalamText: 'Making Plurals',
    englishTranslation: 'To say more than one, add -kal.',
    baseWord: 'വീട്',
    targetSuffix: 'ുകൾ',
    morphedBase: 'വീടുകൾ'
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders title, rule description, and base word immediately', () => {
    render(<ConceptScreen word={mockWord} onComplete={vi.fn()} />);
    expect(screen.getByText('Making Plurals')).toBeDefined();
    expect(screen.getByText('To say more than one, add -kal.')).toBeDefined();
    expect(screen.getByText('വീട്')).toBeDefined();
  });

  it('shows the got it button after animation delay', () => {
    render(<ConceptScreen word={mockWord} onComplete={vi.fn()} />);
    const button = screen.getByText('GOT IT! ➜');
    
    // Initially has opacity-0
    expect(button.className).toContain('opacity-0');
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    // After 1800ms timer, it should have opacity-100
    expect(button.className).toContain('opacity-100');
  });
});
