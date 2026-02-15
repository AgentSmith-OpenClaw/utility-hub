import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
  AreaChart,
  Area,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useIncomeTax } from '../../hooks/useIncomeTax';
import { formatCurrency } from './IncomeTaxCalculator.utils';
import { exportToPDF } from '../../utils/pdf';
import { exportIncomeTaxToExcel } from '../../utils/excel';

const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#3b82f6',
  accent: '#06b6d4',
  teal: '#14b8a6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  grid: '#f1f5f9',
  axis: '#94a3b8',
};

// --- Shared Sub-components ---

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
}> = ({ label, value, onChange, min, max, step, prefix, suffix, tooltip }) => {
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value.toLocaleString('en-IN'));

  useEffect(() => {
    if (!focused) setDisplayValue(value.toLocaleString('en-IN'));
  }, [value, focused]);

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-600 flex items-center">
          {label}
          {tooltip && <HelpTooltip text={tooltip} />}
        </label>
        <div className={`flex items-center bg-white rounded-xl border px-2.5 py-1.5 transition-all ${
          focused ? 'border-indigo-400 shadow-sm ring-2 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'
        }`}>
          {prefix && <span className="text-xs font-bold text-slate-400 mr-1">{prefix}</span>}
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
            className="w-24 text-right text-xs font-black text-slate-900 bg-transparent outline-none"
          />
          {suffix && <span className="text-xs font-bold text-slate-400 ml-1">{suffix}</span>}
        </div>
      </div>
    </div>
  );
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
      <p className="text-xs font-bold text-slate-900 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-[10px] mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

// --- Main Component ---

const IncomeTaxCalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useIncomeTax();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'regime' | 'breakdown' | 'slabs' | 'income-curve' | 'monthly'>('regime');
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      await exportToPDF('tax-calculator-content', 'India_2026_Tax_Report.pdf', {
        title: 'India 2026 Tax Analysis',
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
      await exportIncomeTaxToExcel(inputs, result, 'India_2026_Tax_Report.xlsx');
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
    const regime = result.recommendedRegime === 'new' ? 'New' : 'Old';
    const text = `My India 2026 Tax: ${formatCurrency(result[result.recommendedRegime === 'new' ? 'newRegime' : 'oldRegime'].totalTax)} under ${regime} Regime. Saving ${formatCurrency(result.savings)}! Calculate yours: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [result]);

  const handleShareTwitter = useCallback(() => {
    const regime = result.recommendedRegime === 'new' ? 'New' : 'Old';
    const text = `My India 2026 Tax: ${formatCurrency(result[result.recommendedRegime === 'new' ? 'newRegime' : 'oldRegime'].totalTax)} under ${regime} Regime. Calculate yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [result]);

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  const currentRegime = result.recommendedRegime === 'new' ? result.newRegime : result.oldRegime;

  // Chart Data Preparation
  const regimeCompareData = [
    { name: 'Old Regime', tax: result.oldRegime.totalTax, takeHome: result.oldRegime.takeHomeIncome },
    { name: 'New Regime', tax: result.newRegime.totalTax, takeHome: result.newRegime.takeHomeIncome },
  ];

  const incomeBreakdownPie = [
    { name: 'Take Home', value: currentRegime.takeHomeIncome },
    { name: 'Tax + Cess', value: currentRegime.totalTax - currentRegime.surcharge },
    ...(currentRegime.surcharge > 0 ? [{ name: 'Surcharge', value: currentRegime.surcharge }] : []),
  ];
  const PIE_COLORS = [CHART_COLORS.teal, CHART_COLORS.rose, CHART_COLORS.amber];

  const slabChartData = currentRegime.slabBreakdown.filter(s => s.taxableAmount > 0).map(s => ({
    name: s.range,
    amount: s.taxableAmount,
    tax: s.tax,
    rate: s.rate,
  }));

  const monthlyData = [
    { name: 'Gross Salary', old: Math.round(result.oldRegime.grossIncome / 12), new: Math.round(result.newRegime.grossIncome / 12) },
    { name: 'Deductions', old: Math.round(result.oldRegime.totalDeductions / 12), new: Math.round(result.newRegime.totalDeductions / 12) },
    { name: 'Tax', old: result.oldRegime.monthlyTax, new: result.newRegime.monthlyTax },
    { name: 'Take Home', old: result.oldRegime.monthlyTakeHome, new: result.newRegime.monthlyTakeHome },
  ];

  const tabs = [
    { id: 'regime', label: 'Old vs New', icon: '⚖️' },
    { id: 'breakdown', label: 'Breakdown', icon: '🍩' },
    { id: 'slabs', label: 'Slab-wise', icon: '📊' },
    { id: 'income-curve', label: 'Tax Curve', icon: '📈' },
    { id: 'monthly', label: 'Monthly', icon: '📅' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8 px-4">
      <article className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            Updated for FY 2025-26 (AY 2026-27)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-3 tracking-tight">
            India 2026 <span className="text-indigo-600">Tax Calculator</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Compare Old vs New Tax Regimes with the latest Union Budget 2025 changes.
            Includes surcharge, slab-wise breakdown, monthly projections, and tax curve analysis.
          </p>
        </header>

        <div id="tax-calculator-content">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Inputs Section */}
            <div className="lg:col-span-4 space-y-6">
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-200">1</span>
                    Income
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase ${!inputs.isSalaried ? 'text-indigo-600' : 'text-slate-300'}`}>Business</span>
                    <button 
                      onClick={() => updateInputs({ isSalaried: !inputs.isSalaried })}
                      className={`w-10 h-5 rounded-full relative transition-all ${inputs.isSalaried ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${inputs.isSalaried ? 'right-1' : 'left-1'}`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase ${inputs.isSalaried ? 'text-indigo-600' : 'text-slate-300'}`}>Salaried</span>
                  </div>
                </div>

                <InputField
                  label="Annual Salary"
                  value={inputs.annualSalary}
                  onChange={(v) => updateInputs({ annualSalary: v })}
                  min={0} max={100000000} step={10000} prefix="₹"
                  tooltip="Total gross salary before any deductions."
                />
                <InputField
                  label="Interest Income"
                  value={inputs.interestIncome}
                  onChange={(v) => updateInputs({ interestIncome: v })}
                  min={0} max={10000000} step={5000} prefix="₹"
                  tooltip="Income from savings, FDs, bonds, etc."
                />
                <InputField
                  label="Rental Income"
                  value={inputs.rentalIncome}
                  onChange={(v) => updateInputs({ rentalIncome: v })}
                  min={0} max={10000000} step={5000} prefix="₹"
                  tooltip="Net rental income from property."
                />
                <InputField
                  label="Other Income"
                  value={inputs.otherIncome}
                  onChange={(v) => updateInputs({ otherIncome: v })}
                  min={0} max={10000000} step={5000} prefix="₹"
                  tooltip="Capital gains, freelance income, etc."
                />

                <div className="h-px bg-slate-50 my-8" />

                <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                  <span className="bg-teal-500 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-teal-100">2</span>
                  Deductions <span className="text-[10px] font-bold text-slate-400 ml-1">(Old Regime)</span>
                </h2>

                <InputField
                  label="Section 80C"
                  value={inputs.section80C}
                  onChange={(v) => updateInputs({ section80C: v })}
                  min={0} max={150000} step={5000} prefix="₹"
                  tooltip="PPF, ELSS, LIC, EPF, etc. (Max ₹1.5L)"
                />
                <InputField
                  label="Section 80D"
                  value={inputs.section80D}
                  onChange={(v) => updateInputs({ section80D: v })}
                  min={0} max={100000} step={1000} prefix="₹"
                  tooltip="Health Insurance Premium for self + parents."
                />
                <InputField
                  label="NPS (80CCD 1B)"
                  value={inputs.nps80CCD1B}
                  onChange={(v) => updateInputs({ nps80CCD1B: v })}
                  min={0} max={50000} step={5000} prefix="₹"
                  tooltip="Additional NPS deduction over 80C limit (Max ₹50K)"
                />
                <InputField
                  label="HRA Exemption"
                  value={inputs.hraExemption}
                  onChange={(v) => updateInputs({ hraExemption: v })}
                  min={0} max={2000000} step={5000} prefix="₹"
                  tooltip="Exempt portion of House Rent Allowance."
                />
                <InputField
                  label="Home Loan Int (24b)"
                  value={inputs.homeLoanInterest24b}
                  onChange={(v) => updateInputs({ homeLoanInterest24b: v })}
                  min={0} max={200000} step={5000} prefix="₹"
                  tooltip="Interest on Home Loan (Max ₹2L for self-occupied)"
                />
                <InputField
                  label="Other Deductions"
                  value={inputs.otherDeductions}
                  onChange={(v) => updateInputs({ otherDeductions: v })}
                  min={0} max={500000} step={5000} prefix="₹"
                  tooltip="80G donations, 80E education loan, etc."
                />

                <button
                  onClick={reset}
                  className="w-full mt-8 py-3 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100"
                >
                  ↺ Reset All Inputs
                </button>
              </motion.section>

              {/* Share/Export Bar (Desktop) */}
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

            {/* Results Section */}
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

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group col-span-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Recommended</p>
                  <h3 className="text-2xl sm:text-3xl font-black mb-1 capitalize">{result.recommendedRegime} Regime</h3>
                  <p className="text-xs font-bold text-indigo-100">
                    Save <span className="text-white bg-indigo-500 px-1.5 py-0.5 rounded ml-1">{formatCurrency(result.savings)}</span> vs {result.recommendedRegime === 'new' ? 'Old' : 'New'} Regime
                  </p>
                </motion.div>

                {[
                  { label: 'Total Tax', value: currentRegime.totalTax, color: 'from-rose-500 to-rose-600' },
                  { label: 'Take Home', value: currentRegime.takeHomeIncome, color: 'from-teal-500 to-cyan-600' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} p-5 rounded-2xl shadow-xl text-white relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-1">{stat.label}</p>
                    <AnimatedNumber value={stat.value} prefix="₹" className="text-xl sm:text-2xl font-black block leading-tight" />
                  </motion.div>
                ))}
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Effective Rate', value: `${currentRegime.effectiveRate.toFixed(1)}%`, sub: 'of gross income' },
                  { label: 'Marginal Rate', value: `${currentRegime.marginalRate}%`, sub: 'highest slab' },
                  { label: 'Monthly Tax', value: formatCurrency(currentRegime.monthlyTax), sub: 'per month' },
                  { label: 'Monthly In-hand', value: formatCurrency(currentRegime.monthlyTakeHome), sub: 'per month' },
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                    <p className="text-lg font-black text-slate-900">{m.value}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Charts Section - 5 Tabs */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
              >
                <div className="flex border-b border-slate-50 p-2 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all rounded-xl ${
                        activeTab === tab.id 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'regime' ? (
                      <BarChart data={regimeCompareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="name" stroke={CHART_COLORS.axis} fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Bar dataKey="tax" name="Tax Payable" fill={CHART_COLORS.rose} radius={[8, 8, 0, 0]} barSize={40} />
                        <Bar dataKey="takeHome" name="Take Home" fill={CHART_COLORS.teal} radius={[8, 8, 0, 0]} barSize={40} />
                      </BarChart>
                    ) : activeTab === 'breakdown' ? (
                      <PieChart>
                        <Pie
                          data={incomeBreakdownPie}
                          cx="50%" cy="50%"
                          innerRadius={80} outerRadius={120}
                          paddingAngle={5} dataKey="value"
                        >
                          {incomeBreakdownPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                        </Pie>
                        <Tooltip formatter={(v: any) => formatCurrency(v)} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    ) : activeTab === 'slabs' ? (
                      <BarChart data={slabChartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="name" stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Bar dataKey="amount" name="Taxable in Slab" fill={CHART_COLORS.secondary} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="tax" name="Tax on Slab" fill={CHART_COLORS.rose} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    ) : activeTab === 'income-curve' ? (
                      <AreaChart data={result.incomeWiseTax} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="gradOld" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.amber} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={CHART_COLORS.amber} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="income" stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Area type="monotone" dataKey="oldTax" name="Old Regime Tax" stroke={CHART_COLORS.amber} strokeWidth={2} fill="url(#gradOld)" />
                        <Area type="monotone" dataKey="newTax" name="New Regime Tax" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#gradNew)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="name" stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Bar dataKey="old" name="Old Regime" fill={CHART_COLORS.amber} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="new" name="New Regime" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.section>

              {/* Detailed Breakdown Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[result.oldRegime, result.newRegime].map((reg) => (
                  <div key={reg.regime} className={`p-6 rounded-2xl border ${reg.regime === result.recommendedRegime ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-50' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">{reg.regime} Regime</h4>
                      {reg.regime === result.recommendedRegime && <span className="bg-teal-100 text-teal-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Optimal</span>}
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Gross Income', value: formatCurrency(reg.grossIncome), color: 'text-slate-900' },
                        { label: 'Total Deductions', value: `-${formatCurrency(reg.totalDeductions)}`, color: 'text-teal-600' },
                        { label: 'Taxable Income', value: formatCurrency(reg.taxableIncome), color: 'text-slate-900' },
                        { label: 'Tax on Slabs', value: formatCurrency(reg.taxBeforeCess - reg.surcharge + reg.rebate87A), color: 'text-slate-900' },
                        { label: '87A Rebate', value: `-${formatCurrency(reg.rebate87A)}`, color: 'text-teal-600' },
                        ...(reg.surcharge > 0 ? [{ label: 'Surcharge', value: formatCurrency(reg.surcharge), color: 'text-amber-600' }] : []),
                        { label: '4% Cess', value: formatCurrency(reg.cess), color: 'text-slate-900' },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-xs font-bold text-slate-500">
                          <span>{row.label}</span>
                          <span className={row.color}>{row.value}</span>
                        </div>
                      ))}
                      <div className="h-px bg-slate-200/50" />
                      <div className="flex justify-between text-sm font-black text-slate-900">
                        <span>Net Tax</span>
                        <span className={reg.regime === result.recommendedRegime ? 'text-indigo-600' : ''}>{formatCurrency(reg.totalTax)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>Effective Rate</span>
                        <span>{reg.effectiveRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>Monthly In-hand</span>
                        <span className="text-teal-600">{formatCurrency(reg.monthlyTakeHome)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slab-wise Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black">📋</span>
                  Slab-wise Tax Breakdown ({result.recommendedRegime === 'new' ? 'New' : 'Old'} Regime)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Slab</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Rate</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Taxable</th>
                        <th className="text-right py-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRegime.slabBreakdown.map((slab) => (
                        <tr key={slab.range} className={`border-b border-slate-50 ${slab.taxableAmount > 0 ? '' : 'opacity-40'}`}>
                          <td className="py-2.5 font-bold text-slate-700">{slab.range}</td>
                          <td className="py-2.5 text-right font-bold text-slate-500">{slab.rate}%</td>
                          <td className="py-2.5 text-right font-bold text-slate-700">{formatCurrency(slab.taxableAmount)}</td>
                          <td className="py-2.5 text-right font-black text-indigo-600">{formatCurrency(slab.tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <section className="mt-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">New Regime Defaults</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">The New Tax Regime is now the default. It offers higher standard deductions of ₹75,000 and zero tax for income up to ₹12.75 Lakh (including rebate).</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">Old Regime Benefits</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Choose the Old Regime only if your total deductions (80C, HRA, Home Loan) exceed a threshold. Typically beneficial for high-deduction households.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">Surcharge Rules</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Surcharge applies on incomes above ₹50L: 10% (50L-1Cr), 15% (1-2Cr), 25% (2-5Cr), 37% (above 5Cr). This is on top of tax, before cess.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-xl relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-50 -mr-32 -mb-32" />
             <h2 className="text-3xl font-black mb-8 tracking-tight text-slate-900">Understanding FY 2025-26 Tax Slabs</h2>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="space-y-6">
                 <h4 className="text-indigo-600 font-black uppercase tracking-widest text-[10px]">New Tax Regime (FY 25-26)</h4>
                 <div className="space-y-3">
                   {[
                     ['Up to ₹4 Lakh', 'Nil'],
                     ['₹4 - ₹8 Lakh', '5%'],
                     ['₹8 - ₹12 Lakh', '10%'],
                     ['₹12 - ₹16 Lakh', '15%'],
                     ['₹16 - ₹20 Lakh', '20%'],
                     ['₹20 - ₹24 Lakh', '25%'],
                     ['Above ₹24 Lakh', '30%'],
                   ].map(([range, rate]) => (
                     <div key={range} className="flex justify-between border-b border-slate-50 pb-2 text-sm font-bold">
                       <span className="text-slate-500">{range}</span>
                       <span className="text-slate-900">{rate}</span>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="space-y-6">
                 <h4 className="text-teal-600 font-black uppercase tracking-widest text-[10px]">Strategic Takeaway</h4>
                 <p className="text-slate-600 text-sm leading-relaxed font-medium">
                   The Union Budget 2025 has significantly widened the tax slabs in the New Regime. The basic exemption limit is now ₹4 Lakh. 
                   For most salaried individuals earning up to ₹15-20 Lakh with moderate investments, the New Regime is likely to result in lower tax outgo compared to the Old Regime.
                 </p>
                 <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50">
                   <p className="text-xs font-bold text-indigo-900 mb-2">Did you know?</p>
                   <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">The Standard Deduction has been increased from ₹50,000 to ₹75,000 for salaried employees under the New Tax Regime, providing an additional relief of ₹25,000 in taxable income.</p>
                 </div>
               </div>
             </div>
          </div>

          {/* FAQ */}
          <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[100px] -ml-32 -mt-32" />
            <h2 className="text-3xl font-black mb-10 tracking-tight text-slate-900 relative z-10">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
              {[
                { q: "What is Surcharge?", a: "Surcharge is an additional tax levied on taxpayers with very high incomes (above ₹50 Lakh). It's calculated as a percentage of total income tax, ranging from 10% to 37%." },
                { q: "When should I choose Old Regime?", a: "Old Regime is beneficial if your total deductions (80C, 80D, HRA, Home Loan) exceed ₹3-4 Lakh. For most salaried individuals with moderate deductions, the New Regime is better." },
                { q: "What is the 87A Rebate?", a: "Under the New Regime, if your taxable income is ≤₹12 Lakh, you get a rebate up to ₹60,000. This effectively makes income up to ₹12.75L tax-free (with ₹75K standard deduction)." },
                { q: "Is NPS deduction available in New Regime?", a: "The 80CCD(1B) deduction of ₹50,000 for NPS is only available in the Old Regime. However, employer's NPS contribution (up to 14%) is deductible in both regimes." },
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
        </section>
      </article>
    </div>
  );
};

export default IncomeTaxCalculator;
