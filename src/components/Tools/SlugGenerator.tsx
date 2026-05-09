import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Style = 'lower' | 'upper' | 'preserve';

function slugify(input: string, separator: string, style: Style, maxLen: number, stripStop: boolean): string {
  if (!input) return '';
  let s = input.normalize('NFKD').replace(/[̀-ͯ]/g, ''); // strip accents
  s = s.replace(/[‘’“”]/g, ''); // quotes
  s = s.replace(/&/g, ' and ');
  s = s.replace(/[^a-zA-Z0-9\s-]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();

  if (stripStop) {
    const STOP = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'in', 'on', 'at', 'of', 'to', 'for',
      'with', 'by', 'as',
    ]);
    s = s
      .split(' ')
      .filter((w) => !STOP.has(w.toLowerCase()))
      .join(' ');
  }

  if (style === 'lower') s = s.toLowerCase();
  else if (style === 'upper') s = s.toUpperCase();

  s = s.replace(/\s+/g, separator).replace(/-+/g, separator);

  if (maxLen > 0 && s.length > maxLen) {
    s = s.slice(0, maxLen);
    const lastSep = s.lastIndexOf(separator);
    if (lastSep > maxLen * 0.6) s = s.slice(0, lastSep);
  }
  return s.replace(new RegExp(`^[${separator}]+|[${separator}]+$`, 'g'), '');
}

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [style, setStyle] = useState<Style>('lower');
  const [maxLen, setMaxLen] = useState(60);
  const [stripStop, setStripStop] = useState(false);

  const slug = useMemo(
    () => slugify(input, separator, style, maxLen, stripStop),
    [input, separator, style, maxLen, stripStop],
  );

  const lines = input.split('\n').filter((l) => l.trim());
  const bulkSlugs = useMemo(
    () =>
      lines.length > 1
        ? lines.map((l) => ({ source: l, slug: slugify(l, separator, style, maxLen, stripStop) }))
        : [],
    [lines, separator, style, maxLen, stripStop],
  );

  return (
    <div className="space-y-5">
      <ToolCard title="Title or text">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a title (or one per line for bulk)…"
          spellCheck={false}
          className="w-full h-32 px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
        />
      </ToolCard>

      <ToolCard title="Options">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Separator</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {['-', '_', '.'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeparator(s)}
                  className={`px-3 py-1 text-sm font-mono rounded-md transition-all ${
                    separator === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Case</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(['lower', 'upper', 'preserve'] as Style[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all uppercase ${
                    style === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Max length: {maxLen || 'unlimited'}
            </span>
            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={maxLen}
              onChange={(e) => setMaxLen(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer mt-5">
            <input
              type="checkbox"
              checked={stripStop}
              onChange={(e) => setStripStop(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Strip stop words (a, the, of…)
          </label>
        </div>
      </ToolCard>

      <ToolCard title="URL slug" action={<CopyButton value={slug} disabled={!slug} />}>
        <code
          className={`block w-full px-3 py-3 text-base font-mono bg-slate-50 border border-slate-200 rounded-lg break-all ${
            slug ? 'text-emerald-700' : 'text-slate-400'
          }`}
        >
          {slug || '—'}
        </code>
        <p className="text-[11px] text-slate-400 mt-2">{slug.length} characters</p>
      </ToolCard>

      {bulkSlugs.length > 0 && (
        <ToolCard
          title={`Bulk results (${bulkSlugs.length})`}
          action={<CopyButton value={bulkSlugs.map((b) => b.slug).join('\n')} label="Copy all" />}
        >
          <div className="space-y-1.5 max-h-80 overflow-auto">
            {bulkSlugs.map((b, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm">
                <span className="text-[10px] text-slate-400 w-6 flex-shrink-0">{i + 1}</span>
                <code className="flex-1 font-mono text-slate-700 break-all">{b.slug || '—'}</code>
                <CopyButton value={b.slug} />
              </div>
            ))}
          </div>
        </ToolCard>
      )}
    </div>
  );
}
