import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { useMortgageRefinanceBreakeven } from '../../hooks/useMortgageRefinanceBreakeven';
import { formatCurrency } from './MortgageRefinanceBreakeven.utils';
import ExportShareBar from '../Tools/ExportShareBar';
import type { PDFReportConfig } from '../../utils/pdf';
import type { GenericExcelSheet } from '../../utils/excel';
import { CHART_COLORS } from '../../utils/chartColors';

// ── Number Input ──────────────────────────────────────────────────────────────
interface NumInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
}

const NumInput: React.FC<NumInputProps> = ({ label, value, onChange, prefix, suffix, min = 0, max, step = 1, tooltip }) => {
  const [focused, setFocused] = useState(false);
  const [display, setDisplay] = useState(value.toLocaleString());

  React.useEffect(() => {
    if (!focused) setDisplay(value.toLocaleString());
  }, [value, focused]);

  return (
    <div className="mb-4 last:mb-0">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {tooltip && (
          <span className="group relative">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] text-slate-500 cursor-help font-bold">?</span>
            <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-pre-line z-20 shadow-xl w-56">{tooltip}</span>
          </span>
        )}
      </label>
      <div className={`flex items-center bg-white rounded-lg border-2 px-3 py-2.5 transition-all min-h-[44px] ${focused ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
        {prefix && <span className="text-slate-400 font-semibold mr-1.5">{prefix}</span>}
        <input
          type="text"
          value={display}
          onFocus={(e) => { setFocused(true); setDisplay(value.toString()); e.target.select(); }}
          onBlur={() => {
            setFocused(false);
            const cleaned = display.replace(/[^0-9.]/g, '');
            const parsed = parseFloat(cleaned);
            if (!isNaN(parsed)) {
              const clamped = max !== undefined ? Math.min(parsed, max) : parsed;
              onChange(Math.max(min, clamped));
            } else {
              setDisplay(value.toLocaleString());
            }
          }}
          onChange={(e) => setDisplay(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          className="flex-1 bg-transparent outline-none text-slate-900 font-semibold text-base"
        />
        {suffix && <span className="text-slate-400 text-sm ml-1.5">{suffix}</span>}
      </div>
    </div>
  );
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CurrencyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3">
      <p className="text-xs text-slate-500 mb-1">Month {label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function MortgageRefinanceBreakeven() {
  const { inputs, result, updateInputs } = useMortgageRefinanceBreakeven();
  const [activeTab, setActiveTab] = useState<'cumulative' | 'payment' | 'interest'>('cumulative');

  const buildPdfConfig = (): PDFReportConfig => ({
    title: 'Mortgage Refinance Break-Even Analysis',
    subtitle: `Stay-horizon: ${inputs.stayYears} years • Break-even: ${result.breakEvenMonths === Infinity ? 'N/A' : result.breakEvenMonths + ' months'}`,
    filename: 'Mortgage_Refinance_Breakeven.pdf',
    sections: [
      {
        type: 'inputs',
        title: 'Current Mortgage',
        inputs: [
          { label: 'Loan Balance', value: formatCurrency(inputs.currentBalance) },
          { label: 'Interest Rate', value: `${inputs.currentRate}%` },
          { label: 'Years Remaining', value: `${inputs.yearsRemaining} years` },
        ],
      },
      {
        type: 'inputs',
        title: 'New Mortgage',
        inputs: [
          { label: 'New Rate', value: `${inputs.newRate}%` },
          { label: 'New Term', value: `${inputs.newTermYears} years` },
          { label: 'Closing Costs', value: formatCurrency(inputs.closingCosts) },
          { label: 'Cost Handling', value: inputs.closingCostHandling === 'upfront' ? 'Pay Upfront' : 'Roll Into Loan' },
          { label: 'Stay Years', value: `${inputs.stayYears} years` },
        ],
      },
      {
        type: 'metrics',
        title: 'Results',
        metrics: [
          { label: `Net Savings (${inputs.stayYears}-yr horizon)`, value: formatCurrency(result.stayHorizonNetSavings) },
          { label: 'Break-Even', value: result.breakEvenMonths === Infinity ? 'N/A' : `${result.breakEvenMonths} months` },
          { label: 'Monthly Savings', value: formatCurrency(result.monthlySavings) },
          { label: 'Lifetime Interest Savings', value: formatCurrency(result.lifetimeInterestSavings) },
        ],
      },
    ],
  });

  const buildExcelSheets = (): GenericExcelSheet[] => [
    {
      name: 'Summary',
      rows: [
        { Item: 'Current Monthly P&I', Value: result.currentMonthlyPI.toFixed(2) },
        { Item: 'New Monthly P&I', Value: result.newMonthlyPI.toFixed(2) },
        { Item: 'Monthly Savings', Value: result.monthlySavings.toFixed(2) },
        { Item: 'Break-Even (months)', Value: result.breakEvenMonths === Infinity ? 'N/A' : result.breakEvenMonths },
        { Item: `Net Savings (${inputs.stayYears} yrs)`, Value: result.stayHorizonNetSavings.toFixed(2) },
        { Item: 'Lifetime Interest Savings', Value: result.lifetimeInterestSavings.toFixed(2) },
      ],
    },
    {
      name: 'Cumulative Payments',
      rows: result.cumulativeData.map((d) => ({
        Month: d.month,
        'Current Loan': d.currentCumulative,
        'Refinanced Loan': d.newCumulative,
      })),
    },
  ];

  const shareMessage = `Mortgage Refinance Analysis: ${result.monthlySavings > 0 ? 'Save' : 'Cost'} ${formatCurrency(Math.abs(result.monthlySavings))}/month. Break-even: ${result.breakEvenMonths === Infinity ? 'Never' : result.breakEvenMonths + ' months'}. Calculate yours at Toolisk.`;

  const paymentBarData = [
    { name: 'Current', payment: Math.round(result.currentMonthlyPI) },
    { name: 'Refinanced', payment: Math.round(result.newMonthlyPI) },
  ];

  const interestBarData = [
    { name: 'Current', interest: Math.round(result.currentTotalInterest), label: 'Current Interest' },
    { name: 'Refinanced', interest: Math.round(result.newTotalInterest), label: 'New Interest' },
  ];

  const isNoSavings = result.monthlySavings <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏠</span>
            <div>
              <h1 className="text-2xl font-bold">Mortgage Refinance Break-Even Calculator</h1>
              <p className="text-blue-100 text-sm mt-0.5">Find exactly when your refinance pays off — and if it will given how long you plan to stay.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <ExportShareBar
          filenameBase="Mortgage_Refinance_Breakeven"
          buildPdfConfig={buildPdfConfig}
          buildExcelSheets={buildExcelSheets}
          shareMessage={shareMessage}
        />

        {isNoSavings && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-medium"
          >
            ⚠️ This refinance does not lower your monthly payment. Review your rate or term inputs.
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
          {/* Input Panel */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {/* Current Mortgage */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">Current Mortgage</span>
              </div>
              <NumInput label="Loan Balance" value={inputs.currentBalance} onChange={(v) => updateInputs({ currentBalance: v })} prefix="$" />
              <NumInput label="Interest Rate" value={inputs.currentRate} onChange={(v) => updateInputs({ currentRate: v })} suffix="%" min={0} max={30} step={0.125} />
              <NumInput label="Years Remaining" value={inputs.yearsRemaining} onChange={(v) => updateInputs({ yearsRemaining: v })} suffix="yrs" min={1} max={30} />
            </div>

            {/* New Mortgage */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">New (Refinanced) Mortgage</span>
              </div>
              <NumInput label="New Interest Rate" value={inputs.newRate} onChange={(v) => updateInputs({ newRate: v })} suffix="%" min={0} max={30} step={0.125} />
              <NumInput label="New Loan Term" value={inputs.newTermYears} onChange={(v) => updateInputs({ newTermYears: v })} suffix="yrs" min={1} max={30} />
              <NumInput label="Closing Costs" value={inputs.closingCosts} onChange={(v) => updateInputs({ closingCosts: v })} prefix="$" />

              <div className="mb-4">
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Closing-Cost Handling</label>
                <div className="flex gap-2">
                  {(['upfront', 'roll'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateInputs({ closingCostHandling: opt })}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                        inputs.closingCostHandling === opt
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt === 'upfront' ? 'Pay Upfront' : 'Roll Into Loan'}
                    </button>
                  ))}
                </div>
              </div>

              <NumInput
                label="Years You Plan to Stay"
                value={inputs.stayYears}
                onChange={(v) => updateInputs({ stayYears: v })}
                suffix="yrs"
                min={1}
                max={30}
                tooltip="Your stay-horizon determines the headline savings number — the most important output."
              />
              <NumInput label="Cash-Out Amount" value={inputs.cashOut} onChange={(v) => updateInputs({ cashOut: v })} prefix="$" tooltip="Optional. Additional cash you want to take out at closing, added to the new loan principal." />
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-4">
            {/* Headline KPIs */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-700 mb-4">Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Stay-horizon savings — headline */}
                <motion.div
                  key={result.stayHorizonNetSavings}
                  initial={{ scale: 0.97 }}
                  animate={{ scale: 1 }}
                  className={`col-span-full p-4 rounded-xl ${result.stayHorizonNetSavings >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}
                >
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Net Savings if You Stay {inputs.stayYears} Years</p>
                  <p className={`text-4xl font-black ${result.stayHorizonNetSavings >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {result.stayHorizonNetSavings >= 0 ? '' : '-'}{formatCurrency(Math.abs(result.stayHorizonNetSavings))}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{result.isWorthIt ? '✅ Refinance is worth it given your stay horizon.' : '❌ Not worth it — you leave before breaking even.'}</p>
                </motion.div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Break-Even Point</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {result.breakEvenMonths === Infinity ? 'Never' : `${result.breakEvenMonths} mo`}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {result.breakEvenMonths === Infinity ? 'No monthly savings' : `≈ ${result.breakEvenYears.toFixed(1)} years`}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly Savings</p>
                  <p className={`text-2xl font-bold ${result.monthlySavings >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {formatCurrency(result.monthlySavings)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Per month after refi</p>
                </div>
              </div>

              {/* Payment comparison */}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Current Monthly P&I</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(result.currentMonthlyPI)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">New Monthly P&I</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(result.newMonthlyPI)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Current Remaining Interest</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(result.currentTotalInterest)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">New Total Interest</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(result.newTotalInterest)}</p>
                </div>
                <div className="col-span-2 bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 font-medium mb-0.5">Lifetime Interest Savings</p>
                  <p className={`text-xl font-bold ${result.lifetimeInterestSavings >= 0 ? 'text-blue-700' : 'text-rose-600'}`}>
                    {result.lifetimeInterestSavings >= 0 ? '' : '-'}{formatCurrency(Math.abs(result.lifetimeInterestSavings))}
                  </p>
                  {result.lifetimeInterestSavings < 0 && (
                    <p className="text-xs text-rose-500 mt-0.5">Term reset added interest even at lower rate.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex gap-2 mb-5 flex-wrap">
                {(['cumulative', 'payment', 'interest'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'cumulative' ? 'Cumulative Cost' : t === 'payment' ? 'Monthly Payment' : 'Total Interest'}
                  </button>
                ))}
              </div>

              {activeTab === 'cumulative' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Cumulative payments over time — crossover = break-even</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={result.cumulativeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: CHART_COLORS.axis }} label={{ value: 'Months', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Legend />
                      {result.breakEvenMonths !== Infinity && (
                        <ReferenceLine x={result.breakEvenMonths} stroke={CHART_COLORS.rose} strokeDasharray="4 4" label={{ value: 'Break-Even', fontSize: 10, fill: CHART_COLORS.rose }} />
                      )}
                      <Line type="monotone" dataKey="currentCumulative" name="Current Loan" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="newCumulative" name="Refinanced Loan" stroke={CHART_COLORS.teal} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Monthly principal + interest comparison</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={paymentBarData} barSize={60}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(v: number | undefined) => [v != null ? formatCurrency(v) : '', 'Monthly P&I']} />
                      <Bar dataKey="payment" name="Monthly P&I" radius={[6, 6, 0, 0]}>
                        {paymentBarData.map((_, i) => (
                          <rect key={i} fill={i === 0 ? CHART_COLORS.primary : CHART_COLORS.teal} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'interest' && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">Total interest paid over the loan term</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={interestBarData} barSize={60}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: CHART_COLORS.axis }} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: CHART_COLORS.axis }} />
                      <Tooltip formatter={(v: number | undefined) => [v != null ? formatCurrency(v) : '', 'Total Interest']} />
                      <Bar dataKey="interest" name="Total Interest" fill={CHART_COLORS.rose} radius={[6, 6, 0, 0]} />
                    </BarChart>
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
