import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  PieChart,
  Pie,
} from 'recharts';
import {
  FIRE_TYPES,
  formatCurrency,
} from './FIRECalculator.utils';
import { useFIRE } from '../../hooks/useFIRE';
import { exportFIREToExcel } from '../../utils/excel';
import { exportToPDF } from '../../utils/pdf';

// ── Chart color constants using CSS variable values ───────────────
// Unified chart colors (based on home page hero: indigo→blue→cyan gradient)
const CHART_COLORS = {
  primary: '#6366f1',    // indigo-500 - PRIMARY (hero gradient start)
  secondary: '#3b82f6',  // blue-500 - SECONDARY (hero middle)
  accent: '#06b6d4',     // cyan-500 - ACCENT (hero end)
  teal: '#14b8a6',       // teal-500 - growth/success
  amber: '#f59e0b',      // amber-500 - warning/info
  rose: '#f43f5e',       // rose-500 - danger (use sparingly)
  grid: '#f1f5f9',       // slate-100
  axis: '#94a3b8',       // slate-400
};

const FIRE_BAR_COLORS = [
  CHART_COLORS.teal,
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.amber,
];

// ── Number Input ──────────────────────────────────────────────────

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  placeholder?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label, value, onChange, prefix = '', suffix = '', tooltip, placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toLocaleString());

  useEffect(() => {
    if (!focused) setDisplayValue(value.toLocaleString());
  }, [value, focused]);

  return (
    <div className="mb-4 last:mb-0">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
        {label}
        {tooltip && (
          <span className="group relative">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] text-slate-500 cursor-help font-bold">?</span>
            <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-pre-line z-20 shadow-xl w-52">{tooltip}</span>
          </span>
        )}
      </label>
      <div className={`flex items-center bg-white rounded-xl border-2 px-4 py-2.5 transition-all ${
        focused ? 'border-blue-400 shadow-md ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'
      }`}>
        {prefix && <span className="text-base font-semibold text-slate-400 mr-2">{prefix}</span>}
        <input
          type="text"
          value={displayValue}
          onFocus={(e) => { setFocused(true); setDisplayValue(value.toString()); e.target.select(); }}
          onBlur={() => {
            setFocused(false);
            const cleaned = displayValue.replace(/[^0-9.]/g, '');
            const parsed = parseFloat(cleaned);
            if (!isNaN(parsed) && parsed >= 0) onChange(Math.round(parsed));
            else setDisplayValue(value.toLocaleString());
          }}
          onChange={(e) => setDisplayValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          placeholder={placeholder}
          className="flex-1 text-base font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300"
        />
        {suffix && <span className="text-sm font-medium text-slate-400 ml-2">{suffix}</span>}
      </div>
    </div>
  );
};

// ── Slider Input ──────────────────────────────────────────────────

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label, value, onChange, min, max, step, prefix = '', suffix = '', tooltip,
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          {label}
          {tooltip && (
            <span className="group relative">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] text-slate-500 cursor-help font-bold">?</span>
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-20 shadow-xl max-w-xs">{tooltip}</span>
            </span>
          )}
        </label>
        <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 px-2.5 py-1">
          {prefix && <span className="text-xs text-slate-400 mr-0.5">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(Math.min(Math.max(v, min), max)); }}
            className="w-20 text-right text-sm font-semibold text-slate-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            step={step} min={min} max={max}
          />
          {suffix && <span className="text-xs text-slate-400 ml-0.5">{suffix}</span>}
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="calc-range w-full h-2 rounded-full cursor-pointer outline-none"
        style={{ background: `linear-gradient(to right, ${CHART_COLORS.primary} ${pct}%, #e2e8f0 ${pct}%)` }}
      />
    </div>
  );
};

// ── Chart Tooltip ─────────────────────────────────────────────────

const createChartTooltip = (currency: 'USD' | 'INR') => ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-left">
      <p className="text-sm font-bold text-slate-900 mb-1.5">Age {label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs mb-0.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color || entry.stroke }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-900">{formatCurrency(entry.value, currency)}</span>
        </div>
      ))}
    </div>
  );
};

