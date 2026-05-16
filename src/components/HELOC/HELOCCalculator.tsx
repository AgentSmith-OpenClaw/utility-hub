import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { useHELOC } from '../../hooks/useHELOC';
import { fmtUSD } from './HELOCCalculator.utils';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import { CHART_COLORS } from '../../utils/chartColors';

interface NumInputProps {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; min?: number; max?: number; tooltip?: string;
}

const NumInput: React.FC<NumInputProps> = ({ label, value, onChange, prefix, suffix, min = 0, max, tooltip }) => {
  const [focused, setFocused] = useState(false);
  const [display, setDisplay] = useState(value.toLocaleString());
  React.useEffect(() => { if (!focused) setDisplay(value.toLocaleString()); }, [value, focused]);
  return (
    <div className="mb-4 last:mb-0">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {tooltip && <span className="group relative"><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] text-slate-500 cursor-help font-bold">?</span><span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-20 shadow-xl w-56 whitespace-pre-line">{tooltip}</span></span>}
      </label>
      <div className={`flex items-center bg-white rounded-lg border-2 px-3 py-2.5 min-h-[44px] transition-all ${focused ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
        {prefix && <span className="text-slate-400 font-semibold mr-1.5">{prefix}</span>}
        <input type="text" value={display}
          onFocus={(e) => { setFocused(true); setDisplay(value.toString()); e.target.select(); }}
          onBlur={() => { setFocused(false); const p = parseFloat(display.replace(/[^0-9.]/g, '')); if (!isNaN(p)) { const c = max !== undefined ? Math.min(p, max) : p; onChange(Math.max(min, c)); } else setDisplay(value.toLocaleString()); }}
          onChange={(e) => setDisplay(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          className="flex-1 bg-transparent outline-none text-slate-900 font-semibold" />
        {suffix && <span className="text-slate-400 text-sm ml-1.5">{suffix}</span>}
      </div>
    </div>
  );
};

const CurrTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3"><p className="text-xs text-slate-500 mb-1">Month {label}</p>{payload.map((p: any) => <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>{p.name}: {fmtUSD(p.value)}</p>)}</div>;
};

export default function HELOCCalculator() {
  const { inputs, result, update } = useHELOC();
  const [tab, setTab] = useState<'payment' | 'equity' | 'amort'>('payment');

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'HELOC Analysis Report',
    subtitle: `${inputs.amountDrawn.toLocaleString()} drawn at ${inputs.drawRate}% / ${inputs.repayRate}%`,
    filename: 'HELOC_Calculator.pdf',
    sections: [
      { type: 'inputs', title: 'HELOC Details', inputs: [
        { label: 'Home Value', value: fmtUSD(inputs.homeValue) },
        { label: 'Existing Mortgage', value: fmtUSD(inputs.existingMortgage) },
        { label: 'Max CLTV', value: `${inputs.maxCLTV}%` },
        { label: 'Draw Rate', value: `${inputs.drawRate}%` },
        { label: 'Repay Rate', value: `${inputs.repayRate}%` },
        { label: 'Amount Drawn', value: fmtUSD(inputs.amountDrawn) },
      ]},
      { type: 'metrics', title: 'Results', metrics: [
        { label: 'Max HELOC', value: fmtUSD(result.maxHELOC) },
        { label: 'Draw Payment', value: `${fmtUSD(result.drawPaymentMonthly)}/mo` },
        { label: 'Repay Payment', value: `${fmtUSD(result.repayPaymentMonthly)}/mo` },
        { label: 'Total Interest', value: fmtUSD(result.totalInterestPaid) },
        { label: 'Total Cost', value: fmtUSD(result.totalCostOfHELOC) },
      ]},
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    { name: 'Summary', rows: [
      { Item: 'Max HELOC Available', Value: result.maxHELOC },
      { Item: 'Amount Drawn', Value: inputs.amountDrawn },
      { Item: 'Draw Phase Payment (monthly)', Value: result.drawPaymentMonthly.toFixed(2) },
      { Item: 'Repay Phase Payment (monthly)', Value: result.repayPaymentMonthly.toFixed(2) },
      { Item: 'Total Interest - Draw Phase', Value: result.totalInterestDraw.toFixed(2) },
      { Item: 'Total Interest - Repay Phase', Value: result.totalInterestRepay.toFixed(2) },
      { Item: 'Total Interest Paid', Value: result.totalInterestPaid.toFixed(2) },
      { Item: 'Total Cost of HELOC', Value: result.totalCostOfHELOC.toFixed(2) },
    ]},
    { name: 'Amortization', rows: result.repayAmortization.map(r => ({ Month: r.month, Principal: r.principal, Interest: r.interest, Balance: r.balance })) },
  ];

  const shareMessage = `HELOC Analysis: Max line ${fmtUSD(result.maxHELOC)}, draw payment ${fmtUSD(result.drawPaymentMonthly)}/mo → repay ${fmtUSD(result.repayPaymentMonthly)}/mo. Calculate yours at Toolisk.`;

  const drawnWarning = inputs.amountDrawn > result.maxHELOC && result.maxHELOC > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🏠</span>
          <div>
            <h1 className="text-2xl font-bold">HELOC Calculator</h1>
            <p className="text-teal-100 text-sm mt-0.5">Model draw-phase interest-only payments and repayment-phase P&I — including the payment shock.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <ExportShareBar filenameBase="HELOC_Calculator" buildPdfConfig={buildPdfConfig} buildExcelSheets={buildExcelSheets} shareMessage={shareMessage} />

        {drawnWarning && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium">
            ⚠️ Draw amount exceeds your HELOC limit ({fmtUSD(result.maxHELOC)}). Capped to max available.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          {/* Inputs */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Your Home</span></div>
              <NumInput label="Current Home Value" value={inputs.homeValue} onChange={(v) => update({ homeValue: v })} prefix="$" />
              <NumInput label="Existing Mortgage Balance" value={inputs.existingMortgage} onChange={(v) => update({ existingMortgage: v })} prefix="$" />
              <NumInput label="Max CLTV Allowed by Lender" value={inputs.maxCLTV} onChange={(v) => update({ maxCLTV: v })} suffix="%" min={70} max={90} tooltip="Combined Loan-to-Value ratio. Most lenders cap at 80–90%." />
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">HELOC Terms</span></div>
              <NumInput label="Draw Period Rate" value={inputs.drawRate} onChange={(v) => update({ drawRate: v })} suffix="%" min={0} max={30} tooltip="HELOC rates are variable in reality; enter current rate for projections." />
              <NumInput label="Repayment Period Rate" value={inputs.repayRate} onChange={(v) => update({ repayRate: v })} suffix="%" min={0} max={30} />
              <NumInput label="Draw Period" value={inputs.drawYears} onChange={(v) => update({ drawYears: v })} suffix="yrs" min={1} max={15} />
              <NumInput label="Repayment Period" value={inputs.repayYears} onChange={(v) => update({ repayYears: v })} suffix="yrs" min={1} max={30} />
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4"><span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Draw Plan</span></div>
              <NumInput label="Amount to Draw" value={inputs.amountDrawn} onChange={(v) => update({ amountDrawn: v })} prefix="$" />
              <div className="mb-2">
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Draw Timing</label>
                <div className="flex gap-2">
                  {(['lump', 'spread'] as const).map((opt) => (
                    <button key={opt} onClick={() => update({ drawTiming: opt })}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all min-h-[44px] ${inputs.drawTiming === opt ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {opt === 'lump' ? 'All at once' : 'Spread evenly'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 col-span-full sm:col-span-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Max HELOC Available</p>
                  <p className="text-3xl font-black text-teal-700">{fmtUSD(result.maxHELOC)}</p>
                  <p className="text-xs text-slate-400 mt-1">Available after draw: {fmtUSD(result.availableCredit)}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Draw Phase Payment</p>
                  <p className="text-2xl font-bold text-slate-900">{fmtUSD(result.drawPaymentMonthly)}<span className="text-sm text-slate-400">/mo</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">Interest-only</p>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Repay Phase Payment</p>
                  <p className="text-2xl font-bold text-rose-700">{fmtUSD(result.repayPaymentMonthly)}<span className="text-sm text-rose-400">/mo</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    +{fmtUSD(result.repayPaymentMonthly - result.drawPaymentMonthly)} payment shock
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Draw-phase interest</p>
                  <p className="text-lg font-bold text-slate-800">{fmtUSD(result.totalInterestDraw)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Repay-phase interest</p>
                  <p className="text-lg font-bold text-slate-800">{fmtUSD(result.totalInterestRepay)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Total interest paid</p>
                  <p className="text-lg font-bold text-rose-700">{fmtUSD(result.totalInterestPaid)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Total cost of HELOC</p>
                  <p className="text-lg font-bold text-slate-800">{fmtUSD(result.totalCostOfHELOC)}</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex gap-2 mb-5 flex-wrap">
                {(['payment', 'equity', 'amort'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {t === 'payment' ? 'Payment Over Time' : t === 'equity' ? 'Equity Breakdown' : 'Repay Amortization'}
                  </button>
                ))}
              </div>

              {tab === 'payment' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Monthly payment — interest-only draw phase, then P+I repayment</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={result.paymentData.filter((_, i) => i % 3 === 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip content={<CurrTooltip />} />
                      <ReferenceLine x={inputs.drawYears * 12} stroke={CHART_COLORS.rose} strokeDasharray="4 4" label={{ value: 'Repayment Starts', fontSize: 10, fill: CHART_COLORS.rose }} />
                      <Line type="monotone" dataKey="payment" name="Monthly Payment" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {tab === 'equity' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Home equity breakdown</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={result.equityData} layout="vertical" barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                      <Bar dataKey="value" name="Amount" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {tab === 'amort' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Repayment-phase principal vs interest per year</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={result.repayAmortization}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(v: number | undefined) => v != null ? fmtUSD(v) : ''} />
                      <Legend />
                      <Area type="monotone" dataKey="principal" name="Principal" stackId="a" stroke={CHART_COLORS.teal} fill={CHART_COLORS.teal} fillOpacity={0.5} />
                      <Area type="monotone" dataKey="interest" name="Interest" stackId="a" stroke={CHART_COLORS.rose} fill={CHART_COLORS.rose} fillOpacity={0.5} />
                    </AreaChart>
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
