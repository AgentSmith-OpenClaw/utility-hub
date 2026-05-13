import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

function splitWords(input: string): string[] {
  if (!input) return [];
  // Split by spaces, hyphens, underscores, dots, and camelCase boundaries
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .split(/[\s\-_.\/\\]+/)
    .filter(Boolean);
}

const CONVERSIONS = [
  {
    label: 'camelCase',
    description: 'JavaScript variables and functions',
    fn: (words: string[]) =>
      words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
        .join(''),
  },
  {
    label: 'PascalCase',
    description: 'Classes, types, and components',
    fn: (words: string[]) => words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(''),
  },
  {
    label: 'snake_case',
    description: 'Python variables, database columns',
    fn: (words: string[]) => words.map((w) => w.toLowerCase()).join('_'),
  },
  {
    label: 'CONSTANT_CASE',
    description: 'Constants and environment variables',
    fn: (words: string[]) => words.map((w) => w.toUpperCase()).join('_'),
  },
  {
    label: 'kebab-case',
    description: 'URLs, CSS classes, file names',
    fn: (words: string[]) => words.map((w) => w.toLowerCase()).join('-'),
  },
  {
    label: 'Train-Case',
    description: 'HTTP headers',
    fn: (words: string[]) => words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('-'),
  },
  {
    label: 'dot.case',
    description: 'Property paths, namespaces',
    fn: (words: string[]) => words.map((w) => w.toLowerCase()).join('.'),
  },
  {
    label: 'Title Case',
    description: 'Headlines and book titles',
    fn: (words: string[]) => words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' '),
  },
  {
    label: 'Sentence case',
    description: 'Standard prose',
    fn: (words: string[]) =>
      words
        .map((w, i) => (i === 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()))
        .join(' '),
  },
  {
    label: 'lowercase',
    description: 'All lowercase',
    fn: (words: string[]) => words.join(' ').toLowerCase(),
  },
  {
    label: 'UPPERCASE',
    description: 'All uppercase',
    fn: (words: string[]) => words.join(' ').toUpperCase(),
  },
  {
    label: 'iNVERSE',
    description: 'Inverted case',
    fn: (words: string[]) =>
      words
        .join(' ')
        .split('')
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join(''),
  },
];

export default function CaseConverter() {
  const [input, setInput] = useState('');

  const words = useMemo(() => splitWords(input), [input]);

  return (
    <div className="space-y-5">
      <ToolCard
        title="Input"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInput(SAMPLE)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => setInput('')}
              disabled={!input}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        }
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text in any case…"
          className="w-full h-48 sm:h-56 px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          spellCheck={false}
        />
      </ToolCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONVERSIONS.map((c) => {
          const result = words.length ? c.fn(words) : '';
          return (
            <div key={c.label} className="bg-white rounded-lg border border-slate-200 p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <div className="text-sm font-bold text-slate-900">{c.label}</div>
                  <div className="text-[11px] text-slate-400">{c.description}</div>
                </div>
                <CopyButton value={result} disabled={!result} />
              </div>
              <code className="block text-[13px] sm:text-sm font-mono text-emerald-700 break-all bg-slate-50 rounded-lg px-3 py-2.5 min-h-[3rem]">
                {result || <span className="text-slate-300">—</span>}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
