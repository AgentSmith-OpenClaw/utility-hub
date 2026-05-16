import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE_JSON = `{
  "store": {
    "name": "Bookshop",
    "books": [
      { "title": "The Pragmatic Programmer", "author": "Hunt", "price": 42.95, "inStock": true },
      { "title": "Clean Code", "author": "Martin", "price": 35.00, "inStock": false },
      { "title": "You Don't Know JS", "author": "Simpson", "price": 18.99, "inStock": true }
    ],
    "location": { "city": "San Francisco", "zip": "94105" }
  },
  "version": 2
}`;

const PRESETS = [
  { label: '$.store.name', desc: 'Direct property' },
  { label: '$.store.books[*].title', desc: 'All titles' },
  { label: '$.store.books[0]', desc: 'First book' },
  { label: '$.store.books[1:3]', desc: 'Slice 1–2' },
  { label: '$..author', desc: 'All authors (recursive)' },
  { label: '$.store.books[?(@.inStock == true)].title', desc: 'In-stock titles' },
  { label: '$.store.books[?(@.price < 40)].title', desc: 'Under $40' },
  { label: '$..price', desc: 'All prices (recursive)' },
];

// ── Minimal JSONPath evaluator ───────────────────────────────────────────────

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function jsonpathQuery(root: JsonValue, path: string): JsonValue[] {
  const results: JsonValue[] = [];

  function descend(node: JsonValue, segments: string[]): void {
    if (segments.length === 0) {
      results.push(node);
      return;
    }
    const [head, ...tail] = segments;

    if (head === '$') {
      descend(root, tail);
      return;
    }

    if (head === '..') {
      // Recursive descent: apply tail to current node AND all children
      descend(node, tail);
      if (Array.isArray(node)) {
        node.forEach((child) => descend(child, ['..', ...tail]));
      } else if (node && typeof node === 'object') {
        Object.values(node).forEach((child) => descend(child as JsonValue, ['..', ...tail]));
      }
      return;
    }

    if (head === '[*]' || head === '*') {
      if (Array.isArray(node)) {
        node.forEach((child) => descend(child, tail));
      } else if (node && typeof node === 'object') {
        Object.values(node).forEach((child) => descend(child as JsonValue, tail));
      }
      return;
    }

    // Slice [n:m]
    const sliceMatch = head.match(/^\[(-?\d+):(-?\d+)\]$/);
    if (sliceMatch && Array.isArray(node)) {
      const len = node.length;
      let start = parseInt(sliceMatch[1], 10);
      let end = parseInt(sliceMatch[2], 10);
      if (start < 0) start = Math.max(0, len + start);
      if (end < 0) end = Math.max(0, len + end);
      node.slice(start, end).forEach((child) => descend(child, tail));
      return;
    }

    // Index [n]
    const idxMatch = head.match(/^\[(-?\d+)\]$/);
    if (idxMatch && Array.isArray(node)) {
      const idx = parseInt(idxMatch[1], 10);
      const item = idx < 0 ? node[node.length + idx] : node[idx];
      if (item !== undefined) descend(item, tail);
      return;
    }

    // Filter [?(@.key op value)]
    const filterMatch = head.match(/^\[\?\(@\.([^)]+?)\s*(==|!=|>|>=|<|<=)\s*(.+?)\)\]$/);
    if (filterMatch && Array.isArray(node)) {
      const [, key, op, rawVal] = filterMatch;
      let compareVal: JsonValue;
      try {
        compareVal = JSON.parse(rawVal) as JsonValue;
      } catch {
        compareVal = rawVal.replace(/^['"]|['"]$/g, '');
      }
      node.forEach((child) => {
        if (child && typeof child === 'object' && !Array.isArray(child)) {
          const fieldVal = (child as Record<string, JsonValue>)[key];
          let pass = false;
          if (op === '==' && fieldVal === compareVal) pass = true;
          else if (op === '!=' && fieldVal !== compareVal) pass = true;
          else if (op === '>' && typeof fieldVal === 'number' && typeof compareVal === 'number') pass = fieldVal > compareVal;
          else if (op === '>=' && typeof fieldVal === 'number' && typeof compareVal === 'number') pass = fieldVal >= compareVal;
          else if (op === '<' && typeof fieldVal === 'number' && typeof compareVal === 'number') pass = fieldVal < compareVal;
          else if (op === '<=' && typeof fieldVal === 'number' && typeof compareVal === 'number') pass = fieldVal <= compareVal;
          if (pass) descend(child, tail);
        }
      });
      return;
    }

    // Named property
    const key = head.replace(/^\[['"]?|['"]?\]$/g, '');
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      const child = (node as Record<string, JsonValue>)[key];
      if (child !== undefined) descend(child, tail);
    }
  }

  function tokenise(path: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    while (i < path.length) {
      if (path[i] === '$') { tokens.push('$'); i++; continue; }
      if (path.slice(i, i + 3) === '...') { tokens.push('..'); i += 3; continue; }
      if (path.slice(i, i + 2) === '..') { tokens.push('..'); i += 2; continue; }
      if (path[i] === '.') { i++; continue; }
      if (path[i] === '[') {
        const end = path.indexOf(']', i);
        if (end === -1) break;
        tokens.push(path.slice(i, end + 1));
        i = end + 1;
        continue;
      }
      // identifier
      const m = path.slice(i).match(/^[^.[[\]]+/);
      if (m) { tokens.push(m[0]); i += m[0].length; continue; }
      i++;
    }
    return tokens;
  }

  try {
    descend(root, tokenise(path));
  } catch {
    // swallow
  }
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function JsonPathTester() {
  const [jsonText, setJsonText] = useState('');
  const [pathExpr, setPathExpr] = useState('');

  const { parsed, jsonError } = useMemo(() => {
    if (!jsonText.trim()) return { parsed: null, jsonError: '' };
    try {
      return { parsed: JSON.parse(jsonText) as JsonValue, jsonError: '' };
    } catch (e) {
      return { parsed: null, jsonError: (e as Error).message };
    }
  }, [jsonText]);

  const results: JsonValue[] = useMemo(() => {
    if (!parsed || !pathExpr.trim()) return [];
    try {
      return jsonpathQuery(parsed, pathExpr.trim());
    } catch {
      return [];
    }
  }, [parsed, pathExpr]);

  const resultText = useMemo(() => JSON.stringify(results, null, 2), [results]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Expression bar */}
      <ToolCard
        title="JSONPath expression"
        action={<CopyButton value={pathExpr} label="Copy path" />}
      >
        <input
          type="text"
          value={pathExpr}
          onChange={(e) => setPathExpr(e.target.value)}
          placeholder="e.g. $.store.books[*].title"
          className="w-full font-mono text-sm px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setPathExpr(p.label); if (!jsonText) setJsonText(SAMPLE_JSON); }}
              title={p.desc}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </ToolCard>

      {/* JSON + results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ToolCard
          title="JSON input"
          action={
            <button
              onClick={() => setJsonText(SAMPLE_JSON)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]"
            >
              Load sample
            </button>
          }
        >
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='Paste JSON here…'
            className={`w-full min-h-[280px] font-mono text-sm p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-50 ${jsonError ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-emerald-400'}`}
          />
          {jsonError && <p className="mt-1 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">{jsonError}</p>}
        </ToolCard>

        <ToolCard
          title={`Results (${results.length})`}
          action={results.length > 0 ? <CopyButton value={resultText} /> : undefined}
        >
          {results.length === 0 ? (
            <p className="text-slate-400 text-sm italic py-4">
              {parsed ? 'No matches — try a different expression or use a preset.' : 'Enter valid JSON and a JSONPath expression to see results.'}
            </p>
          ) : (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs text-slate-400 font-mono mt-0.5 shrink-0">[{i}]</span>
                  <pre className="font-mono text-sm bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 whitespace-pre-wrap break-all flex-1 text-emerald-700">
                    {JSON.stringify(r, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </ToolCard>
      </div>

      {/* Cheatsheet */}
      <ToolCard title="JSONPath cheatsheet">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
          {[
            ['$', 'Root element'],
            ['.key', 'Child property'],
            ['..key', 'Recursive descent'],
            ['[*]', 'All elements of array/object'],
            ['[n]', 'Array element at index n'],
            ['[start:end]', 'Array slice'],
            ['[?(@.k == v)]', 'Filter: equality'],
            ['[?(@.price < 10)]', 'Filter: comparison'],
          ].map(([sym, desc]) => (
            <div key={sym} className="flex gap-2 items-baseline text-sm">
              <code className="font-mono text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 shrink-0 text-xs">{sym}</code>
              <span className="text-slate-600">{desc}</span>
            </div>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}
