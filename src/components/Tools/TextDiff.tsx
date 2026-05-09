import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Op = 'equal' | 'add' | 'remove';
interface DiffLine { op: Op; left?: string; right?: string; leftNo?: number; rightNo?: number; }

function diffLines(a: string[], b: string[]): DiffLine[] {
  // Standard LCS DP
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let leftNo = 1;
  let rightNo = 1;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ op: 'equal', left: a[i], right: b[j], leftNo: leftNo++, rightNo: rightNo++ });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ op: 'remove', left: a[i], leftNo: leftNo++ });
      i++;
    } else {
      out.push({ op: 'add', right: b[j], rightNo: rightNo++ });
      j++;
    }
  }
  while (i < n) {
    out.push({ op: 'remove', left: a[i++], leftNo: leftNo++ });
  }
  while (j < m) {
    out.push({ op: 'add', right: b[j++], rightNo: rightNo++ });
  }
  return out;
}

export default function TextDiff() {
  const [left, setLeft] = useState('The quick brown fox\njumps over the lazy dog\n');
  const [right, setRight] = useState('The quick red fox\njumps over the sleeping dog\nand barks twice\n');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const diff = useMemo(() => {
    const norm = (s: string) => {
      let n = s;
      if (ignoreCase) n = n.toLowerCase();
      if (ignoreWhitespace) n = n.replace(/\s+/g, ' ').trim();
      return n;
    };
    const aLines = left.split('\n');
    const bLines = right.split('\n');
    const aNorm = aLines.map(norm);
    const bNorm = bLines.map(norm);
    const result = diffLines(aNorm, bNorm);
    // Re-attach original (un-normalized) text
    return result.map((d) => ({
      ...d,
      left: d.leftNo !== undefined ? aLines[d.leftNo - 1] : undefined,
      right: d.rightNo !== undefined ? bLines[d.rightNo - 1] : undefined,
    }));
  }, [left, right, ignoreCase, ignoreWhitespace]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    diff.forEach((d) => {
      if (d.op === 'add') added++;
      else if (d.op === 'remove') removed++;
    });
    return { added, removed, unchanged: diff.length - added - removed };
  }, [diff]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Ignore case
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Ignore whitespace
        </label>
        <div className="ml-auto text-xs text-slate-500 flex items-center gap-3">
          <span><span className="text-emerald-600 font-bold">+{stats.added}</span> added</span>
          <span><span className="text-rose-600 font-bold">−{stats.removed}</span> removed</span>
          <span className="text-slate-400">{stats.unchanged} unchanged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolCard title="Original">
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            spellCheck={false}
            className="w-full h-48 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
        </ToolCard>
        <ToolCard title="Modified">
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            spellCheck={false}
            className="w-full h-48 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
        </ToolCard>
      </div>

      <ToolCard title="Diff" action={
        <CopyButton
          value={diff.map((d) => (d.op === 'add' ? `+${d.right}` : d.op === 'remove' ? `-${d.left}` : ` ${d.left}`)).join('\n')}
          label="Copy diff"
        />
      }>
        <div className="font-mono text-xs overflow-x-auto">
          {diff.map((d, i) => {
            const cls =
              d.op === 'add'
                ? 'bg-emerald-50 text-emerald-900 border-l-2 border-emerald-400'
                : d.op === 'remove'
                ? 'bg-rose-50 text-rose-900 border-l-2 border-rose-400'
                : 'bg-white text-slate-700 border-l-2 border-transparent';
            const sign = d.op === 'add' ? '+' : d.op === 'remove' ? '−' : ' ';
            return (
              <div key={i} className={`flex gap-2 px-2 py-0.5 ${cls}`}>
                <span className="w-8 text-right text-slate-400 text-[10px]">{d.leftNo ?? ''}</span>
                <span className="w-8 text-right text-slate-400 text-[10px]">{d.rightNo ?? ''}</span>
                <span className="w-3 font-bold">{sign}</span>
                <span className="whitespace-pre-wrap break-all flex-1">
                  {d.op === 'add' ? d.right : d.left}
                </span>
              </div>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}
