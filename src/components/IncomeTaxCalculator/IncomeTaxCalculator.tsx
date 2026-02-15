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
} from 'recharts';
import { useIncomeTax } from '../../hooks/useIncomeTax';
import { 
  formatCurrency 
} from './IncomeTaxCalculator.utils';
import { 
  IncomeTaxInputs, 
  TaxRegime 
} from './IncomeTaxCalculator.types';
import { exportToPDF } from '../../utils/pdf';
import Link from 'next/link';

// --- Shared Constants ---
const CHART_COLORS = {
  primary: '#6366f1',    // indigo-500
  secondary: '#3b82f6',  // blue-500
  accent: '#06b6d4',     // cyan-500
  teal: '#14b8a6',       // teal-500
  amber: '#f59e0b',      // amber-500
  rose: '#f43f5e',       // rose-500
  grid: '#f1f5f9',       // slate-100
  axis: '#94a3b8',       // slate-400
};

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
      const eased = t < 1 ? 1 - Math.pow(1 - t, 4) : 1;
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
}> = ({ label, value, onChange, min, max, step, prefix = '', suffix = '', tooltip }) => {
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

// --- Main Component ---

const IncomeTaxCalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useIncomeTax();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'regime' | 'breakdown'>('regime');
  const [exporting, setExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleExportPDF = useCallback(async () => {
    setExporting(true);
    try {
      await exportToPDF('tax-calculator-content', 'Income_Tax_Report_2526.pdf', {
        title: 'Income Tax Analysis FY 2025-26',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  }, []);

  const handleCopyURL = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-slate-50" />;

  const chartData = [
    { name: 'Old Regime', tax: result.oldRegime.totalTax, takeHome: result.oldRegime.takeHomeIncome },
    { name: 'New Regime', tax: result.newRegime.totalTax, takeHome: result.newRegime.takeHomeIncome },
  ];

  const currentRegime = result.recommendedRegime === 'new' ? result.newRegime : result.oldRegime;

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
            Income Tax <span className="text-indigo-600">Calculator</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base font-medium">
            Compare Old vs New Tax Regimes with the latest 2025 Budget changes. 
            Optimize your savings with real-time tax projections.
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
                  min={0}
                  max={100000000}
                  step={10000}
                  prefix="₹"
                  tooltip="Total gross salary before any deductions."
                />

                <InputField
                  label="Other Income"
                  value={inputs.otherIncome + inputs.interestIncome + inputs.rentalIncome}
                  onChange={(v) => updateInputs({ otherIncome: v })}
                  min={0}
                  max={10000000}
                  step={5000}
                  prefix="₹"
                  tooltip="Income from interest, rent, or other sources."
                />

                <div className="h-px bg-slate-50 my-8" />

                <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                  <span className="bg-emerald-500 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-100">2</span>
                  Deductions <span className="text-[10px] font-bold text-slate-400 ml-1">(Old Regime)</span>
                </h2>

                <InputField
                  label="Section 80C"
                  value={inputs.section80C}
                  onChange={(v) => updateInputs({ section80C: v })}
                  min={0}
                  max={150000}
                  step={5000}
                  prefix="₹"
                  tooltip="Investments in PPF, ELSS, LIC, EPF, etc. (Max 1.5L)"
                />

                <InputField
                  label="Section 80D"
                  value={inputs.section80D}
                  onChange={(v) => updateInputs({ section80D: v })}
                  min={0}
                  max={100000}
                  step={1000}
                  prefix="₹"
                  tooltip="Health Insurance Premium for self and parents."
                />

                <InputField
                  label="HRA Exemption"
                  value={inputs.hraExemption}
                  onChange={(v) => updateInputs({ hraExemption: v })}
                  min={0}
                  max={2000000}
                  step={5000}
                  prefix="₹"
                  tooltip="Exempt portion of House Rent Allowance."
                />

                <InputField
                  label="Home Loan Int (24b)"
                  value={inputs.homeLoanInterest24b}
                  onChange={(v) => updateInputs({ homeLoanInterest24b: v })}
                  min={0}
                  max={200000}
                  step={5000}
                  prefix="₹"
                  tooltip="Interest paid on Home Loan. (Max 2L for self-occupied)"
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
              
              {/* Top Summary Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Recommended Regime</p>
                  <h3 className="text-3xl font-black mb-1 capitalize">{result.recommendedRegime} Tax Regime</h3>
                  <p className="text-xs font-bold text-indigo-100">
                    You save <span className="text-white bg-indigo-500 px-1.5 py-0.5 rounded ml-1">{formatCurrency(result.savings)}</span> annually
                  </p>
                </motion.div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tax Payable</p>
                    <AnimatedNumber value={currentRegime.totalTax} prefix="₹" className="text-3xl font-black text-slate-900 block" />
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Effective Tax Rate: {((currentRegime.totalTax / currentRegime.grossIncome) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={handleExportPDF} disabled={exporting} className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-100">
                      📄
                    </button>
                    <button onClick={handleCopyURL} className="p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-500 rounded-xl transition-all border border-slate-100">
                      🔗
                    </button>
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
              >
                <div className="flex border-b border-slate-50 p-2">
                  {[
                    { id: 'regime', label: 'Old vs New', icon: '⚖️' },
                    { id: 'breakdown', label: 'Tax Breakdown', icon: '📊' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all rounded-xl ${
                        activeTab === tab.id 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-8 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'regime' ? (
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="name" stroke={CHART_COLORS.axis} fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                        <YAxis stroke={CHART_COLORS.axis} fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Bar dataKey="tax" name="Tax Payable" fill={CHART_COLORS.rose} radius={[8, 8, 0, 0]} barSize={40} />
                        <Bar dataKey="takeHome" name="Take Home" fill={CHART_COLORS.teal} radius={[8, 8, 0, 0]} barSize={40} />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Take Home', value: currentRegime.takeHomeIncome },
                            { name: 'Tax Paid', value: currentRegime.totalTax },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          <Cell fill={CHART_COLORS.teal} />
                          <Cell fill={CHART_COLORS.rose} />
                          <LabelList dataKey="name" position="outside" stroke="none" fill="#64748b" fontSize={10} fontWeight="bold" />
                        </Pie>
                        <Tooltip formatter={(v: number) => formatCurrency(v)} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.section>

              {/* Detailed Breakdown Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[result.oldRegime, result.newRegime].map((reg) => (
                  <div key={reg.regime} className={`p-6 rounded-2xl border ${reg.regime === result.recommendedRegime ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-50' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">{reg.regime} Regime</h4>
                      {reg.regime === result.recommendedRegime && <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Optimal</span>}
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Taxable Income</span>
                        <span className="text-slate-900">{formatCurrency(reg.taxableIncome)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Total Deductions</span>
                        <span className="text-emerald-600">-{formatCurrency(reg.totalDeductions)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Tax before Cess</span>
                        <span className="text-slate-900">{formatCurrency(reg.taxBeforeCess + reg.rebate87A)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>87A Rebate</span>
                        <span className="text-emerald-600">-{formatCurrency(reg.rebate87A)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>4% Cess</span>
                        <span className="text-slate-900">{formatCurrency(reg.cess)}</span>
                      </div>
                      <div className="h-px bg-slate-200/50" />
                      <div className="flex justify-between text-sm font-black text-slate-900">
                        <span>Net Tax</span>
                        <span className={reg.regime === result.recommendedRegime ? 'text-indigo-600' : ''}>{formatCurrency(reg.totalTax)}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
              <h3 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">87A Rebate Rule</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">The Section 87A rebate significantly helps middle-income earners. In the New Regime, it makes income up to ₹12 Lakh effectively tax-free.</p>
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
                 <h4 className="text-emerald-600 font-black uppercase tracking-widest text-[10px]">Strategic Takeaway</h4>
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
        </section>
      </article>
    </div>
  );
};

export default IncomeTaxCalculator;
