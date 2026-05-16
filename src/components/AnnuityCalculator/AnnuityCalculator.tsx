import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAnnuityCalculator } from '../../hooks/useAnnuityCalculator';
import { fmtUSD } from './AnnuityCalculator.utils';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import { CHART_COLORS, PIE_COLORS } from '../../utils/chartColors';
import type { AnnuityMode, PaymentFrequency, TvmSolveFor, PaymentTiming } from './AnnuityCalculator.types';

interface NumInputProps { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; min?: number; max?: number; }
const NumInput: React.FC<NumInputProps> = ({ label, value, onChange, prefix, suffix, min = 0, max }) => {
  const [focused, setFocused] = useState(false);
  const [display, setDisplay] = useState(value.toLocaleString());
  React.useEffect(() => { if (!focused) setDisplay(value.toLocaleString()); }, [value, focused]);
  return (
    <div className="mb-4 last:mb-0">
      <label className="text-sm font-semibold text-slate-700 block mb-1.5">{label}</label>
      <div className={`flex items-center bg-white rounded-lg border-2 px-3 py-2.5 min-h-[44px] transition-all ${focused ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
        {prefix && <span className="text-slate-400 font-semibold mr-1.5">{prefix}</span>}
        <input type="text" value={display} onFocus={(e) => { setFocused(true); setDisplay(value.toString()); e.target.select(); }} onBlur={() => { setFocused(false); const p = parseFloat(display.replace(/[^0-9.]/g, '')); if (!isNaN(p)) { const c = max !== undefined ? Math.min(p, max) : p; onChange(Math.max(min, c)); } else setDisplay(value.toLocaleString()); }} onChange={(e) => setDisplay(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} className="flex-1 bg-transparent outline-none text-slate-900 font-semibold" />
        {suffix && <span className="text-slate-400 text-sm ml-1.5">{suffix}</span>}
      </div>
    </div>
  );
};

export default function AnnuityCalculator() {
  const { inputs, result, update, updateImmediate, updateDeferred, updateFixed } = useAnnuityCalculator();

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'Annuity Calculator Report',
    subtitle: inputs.mode === 'immediate' ? 'Immediate Annuity (SPIA)' : inputs.mode === 'deferred' ? 'Deferred Annuity' : 'Fixed-Period TVM',
    filename: 'Annuity_Calculator.pdf',
    sections: [{ type: 'metrics', title: 'Results', metrics: inputs.mode === 'immediate' && result.immediate ? [
      { label: 'Periodic Payment', value: fmtUSD(result.immediate.periodicPayment) },
      { label: 'Total Payout', value: fmtUSD(result.immediate.totalPayout) },
      { label: 'Total Interest', value: fmtUSD(result.immediate.totalInterest) },
    ] : inputs.mode === 'deferred' && result.deferred ? [
      { label: 'Projected Balance', value: fmtUSD(result.deferred.projectedBalance) },
      { label: 'Total Contributions', value: fmtUSD(result.deferred.totalContributions) },
      { label: 'Total Growth', value: fmtUSD(result.deferred.totalGrowth) },
    ] : result.fixedPeriod ? [
      { label: result.fixedPeriod.solvedLabel, value: fmtUSD(result.fixedPeriod.solved) },
    ] : [] }],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => {
    if (inputs.mode === 'immediate' && result.immediate) {
      return [{ name: 'Balance', rows: result.immediate.balanceData.map(d => ({ Period: d.period, Balance: d.balance })) }];
    }
    if (inputs.mode === 'deferred' && result.deferred) {
      return [{ name: 'Growth', rows: result.deferred.growthData.map(d => ({ Year: d.year, Contributions: d.contributions, Growth: d.growth, Total: d.total })) }];
    }
    return [{ name: 'Result', rows: result.fixedPeriod ? [{ Result: result.fixedPeriod.solvedLabel, Value: result.fixedPeriod.solved }] : [] }];
  };

  const shareMessage = result.immediate
    ? `Annuity: $${inputs.immediate.principal.toLocaleString()} → ${fmtUSD(result.immediate.periodicPayment)}/${inputs.immediate.frequency.replace('ly','')} for ${inputs.immediate.years} years. Total payout: ${fmtUSD(result.immediate.totalPayout)}. Toolisk.`
    : result.deferred
    ? `Deferred annuity: ${inputs.deferred.yearsAccumulation}-year accumulation → ${fmtUSD(result.deferred.projectedBalance)}. Toolisk.`
    : `Fixed-period TVM solved at Toolisk.`;

  const modeTabs: { id: AnnuityMode; label: string }[] = [
    { id: 'immediate', label: 'Immediate (SPIA)' },
    { id: 'deferred', label: 'Deferred' },
    { id: 'fixedPeriod', label: 'Fixed-Period' },
  ];

  const pieCols = result.immediate ? [
    { name: 'Principal', value: inputs.immediate.principal },
    { name: 'Interest', value: result.immediate.totalInterest },
  ] : result.deferred ? [
    { name: 'Contributions', value: result.deferred.totalContributions },
    { name: 'Growth', value: result.deferred.totalGrowth },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-3xl">💎</span>
          <div>
            <h1 className="text-2xl font-bold">Annuity Calculator</h1>
            <p className="text-violet-100 text-sm mt-0.5">Immediate income, deferred accumulation, and fixed-period TVM — all in one tool.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <ExportShareBar filenameBase="Annuity_Calculator" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        {/* Mode switcher */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {modeTabs.map((t) => (
            <button key={t.id} onClick={() => update({ mode: t.id })}
              className={`px-4 py-2 rounded-lg text-sm font-semibold min-h-[44px] transition-all ${inputs.mode === t.id ? 'bg-violet-700 text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:border-violet-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {inputs.mode === 'immediate' && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4"><span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Immediate Annuity (SPIA)</span></div>
                <NumInput label="Premium / Principal" value={inputs.immediate.principal} onChange={(v) => updateImmediate({ principal: v })} prefix="$" />
                <NumInput label="Guaranteed Annual Rate" value={inputs.immediate.annualRate} onChange={(v) => updateImmediate({ annualRate: v })} suffix="%" min={0} max={20} />
                <NumInput label="Payout Period" value={inputs.immediate.years} onChange={(v) => updateImmediate({ years: v })} suffix="yrs" min={1} max={40} />
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Payment Frequency</label>
                  <select value={inputs.immediate.frequency} onChange={(e) => updateImmediate({ frequency: e.target.value as PaymentFrequency })}
                    className="w-full bg-white rounded-lg border-2 border-slate-200 px-3 py-2.5 min-h-[44px] text-slate-900 font-medium outline-none hover:border-slate-300 focus:border-blue-400">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <NumInput label="Annual COLA (inflation adjustment)" value={inputs.immediate.cola} onChange={(v) => updateImmediate({ cola: v })} suffix="%" min={0} max={5} />
              </div>
            )}

            {inputs.mode === 'deferred' && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4"><span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Deferred Annuity</span></div>
                <NumInput label="Starting Balance" value={inputs.deferred.startingBalance} onChange={(v) => updateDeferred({ startingBalance: v })} prefix="$" />
                <NumInput label="Periodic Contribution" value={inputs.deferred.periodicContribution} onChange={(v) => updateDeferred({ periodicContribution: v })} prefix="$" />
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Contribution Frequency</label>
                  <select value={inputs.deferred.contribFrequency} onChange={(e) => updateDeferred({ contribFrequency: e.target.value as PaymentFrequency })}
                    className="w-full bg-white rounded-lg border-2 border-slate-200 px-3 py-2.5 min-h-[44px] text-slate-900 font-medium outline-none hover:border-slate-300 focus:border-blue-400">
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <NumInput label="Years Until Annuitization" value={inputs.deferred.yearsAccumulation} onChange={(v) => updateDeferred({ yearsAccumulation: v })} suffix="yrs" min={1} max={50} />
                <NumInput label="Expected Annual Return" value={inputs.deferred.expectedReturn} onChange={(v) => updateDeferred({ expectedReturn: v })} suffix="%" min={0} max={20} />
                <div className="mb-4 flex items-center gap-2">
                  <input type="checkbox" id="showIncome" checked={inputs.deferred.showIncome} onChange={(e) => updateDeferred({ showIncome: e.target.checked })} className="w-4 h-4 accent-violet-600" />
                  <label htmlFor="showIncome" className="text-sm font-semibold text-slate-700">Show post-annuitization income</label>
                </div>
                {inputs.deferred.showIncome && (
                  <NumInput label="Years of Income" value={inputs.deferred.incomeYears} onChange={(v) => updateDeferred({ incomeYears: v })} suffix="yrs" min={1} max={40} />
                )}
              </div>
            )}

            {inputs.mode === 'fixedPeriod' && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-4"><span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Fixed-Period TVM</span></div>
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Solve For</label>
                  <select value={inputs.fixedPeriod.solveFor} onChange={(e) => updateFixed({ solveFor: e.target.value as TvmSolveFor })}
                    className="w-full bg-white rounded-lg border-2 border-slate-200 px-3 py-2.5 min-h-[44px] text-slate-900 font-medium outline-none hover:border-slate-300 focus:border-blue-400">
                    <option value="payment">Payment (PMT)</option>
                    <option value="futureValue">Future Value (FV)</option>
                    <option value="presentValue">Present Value (PV)</option>
                  </select>
                </div>
                {inputs.fixedPeriod.solveFor !== 'presentValue' && <NumInput label="Present Value" value={inputs.fixedPeriod.presentValue} onChange={(v) => updateFixed({ presentValue: v })} prefix="$" />}
                {inputs.fixedPeriod.solveFor !== 'payment' && <NumInput label="Payment (PMT)" value={inputs.fixedPeriod.payment} onChange={(v) => updateFixed({ payment: v })} prefix="$" />}
                {inputs.fixedPeriod.solveFor !== 'futureValue' && <NumInput label="Future Value" value={inputs.fixedPeriod.futureValue} onChange={(v) => updateFixed({ futureValue: v })} prefix="$" />}
                <NumInput label="Annual Rate" value={inputs.fixedPeriod.annualRate} onChange={(v) => updateFixed({ annualRate: v })} suffix="%" min={0} max={30} />
                <NumInput label="Years" value={inputs.fixedPeriod.years} onChange={(v) => updateFixed({ years: v })} suffix="yrs" min={1} max={50} />
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Payment Timing</label>
                  <div className="flex gap-2">
                    {(['ordinary', 'due'] as PaymentTiming[]).map((t) => (
                      <button key={t} onClick={() => updateFixed({ timing: t })}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium min-h-[44px] transition-all ${inputs.fixedPeriod.timing === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {t === 'ordinary' ? 'End of Period' : 'Start of Period'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-700 mb-4">Results</h2>

              {inputs.mode === 'immediate' && result.immediate && (
                <div className="space-y-4">
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      {inputs.immediate.frequency === 'monthly' ? 'Monthly' : inputs.immediate.frequency === 'quarterly' ? 'Quarterly' : 'Annual'} Payment
                    </p>
                    <p className="text-4xl font-black text-violet-700">{fmtUSD(result.immediate.periodicPayment)}</p>
                    {inputs.immediate.cola > 0 && <p className="text-xs text-slate-400 mt-1">First payment: {fmtUSD(result.immediate.periodicPayment)} → grows {inputs.immediate.cola}%/yr</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Total Payout</p><p className="text-xl font-bold text-slate-900">{fmtUSD(result.immediate.totalPayout)}</p></div>
                    <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Interest Earned</p><p className="text-xl font-bold text-emerald-700">{fmtUSD(result.immediate.totalInterest)}</p></div>
                  </div>
                </div>
              )}

              {inputs.mode === 'deferred' && result.deferred && (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Projected Balance at Annuitization</p>
                    <p className="text-4xl font-black text-purple-700">{fmtUSD(result.deferred.projectedBalance)}</p>
                    {result.deferred.monthlyIncome && <p className="text-sm text-purple-600 mt-1 font-medium">→ {fmtUSD(result.deferred.monthlyIncome)}/mo for {inputs.deferred.incomeYears} years</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Total Contributions</p><p className="text-xl font-bold text-slate-900">{fmtUSD(result.deferred.totalContributions)}</p></div>
                    <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Total Growth</p><p className="text-xl font-bold text-emerald-700">{fmtUSD(result.deferred.totalGrowth)}</p></div>
                  </div>
                </div>
              )}

              {inputs.mode === 'fixedPeriod' && result.fixedPeriod && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{result.fixedPeriod.solvedLabel}</p>
                  <p className="text-4xl font-black text-indigo-700">{fmtUSD(result.fixedPeriod.solved)}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              {inputs.mode === 'immediate' && result.immediate && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Balance over time (annuity drawdown)</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={result.immediate.balanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="period" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                      <Line type="monotone" dataKey="balance" name="Balance" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {inputs.mode === 'deferred' && result.deferred && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Contributions vs growth over accumulation period</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={result.deferred.growthData.filter((_, i) => i % 2 === 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                      <Legend />
                      <Bar dataKey="contributions" name="Contributions" stackId="a" fill={CHART_COLORS.primary} />
                      <Bar dataKey="growth" name="Growth" stackId="a" fill={CHART_COLORS.teal} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {inputs.mode === 'fixedPeriod' && result.fixedPeriod && (
                <div className="text-center py-12">
                  <p className="text-slate-500">Switch to Immediate or Deferred mode to see charts.</p>
                  {pieCols.length > 0 && (
                    <div className="flex items-center justify-center mt-4">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={pieCols} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                            {pieCols.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {(inputs.mode === 'immediate' || inputs.mode === 'deferred') && pieCols.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3">Composition breakdown</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieCols} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {pieCols.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
