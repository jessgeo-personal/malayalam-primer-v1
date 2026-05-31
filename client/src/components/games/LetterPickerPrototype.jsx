import React, { useState, useEffect, useMemo } from 'react';
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
import { audioEngine } from '../../utils/audioEngine';

/**
 * LetterPickerPrototype
 * PROTOTYPE: Implements visual reordering for Malayalam Mathras.
 */

// Mathras that visually appear to the left of the consonant
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ'];
// Mathras that visually surround the consonant (left and right parts)
const SURROUND_MATHRAS = ['ൊ', 'ോ', 'ൌ'];

// Dotted circle for representing a placeholder consonant
const DOTTED_CIRCLE = '◌';

function DraggableLetter({ id, char, isPlaced = false, type = 'normal' }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { char, isPlaced }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
    opacity: isDragging ? 0.3 : 1,
  } : {
    zIndex: 1
  };

  const playSound = (e) => {
    e.stopPropagation();
    e.preventDefault();
    audioEngine.speak(char);
  };

  // For mathras in the pool, show them with the dotted circle for clarity
  const displayChar = (!isPlaced && (LEFT_MATHRAS.includes(char) || SURROUND_MATHRAS.includes(char)))
    ? (SURROUND_MATHRAS.includes(char) ? `${char[0] || ''}${DOTTED_CIRCLE}${char[1] || ''}` : `${char}${DOTTED_CIRCLE}`)
    : char;
  
  // Note: Malayalam surround mathras are single Unicode points but have 2 glyphs.
  // Rendering 'ോ' + '◌' usually renders correctly as 'ൊ◌ാ' or similar depending on font.
  const renderedChar = (!isPlaced && SURROUND_MATHRAS.includes(char)) 
    ? <span className="relative">{char}<span className="opacity-20 absolute inset-0 flex items-center justify-center">{DOTTED_CIRCLE}</span></span>
    : displayChar;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative group shrink-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div className={`w-14 h-14 sm:w-16 sm:h-16 text-2xl font-black rounded-2xl transition-all flex items-center justify-center shadow-lg
        ${isPlaced ? 'bg-white text-prime-action-dark border-2 border-slate-100' : 'bg-prime-action-dark text-white border-b-4 border-slate-700 active:translate-y-0.5 active:border-b-0'}`}>
        {renderedChar}
      </div>
      
      {!isPlaced && (
        <button
          onPointerDown={playSound}
          onMouseDown={playSound}
          className="absolute -top-2 -right-2 w-7 h-7 bg-prime-warm-base text-prime-action-dark border border-white/20 rounded-full flex items-center justify-center text-[10px] shadow-lg hover:scale-110 active:scale-90 transition-transform pointer-events-auto z-20"
        >
          🔊
        </button>
      )}
    </div>
  );
}

