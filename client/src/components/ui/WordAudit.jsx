import React, { useState, useEffect } from 'react';

export default function WordAudit() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('words'); // 'words' | 'alphabets'

  useEffect(() => {
    fetch('/api/words/audit')
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
  const conceptItems = words.filter(w => w.lessonType === 'concept' || w.lessonType === 'suffix');

  const checkValidity = (word) => {
    if (!word.requiredCharacters || word.requiredCharacters.length === 0) return { valid: false, reason: 'Empty characters' };
    const assembled = word.requiredCharacters.join('');
    if (assembled !== word.malayalamText) return { valid: false, reason: 'Mismatch', assembled };
    return { valid: true };
  };

  const errorCount = buildWords.reduce((sum, w) => checkValidity(w).valid ? sum : sum + 1, 0);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl my-12 border-[16px] border-prime-warm-base animate-pop">
      {/* 1. Header Section */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-4xl font-black text-prime-dark-text italic uppercase tracking-tighter">Curriculum Audit</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Dictionary Integrity & Alphabet Sequencing</p>
        </div>
        <div className="flex flex-col items-end gap-3">
            <div className={`px-6 py-3 rounded-2xl font-black text-xl shadow-lg flex items-center gap-3 ${errorCount === 0 ? 'bg-prime-teal-green text-white' : 'bg-prime-error text-white animate-bounce'}`}>
              <span className="text-2xl">{errorCount === 0 ? '✓' : '⚠'}</span>
              <span>{errorCount === 0 ? 'SPLITS OK' : `${errorCount} ERRORS FOUND`}</span>
            </div>
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-pill border border-slate-100">
                Total Database Entries: {words.length}
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
          onClick={() => setActiveTab('alphabets')}
          className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'alphabets' ? 'bg-white text-prime-action-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Alphabets & Mathras ({alphabetLessons.length})
        </button>
      </div>

      {/* 3. Dynamic Audit Tables */}
      <div className="overflow-x-auto min-h-[400px]">
        {activeTab === 'words' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="py-4 px-2">ID</th>
                <th className="py-4 px-2">Cycle/Lesson</th>
                <th className="py-4 px-2">Word</th>
                <th className="py-4 px-2">Split Parts</th>
                <th className="py-4 px-2">Assembled String</th>
                <th className="py-4 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {buildWords.map(word => {
                const audit = checkValidity(word);
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
                        {word.requiredCharacters?.map((char, i) => (
                          <span key={i} className="px-2 py-1 bg-prime-action-dark text-white text-xs font-black rounded-lg shadow-sm">{char}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className={`text-xl font-black ${!audit.valid ? 'text-prime-error' : 'text-slate-300'}`}>
                        {audit.assembled || word.malayalamText}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {audit.valid ? (
                        <span className="text-prime-teal-green font-black text-[9px] uppercase tracking-widest bg-prime-teal-green/10 px-3 py-1.5 rounded-full">Valid Split</span>
                      ) : (
                        <span className="text-prime-error font-black text-[9px] uppercase tracking-widest bg-prime-error/10 px-3 py-1.5 rounded-full animate-pulse">Error: {audit.reason}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
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

      {/* 4. Concepts Section (Subtle) */}
      <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-prime-coral-pink rounded-full"></span>
            Non-Build Grammar Items ({conceptItems.length})
        </h3>
        <div className="flex flex-wrap gap-3">
          {conceptItems.map(w => (
            <div key={w.wordId} className="bg-white border border-slate-200 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm flex items-center gap-3">
              <span className="text-[8px] font-black text-slate-300 uppercase bg-slate-50 px-2 py-0.5 rounded-lg">{w.lessonType}</span>
              <span className="text-prime-dark-text">{w.malayalamText}</span>
              <span className="text-slate-300 font-normal italic">({w.englishTranslation})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
