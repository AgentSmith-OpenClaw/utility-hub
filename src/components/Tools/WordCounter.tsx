import React, { useState, useMemo } from 'react';
import { ToolCard } from './ToolShell';

const SAMPLE = `Toolisk Tools is a collection of free, browser-based utilities built for developers, designers, and writers. Every tool runs entirely on your device — your text, JSON, hashes, and other inputs never leave the browser.

The word counter you are reading right now tracks words, characters, sentences, paragraphs, and reading time in real time. It also surfaces useful length thresholds: Twitter's 280 character limit, Google's 160 character meta description recommendation, and the 60 character sweet spot for SEO titles.

Try editing this paragraph or pasting your own text to see the counts update instantly.`;

interface Stats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number; // minutes
  speakingTime: number; // minutes
  longestWord: string;
  uniqueWords: number;
}

function computeStats(text: string): Stats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;

  const sentences = trimmed
    ? trimmed
        .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
        .split('|')
        .filter((s) => s.trim().length > 0).length
    : 0;

  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;

  const lines = text ? text.split('\n').length : 0;

  const readingTime = words.length / 225; // average 225 wpm reading
  const speakingTime = words.length / 130; // average 130 wpm speaking

  const longestWord = words.reduce((longest, w) => (w.length > longest.length ? w : longest), '');
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9']/g, ''))).size;

  return {
    words: words.length,
    chars,
    charsNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTime,
    speakingTime,
    longestWord,
    uniqueWords,
  };
}

function formatTime(minutes: number): string {
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds}s`;
  }
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

const SEO_LIMITS = [
  { label: 'SEO Title', limit: 60, color: 'sky' },
  { label: 'Meta Description', limit: 160, color: 'indigo' },
  { label: 'Tweet', limit: 280, color: 'cyan' },
  { label: 'OG Description', limit: 200, color: 'violet' },
];

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => computeStats(text), [text]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Editor */}
        <div className="lg:col-span-2">
          <ToolCard
            title="Your text"
            action={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setText(SAMPLE)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Load sample
                </button>
                <button
                  type="button"
                  onClick={() => setText('')}
                  disabled={!text}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            }
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here…"
              className="w-full h-96 px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none leading-relaxed"
            />
          </ToolCard>
        </div>

        {/* Primary stats */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Words" value={stats.words.toLocaleString()} accent="emerald" big />
            <StatBox label="Characters" value={stats.chars.toLocaleString()} accent="teal" big />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="No spaces" value={stats.charsNoSpaces.toLocaleString()} />
            <StatBox label="Sentences" value={stats.sentences.toLocaleString()} />
            <StatBox label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
            <StatBox label="Lines" value={stats.lines.toLocaleString()} />
            <StatBox label="Unique words" value={stats.uniqueWords.toLocaleString()} />
            <StatBox label="Longest word" value={stats.longestWord ? `${stats.longestWord.length}c` : '0'} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Reading time" value={formatTime(stats.readingTime)} hint="@ 225 wpm" />
            <StatBox label="Speaking time" value={formatTime(stats.speakingTime)} hint="@ 130 wpm" />
          </div>
        </div>
      </div>

      {/* SEO limits */}
      <ToolCard title="Length thresholds">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SEO_LIMITS.map((s) => {
            const pct = Math.min(100, (stats.chars / s.limit) * 100);
            const over = stats.chars > s.limit;
            return (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">{s.label}</span>
                  <span
                    className={`text-[11px] font-mono font-semibold ${
                      over ? 'text-red-600' : 'text-slate-500'
                    }`}
                  >
                    {stats.chars}/{s.limit}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      over ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}

function StatBox({
  label,
  value,
  hint,
  accent,
  big,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: 'emerald' | 'teal';
  big?: boolean;
}) {
  const bg = accent === 'emerald'
    ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/50'
    : accent === 'teal'
      ? 'bg-gradient-to-br from-teal-50 to-teal-100/60 border-teal-200/50'
      : 'bg-white border-slate-200';
  return (
    <div className={`rounded-xl border p-3 ${bg}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </div>
      <div className={`font-bold text-slate-900 ${big ? 'text-2xl' : 'text-lg'}`}>{value}</div>
      {hint && <div className="text-[10px] text-slate-400 mt-0.5">{hint}</div>}
    </div>
  );
}
