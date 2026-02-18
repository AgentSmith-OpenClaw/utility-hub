import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { generateAmortizationSchedule, calculateAmortizationSummary } from './AmortizationCalculator.utils';
import { generatePDFReport, fmtCurrency as pdfFmtCurrency, type PDFReportConfig } from '../../utils/pdf';
import { exportAmortizationToExcel, type AmortizationExportData } from '../../utils/excel';
import { CHART_COLORS } from '../../utils/chartColors';

// --- Shared Sub-components (matching IncomeTax reference) ---

const HelpTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group ml-1.5 cursor-help">
    <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-400 inline-flex items-center justify-center text-[9px] font-bold">?</span>
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 
      bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-relaxed font-medium">
      {text}
    </span>
  </span>
);

const AmortInputField: React.FC<{
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; prefix?: string; suffix?: string; tooltip?: string;
  decimals?: number;
}> = ({ label, value, onChange, min, max, step, prefix, suffix, tooltip, decimals = 0 }) => {
  const [focused, setFocused] = useState(false);
  const fmt = (v: number) => decimals > 0 ? v.toFixed(decimals) : v.toLocaleString('en-IN');
  const [displayValue, setDisplayValue] = useState(fmt(value));

  useEffect(() => {
    if (!focused) setDisplayValue(fmt(value));
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
      <p className="text-sm font-bold text-slate-900 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">₹{Number(entry.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
      ))}
    </div>
  );
};

