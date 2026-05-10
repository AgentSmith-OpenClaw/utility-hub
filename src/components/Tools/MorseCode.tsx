import React, { useState, useMemo, useCallback, useRef } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => {
    if (c === ' ') return '  /  ';
    return MORSE_MAP[c] ?? '?';
  }).join(' ');
}

function morseToText(morse: string): string {
  return morse.split(/\s{3,}|\s*\/\s*/).map(word =>
    word.trim().split(/\s+/).map(code => REVERSE_MAP[code] ?? '?').join('')
  ).join(' ');
}

export default function MorseCode() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Hello World');
  const audioCtx = useRef<AudioContext | null>(null);

  const output = useMemo(() => {
    if (!input.trim()) return '';
    return mode === 'encode' ? textToMorse(input) : morseToText(input);
  }, [input, mode]);

  const playMorse = useCallback(async () => {
    const morse = mode === 'encode' ? output : textToMorse(output);
    if (!morse) return;
    if (!audioCtx.current || audioCtx.current.state === 'closed') {
      audioCtx.current = new AudioContext();
    }
    const ctx = audioCtx.current;
    const unit = 0.08;
    let t = ctx.currentTime + 0.1;

    for (const ch of morse) {
      if (ch === '.') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 600;
        osc.start(t); osc.stop(t + unit);
        t += unit * 1.5;
      } else if (ch === '-') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 600;
        osc.start(t); osc.stop(t + unit * 3);
        t += unit * 4.5;
      } else if (ch === ' ') {
        t += unit * 2;
      } else if (ch === '/') {
        t += unit * 4;
      }
    }
  }, [mode, output]);

  const EXAMPLES = [
    { label: 'SOS', value: mode === 'encode' ? 'SOS' : '... --- ...' },
    { label: 'Hello', value: mode === 'encode' ? 'Hello World' : '.... . .-.. .-.. ---  /  .-- --- .-. .-.. -..' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {(['encode', 'decode'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setInput(''); }} className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors ${mode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {m === 'encode' ? 'Text → Morse' : 'Morse → Text'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex.label} onClick={() => setInput(ex.value)} className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-400 transition-colors">
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <ToolCard title={mode === 'encode' ? 'Text Input' : 'Morse Input'} action={<CopyButton value={input} disabled={!input} />}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Type text to encode to Morse code…' : 'Enter Morse code (use spaces between letters, / between words)…'}
          className="w-full h-28 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
        />
      </ToolCard>

      <ToolCard title={mode === 'encode' ? 'Morse Output' : 'Decoded Text'} action={
        <div className="flex gap-2">
          {mode === 'encode' && (
            <button onClick={playMorse} disabled={!output} title="Play audio" className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-400 disabled:opacity-40 transition-colors">
              ▶ Play
            </button>
          )}
          <CopyButton value={output} disabled={!output} />
        </div>
      }>
        <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-all min-h-[80px]">
          {output || <span className="text-slate-400">—</span>}
        </pre>
      </ToolCard>

      <ToolCard title="Morse Code Reference">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 text-xs font-mono">
          {Object.entries(MORSE_MAP).filter(([k]) => /[A-Z0-9]/.test(k)).map(([char, code]) => (
            <div key={char} className="flex flex-col items-center bg-slate-50 rounded p-1.5 border border-slate-100">
              <span className="font-bold text-slate-800">{char}</span>
              <span className="text-slate-500 text-center leading-tight">{code}</span>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}
