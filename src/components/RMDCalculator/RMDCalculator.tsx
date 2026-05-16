import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useRMDCalculator } from '../../hooks/useRMDCalculator';
import { fmtUSD, UNIFORM_LIFETIME_TABLE } from './RMDCalculator.utils';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import { CHART_COLORS, PIE_COLORS } from '../../utils/chartColors';
import type { FilingStatus } from './RMDCalculator.types';

interface NumInputProps { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; min?: number; max?: number; tooltip?: string; }

const NumInput: React.FC<NumInputProps> = ({ label, value, onChange, prefix, suffix, min = 0, max, tooltip }) => {
  const [focused, setFocused] = useState(false);
  const [display, setDisplay] = useState(value.toLocaleString());
  React.useEffect(() => { if (!focused) setDisplay(value.toLocaleString()); }, [value, focused]);
  return (
    <div className="mb-4 last:mb-0">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">{label}{tooltip && <span className="group relative"><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] text-slate-500 cursor-help font-bold">?</span><span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-20 shadow-xl w-56">{tooltip}</span></span>}</label>
      <div className={`flex items-center bg-white rounded-lg border-2 px-3 py-2.5 min-h-[44px] transition-all ${focused ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
        {prefix && <span className="text-slate-400 font-semibold mr-1.5">{prefix}</span>}
        <input type="text" value={display} onFocus={(e) => { setFocused(true); setDisplay(value.toString()); e.target.select(); }} onBlur={() => { setFocused(false); const p = parseFloat(display.replace(/[^0-9.]/g, '')); if (!isNaN(p)) { const c = max !== undefined ? Math.min(p, max) : p; onChange(Math.max(min, c)); } else setDisplay(value.toLocaleString()); }} onChange={(e) => setDisplay(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} className="flex-1 bg-transparent outline-none text-slate-900 font-semibold" />
        {suffix && <span className="text-slate-400 text-sm ml-1.5">{suffix}</span>}
      </div>
    </div>
  );
};

export default function RMDCalculator() {
  const { inputs, result, update } = useRMDCalculator();
  const [tab, setTab] = useState<'bar' | 'balance' | 'pie'>('bar');

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'RMD Analysis Report',
    subtitle: `Age ${inputs.currentAge} • Balance $${inputs.priorYearBalance.toLocaleString()}`,
    filename: 'RMD_Calculator.pdf',
    sections: [
      { type: 'metrics', title: 'Current Year RMD', metrics: [
        { label: 'Current RMD', value: fmtUSD(result.currentRMD) },
        { label: 'Distribution Period (Divisor)', value: result.divisorUsed.toString() },
        { label: 'Estimated Federal Tax', value: fmtUSD(result.estimatedFedTax) },
        { label: 'Net After Tax', value: fmtUSD(result.netAfterTax) },
        { label: `Cumulative RMDs to age ${inputs.projectUntilAge}`, value: fmtUSD(result.cumulativeRMDs) },
        { label: 'Final Projected Balance', value: fmtUSD(result.finalBalance) },
      ]},
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    { name: 'RMD Projection', rows: result.projection.map(r => ({ Age: r.age, Balance: r.balance, Divisor: r.divisor, RMD: r.rmd, 'Federal Tax': r.federalTax, 'Net to You': r.netAfterTax, 'Cumulative RMD': r.cumulativeRMD })) },
  ];

  const shareMessage = `RMD Calculator: Age ${inputs.currentAge}, ${fmtUSD(inputs.priorYearBalance)} balance → ${fmtUSD(result.currentRMD)} required this year. Calculate yours at Toolisk.`;

  const pieData = [
    { name: 'Net to You', value: Math.round(result.cumulativeRMDs - result.cumulativeTaxes) },
    { name: 'Federal Taxes', value: Math.round(result.cumulativeTaxes) },
    { name: 'Remaining Balance', value: Math.round(Math.max(0, result.finalBalance)) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-3xl">📋</span>
          <div>
            <h1 className="text-2xl font-bold">RMD Calculator</h1>
            <p className="text-indigo-100 text-sm mt-0.5">IRS Required Minimum Distribution — compute current year RMD and project decades of future withdrawals.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <ExportShareBar filenameBase="RMD_Calculator" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        {result.notYetRequired && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-800 text-sm font-medium">
            ℹ️ You are not yet subject to RMDs. Your first RMD year will be age 73 (under SECURE 2.0 — rises to 75 starting 2033 for those born in 1960 or later).
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Your Account</span></div>
              <NumInput label="Account Balance (Dec 31 of last year)" value={inputs.priorYearBalance} onChange={(v) => update({ priorYearBalance: v })} prefix="$" tooltip="Use the account balance as of December 31 of the prior tax year." />
              <NumInput label="Your Current Age" value={inputs.currentAge} onChange={(v) => update({ currentAge: v })} suffix="yrs" min={60} max={120} />

              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Filing Status</label>
                <select value={inputs.filingStatus} onChange={(e) => update({ filingStatus: e.target.value as FilingStatus })}
                  className="w-full bg-white rounded-lg border-2 border-slate-200 px-3 py-2.5 min-h-[44px] text-slate-900 font-medium outline-none hover:border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-50">
                  <option value="single">Single</option>
                  <option value="marriedFilingJointly">Married Filing Jointly</option>
                  <option value="headOfHousehold">Head of Household</option>
                </select>
              </div>

              <NumInput label="Marginal Federal Tax Rate" value={inputs.marginalTaxRate} onChange={(v) => update({ marginalTaxRate: v })} suffix="%" min={0} max={37} tooltip="Your expected federal marginal rate for this year's RMD income." />
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Projection Assumptions</span></div>
              <NumInput label="Expected Annual Return" value={inputs.expectedReturn} onChange={(v) => update({ expectedReturn: v })} suffix="%" min={0} max={20} tooltip="After-RMD account growth rate for the projection." />
              <NumInput label="Project Until Age" value={inputs.projectUntilAge} onChange={(v) => update({ projectUntilAge: v })} suffix="yrs" min={73} max={120} />
            </div>
          </div>

          <div className="space-y-4">
            {!result.notYetRequired && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h2 className="text-base font-bold text-slate-700 mb-4">Current Year RMD</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 col-span-full sm:col-span-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">This Year's RMD</p>
                    <p className="text-3xl font-black text-indigo-700">{fmtUSD(result.currentRMD)}</p>
                    <p className="text-xs text-slate-400 mt-1">Divisor: {result.divisorUsed} (age {inputs.currentAge})</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Est. Federal Tax</p>
                    <p className="text-2xl font-bold text-rose-600">{fmtUSD(result.estimatedFedTax)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">At {inputs.marginalTaxRate}% marginal</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Net After Tax</p>
                    <p className="text-2xl font-bold text-emerald-700">{fmtUSD(result.netAfterTax)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                  <div><p className="text-xs text-slate-500 mb-0.5">Cumulative RMDs</p><p className="text-lg font-bold text-slate-800">{fmtUSD(result.cumulativeRMDs)}</p></div>
                  <div><p className="text-xs text-slate-500 mb-0.5">Cumulative Taxes</p><p className="text-lg font-bold text-rose-600">{fmtUSD(result.cumulativeTaxes)}</p></div>
                  <div><p className="text-xs text-slate-500 mb-0.5">Final Balance</p><p className="text-lg font-bold text-slate-800">{fmtUSD(result.finalBalance)}</p></div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex gap-2 mb-5 flex-wrap">
                {(['bar', 'balance', 'pie'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {t === 'bar' ? 'Annual RMD' : t === 'balance' ? 'Balance Projection' : 'Lifetime Summary'}
                  </button>
                ))}
              </div>

              {tab === 'bar' && !result.notYetRequired && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={result.projection.filter((_, i) => i % 2 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="age" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} label={{ value: 'Age', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    <Legend />
                    <Bar dataKey="netAfterTax" name="Net to You" stackId="a" fill={CHART_COLORS.teal} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="federalTax" name="Federal Tax" stackId="a" fill={CHART_COLORS.rose} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {tab === 'balance' && !result.notYetRequired && (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={result.projection.filter((_, i) => i % 2 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="age" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    <Line type="monotone" dataKey="balance" name="Account Balance" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {tab === 'pie' && !result.notYetRequired && (
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {result.notYetRequired && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-4xl mb-3">📅</p>
                  <p className="font-medium">Enter an age ≥ 73 to see projections.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
