import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function textColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000';
  const [r, g, b] = rgb;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? '#1e293b' : '#f8fafc';
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-lg border border-slate-200 shadow-sm" style={{ backgroundColor: hex }} />
      <CopyButton value={hex} />
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-mono text-slate-700">{hex}</span>
    </div>
  );
}

export default function ColorPalette() {
  const [baseHex, setBaseHex] = useState('#3b82f6');
  const [paletteType, setPaletteType] = useState<'tints' | 'shades' | 'complementary' | 'analogous' | 'triadic'>('tints');

  const rgb = hexToRgb(baseHex);
  const hsl = rgb ? rgbToHsl(...rgb) : null;

  const palette = useMemo(() => {
    if (!hsl) return [];
    const [h, s, l] = hsl;
    switch (paletteType) {
      case 'tints':
        return [90, 80, 70, 60, 50].map((tl, i) => ({ hex: hslToHex(h, s, tl), label: `Tint ${i + 1}` }));
      case 'shades':
        return [40, 30, 20, 10, 5].map((sl, i) => ({ hex: hslToHex(h, s, sl), label: `Shade ${i + 1}` }));
      case 'complementary':
        return [
          { hex: hslToHex(h, s, l), label: 'Base' },
          { hex: hslToHex((h + 180) % 360, s, l), label: 'Complement' },
          { hex: hslToHex(h, Math.max(0, s - 20), Math.min(95, l + 20)), label: 'Tint' },
          { hex: hslToHex((h + 180) % 360, Math.max(0, s - 20), Math.min(95, l + 20)), label: 'Comp Tint' },
          { hex: hslToHex(h, s, Math.max(5, l - 20)), label: 'Shade' },
        ];
      case 'analogous':
        return [-30, -15, 0, 15, 30].map((offset, i) => ({
          hex: hslToHex((h + offset + 360) % 360, s, l),
          label: offset === 0 ? 'Base' : `${offset > 0 ? '+' : ''}${offset}°`,
        }));
      case 'triadic':
        return [0, 120, 240].flatMap((offset, i) => [
          { hex: hslToHex((h + offset) % 360, s, l), label: `Color ${i + 1}` },
          { hex: hslToHex((h + offset) % 360, s, Math.min(90, l + 20)), label: `Color ${i + 1} light` },
        ]);
      default:
        return [];
    }
  }, [hsl, paletteType]);

  const scales = useMemo(() => {
    if (!hsl) return [];
    const [h, s] = hsl;
    return [95, 85, 70, 55, 45, 35, 25, 15, 8].map((l, i) => ({
      hex: hslToHex(h, Math.max(s, 20), l),
      label: String((i + 1) * 100),
    }));
  }, [hsl]);

  return (
    <div className="space-y-5">
      <ToolCard title="Base Color">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={baseHex}
            onChange={(e) => setBaseHex(e.target.value.toUpperCase())}
            className="w-14 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={baseHex}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBaseHex(v.toUpperCase());
            }}
            className="w-32 px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          {hsl && <span className="text-xs text-slate-500 font-mono">HSL({hsl[0]}, {hsl[1]}%, {hsl[2]}%)</span>}
        </div>
      </ToolCard>

      <ToolCard title="Palette Type">
        <div className="flex flex-wrap gap-2">
          {(['tints', 'shades', 'complementary', 'analogous', 'triadic'] as const).map((t) => (
            <button key={t} onClick={() => setPaletteType(t)} className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors capitalize ${paletteType === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {t}
            </button>
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Generated Palette">
        <div className="flex flex-wrap gap-4">
          {palette.map((s) => <Swatch key={s.label} {...s} />)}
        </div>
      </ToolCard>

      <ToolCard title="Color Scale (100–900)">
        <div className="flex rounded-xl overflow-hidden border border-slate-200">
          {scales.map(({ hex, label }) => (
            <div
              key={label}
              className="flex-1 flex flex-col items-center justify-end py-3 gap-1 group cursor-pointer"
              style={{ backgroundColor: hex }}
              title={hex}
            >
              <span className="text-xs font-semibold opacity-80" style={{ color: textColor(hex) }}>{label}</span>
              <span className="text-xs font-mono opacity-0 group-hover:opacity-70 transition-opacity" style={{ color: textColor(hex) }}>{hex}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {scales.map(({ hex, label }) => (
            <CopyButton key={label} value={hex} />
          ))}
        </div>
      </ToolCard>
    </div>
  );
}