const createFormatYAxis = (currency: 'USD' | 'INR') => (value: number): string => {
  const symbol = currency === 'INR' ? '₹' : '$';
  if (currency === 'INR') {
    if (value >= 10_000_000) return `${symbol}${(value / 10_000_000).toFixed(1)}Cr`;
    if (value >= 100_000) return `${symbol}${(value / 100_000).toFixed(1)}L`;
    if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  } else {
    if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(0)}K`;
  }
  return `${symbol}${value}`;
};

// ── Chart Tabs ────────────────────────────────────────────────────

type ChartTab = 'projection' | 'breakdown' | 'comparison' | 'postfire';

const chartTabs: { key: ChartTab; label: string; icon: string }[] = [
  { key: 'projection', label: 'Portfolio Projection', icon: '📈' },
  { key: 'breakdown', label: 'Growth Breakdown', icon: '📊' },
  { key: 'comparison', label: 'FIRE Types', icon: '🔥' },
  { key: 'postfire', label: 'Life After FIRE', icon: '🏝️' },
];

// ── Section Card ──────────────────────────────────────────────────

const SectionCard: React.FC<{
  step?: number | string;
  title: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ step, title, children, className = '', delay = 0.05 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`bg-white rounded-2xl shadow-md border border-slate-100 p-6 ${className}`}
  >
    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
      {step !== undefined && (
        <span className="bg-blue-50 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center mr-2.5 text-sm font-bold border border-blue-100">
          {step}
        </span>
      )}
      {title}
    </h2>
    {children}
  </motion.div>
);

// ── Main Component ────────────────────────────────────────────────

const FIRECalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useFIRE();
  const [activeChart, setActiveChart] = useState<ChartTab>('projection');
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  useEffect(() => setMounted(true), []);

  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.projections.length / 50));
    return result.projections.filter(
      (_, i, arr) => i % step === 0 || i === arr.length - 1 || i === result.yearsToFIRE
    );
  }, [result]);

  const accData = useMemo(() => {
    const upTo = result.projections.filter((p) => p.year <= result.yearsToFIRE);
    const step = Math.max(1, Math.floor(upTo.length / 40));
    return upTo.filter((_, i, arr) => i % step === 0 || i === arr.length - 1);
  }, [result]);

  const comparisonData = useMemo(
    () => result.allFireTypes,
    [result.allFireTypes]
  );

  const postFIREData = useMemo(() => {
    const data = result.postFIREProjections;
    if (!data.length) return [];
    const step = Math.max(1, Math.floor(data.length / 50));
    return data.filter((_, i, arr) => i % step === 0 || i === arr.length - 1);
  }, [result.postFIREProjections]);

  const ChartTooltip = useMemo(() => createChartTooltip(inputs.currency), [inputs.currency]);
  const formatYAxis = useMemo(() => createFormatYAxis(inputs.currency), [inputs.currency]);
  const sym = '';

  // Progress
  const progressPercent = Math.min((inputs.currentSavings / Math.max(result.fireNumber, 1)) * 100, 100);

  // Contribution vs Growth
  const contribPercent = result.portfolioAtRetirement > 0
    ? Math.round((result.totalContributions / result.portfolioAtRetirement) * 100)
    : 0;
  const growthPercent = 100 - contribPercent;

  // Income breakdown pie data
  const incomeBreakdown = useMemo(() => [
    { name: 'Fixed Expenses', value: inputs.monthlyFixedExpenses, fill: CHART_COLORS.primary },
    { name: 'Lifestyle Expenses', value: inputs.monthlyLifestyleExpenses, fill: CHART_COLORS.accent },
    { name: 'Investments', value: inputs.monthlyContribution, fill: CHART_COLORS.teal },
    { name: 'Misc / Remaining', value: Math.max(0, result.monthlyMisc), fill: CHART_COLORS.amber },
  ], [inputs.monthlyFixedExpenses, inputs.monthlyLifestyleExpenses, inputs.monthlyContribution, result.monthlyMisc]);

  const currentFireTypeInfo = FIRE_TYPES.find(f => f.type === inputs.fireType) || FIRE_TYPES[1];
  const currencyOptions = [
    { value: 'USD' as const, label: 'USD ($)', icon: '💵' },
    { value: 'INR' as const, label: 'INR (₹)', icon: '₹' },
  ];

  const handleExportToExcel = useCallback(() => {
    setExporting('excel');
    try {
      exportFIREToExcel(
        result.projections,
        result.allFireTypes,
        result.postFIREProjections,
        'FIRE_Analysis.xlsx'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [result]);

  const handleExportToPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      await exportToPDF(
        'fire-calculator-content',
        'FIRE_Analysis.pdf',
        {
          title: 'FIRE Calculator Analysis',
          orientation: 'portrait',
          quality: 0.92,
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, []);

  const handleCopyURL = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    const text = `Check out my FIRE plan: I can reach financial independence in ${result.yearsToFIRE} years with a FIRE number of ${formatCurrency(result.fireNumber, inputs.currency)}!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [result.yearsToFIRE, result.fireNumber, inputs.currency]);

  const handleShareTwitter = useCallback(() => {
    const text = `My FIRE plan: Financial independence in ${result.yearsToFIRE} years! FIRE number: ${formatCurrency(result.fireNumber, inputs.currency)}. Plan yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [result.yearsToFIRE, result.fireNumber, inputs.currency]);

  // URL query-param sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cs = params.get('cs');
    const mc = params.get('mc');
    const me = params.get('me');
    const roi = params.get('roi');
    if (cs && mc && me && roi) {
      updateInputs({
        currentSavings: parseFloat(cs),
        monthlyContribution: parseFloat(mc),
        monthlyFixedExpenses: parseFloat(me),
        expectedReturn: parseFloat(roi),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('cs', inputs.currentSavings.toString());
    params.set('mc', inputs.monthlyContribution.toString());
    params.set('me', inputs.monthlyFixedExpenses.toString());
    params.set('roi', inputs.expectedReturn.toString());
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
  }, [inputs.currentSavings, inputs.monthlyContribution, inputs.monthlyFixedExpenses, inputs.expectedReturn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-4 px-4" id="fire-calculator-content">
      <article className="max-w-7xl mx-auto" itemScope itemType="https://schema.org/WebApplication">

        {/* ── Header ──────────────────────────────────────────── */}
        <header className="text-center mb-6" id="calculator">
          <h1 className="text-3xl font-bold text-slate-900 mb-1" itemProp="name">
            FIRE Calculator{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              — Financial Independence
            </span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto" itemProp="description">
            Calculate your path to Financial Independence and Early Retirement.
            Split your expenses, compare all FIRE strategies, and plan in standard or reverse mode.
          </p>
          <meta itemProp="applicationCategory" content="FinanceApplication" />
          <meta itemProp="operatingSystem" content="Any" />
        </header>

        {/* ── Already FIRE'd Banner ───────────────────────────── */}
        {result.yearsToFIRE === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 text-center mb-6"
          >
            <p className="text-xl font-bold text-teal-700">🎉 You&apos;ve already reached FIRE!</p>
            <p className="text-sm text-teal-600 mt-1">Your current savings exceed your FIRE number. Congratulations!</p>
          </motion.div>
        )}

        {/* ── FIRE Strategy Selector — Top Level ─────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-700">🔥 Choose Your FIRE Strategy</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">💰 Savings Rate: <strong className="text-slate-800">{result.savingsRate.toFixed(1)}%</strong></span>
              <span className="text-slate-500">📊 Progress: <strong className="text-blue-600">{progressPercent.toFixed(0)}%</strong></span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {comparisonData.map((d, i) => {
              const isSelected = d.type === inputs.fireType;
              const ft = FIRE_TYPES.find(f => f.type === d.type);
              return (
                <motion.button
                  key={d.type}
                  onClick={() => updateInputs({ fireType: d.type })}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative text-left rounded-xl p-4 transition-all cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-br ${ft?.gradient || 'from-blue-500 to-indigo-600'} text-white shadow-lg ring-2 ring-offset-2 ${ft?.type === 'lean' ? 'ring-emerald-400' : ft?.type === 'regular' ? 'ring-blue-400' : ft?.type === 'fat' ? 'ring-purple-400' : ft?.type === 'coast' ? 'ring-cyan-400' : 'ring-amber-400'}`
                      : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  {/* Type Header */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base">{d.icon}</span>
                    <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{d.label}</span>
                  </div>
                  
                  {/* FIRE Number - Today's Value */}
                  <div className="mb-2">
                    <p className={`text-[10px] uppercase tracking-wide ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>Target (Today's Value)</p>
                    <p className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {formatCurrency(d.fireNumber, inputs.currency, true)}
                    </p>
                  </div>
                  
                  {/* Inflation Adjusted - What you'll actually need */}
                  <div className="mb-2">
                    <p className={`text-[10px] uppercase tracking-wide ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>Inflation-Adjusted ({d.yearsToFIRE} yrs)</p>
                    <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                      {formatCurrency(d.fireNumberInflationAdjusted, inputs.currency, true)}
                    </p>
                  </div>
                  
                  {/* Timeline */}
                  <div className={`rounded-lg p-2 ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-xl font-extrabold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{d.yearsToFIRE}</span>
                      <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>years to reach</span>
                    </div>
                    <p className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                      Age {d.fireAge} · {d.fireYear}
                    </p>
                    <p className={`text-[9px] mt-1 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                      With {formatCurrency(inputs.monthlyContribution, inputs.currency)}/mo contributions, {inputs.expectedReturn}% returns & {inputs.inflationRate}% inflation
                    </p>
                  </div>
                  
                  {/* Monthly Withdrawal - show only for selected */}
                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-[10px] text-white/70">Monthly After FIRE</p>
                      <p className="text-sm font-bold text-white">{formatCurrency(d.monthlyWithdrawal, inputs.currency)}</p>
                    </div>
                  )}
                  
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 bg-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md text-slate-700">
                      ✓ SELECTED
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">{currentFireTypeInfo.description}</p>
        </motion.section>



        {/* ── Single Combined Input Card ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 mb-6"
        >
          {/* Row 1: Basic Info — Age, Income, Current Savings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Age</label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
                <input
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => updateInputs({ currentAge: Math.max(18, Math.min(70, parseInt(e.target.value) || 18)) })}
                  className="w-full text-lg font-bold text-slate-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-slate-400 ml-1">yrs</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Life Expectancy</label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
                <input
                  type="number"
                  value={inputs.lifeExpectancy}
                  onChange={(e) => updateInputs({ lifeExpectancy: Math.max(60, Math.min(100, parseInt(e.target.value) || 85)) })}
                  className="w-full text-lg font-bold text-slate-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-slate-400 ml-1">yrs</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Monthly Income</label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold text-slate-400 mr-1">{sym}</span>
                <input
                  type="text"
                  value={inputs.monthlyIncome.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    updateInputs({ monthlyIncome: v });
                  }}
                  className="w-full text-lg font-bold text-slate-900 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Current Savings</label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold text-slate-400 mr-1">{sym}</span>
                <input
                  type="text"
                  value={inputs.currentSavings.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    updateInputs({ currentSavings: v });
                  }}
                  className="w-full text-lg font-bold text-slate-900 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Expenses — Fixed + Lifestyle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS.primary }} />
                Fixed Expenses <span className="text-slate-400 font-normal">(Rent, Bills, EMIs)</span>
              </label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold text-slate-400 mr-1">{sym}</span>
                <input
                  type="text"
                  value={inputs.monthlyFixedExpenses.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    updateInputs({ monthlyFixedExpenses: v });
                  }}
                  className="w-full text-lg font-bold text-slate-900 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS.accent }} />
                Lifestyle <span className="text-slate-400 font-normal">(Dining, Travel, Fun)</span>
              </label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
                <span className="text-sm font-semibold text-slate-400 mr-1">{sym}</span>
                <input
                  type="text"
                  value={inputs.monthlyLifestyleExpenses.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    updateInputs({ monthlyLifestyleExpenses: v });
                  }}
                  className="w-full text-lg font-bold text-slate-900 bg-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS.teal }} />
                Monthly Investment <span className="text-slate-400 font-normal">(401k, Stocks, MFs)</span>
              </label>
              <div className="flex items-center bg-teal-50 rounded-xl border-2 border-teal-200 px-3 py-2">
                <input
                  type="text"
                  value={inputs.monthlyContribution.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    updateInputs({ monthlyContribution: v });
                  }}
                  className="w-full text-lg font-bold text-teal-700 bg-transparent outline-none"
                  placeholder="How much can you invest?"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Money you commit monthly to grow your wealth (index funds, 401k, etc.)
              </p>
            </div>
          </div>

          {/* Income Breakdown Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <h4 className="text-sm font-bold text-slate-700 mb-3">💰 Monthly Income Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="text-center">
                <div className="text-xs text-slate-500">Income</div>
                <div className="text-base font-bold text-slate-900">{formatCurrency(inputs.monthlyIncome, inputs.currency)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS.primary }} />
                  <span className="text-xs text-slate-500">Fixed</span>
                </div>
                <div className="text-base font-bold text-slate-800">{formatCurrency(inputs.monthlyFixedExpenses, inputs.currency)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS.accent }} />
                  <span className="text-xs text-slate-500">Lifestyle</span>
                </div>
                <div className="text-base font-bold text-slate-800">{formatCurrency(inputs.monthlyLifestyleExpenses, inputs.currency)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS.teal }} />
                  <span className="text-xs text-slate-500">Investing</span>
                </div>
                <div className="text-base font-bold text-teal-600">
                  {formatCurrency(inputs.calculationMode === 'reverse' ? result.requiredMonthlyContribution : inputs.monthlyContribution, inputs.currency)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS.amber }} />
                  <span className="text-xs text-slate-500">Remaining</span>
                </div>
                <div className={`text-base font-bold ${result.monthlyMisc < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatCurrency(inputs.calculationMode === 'reverse'
                    ? inputs.monthlyIncome - result.monthlyExpenses - result.requiredMonthlyContribution
                    : result.monthlyMisc, inputs.currency)}
                </div>
              </div>
            </div>
            {result.monthlyMisc < 0 && inputs.calculationMode === 'standard' && (
              <p className="text-xs text-rose-500 mt-2 text-center">
                ⚠️ Expenses + investments exceed income by {formatCurrency(Math.abs(result.monthlyMisc), inputs.currency)}/month
              </p>
            )}
          </div>

          {/* Advanced Settings Toggle */}
          <details className="mt-4 group">
            <summary className="text-sm font-semibold text-slate-500 cursor-pointer hover:text-slate-700 list-none flex items-center gap-2">
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full group-open:bg-blue-100 group-open:text-blue-600">⚙️ Investment Assumptions</span>
              <span className="text-xs text-slate-400">(Return: {inputs.expectedReturn}%, Inflation: {inputs.inflationRate}%, Withdrawal: {inputs.withdrawalRate}%)</span>
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <SliderInput label="Expected Annual Return" value={inputs.expectedReturn} onChange={(v) => updateInputs({ expectedReturn: v })} min={1} max={15} step={0.5} suffix="%" tooltip="Average annual return (S&P 500 avg ~ 10%)" />
              <SliderInput label="Inflation Rate" value={inputs.inflationRate} onChange={(v) => updateInputs({ inflationRate: v })} min={0} max={10} step={0.5} suffix="%" tooltip="Expected annual inflation (avg ~ 3%)" />
              <SliderInput label="Withdrawal Rate" value={inputs.withdrawalRate} onChange={(v) => updateInputs({ withdrawalRate: v })} min={2} max={6} step={0.25} suffix="%" tooltip="4% rule = safe withdrawal rate" />
            </div>
          </details>

          {/* Barista FIRE */}
          <AnimatePresence>
            {inputs.fireType === 'barista' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">☕ Part-Time Income After FIRE</label>
                <div className="flex items-center bg-amber-50 rounded-xl border border-amber-200 px-3 py-2 max-w-xs">
                  <span className="text-sm font-semibold text-amber-600 mr-1">{sym}</span>
                  <input
                    type="text"
                    value={inputs.monthlyPartTimeIncome.toLocaleString()}
                    onChange={(e) => {
                      const v = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                      updateInputs({ monthlyPartTimeIncome: v });
                    }}
                    className="w-full text-lg font-bold text-amber-700 bg-transparent outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset */}
          <div className="flex justify-end mt-3">
            <button onClick={reset} className="text-xs text-slate-400 hover:text-blue-600 transition-colors">
              ↺ Reset to defaults
            </button>
          </div>
        </motion.div>

        {/* ── Key Stats Cards (More Detail) ───────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* FIRE Timeline Detail */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-5"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">📅 Your FIRE Timeline</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-slate-900">{result.yearsToFIRE}</span>
              <span className="text-slate-500">years</span>
            </div>
            <p className="text-sm text-slate-600">
              You&apos;ll reach financial independence by <strong className="text-blue-600">{result.fireYear}</strong> at age <strong>{result.fireAge}</strong>.
            </p>
            <div className="mt-3 flex gap-3 text-xs">
              <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1 text-center">
                <div className="text-slate-400">Freedom Years</div>
                <div className="font-bold text-slate-900">{Math.max(inputs.lifeExpectancy - result.fireAge, 0)} yrs</div>
              </div>
              <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1 text-center">
                <div className="text-slate-400">Money Lasts</div>
                <div className="font-bold text-slate-900">{result.yearsMoneyLasts >= 100 ? '100+' : result.yearsMoneyLasts} yrs</div>
              </div>
            </div>
          </motion.div>

          {/* Post-Retirement Income */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-5"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">💵 After Retirement</p>
            <p className="text-[10px] text-slate-400 mb-3">Safe withdrawal from your portfolio without running out</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50 rounded-xl p-3 text-center border border-teal-100">
                <p className="text-xl font-bold text-teal-700">{formatCurrency(result.safeMonthlyWithdrawal, inputs.currency)}</p>
                <p className="text-[10px] text-teal-600">per month</p>
              </div>
              <div className="bg-teal-50 rounded-xl p-3 text-center border border-teal-100">
                <p className="text-xl font-bold text-teal-700">{formatCurrency(result.safeWithdrawalAmount, inputs.currency)}</p>
                <p className="text-[10px] text-teal-600">per year</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              {inputs.withdrawalRate}% of {formatCurrency(result.portfolioAtRetirement, inputs.currency)} portfolio
            </p>
          </motion.div>

          {/* Today's Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-5"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">🏠 If You Retired Today</p>
            <p className="text-[10px] text-slate-400 mb-3">Your current {formatCurrency(inputs.currentSavings, inputs.currency)} could provide:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-slate-800">{formatCurrency(result.todayWithdrawalMonthly, inputs.currency)}</p>
                <p className="text-[10px] text-slate-500">per month</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-slate-800">{formatCurrency(result.todayWithdrawalAnnual, inputs.currency)}</p>
                <p className="text-[10px] text-slate-500">per year</p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 text-center">{progressPercent.toFixed(1)}% towards your FIRE goal</p>
          </motion.div>
        </div>

        {/* Coast FIRE info (conditional) */}
        <AnimatePresence>
          {inputs.fireType === 'coast' && result.coastFIREAge !== null && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200 p-5 mb-6"
            >
              <p className="text-sm font-bold text-cyan-800 mb-1">🏖️ Coast FIRE Checkpoint</p>
              <p className="text-slate-600 text-sm">
                Save <strong className="text-cyan-700">{formatCurrency(result.coastFIRENumber, inputs.currency)}</strong> by age <strong>{result.coastFIREAge}</strong>, then stop contributions and let compound growth carry you to full FIRE by 65.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Export + Share bar ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          <button onClick={handleExportToPDF} disabled={exporting !== null} className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-lg transition disabled:opacity-50">
            {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
          </button>
          <button onClick={handleExportToExcel} disabled={exporting !== null} className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 text-xs font-semibold px-3 py-2 rounded-lg transition disabled:opacity-50">
            {exporting === 'excel' ? '⏳ Generating…' : '📊 Export Excel'}
          </button>
          <button onClick={handleCopyURL} className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
            {copied ? '✅ Copied!' : '🔗 Copy Plan URL'}
          </button>
          <button onClick={handleShareWhatsApp} className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
            💬 WhatsApp
          </button>
          <button onClick={handleShareTwitter} className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
            🐦 Twitter
          </button>
        </motion.div>

        {/* ── Charts Section — All Stacked Vertically ─────────── */}
        <section className="space-y-6 mb-8">
          {mounted && (
            <>
              {/* Portfolio Projection Chart */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">📈</span> Portfolio Projection
                </h3>
                <p className="text-sm text-slate-500 mb-4">Portfolio growth over time with FIRE target line. The green marker shows when you reach financial independence.</p>
                <ResponsiveContainer width="100%" height={380}>
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="portfolioGradNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="age" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} />
                    <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="endBalance" fill="url(#portfolioGradNew)" stroke={CHART_COLORS.primary} strokeWidth={2.5} name="Portfolio" animationDuration={800} />
                    <Line type="monotone" dataKey="fireNumber" stroke={CHART_COLORS.rose} strokeWidth={2} strokeDasharray="8 4" dot={false} name="FIRE Target" animationDuration={800} />
                    {result.yearsToFIRE < 70 && (
                      <ReferenceLine x={result.fireAge} stroke={CHART_COLORS.teal} strokeWidth={2} strokeDasharray="4 4"
                        label={{ value: '🔥 FIRE!', position: 'top', fontSize: 12, fontWeight: 'bold', fill: '#059669' }}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Growth Breakdown Chart */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">📊</span> Growth Breakdown
                </h3>
                <p className="text-sm text-slate-500 mb-4">See how much of your portfolio comes from your contributions vs. compound investment growth.</p>
                <ResponsiveContainer width="100%" height={380}>
                  <AreaChart data={accData}>
                    <defs>
                      <linearGradient id="contribGradNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="growthGradNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.teal} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={CHART_COLORS.teal} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="age" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} />
                    <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="totalContributed" stackId="1" fill="url(#contribGradNew)" stroke={CHART_COLORS.primary} strokeWidth={2} name="Your Contributions" animationDuration={800} />
                    <Area type="monotone" dataKey="totalGrowth" stackId="1" fill="url(#growthGradNew)" stroke={CHART_COLORS.teal} strokeWidth={2} name="Investment Growth" animationDuration={800} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Income Breakdown Pie Chart */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">🥧</span> Monthly Income Distribution
                </h3>
                <p className="text-sm text-slate-500 mb-4">How your monthly income is allocated across expenses, investments, and remaining funds.</p>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={incomeBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${formatCurrency(value, inputs.currency)} (${((percent || 0) * 100).toFixed(0)}%)`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={800}
                    >
                      {incomeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0];
                      return (
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
                          <p className="text-sm font-bold text-slate-900">{d.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{formatCurrency(d.value as number, inputs.currency)}/mo</p>
                          <p className="text-xs text-slate-500">({((d.value as number / inputs.monthlyIncome) * 100).toFixed(1)}% of income)</p>
                        </div>
                      );
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* FIRE Type Comparison Bar Chart */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">🔥</span> FIRE Types Comparison
                </h3>
                <p className="text-sm text-slate-500 mb-4">Compare target amounts and timelines across all FIRE strategies with your current financial profile.</p>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={comparisonData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis type="number" tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} />
                    <YAxis type="category" dataKey="label" stroke={CHART_COLORS.axis} fontSize={12} width={100} tickLine={false} />
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
                          <p className="text-sm font-bold text-slate-900 mb-1">{d.icon} {d.label}</p>
                          <p className="text-xs text-slate-500 mb-2">{d.tagline}</p>
                          <p className="text-xs text-slate-600">Target: <span className="font-semibold">{formatCurrency(d.fireNumber, inputs.currency)}</span></p>
                          <p className="text-xs text-slate-600">Inflation-adjusted: <span className="font-semibold">{formatCurrency(d.fireNumberInflationAdjusted, inputs.currency)}</span></p>
                          <p className="text-xs text-slate-600">Years: <span className="font-semibold">{d.yearsToFIRE}</span> (Age {d.fireAge})</p>
                          <p className="text-xs text-slate-600">Withdrawal: <span className="font-semibold">{formatCurrency(d.monthlyWithdrawal, inputs.currency)}/mo</span></p>
                        </div>
                      );
                    }} />
                    <Bar dataKey="fireNumber" name="FIRE Target" radius={[0, 8, 8, 0]} animationDuration={800}>
                      {comparisonData.map((_, i) => <Cell key={i} fill={FIRE_BAR_COLORS[i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Life After FIRE Chart */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <span className="text-xl">🏝️</span> Life After FIRE
                </h3>
                <p className="text-sm text-slate-500 mb-1">What happens after you stop working? No more contributions — your portfolio must sustain you.</p>
                <p className="text-xs text-slate-400 mb-4">
                  This chart shows your corpus growing from investment returns while declining from inflation-adjusted withdrawals ({inputs.withdrawalRate}% rule).
                  {result.yearsMoneyLasts >= 100 ? ' Your money outlasts your lifetime!' : ` Your money lasts ~${result.yearsMoneyLasts} years after FIRE.`}
                </p>
                <ResponsiveContainer width="100%" height={380}>
                  <ComposedChart data={postFIREData}>
                    <defs>
                      <linearGradient id="postfireGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.accent} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_COLORS.accent} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="age" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} label={{ value: 'Age', position: 'bottom', offset: -2, fontSize: 11 }} />
                    <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={({ active, payload, label }: any) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-left">
                          <p className="text-sm font-bold text-slate-900 mb-1.5">Age {label}</p>
                          {payload.map((entry: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs mb-0.5">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color || entry.stroke }} />
                              <span className="text-slate-500">{entry.name}:</span>
                              <span className="font-semibold text-slate-900">{formatCurrency(entry.value, inputs.currency)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }} />
                    <Area type="monotone" dataKey="endBalance" fill="url(#postfireGrad)" stroke={CHART_COLORS.accent} strokeWidth={2.5} name="Portfolio Balance" animationDuration={800} />
                    <Line type="monotone" dataKey="withdrawal" stroke={CHART_COLORS.rose} strokeWidth={2} dot={false} name="Annual Withdrawal" animationDuration={800} />
                    <Line type="monotone" dataKey="growth" stroke={CHART_COLORS.teal} strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Investment Growth" animationDuration={800} />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 justify-center mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.accent }} /> Portfolio Balance
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: CHART_COLORS.rose, display: 'inline-block', width: 12 }} /> Withdrawals
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: CHART_COLORS.teal, display: 'inline-block', width: 12, borderTop: '1px dashed' }} /> Growth
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </section>

        {/* ── Milestones Timeline ─────────────────────────────── */}
        {result.milestones.length > 0 && (
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="text-xl">🏁</span> Your FIRE Milestones
              </h3>
              <div className="flex items-start gap-0 overflow-x-auto pb-3 scrollbar-thin">
                {result.milestones.map((m, i) => (
                  <motion.div key={m.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex-shrink-0 flex items-start">
                    <div className="flex flex-col items-center w-28 sm:w-32 text-center">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-xl shadow-sm border border-blue-100">{m.icon}</div>
                      <span className="text-xs font-bold text-slate-900 mt-2 leading-tight">{m.label}</span>
                      <span className="text-xs font-semibold text-blue-600 mt-0.5">{formatCurrency(m.targetAmount, inputs.currency, true)}</span>
                      <span className="text-[10px] text-slate-400">Age {m.ageAtMilestone} · {m.yearsToReach}y</span>
                    </div>
                    {i < result.milestones.length - 1 && (
                      <div className="flex-shrink-0 w-6 sm:w-8 flex items-center justify-center mt-5">
                        <div className="w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Power of Compounding ─────────────────────────────── */}
        {result.portfolioAtRetirement > 0 && result.yearsToFIRE > 0 && (
          <section className="mb-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 rounded-2xl p-6 border border-blue-100 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span> Power of Compounding
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Of your projected <span className="font-bold text-slate-900">{formatCurrency(result.portfolioAtRetirement, inputs.currency)}</span> portfolio at FIRE:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 rounded-xl p-4 border border-blue-100/50">
                  <div className="text-2xl font-extrabold text-blue-600">{formatCurrency(result.totalContributions, inputs.currency, true)}</div>
                  <div className="text-xs text-slate-500 mt-1">Your Contributions ({contribPercent}%)</div>
                </div>
                <div className="bg-white/70 rounded-xl p-4 border border-teal-100/50">
                  <div className="text-2xl font-extrabold text-teal-600">{formatCurrency(result.totalGrowth, inputs.currency, true)}</div>
                  <div className="text-xs text-slate-500 mt-1">Investment Growth ({growthPercent}%)</div>
                </div>
              </div>
              <div className="mt-4 h-3 rounded-full overflow-hidden bg-slate-200 flex">
                <div className="bg-blue-500 transition-all duration-700" style={{ width: `${contribPercent}%` }} />
                <div className="bg-teal-500 transition-all duration-700" style={{ width: `${growthPercent}%` }} />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-slate-400">
                <span>Your money</span>
                <span>Market returns</span>
              </div>
            </motion.div>
          </section>
        )}

        {/* ── Education Tips ───────────────────────────────────── */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="text-2xl mb-2">📐</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">The 4% Rule</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The Trinity Study found that withdrawing 4% annually from a diversified portfolio historically sustained a 30-year retirement in 95% of scenarios.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Savings Rate Matters Most</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                At a 50% savings rate, you can reach FIRE in ~17 years regardless of income. Savings rate is the single biggest lever you control.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="text-2xl mb-2">🌱</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">Start Early, Win Big</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thanks to compound growth, every year you start earlier can be worth more than additional savings later. Time in the market beats timing the market.
              </p>
            </div>
          </div>
        </section>

        {/* ── SEO Content ──────────────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use the FIRE Calculator</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            This comprehensive FIRE (Financial Independence Retire Early) calculator helps you determine exactly how much money you need to save to retire early and live off your investments.
          </p>
          <ol className="space-y-3 text-slate-600">
            <li className="flex gap-3"><span className="font-bold text-blue-600 flex-shrink-0">1.</span><div><strong className="text-slate-900">Choose Mode:</strong> Standard mode calculates when you&apos;ll reach FIRE. Reverse mode tells you how much to save monthly to retire by a target date.</div></li>
            <li className="flex gap-3"><span className="font-bold text-blue-600 flex-shrink-0">2.</span><div><strong className="text-slate-900">Pick FIRE Type:</strong> Lean (minimalist), Regular (current lifestyle), Fat (comfortable), Coast (save now, coast later), or Barista (part-time + portfolio).</div></li>
            <li className="flex gap-3"><span className="font-bold text-blue-600 flex-shrink-0">3.</span><div><strong className="text-slate-900">Enter Expenses:</strong> Split into Fixed (rent, utilities, groceries — non-negotiable) and Lifestyle (dining, movies, vacations — discretionary). This helps you see which expenses drive your FIRE number.</div></li>
            <li className="flex gap-3"><span className="font-bold text-blue-600 flex-shrink-0">4.</span><div><strong className="text-slate-900">Set Contributions:</strong> How much you invest monthly towards retirement accounts (401k, IRA, brokerage). The remaining income after expenses and contributions shows as &quot;Misc&quot;.</div></li>
            <li className="flex gap-3"><span className="font-bold text-blue-600 flex-shrink-0">5.</span><div><strong className="text-slate-900">Analyze Results:</strong> See your FIRE number, timeline, withdrawal amounts, and explore interactive charts comparing all FIRE types.</div></li>
          </ol>
        </section>

        {/* Understanding FIRE Types */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Understanding the 5 FIRE Types</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Not all early retirement strategies are the same. Here&apos;s a breakdown of each FIRE approach:
          </p>
          <div className="space-y-4">
            {FIRE_TYPES.map((ft) => (
              <div key={ft.type} className={`${ft.bgLight} ${ft.borderColor} border-l-4 pl-5 p-4 rounded-r-xl`}>
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <span>{ft.icon}</span> {ft.label} — {ft.tagline}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{ft.description}</p>
                <p className="text-xs text-slate-400 mt-1">Expense multiplier: {ft.expenseMultiplier}x your total expenses</p>
              </div>
            ))}
          </div>
        </section>

        {/* The 4% Rule */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">The 4% Rule Explained</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            The 4% rule is the mathematical backbone of the FIRE movement. Withdraw 4% of your portfolio in year 1 of retirement, then adjust for inflation each year.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="font-mono text-lg text-slate-900 mb-2">FIRE Number = Annual Expenses × 25</p>
            <p className="text-sm text-slate-600">(Since 1 ÷ 0.04 = 25, the 4% rule means you need 25× your annual spending)</p>
          </div>
          <p className="text-slate-600 leading-relaxed">
            <strong>Example:</strong> If you spend $40,000/year, you need $40,000 × 25 = <strong>$1,000,000</strong>. This calculator lets you adjust the withdrawal rate from 2% (ultra-conservative) to 6% (aggressive) to model different scenarios.
          </p>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {[
              { q: 'How much money do I need to retire early?', a: 'Multiply your annual expenses by 25 (for a 4% withdrawal rate). If you spend $50,000/year, you need $1.25M. The less you spend, the less you need — and the faster you reach FIRE.' },
              { q: 'What is Reverse Mode?', a: 'Reverse mode lets you say "I want to retire in 10 years" and calculates the required monthly investment to get there. It\'s the opposite of standard mode which calculates years based on your current savings rate.' },
              { q: 'Why split expenses into Fixed and Lifestyle?', a: 'Fixed expenses (rent, utilities, groceries) are non-negotiable. Lifestyle expenses (dining, movies, vacations) are discretionary. Understanding this split helps you see: Lean FIRE uses only 60% of your total expenses, while Fat FIRE adds 50% more. It also shows where you can cut to accelerate FIRE.' },
              { q: 'What is the "Misc / Remaining" in the income breakdown?', a: 'It\'s Income - Expenses - Investments. This is money left over each month that isn\'t allocated to expenses or retirement savings. It could go to emergency funds, short-term goals, or increased investments.' },
              { q: 'Is 4% withdrawal safe for 40+ year retirements?', a: 'The Trinity Study tested 30-year periods. For longer retirements, consider 3.5% or build flexibility (reduce spending in down markets, earn side income). Historical data shows 4% survived even 50+ year periods.' },
              { q: 'What if the market crashes right after I retire?', a: 'This is sequence-of-returns risk. Mitigate with: (1) Cash reserves for 1-2 years, (2) Lower withdrawal rate (3.5%), (3) Flexible spending in bear markets, (4) Part-time earning capacity, (5) Bond tent around retirement date.' },
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Q: {faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed"><strong>A:</strong> {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learn More Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Learn More About FIRE & Financial Independence
          </h3>
          <p className="text-sm text-slate-600 mb-5">
            Deep dive into FIRE concepts, strategies, and variations with our comprehensive guides:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/finance/learn/fire-movement-explained"
              className="flex flex-col bg-gradient-to-br from-orange-50 to-red-50 rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-orange-100"
            >
              <span className="text-sm font-bold text-slate-900 mb-1">The FIRE Movement Explained</span>
              <span className="text-xs text-slate-600 mb-2">Complete beginner's guide to Financial Independence, Retire Early</span>
              <span className="text-orange-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read Guide <span>→</span>
              </span>
            </a>
            <a
              href="/finance/learn/coast-fire-strategy"
              className="flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-blue-100"
            >
              <span className="text-sm font-bold text-slate-900 mb-1">Coast FIRE Strategy</span>
              <span className="text-xs text-slate-600 mb-2">Achieve financial freedom in phases—retire early without the grind</span>
              <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read Guide <span>→</span>
              </span>
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-6 sm:p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Start Your FIRE Journey?</h2>
          <p className="mb-4 leading-relaxed text-blue-100">
            The first step is knowing your number. Use this calculator to create your personalized plan, explore different scenarios, and track your progress.
          </p>
          <a href="#calculator" className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg">
            ↑ Back to Calculator
          </a>
        </section>
      </article>
    </div>
  );
};

export default FIRECalculator;