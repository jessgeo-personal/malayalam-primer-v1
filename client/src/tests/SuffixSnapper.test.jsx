import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { SuffixSnapper } from '../components/games';

// Mock dnd-kit since it's hard to test actual drag events in JSDOM
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div data-testid="dnd-context">{children}</div>,
  useDraggable: ({ id }) => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    isDragging: false
  }),
  useDroppable: ({ id }) => ({
    isOver: false,
    setNodeRef: () => {},
  }),
  PointerSensor: class {},
  TouchSensor: class {},
  MouseSensor: class {},
  useSensor: (sensor) => sensor,
  useSensors: (...sensors) => sensors,
  closestCenter: () => ({}),
  pointerWithin: () => ({}),
}));

describe('SuffixSnapper Mini-game', () => {
  const mockWord = {
    wordId: 's001',
    malayalamText: 'വീടുകൾ',
    englishTranslation: 'Houses',
    baseWord: 'വീട്',
    targetSuffix: 'കൾ',
    distractorSuffixes: ['മാർ'],
    lessonType: 'suffix',
    showTutorial: true
  };

  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the base word and suffix options', () => {
    render(<SuffixSnapper word={mockWord} onComplete={onComplete} />);
    expect(screen.getByText(mockWord.baseWord)).toBeDefined();
    expect(screen.getByText(mockWord.targetSuffix)).toBeDefined();
    expect(screen.getByText(mockWord.distractorSuffixes[0])).toBeDefined();
  });

  it('should show the tutorial guide when showTutorial is true', () => {
    render(<SuffixSnapper word={mockWord} onComplete={onComplete} />);
    expect(screen.getByTestId('tutorial-guide')).toBeDefined();
  });

  it('should not show the tutorial guide when showTutorial is false', () => {
    render(<SuffixSnapper word={{...mockWord, showTutorial: false}} onComplete={onComplete} />);
    expect(screen.queryByTestId('tutorial-guide')).toBeNull();
  });
});
