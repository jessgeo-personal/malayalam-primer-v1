import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TracingCanvas from '../components/games/TracingCanvas';
import { audioEngine } from '../services/audioEngine';

// Mock audioEngine
vi.mock('../services/audioEngine', () => ({
  audioEngine: {
    speak: vi.fn(),
  },
}));

let mockContext;
let resizeObserverCallback = null;
let observedElements = [];
let observerDisconnected = false;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    resizeObserverCallback = callback;
    this.callback = callback;
    observerDisconnected = false;
  }
  observe(target) {
    observedElements.push(target);
  }
  unobserve(target) {
    observedElements = observedElements.filter((el) => el !== target);
  }
  disconnect() {
    observerDisconnected = true;
    observedElements = [];
  }
}

global.ResizeObserver = MockResizeObserver;

describe('TracingCanvas', () => {
  const mockWord = {
    wordId: 't1',
    malayalamText: 'അ',
    englishTranslation: 'A (Vowel)',
    phonetic: 'A',
    exampleWords: [
      { malayalamText: 'അവൻ', englishTranslation: 'He' },
      { malayalamText: 'അമ്മ', englishTranslation: 'Mother' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    observedElements = [];
    resizeObserverCallback = null;
    observerDisconnected = false;

    mockContext = {
      clearRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      closePath: vi.fn(),
      setTransform: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      measureText: vi.fn((text) => ({ width: 100 })),
      lineCap: 'round',
      lineJoin: 'round',
      strokeStyle: '#000',
      lineWidth: 1,
      font: '',
      textAlign: '',
      textBaseline: '',
      fillStyle: '',
    };

    HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 500,
      height: 300,
      right: 500,
      bottom: 300,
    }));
  });

  it('renders the drawing pad and instructions', () => {
    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText(/Trace the Letter/i)).toBeInTheDocument();
    expect(screen.getByText(/Trace the line/i)).toBeInTheDocument();
  });

  it('renders example words if provided', () => {
    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    expect(screen.getByText(/Words with this letter/i)).toBeInTheDocument();
    expect(screen.getByText('അവൻ')).toBeInTheDocument();
    expect(screen.getByText('He')).toBeInTheDocument();
    expect(screen.getByText('അമ്മ')).toBeInTheDocument();
    expect(screen.getByText('Mother')).toBeInTheDocument();
  });

  it('plays audio when example word speaker button is clicked', () => {
    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    const speakerButtons = screen.getAllByText('🔊');
    // First button is the main character audio, second is first example word
    fireEvent.click(speakerButtons[1]); 
    expect(audioEngine.speak).toHaveBeenCalledWith('അവൻ');
  });

  it('does not render example words section if none provided', () => {
    const wordNoExamples = { ...mockWord, exampleWords: [] };
    render(<TracingCanvas word={wordNoExamples} onComplete={() => {}} />);
    expect(screen.queryByText(/Words with this letter/i)).not.toBeInTheDocument();
  });

  it('attaches ResizeObserver to container and updates canvas dimensions with DPR on resize', () => {
    window.devicePixelRatio = 2;
    const { container } = render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    
    expect(observedElements.length).toBeGreaterThan(0);
    const canvas = container.querySelector('canvas');

    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 600, height: 400 },
        },
      ]);
    });

    expect(canvas.width).toBe(1200); // 600 * 2
    expect(canvas.height).toBe(800); // 400 * 2
    expect(canvas.style.width).toBe('600px');
    expect(canvas.style.height).toBe('400px');
    expect(mockContext.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it('renders ghost letter with calibrated headroom bounds and optical center adjustment', () => {
    window.devicePixelRatio = 1;
    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);

    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 500, height: 300 },
        },
      ]);
    });

    expect(mockContext.measureText).toHaveBeenCalledWith('അ');
    expect(mockContext.fillStyle).toBe('#94a3b8');
    expect(mockContext.textAlign).toBe('center');
    expect(mockContext.textBaseline).toBe('middle');
    // Horizontal center at 250 (width / 2), vertical center adjusted with headroom offset (> 150)
    const fillTextArgs = mockContext.fillText.mock.calls[0];
    expect(fillTextArgs[0]).toBe('അ');
    expect(fillTextArgs[1]).toBe(250);
    expect(fillTextArgs[2]).toBeCloseTo(155.58, 1);
  });

  it('correctly uses actualBoundingBox metrics for vertical headroom when available', () => {
    window.devicePixelRatio = 1;
    mockContext.measureText = vi.fn(() => ({
      width: 120,
      actualBoundingBoxAscent: 90,
      actualBoundingBoxDescent: 30,
    }));

    render(<TracingCanvas word={mockWord} onComplete={() => {}} />);

    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 500, height: 300 },
        },
      ]);
    });

    expect(mockContext.fillText).toHaveBeenCalled();
    const [char, x, y] = mockContext.fillText.mock.calls[0];
    expect(char).toBe('അ');
    expect(x).toBe(250);
    // verticalOffset = (90 - 30) / 2 = 30; renderY = 150 + 30 * 0.3 = 159
    expect(y).toBeCloseTo(159, 1);
  });

  it('records normalized strokes and redraws them accurately on resize', () => {
    window.devicePixelRatio = 1;
    const { container } = render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    const canvas = container.querySelector('canvas');

    // First resize to 500x300
    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 500, height: 300 },
        },
      ]);
    });

    // Simulate stroke
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 60 });
    fireEvent.mouseMove(canvas, { clientX: 200, clientY: 120 });
    fireEvent.mouseUp(canvas);

    expect(screen.queryByText(/Trace the line/i)).not.toBeInTheDocument();

    // Reset mocks to inspect redraw
    mockContext.lineTo.mockClear();
    mockContext.moveTo.mockClear();

    // Resize to 1000x600 (scaled 2x)
    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 1000, height: 600 },
        },
      ]);
    });

    // Normalized points were (100/500 = 0.2, 60/300 = 0.2) and (200/500 = 0.4, 120/300 = 0.4)
    // Redrawn at 1000x600 should moveTo(200, 120) and lineTo(400, 240)
    expect(mockContext.moveTo).toHaveBeenCalledWith(200, 120);
    expect(mockContext.lineTo).toHaveBeenCalledWith(400, 240);
  });

  it('handles zero or invalid dimensions gracefully without error', () => {
    const { container } = render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    const canvas = container.querySelector('canvas');

    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 0, height: 0 },
        },
      ]);
    });

    expect(canvas.width).not.toBe(0);
  });

  it('clears strokes on CLEAR button click and re-disables DONE button', () => {
    const onCompleteMock = vi.fn();
    const { container } = render(<TracingCanvas word={mockWord} onComplete={onCompleteMock} />);
    const canvas = container.querySelector('canvas');

    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 500, height: 300 },
        },
      ]);
    });

    const doneButton = screen.getByRole('button', { name: /DONE/i });
    expect(doneButton).toBeDisabled();

    // Draw stroke
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 60 });
    fireEvent.mouseMove(canvas, { clientX: 200, clientY: 120 });
    fireEvent.mouseUp(canvas);

    expect(doneButton).not.toBeDisabled();

    // Click CLEAR
    const clearButton = screen.getByRole('button', { name: /CLEAR/i });
    fireEvent.click(clearButton);

    expect(doneButton).toBeDisabled();
    expect(screen.getByText(/Trace the line/i)).toBeInTheDocument();
  });

  it('triggers onComplete when DONE button is clicked after drawing', () => {
    const onCompleteMock = vi.fn();
    const { container } = render(<TracingCanvas word={mockWord} onComplete={onCompleteMock} />);
    const canvas = container.querySelector('canvas');

    act(() => {
      resizeObserverCallback([
        {
          target: observedElements[0],
          contentRect: { width: 500, height: 300 },
        },
      ]);
    });

    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 60 });
    fireEvent.mouseUp(canvas);

    const doneButton = screen.getByRole('button', { name: /DONE/i });
    fireEvent.click(doneButton);

    expect(onCompleteMock).toHaveBeenCalledWith(true, 5000);
  });

  it('disconnects ResizeObserver on unmount', () => {
    const { unmount } = render(<TracingCanvas word={mockWord} onComplete={() => {}} />);
    unmount();
    expect(observerDisconnected).toBe(true);
  });
});
