import React, { useState, useEffect, useRef, useMemo } from 'react';
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
} from 'recharts';
import { FIREType } from './FIRECalculator.types';
import {
  FIRE_TYPES,
  formatCurrency,
  compareFIRETypes,
} from './FIRECalculator.utils';
import { useFIRE } from '../../hooks/useFIRE';

// ── Animated Number ───────────────────────────────────────────────

const AnimatedNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}> = ({ value, prefix = '', suffix = '', decimals = 0, className }) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number>();

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (Math.abs(start - end) < 0.01) return;

    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(start + (end - start) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString('en-US', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

// ── Number Input (for currency values) ───────────────────────────

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
  label,
  value,
  onChange,
  prefix = '',
  suffix = '',
  tooltip,
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toLocaleString());

  useEffect(() => {
    if (!focused) {
      setDisplayValue(value.toLocaleString());
    }
  }, [value, focused]);

  return (
    <div className="mb-5 last:mb-0">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
        {label}
        {tooltip && (
          <span className="group relative">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-[10px] text-gray-500 cursor-help font-bold">
              ?
            </span>
            <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-pre-line z-20 shadow-xl w-48">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      <div className={`flex items-center bg-white rounded-lg border-2 px-4 py-3 transition-all ${
        focused 
          ? 'border-orange-400 shadow-md ring-2 ring-orange-100' 
          : 'border-gray-200 hover:border-gray-300'
      }`}>
        {prefix && (
          <span className="text-lg font-semibold text-gray-400 mr-2">{prefix}</span>
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
            if (!isNaN(parsed) && parsed >= 0) {
              onChange(Math.round(parsed));
            } else {
              setDisplayValue(value.toLocaleString());
            }
          }}
          onChange={(e) => {
            setDisplayValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          placeholder={placeholder}
          className="flex-1 text-lg font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-300"
        />
        {suffix && (
          <span className="text-sm font-medium text-gray-400 ml-2">{suffix}</span>
        )}
      </div>
    </div>
  );
};

// ── Slider Input (for percentages/ages) ──────────────────────────

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
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = '',
  suffix = '',
  tooltip,
}) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
          {label}
          {tooltip && (
            <span className="group relative">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-[10px] text-gray-500 cursor-help font-bold">
                ?
              </span>
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-20 shadow-xl max-w-xs">
                {tooltip}
              </span>
            </span>
          )}
        </label>
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-2.5 py-1">
          {prefix && (
            <span className="text-xs text-gray-400 mr-0.5">{prefix}</span>
          )}
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) onChange(Math.min(Math.max(v, min), max));
            }}
            className="w-20 text-right text-sm font-semibold text-gray-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            step={step}
            min={min}
            max={max}
          />
          {suffix && (
            <span className="text-xs text-gray-400 ml-0.5">{suffix}</span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="fire-range w-full h-2 rounded-full cursor-pointer outline-none"
        style={{
          background: `linear-gradient(to right, #f97316 ${pct}%, #e5e7eb ${pct}%)`,
        }}
      />
    </div>
  );
};

// ── Chart Helpers ────────────────────────────────────────────────

const createChartTooltip = (currency: 'USD' | 'INR') => ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-left">
      <p className="text-sm font-bold text-gray-900 mb-1.5">Age {label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs mb-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color || entry.stroke }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(entry.value, currency)}
          </span>
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

type ChartTab = 'projection' | 'breakdown' | 'comparison';

const chartTabs: { key: ChartTab; label: string; icon: string }[] = [
  { key: 'projection', label: 'Portfolio Projection', icon: '📈' },
  { key: 'breakdown', label: 'Growth Breakdown', icon: '📊' },
  { key: 'comparison', label: 'FIRE Types', icon: '🔥' },
];

const FIRE_BAR_COLORS = [
  '#10b981',
  '#f97316',
  '#8b5cf6',
  '#06b6d4',
  '#f59e0b',
];

// ── Main Component ────────────────────────────────────────────────

const FIRECalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useFIRE();
  const [activeChart, setActiveChart] = useState<ChartTab>('projection');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Sampled projection data for charts
  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.projections.length / 50));
    return result.projections.filter(
      (_, i, arr) =>
        i % step === 0 || i === arr.length - 1 || i === result.yearsToFIRE
    );
  }, [result]);

  // Accumulation data only (for breakdown)
  const accData = useMemo(() => {
    const upTo = result.projections.filter(
      (p) => p.year <= result.yearsToFIRE
    );
    const step = Math.max(1, Math.floor(upTo.length / 40));
    return upTo.filter((_, i, arr) => i % step === 0 || i === arr.length - 1);
  }, [result]);

  // Comparison across FIRE types
  const comparisonData = useMemo(
    () => compareFIRETypes(inputs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      inputs.monthlyExpenses,
      inputs.currentSavings,
      inputs.monthlyContribution,
      inputs.expectedReturn,
      inputs.withdrawalRate,
      inputs.currentAge,
      inputs.monthlyPartTimeIncome,
    ]
  );

  // Chart helpers with currency awareness
  const ChartTooltip = useMemo(() => createChartTooltip(inputs.currency), [inputs.currency]);
  const formatYAxis = useMemo(() => createFormatYAxis(inputs.currency), [inputs.currency]);
  const currencySymbol = inputs.currency === 'INR' ? '₹' : '$';

  // Progress percentage
  const progressPercent = Math.min(
    (inputs.currentSavings / Math.max(result.fireNumber, 1)) * 100,
    100
  );
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (progressPercent / 100) * circumference;

  // Contribution vs Growth ratio
  const contribPercent =
    result.portfolioAtRetirement > 0
      ? Math.round(
          (result.totalContributions / result.portfolioAtRetirement) * 100
        )
      : 0;
  const growthPercent = 100 - contribPercent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-3 px-4">
      <article
        className="max-w-7xl mx-auto"
        itemScope
        itemType="https://schema.org/WebApplication"
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <header className="text-center mb-6" id="calculator">
          <h1
            className="text-3xl font-bold text-gray-900 mb-1"
            itemProp="name"
          >
            FIRE Calculator{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              — Financial Independence
            </span>
          </h1>
          <p className="text-sm text-gray-600" itemProp="description">
            Calculate your path to Financial Independence and Early Retirement.
            Explore Lean, Fat, Coast & Barista FIRE strategies.
          </p>
          <meta
            itemProp="applicationCategory"
            content="FinanceApplication"
          />
          <meta itemProp="operatingSystem" content="Any" />
        </header>

        {/* ── Already FIRE'd Banner ───────────────────────────── */}
        {result.yearsToFIRE === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center mb-6"
          >
            <p className="text-xl font-bold text-green-700">
              🎉 You&apos;ve already reached FIRE!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Your current savings exceed your FIRE number. Congratulations!
            </p>
          </motion.div>
        )}

        {/* ── FIRE Type Selector ──────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {FIRE_TYPES.map((ft) => (
            <motion.button
              key={ft.type}
              onClick={() => updateInputs({ fireType: ft.type })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                inputs.fireType === ft.type
                  ? `bg-gradient-to-r ${ft.gradient} text-white shadow-lg`
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-lg">{ft.icon}</span>
              <span className="hidden sm:inline">{ft.label}</span>
              <span className="sm:hidden">{ft.label.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>

        {/* ── Currency Selector ───────────────────────────────── */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => updateInputs({ currency: 'USD' })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              inputs.currency === 'USD'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            💵 USD ($)
          </button>
          <button
            onClick={() => updateInputs({ currency: 'INR' })}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              inputs.currency === 'INR'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            ₹ INR (₹)
          </button>
        </div>

        {/* ── Main Layout: Inputs + Sidebar ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ── Input Cards (2/3) ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <span className="bg-orange-100 text-orange-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm font-bold">
                  1
                </span>
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <SliderInput
                  label="Current Age"
                  value={inputs.currentAge}
                  onChange={(v) => updateInputs({ currentAge: v })}
                  min={18}
                  max={70}
                  step={1}
                  suffix=" yrs"
                  tooltip="Your current age"
                />
                <SliderInput
                  label="Life Expectancy"
                  value={inputs.lifeExpectancy}
                  onChange={(v) => updateInputs({ lifeExpectancy: v })}
                  min={60}
                  max={100}
                  step={1}
                  suffix=" yrs"
                  tooltip="How long you expect to live — plan for longevity"
                />
              </div>
            </motion.div>

            {/* Financial Details */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <span className="bg-orange-100 text-orange-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm font-bold">
                  2
                </span>
                Monthly Financial Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <NumberInput
                  label="Monthly Income"
                  value={inputs.monthlyIncome}
                  onChange={(v) => updateInputs({ monthlyIncome: v })}
                  prefix={currencySymbol}
                  placeholder="0"
                  tooltip="Total monthly pre-tax income"
                />
                <NumberInput
                  label="Monthly Expenses"
                  value={inputs.monthlyExpenses}
                  onChange={(v) => updateInputs({ monthlyExpenses: v })}
                  prefix={currencySymbol}
                  placeholder="0"
                  tooltip="Total monthly spending including\nrent, food, bills, etc."
                />
                <NumberInput
                  label="Monthly Contribution"
                  value={inputs.monthlyContribution}
                  onChange={(v) => updateInputs({ monthlyContribution: v })}
                  prefix={currencySymbol}
                  placeholder="0"
                  tooltip="Amount you invest each month\ninto retirement accounts"
                />
              </div>
            </motion.div>

            {/* Current Savings */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <span className="bg-orange-100 text-orange-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm font-bold">
                  3
                </span>
                Current Portfolio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <NumberInput
                  label="Current Savings"
                  value={inputs.currentSavings}
                  onChange={(v) => updateInputs({ currentSavings: v })}
                  prefix={currencySymbol}
                  placeholder="0"
                  tooltip="Total invested assets\n(401k, IRA, brokerage, etc.)"
                />
              </div>
            </motion.div>

            {/* Investment Settings */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <span className="bg-orange-100 text-orange-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm font-bold">
                  4
                </span>
                Investment Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <SliderInput
                  label="Expected Return"
                  value={inputs.expectedReturn}
                  onChange={(v) => updateInputs({ expectedReturn: v })}
                  min={1}
                  max={15}
                  step={0.5}
                  suffix="%"
                  tooltip="Average annual return before inflation (S&P 500 avg ~ 10%)"
                />
                <SliderInput
                  label="Inflation Rate"
                  value={inputs.inflationRate}
                  onChange={(v) => updateInputs({ inflationRate: v })}
                  min={0}
                  max={10}
                  step={0.5}
                  suffix="%"
                  tooltip="Expected annual inflation (historical avg ~ 3%)"
                />
                <SliderInput
                  label="Withdrawal Rate"
                  value={inputs.withdrawalRate}
                  onChange={(v) => updateInputs({ withdrawalRate: v })}
                  min={2}
                  max={6}
                  step={0.25}
                  suffix="%"
                  tooltip="Annual withdrawal rate in retirement (4% rule = Trinity Study)"
                />
                <SliderInput
                  label="Stock Allocation"
                  value={inputs.stockAllocation}
                  onChange={(v) => updateInputs({ stockAllocation: v })}
                  min={0}
                  max={100}
                  step={5}
                  suffix="%"
                  tooltip="Percentage of portfolio in stocks vs bonds"
                />
              </div>
            </motion.div>

            {/* Barista FIRE — Part-time income (conditional) */}
            <AnimatePresence>
              {inputs.fireType === 'barista' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6 overflow-hidden"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                    <span className="bg-amber-100 text-amber-600 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm font-bold">
                      ☕
                    </span>
                    Barista FIRE — Part-Time Income
                  </h2>
                  <NumberInput
                    label="Monthly Part-Time Income"
                    value={inputs.monthlyPartTimeIncome}
                    onChange={(v) => updateInputs({ monthlyPartTimeIncome: v })}
                    prefix={currencySymbol}
                    placeholder="0"
                    tooltip="Expected monthly income from\npart-time work after FIRE"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={reset}
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                ↺ Reset to defaults
              </button>
            </div>
          </div>

          {/* ── Summary Sidebar (1/3) ─────────────────────────── */}
          <div className="space-y-4">
            {/* FIRE Number */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-5 text-white"
            >
              <p className="text-orange-100 mb-1 text-xs font-semibold uppercase tracking-wider">
                🔥 FIRE Number
              </p>
              <AnimatedNumber
                value={result.fireNumber}
                prefix={currencySymbol}
                className="text-3xl font-extrabold block"
              />
              <p className="text-orange-200 text-xs mt-1">
                Based on {inputs.withdrawalRate}% withdrawal rate
              </p>
            </motion.div>

            {/* Years to FIRE */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg p-5 text-white"
            >
              <p className="text-amber-100 mb-1 text-xs font-semibold uppercase tracking-wider">
                ⏱️ Years to FIRE
              </p>
              <AnimatedNumber
                value={result.yearsToFIRE}
                suffix=" years"
                className="text-3xl font-extrabold block"
              />
              <p className="text-amber-200 text-xs mt-1">
                Starting from age {inputs.currentAge}
              </p>
            </motion.div>

            {/* FIRE Age */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-5 text-white"
            >
              <p className="text-emerald-100 mb-1 text-xs font-semibold uppercase tracking-wider">
                🎯 FIRE Age
              </p>
              <AnimatedNumber
                value={result.fireAge}
                prefix="Age "
                className="text-3xl font-extrabold block"
              />
              <p className="text-emerald-200 text-xs mt-1">
                {Math.max(inputs.lifeExpectancy - result.fireAge, 0)} years of
                freedom
              </p>
            </motion.div>

            {/* Savings Rate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-5 text-white"
            >
              <p className="text-blue-100 mb-1 text-xs font-semibold uppercase tracking-wider">
                💰 Savings Rate
              </p>
              <AnimatedNumber
                value={result.savingsRate}
                suffix="%"
                decimals={1}
                className="text-3xl font-extrabold block"
              />
              <p className="text-blue-200 text-xs mt-1">
                Saving {formatCurrency(result.annualSavings, inputs.currency)}/yr
              </p>
            </motion.div>

            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Progress to FIRE
              </h3>
              <div className="relative inline-flex items-center justify-center">
                <svg
                  className="w-36 h-36 -rotate-90"
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="url(#fireProgressGrad)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient
                      id="fireProgressGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <AnimatedNumber
                    value={progressPercent}
                    suffix="%"
                    decimals={1}
                    className="text-2xl font-bold text-gray-900"
                  />
                  <span className="text-[10px] text-gray-500">
                    of FIRE goal
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Additional Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Safe Withdrawal
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(result.safeWithdrawalAmount, inputs.currency, true)}
                </p>
                <p className="text-[10px] text-gray-400">per year</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Money Lasts
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {result.yearsMoneyLasts >= 100
                    ? '100+'
                    : result.yearsMoneyLasts}{' '}
                  yrs
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.yearsMoneyLasts >= 40
                        ? 'bg-green-500'
                        : result.yearsMoneyLasts >= 25
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        (result.yearsMoneyLasts / 50) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Coast FIRE info (for Coast type) */}
            <AnimatePresence>
              {inputs.fireType === 'coast' && result.coastFIREAge !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-4 overflow-hidden"
                >
                  <p className="text-xs font-semibold text-cyan-700 mb-1">
                    🏖️ Coast FIRE
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    Age {result.coastFIREAge}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Save {formatCurrency(result.coastFIRENumber, inputs.currency)} then stop —
                    compounding does the rest
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Charts Section ──────────────────────────────────── */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Tab Buttons */}
            <div className="flex gap-1 p-3 sm:p-4 border-b border-gray-100 overflow-x-auto">
              {chartTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveChart(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeChart === tab.key
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chart Content */}
            <div className="p-4 sm:p-6">
              {mounted && (
                <AnimatePresence mode="wait">
                  {/* ── Portfolio Projection ────────────────────── */}
                  {activeChart === 'projection' && (
                    <motion.div
                      key="projection"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-500 mb-4">
                        Portfolio growth over time with FIRE target line.
                        The green marker shows when you reach financial
                        independence.
                      </p>
                      <ResponsiveContainer width="100%" height={380}>
                        <ComposedChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="portfolioGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#f97316"
                                stopOpacity={0.25}
                              />
                              <stop
                                offset="100%"
                                stopColor="#f97316"
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="age"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                          />
                          <YAxis
                            tickFormatter={formatYAxis}
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="endBalance"
                            fill="url(#portfolioGrad)"
                            stroke="#f97316"
                            strokeWidth={2.5}
                            name="Portfolio"
                            animationDuration={800}
                          />
                          <Line
                            type="monotone"
                            dataKey="fireNumber"
                            stroke="#ef4444"
                            strokeWidth={2}
                            strokeDasharray="8 4"
                            dot={false}
                            name="FIRE Target"
                            animationDuration={800}
                          />
                          {result.yearsToFIRE < 70 && (
                            <ReferenceLine
                              x={result.fireAge}
                              stroke="#22c55e"
                              strokeWidth={2}
                              strokeDasharray="4 4"
                              label={{
                                value: '🔥 FIRE!',
                                position: 'top',
                                fontSize: 12,
                                fontWeight: 'bold',
                                fill: '#16a34a',
                              }}
                            />
                          )}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}

                  {/* ── Growth Breakdown ────────────────────────── */}
                  {activeChart === 'breakdown' && (
                    <motion.div
                      key="breakdown"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-500 mb-4">
                        See how much of your portfolio comes from your
                        contributions vs. compound investment growth.
                      </p>
                      <ResponsiveContainer width="100%" height={380}>
                        <AreaChart data={accData}>
                          <defs>
                            <linearGradient
                              id="contribGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#3b82f6"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="100%"
                                stopColor="#3b82f6"
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                            <linearGradient
                              id="growthGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22c55e"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="100%"
                                stopColor="#22c55e"
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="age"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                          />
                          <YAxis
                            tickFormatter={formatYAxis}
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="totalContributed"
                            stackId="1"
                            fill="url(#contribGrad)"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Your Contributions"
                            animationDuration={800}
                          />
                          <Area
                            type="monotone"
                            dataKey="totalGrowth"
                            stackId="1"
                            fill="url(#growthGrad)"
                            stroke="#22c55e"
                            strokeWidth={2}
                            name="Investment Growth"
                            animationDuration={800}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}

                  {/* ── FIRE Type Comparison ────────────────────── */}
                  {activeChart === 'comparison' && (
                    <motion.div
                      key="comparison"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm text-gray-500 mb-4">
                        Compare target amounts and timeline across different
                        FIRE strategies with your current financial profile.
                      </p>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={comparisonData}
                          layout="vertical"
                          margin={{ left: 10 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            type="number"
                            tickFormatter={formatYAxis}
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                          />
                          <YAxis
                            type="category"
                            dataKey="label"
                            stroke="#94a3b8"
                            fontSize={12}
                            width={100}
                            tickLine={false}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (!active || !payload?.length) return null;
                              const d = payload[0].payload;
                              return (
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 px-4 py-3">
                                  <p className="text-sm font-bold text-gray-900 mb-1">
                                    {d.icon} {d.label}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Target:{' '}
                                    <span className="font-semibold">
                                      {formatCurrency(d.fireNumber, inputs.currency)}
                                    </span>
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Years:{' '}
                                    <span className="font-semibold">
                                      {d.yearsToFIRE}
                                    </span>{' '}
                                    (Age {d.fireAge})
                                  </p>
                                </div>
                              );
                            }}
                          />
                          <Bar
                            dataKey="fireNumber"
                            name="FIRE Target"
                            radius={[0, 8, 8, 0]}
                            animationDuration={800}
                          >
                            {comparisonData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={FIRE_BAR_COLORS[i]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      {/* Years badges */}
                      <div className="flex flex-wrap gap-3 mt-4 justify-center">
                        {comparisonData.map((d, i) => (
                          <div
                            key={d.type}
                            className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                          >
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: FIRE_BAR_COLORS[i],
                              }}
                            />
                            <span className="text-xs font-semibold text-gray-700">
                              {d.label}:
                            </span>
                            <span className="text-xs text-gray-500">
                              {d.yearsToFIRE} yrs (Age {d.fireAge})
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </section>

        {/* ── Milestones Timeline ─────────────────────────────── */}
        {result.milestones.length > 0 && (
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="text-xl">🏁</span>
                Your FIRE Milestones
              </h3>
              <div className="flex items-start gap-0 overflow-x-auto pb-3 scrollbar-thin">
                {result.milestones.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex-shrink-0 flex items-start"
                  >
                    <div className="flex flex-col items-center w-28 sm:w-32 text-center">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-xl shadow-sm border border-orange-200/50">
                        {m.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-900 mt-2 leading-tight">
                        {m.label}
                      </span>
                      <span className="text-xs font-semibold text-orange-600 mt-0.5">
                        {formatCurrency(m.targetAmount, inputs.currency, true)}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Age {m.ageAtMilestone} · {m.yearsToReach}y
                      </span>
                    </div>
                    {/* Connector line */}
                    {i < result.milestones.length - 1 && (
                      <div className="flex-shrink-0 w-6 sm:w-8 flex items-center justify-center mt-5">
                        <div className="w-full h-0.5 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Power of Compounding Insight ─────────────────────── */}
        {result.portfolioAtRetirement > 0 && result.yearsToFIRE > 0 && (
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 border border-green-200/60 shadow-sm"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Power of Compounding
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Of your projected{' '}
                <span className="font-bold text-gray-900">
                  {formatCurrency(result.portfolioAtRetirement, inputs.currency)}
                </span>{' '}
                portfolio at FIRE:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 rounded-lg p-4">
                  <div className="text-2xl font-extrabold text-blue-600">
                    {formatCurrency(result.totalContributions, inputs.currency, true)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Your Contributions ({contribPercent}%)
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-4">
                  <div className="text-2xl font-extrabold text-green-600">
                    {formatCurrency(result.totalGrowth, inputs.currency, true)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Investment Growth ({growthPercent}%)
                  </div>
                </div>
              </div>
              {/* Visual bar */}
              <div className="mt-4 h-3 rounded-full overflow-hidden bg-gray-200 flex">
                <div
                  className="bg-blue-500 transition-all duration-700"
                  style={{ width: `${contribPercent}%` }}
                />
                <div
                  className="bg-green-500 transition-all duration-700"
                  style={{ width: `${growthPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
                <span>Your money</span>
                <span>Market returns</span>
              </div>
            </motion.div>
          </section>
        )}

        {/* ── Education Tips ───────────────────────────────────── */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="text-2xl mb-2">📐</div>
              <h4 className="font-bold text-gray-900 text-sm mb-1.5">
                The 4% Rule
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                The Trinity Study found that withdrawing 4% annually from a
                diversified portfolio historically sustained a 30-year
                retirement in 95% of scenarios.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-bold text-gray-900 text-sm mb-1.5">
                Savings Rate Matters Most
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                At a 50% savings rate, you can reach FIRE in ~17 years
                regardless of income. Savings rate is the single biggest lever
                you control.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="text-2xl mb-2">🌱</div>
              <h4 className="font-bold text-gray-900 text-sm mb-1.5">
                Start Early, Win Big
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Thanks to compound growth, every year you start earlier can
                be worth more than additional savings later. Time in the
                market beats timing the market.
              </p>
            </div>
          </div>
        </section>

        {/* ── SEO Content Sections ─────────────────────────────── */}
        
        {/* How to Use */}
        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How to Use the FIRE Calculator
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            This comprehensive FIRE (Financial Independence Retire Early) calculator helps you determine exactly how much money you need to save to retire early and live off your investments. Follow these steps to create your personalized FIRE plan:
          </p>
          <ol className="space-y-4 text-gray-600">
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 flex-shrink-0">1.</span>
              <div>
                <strong className="text-gray-900">Select Your Currency:</strong> Choose between USD ($) or INR (₹) to match your financial planning currency.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 flex-shrink-0">2.</span>
              <div>
                <strong className="text-gray-900">Choose Your FIRE Type:</strong> Select from five different FIRE strategies—Lean FIRE (minimalist), Regular FIRE (current lifestyle), Fat FIRE (comfortable), Coast FIRE (save now, coast later), or Barista FIRE (part-time work).
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 flex-shrink-0">3.</span>
              <div>
                <strong className="text-gray-900">Enter Personal Details:</strong> Input your current age and expected life expectancy. Most people use 85-90 years, but adjust based on family history and health.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 flex-shrink-0">4.</span>
              <div>
                <strong className="text-gray-900">Add Financial Information:</strong> Enter your annual income, annual expenses, current savings, and how much you plan to invest monthly. Be realistic—use actual numbers from your budget.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 flex-shrink-0">5.</span>
              <div>
                <strong className="text-gray-900">Configure Investment Settings:</strong> Set your expected return (7-10% for stocks historically), inflation rate (2-3% typical), withdrawal rate (4% is the gold standard), and stock allocation (higher = more growth potential, more volatility).
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-orange-600 flex-shrink-0">6.</span>
              <div>
                <strong className="text-gray-900">Analyze Results:</strong> Review your FIRE number, years to FIRE, and detailed projections. Explore interactive charts showing portfolio growth, contribution vs. growth breakdown, and comparisons across all FIRE types.
              </div>
            </li>
          </ol>
          <p className="text-gray-600 mt-4 leading-relaxed">
            The calculator automatically saves your inputs, so you can revisit and adjust your plan anytime. Experiment with different scenarios—reduce expenses by 10%, increase savings by $500/month, or delay retirement by 2 years—to see how each change impacts your timeline.
          </p>
        </section>

        {/* Understanding FIRE Types */}
        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding the 5 FIRE Types
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Not all early retirement strategies are the same. The FIRE community has developed several approaches based on lifestyle preferences, risk tolerance, and financial goals. Here's a detailed breakdown of each FIRE type:
          </p>

          <div className="space-y-6">
            {/* Lean FIRE */}
            <div className="border-l-4 border-emerald-500 pl-5 bg-emerald-50 p-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🌿</span> Lean FIRE — Minimalist Lifestyle
              </h3>
              <p className="text-gray-700 mb-2 leading-relaxed">
                <strong>Annual Budget:</strong> $25,000 - $40,000 (60% of typical expenses)
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Lean FIRE practitioners embrace minimalism and frugality to retire as early as possible. This approach requires living on significantly less than the average person—think house hacking, geoarbitrage (moving to low-cost areas), minimal discretionary spending, and strict budgeting. Ideal for those who value freedom over luxury and are comfortable with a simpler lifestyle. Many Lean FIRE advocates live in affordable countries (Southeast Asia, Eastern Europe, Latin America) or low-cost US states.
              </p>
            </div>

            {/* Regular FIRE */}
            <div className="border-l-4 border-orange-500 pl-5 bg-orange-50 p-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🔥</span> Regular FIRE — Maintain Current Lifestyle
              </h3>
              <p className="text-gray-700 mb-2 leading-relaxed">
                <strong>Annual Budget:</strong> $40,000 - $80,000 (100% of typical expenses)
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Regular FIRE aims to maintain your current standard of living without the need for employment income. You'll have the same house, car, hobbies, and lifestyle—just without the 9-to-5 grind. This is the most common FIRE path because it doesn't require extreme frugality or lifestyle changes. Calculate your actual annual spending (including healthcare, property taxes, insurance, travel, and fun money), multiply by 25, and that's your FIRE number using the 4% rule.
              </p>
            </div>

            {/* Fat FIRE */}
            <div className="border-l-4 border-purple-500 pl-5 bg-purple-50 p-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>👑</span> Fat FIRE — Comfortable & Luxurious
              </h3>
              <p className="text-gray-700 mb-2 leading-relaxed">
                <strong>Annual Budget:</strong> $100,000+ (150% or more of typical expenses)
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fat FIRE is for those who want financial independence without sacrificing comfort. Think multiple vacations per year, dining out regularly, nice cars, larger homes, private education for kids, and no budget anxiety. This typically requires earning and saving significantly more during your working years—often $3-5M+ in investable assets. Common in high-earning professions (tech, medicine, finance, law) where aggressive saving and investing can build substantial wealth in 15-20 years.
              </p>
            </div>

            {/* Coast FIRE */}
            <div className="border-l-4 border-cyan-500 pl-5 bg-cyan-50 p-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🏖️</span> Coast FIRE — Save Now, Coast Later
              </h3>
              <p className="text-gray-700 mb-2 leading-relaxed">
                <strong>Strategy:</strong> Front-load savings, then let compound growth finish the job
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Coast FIRE means you've saved enough that compound growth will carry you to full FIRE by traditional retirement age (60-67), even if you never save another dollar. Once you hit your Coast FIRE number, you can take lower-stress jobs, work part-time, start a passion project, or travel—covering only your current expenses without adding to retirement savings. This is perfect for people who want more life balance NOW rather than waiting decades. Example: Save aggressively until 35, hit Coast FIRE, then work as a part-time consultant or freelancer covering bills while your portfolio grows to full FIRE by 60.
              </p>
            </div>

            {/* Barista FIRE */}
            <div className="border-l-4 border-amber-500 pl-5 bg-amber-50 p-4 rounded-r-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>☕</span> Barista FIRE — Part-Time Work + Portfolio
              </h3>
              <p className="text-gray-700 mb-2 leading-relaxed">
                <strong>Strategy:</strong> Portfolio covers most expenses, part-time work covers the rest
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Barista FIRE (named after the stereotype of working at Starbucks for healthcare benefits) blends partial financial independence with part-time work. Your portfolio covers 50-80% of expenses, while low-stress part-time work ($15-30k/year) bridges the gap and often provides health insurance. This dramatically reduces your FIRE number—if you need $50k/year and earn $20k part-time, your portfolio only needs to generate $30k (÷ 0.04 = $750k vs. $1.25M for full FIRE). Ideal for those who enjoy some work structure, want social interaction, or need health benefits before Medicare kicks in at 65.
              </p>
            </div>
          </div>
        </section>

        {/* What is Financial Independence */}
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What is Financial Independence?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Financial Independence (FI) means having enough wealth to cover your living expenses without depending on traditional employment income. You're financially independent when your investments, rental income, dividends, or other passive income streams generate more than you spend annually—forever.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The "Retire Early" (RE) part is optional. Many people pursue FI for the freedom it provides: the ability to leave toxic jobs, take career breaks, start businesses without financial pressure, work part-time in meaningful roles, or yes—retire decades earlier than the traditional age of 65.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-6">
            Why Pursue FIRE?
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Freedom of Time:</strong> Spend your days however you want—travel, hobbies, family, passion projects, volunteering.</div>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Location Independence:</strong> Work becomes optional, so you can live anywhere—no need to be tied to expensive cities for jobs.</div>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Career Flexibility:</strong> Take interesting but lower-paying jobs, say no to overwork, negotiate better terms—you don't NEED the paycheck.</div>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Reduced Stress:</strong> Financial security eliminates money anxiety, job insecurity, and the "golden handcuffs" of high-paying but soul-crushing work.</div>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Life ON Your Terms:</strong> Design your ideal lifestyle rather than deferring dreams to "someday" when you retire at 65.</div>
            </li>
          </ul>
          <p className="text-gray-700 mt-4 leading-relaxed">
            The FIRE movement gained momentum in the 2010s through blogs like Mr. Money Mustache, books like "Your Money or Your Life," and online communities on Reddit (r/financialindependence). What started as a fringe concept is now mainstream, with millions pursuing various forms of FI worldwide.
          </p>
        </section>

        {/* The 4% Rule Deep Dive */}
        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The 4% Rule Explained: The Foundation of FIRE
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The 4% rule is the mathematical backbone of the FIRE movement. It states that you can safely withdraw 4% of your portfolio's value in the first year of retirement, then adjust that amount for inflation each year, with a high probability (95%+) that your money will last 30+ years.
          </p>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-6">
            The Trinity Study
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The 4% rule comes from the landmark <strong>Trinity Study</strong> (1998) conducted by three professors at Trinity University. They analyzed historical market data from 1926-1995, testing various withdrawal rates and portfolio allocations across different time periods. Their conclusion: a 4% initial withdrawal rate from a portfolio of 50-75% stocks and 25-50% bonds succeeded in 95-98% of 30-year retirement periods throughout history—including surviving the Great Depression, dot-com crash, and multiple recessions.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-6">
            How to Calculate Your FIRE Number Using the 4% Rule
          </h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="font-mono text-lg text-gray-900 mb-2">
              FIRE Number = Annual Expenses × 25
            </p>
            <p className="text-sm text-gray-600">
              (Since 1 ÷ 0.04 = 25, the 4% rule means you need 25 times your annual spending)
            </p>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>Example:</strong> If you spend $40,000/year, you need $40,000 × 25 = <strong>$1,000,000</strong> to be financially independent. In your first year of retirement, you withdraw $40,000 (4%). In year two, you adjust for 3% inflation: $41,200. Year three: $42,436. And so on.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-6">
            Criticisms and Modern Adjustments
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            While the 4% rule is robust, some experts argue for adjustments based on current market conditions:
          </p>
          <ul className="space-y-2 text-gray-700 mb-4">
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Lower Bond Yields:</strong> With bonds yielding 3-4% vs. 6-7% historically, some suggest 3.5% is safer.</div>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Longer Retirements:</strong> If you retire at 35, you need money for 50+ years, not 30. Consider 3-3.5% for ultra-early retirement.</div>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Flexibility:</strong> The 4% rule assumes fixed spending. In reality, you can reduce spending in down markets (eat out less, delay big purchases) to extend portfolio longevity.</div>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 mt-1">▸</span>
              <div><strong>Additional Income:</strong> Many early retirees earn side income—rental properties, freelancing, hobbies turned profitable—reducing portfolio withdrawals.</div>
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Our FIRE calculator lets you adjust the withdrawal rate from 2% (ultra-conservative) to 6% (aggressive) so you can model different scenarios based on your risk tolerance, retirement timeline, and spending flexibility.
          </p>
        </section>

        {/* Assumptions & Methodology */}
        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Calculator Assumptions & Methodology
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Understanding how this FIRE calculator works helps you make informed decisions. Here are the key assumptions and calculations:
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Investment Returns
          </h3>
          <p className="text-gray-700 mb-3 leading-relaxed">
            <strong>Default: 7% annual return.</strong> This is a reasonable estimate for a diversified stock portfolio (the S&P 500 has returned ~10% historically, minus 3% inflation = 7% real return). You can adjust from 1-15% based on your asset allocation:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-6">
            <li>• 100% stocks: 8-10% historical average</li>
            <li>• 80% stocks / 20% bonds: 7-8%</li>
            <li>• 60% stocks / 40% bonds: 6-7%</li>
            <li>• Conservative (mostly bonds): 3-5%</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Inflation
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>Default: 3% annual inflation.</strong> The calculator adjusts your expenses upward each year to maintain purchasing power. Historical US inflation averages 3.2% (1926-2023), with recent spikes to 8% (2022) being anomalies. Healthcare costs inflate faster (~5-7%), while technology deflates—3% is a reasonable blended average.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Withdrawal Strategy
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The calculator uses a <strong>constant inflation-adjusted withdrawal</strong> strategy. You withdraw X% in year 1, then increase that dollar amount by inflation each subsequent year. This matches the Trinity Study methodology and is the most common FIRE approach.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Tax Treatment
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            This calculator uses <strong>pre-tax numbers</strong> for simplicity. In reality, your FIRE withdrawals face different tax rates depending on account type (Roth IRA = tax-free, 401k = ordinary income, taxable brokerage = long-term capital gains ~15%). For a more accurate plan, reduce your expected annual expenses by 10-20% to account for tax-efficient withdrawal strategies.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Healthcare Costs
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>Not explicitly modeled.</strong> Make sure your "Annual Expenses" input includes realistic healthcare costs. For US early retirees under 65 (pre-Medicare), this can be $5,000-$15,000/year for a family on ACA marketplace plans, depending on income and subsidies.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Sequence of Returns Risk
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            The calculator assumes smooth average returns. Reality is volatile—if you retire right before a 40% market crash (like 2008), your portfolio may not recover even if long-term average returns are 7%. This is why many FIREes: (a) use a lower withdrawal rate like 3.5%, (b) maintain 1-2 years of cash reserves, or (c) stay flexible with spending in early retirement years.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Longevity
          </h3>
          <p className="text-gray-700 leading-relaxed">
            <strong>Default: Age 85.</strong> If you're retiring at 35, model to 95 or even 100 to be safe. The calculator shows "Years Money Lasts" to help you assess if your plan survives beyond life expectancy—green means 40+ years of runway (excellent), yellow 25-40 years (good), red under 25 years (risky for early retirees).
          </p>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions (FAQs)
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: How much money do I need to retire early?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> Multiply your annual expenses by 25 (for a 4% withdrawal rate). If you spend $50,000/year, you need $1.25 million. If you spend $30,000/year, you need $750,000. The less you spend, the less you need—and the faster you can reach FIRE. This is why FIRE advocates focus on <em>savings rate</em> (income minus expenses) rather than just high income.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: Is 4% withdrawal rate safe for 40+ year retirements?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> The Trinity Study tested 30-year periods. For longer retirements (35-40 starting age), consider 3.5% to be safer, or build flexibility into your plan (willing to reduce spending 10-20% in down markets, earn small side income, delay Social Security to age 70 for maximum benefit). Historical data shows 4% survived even 50+ year periods, but longer retirements face more sequence-of-returns risk.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: Should I include home equity in my FIRE number?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> <strong>No, not if you plan to live there.</strong> Your FIRE number should be liquid, investable assets (401k, IRA, brokerage accounts) that generate investment returns. Home equity is wealth, but it doesn't produce income unless you: (a) rent rooms, (b) downsize and invest the difference, or (c) do a reverse mortgage later. Your "Annual Expenses" should exclude mortgage payments if your home will be paid off by FIRE.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: What's a good savings rate to reach FIRE quickly?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> To reach FIRE in 10-15 years, aim for 50-70% savings rate. At 50% (save half your income), you can retire in ~17 years. At 70%, you're looking at ~10 years. The math: if you save 50%, your lifestyle costs 50% of income—so you need 12.5x your income to replace it (50% × 25 years). After 17 years of saving 50%, you'll have that amount (thanks to compound growth).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: Can I retire early if I have kids?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> <strong>Yes, but plan carefully.</strong> Kids add $10,000-$30,000/year in expenses (more for childcare, college). Model higher annual expenses in your FIRE calculator during kid-raising years. Many FI parents: (a) pursue Coast or Barista FIRE for more income flexibility, (b) use 529 plans for college savings (separate from FIRE portfolio), (c) plan for expenses to DROP once kids are independent (~age 22), lowering their FIRE number. Also factor healthcare—family coverage is expensive until kids age out at 26.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: Do I need to max out my 401k and IRA to reach FIRE?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> <strong>Not necessarily, but it helps.</strong> Tax-advantaged accounts (401k, IRA, HSA) save you ~20-30% in taxes NOW, accelerating wealth building. However, early retirees need accessible funds before age 59.5. The solution: (1) Build a "bridge" in taxable brokerage accounts to cover age 35-59, (2) Use Roth conversion ladders to access 401k/IRA funds penalty-free after 5 years, or (3) Utilize 72(t) SEPP distributions. Most FI planners use a blend of account types for maximum flexibility.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: What if I want to travel extensively in retirement?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> Factor realistic travel costs into your "Annual Expenses." Budget travelers do $15k-25k/year (slow travel in Southeast Asia, Eastern Europe). Moderate travelers spend $30-50k. Luxury travelers need $75k+. Many FI travelers also housesit, work remotely occasionally, or use travel hacking (credit card points) to offset costs. Ironically, some retirees spend LESS by slow-traveling to affordable countries versus living in expensive US cities.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: Should I pay off my mortgage before pursuing FIRE?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> <strong>It depends on the interest rate.</strong> If your mortgage is under 4%, you're better off investing extra money (historical returns of 7-10% beat 4% interest). If it's 6-7%+, paying it off is equivalent to a guaranteed 6-7% return—hard to beat. Many FI planners split the difference: make extra principal payments to have it paid off BY their FIRE date, ensuring their retirement expenses don't include housing costs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: What's the difference between FIRE and regular retirement?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> <strong>Timeline and intentionality.</strong> Regular retirement means working until 62-67, relying on Social Security + 401k + pension. FIRE means retiring in your 30s, 40s, or 50s through aggressive saving (40-70% of income) and living below your means. FIRE requires much higher savings rates but rewards you with decades of freedom. Regular retirement often involves spending 40+ years in jobs you tolerate; FIRE prioritizes lifestyle design and autonomy NOW.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Q: What happens if the stock market crashes right after I retire?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>A:</strong> This is called <strong>sequence of returns risk</strong>—the biggest danger to early retirees. Mitigate it by: (1) <strong>Cash reserves</strong> - Keep 1-2 years of expenses in cash to avoid selling stocks in a crash, (2) <strong>Lower withdrawal rate</strong> - Use 3-3.5% instead of 4% to build buffer, (3) <strong>Flexible spending</strong> - Cut discretionary expenses 10-30% during bear markets, (4) <strong>Earning capacity</strong> - Most early retirees CAN work part-time if needed, reducing withdrawals, (5) <strong>Bond tent</strong> - Shift to 50-60% bonds in the 5 years before and after FIRE for stability. The Trinity Study already modeled retiring into 1929 (Great Depression) and 2008 (Great Recession)—4% worked even in those scenarios.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white p-6 sm:p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to Start Your FIRE Journey?
          </h2>
          <p className="mb-4 leading-relaxed">
            The first step is knowing your number. Use this free FIRE calculator to create your personalized plan, explore different scenarios, and track your progress toward financial independence.
          </p>
          <a
            href="#calculator"
            className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            ↑ Back to Calculator
          </a>
        </section>
      </article>
    </div>
  );
};

export default FIRECalculator;
