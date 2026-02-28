import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useUSPaycheck } from '../../hooks/useUSPaycheck';
import { getStateList, formatUSD } from './USPaycheckCalculator.utils';
import type { PayFrequency, FilingStatus } from './USPaycheckCalculator.types';
import { exportToPDF } from '../../utils/pdf';
import { exportUSPaycheckToExcel } from '../../utils/excel';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHART_COLORS = {
  primary: '#007AFF',
  secondary: '#4CC9F0',
  accent: '#7209B7',
  teal: '#2ECC71',
  rose: '#E74C3C',
  purple: '#5E60CE',
  grid: '#f1f5f9',
  axis: '#94a3b8',
};

const PAY_FREQUENCY_OPTIONS: { value: PayFrequency; label: string }[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'hourly', label: 'Hourly' },
];

const FILING_STATUS_OPTIONS: { value: FilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_jointly', label: 'Married Filing Jointly' },
  { value: 'married_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
];

const STATE_LIST = getStateList();

type ChartTab = 'pie' | 'waterfall' | 'rates' | 'monthly';

const CHART_TABS: { id: ChartTab; label: string; icon: string }[] = [
  { id: 'pie', label: 'Pay Breakdown', icon: '🥧' },
  { id: 'waterfall', label: 'Tax Waterfall', icon: '📊' },
  { id: 'rates', label: 'Tax Rates', icon: '📐' },
  { id: 'monthly', label: 'Monthly Cash Flow', icon: '📈' },
];

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

const fmtAxis = (v: number): string => {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v}`;
};

const fmtPct = (v: number): string => `${(v * 100).toFixed(1)}%`;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const AnimatedNumber: React.FC<{
  value: number; prefix?: string; suffix?: string; className?: string;
}> = ({ value, prefix = '', suffix = '', className = '' }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    let frame: number;
    const duration = 600;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplay(start + diff * ease);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span className={className}>
      {prefix}
      {Math.round(display).toLocaleString('en-US')}
      {suffix}
    </span>
  );
};

const HelpTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group ml-1.5 cursor-help">
    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center text-[9px] font-bold">?</span>
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-relaxed font-medium">
      {text}
    </span>
  </span>
);

const SliderField: React.FC<{
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; tooltip?: string; accentColor?: string;
}> = ({ label, value, onChange, min, max, step, tooltip, accentColor = CHART_COLORS.primary }) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toLocaleString('en-US'));
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  useEffect(() => {
    if (!focused) setDisplayValue(value.toLocaleString('en-US'));
  }, [value, focused]);

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-slate-700 flex items-center">
          {label}
          {tooltip && <HelpTooltip text={tooltip} />}
        </label>
        <div className={`flex items-center bg-white rounded-xl border-2 px-3 py-1.5 transition-all ${
          focused ? 'border-blue-400 shadow-md ring-2 ring-blue-50' : 'border-slate-100 hover:border-slate-200'
        }`}>
          <span className="text-sm font-bold text-slate-400 mr-1.5">$</span>
          <input
            type="text"
            value={displayValue}
            onFocus={(e) => { setFocused(true); setDisplayValue(value.toString()); e.target.select(); }}
            onBlur={() => {
              setFocused(false);
              const cleaned = displayValue.replace(/[^0-9.]/g, '');
              const parsed = parseFloat(cleaned);
              if (!isNaN(parsed)) onChange(Math.min(Math.max(parsed, min), max));
            }}
            onChange={(e) => setDisplayValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="w-24 text-right text-sm font-black text-slate-900 bg-transparent outline-none"
          />
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
          background: `linear-gradient(to right, ${accentColor} ${pct}%, ${CHART_COLORS.grid} ${pct}%)`,
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
        <div key={entry.name} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">
            {typeof entry.value === 'number' && Math.abs(entry.value) < 1
              ? fmtPct(entry.value)
              : formatUSD(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const USPaycheckCalculator: React.FC = () => {
  const { inputs, result, updateInputs, updateDeductions, reset } = useUSPaycheck();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ChartTab>('pie');
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  // Derived chart data
  const pieData = useMemo(() => [
    { name: 'Net Pay', value: Math.max(0, result.netAnnual) },
    { name: 'Federal Tax', value: result.taxes.federalIncomeTax },
    { name: 'State Tax', value: result.taxes.stateIncomeTax },
    { name: 'FICA', value: result.taxes.totalFICA },
    { name: 'Pre-tax Deductions', value: result.totalPreTaxDeductions },
  ].filter(d => d.value > 0), [result]);

  const PIE_COLORS = [CHART_COLORS.teal, CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.rose, CHART_COLORS.purple];

  const waterfallData = useMemo(() => [
    { name: 'Gross Income', value: result.grossAnnual, fill: CHART_COLORS.teal },
    { name: 'Federal Tax', value: -result.taxes.federalIncomeTax, fill: CHART_COLORS.primary },
    { name: 'State Tax', value: -result.taxes.stateIncomeTax, fill: CHART_COLORS.accent },
    { name: 'Social Security', value: -result.taxes.socialSecurity, fill: CHART_COLORS.rose },
    { name: 'Medicare', value: -result.taxes.medicare, fill: CHART_COLORS.purple },
    { name: 'Pre-tax Deductions', value: -result.totalPreTaxDeductions, fill: CHART_COLORS.secondary },
    { name: 'Net Pay', value: Math.max(0, result.netAnnual), fill: CHART_COLORS.teal },
  ], [result]);

  const ratesData = useMemo(() => [
    { name: 'Effective Rate', rate: result.effectiveTaxRate },
    { name: 'Marginal Federal', rate: result.marginalFederalRate },
    { name: 'Marginal State', rate: result.marginalStateRate },
  ], [result]);

  const frequencyLabel = PAY_FREQUENCY_OPTIONS.find(o => o.value === inputs.payFrequency)?.label ?? 'Period';

  // Export handlers
  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      await exportToPDF('us-paycheck-content', 'US_Paycheck_Report.pdf', {
        title: 'US Paycheck & Tax Report',
        quality: 0.92,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, []);

  const handleExportExcel = useCallback(async () => {
    setExporting('excel');
    try {
      exportUSPaycheckToExcel({
        grossAnnual: result.grossAnnual,
        payFrequency: inputs.payFrequency,
        filingStatus: inputs.filingStatus,
        state: inputs.state,
        standardDeduction: result.standardDeduction,
        retirement401k: inputs.preTaxDeductions.retirement401k,
        hsaContribution: inputs.preTaxDeductions.hsaContribution,
        traditionalIRA: inputs.preTaxDeductions.traditionalIRA,
        federalTax: result.taxes.federalIncomeTax,
        stateTax: result.taxes.stateIncomeTax,
        socialSecurity: result.taxes.socialSecurity,
        medicare: result.taxes.medicare,
        totalFICA: result.taxes.totalFICA,
        totalTax: result.taxes.totalTax,
        netAnnual: result.netAnnual,
        effectiveTaxRate: result.effectiveTaxRate,
        marginalFederalRate: result.marginalFederalRate,
        marginalStateRate: result.marginalStateRate,
        periodsPerYear: result.periodsPerYear,
        perPeriod: result.perPeriod,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [inputs, result]);

  const handleCopyURL = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback gracefully */ }
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    const text = `My estimated take-home pay: ${formatUSD(result.netPerPeriod)}/${frequencyLabel.toLowerCase()} (Effective rate: ${fmtPct(result.effectiveTaxRate)}). Estimate yours: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [result.netPerPeriod, result.effectiveTaxRate, frequencyLabel]);

  const handleShareTwitter = useCallback(() => {
    const text = `My estimated take-home pay: ${formatUSD(result.netPerPeriod)}/${frequencyLabel.toLowerCase()}. Calculate yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [result.netPerPeriod, frequencyLabel]);

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  // Per-paycheck breakdown rows
  const breakdownRows = [
    { label: 'Gross Pay', perPeriod: result.perPeriod.gross, annual: result.grossAnnual, color: 'text-slate-900' },
    { label: 'Federal Tax', perPeriod: -result.perPeriod.federal, annual: -result.taxes.federalIncomeTax, color: 'text-red-600' },
    { label: 'State Tax', perPeriod: -result.perPeriod.state, annual: -result.taxes.stateIncomeTax, color: 'text-red-500' },
    { label: 'Social Security', perPeriod: -result.perPeriod.socialSecurity, annual: -result.taxes.socialSecurity, color: 'text-orange-600' },
    { label: 'Medicare', perPeriod: -result.perPeriod.medicare, annual: -result.taxes.medicare, color: 'text-orange-500' },
    { label: '401(k)', perPeriod: -result.perPeriod.retirement401k, annual: -inputs.preTaxDeductions.retirement401k, color: 'text-purple-600' },
    { label: 'HSA', perPeriod: -result.perPeriod.hsa, annual: -inputs.preTaxDeductions.hsaContribution, color: 'text-purple-500' },
    { label: 'Traditional IRA', perPeriod: -result.perPeriod.ira, annual: -inputs.preTaxDeductions.traditionalIRA, color: 'text-purple-400' },
    { label: 'Net Take-Home', perPeriod: result.perPeriod.net, annual: result.netAnnual, color: 'text-emerald-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-6 px-4">
      <div className="max-w-7xl mx-auto" id="us-paycheck-content">

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            US Paycheck &amp; Tax Estimator
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Estimate your take-home pay after federal &amp; state taxes, FICA, and pre-tax deductions.
            Adjust your 401(k), HSA, and IRA contributions to see real-time tax savings.
          </p>
        </header>

        {/* Export + Share bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button onClick={handleExportPDF} disabled={exporting !== null} className="flex items-center gap-2 bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-slate-600 hover:text-blue-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
          </button>
          <button onClick={handleExportExcel} disabled={exporting !== null} className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {exporting === 'excel' ? '⏳ Generating…' : '📊 Export Excel'}
          </button>
          <button onClick={handleCopyURL} className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            {copied ? '✅ Copied!' : '🔗 Copy Plan URL'}
          </button>
          <button onClick={handleShareWhatsApp} className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            💬 WhatsApp
          </button>
          <button onClick={handleShareTwitter} className="flex items-center gap-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 text-slate-600 hover:text-sky-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            🐦 Twitter
          </button>
        </div>

        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">

          {/* ── Left: Sticky Calculator Inputs ── */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-5">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              {/* Income Section */}
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">1</span>
                Income
              </h2>

              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 block mb-2">Gross Income</label>
                <div className="flex items-center bg-white rounded-xl border-2 border-slate-100 hover:border-slate-200 px-3 py-2.5 transition-all">
                  <span className="text-sm font-bold text-slate-400 mr-1.5">$</span>
                  <input
                    type="text"
                    value={inputs.grossIncome.toLocaleString('en-US')}
                    onFocus={(e) => { e.target.value = inputs.grossIncome.toString(); e.target.select(); }}
                    onBlur={(e) => {
                      const parsed = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(parsed) && parsed >= 0) updateInputs({ grossIncome: parsed });
                    }}
                    onChange={(e) => { e.target.value = e.target.value; }}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                    className="flex-1 text-sm font-black text-slate-900 bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 block mb-2">Pay Frequency</label>
                <select
                  value={inputs.payFrequency}
                  onChange={(e) => updateInputs({ payFrequency: e.target.value as PayFrequency })}
                  className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none hover:border-slate-200 transition-all cursor-pointer"
                >
                  {PAY_FREQUENCY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Tax Profile */}
              <h2 className="text-lg font-bold text-slate-800 mb-5 mt-6 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">2</span>
                Tax Profile
              </h2>

              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 block mb-2">Filing Status</label>
                <select
                  value={inputs.filingStatus}
                  onChange={(e) => updateInputs({ filingStatus: e.target.value as FilingStatus })}
                  className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none hover:border-slate-200 transition-all cursor-pointer"
                >
                  {FILING_STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 block mb-2">State</label>
                <select
                  value={inputs.state}
                  onChange={(e) => updateInputs({ state: e.target.value })}
                  className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none hover:border-slate-200 transition-all cursor-pointer"
                >
                  {STATE_LIST.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Pre-Tax Deductions */}
              <h2 className="text-lg font-bold text-slate-800 mb-5 mt-6 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">3</span>
                Pre-Tax Deductions
              </h2>

              <SliderField
                label="401(k) Contribution"
                value={inputs.preTaxDeductions.retirement401k}
                onChange={(v) => updateDeductions({ retirement401k: v })}
                min={0} max={23500} step={100}
                tooltip="Annual 401(k) contribution (2025 limit: $23,500)."
                accentColor={CHART_COLORS.accent}
              />
              <SliderField
                label="HSA Contribution"
                value={inputs.preTaxDeductions.hsaContribution}
                onChange={(v) => updateDeductions({ hsaContribution: v })}
                min={0} max={4300} step={50}
                tooltip="Annual HSA contribution (2025 self-only limit: $4,300)."
                accentColor={CHART_COLORS.purple}
              />
              <SliderField
                label="Traditional IRA"
                value={inputs.preTaxDeductions.traditionalIRA}
                onChange={(v) => updateDeductions({ traditionalIRA: v })}
                min={0} max={7000} step={50}
                tooltip="Annual Traditional IRA contribution (2025 limit: $7,000)."
                accentColor={CHART_COLORS.primary}
              />

              {/* Additional Withholding */}
              <h2 className="text-lg font-bold text-slate-800 mb-5 mt-6 flex items-center gap-2">
                <span className="bg-rose-100 text-rose-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">4</span>
                Additional Withholding
              </h2>

              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 block mb-2 flex items-center">
                  Extra Per-Period Withholding
                  <HelpTooltip text="Extra federal tax withheld each pay period (W-4 Line 4c)." />
                </label>
                <div className="flex items-center bg-white rounded-xl border-2 border-slate-100 hover:border-slate-200 px-3 py-2.5 transition-all">
                  <span className="text-sm font-bold text-slate-400 mr-1.5">$</span>
                  <input
                    type="text"
                    value={inputs.allowances.toLocaleString('en-US')}
                    onFocus={(e) => { e.target.value = inputs.allowances.toString(); e.target.select(); }}
                    onBlur={(e) => {
                      const parsed = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(parsed) && parsed >= 0) updateInputs({ allowances: parsed });
                    }}
                    onChange={(e) => { e.target.value = e.target.value; }}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                    className="flex-1 text-sm font-black text-slate-900 bg-transparent outline-none"
                  />
                </div>
              </div>

              <button
                onClick={reset}
                className="w-full py-3 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100"
              >
                ↺ Reset Defaults
              </button>
            </motion.section>
          </div>

          {/* ── Right: Results + Charts ── */}
          <div className="space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: `Take-Home (${frequencyLabel})`, value: result.netPerPeriod, prefix: '$', color: 'from-emerald-500 to-teal-600' },
                { label: 'Total Taxes (Annual)', value: result.taxes.totalTax, prefix: '$', color: 'from-rose-500 to-red-600' },
                { label: 'Effective Tax Rate', value: result.effectiveTaxRate * 100, suffix: '%', color: 'from-blue-500 to-blue-700' },
                { label: 'Tax Savings from Deductions', value: result.taxSavingsFrom401k + result.taxSavingsFromHSA + result.taxSavingsFromIRA, prefix: '$', color: 'from-purple-500 to-indigo-600' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} p-5 rounded-2xl shadow-xl text-white relative overflow-hidden group`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-1">{stat.label}</p>
                  <AnimatedNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="text-xl sm:text-2xl font-black block leading-tight"
                  />
                </motion.div>
              ))}
            </div>

            {/* Per-Paycheck Breakdown Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 overflow-hidden">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black">📋</span>
                Per-Paycheck Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Item</th>
                      <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Per {frequencyLabel}</th>
                      <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdownRows.map((row) => (
                      <tr
                        key={row.label}
                        className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                          row.label === 'Net Take-Home' ? 'bg-emerald-50/50 font-black' : ''
                        }`}
                      >
                        <td className={`py-2 font-bold ${row.color}`}>{row.label}</td>
                        <td className={`py-2 text-right font-bold ${row.color}`}>
                          {row.perPeriod < 0 ? `(${formatUSD(Math.abs(row.perPeriod))})` : formatUSD(row.perPeriod)}
                        </td>
                        <td className={`py-2 text-right font-bold ${row.color}`}>
                          {row.annual < 0 ? `(${formatUSD(Math.abs(row.annual))})` : formatUSD(row.annual)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
            >
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {CHART_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex-1 py-4 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      activeTab === tab.id
                        ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 h-[420px]">
                {mounted && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        {activeTab === 'pie' ? (
                          /* Tab 1: Pay Breakdown Pie */
                          <PieChart>
                            <Pie
                              data={pieData}
                              innerRadius={80}
                              outerRadius={130}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {pieData.map((_, idx) => (
                                <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v: any) => formatUSD(v)} />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        ) : activeTab === 'waterfall' ? (
                          /* Tab 2: Tax Waterfall */
                          <BarChart data={waterfallData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={CHART_COLORS.grid} />
                            <XAxis type="number" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmtAxis} />
                            <YAxis type="category" dataKey="name" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} width={110} />
                            <Tooltip formatter={(v: any) => formatUSD(Math.abs(v))} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {waterfallData.map((entry, idx) => (
                                <Cell key={idx} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        ) : activeTab === 'rates' ? (
                          /* Tab 3: Effective vs Marginal Rates */
                          <BarChart data={ratesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                            <XAxis dataKey="name" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} domain={[0, 'auto']} />
                            <Tooltip formatter={(v: any) => fmtPct(v)} />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="rate" name="Tax Rate" radius={[6, 6, 0, 0]}>
                              {ratesData.map((_, idx) => (
                                <Cell key={idx} fill={[CHART_COLORS.teal, CHART_COLORS.primary, CHART_COLORS.accent][idx]} />
                              ))}
                            </Bar>
                          </BarChart>
                        ) : (
                          /* Tab 4: Monthly Cash Flow */
                          <AreaChart data={result.monthlyBreakdown}>
                            <defs>
                              <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0.05} />
                              </linearGradient>
                              <linearGradient id="gradFed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05} />
                              </linearGradient>
                              <linearGradient id="gradState" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0.05} />
                              </linearGradient>
                              <linearGradient id="gradFica" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.rose} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={CHART_COLORS.rose} stopOpacity={0.05} />
                              </linearGradient>
                              <linearGradient id="gradDed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.purple} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                            <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmtAxis} />
                            <Tooltip content={<ChartTooltip />} />
                            <Legend verticalAlign="top" height={36} />
                            <Area type="monotone" dataKey="federal" name="Federal Tax" stackId="1" stroke={CHART_COLORS.primary} fill="url(#gradFed)" strokeWidth={2} />
                            <Area type="monotone" dataKey="state" name="State Tax" stackId="1" stroke={CHART_COLORS.accent} fill="url(#gradState)" strokeWidth={2} />
                            <Area type="monotone" dataKey="fica" name="FICA" stackId="1" stroke={CHART_COLORS.rose} fill="url(#gradFica)" strokeWidth={2} />
                            <Area type="monotone" dataKey="deductions" name="Pre-tax Deductions" stackId="1" stroke={CHART_COLORS.purple} fill="url(#gradDed)" strokeWidth={2} />
                            <Area type="monotone" dataKey="net" name="Net Pay" stackId="1" stroke={CHART_COLORS.teal} fill="url(#gradNet)" strokeWidth={2} />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.section>

            {/* Tax Savings Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: '401(k) Savings',
                  icon: '🏦',
                  value: result.taxSavingsFrom401k,
                  contribution: inputs.preTaxDeductions.retirement401k,
                  bg: 'bg-blue-50',
                  border: 'border-blue-100',
                  color: 'text-blue-600',
                },
                {
                  title: 'HSA Savings',
                  icon: '🏥',
                  value: result.taxSavingsFromHSA,
                  contribution: inputs.preTaxDeductions.hsaContribution,
                  bg: 'bg-purple-50',
                  border: 'border-purple-100',
                  color: 'text-purple-600',
                },
                {
                  title: 'IRA Savings',
                  icon: '📈',
                  value: result.taxSavingsFromIRA,
                  contribution: inputs.preTaxDeductions.traditionalIRA,
                  bg: 'bg-teal-50',
                  border: 'border-teal-100',
                  color: 'text-teal-600',
                },
              ].map((card) => (
                <div key={card.title} className={`${card.bg} border ${card.border} rounded-2xl p-5`}>
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                    <span>{card.icon}</span> {card.title}
                  </h3>
                  <p className={`text-2xl font-black ${card.color} mb-1`}>
                    {formatUSD(card.value)}
                  </p>
                  <p className="text-xs text-slate-500">
                    saved annually on {formatUSD(card.contribution)} contribution
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default USPaycheckCalculator;
