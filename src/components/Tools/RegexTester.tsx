import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

interface MatchInfo {
  start: number;
  end: number;
  text: string;
  groups: Array<{ name?: string; value: string | undefined }>;
}

interface RegexResult {
  matches: MatchInfo[];
  error: string;
  flags: string;
}

const CHEATSHEET = [
  { sym: '\\d', desc: 'Any digit (0-9)' },
  { sym: '\\D', desc: 'Any non-digit' },
  { sym: '\\w', desc: 'Word character [A-Za-z0-9_]' },
  { sym: '\\W', desc: 'Non-word character' },
  { sym: '\\s', desc: 'Whitespace' },
  { sym: '\\S', desc: 'Non-whitespace' },
  { sym: '.', desc: 'Any character (except newline)' },
  { sym: '^', desc: 'Start of string / line' },
  { sym: '$', desc: 'End of string / line' },
  { sym: '*', desc: '0 or more' },
  { sym: '+', desc: '1 or more' },
  { sym: '?', desc: '0 or 1 (or non-greedy)' },
  { sym: '{n,m}', desc: 'Between n and m times' },
  { sym: '[abc]', desc: 'Any of a, b, c' },
  { sym: '[^abc]', desc: 'None of a, b, c' },
  { sym: '(...)', desc: 'Capturing group' },
  { sym: '(?:...)', desc: 'Non-capturing group' },
  { sym: '(?<name>...)', desc: 'Named group' },
  { sym: '|', desc: 'OR alternation' },
];

const PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'URL', pattern: 'https?:\\/\\/[\\w.-]+(?:\\/[\\w\\-./?%&=]*)?', flags: 'g' },
  { label: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}', flags: 'g' },
  { label: 'IPv4', pattern: '(?:\\d{1,3}\\.){3}\\d{1,3}', flags: 'g' },
  { label: 'Hex color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'g' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', flags: 'g' },
];

