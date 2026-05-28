import React, { useRef, useEffect, useState } from 'react';
import { audioEngine } from '../../utils/audioEngine';

/**
 * TracingCanvas Mini-game
 * Teaching: Grapheme shape and phonetics (Phase 0 Foundation)
 * UI: High-visibility Cyber-Pop canvas.
 */

export default function TracingCanvas({ word, onComplete }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Scaled for better tablet fit while maintaining internal detail
    canvas.width = 600;
    canvas.height = 600;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#34d399'; // app.success (Emerald)
    context.lineWidth = 30;
    contextRef.current = context;

    drawGuide();
    audioEngine.speak(word.malayalamText);
  }, [word]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // FIX: Professional ghost letter scaling
    context.font = '900 400px sans-serif'; 
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#1e293b'; // app.surface
    context.fillText(word.malayalamText, canvas.width / 2, canvas.height / 2);
    setHasStarted(false);
  };

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (event) => {
    const { x, y } = getCoordinates(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
    setHasStarted(true);
    if (event.cancelable) event.preventDefault();
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    if (event.cancelable) event.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg animate-pop">
      <div className="text-center">
        <h2 className="text-3xl font-black text-app-success tracking-tighter uppercase mb-1">
          Trace Matrix
        </h2>
        <p className="text-lg font-bold text-app-primary uppercase tracking-[0.3em] leading-none opacity-60">
          {word.phonetic}
        </p>
      </div>

      {/* Enlarged Canvas for better tracing experience */}
      <div className="relative aspect-square w-full bg-slate-900 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border-4 border-slate-800 overflow-hidden touch-none group">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full h-full"
        />
        
        {!hasStarted && (
          <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none">
            <div className="bg-app-primary/10 px-4 py-1 rounded-full border border-app-primary/20 text-[10px] font-black text-app-primary uppercase tracking-widest animate-pulse">
              Calibrate Grapheme
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 w-full px-2">
        <button
          onClick={drawGuide}
          className="btn-arcade btn-arcade-surface flex-1 py-3 text-xs"
        >
          Reset
        </button>
        
        <button
          onClick={() => audioEngine.speak(word.malayalamText)}
          className="btn-arcade btn-arcade-primary flex-1 py-3 text-2xl shadow-violet-900/50"
        >
          🔊
        </button>

        <button
          disabled={!hasStarted}
          onClick={() => onComplete(true, 5000)}
          className={`btn-arcade flex-1 py-3 text-sm ${hasStarted ? 'btn-arcade-success' : 'opacity-20 cursor-not-allowed grayscale'}`}
        >
          SYNC ➜
        </button>
      </div>
    </div>
  );
}
