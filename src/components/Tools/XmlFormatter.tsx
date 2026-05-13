import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

function formatXml(xml: string, indent: number): string {
  const INDENT = ' '.repeat(indent);
  let formatted = '';
  let depth = 0;
  const parts = xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean);

  for (const part of parts) {
    if (!part.trim()) continue;
    if (part.startsWith('</')) {
      depth = Math.max(0, depth - 1);
      formatted += INDENT.repeat(depth) + part + '\n';
    } else if (part.startsWith('<?') || part.startsWith('<!')) {
      formatted += INDENT.repeat(depth) + part + '\n';
    } else if (part.startsWith('<') && !part.endsWith('/>')) {
      formatted += INDENT.repeat(depth) + part + '\n';
      if (!part.match(/<[^/][^>]*\/>/)) depth++;
    } else if (part.startsWith('<') && part.endsWith('/>')) {
      formatted += INDENT.repeat(depth) + part + '\n';
    } else {
      formatted += INDENT.repeat(depth) + part.trim() + '\n';
    }
  }
  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
}

function validateXml(xml: string): string | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const error = doc.querySelector('parsererror');
    if (error) return error.textContent ?? 'Invalid XML';
    return null;
  } catch {
    return 'Could not parse XML';
  }
}

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><price>44.95</price></book>
  <book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><price>5.95</price></book>
</catalog>`;

export default function XmlFormatter() {
  const [input, setInput] = useState(SAMPLE.replace(/\n\s*/g, ''));
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format');
  const [indentSize, setIndentSize] = useState(2);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: '', error: null };
    if (mode === 'validate') {
      const err = validateXml(input);
      return { output: err ? '' : 'Valid XML ✓', error: err };
    }
    const validationError = validateXml(input);
    if (validationError) return { output: '', error: validationError };
    const out = mode === 'format' ? formatXml(input, indentSize) : minifyXml(input);
    return { output: out, error: null };
  }, [input, mode, indentSize]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {(['format', 'minify', 'validate'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors capitalize ${mode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {m}
            </button>
          ))}
        </div>
        {mode === 'format' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Indent:</label>
            <div className="flex gap-1">
              {[2, 4].map((n) => (
                <button key={n} onClick={() => setIndentSize(n)} className={`px-2 py-1 text-xs rounded border font-mono ${indentSize === n ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600'}`}>{n}</button>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => setInput(SAMPLE.replace(/\n\s*/g, ''))} className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-400 transition-colors">
          Sample
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ToolCard title="XML Input" action={<CopyButton value={input} disabled={!input} />}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste XML here…"
            className={`w-full h-72 lg:h-96 px-4 py-3 text-[13px] sm:text-sm font-mono rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none ${
              error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
            }`}
          />
          {error && <p className="text-xs text-red-600 mt-2 font-mono">{error}</p>}
        </ToolCard>

        <ToolCard title="Output" action={<CopyButton value={output} disabled={!output} />}>
          <pre className={`h-72 lg:h-96 px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap break-all overflow-auto ${mode === 'validate' && !error ? 'text-emerald-700 font-semibold' : 'text-slate-800'}`}>
            {output || <span className="text-slate-400">Output will appear here…</span>}
          </pre>
        </ToolCard>
      </div>
    </div>
  );
}
