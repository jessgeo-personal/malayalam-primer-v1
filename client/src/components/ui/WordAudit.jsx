import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/api';

export default function WordAudit() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('words'); // 'words' | 'alphabets' | 'grammar'

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
    <div className="flex flex-col gap-8 p-8 max-w-[1550px] mx-auto bg-white rounded-[40px] shadow-2xl my-12 border-[16px] border-prime-warm-base animate-pop overflow-hidden">
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
