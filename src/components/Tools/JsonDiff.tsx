import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE_A = `{
  "user": {
    "id": 42,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "admin",
    "active": true
  },
  "plan": "free",
  "createdAt": "2025-01-15"
}`;

const SAMPLE_B = `{
  "user": {
    "id": 42,
    "name": "Ada Lovelace",
    "email": "ada@toolisk.com",
    "role": "editor",
    "active": true,
    "lastLogin": "2026-05-01"
  },
  "plan": "pro",
  "updatedAt": "2026-05-01"
}`;

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

interface DiffEntry {
  path: string;
  type: 'added' | 'removed' | 'changed' | 'array-changed';
  oldVal?: JsonValue;
  newVal?: JsonValue;
}

function diffJson(a: JsonValue, b: JsonValue, path = '$'): DiffEntry[] {
  const results: DiffEntry[] = [];

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const childPath = `${path}[${i}]`;
      if (i >= a.length) results.push({ path: childPath, type: 'added', newVal: b[i] });
      else if (i >= b.length) results.push({ path: childPath, type: 'removed', oldVal: a[i] });
      else results.push(...diffJson(a[i], b[i], childPath));
    }
    return results;
  }

  if (
    a && b &&
    typeof a === 'object' && typeof b === 'object' &&
    !Array.isArray(a) && !Array.isArray(b)
  ) {
    const aObj = a as Record<string, JsonValue>;
    const bObj = b as Record<string, JsonValue>;
    const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
    keys.forEach((k) => {
      const childPath = `${path}.${k}`;
      if (!(k in aObj)) results.push({ path: childPath, type: 'added', newVal: bObj[k] });
      else if (!(k in bObj)) results.push({ path: childPath, type: 'removed', oldVal: aObj[k] });
      else results.push(...diffJson(aObj[k], bObj[k], childPath));
    });
    return results;
  }

  if (a !== b) {
    results.push({ path, type: 'changed', oldVal: a, newVal: b });
  }
  return results;
}

function fmt(v: JsonValue): string {
  if (v === null) return 'null';
  if (typeof v === 'string') return `"${v}"`;
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

const TAG: Record<DiffEntry['type'], { label: string; bg: string; text: string }> = {
  added:         { label: '+  added',   bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  removed:       { label: '−  removed', bg: 'bg-rose-50 border-rose-200',       text: 'text-rose-700'    },
  changed:       { label: '~  changed', bg: 'bg-amber-50 border-amber-200',      text: 'text-amber-700'   },
  'array-changed':{ label: '~  changed', bg: 'bg-amber-50 border-amber-200',     text: 'text-amber-700'   },
};

export default function JsonDiff() {
  const [left, setLeft]   = useState('');
  const [right, setRight] = useState('');

  const { leftParsed, leftErr }   = useMemo(() => {
    if (!left.trim()) return { leftParsed: null, leftErr: '' };
    try   { return { leftParsed: JSON.parse(left) as JsonValue, leftErr: '' }; }
    catch (e) { return { leftParsed: null, leftErr: (e as Error).message }; }
  }, [left]);

  const { rightParsed, rightErr } = useMemo(() => {
    if (!right.trim()) return { rightParsed: null, rightErr: '' };
    try   { return { rightParsed: JSON.parse(right) as JsonValue, rightErr: '' }; }
    catch (e) { return { rightParsed: null, rightErr: (e as Error).message }; }
  }, [right]);

  const diffs = useMemo<DiffEntry[]>(() => {
    if (!leftParsed || !rightParsed) return [];
    return diffJson(leftParsed, rightParsed);
  }, [leftParsed, rightParsed]);

  const summary = useMemo(() => ({
    added:   diffs.filter((d) => d.type === 'added').length,
    removed: diffs.filter((d) => d.type === 'removed').length,
    changed: diffs.filter((d) => d.type === 'changed' || d.type === 'array-changed').length,
  }), [diffs]);

  const diffText = useMemo(() =>
    diffs.map((d) => {
      if (d.type === 'added') return `+ ${d.path}: ${fmt(d.newVal as JsonValue)}`;
      if (d.type === 'removed') return `- ${d.path}: ${fmt(d.oldVal as JsonValue)}`;
      return `~ ${d.path}: ${fmt(d.oldVal as JsonValue)} → ${fmt(d.newVal as JsonValue)}`;
    }).join('\n'),
  [diffs]);

  const loadSample = () => { setLeft(SAMPLE_A); setRight(SAMPLE_B); };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ToolCard title="JSON A (original)" action={
          <button onClick={loadSample} className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">
            Load sample
          </button>
        }>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original JSON…"
            className={`w-full min-h-[220px] font-mono text-sm p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-50 ${leftErr ? 'border-rose-300' : 'border-slate-200 focus:border-emerald-400'}`}
          />
          {leftErr && <p className="mt-1 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">{leftErr}</p>}
        </ToolCard>

        <ToolCard title="JSON B (modified)">
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified JSON…"
            className={`w-full min-h-[220px] font-mono text-sm p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-50 ${rightErr ? 'border-rose-300' : 'border-slate-200 focus:border-emerald-400'}`}
          />
          {rightErr && <p className="mt-1 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">{rightErr}</p>}
        </ToolCard>
      </div>

      {/* Results */}
      {(leftParsed && rightParsed) && (
        <ToolCard
          title={`Diff — ${diffs.length} change${diffs.length !== 1 ? 's' : ''}`}
          action={diffs.length > 0 ? <CopyButton value={diffText} /> : undefined}
        >
          {diffs.length === 0 ? (
            <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-semibold">
              ✓ JSON objects are identical
            </p>
          ) : (
            <>
              <div className="flex gap-3 mb-4 flex-wrap">
                {summary.added   > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">+{summary.added} added</span>}
                {summary.removed > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">−{summary.removed} removed</span>}
                {summary.changed > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">~{summary.changed} changed</span>}
              </div>
              <div className="space-y-2">
                {diffs.map((d, i) => {
                  const t = TAG[d.type];
                  return (
                    <div key={i} className={`rounded-lg border px-3 py-2.5 ${t.bg}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-mono font-bold ${t.text}`}>{t.label}</span>
                        <code className="text-xs font-mono text-slate-700 bg-white/70 px-1.5 py-0.5 rounded">{d.path}</code>
                      </div>
                      {d.type === 'changed' && (
                        <div className="mt-1 text-xs font-mono flex flex-wrap gap-2">
                          <span className="text-rose-600 line-through">{fmt(d.oldVal as JsonValue)}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-emerald-700">{fmt(d.newVal as JsonValue)}</span>
                        </div>
                      )}
                      {d.type === 'added' && <div className="mt-1 text-xs font-mono text-emerald-700">{fmt(d.newVal as JsonValue)}</div>}
                      {d.type === 'removed' && <div className="mt-1 text-xs font-mono text-rose-600">{fmt(d.oldVal as JsonValue)}</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </ToolCard>
      )}
    </div>
  );
}
