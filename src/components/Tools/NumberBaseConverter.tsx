import React, { useState, useCallback } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const BASES = [
  { label: 'Binary', base: 2, prefix: '0b' },
  { label: 'Octal', base: 8, prefix: '0o' },
  { label: 'Decimal', base: 10, prefix: '' },
  { label: 'Hexadecimal', base: 16, prefix: '0x' },
];

function convert(value: string, fromBase: number): Map<number, string> {
  const results = new Map<number, string>();
  const trimmed = value.trim().replace(/^(0x|0o|0b)/i, '');
  if (!trimmed) return results;
  const parsed = parseInt(trimmed, fromBase);
  if (isNaN(parsed) || parsed < 0) return results;
  BASES.forEach(({ base }) => {
    results.set(base, parsed.toString(base).toUpperCase());
  });
  return results;
}

export default function NumberBaseConverter() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState(10);

  const results = convert(input, fromBase);
  const isValid = results.size > 0 || !input.trim();

  const handleInput = useCallback((val: string, base: number) => {
    setInput(val);
    setFromBase(base);
  }, []);

  return (
    <div className="space-y-5">
      <ToolCard title="Input">
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BASES.map(({ label, base }) => (
              <button
                key={base}
                onClick={() => setFromBase(base)}
                className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                  fromBase === base
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                }`}
              >
                {label} (Base {base})
              </button>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value, fromBase)}
            placeholder={`Enter ${BASES.find(b => b.base === fromBase)?.label.toLowerCase()} number…`}
            className={`w-full px-3 py-2.5 text-sm font-mono rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 ${
              !isValid && input ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
            }`}
          />
          {!isValid && input && (
            <p className="text-xs text-red-600">Invalid {BASES.find(b => b.base === fromBase)?.label.toLowerCase()} number.</p>
          )}
        </div>
      </ToolCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BASES.map(({ label, base, prefix }) => {
          const value = results.get(base) ?? '';
          const display = value ? `${prefix}${value}` : '';
          return (
            <ToolCard key={base} title={`${label} (Base ${base})`} action={<CopyButton value={display} disabled={!display} />}>
              <p className={`text-sm font-mono break-all min-h-[2rem] ${value ? 'text-slate-800' : 'text-slate-400'}`}>
                {display || '—'}
              </p>
              {base === fromBase && value && (
                <span className="text-xs text-emerald-600 mt-1 inline-block">← input base</span>
              )}
            </ToolCard>
          );
        })}
      </div>

      <ToolCard title="Custom Base">
        <CustomBase input={input} fromBase={fromBase} />
      </ToolCard>
    </div>
  );
}

function CustomBase({ input, fromBase }: { input: string; fromBase: number }) {
  const [toBase, setToBase] = useState(32);
  const trimmed = input.trim().replace(/^(0x|0o|0b)/i, '');
  const parsed = parseInt(trimmed, fromBase);
  const result = !isNaN(parsed) && parsed >= 0 && trimmed ? parsed.toString(toBase).toUpperCase() : '';

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="text-sm text-slate-600">To base:</label>
      <input
        type="number"
        min={2}
        max={36}
        value={toBase}
        onChange={(e) => setToBase(Math.min(36, Math.max(2, parseInt(e.target.value) || 2)))}
        className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      />
      <span className="text-sm font-mono text-slate-800 flex-1">{result || '—'}</span>
      {result && <CopyButton value={result} />}
    </div>
  );
}
