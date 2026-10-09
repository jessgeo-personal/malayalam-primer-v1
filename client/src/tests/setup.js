import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
    lineCap: 'round',
    lineJoin: 'round',
    strokeStyle: '#000',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    fillStyle: '',
  }));
}
