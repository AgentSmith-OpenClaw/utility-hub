import React, { useState, useEffect } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const HASHES = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

function md5(input: string): string {
  // Lightweight MD5 implementation for browser. RFC 1321.
  // Returns hex string.
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function rol(n: number, c: number) {
    return (n << c) | (n >>> (32 - c));
  }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(rol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function bytesToWords(bytes: Uint8Array) {
    const words: number[] = new Array(Math.ceil(bytes.length / 4)).fill(0);
    for (let i = 0; i < bytes.length; i++) {
      words[i >> 2] |= bytes[i] << ((i % 4) * 8);
    }
    return words;
  }
  const bytes = new TextEncoder().encode(input);
  const len = bytes.length * 8;
  const words = bytesToWords(bytes);
  // Pad
  words[len >> 5] |= 0x80 << (len % 32);
  words[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < words.length; i += 16) {
    const olda = a,
      oldb = b,
      oldc = c,
      oldd = d;

    a = ff(a, b, c, d, words[i + 0] | 0, 7, -680876936);
    d = ff(d, a, b, c, words[i + 1] | 0, 12, -389564586);
    c = ff(c, d, a, b, words[i + 2] | 0, 17, 606105819);
    b = ff(b, c, d, a, words[i + 3] | 0, 22, -1044525330);
    a = ff(a, b, c, d, words[i + 4] | 0, 7, -176418897);
    d = ff(d, a, b, c, words[i + 5] | 0, 12, 1200080426);
    c = ff(c, d, a, b, words[i + 6] | 0, 17, -1473231341);
    b = ff(b, c, d, a, words[i + 7] | 0, 22, -45705983);
    a = ff(a, b, c, d, words[i + 8] | 0, 7, 1770035416);
    d = ff(d, a, b, c, words[i + 9] | 0, 12, -1958414417);
    c = ff(c, d, a, b, words[i + 10] | 0, 17, -42063);
    b = ff(b, c, d, a, words[i + 11] | 0, 22, -1990404162);
    a = ff(a, b, c, d, words[i + 12] | 0, 7, 1804603682);
    d = ff(d, a, b, c, words[i + 13] | 0, 12, -40341101);
    c = ff(c, d, a, b, words[i + 14] | 0, 17, -1502002290);
    b = ff(b, c, d, a, words[i + 15] | 0, 22, 1236535329);

    a = gg(a, b, c, d, words[i + 1] | 0, 5, -165796510);
    d = gg(d, a, b, c, words[i + 6] | 0, 9, -1069501632);
    c = gg(c, d, a, b, words[i + 11] | 0, 14, 643717713);
    b = gg(b, c, d, a, words[i + 0] | 0, 20, -373897302);
    a = gg(a, b, c, d, words[i + 5] | 0, 5, -701558691);
    d = gg(d, a, b, c, words[i + 10] | 0, 9, 38016083);
    c = gg(c, d, a, b, words[i + 15] | 0, 14, -660478335);
    b = gg(b, c, d, a, words[i + 4] | 0, 20, -405537848);
    a = gg(a, b, c, d, words[i + 9] | 0, 5, 568446438);
    d = gg(d, a, b, c, words[i + 14] | 0, 9, -1019803690);
    c = gg(c, d, a, b, words[i + 3] | 0, 14, -187363961);
    b = gg(b, c, d, a, words[i + 8] | 0, 20, 1163531501);
    a = gg(a, b, c, d, words[i + 13] | 0, 5, -1444681467);
    d = gg(d, a, b, c, words[i + 2] | 0, 9, -51403784);
    c = gg(c, d, a, b, words[i + 7] | 0, 14, 1735328473);
    b = gg(b, c, d, a, words[i + 12] | 0, 20, -1926607734);

    a = hh(a, b, c, d, words[i + 5] | 0, 4, -378558);
    d = hh(d, a, b, c, words[i + 8] | 0, 11, -2022574463);
    c = hh(c, d, a, b, words[i + 11] | 0, 16, 1839030562);
    b = hh(b, c, d, a, words[i + 14] | 0, 23, -35309556);
    a = hh(a, b, c, d, words[i + 1] | 0, 4, -1530992060);
    d = hh(d, a, b, c, words[i + 4] | 0, 11, 1272893353);
    c = hh(c, d, a, b, words[i + 7] | 0, 16, -155497632);
    b = hh(b, c, d, a, words[i + 10] | 0, 23, -1094730640);
    a = hh(a, b, c, d, words[i + 13] | 0, 4, 681279174);
    d = hh(d, a, b, c, words[i + 0] | 0, 11, -358537222);
    c = hh(c, d, a, b, words[i + 3] | 0, 16, -722521979);
    b = hh(b, c, d, a, words[i + 6] | 0, 23, 76029189);
    a = hh(a, b, c, d, words[i + 9] | 0, 4, -640364487);
    d = hh(d, a, b, c, words[i + 12] | 0, 11, -421815835);
    c = hh(c, d, a, b, words[i + 15] | 0, 16, 530742520);
    b = hh(b, c, d, a, words[i + 2] | 0, 23, -995338651);

    a = ii(a, b, c, d, words[i + 0] | 0, 6, -198630844);
    d = ii(d, a, b, c, words[i + 7] | 0, 10, 1126891415);
    c = ii(c, d, a, b, words[i + 14] | 0, 15, -1416354905);
    b = ii(b, c, d, a, words[i + 5] | 0, 21, -57434055);
    a = ii(a, b, c, d, words[i + 12] | 0, 6, 1700485571);
    d = ii(d, a, b, c, words[i + 3] | 0, 10, -1894986606);
    c = ii(c, d, a, b, words[i + 10] | 0, 15, -1051523);
    b = ii(b, c, d, a, words[i + 1] | 0, 21, -2054922799);
    a = ii(a, b, c, d, words[i + 8] | 0, 6, 1873313359);
    d = ii(d, a, b, c, words[i + 15] | 0, 10, -30611744);
    c = ii(c, d, a, b, words[i + 6] | 0, 15, -1560198380);
    b = ii(b, c, d, a, words[i + 13] | 0, 21, 1309151649);
    a = ii(a, b, c, d, words[i + 4] | 0, 6, -145523070);
    d = ii(d, a, b, c, words[i + 11] | 0, 10, -1120210379);
    c = ii(c, d, a, b, words[i + 2] | 0, 15, 718787259);
    b = ii(b, c, d, a, words[i + 9] | 0, 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  function toHex(n: number) {
    let s = '';
    for (let j = 0; j < 4; j++) {
      s += ((n >> (j * 8 + 4)) & 0x0f).toString(16) + ((n >> (j * 8)) & 0x0f).toString(16);
    }
    return s;
  }
  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

async function subtleHash(text: string, algo: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [uppercase, setUppercase] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!input) {
        setHashes({});
        return;
      }
      try {
        const md5Result = md5(input);
        const others = await Promise.all(HASHES.map((h) => subtleHash(input, h)));
        if (cancelled) return;
        const next: Record<string, string> = { MD5: md5Result };
        HASHES.forEach((h, i) => {
          next[h] = others[i];
        });
        setHashes(next);
      } catch (e) {
        if (!cancelled) setHashes({});
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [input]);

  const display = (v: string) => (uppercase ? v.toUpperCase() : v);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Uppercase output
        </label>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInput('Hello, Toolisk!')}
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

      <ToolCard
        title="Input"
        action={<span className="text-[11px] text-slate-400 font-medium">{input.length} chars</span>}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste anything to hash…"
          className="w-full h-40 px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
          spellCheck={false}
        />
      </ToolCard>

      <div className="space-y-2">
        {(['MD5', ...HASHES] as const).map((algo) => (
          <ToolCard key={algo}>
            <div className="flex items-start gap-3">
              <span
                className={`text-xs font-bold uppercase tracking-wider w-20 flex-shrink-0 pt-1 ${
                  algo === 'MD5' || algo === 'SHA-1' ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {algo}
              </span>
              <code className="flex-1 text-xs sm:text-sm font-mono text-slate-700 break-all">
                {hashes[algo] ? display(hashes[algo]) : <span className="text-slate-300">—</span>}
              </code>
              <CopyButton value={hashes[algo] ? display(hashes[algo]) : ''} disabled={!hashes[algo]} />
            </div>
          </ToolCard>
        ))}
      </div>

      <ToolCard title="Security note">
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>MD5</strong> and <strong>SHA-1</strong> are <em>cryptographically broken</em> — collisions can be
          generated, so they should never be used for password storage, digital signatures, or content integrity in
          adversarial settings. They remain useful for non-security tasks like deduplication and checksums where
          accidental corruption is the only concern. For passwords, use <strong>Argon2</strong>, <strong>bcrypt</strong>,
          or <strong>scrypt</strong>. For integrity and signatures, prefer <strong>SHA-256</strong> or higher.
        </p>
      </ToolCard>
    </div>
  );
}
