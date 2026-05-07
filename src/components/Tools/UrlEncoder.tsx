import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Mode = 'encode' | 'decode';
type Variant = 'component' | 'full';

const SAMPLE = 'https://toolisk.com/search?q=hello world&lang=en&tags=dev,tools';
const SAMPLE_ENCODED = 'https%3A%2F%2Ftoolisk.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den%26tags%3Ddev%2Ctools';

export default function UrlEncoder() {
  const [mode, setMode] = useState<Mode>('encode');
  const [variant, setVariant] = useState<Variant>('component');
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      if (mode === 'encode') {
        return {
          output: variant === 'component' ? encodeURIComponent(input) : encodeURI(input),
          error: '',
        };
      }
      return {
        output: variant === 'component' ? decodeURIComponent(input) : decodeURI(input),
        error: '',
      };
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : 'Failed to process input' };
    }
  }, [input, mode, variant]);

  const swap = () => {
    if (!output) return;
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mode === m
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'encode' ? 'Encode' : 'Decode'}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['component', 'full'] as Variant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                variant === v
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title={
                v === 'component'
                  ? 'encodeURIComponent — encodes everything except A-Z a-z 0-9 - _ . ~'
                  : 'encodeURI — preserves URL structural characters like / : ? & ='
              }
            >
              {v === 'component' ? 'Component' : 'Full URL'}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setInput(mode === 'encode' ? SAMPLE : SAMPLE_ENCODED)
            }
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

      {/* Input/Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolCard
          title={mode === 'encode' ? 'Plain text' : 'Encoded text'}
          action={
            <span className="text-[11px] text-slate-400 font-medium">
              {input.length} {input.length === 1 ? 'char' : 'chars'}
            </span>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Paste text or a URL to encode…'
                : 'Paste an encoded URL to decode…'
            }
            className="w-full h-56 sm:h-64 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
            spellCheck={false}
          />
        </ToolCard>

        <ToolCard
          title={mode === 'encode' ? 'Encoded' : 'Decoded'}
          action={
            <>
              <button
                type="button"
                onClick={swap}
                disabled={!output}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Swap output back to input"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Swap
              </button>
              <CopyButton value={output} disabled={!output} />
            </>
          }
        >
          {error ? (
            <div className="h-56 sm:h-64 flex items-center justify-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-4">
              <div>
                <div className="font-semibold mb-1">Decoding error</div>
                <div className="text-xs">{error}</div>
              </div>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here…"
              className="w-full h-56 sm:h-64 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none text-slate-800"
              spellCheck={false}
            />
          )}
        </ToolCard>
      </div>

      {/* Reference */}
      <ToolCard title="Reference">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-slate-800 mb-1">encodeURIComponent</div>
            <p className="text-slate-600 leading-relaxed">
              Encodes every character except <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">A-Z a-z 0-9 - _ . ~</code>. Use it for query string values and path segments.
            </p>
          </div>
          <div>
            <div className="font-semibold text-slate-800 mb-1">encodeURI</div>
            <p className="text-slate-600 leading-relaxed">
              Preserves URL structural characters like <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/ : ? &amp; = #</code>. Use it on a complete URL when you only want to escape spaces and unicode.
            </p>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
