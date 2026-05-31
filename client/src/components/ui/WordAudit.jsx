import React, { useState, useEffect } from 'react';

export default function WordAudit() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const otherWords = words.filter(w => w.lessonType !== 'build');

  const checkValidity = (word) => {
    if (!word.requiredCharacters || word.requiredCharacters.length === 0) return { valid: false, reason: 'Empty characters' };
    const assembled = word.requiredCharacters.join('');
    if (assembled !== word.malayalamText) return { valid: false, reason: 'Mismatch', assembled };
    return { valid: true };
  };

  const errorCount = buildWords.reduce((sum, w) => checkValidity(w).valid ? sum : sum + 1, 0);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl my-12 border-[16px] border-prime-warm-base">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-4xl font-black text-prime-dark-text italic uppercase">Dictionary Audit</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Verifying Word Splitting Integrity</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl font-black text-xl shadow-lg ${errorCount === 0 ? 'bg-prime-teal-green text-white' : 'bg-prime-error text-white animate-bounce'}`}>
          {errorCount === 0 ? '✓ ALL CLEAR' : `⚠ ${errorCount} ERRORS FOUND`}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
              <th className="py-4 px-2">ID</th>
              <th className="py-4 px-2">Cycle/Lesson</th>
              <th className="py-4 px-2">Word</th>
              <th className="py-4 px-2">Split Parts</th>
              <th className="py-4 px-2">Assembled</th>
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
                    <div className="flex gap-1">
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
                      <span className="text-prime-teal-green font-black text-xs uppercase tracking-widest bg-prime-teal-green/10 px-3 py-1 rounded-full">Valid</span>
                    ) : (
                      <span className="text-prime-error font-black text-xs uppercase tracking-widest bg-prime-error/10 px-3 py-1 rounded-full animate-pulse">Error: {audit.reason}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Non-Build Items (Reference)</h3>
        <div className="flex flex-wrap gap-2">
          {otherWords.map(w => (
            <div key={w.wordId} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
              <span className="text-slate-300 mr-2">{w.lessonType}</span>
              {w.malayalamText}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
