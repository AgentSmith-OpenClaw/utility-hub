import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Mode = 'encode' | 'decode';
type Variant = 'standard' | 'urlsafe';

const SAMPLE = 'Hello, Toolisk! 🚀 Encode anything safely.';

function utf8Encode(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromUrlSafe(b64: string): string {
  let s = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4 !== 0) s += '=';
  return s;
}

export default function Base64Encoder() {
  const [mode, setMode] = useState<Mode>('encode');
  const [variant, setVariant] = useState<Variant>('standard');
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      if (mode === 'encode') {
        const b64 = bytesToBase64(utf8Encode(input));
        return { output: variant === 'urlsafe' ? toUrlSafe(b64) : b64, error: '' };
      }
      const normalized = variant === 'urlsafe' ? fromUrlSafe(input.trim()) : input.trim();
      return { output: utf8Decode(base64ToBytes(normalized)), error: '' };
    } catch (e) {
      return {
        output: '',
        error:
          e instanceof Error
            ? e.message.includes('atob')
              ? 'Input is not valid Base64'
              : e.message
            : 'Failed to process input',
      };
    }
  }, [input, mode, variant]);

  const swap = () => {
    if (!output) return;
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all capitalize ${
                mode === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['standard', 'urlsafe'] as Variant[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                variant === v ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
              title={
                v === 'standard'
                  ? 'Standard Base64 (uses + / =)'
                  : 'URL-safe Base64 (uses - _ and drops padding)'
              }
            >
              {v === 'standard' ? 'Standard' : 'URL-Safe'}
            </button>
          ))}
        </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ToolCard
          title={mode === 'encode' ? 'Plain text' : 'Base64 input'}
          action={<span className="text-[11px] text-slate-400 font-medium">{input.length} chars</span>}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste text…' : 'Paste a Base64 string…'}
            className="w-full h-72 sm:h-96 lg:h-[38rem] px-3 py-2.5 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
            spellCheck={false}
          />
        </ToolCard>

        <ToolCard
          title={mode === 'encode' ? 'Base64' : 'Plain text'}
          action={
            <>
              <button
                type="button"
                onClick={swap}
                disabled={!output}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
            <div className="h-72 sm:h-96 lg:h-[38rem] flex items-center justify-center text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-4">
              <div>
                <div className="font-semibold mb-1">Error</div>
                <div className="text-xs">{error}</div>
              </div>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here…"
              className="w-full h-72 sm:h-96 lg:h-[38rem] px-3 py-2.5 text-[13px] sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none text-slate-800"
              spellCheck={false}
            />
          )}
        </ToolCard>
      </div>

      <ToolCard title="What is Base64?">
        <p className="text-sm text-slate-600 leading-relaxed">
          Base64 encodes binary data using 64 ASCII characters, expanding the size by roughly 33%. It is widely used in
          email attachments (MIME), inline images (data URLs), JSON Web Tokens, and HTTP Basic auth headers — anywhere
          binary needs to travel through a text-only channel. <strong>URL-safe Base64</strong> swaps <code>+</code> and{' '}
          <code>/</code> for <code>-</code> and <code>_</code> so the output can be placed directly into URLs without
          further encoding.
        </p>
      </ToolCard>
    </div>
  );
}
