import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

function fmt(n: number): string {
  if (!isFinite(n)) return '—';
  return n % 1 === 0 ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function CalcRow({ label, result }: { label: string; result: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-semibold text-slate-900">{result}</span>
        {result !== '—' && <CopyButton value={result} />}
      </div>
    </div>
  );
}

export default function PercentageCalculator() {
  const [xOf, setXOf] = useState('25');
  const [total, setTotal] = useState('200');
  const [partOf, setPartOf] = useState('50');
  const [whole, setWhole] = useState('400');
  const [fromVal, setFromVal] = useState('80');
  const [toVal, setToVal] = useState('100');
  const [add, setAdd] = useState('150');
  const [addPct, setAddPct] = useState('20');

  const r1 = useMemo(() => {
    const x = parseFloat(xOf), t = parseFloat(total);
    return isNaN(x) || isNaN(t) || t === 0 ? '—' : fmt((x / 100) * t);
  }, [xOf, total]);

  const r2 = useMemo(() => {
    const p = parseFloat(partOf), w = parseFloat(whole);
    return isNaN(p) || isNaN(w) || w === 0 ? '—' : fmt((p / w) * 100) + '%';
  }, [partOf, whole]);

  const r3 = useMemo(() => {
    const f = parseFloat(fromVal), t = parseFloat(toVal);
    if (isNaN(f) || isNaN(t) || f === 0) return '—';
    const pct = ((t - f) / Math.abs(f)) * 100;
    return (pct >= 0 ? '+' : '') + fmt(pct) + '%';
  }, [fromVal, toVal]);

  const r4 = useMemo(() => {
    const a = parseFloat(add), p = parseFloat(addPct);
    return isNaN(a) || isNaN(p) ? '—' : fmt(a + (a * p / 100));
  }, [add, addPct]);

  const r5 = useMemo(() => {
    const a = parseFloat(add), p = parseFloat(addPct);
    return isNaN(a) || isNaN(p) ? '—' : fmt(a - (a * p / 100));
  }, [add, addPct]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ToolCard title="What is X% of Y?">
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={xOf} onChange={(e) => setXOf(e.target.value)} className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
            <span className="text-sm text-slate-500">% of</span>
            <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-slate-500">Result:</span>
            <span className="text-lg font-bold text-emerald-700">{r1}</span>
            {r1 !== '—' && <CopyButton value={r1} />}
          </div>
        </ToolCard>

        <ToolCard title="X is what % of Y?">
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={partOf} onChange={(e) => setPartOf(e.target.value)} className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
            <span className="text-sm text-slate-500">is what % of</span>
            <input type="number" value={whole} onChange={(e) => setWhole(e.target.value)} className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-slate-500">Result:</span>
            <span className="text-lg font-bold text-emerald-700">{r2}</span>
            {r2 !== '—' && <CopyButton value={r2} />}
          </div>
        </ToolCard>

        <ToolCard title="Percentage Change">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">From</span>
            <input type="number" value={fromVal} onChange={(e) => setFromVal(e.target.value)} className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
            <span className="text-sm text-slate-500">to</span>
            <input type="number" value={toVal} onChange={(e) => setToVal(e.target.value)} className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-slate-500">Change:</span>
            <span className={`text-lg font-bold ${r3.startsWith('+') ? 'text-emerald-700' : r3.startsWith('-') ? 'text-red-600' : 'text-slate-800'}`}>{r3}</span>
            {r3 !== '—' && <CopyButton value={r3} />}
          </div>
        </ToolCard>

        <ToolCard title="Add / Subtract Percentage">
          <div className="flex items-center gap-2 flex-wrap">
            <input type="number" value={add} onChange={(e) => setAdd(e.target.value)} className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
            <span className="text-sm text-slate-500">±</span>
            <input type="number" value={addPct} onChange={(e) => setAddPct(e.target.value)} className="w-20 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-slate-50" />
            <span className="text-sm text-slate-500">%</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 w-14">Add:</span>
              <span className="text-lg font-bold text-emerald-700">{r4}</span>
              {r4 !== '—' && <CopyButton value={r4} />}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 w-14">Subtract:</span>
              <span className="text-lg font-bold text-red-600">{r5}</span>
              {r5 !== '—' && <CopyButton value={r5} />}
            </div>
          </div>
        </ToolCard>
      </div>

      <ToolCard title="Quick Reference">
        <div className="text-sm text-slate-600 space-y-1">
          <CalcRow label="10% of 500" result={fmt(50)} />
          <CalcRow label="15% tip on $85" result={'$' + fmt(85 * 1.15)} />
          <CalcRow label="20% discount off $120" result={'$' + fmt(120 * 0.8)} />
          <CalcRow label="7.5% sales tax on $200" result={'$' + fmt(200 * 1.075)} />
        </div>
      </ToolCard>
    </div>
  );
}
