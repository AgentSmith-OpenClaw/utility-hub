import React, { useState, useMemo, useEffect } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;

  // hex
  const hex = s.match(/^#?([0-9a-f]{3,8})$/);
  if (hex) {
    const h = hex[1];
    if (h.length === 3) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
        a: 1,
      };
    }
    if (h.length === 4) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
        a: parseInt(h[3] + h[3], 16) / 255,
      };
    }
    if (h.length === 6) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: 1,
      };
    }
    if (h.length === 8) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: parseInt(h.slice(6, 8), 16) / 255,
      };
    }
  }

  // rgb / rgba
  const rgb = s.match(/^rgba?\(\s*([0-9.]+)[,\s]+([0-9.]+)[,\s]+([0-9.]+)(?:[,/\s]+([0-9.]+%?))?\s*\)$/);
  if (rgb) {
    const a = rgb[4] ? (rgb[4].endsWith('%') ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4])) : 1;
    return {
      r: clamp(parseFloat(rgb[1]), 0, 255),
      g: clamp(parseFloat(rgb[2]), 0, 255),
      b: clamp(parseFloat(rgb[3]), 0, 255),
      a: clamp(a, 0, 1),
    };
  }

  // hsl / hsla
  const hsl = s.match(/^hsla?\(\s*([0-9.]+)(?:deg)?[,\s]+([0-9.]+)%[,\s]+([0-9.]+)%(?:[,/\s]+([0-9.]+%?))?\s*\)$/);
  if (hsl) {
    const a = hsl[4] ? (hsl[4].endsWith('%') ? parseFloat(hsl[4]) / 100 : parseFloat(hsl[4])) : 1;
    const rgb = hslToRgb({
      h: parseFloat(hsl[1]),
      s: parseFloat(hsl[2]),
      l: parseFloat(hsl[3]),
    });
    return { ...rgb, a };
  }

  return null;
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): { r: number; g: number; b: number } {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

function rgbToCmyk({ r, g, b }: { r: number; g: number; b: number }) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function rgbToHex({ r, g, b, a }: RGB): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) return base + toHex(a * 255);
  return base;
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const c = [r, g, b].map((v) => {
    const n = v / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }) {
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

export default function ColorConverter() {
  const [input, setInput] = useState('#10b981');
  const [parsed, setParsed] = useState<RGB | null>({ r: 16, g: 185, b: 129, a: 1 });

  useEffect(() => {
    const result = parseColor(input);
    if (result) setParsed(result);
  }, [input]);

  const formats = useMemo(() => {
    if (!parsed) return null;
    const hsl = rgbToHsl(parsed);
    const cmyk = rgbToCmyk(parsed);
    const hex = rgbToHex(parsed);
    return {
      hex,
      rgb:
        parsed.a < 1
          ? `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a.toFixed(2)})`
          : `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`,
      hsl:
        parsed.a < 1
          ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${parsed.a.toFixed(2)})`
          : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      hsv: hsl,
    };
  }, [parsed]);

  const contrasts = useMemo(() => {
    if (!parsed) return null;
    return {
      white: contrastRatio(parsed, { r: 255, g: 255, b: 255 }),
      black: contrastRatio(parsed, { r: 0, g: 0, b: 0 }),
    };
  }, [parsed]);

  const variants = useMemo(() => {
    if (!parsed) return [];
    const hsl = rgbToHsl(parsed);
    const result: Array<{ label: string; hex: string }> = [];
    for (let i = 1; i <= 5; i++) {
      const lighter = hslToRgb({ h: hsl.h, s: hsl.s, l: Math.min(95, hsl.l + i * 8) });
      result.push({ label: `+${i * 8}%`, hex: rgbToHex({ ...lighter, a: 1 }) });
    }
    result.reverse();
    result.push({ label: '0', hex: rgbToHex({ ...parsed, a: 1 }) });
    for (let i = 1; i <= 5; i++) {
      const darker = hslToRgb({ h: hsl.h, s: hsl.s, l: Math.max(5, hsl.l - i * 8) });
      result.push({ label: `-${i * 8}%`, hex: rgbToHex({ ...darker, a: 1 }) });
    }
    return result;
  }, [parsed]);

  const swatchStyle = parsed
    ? {
        backgroundColor: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a})`,
      }
    : {};

  return (
    <div className="space-y-5">
      <ToolCard>
        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6 items-stretch">
          <div
            className="rounded-2xl shadow-inner border-2 border-slate-200 h-40 md:h-56 relative overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
              backgroundSize: '14px 14px',
              backgroundPosition: '0 0, 0 7px, 7px -7px, -7px 0px',
            }}
          >
            <div className="absolute inset-0" style={swatchStyle} />
          </div>
          <div className="space-y-3 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={parsed ? rgbToHex({ ...parsed, a: 1 }).slice(0, 7) : '#10b981'}
                onChange={(e) => setInput(e.target.value)}
                className="w-14 h-14 rounded-lg border-2 border-slate-200 cursor-pointer flex-shrink-0"
                aria-label="Pick a color"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="#10b981, rgb(16, 185, 129), hsl(160, 84%, 39%)"
                className="flex-1 px-4 py-3.5 text-base sm:text-lg font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                spellCheck={false}
              />
            </div>
            {!parseColor(input) && input.trim() && (
              <div className="text-xs text-red-600 font-mono">Could not parse — try a HEX, RGB, or HSL value.</div>
            )}
          </div>
        </div>
      </ToolCard>

      {formats && (
        <ToolCard title="All formats">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'HEX', value: formats.hex },
              { label: 'RGB', value: formats.rgb },
              { label: 'HSL', value: formats.hsl },
              { label: 'CMYK', value: formats.cmyk },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-14 flex-shrink-0">
                  {f.label}
                </span>
                <code className="flex-1 text-sm font-mono text-slate-800 break-all">{f.value}</code>
                <CopyButton value={f.value} />
              </div>
            ))}
          </div>
        </ToolCard>
      )}

      {contrasts && (
        <ToolCard title="WCAG Contrast">
          <div className="grid grid-cols-2 gap-3">
            <ContrastBox
              label="On white"
              ratio={contrasts.white}
              fg={parsed ? `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` : '#000'}
              bg="#ffffff"
            />
            <ContrastBox
              label="On black"
              ratio={contrasts.black}
              fg={parsed ? `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})` : '#fff'}
              bg="#000000"
            />
          </div>
          <p className="text-xs text-slate-400 mt-3">
            WCAG AA requires 4.5:1 for normal text and 3:1 for large text. AAA requires 7:1 and 4.5:1 respectively.
          </p>
        </ToolCard>
      )}

      {variants.length > 0 && (
        <ToolCard title="Tints & Shades">
          <div className="grid grid-cols-11 gap-1">
            {variants.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full aspect-square rounded-md border border-slate-200"
                  style={{ backgroundColor: v.hex }}
                  title={v.hex}
                />
                <span className="text-[9px] font-mono text-slate-500 mt-1">{v.label}</span>
              </div>
            ))}
          </div>
        </ToolCard>
      )}
    </div>
  );
}

function ContrastBox({
  label,
  ratio,
  fg,
  bg,
}: {
  label: string;
  ratio: number;
  fg: string;
  bg: string;
}) {
  const passAA = ratio >= 4.5;
  const passAALarge = ratio >= 3;
  const passAAA = ratio >= 7;
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <div
        className="px-4 py-5 text-center font-bold text-lg"
        style={{ backgroundColor: bg, color: fg }}
      >
        Aa Sample
      </div>
      <div className="bg-white px-3 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-700">{label}</span>
          <span className="text-sm font-bold text-slate-900">{ratio.toFixed(2)}:1</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge label="AA" pass={passAA} />
          <Badge label="AA Large" pass={passAALarge} />
          <Badge label="AAA" pass={passAAA} />
        </div>
      </div>
    </div>
  );
}

function Badge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
        pass ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
      }`}
    >
      {pass ? '✓' : '✗'} {label}
    </span>
  );
}
