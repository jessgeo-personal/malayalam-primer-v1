import React from 'react';
import { useProgress } from './context';
import LetterPicker from './components/games/LetterPicker';
import { APP_VERSION } from './config/version';
import './App.css';

function App() {
  const { currentWord, loading, error, updateProgress, resetSession } = useProgress();

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
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center py-10 px-4 relative">
      <button 
        onClick={resetSession}
        className="fixed top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow-md active:bg-red-600 transition-colors z-50"
      >
        Restart Session
      </button>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-orange-600 mb-2">Malayalam Prime</h1>
        <p className="text-gray-600">Let's build some words!</p>
      </header>

      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 min-h-[500px] flex items-center justify-center">
        {currentWord ? (
          <LetterPicker 
            word={currentWord} 
            onComplete={(isCorrect, responseTimeMs) => {
              console.log('Result:', isCorrect, 'Time:', responseTimeMs);
              updateProgress(isCorrect, responseTimeMs);
            }} 
          />
        ) : (
          <div className="text-xl text-gray-500 italic">No more words in this cycle. Great job!</div>
        )}
      </main>

      <footer className="mt-auto py-8 text-gray-400 text-sm">
        Malayalam Prime v{APP_VERSION}
      </footer>
    </div>
  );
}

export default App;
