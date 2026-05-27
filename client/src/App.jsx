import React from 'react';
import { useProgress } from './context';
import LetterPicker from './components/games/LetterPicker';
import TracingCanvas from './components/games/TracingCanvas';
import { MasteryStrip } from './components/ui';
import { APP_VERSION } from './config/version';
import './App.css';

function App() {
  const { 
    currentWord, 
    masteredCharacters, 
    score, 
    loading, 
    error, 
    updateProgress, 
    resetSession 
  } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-2xl font-bold text-blue-600 animate-bounce">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center relative">
      {/* Header Info */}
      <div className="w-full flex justify-between items-center p-4 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-full shadow-md border-2 border-yellow-400 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-bold text-orange-600">{score}</span>
          </div>
        </div>
        
        <button 
          onClick={resetSession}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow-md active:bg-red-600 transition-colors"
        >
          Restart Session
        </button>
      </div>

      <header className="mb-8 text-center px-4">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-2">Malayalam Prime</h1>
        
        {/* Phase Badge */}
        {currentWord && (
          <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm
            ${currentWord.wordId.startsWith('t') ? 'bg-purple-100 text-purple-600 border border-purple-200' : 'bg-blue-100 text-blue-600 border border-blue-200'}`}>
            {currentWord.wordId.startsWith('t') ? '✨ New Sound' : '🌟 Revision'}
          </div>
        )}
      </header>

      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 min-h-[550px] flex items-center justify-center mx-4 mb-12">
        {currentWord ? (
          currentWord.lessonType === 'trace' ? (
            <TracingCanvas 
              word={currentWord} 
              onComplete={(isCorrect, responseTimeMs) => {
                updateProgress(isCorrect, responseTimeMs);
              }} 
            />
          ) : (
            <LetterPicker 
              word={currentWord} 
              onComplete={(isCorrect, responseTimeMs) => {
                updateProgress(isCorrect, responseTimeMs);
              }} 
            />
          )
        ) : (
          <div className="text-xl text-gray-500 italic">No more lessons in this cycle. Great job!</div>
        )}
      </main>

      <footer className="mt-auto w-full flex flex-col items-center">
        <MasteryStrip characters={masteredCharacters} />
        <div className="py-4 text-gray-400 text-xs">
          Malayalam Prime v{APP_VERSION}
        </div>
      </footer>
    </div>
  );
}

export default App;
