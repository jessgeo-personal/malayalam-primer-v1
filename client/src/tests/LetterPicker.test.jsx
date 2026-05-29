import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LetterPicker from '../components/games/LetterPicker';

// Mock dnd-kit since it's hard to test drag and drop in jsdom
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div>{children}</div>,
  useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: () => {}, transform: null, isDragging: false }),
  useDroppable: () => ({ setNodeRef: () => {}, isOver: false }),
  TouchSensor: vi.fn(),
  MouseSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(),
  pointerWithin: vi.fn()
}));

describe('LetterPicker (Word Assembly) Component', () => {
  const mockWord = {
    wordId: 'w001',
    malayalamText: 'ഞാൻ',
    englishTranslation: 'I',
    phonetic: 'njan',
    requiredCharacters: ['ഞ', 'ാ', 'ൻ']
  };

  it('renders the "Word Assembly" title and instructions', () => {
    render(<LetterPicker word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText(/Word Assembly/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag the tiles in the correct order/i)).toBeInTheDocument();
  });

  it('renders the English meaning and Phonetic labels', () => {
    render(<LetterPicker word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText(/English meaning:/i)).toBeInTheDocument();
    // Use exact match to avoid finding 'I' inside other strings
    expect(screen.getByText('I')).toBeInTheDocument();
    expect(screen.getByText(/Phonetic:/i)).toBeInTheDocument();
    expect(screen.getByText(/njan/i)).toBeInTheDocument();
  });

  it('renders correct number of tiles', () => {
    render(<LetterPicker word={mockWord} onComplete={() => {}} />);
    // Check for the letters in the pool
    mockWord.requiredCharacters.forEach(char => {
      expect(screen.getByText(char)).toBeInTheDocument();
    });
  });
});
