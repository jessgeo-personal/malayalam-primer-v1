import React from 'react';
import { useProgress } from './context';
import { LetterPicker, TracingCanvas, SoundMatcher, SuffixSnapper } from './components/games';
import { MasteryStrip, AdventureMap } from './components/ui';
import { APP_VERSION } from './config/version';
import './App.css';

const App = () => {
  const { 
    userId,
    switchUser,
    activeLessonId,
    currentItem, 
    updateProgress, 
    masteredCharacters, 
    score, 
    error,
    sessionMode,
    sessionStatus,
    lastStars,
    needsRevision,
    startRevision,
    currentLesson,
    lessonHistory,
    currentCycle,
    cycleProgress,
    resetSession,
    setSessionMode,
    setSessionStatus
  } = useProgress();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-prime-warm-base p-8 text-center">
        <div className="text-7xl mb-4">🧱</div>
        <h2 className="text-2xl font-black text-prime-error mb-6 uppercase">Oops! Something went wrong</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <button onClick={resetSession} className="btn-pill bg-prime-error">Reset App</button>
      </div>
    );
  }

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart? This will clear your current session progress.")) {
      resetSession();
    }
  };

  return (
    <div className="min-h-screen bg-prime-canvas text-prime-dark-text flex flex-col font-sans">
      
      {/* 1. Hero Header Slot (Split Canvas) */}
      {sessionMode === 'map' && (
        <div className="w-full bg-prime-coral-pink pt-12 pb-20 px-8 rounded-b-[48px] relative overflow-hidden shadow-lg">
          <div className="max-w-6xl mx-auto flex justify-between items-start relative z-10">
            <div className="animate-pop">
              <h1 className="text-white text-4xl font-black tracking-tight mb-2 italic uppercase">Let's Learn!</h1>
              <div className="flex items-center gap-2">
                <div className="bg-prime-action-dark text-white px-4 py-1.5 rounded-pill text-xs font-bold tracking-widest flex items-center gap-2">
                  LEVEL {Math.floor(score / 500) + 1}
                </div>
                <div className="bg-white/20 text-white px-4 py-1.5 rounded-pill text-xs font-bold tracking-widest">
                  {masteredCharacters.length} LETTERS
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* User Selection Dropdown */}
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Active Profile</span>
                <select 
                  value={userId} 
                  onChange={(e) => switchUser(e.target.value)}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold text-sm py-2 px-4 rounded-2xl border border-white/40 shadow-inner outline-none cursor-pointer transition-all appearance-none text-center min-w-[140px]"
                >
                  <option value="Learner 1" className="text-prime-dark-text">Learner 1</option>
                  <option value="Learner 2" className="text-prime-dark-text">Learner 2</option>
                  <option value="Learner 3" className="text-prime-dark-text">Learner 3</option>
                </select>
              </div>

              <div className="w-16 h-16 bg-white/30 rounded-3xl backdrop-blur-md border border-white/40 flex items-center justify-center text-4xl shadow-inner">
                {userId === 'Learner 1' ? '👦' : userId === 'Learner 2' ? '👧' : '🧒'}
              </div>
            </div>
          </div>
          {/* Subtle background graphic */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      )}

      <main className={`flex-1 w-full max-w-6xl mx-auto px-6 ${sessionMode === 'map' ? '-mt-12 pb-32' : 'py-12 pb-32'}`}>
        {sessionMode === 'map' ? (
          <div className="flex flex-col gap-10">
            
            {/* 2. Learning Plan Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pop">
              {/* Active Cycle Progress */}
              <div className="md:col-span-2 card-bento-teal min-h-[220px]">
                <div>
                  <span className="text-white/70 font-bold uppercase text-xs tracking-widest">Your Progress</span>
                  <h3 className="text-white text-3xl font-black mt-1">Cycle {currentCycle} Mastery</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-hero text-white">{cycleProgress}</span>
                  <span className="text-3xl font-black text-white/50">%</span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div className="bg-white h-full transition-all duration-1000 rounded-full" style={{ width: `${cycleProgress}%` }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Stat Box 1 */}
                <div className="card-bento-surface flex-1">
                   <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Lessons</span>
                   <div className="text-4xl font-extrabold text-prime-dark-text mt-1">{lessonHistory.length}</div>
                   <p className="text-slate-500 text-xs font-medium mt-1">Completed</p>
                </div>
                {/* Stat Box 2 */}
                <div className="card-bento-surface flex-1">
                   <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Points</span>
                   <div className="text-4xl font-extrabold text-prime-dark-text mt-1">{score}</div>
                   <p className="text-slate-500 text-xs font-medium mt-1">Total Score</p>
                </div>
              </div>
            </div>

            {/* 3. Mastery Badge Strip */}
            <div className="animate-pop" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-bold text-prime-dark-text mb-4 ml-2">My Letters</h2>
              <MasteryStrip characters={masteredCharacters} />
            </div>

            {/* 4. Active Module Course Deck (Adventure Map) */}
            <div className="animate-pop" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-bold text-prime-dark-text mb-4 ml-2">Lessons</h2>
              <AdventureMap />
            </div>
          </div>
        ) : sessionStatus === 'complete' ? (
          <div className="w-full max-w-xl mx-auto card-bento-surface p-12 text-center animate-pop">
            <div className="text-8xl mb-8">🌟</div>
            <h2 className="text-hero mb-4">Done!</h2>
            <p className="text-slate-500 font-medium mb-10 text-lg">Great job completing your session!</p>
            
            {sessionMode === 'lesson' && (
              <div className="flex flex-col items-center gap-4 mb-10">
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-6xl ${i < lastStars ? 'text-prime-mango-orange' : 'text-slate-100'}`}>★</span>
                  ))}
                </div>
                <span className="bg-prime-warm-base text-prime-mango-orange px-4 py-1 rounded-pill text-xs font-black uppercase tracking-widest">
                  {lastStars === 3 ? 'Excellent!' : 'Good Work!'}
                </span>
              </div>
            )}

            <button 
              onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
              className="btn-pill bg-prime-action-dark w-full justify-center py-4 text-lg"
            >
              Back to Lessons
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto card-bento-surface p-8 min-h-[550px] flex flex-col items-center justify-center relative animate-pop shadow-2xl border-orange-100">
            {/* Header within game: Consolidated Controls */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto bg-prime-action-dark px-4 py-2 rounded-2xl shadow-lg border border-white/10 backdrop-blur-sm">
                <button 
                  onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
                  className="text-xl hover:scale-110 transition-transform cursor-pointer"
                  title="Home"
                >
                  🏠
                </button>
                <button 
                  onClick={handleRestart}
                  className="text-xl hover:scale-110 transition-transform cursor-pointer opacity-50 hover:opacity-100"
                  title="Restart Session"
                >
                  🔄
                </button>
                <div className="h-6 w-px bg-white/20 mx-1"></div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-0.5">Status</span>
                  <span className="text-prime-teal-green font-bold text-[10px] tracking-tighter uppercase">Active</span>
                </div>
                <button 
                  onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }}
                  className="ml-4 text-[9px] font-black text-white/60 hover:text-white uppercase tracking-widest border-l border-white/10 pl-4 py-1"
                >
                  EXIT
                </button>
              </div>

              <div className="flex items-center gap-4 pointer-events-auto">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Progress</span>
                  <div className="flex gap-1 mt-1">
                    {masteredCharacters.length > 0 ? (
                      masteredCharacters.slice(-6).map((char, i) => (
                        <span key={i} className="w-6 h-6 bg-prime-canvas border border-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-prime-teal-green shadow-sm">
                          {char}
                        </span>
                      ))
                    ) : (
                      <span className="text-[9px] font-bold text-slate-300 italic">No letters yet</span>
                    )}
                    {masteredCharacters.length > 6 && <span className="text-[10px] font-black text-slate-300 flex items-center">+</span>}
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-widest text-white shadow-sm
                  ${sessionMode === 'revision' ? 'bg-prime-periwinkle' : 'bg-prime-teal-green'}`}>
                  {sessionMode === 'revision' ? `Daily Practice: Cycle ${currentCycle}` : `Active Lesson: ${activeLessonId}`}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col items-center mt-12">
              {currentItem ? (
                currentItem.lessonType === 'trace' ? (
                  <TracingCanvas word={currentItem} onComplete={updateProgress} />
                ) : currentItem.lessonType === 'match' ? (
                  <SoundMatcher word={currentItem} onComplete={updateProgress} />
                ) : currentItem.lessonType === 'suffix' ? (
                  <SuffixSnapper word={currentItem} onComplete={updateProgress} />
                ) : (
                  <LetterPicker word={currentItem} onComplete={updateProgress} />
                )
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* 5. Global Navigation Dock (Map Only) */}
      {sessionMode === 'map' && (
        <nav className="fixed bottom-6 left-0 right-0 z-[100] px-6">
          <div className="bg-prime-action-dark mx-auto max-w-md rounded-pill px-8 py-4 flex justify-between items-center text-white shadow-2xl border border-white/10 backdrop-blur-lg animate-fade-in">
            <button onClick={() => { setSessionMode('map'); setSessionStatus('idle'); }} className="text-2xl hover:scale-110 transition-transform cursor-pointer" title="Home">🏠</button>
            <button onClick={handleRestart} className="text-2xl hover:scale-110 transition-transform cursor-pointer opacity-40 hover:opacity-100" title="Restart Progress">🔄</button>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">Status</span>
              <span className="text-prime-teal-green font-bold text-sm tracking-tighter leading-tight">ACTIVE</span>
            </div>
          </div>
        </nav>
      )}

      <footer className="py-12 text-center text-slate-300 font-bold text-[9px] tracking-[0.4em] uppercase">
        Malayalam_Prime_v{APP_VERSION}
      </footer>
    </div>
  );
}

export default App;
