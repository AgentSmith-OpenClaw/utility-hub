import React, { useCallback, useMemo, useState } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { CurrencyCode } from '../../utils/currency';

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  INR: '₹',
};

type Mode = 'hikePct' | 'newSalary';
type Frequency = 'annual' | 'monthly';

export default function SalaryHikeCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [mode, setMode] = useState<Mode>('hikePct');
  const [frequency, setFrequency] = useState<Frequency>('annual');
  const [current, setCurrent] = useState<string>('800000');
  const [hikePct, setHikePct] = useState<string>('12');
  const [newSalaryInput, setNewSalaryInput] = useState<string>('900000');

  const result = useMemo(() => {
    const cur = Math.max(0, parseFloat(current) || 0);
    let newSalary = 0;
    let hike = 0;
    let pct = 0;

    if (mode === 'hikePct') {
      pct = parseFloat(hikePct) || 0;
      newSalary = cur * (1 + pct / 100);
      hike = newSalary - cur;
    } else {
      newSalary = Math.max(0, parseFloat(newSalaryInput) || 0);
      hike = newSalary - cur;
      pct = cur > 0 ? (hike / cur) * 100 : 0;
    }

    const factor = frequency === 'annual' ? 1 / 12 : 12;
    const monthlyCurrent = frequency === 'annual' ? cur / 12 : cur;
    const monthlyNew = frequency === 'annual' ? newSalary / 12 : newSalary;
    const monthlyDelta = monthlyNew - monthlyCurrent;
    const annualCurrent = frequency === 'monthly' ? cur * 12 : cur;
    const annualNew = frequency === 'monthly' ? newSalary * 12 : newSalary;

    return {
      cur,
      newSalary,
      hike,
      pct,
      monthlyCurrent,
      monthlyNew,
      monthlyDelta,
      annualCurrent,
      annualNew,
      factor,
    };
  }, [current, hikePct, newSalaryInput, mode, frequency]);

  const symbol = CURRENCY_SYMBOL[currency];
  const fmt = useCallback(
    (n: number) =>
      `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    [symbol],
  );

  const buildPdfConfig = useCallback(
    () => ({
      title: 'Salary Hike Calculator Report',
      subtitle: `${result.pct.toFixed(2)}% hike: ${fmt(result.cur)} → ${fmt(result.newSalary)} (${frequency})`,
      filename: 'Salary_Hike_Calculator.pdf',
      sections: [
        {
          type: 'inputs' as const,
          title: 'Inputs',
          inputs: [
            { label: 'Current salary', value: `${fmt(result.cur)} (${frequency})` },
            { label: 'Mode', value: mode === 'hikePct' ? `Hike % = ${hikePct}%` : `New salary = ${fmt(result.newSalary)}` },
          ],
        },
        {
          type: 'metrics' as const,
          title: 'Result',
          metrics: [
            { label: 'New salary', value: `${fmt(result.newSalary)} (${frequency})` },
            { label: 'Hike amount', value: fmt(result.hike) },
            { label: 'Hike %', value: `${result.pct.toFixed(2)}%` },
            { label: 'Monthly delta', value: fmt(result.monthlyDelta) },
          ],
        },
      ],
    }),
    [result, fmt, frequency, mode, hikePct],
  );

  const buildExcelSheets = useCallback(
    () => [
      {
        name: 'Salary Hike',
        rows: [
          { Field: 'Current salary (annual)', Value: Math.round(result.annualCurrent) },
          { Field: 'Current salary (monthly)', Value: Math.round(result.monthlyCurrent) },
          { Field: 'New salary (annual)', Value: Math.round(result.annualNew) },
          { Field: 'New salary (monthly)', Value: Math.round(result.monthlyNew) },
          { Field: 'Hike amount', Value: Math.round(result.hike) },
          { Field: 'Hike %', Value: `${result.pct.toFixed(2)}%` },
          { Field: 'Monthly delta', Value: Math.round(result.monthlyDelta) },
        ],
      },
      {
        name: 'Hike scenarios',
        rows: [5, 8, 10, 12, 15, 18, 20, 25, 30].map((p) => ({
          'Hike %': `${p}%`,
          'New salary': Math.round(result.cur * (1 + p / 100)),
          'Hike amount': Math.round(result.cur * (p / 100)),
        })),
      },
    ],
    [result],
  );

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Salary_Hike_Calculator"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`Salary hike: ${fmt(result.cur)} → ${fmt(result.newSalary)} (${result.pct.toFixed(2)}% hike, +${fmt(result.monthlyDelta)}/month).`}
      />

      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Frequency">
        <div className="flex gap-2">
          {(['annual', 'monthly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                frequency === f
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
              }`}
            >
              {f === 'annual' ? 'Annual / CTC' : 'Monthly'}
            </button>
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Current Salary">
        <input
          type="number"
          min={0}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
        />
        <p className="text-xs text-slate-500 mt-1">{frequency === 'annual' ? 'Annual or CTC' : 'Monthly take-home or gross'}</p>
      </ToolCard>

      <ToolCard title="Hike Mode">
        <div className="flex gap-2 mb-3">
          {(['hikePct', 'newSalary'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                mode === m
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
              }`}
            >
              {m === 'hikePct' ? 'Enter hike %' : 'Enter new salary'}
            </button>
          ))}
        </div>

        {mode === 'hikePct' ? (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Hike percentage</label>
            <input
              type="number"
              step="0.5"
              value={hikePct}
              onChange={(e) => setHikePct(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {[5, 8, 10, 12, 15, 20, 25, 30].map((p) => (
                <button
                  key={p}
                  onClick={() => setHikePct(String(p))}
                  className={`px-3 py-1 text-xs rounded-md border font-medium transition-colors ${
                    hikePct === String(p)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">New salary</label>
            <input
              type="number"
              min={0}
              value={newSalaryInput}
              onChange={(e) => setNewSalaryInput(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>
        )}
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="New Salary" action={<CopyButton value={result.newSalary.toFixed(0)} />}>
          <p className="text-2xl font-bold text-emerald-700">{fmt(result.newSalary)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{frequency}</p>
        </ToolCard>
        <ToolCard title="Hike Amount" action={<CopyButton value={result.hike.toFixed(0)} />}>
          <p className="text-2xl font-bold text-blue-700">{fmt(result.hike)}</p>
          <p className="text-xs text-slate-500 mt-0.5">{frequency}</p>
        </ToolCard>
        <ToolCard title="Hike %" action={<CopyButton value={result.pct.toFixed(2)} />}>
          <p className="text-2xl font-bold text-violet-700">{result.pct.toFixed(2)}%</p>
        </ToolCard>
        <ToolCard title="Monthly Delta" action={<CopyButton value={result.monthlyDelta.toFixed(0)} />}>
          <p className="text-2xl font-bold text-emerald-700">+{fmt(result.monthlyDelta)}</p>
          <p className="text-xs text-slate-500 mt-0.5">extra / month</p>
        </ToolCard>
      </div>

      <ToolCard title="Quick Hike Scenarios">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs">
                <th className="text-left py-2 text-slate-500 font-medium">Hike %</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">New {frequency}</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Hike amount</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Per month +</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {[5, 8, 10, 12, 15, 18, 20, 25, 30].map((p) => {
                const ns = result.cur * (1 + p / 100);
                const delta = ns - result.cur;
                const md = frequency === 'annual' ? delta / 12 : delta;
                return (
                  <tr key={p}>
                    <td className="py-1.5">{p}%</td>
                    <td className="py-1.5 px-2 text-right">{fmt(ns)}</td>
                    <td className="py-1.5 px-2 text-right text-blue-700">{fmt(delta)}</td>
                    <td className="py-1.5 px-2 text-right text-emerald-700 font-semibold">+{fmt(md)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  );
}
