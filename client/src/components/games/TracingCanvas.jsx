import React, { useRef, useEffect, useState, useCallback } from 'react';
import { audioEngine } from '../../services/audioEngine';

/**
 * TracingCanvas Mini-game
 * Bucket / Cycle: Cycle 1 Character Acquisition (Act 1: Alphabets)
 * Pedagogy: Multimodal tactile letter tracing with isotropic typography calibration.
 * UI: Neo-Bento Feature Block. Large, centered canvas for optimal tablet tracing.
 */
export default function TracingCanvas({ word, onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const strokesRef = useRef([]);
  const currentStrokeRef = useRef([]);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const character = word?.malayalamText || word?.character || (typeof word === 'string' ? word : '');

  const getStrokeWidth = (w, h) => Math.max(16, Math.min(36, Math.round(Math.min(w, h) * 0.055)));

  const redrawCanvas = useCallback((width, height, dpr) => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    dimensionsRef.current = { width, height, dpr };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset the transform
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Isotropic Ghost Letter Fitting
    const availWidth = width * 0.82;   // 18% horizontal padding
    const availHeight = height * 0.68; // 32% vertical padding

    if (character) {
      // Baseline test size
      const testFontSize = 100;
      ctx.font = `bold ${testFontSize}px "Noto Sans Malayalam", "Manjari", sans-serif`;
      const metrics = ctx.measureText(character);
      const charWidth = metrics?.width || 1;
      const charHeight = testFontSize * 0.85; // approximate glyph ascent/descent box

      const scaleX = availWidth / charWidth;
      const scaleY = availHeight / charHeight;
      const uniformScale = Math.min(scaleX, scaleY);
      const finalFontSize = Math.floor(testFontSize * uniformScale);

      ctx.font = `bold ${finalFontSize}px "Noto Sans Malayalam", "Manjari", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#94a3b8'; // Slate-400 ghost outline/fill
      ctx.fillText(character, width / 2, height / 2);
    }

    // Redraw normalized recorded strokes
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#E35973'; // prime.coralPink
    ctx.lineWidth = getStrokeWidth(width, height);

    const allStrokes = [...strokesRef.current];
    if (currentStrokeRef.current.length > 0) {
      allStrokes.push(currentStrokeRef.current);
    }

    for (const stroke of allStrokes) {
      if (stroke.length === 0) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x * width, stroke[0].y * height);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x * width, stroke[i].y * height);
      }
      ctx.stroke();
    }
    ctx.restore();
  }, [character]);

  const drawGuide = useCallback(() => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setHasStarted(false);
    const { width, height, dpr } = dimensionsRef.current;
    if (width > 0 && height > 0) {
      redrawCanvas(width, height, dpr);
    }
  }, [redrawCanvas]);

  // Audio and character reset
  useEffect(() => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setHasStarted(false);
    if (character) {
      audioEngine.speak(character);
    }
    const { width, height, dpr } = dimensionsRef.current;
    if (width > 0 && height > 0) {
      redrawCanvas(width, height, dpr);
    }
  }, [character, redrawCanvas]);

  // Responsive Buffer Synchronization (ResizeObserver)
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const handleResize = (entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;

        const dpr = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        if (!canvas) continue;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Redraw letter and scale existing normalized paths
        redrawCanvas(width, height, dpr);
      }
    };

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(handleResize);
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        handleResize([{ contentRect: { width: rect.width, height: rect.height } }]);
      }
    }
  }, [character, redrawCanvas]);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { normX: 0, normY: 0, pixelX: 0, pixelY: 0 };
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || dimensionsRef.current.width || 1;
    const height = rect.height || dimensionsRef.current.height || 1;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const normX = Math.max(0, Math.min(1, (clientX - rect.left) / width));
    const normY = Math.max(0, Math.min(1, (clientY - rect.top) / height));

    return {
      normX,
      normY,
      pixelX: normX * width,
      pixelY: normY * height,
    };
  };

  const startDrawing = (event) => {
    const { normX, normY, pixelX, pixelY } = getCoordinates(event);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const { width, height } = dimensionsRef.current;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#E35973';
      ctx.lineWidth = getStrokeWidth(width, height);
      ctx.beginPath();
      ctx.moveTo(pixelX, pixelY);
    }
    currentStrokeRef.current = [{ x: normX, y: normY }];
    setIsDrawing(true);
    setHasStarted(true);
    if (event.cancelable) event.preventDefault();
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { normX, normY, pixelX, pixelY } = getCoordinates(event);
    currentStrokeRef.current.push({ x: normX, y: normY });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(pixelX, pixelY);
      ctx.stroke();
    }
    if (event.cancelable) event.preventDefault();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    if (currentStrokeRef.current.length > 0) {
      strokesRef.current.push(currentStrokeRef.current);
      currentStrokeRef.current = [];
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.closePath();
      }
    }
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-6xl animate-pop">
      <div className="text-center">
        <h2 className="text-4xl font-black text-prime-dark-text tracking-tight uppercase italic mb-1">
          Trace the Letter
        </h2>
        <p className="text-xl font-bold text-prime-coral-pink uppercase tracking-[0.4em] leading-none opacity-60">
          {word?.englishTranslation || ''}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-8 w-full">
        {/* Left Column: The Drawing Pad (Expanded) */}
        <div className="flex-[3] relative bg-white rounded-[40px] shadow-2xl border-[16px] border-prime-warm-base overflow-hidden min-h-[450px] touch-none flex items-center justify-center">
          <div
            ref={containerRef}
            className="relative w-full h-full min-h-[300px] flex items-center justify-center"
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              onTouchCancel={stopDrawing}
              className="cursor-crosshair relative z-10"
            />

            {!hasStarted && (
              <div className="absolute bottom-8 right-8 flex flex-col items-end pointer-events-none z-20">
                <div className="bg-prime-action-dark/10 px-6 py-2 rounded-pill text-[10px] font-black text-prime-action-dark uppercase tracking-widest animate-pulse border border-prime-action-dark/20 backdrop-blur-sm shadow-sm">
                  Trace the line
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Controls & Phonetics (Narrowed) */}
        <div className="w-full md:w-96 flex flex-col gap-6">
          <div className="card-bento-surface flex flex-col items-center justify-center p-6 text-center bg-prime-warm-base/30">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Phonetic sound</span>
            <div className="text-4xl font-black text-prime-dark-text italic mb-6">{word?.phonetic || ''}</div>
            
            <button 
              onClick={() => audioEngine.speak(character)}
              className="w-16 h-16 bg-white text-prime-action-dark rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform border border-slate-100"
              title="Play Sound"
            >
              🔊
            </button>
          </div>

          {/* Example Words Section */}
          {word?.exampleWords && word.exampleWords.length > 0 && (
            <div className="card-bento-surface p-5 bg-prime-warm-base/20 border-prime-warm-base/50">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Words with this letter</span>
              <div className="flex flex-col gap-3">
                {word.exampleWords.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/50 p-2 rounded-2xl border border-white shadow-sm">
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-xl font-bold text-prime-dark-text leading-tight">{ex.malayalamText}</span>
                      <span className="text-[10px] font-bold text-prime-coral-pink uppercase tracking-wider opacity-70 truncate w-full">{ex.englishTranslation}</span>
                    </div>
                    <button 
                      onClick={() => audioEngine.speak(ex.malayalamText)}
                      className="w-10 h-10 min-w-[40px] bg-prime-action-dark text-white rounded-xl flex items-center justify-center text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-auto">
            <button
              onClick={drawGuide}
              className="btn-pill bg-white border-2 border-slate-200 text-slate-400 justify-center py-4 text-sm font-black tracking-widest"
            >
              CLEAR
            </button>
            <button
              disabled={!hasStarted}
              onClick={() => onComplete && onComplete(true, 5000)}
              className={`btn-pill justify-center py-5 text-xl font-black ${hasStarted ? 'bg-prime-teal-green shadow-xl' : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}
            >
              DONE ➜
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
