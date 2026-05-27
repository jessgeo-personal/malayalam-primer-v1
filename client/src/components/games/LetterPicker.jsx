import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

/**
 * LetterPicker Mini-game
 * Teaching: Basic Phonics and Word Building (Bucket 11/10 Foundation)
 */

function DraggableLetter({ id, char }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-blue-500 text-white text-2xl sm:text-3xl rounded-xl shadow-lg touch-none active:scale-95 transition-transform"
    >
      {char}
    </button>
  );
}

function DroppableSlot({ id, expectedChar, actualChar, index }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const isFilled = !!actualChar;
  const isCorrect = isFilled && actualChar === expectedChar;

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-16 sm:w-20 sm:h-20 border-4 border-dashed rounded-xl flex items-center justify-center text-2xl sm:text-3xl
        ${isFilled ? (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : 'border-gray-300 bg-gray-50'}`}
    >
      {actualChar}
    </div>
  );
}

export default function LetterPicker({ word, onComplete }) {
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!word.requiredCharacters || word.requiredCharacters.length === 0) {
      return;
    }
    // Shuffle the required characters
    const shuffled = [...word.requiredCharacters]
      .map((value, index) => ({ value, id: `letter-${index}-${Math.random()}` }))
      .sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setPlacedLetters(Array(word.requiredCharacters.length).fill(null));
    setFeedback(null);
    setStartTime(Date.now());
  }, [word]);

  if (!word.requiredCharacters || word.requiredCharacters.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-4xl font-bold text-gray-800">{word.englishTranslation}</div>
        <div className="p-6 bg-red-100 border-2 border-red-500 rounded-2xl text-red-700 font-medium">
          ⚠️ Grapheme pieces (requiredCharacters) are not defined for "{word.malayalamText}".
          <br />
          Please refer to the Word Splitting Protocol.
        </div>
      </div>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (feedback) return; // Ignore if already completed

    if (over && over.id.startsWith('slot-')) {
      const slotIndex = parseInt(over.id.split('-')[1]);
      const letterObj = shuffledLetters.find(l => l.id === active.id);
      
      const newPlaced = [...placedLetters];
      newPlaced[slotIndex] = letterObj.value;
      setPlacedLetters(newPlaced);

      // Check if word is complete
      if (newPlaced.every(l => l !== null)) {
        const isCorrect = newPlaced.join('') === word.malayalamText;
        const endTime = Date.now();
        setFeedback({ 
          isCorrect, 
          time: endTime - startTime,
          attempt: newPlaced.join('')
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="text-4xl font-bold text-gray-800 mb-2">
        {word.englishTranslation}
      </div>
      <div className="text-xl text-gray-400 italic mb-4">
        {word.phonetic}
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        {/* Drop Zones */}
        <div className="flex gap-4 mb-12">
          {word.requiredCharacters.map((char, index) => (
            <DroppableSlot 
              key={`slot-${index}`} 
              id={`slot-${index}`} 
              expectedChar={char}
              actualChar={placedLetters[index]}
              index={index}
            />
          ))}
        </div>

        {/* Draggable Letters */}
        <div className="flex flex-wrap justify-center gap-4 min-h-[100px]">
          {!feedback && shuffledLetters.map((letter) => (
            // Hide if placed in a slot
            !placedLetters.includes(letter.value) && (
              <DraggableLetter key={letter.id} id={letter.id} char={letter.value} />
            )
          ))}
        </div>
      </DndContext>

      {/* Pedagogical Feedback Overlay */}
      {feedback && (
        <div className={`w-full max-w-lg p-6 rounded-2xl border-4 mt-4 animate-in fade-in zoom-in duration-300
          ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="text-2xl font-bold mb-4 flex items-center gap-2">
            {feedback.isCorrect ? (
              <span className="text-green-600">🎉 Correct! Great job!</span>
            ) : (
              <span className="text-red-600">🤔 Not quite!</span>
            )}
          </div>
          
          <div className="text-lg text-gray-700 mb-6">
            {!feedback.isCorrect && (
              <p className="mb-2">
                You built: <span className="font-bold text-red-500">{feedback.attempt}</span>
              </p>
            )}
            <p>
              The correct spelling is: <span className="text-2xl font-bold text-blue-600 ml-2">{word.malayalamText}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (Phonetic: {word.phonetic})
            </p>
          </div>

          <button 
            onClick={() => onComplete(feedback.isCorrect, feedback.time)}
            className={`w-full py-4 rounded-xl text-white font-extrabold text-xl shadow-lg transition-transform active:scale-95
              ${feedback.isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {feedback.isCorrect ? 'Next Word ➜' : 'Got it ➜'}
          </button>
        </div>
      )}

      {!feedback && (
        <button 
          onClick={() => setPlacedLetters(Array(word.requiredCharacters.length).fill(null))}
          className="mt-8 px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold active:bg-gray-300"
        >
          Clear Tiles
        </button>
      )}
    </div>
  );
}
