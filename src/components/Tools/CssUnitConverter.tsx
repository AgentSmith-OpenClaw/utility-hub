import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Unit = 'px' | 'em' | 'rem' | 'pt' | 'pc' | '%' | 'vw' | 'vh';

const UNITS: Unit[] = ['px', 'em', 'rem', 'pt', 'pc', '%', 'vw', 'vh'];

interface Ctx {
  rootPx: number; // 1rem
  parentPx: number; // 1em parent
  viewportWidth: number;
  viewportHeight: number;
  basePx: number; // for %
}

function toPx(value: number, unit: Unit, ctx: Ctx): number {
  switch (unit) {
    case 'px': return value;
    case 'em': return value * ctx.parentPx;
    case 'rem': return value * ctx.rootPx;
    case 'pt': return value * (96 / 72);
    case 'pc': return value * 16;
    case '%': return (value / 100) * ctx.basePx;
    case 'vw': return (value / 100) * ctx.viewportWidth;
    case 'vh': return (value / 100) * ctx.viewportHeight;
  }
}

function fromPx(px: number, unit: Unit, ctx: Ctx): number {
  switch (unit) {
    case 'px': return px;
    case 'em': return px / ctx.parentPx;
    case 'rem': return px / ctx.rootPx;
    case 'pt': return px * (72 / 96);
    case 'pc': return px / 16;
    case '%': return ctx.basePx === 0 ? 0 : (px / ctx.basePx) * 100;
    case 'vw': return ctx.viewportWidth === 0 ? 0 : (px / ctx.viewportWidth) * 100;
    case 'vh': return ctx.viewportHeight === 0 ? 0 : (px / ctx.viewportHeight) * 100;
  }
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (Math.abs(n) >= 100) return n.toFixed(1);
  if (Math.abs(n) >= 1) return n.toFixed(3).replace(/\.?0+$/, '');
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function CssUnitConverter() {
  const [value, setValue] = useState(16);
  const [unit, setUnit] = useState<Unit>('px');
  const [rootPx, setRootPx] = useState(16);
  const [parentPx, setParentPx] = useState(16);
  const [viewportWidth, setViewportWidth] = useState(typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(typeof window === 'undefined' ? 900 : window.innerHeight);
  const [basePx, setBasePx] = useState(16);

  const ctx: Ctx = { rootPx, parentPx, viewportWidth, viewportHeight, basePx };

  const px = useMemo(() => toPx(value, unit, ctx), [value, unit, ctx]);
  const conversions = useMemo(
    () =>
      UNITS.map((u) => ({
        unit: u,
        value: fromPx(px, u, ctx),
        formatted: `${fmt(fromPx(px, u, ctx))}${u}`,
      })),
    [px, ctx],
  );

  return (
    <div className="space-y-5">
      <ToolCard title="Value to convert">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            step="any"
            className="flex-1 px-3 py-2.5 text-base font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="px-3 py-2.5 text-base font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </ToolCard>

      <ToolCard title="Context (assumed defaults)">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { l: 'Root font size (px)', v: rootPx, set: setRootPx, hint: '1rem = ?' },
            { l: 'Parent font size (px)', v: parentPx, set: setParentPx, hint: '1em = ?' },
            { l: '% base (px)', v: basePx, set: setBasePx, hint: 'parent dimension' },
            { l: 'Viewport width (px)', v: viewportWidth, set: setViewportWidth, hint: '100vw' },
            { l: 'Viewport height (px)', v: viewportHeight, set: setViewportHeight, hint: '100vh' },
          ].map((row) => (
            <label key={row.l} className="block">
              <span className="block text-[10px] font-semibold uppercase text-slate-500 mb-1">{row.l}</span>
              <input
                type="number"
                value={row.v}
                onChange={(e) => row.set(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">{row.hint}</span>
            </label>
          ))}
        </div>
      </ToolCard>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {conversions.map((c) => (
          <div
            key={c.unit}
            className={`bg-white rounded-2xl border p-4 shadow-sm ${
              c.unit === unit ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{c.unit}</span>
              <CopyButton value={c.formatted} />
            </div>
            <div className="text-lg font-extrabold font-mono text-slate-900 break-all">{fmt(c.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
