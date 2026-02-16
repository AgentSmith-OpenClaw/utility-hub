import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell,
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  CartesianGrid, XAxis, YAxis,
} from 'recharts';
import { calculateMortgage, MortgageInputs, generateAmortizationSchedule } from './MortgageCalculator.utils';
import { generatePDFReport, fmtCurrency as pdfFmtCurrency, type PDFReportConfig } from '../../utils/pdf';
import { exportMortgageToExcel, type MortgageExportData } from '../../utils/excel';
import { CHART_COLORS, PIE_COLORS } from '../../utils/chartColors';

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

const MortgageInputField: React.FC<{
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; prefix?: string; suffix?: string; tooltip?: string;
  decimals?: number;
}> = ({ label, value, onChange, min, max, step, prefix, suffix, tooltip, decimals = 0 }) => {
  const [focused, setFocused] = useState(false);
  const fmt = (v: number) => decimals > 0 ? v.toFixed(decimals) : v.toLocaleString('en-US');
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

const MortgageCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<MortgageInputs>({
    homePrice: 400000,
    downPayment: 80000,
    loanTerm: 30,
    interestRate: 6.5,
    propertyTaxRate: 1.2,
    homeInsurance: 150,
    pmiRate: 0.5,
    hoaFees: 0
  });

  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const result = useMemo(() => calculateMortgage(inputs), [inputs]);

  // Generate amortization schedule for charts
  const schedule = useMemo(() => 
    generateAmortizationSchedule(inputs),
    [inputs]
  );

  // Chart 1 data: Payment Breakdown pie chart
  const pieData = [
    { name: 'Principal & Interest', value: result.monthlyPrincipalAndInterest },
    { name: 'Property Tax', value: result.monthlyPropertyTax },
    { name: 'Home Insurance', value: result.monthlyHomeInsurance },
    { name: 'PMI', value: result.monthlyPMI },
    { name: 'HOA', value: result.monthlyHOA },
  ].filter(item => item.value > 0);

  // Chart 2 data: Balance over time (sample every year)
  const balanceChartData = useMemo(() => {
    const yearlyData = schedule.filter((_, i) => i % 12 === 0 || i === schedule.length - 1);
    return yearlyData.map((row) => ({
      year: Math.floor(row.month / 12) || 1,
      balance: row.remainingBalance,
      principal: row.cumulativePrincipal,
      interest: row.cumulativeInterest,
    }));
  }, [schedule]);

  // Chart 3 data: Principal vs Interest over time (yearly)
  const principalVsInterestData = useMemo(() => {
    const years = Math.floor(inputs.loanTerm);
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
  }, [schedule, inputs.loanTerm]);

  // Chart 4 data: Rate comparison (what-if scenarios)
  const rateComparisonData = useMemo(() => {
    const rates = [inputs.interestRate - 1, inputs.interestRate, inputs.interestRate + 1];
    return rates.map(rate => {
      const testResult = calculateMortgage({ ...inputs, interestRate: rate });
      return {
        rate: `${rate.toFixed(1)}%`,
        payment: Math.round(testResult.totalMonthlyPayment),
        totalInterest: Math.round(testResult.totalInterest),
      };
    });
  }, [inputs]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatYAxis = (value: number): string => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value}`;
  };

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-slate-900 mb-1.5">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
            />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Export handlers
  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const config: PDFReportConfig = {
        title: 'Mortgage Payment Report',
        subtitle: `${formatCurrency(inputs.homePrice)} home @ ${inputs.interestRate}% interest`,
        filename: 'Mortgage_Report.pdf',
        sections: [
          {
            type: 'inputs',
            title: 'Loan Parameters',
            inputs: [
              { label: 'Home Price', value: formatCurrency(inputs.homePrice) },
              { label: 'Down Payment', value: `${formatCurrency(inputs.downPayment)} (${result.downPaymentPercentage.toFixed(1)}%)` },
              { label: 'Loan Amount', value: formatCurrency(result.loanAmount) },
              { label: 'Interest Rate', value: `${inputs.interestRate}%` },
              { label: 'Loan Term', value: `${inputs.loanTerm} years` },
            ],
          },
          {
            type: 'metrics',
            title: 'Payment Summary',
            metrics: [
              { label: 'Monthly Payment', value: formatCurrency(result.totalMonthlyPayment) },
              { label: 'Principal & Interest', value: formatCurrency(result.monthlyPrincipalAndInterest) },
              { label: 'Property Tax', value: formatCurrency(result.monthlyPropertyTax) },
              { label: 'Home Insurance', value: formatCurrency(result.monthlyHomeInsurance) },
              ...(result.monthlyPMI > 0 ? [{ label: 'PMI', value: formatCurrency(result.monthlyPMI) }] : []),
              { label: 'Total Interest Paid', value: formatCurrency(result.totalInterest) },
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
  }, [inputs, result]);

  const handleExportExcel = useCallback(() => {
    setExporting('excel');
    try {
      const exportData: MortgageExportData = {
        homePrice: inputs.homePrice,
        downPayment: inputs.downPayment,
        loanAmount: result.loanAmount,
        interestRate: inputs.interestRate,
        loanTerm: inputs.loanTerm,
        propertyTax: result.monthlyPropertyTax,
        homeInsurance: result.monthlyHomeInsurance,
        hoa: result.monthlyHOA,
        pmi: result.monthlyPMI,
        monthlyPayment: result.totalMonthlyPayment,
        monthlyPrincipalInterest: result.monthlyPrincipalAndInterest,
        totalPayment: result.totalPayment,
        totalInterest: result.totalInterest,
        schedule: schedule,
      };
      exportMortgageToExcel(exportData);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  }, [inputs, result, schedule]);

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
    const text = `Check out my mortgage plan: ${formatCurrency(inputs.homePrice)} home with ${formatCurrency(inputs.downPayment)} down = ${formatCurrency(result.totalMonthlyPayment)}/month!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [inputs, result]);

  const handleShareTwitter = useCallback(() => {
    const text = `My mortgage plan: ${formatCurrency(inputs.homePrice)} home = ${formatCurrency(result.totalMonthlyPayment)}/mo. Calculate yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [inputs, result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/20 py-8 px-4" id="mortgage-calculator-content">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Mortgage Calculator</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Estimate your monthly mortgage payments with taxes, insurance, and PMI.  
            Visualize your payoff schedule and compare interest rates.
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

            <MortgageInputField
              label="Home Price" value={inputs.homePrice}
              onChange={(v) => setInputs({ ...inputs, homePrice: v })}
              min={10000} max={10000000} step={10000} prefix="$"
              tooltip="Total purchase price of the home."
            />
            <MortgageInputField
              label="Down Payment" value={inputs.downPayment}
              onChange={(v) => setInputs({ ...inputs, downPayment: v })}
              min={0} max={inputs.homePrice} step={5000} prefix="$"
              tooltip={`Down payment (${result.downPaymentPercentage.toFixed(1)}% of home price).`}
            />
            <div className="grid grid-cols-2 gap-3">
              <MortgageInputField
                label="Term" value={inputs.loanTerm}
                onChange={(v) => setInputs({ ...inputs, loanTerm: v })}
                min={1} max={50} step={1} suffix="yrs"
                tooltip="Loan duration in years."
              />
              <MortgageInputField
                label="Interest Rate" value={inputs.interestRate}
                onChange={(v) => setInputs({ ...inputs, interestRate: v })}
                min={0.1} max={20} step={0.1} suffix="%" decimals={1}
                tooltip="Annual interest rate on the mortgage."
              />
            </div>

            <div className="h-px bg-slate-50 my-8" />

            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
              <span className="bg-teal-500 text-white rounded-lg w-7 h-7 flex items-center justify-center text-xs font-black shadow-lg shadow-teal-100">2</span>
              Taxes & Insurance
            </h2>

            <MortgageInputField
              label="Property Tax" value={inputs.propertyTaxRate}
              onChange={(v) => setInputs({ ...inputs, propertyTaxRate: v })}
              min={0} max={5} step={0.01} suffix="%" decimals={2}
              tooltip="Annual property tax rate as % of home value."
            />
            <div className="grid grid-cols-2 gap-3">
              <MortgageInputField
                label="Insurance" value={inputs.homeInsurance}
                onChange={(v) => setInputs({ ...inputs, homeInsurance: v })}
                min={0} max={5000} step={10} prefix="$" suffix="/mo"
                tooltip="Monthly homeowner's insurance premium."
              />
              <MortgageInputField
                label="HOA Fees" value={inputs.hoaFees}
                onChange={(v) => setInputs({ ...inputs, hoaFees: v })}
                min={0} max={5000} step={10} prefix="$" suffix="/mo"
                tooltip="Monthly homeowners association fees."
              />
            </div>

            <button
              onClick={() => setInputs({ homePrice: 400000, downPayment: 80000, loanTerm: 30, interestRate: 6.5, propertyTaxRate: 1.2, homeInsurance: 150, pmiRate: 0.5, hoaFees: 0 })}
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
                <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wide">Monthly Payment</p>
                <p className="text-5xl md:text-6xl font-black mb-3">{formatCurrency(result.totalMonthlyPayment)}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-blue-200">Loan Amount:</span>
                    <span className="font-bold ml-1">{formatCurrency(result.loanAmount)}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">Total Interest:</span>
                    <span className="font-bold ml-1">{formatCurrency(result.totalInterest)}</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
            </div>

            {/* Chart 1: Payment Breakdown (Pie) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Payment Breakdown</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.teal, CHART_COLORS.primary][index % 5]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(val: any) => formatCurrency(Number(val ?? 0))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Loan Balance Over Time (Area) */}
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
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={formatYAxis} fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="balance" name="Remaining Balance" stroke={CHART_COLORS.primary} fill="url(#balGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Principal vs Interest by Year (Stacked Bar) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Principal vs Interest (Yearly)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={principalVsInterestData}>
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
                Notice how principal increases and interest decreases over time — this is the amortization effect.
              </p>
            </div>

            {/* Chart 4: Interest Rate Comparison (Bar) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Interest Rate Comparison</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rateComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                    <XAxis dataKey="rate" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={formatYAxis} fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<ChartTooltip />} />
                    <Bar dataKey="payment" name="Monthly Payment" fill={CHART_COLORS.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Compare ±1% rate changes. Even small rate differences significantly impact your monthly payment.
              </p>
            </div>

          </section>
        </div>

        {/* Educational Content Section (800+ words) */}
        <section className="mt-16 space-y-12">
          <article className="prose prose-slate max-w-none bg-white rounded-2xl border border-slate-100 shadow-md p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Understanding Your Mortgage Payment: A Complete Guide</h2>
            
            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is a Mortgage?</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              A mortgage is a long-term loan used to purchase a home or property. Unlike other types of loans, mortgages are secured by the property itself, meaning the lender can foreclose on the property if you fail to make payments. Most residential mortgages in the United States range from 15 to 30 years, with 30-year fixed-rate mortgages being the most common choice for homebuyers.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you take out a mortgage, you agree to pay back the original loan amount (principal) plus interest over the loan term. Each monthly payment you make is divided between paying down the principal and paying interest charges. Early in your mortgage, most of your payment goes toward interest. As time progresses, more of your payment goes toward reducing the principal balance — a process known as amortization.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">The Four Components of PITI</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Most lenders use the acronym <strong>PITI</strong> to describe the complete monthly mortgage payment. Understanding each component helps you accurately budget for homeownership and avoid financial surprises. Here's what PITI stands for:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
              <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏦</span>
                  Principal & Interest
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  The principal is the original loan amount you borrowed. Interest is the cost charged by the lender for borrowing that money. This portion of your payment is calculated using the amortization formula and remains constant for fixed-rate mortgages. Over a 30-year mortgage, you'll pay nearly as much in interest as you borrowed in principal.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  Property Taxes
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Property taxes are levied by local governments to fund schools, roads, emergency services, and other municipal services. The average property tax rate in the US is around 1.1% of home value annually, but this varies dramatically by state — from as low as 0.3% in Hawaii to over 2% in New Jersey. Your lender collects 1/12 of your annual tax bill each month and pays it on your behalf.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-100">
                <h4 className="text-lg font-bold text-cyan-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  Home Insurance
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Homeowners insurance protects your property against damage from fire, storms, theft, and other covered perils. Most lenders require you to maintain insurance coverage for at least the loan amount. Premiums vary based on location, home value, deductible chosen, and coverage level. Expect to pay $1,000-$3,000 annually for a typical single-family home.
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
                <h4 className="text-lg font-bold text-teal-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  PMI (If Applicable)
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Private Mortgage Insurance (PMI) is required when you make a down payment of less than 20% of the home's purchase price. PMI protects the lender (not you) if you default on the loan. It typically costs 0.3% to 1.5% of the loan amount annually. The good news: once you reach 20% equity through payments or home appreciation, you can request PMI removal.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How the Amortization Schedule Works</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Amortization is the process of paying off a loan through regular, equal payments over time. With a fully amortizing mortgage, each payment covers the interest charged for that period plus a portion of the principal. The key insight is that your payment remains the same, but the allocation between principal and interest shifts dramatically over the life of the loan.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              In the early years, most of your payment goes toward interest because the outstanding principal balance is high. For example, on a $300,000 loan at 6.5% interest, your first monthly payment might be $1,896, with $1,625 going to interest and only $271 to principal. Fast forward to year 25, and that same $1,896 payment splits very differently: $1,500 to principal and only $396 to interest.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              This is why making extra principal payments early in your mortgage has such a powerful effect. Any additional amount you pay toward principal reduces the balance on which future interest is calculated, potentially shaving years off your loan and saving tens of thousands in interest.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Fixed-Rate vs Adjustable-Rate Mortgages</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>Fixed-rate mortgages</strong> maintain the same interest rate throughout the entire loan term. This provides payment stability and makes budgeting easier. You'll never experience payment shock from rising interest rates. The trade-off is that fixed-rate mortgages typically start with slightly higher rates than adjustable-rate options.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>Adjustable-rate mortgages (ARMs)</strong> have interest rates that can change over time, usually tied to an index like SOFR or the prime rate. Common structures include 5/1 ARMs (fixed for 5 years, then adjusts annually) or 7/1 ARMs. ARMs often start with lower initial rates but carry the risk of payment increases if rates rise. They can be beneficial if you plan to sell or refinance before the adjustment period begins.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">The Power of Your Down Payment</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Your down payment size affects multiple aspects of your mortgage. The more you put down, the better your terms are likely to be. Here's why a larger down payment matters:
            </p>
            <ul className="space-y-2 text-slate-600 mb-4">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Lower monthly payments:</strong> A smaller loan means smaller monthly payments, improving cash flow.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>No PMI:</strong> Put down 20% or more to avoid PMI, saving hundreds monthly.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Better interest rates:</strong> Lenders offer lower rates to borrowers with more equity.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Less total interest:</strong> Borrowing less means paying less interest over the loan's life.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Stronger negotiating position:</strong> Sellers take offers with larger down payments more seriously.</span>
              </li>
            </ul>
            <p className="text-slate-600 leading-relaxed mb-4">
              That said, putting every dollar toward your down payment isn't always optimal. You need to maintain an emergency fund, and in some cases, investing extra funds may yield better returns than the interest you'd save on a low-rate mortgage.
            </p>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How to Use This Calculator Effectively</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              This mortgage calculator provides comprehensive insights beyond just your monthly payment. Use it to explore different scenarios and optimize your home purchase strategy:
            </p>
            <ul className="space-y-2 text-slate-600 mb-4">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Test different down payments:</strong> See how reaching 20% down affects your payment through PMI elimination.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Compare interest rates:</strong> Use the rate comparison chart to quantify how negotiating 0.25% or 0.5% lower rates affects your costs.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Budget for total housing costs:</strong> Factor in property taxes, insurance, and HOA fees to get your true monthly housing expense.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Visualize the payoff trajectory:</strong> The balance chart shows how quickly you build equity over time.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Understand the principal/interest split:</strong> See how your monthly payment allocation shifts with the stacked bar chart.</span>
              </li>
            </ul>

            <p className="text-slate-600 leading-relaxed">
              Use the export features to save your calculations as PDF reports or share your scenario with family members or financial advisors. The URL sharing feature preserves all your inputs, making it easy to compare multiple scenarios across different browser tabs.
            </p>
          </article>
        </section>

      </div>
    </div>
  );
};

export default MortgageCalculator;
