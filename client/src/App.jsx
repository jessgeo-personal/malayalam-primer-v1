import React from 'react';
import { useProgress } from './context';
import { LetterPicker, TracingCanvas, SoundMatcher } from './components/games';
import { MasteryStrip, AdventureMap } from './components/ui';
import { APP_VERSION } from './config/version';
import './App.css';

function App() {
  const { 
    currentItem, 
    masteredCharacters, 
    score, 
    loading, 
    error, 
    sessionMode,
    sessionStatus,
    lastStars,
    updateProgress, 
    resetSession,
    setSessionMode,
    setSessionStatus
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
        
        <div className="flex gap-2">
          {sessionMode !== 'map' && (
            <button 
              onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold shadow-md active:bg-blue-600 transition-colors"
            >
              Map
            </button>
          )}
          <button 
            onClick={resetSession}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold shadow-md active:bg-red-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Mastery Achievement Strip at the TOP */}
      <MasteryStrip characters={masteredCharacters} />

      <header className="mt-8 mb-4 text-center px-4">
        <h1 className="text-5xl font-black text-orange-600 mb-2 drop-shadow-sm">Malayalam Prime</h1>
      </header>

      <main className="w-full max-w-6xl flex items-center justify-center mx-4 mb-12">
        {sessionMode === 'map' ? (
          <AdventureMap />
        ) : sessionStatus === 'complete' ? (
          <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-12 text-center flex flex-col items-center border-8 border-yellow-200">
            <div className="text-8xl mb-6 animate-bounce">
              {sessionMode === 'revision' ? '🏆' : '🎉'}
            </div>
            
            <h2 className="text-5xl font-black text-orange-600 mb-4">
              {sessionMode === 'revision' ? 'REVISION DONE!' : 'LESSON COMPLETE!'}
            </h2>
            
            {sessionMode === 'lesson' ? (
              <div className="flex flex-col items-center gap-4 my-8">
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-7xl transition-all duration-500 ${i < lastStars ? 'text-yellow-400 scale-125' : 'text-gray-200'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-2xl font-bold text-blue-800 uppercase tracking-widest mt-4">
                  {lastStars === 3 ? 'Perfect! 🤩' : lastStars === 2 ? 'Great Job! 😊' : 'Keep Trying! 💪'}
                </p>
              </div>
            ) : (
              <div className="my-8 bg-purple-50 p-8 rounded-3xl border-4 border-purple-200">
                <div className="text-5xl mb-4">🎁</div>
                <p className="text-2xl font-bold text-purple-800 uppercase">Daily Prize Unlocked!</p>
                <p className="text-gray-600 font-medium">You mastered your practice session for today!</p>
              </div>
            )}

            <button 
              onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
              className="mt-8 w-full max-w-md px-12 py-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-black text-2xl rounded-3xl shadow-xl transform transition hover:scale-105 active:scale-95 border-b-8 border-orange-700 uppercase"
            >
              Collect & Return to Map
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 min-h-[550px] flex flex-col items-center justify-center relative">
            <div className={`absolute top-6 left-6 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm border-4
              ${sessionMode === 'revision' ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-green-100 text-green-600 border-green-200'}`}>
              {sessionMode === 'revision' ? '📚 Revision' : '🎒 Lesson'}
            </div>

            {currentItem ? (
              currentItem.lessonType === 'trace' ? (
                <TracingCanvas 
                  word={currentItem} 
                  onComplete={updateProgress} 
                />
              ) : currentItem.lessonType === 'match' ? (
                <SoundMatcher
                  word={currentItem}
                  onComplete={updateProgress}
                />
              ) : (
                <LetterPicker 
                  word={currentItem} 
                  onComplete={updateProgress} 
                />
              )
            ) : null}
          </div>
        )}
      </main>

      <footer className="mt-auto py-4 text-gray-400 text-xs">
        Malayalam Prime v{APP_VERSION}
      </footer>
    </div>
  );
}

export default App;
