import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { CurrencyCode } from '../../utils/currency';

const TIP_NORMS: Record<CurrencyCode, { region: string; sitDown: number; takeout: number; norm: string }> = {
  USD: { region: 'United States', sitDown: 20, takeout: 10, norm: '15–20% expected; 20%+ for great service' },
  CAD: { region: 'Canada', sitDown: 18, takeout: 10, norm: '15–20% expected, similar to US' },
  GBP: { region: 'United Kingdom', sitDown: 12.5, takeout: 0, norm: '10–15% if no service charge added' },
  EUR: { region: 'Europe', sitDown: 10, takeout: 0, norm: 'Often included; 5–10% extra is generous' },
  AUD: { region: 'Australia', sitDown: 10, takeout: 0, norm: 'Optional — 10% only for excellent service' },
  INR: { region: 'India', sitDown: 10, takeout: 0, norm: '5–10% if no service charge added' },
};

export default function TipCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [bill, setBill] = useState<string>('50');
  const [tipPct, setTipPct] = useState(20);
  const [people, setPeople] = useState(1);
  const [roundUp, setRoundUp] = useState(false);

  const norm = TIP_NORMS[currency];

  const result = useMemo(() => {
    const b = parseFloat(bill) || 0;
    let tip = b * tipPct / 100;
    let total = b + tip;
    if (roundUp) {
      total = Math.ceil(total);
      tip = total - b;
    }
    const perPerson = people > 0 ? total / people : 0;
    return { bill: b, tip, total, perPerson };
  }, [bill, tipPct, people, roundUp]);

  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'AUD' ? 'A$' : 'C$';
  const fmt = (n: number) => `${symbol}${n.toFixed(2)}`;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Bill Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Bill amount</label>
            <input type="number" step="0.01" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Split between (people)</label>
            <input type="number" min={1} value={people} onChange={(e) => setPeople(Math.max(1, +e.target.value))} className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono" />
          </div>
        </div>
      </ToolCard>

      <ToolCard title={`Tip Percentage: ${tipPct}%`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {[0, 10, 15, 18, 20, 22, 25].map(p => (
            <button key={p} onClick={() => setTipPct(p)} className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${tipPct === p ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {p}%
            </button>
          ))}
        </div>
        <input type="range" min={0} max={30} step={1} value={tipPct} onChange={(e) => setTipPct(+e.target.value)} className="w-full accent-emerald-600" />
        <label className="flex items-center gap-2 mt-3 text-sm text-slate-600">
          <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} className="accent-emerald-600" />
          Round total up to nearest whole {symbol}
        </label>
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="Bill" action={<CopyButton value={result.bill.toFixed(2)} />}>
          <p className="text-xl font-bold text-slate-800">{fmt(result.bill)}</p>
        </ToolCard>
        <ToolCard title="Tip" action={<CopyButton value={result.tip.toFixed(2)} />}>
          <p className="text-xl font-bold text-blue-700">{fmt(result.tip)}</p>
        </ToolCard>
        <ToolCard title="Total" action={<CopyButton value={result.total.toFixed(2)} />}>
          <p className="text-2xl font-bold text-emerald-700">{fmt(result.total)}</p>
        </ToolCard>
        <ToolCard title={`Per person (${people})`} action={<CopyButton value={result.perPerson.toFixed(2)} />}>
          <p className="text-xl font-bold text-emerald-700">{fmt(result.perPerson)}</p>
        </ToolCard>
      </div>

      <ToolCard title={`Tipping etiquette in ${norm.region}`}>
        <div className="text-sm text-slate-600 space-y-1">
          <p>{norm.norm}</p>
          <p className="text-xs text-slate-500 mt-2">
            <strong>Sit-down:</strong> {norm.sitDown}% typical · <strong>Takeout:</strong> {norm.takeout > 0 ? `${norm.takeout}% appreciated` : 'not expected'}
          </p>
        </div>
      </ToolCard>

      <ToolCard title="Quick Reference — Common Bill Amounts">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs">
                <th className="text-left py-2 text-slate-500 font-medium">Bill</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">15%</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">18%</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">20%</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">25%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {[20, 50, 75, 100, 150, 200].map(b => (
                <tr key={b}>
                  <td className="py-1.5">{fmt(b)}</td>
                  <td className="py-1.5 px-2 text-right">{fmt(b + b * 0.15)}</td>
                  <td className="py-1.5 px-2 text-right">{fmt(b + b * 0.18)}</td>
                  <td className="py-1.5 px-2 text-right text-emerald-700 font-semibold">{fmt(b + b * 0.20)}</td>
                  <td className="py-1.5 px-2 text-right">{fmt(b + b * 0.25)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  );
}
