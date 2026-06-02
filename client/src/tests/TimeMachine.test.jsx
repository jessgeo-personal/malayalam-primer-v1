import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeMachine from '../components/games/TimeMachine';
import React from 'react';

// Mock audioEngine
vi.mock('../../utils/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
  },
}));

describe('TimeMachine Production Component', () => {
  const mockWord = {
    wordId: 'tm001',
    malayalamText: 'പോ',
    baseWord: 'പോ',
    pastForm: 'പോയി',
    presentForm: 'പോകുന്നു',
    futureForm: 'പോകും',
    pastEnglish: 'WENT',
    presentEnglish: 'GOING',
    futureEnglish: 'WILL GO',
    lessonType: 'tense'
  };

  it('renders correctly and shows the target English word', () => {
    render(<TimeMachine word={mockWord} onComplete={() => {}} />);
    // Target is random, so we check for one of the three possibilities
    const targets = ['WENT', 'GOING', 'WILL GO'];
    const foundTarget = targets.some(target => screen.queryByText(target));
    expect(foundTarget).toBe(true);
    expect(screen.getByText('പോ')).toBeInTheDocument(); // Base word tile
  });

  it('renders all three time zones with Malayalam labels', () => {
    render(<TimeMachine word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText('ഇന്നലെ')).toBeInTheDocument(); // Past
    expect(screen.getByText('ഇന്ന്')).toBeInTheDocument();   // Present
    expect(screen.getByText('നാളെ')).toBeInTheDocument();  // Future
  });
});
