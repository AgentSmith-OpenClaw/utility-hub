import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCompoundInterest } from '../../hooks/useCompoundInterest';
import { CompoundingFrequency } from './CompoundInterestCalculator.types';
import { formatCurrency, CHART_COLORS } from './CompoundInterestCalculator.utils';
import { exportToPDF } from '../../utils/pdf';
import { exportCompoundInterestToExcel } from '../../utils/excel';

// --- Sub-components ---

const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string; className?: string }> = ({
  value, prefix = '', suffix = '', className = ''
}) => {
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
  }, [value]);
  return <span className={className}>{prefix}{Math.round(display).toLocaleString('en-IN')}{suffix}</span>;
};

const HelpTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group ml-1.5 cursor-help">
    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center text-[9px] font-bold">?</span>
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 
      bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-relaxed font-medium">
      {text}
    </span>
  </span>
);

const InputField: React.FC<{
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; prefix?: string; suffix?: string; tooltip?: string;
  accentColor?: string;
}> = ({ label, value, onChange, min, max, step, prefix, suffix, tooltip, accentColor = CHART_COLORS.primary }) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toLocaleString('en-IN'));
  const pct = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    if (!focused) setDisplayValue(value.toLocaleString('en-IN'));
  }, [value, focused]);

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-slate-700 flex items-center">
          {label}
          {tooltip && <HelpTooltip text={tooltip} />}
        </label>
        <div className={`flex items-center bg-white rounded-xl border-2 px-3 py-1.5 transition-all ${
          focused ? 'border-indigo-400 shadow-md ring-2 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'
        }`}>
          {prefix && <span className="text-sm font-bold text-slate-400 mr-1.5">{prefix}</span>}
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
          {suffix && <span className="text-sm font-bold text-slate-400 ml-1.5">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        style={{
          background: `linear-gradient(to right, ${accentColor} ${pct}%, #f1f5f9 ${pct}%)`
        }}
      />
    </div>
  );
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
      <p className="text-sm font-bold text-slate-900 mb-1.5">Year {label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
          />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

// --- Chart Tab Types ---
type ChartTab = 'growth' | 'stacked' | 'annual-interest' | 'real-vs-nominal' | 'interest-pct' | 'breakdown' | 'pie';

// --- Main Component ---

const CompoundInterestCalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useCompoundInterest();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ChartTab>('growth');
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  // Derived chart data
  const interestPercentData = useMemo(() => 
    result.yearlyData.slice(1).map(d => ({
      year: d.year,
      interestPct: d.balance > 0 ? Math.round((d.totalInterest / d.balance) * 100) : 0,
      principalPct: d.balance > 0 ? Math.round((d.totalPrincipal / d.balance) * 100) : 0,
    })), [result.yearlyData]
  );

  const realVsNominalData = useMemo(() =>
    result.yearlyData.map(d => ({
      year: d.year,
      nominal: d.balance,
      real: d.realValue,
      gap: d.balance - d.realValue,
    })), [result.yearlyData]
  );

  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      await exportToPDF('compound-calculator-content', 'Compound_Interest_Report.pdf', {
        title: 'Compound Interest Projection',
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
      await exportCompoundInterestToExcel(inputs, result, 'Compound_Interest_Projection.xlsx');
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
    } catch { }
  }, []);

  const handleShareWhatsApp = useCallback(() => {
    const text = `Check out my savings projection! Total balance: ${formatCurrency(result.finalBalance)}. Calculate yours: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [result.finalBalance]);

  const handleShareTwitter = useCallback(() => {
    const text = `Check out my savings projection! Total balance: ${formatCurrency(result.finalBalance)}. Calculate yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [result.finalBalance]);

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  const tabs: { id: ChartTab; label: string; icon: string }[] = [
    { id: 'growth', label: 'Growth', icon: '📈' },
    { id: 'stacked', label: 'Stacked', icon: '📊' },
    { id: 'annual-interest', label: 'Annual', icon: '💰' },
    { id: 'real-vs-nominal', label: 'Real vs Nominal', icon: '🔄' },
    { id: 'interest-pct', label: 'Ratio %', icon: '📐' },
    { id: 'breakdown', label: 'Cumulative', icon: '🏔️' },
    { id: 'pie', label: 'Pie', icon: '⭕' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-6 px-4">
      <article className="max-w-7xl mx-auto" itemScope itemType="https://schema.org/WebApplication">
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Compound Interest Calculator
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Visualize how your money grows over time with the power of compounding. 
            Account for regular contributions and inflation to see your true future wealth.
          </p>
        </header>

        <div id="compound-calculator-content">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            {/* Inputs Column */}
            <div className="lg:col-span-4 space-y-6">
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">1</span>
                  Investment Details
                </h2>

                <InputField
                  label="Initial Principal"
                  value={inputs.initialPrincipal}
                  onChange={(v) => updateInputs({ initialPrincipal: v })}
                  min={0} max={10000000} step={5000} prefix="₹"
                  tooltip="The starting amount of money you have to invest."
                />
                <InputField
                  label="Monthly Contribution"
                  value={inputs.monthlyContribution}
                  onChange={(v) => updateInputs({ monthlyContribution: v })}
                  min={0} max={1000000} step={500} prefix="₹"
                  tooltip="Additional money added to the investment every month."
                />
                <InputField
                  label="Annual Interest Rate"
                  value={inputs.annualRate}
                  onChange={(v) => updateInputs({ annualRate: v })}
                  min={1} max={50} step={0.1} suffix="%"
                  tooltip="Expected annual return on your investment (e.g. 10% for mutual funds)."
                />
                <InputField
                  label="Time Period"
                  value={inputs.years}
                  onChange={(v) => updateInputs({ years: v })}
                  min={1} max={50} step={1} suffix=" yrs"
                  tooltip="Number of years you plan to hold the investment."
                />
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Compounding Frequency
                  </label>
                  <select
                    value={inputs.compoundingFrequency}
                    onChange={(e) => updateInputs({ compoundingFrequency: e.target.value as CompoundingFrequency })}
                    className="w-full bg-white border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none hover:border-slate-200 transition-all cursor-pointer"
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <InputField
                  label="Expected Inflation"
                  value={inputs.inflationRate}
                  onChange={(v) => updateInputs({ inflationRate: v })}
                  min={0} max={20} step={0.1} suffix="%"
                  tooltip="Used to calculate the future buying power. Average in India is around 6%."
                />
                <button
                  onClick={reset}
                  className="w-full py-3 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100"
                >
                  ↺ Reset Defaults
                </button>
              </motion.section>

              {/* Share/Export */}
              <div className="hidden lg:block space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleExportPDF} disabled={exporting !== null}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-slate-600 hover:text-indigo-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                    📄 {exporting === 'pdf' ? '...' : 'PDF'}
                  </button>
                  <button onClick={handleExportExcel} disabled={exporting !== null}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-100 text-slate-600 hover:text-teal-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                    📊 {exporting === 'excel' ? '...' : 'Excel'}
                  </button>
                </div>
                <button onClick={handleCopyURL}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-slate-600 hover:text-indigo-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                  🔗 {copied ? '✅ COPIED!' : 'COPY PLAN URL'}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleShareWhatsApp}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-100 text-slate-600 hover:text-teal-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                    💬 WHATSAPP
                  </button>
                  <button onClick={handleShareTwitter}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-100 text-slate-600 hover:text-sky-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                    🐦 TWITTER
                  </button>
                </div>
              </div>
            </div>

            {/* Results & Charts Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Mobile sharing */}
              <div className="flex flex-wrap gap-2 lg:hidden">
                <button onClick={handleExportPDF} disabled={exporting !== null}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
                  {exporting === 'pdf' ? '⏳' : '📄 PDF'}
                </button>
                <button onClick={handleExportExcel} disabled={exporting !== null}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
                  {exporting === 'excel' ? '⏳' : '📊 EXCEL'}
                </button>
                <button onClick={handleCopyURL}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
                  {copied ? '✅' : '🔗 COPY'}
                </button>
                <button onClick={handleShareWhatsApp}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
                  💬 SHARE
                </button>
                <button onClick={handleShareTwitter}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm">
                  🐦 TWEET
                </button>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Final Balance', value: result.finalBalance, prefix: '₹', color: 'from-indigo-600 to-blue-700' },
                  { label: 'Total Principal', value: result.totalPrincipal, prefix: '₹', color: 'from-blue-500 to-indigo-600' },
                  { label: 'Total Interest', value: result.totalInterest, prefix: '₹', color: 'from-cyan-500 to-teal-600' },
                  { label: 'Real Value', value: result.realValue, prefix: '₹', color: 'from-amber-500 to-orange-600' },
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
                    <AnimatedNumber value={stat.value} prefix={stat.prefix} className="text-xl sm:text-2xl font-black block leading-tight" />
                  </motion.div>
                ))}
              </div>

              {/* Key stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Interest %', value: `${result.finalBalance > 0 ? Math.round((result.totalInterest / result.finalBalance) * 100) : 0}%`, sub: 'of total corpus' },
                  { label: 'Doubles Every', value: `~${Math.round(72 / inputs.annualRate)} yrs`, sub: 'Rule of 72' },
                  { label: 'Inflation Loss', value: `${result.finalBalance > 0 ? Math.round((1 - result.realValue / result.finalBalance) * 100) : 0}%`, sub: 'purchasing power' },
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                    <p className="text-lg font-black text-slate-900">{m.value}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Charts Section - 7 Tabs */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
              >
                <div className="flex border-b border-slate-100 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex-1 py-4 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                        activeTab === tab.id 
                          ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6 h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'growth' ? (
                      /* Tab 1: Total Balance Growth Line */
                      <AreaChart data={result.yearlyData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15}/>
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Area type="monotone" dataKey="balance" name="Total Balance" stroke={CHART_COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                        <Area type="monotone" dataKey="totalPrincipal" name="Principal Invested" stroke={CHART_COLORS.teal} fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    ) : activeTab === 'stacked' ? (
                      /* Tab 2: Stacked Area — Principal vs Interest */
                      <AreaChart data={result.yearlyData.slice(1)}>
                        <defs>
                          <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.05} />
                          </linearGradient>
                          <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Area type="monotone" dataKey="totalPrincipal" name="Total Principal" stackId="1" stroke={CHART_COLORS.secondary} fill="url(#gradPrincipal)" strokeWidth={2} />
                        <Area type="monotone" dataKey="totalInterest" name="Total Interest" stackId="1" stroke={CHART_COLORS.accent} fill="url(#gradInterest)" strokeWidth={2} />
                      </AreaChart>
                    ) : activeTab === 'annual-interest' ? (
                      /* Tab 3: Annual Interest Earned - Bar chart */
                      <BarChart data={result.yearlyData.slice(1)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="annualInterest" name="Interest Earned This Year" fill={CHART_COLORS.amber} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : activeTab === 'real-vs-nominal' ? (
                      /* Tab 4: Real vs Nominal Value */
                      <AreaChart data={realVsNominalData}>
                        <defs>
                          <linearGradient id="gradNominal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Area type="monotone" dataKey="nominal" name="Nominal Value" stroke={CHART_COLORS.primary} fill="url(#gradNominal)" strokeWidth={2} />
                        <Area type="monotone" dataKey="real" name="Real Value (after inflation)" stroke={CHART_COLORS.teal} fill="url(#gradReal)" strokeWidth={2} />
                      </AreaChart>
                    ) : activeTab === 'interest-pct' ? (
                      /* Tab 5: Interest % vs Principal % over time */
                      <AreaChart data={interestPercentData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip formatter={(v: any) => `${v}%`} />
                        <Legend verticalAlign="top" height={36} />
                        <Area type="monotone" dataKey="principalPct" name="Principal %" stackId="1" stroke={CHART_COLORS.secondary} fill={CHART_COLORS.secondary} fillOpacity={0.3} strokeWidth={2} />
                        <Area type="monotone" dataKey="interestPct" name="Interest %" stackId="1" stroke={CHART_COLORS.accent} fill={CHART_COLORS.accent} fillOpacity={0.3} strokeWidth={2} />
                      </AreaChart>
                    ) : activeTab === 'breakdown' ? (
                      /* Tab 6: Cumulative principal + interest bars */
                      <BarChart data={result.yearlyData.slice(1)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="totalPrincipal" name="Total Principal" stackId="stack" fill={CHART_COLORS.secondary} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="totalInterest" name="Total Interest" stackId="stack" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      /* Tab 7: Pie chart */
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Initial Principal', value: inputs.initialPrincipal },
                            { name: 'Total Contributions', value: result.totalPrincipal - inputs.initialPrincipal },
                            { name: 'Total Interest', value: result.totalInterest },
                          ]}
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill={CHART_COLORS.primary} />
                          <Cell fill={CHART_COLORS.teal} />
                          <Cell fill={CHART_COLORS.amber} />
                        </Pie>
                        <Tooltip formatter={(v: any) => formatCurrency(v)} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.section>

              {/* Year-by-Year Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black">📋</span>
                  Year-by-Year Projection
                </h3>
                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Year</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Balance</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Principal</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Interest</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Annual Int.</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Real Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyData.slice(1).map((d) => (
                        <tr key={d.year} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 font-bold text-slate-700">{d.year}</td>
                          <td className="py-2 text-right font-black text-indigo-600">{formatCurrency(d.balance)}</td>
                          <td className="py-2 text-right font-bold text-slate-600">{formatCurrency(d.totalPrincipal)}</td>
                          <td className="py-2 text-right font-bold text-cyan-600">{formatCurrency(d.totalInterest)}</td>
                          <td className="py-2 text-right font-bold text-amber-600">{formatCurrency(d.annualInterest)}</td>
                          <td className="py-2 text-right font-bold text-teal-600">{formatCurrency(d.realValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insights Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span>💡</span> Wealth Insight
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    At a {inputs.annualRate}% return, your money doubles approximately every {Math.round(72 / inputs.annualRate)} years 
                    (Rule of 72). By the end of {inputs.years} years, interest makes up 
                    <span className="font-bold text-blue-600"> {Math.round((result.totalInterest / result.finalBalance) * 100)}%</span> of your total portfolio.
                  </p>
                </div>
                <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span>🛡️</span> Inflation Impact
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    While your nominal balance is {formatCurrency(result.finalBalance)}, its purchasing power 
                    in today&apos;s terms is {formatCurrency(result.realValue)}. Inflation reduces 
                    your effective wealth by <span className="font-bold text-cyan-600">{Math.round((1 - result.realValue / result.finalBalance) * 100)}%</span> over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content Section (SEO) */}
        <section className="mt-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="font-bold text-slate-900 mb-2">Start Early</h3>
              <p className="text-sm text-slate-500">The biggest factor in compound interest isn&apos;t the amount you invest, but the time you give it to grow. Even small amounts matter over decades.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="font-bold text-slate-900 mb-2">Frequency Matters</h3>
              <p className="text-sm text-slate-500">The more often interest is compounded (daily vs. annually), the faster your balance grows, as you earn interest on interest more frequently.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="font-bold text-slate-900 mb-2">The Snowball Effect</h3>
              <p className="text-sm text-slate-500">In the early years, growth feels slow. In the later years, the interest earned each year can exceed your total original principal.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">How Compound Interest Works</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
              <p>
                Compound interest is often called the &quot;eighth wonder of the world.&quot; Unlike simple interest, which is calculated only on the principal amount, compound interest is calculated on the principal plus any interest that has already been earned.
              </p>
              <p>
                The formula for compound interest is: <strong>A = P(1 + r/n)<sup>nt</sup></strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>A</strong> = the future value of the investment, including interest</li>
                <li><strong>P</strong> = the principal investment amount (initial deposit)</li>
                <li><strong>r</strong> = the annual interest rate (decimal)</li>
                <li><strong>n</strong> = the number of times interest is compounded per year</li>
                <li><strong>t</strong> = the number of years the money is invested</li>
              </ul>
              <h3 className="text-xl font-bold text-slate-900 mt-8">The Impact of Regular Contributions</h3>
              <p>
                Adding a monthly contribution significantly accelerates the compounding process. Every dollar added becomes a new seed that generates its own interest, which then generates more interest in a virtuous cycle of wealth creation.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[100px] -ml-32 -mt-32" />
            <h2 className="text-3xl font-black mb-10 tracking-tight text-slate-900 relative z-10">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
              {[
                { q: 'What is the "Rule of 72"?', a: "It's a quick way to estimate how long it takes to double your money. Divide 72 by your annual interest rate. For example, at 8% interest, your money doubles every 9 years." },
                { q: 'How does inflation affect my savings?', a: 'Inflation reduces purchasing power. If you have ₹1 Crore in 30 years, but inflation was 6%, that amount might only buy what ₹17.4 Lakh buys today.' },
                { q: 'Should I compound daily or monthly?', a: 'Daily compounding is technically better for the investor, but the difference between daily and monthly compounding on a typical savings account is usually very small.' },
                { q: 'Is the interest rate guaranteed?', a: 'In a fixed deposit or post office scheme, yes. In the stock market (mutual funds), returns fluctuate year to year. This calculator uses a fixed average rate for long-term projection.' },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h4 className="font-bold text-indigo-600 mb-2.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    {q}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Learn More Internal Links */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📚</span>
              Learn More
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Deepen your financial knowledge with our expert guides:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/finance/learn/understanding-compound-interest"
                className="flex items-center justify-between bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-blue-100"
              >
                <span className="text-sm font-bold text-slate-900">Understanding Compound Interest</span>
                <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/finance/fire-calculator"
                className="flex items-center justify-between bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-teal-100"
              >
                <span className="text-sm font-bold text-slate-900">FIRE Calculator</span>
                <span className="text-teal-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/finance/sip-calculator"
                className="flex items-center justify-between bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-amber-100"
              >
                <span className="text-sm font-bold text-slate-900">SIP Wealth Planner</span>
                <span className="text-amber-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default CompoundInterestCalculator;
