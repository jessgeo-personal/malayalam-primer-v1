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
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!word.requiredCharacters || word.requiredCharacters.length === 0) {
      return;
    }
    // Shuffle the required characters
    const shuffled = [...word.requiredCharacters]
      .map((value, index) => ({ value, id: `letter-${index}` }))
      .sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setPlacedLetters(Array(word.requiredCharacters.length).fill(null));
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
        setTimeout(() => onComplete(isCorrect, endTime - startTime), 500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="text-4xl font-bold text-gray-800 mb-4">
        {word.englishTranslation}
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
        <div className="flex flex-wrap justify-center gap-4">
          {shuffledLetters.map((letter) => (
            // Only show if not placed or allow re-dragging? 
            // For simplicity, we just keep them there or hide them.
            // Let's hide if placed in a slot.
            !placedLetters.includes(letter.value) && (
              <DraggableLetter key={letter.id} id={letter.id} char={letter.value} />
            )
          ))}
        </div>
      </DndContext>

      <button 
        onClick={() => setPlacedLetters(Array(word.requiredCharacters.length).fill(null))}
        className="mt-8 px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold active:bg-gray-300"
      >
        Clear Tiles
      </button>
    </div>
  );
}
