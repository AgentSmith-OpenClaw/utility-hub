import React, { useCallback, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ToolCard } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

function payoff(balance: number, apr: number, monthlyPayment: number, maxMonths = 600) {
  const r = apr / 100 / 12;
  let bal = balance;
  let totalInterest = 0;
  let months = 0;
  const schedule: { month: number; balance: number; cumInterest: number }[] = [];
  while (bal > 0 && months < maxMonths) {
    months++;
    const interest = bal * r;
    if (monthlyPayment <= interest) return { months: Infinity, totalInterest: Infinity, schedule: [] };
    const principal = Math.min(monthlyPayment - interest, bal);
    bal -= principal;
    totalInterest += interest;
    if (months % 6 === 0 || bal <= 0) {
      schedule.push({ month: months, balance: Math.max(0, bal), cumInterest: totalInterest });
    }
  }
  return { months, totalInterest, schedule };
}

export default function StudentLoanCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [balance, setBalance] = useState(35000);
  const [apr, setApr] = useState(6.5);
  const [monthlyPayment, setMonthlyPayment] = useState(400);
  const [extraPayment, setExtraPayment] = useState(0);
  const [refinanceApr, setRefinanceApr] = useState(4.5);

  const standard = useMemo(() => payoff(balance, apr, monthlyPayment), [balance, apr, monthlyPayment]);
  const aggressive = useMemo(() => payoff(balance, apr, monthlyPayment + extraPayment), [balance, apr, monthlyPayment, extraPayment]);
  const refinanced = useMemo(() => payoff(balance, refinanceApr, monthlyPayment), [balance, refinanceApr, monthlyPayment]);

  const tooSmall = standard.months === Infinity;

  const compareData = useMemo(() => {
    const max = Math.max(standard.months, aggressive.months, refinanced.months);
    if (!isFinite(max)) return [];
    const data: Record<string, number>[] = [];
    const allSchedules = [standard.schedule, aggressive.schedule, refinanced.schedule];
    const allMonths = new Set<number>();
    allSchedules.forEach(s => s.forEach(p => allMonths.add(p.month)));
    Array.from(allMonths).sort((a, b) => a - b).forEach(m => {
      const std = standard.schedule.find(p => p.month === m);
      const agg = aggressive.schedule.find(p => p.month === m);
      const ref = refinanced.schedule.find(p => p.month === m);
      data.push({
        month: m,
        Standard: std?.balance ?? 0,
        Aggressive: agg?.balance ?? 0,
        Refinanced: ref?.balance ?? 0,
      });
    });
    return data;
  }, [standard, aggressive, refinanced]);

  const fmtMonths = (m: number) => isFinite(m) ? `${Math.floor(m / 12)}y ${m % 12}mo` : 'Never (payment too low)';

  const buildPdfConfig = useCallback(() => ({
    title: 'Student Loan Payoff Report',
    subtitle: `${formatCurrency(balance, currency)} @ ${apr}% · ${formatCurrency(monthlyPayment, currency)}/mo`,
    filename: 'Student_Loan.pdf',
    sections: [
      {
        type: 'inputs' as const,
        title: 'Inputs',
        inputs: [
          { label: 'Loan balance', value: formatCurrency(balance, currency) },
          { label: 'Interest rate', value: `${apr}%` },
          { label: 'Monthly payment', value: formatCurrency(monthlyPayment, currency) },
          { label: 'Extra/month', value: formatCurrency(extraPayment, currency) },
          { label: 'Refinance rate', value: `${refinanceApr}%` },
        ],
      },
      {
        type: 'metrics' as const,
        title: 'Standard plan',
        metrics: [
          { label: 'Payoff time', value: fmtMonths(standard.months) },
          { label: 'Total interest', value: isFinite(standard.totalInterest) ? formatCurrency(standard.totalInterest, currency) : '—' },
          { label: 'Payment', value: `${formatCurrency(monthlyPayment, currency)}/mo` },
          { label: 'Rate', value: `${apr}%` },
        ],
      },
      {
        type: 'metrics' as const,
        title: 'With extra payment',
        metrics: [
          { label: 'Payoff time', value: fmtMonths(aggressive.months) },
          { label: 'Total interest', value: isFinite(aggressive.totalInterest) ? formatCurrency(aggressive.totalInterest, currency) : '—' },
          { label: 'Payment', value: `${formatCurrency(monthlyPayment + extraPayment, currency)}/mo` },
          {
            label: 'Interest saved',
            value: isFinite(standard.totalInterest) && isFinite(aggressive.totalInterest)
              ? formatCurrency(standard.totalInterest - aggressive.totalInterest, currency)
              : '—',
          },
        ],
      },
      {
        type: 'metrics' as const,
        title: 'Refinanced',
        metrics: [
          { label: 'Payoff time', value: fmtMonths(refinanced.months) },
          { label: 'Total interest', value: isFinite(refinanced.totalInterest) ? formatCurrency(refinanced.totalInterest, currency) : '—' },
          { label: 'Rate', value: `${refinanceApr}%` },
          {
            label: 'Interest saved',
            value: isFinite(standard.totalInterest) && isFinite(refinanced.totalInterest)
              ? formatCurrency(standard.totalInterest - refinanced.totalInterest, currency)
              : '—',
          },
        ],
      },
    ],
  }), [balance, apr, monthlyPayment, extraPayment, refinanceApr, standard, aggressive, refinanced, currency]);

  const buildExcelSheets = useCallback(() => ([
    {
      name: 'Summary',
      rows: [
        { Field: 'Balance', Value: balance },
        { Field: 'Rate %', Value: apr },
        { Field: 'Monthly payment', Value: monthlyPayment },
        { Field: 'Extra/month', Value: extraPayment },
        { Field: 'Refinance rate %', Value: refinanceApr },
        { Field: 'Standard months', Value: isFinite(standard.months) ? standard.months : 'Never' },
        { Field: 'Standard total interest', Value: isFinite(standard.totalInterest) ? Math.round(standard.totalInterest) : 'Never' },
        { Field: 'Aggressive months', Value: isFinite(aggressive.months) ? aggressive.months : 'Never' },
        { Field: 'Aggressive total interest', Value: isFinite(aggressive.totalInterest) ? Math.round(aggressive.totalInterest) : 'Never' },
        { Field: 'Refinanced months', Value: isFinite(refinanced.months) ? refinanced.months : 'Never' },
        { Field: 'Refinanced total interest', Value: isFinite(refinanced.totalInterest) ? Math.round(refinanced.totalInterest) : 'Never' },
        { Field: 'Currency', Value: currency },
      ],
    },
    {
      name: 'Standard schedule',
      rows: standard.schedule.map((p) => ({ Month: p.month, Balance: +p.balance.toFixed(2), 'Cumulative interest': +p.cumInterest.toFixed(2) })),
    },
    {
      name: 'Aggressive schedule',
      rows: aggressive.schedule.map((p) => ({ Month: p.month, Balance: +p.balance.toFixed(2), 'Cumulative interest': +p.cumInterest.toFixed(2) })),
    },
    {
      name: 'Refinanced schedule',
      rows: refinanced.schedule.map((p) => ({ Month: p.month, Balance: +p.balance.toFixed(2), 'Cumulative interest': +p.cumInterest.toFixed(2) })),
    },
  ]), [balance, apr, monthlyPayment, extraPayment, refinanceApr, standard, aggressive, refinanced, currency]);

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Student_Loan"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`Student loan: ${formatCurrencyCompact(balance, currency)} @ ${apr}% → payoff in ${fmtMonths(standard.months)} (${formatCurrencyCompact(isFinite(standard.totalInterest) ? standard.totalInterest : 0, currency)} interest).`}
      />
      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Loan Details">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Loan balance</label>
            <input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Interest rate (%)</label>
            <input type="number" step="0.1" value={apr} onChange={(e) => setApr(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Monthly payment</label>
            <input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Extra/month</label>
            <input type="number" value={extraPayment} onChange={(e) => setExtraPayment(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div className="col-span-2 sm:col-span-2">
            <label className="text-xs text-slate-500 mb-1 block">Refinance rate (%) — for comparison</label>
            <input type="number" step="0.1" value={refinanceApr} onChange={(e) => setRefinanceApr(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
        {tooSmall && (
          <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            ⚠️ Your payment is less than the monthly interest. Increase your payment to ever pay off this loan.
          </div>
        )}
      </ToolCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ToolCard title="Standard plan">
          <p className="text-2xl font-bold text-slate-800">{fmtMonths(standard.months)}</p>
          <p className="text-xs text-slate-500 mt-1">Total interest: <strong>{formatCurrencyCompact(standard.totalInterest, currency)}</strong></p>
          <p className="text-xs text-slate-500">Payment: {formatCurrency(monthlyPayment, currency)}/mo</p>
        </ToolCard>
        <ToolCard title="With extra payment">
          <p className="text-2xl font-bold text-emerald-700">{fmtMonths(aggressive.months)}</p>
          <p className="text-xs text-slate-500 mt-1">Total interest: <strong className="text-emerald-700">{formatCurrencyCompact(aggressive.totalInterest, currency)}</strong></p>
          <p className="text-xs text-slate-500">Payment: {formatCurrency(monthlyPayment + extraPayment, currency)}/mo</p>
          {isFinite(standard.months) && isFinite(aggressive.months) && (
            <p className="text-xs text-emerald-700 mt-1">Saves {formatCurrencyCompact(standard.totalInterest - aggressive.totalInterest, currency)} & {standard.months - aggressive.months} months</p>
          )}
        </ToolCard>
        <ToolCard title="Refinanced">
          <p className="text-2xl font-bold text-blue-700">{fmtMonths(refinanced.months)}</p>
          <p className="text-xs text-slate-500 mt-1">Total interest: <strong className="text-blue-700">{formatCurrencyCompact(refinanced.totalInterest, currency)}</strong></p>
          <p className="text-xs text-slate-500">Rate: {refinanceApr}%</p>
          {isFinite(standard.months) && isFinite(refinanced.months) && (
            <p className="text-xs text-blue-700 mt-1">Saves {formatCurrencyCompact(standard.totalInterest - refinanced.totalInterest, currency)} vs standard</p>
          )}
        </ToolCard>
      </div>

      {compareData.length > 0 && (
        <ToolCard title="Balance over time">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={compareData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrencyCompact(v, currency)} />
                <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0, currency)} labelFormatter={(l) => `Month ${l}`} />
                <Legend />
                <Line type="monotone" dataKey="Standard" stroke="#64748b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Aggressive" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Refinanced" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ToolCard>
      )}

      <ToolCard title="Decision Guide">
        <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-5">
          <li><strong>Federal loans (US):</strong> Refinancing into a private loan forfeits forgiveness, IDR, and forbearance. Avoid unless you&apos;re ineligible for forgiveness and have stable income.</li>
          <li><strong>Private loans:</strong> Refinance whenever you can drop the rate by 1%+ and have credit ≥720.</li>
          <li><strong>Extra payments:</strong> Always apply to highest-rate loan first (avalanche). $50/month extra can shave years off your payoff.</li>
          <li><strong>UK Plan 2:</strong> Wages-based repayment. Many borrowers never repay in full; aggressive payoff may not save money.</li>
        </ul>
      </ToolCard>
    </div>
  );
}
