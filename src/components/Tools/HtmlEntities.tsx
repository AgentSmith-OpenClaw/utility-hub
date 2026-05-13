import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Mode = 'encode' | 'decode';
type Style = 'named' | 'numeric' | 'hex';

const NAMED: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  ' ': '&nbsp;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '¢': '&cent;',
  '×': '&times;',
  '÷': '&divide;',
  '±': '&plusmn;',
  '°': '&deg;',
  '…': '&hellip;',
  '—': '&mdash;',
  '–': '&ndash;',
  '“': '&ldquo;',
  '”': '&rdquo;',
  '‘': '&lsquo;',
  '’': '&rsquo;',
  '«': '&laquo;',
  '»': '&raquo;',
  '§': '&sect;',
  '¶': '&para;',
  '•': '&bull;',
  '←': '&larr;',
  '→': '&rarr;',
  '↑': '&uarr;',
  '↓': '&darr;',
  '↔': '&harr;',
  '∞': '&infin;',
  '√': '&radic;',
  '≈': '&asymp;',
  '≠': '&ne;',
  '≤': '&le;',
  '≥': '&ge;',
};

const REVERSE_NAMED: Record<string, string> = Object.fromEntries(
  Object.entries(NAMED).map(([k, v]) => [v, k]),
);

function encode(input: string, style: Style, encodeAll: boolean): string {
  let out = '';
  for (const ch of input) {
    const code = ch.codePointAt(0)!;
    const isAscii = code < 128;
    const needsEncoding = !isAscii || ['&', '<', '>', '"', "'"].includes(ch);
    if (!encodeAll && !needsEncoding) {
      out += ch;
      continue;
    }
    if (style === 'named' && NAMED[ch]) {
      out += NAMED[ch];
    } else if (style === 'hex') {
      out += `&#x${code.toString(16).toUpperCase()};`;
    } else {
      out += `&#${code};`;
    }
  }
  return out;
}

function decode(input: string): string {
  let out = input;
  // Replace named entities
  out = out.replace(/&[a-zA-Z]+;/g, (m) => REVERSE_NAMED[m] ?? m);
  // Replace hex numeric: &#xNN; or &#xNNNN;
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => {
    const cp = parseInt(h, 16);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
  });
  // Replace decimal numeric: &#NNNN;
  out = out.replace(/&#(\d+);/g, (_, n) => {
    const cp = parseInt(n, 10);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
  });
  return out;
}

export default function HtmlEntities() {
  const [mode, setMode] = useState<Mode>('encode');
  const [style, setStyle] = useState<Style>('named');
  const [encodeAll, setEncodeAll] = useState(false);
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    if (!input) return '';
    return mode === 'encode' ? encode(input, style, encodeAll) : decode(input);
  }, [mode, style, encodeAll, input]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all uppercase ${
                mode === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {mode === 'encode' && (
          <>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(['named', 'numeric', 'hex'] as Style[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all uppercase ${
                    style === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={encodeAll}
                onChange={(e) => setEncodeAll(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Encode all chars
            </label>
          </>
        )}
        <button
          type="button"
          onClick={() => setInput(mode === 'encode' ? '<p>Hello & welcome — café "résumé"</p>' : '&lt;p&gt;Hello &amp; welcome &mdash; caf&eacute;&lt;/p&gt;')}
          className="ml-auto text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-50"
        >
          Load sample
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ToolCard title="Input" action={<span className="text-[11px] text-slate-400 font-medium">{input.length} chars</span>}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Paste raw text…' : 'Paste HTML-encoded text…'}
            spellCheck={false}
            className="w-full h-72 lg:h-96 px-4 py-3 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          />
        </ToolCard>

        <ToolCard title="Output" action={<CopyButton value={output} disabled={!output} />}>
          <pre className="h-72 lg:h-96 px-4 py-3 text-[13px] sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap break-all overflow-auto">
            {output || <span className="text-slate-400">Output will appear here…</span>}
          </pre>
        </ToolCard>
      </div>
    </div>
  );
}
