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
      <div className="flex gap-2 flex-wrap">
        {(['encode', 'decode'] as const).map((m) => (
          <button key={m} onClick={() => { setMode(m); setInput(''); }} className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors ${mode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
            {m === 'encode' ? 'Text → Bytes' : 'Bytes → Text'}
          </button>
        ))}
      </div>

      <ToolCard title="Output Format">
        <div className="flex flex-wrap gap-2">
          {FORMATS.map(({ key, label }) => (
            <button key={key} onClick={() => setFormat(key)} className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${format === key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {label}
            </button>
          ))}
        </div>
        {mode === 'encode' && (
          <div className="mt-3 flex items-center gap-3">
            <label className="text-xs text-slate-500">Separator:</label>
            <div className="flex gap-2">
              {[' ', '-', ',', ''].map(s => (
                <button key={JSON.stringify(s)} onClick={() => setSep(s)} className={`px-2 py-1 text-xs rounded border font-mono ${sep === s ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600 hover:border-emerald-400'}`}>
                  {s === '' ? 'none' : s === ' ' ? 'space' : s}
                </button>
              ))}
            </div>
          </div>
        )}
      </ToolCard>

      <ToolCard title={mode === 'encode' ? 'Text' : `${FORMATS.find(f => f.key === format)?.label} Input`} action={<CopyButton value={input} disabled={!input} />}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode…' : `Paste ${format} bytes separated by spaces…`}
          className="w-full h-28 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
        />
      </ToolCard>

      <ToolCard title={mode === 'encode' ? `${FORMATS.find(f => f.key === format)?.label} Output` : 'Decoded Text'} action={<CopyButton value={output} disabled={!output} />}>
        <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-all min-h-[80px] max-h-48 overflow-auto">
          {output || <span className="text-slate-400">—</span>}
        </pre>
      </ToolCard>

      {mode === 'encode' && input && output && (
        <ToolCard title="Byte breakdown">
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-auto">
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
