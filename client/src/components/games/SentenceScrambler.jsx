import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component for Option A ---
const SortableWord = ({ id, word }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 100 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`px-8 py-4 bg-prime-action-dark text-white rounded-3xl font-black text-2xl shadow-xl border-b-4 border-black/30 active:scale-95 transition-transform touch-none cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      {word}
    </div>
  );
};

// --- Droppable Slot for Option B ---
const WordSlot = ({ id, word, index }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`w-40 h-20 rounded-3xl border-4 border-dashed flex items-center justify-center transition-all
        ${isOver ? 'border-prime-teal-green bg-prime-teal-green/10 scale-105' : 'border-slate-200 bg-slate-50'}
        ${word ? 'border-solid border-prime-action-dark bg-white shadow-lg' : ''}`}
    >
      {word ? (
        <span className="text-2xl font-black text-prime-action-dark animate-pop">{word}</span>
      ) : (
        <span className="text-slate-200 font-black text-4xl italic">{index + 1}</span>
      )}
    </div>
  );
};

// --- Draggable Source Word for Option B ---
const DraggableWord = ({ id, word, isUsed }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), opacity: isUsed || isDragging ? 0.3 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`px-8 py-4 bg-prime-action-dark text-white rounded-3xl font-black text-2xl shadow-xl border-b-4 border-black/30 touch-none ${isUsed ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing hover:scale-105 transition-transform'}`}
    >
      {word}
    </div>
  );
};

