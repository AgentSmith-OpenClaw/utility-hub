import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Format = 'binary' | 'hex' | 'decimal' | 'octal';

function textToFormat(text: string, fmt: Format, sep: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map(b => {
      switch (fmt) {
        case 'binary': return b.toString(2).padStart(8, '0');
        case 'hex': return b.toString(16).padStart(2, '0').toUpperCase();
        case 'decimal': return String(b);
        case 'octal': return b.toString(8).padStart(3, '0');
      }
    })
    .join(sep);
}

function formatToText(encoded: string, fmt: Format): string {
  const separators: Record<Format, RegExp> = {
    binary: /\s+/,
    hex: /\s+/,
    decimal: /\s+|,/,
    octal: /\s+/,
  };
  const base: Record<Format, number> = { binary: 2, hex: 16, decimal: 10, octal: 8 };
  const parts = encoded.trim().split(separators[fmt]).filter(Boolean);
  const bytes = parts.map(p => parseInt(p, base[fmt]));
  if (bytes.some(isNaN)) return '';
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export default function TextBinary() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<Format>('binary');
  const [input, setInput] = useState('Hello');
  const [sep, setSep] = useState(' ');

  const output = useMemo(() => {
    if (!input.trim()) return '';
    if (mode === 'encode') return textToFormat(input, format, sep);
    return formatToText(input, format);
  }, [input, format, mode, sep]);

  const FORMATS: { key: Format; label: string }[] = [
    { key: 'binary', label: 'Binary' },
    { key: 'hex', label: 'Hexadecimal' },
    { key: 'decimal', label: 'Decimal (ASCII)' },
    { key: 'octal', label: 'Octal' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setInput(''); }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${mode === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m === 'encode' ? 'Text → Bytes' : 'Bytes → Text'}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {FORMATS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFormat(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${format === key ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === 'encode' && (
          <div className="inline-flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Separator</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {[' ', '-', ',', ''].map(s => (
                <button
                  key={JSON.stringify(s)}
                  type="button"
                  onClick={() => setSep(s)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-all font-mono ${sep === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {s === '' ? 'none' : s === ' ' ? 'space' : s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ToolCard title={mode === 'encode' ? 'Text' : `${FORMATS.find(f => f.key === format)?.label} Input`} action={<CopyButton value={input} disabled={!input} />}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode…' : `Paste ${format} bytes separated by spaces…`}
            className="w-full h-64 lg:h-80 px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
        </ToolCard>

        <ToolCard title={mode === 'encode' ? `${FORMATS.find(f => f.key === format)?.label} Output` : 'Decoded Text'} action={<CopyButton value={output} disabled={!output} />}>
          <pre className="h-64 lg:h-80 px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap break-all overflow-auto">
            {output || <span className="text-slate-400">Output will appear here…</span>}
          </pre>
        </ToolCard>
      </div>

      {mode === 'encode' && input && output && (
        <ToolCard title="Byte breakdown">
          <div className="flex flex-wrap gap-1.5 max-h-60 overflow-auto">
            {Array.from(input).map((char, i) => {
              const bytes = Array.from(new TextEncoder().encode(char));
              return bytes.map((byte, j) => (
                <div key={`${i}-${j}`} className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded px-2 py-1">
                  <span className="text-xs font-bold text-slate-700">{j === 0 ? `'${char}'` : ''}</span>
                  <span className="text-xs font-mono text-emerald-700">
                    {format === 'binary' ? byte.toString(2).padStart(8, '0') :
                     format === 'hex' ? byte.toString(16).padStart(2, '0').toUpperCase() :
                     format === 'octal' ? byte.toString(8).padStart(3, '0') :
                     String(byte)}
                  </span>
                </div>
              ));
            })}
          </div>
        </ToolCard>
      )}
    </div>
  );
}
