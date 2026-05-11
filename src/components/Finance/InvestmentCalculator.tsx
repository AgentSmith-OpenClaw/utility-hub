import React, { useCallback, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { ToolCard } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

interface YearRow {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
  realBalance: number;
}

function project(initial: number, monthly: number, annualReturn: number, years: number, inflation: number, monthlyStepUp: number): YearRow[] {
  const monthlyRate = annualReturn / 100 / 12;
  let bal = initial;
  let contribs = initial;
  let mthly = monthly;
  const rows: YearRow[] = [];
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      bal = (bal + mthly) * (1 + monthlyRate);
      contribs += mthly;
    }
    const realBalance = bal / Math.pow(1 + inflation / 100, y);
    rows.push({
      year: y,
      contributions: Math.round(contribs),
      interest: Math.round(bal - contribs),
      balance: Math.round(bal),
      realBalance: Math.round(realBalance),
    });
    mthly *= 1 + monthlyStepUp / 100;
  }
  return rows;
}

export default function InvestmentCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [inflation, setInflation] = useState(3);
  const [stepUp, setStepUp] = useState(0);

  const projection = useMemo(
    () => project(initial, monthly, annualReturn, years, inflation, stepUp),
    [initial, monthly, annualReturn, years, inflation, stepUp],
  );

  const final = projection[projection.length - 1];

  const chartData = projection.map(p => ({
    year: p.year,
    Balance: p.balance,
    Contributions: p.contributions,
    'Real (inflation-adjusted)': p.realBalance,
  }));

  const buildPdfConfig = useCallback(() => ({
    title: 'Investment Calculator Report',
    subtitle: `${formatCurrency(initial, currency)} initial + ${formatCurrency(monthly, currency)}/mo for ${years} years @ ${annualReturn}%`,
    filename: 'Investment_Calculator.pdf',
    sections: [
      {
        type: 'inputs' as const,
        title: 'Inputs',
        inputs: [
          { label: 'Initial lump sum', value: formatCurrency(initial, currency) },
          { label: 'Monthly contribution', value: formatCurrency(monthly, currency) },
          { label: 'Years', value: String(years) },
          { label: 'Annual return', value: `${annualReturn}%` },
          { label: 'Inflation', value: `${inflation}%` },
          { label: 'Annual step-up', value: `${stepUp}%` },
        ],
      },
      {
        type: 'metrics' as const,
        title: 'Final results',
        metrics: [
          { label: 'Final balance', value: formatCurrency(final?.balance ?? 0, currency) },
          { label: 'You contributed', value: formatCurrency(final?.contributions ?? 0, currency) },
          { label: 'Investment growth', value: formatCurrency(final?.interest ?? 0, currency) },
          { label: `Real (today's ${currency})`, value: formatCurrency(final?.realBalance ?? 0, currency) },
        ],
      },
      {
        type: 'table' as const,
        title: 'Year-by-year projection',
        table: {
          title: '',
          columns: [
            { header: 'Year', key: 'year', align: 'left' as const },
            { header: 'Contributions', key: 'contributions', align: 'right' as const },
            { header: 'Growth', key: 'growth', align: 'right' as const },
            { header: 'Balance', key: 'balance', align: 'right' as const },
            { header: 'Real', key: 'real', align: 'right' as const },
          ],
          rows: projection.map((p) => ({
            year: p.year,
            contributions: formatCurrency(p.contributions, currency),
            growth: formatCurrency(p.interest, currency),
            balance: formatCurrency(p.balance, currency),
            real: formatCurrency(p.realBalance, currency),
          })),
          maxRows: 40,
        },
      },
    ],
  }), [initial, monthly, years, annualReturn, inflation, stepUp, final, projection, currency]);

  const buildExcelSheets = useCallback(() => ([
    {
      name: 'Summary',
      rows: [
        { Field: 'Initial lump sum', Value: initial },
        { Field: 'Monthly contribution', Value: monthly },
        { Field: 'Years', Value: years },
        { Field: 'Annual return %', Value: annualReturn },
        { Field: 'Inflation %', Value: inflation },
        { Field: 'Annual step-up %', Value: stepUp },
        { Field: 'Final balance', Value: final?.balance ?? 0 },
        { Field: 'Total contributed', Value: final?.contributions ?? 0 },
        { Field: 'Investment growth', Value: final?.interest ?? 0 },
        { Field: 'Real (inflation-adjusted)', Value: final?.realBalance ?? 0 },
        { Field: 'Currency', Value: currency },
      ],
    },
    {
      name: 'Year-by-year',
      rows: projection.map((p) => ({
        Year: p.year,
        Contributions: p.contributions,
        Growth: p.interest,
        Balance: p.balance,
        'Real balance': p.realBalance,
      })),
    },
  ]), [initial, monthly, years, annualReturn, inflation, stepUp, final, projection, currency]);

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Investment_Calculator"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`Investing ${formatCurrency(monthly, currency)}/mo for ${years} years @ ${annualReturn}% grows to ${formatCurrencyCompact(final?.balance ?? 0, currency)}.`}
      />
      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Investment Plan">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Initial lump sum</label>
            <input type="number" value={initial} onChange={(e) => setInitial(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Monthly contribution</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Years</label>
            <input type="number" min={1} max={60} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Annual return (%)</label>
            <input type="number" step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Inflation (%)</label>
            <input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Annual step-up (%)</label>
            <input type="number" step="0.5" value={stepUp} onChange={(e) => setStepUp(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="Final balance">
          <p className="text-2xl font-bold text-emerald-700">{formatCurrencyCompact(final?.balance ?? 0, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(final?.balance ?? 0, currency)}</p>
        </ToolCard>
        <ToolCard title="You contributed">
          <p className="text-xl font-bold text-slate-800">{formatCurrencyCompact(final?.contributions ?? 0, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">over {years} years</p>
        </ToolCard>
        <ToolCard title="Investment growth">
          <p className="text-xl font-bold text-blue-700">{formatCurrencyCompact(final?.interest ?? 0, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">compound returns</p>
        </ToolCard>
        <ToolCard title="Real value (today's $)">
          <p className="text-xl font-bold text-amber-700">{formatCurrencyCompact(final?.realBalance ?? 0, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">adjusted for {inflation}% inflation</p>
        </ToolCard>
      </div>

      <ToolCard title="Growth Over Time">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="contGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#64748b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrencyCompact(v, currency)} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0, currency)} labelFormatter={(l) => `Year ${l}`} />
              <Legend />
              <Area type="monotone" dataKey="Balance" stroke="#10b981" fill="url(#balGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="Contributions" stroke="#64748b" fill="url(#contGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="Real (inflation-adjusted)" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ToolCard>

      <ToolCard title="Lump Sum vs DCA Comparison">
        <p className="text-sm text-slate-600 mb-3">
          Same total ({formatCurrencyCompact(final?.contributions ?? 0, currency)}) invested as lump sum on day one vs spread monthly:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs text-slate-500">Lump sum on day 1</div>
            <div className="text-xl font-bold text-emerald-700">
              {formatCurrencyCompact((final?.contributions ?? 0) * Math.pow(1 + annualReturn / 100, years), currency)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">All money compounds longest</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs text-slate-500">Dollar-cost averaging</div>
            <div className="text-xl font-bold text-blue-700">{formatCurrencyCompact(final?.balance ?? 0, currency)}</div>
            <div className="text-[11px] text-slate-400 mt-1">Smooths volatility, lower returns</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Historically lump sum beats DCA ~70% of the time, but DCA hedges against bad market timing.</p>
      </ToolCard>
    </div>
  );
}
