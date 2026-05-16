import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';
import { useReverseMortgage } from '../../hooks/useReverseMortgage';
import { fmtUSD } from './ReverseMortgageCalculator.utils';
import { CHART_COLORS } from '../../utils/chartColors';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import type { PayoutChoice } from './ReverseMortgageCalculator.types';

const cardClass = 'bg-white rounded-2xl shadow-md border border-slate-100 p-6';
const labelClass = 'block text-sm font-medium text-slate-600 mb-1';
const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]';

const PAYOUT_OPTIONS: { value: PayoutChoice; label: string }[] = [
  { value: 'lump-sum', label: 'Lump Sum' },
  { value: 'line-of-credit', label: 'Line of Credit' },
  { value: 'term', label: 'Term (specify years)' },
  { value: 'tenure', label: 'Tenure (lifetime monthly)' },
];

export default function ReverseMortgageCalculator() {
  const { inputs, result, update } = useReverseMortgage();

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'Reverse Mortgage (HECM) Report',
    filename: 'Reverse_Mortgage.pdf',
    subtitle: result.isEligible ? `Youngest borrower age ${result.youngestAge}` : 'Not eligible — youngest borrower under 62',
    sections: [
      {
        type: 'metrics',
        title: 'HECM Summary',
        metrics: result.isEligible ? [
          { label: 'Initial Principal Limit', value: fmtUSD(result.initialPrincipalLimit) },
          { label: 'Total Fees', value: fmtUSD(result.totalFees) },
          { label: 'Net Funds Available', value: fmtUSD(result.availableAfterFees) },
          { label: 'Tenure Monthly Payment', value: fmtUSD(result.tenureMonthlyPayment) },
        ] : [],
      },
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    {
      name: 'Equity Projection',
      rows: result.equityProjection.map(r => ({
        Year: r.year,
        'Loan Balance': r.loanBalance,
        'Home Value': r.homeValue,
        'Remaining Equity': r.equity,
      })),
    },
  ];

  const shareMessage = `Reverse Mortgage: Net funds ${fmtUSD(result.availableAfterFees)}, tenure payment ${fmtUSD(result.tenureMonthlyPayment)}/month for life. Toolisk.`;

  const waterfallData = result.isEligible ? [
    { name: 'Initial PL', amount: Math.round(result.initialPrincipalLimit) },
    { name: '− IMIP', amount: -Math.round(result.imip) },
    { name: '− Origination', amount: -Math.round(result.origination) },
    { name: '− Other Closing', amount: -Math.round(inputs.otherClosingCosts) },
    { name: '− Existing Mortgage', amount: -Math.round(inputs.existingMortgageBalance) },
    { name: 'Net Available', amount: Math.round(result.availableAfterFees) },
  ] : [];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <ExportShareBar filenameBase="Reverse_Mortgage" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        {/* Disclaimer */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          <strong>Estimates only.</strong> This calculator uses an illustrative PLF table at a fixed 6% expected rate. Consult a HUD-approved HECM counselor for your actual quote.
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 — Home & Mortgage */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Your Home & Existing Mortgage</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Home Value</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.homeValue} onChange={e => update({ homeValue: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Existing Mortgage Balance to Be Paid Off</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.existingMortgageBalance} onChange={e => update({ existingMortgageBalance: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Other Closing Costs (appraisal, title, etc.)</label>
                <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.otherClosingCosts} onChange={e => update({ otherClosingCosts: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Borrower */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Borrower</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Age of Youngest Borrower (min 62)</label>
                <input type="number" min={62} max={99} value={inputs.borrowerAge} onChange={e => update({ borrowerAge: +e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Co-Borrower Spouse Age (optional)</label>
                <input
                  type="number" min={62} max={99}
                  value={inputs.coBorrowerAge ?? ''}
                  onChange={e => update({ coBorrowerAge: e.target.value === '' ? null : +e.target.value })}
                  placeholder="Leave blank if none"
                  className={inputClass}
                />
                <p className="text-xs text-slate-400 mt-1">Youngest age drives the PLF (higher age = more proceeds).</p>
              </div>
              <div>
                <label className={labelClass}>Expected Interest Rate (%) — estimated at 6%</label>
                <input type="number" min={0} max={15} step={0.1} value={inputs.expectedRate} onChange={e => update({ expectedRate: +e.target.value })} className={inputClass} />
                <p className="text-xs text-slate-400 mt-1">PLF is calculated at 6%; actual lender rate may differ.</p>
              </div>
            </div>
          </div>

          {/* Card 3 — Payout Choice */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Payout Choice</h2>
            <div className="space-y-3">
              {PAYOUT_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="payout" value={opt.value} checked={inputs.payoutChoice === opt.value} onChange={() => update({ payoutChoice: opt.value })} className="text-indigo-600" />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
              {inputs.payoutChoice === 'term' && (
                <div className="mt-2">
                  <label className={labelClass}>Term Length (years)</label>
                  <input type="number" min={1} max={30} value={inputs.termYears} onChange={e => update({ termYears: +e.target.value })} className={inputClass} />
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <label className={labelClass}>Home Appreciation Rate (%) for Projection</label>
                <input type="number" min={0} max={10} step={0.1} value={inputs.homeAppreciation} onChange={e => update({ homeAppreciation: +e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {!result.isEligible ? (
            <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-800 px-4 py-4 text-sm font-medium">
              The youngest borrower ({result.youngestAge}) must be at least 62 to qualify for an HECM reverse mortgage.
            </div>
          ) : (
            <>
              {/* KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Initial Principal Limit', value: fmtUSD(result.initialPrincipalLimit), color: 'text-indigo-600' },
                  { label: 'Total Fees', value: fmtUSD(result.totalFees), color: 'text-rose-600' },
                  { label: 'Net Funds Available', value: fmtUSD(result.availableAfterFees), color: 'text-emerald-600' },
                  {
                    label: inputs.payoutChoice === 'tenure' ? 'Tenure Monthly Payment' :
                      inputs.payoutChoice === 'term' ? `Term Monthly (${inputs.termYears}yr)` :
                        inputs.payoutChoice === 'lump-sum' ? 'Lump Sum' : 'Line of Credit',
                    value: inputs.payoutChoice === 'tenure' ? fmtUSD(result.tenureMonthlyPayment) :
                      inputs.payoutChoice === 'term' ? fmtUSD(result.termMonthlyPayment) :
                        fmtUSD(result.lumpSum),
                    color: 'text-blue-600',
                  },
                ].map(kpi => (
                  <div key={kpi.label} className={`${cardClass} text-center`}>
                    <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Principal limit breakdown */}
              <div className={`${cardClass} mb-6`}>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Principal Limit Breakdown</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: `Max Claim (min($${(inputs.homeValue / 1000).toFixed(0)}k, $1,209,750))`, value: result.maxClaim },
                    { label: `× PLF (age ${result.youngestAge}, 6% expected rate)`, value: null, factor: result.plf.toFixed(3) },
                    { label: 'Initial Principal Limit', value: result.initialPrincipalLimit, bold: true },
                    { label: '− IMIP (2% of max claim)', value: -result.imip },
                    { label: '− Origination Fee (capped at $6,000)', value: -result.origination },
                    { label: `− Other Closing Costs`, value: -inputs.otherClosingCosts },
                    { label: '− Existing Mortgage Payoff', value: -inputs.existingMortgageBalance },
                    { label: 'Net Funds Available to You', value: result.availableAfterFees, bold: true },
                  ].map(row => (
                    <div key={row.label} className={`flex justify-between py-1 ${row.bold ? 'border-t border-slate-200 font-semibold' : ''}`}>
                      <span className="text-slate-600">{row.label}</span>
                      <span className={row.value != null && row.value < 0 ? 'text-rose-600' : 'text-slate-800'}>
                        {row.factor ?? (row.value != null ? fmtUSD(Math.abs(row.value)) : '')}
                        {row.value != null && row.value < 0 ? ' (deducted)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All payout options side-by-side */}
              <div className={`${cardClass} mb-6`}>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">All Payout Options at a Glance</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Lump Sum', value: fmtUSD(result.lumpSum), note: 'Total today' },
                    { label: 'Line of Credit', value: fmtUSD(result.lineOfCredit), note: 'Grows over time' },
                    { label: `Term (${inputs.termYears} yrs)`, value: fmtUSD(result.termMonthlyPayment), note: 'Per month' },
                    { label: 'Tenure (lifetime)', value: fmtUSD(result.tenureMonthlyPayment), note: 'Per month for life' },
                  ].map(opt => (
                    <div key={opt.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-500">{opt.label}</p>
                      <p className="text-xl font-bold text-indigo-600 mt-1">{opt.value}</p>
                      <p className="text-xs text-slate-400 mt-1">{opt.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Waterfall */}
                <div className={cardClass}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Principal Limit Waterfall</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={waterfallData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={v => `$${(Math.abs(v) / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(Math.abs(v)) : ''} />
                      <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]} fill={CHART_COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Long-term equity */}
                <div className={cardClass}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">25-Year Equity Projection</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={result.equityProjection}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" tickFormatter={v => `Yr ${v}`} tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                      <Legend />
                      <Area type="monotone" dataKey="homeValue" name="Home Value" stroke={CHART_COLORS.teal} fill="#d1fae5" strokeWidth={2} />
                      <Area type="monotone" dataKey="loanBalance" name="Loan Balance" stroke={CHART_COLORS.rose} fill="#ffe4e6" strokeWidth={2} />
                      <Area type="monotone" dataKey="equity" name="Remaining Equity" stroke={CHART_COLORS.primary} fill="#e0e7ff" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* LOC growth callout */}
              {inputs.payoutChoice === 'line-of-credit' && (
                <div className="rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-3 text-sm mb-6">
                  <strong>Line of Credit Growth Feature:</strong> The unused HECM LOC grows at the accrual rate (expected rate + 0.5% MIP) compounded monthly. Deferring draws allows your available credit to increase over time — a key advantage over a traditional HELOC.
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
