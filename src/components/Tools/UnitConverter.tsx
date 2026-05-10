import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Category = 'Length' | 'Weight' | 'Temperature' | 'Volume' | 'Area' | 'Speed';

interface Unit { label: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

const UNITS: Record<Category, Unit[]> = {
  Length: [
    { label: 'Kilometer (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Meter (m)', toBase: v => v, fromBase: v => v },
    { label: 'Centimeter (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { label: 'Millimeter (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'Mile (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { label: 'Yard (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { label: 'Foot (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: 'Inch (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { label: 'Nautical mile (nmi)', toBase: v => v * 1852, fromBase: v => v / 1852 },
  ],
  Weight: [
    { label: 'Kilogram (kg)', toBase: v => v, fromBase: v => v },
    { label: 'Gram (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'Milligram (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { label: 'Metric ton (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Pound (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: 'Ounce (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { label: 'Stone (st)', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
  ],
  Temperature: [
    { label: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
    { label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  Volume: [
    { label: 'Liter (L)', toBase: v => v, fromBase: v => v },
    { label: 'Milliliter (mL)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'Cubic meter (m³)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'US gallon (gal)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    { label: 'UK gallon (gal)', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
    { label: 'US quart (qt)', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    { label: 'US cup (cup)', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    { label: 'Fluid ounce (fl oz)', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    { label: 'Tablespoon (tbsp)', toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
    { label: 'Teaspoon (tsp)', toBase: v => v * 0.00492892, fromBase: v => v / 0.00492892 },
  ],
  Area: [
    { label: 'Square meter (m²)', toBase: v => v, fromBase: v => v },
    { label: 'Square kilometer (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: 'Square centimeter (cm²)', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
    { label: 'Hectare (ha)', toBase: v => v * 1e4, fromBase: v => v / 1e4 },
    { label: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { label: 'Square mile (mi²)', toBase: v => v * 2.59e6, fromBase: v => v / 2.59e6 },
    { label: 'Square foot (ft²)', toBase: v => v * 0.0929, fromBase: v => v / 0.0929 },
    { label: 'Square yard (yd²)', toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
  ],
  Speed: [
    { label: 'Meter/second (m/s)', toBase: v => v, fromBase: v => v },
    { label: 'Kilometer/hour (km/h)', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { label: 'Mile/hour (mph)', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { label: 'Knot (kn)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    { label: 'Foot/second (ft/s)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
  ],
};

function fmtNum(n: number): string {
  if (!isFinite(n)) return '—';
  if (Math.abs(n) >= 1e10 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(6);
  return parseFloat(n.toPrecision(8)).toLocaleString('en', { maximumFractionDigits: 8 });
}

export default function UnitConverter() {
  const categories = Object.keys(UNITS) as Category[];
  const [category, setCategory] = useState<Category>('Length');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(4);
  const [value, setValue] = useState('1');

  const units = UNITS[category];

  const result = useMemo(() => {
    const n = parseFloat(value);
    if (isNaN(n)) return '';
    const base = units[fromIdx].toBase(n);
    return fmtNum(units[toIdx].fromBase(base));
  }, [value, fromIdx, toIdx, units]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromIdx(0);
    setToIdx(Math.min(1, UNITS[cat].length - 1));
  };

  const swap = () => { setFromIdx(toIdx); setToIdx(fromIdx); };

  return (
    <div className="space-y-5">
      <ToolCard title="Category">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${category === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Convert">
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">From</label>
              <select value={fromIdx} onChange={(e) => setFromIdx(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                {units.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
              </select>
            </div>
            <button onClick={swap} className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 hover:border-emerald-400 text-slate-500 transition-colors text-lg mb-0.5">⇄</button>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">To</label>
              <select value={toIdx} onChange={(e) => setToIdx(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                {units.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Value</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Result</label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 text-sm font-mono font-semibold text-emerald-700 border border-slate-200 rounded-lg bg-slate-50">{result || '—'}</div>
                {result && <CopyButton value={result} />}
              </div>
            </div>
          </div>
        </div>
      </ToolCard>

      <ToolCard title={`All ${category} conversions for ${value || '1'} ${units[fromIdx]?.label}`}>
        <div className="divide-y divide-slate-100">
          {units.map((u, i) => {
            if (i === fromIdx) return null;
            const n = parseFloat(value);
            const r = isNaN(n) ? '—' : fmtNum(u.fromBase(units[fromIdx].toBase(n)));
            return (
              <div key={u.label} className="flex justify-between items-center py-1.5">
                <span className="text-sm text-slate-600">{u.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-800">{r}</span>
                  {r !== '—' && <CopyButton value={r} />}
                </div>
              </div>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}
