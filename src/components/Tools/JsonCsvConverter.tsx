import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

function jsonToCsv(json: string, delimiter: string): string {
  const data = JSON.parse(json);
  const arr: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '';
  const allKeys = arr.flatMap(row => Object.keys(row));
  const headers = allKeys.filter((k, i) => allKeys.indexOf(k) === i);
  const escape = (val: unknown) => {
    const str = val === null || val === undefined ? '' : typeof val === 'object' ? JSON.stringify(val) : String(val);
    return str.includes(delimiter) || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
  };
  return [headers.map(escape).join(delimiter), ...arr.map(row => headers.map(h => escape(row[h])).join(delimiter))].join('\n');
}

function csvToJson(csv: string, delimiter: string): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return '[]';
  const parseRow = (line: string): string[] => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        fields.push(current); current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current);
    return fields;
  };
  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = parseRow(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
  return JSON.stringify(rows, null, 2);
}

const SAMPLE_JSON = JSON.stringify([
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 25 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
], null, 2);

const SAMPLE_CSV = `id,name,email,age
1,Alice,alice@example.com,30
2,Bob,bob@example.com,25
3,Charlie,charlie@example.com,35`;

export default function JsonCsvConverter() {
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [input, setInput] = useState(SAMPLE_JSON);
  const [delimiter, setDelimiter] = useState(',');

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null };
    try {
      const out = mode === 'json-to-csv' ? jsonToCsv(input, delimiter) : csvToJson(input, delimiter);
      return { output: out, error: null };
    } catch (e) {
      return { output: '', error: (e as Error).message };
    }
  }, [input, mode, delimiter]);

  const rowCount = useMemo(() => {
    if (!output) return 0;
    if (mode === 'json-to-csv') return output.split('\n').length - 1;
    try { const arr = JSON.parse(output); return Array.isArray(arr) ? arr.length : 1; } catch { return 0; }
  }, [output, mode]);

  const downloadFile = () => {
    if (!output) return;
    const ext = mode === 'json-to-csv' ? 'csv' : 'json';
    const mime = mode === 'json-to-csv' ? 'text/csv' : 'application/json';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `converted.${ext}`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {([['json-to-csv', 'JSON → CSV'], ['csv-to-json', 'CSV → JSON']] as const).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setInput(m === 'json-to-csv' ? SAMPLE_JSON : SAMPLE_CSV); }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${mode === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Delimiter</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {[',', ';', '\t', '|'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDelimiter(d)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all font-mono ${delimiter === d ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {d === '\t' ? 'tab' : d === ',' ? 'comma' : d === ';' ? 'semi' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ToolCard title={mode === 'json-to-csv' ? 'JSON Input' : 'CSV Input'} action={<CopyButton value={input} disabled={!input} />}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full h-80 lg:h-[28rem] px-4 py-3 text-[13px] sm:text-sm font-mono rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            placeholder={mode === 'json-to-csv' ? 'Paste JSON array of objects…' : 'Paste CSV data…'}
          />
          {error && <p className="text-xs text-red-600 mt-2 font-mono">{error}</p>}
        </ToolCard>

        <ToolCard title={`${mode === 'json-to-csv' ? 'CSV' : 'JSON'} Output${rowCount > 0 ? ` · ${rowCount} rows` : ''}`} action={
          <div className="flex gap-2">
            <button onClick={downloadFile} disabled={!output} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <CopyButton value={output} disabled={!output} />
          </div>
        }>
          <pre className="h-80 lg:h-[28rem] px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap break-all overflow-auto">
            {output || <span className="text-slate-400">Output will appear here…</span>}
          </pre>
        </ToolCard>
      </div>
    </div>
  );
}
