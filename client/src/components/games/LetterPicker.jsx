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
 * UI: Cyber-Pop arcade blocks.
 */

function DraggableLetter({ id, char }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.4 : 1,
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
      <div className="w-16 h-16 sm:w-20 sm:h-20 btn-arcade btn-arcade-primary text-3xl font-black rounded-xl">
        {char}
      </div>
      
      {/* HUD-style Audio Button */}
      <button
        onPointerDown={playSound}
        onMouseDown={playSound}
        className="absolute -top-2 -right-2 w-8 h-8 bg-app-surface text-app-success border border-slate-700 rounded-lg flex items-center justify-center text-sm shadow-arcade active:scale-90 transition-transform pointer-events-auto z-20"
        title="Decrypt"
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
      className={`w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed rounded-xl flex items-center justify-center text-2xl font-black transition-all
        ${isOver ? 'bg-app-primary/10 border-app-primary scale-105 shadow-[0_0_20px_rgba(124,58,237,0.2)]' : 'border-slate-800 bg-slate-900/40'}
        ${isFilled ? (isCorrect ? 'bg-app-success/10 border-app-success text-app-success shadow-inner' : 'bg-app-error/10 border-app-error text-app-error shadow-inner') : 'text-transparent'}`}
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
        delay: 150,
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
      <div className="flex flex-col items-center gap-4 text-center p-8">
        <div className="text-6xl animate-wiggle">🛸</div>
        <div className="text-xl font-black text-app-error uppercase tracking-[0.2em]">Data Missing</div>
        <p className="text-app-textMuted font-bold text-sm italic">Manifest stream corrupted.</p>
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
    <div className="flex flex-col items-center gap-8 w-full animate-pop">
      
      <div className="text-center">
        <h2 className="text-3xl font-black text-app-textMain tracking-tighter uppercase mb-1">
          {word.englishTranslation}
        </h2>
        <p className="text-base font-bold text-app-primary uppercase tracking-[0.3em] leading-none opacity-60">
          DATA_{word.wordId} // {word.phonetic}
        </p>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-wrap justify-center gap-3 p-6 bg-slate-900/60 rounded-[2rem] border-2 border-slate-800 shadow-inner">
          {word.requiredCharacters.map((char, index) => (
            <DroppableSlot 
              key={`slot-${index}`} 
              id={`slot-${index}`} 
              expectedChar={char}
              actualChar={placedLetters[index]}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 min-h-[100px] items-center">
          {!feedback && shuffledLetters.map((letter) => (
            !placedLetters.includes(letter.value) && (
              <DraggableLetter key={letter.id} id={letter.id} char={letter.value} />
            )
          ))}
        </div>
      </DndContext>

      {feedback && (
        <div className={`w-full max-w-sm p-8 rounded-[2rem] border-4 animate-pop shadow-[0_0_50px_rgba(0,0,0,0.5)]
          ${feedback.isCorrect ? 'bg-app-success/10 border-app-success/40' : 'bg-app-error/10 border-app-error/40'}`}>
          
          <div className="flex items-center gap-4 mb-6">
             <div className="text-5xl">{feedback.isCorrect ? '💎' : '⚠️'}</div>
             <h3 className={`text-xl font-black uppercase tracking-[0.1em] ${feedback.isCorrect ? 'text-app-success' : 'text-app-error'}`}>
               {feedback.isCorrect ? 'Checksum Match' : 'Mismatch'}
             </h3>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl shadow-inner border border-slate-800 mb-8 text-center font-mono">
            <div className="text-5xl font-black text-app-primary tracking-tighter mb-2">{word.malayalamText}</div>
            <p className="text-xs font-bold text-app-textMuted uppercase tracking-widest">{word.phonetic}</p>
          </div>

          <button 
            onClick={() => onComplete(feedback.isCorrect, feedback.time)}
            className={`btn-arcade w-full py-4 text-xl ${feedback.isCorrect ? 'btn-arcade-success' : 'btn-arcade-primary'}`}
          >
            {feedback.isCorrect ? 'CONTINUE ➜' : 'RETRY ➜'}
          </button>
        </div>
      )}

      {!feedback && (
        <button 
          onClick={() => setPlacedLetters(Array(word.requiredCharacters.length).fill(null))}
          className="btn-arcade btn-arcade-surface px-6 py-1 text-[10px] opacity-40 hover:opacity-100"
        >
          Flush Buffer
        </button>
      )}
    </div>
  );
}
