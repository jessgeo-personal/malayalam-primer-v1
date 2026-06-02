import React, { useState, useEffect } from 'react';
import { useDraggable, useDroppable, DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { audioEngine } from '../../utils/audioEngine';

const DraggableTile = ({ id, text }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`w-48 h-24 bg-prime-action-dark rounded-[24px] flex items-center justify-center text-white text-5xl font-black shadow-2xl cursor-grab active:cursor-grabbing select-none transition-shadow
        ${isDragging ? 'shadow-inner opacity-80' : 'hover:scale-105 shadow-xl'}`}
    >
      {text}
    </div>
  );
};

const DropZone = ({ id, label, malayalamLabel, colorClass, activeWord, isCorrect }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 min-h-[400px] rounded-[48px] border-4 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300
        ${isOver ? 'scale-105 border-prime-action-dark bg-slate-50' : 'border-slate-200'}
        ${isCorrect ? 'bg-prime-teal-green border-prime-teal-green/20' : ''}`}
    >
      <div className="flex flex-col items-center mb-12">
        <span className={`text-xs font-black uppercase tracking-[0.3em] mb-2 ${colorClass}`}>{label}</span>
        <span className={`text-4xl font-bold ${colorClass.replace('text-', 'text-opacity-60 text-')}`}>{malayalamLabel}</span>
      </div>

      <div className={`w-full aspect-video rounded-[32px] flex flex-col items-center justify-center transition-all duration-500
        ${activeWord ? 'bg-white shadow-xl scale-100 opacity-100' : 'bg-slate-50/50 scale-95 opacity-50'}`}>
        
        {activeWord ? (
          <div className="text-center">
            <h1 className={`text-8xl font-black ${isCorrect ? 'text-prime-teal-green' : 'text-prime-dark-text'}`}>
              {activeWord}
            </h1>
            <button 
              onClick={() => audioEngine.speak(activeWord)}
              className="mt-6 p-4 bg-prime-canvas rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-prime-action-dark"
            >
              <span className="text-3xl">🔊</span>
            </button>
          </div>
        ) : (
          <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Drop Here</span>
        )}
      </div>
    </div>
  );
};

const TimeMachineZones = ({ mockAction }) => {
  const [placedWord, setPlacedWord] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [targetTense, setTargetTense] = useState('past');
  const [isSuccess, setIsSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { over } = event;
    if (over) {
      const zone = over.id;
      setActiveZone(zone);
      const morphed = zone === 'past' ? mockAction.past : 
                       zone === 'present' ? mockAction.present : 
                       mockAction.future;
      setPlacedWord(morphed);
      
      if (zone === targetTense) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    }
  };

  const handleNext = () => {
    setIsSuccess(false);
    setPlacedWord(null);
    setActiveZone(null);
    const tenses = ['past', 'present', 'future'];
    const nextTense = tenses[Math.floor(Math.random() * tenses.length)];
    setTargetTense(nextTense);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center gap-12 p-12 bg-white rounded-[48px] shadow-2xl border-8 border-slate-50">
        
        {/* Target Instruction */}
        <div className="text-center animate-pop">
          <span className="text-slate-400 font-black uppercase text-sm tracking-widest block mb-4">Drag the tile to</span>
          <h2 className="text-7xl font-black text-prime-action-dark uppercase tracking-tight">
            {targetTense === 'past' ? mockAction.pastEnglish : 
             targetTense === 'present' ? mockAction.presentEnglish : 
             mockAction.futureEnglish}
          </h2>
        </div>

        {/* The Zones Grid */}
        <div className="w-full flex gap-8">
          <DropZone 
            id="past" 
            label="Yesterday" 
            malayalamLabel="ഇന്നലെ" 
            colorClass="text-blue-500" 
            activeWord={activeZone === 'past' ? placedWord : null}
            isCorrect={isSuccess && activeZone === 'past'}
          />
          <DropZone 
            id="present" 
            label="Today" 
            malayalamLabel="ഇന്ന്" 
            colorClass="text-prime-mango-orange" 
            activeWord={activeZone === 'present' ? placedWord : null}
            isCorrect={isSuccess && activeZone === 'present'}
          />
          <DropZone 
            id="future" 
            label="Tomorrow" 
            malayalamLabel="നാളെ" 
            colorClass="text-prime-periwinkle" 
            activeWord={activeZone === 'future' ? placedWord : null}
            isCorrect={isSuccess && activeZone === 'future'}
          />
        </div>

        {/* Draggable Tile Pool */}
        <div className="w-full py-12 bg-slate-50 rounded-[40px] border-4 border-slate-100 flex flex-col items-center gap-6 shadow-inner relative">
          {!placedWord && <DraggableTile id="base-tile" text={mockAction.base} />}
          {placedWord && !isSuccess && (
             <button 
               onClick={() => { setPlacedWord(null); setActiveZone(null); }}
               className="btn-pill bg-prime-action-dark/10 text-prime-action-dark px-8 py-2 text-xs"
             >
               RETRY
             </button>
          )}
          
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {placedWord ? "Word is in the time machine!" : "Base Word"}
          </span>

          {/* Success Action Overlays the pool */}
          {isSuccess && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-[40px] flex items-center justify-center animate-fade-in z-20">
              <button 
                onClick={handleNext}
                className="btn-pill bg-prime-teal-green px-12 py-4 text-xl animate-bounce"
              >
                EXCELLENT! NEXT →
              </button>
            </div>
          )}
        </div>

      </div>
    </DndContext>
  );
};

export default TimeMachineZones;
