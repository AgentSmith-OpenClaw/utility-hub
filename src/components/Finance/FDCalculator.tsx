import React, { useCallback, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { CurrencyCode } from '../../utils/currency';

type Compounding = 'quarterly' | 'half-yearly' | 'annually' | 'monthly';

const COMPOUNDING_OPTIONS: { value: Compounding; label: string; n: number }[] = [
  { value: 'monthly', label: 'Monthly', n: 12 },
  { value: 'quarterly', label: 'Quarterly (Indian banks)', n: 4 },
  { value: 'half-yearly', label: 'Half-yearly', n: 2 },
  { value: 'annually', label: 'Annually', n: 1 },
];

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  INR: '₹',
};

const CHART_COLORS = ['#007AFF', '#2ECC71'];

export default function FDCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [principal, setPrincipal] = useState<string>('100000');
  const [rate, setRate] = useState<string>('7');
  const [years, setYears] = useState<string>('5');
  const [months, setMonths] = useState<string>('0');
  const [compounding, setCompounding] = useState<Compounding>('quarterly');
  const [seniorCitizen, setSeniorCitizen] = useState(false);
  const [taxBracket, setTaxBracket] = useState<string>('20');

  const result = useMemo(() => {
    const P = Math.max(0, parseFloat(principal) || 0);
    const baseRate = Math.max(0, parseFloat(rate) || 0);
    const effRate = seniorCitizen ? baseRate + 0.5 : baseRate;
    const r = effRate / 100;
    const y = Math.max(0, parseFloat(years) || 0);
    const m = Math.max(0, parseFloat(months) || 0);
    const t = y + m / 12;
    const n = COMPOUNDING_OPTIONS.find((c) => c.value === compounding)?.n ?? 4;

    const maturity = P * Math.pow(1 + r / n, n * t);
    const interest = maturity - P;
    const taxRate = Math.max(0, parseFloat(taxBracket) || 0) / 100;
    const taxOnInterest = interest * taxRate;
    const postTaxMaturity = maturity - taxOnInterest;
    const tdsApplies = interest > 40000; // India: TDS @ 10% if interest > ₹40k (₹50k for seniors), simplified

    return {
      principal: P,
      effRate,
      maturity,
      interest,
      taxOnInterest,
      postTaxMaturity,
      tdsApplies,
      tenureLabel: `${y}y ${m}m`,
    };
  }, [principal, rate, years, months, compounding, seniorCitizen, taxBracket]);

  const symbol = CURRENCY_SYMBOL[currency];
  const fmt = useCallback(
    (n: number) =>
      `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    [symbol],
  );

  const chartData = useMemo(
    () => [
      { name: 'Principal', value: Math.round(result.principal) },
      { name: 'Interest', value: Math.round(result.interest) },
    ],
    [result],
  );

  const buildPdfConfig = useCallback(
    () => ({
      title: 'Fixed Deposit Calculator Report',
      subtitle: `${fmt(result.principal)} @ ${result.effRate}% for ${result.tenureLabel}`,
      filename: 'FD_Calculator.pdf',
      sections: [
        {
          type: 'inputs' as const,
          title: 'Inputs',
          inputs: [
            { label: 'Principal', value: fmt(result.principal) },
            { label: 'Interest rate', value: `${result.effRate}% p.a.` },
            { label: 'Tenure', value: result.tenureLabel },
            { label: 'Compounding', value: compounding },
            { label: 'Senior citizen', value: seniorCitizen ? 'Yes (+0.5%)' : 'No' },
            { label: 'Tax slab', value: `${taxBracket}%` },
          ],
        },
        {
          type: 'metrics' as const,
          title: 'Maturity Summary',
          metrics: [
            { label: 'Maturity value', value: fmt(result.maturity) },
            { label: 'Total interest', value: fmt(result.interest) },
            { label: 'Tax on interest', value: fmt(result.taxOnInterest) },
            { label: 'Post-tax maturity', value: fmt(result.postTaxMaturity) },
          ],
        },
      ],
    }),
    [result, fmt, compounding, seniorCitizen, taxBracket],
  );

  const buildExcelSheets = useCallback(
    () => [
      {
        name: 'FD Summary',
        rows: [
          { Field: 'Principal', Value: result.principal },
          { Field: 'Interest rate (effective)', Value: `${result.effRate}%` },
          { Field: 'Tenure', Value: result.tenureLabel },
          { Field: 'Compounding', Value: compounding },
          { Field: 'Senior citizen', Value: seniorCitizen ? 'Yes' : 'No' },
          { Field: 'Tax slab', Value: `${taxBracket}%` },
          { Field: 'Maturity value', Value: Math.round(result.maturity) },
          { Field: 'Total interest', Value: Math.round(result.interest) },
          { Field: 'Tax on interest', Value: Math.round(result.taxOnInterest) },
          { Field: 'Post-tax maturity', Value: Math.round(result.postTaxMaturity) },
        ],
      },
    ],
    [result, compounding, seniorCitizen, taxBracket],
  );

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="FD_Calculator"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`FD: ${fmt(result.principal)} grows to ${fmt(result.maturity)} in ${result.tenureLabel} at ${result.effRate}% — ${fmt(result.interest)} interest.`}
      />

      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Deposit Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Principal amount</label>
            <input
              type="number"
              min={0}
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
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
            <label className="text-xs text-slate-500 mb-1 block">Years</label>
            <input
              type="number"
              min={0}
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Months</label>
            <input
              type="number"
              min={0}
              max={11}
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
            />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Compounding & Adjustments">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Compounding frequency</label>
            <div className="flex flex-wrap gap-2">
              {COMPOUNDING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCompounding(opt.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                    compounding === opt.value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={seniorCitizen}
              onChange={(e) => setSeniorCitizen(e.target.checked)}
              className="accent-emerald-600"
            />
            Senior citizen rate (+0.5%)
          </label>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Income tax slab (%)</label>
            <div className="flex flex-wrap gap-2">
              {['0', '5', '10', '20', '30'].map((b) => (
                <button
                  key={b}
                  onClick={() => setTaxBracket(b)}
                  className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
                    taxBracket === b
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {b}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="Maturity Value" action={<CopyButton value={result.maturity.toFixed(0)} />}>
          <p className="text-2xl font-bold text-emerald-700">{fmt(result.maturity)}</p>
        </ToolCard>
        <ToolCard title="Total Interest" action={<CopyButton value={result.interest.toFixed(0)} />}>
          <p className="text-xl font-bold text-blue-700">{fmt(result.interest)}</p>
        </ToolCard>
        <ToolCard title="Tax on Interest" action={<CopyButton value={result.taxOnInterest.toFixed(0)} />}>
          <p className="text-xl font-bold text-rose-700">{fmt(result.taxOnInterest)}</p>
        </ToolCard>
        <ToolCard title="Post-Tax Maturity" action={<CopyButton value={result.postTaxMaturity.toFixed(0)} />}>
          <p className="text-xl font-bold text-emerald-700">{fmt(result.postTaxMaturity)}</p>
        </ToolCard>
      </div>

      <ToolCard title="Principal vs Interest">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={88}
                label={(d: any) => `${d.name}: ${((d.percent ?? 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => fmt(Number(v))}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ToolCard>

      {result.tdsApplies && currency === 'INR' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
          <strong>TDS reminder:</strong> Your interest of {fmt(result.interest)} crosses ₹40,000 (₹50,000 for seniors), so banks will deduct TDS at 10% — file Form 15G/15H if your total income is below the taxable limit to avoid this deduction.
        </div>
      )}
    </div>
  );
}
