import React, { useCallback, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
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

// RD maturity formula (quarterly compounding, monthly deposit):
// Each monthly deposit compounds for the remaining months.
// Approximation used by Indian banks: M = P × [((1+r/n)^(nt) - 1) / (1 - (1+r/n)^(-1/m))]
// We compute month-by-month for exactness and easy charting.
function computeRD(monthlyDeposit: number, annualRate: number, months: number) {
  const rQuarter = annualRate / 100 / 4;
  // Each deposit earns interest from the month it is deposited until maturity.
  // Banks credit interest quarterly. We approximate by treating monthly contributions
  // and compounding the running balance quarterly.
  let balance = 0;
  const schedule: { month: number; invested: number; balance: number }[] = [];
  let invested = 0;
  for (let m = 1; m <= months; m++) {
    balance += monthlyDeposit;
    invested += monthlyDeposit;
    // At every 3rd month, apply quarterly compounding
    if (m % 3 === 0) {
      balance = balance * (1 + rQuarter);
    }
    schedule.push({ month: m, invested, balance });
  }
  return {
    maturity: balance,
    invested,
    interest: balance - invested,
    schedule,
  };
}

export default function RDCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [monthly, setMonthly] = useState<string>('5000');
  const [rate, setRate] = useState<string>('6.75');
  const [tenureMonths, setTenureMonths] = useState<string>('60');
  const [seniorCitizen, setSeniorCitizen] = useState(false);

  const result = useMemo(() => {
    const M = Math.max(0, parseFloat(monthly) || 0);
    const baseRate = Math.max(0, parseFloat(rate) || 0);
    const effRate = seniorCitizen ? baseRate + 0.5 : baseRate;
    const t = Math.max(1, Math.floor(parseFloat(tenureMonths) || 0));
    const r = computeRD(M, effRate, t);
    return {
      monthly: M,
      effRate,
      tenureMonths: t,
      ...r,
    };
  }, [monthly, rate, tenureMonths, seniorCitizen]);

  const symbol = CURRENCY_SYMBOL[currency];
  const fmt = useCallback(
    (n: number) =>
      `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    [symbol],
  );

  const chartData = useMemo(() => {
    // Sample at most ~24 points for chart clarity
    const step = Math.max(1, Math.ceil(result.schedule.length / 24));
    return result.schedule
      .filter((_, i) => i % step === 0 || i === result.schedule.length - 1)
      .map((p) => ({
        month: p.month,
        Invested: Math.round(p.invested),
        Value: Math.round(p.balance),
      }));
  }, [result.schedule]);

  const buildPdfConfig = useCallback(
    () => ({
      title: 'Recurring Deposit Calculator Report',
      subtitle: `${fmt(result.monthly)}/month × ${result.tenureMonths} months @ ${result.effRate}%`,
      filename: 'RD_Calculator.pdf',
      sections: [
        {
          type: 'inputs' as const,
          title: 'Inputs',
          inputs: [
            { label: 'Monthly deposit', value: fmt(result.monthly) },
            { label: 'Interest rate', value: `${result.effRate}% p.a.` },
            { label: 'Tenure', value: `${result.tenureMonths} months` },
            { label: 'Senior citizen', value: seniorCitizen ? 'Yes (+0.5%)' : 'No' },
          ],
        },
        {
          type: 'metrics' as const,
          title: 'Maturity Summary',
          metrics: [
            { label: 'Total invested', value: fmt(result.invested) },
            { label: 'Interest earned', value: fmt(result.interest) },
            { label: 'Maturity value', value: fmt(result.maturity) },
          ],
        },
      ],
    }),
    [result, fmt, seniorCitizen],
  );

  const buildExcelSheets = useCallback(
    () => [
      {
        name: 'RD Summary',
        rows: [
          { Field: 'Monthly deposit', Value: result.monthly },
          { Field: 'Interest rate (effective)', Value: `${result.effRate}%` },
          { Field: 'Tenure (months)', Value: result.tenureMonths },
          { Field: 'Senior citizen', Value: seniorCitizen ? 'Yes' : 'No' },
          { Field: 'Total invested', Value: Math.round(result.invested) },
          { Field: 'Interest earned', Value: Math.round(result.interest) },
          { Field: 'Maturity value', Value: Math.round(result.maturity) },
        ],
      },
      {
        name: 'Month-by-month',
        rows: result.schedule.map((p) => ({
          Month: p.month,
          Invested: Math.round(p.invested),
          Balance: Math.round(p.balance),
        })),
      },
    ],
    [result, seniorCitizen],
  );

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="RD_Calculator"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`RD: ${fmt(result.monthly)}/month × ${result.tenureMonths} months → ${fmt(result.maturity)} maturity (${fmt(result.interest)} interest).`}
      />

      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Deposit Details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Monthly deposit</label>
            <input
              type="number"
              min={0}
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Interest rate (% p.a.)</label>
            <input
              type="number"
              step="0.05"
              min={0}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Tenure (months)</label>
            <input
              type="number"
              min={6}
              max={120}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[12, 24, 36, 60, 84, 120].map((m) => (
            <button
              key={m}
              onClick={() => setTenureMonths(String(m))}
              className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                tenureMonths === String(m)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
              }`}
            >
              {m / 12}y
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={seniorCitizen}
            onChange={(e) => setSeniorCitizen(e.target.checked)}
            className="accent-emerald-600"
          />
          Senior citizen rate (+0.5%)
        </label>
      </ToolCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ToolCard title="Total Invested" action={<CopyButton value={result.invested.toFixed(0)} />}>
          <p className="text-2xl font-bold text-slate-800">{fmt(result.invested)}</p>
        </ToolCard>
        <ToolCard title="Interest Earned" action={<CopyButton value={result.interest.toFixed(0)} />}>
          <p className="text-2xl font-bold text-blue-700">{fmt(result.interest)}</p>
        </ToolCard>
        <ToolCard title="Maturity Value" action={<CopyButton value={result.maturity.toFixed(0)} />}>
          <p className="text-2xl font-bold text-emerald-700">{fmt(result.maturity)}</p>
        </ToolCard>
      </div>

      <ToolCard title="Growth Over Time">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rdValueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#007AFF" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => `M${v}`} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: any) => fmt(Number(v))}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                labelFormatter={(l) => `Month ${l}`}
              />
              <Area type="monotone" dataKey="Invested" stroke="#64748b" strokeWidth={2} fillOpacity={0} />
              <Area
                type="monotone"
                dataKey="Value"
                stroke="#007AFF"
                strokeWidth={2}
                fill="url(#rdValueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Blue area shows your RD balance; grey line shows what you have invested. The gap is your earned interest.
        </p>
      </ToolCard>
    </div>
  );
}
