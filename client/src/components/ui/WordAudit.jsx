import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';
import { audioEngine } from '../../services/audioEngine';

export default function WordAudit() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('words'); // 'words' | 'alphabets' | 'grammar'

  // Pronunciation Tuning Studio Modal State
  const [tuningItem, setTuningItem] = useState(null);
  const [tuningText, setTuningText] = useState('');
  const [tuningPhonetic, setTuningPhonetic] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [tuningMessage, setTuningMessage] = useState(null);

  useEffect(() => {
    fetch(getApiUrl('/api/words/audit'))
      .then(res => res.json())
      .then(data => {
        setWords(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handlePlayWord = (wordId, fallbackText = '') => {
    audioEngine.playWord(wordId, fallbackText);
  };

  const handleOpenTweakModal = (item) => {
    setTuningItem(item);
    setTuningText(item.malayalamText || '');
    setTuningPhonetic(item.phonetic || '');
    setTuningMessage(null);
  };

  const handleCloseTweakModal = () => {
    setTuningItem(null);
    setTuningMessage(null);
    setPreviewLoading(false);
    setCommitLoading(false);
  };

  const handlePreviewSound = () => {
    if (!tuningText.trim()) return;
    setPreviewLoading(true);
    setTuningMessage(null);

    const previewUrl = getApiUrl(`/api/audio/preview?text=${encodeURIComponent(tuningText.trim())}&tl=ml`);
    const audio = new Audio(previewUrl);

    audio.onended = () => {
      setPreviewLoading(false);
    };
    audio.onerror = () => {
      setPreviewLoading(false);
      setTuningMessage({ type: 'error', text: 'Preview playback failed. Check backend TTS connectivity.' });
    };

    audio.play().catch(err => {
      setPreviewLoading(false);
      setTuningMessage({ type: 'error', text: `Playback prevented: ${err.message}` });
    });
  };

  const handleCommitAudio = async () => {
    if (!tuningItem || !tuningText.trim()) return;
    setCommitLoading(true);
    setTuningMessage(null);

    const isLetter = tuningItem.lessonType === 'trace' || tuningItem.lessonType === 'match';
    const payload = {
      id: tuningItem.wordId,
      type: isLetter ? 'letter' : 'word',
      text: tuningText.trim(),
      phonetic: tuningPhonetic.trim()
    };

    try {
      const res = await fetch(getApiUrl('/api/audio/commit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to commit audio');
      }

      // Update local words state with updated text / phonetic
      setWords(prev => prev.map(w => {
        if (w.wordId === tuningItem.wordId) {
          return {
            ...w,
            malayalamText: tuningText.trim(),
            phonetic: tuningPhonetic.trim()
          };
        }
        return w;
      }));

      setTuningMessage({ type: 'success', text: 'Static audio generated & saved successfully!' });
    } catch (err) {
      setTuningMessage({ type: 'error', text: err.message });
    } finally {
      setCommitLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center font-black animate-pulse">LOADING DICTIONARY AUDIT...</div>;
  if (error) return <div className="p-12 text-center text-prime-error font-black">ERROR: {error}</div>;

  const buildWords = words.filter(w => w.lessonType === 'build');
  const alphabetLessons = words.filter(w => w.lessonType === 'trace' || w.lessonType === 'match');
  const grammarItems = words.filter(w => ['suffix', 'tense', 'concept', 'scramble'].includes(w.lessonType));

  const checkValidity = (word, allWords) => {
    const results = { valid: true, issues: [] };

    // 1. Scramble Validation
    if (word.lessonType === 'scramble') {
        if (!word.sentenceParts || word.sentenceParts.length === 0) {
          results.valid = false;
          results.issues.push('Empty sentenceParts');
        } else {
          const assembled = word.sentenceParts.join(' ');
          if (assembled !== word.malayalamText) {
            results.valid = false;
            results.issues.push('Space Mismatch');
            results.assembled = assembled;
          }
        }
    } 
    // 2. Build/Trace/Match Validation
    else if (['build', 'trace', 'match', 'suffix'].includes(word.lessonType)) {
      if (!word.requiredCharacters || word.requiredCharacters.length === 0) {
        if (word.lessonType !== 'concept') {
          results.valid = false;
          results.issues.push('Empty characters');
        }
      } else {
        const assembled = word.requiredCharacters.join('');
        if (assembled !== word.malayalamText) {
          results.valid = false;
          results.issues.push('Join Mismatch');
          results.assembled = assembled;
        }
      }
    }

    // 3. Prerequisite Trace Check (Only for 'build' items)
    if (word.lessonType === 'build' && word.requiredCharacters) {
      const traces = allWords.filter(w => w.lessonType === 'trace');
      const tracedChars = new Set(traces.map(t => t.malayalamText));
      
      const missing = word.requiredCharacters.filter(char => !tracedChars.has(char));
      if (missing.length > 0) {
        results.valid = false;
        results.issues.push(`Missing Traces: ${missing.join(', ')}`);
      }

      // Check if traces are in earlier or same lesson
      const invalidTiming = word.requiredCharacters.some(char => {
        const trace = traces.find(t => t.malayalamText === char);
        return trace && trace.lessonId > word.lessonId;
      });
      if (invalidTiming) {
        results.valid = false;
        results.issues.push('Prereq in Future Lesson');
      }
    }

    // 4. Sequence Check
    if (typeof word.lessonId !== 'number' || word.lessonId <= 0) {
      results.valid = false;
      results.issues.push('Invalid lessonId');
    }

    return results;
  };

  const errorCount = words.reduce((sum, w) => checkValidity(w, words).valid ? sum : sum + 1, 0);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-[1550px] mx-auto bg-white rounded-[40px] shadow-2xl my-12 border-[16px] border-prime-warm-base animate-pop overflow-hidden relative">
      {/* 1. Header Section */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-4xl font-black text-prime-dark-text italic uppercase tracking-tighter">Curriculum Audit v2</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Prerequisite & Mechanic Integrity Guard</p>
        </div>
        <div className="flex flex-col items-end gap-3">
            <div className={`px-6 py-3 rounded-2xl font-black text-xl shadow-lg flex items-center gap-3 ${errorCount === 0 ? 'bg-prime-teal-green text-white' : 'bg-prime-error text-white animate-bounce'}`}>
              <span className="text-2xl">{errorCount === 0 ? '✓' : '⚠'}</span>
              <span>{errorCount === 0 ? 'INTEGRITY OK' : `${errorCount} ERRORS FOUND`}</span>
            </div>
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-pill border border-slate-100">
                Total Entries: {words.length}
            </div>
        </div>
      </div>

      {/* 2. Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl self-start">
        <button 
          onClick={() => setActiveTab('words')}
          className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'words' ? 'bg-white text-prime-action-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Word Assembly ({buildWords.length})
        </button>
        <button 
          onClick={() => setActiveTab('grammar')}
          className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'grammar' ? 'bg-white text-prime-action-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Grammar & Sentences ({grammarItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('alphabets')}
          className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'alphabets' ? 'bg-white text-prime-action-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Alphabets ({alphabetLessons.length})
        </button>
      </div>

      {/* 3. Dynamic Audit Tables */}
      <div className="overflow-x-auto min-h-[500px]">
        {activeTab === 'words' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-2">ID</th>
                <th className="py-4 px-2">Cycle/Lesson</th>
                <th className="py-4 px-2">Word</th>
                <th className="py-4 px-2">Split Parts</th>
                <th className="py-4 px-2">Join Preview</th>
                <th className="py-4 px-2 text-right">Status</th>
                <th className="py-4 px-2 text-center">Audio Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {buildWords.map(word => {
                const audit = checkValidity(word, words);
                return (
                  <tr key={word.wordId} className={`group hover:bg-slate-50 transition-colors ${!audit.valid ? 'bg-red-50' : ''}`}>
                    <td className="py-4 px-2 text-xs font-mono text-slate-400">{word.wordId}</td>
                    <td className="py-4 px-2 text-xs font-bold text-slate-500">C{word.unlockCycle} • L{word.lessonId}</td>
                    <td className="py-4 px-2">
                      <div className="text-2xl font-black text-prime-dark-text">{word.malayalamText}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{word.englishTranslation}</div>
                      {word.phonetic && <div className="text-[9px] font-bold text-prime-teal-green uppercase">{word.phonetic}</div>}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-wrap gap-1">
                        {word.requiredCharacters?.map((char, i) => {
                          const isTraced = words.some(w => w.lessonType === 'trace' && w.malayalamText === char && w.lessonId <= word.lessonId);
                          return (
                            <span key={i} className={`px-2 py-1 text-white text-xs font-black rounded-lg shadow-sm ${isTraced ? 'bg-prime-action-dark' : 'bg-prime-error'}`}>
                              {char} {!isTraced && '⚠'}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className={`text-xl font-black ${audit.issues.includes('Join Mismatch') ? 'text-prime-error' : 'text-slate-300'}`}>
                        {audit.assembled || word.malayalamText}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {audit.valid ? (
                        <span className="text-prime-teal-green font-black text-[9px] uppercase tracking-widest bg-prime-teal-green/10 px-3 py-1.5 rounded-full">Integrity OK</span>
                      ) : (
                        <div className="flex flex-col gap-1 items-end">
                          {audit.issues.map((issue, idx) => (
                            <span key={idx} className="text-prime-error font-black text-[8px] uppercase tracking-widest bg-prime-error/10 px-2 py-1 rounded-full">{issue}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlayWord(word.wordId, word.malayalamText)}
                          className="w-8 h-8 rounded-full bg-prime-warm-base hover:bg-prime-action-dark hover:text-white flex items-center justify-center text-sm shadow-sm transition-all"
                          title="Play Audio"
                          aria-label={`Play Audio ${word.wordId}`}
                        >
                          🔊
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenTweakModal(word)}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-prime-teal-green hover:text-white text-slate-600 rounded-lg transition-all"
                        >
                          Tweak Sound
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {activeTab === 'grammar' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-2">ID</th>
                <th className="py-4 px-2">Cycle/Lesson</th>
                <th className="py-4 px-2 text-center">Type</th>
                <th className="py-4 px-2">Base / Rule</th>
                <th className="py-4 px-2">Suffix / Parts</th>
                <th className="py-4 px-2 text-right">Result</th>
                <th className="py-4 px-2 text-center">Audio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {grammarItems.map(item => (
                <tr key={item.wordId} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-2 text-xs font-mono text-slate-400">{item.wordId}</td>
                  <td className="py-4 px-2 text-xs font-bold text-slate-500">C{item.unlockCycle} • L{item.lessonId}</td>
                  <td className="py-4 px-2 text-center">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-pill border 
                      ${item.lessonType === 'suffix' ? 'border-prime-coral-pink text-prime-coral-pink' : 
                        item.lessonType === 'tense' ? 'border-prime-mango-orange text-prime-mango-orange' : 
                        item.lessonType === 'scramble' ? 'border-prime-teal-green text-prime-teal-green bg-prime-teal-green/5' :
                        'border-slate-300 text-slate-400'}`}>
                      {item.lessonType}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-black text-prime-dark-text text-xl">
                    {item.lessonType === 'scramble' ? item.englishTranslation : (item.baseWord || '-')}
                  </td>
                  <td className="py-4 px-2">
                    {item.lessonType === 'suffix' ? (
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-slate-400">Morphed: <span className="font-bold text-prime-dark-text">{item.morphedBase}</span></span>
                         <span className="bg-prime-teal-green/10 text-prime-teal-green px-2 py-1 rounded-lg font-black text-lg">+{item.targetSuffix}</span>
                      </div>
                    ) : item.lessonType === 'tense' ? (
                      <div className="flex flex-col gap-1 text-[10px] font-bold">
                        <div className="text-blue-500">PAST: {item.pastForm}</div>
                        <div className="text-prime-mango-orange">PRES: {item.presentForm}</div>
                        <div className="text-prime-periwinkle">FUT: {item.futureForm}</div>
                      </div>
                    ) : item.lessonType === 'scramble' ? (
                      <div className="flex flex-wrap gap-1">
                        {item.sentenceParts?.map((part, i) => (
                          <span key={i} className="px-2 py-1 bg-prime-action-dark text-white text-[10px] font-black rounded-lg">{part}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300 italic uppercase">Concept Intro</span>
                    )}
                  </td>
                  <td className="py-4 px-2 text-right font-black text-2xl text-prime-action-dark">
                    {item.malayalamText}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handlePlayWord(item.wordId, item.malayalamText)}
                      className="w-8 h-8 rounded-full bg-prime-warm-base hover:bg-prime-action-dark hover:text-white flex items-center justify-center text-sm shadow-sm transition-all"
                      title="Play Audio"
                    >
                      🔊
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'alphabets' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-2">ID</th>
                <th className="py-4 px-2">Cycle/Lesson</th>
                <th className="py-4 px-2 text-center">Type</th>
                <th className="py-4 px-2">Character / Unit</th>
                <th className="py-4 px-2">Phonetic Sound</th>
                <th className="py-4 px-2 text-right">Preview</th>
                <th className="py-4 px-2 text-center">Audio Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {alphabetLessons.map(lesson => (
                <tr key={lesson.wordId} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-2 text-xs font-mono text-slate-400">{lesson.wordId}</td>
                  <td className="py-4 px-2 text-xs font-bold text-slate-500">C{lesson.unlockCycle} • L{lesson.lessonId}</td>
                  <td className="py-4 px-2 text-center">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-pill border ${lesson.lessonType === 'trace' ? 'border-prime-coral-pink text-prime-coral-pink bg-prime-coral-pink/5' : 'border-prime-teal-green text-prime-teal-green bg-prime-teal-green/5'}`}>
                      {lesson.lessonType}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-3xl font-black text-prime-dark-text">{lesson.malayalamText}</div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest italic">{lesson.phonetic}</div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="w-12 h-12 bg-prime-warm-base/50 rounded-xl flex items-center justify-center text-xl shadow-inner border border-slate-100 ml-auto group-hover:scale-110 transition-transform">
                      {lesson.malayalamText}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => audioEngine.playLetter(lesson.malayalamText)}
                        className="w-8 h-8 rounded-full bg-prime-warm-base hover:bg-prime-action-dark hover:text-white flex items-center justify-center text-sm shadow-sm transition-all"
                        title="Play Audio"
                      >
                        🔊
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenTweakModal(lesson)}
                        className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-prime-teal-green hover:text-white text-slate-600 rounded-lg transition-all"
                      >
                        Tweak Sound
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 4. Tune Pronunciation Studio Modal */}
      {tuningItem && (
        <div className="fixed inset-0 z-50 bg-prime-action-dark/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl border-4 border-prime-warm-base relative animate-pop">
            <button
              type="button"
              onClick={handleCloseTweakModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-prime-dark-text text-xl font-black cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-prime-teal-green">
                TTS Curation Studio
              </span>
              <h3 className="text-2xl font-black text-prime-dark-text italic uppercase">
                Tune Pronunciation
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                ID: {tuningItem.wordId} | Type: {tuningItem.lessonType}
              </p>
            </div>

            {/* Current Item Overview */}
            <div className="p-4 bg-prime-canvas rounded-2xl border border-slate-100 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Original Text</span>
                <div className="text-3xl font-black text-prime-dark-text mt-1">{tuningItem.malayalamText}</div>
                <div className="text-xs font-bold text-prime-coral-pink mt-0.5 uppercase tracking-wide">
                  {tuningItem.phonetic || '(No Phonetic)'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">English</span>
                <div className="text-sm font-black text-slate-700 mt-1">{tuningItem.englishTranslation}</div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  TTS Spoken Malayalam String
                </label>
                <input
                  type="text"
                  value={tuningText}
                  onChange={(e) => setTuningText(e.target.value)}
                  placeholder="Enter Malayalam text or phonetic override"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-lg font-bold text-prime-dark-text focus:outline-none focus:border-prime-teal-green"
                />
                <span className="text-[9px] text-slate-400 mt-1 block">
                  You can modify spellings slightly to improve TTS phonetic accuracy.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                  Phonetic Representation (English)
                </label>
                <input
                  type="text"
                  value={tuningPhonetic}
                  onChange={(e) => setTuningPhonetic(e.target.value)}
                  placeholder="e.g. amma"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-prime-dark-text focus:outline-none focus:border-prime-teal-green"
                />
              </div>
            </div>

            {/* Status Messages */}
            {tuningMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-6 ${tuningMessage.type === 'success' ? 'bg-prime-teal-green/10 text-prime-teal-green border border-prime-teal-green/20' : 'bg-prime-error/10 text-prime-error border border-prime-error/20'}`}>
                {tuningMessage.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePreviewSound}
                disabled={previewLoading || !tuningText.trim()}
                className="flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-prime-dark-text flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {previewLoading ? 'Playing...' : '🔊 Preview Sound'}
              </button>

              <button
                type="button"
                onClick={handleCommitAudio}
                disabled={commitLoading || !tuningText.trim()}
                className="flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-prime-action-dark hover:bg-prime-dark-text text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
              >
                {commitLoading ? 'Saving...' : '💾 Save & Replace Audio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
