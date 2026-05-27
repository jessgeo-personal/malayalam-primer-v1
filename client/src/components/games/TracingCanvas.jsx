import React, { useRef, useEffect, useState } from 'react';
import { audioEngine } from '../../utils/audioEngine';

/**
 * TracingCanvas Mini-game
 * Teaching: Grapheme shape and phonetics (Phase 0 Foundation)
 */

export default function TracingCanvas({ word, onComplete }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 600;
    canvas.style.width = `100%`;
    canvas.style.height = `100%`;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = '#3b82f6'; // Blue-500
    context.lineWidth = 20;
    contextRef.current = context;

    drawGuide();
    
    // Announce the character
    audioEngine.speak(word.malayalamText);
  }, [word]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Ghost Character
    context.font = '300px serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#e5e7eb'; // Gray-200
    context.fillText(word.malayalamText, canvas.width / 2, canvas.height / 2);
  };

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (event.touches) {
      return {
        x: (event.touches[0].clientX - rect.left) * scaleX,
        y: (event.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (event) => {
    const { x, y } = getCoordinates(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
    setHasStarted(true);
    event.preventDefault();
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    event.preventDefault();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const handleFinish = () => {
    // For now, we assume success if they started drawing. 
    // In a future update, we can add pixel-based verification.
    onComplete(true, 5000); // Simulated time
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800">{word.englishTranslation}</h2>
        <p className="text-2xl text-blue-600 font-semibold mt-2">{word.phonetic}</p>
        <p className="text-gray-500 italic mt-1">Trace the character and listen to the sound</p>
      </div>

      <div className="relative aspect-square w-full bg-white rounded-3xl shadow-inner border-4 border-gray-100 overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair"
        />
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={drawGuide}
          className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold active:bg-gray-300 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={() => audioEngine.speak(word.malayalamText)}
          className="flex-1 py-4 bg-yellow-400 text-yellow-900 rounded-xl font-bold active:bg-yellow-500 transition-colors"
        >
          🔊 Hear Sound
        </button>
        <button
          disabled={!hasStarted}
          onClick={handleFinish}
          className={`flex-1 py-4 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95
            ${hasStarted ? 'bg-green-500' : 'bg-gray-300 cursor-not-allowed'}`}
        >
          Done ➜
        </button>
      </div>
    </div>
  );
}
