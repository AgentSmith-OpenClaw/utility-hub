import React, { useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Version = 'v4' | 'v7' | 'nil';

function uuidV4(): string {
  // Prefer crypto.randomUUID when available (modern browsers)
  const c = crypto as Crypto & { randomUUID?: () => string };
  if (typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  // Fallback using crypto.getRandomValues
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function uuidV7(): string {
  // UUID v7: 48-bit timestamp (ms) + version + random + variant + random
  // Date.now() fits in 48 bits until year 10889, so plain Number arithmetic is safe.
  const ms = Date.now();
  const bytes = new Uint8Array(16);
  // Split timestamp into high 16 bits and low 32 bits
  const high = Math.floor(ms / 0x100000000); // upper 16 bits of the 48
  const low = ms >>> 0;                       // lower 32 bits, unsigned
  bytes[0] = (high >>> 8) & 0xff;
  bytes[1] = high & 0xff;
  bytes[2] = (low >>> 24) & 0xff;
  bytes[3] = (low >>> 16) & 0xff;
  bytes[4] = (low >>> 8) & 0xff;
  bytes[5] = low & 0xff;
  // Random for bytes 6..15
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  for (let i = 0; i < 10; i++) bytes[6 + i] = rand[i];
  // Version 7
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Variant 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function uuidNil(): string {
  return '00000000-0000-0000-0000-000000000000';
}

function generate(version: Version, count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    if (version === 'v4') out.push(uuidV4());
    else if (version === 'v7') out.push(uuidV7());
    else out.push(uuidNil());
  }
  return out;
}

export default function UuidGenerator() {
  const [version, setVersion] = useState<Version>('v4');
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [removeDashes, setRemoveDashes] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => generate('v4', 10));

  const regenerate = () => setUuids(generate(version, count));

  const transform = (id: string) => {
    let out = id;
    if (uppercase) out = out.toUpperCase();
    if (removeDashes) out = out.replace(/-/g, '');
    return out;
  };

  const allText = uuids.map(transform).join('\n');

  return (
    <div className="space-y-5">
      <ToolCard title="Options">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Version
            </label>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 w-full">
              {(['v4', 'v7', 'nil'] as Version[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVersion(v)}
                  className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-all uppercase ${
                    version === v ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {v === 'v4' ? 'UUID v4' : v === 'v7' ? 'UUID v7' : 'Nil'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {version === 'v4' && 'Random — 122 bits of entropy.'}
              {version === 'v7' && 'Time-ordered — sortable by creation time.'}
              {version === 'nil' && 'All zeros — placeholder/empty value.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Count: {count}
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Uppercase
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={removeDashes}
                onChange={(e) => setRemoveDashes(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Remove dashes
            </label>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={regenerate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate {count}
            </button>
          </div>
        </div>
      </ToolCard>

      <ToolCard
        title={`${uuids.length} UUID${uuids.length === 1 ? '' : 's'}`}
        action={<CopyButton value={allText} label="Copy all" disabled={!uuids.length} />}
      >
        <div className="space-y-1.5 max-h-96 overflow-auto">
          {uuids.map((id, i) => {
            const display = transform(id);
            return (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-sm font-mono group"
              >
                <span className="text-[10px] text-slate-400 w-8 flex-shrink-0">{i + 1}</span>
                <code className="flex-1 text-slate-800 break-all">{display}</code>
                <CopyButton value={display} />
              </div>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}
