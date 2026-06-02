import React, { useState, useEffect, useRef } from 'react';
import { useDraggable, useDroppable, DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { audioEngine } from '../../utils/audioEngine';

const DraggableTile = ({ id, text, disabled }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ 
    id,
    disabled 
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000
  } : {
    zIndex: 1
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`px-12 py-4 bg-prime-action-dark rounded-[24px] flex items-center justify-center text-white text-5xl font-black shadow-2xl transition-shadow min-w-[240px] w-fit
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-grab active:cursor-grabbing hover:scale-105 shadow-xl'}
        ${isDragging ? 'shadow-inner opacity-80' : ''}`}
    >
      {text}
    </div>
  );
};

const DropZone = ({ id, label, malayalamLabel, colorClass, activeWord, isCorrect, targetId }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  // Highlight if it's the target zone AND we have a success state
  const isTargetMatch = isCorrect && id === targetId;

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 min-h-[280px] rounded-[48px] border-4 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300
        ${isOver ? 'scale-105 border-prime-action-dark bg-slate-50' : 'border-slate-200'}
        ${isTargetMatch ? 'bg-prime-teal-green border-prime-teal-green/20' : ''}`}
    >
      <div className="flex flex-col items-center mb-8 leading-tight">
        <span className={`text-xs font-black uppercase tracking-[0.3em] mb-2 ${colorClass}`}>{label}</span>
        <span className={`text-4xl font-bold ${colorClass.replace('text-', 'text-opacity-60 text-')}`}>{malayalamLabel}</span>
      </div>

      <div className={`w-full aspect-video rounded-[32px] flex flex-col items-center justify-center transition-all duration-500
        ${activeWord ? 'bg-white shadow-xl scale-100 opacity-100' : 'bg-slate-50/50 scale-95 opacity-50'}`}>
        
        {activeWord ? (
          <div className="text-center px-4">
            <h1 className={`text-6xl font-black leading-tight ${isTargetMatch ? 'text-prime-teal-green' : 'text-prime-dark-text'}`}>
              {activeWord}
            </h1>
            <button 
              onClick={() => audioEngine.speak(activeWord)}
              className="mt-4 p-4 bg-prime-canvas rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-prime-action-dark"
            >
              <span className="text-2xl">🔊</span>
            </button>
          </div>
        ) : (
          <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Drop Here</span>
        )}
      </div>
    </div>
  );
};

const TimeMachine = ({ word, onComplete }) => {
  const [placedWord, setPlacedWord] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const startTime = useRef(Date.now());
  
  const [targetTense, setTargetTense] = useState('present');

  useEffect(() => {
    const tenses = ['past', 'present', 'future'];
    const randomTense = tenses[Math.floor(Math.random() * tenses.length)];
    
    setPlacedWord(null);
    setActiveZone(null);
    setIsSuccess(false);
    setFeedback(null);
    setTargetTense(randomTense);
    startTime.current = Date.now();
  }, [word.wordId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const targetEnglish = targetTense === 'past' ? word.pastEnglish : 
                       targetTense === 'present' ? word.presentEnglish : 
                       word.futureEnglish;

  const handleDragEnd = (event) => {
    const { over } = event;
    if (over && !feedback) {
      const zone = over.id;
      const responseTime = Date.now() - startTime.current;
      
      setActiveZone(zone);
      const morphed = zone === 'past' ? word.pastForm : 
                       zone === 'present' ? word.presentForm : 
                       word.futureForm;
      setPlacedWord(morphed);
      
      if (zone === targetTense) {
        setIsSuccess(true);
        audioEngine.speak(morphed);
        setFeedback({ isCorrect: true, time: responseTime, word: morphed });
      } else {
        setFeedback({ isCorrect: false, time: responseTime });
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="w-full flex flex-col items-center gap-12 animate-fade-in relative">
        
        {/* Target Instruction */}
        <div className="text-center animate-pop">
          <span className="text-slate-400 font-black uppercase text-sm tracking-widest block mb-4">Drag the tile to</span>
          <h2 className="text-7xl font-black text-prime-action-dark uppercase tracking-tight">
            {targetEnglish}
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
            isCorrect={isSuccess}
            targetId={targetTense}
          />
          <DropZone 
            id="present" 
            label="Today" 
            malayalamLabel="ഇന്ന്" 
            colorClass="text-prime-mango-orange" 
            activeWord={activeZone === 'present' ? placedWord : null}
            isCorrect={isSuccess}
            targetId={targetTense}
          />
          <DropZone 
            id="future" 
            label="Tomorrow" 
            malayalamLabel="നാളെ" 
            colorClass="text-prime-periwinkle" 
            activeWord={activeZone === 'future' ? placedWord : null}
            isCorrect={isSuccess}
            targetId={targetTense}
          />
        </div>

        {/* Draggable Tile Pool */}
        <div className="w-full py-12 bg-slate-50 rounded-[40px] border-4 border-slate-100 flex flex-col items-center gap-6 shadow-inner relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#1A1E26 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            {!placedWord && <DraggableTile id="base-tile" text={word.baseWord} disabled={isSuccess || feedback} />}
            
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              {placedWord ? "Time Machine Activated" : "Base Word Tile"}
            </span>
          </div>

          {isSuccess && (
            <div className="absolute inset-0 bg-prime-teal-green/10 animate-pulse pointer-events-none"></div>
          )}
        </div>

        {/* Standardized Feedback Overlay */}
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
                  ? `You found "${feedback.word}"!`
                  : "That's not the right time! Try again."}
              </p>
              <button 
                onClick={() => {
                  if (feedback.isCorrect) {
                    onComplete(true, feedback.time);
                  } else {
                    setPlacedWord(null);
                    setActiveZone(null);
                    setFeedback(null);
                    onComplete(false, feedback.time);
                  }
                }}
                className="px-12 py-5 bg-white text-prime-dark-text rounded-full font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                {feedback.isCorrect ? 'CONTINUE ➜' : 'TRY AGAIN ➜'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default TimeMachine;
