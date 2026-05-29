import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  TouchSensor, 
  MouseSensor, 
  useSensor, 
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import { audioEngine } from '../../utils/audioEngine';

/**
 * LetterPicker Mini-game
 * UI: Neo-Bento Minimalism. Clean crisp tiles and smooth arcade interaction.
 */

function DraggableLetter({ id, char }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
  } : {
    zIndex: 1
  };

  const playSound = (e) => {
    e.stopPropagation();
    e.preventDefault();
    audioEngine.speak(char);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="relative group shrink-0"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-prime-action-dark text-white text-3xl font-black rounded-2xl shadow-lg border-b-4 border-slate-700 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center cursor-grab active:cursor-grabbing">
        {char}
      </div>
      
      {/* Audio Button - Sleek */}
      <button
        onPointerDown={playSound}
        onMouseDown={playSound}
        className="absolute -top-2 -right-2 w-8 h-8 bg-prime-warm-base text-prime-action-dark border border-white/20 rounded-full flex items-center justify-center text-xs shadow-lg hover:scale-110 active:scale-90 transition-transform pointer-events-auto z-20"
      >
        🔊
      </button>
    </div>
  );
}

function DroppableSlot({ id, expectedChar, actualChar }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const isFilled = !!actualChar;
  const isCorrect = isFilled && actualChar === expectedChar;

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed rounded-2xl flex items-center justify-center text-3xl font-black transition-all
        ${isOver ? 'bg-prime-coral-pink/20 border-prime-coral-pink scale-105' : 'border-slate-400 bg-prime-canvas/50'}
        ${isFilled ? (isCorrect ? 'bg-prime-teal-green/10 border-prime-teal-green text-prime-teal-green shadow-inner' : 'bg-prime-error/10 border-prime-error text-prime-error shadow-inner') : 'text-transparent'}`}
    >
      {actualChar || '0'}
    </div>
  );
}

export default function LetterPicker({ word, onComplete }) {
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    if (!word.requiredCharacters || word.requiredCharacters.length === 0) return;
    
    const shuffled = [...word.requiredCharacters]
      .map((value, index) => ({ value, id: `bit-${index}-${Math.random()}` }))
      .sort(() => Math.random() - 0.5);
    
    setShuffledLetters(shuffled);
    setPlacedLetters(Array(word.requiredCharacters.length).fill(null));
    setFeedback(null);
    setStartTime(Date.now());
  }, [word]);

  if (!word.requiredCharacters || word.requiredCharacters.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 text-center p-8 bg-prime-warm-base rounded-bento">
        <div className="text-6xl animate-bounce-slow">📦</div>
        <h3 className="text-xl font-black text-prime-dark-text uppercase tracking-tight">Cargo Unspecified</h3>
        <p className="text-slate-500 font-medium text-sm">Please update the manifest for "{word.englishTranslation}".</p>
      </div>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (feedback) return;

    if (over && over.id.startsWith('slot-')) {
      const slotIndex = parseInt(over.id.split('-')[1]);
      const letterObj = shuffledLetters.find(l => l.id === active.id);
      
      const newPlaced = [...placedLetters];
      newPlaced[slotIndex] = letterObj.value;
      setPlacedLetters(newPlaced);

      if (newPlaced.every(l => l !== null)) {
        const isCorrect = newPlaced.join('') === word.malayalamText;
        setFeedback({ 
          isCorrect, 
          time: Date.now() - startTime,
          attempt: newPlaced.join('')
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full animate-pop">
      
      <div className="text-center">
        <h2 className="text-4xl font-black text-prime-dark-text tracking-tighter uppercase italic mb-1">
          {word.englishTranslation}
        </h2>
        <p className="text-xl font-extrabold text-prime-coral-pink uppercase tracking-[0.4em] leading-none opacity-80">
          {word.phonetic}
        </p>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-wrap justify-center gap-4 p-8 bg-white/50 rounded-bento border border-slate-100 shadow-inner">
          {word.requiredCharacters.map((char, index) => (
            <DroppableSlot 
              key={`slot-${index}`} 
              id={`slot-${index}`} 
              expectedChar={char}
              actualChar={placedLetters[index]}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 min-h-[120px] items-center">
          {!feedback && shuffledLetters.map((letter) => (
            !placedLetters.includes(letter.value) && (
              <DraggableLetter key={letter.id} id={letter.id} char={letter.value} />
            )
          ))}
        </div>
      </DndContext>

      {feedback && (
        <div className={`w-full max-w-md p-8 rounded-bento border-4 animate-pop shadow-xl
          ${feedback.isCorrect ? 'bg-prime-teal-green/5 border-prime-teal-green/20' : 'bg-prime-error/5 border-prime-error/20'}`}>
          
          <div className="flex items-center gap-4 mb-6">
             <div className="text-5xl">{feedback.isCorrect ? '✅' : '❌'}</div>
             <div>
               <h3 className={`text-xl font-black uppercase tracking-tight ${feedback.isCorrect ? 'text-prime-teal-green' : 'text-prime-error'}`}>
                 {feedback.isCorrect ? 'Correct!' : 'Try Again!'}
               </h3>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Check the spelling</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-inner border border-slate-50 mb-8 text-center">
            <div className="text-5xl font-black text-prime-dark-text tracking-tighter mb-2 italic uppercase">{word.malayalamText}</div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{word.phonetic}</p>
          </div>

          <button 
            onClick={() => onComplete(feedback.isCorrect, feedback.time)}
            className={`btn-pill w-full justify-center py-4 text-xl ${feedback.isCorrect ? 'bg-prime-teal-green' : 'bg-prime-action-dark'}`}
          >
            {feedback.isCorrect ? 'CONTINUE ➜' : 'RETRY ➜'}
          </button>
        </div>
      )}

      {!feedback && (
        <button 
          onClick={() => setPlacedLetters(Array(word.requiredCharacters.length).fill(null))}
          className="btn-pill bg-white border border-slate-200 text-slate-300 py-1.5 px-4 text-[10px]"
        >
          CLEAR TILES
        </button>
      )}
    </div>
  );
}
