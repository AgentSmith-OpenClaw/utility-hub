import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const SAMPLE = `{
  "user": {
    "id": 42,
    "name": "Ada Lovelace",
    "email": "ada@toolisk.com",
    "active": true,
    "roles": ["admin", "engineer"],
    "metadata": {
      "joined": "2026-01-15",
      "lastLogin": "2026-05-07T08:30:00Z",
      "preferences": {
        "theme": "dark",
        "notifications": true
      }
    }
  },
  "items": [
    { "id": 1, "label": "Alpha", "value": 12.5 },
    { "id": 2, "label": "Beta",  "value": null },
    { "id": 3, "label": "Gamma", "value": 99 }
  ]
}`;

type Mode = 'pretty' | 'minify' | 'tree';

interface ParseState {
  data: any;
  error: string;
  errorLine?: number;
  errorCol?: number;
}

function parseWithLocation(text: string): ParseState {
  if (!text.trim()) return { data: undefined, error: '' };
  try {
    return { data: JSON.parse(text), error: '' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON';
    const m = msg.match(/position\s+(\d+)/i);
    if (m) {
      const pos = parseInt(m[1], 10);
      const upTo = text.slice(0, pos);
      const line = upTo.split('\n').length;
      const col = pos - upTo.lastIndexOf('\n');
      return { data: undefined, error: msg, errorLine: line, errorCol: col };
    }
    return { data: undefined, error: msg };
  }
}

interface NodeProps {
  data: any;
  name?: string | number;
  depth: number;
  isLast: boolean;
}

function JsonNode({ data, name, depth, isLast }: NodeProps) {
  const [open, setOpen] = useState(depth < 2);

  const indent = { paddingLeft: `${depth * 16}px` };
  const keyEl =
    name !== undefined ? (
      <span className="text-rose-700">
        {typeof name === 'number' ? name : `"${name}"`}
      </span>
    ) : null;

  if (data === null) {
    return (
      <div style={indent} className="font-mono text-sm leading-6">
        {keyEl}
        {keyEl && <span className="text-slate-400">: </span>}
        <span className="text-slate-500 italic">null</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    );
  }

  if (typeof data === 'string') {
    return (
      <div style={indent} className="font-mono text-sm leading-6">
        {keyEl}
        {keyEl && <span className="text-slate-400">: </span>}
        <span className="text-emerald-700 break-all">&quot;{data}&quot;</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    );
  }

  if (typeof data === 'number' || typeof data === 'boolean') {
    return (
      <div style={indent} className="font-mono text-sm leading-6">
        {keyEl}
        {keyEl && <span className="text-slate-400">: </span>}
        <span className={typeof data === 'boolean' ? 'text-purple-700' : 'text-blue-700'}>
          {String(data)}
        </span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray
    ? data.map((v: any, i: number) => [i, v] as [number, any])
    : Object.entries(data);
  const openBrace = isArray ? '[' : '{';
  const closeBrace = isArray ? ']' : '}';

  if (entries.length === 0) {
    return (
      <div style={indent} className="font-mono text-sm leading-6">
        {keyEl}
        {keyEl && <span className="text-slate-400">: </span>}
        <span className="text-slate-500">{openBrace}{closeBrace}</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    );
  }

  return (
    <div className="font-mono text-sm leading-6">
      <div style={indent} className="flex items-start">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-slate-400 hover:text-emerald-600 mr-1 select-none"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? '▾' : '▸'}
        </button>
        <span>
          {keyEl}
          {keyEl && <span className="text-slate-400">: </span>}
          <span className="text-slate-500">{openBrace}</span>
          {!open && (
            <span className="text-slate-400 italic ml-1 text-xs">
              {entries.length} {entries.length === 1 ? 'item' : 'items'}
            </span>
          )}
          {!open && <span className="text-slate-500">{closeBrace}</span>}
          {!open && !isLast && <span className="text-slate-400">,</span>}
        </span>
      </div>
      {open && (
        <>
          {entries.map(([k, v]: [string | number, any], i: number) => (
            <JsonNode
              key={k}
              data={v}
              name={k}
              depth={depth + 1}
              isLast={i === entries.length - 1}
            />
          ))}
          <div style={indent} className="text-slate-500">
            {closeBrace}
            {!isLast && <span className="text-slate-400">,</span>}
          </div>
        </>
      )}
    </div>
  );
}

export default function JsonViewer() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('pretty');
  const [indent, setIndent] = useState(2);

  const parsed = useMemo(() => parseWithLocation(input), [input]);

  const formatted = useMemo(() => {
    if (parsed.error || parsed.data === undefined) return '';
    try {
      if (mode === 'minify') return JSON.stringify(parsed.data);
      return JSON.stringify(parsed.data, null, indent);
    } catch {
      return '';
    }
  }, [parsed, mode, indent]);

  const stats = useMemo(() => {
    if (parsed.error || parsed.data === undefined) return null;
    const minified = JSON.stringify(parsed.data);
    let keys = 0;
    let depth = 0;
    const walk = (v: any, d: number) => {
      depth = Math.max(depth, d);
      if (v && typeof v === 'object') {
        if (!Array.isArray(v)) keys += Object.keys(v).length;
        for (const child of Array.isArray(v) ? v : Object.values(v)) walk(child, d + 1);
      }
    };
    walk(parsed.data, 0);
    return {
      bytes: new Blob([minified]).size,
      minBytes: minified.length,
      keys,
      depth,
    };
  }, [parsed]);

  const isValid = !parsed.error && parsed.data !== undefined;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-1">
          {(['pretty', 'minify', 'tree'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                mode === m
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'pretty' ? 'Pretty' : m === 'minify' ? 'Minify' : 'Tree'}
            </button>
          ))}
        </div>

        {mode === 'pretty' && (
          <div className="inline-flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Indent</span>
            <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-1">
              {[2, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIndent(n)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    indent === n
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
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
      </div>

      {/* Status row */}
      <div className="flex flex-wrap items-center gap-2 -mt-2">
        {input.trim() && isValid && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Valid JSON
          </span>
        )}
        {input.trim() && parsed.error && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-red-50 text-red-700 border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Invalid JSON
            {parsed.errorLine && (
              <span className="opacity-80">
                · line {parsed.errorLine}, col {parsed.errorCol}
              </span>
            )}
          </span>
        )}
        {stats && (
          <>
            <span className="text-[11px] text-slate-500 font-medium px-2 py-1">
              {stats.bytes.toLocaleString()} bytes · {stats.keys} keys · depth {stats.depth}
            </span>
          </>
        )}
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-6">
        <ToolCard
          title="Input JSON"
          action={
            <span className="text-[11px] text-slate-400 font-medium">
              {input.length.toLocaleString()} chars
            </span>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here, e.g. {"hello": "world"}'
            className="w-full h-[32rem] lg:h-[44rem] xl:h-[calc(100vh-18rem)] xl:min-h-[42rem] px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
            spellCheck={false}
          />
          {parsed.error && (
            <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-2.5 font-mono">
              {parsed.error}
            </div>
          )}
        </ToolCard>

        <ToolCard
          title={mode === 'tree' ? 'Tree view' : mode === 'minify' ? 'Minified' : 'Pretty printed'}
          action={
            mode !== 'tree' ? (
              <CopyButton value={formatted} disabled={!formatted} />
            ) : null
          }
        >
          {!isValid ? (
            <div className="h-[32rem] lg:h-[44rem] xl:h-[calc(100vh-18rem)] xl:min-h-[42rem] flex items-center justify-center text-sm text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-md">
              {input.trim() ? 'Fix the JSON above to see output' : 'Paste JSON to see output here'}
            </div>
          ) : mode === 'tree' ? (
            <div className="h-[32rem] lg:h-[44rem] xl:h-[calc(100vh-18rem)] xl:min-h-[42rem] overflow-auto bg-slate-50 border border-slate-200 rounded-md p-4">
              <JsonNode data={parsed.data} depth={0} isLast />
            </div>
          ) : (
            <textarea
              value={formatted}
              readOnly
              className="w-full h-[32rem] lg:h-[44rem] xl:h-[calc(100vh-18rem)] xl:min-h-[42rem] px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-md resize-none text-slate-800"
              spellCheck={false}
            />
          )}
        </ToolCard>
      </div>
    </div>
  );
}
