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
      <div className="flex flex-col items-center justify-center min-h-screen bg-app-bg">
        <div className="text-8xl animate-bounce mb-8">🚀</div>
        <div className="text-3xl font-black text-app-primary uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">
          Syncing...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-app-bg p-8 text-center">
        <div className="text-8xl mb-4">👾</div>
        <div className="text-2xl font-black text-app-error mb-8 uppercase tracking-widest">Glitched: {error}</div>
        <button 
          onClick={resetSession}
          className="btn-arcade btn-arcade-error px-10 py-3 text-lg"
        >
          Reboot System
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text-main flex flex-col items-center relative font-sans overflow-hidden">
      
      {/* HUD Info */}
      <div className="w-full max-w-6xl flex justify-between items-center p-4 sm:p-6 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-app-surface px-4 py-2 rounded-2xl shadow-arcade border border-slate-700 flex items-center gap-2 transform -rotate-1">
            <span className="text-2xl animate-pop">✨</span>
            <span className="text-2xl font-black text-app-success tracking-tighter font-mono">{score}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          {sessionMode !== 'map' && (
            <button 
              onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
              className="btn-arcade btn-arcade-primary px-4 py-2 text-xs"
            >
              Backdoor
            </button>
          )}
          <button 
            onClick={resetSession}
            className="btn-arcade btn-arcade-error px-4 py-2 text-xs"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Mastery Badge Strip */}
      <div className="w-full max-w-6xl px-4">
        <MasteryStrip characters={masteredCharacters} />
      </div>

      <header className="mt-4 mb-8 text-center px-4 animate-pop">
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter uppercase italic text-neon">
          Malayalam <span className="text-app-primary">Prime</span>
        </h1>
      </header>

      <main className="w-full max-w-6xl flex items-center justify-center px-4 pb-16">
        {sessionMode === 'map' ? (
          <AdventureMap />
        ) : sessionStatus === 'complete' ? (
          <div className="w-full max-w-xl cyber-card p-10 text-center flex flex-col items-center animate-pop">
            <div className="text-8xl mb-8 animate-wiggle">
              {sessionMode === 'revision' ? '🔋' : '⚡'}
            </div>
            
            <h2 className="text-4xl font-black text-app-primary mb-6 tracking-tight uppercase">
              {sessionMode === 'revision' ? 'Power Cells Full!' : 'Sequence Cleared!'}
            </h2>
            
            {sessionMode === 'lesson' ? (
              <div className="flex flex-col items-center gap-6 my-8">
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-7xl transition-all duration-500 transform ${i < lastStars ? 'text-app-success scale-110 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-slate-700'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xl font-black text-app-text-muted uppercase tracking-[0.2em]">
                  {lastStars === 3 ? 'LEGENDARY!' : lastStars === 2 ? 'EXCELLENT!' : 'STABLE!'}
                </p>
              </div>
            ) : (
              <div className="my-8 bg-slate-900/50 p-8 rounded-[2rem] border-2 border-app-primary/30 w-full">
                <div className="text-6xl mb-4 animate-pulse">🎁</div>
                <p className="text-2xl font-black text-app-success uppercase">REWARD UNLOCKED</p>
                <p className="text-app-text-muted font-bold mt-2">Daily cache synchronized.</p>
              </div>
            )}

            <button 
              onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
              className="btn-arcade btn-arcade-success w-full max-w-xs py-5 text-2xl"
            >
              Collect Cache
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl cyber-card p-8 min-h-[500px] flex flex-col items-center justify-center relative animate-pop">
            {/* Session Type HUD */}
            <div className={`absolute -top-5 left-10 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-arcade border-2
              ${sessionMode === 'revision' ? 'bg-app-primary text-white border-violet-800' : 'bg-app-success text-slate-900 border-emerald-600'}`}>
              {sessionMode === 'revision' ? '💠 REVISION MODE' : '💿 ACTIVE LESSON'}
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

      <footer className="mt-auto py-6 text-app-text-muted font-bold text-[10px] tracking-[0.3em] uppercase opacity-40">
        Malayalam_Prime_v{APP_VERSION}
      </footer>
    </div>
  );
}

export default App;
