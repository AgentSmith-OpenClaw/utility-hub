import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

function applyShift(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c >= 'a' ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
  });
}

function analyzeFrequency(text: string): [string, number][] {
  const freq: Record<string, number> = {};
  const letters = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
  for (const c of letters) freq[c] = (freq[c] || 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
}

const EN_FREQ = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';

export default function CaesarCipher() {
  const [input, setInput] = useState('The quick brown fox jumps over the lazy dog.');
  const [shift, setShift] = useState(13);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const effectiveShift = mode === 'decrypt' ? -shift : shift;
  const output = useMemo(() => applyShift(input, effectiveShift), [input, effectiveShift]);

  const allShifts = useMemo(() => {
    if (!showAnalysis) return [];
    return Array.from({ length: 26 }, (_, i) => ({
      shift: i,
      text: applyShift(input, i),
    }));
  }, [input, showAnalysis]);

  const frequency = useMemo(() => analyzeFrequency(input), [input]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['encrypt', 'decrypt'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all capitalize ${mode === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => { setInput(output); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Swap
        </button>
      </div>

      <ToolCard title="Shift / ROT">
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={25}
            value={shift}
            onChange={(e) => setShift(+e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={25}
              value={shift}
              onChange={(e) => setShift(Math.min(25, Math.max(0, +e.target.value || 0)))}
              className="w-16 px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <span className="text-sm text-slate-500">ROT</span>
          </div>
          <button onClick={() => setShift(13)} className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${shift === 13 ? 'bg-violet-600 text-white border-violet-600' : 'border-slate-200 text-slate-600 hover:border-violet-400'}`}>
            ROT13
          </button>
        </div>
      </ToolCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ToolCard title="Input" action={<CopyButton value={input} disabled={!input} />}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-56 lg:h-72 px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
            placeholder="Enter text to encrypt or decrypt…"
          />
        </ToolCard>

        <ToolCard title={`Output · shift ${shift}${mode === 'decrypt' ? ' reversed' : ''}`} action={<CopyButton value={output} disabled={!output} />}>
          <pre className="h-56 lg:h-72 px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap break-all overflow-auto">
            {output || <span className="text-slate-400">Output will appear here…</span>}
          </pre>
        </ToolCard>
      </div>

      <ToolCard title="Brute Force (all 26 shifts)" action={
        <button onClick={() => setShowAnalysis(!showAnalysis)} className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-400 transition-colors">
          {showAnalysis ? 'Hide' : 'Show'}
        </button>
      }>
        {showAnalysis ? (
          <div className="space-y-1 max-h-64 overflow-auto">
            {allShifts.map(({ shift: s, text }) => (
              <div key={s} className="flex items-start gap-2 py-1 hover:bg-slate-50 rounded px-1">
                <span className={`text-xs font-mono w-12 shrink-0 ${s === shift ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>ROT{s}</span>
                <span className="text-xs font-mono text-slate-700 break-all">{text.slice(0, 80)}</span>
                <CopyButton value={text} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Click Show to see all 26 possible decryptions at once.</p>
        )}
      </ToolCard>

      {input.trim() && (
        <ToolCard title="Letter Frequency (input)">
          <div className="flex flex-wrap gap-2">
            {frequency.map(([char, count]) => (
              <div key={char} className="flex flex-col items-center bg-slate-50 border border-slate-100 rounded px-2 py-1">
                <span className="text-sm font-bold text-slate-800">{char}</span>
                <span className="text-xs text-slate-500">{count}×</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">English frequency: {EN_FREQ}</p>
        </ToolCard>
      )}
    </div>
  );
}
