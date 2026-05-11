import React, { useCallback, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ToolCard } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

const IRA_LIMIT_2026 = 7500;
const IRA_CATCHUP_2026 = 1000;

function project(annualContrib: number, years: number, returnRate: number): number {
  let bal = 0;
  for (let i = 0; i < years; i++) {
    bal = (bal + annualContrib) * (1 + returnRate / 100);
  }
  return bal;
}

export default function RothVsTraditionalIra() {
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [annualContrib, setAnnualContrib] = useState(7500);
  const [currentTaxRate, setCurrentTaxRate] = useState(24);
  const [retirementTaxRate, setRetirementTaxRate] = useState(22);
  const [returnRate, setReturnRate] = useState(7);

  const years = retirementAge - age;
  const limit = age >= 50 ? IRA_LIMIT_2026 + IRA_CATCHUP_2026 : IRA_LIMIT_2026;
  const overLimit = annualContrib > limit;

  const result = useMemo(() => {
    // Roth: contribute post-tax, all growth + withdrawals tax-free
    // Cost out-of-pocket = annualContrib (post-tax)
    const rothBalance = project(annualContrib, years, returnRate);
    const rothAfterTax = rothBalance;

    // Traditional: contribute pre-tax, full annualContrib goes in. Withdrawals taxed at retirement rate.
    // Out-of-pocket = annualContrib * (1 - currentTaxRate/100). Tax savings can be invested in taxable account.
    const traditionalBalance = project(annualContrib, years, returnRate);
    const traditionalAfterTax = traditionalBalance * (1 - retirementTaxRate / 100);

    // Side fund: tax savings from traditional, invested in taxable (assume same return, but pay LTCG ~15% on gains)
    const annualTaxSaved = annualContrib * (currentTaxRate / 100);
    const sideFundGross = project(annualTaxSaved, years, returnRate);
    const sideFundContribTotal = annualTaxSaved * years;
    const sideFundGains = sideFundGross - sideFundContribTotal;
    const sideFundAfterTax = sideFundContribTotal + sideFundGains * (1 - 0.15);

    const traditionalTotalAfterTax = traditionalAfterTax + sideFundAfterTax;

    const winner = rothAfterTax > traditionalTotalAfterTax ? 'roth' : 'traditional';
    const diff = Math.abs(rothAfterTax - traditionalTotalAfterTax);

    return {
      rothBalance, rothAfterTax,
      traditionalBalance, traditionalAfterTax,
      sideFundAfterTax, traditionalTotalAfterTax,
      winner, diff,
    };
  }, [annualContrib, years, returnRate, currentTaxRate, retirementTaxRate]);

  const chartData = [
    { name: 'Roth IRA', 'After-tax balance': result.rothAfterTax },
    { name: 'Traditional + Side Fund', 'After-tax balance': result.traditionalTotalAfterTax },
  ];

  const buildPdfConfig = useCallback(() => ({
    title: 'Roth vs Traditional IRA Analysis',
    subtitle: `${formatCurrency(annualContrib, 'USD')}/yr · ${years} yrs · winner: ${result.winner === 'roth' ? 'Roth IRA' : 'Traditional + side fund'}`,
    filename: 'Roth_vs_Traditional_IRA.pdf',
    sections: [
      {
        type: 'inputs' as const,
        title: 'Inputs',
        inputs: [
          { label: 'Current age', value: String(age) },
          { label: 'Retirement age', value: String(retirementAge) },
          { label: 'Years to retirement', value: String(years) },
          { label: 'Annual contribution', value: formatCurrency(annualContrib, 'USD') },
          { label: 'Current tax rate', value: `${currentTaxRate}%` },
          { label: 'Retirement tax rate', value: `${retirementTaxRate}%` },
          { label: 'Expected return', value: `${returnRate}%` },
        ],
      },
      {
        type: 'metrics' as const,
        title: 'After-tax results',
        metrics: [
          { label: 'Roth IRA after-tax', value: formatCurrency(result.rothAfterTax, 'USD') },
          { label: 'Traditional after-tax', value: formatCurrency(result.traditionalAfterTax, 'USD') },
          { label: 'Side fund after-tax', value: formatCurrency(result.sideFundAfterTax, 'USD') },
          { label: 'Trad + side total', value: formatCurrency(result.traditionalTotalAfterTax, 'USD') },
        ],
      },
      {
        type: 'message' as const,
        message: {
          heading: `Winner: ${result.winner === 'roth' ? 'Roth IRA' : 'Traditional + side fund'}`,
          text: `The ${result.winner === 'roth' ? 'Roth' : 'Traditional'} approach wins by ${formatCurrency(result.diff, 'USD')} after taxes, assuming you reinvest the upfront tax savings from Traditional. Your retirement tax rate (${retirementTaxRate}%) vs current (${currentTaxRate}%) is the key driver.`,
        },
      },
    ],
  }), [age, retirementAge, years, annualContrib, currentTaxRate, retirementTaxRate, returnRate, result]);

  const buildExcelSheets = useCallback(() => ([
    {
      name: 'Comparison',
      rows: [
        { Field: 'Current age', Value: age },
        { Field: 'Retirement age', Value: retirementAge },
        { Field: 'Years', Value: years },
        { Field: 'Annual contribution', Value: annualContrib },
        { Field: 'Current tax rate %', Value: currentTaxRate },
        { Field: 'Retirement tax rate %', Value: retirementTaxRate },
        { Field: 'Expected return %', Value: returnRate },
        { Field: 'Roth pre-tax balance', Value: Math.round(result.rothBalance) },
        { Field: 'Roth after-tax balance', Value: Math.round(result.rothAfterTax) },
        { Field: 'Traditional pre-tax balance', Value: Math.round(result.traditionalBalance) },
        { Field: 'Traditional after-tax balance', Value: Math.round(result.traditionalAfterTax) },
        { Field: 'Side fund after-tax', Value: Math.round(result.sideFundAfterTax) },
        { Field: 'Traditional + side total', Value: Math.round(result.traditionalTotalAfterTax) },
        { Field: 'Winner', Value: result.winner },
        { Field: 'Winner wins by', Value: Math.round(result.diff) },
      ],
    },
  ]), [age, retirementAge, years, annualContrib, currentTaxRate, retirementTaxRate, returnRate, result]);

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Roth_vs_Traditional_IRA"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`Roth vs Traditional IRA over ${years} yrs: ${result.winner === 'roth' ? 'Roth' : 'Traditional'} wins by ${formatCurrencyCompact(result.diff, 'USD')} after taxes.`}
      />
      <ToolCard title="Your Information">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Current age</label>
            <input type="number" value={age} onChange={(e) => setAge(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Retirement age</label>
            <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Annual contribution ($)</label>
            <input type="number" value={annualContrib} onChange={(e) => setAnnualContrib(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
            <p className="text-[11px] text-slate-400 mt-1">2026 limit: {formatCurrency(limit, 'USD')}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Current tax rate (%)</label>
            <input type="number" step="1" value={currentTaxRate} onChange={(e) => setCurrentTaxRate(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Retirement tax rate (%)</label>
            <input type="number" step="1" value={retirementTaxRate} onChange={(e) => setRetirementTaxRate(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Expected return (%/yr)</label>
            <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
        {overLimit && (
          <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            ⚠️ {formatCurrency(annualContrib, 'USD')} exceeds the 2026 IRA limit of {formatCurrency(limit, 'USD')}. Excess contributions incur a 6% penalty per year.
          </div>
        )}
      </ToolCard>

      <ToolCard title={`Winner: ${result.winner === 'roth' ? '🏆 Roth IRA' : '🏆 Traditional IRA + Side Fund'}`}>
        <p className="text-sm text-slate-600">
          The {result.winner === 'roth' ? 'Roth' : 'Traditional'} IRA wins by{' '}
          <strong className="text-emerald-700">{formatCurrency(result.diff, 'USD')}</strong> after taxes,
          assuming you reinvest the upfront tax savings from Traditional.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Your retirement tax rate of <strong>{retirementTaxRate}%</strong> is{' '}
          {retirementTaxRate < currentTaxRate ? 'lower' : retirementTaxRate > currentTaxRate ? 'higher' : 'the same as'}{' '}
          your current rate of <strong>{currentTaxRate}%</strong> — this is the key driver.
        </p>
      </ToolCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolCard title="Roth IRA">
          <p className="text-2xl font-bold text-emerald-700">{formatCurrencyCompact(result.rothAfterTax, 'USD')}</p>
          <p className="text-xs text-slate-500 mt-1">Tax-free at retirement. No RMDs.</p>
          <dl className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between"><dt className="text-slate-500">Pre-tax balance</dt><dd className="font-mono">{formatCurrency(result.rothBalance, 'USD')}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Taxes owed</dt><dd className="font-mono text-emerald-700">$0</dd></div>
            <div className="flex justify-between font-semibold"><dt className="text-slate-700">After-tax</dt><dd className="font-mono text-emerald-700">{formatCurrency(result.rothAfterTax, 'USD')}</dd></div>
          </dl>
        </ToolCard>
        <ToolCard title="Traditional IRA + Side Fund">
          <p className="text-2xl font-bold text-blue-700">{formatCurrencyCompact(result.traditionalTotalAfterTax, 'USD')}</p>
          <p className="text-xs text-slate-500 mt-1">Pre-tax growth, taxed on withdrawal.</p>
          <dl className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between"><dt className="text-slate-500">Traditional pre-tax</dt><dd className="font-mono">{formatCurrency(result.traditionalBalance, 'USD')}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">After {retirementTaxRate}% tax</dt><dd className="font-mono">{formatCurrency(result.traditionalAfterTax, 'USD')}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Side fund (tax savings)</dt><dd className="font-mono">{formatCurrency(result.sideFundAfterTax, 'USD')}</dd></div>
            <div className="flex justify-between font-semibold"><dt className="text-slate-700">Total after-tax</dt><dd className="font-mono text-blue-700">{formatCurrency(result.traditionalTotalAfterTax, 'USD')}</dd></div>
          </dl>
        </ToolCard>
      </div>

      <ToolCard title="Comparison">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrencyCompact(v, 'USD')} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0, 'USD')} />
              <Legend />
              <Bar dataKey="After-tax balance" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ToolCard>

      <ToolCard title="Key Differences">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-500 font-medium">Feature</th>
                <th className="text-left py-2 px-3 text-emerald-700 font-semibold">Roth IRA</th>
                <th className="text-left py-2 px-3 text-blue-700 font-semibold">Traditional IRA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="py-2 text-slate-600">Contribution tax</td><td className="py-2 px-3">Post-tax (no deduction)</td><td className="py-2 px-3">Pre-tax (deductible)</td></tr>
              <tr><td className="py-2 text-slate-600">Withdrawal tax</td><td className="py-2 px-3">Tax-free</td><td className="py-2 px-3">Taxed as ordinary income</td></tr>
              <tr><td className="py-2 text-slate-600">RMDs</td><td className="py-2 px-3">None during your lifetime</td><td className="py-2 px-3">Required at age 73</td></tr>
              <tr><td className="py-2 text-slate-600">Income limits</td><td className="py-2 px-3">$165k single / $246k MFJ</td><td className="py-2 px-3">No income limit (deduction phases out)</td></tr>
              <tr><td className="py-2 text-slate-600">Best when</td><td className="py-2 px-3">Tax rate ↑ in retirement</td><td className="py-2 px-3">Tax rate ↓ in retirement</td></tr>
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  );
}