const SentenceScrambler = ({ word, onComplete, variant = 'magnets' }) => {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [placedWords, setPlacedWords] = useState([]); 
  const [activeId, setActiveId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const parts = [...word.sentenceParts];
    // Fisher-Yates shuffle
    for (let i = parts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [parts[i], parts[j]] = [parts[j], parts[i]];
    }
    setShuffledWords(parts.map((w, i) => ({ id: `word-${i}`, text: w })));
    setPlacedWords(new Array(word.sentenceParts.length).fill(null));
    setIsCorrect(null);
  }, [word]);

  const handleCheck = () => {
    let currentSentence = [];
    if (variant === 'magnets') {
      currentSentence = shuffledWords.map(w => w.text);
    } else if (variant === 'puzzle') {
      currentSentence = placedWords;
    } else if (variant === 'tap') {
      currentSentence = placedWords.filter(w => w !== null);
    }

    const correct = JSON.stringify(currentSentence) === JSON.stringify(word.sentenceParts);
    setIsCorrect(correct);
    if (correct) setTimeout(() => onComplete && onComplete(), 1500);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (variant === 'magnets') {
      if (active.id !== over?.id) {
        setShuffledWords((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    } else if (variant === 'puzzle') {
      if (over && over.id.startsWith('slot-')) {
        const slotIndex = parseInt(over.id.split('-')[1]);
        const activeItem = shuffledWords.find(w => w.id === active.id);
        const newPlaced = [...placedWords];
        newPlaced[slotIndex] = activeItem.text;
        setPlacedWords(newPlaced);
      }
    }
  };

  const handleTap = (item) => {
    if (variant !== 'tap') return;
    if (shuffledWords.some(w => w.id === item.id)) {
        setShuffledWords(prev => prev.filter(w => w.id !== item.id));
        setPlacedWords(prev => {
            const firstEmpty = prev.indexOf(null);
            const next = [...prev];
            if (firstEmpty !== -1) next[firstEmpty] = item.text;
            else next.push(item.text);
            return next;
        });
    } else {
        setPlacedWords(prev => {
          const next = [...prev];
          const idx = next.lastIndexOf(item.text);
          if (idx !== -1) next[idx] = null;
          return next;
        });
        setShuffledWords(prev => [...prev, item]);
    }
  };

  const clearPlaced = () => {
    setPlacedWords(new Array(word.sentenceParts.length).fill(null));
    setIsCorrect(null);
    // Reset bank
    const parts = [...word.sentenceParts];
    for (let i = parts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [parts[i], parts[j]] = [parts[j], parts[i]];
    }
    setShuffledWords(parts.map((w, i) => ({ id: `word-${i}`, text: w })));
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-5xl mx-auto p-8 bg-white rounded-[48px] shadow-2xl border-[12px] border-prime-warm-base animate-pop relative overflow-hidden">
      
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-prime-dark-text italic tracking-tighter uppercase">Sentence Scrambler</h2>
        <div className="bg-prime-action-dark/5 px-8 py-3 rounded-2xl border border-prime-action-dark/10">
          <p className="text-prime-action-dark font-black text-lg">
            {variant === 'magnets' ? "Drag the word tiles left or right to make a sentence." :
             variant === 'tap' ? "Tap the words in the right order to build the sentence." :
             "Drag the words from the bank into the empty boxes above."}
          </p>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">
            English: {word.englishTranslation}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-12 min-h-[300px] justify-center">
        {variant === 'magnets' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-wrap justify-center gap-4 p-8 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 w-full min-h-[160px] items-center">
              <SortableContext items={shuffledWords} strategy={horizontalListSortingStrategy}>
                {shuffledWords.map((item) => <SortableWord key={item.id} id={item.id} word={item.text} />)}
              </SortableContext>
            </div>
          </DndContext>
        )}

        {variant === 'puzzle' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
            <div className="w-full flex flex-col gap-12">
               <div className="flex flex-wrap justify-center gap-6 p-8 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 min-h-[180px] items-center relative">
                  {placedWords.map((text, i) => <WordSlot key={`slot-${i}`} id={`slot-${i}`} word={text} index={i} />)}
                  {placedWords.some(w => w !== null) && (
                    <button onClick={clearPlaced} className="absolute -top-4 -right-4 bg-prime-error text-white w-10 h-10 rounded-full font-black shadow-lg hover:rotate-90 transition-transform">×</button>
                  )}
               </div>
               <div className="flex flex-wrap justify-center gap-4">
                  {shuffledWords.map((item) => <DraggableWord key={item.id} id={item.id} word={item.text} isUsed={placedWords.includes(item.text)} />)}
               </div>
            </div>
            <DragOverlay>
              {activeId ? (
                <div className="px-8 py-4 bg-prime-action-dark text-white rounded-3xl font-black text-2xl shadow-2xl scale-110 opacity-90 cursor-grabbing">
                  {shuffledWords.find(w => w.id === activeId)?.text}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {variant === 'tap' && (
          <div className="w-full space-y-12">
             <div className="flex flex-wrap justify-center gap-4 p-8 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 min-h-[140px] items-center">
                {placedWords.filter(w => w !== null).length === 0 && <span className="text-slate-300 font-black uppercase tracking-widest">Tap words below...</span>}
                {placedWords.filter(w => w !== null).map((text, i) => (
                  <button key={`placed-${i}`} onClick={() => handleTap({ id: `word-${word.sentenceParts.indexOf(text)}`, text })}
                    className="px-8 py-4 bg-prime-teal-green text-white rounded-3xl font-black text-2xl shadow-xl border-b-4 border-black/30 animate-pop"
                  >
                    {text}
                  </button>
                ))}
             </div>
             <div className="flex flex-wrap justify-center gap-4">
                {shuffledWords.map((item) => (
                  <button key={item.id} onClick={() => handleTap(item)}
                    className="px-8 py-4 bg-prime-action-dark text-white rounded-3xl font-black text-2xl shadow-xl border-b-4 border-black/30 active:scale-95 transition-transform"
                  >
                    {item.text}
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 w-full justify-center pt-8 border-t border-slate-100">
        <button onClick={handleCheck}
          className={`px-12 py-5 rounded-[32px] font-black text-2xl uppercase tracking-tighter transition-all shadow-xl border-b-8
            ${isCorrect === null ? 'bg-prime-action-dark text-white border-black/40 hover:scale-105 active:translate-y-2 active:border-b-0' :
              isCorrect ? 'bg-prime-teal-green text-white border-green-900/40' : 'bg-prime-error text-white border-red-900/40 animate-shake'}`}
        >
          {isCorrect === null ? 'Check Answer' : isCorrect ? 'Correct!' : 'Try Again!'}
        </button>
      </div>

      {isCorrect === false && (
        <div className="absolute top-8 right-8 bg-prime-error text-white px-6 py-3 rounded-2xl font-black shadow-lg animate-bounce">
          TIP: Put "{word.sentenceParts[word.sentenceParts.length - 1]}" at the end!
        </div>
      )}
    </div>
  );
};

export default SentenceScrambler;
