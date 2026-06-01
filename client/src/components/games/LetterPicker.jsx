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
 * Word Assembly Mini-game (LetterPicker)
 * UI: Side-by-side tablet layout with high-contrast feedback and clear instructions.
 * Feature: Supports visual reordering and splitting for Malayalam Mathras (v2).
 */

// Mathras that visually appear to the left of the consonant
const LEFT_MATHRAS = ['െ', 'േ', 'ൈ'];
// Mathras that visually surround the consonant (left and right parts)
const SURROUND_MATHRAS = ['ൊ', 'ോ', 'ൌ'];

// Dictionary to map the split visual parts of a surround mathra
const SURROUND_PARTS = {
  'ൊ': { left: 'െ', right: 'ാ' },
  'ോ': { left: 'േ', right: 'ാ' },
  'ൌ': { left: 'െ', right: 'ൗ' }
};

// Dotted circle for representing a placeholder consonant
const DOTTED_CIRCLE = '◌';

function DraggableLetter({ id, char, isPlaced = false, isSurroundLeftOnly = false }) {
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

  // Determine what to display based on state
  let renderedChar = char;
  if (isSurroundLeftOnly && SURROUND_PARTS[char]) {
    renderedChar = SURROUND_PARTS[char].left;
  } else if (!isPlaced && SURROUND_MATHRAS.includes(char)) {
    renderedChar = <span className="relative">{char}<span className="opacity-20 absolute inset-0 flex items-center justify-center">{DOTTED_CIRCLE}</span></span>;
  } else if (!isPlaced && LEFT_MATHRAS.includes(char)) {
    renderedChar = `${char}${DOTTED_CIRCLE}`;
  }

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
      {isFilled ? (
        <DraggableLetter id={actualCharObj.id} char={actualCharObj.value} isPlaced={true} isSurroundLeftOnly={isSurroundMathra} />
      ) : null}
    </div>
  );
}

