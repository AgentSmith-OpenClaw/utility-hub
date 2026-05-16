import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCollegeSavings529 } from '../../hooks/useCollegeSavings529';
import { fmtUSD } from './CollegeSavings529Calculator.utils';
import { CHART_COLORS } from '../../utils/chartColors';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';

const cardClass = 'bg-white rounded-2xl shadow-md border border-slate-100 p-6';
const labelClass = 'block text-sm font-medium text-slate-600 mb-1';
const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]';

interface InputRowProps { label: string; children: React.ReactNode; tooltip?: string }
function InputRow({ label, children, tooltip }: InputRowProps) {
  return (
    <div>
      <label className={labelClass}>{label}{tooltip && <span className="ml-1 text-xs text-slate-400" title={tooltip}>(?)</span>}</label>
      {children}
    </div>
  );
}

export default function CollegeSavings529Calculator() {
  const { inputs, result, update } = useCollegeSavings529();

  const buildPdfConfig = (): PDFReportConfig => ({
    title: '529 College Savings Report',
    filename: '529_College_Savings.pdf',
    subtitle: `Child age ${inputs.childAge} · ${result.yearsUntilCollege} years until college`,
    sections: [
      {
        type: 'metrics',
        title: 'Funding Summary',
        metrics: [
          { label: 'Projected Balance at College Start', value: fmtUSD(result.fvAtStart) },
          { label: 'Total College Cost (inflated)', value: fmtUSD(result.totalCollegeCost) },
          { label: result.isFullyFunded ? 'Funding Surplus' : 'Funding Gap', value: fmtUSD(result.isFullyFunded ? result.fundingSurplus : result.fundingGap) },
          { label: 'Recommended Monthly Contribution', value: fmtUSD(result.recommendedMonthlyContribution) },
        ],
      },
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    {
      name: 'College Year Schedule',
      rows: result.collegeYearData.map(r => ({
        'College Year': r.year,
        'Projected Cost': r.projectedCost,
        'Starting Balance': r.startingBalance,
        'Ending Balance': r.endingBalance,
      })),
    },
    {
      name: 'Savings Growth',
      rows: result.growthData.map(r => ({ Label: r.label, Balance: r.balance })),
    },
  ];

  const shareMessage = `529 College Savings: ${result.yearsUntilCollege} years to college, projected balance ${fmtUSD(result.fvAtStart)} vs ${fmtUSD(result.totalCollegeCost)} total cost. Toolisk.`;

  const fmtK = (v: number | undefined) => v != null ? `$${(v / 1000).toFixed(0)}k` : '';

  const contribData = [
    { name: 'You Contributed', value: result.contributionVsGrowthData.contributed },
    { name: 'Investment Growth', value: result.contributionVsGrowthData.growth },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <ExportShareBar filenameBase="529_College_Savings" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 — Your Child */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Your Child</h2>
            <div className="space-y-4">
              <InputRow label="Child's Age Today">
                <input type="number" min={0} max={17} value={inputs.childAge} onChange={e => update({ childAge: +e.target.value })} className={inputClass} />
                <p className="text-xs text-slate-400 mt-1">College starts at age 18 → {result.yearsUntilCollege} years away</p>
              </InputRow>
              <InputRow label="Years of College">
                <input type="number" min={1} max={8} value={inputs.yearsOfCollege} onChange={e => update({ yearsOfCollege: +e.target.value })} className={inputClass} />
              </InputRow>
            </div>
          </div>

          {/* Card 2 — Savings Plan */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">Savings Plan</h2>
            <div className="space-y-4">
              <InputRow label="Current 529 Balance">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.currentBalance} onChange={e => update({ currentBalance: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </InputRow>
              <InputRow label="Monthly Contribution">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.monthlyContribution} onChange={e => update({ monthlyContribution: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </InputRow>
              <InputRow label="Expected Annual Return (%)" tooltip="Age-based 529 portfolios derisk as college nears. A flat rate is a simplification.">
                <input type="number" min={0} max={20} step={0.1} value={inputs.expectedReturn} onChange={e => update({ expectedReturn: +e.target.value })} className={inputClass} />
              </InputRow>
              <InputRow label="State Tax Deduction Rate (%)" tooltip="Many states offer a deduction for contributions to that state's 529 plan.">
                <input type="number" min={0} max={10} step={0.1} value={inputs.stateDeductionRate} onChange={e => update({ stateDeductionRate: +e.target.value })} className={inputClass} />
              </InputRow>
              {inputs.stateDeductionRate > 0 && (
                <InputRow label="Annual Deductible Cap ($)" tooltip="Enter 0 for no cap.">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input type="number" min={0} value={inputs.stateDeductibleCap} onChange={e => update({ stateDeductibleCap: +e.target.value })} className={`${inputClass} pl-6`} />
                  </div>
                </InputRow>
              )}
            </div>
          </div>

          {/* Card 3 — College Costs */}
          <div className={cardClass}>
            <h2 className="text-base font-semibold text-slate-800 mb-4">College Costs</h2>
            <div className="space-y-4">
              <InputRow label="Current Annual Cost (tuition + room & board)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" min={0} value={inputs.currentAnnualCost} onChange={e => update({ currentAnnualCost: +e.target.value })} className={`${inputClass} pl-6`} />
                </div>
              </InputRow>
              <InputRow label="College Cost Inflation Rate (%)" tooltip="College costs have historically risen 5–6% per year (College Board data).">
                <input type="number" min={0} max={15} step={0.1} value={inputs.costInflationRate} onChange={e => update({ costInflationRate: +e.target.value })} className={inputClass} />
              </InputRow>
            </div>
          </div>
        </div>

        {/* Results */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Headline KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Projected Balance at College Start', value: fmtUSD(result.fvAtStart), color: 'text-indigo-600' },
              { label: 'Total College Cost', value: fmtUSD(result.totalCollegeCost), color: 'text-rose-600' },
              {
                label: result.isFullyFunded ? 'Funding Surplus' : 'Funding Gap',
                value: fmtUSD(result.isFullyFunded ? result.fundingSurplus : result.fundingGap),
                color: result.isFullyFunded ? 'text-emerald-600' : 'text-rose-600',
              },
              { label: 'Recommended Monthly Contribution', value: fmtUSD(result.recommendedMonthlyContribution), color: 'text-blue-600' },
            ].map(kpi => (
              <div key={kpi.label} className={`${cardClass} text-center`}>
                <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Funding status banner */}
          {result.isFullyFunded ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm font-medium mb-6">
              Your current savings plan fully funds college — you have a {fmtUSD(result.fundingSurplus)} surplus after the final college year.
            </div>
          ) : (
            <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm font-medium mb-6">
              {result.runsOutYear
                ? `Your 529 balance runs out partway through College Year ${result.runsOutYear}. Increase contributions to ${fmtUSD(result.recommendedMonthlyContribution)}/month to fully fund college.`
                : `You have a ${fmtUSD(result.fundingGap)} funding gap. Increasing contributions to ${fmtUSD(result.recommendedMonthlyContribution)}/month fully funds the goal.`}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Growth-then-drawdown chart */}
            <div className={cardClass}>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">529 Balance: Savings → College Drawdown</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={result.growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                  <Line type="monotone" dataKey="balance" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} name="Balance" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost inflation bar */}
            <div className={cardClass}>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Projected Annual College Cost (Inflated)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={result.costInflationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                  <Bar dataKey="cost" name="Annual Cost" fill={CHART_COLORS.rose} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Contribution vs growth stacked bar */}
          <div className={`${cardClass} mb-6`}>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Your Contributions vs Investment Growth at College Start</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={contribData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* College year schedule */}
          <div className={`${cardClass} mb-6`}>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Yearly College Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-700">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                    <th className="text-left p-2 rounded-tl-lg">College Year</th>
                    <th className="text-right p-2">Projected Cost</th>
                    <th className="text-right p-2">Starting Balance</th>
                    <th className="text-right p-2">Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.collegeYearData.map(row => (
                    <tr key={row.year} className="border-t border-slate-100">
                      <td className="p-2 font-medium">Year {row.year}</td>
                      <td className="text-right p-2">{fmtUSD(row.projectedCost)}</td>
                      <td className="text-right p-2">{fmtUSD(row.startingBalance)}</td>
                      <td className={`text-right p-2 font-semibold ${row.endingBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{fmtUSD(row.endingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* State tax savings */}
          {inputs.stateDeductionRate > 0 && (
            <div className={cardClass}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">State Tax Savings on Contributions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Annual State Tax Savings</p>
                  <p className="text-xl font-bold text-emerald-600">{fmtUSD(result.annualStateSavings)}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Lifetime State Tax Savings</p>
                  <p className="text-xl font-bold text-emerald-600">{fmtUSD(result.lifetimeStateSavings)}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
