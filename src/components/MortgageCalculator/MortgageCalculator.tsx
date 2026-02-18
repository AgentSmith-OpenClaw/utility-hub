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


      </div>
    </div>
  );
};

export default MortgageCalculator;
