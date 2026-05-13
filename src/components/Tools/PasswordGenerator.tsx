import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/';
const AMBIGUOUS = /[O0Il1|`'"\\]/g;

type Strength = { label: string; pct: number; tone: string; entropy: number };

function entropyBits(length: number, poolSize: number) {
  if (length <= 0 || poolSize <= 0) return 0;
  return length * Math.log2(poolSize);
}

function classifyEntropy(bits: number): Strength {
  if (bits < 36) return { label: 'Very weak', pct: 15, tone: 'bg-rose-500 text-rose-600', entropy: bits };
  if (bits < 60) return { label: 'Weak', pct: 35, tone: 'bg-orange-500 text-orange-600', entropy: bits };
  if (bits < 80) return { label: 'Fair', pct: 60, tone: 'bg-amber-500 text-amber-600', entropy: bits };
  if (bits < 100) return { label: 'Strong', pct: 85, tone: 'bg-emerald-500 text-emerald-600', entropy: bits };
  return { label: 'Very strong', pct: 100, tone: 'bg-emerald-600 text-emerald-700', entropy: bits };
}

function randomChar(pool: string): string {
  const idx = crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
  return pool[idx];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPool(opts: {
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}) {
  let pool = '';
  if (opts.lower) pool += LOWER;
  if (opts.upper) pool += UPPER;
  if (opts.digits) pool += DIGITS;
  if (opts.symbols) pool += SYMBOLS;
  if (opts.excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  return pool;
}

function generate(length: number, opts: {
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}) {
  const pool = buildPool(opts);
  if (!pool) return '';
  // Ensure at least one of each selected category
  const required: string[] = [];
  if (opts.lower) required.push(randomChar(opts.excludeAmbiguous ? LOWER.replace(AMBIGUOUS, '') : LOWER));
  if (opts.upper) required.push(randomChar(opts.excludeAmbiguous ? UPPER.replace(AMBIGUOUS, '') : UPPER));
  if (opts.digits) required.push(randomChar(opts.excludeAmbiguous ? DIGITS.replace(AMBIGUOUS, '') : DIGITS));
  if (opts.symbols) required.push(randomChar(opts.excludeAmbiguous ? SYMBOLS.replace(AMBIGUOUS, '') : SYMBOLS));
  const remaining = Math.max(length - required.length, 0);
  const rest = Array.from({ length: remaining }, () => randomChar(pool));
  return shuffle([...required, ...rest]).join('');
}

const PASSPHRASE_WORDS = [
  'apple', 'orbit', 'amber', 'cobra', 'maple', 'tundra', 'novae', 'salty',
  'forge', 'pixel', 'glint', 'koala', 'velvet', 'banjo', 'echoes', 'lunar',
  'comet', 'pearl', 'bramble', 'whisk', 'thrive', 'embers', 'haven', 'cargo',
  'mosaic', 'piano', 'ledger', 'breeze', 'stout', 'falcon', 'opal', 'rookie',
  'crisp', 'silo', 'jolly', 'kayak', 'plume', 'rune', 'topaz', 'wreath',
  'aspen', 'clove', 'dune', 'glacier', 'hatch', 'iris', 'jasper', 'larch',
  'meadow', 'nimbus', 'onyx', 'prairie', 'quartz', 'ridge', 'spruce', 'tide',
  'umber', 'volt', 'willow', 'xenon', 'yarn', 'zenith', 'arrow', 'bison',
];

function generatePassphrase(words: number, separator: string, capitalize: boolean, addNumber: boolean) {
  const out: string[] = [];
  for (let i = 0; i < words; i++) {
    const idx = crypto.getRandomValues(new Uint32Array(1))[0] % PASSPHRASE_WORDS.length;
    let w = PASSPHRASE_WORDS[idx];
    if (capitalize) w = w[0].toUpperCase() + w.slice(1);
    out.push(w);
  }
  let result = out.join(separator);
  if (addNumber) {
    const num = crypto.getRandomValues(new Uint32Array(1))[0] % 100;
    result += separator + num;
  }
  return result;
}

export default function PasswordGenerator() {
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [words, setWords] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);
  const [addNumber, setAddNumber] = useState(true);

  const [password, setPassword] = useState('');

  const opts = { lower, upper, digits, symbols, excludeAmbiguous };

  const regenerate = useCallback(() => {
    if (mode === 'random') setPassword(generate(length, opts));
    else setPassword(generatePassphrase(words, separator, capitalize, addNumber));
  }, [mode, length, lower, upper, digits, symbols, excludeAmbiguous, words, separator, capitalize, addNumber]);

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regenerate]);

  const strength = useMemo<Strength>(() => {
    if (mode === 'random') {
      const pool = buildPool(opts).length;
      return classifyEntropy(entropyBits(password.length, pool));
    }
    // Passphrase entropy approximated from word count
    const bits = words * Math.log2(PASSPHRASE_WORDS.length);
    return classifyEntropy(bits);
  }, [mode, password, lower, upper, digits, symbols, excludeAmbiguous, words]);

  const noneSelected = !lower && !upper && !digits && !symbols;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['random', 'passphrase'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                mode === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'random' ? 'Random characters' : 'Passphrase'}
            </button>
          ))}
        </div>
      </div>

      <ToolCard
        title="Generated password"
        action={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={regenerate}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              ↻ Regenerate
            </button>
            <CopyButton value={password} />
          </div>
        }
      >
        <code
          className={`block w-full px-4 py-4 text-base sm:text-lg font-mono tracking-wide bg-slate-50 border border-slate-200 rounded-lg break-all ${
            password ? 'text-slate-900' : 'text-slate-400'
          }`}
        >
          {password || (noneSelected ? 'Select at least one character set' : '—')}
        </code>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-bold ${strength.tone.split(' ')[1] || ''}`}>{strength.label}</span>
            <span className="text-slate-400">~{Math.round(strength.entropy)} bits of entropy</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${strength.tone.split(' ')[0]}`}
              style={{ width: `${strength.pct}%` }}
            />
          </div>
        </div>
      </ToolCard>

      {mode === 'random' ? (
        <ToolCard title="Options">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">
                Length: {length}
              </label>
              <input
                type="range"
                min={8}
                max={64}
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { k: 'lower', label: 'Lowercase (a–z)', v: lower, set: setLower },
                { k: 'upper', label: 'Uppercase (A–Z)', v: upper, set: setUpper },
                { k: 'digits', label: 'Digits (0–9)', v: digits, set: setDigits },
                { k: 'symbols', label: 'Symbols (!@#…)', v: symbols, set: setSymbols },
              ].map((o) => (
                <label
                  key={o.k}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={o.v}
                    onChange={(e) => o.set(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  {o.label}
                </label>
              ))}
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer p-2 rounded-lg hover:bg-slate-50 col-span-2">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Exclude ambiguous characters (O 0 I l 1)
              </label>
            </div>
          </div>
        </ToolCard>
      ) : (
        <ToolCard title="Passphrase options">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">
                Word count: {words}
              </label>
              <input
                type="range"
                min={3}
                max={10}
                value={words}
                onChange={(e) => setWords(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Separator</span>
                <input
                  type="text"
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value.slice(0, 3))}
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={capitalize}
                    onChange={(e) => setCapitalize(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Capitalize
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addNumber}
                    onChange={(e) => setAddNumber(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Add number
                </label>
              </div>
            </div>
          </div>
        </ToolCard>
      )}
    </div>
  );
}