const formatYAxis = (value: number): string => {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(0)}K`;
  return `₹${value}`;
};

const formatCurrency = (val: number) => 
  `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const AmortizationCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const schedule = useMemo(() => 
    generateAmortizationSchedule(loanAmount, annualRate, tenureYears * 12),
    [loanAmount, annualRate, tenureYears]
  );

  const summary = useMemo(() => 
    calculateAmortizationSummary(loanAmount, annualRate, tenureYears * 12, schedule),
    [loanAmount, annualRate, tenureYears, schedule]
  );

  // Chart 1: Balance over time (sampled)
  const balanceChartData = useMemo(() => {
    const skipFactor = Math.max(1, Math.ceil(schedule.length / 50));
    return schedule
      .filter((_, i) => i % skipFactor === 0 || i === schedule.length - 1)
      .map(p => ({
        month: `M${p.month}`,
        balance: Math.round(p.remainingBalance),
        principal: Math.round(p.principal),
        interest: Math.round(p.interest),
      }));
  }, [schedule]);

  // Chart 2: Principal vs Interest by Year (Stacked Bar)
  const yearlyPIData = useMemo(() => {
    const years = Math.floor(tenureYears);
    return Array.from({ length: years }, (_, i) => {
      const year = i + 1;
      const startMonth = i * 12;
      const endMonth = Math.min((i + 1) * 12, schedule.length);
      const yearData = schedule.slice(startMonth, endMonth);
      const totalPrincipal = yearData.reduce((sum, row) => sum + row.principal, 0);
      const totalInterest = yearData.reduce((sum, row) => sum + row.interest, 0);
      return {
        year: `Year ${year}`,
        principal: Math.round(totalPrincipal),
        interest: Math.round(totalInterest),
      };
    });
  }, [schedule, tenureYears]);

  // Chart 3: Monthly Payment Composition Over Time (Line chart showing P&I ratio)
  const piRatioData = useMemo(() => {
    const samples = 12; // Sample 12 points across the loan
    const stepSize = Math.floor(schedule.length / samples);
    return Array.from({ length: samples }, (_, i) => {
      const idx = Math.min(i * stepSize, schedule.length - 1);
      const payment = schedule[idx];
      const principalPct = (payment.principal / payment.totalPayment) * 100;
      const interestPct = (payment.interest / payment.totalPayment) * 100;
      return {
        point: `${Math.floor(payment.month / 12)}yr`,
        principalPct: Math.round(principalPct),
        interestPct: Math.round(interestPct),
      };
    });
  }, [schedule]);

  // Chart 4: Extra Payment Impact (What-if scenarios)
  const extraPaymentData = useMemo(() => {
    const extraAmounts = [0, 5000, 10000, 20000];
    return extraAmounts.map(extra => {
      const adjustedEMI = summary.monthlyEMI + extra;
      let balance = loanAmount;
      const monthlyRate = annualRate / 12 / 100;
      let months = 0;
      let totalInterest = 0;

      while (balance > 1 && months < tenureYears * 12) {
        months++;
        const interest = balance * monthlyRate;
        const principal = Math.min(adjustedEMI - interest, balance);
        totalInterest += interest;
        balance -= principal;
      }

      return {
        label: extra === 0 ? 'Regular' : `+₹${(extra / 1000).toFixed(0)}K`,
        months,
        years: (months / 12).toFixed(1),
        totalInterest: Math.round(totalInterest),
        saved: Math.round(summary.totalInterest - totalInterest),
      };
    });
  }, [loanAmount, annualRate, tenureYears, summary]);

  // Export handlers
  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const config: PDFReportConfig = {
        title: 'Amortization Schedule Report',
        subtitle: `${formatCurrency(loanAmount)} loan @ ${annualRate}% for ${tenureYears} years`,
        filename: 'Amortization_Schedule.pdf',
        sections: [
          {
            type: 'inputs',
            title: 'Loan Parameters',
            inputs: [
              { label: 'Loan Amount', value: formatCurrency(loanAmount) },
              { label: 'Interest Rate', value: `${annualRate}%` },
              { label: 'Loan Tenure', value: `${tenureYears} years` },
            ],
          },
          {
            type: 'metrics',
            title: 'Repayment Summary',
            metrics: [
              { label: 'Monthly EMI', value: formatCurrency(summary.monthlyEMI) },
              { label: 'Total Interest', value: formatCurrency(summary.totalInterest) },
              { label: 'Total Amount', value: formatCurrency(summary.totalAmount) },
              { label: 'Interest/Principal Ratio', value: `${((summary.totalInterest / loanAmount) * 100).toFixed(1)}%` },
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
  }, [loanAmount, annualRate, tenureYears, summary]);

  const handleExportExcel = useCallback(() => {
    setExporting('excel');
    try {
      const exportData: AmortizationExportData = {
        loanAmount,
        annualRate,
        tenureYears,
        monthlyEMI: summary.monthlyEMI,
        totalInterest: summary.totalInterest,
        totalAmount: summary.totalAmount,
        schedule: schedule,
      };
      exportAmortizationToExcel(exportData);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  }, [loanAmount, annualRate, tenureYears, summary, schedule]);

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
    const text = `Check out my loan amortization: ${formatCurrency(loanAmount)} @ ${annualRate}% = ${formatCurrency(summary.monthlyEMI)}/month!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [loanAmount, annualRate, summary]);

  const handleShareTwitter = useCallback(() => {
    const text = `My loan plan: ${formatCurrency(loanAmount)} @ ${annualRate}% = ${formatCurrency(summary.monthlyEMI)}/mo EMI. Calculate yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [loanAmount, annualRate, summary]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/20 py-8 px-4" id="amortization-calculator-content">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Amortization Calculator</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Detailed breakdown of your loan repayment schedule with month-by-month principal and interest allocation.
            Visualize your payoff journey and explore prepayment strategies.
          </p>
        </header>

        {/* Export + Share bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button onClick={handleExportPDF} disabled={exporting !== null} className="flex items-center gap-2 bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-slate-600 hover:text-blue-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
          </button>
          <button onClick={handleExportExcel} disabled={exporting !== null} className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {exporting === 'excel' ? '⏳ Generating…' : '📊 Export Excel'}
          </button>
          <button onClick={handleCopyURL} className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 hover:text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            {copied ? '✅ Copied!' : '🔗 Copy URL'}
          </button>
          <button onClick={handleShareWhatsApp} className="flex items-center gap-2 bg-white hover:bg-teal-50 border border-slate-100 hover:border-teal-200 text-slate-600 hover:text-teal-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            💬 WhatsApp
          </button>
          <button onClick={handleShareTwitter} className="flex items-center gap-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 text-slate-600 hover:text-sky-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm">
            🐦 Twitter
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          {/* Left: Calculator (STICKY) */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-6 lg:self-start bg-white rounded-2xl shadow-xl border border-slate-100 p-6 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-blue-200">1</span>
              Loan Details
            </h2>

            <AmortInputField
              label="Loan Amount" value={loanAmount}
              onChange={(v) => setLoanAmount(v)}
              min={10000} max={100000000} step={50000} prefix="₹"
              tooltip="Total loan principal amount."
            />
            <AmortInputField
              label="Interest Rate" value={annualRate}
              onChange={(v) => setAnnualRate(v)}
              min={0.1} max={25} step={0.1} suffix="%" decimals={1}
              tooltip="Annual interest rate on the loan."
            />
            <AmortInputField
              label="Tenure" value={tenureYears}
              onChange={(v) => setTenureYears(v)}
              min={1} max={40} step={1} suffix="yrs"
              tooltip="Loan repayment period in years."
            />

            <div className="h-px bg-slate-50 my-6" />

            {/* Quick Summary */}
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="bg-teal-500 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-teal-100">2</span>
              Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Monthly EMI</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(summary.monthlyEMI)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Total Interest</span>
                <span className="text-xs font-black text-red-500">{formatCurrency(summary.totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Total Payable</span>
                <span className="text-xs font-black text-slate-900">{formatCurrency(summary.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => { setLoanAmount(5000000); setAnnualRate(8.5); setTenureYears(20); }}
              className="w-full mt-8 py-3 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all"
            >
              ↺ Reset All Inputs
            </button>
          </motion.section>

          {/* Right: Results and Charts */}
          <section className="space-y-6">
            {/* Hero Result Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wide">Your Monthly EMI</p>
                <p className="text-5xl md:text-6xl font-black mb-3">{formatCurrency(summary.monthlyEMI)}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-blue-200">Total Payable:</span>
                    <span className="font-bold ml-1">{formatCurrency(summary.totalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">Interest:</span>
                    <span className="font-bold ml-1">{formatCurrency(summary.totalInterest)}</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
            </div>

            {/* Chart 1: Loan Balance Over Time (Area) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Loan Balance Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceChartData}>
                    <defs>
                      <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={formatYAxis} fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="balance" name="Remaining Balance" stroke={CHART_COLORS.primary} fill="url(#balGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Watch your loan balance decrease steadily over time as you make regular payments.
              </p>
            </div>

            {/* Chart 2: Principal vs Interest by Year (Stacked Bar) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Principal vs Interest (Yearly)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyPIData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="year" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={formatYAxis} fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="principal" name="Principal" stackId="a" fill={CHART_COLORS.primary} />
                    <Bar dataKey="interest" name="Interest" stackId="a" fill={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Early years are interest-heavy. As time passes, more of your payment goes toward principal reduction.
              </p>
            </div>

            {/* Chart 3: Payment Composition Over Time (Line) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Payment Composition Over Time</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={piRatioData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="point" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      formatter={(value: number | undefined) => value != null ? `${value}%` : ''}
                      labelStyle={{ color: CHART_COLORS.axis }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="principalPct" name="Principal %" stroke={CHART_COLORS.primary} strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="interestPct" name="Interest %" stroke={CHART_COLORS.secondary} strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                The crossover point shows when principal payments exceed interest payments — typically around 40-60% of loan tenure.
              </p>
            </div>

            {/* Chart 4: Extra Payment Impact (Bar) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Impact of Extra Payments</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={extraPaymentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
                            <p className="text-sm font-bold text-slate-900 mb-2">{data.label}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Payoff Time:</span>
                                <span className="font-semibold text-slate-800">{data.years} years</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Interest Saved:</span>
                                <span className="font-semibold text-teal-600">{formatCurrency(data.saved)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="months" name="Months to Payoff" fill={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                See how extra monthly payments can significantly reduce your loan tenure and total interest paid.
              </p>
            </div>

            {/* Amortization Schedule Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">Complete Amortization Schedule</h3>
                <p className="text-sm text-slate-500 mt-1">Month-by-month breakdown of all {schedule.length} payments</p>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Month</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">EMI</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedule.map((p) => (
                      <tr key={p.month} className="hover:bg-slate-50/50 transition">
                        <td className="px-8 py-4 text-sm font-semibold text-slate-700">{p.month}</td>
                        <td className="px-8 py-4 text-sm text-teal-600 font-medium">{formatCurrency(p.principal)}</td>
                        <td className="px-8 py-4 text-sm text-amber-600 font-medium">{formatCurrency(p.interest)}</td>
                        <td className="px-8 py-4 text-sm font-medium text-slate-900">{formatCurrency(p.totalPayment)}</td>
                        <td className="px-8 py-4 text-sm text-slate-500 font-mono">{formatCurrency(p.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        </div>


      </div>
    </div>
  );
};

export default AmortizationCalculator;
