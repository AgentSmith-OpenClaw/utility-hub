import React, { useCallback, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ToolCard } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

interface MonthRow { month: number; principal: number; interest: number; balance: number; cumInterest: number; cumPrincipal: number; }

function buildSchedule(loanAmount: number, apr: number, months: number): MonthRow[] {
  if (loanAmount <= 0 || months <= 0) return [];
  const r = apr / 100 / 12;
  const payment = r === 0 ? loanAmount / months : (loanAmount * r) / (1 - Math.pow(1 + r, -months));
  let bal = loanAmount;
  let cumInterest = 0;
  let cumPrincipal = 0;
  const rows: MonthRow[] = [];
  for (let m = 1; m <= months; m++) {
    const interest = bal * r;
    const principal = payment - interest;
    bal -= principal;
    cumInterest += interest;
    cumPrincipal += principal;
    rows.push({ month: m, principal, interest, balance: Math.max(0, bal), cumInterest, cumPrincipal });
  }
  return rows;
}

export default function AutoLoanCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeIn, setTradeIn] = useState(0);
  const [salesTaxPct, setSalesTaxPct] = useState(7);
  const [fees, setFees] = useState(500);
  const [apr, setApr] = useState(7.5);
  const [termMonths, setTermMonths] = useState(60);

  const taxAmount = vehiclePrice * salesTaxPct / 100;
  const loanAmount = Math.max(0, vehiclePrice + taxAmount + fees - downPayment - tradeIn);

  const schedule = useMemo(() => buildSchedule(loanAmount, apr, termMonths), [loanAmount, apr, termMonths]);
  const monthly = schedule[0]?.principal + schedule[0]?.interest || 0;
  const totalInterest = schedule.length ? schedule[schedule.length - 1].cumInterest : 0;
  const totalCost = vehiclePrice + taxAmount + fees + totalInterest;

  const chartData = schedule.filter((_, i) => i % Math.max(1, Math.floor(termMonths / 30)) === 0).map(r => ({
    month: r.month,
    Balance: Math.round(r.balance),
    'Interest paid': Math.round(r.cumInterest),
    'Principal paid': Math.round(r.cumPrincipal),
  }));

  const buildPdfConfig = useCallback(() => ({
    title: 'Auto Loan Calculator Report',
    subtitle: `${formatCurrency(vehiclePrice, currency)} vehicle · ${apr}% APR · ${termMonths}-month term`,
    filename: 'Auto_Loan.pdf',
    sections: [
      {
        type: 'inputs' as const,
        title: 'Inputs',
        inputs: [
          { label: 'Vehicle price', value: formatCurrency(vehiclePrice, currency) },
          { label: 'Down payment', value: formatCurrency(downPayment, currency) },
          { label: 'Trade-in', value: formatCurrency(tradeIn, currency) },
          { label: 'Sales tax', value: `${salesTaxPct}%` },
          { label: 'Fees', value: formatCurrency(fees, currency) },
          { label: 'APR', value: `${apr}%` },
          { label: 'Term', value: `${termMonths} months` },
          { label: 'Loan amount', value: formatCurrency(loanAmount, currency) },
        ],
      },
      {
        type: 'metrics' as const,
        title: 'Results',
        metrics: [
          { label: 'Monthly payment', value: formatCurrency(monthly, currency) },
          { label: 'Total interest', value: formatCurrency(totalInterest, currency) },
          { label: 'Total out of pocket', value: formatCurrency(totalCost, currency) },
          { label: 'Loan / price', value: `${((loanAmount / Math.max(1, vehiclePrice)) * 100).toFixed(1)}%` },
        ],
      },
      {
        type: 'table' as const,
        title: 'Yearly summary',
        table: {
          title: '',
          columns: [
            { header: 'Year', key: 'year', align: 'left' as const },
            { header: 'Principal paid', key: 'principal', align: 'right' as const },
            { header: 'Interest paid', key: 'interest', align: 'right' as const },
            { header: 'Remaining balance', key: 'balance', align: 'right' as const },
          ],
          rows: Array.from({ length: Math.ceil(termMonths / 12) }, (_, y) => {
            const start = y * 12;
            const end = Math.min(start + 12, schedule.length) - 1;
            if (end < 0) return null;
            const startRow = schedule[start];
            const endRow = schedule[end];
            return {
              year: y + 1,
              principal: formatCurrency(endRow.cumPrincipal - (start === 0 ? 0 : schedule[start - 1].cumPrincipal), currency),
              interest: formatCurrency(endRow.cumInterest - (start === 0 ? 0 : schedule[start - 1].cumInterest), currency),
              balance: formatCurrency(endRow.balance, currency),
            };
          }).filter(Boolean) as Record<string, string | number>[],
        },
      },
    ],
  }), [vehiclePrice, downPayment, tradeIn, salesTaxPct, fees, apr, termMonths, loanAmount, monthly, totalInterest, totalCost, schedule, currency]);

  const buildExcelSheets = useCallback(() => ([
    {
      name: 'Summary',
      rows: [
        { Field: 'Vehicle price', Value: vehiclePrice },
        { Field: 'Down payment', Value: downPayment },
        { Field: 'Trade-in', Value: tradeIn },
        { Field: 'Sales tax %', Value: salesTaxPct },
        { Field: 'Fees', Value: fees },
        { Field: 'APR %', Value: apr },
        { Field: 'Term (months)', Value: termMonths },
        { Field: 'Loan amount', Value: Math.round(loanAmount) },
        { Field: 'Monthly payment', Value: +monthly.toFixed(2) },
        { Field: 'Total interest', Value: Math.round(totalInterest) },
        { Field: 'Total out of pocket', Value: Math.round(totalCost) },
        { Field: 'Currency', Value: currency },
      ],
    },
    {
      name: 'Amortization',
      rows: schedule.map((r) => ({
        Month: r.month,
        Principal: +r.principal.toFixed(2),
        Interest: +r.interest.toFixed(2),
        'Cumulative principal': +r.cumPrincipal.toFixed(2),
        'Cumulative interest': +r.cumInterest.toFixed(2),
        'Remaining balance': +r.balance.toFixed(2),
      })),
    },
    {
      name: 'Term comparison',
      rows: [36, 48, 60, 72, 84].map((m) => {
        const sched = buildSchedule(loanAmount, apr, m);
        const mp = sched[0] ? sched[0].principal + sched[0].interest : 0;
        const ti = sched.length ? sched[sched.length - 1].cumInterest : 0;
        return {
          'Term (months)': m,
          'Monthly payment': +mp.toFixed(2),
          'Total interest': Math.round(ti),
          'Total cost': Math.round(loanAmount + ti),
        };
      }),
    },
  ]), [vehiclePrice, downPayment, tradeIn, salesTaxPct, fees, apr, termMonths, loanAmount, monthly, totalInterest, totalCost, schedule, currency]);

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Auto_Loan"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`Auto loan: ${formatCurrencyCompact(vehiclePrice, currency)} @ ${apr}% for ${termMonths} months = ${formatCurrency(monthly, currency)}/mo (${formatCurrencyCompact(totalInterest, currency)} interest).`}
      />
      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Vehicle & Financing">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Vehicle price</label>
            <input type="number" value={vehiclePrice} onChange={(e) => setVehiclePrice(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Down payment</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Trade-in value</label>
            <input type="number" value={tradeIn} onChange={(e) => setTradeIn(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Sales tax (%)</label>
            <input type="number" step="0.1" value={salesTaxPct} onChange={(e) => setSalesTaxPct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Fees (title, doc)</label>
            <input type="number" value={fees} onChange={(e) => setFees(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">APR (%)</label>
            <input type="number" step="0.1" value={apr} onChange={(e) => setApr(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs text-slate-500 mb-1 block">Loan term: {termMonths} months ({(termMonths / 12).toFixed(1)} years)</label>
          <input type="range" min={12} max={84} step={6} value={termMonths} onChange={(e) => setTermMonths(+e.target.value)} className="w-full accent-emerald-600" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>12 mo</span>
            <span>36 mo</span>
            <span>48 mo</span>
            <span>60 mo</span>
            <span>72 mo</span>
            <span>84 mo</span>
          </div>
        </div>
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="Monthly payment">
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(monthly, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">for {termMonths} months</p>
        </ToolCard>
        <ToolCard title="Loan amount">
          <p className="text-xl font-bold text-slate-800">{formatCurrencyCompact(loanAmount, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">price + tax + fees − down/trade</p>
        </ToolCard>
        <ToolCard title="Total interest">
          <p className="text-xl font-bold text-rose-700">{formatCurrencyCompact(totalInterest, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">over loan life</p>
        </ToolCard>
        <ToolCard title="Total out of pocket">
          <p className="text-xl font-bold text-slate-800">{formatCurrencyCompact(totalCost, currency)}</p>
          <p className="text-xs text-slate-500 mt-1">all-in</p>
        </ToolCard>
      </div>

      <ToolCard title="Loan Balance Over Time">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrencyCompact(v, currency)} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0, currency)} labelFormatter={(l) => `Month ${l}`} />
              <Legend />
              <Line type="monotone" dataKey="Balance" stroke="#10b981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Principal paid" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Interest paid" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ToolCard>

      <ToolCard title="Term Length Comparison">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-500 font-medium">Term</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Monthly</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Total interest</th>
                <th className="text-right py-2 px-3 text-slate-500 font-medium">Total cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[36, 48, 60, 72, 84].map((m) => {
                const sched = buildSchedule(loanAmount, apr, m);
                const monthly = sched[0] ? sched[0].principal + sched[0].interest : 0;
                const interest = sched.length ? sched[sched.length - 1].cumInterest : 0;
                return (
                  <tr key={m} className={termMonths === m ? 'bg-emerald-50' : ''}>
                    <td className="py-2 font-mono">{m} mo</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(monthly, currency)}</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-700">{formatCurrency(interest, currency)}</td>
                    <td className="py-2 px-3 text-right font-mono">{formatCurrency(loanAmount + interest, currency)}</td>
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
