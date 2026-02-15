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
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useCompoundInterest } from '../../hooks/useCompoundInterest';
import { 
  CHART_COLORS, 
  formatCurrency 
} from './CompoundInterestCalculator.utils';
import { 
  COMPOUNDING_FREQUENCIES, 
  CompoundingFrequency 
} from './CompoundInterestCalculator.types';
import { exportToPDF } from '../../utils/pdf';
import { exportCompoundInterestToExcel } from '../../utils/excel';
import Link from 'next/link';

// --- Sub-components ---

const AnimatedNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}> = ({ value, prefix = '', suffix = '', decimals = 0, className }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const duration = 800;
    const startTime = performance.now();
    const startValue = display;

    const tick = (now: number) => {
      const t = (now - startTime) / duration;
      const eased = t < 1 ? 1 - Math.pow(1 - t, 4) : 1; // Quartic ease out
      setDisplay(startValue + (value - startValue) * eased);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString('en-IN', { 
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals 
      })}
      {suffix}
    </span>
  );
};

const HelpTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="group relative ml-1.5 inline-flex items-center">
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-[10px] text-slate-500 cursor-help font-bold transition-colors hover:bg-slate-300">?</span>
    <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none leading-relaxed">
      {text}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
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
  accentColor?: string;
}> = ({ label, value, onChange, min, max, step, prefix = '', suffix = '', tooltip, accentColor = '#6366f1' }) => {
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

// --- Main Component ---

const CompoundInterestCalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useCompoundInterest();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'growth' | 'breakdown' | 'pie'>('growth');
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

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
    } catch {
      // Fallback
    }
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
                  min={0}
                  max={10000000}
                  step={5000}
                  prefix="₹"
                  tooltip="The starting amount of money you have to invest."
                />

                <InputField
                  label="Monthly Contribution"
                  value={inputs.monthlyContribution}
                  onChange={(v) => updateInputs({ monthlyContribution: v })}
                  min={0}
                  max={1000000}
                  step={500}
                  prefix="₹"
                  tooltip="Additional money added to the investment every month."
                />

                <InputField
                  label="Annual Interest Rate"
                  value={inputs.annualRate}
                  onChange={(v) => updateInputs({ annualRate: v })}
                  min={1}
                  max={50}
                  step={0.1}
                  suffix="%"
                  tooltip="Expected annual return on your investment (e.g. 10% for mutual funds)."
                />

                <InputField
                  label="Time Period"
                  value={inputs.years}
                  onChange={(v) => updateInputs({ years: v })}
                  min={1}
                  max={50}
                  step={1}
                  suffix=" yrs"
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
                  min={0}
                  max={20}
                  step={0.1}
                  suffix="%"
                  tooltip="Used to calculate the future buying power. Average in India is around 6%."
                />

                <button
                  onClick={reset}
                  className="w-full py-3 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-all hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100"
                >
                  ↺ Reset Defaults
                </button>
              </motion.section>

              {/* Share/Export Bar (Desktop Sidebar) */}
              <div className="hidden lg:block space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleExportPDF} disabled={exporting !== null}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-slate-100 hover:border-red-100 text-slate-600 hover:text-red-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                    📄 {exporting === 'pdf' ? '...' : 'PDF'}
                  </button>
                  <button onClick={handleExportExcel} disabled={exporting !== null}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 text-slate-600 hover:text-emerald-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                    📊 {exporting === 'excel' ? '...' : 'Excel'}
                  </button>
                </div>
                <button onClick={handleCopyURL}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-slate-600 hover:text-indigo-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
                  🔗 {copied ? '✅ COPIED!' : 'COPY PLAN URL'}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleShareWhatsApp}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 text-slate-600 hover:text-emerald-600 text-[11px] font-bold py-3 rounded-2xl transition-all shadow-sm">
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
              
              {/* Sharing bar for mobile & desktop */}
              <div className="flex flex-wrap gap-2 lg:hidden">
                <button onClick={handleExportPDF} disabled={exporting !== null}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm transition">
                  {exporting === 'pdf' ? '⏳' : '📄 PDF'}
                </button>
                <button onClick={handleExportExcel} disabled={exporting !== null}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm transition">
                  {exporting === 'excel' ? '⏳' : '📊 EXCEL'}
                </button>
                <button onClick={handleCopyURL}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 text-slate-600 text-[10px] font-bold px-3 py-2.5 rounded-xl shadow-sm transition">
                  {copied ? '✅' : '🔗 COPY'}
                </button>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Final Balance', value: result.finalBalance, prefix: '₹', color: 'from-indigo-600 to-blue-700' },
                  { label: 'Total Principal', value: result.totalPrincipal, prefix: '₹', color: 'from-blue-500 to-indigo-600' },
                  { label: 'Total Interest', value: result.totalInterest, prefix: '₹', color: 'from-emerald-500 to-teal-600' },
                  { label: 'Real Value', value: result.realValue, prefix: '₹', color: 'from-amber-500 to-orange-600' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} p-5 rounded-3xl shadow-xl text-white relative overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-1">{stat.label}</p>
                    <AnimatedNumber value={stat.value} prefix={stat.prefix} className="text-xl sm:text-2xl font-black block leading-tight" />
                  </motion.div>
                ))}
              </div>
                {[
                  { label: 'Final Balance', value: result.finalBalance, prefix: '$', color: 'from-blue-600 to-indigo-700' },
                  { label: 'Total Principal', value: result.totalPrincipal, prefix: '$', color: 'from-emerald-500 to-teal-600' },
                  { label: 'Total Interest', value: result.totalInterest, prefix: '$', color: 'from-amber-500 to-orange-600' },
                  { label: 'Buying Power', value: result.realValue, prefix: '$', color: 'from-indigo-500 to-purple-600' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-lg text-white`}
                  >
                    <p className="text-[10px] uppercase font-bold opacity-80 mb-1">{stat.label}</p>
                    <AnimatedNumber value={stat.value} prefix={stat.prefix} className="text-xl sm:text-2xl font-black block" />
                  </motion.div>
                ))}
              </div>

              {/* Charts Section */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden"
              >
                <div className="flex border-b border-slate-100">
                  {[
                    { id: 'growth', label: 'Growth', icon: '📈' },
                    { id: 'breakdown', label: 'Annual', icon: '📊' },
                    { id: 'pie', label: 'Ratio', icon: '⭕' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        activeTab === tab.id 
                          ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'growth' ? (
                      <AreaChart data={result.yearlyData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis 
                          stroke={CHART_COLORS.axis} 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(v) => formatCurrency(v, true)} 
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          name="Total Balance" 
                          stroke={CHART_COLORS.primary} 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorBalance)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="totalPrincipal" 
                          name="Principal" 
                          stroke={CHART_COLORS.success} 
                          fill="transparent" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    ) : activeTab === 'breakdown' ? (
                      <BarChart data={result.yearlyData.slice(1)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis 
                          stroke={CHART_COLORS.axis} 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(v) => formatCurrency(v, true)} 
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend verticalAlign="top" height={36}/>
                        <Bar dataKey="annualInterest" name="Interest Earned" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
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
                          <Cell fill={CHART_COLORS.success} />
                          <Cell fill={CHART_COLORS.warning} />
                        </Pie>
                        <Tooltip formatter={(v: number) => formatCurrency(v)} />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.section>

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
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span>🛡️</span> Inflation Impact
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    While your nominal balance is {formatCurrency(result.finalBalance)}, its purchasing power 
                    in today's terms is {formatCurrency(result.realValue)}. This means inflation will reduce 
                    your effective wealth by <span className="font-bold text-purple-600">{Math.round((1 - result.realValue / result.finalBalance) * 100)}%</span> over time.
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
              <p className="text-sm text-slate-500">The biggest factor in compound interest isn't the amount you invest, but the time you give it to grow. Even small amounts matter over decades.</p>
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
                Compound interest is often called the "eighth wonder of the world." Unlike simple interest, which is calculated only on the principal amount, compound interest is calculated on the principal plus any interest that has already been earned.
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
          <section className="bg-slate-900 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-indigo-400 mb-2">What is the "Rule of 72"?</h4>
                <p className="text-sm text-slate-400">It's a quick way to estimate how long it takes to double your money. Divide 72 by your annual interest rate. For example, at 8% interest, your money doubles every 9 years.</p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-400 mb-2">How does inflation affect my savings?</h4>
                <p className="text-sm text-slate-400">Inflation reduces purchasing power. If you have $1 million in 30 years, but inflation was 3%, that million might only buy what $411,000 buys today.</p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-400 mb-2">Should I compound daily or monthly?</h4>
                <p className="text-sm text-slate-400">Daily compounding is slightly better for the investor, but the difference between daily and monthly compounding on a typical savings account is usually very small.</p>
              </div>
              <div>
                <h4 className="font-bold text-indigo-400 mb-2">Is the interest rate guaranteed?</h4>
                <p className="text-sm text-slate-400">In a savings account or CD, yes. In the stock market, interest rates (returns) fluctuate year to year. This calculator uses a fixed average rate for simplicity.</p>
              </div>
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
                className="flex items-center justify-between bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-emerald-100"
              >
                <span className="text-sm font-bold text-slate-900">FIRE Calculator</span>
                <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
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
