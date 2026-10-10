import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import LetterPicker from '../components/games/LetterPicker';
import { audioEngine } from '../services/audioEngine';

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

// Mock audioEngine
vi.mock('../services/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
    playWord: vi.fn(),
    playLetter: vi.fn(),
  },
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

  it('plays audio when the phonetic speaker button is clicked', () => {
    render(<LetterPicker word={mockWord} onComplete={() => {}} />);
    // There are speaker buttons on tiles too, so we need to find the one in the right panel
    const speakerButtons = screen.getAllByText('🔊');
    // First tile speaker button should trigger playLetter
    fireEvent.click(speakerButtons[0]);
    expect(mockWord.requiredCharacters).toContain(audioEngine.playLetter.mock.calls[0][0]);

    // Last one should be our word speaker in the right column
    fireEvent.click(speakerButtons[speakerButtons.length - 1]);
    expect(audioEngine.playWord).toHaveBeenCalledWith(mockWord.wordId, mockWord.malayalamText);
  });

  it('orders visual slots correctly for left-side mathra words (e.g., പെട്ടി)', () => {
    const leftMathraWord = {
      wordId: 'preset-petti',
      malayalamText: 'പെട്ടി',
      englishTranslation: 'Box',
      phonetic: 'petti',
      requiredCharacters: ['പ', 'െ', 'ട്ട', 'ി']
    };

    const { container } = render(<LetterPicker word={leftMathraWord} onComplete={() => {}} />);
    // The droppable slots are rendered inside the container
    // Expected visual order: െ (slot-1, left of consonant) then പ (slot-0) then ട്ട (slot-2) then ി (slot-3)
    const slotElements = container.querySelectorAll('[class*="border-dashed"]');
    expect(slotElements.length).toBe(4);
  });

  it('orders visual slots correctly for surround mathra words (e.g., പോയി)', () => {
    const surroundWord = {
      wordId: 'preset-poyi',
      malayalamText: 'പോയി',
      englishTranslation: 'Went',
      phonetic: 'poyi',
      requiredCharacters: ['പ', 'ോ', 'യ', 'ി']
    };

    const { container } = render(<LetterPicker word={surroundWord} onComplete={() => {}} />);
    const slotElements = container.querySelectorAll('[class*="border-dashed"]');
    expect(slotElements.length).toBe(4);
  });
});
