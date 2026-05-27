import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LetterPicker from '../components/games/LetterPicker';

// Mock dnd-kit since it's hard to test drag and drop in jsdom
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }) => <div>{children}</div>,
  useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: () => {} }),
  useDroppable: () => ({ setNodeRef: () => {} }),
}));

describe('LetterPicker Component', () => {
  const mockWord = {
    wordId: 'w001',
    malayalamText: 'അമ്മ',
    englishTranslation: 'Mother',
    requiredCharacters: ['അ', 'മ്മ']
  };

  it('renders the English translation as a hint', () => {
    render(<LetterPicker word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText(/Mother/i)).toBeInTheDocument();
  });

  it('renders draggable letters', () => {
    render(<LetterPicker word={mockWord} onComplete={() => {}} />);
    mockWord.requiredCharacters.forEach(char => {
      expect(screen.getByText(char)).toBeInTheDocument();
    });
  });
});
