import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useCapitalGainsTax } from '../../hooks/useCapitalGainsTax';
import { fmtUSD, STATE_RATES } from './CapitalGainsTaxCalculator.utils';
import { CHART_COLORS, PIE_COLORS } from '../../utils/chartColors';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import type { AssetType, FilingStatus } from './CapitalGainsTaxCalculator.types';

const cardClass = 'bg-white rounded-2xl shadow-md border border-slate-100 p-6';
const labelClass = 'block text-sm font-medium text-slate-600 mb-1';
const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]';
const selectClass = `${inputClass} bg-white`;

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'stocks', label: 'Stocks / ETFs / Mutual Funds' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'real-estate', label: 'Real Estate (non-primary)' },
  { value: 'primary-residence', label: 'Primary Residence' },
  { value: 'collectibles', label: 'Collectibles (limited model)' },
];

const FILING_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'marriedFilingJointly', label: 'Married Filing Jointly' },
  { value: 'marriedFilingSeparately', label: 'Married Filing Separately' },
  { value: 'headOfHousehold', label: 'Head of Household' },
];

const STATE_LIST = Object.keys(STATE_RATES).sort();

export default function CapitalGainsTaxCalculator() {
  const { inputs, result, update } = useCapitalGainsTax();

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'Capital Gains Tax Report',
    filename: 'Capital_Gains_Tax.pdf',
    subtitle: `${result.holdingType === 'long' ? 'Long-term' : 'Short-term'} gain · ${result.holdingDays} days held`,
    sections: [
      {
        type: 'metrics',
        title: 'Tax Summary',
        metrics: [
          { label: 'Taxable Gain', value: fmtUSD(result.taxableGain) },
          { label: 'Total Tax', value: fmtUSD(result.totalTax) },
          { label: 'Net Proceeds', value: fmtUSD(result.netProceeds) },
          { label: 'Effective Rate on Gain', value: `${(result.effectiveRate * 100).toFixed(1)}%` },
        ],
      },
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    {
      name: 'Tax Breakdown',
      rows: [
        { Category: 'Gross Gain', Amount: result.grossGain },
        { Category: 'Section 121 Excluded', Amount: result.section121Excluded },
        { Category: 'Taxable Gain', Amount: result.taxableGain },
        { Category: 'Federal Short-term Tax', Amount: result.federalShortTax },
        { Category: 'Federal Long-term Tax', Amount: result.federalLongTax },
        { Category: 'NIIT (3.8%)', Amount: result.niit },
        { Category: 'State Tax', Amount: result.stateTax },
        { Category: 'Total Tax', Amount: result.totalTax },
        { Category: 'Net Proceeds', Amount: result.netProceeds },
      ],
    },
  ];

  const shareMessage = `Capital Gains Tax: ${result.holdingType === 'long' ? 'Long-term' : 'Short-term'} gain of ${fmtUSD(result.taxableGain)}, total tax ${fmtUSD(result.totalTax)}, net proceeds ${fmtUSD(result.netProceeds)}. Toolisk.`;

  const pieData = result.isLoss ? [] : [
    { name: 'Federal Tax', value: Math.round(result.federalShortTax + result.federalLongTax) },
    { name: 'NIIT', value: Math.round(result.niit) },
    { name: 'State Tax', value: Math.round(result.stateTax) },
    { name: 'Net Proceeds', value: Math.max(0, Math.round(result.netProceeds)) },
  ].filter(d => d.value > 0);

  const bracketData = result.holdingType === 'long' && !result.isLoss ? [
    { name: '0% Bracket', amount: Math.round(result.ltcgBracketFill.gainIn0) },
    { name: '15% Bracket', amount: Math.round(result.ltcgBracketFill.gainIn15) },
    { name: '20% Bracket', amount: Math.round(result.ltcgBracketFill.gainIn20) },
  ].filter(d => d.amount > 0) : [];

  const isCollectibles = inputs.assetType === 'collectibles';
  const isRealEstate = inputs.assetType === 'real-estate' || inputs.assetType === 'primary-residence';

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <ExportShareBar filenameBase="Capital_Gains_Tax" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 — The Sale */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">The Sale</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Asset Type</label>
                <select value={inputs.assetType} onChange={e => update({ assetType: e.target.value as AssetType, section121Eligible: false })} className={selectClass}>
                  {ASSET_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              {isCollectibles && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                  Collectibles are taxed at up to 28% (simplified model). QSBS exclusions are not modeled here.
                </div>
              )}
              <div>
                <label className={labelClass}>Purchase Price / Cost Basis</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.purchasePrice} onChange={e => update({ purchasePrice: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Sale Price</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.salePrice} onChange={e => update({ salePrice: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Selling Fees / Commissions</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.sellingFees} onChange={e => update({ sellingFees: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </div>
              {isRealEstate && (
                <div>
                  <label className={labelClass}>Improvements (adds to basis)</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input type="number" min={0} value={inputs.improvements} onChange={e => update({ improvements: +e.target.value })} className={`${inputClass} pl-6`} />
                  </div>
                </div>
              )}
              <div>
                <label className={labelClass}>Purchase Date</label>
                <input type="date" value={inputs.purchaseDate} onChange={e => update({ purchaseDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Sale Date</label>
                <input type="date" value={inputs.saleDate} onChange={e => update({ saleDate: e.target.value })} className={inputClass} />
              </div>
              {/* Holding period badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${result.holdingType === 'long' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {result.holdingType === 'long' ? 'Long-term' : 'Short-term'}
                </span>
                <span className="text-xs text-slate-500">{result.holdingDays} days held</span>
              </div>
              {inputs.assetType === 'primary-residence' && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sec121" checked={inputs.section121Eligible} onChange={e => update({ section121Eligible: e.target.checked })} className="rounded" />
                  <label htmlFor="sec121" className="text-sm text-slate-600">Lived in home 2 of last 5 years (Section 121)</label>
                </div>
              )}
            </div>
          </div>

          {/* Card 2 — Your Tax Picture */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Your Tax Picture</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Filing Status</label>
                <select value={inputs.filingStatus} onChange={e => update({ filingStatus: e.target.value as FilingStatus })} className={selectClass}>
                  {FILING_STATUSES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Other Ordinary Taxable Income</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.otherOrdinaryIncome} onChange={e => update({ otherOrdinaryIncome: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Other Investment Income (excl. this sale)</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.otherInvestmentIncome} onChange={e => update({ otherInvestmentIncome: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
                <p className="text-xs text-slate-400 mt-1">Used for NIIT (3.8%) calculation</p>
              </div>
            </div>
          </div>

          {/* Card 3 — State */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">State Tax</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>State</label>
                <select
                  onChange={e => { if (e.target.value) update({ stateRate: STATE_RATES[e.target.value] ?? 0 }); }}
                  className={selectClass}
                >
                  <option value="">— Select state to set rate —</option>
                  {STATE_LIST.map(s => <option key={s} value={s}>{s} ({STATE_RATES[s]}%)</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>State Tax Rate (%) — flat approximation</label>
                <input type="number" min={0} max={15} step={0.1} value={inputs.stateRate} onChange={e => update({ stateRate: +e.target.value })} className={inputClass} />
                <p className="text-xs text-slate-400 mt-1">FL, TX, WA, NV, and others have no income tax.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {result.isLoss ? (
            <div className="rounded-xl bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 text-sm font-medium mb-6">
              This sale results in a capital <strong>loss</strong> of {fmtUSD(Math.abs(result.grossGain))}. No tax is owed. Capital losses may be deductible against other gains or up to $3,000 of ordinary income — consult a tax advisor for carryforward rules.
            </div>
          ) : (
            <>
              {/* KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Taxable Gain', value: fmtUSD(result.taxableGain), color: 'text-indigo-600' },
                  { label: 'Total Tax', value: fmtUSD(result.totalTax), color: 'text-rose-600' },
                  { label: 'Net Proceeds', value: fmtUSD(result.netProceeds), color: 'text-slate-800' },
                  { label: 'Effective Rate on Gain', value: `${(result.effectiveRate * 100).toFixed(1)}%`, color: 'text-amber-600' },
                ].map(kpi => (
                  <div key={kpi.label} className={`${cardClass} text-center`}>
                    <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Tax breakdown table */}
              <div className={`${cardClass} mb-6`}>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Tax Breakdown</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Gross Gain', value: result.grossGain },
                    ...(result.section121Excluded > 0 ? [{ label: 'Section 121 Exclusion', value: -result.section121Excluded }] : []),
                    { label: 'Taxable Gain', value: result.taxableGain },
                    ...(result.federalShortTax > 0 ? [{ label: 'Federal Short-term Tax', value: result.federalShortTax }] : []),
                    ...(result.federalLongTax > 0 ? [{ label: 'Federal Long-term Tax', value: result.federalLongTax }] : []),
                    { label: 'Net Investment Income Tax (NIIT)', value: result.niit },
                    { label: 'State Tax', value: result.stateTax },
                    { label: 'Total Tax', value: result.totalTax, bold: true },
                    { label: 'Net Proceeds (after all taxes)', value: result.netProceeds, bold: true },
                  ].map(row => (
                    <div key={row.label} className={`flex justify-between py-1 ${row.bold ? 'border-t border-slate-200 font-semibold' : 'text-sm'}`}>
                      <span className="text-slate-600">{row.label}</span>
                      <span className={row.value < 0 ? 'text-emerald-600' : 'text-slate-800'}>{fmtUSD(Math.abs(row.value))}{row.value < 0 ? ' (reduction)' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Tax breakdown pie */}
                <div className={cardClass}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Where Your Proceeds Go</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* LTCG bracket fill or short vs long */}
                {result.holdingType === 'long' && bracketData.length > 0 ? (
                  <div className={cardClass}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Long-term Gain by Tax Bracket</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={bracketData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                        <Bar dataKey="amount" name="Gain in Bracket" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : result.shortVsLongComparison.length > 1 ? (
                  <div className={cardClass}>
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Short-term vs Long-term Tax</h3>
                    <p className="text-xs text-slate-500 mb-3">Potential tax savings by waiting to cross the 1-year mark:</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={result.shortVsLongComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                        <Bar dataKey="tax" name="Total Tax" fill={CHART_COLORS.rose} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">
                      Potential savings: {fmtUSD(result.shortVsLongComparison[0].tax - result.shortVsLongComparison[1].tax)} by holding longer
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
