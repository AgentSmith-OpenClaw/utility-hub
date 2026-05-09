import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Direction = 'json2yaml' | 'yaml2json';

const SAMPLE_JSON = `{
  "name": "toolisk",
  "version": "1.0.0",
  "tags": ["dev", "free", "tools"],
  "config": {
    "port": 3000,
    "debug": true,
    "features": null
  },
  "tools": [
    { "id": 1, "name": "JSON viewer" },
    { "id": 2, "name": "Cron parser" }
  ]
}`;

const SAMPLE_YAML = `name: toolisk
version: 1.0.0
tags:
  - dev
  - free
  - tools
config:
  port: 3000
  debug: true
  features: null
tools:
  - id: 1
    name: JSON viewer
  - id: 2
    name: Cron parser
`;

function jsonToYaml(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value === '' || /[:#&*!|>'"%@`,\[\]{}\n]/.test(value) || /^\s|\s$/.test(value) || /^(true|false|null|yes|no|on|off|~)$/i.test(value) || /^-?\d/.test(value)) {
      return JSON.stringify(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((item) => {
        const formatted = jsonToYaml(item, indent + 1);
        if (typeof item === 'object' && item !== null && !Array.isArray(item) && Object.keys(item).length > 0) {
          // Inline first key on dash, rest indented
          const lines = formatted.split('\n');
          return `${pad}- ${lines[0].trim()}\n${lines.slice(1).map((l) => '  ' + l).join('\n')}`.replace(/\n$/, '');
        }
        return `${pad}- ${formatted.replace(/\n/g, `\n  ${pad}`)}`;
      })
      .join('\n');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const entries = Object.entries(obj);
    if (!entries.length) return '{}';
    return entries
      .map(([k, v]) => {
        const isComplex = (typeof v === 'object' && v !== null && (!Array.isArray(v) || v.length > 0));
        if (isComplex) {
          return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
        }
        return `${pad}${k}: ${jsonToYaml(v, indent + 1)}`;
      })
      .join('\n');
  }
  return String(value);
}

function parseYamlScalar(s: string): unknown {
  const t = s.trim();
  if (t === 'null' || t === '~' || t === '') return null;
  if (t === 'true' || t === 'yes' || t === 'on') return true;
  if (t === 'false' || t === 'no' || t === 'off') return false;
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  const num = Number(t);
  if (!Number.isNaN(num) && /^-?\d+(\.\d+)?$/.test(t)) return num;
  return t;
}

interface YamlLine {
  indent: number;
  raw: string;
  isItem: boolean;
}

function preProcess(yaml: string): YamlLine[] {
  const lines: YamlLine[] = [];
  for (const rawLine of yaml.split('\n')) {
    // Strip comments (not inside strings — simple)
    const noComment = rawLine.replace(/\s+#.*$/, '');
    if (!noComment.trim()) continue;
    const indentMatch = /^(\s*)/.exec(noComment);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const trimmed = noComment.trimStart();
    lines.push({ indent, raw: trimmed, isItem: trimmed.startsWith('- ') || trimmed === '-' });
  }
  return lines;
}

function yamlToJson(yaml: string): unknown {
  const lines = preProcess(yaml);
  let i = 0;

  function parseValue(indent: number): unknown {
    if (i >= lines.length) return null;
    const first = lines[i];
    if (first.indent < indent) return null;

    if (first.isItem) {
      // Array
      const arr: unknown[] = [];
      while (i < lines.length && lines[i].indent === indent && lines[i].isItem) {
        const itemLine = lines[i];
        const after = itemLine.raw === '-' ? '' : itemLine.raw.slice(2).trimEnd();
        i++;
        if (!after) {
          arr.push(parseValue(indent + 2));
        } else if (/^[^:]+:(\s|$)/.test(after) && !after.startsWith('"') && !after.startsWith("'")) {
          // Inline first key, treat as object starting at this depth
          // Re-inject as a map line
          const fakeLine: YamlLine = { indent: indent + 2, raw: after, isItem: false };
          lines.splice(i, 0, fakeLine);
          arr.push(parseValue(indent + 2));
        } else {
          arr.push(parseYamlScalar(after));
        }
      }
      return arr;
    }

    // Object
    const obj: Record<string, unknown> = {};
    while (i < lines.length && lines[i].indent === indent && !lines[i].isItem) {
      const line = lines[i];
      const colonIdx = line.raw.indexOf(':');
      if (colonIdx < 0) {
        i++;
        continue;
      }
      const key = line.raw.slice(0, colonIdx).trim();
      const after = line.raw.slice(colonIdx + 1).trim();
      i++;
      if (!after) {
        obj[key] = parseValue(indent + 2);
      } else if (after === '[]') {
        obj[key] = [];
      } else if (after === '{}') {
        obj[key] = {};
      } else {
        obj[key] = parseYamlScalar(after);
      }
    }
    return obj;
  }

  return parseValue(0);
}

export default function YamlJsonConverter() {
  const [direction, setDirection] = useState<Direction>('json2yaml');
  const [input, setInput] = useState(SAMPLE_JSON);

  const result = useMemo(() => {
    try {
      if (!input.trim()) return { ok: true as const, output: '' };
      if (direction === 'json2yaml') {
        const parsed = JSON.parse(input);
        return { ok: true as const, output: jsonToYaml(parsed) };
      }
      const parsed = yamlToJson(input);
      return { ok: true as const, output: JSON.stringify(parsed, null, 2) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : 'Conversion failed' };
    }
  }, [direction, input]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['json2yaml', 'yaml2json'] as Direction[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDirection(d);
                setInput(d === 'json2yaml' ? SAMPLE_JSON : SAMPLE_YAML);
              }}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                direction === d ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {d === 'json2yaml' ? 'JSON → YAML' : 'YAML → JSON'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setInput(direction === 'json2yaml' ? SAMPLE_JSON : SAMPLE_YAML)}
          className="ml-auto text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={() => setInput('')}
          disabled={!input}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100 disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ToolCard
          title={direction === 'json2yaml' ? 'JSON input' : 'YAML input'}
          action={<CopyButton value={input} disabled={!input} />}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="w-full h-[55vh] px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
        </ToolCard>
        <ToolCard
          title={direction === 'json2yaml' ? 'YAML output' : 'JSON output'}
          action={result.ok ? <CopyButton value={result.output} disabled={!result.output} /> : null}
        >
          {result.ok ? (
            <pre className="text-sm font-mono text-slate-800 whitespace-pre overflow-auto h-[55vh] px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              {result.output || <span className="text-slate-400">—</span>}
            </pre>
          ) : (
            <div className="h-[55vh] flex items-center justify-center bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm text-rose-700">
              {result.error}
            </div>
          )}
        </ToolCard>
      </div>

      <p className="text-[11px] text-slate-400 px-2">
        YAML parser supports common subset: maps, lists, scalars, comments, nesting. Anchors/aliases, multiline string types, and complex flow-style are not supported.
      </p>
    </div>
  );
}
