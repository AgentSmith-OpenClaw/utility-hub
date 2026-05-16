import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  if (full.length !== 6) return null;
  const n = parseInt(full, 16);
  if (isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function sRGB(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * sRGB(r) + 0.7152 * sRGB(g) + 0.0722 * sRGB(b);
}

function contrastRatio(l1: number, l2: number): number {
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

function suggestFix(fgHex: string, bgHex: string, targetRatio: number): string | null {
  const bg = hexToRgb(bgHex);
  if (!bg) return null;
  const bgL = luminance(...bg);
  // Try darkening and lightening the foreground in HSL space
  for (let step = 1; step <= 100; step++) {
    for (const sign of [-1, 1]) {
      const fg = hexToRgb(fgHex);
      if (!fg) return null;
      const adjusted: [number, number, number] = [
        Math.min(255, Math.max(0, fg[0] + sign * step * 2)),
        Math.min(255, Math.max(0, fg[1] + sign * step * 2)),
        Math.min(255, Math.max(0, fg[2] + sign * step * 2)),
      ];
      const fgL = luminance(...adjusted);
      if (contrastRatio(fgL, bgL) >= targetRatio) {
        return '#' + adjusted.map((v) => v.toString(16).padStart(2, '0')).join('');
      }
    }
  }
  return null;
}

interface CheckResult {
  ratio: number;
  normalAA: boolean;
  normalAAA: boolean;
  largeAA: boolean;
  largeAAA: boolean;
  uiAA: boolean;
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border px-3 py-2.5 ${pass ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
      <span className={`text-lg font-bold ${pass ? 'text-emerald-600' : 'text-rose-500'}`}>{pass ? '✓' : '✗'}</span>
      <span className={`text-xs font-semibold mt-0.5 ${pass ? 'text-emerald-700' : 'text-rose-600'}`}>{label}</span>
    </div>
  );
}

export default function ColorContrastChecker() {
  const [fg, setFg] = useState('#1e293b');
  const [bg, setBg] = useState('#f8fafc');

  const result = useMemo<CheckResult | null>(() => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return null;
    const fgL = luminance(...fgRgb);
    const bgL = luminance(...bgRgb);
    const ratio = contrastRatio(fgL, bgL);
    return {
      ratio,
      normalAA:  ratio >= 4.5,
      normalAAA: ratio >= 7,
      largeAA:   ratio >= 3,
      largeAAA:  ratio >= 4.5,
      uiAA:      ratio >= 3,
    };
  }, [fg, bg]);

  const suggestion = useMemo(() => {
    if (!result || result.normalAA) return null;
    return suggestFix(fg, bg, 4.5);
  }, [fg, bg, result]);

  const PAIRS = [
    { fg: '#1e293b', bg: '#f8fafc', label: 'Slate 800 / Slate 50' },
    { fg: '#ffffff', bg: '#2563eb', label: 'White / Blue 600' },
    { fg: '#f8fafc', bg: '#64748b', label: 'Slate 50 / Slate 500' },
    { fg: '#1e293b', bg: '#fbbf24', label: 'Slate 800 / Amber 400' },
    { fg: '#7c3aed', bg: '#ffffff', label: 'Violet 700 / White' },
    { fg: '#dc2626', bg: '#ffffff', label: 'Red 600 / White (fails AAA)' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Color inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[{ label: 'Foreground (text)', val: fg, set: setFg }, { label: 'Background', val: bg, set: setBg }].map(({ label, val, set }) => (
          <ToolCard key={label} title={label}>
            <div className="flex gap-3 items-center">
              <input type="color" value={val} onChange={(e) => set(e.target.value)} className="h-12 w-12 rounded border border-slate-200 cursor-pointer shrink-0" />
              <input type="text" value={val} onChange={(e) => set(e.target.value)}
                className="flex-1 font-mono text-sm px-3 py-2.5 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 outline-none min-h-[44px]" />
            </div>
          </ToolCard>
        ))}
      </div>

      {/* Preview */}
      {result && (
        <>
          <ToolCard title="Preview">
            <div className="rounded-lg p-6 space-y-3" style={{ background: bg }}>
              <p className="text-2xl font-bold" style={{ color: fg }}>Large text (18pt / 14pt bold)</p>
              <p className="text-base"     style={{ color: fg }}>Normal body text at 16px.</p>
              <p className="text-sm"       style={{ color: fg }}>Small text at 14px — this must pass AA at 4.5:1.</p>
              <button className="px-4 py-2 rounded text-sm font-semibold border" style={{ color: fg, borderColor: fg }}>
                UI element / button
              </button>
            </div>
          </ToolCard>

          {/* Ratio + badges */}
          <ToolCard title="WCAG 2.2 results" action={
            <CopyButton value={`${result.ratio.toFixed(2)}:1`} label="Copy ratio" />
          }>
            <div className="text-center mb-5">
              <span className="text-5xl font-extrabold text-slate-900">{result.ratio.toFixed(2)}</span>
              <span className="text-2xl font-bold text-slate-500 ml-1">: 1</span>
              <p className="text-xs text-slate-500 mt-1">Contrast ratio</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <Badge pass={result.normalAA}  label="AA Normal" />
              <Badge pass={result.normalAAA} label="AAA Normal" />
              <Badge pass={result.largeAA}   label="AA Large" />
              <Badge pass={result.largeAAA}  label="AAA Large" />
              <Badge pass={result.uiAA}      label="AA UI" />
            </div>
            <div className="mt-4 text-xs text-slate-500 space-y-0.5">
              <p>AA Normal: ≥ 4.5:1 · AAA Normal: ≥ 7:1 · AA Large (18pt+ / 14pt bold+): ≥ 3:1 · AAA Large: ≥ 4.5:1 · UI elements: ≥ 3:1</p>
            </div>
            {suggestion && (
              <div className="mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50">
                <p className="text-xs text-amber-700 font-semibold mb-1">Suggested fix to pass AA:</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded border border-slate-200" style={{ background: suggestion }} />
                  <code className="font-mono text-sm text-amber-900">{suggestion}</code>
                  <button onClick={() => setFg(suggestion)} className="text-xs px-2 py-1 rounded-lg bg-amber-600 text-white hover:bg-amber-700 min-h-[32px]">Apply</button>
                </div>
              </div>
            )}
          </ToolCard>
        </>
      )}

      {/* Preset pairs */}
      <ToolCard title="Common pairs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PAIRS.map((p) => (
            <button key={p.label} onClick={() => { setFg(p.fg); setBg(p.bg); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left min-h-[44px]">
              <div className="flex shrink-0">
                <div className="w-5 h-7 rounded-l" style={{ background: p.fg }} />
                <div className="w-5 h-7 rounded-r" style={{ background: p.bg }} />
              </div>
              <span className="text-xs text-slate-700">{p.label}</span>
            </button>
          ))}
        </div>
      </ToolCard>
    </div>
  );
}
