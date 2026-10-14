import React, { useRef, useEffect, useState, useCallback } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { useProgress } from '../../context';

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

    // Isotropic Ghost Letter Fitting with Headroom Calibration
    const availWidth = width * 0.74;   // 26% horizontal margin
    const availHeight = height * 0.52;  // 48% vertical margin (ample headroom top & bottom)

    if (character) {
      const testFontSize = 100;
      ctx.font = `bold ${testFontSize}px "Noto Sans Malayalam", "Manjari", sans-serif`;
      const metrics = ctx.measureText(character);

      const charWidth = metrics.width || testFontSize;

      // Use actualBoundingBox if supported by browser/canvas, otherwise fall back to conservative 1.25 ratio
      const ascent = metrics.actualBoundingBoxAscent || (testFontSize * 0.95);
      const descent = metrics.actualBoundingBoxDescent || (testFontSize * 0.30);
      const charHeight = (ascent + descent) || (testFontSize * 1.25);

      const scaleX = availWidth / charWidth;
      const scaleY = availHeight / charHeight;
      const uniformScale = Math.min(scaleX, scaleY);
      const finalFontSize = Math.max(16, Math.floor(testFontSize * uniformScale));

      ctx.font = `bold ${finalFontSize}px "Noto Sans Malayalam", "Manjari", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#94a3b8'; // Slate-400 ghost outline

      // True optical center adjustment: offset by ink balance if actual metrics exist
      const finalMetrics = ctx.measureText(character);
      const finalAscent = finalMetrics.actualBoundingBoxAscent || (finalFontSize * 0.5);
      const finalDescent = finalMetrics.actualBoundingBoxDescent || (finalFontSize * 0.2);
      const verticalOffset = (finalAscent - finalDescent) / 2;

      // Render precisely centered with zero top clipping
      const renderY = (height / 2) + (verticalOffset * 0.3);
      ctx.fillText(character, width / 2, renderY);
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

  const progress = useProgress?.() || {};
  const {
    activeLessonId,
    currentCycle,
    masteredCharacters = [],
    setSessionMode,
    setSessionStatus,
    resetSession,
    sessionMode
  } = progress;

  const handleHome = () => {
    if (setSessionMode && setSessionStatus) {
      setSessionMode('map');
      setSessionStatus('idle');
    }
  };

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart? This will clear your current session progress.")) {
      if (resetSession) resetSession();
    }
  };

  const handleClear = () => {
    drawGuide();
  };

  const handleDone = () => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    if (typeof document !== 'undefined') {
      if (document.documentElement && typeof document.documentElement.scrollTo === 'function') {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      if (document.body && typeof document.body.scrollTo === 'function') {
        document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      const mainEl = document.querySelector('main');
      if (mainEl) {
        if (typeof mainEl.scrollTo === 'function') {
          mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        mainEl.scrollTop = 0;
      }
    }
    if (onComplete) {
      onComplete(true, 5000);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1400px] mx-auto p-1 sm:p-4 animate-pop">
      {/* Row 1 & Row 2: Top Nav & HUD (Mobile Portrait Viewports < md) */}
      <div className="flex md:hidden flex-col gap-2 w-full">
        <div className="flex items-center justify-between">
          {/* Navigation Pills (Top Left) */}
          <div className="flex items-center gap-2 bg-prime-action-dark px-3 py-1.5 rounded-2xl shadow-md border border-white/10">
            <button 
              type="button"
              onClick={handleHome}
              className="text-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              title="Home"
            >
              🏠
            </button>
            <button 
              type="button"
              onClick={handleRestart}
              className="text-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer opacity-70 hover:opacity-100"
              title="Restart Session"
            >
              🔄
            </button>
            <div className="h-4 w-px bg-white/20 mx-0.5"></div>
            <button 
              type="button"
              onClick={handleHome}
              className="text-[9px] font-black text-white/80 hover:text-white uppercase tracking-wider pl-1"
            >
              EXIT
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          {/* Active Lesson indicator */}
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-prime-teal-green shadow-sm">
            {sessionMode === 'revision' ? `Practice: C${currentCycle || 1}` : `Active Lesson: ${activeLessonId || 1}`}
          </span>
          {/* Progress Strip */}
          <div className="flex items-center gap-1">
            {masteredCharacters && masteredCharacters.length > 0 ? (
              masteredCharacters.slice(-4).map((char, i) => (
                <span key={i} className="w-5 h-5 bg-white border border-slate-200 rounded-md flex items-center justify-center text-[9px] font-black text-prime-teal-green shadow-sm">
                  {char}
                </span>
              ))
            ) : (
              <span className="text-[9px] font-bold text-slate-400 italic">Tracing</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full">
        {/* Drawing Column */}
        <div className="w-full flex-1 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase italic">
              Trace the Letter
            </h2>
            <span className="text-xs sm:text-sm font-bold text-prime-coral-pink uppercase tracking-widest opacity-80">
              {word?.englishTranslation || ''}
            </span>
          </div>

          {/* Canvas Box */}
          <div
            ref={containerRef}
            className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-prime-warm-base touch-none flex items-center justify-center"
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
              <div className="absolute bottom-4 right-4 flex flex-col items-end pointer-events-none z-20">
                <div className="bg-prime-action-dark/10 px-4 py-1.5 rounded-full text-[10px] font-black text-prime-action-dark uppercase tracking-widest animate-pulse border border-prime-action-dark/20 backdrop-blur-sm shadow-sm">
                  Trace the line
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: IMMEDIATELY BELOW CANVAS */}
          <div className="flex items-center gap-3 w-full mt-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-300 font-bold text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all cursor-pointer text-sm tracking-wider uppercase"
            >
              CLEAR
            </button>
            <button
              type="button"
              disabled={!hasStarted}
              onClick={handleDone}
              className={`flex-1 py-3 px-4 rounded-2xl font-black transition-all text-sm tracking-wider uppercase ${
                hasStarted
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-lg cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              DONE ➜
            </button>
          </div>
        </div>

        {/* Secondary Reference Panel (Right side on desktop, Below buttons on mobile) */}
        <div className="w-full md:w-80 flex flex-col gap-4 bg-prime-warm-base/20 md:bg-white p-4 rounded-2xl border border-prime-warm-base/50 md:border-slate-200 mt-2 md:mt-0 shadow-sm">
          {/* Phonetic sound card */}
          <div className="card-bento-surface flex flex-col items-center justify-center p-4 text-center bg-white/70">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phonetic sound</span>
            <div className="text-3xl font-black text-prime-dark-text italic mb-3">{word?.phonetic || ''}</div>
            <button 
              type="button"
              onClick={() => audioEngine.speak(character)}
              className="w-12 h-12 bg-white text-prime-action-dark rounded-full flex items-center justify-center text-xl shadow-md hover:scale-110 active:scale-95 transition-transform border border-slate-100 cursor-pointer"
              title="Play Sound"
            >
              🔊
            </button>
          </div>

          {/* Example Words Section */}
          {word?.exampleWords && word.exampleWords.length > 0 && (
            <div className="card-bento-surface p-4 bg-white/70 border-prime-warm-base/40">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Words with this letter</span>
              <div className="flex flex-col gap-2">
                {word.exampleWords.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/90 p-2 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-lg font-bold text-prime-dark-text leading-tight">{ex.malayalamText}</span>
                      <span className="text-[10px] font-bold text-prime-coral-pink uppercase tracking-wider opacity-70 truncate w-full">{ex.englishTranslation}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => audioEngine.speak(ex.malayalamText)}
                      className="w-9 h-9 min-w-[36px] bg-prime-action-dark text-white rounded-lg flex items-center justify-center text-xs shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