const SAMPLE_TEXT = `Contact us at hello@toolisk.com or sales@example.org.
Visit https://toolisk.com for more info.
Support: (555) 123-4567 or 555.987.6543
Server IP: 192.168.1.1
Brand colors: #10b981, #0d9488, #14b8a6
Released on 2026-02-15.`;

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [replacement, setReplacement] = useState('');
  const [showReplace, setShowReplace] = useState(false);

  const result: RegexResult = useMemo(() => {
    if (!pattern || !text) return { matches: [], error: '', flags };
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const matches: MatchInfo[] = [];
      let m: RegExpExecArray | null;
      let safety = 0;
      while ((m = re.exec(text)) !== null && safety < 5000) {
        matches.push({
          start: m.index,
          end: m.index + m[0].length,
          text: m[0],
          groups: m.slice(1).map((value, i) => ({
            name: re.source.match(/\(\?<([^>]+)>/g)?.[i]?.match(/<([^>]+)>/)?.[1],
            value,
          })),
        });
        if (m[0].length === 0) re.lastIndex++;
        safety++;
      }
      return { matches, error: '', flags };
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : 'Invalid pattern', flags };
    }
  }, [pattern, flags, text]);

  const replaced = useMemo(() => {
    if (!pattern || !text || result.error) return '';
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      return text.replace(re, replacement);
    } catch {
      return '';
    }
  }, [pattern, flags, text, replacement, result.error]);

  const highlighted = useMemo(() => {
    if (!result.matches.length || result.error) return null;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    result.matches.forEach((m, i) => {
      if (m.start > lastIdx) parts.push(text.slice(lastIdx, m.start));
      parts.push(
        <mark key={i} className="bg-emerald-200 text-emerald-900 rounded px-0.5 font-semibold">
          {text.slice(m.start, m.end)}
        </mark>
      );
      lastIdx = m.end;
    });
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts;
  }, [text, result]);

  const toggleFlag = (f: string) => {
    setFlags((current) => (current.includes(f) ? current.replace(f, '') : current + f));
  };

  return (
    <div className="space-y-5">
      <ToolCard>
        <div className="space-y-3">
          <div className="flex items-stretch gap-2">
            <span className="inline-flex items-center px-3 text-slate-400 font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern…"
              className="flex-1 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              spellCheck={false}
            />
            <span className="inline-flex items-center px-3 text-slate-400 font-mono">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
              placeholder="gim"
              className="w-20 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { f: 'g', label: 'global' },
              { f: 'i', label: 'case-insensitive' },
              { f: 'm', label: 'multiline' },
              { f: 's', label: 'dotall' },
              { f: 'u', label: 'unicode' },
              { f: 'y', label: 'sticky' },
            ].map((b) => (
              <button
                key={b.f}
                type="button"
                onClick={() => toggleFlag(b.f)}
                className={`text-[11px] font-semibold px-2 py-1 rounded-md border transition-colors ${
                  flags.includes(b.f)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {b.f} · {b.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setPattern(p.pattern);
                  setFlags(p.flags);
                  if (!text) setText(SAMPLE_TEXT);
                }}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {result.error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2.5 font-mono">
              {result.error}
            </div>
          )}
        </div>
      </ToolCard>

      <ToolCard
        title="Test text"
        action={
          <>
            <span className="text-[11px] text-slate-400 font-medium">
              {result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'}
            </span>
            <button
              type="button"
              onClick={() => setText(SAMPLE_TEXT)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50 transition-colors"
            >
              Load sample
            </button>
          </>
        }
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to test against the pattern…"
          className="w-full h-40 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          spellCheck={false}
        />
        {highlighted && (
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg max-h-60 overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {highlighted}
          </div>
        )}
      </ToolCard>

      {/* Replace mode */}
      <ToolCard
        title="Replace"
        action={
          <button
            type="button"
            onClick={() => setShowReplace(!showReplace)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            {showReplace ? 'Hide' : 'Show'}
          </button>
        }
      >
        {showReplace ? (
          <>
            <input
              type="text"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="Replacement (use $1, $2 for capture groups)"
              className="w-full px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 mb-3"
              spellCheck={false}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Output</span>
              <CopyButton value={replaced} disabled={!replaced} />
            </div>
            <pre className="text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 whitespace-pre-wrap max-h-40 overflow-auto">
              {replaced || <span className="text-slate-400">—</span>}
            </pre>
          </>
        ) : (
          <p className="text-sm text-slate-500">Click &quot;Show&quot; to test pattern replacement.</p>
        )}
      </ToolCard>

      {/* Match details */}
      {result.matches.length > 0 && (
        <ToolCard title={`All matches (${result.matches.length})`}>
          <div className="space-y-2 max-h-72 overflow-auto">
            {result.matches.slice(0, 50).map((m, i) => (
              <div key={i} className="flex items-start gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono">
                <span className="text-slate-400 w-12 flex-shrink-0">#{i + 1}</span>
                <span className="text-slate-400 w-20 flex-shrink-0">{m.start}-{m.end}</span>
                <code className="flex-1 text-emerald-700 break-all">{m.text}</code>
                {m.groups.length > 0 && m.groups.some((g) => g.value) && (
                  <span className="text-[10px] text-slate-500">
                    {m.groups.filter((g) => g.value).length} groups
                  </span>
                )}
              </div>
            ))}
            {result.matches.length > 50 && (
              <p className="text-xs text-slate-400 text-center py-2">
                Showing first 50 of {result.matches.length} matches.
              </p>
            )}
          </div>
        </ToolCard>
      )}

      <ToolCard title="Cheatsheet">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {CHEATSHEET.map((c) => (
            <div key={c.sym} className="flex items-start gap-2 px-2 py-1">
              <code className="bg-slate-100 text-slate-800 rounded px-1.5 py-0.5 font-mono min-w-[3.5rem] text-center">
                {c.sym}
              </code>
              <span className="text-slate-600">{c.desc}</span>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}