export default function LetterPicker({ word, onComplete }) {
  const [pool, setPool] = useState([]); // Tiles available to drag
  const [slots, setSlots] = useState([]); // Tiles placed in boxes
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

  // Logic to calculate visual order of slots based on phonetic array
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
    
    // Initialize pool with unique IDs
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
    return (
      <div className="flex flex-col items-center gap-6 text-center p-8 bg-prime-warm-base rounded-bento">
        <div className="text-6xl animate-bounce-slow">📦</div>
        <h3 className="text-xl font-black text-prime-dark-text uppercase tracking-tight">Data Missing</h3>
        <p className="text-slate-500 font-medium text-sm">Please update splits for "{word.englishTranslation}".</p>
      </div>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (feedback) return;

    const tileId = active.id;
    const isFromPlaced = active.data.current?.isPlaced;
    const charValue = active.data.current?.char;

    // 1. Dropped into a Slot
    if (over && over.id.startsWith('slot-')) {
      const slotIndex = parseInt(over.id.split('-')[1]);
      
      // Prevent dropping into an already occupied slot unless it's the same tile
      if (slots[slotIndex] && slots[slotIndex].id !== tileId) return;

      const newSlots = [...slots];
      
      // If moving from another slot, clear the old one
      if (isFromPlaced) {
        const oldSlotIndex = slots.findIndex(s => s?.id === tileId);
        if (oldSlotIndex !== -1) newSlots[oldSlotIndex] = null;
      } else {
        // If from pool, remove from pool
        setPool(prev => prev.filter(t => t.id !== tileId));
      }

      newSlots[slotIndex] = { id: tileId, value: charValue };
      setSlots(newSlots);

      // Check Completion
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
    // 2. Dropped outside (return to pool if it was placed)
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
    // Return everything to pool
    const placed = slots.filter(s => s !== null);
    setPool(prev => [...prev, ...placed].sort(() => Math.random() - 0.5));
    setSlots(Array(word.requiredCharacters.length).fill(null));
    setFeedback(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-7xl animate-pop">
      
      {/* Title & Instructions */}
      <div className="w-full flex flex-col items-center text-center">
        <h2 className="text-4xl font-black text-prime-dark-text tracking-tight uppercase italic mb-2">Word Assembly</h2>
        <div className="bg-prime-action-dark/5 border border-prime-action-dark/10 rounded-2xl px-6 py-2 shadow-sm">
          <p className="text-[11px] font-black text-prime-action-dark uppercase tracking-widest">
            Drag the tiles in the correct order to build the word.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-8 w-full">
        {/* Left Column: Interactive Assembly */}
        <DndContext 
          sensors={sensors} 
          collisionDetection={pointerWithin} 
          onDragEnd={handleDragEnd}
        >
          <div className="flex-[3] flex flex-col gap-8 p-10 bg-white rounded-[40px] shadow-2xl border-[16px] border-prime-warm-base relative overflow-hidden min-h-[450px]">
            
            {/* Reordered Drop Zones */}
            <div className="flex flex-wrap justify-center gap-4 py-8 border-b border-slate-100">
              {visualSlots.map((slotInfo) => {
                const elements = [];
                
                // 1. Render the primary drop slot
                elements.push(
                  <DroppableSlot 
                    key={`slot-${slotInfo.originalIndex}`} 
                    id={`slot-${slotInfo.originalIndex}`} 
                    expectedChar={slotInfo.char}
                    actualCharObj={slots[slotInfo.originalIndex]}
                  />
                );

                // 2. Surround Mathra Logic:
                // If this is a consonant slot (originalIndex), check if the NEXT logical character is a Surround Mathra.
                const nextCharIndex = slotInfo.originalIndex + 1;
                const nextCharObj = slots[nextCharIndex];
                
                if (nextCharObj && SURROUND_MATHRAS.includes(nextCharObj.value)) {
                  const rightPart = SURROUND_PARTS[nextCharObj.value].right;
                  elements.push(
                    <div 
                      key={`surround-right-${nextCharIndex}`} 
                      className="w-12 h-16 sm:h-20 flex items-center justify-center text-3xl font-black text-prime-action-dark animate-fade-in -ml-2 -mr-2 pointer-events-none"
                    >
                      {rightPart}
                    </div>
                  );
                }

                return elements;
              })}
            </div>

            {/* Tile Pool */}
            <div className="flex-1 flex flex-wrap justify-center gap-6 content-center min-h-[160px]">
              {!feedback && pool.map((tile) => (
                <DraggableLetter key={tile.id} id={tile.id} char={tile.value} />
              ))}
            </div>

            {/* Internal Reset */}
            {!feedback && (
              <button 
                onClick={clearAll}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300 hover:text-prime-error transition-colors uppercase tracking-widest"
              >
                Clear All Tiles
              </button>
            )}
          </div>
        </DndContext>

        {/* Right Column: Reference Info */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          <div className="card-bento-surface flex-1 flex flex-col items-center justify-center p-8 text-center bg-prime-warm-base/30 relative overflow-hidden group">
             {/* Feedback Overlay */}
             {feedback && (
               <div className={`absolute inset-0 z-50 p-6 flex flex-col items-center justify-center text-center animate-fade-in
                 ${feedback.isCorrect ? 'bg-prime-teal-green' : 'bg-[#1A1E26]'}`}>
                 
                 <div className="text-6xl mb-4">{feedback.isCorrect ? '✅' : '❌'}</div>
                 
                 {!feedback.isCorrect && (
                   <div className="mb-6 animate-pop bg-white/10 p-4 rounded-3xl border border-white/10 w-full">
                     <p className="text-white/60 font-black mb-1 uppercase tracking-widest text-[9px]">Correct spelling:</p>
                     <div className="text-4xl font-black text-white mb-2 leading-tight">{word.malayalamText}</div>
                     <div className="text-xs font-black text-white/80 bg-white/10 px-4 py-1.5 rounded-pill inline-block uppercase tracking-[0.2em]">{word.phonetic}</div>
                   </div>
                 )}

                 <h3 className={`text-2xl font-black text-white uppercase mb-6 ${!feedback.isCorrect ? 'text-prime-error' : ''}`}>
                   {feedback.isCorrect ? 'Correct!' : 'Try Again!'}
                 </h3>
                 <button 
                    onClick={() => onComplete(feedback.isCorrect, feedback.time)}
                    className="btn-pill bg-white text-prime-dark-text px-8 py-4 font-black shadow-xl hover:scale-105 active:scale-95 transition-all w-full"
                  >
                    {feedback.isCorrect ? 'CONTINUE ➜' : 'RETRY ➜'}
                  </button>
               </div>
             )}

             <div className="w-full mb-8">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">English meaning:</span>
               <div className="text-3xl font-black text-prime-dark-text italic leading-tight">{word.englishTranslation}</div>
             </div>

             <div className="w-full mb-6">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Phonetic:</span>
               <div className="text-xl font-bold text-prime-coral-pink uppercase tracking-[0.2em]">{word.phonetic}</div>
             </div>

             <button 
              onClick={() => audioEngine.speak(word.malayalamText)}
              className="w-16 h-16 bg-white text-prime-action-dark rounded-full flex items-center justify-center text-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform border border-slate-100"
              title="Play Word Sound"
             >
               🔊
             </button>
          </div>

          {/* Progress Indicator */}
          <div className="card-bento-surface py-6 px-8 flex justify-between items-center bg-white border border-slate-100">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Accuracy Check</span>
            <div className="flex gap-1">
               {slots.map((s, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full ${s ? 'bg-prime-teal-green' : 'bg-slate-100'}`} />
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
