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
import { generatePDFReport, fmtCurrency as pdfFmtCurrency, fmtPercent, type PDFReportConfig } from '../../utils/pdf';
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
      const fmt = (v: number) => pdfFmtCurrency(v, 'INR');
      const recommended = result.recommendedRegime === 'new' ? result.newRegime : result.oldRegime;
      const other = result.recommendedRegime === 'new' ? result.oldRegime : result.newRegime;
      const config: PDFReportConfig = {
        title: 'India Income Tax Report (2025-26)',
        subtitle: 'Old vs New Regime Comparison',
        filename: 'India_2026_Tax_Report.pdf',
        sections: [
          {
            type: 'inputs',
            title: 'Income Details',
            inputs: [
              { label: 'Annual Salary', value: fmt(inputs.annualSalary) },
              { label: 'Interest Income', value: fmt(inputs.interestIncome) },
              { label: 'Rental Income', value: fmt(inputs.rentalIncome) },
              { label: 'Other Income', value: fmt(inputs.otherIncome) },
              { label: 'Salaried Employee', value: inputs.isSalaried ? 'Yes' : 'No' },
              { label: 'Section 80C', value: fmt(inputs.section80C) },
              { label: 'Section 80D', value: fmt(inputs.section80D) },
              { label: 'NPS (80CCD 1B)', value: fmt(inputs.nps80CCD1B) },
              { label: 'HRA Exemption', value: fmt(inputs.hraExemption) },
              { label: 'Home Loan Interest', value: fmt(inputs.homeLoanInterest24b) },
            ],
          },
          {
            type: 'metrics',
            title: 'Tax Summary',
            metrics: [
              { label: `${result.recommendedRegime === 'new' ? 'New' : 'Old'} Regime Tax`, value: fmt(recommended.totalTax), subtitle: `Effective: ${recommended.effectiveRate.toFixed(1)}%` },
              { label: `${result.recommendedRegime === 'new' ? 'Old' : 'New'} Regime Tax`, value: fmt(other.totalTax), subtitle: `Effective: ${other.effectiveRate.toFixed(1)}%` },
              { label: 'Tax Savings', value: fmt(result.savings), subtitle: `${result.recommendedRegime === 'new' ? 'New' : 'Old'} Regime is better` },
              { label: 'Monthly In-hand', value: fmt(recommended.monthlyTakeHome), subtitle: `${fmt(recommended.takeHomeIncome)}/year` },
            ],
          },
          {
            type: 'message',
            message: {
              heading: `✅ ${result.recommendedRegime === 'new' ? 'New' : 'Old'} Regime Recommended`,
              text: `You save ${fmt(result.savings)} by choosing the ${result.recommendedRegime === 'new' ? 'New' : 'Old'} Tax Regime. Your effective tax rate is ${recommended.effectiveRate.toFixed(1)}% with a monthly take-home of ${fmt(recommended.monthlyTakeHome)}.`,
            },
          },
          {
            type: 'charts',
            title: 'Visual Analysis',
            charts: [
              { title: 'Tax Regime Comparison', elementId: 'tax-chart-main' },
            ],
          },
          {
            type: 'table',
            title: 'Detailed Tax Breakdown',
            table: {
              title: 'Old vs New Regime Comparison',
              columns: [
                { header: 'Metric', key: 'metric', align: 'left' },
                { header: 'Old Regime', key: 'old', align: 'right' },
                { header: 'New Regime', key: 'new', align: 'right' },
              ],
              rows: [
                { metric: 'Gross Income', old: fmt(result.oldRegime.grossIncome), new: fmt(result.newRegime.grossIncome) },
                { metric: 'Total Deductions', old: fmt(result.oldRegime.totalDeductions), new: fmt(result.newRegime.totalDeductions) },
                { metric: 'Taxable Income', old: fmt(result.oldRegime.taxableIncome), new: fmt(result.newRegime.taxableIncome) },
                { metric: 'Tax Before Cess', old: fmt(result.oldRegime.taxBeforeCess), new: fmt(result.newRegime.taxBeforeCess) },
                { metric: '87A Rebate', old: fmt(result.oldRegime.rebate87A), new: fmt(result.newRegime.rebate87A) },
                { metric: 'Surcharge', old: fmt(result.oldRegime.surcharge), new: fmt(result.newRegime.surcharge) },
                { metric: '4% Cess', old: fmt(result.oldRegime.cess), new: fmt(result.newRegime.cess) },
                { metric: 'Total Tax', old: fmt(result.oldRegime.totalTax), new: fmt(result.newRegime.totalTax) },
                { metric: 'Take Home', old: fmt(result.oldRegime.takeHomeIncome), new: fmt(result.newRegime.takeHomeIncome) },
                { metric: 'Effective Rate', old: `${result.oldRegime.effectiveRate.toFixed(1)}%`, new: `${result.newRegime.effectiveRate.toFixed(1)}%` },
                { metric: 'Monthly Tax', old: fmt(result.oldRegime.monthlyTax), new: fmt(result.newRegime.monthlyTax) },
                { metric: 'Monthly In-hand', old: fmt(result.oldRegime.monthlyTakeHome), new: fmt(result.newRegime.monthlyTakeHome) },
              ],
            },
          },
          {
            type: 'table',
            title: 'Slab-wise Tax Breakdown',
            table: {
              title: `${result.recommendedRegime === 'new' ? 'New' : 'Old'} Regime Slabs`,
              columns: [
                { header: 'Slab', key: 'slab', align: 'left' },
                { header: 'Rate', key: 'rate', align: 'right' },
                { header: 'Taxable Amount', key: 'amount', align: 'right' },
                { header: 'Tax', key: 'tax', align: 'right' },
              ],
              rows: recommended.slabBreakdown.map(s => ({
                slab: s.range,
                rate: `${s.rate}%`,
                amount: fmt(s.taxableAmount),
                tax: fmt(s.tax),
              })),
            },
          },
        ],
      };
      await generatePDFReport(config);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [inputs, result]);

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

        {/* Export + Share bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button onClick={handleExportPDF} disabled={exporting !== null} className="flex items-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
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


            </div>

            {/* Results Section */}
            <div className="lg:col-span-8 space-y-6">
              


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

                <div id="tax-chart-main" className="p-6 h-[400px]">
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

        {/* --- Educational Content & SEO Section --- */}
        <section className="mt-16 space-y-16">
          {/* Hero Content Block */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm relative overflow-hidden prose prose-slate max-w-none">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight not-prose">Mastering Your Income Tax in India (FY 2025-26)</h2>
            <p className="lead text-xl text-slate-600 font-medium">
              Tax planning isn't just about saving money; it's about optimizing your entire financial life. 
              The Union Budget 2025 has fundamentally shifted the landscape by making the <strong>New Tax Regime</strong> the default and most attractive option for the vast majority of taxpayers.
            </p>
            <p>
              Whether you're a fresh graduate earning your first paycheck or a seasoned professional with a complex portfolio, understanding the nuances of the <strong>Income Tax Act</strong> is crucial. 
              This comprehensive guide breaks down everything from the latest slab rates to hidden deductions, helping you legally reduce your tax liability to the absolute minimum.
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Old vs. New Regime: The Ultimate Showdown</h3>
            <p>
              The biggest question every Indian taxpayer faces is: <em>"Which regime should I choose?"</em>
              The answer isn't as simple as it used to be. The government is actively pushing the New Regime by sweetening the deal with lower rates and a higher rebate limit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 not-prose">
              <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
                <h4 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <span>🚀</span> New Tax Regime (Default)
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-indigo-800 text-sm">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Lower Tax Rates:</strong> Significantly reduced slab rates compared to the Old Regime.</span>
                  </li>
                  <li className="flex gap-3 text-indigo-800 text-sm">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Higher Rebate:</strong> No tax up to ₹12 Lakhs income (u/s 87A).</span>
                  </li>
                  <li className="flex gap-3 text-indigo-800 text-sm">
                    <span className="text-indigo-500 font-bold">✓</span>
                    <span><strong>Simplicity:</strong> No need to track receipts, rent agreements, or investment proofs.</span>
                  </li>
                  <li className="flex gap-3 text-indigo-800 text-sm">
                    <span className="text-rose-500 font-bold">✗</span>
                    <span><strong>No Deductions:</strong> You lose HRA, LTA, 80C, 80D, and Home Loan Interest benefits.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
                <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <span>🛡️</span> Old Tax Regime
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-amber-800 text-sm">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span><strong>Deduction Heavy:</strong> Claim HRA, 80C, 80D, Home Loan Interest, and more.</span>
                  </li>
                  <li className="flex gap-3 text-amber-800 text-sm">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span><strong>Ideal for High Commitments:</strong> Best if you already have high rent, home loans, and insurance.</span>
                  </li>
                  <li className="flex gap-3 text-amber-800 text-sm">
                    <span className="text-rose-600 font-bold">✗</span>
                    <span><strong>Higher Rates:</strong> The tax slabs are steeper (e.g., 30% kicks in at ₹10L).</span>
                  </li>
                  <li className="flex gap-3 text-amber-800 text-sm">
                    <span className="text-rose-600 font-bold">✗</span>
                    <span><strong>Complex Compliance:</strong> Requires meticulous documentation and proof submission.</span>
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Decoding the Deductions (Old Regime Only)</h3>
            <p>
              If you opt for the Old Regime, your goal is to maximize "Chapter VI-A" deductions to lower your taxable income. Here are the heavy hitters:
            </p>

            <h4 className="font-bold text-slate-800 mt-6">1. Section 80C (Limit: ₹1.5 Lakhs)</h4>
            <p>This is the most popular bucket. It includes:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li><strong>EPF (Employee Provident Fund):</strong> Your mandatory salary contribution.</li>
              <li><strong>PPF (Public Provident Fund):</strong> A safe, government-backed 15-year scheme.</li>
              <li><strong>ELSS (Equity Linked Savings Scheme):</strong> Tax-saving mutual funds (3-year lock-in).</li>
              <li><strong>LIC Premiums:</strong> Life insurance policies.</li>
              <li><strong>Principal Repayment:</strong> On your home loan.</li>
              <li><strong>Tuition Fees:</strong> For up to two children.</li>
            </ul>

            <h4 className="font-bold text-slate-800 mt-6">2. Section 80D (Health Insurance)</h4>
            <p>Don't ignore health insurance. Apart from protecting your health, it saves tax:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li><strong>Self & Family:</strong> Up to ₹25,000 (₹50,000 if senior citizens).</li>
              <li><strong>Parents:</strong> Additional up to ₹25,000 (₹50,000 if senior citizens).</li>
              <li><strong>Preventive Checkup:</strong> Up to ₹5,000 within the overall limit.</li>
            </ul>

            <h4 className="font-bold text-slate-800 mt-6">3. Section 24(b) (Home Loan Interest)</h4>
            <p>
              Homeowners can claim up to <strong>₹2 Lakhs</strong> per year on the interest component of their home loan EMI. 
              Note: If the property is rented out, there is no upper limit on the interest deduction (though loss set-off is capped at ₹2L).
            </p>

            <h4 className="font-bold text-slate-800 mt-6">4. HRA (House Rent Allowance)</h4>
            <p>
              Salaried employees living in rented accommodation can claim HRA exemption. The exemption is the <strong>lowest</strong> of:
            </p>
            <ol className="list-decimal pl-6 space-y-1 text-slate-600">
              <li>Actual HRA received.</li>
              <li>Actual rent paid minus 10% of Basic Salary + DA.</li>
              <li>50% of Basic + DA (Metros) or 40% (Non-Metros).</li>
            </ol>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Income Tax Slabs for FY 2025-26 (AY 2026-27)</h3>
            <p>
              The slab rates determine how much tax you pay on each portion of your income. The New Regime slabs are significantly wider than the Old Regime.
            </p>

            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm text-left text-slate-600 border border-slate-200 rounded-lg">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-3 border-b">Income Range</th>
                    <th className="px-6 py-3 border-b">New Regime Rate</th>
                    <th className="px-6 py-3 border-b">Old Regime Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Up to ₹3,00,000</td>
                    <td className="px-6 py-4 text-teal-600 font-bold">Nil</td>
                    <td className="px-6 py-4 text-teal-600 font-bold">Nil</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">₹3L - ₹4L</td>
                    <td className="px-6 py-4 text-teal-600 font-bold">Nil</td>
                    <td className="px-6 py-4">5% (above ₹2.5L)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">₹4L - ₹5L</td>
                    <td className="px-6 py-4">5%</td>
                    <td className="px-6 py-4">5%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">₹5L - ₹8L</td>
                    <td className="px-6 py-4">5%</td>
                    <td className="px-6 py-4">20%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">₹8L - ₹10L</td>
                    <td className="px-6 py-4">10%</td>
                    <td className="px-6 py-4">20%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">₹10L - ₹12L</td>
                    <td className="px-6 py-4">10%</td>
                    <td className="px-6 py-4 text-rose-600 font-bold">30%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-medium">₹12L - ₹15L</td>
                    <td className="px-6 py-4">15%</td>
                    <td className="px-6 py-4 text-rose-600 font-bold">30%</td>
                  </tr>
                   <tr className="border-b">
                    <td className="px-6 py-4 font-medium">Above ₹15L</td>
                    <td className="px-6 py-4">20-30%</td>
                    <td className="px-6 py-4 text-rose-600 font-bold">30%</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-slate-500 mt-2 italic">* Note: Old Regime slabs are for individuals &lt;60 years. Senior citizens have higher basic exemption limits.</p>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Frequently Asked Questions (FAQ)</h3>
            <div className="not-prose space-y-4">
              <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                  <span>Is interest from Savings Account taxable?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  <p>Yes, interest from savings accounts is fully taxable under "Income from Other Sources". However, under the Old Regime, Section 80TTA allows a deduction of up to ₹10,000 (₹50,000 for senior citizens u/s 80TTB) on such interest.</p>
                </div>
              </details>
              <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                  <span>How is Surcharge calculated?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  <p>Surcharge is a tax on tax. It applies if your total income exceeds ₹50 Lakhs. The rates range from 10% to 25% (New Regime) or 37% (Old Regime). Marginal relief ensures that the surcharge doesn't exceed the income earned above the threshold.</p>
                </div>
              </details>
              <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                  <span>Can I switch back to the Old Regime?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  <p>Salaried individuals can choose between regimes every year. However, if you have business or professional income, once you opt for the New Regime, you can only switch back to the Old Regime <strong>once</strong> in your lifetime.</p>
                </div>
              </details>
               <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                  <span>What is the Standard Deduction?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  <p>A flat deduction of ₹50,000 (Old Regime) or ₹75,000 (New Regime) is available to all salaried employees and pensioners. You don't need to submit any proofs to claim this; it's automatically applied.</p>
                </div>
              </details>
            </div>
          </div>
          
           {/* JSON-LD Schema for FAQ */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is interest from Savings Account taxable?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, interest from savings accounts is fully taxable. However, under the Old Regime, Section 80TTA allows a deduction of up to ₹10,000."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is Surcharge calculated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Surcharge is a tax on tax for income above ₹50 Lakhs. Rates range from 10% to 37% depending on income level and regime."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I switch back to the Old Regime?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Salaried individuals can switch every year. Business owners can only switch back once in a lifetime after opting for the New Regime."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the Standard Deduction?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It is a flat deduction of ₹50,000 (Old) or ₹75,000 (New) available to all salaried employees without needing proofs."
                  }
                }
              ]
            })}} />
        </section>
      </article>
    </div>
  );
};

export default IncomeTaxCalculator;
