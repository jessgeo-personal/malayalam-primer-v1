import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  TouchSensor, 
  MouseSensor, 
  useSensor, 
  useSensors,
  pointerWithin
} from '@dnd-kit/core';
import { audioEngine } from '../../services/audioEngine';

/**
 * Suffix Snapper Mini-game
 * Teaches plurals and case markers using magnetic snap mechanics.
 */

function DraggableSuffix({ id, char }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { char }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
    opacity: isDragging ? 0.3 : 1,
  } : {
    zIndex: 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative group shrink-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className="px-8 py-4 bg-prime-action-dark text-white text-2xl font-black rounded-full shadow-xl border-b-4 border-slate-700 active:translate-y-0.5 active:border-b-0">
        {char}
      </div>
    </div>
  );
}

function DropZone({ id, baseWord, morphedBase, placedSuffix, isCorrect }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const displayWord = (morphedBase && isCorrect) ? morphedBase : baseWord;
  const isMorphing = morphedBase && isCorrect;

  return (
    <div 
      ref={setNodeRef}
      className={`flex items-center gap-4 p-12 bg-white rounded-[40px] shadow-2xl border-[16px] border-prime-warm-base transition-all
        ${isOver ? 'scale-105 border-prime-coral-pink' : ''}`}
    >
      <div className={`text-6xl font-black tracking-tighter transition-colors duration-500
        ${isMorphing ? 'text-prime-coral-pink animate-pulse' : 'text-prime-dark-text'}`}>
        {displayWord}
      </div>
      <div className={`w-32 h-20 border-4 border-dashed rounded-3xl flex items-center justify-center text-4xl font-black transition-all
        ${isOver ? 'bg-prime-coral-pink/10 border-prime-coral-pink' : 'border-slate-200 bg-prime-canvas/50'}
        ${placedSuffix ? 'bg-prime-teal-green/10 border-prime-teal-green border-solid' : ''}`}>
        {placedSuffix || (
          <span className="text-slate-200">?</span>
        )}
      </div>
    </div>
  );
}

export default function SuffixSnapper({ word, onComplete }) {
  const [suffixes, setSuffixes] = useState([]);
  const [placedSuffix, setPlacedSuffix] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [startTime] = useState(Date.now());

  const [isSuccess, setIsSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 5 },
    })
  );

  useEffect(() => {
    if (!word.targetSuffix) return;
    
    const initialSuffixes = [
      word.targetSuffix,
      ...(word.distractorSuffixes || [])
    ].sort(() => Math.random() - 0.5);
    
    setSuffixes(initialSuffixes.map((s, i) => ({ id: `suffix-${i}`, value: s })));
    setPlacedSuffix(null);
    setFeedback(null);
    setIsSuccess(false);
  }, [word]);

  const getFeedbackMessage = (suffix) => {
    if (suffix === 'മാർ') return "മാർ (maar) is for people who are older or need respect (like mothers or teachers).";
    if (suffix === 'ങ്ങൾ') return "ങ്ങൾ (ngal) is for words ending in the 'M' sound (ം). Example: മരം -> മരങ്ങൾ.";
    if (suffix === 'ുകൾ') return "ുകൾ (ukal) is for words ending in a 'U' sound or a chillu letter. Example: വീട് -> വീടുകൾ.";
    if (suffix === 'കൾ') return "കൾ (kal) is the standard plural ending for most objects, animals, and young children.";
    if (['ിൽ', 'യിൽ', 'ത്തിൽ', 'ട്ടിൽ', 'ലിൽ', 'രിൽ', 'ളിൽ', 'നിൽ'].includes(suffix)) return "This ending means 'in' or 'on'. It doesn't make a word plural!";
    return `That ending doesn't fit here. Try another one!`;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (feedback || isSuccess) return;

    if (over && over.id === 'suffix-drop-zone') {
      const char = active.data.current.char;
      const isCorrect = char === word.targetSuffix;
      
      setPlacedSuffix(char);
      
      if (isCorrect) {
        setIsSuccess(true);
        audioEngine.speak(word.malayalamText);
        
        // Delay the overlay so the user can watch the morphing animation
        setTimeout(() => {
          setFeedback({
            isCorrect,
            time: Date.now() - startTime
          });
        }, 1500);
      } else {
        // Show incorrect overlay immediately
        setFeedback({
          isCorrect,
          time: Date.now() - startTime
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-5xl animate-pop relative">
      
      {/* Tutorial Guide Overlay - Repositioned to left mid section */}
      {word.showTutorial && !placedSuffix && !feedback && (
        <div 
          data-testid="tutorial-guide"
          className="absolute -left-32 top-1/2 -translate-y-1/2 z-[60] pointer-events-none flex flex-col items-center justify-center"
        >
          <div className="bg-prime-action-dark text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl animate-bounce mb-4 text-center max-w-[180px]">
            Drag the correct ending!
          </div>
          <div className="text-6xl animate-pulse transform rotate-90">☝️</div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-black text-prime-dark-text tracking-tight uppercase italic mb-2">Suffix Snapper</h2>
        <div className="bg-prime-action-dark/5 border border-prime-action-dark/10 rounded-2xl px-6 py-2 shadow-sm">
          <p className="text-[11px] font-black text-prime-action-dark uppercase tracking-widest">
            Complete the word for: "{word.englishTranslation}"
          </p>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
        {/* Assembly Area */}
        <DropZone 
          id="suffix-drop-zone" 
          baseWord={word.baseWord} 
          morphedBase={word.morphedBase}
          placedSuffix={placedSuffix}
          isCorrect={isSuccess}
        />

        {/* Choice Pool */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {!feedback && suffixes.map((s) => (
            <DraggableSuffix key={s.id} id={s.id} char={s.value} />
          ))}
        </div>
      </DndContext>

      {/* Feedback Overlay */}
      {feedback && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in bg-black/20 backdrop-blur-sm`}>
          <div className={`p-12 flex flex-col items-center text-center shadow-2xl max-w-md w-full rounded-[40px]
            ${feedback.isCorrect ? 'bg-prime-teal-green' : 'bg-prime-error'}`}>
            <div className="text-8xl mb-6">{feedback.isCorrect ? '✨' : '🩹'}</div>
            <h3 className="text-4xl font-black text-white uppercase mb-4">
              {feedback.isCorrect ? 'Excellent!' : 'Not Quite!'}
            </h3>
            <p className="text-white/80 font-bold mb-8 italic">
              {feedback.isCorrect 
                ? `You made "${word.malayalamText}"!`
                : getFeedbackMessage(placedSuffix)}
            </p>
            <button 
              onClick={() => onComplete(feedback.isCorrect, feedback.time)}
              className="px-12 py-5 bg-white text-prime-dark-text rounded-full font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {feedback.isCorrect ? 'CONTINUE ➜' : 'TRY AGAIN ➜'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
