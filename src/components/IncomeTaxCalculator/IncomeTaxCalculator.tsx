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
import { CHART_COLORS } from '../../utils/chartColors';

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
          focused ? 'border-blue-400 shadow-sm ring-2 ring-blue-50' : 'border-slate-100 hover:border-slate-200'
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
  const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/20 py-8 px-4">
      <article className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Updated for FY 2025-26 (AY 2026-27)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-3 tracking-tight">
            India 2026 <span className="text-blue-600">Tax Calculator</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Compare Old vs New Tax Regimes with the latest Union Budget 2025 changes.
            Includes surcharge, slab-wise breakdown, monthly projections, and tax curve analysis.
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

        <div id="tax-calculator-content">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Inputs Section */}
            <div className="lg:col-span-4 space-y-6">
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-blue-200">1</span>
                    Income
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase ${!inputs.isSalaried ? 'text-blue-600' : 'text-slate-300'}`}>Business</span>
                    <button 
                      onClick={() => updateInputs({ isSalaried: !inputs.isSalaried })}
                      className={`w-10 h-5 rounded-full relative transition-all ${inputs.isSalaried ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${inputs.isSalaried ? 'right-1' : 'left-1'}`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase ${inputs.isSalaried ? 'text-blue-600' : 'text-slate-300'}`}>Salaried</span>
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
                  className="bg-blue-600 rounded-2xl p-5 text-white shadow-xl shadow-blue-100 relative overflow-hidden group col-span-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Recommended</p>
                  <h3 className="text-2xl sm:text-3xl font-black mb-1 capitalize">{result.recommendedRegime} Regime</h3>
                  <p className="text-xs font-bold text-blue-100">
                    Save <span className="text-white bg-blue-500 px-1.5 py-0.5 rounded ml-1">{formatCurrency(result.savings)}</span> vs {result.recommendedRegime === 'new' ? 'Old' : 'New'} Regime
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
                          ? 'bg-blue-50 text-blue-600' 
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
                        <Bar dataKey="tax" name="Tax Payable" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} barSize={40} />
                        <Bar dataKey="takeHome" name="Take Home" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} barSize={40} />
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
                        <Bar dataKey="amount" name="Taxable in Slab" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="tax" name="Tax on Slab" fill={CHART_COLORS.secondary} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    ) : activeTab === 'income-curve' ? (
                      <AreaChart data={result.incomeWiseTax} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="gradOld" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
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
                        <Area type="monotone" dataKey="oldTax" name="Old Regime Tax" stroke={CHART_COLORS.secondary} strokeWidth={2} fill="url(#gradOld)" />
                        <Area type="monotone" dataKey="newTax" name="New Regime Tax" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#gradNew)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="name" stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Bar dataKey="old" name="Old Regime" fill={CHART_COLORS.secondary} radius={[6, 6, 0, 0]} />
                        <Bar dataKey="new" name="New Regime" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.section>

              {/* Detailed Breakdown Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[result.oldRegime, result.newRegime].map((reg) => (
                  <div key={reg.regime} className={`p-6 rounded-2xl border ${reg.regime === result.recommendedRegime ? 'bg-white border-blue-100 shadow-xl shadow-blue-50' : 'bg-slate-50 border-slate-100'}`}>
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
                        <span className={reg.regime === result.recommendedRegime ? 'text-blue-600' : ''}>{formatCurrency(reg.totalTax)}</span>
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
                  <span className="bg-blue-100 text-blue-600 rounded-lg w-6 h-6 flex items-center justify-center text-[10px] font-black">📋</span>
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
                          <td className="py-2.5 text-right font-black text-blue-600">{formatCurrency(slab.tax)}</td>
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
          {/* Budget 2025 Highlights */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Key Changes in Budget 2025 (FY 2025-26)</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
                The Union Budget 2025 has introduced transformative changes to the <span className="text-blue-600 font-bold">New Tax Regime</span>, making it significantly more attractive for the middle class and salaried employees.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">💰</span> Raised Standard Deduction
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-black">Increased to ₹75,000</p>
                  <p className="text-[10px] text-slate-400 mt-1">Directly reducing taxable income for all salaried taxpayers in the New Regime.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">📊</span> Widened Tax Slabs
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">The slabs have been pushed higher, ensuring that you pay 5-10% less tax for every lakh earned between ₹4L and ₹15L.</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                The New Regime is now the <span className="text-blue-600 font-bold uppercase tracking-tight">DEFAULT</span> tax regime. If you wish to use the Old Regime to claim deductions like HRA, 80C, or Home Loan interest, you must explicitly opt-in when filing your taxes.
              </p>
            </div>
          </div>

          {/* New Tax Slabs Breakdown */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">New Tax Slabs (Budget 2025)</h2>
              <p className="text-slate-500 font-medium text-sm">Valid for FY 2025-26 (Assessment Year 2026-27). Compare the new rates against your current salary.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900 rounded-[40px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mt-32" />
              <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    ['Up to ₹4,00,000', 'No Tax', 'text-teal-400 font-black'],
                    ['₹4,00,001 - ₹8,00,000', '5%', 'text-white font-bold'],
                    ['₹8,00,001 - ₹12,00,000', '10%', 'text-white font-bold'],
                    ['₹12,00,001 - ₹16,00,000', '15%', 'text-white font-bold'],
                    ['₹16,00,001 - ₹20,00,000', '20%', 'text-white font-bold'],
                    ['₹20,00,001 - ₹24,00,000', '25%', 'text-white font-bold'],
                    ['Above ₹24,00,000', '30%', 'text-blue-400 font-black'],
                  ].map(([range, rate, colorClass]) => (
                    <div key={range} className="flex justify-between items-center border-b border-white/10 pb-2.5 last:border-0">
                      <span className="text-[11px] text-slate-300 uppercase tracking-wider font-bold">{range}</span>
                      <span className={`text-sm ${colorClass}`}>{rate}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                  <h4 className="font-bold text-blue-400 mb-3 uppercase tracking-widest text-xs">Section 87A Rebate Deep-Dive</h4>
                  <p className="text-sm text-blue-100 leading-relaxed font-medium">
                    The tax rebate under Section 87A is the hero feature of the New Regime. If your total income (including Standard Deduction) is up to <span className="text-white font-bold">₹12.75 Lakhs</span>, your total tax liability is actually <span className="text-teal-400 font-bold">ZERO</span>.
                  </p>
                  <p className="text-[11px] text-blue-300 mt-4 leading-relaxed italic">
                    Why? ₹12.75L - ₹75K (Std. Ded.) = ₹12L. The 87A rebate covers taxes for income up to ₹12L in the New Regime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Old vs New Strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Deciding Between Regimes</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                The best regime for you depends on how much you <span className="text-blue-600 font-bold">INVEST</span>. The Old Regime rewards savers, while the New Regime offers lower rates without the need to lock your money in long-term products.
              </p>
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                <h5 className="font-bold text-amber-900 mb-2">The "Magic Number" Calculation</h5>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Generally, if your total deductions (80C, 80D, HRA, etc.) exceed <span className="font-bold underline">₹3.75 - ₹4.25 Lakhs</span> (depending on your salary bracket), you should consider the <span className="font-bold">Old Regime</span>. For everyone else, the New Regime is faster, simpler, and cheaper.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 sm:p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Top Deductions (Old Regime)</h3>
              <ul className="space-y-4">
                {[
                  { label: "80C (PPF, ELSS, Insurance)", value: "₹1,50,000" },
                  { label: "Section 24 (Home Loan Interest)", value: "₹2,00,000" },
                  { label: "80D (Health Premium)", value: "Up to ₹50k" },
                  { label: "80CCD(1B) (Additional NPS)", value: "₹50,000" }
                ].map((item, i) => (
                  <li key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:border-blue-100 transition-colors">
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <span className="text-xs font-black text-blue-600">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6 pb-12" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-3xl font-black text-slate-900 text-center mb-10 tracking-tight">Income Tax FAQs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: "Can I choose my tax regime every year?",
                  a: "Yes! If you are a salaried employee without any business income, you can switch between the Old and New regime every financial year at your convenience during ITR filing."
                },
                {
                  q: "What is Surcharge and how is it calculated?",
                  a: "Surcharge is an additional tax on the 'tax amount' for high earners. It starts at 10% for income above ₹50L and goes up to 25% (under New Regime) or 37% (under Old Regime). Our calculator accurately accounts for 'Marginal Relief' so you don't pay more tax than your extra income above the threshold."
                },
                {
                  q: "Is there any tax on zero income after rebate?",
                  a: "If your income is below the rebate threshold (₹12L in New Regime), your tax becomes zero. However, you are still legally required to file an Income Tax Return (ITR) if your gross income exceeds specific limits."
                },
                {
                  q: "What about Health and Education Cess?",
                  a: "A 4% Cess is added on top of your final tax liability (after rebate and surcharge). It is mandatory for every taxpayer in India, regardless of the regime chosen."
                }
              ].map((faq, i) => (
                <div key={i} className="group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h4 className="font-bold text-slate-800 mb-3 text-lg leading-snug group-hover:text-blue-600 transition-colors flex gap-2" itemProp="name">
                    <span className="text-blue-200">Q.</span> {faq.q}
                  </h4>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm text-slate-500 leading-relaxed font-medium pl-6 border-l-2 border-slate-100 group-hover:border-blue-100 transition-colors" itemProp="text">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
            <h2 className="text-3xl font-black text-slate-900 mb-5 tracking-tight">Tax Planning Framework Beyond Regime Selection</h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                Choosing Old versus New Regime is only the first layer of tax planning. The stronger approach is to optimize cash flow, compliance, and long-term wealth simultaneously.
                In many cases, people over-focus on deduction hunting and under-focus on avoidable penalties, timing of declarations, and documentation quality.
              </p>
              <p>
                Begin with your gross income map: salary components, variable pay, interest income, capital gains, and side income.
                Then classify each stream by tax treatment and filing requirements. This prevents year-end surprises and helps you estimate advance tax needs accurately,
                especially if you have freelance income or significant non-salary earnings.
              </p>
              <p>
                Under the Old Regime, deduction planning should align with real financial goals rather than tax-saving products alone.
                For example, 80C can include EPF, ELSS, and principal repayment—but your allocation should match liquidity needs and risk appetite.
                Tax benefit is valuable, but poor product fit can hurt long-term outcomes.
              </p>
              <p>
                Under the New Regime, simplicity is the key advantage. Lower slab rates and standard deduction reduce complexity, making it easier to plan monthly cash flow.
                This can be especially useful for younger earners and professionals who prefer flexible investing over locked-in instruments.
                However, you should still evaluate annual break-even points if your deduction profile changes.
              </p>
              <p>
                Finally, keep robust records: rent receipts, insurance proofs, donation receipts, and investment statements.
                Good documentation reduces filing errors and supports you during notices or verification requests.
                Use this calculator as your scenario engine, then review with a qualified tax professional if you have business income, capital gains, or cross-border tax exposure.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default IncomeTaxCalculator;
