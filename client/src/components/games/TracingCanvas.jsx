import React, { useRef, useEffect, useState } from 'react';
import { audioEngine } from '../../utils/audioEngine';

/**
 * TracingCanvas Mini-game
 * UI: Neo-Bento Feature Block. Large, centered canvas for optimal tablet tracing.
 */

export default function TracingCanvas({ word, onComplete }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    // High-resolution internal buffer for smooth curves
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#E35973'; // prime.coralPink
    context.lineWidth = 45;
    contextRef.current = context;

    drawGuide();
    audioEngine.speak(word.malayalamText);
  }, [word]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calibrated ghost guide - now on a darker background for contrast
    context.font = '900 600px "Plus Jakarta Sans", sans-serif'; 
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#cbd5e1'; // slate-300 for better visibility
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
    <div className="flex flex-col items-center gap-10 w-full animate-pop">
      <div className="text-center">
        <h2 className="text-4xl font-black text-prime-dark-text tracking-tight uppercase italic mb-1">
          Trace the Letter
        </h2>
        <p className="text-xl font-bold text-prime-coral-pink uppercase tracking-[0.4em] leading-none opacity-60">
          {word.phonetic}
        </p>
      </div>

      {/* Main Tracing Hub - now with prime-warm-base background */}
      <div className="w-full max-w-lg aspect-square bg-prime-warm-base rounded-bento shadow-2xl border-[16px] border-prime-warm-base overflow-hidden touch-none relative group transition-transform hover:scale-[1.01]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-full h-full relative z-10"
        />
        
        {!hasStarted && (
          <div className="absolute bottom-8 right-8 flex flex-col items-end pointer-events-none z-20">
            <div className="bg-prime-action-dark/10 px-6 py-2 rounded-pill text-[10px] font-black text-prime-action-dark uppercase tracking-widest animate-pulse border border-prime-action-dark/20 backdrop-blur-sm shadow-sm">
              Trace the line
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 w-full max-w-lg px-4">
        <button
          onClick={drawGuide}
          className="btn-pill bg-white border border-slate-200 text-slate-400 flex-1 justify-center"
        >
          CLEAR
        </button>
        
        <button
          onClick={() => audioEngine.speak(word.malayalamText)}
          className="btn-pill bg-prime-action-dark flex-1 justify-center text-2xl"
        >
          🔊
        </button>

        <button
          disabled={!hasStarted}
          onClick={() => onComplete(true, 5000)}
          className={`btn-pill flex-1 justify-center text-lg ${hasStarted ? 'bg-prime-teal-green' : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'}`}
        >
          DONE ➜
        </button>
      </div>
    </div>
  );
}
