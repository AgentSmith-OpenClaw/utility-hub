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

        {/* Educational Content Section (800+ words) */}
        <section className="mt-16 space-y-12">
          <article className="prose prose-slate max-w-none bg-white rounded-2xl border border-slate-100 shadow-md p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Understanding Loan Amortization: A Complete Guide</h2>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is an Amortization Schedule?</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              An <strong>amortization schedule</strong> is a comprehensive table that breaks down every single payment you make over the life of a loan. Each row in the schedule represents one payment period (typically monthly) and shows exactly how much of that payment goes toward principal versus interest. This detailed breakdown helps borrowers understand the true cost of their loan and plan their finances accordingly.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              The word "amortization" comes from Latin, meaning "to kill off" — which is essentially what you're doing with each payment: gradually killing off your debt. For most loans in India, including home loans, personal loans, car loans, and education loans, lenders use an equal monthly installment (EMI) structure, which is a form of amortized repayment.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              What makes amortization fascinating is how the payment allocation shifts over time. While your EMI remains constant, the proportion going toward principal steadily increases while the interest portion decreases. This happens because interest is calculated on the remaining balance, which shrinks with each payment. Understanding this dynamic is crucial for strategic financial planning.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How the Amortization Process Works</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Let's break down the mechanics with a real example. Consider a ₹50 lakh loan at 8.5% annual interest for 20 years. Using the EMI formula, your monthly payment works out to approximately ₹43,391. But here's where it gets interesting:
            </p>
            <ul className="space-y-2 text-slate-600 mb-4">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>First month:</strong> Out of ₹43,391, roughly ₹35,417 goes to interest and only ₹7,974 to principal. You're paying mostly interest!</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>After 5 years (60 payments):</strong> Each payment splits more evenly — about ₹28,000 to interest and ₹15,000 to principal.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>After 15 years (180 payments):</strong> The tables turn — now ₹30,000 goes to principal and only ₹13,000 to interest.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Final month:</strong> Almost the entire EMI goes toward principal, with just a tiny interest component.</span>
              </li>
            </ul>
            <p className="text-slate-600 leading-relaxed mb-4">
              This progression explains why making extra payments early in your loan tenure has such a powerful impact. Every rupee you pay extra toward principal in the early years eliminates all the future interest that would have been calculated on that amount. It's financial leverage working in your favor.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Reading Your Amortization Schedule</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you look at an amortization table, you'll typically see five key columns that tell the complete story of your loan:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
              <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-bold text-blue-900 mb-3">Payment Number</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This is simply the sequential count of payments, from 1 to the total number (240 for a 20-year loan). Some schedules show this as months, others as actual dates. This helps you track where you are in your repayment journey.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-bold text-blue-900 mb-3">Principal Payment</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The portion of your EMI that reduces your actual loan balance. This is the "productive" part of your payment — the money that directly decreases what you owe. Watch this number grow over time as your loan progresses.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100">
                <h4 className="text-lg font-bold text-cyan-900 mb-3">Interest Payment</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The "rent" you pay for borrowing money, calculated as: (Remaining Balance × Interest Rate) ÷ 12. This decreases over time because it's always computed on the shrinking outstanding balance, not the original loan amount.
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
                <h4 className="text-lg font-bold text-teal-900 mb-3">Remaining Balance</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Your outstanding loan amount after each payment. This is the most important number for understanding your true debt position. Making extra payments directly attacks this number, accelerating your debt freedom.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Strategies to Pay Off Your Loan Faster</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              One of the most powerful insights from an amortization schedule is understanding how prepayments can transform your loan timeline. Here are proven strategies used by financially savvy borrowers:
            </p>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 my-6">
              <h4 className="text-lg font-bold text-amber-900 mb-3">💡 The Extra Payment Strategy</h4>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                Even small additional payments can have outsized effects. On our ₹50 lakh example loan:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Pay ₹5,000 extra monthly → Save ₹14+ lakh in interest, finish 4 years early</li>
                <li>• Pay ₹10,000 extra monthly → Save ₹24+ lakh in interest, finish 6+ years early</li>
                <li>• Pay ₹20,000 extra monthly → Save ₹38+ lakh in interest, finish 9 years early</li>
              </ul>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>Annual lump-sum payments:</strong> Many borrowers receive bonuses, tax refunds, or festive gifts. Putting these windfalls toward your loan principal can knock years off your repayment period. Even one extra month's EMI per year as a lump sum can reduce a 20-year loan to 16-17 years.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>The biweekly payment trick:</strong> Instead of paying one EMI monthly, pay half the EMI every two weeks. You'll make 26 half-payments (13 full payments) per year instead of 12, effectively making one extra payment annually without feeling the pinch.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Implications and Financial Planning</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              In India, the tax benefits of home loans make amortization schedules even more valuable for financial planning. Under Section 80C of the Income Tax Act, you can claim deductions up to ₹1.5 lakh on principal repayment. Additionally, Section 24(b) allows deductions up to ₹2 lakh on interest paid (for self-occupied property).
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your amortization schedule becomes a crucial document during tax filing. It shows exactly how much principal and interest you paid during the financial year, helping you maximize your deductions. The interest-heavy early years of your loan actually provide larger tax benefits, which partially offsets the higher interest cost.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              For investment properties, the tax benefits are even more substantial — you can claim the entire interest amount as a deduction without any limit, making the amortization schedule essential for accurate tax planning and investment analysis.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">When to Use an Amortization Calculator</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              This calculator is your go-to tool in several scenarios:
            </p>
            <ul className="space-y-2 text-slate-600 mb-4">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>Before taking a loan:</strong> Understand the true cost beyond just the EMI. See how much interest you'll pay over the life of the loan.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>Comparing loan offers:</strong> Two lenders might offer similar EMIs but vastly different interest rates. The schedule reveals the real difference in total cost.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>Planning prepayments:</strong> Simulate different prepayment scenarios to quantify exactly how much you'll save in interest and time.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>Tax planning:</strong> Calculate your year-wise principal and interest payments to maximize deductions under Sections 80C and 24(b).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>Refinancing decisions:</strong> Determine if refinancing makes sense by comparing current total interest with projected savings from a lower rate.</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Amortization vs Mortgage Calculator: What's the Difference?</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              While related, these tools serve different purposes. A <strong>mortgage calculator</strong> focuses on the complete monthly housing payment including property taxes, insurance, HOA fees, and PMI — giving you the full picture of homeownership costs. It's designed for home buyers who need to budget for all housing expenses.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              An <strong>amortization calculator</strong>, on the other hand, zooms in on the loan itself — showing the month-by-month breakdown of how your loan balance decreases and how your payments are allocated. It works for any type of loan: home, car, personal, or education. Use this when you want deep insights into the loan mechanics and prepayment strategies.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our calculator provides comprehensive visualizations that most basic amortization tools lack — including principal-vs-interest ratios over time, extra payment impact analysis, and yearly payment breakdowns. These insights help you make more informed financial decisions and optimize your debt repayment strategy.
            </p>
          </article>
        </section>

      </div>
    </div>
  );
};

export default AmortizationCalculator;
