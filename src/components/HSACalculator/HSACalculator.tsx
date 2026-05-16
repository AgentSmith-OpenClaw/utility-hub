import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useHSACalculator } from '../../hooks/useHSACalculator';
import { fmtUSD, HSA_LIMITS_2026 } from './HSACalculator.utils';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import { CHART_COLORS, PIE_COLORS } from '../../utils/chartColors';
import type { CoverageType, ContributionMethod } from './HSACalculator.types';

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

export default function HSACalculator() {
  const { inputs, result, update } = useHSACalculator();
  const [tab, setTab] = useState<'growth' | 'stack' | 'pie'>('growth');

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'HSA Projection Report',
    subtitle: `${inputs.yearsUntilUse}-year projection • ${inputs.coverageType === 'family' ? 'Family' : 'Self-only'} coverage`,
    filename: 'HSA_Calculator.pdf',
    sections: [
      { type: 'metrics', title: 'Year-1 Tax Savings', metrics: [
        { label: 'Federal Savings', value: fmtUSD(result.fedSavings) },
        { label: 'State Savings', value: fmtUSD(result.stateSavings) },
        { label: 'FICA Savings', value: fmtUSD(result.ficaSavings) },
        { label: 'Total Year-1 Tax Saved', value: fmtUSD(result.totalYear1Tax) },
        { label: `HSA Balance (${inputs.yearsUntilUse} yrs)`, value: fmtUSD(result.hsaFinal) },
        { label: 'Taxable Acct Equivalent', value: fmtUSD(result.taxableFinal) },
        { label: 'HSA Advantage', value: fmtUSD(result.hsaAdvantage) },
      ]},
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    { name: 'HSA Projection', rows: result.projection.map(r => ({ Year: r.year, 'HSA Balance': r.hsaBalance, 'Taxable Balance': r.taxableBalance, Contribution: r.contribution, Growth: r.growth })) },
  ];

  const shareMessage = `HSA Analysis: ${inputs.yearsUntilUse}-year projection → ${fmtUSD(result.hsaFinal)} vs ${fmtUSD(result.taxableFinal)} taxable. HSA advantage: ${fmtUSD(result.hsaAdvantage)}. Calculate at Toolisk.`;

  const taxPieData = [
    { name: 'Federal Savings', value: Math.round(result.fedSavings) },
    { name: 'State Savings', value: Math.round(result.stateSavings) },
    { name: 'FICA Savings', value: Math.round(result.ficaSavings) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🏥</span>
          <div>
            <h1 className="text-2xl font-bold">HSA Calculator</h1>
            <p className="text-emerald-100 text-sm mt-0.5">Project HSA growth and quantify your triple-tax advantage — federal, state, and FICA savings.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <ExportShareBar filenameBase="HSA_Calculator" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        {result.overContribution && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium">
            ⚠️ Contribution exceeds IRS limit ({fmtUSD(result.employeeMax)} max after employer contribution). Capped automatically.
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Coverage</span></div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Coverage Type</label>
                <div className="flex gap-2">
                  {(['selfOnly', 'family'] as CoverageType[]).map((opt) => (
                    <button key={opt} onClick={() => update({ coverageType: opt, annualContribution: opt === 'family' ? HSA_LIMITS_2026.family : HSA_LIMITS_2026.selfOnly })}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium min-h-[44px] transition-all ${inputs.coverageType === opt ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {opt === 'selfOnly' ? 'Self-Only' : 'Family'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">2026 limit: {inputs.coverageType === 'family' ? `$${HSA_LIMITS_2026.family.toLocaleString()}` : `$${HSA_LIMITS_2026.selfOnly.toLocaleString()}`}{inputs.currentAge >= 55 ? ` + $${HSA_LIMITS_2026.catchUp.toLocaleString()} catch-up` : ''}</p>
              </div>
              <NumInput label="Your Current Age" value={inputs.currentAge} onChange={(v) => update({ currentAge: v })} suffix="yrs" min={18} max={64} />
              <NumInput label="Years Until You Tap the HSA" value={inputs.yearsUntilUse} onChange={(v) => update({ yearsUntilUse: v })} suffix="yrs" min={1} max={50} />
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Contributions</span></div>
              <NumInput label="Current HSA Balance" value={inputs.currentBalance} onChange={(v) => update({ currentBalance: v })} prefix="$" />
              <NumInput label="Your Annual Contribution" value={inputs.annualContribution} onChange={(v) => update({ annualContribution: v })} prefix="$" tooltip={`IRS limit: $${result.employeeMax.toLocaleString()} after employer contribution.`} />
              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Contribution Method</label>
                <div className="flex gap-2">
                  {(['payroll', 'outside'] as ContributionMethod[]).map((opt) => (
                    <button key={opt} onClick={() => update({ contributionMethod: opt })}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium min-h-[44px] transition-all ${inputs.contributionMethod === opt ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {opt === 'payroll' ? 'Through Payroll (saves FICA)' : 'Outside Payroll (no FICA savings)'}
                    </button>
                  ))}
                </div>
              </div>
              <NumInput label="Annual Employer Contribution" value={inputs.employerContribution} onChange={(v) => update({ employerContribution: v })} prefix="$" tooltip="Counts toward IRS limit." />
              <NumInput label="Annual Medical Withdrawals" value={inputs.annualMedicalWithdrawals} onChange={(v) => update({ annualMedicalWithdrawals: v })} prefix="$" tooltip="Qualified medical spending withdrawn per year (tax-free)." />
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-cyan-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Growth & Tax</span></div>
              <NumInput label="Expected Annual Return" value={inputs.expectedReturn} onChange={(v) => update({ expectedReturn: v })} suffix="%" min={0} max={20} />
              <NumInput label="Marginal Federal Tax Rate" value={inputs.fedRate} onChange={(v) => update({ fedRate: v })} suffix="%" min={0} max={37} />
              <NumInput label="State Income Tax Rate" value={inputs.stateRate} onChange={(v) => update({ stateRate: v })} suffix="%" min={0} max={15} tooltip="Note: CA and NJ do not exempt HSA contributions from state tax. Set 0 if you live there." />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 col-span-full">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Projected HSA Balance ({inputs.yearsUntilUse} years)</p>
                  <p className="text-4xl font-black text-emerald-700">{fmtUSD(result.hsaFinal)}</p>
                  <p className="text-xs text-slate-500 mt-1">vs {fmtUSD(result.taxableFinal)} in a taxable account — <strong className="text-emerald-700">{fmtUSD(result.hsaAdvantage)} HSA advantage</strong></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Year-1 Tax Savings</p>
                  <p className="text-2xl font-bold text-slate-900">{fmtUSD(result.totalYear1Tax)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Effective cost: {fmtUSD(result.effectiveCost)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Triple-Tax Breakdown</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Federal</span><span className="font-bold">{fmtUSD(result.fedSavings)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-600">State</span><span className="font-bold">{fmtUSD(result.stateSavings)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-600">FICA</span><span className="font-bold">{fmtUSD(result.ficaSavings)}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex gap-2 mb-5 flex-wrap">
                {(['growth', 'stack', 'pie'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {t === 'growth' ? 'HSA vs Taxable' : t === 'stack' ? 'Annual Growth' : 'Tax Savings Pie'}
                  </button>
                ))}
              </div>

              {tab === 'growth' && (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={result.projection.filter((_, i) => i % 2 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    <Legend />
                    <Line type="monotone" dataKey="hsaBalance" name="HSA Balance" stroke={CHART_COLORS.teal} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="taxableBalance" name="Taxable Account" stroke={CHART_COLORS.secondary} strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {tab === 'stack' && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={result.projection.filter((_, i) => i % 2 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    <Legend />
                    <Bar dataKey="contribution" name="Contribution" stackId="a" fill={CHART_COLORS.primary} />
                    <Bar dataKey="growth" name="Growth" stackId="a" fill={CHART_COLORS.teal} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {tab === 'pie' && (
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={taxPieData.filter(d => d.value > 0)} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${fmtUSD(value)}`}>
                        {taxPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
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