function DroppableSlot({ id, expectedChar, actualCharObj }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const isFilled = !!actualCharObj;
  const isCorrect = isFilled && actualCharObj.value === expectedChar;
  
  const isLeftMathra = LEFT_MATHRAS.includes(expectedChar);
  const isSurroundMathra = SURROUND_MATHRAS.includes(expectedChar);

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed rounded-2xl flex items-center justify-center text-3xl font-black transition-all relative
        ${isOver ? 'bg-prime-coral-pink/10 border-prime-coral-pink scale-105' : 'border-slate-400 bg-prime-canvas/50 shadow-inner'}
        ${isFilled && !isOver ? (isCorrect ? 'bg-prime-teal-green/5 border-prime-teal-green' : 'bg-prime-error/5 border-prime-error') : ''}`}
    >
      {!isFilled && (isLeftMathra || isSurroundMathra) && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-200 pointer-events-none">
          {isSurroundMathra ? `${expectedChar}` : `${expectedChar}${DOTTED_CIRCLE}`}
        </div>
      )}
      {isFilled ? (
        <DraggableLetter id={actualCharObj.id} char={actualCharObj.value} isPlaced={true} />
      ) : null}
    </div>
  );
}

export default function LetterPickerPrototype({ word, onComplete }) {
  const [pool, setPool] = useState([]); 
  const [slots, setSlots] = useState([]); 
  const [startTime, setStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    })
  );

  // Logic to calculate visual order of slots
  const visualSlots = useMemo(() => {
    if (!word.requiredCharacters) return [];
    
    return word.requiredCharacters.map((char, index) => {
      let visualOrder = index * 10;
      
      // If this is a mathra that goes to the left, move its visual order to just before its anchor (index-1)
      if ((LEFT_MATHRAS.includes(char) || SURROUND_MATHRAS.includes(char)) && index > 0) {
        visualOrder = (index - 1) * 10 - 5;
      }
      
      return {
        char,
        originalIndex: index,
        visualOrder
      };
    }).sort((a, b) => a.visualOrder - b.visualOrder);
  }, [word.requiredCharacters]);

  useEffect(() => {
    if (!word.requiredCharacters || word.requiredCharacters.length === 0) return;
    
    const initialPool = word.requiredCharacters.map((char, index) => ({
      value: char,
      id: `tile-${index}-${Math.random().toString(36).substr(2, 9)}`
    })).sort(() => Math.random() - 0.5);
    
    setPool(initialPool);
    setSlots(Array(word.requiredCharacters.length).fill(null));
    setFeedback(null);
    setStartTime(Date.now());
  }, [word]);

  if (!word.requiredCharacters || word.requiredCharacters.length === 0) {
    return <div>Data Missing</div>;
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (feedback) return;

    const tileId = active.id;
    const isFromPlaced = active.data.current?.isPlaced;
    const charValue = active.data.current?.char;

    if (over && over.id.startsWith('slot-')) {
      const slotIndex = parseInt(over.id.split('-')[1]);
      
      if (slots[slotIndex] && slots[slotIndex].id !== tileId) return;

      const newSlots = [...slots];
      
      if (isFromPlaced) {
        const oldSlotIndex = slots.findIndex(s => s?.id === tileId);
        if (oldSlotIndex !== -1) newSlots[oldSlotIndex] = null;
      } else {
        setPool(prev => prev.filter(t => t.id !== tileId));
      }

      newSlots[slotIndex] = { id: tileId, value: charValue };
      setSlots(newSlots);

      if (newSlots.every(s => s !== null)) {
        const attempt = newSlots.map(s => s.value).join('');
        const isCorrect = attempt === word.malayalamText;
        setFeedback({ 
          isCorrect, 
          time: Date.now() - startTime,
          attempt
        });
      }
    } 
    else if (isFromPlaced) {
      const oldSlotIndex = slots.findIndex(s => s?.id === tileId);
      if (oldSlotIndex !== -1) {
        const newSlots = [...slots];
        newSlots[oldSlotIndex] = null;
        setSlots(newSlots);
        setPool(prev => [...prev, { id: tileId, value: charValue }]);
      }
    }
  };

  const clearAll = () => {
    const placed = slots.filter(s => s !== null);
    setPool(prev => [...prev, ...placed].sort(() => Math.random() - 0.5));
    setSlots(Array(word.requiredCharacters.length).fill(null));
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
      <div className="text-center">
        <h2 className="text-2xl font-black uppercase">Mathra Prototype</h2>
        <p className="text-xs text-slate-400">Testing visual reordering logic</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-8 p-10 bg-white rounded-[40px] shadow-2xl border-[16px] border-prime-warm-base w-full">
          
          {/* Reordered Drop Zones */}
          <div className="flex flex-wrap justify-center gap-4 py-8 border-b border-slate-100">
            {visualSlots.map((slotInfo) => (
              <DroppableSlot 
                key={`slot-${slotInfo.originalIndex}`} 
                id={`slot-${slotInfo.originalIndex}`} 
                expectedChar={slotInfo.char}
                actualCharObj={slots[slotInfo.originalIndex]}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 content-center min-h-[160px]">
            {!feedback && pool.map((tile) => (
              <DraggableLetter key={tile.id} id={tile.id} char={tile.value} />
            ))}
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl text-white font-bold text-center ${feedback.isCorrect ? 'bg-prime-teal-green' : 'bg-prime-error'}`}>
              {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
              <button onClick={() => onComplete(feedback.isCorrect, feedback.time)} className="ml-4 underline">Continue</button>
            </div>
          )}

          <button onClick={clearAll} className="text-[10px] font-black uppercase tracking-widest text-slate-300">Clear All</button>
        </div>
      </DndContext>

      <div className="bg-white p-4 rounded-xl border border-slate-100 w-full text-center">
        <div className="text-sm font-bold text-slate-400 uppercase mb-1">Target Word</div>
        <div className="text-4xl font-black">{word.malayalamText}</div>
        <div className="text-slate-400 italic">{word.englishTranslation} ({word.phonetic})</div>
      </div>
    </div>
  );
}
