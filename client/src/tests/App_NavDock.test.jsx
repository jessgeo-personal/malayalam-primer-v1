import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from '../App';
import * as context from '../context';

// Mock the components used in App
vi.mock('../components/games', () => ({
  LetterPicker: () => <div data-testid="letter-picker">LetterPicker</div>,
  TracingCanvas: () => <div data-testid="tracing-canvas">TracingCanvas</div>,
  SoundMatcher: () => <div data-testid="sound-matcher">SoundMatcher</div>,
}));

vi.mock('../components/ui', () => ({
  MasteryStrip: () => <div data-testid="mastery-strip">MasteryStrip</div>,
  AdventureMap: () => <div data-testid="adventure-map">AdventureMap</div>,
  PrototypeLab: () => <div data-testid="prototype-lab">PrototypeLab</div>,
  CelebrationManager: () => <div data-testid="celebration-manager">CelebrationManager</div>,
}));

describe('App Navigation Dock Conditional Rendering', () => {
  it('should render the bottom nav dock when sessionMode is "map"', () => {
    vi.spyOn(context, 'useProgress').mockReturnValue({
      userId: 'Learner 1',
      sessionMode: 'map',
      masteredCharacters: [],
      score: 0,
      currentCycle: 1,
      cycleProgress: 0,
      currentLesson: 1,
      lessonHistory: [],
      needsRevision: false,
      sessionStatus: 'idle',
    });

    render(<App />);
    // The bottom nav has icons like 🏠 and 🔄
    expect(screen.getByTitle('Home')).toBeDefined();
  });

  it('should NOT render the bottom nav dock when sessionMode is "lesson"', () => {
    vi.spyOn(context, 'useProgress').mockReturnValue({
      userId: 'Learner 1',
      sessionMode: 'lesson',
      sessionStatus: 'active',
      currentItem: { lessonType: 'trace', wordId: 'w001' },
      masteredCharacters: [],
      score: 0,
      currentCycle: 1,
      currentLesson: 1,
      lessonHistory: [],
    });

    render(<App />);
    // On a lesson page, the fixed bottom nav should be hidden
    // We expect it NOT to find the element with title 'Home' in the bottom nav 
    // because we will move it into the game card header
    const homeIcons = screen.queryAllByTitle('Home');
    // If we move it, it might still have title 'Home' but let's check for the 'nav' element or specific classes
    // Actually, I'll just check if there's any element with title 'Home' that is fixed at bottom
    // A better way: the fixed bottom nav is a <nav> tag.
    const navs = screen.queryAllByRole('navigation');
    expect(navs.length).toBe(0);
  });
});
