import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useRealHourlyWage } from '../../hooks/useRealHourlyWage';
import { CURRENCY_OPTIONS } from './RealHourlyWageCalculator.types';
import {
  formatCurrency,
  formatHours,
  CHART_COLORS,
} from './RealHourlyWageCalculator.utils';
import {
  generatePDFReport,
  type PDFReportConfig,
} from '../../utils/pdf';
import { exportRealHourlyWageToExcel } from '../../utils/excel';

// --- Sub-components ---

const HelpTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group ml-1.5 cursor-help">
    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center text-[9px] font-bold">
      ?
    </span>
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-relaxed font-medium">
      {text}
    </span>
  </span>
);

const InputField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}> = ({ label, value, onChange, min, max, step, prefix, suffix, tooltip }) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toLocaleString('en-US'));
  const pct = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    if (!focused) setDisplayValue(value.toLocaleString('en-US'));
  }, [value, focused]);

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-bold text-slate-700 flex items-center">
          {label}
          {tooltip && <HelpTooltip text={tooltip} />}
        </label>
        <div
          className={`flex items-center bg-white rounded-xl border-2 px-3 py-1.5 transition-all ${
            focused
              ? 'border-blue-400 shadow-md ring-2 ring-blue-50'
              : 'border-slate-100 hover:border-slate-200'
          }`}
        >
          {prefix && (
            <span className="text-sm font-bold text-slate-400 mr-1.5">
              {prefix}
            </span>
          )}
          <input
            type="text"
            value={displayValue}
            onFocus={(e) => {
              setFocused(true);
              setDisplayValue(value.toString());
              e.target.select();
            }}
            onBlur={() => {
              setFocused(false);
              const cleaned = displayValue.replace(/[^0-9.]/g, '');
              const parsed = parseFloat(cleaned);
              if (!isNaN(parsed)) onChange(Math.min(Math.max(parsed, min), max));
            }}
            onChange={(e) => setDisplayValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
            }}
            className="w-24 text-right text-sm font-black text-slate-900 bg-transparent outline-none"
          />
          {suffix && (
            <span className="text-sm font-bold text-slate-400 ml-1.5">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        style={{
          background: `linear-gradient(to right, ${CHART_COLORS.primary} ${pct}%, ${CHART_COLORS.grid} ${pct}%)`,
        }}
      />
    </div>
  );
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
      <p className="text-sm font-bold text-slate-900 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div
          key={entry.name}
          className="flex items-center gap-2 text-xs mb-1 last:mb-0"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: entry.color || entry.stroke || entry.fill,
            }}
          />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">
            {typeof entry.value === 'number'
              ? entry.value.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
      <p className="text-sm font-bold text-slate-900">{d.name}</p>
      <p className="text-xs text-slate-600">
        {d.value.toFixed(1)} hrs/week ({((d.value / 168) * 100).toFixed(1)}%)
      </p>
    </div>
  );
};

type ChartTab = 'waterfall' | 'donut' | 'cost-breakdown' | 'time-breakdown';

const DONUT_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.rose,
  CHART_COLORS.accent,
  CHART_COLORS.teal,
];

// --- Main Component ---

const RealHourlyWageCalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useRealHourlyWage();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ChartTab>('waterfall');
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  const cs = inputs.currency_symbol;
  const sm = result.summary_metrics;
  const db = result.detailed_breakdown;

  // Cost breakdown data for bar chart
  const costBreakdownData = [
    {
      name: 'Commute',
      value: inputs.is_remote ? 0 : inputs.commute_cost_monthly * 12,
    },
    {
      name: 'Food & Coffee',
      value: inputs.is_remote ? 0 : inputs.food_coffee_monthly * 12,
    },
    { name: 'Professional', value: inputs.professional_upkeep_annual },
    { name: 'Miscellaneous', value: inputs.misc_monthly_costs * 12 },
  ];

  // Time breakdown data for stacked area/bar chart
  const timeBreakdownData = [
    { name: 'Contract', value: (52 - inputs.vacation_weeks) * inputs.hours_per_week },
    {
      name: 'Commute',
      value:
        inputs.is_remote
          ? 0
          : ((inputs.commute_daily_minutes / 60) * 5 * (52 - inputs.vacation_weeks)),
    },
    {
      name: 'Prep',
      value: (inputs.prep_daily_minutes / 60) * 5 * (52 - inputs.vacation_weeks),
    },
    {
      name: 'Decompress',
      value:
        (inputs.decompression_daily_minutes / 60) *
        5 *
        (52 - inputs.vacation_weeks),
    },
    {
      name: 'Overtime',
      value: inputs.unpaid_overtime_weekly * (52 - inputs.vacation_weeks),
    },
  ];

  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const fmt = (v: number) => formatCurrency(v, cs);
      const config: PDFReportConfig = {
        title: 'Real Hourly Wage Report',
        subtitle: `Shadow Work Analysis — ${inputs.is_remote ? 'Remote' : 'In-Office'} Worker`,
        filename: 'Real_Hourly_Wage_Report.pdf',
        sections: [
          {
            type: 'inputs',
            title: 'Your Work Profile',
            inputs: [
              { label: 'Gross Annual Salary', value: fmt(inputs.gross_annual_salary) },
              { label: 'Effective Tax Rate', value: `${inputs.tax_rate}%` },
              { label: 'Hours/Week', value: `${inputs.hours_per_week}` },
              { label: 'Vacation Weeks', value: `${inputs.vacation_weeks}` },
              { label: 'Daily Commute', value: `${inputs.commute_daily_minutes} min` },
              { label: 'Daily Prep Time', value: `${inputs.prep_daily_minutes} min` },
              { label: 'Unpaid Overtime', value: `${inputs.unpaid_overtime_weekly} hrs/week` },
              { label: 'Work Mode', value: inputs.is_remote ? 'Remote' : 'In-Office' },
            ],
          },
          {
            type: 'metrics',
            title: 'Key Results',
            metrics: [
              { label: 'Nominal Hourly Wage', value: `${fmt(sm.nominal_wage)}/hr` },
              { label: 'Real Hourly Wage', value: `${fmt(sm.real_wage)}/hr`, subtitle: 'What you truly earn' },
              { label: 'Wage Erosion', value: `${sm.erosion_percentage.toFixed(1)}%`, subtitle: 'Value lost to shadow work' },
              { label: 'Remote Equivalent Salary', value: fmt(sm.remote_equivalent) },
            ],
          },
          {
            type: 'message',
            message: {
              heading: 'Key Insight',
              text: `Your "paper" wage of ${fmt(sm.nominal_wage)}/hr drops to ${fmt(sm.real_wage)}/hr when accounting for ${formatHours(db.total_unpaid_hours)} unpaid shadow hours and ${fmt(db.total_annual_work_costs)} in hidden work costs per year.`,
            },
          },
          {
            type: 'charts',
            title: 'Visual Analysis',
            charts: [
              { title: 'Salary Erosion Waterfall', elementId: 'rhw-chart-main' },
            ],
          },
        ],
      };
      await generatePDFReport(config);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [inputs, result, cs, sm, db]);

  const handleExportExcel = useCallback(async () => {
    setExporting('excel');
    try {
      exportRealHourlyWageToExcel(inputs, result);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [inputs, result]);

  const handleCopyURL = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    const text = `My Real Hourly Wage: ${formatCurrency(sm.real_wage, cs)}/hr (${sm.erosion_percentage.toFixed(1)}% erosion from shadow work). Check yours: ${window.location.href}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }, [sm, cs]);

  const handleShareTwitter = useCallback(() => {
    const text = `TIL my real hourly wage is ${formatCurrency(sm.real_wage, cs)}/hr — ${sm.erosion_percentage.toFixed(1)}% less than my "paper" rate of ${formatCurrency(sm.nominal_wage, cs)}/hr. Shadow work is real! 🤯 Calculate yours:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  }, [sm, cs]);

  if (!mounted) return null;

  const chartTabs: { key: ChartTab; label: string }[] = [
    { key: 'waterfall', label: 'Salary Erosion' },
    { key: 'donut', label: '168-Hr Week' },
    { key: 'cost-breakdown', label: 'Cost Breakdown' },
    { key: 'time-breakdown', label: 'Time Breakdown' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Real Hourly Wage Calculator
          </h1>
          <p className="mt-2 text-blue-100 text-base sm:text-lg max-w-2xl">
            Discover what you <span className="text-white font-semibold">truly</span> earn per hour after accounting for shadow work, commute time, and hidden employment costs.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-10">
        {/* Export/Share Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-3 sm:p-4 mb-6 flex flex-wrap gap-2 items-center">
          <button
            onClick={handleExportPDF}
            disabled={exporting === 'pdf'}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            {exporting === 'pdf' ? '⏳' : '📄'} PDF
          </button>
          <button
            onClick={handleExportExcel}
            disabled={exporting === 'excel'}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors disabled:opacity-50"
          >
            {exporting === 'excel' ? '⏳' : '📊'} Excel
          </button>
          <button
            onClick={handleCopyURL}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            {copied ? '✅' : '🔗'} {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
          >
            💬 WhatsApp
          </button>
          <button
            onClick={handleShareTwitter}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
          >
            🐦 Twitter
          </button>
        </div>

        {/* Main Grid: Inputs + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* LEFT: Inputs */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
            {/* Financial Inputs */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                💰 Income Details
              </h2>
              <p className="text-xs text-slate-500 mb-5">Your gross salary and tax rate</p>

              <div className="mb-4">
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Currency</label>
                <div className="flex gap-2">
                  {CURRENCY_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateInputs({ currency_symbol: c })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        inputs.currency_symbol === c
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <InputField
                label="Gross Annual Salary"
                value={inputs.gross_annual_salary}
                onChange={(v) => updateInputs({ gross_annual_salary: v })}
                min={0}
                max={1000000}
                step={1000}
                prefix={cs}
                tooltip="Your total pre-tax annual income"
              />
              <InputField
                label="Effective Tax Rate"
                value={inputs.tax_rate}
                onChange={(v) => updateInputs({ tax_rate: v })}
                min={0}
                max={60}
                step={0.5}
                suffix="%"
                tooltip="Your effective (not marginal) tax rate"
              />
            </div>

            {/* Time Inputs */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                ⏰ Time Investment
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                The real time your job consumes each week
              </p>

              <InputField
                label="Contract Hours/Week"
                value={inputs.hours_per_week}
                onChange={(v) => updateInputs({ hours_per_week: v })}
                min={1}
                max={80}
                step={1}
                suffix="hrs"
              />
              <InputField
                label="Vacation Weeks/Year"
                value={inputs.vacation_weeks}
                onChange={(v) => updateInputs({ vacation_weeks: v })}
                min={0}
                max={12}
                step={0.5}
                suffix="wks"
              />
              <InputField
                label="Daily Commute (Round-trip)"
                value={inputs.commute_daily_minutes}
                onChange={(v) => updateInputs({ commute_daily_minutes: v })}
                min={0}
                max={240}
                step={5}
                suffix="min"
                tooltip="Total round-trip travel time per work day"
              />
              <InputField
                label="Daily Prep Time"
                value={inputs.prep_daily_minutes}
                onChange={(v) => updateInputs({ prep_daily_minutes: v })}
                min={0}
                max={120}
                step={5}
                suffix="min"
                tooltip="Getting ready, packing lunch, etc."
              />
              <InputField
                label="Daily Decompression"
                value={inputs.decompression_daily_minutes}
                onChange={(v) => updateInputs({ decompression_daily_minutes: v })}
                min={0}
                max={120}
                step={5}
                suffix="min"
                tooltip="Post-work recovery / unwinding time"
              />
              <InputField
                label="Unpaid Overtime/Week"
                value={inputs.unpaid_overtime_weekly}
                onChange={(v) => updateInputs({ unpaid_overtime_weekly: v })}
                min={0}
                max={40}
                step={0.5}
                suffix="hrs"
                tooltip="Extra hours worked beyond contract"
              />
            </div>

            {/* Cost Inputs */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                🧾 Work-Related Costs
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Monthly &amp; annual expenses you wouldn&apos;t have without this job
              </p>

              {/* Remote toggle */}
              <div className="flex items-center justify-between mb-5 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-sm font-bold text-slate-700">Remote Worker</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Zeros out commute &amp; food costs
                  </p>
                </div>
                <button
                  onClick={() => updateInputs({ is_remote: !inputs.is_remote })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    inputs.is_remote ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={inputs.is_remote}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      inputs.is_remote ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <InputField
                label="Monthly Commute Cost"
                value={inputs.commute_cost_monthly}
                onChange={(v) => updateInputs({ commute_cost_monthly: v })}
                min={0}
                max={2000}
                step={10}
                prefix={cs}
                tooltip="Fuel, transit passes, parking"
              />
              <InputField
                label="Monthly Food & Coffee"
                value={inputs.food_coffee_monthly}
                onChange={(v) => updateInputs({ food_coffee_monthly: v })}
                min={0}
                max={1500}
                step={10}
                prefix={cs}
                tooltip="Extra spending because of office"
              />
              <InputField
                label="Annual Professional Upkeep"
                value={inputs.professional_upkeep_annual}
                onChange={(v) => updateInputs({ professional_upkeep_annual: v })}
                min={0}
                max={10000}
                step={50}
                prefix={cs}
                tooltip="Work wardrobe, dry cleaning, grooming"
              />
              <InputField
                label="Monthly Misc. Costs"
                value={inputs.misc_monthly_costs}
                onChange={(v) => updateInputs({ misc_monthly_costs: v })}
                min={0}
                max={2000}
                step={10}
                prefix={cs}
                tooltip="Childcare overages, pet care, etc."
              />
            </div>

            {/* Reset */}
            <button
              onClick={reset}
              className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              ↺ Reset Defaults
            </button>
          </div>

          {/* RIGHT: Results + Charts */}
          <div className="space-y-6">
            {/* Error */}
            {result.error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm font-medium">
                ⚠️ {result.error}
              </div>
            )}

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-md p-5 text-white">
                <p className="text-xs font-medium text-blue-200 mb-1">Nominal Wage</p>
                <p className="text-2xl font-extrabold">
                  {formatCurrency(sm.nominal_wage, cs)}
                  <span className="text-sm font-medium text-blue-200">/hr</span>
                </p>
                <p className="text-[11px] text-blue-200 mt-1">Paper hourly rate</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-md p-5 text-white">
                <p className="text-xs font-medium text-emerald-200 mb-1">Real Wage</p>
                <p className="text-2xl font-extrabold">
                  {formatCurrency(sm.real_wage, cs)}
                  <span className="text-sm font-medium text-emerald-200">/hr</span>
                </p>
                <p className="text-[11px] text-emerald-200 mt-1">True hourly rate</p>
              </div>
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-md p-5 text-white">
                <p className="text-xs font-medium text-rose-200 mb-1">Wage Erosion</p>
                <p className="text-2xl font-extrabold">
                  {sm.erosion_percentage.toFixed(1)}%
                </p>
                <p className="text-[11px] text-rose-200 mt-1">Value lost to shadow work</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl shadow-md p-5 text-white">
                <p className="text-xs font-medium text-purple-200 mb-1">Remote Equivalent</p>
                <p className="text-2xl font-extrabold">
                  {formatCurrency(sm.remote_equivalent, cs, true)}
                </p>
                <p className="text-[11px] text-purple-200 mt-1">Equivalent annual salary</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                📋 Detailed Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Total Annual Hours</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatHours(db.total_annual_hours_invested)} hrs
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Unpaid Hours</span>
                  <span className="text-sm font-bold text-rose-600">
                    {formatHours(db.total_unpaid_hours)} hrs
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Annual Work Costs</span>
                  <span className="text-sm font-bold text-rose-600">
                    {formatCurrency(db.total_annual_work_costs, cs)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Adjusted Take-Home</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {formatCurrency(db.adjusted_take_home_pay, cs)}
                  </span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {chartTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab.key
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div id="rhw-chart-main" className="w-full">
                {activeTab === 'waterfall' && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">
                      Salary Erosion — From Gross to Real
                    </h4>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={result.chart_data.waterfall_series}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={CHART_COLORS.grid}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                          angle={-20}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                          tickFormatter={(v) =>
                            formatCurrency(v, cs, true)
                          }
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="cumulative" radius={[6, 6, 0, 0]}>
                          {result.chart_data.waterfall_series.map(
                            (entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'donut' && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">
                      Your 168-Hour Week
                    </h4>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={result.chart_data.hours_distribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }: any) =>
                            `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`
                          }
                        >
                          {result.chart_data.hours_distribution.map(
                            (_, idx) => (
                              <Cell
                                key={idx}
                                fill={DONUT_COLORS[idx % DONUT_COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'cost-breakdown' && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">
                      Annual Work-Related Costs
                    </h4>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={costBreakdownData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={CHART_COLORS.grid}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                          tickFormatter={(v) =>
                            formatCurrency(v, cs, true)
                          }
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar
                          dataKey="value"
                          name="Annual Cost"
                          fill={CHART_COLORS.rose}
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {activeTab === 'time-breakdown' && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-3">
                      Annual Hours by Category
                    </h4>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={timeBreakdownData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={CHART_COLORS.grid}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
                          tickFormatter={(v) => `${v}h`}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar
                          dataKey="value"
                          name="Annual Hours"
                          fill={CHART_COLORS.primary}
                          radius={[6, 6, 0, 0]}
                        >
                          {timeBreakdownData.map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={
                                [
                                  CHART_COLORS.primary,
                                  CHART_COLORS.rose,
                                  CHART_COLORS.accent,
                                  CHART_COLORS.purple,
                                  CHART_COLORS.secondary,
                                ][idx]
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <article className="prose prose-slate max-w-none bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-10 mb-12">
          <h2>Understanding Your Real Hourly Wage</h2>
          <p>
            Most people know their salary or even their nominal hourly rate, but very few have
            calculated what they <strong>truly</strong> earn per hour of life dedicated to work.
            The concept of the &quot;Real Hourly Wage&quot; was popularized by Vicki Robin and Joe
            Dominguez in their groundbreaking book <em>Your Money or Your Life</em>. The idea is
            simple yet powerful: your job consumes far more time and money than your paycheck
            suggests.
          </p>
          <p>
            When you include the time spent commuting, getting ready for work, decompressing after
            a stressful day, and working unpaid overtime, your actual hourly rate drops
            significantly. Add in the financial costs of maintaining employment — transit passes,
            work clothes, convenience meals, and childcare — and the picture becomes even more
            revealing. This calculator performs that complete analysis for you, showing the gap
            between your &quot;paper&quot; wage and your true earnings.
          </p>

          <h2>How the Real Hourly Wage Calculator Works</h2>
          <p>
            The calculator uses a three-step methodology to derive your true hourly rate:
          </p>
          <h3>Step 1: Total Time Investment</h3>
          <p>
            We start by calculating the total hours you dedicate to work each year. This goes
            beyond your contract hours to include &quot;shadow work&quot; — the unpaid activities
            that only exist because you have a job. Daily commute time, morning preparation,
            post-work decompression, and unpaid overtime are all added to your weekly work hours.
            These are multiplied by your actual working weeks (52 minus vacation weeks) to get
            your true annual time investment.
          </p>
          <h3>Step 2: Net Financial Benefit</h3>
          <p>
            Next, we calculate what you actually keep from your salary. Starting with gross pay,
            we subtract income taxes using your effective tax rate. Then we subtract all
            work-related costs: commuting expenses, convenience food and coffee, professional
            wardrobe and grooming, and miscellaneous costs like extra childcare. The result is
            your adjusted net income — the actual financial benefit your job provides.
          </p>
          <h3>Step 3: Core Metrics</h3>
          <p>
            Finally, we divide your adjusted net income by your total annual hours to arrive at
            your Real Hourly Wage. We also calculate the &quot;wage erosion percentage&quot; —
            how much of your nominal wage is consumed by shadow work and hidden costs — and a
            &quot;remote equivalent salary,&quot; showing what a remote job would need to pay you
            to match your current real hourly rate.
          </p>

          <h2>Real-World Use Cases and Scenarios</h2>
          <p>
            Understanding your real hourly wage can transform financial decisions. Consider a
            software engineer earning $120,000 per year who spends 90 minutes daily commuting,
            30 minutes getting ready, and regularly works 8 hours of unpaid overtime per week.
            After accounting for $500 monthly transit costs, $300 in convenience meals, and
            $2,000 in professional wardrobe costs, their real hourly wage might drop from $46/hr
            to just $28/hr — a 40% erosion.
          </p>
          <p>
            This insight is invaluable for several life decisions. When evaluating a job offer,
            comparing real hourly wages gives a more accurate picture than comparing salaries.
            A $90,000 remote position might actually pay you more per hour of life than a
            $120,000 office job. When considering a major purchase, converting the price to
            &quot;hours of life&quot; using your real wage creates a profound perspective shift.
            A $500 purchase isn&apos;t 10 hours of work at $50/hr — it&apos;s 18 hours at your
            real rate of $28/hr.
          </p>
          <p>
            The calculator is also powerful for freelancers setting rates. If you know your
            real wage from employment, you can ensure freelance rates exceed that threshold. And
            for anyone pursuing FIRE (Financial Independence, Retire Early), understanding your
            true hourly compensation helps you optimize the time-to-money equation.
          </p>

          <h2>Frequently Asked Questions</h2>
          <h3>What is &quot;shadow work&quot; in the context of employment?</h3>
          <p>
            Shadow work refers to all the unpaid time you spend because of your job. This includes
            commuting, getting dressed for work, packing lunches, decompressing after work, and
            unpaid overtime. While these activities aren&apos;t compensated, they are real time
            commitments that reduce your effective hourly rate.
          </p>
          <h3>How does the Remote Mode toggle work?</h3>
          <p>
            When you enable Remote Mode, the calculator automatically sets commute time, commute
            costs, and food/coffee expenses to zero, since remote workers typically don&apos;t
            incur these costs. This lets you quickly compare your real wage in office vs. remote
            scenarios.
          </p>
          <h3>Can my real hourly wage be negative?</h3>
          <p>
            Yes. If your work-related costs exceed your after-tax income (which can happen in
            extreme cases with long commutes and high living costs), your real hourly wage will
            be negative. This is an important signal that the job is actually costing you money.
          </p>
          <h3>What is the &quot;Remote Equivalent Salary&quot;?</h3>
          <p>
            This metric shows what a fully remote position would need to pay you (annually) to
            match your current real hourly wage, assuming standard contract hours and no shadow
            work or commute costs. It helps you compare job offers across different work
            arrangements.
          </p>
          <h3>How accurate is the 168-hour week chart?</h3>
          <p>
            The chart divides your week into four categories: paid work hours, shadow work
            (commute + prep + decompression + overtime), sleep (assumed 8 hours × 7 days = 56
            hours), and freedom (the remaining hours). It provides a visual reality check on
            how much of your life is truly free from work obligations.
          </p>
        </article>
      </div>
    </div>
  );
};

export default RealHourlyWageCalculator;
