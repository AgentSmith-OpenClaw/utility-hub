import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useRothConversion } from '../../hooks/useRothConversion';
import { fmtUSD, TAX_YEAR } from './RothConversionCalculator.utils';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import { CHART_COLORS, PIE_COLORS } from '../../utils/chartColors';
import type { FilingStatus, TaxSource } from './RothConversionCalculator.types';

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

export default function RothConversionCalculator() {
  const { inputs, result, update } = useRothConversion();
  const [tab, setTab] = useState<'growth' | 'brackets' | 'pie'>('growth');

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'Roth Conversion Analysis',
    subtitle: `Convert ${fmtUSD(inputs.conversionAmount)} • ${inputs.yearsUntilWithdrawal}-year horizon`,
    filename: 'Roth_Conversion_Calculator.pdf',
    sections: [
      { type: 'metrics', title: 'Conversion Tax', metrics: [
        { label: 'Federal Tax on Conversion', value: fmtUSD(result.federalConversionTax) },
        { label: 'State Tax', value: fmtUSD(result.stateConversionTax) },
        { label: 'Total Conversion Tax', value: fmtUSD(result.totalConversionTax) },
        { label: 'Effective Rate', value: `${(result.effectiveConversionRate * 100).toFixed(1)}%` },
        { label: 'Roth Final (after-tax)', value: fmtUSD(result.rothFinalAfterTax) },
        { label: 'Traditional Final (after-tax)', value: fmtUSD(result.tradFinalAfterTax) },
        { label: 'Net Benefit of Converting', value: fmtUSD(result.netBenefitOfConverting) },
      ]},
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    { name: 'Growth Comparison', rows: result.growthData.map(d => ({ Year: d.year, 'Roth (after-tax)': d.roth, 'Traditional (after-tax)': d.traditional })) },
  ];

  const shareMessage = `Roth Conversion: Convert ${fmtUSD(inputs.conversionAmount)} costs ${fmtUSD(result.totalConversionTax)} in tax but saves ${fmtUSD(result.netBenefitOfConverting)} over ${inputs.yearsUntilWithdrawal} years. Toolisk.`;

  const taxPieData = [
    { name: 'Federal Tax', value: Math.round(result.federalConversionTax) },
    { name: 'State Tax', value: Math.round(result.stateConversionTax) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🔁</span>
          <div>
            <h1 className="text-2xl font-bold">Roth Conversion Calculator</h1>
            <p className="text-rose-100 text-sm mt-0.5">See exact tax cost and after-tax future value using {TAX_YEAR} federal brackets. Decision support — not tax advice.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <ExportShareBar filenameBase="Roth_Conversion" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          ⚠️ <strong>Disclaimer:</strong> These are estimates for decision support only. Consult a qualified tax professional before converting.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">What You&apos;re Converting</span></div>
              <NumInput label="Amount to Convert" value={inputs.conversionAmount} onChange={(v) => update({ conversionAmount: v })} prefix="$" />
              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Pay Conversion Tax From</label>
                <div className="flex gap-2">
                  {([['outside', 'Outside Cash (recommended)'], ['withhold', 'Withhold from Conversion']] as [TaxSource, string][]).map(([opt, label]) => (
                    <button key={opt} onClick={() => update({ taxSource: opt })}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium min-h-[44px] transition-all ${inputs.taxSource === opt ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Today&apos;s Tax Picture</span></div>
              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Filing Status</label>
                <select value={inputs.filingStatus} onChange={(e) => update({ filingStatus: e.target.value as FilingStatus })}
                  className="w-full bg-white rounded-lg border-2 border-slate-200 px-3 py-2.5 min-h-[44px] text-slate-900 font-medium outline-none hover:border-slate-300 focus:border-blue-400">
                  <option value="single">Single</option>
                  <option value="marriedFilingJointly">Married Filing Jointly</option>
                  <option value="headOfHousehold">Head of Household</option>
                </select>
              </div>
              <NumInput label="Other Taxable Income This Year" value={inputs.otherIncome} onChange={(v) => update({ otherIncome: v })} prefix="$" tooltip={`Income before the conversion. Conversion is stacked on top for bracket calculation.`} />
              <NumInput label="State Income Tax Rate" value={inputs.stateRate} onChange={(v) => update({ stateRate: v })} suffix="%" min={0} max={15} tooltip="Flat-rate approximation. FL/TX/WA = 0. CA up to 13.3%." />
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Future Assumptions</span></div>
              <NumInput label="Current Age" value={inputs.currentAge} onChange={(v) => update({ currentAge: v })} suffix="yrs" min={18} max={90} />
              <NumInput label="Years Until Withdrawal" value={inputs.yearsUntilWithdrawal} onChange={(v) => update({ yearsUntilWithdrawal: v })} suffix="yrs" min={1} max={40} />
              <NumInput label="Expected Annual Return" value={inputs.expectedReturn} onChange={(v) => update({ expectedReturn: v })} suffix="%" min={0} max={20} />
              <NumInput label="Expected Tax Rate at Withdrawal" value={inputs.retirementTaxRate} onChange={(v) => update({ retirementTaxRate: v })} suffix="%" min={0} max={37} tooltip="Your expected marginal rate when you withdraw in retirement." />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-700 mb-4">Results</h2>
              <motion.div key={result.netBenefitOfConverting} initial={{ scale: 0.97 }} animate={{ scale: 1 }}
                className={`rounded-xl p-4 mb-4 ${result.worthConverting ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Net Benefit of Converting</p>
                <p className={`text-4xl font-black ${result.worthConverting ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {result.netBenefitOfConverting >= 0 ? '' : '-'}{fmtUSD(Math.abs(result.netBenefitOfConverting))}
                </p>
                <p className="text-xs text-slate-500 mt-1">{result.worthConverting ? '✅ Converting now produces a better after-tax outcome.' : '❌ Leaving in Traditional is better — retirement rate exceeds today\'s effective rate.'}</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Federal Tax on Conversion</p><p className="text-xl font-bold text-rose-600">{fmtUSD(result.federalConversionTax)}</p></div>
                <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">State Tax</p><p className="text-xl font-bold text-rose-600">{fmtUSD(result.stateConversionTax)}</p></div>
                <div className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Total Conversion Tax</p><p className="text-xl font-bold text-slate-900">{fmtUSD(result.totalConversionTax)}</p><p className="text-xs text-slate-400">{(result.effectiveConversionRate * 100).toFixed(1)}% effective rate</p></div>
                <div className="bg-blue-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Roth Final (tax-free)</p><p className="text-xl font-bold text-blue-700">{fmtUSD(result.rothFinalAfterTax)}</p></div>
                <div className="col-span-2 bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500 mb-0.5">Traditional Final (after {inputs.retirementTaxRate}% tax)</p><p className="text-xl font-bold text-slate-800">{fmtUSD(result.tradFinalAfterTax)}</p></div>
              </div>

              {result.bracketsUsed.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Bracket Fill (conversion portion)</p>
                  <div className="space-y-1.5">
                    {result.bracketsUsed.map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 w-10">{b.rate}%</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3">
                          <div className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-rose-500" style={{ width: `${Math.min(100, (b.amountInBracket / inputs.conversionAmount) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 w-20 text-right">{fmtUSD(b.tax)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex gap-2 mb-5 flex-wrap">
                {(['growth', 'brackets', 'pie'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {t === 'growth' ? 'Growth Comparison' : t === 'brackets' ? 'Bracket Fill' : 'Tax Breakdown'}
                  </button>
                ))}
              </div>

              {tab === 'growth' && (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={result.growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    <Legend />
                    <Line type="monotone" dataKey="roth" name="Roth (after-tax)" stroke={CHART_COLORS.teal} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="traditional" name="Traditional (after-tax)" stroke={CHART_COLORS.rose} strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {tab === 'brackets' && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={result.bracketsUsed} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="rate" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                    <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                    <Bar dataKey="amountInBracket" name="Amount in Bracket" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {tab === 'pie' && (
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={taxPieData.filter(d => d.value > 0)} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>
                        {taxPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
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
