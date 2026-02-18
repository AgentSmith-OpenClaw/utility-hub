import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useEMI } from '../../hooks/useEMI';
import { Prepayment } from './EMICalculator.types';
import { validateLoanInputs } from '../../utils/validation';
import { exportToExcel } from '../../utils/excel';
import { generatePDFReport, fmtCurrency, type PDFReportConfig } from '../../utils/pdf';
import AdSlot from '../AdSlot/AdSlot';
import { CHART_COLORS, PIE_COLORS } from '../../utils/chartColors';

// Custom tooltip matching FIRE/SIP pattern
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

const PctTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
      <p className="text-sm font-bold text-slate-900 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{Number(entry.value).toFixed(1)}%</span>
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

interface CalculationHistory {
  id: string;
  timestamp: number;
  loanAmount: number;
  annualRate: number;
  tenureYears: number;
  prepayments: Prepayment[];
  emi: number;
  totalInterest: number;
  interestSaved: number;
  actualTenure: number;
}

const EMICalculator: React.FC = () => {
  const { emi, schedule, summary, calculate } = useEMI();
  const [loanAmount, setLoanAmount] = useState<string>('5000000');
  const [annualRate, setAnnualRate] = useState<string>('8.5');
  const [tenureYears, setTenureYears] = useState<string>('20');
  const [prepayments, setPrepayments] = useState<Prepayment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  
  // New prepayment form
  const [newPrepaymentMonth, setNewPrepaymentMonth] = useState<string>('');
  const [newPrepaymentAmount, setNewPrepaymentAmount] = useState<string>('');
  const [newPrepaymentDescription, setNewPrepaymentDescription] = useState<string>('');
  const [prepaymentFrequency, setPrepaymentFrequency] = useState<'one-time' | 'monthly' | 'quarterly' | 'yearly'>('one-time');
  const [prepaymentStartMonth, setPrepaymentStartMonth] = useState<string>('');
  const [prepaymentStrategy, setPrepaymentStrategy] = useState<'reduce-tenure' | 'reduce-emi'>('reduce-tenure');

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('emi-calculator-state');
    const savedHistory = localStorage.getItem('emi-calculator-history');
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setLoanAmount(parsed.loanAmount || '5000000');
        setAnnualRate(parsed.annualRate || '8.5');
        setTenureYears(parsed.tenureYears || '20');
        setPrepayments(parsed.prepayments || []);
        calculate(
          parseFloat(parsed.loanAmount || '5000000'),
          parseFloat(parsed.annualRate || '8.5'),
          parseFloat(parsed.tenureYears || '20'),
          parsed.prepayments || []
        );
      } catch (e) {
        calculate(5000000, 8.5, 20, []);
      }
    } else {
      calculate(5000000, 8.5, 20, []);
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        setHistory([]);
      }
    }
  }, [calculate]);

  // Save to localStorage whenever inputs change
  useEffect(() => {
    const state = { loanAmount, annualRate, tenureYears, prepayments };
    localStorage.setItem('emi-calculator-state', JSON.stringify(state));
  }, [loanAmount, annualRate, tenureYears, prepayments]);

  // Auto-recalculate when prepayments change
  useEffect(() => {
    if (loanAmount && annualRate && tenureYears) {
      const amount = parseFloat(loanAmount);
      const rate = parseFloat(annualRate);
      const tenure = parseFloat(tenureYears);
      if (!isNaN(amount) && !isNaN(rate) && !isNaN(tenure) && amount > 0 && rate > 0 && tenure > 0) {
        calculate(amount, rate, tenure, prepayments);
      }
    }
  }, [loanAmount, annualRate, tenureYears, prepayments, calculate]);

  const handleCalculate = () => {
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(annualRate);
    const tenure = parseFloat(tenureYears);

    const validation = validateLoanInputs(amount, rate, tenure);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    calculate(amount, rate, tenure, prepayments);
    
    // Save to history after calculation completes
    setTimeout(() => {
      if (emi > 0 && summary) {
        const historyItem: CalculationHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          loanAmount: amount,
          annualRate: rate,
          tenureYears: tenure,
          prepayments: [...prepayments],
          emi,
          totalInterest: summary.totalInterest,
          interestSaved: summary.interestSaved,
          actualTenure: summary.actualTenure
        };
        const newHistory = [historyItem, ...history].slice(0, 10); // Keep last 10
        setHistory(newHistory);
        localStorage.setItem('emi-calculator-history', JSON.stringify(newHistory));
      }
    }, 100);
  };

  const handleLoadHistory = (item: CalculationHistory) => {
    setLoanAmount(item.loanAmount.toString());
    setAnnualRate(item.annualRate.toString());
    setTenureYears(item.tenureYears.toString());
    setPrepayments(item.prepayments);
    calculate(item.loanAmount, item.annualRate, item.tenureYears, item.prepayments);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('emi-calculator-history');
  };

  const handleAddPrepayment = () => {
    if (prepaymentFrequency === 'one-time') {
      const month = parseInt(newPrepaymentMonth);
      const amount = parseFloat(newPrepaymentAmount);
      
      if (month > 0 && amount > 0) {
        const newPrepayment: Prepayment = {
          id: Date.now().toString(),
          month,
          amount,
          description: newPrepaymentDescription || `One-time at M${month}`,
          strategy: prepaymentStrategy
        };
        setPrepayments([...prepayments, newPrepayment].sort((a, b) => a.month - b.month));
        setNewPrepaymentMonth('');
        setNewPrepaymentAmount('');
        setNewPrepaymentDescription('');
      }
    } else {
      // Handle recurring prepayments
      const startMonth = parseInt(prepaymentStartMonth);
      const amount = parseFloat(newPrepaymentAmount);
      const tenure = parseInt(tenureYears) * 12;
      
      if (startMonth > 0 && amount > 0) {
        const newPrepayments: Prepayment[] = [];
        const interval = prepaymentFrequency === 'monthly' ? 1 : prepaymentFrequency === 'quarterly' ? 3 : 12;
        
        for (let month = startMonth; month <= tenure; month += interval) {
          newPrepayments.push({
            id: `${Date.now()}-${month}`,
            month,
            amount,
            description: `${prepaymentFrequency} - ${prepaymentStrategy === 'reduce-tenure' ? 'Reduce Tenure' : 'Reduce EMI'}`,
            strategy: prepaymentStrategy
          });
        }
        
        setPrepayments([...prepayments, ...newPrepayments].sort((a, b) => a.month - b.month));
        setPrepaymentStartMonth('');
        setNewPrepaymentAmount('');
        setNewPrepaymentDescription('');
      }
    }
  };

  const handleRemovePrepayment = (id: string) => {
    setPrepayments(prepayments.filter(p => p.id !== id));
  };

  const handleReset = () => {
    setLoanAmount('5000000');
    setAnnualRate('8.5');
    setTenureYears('20');
    setPrepayments([]);
    setErrors([]);
    setNewPrepaymentMonth('');
    setNewPrepaymentAmount('');
    setNewPrepaymentDescription('');
    setPrepaymentFrequency('one-time');
    setPrepaymentStartMonth('');
    setPrepaymentStrategy('reduce-tenure');
    calculate(5000000, 8.5, 20, []);
  };

  // URL query-param sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const la = params.get('la');
    const ar = params.get('ar');
    const ty = params.get('ty');
    if (la && ar && ty) {
      setLoanAmount(la);
      setAnnualRate(ar);
      setTenureYears(ty);
      calculate(parseFloat(la), parseFloat(ar), parseFloat(ty), prepayments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('la', loanAmount);
    params.set('ar', annualRate);
    params.set('ty', tenureYears);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
  }, [loanAmount, annualRate, tenureYears]);

  // Sharing & export handlers
  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const la = parseFloat(loanAmount) || 0;
      const ar = parseFloat(annualRate) || 0;
      const ty = parseFloat(tenureYears) || 0;
      const config: PDFReportConfig = {
        title: 'EMI Calculator Report',
        subtitle: `Loan of ${fmtCurrency(la)} at ${ar}% for ${ty} years`,
        filename: 'EMI_Amortization_Schedule.pdf',
        sections: [
          {
            type: 'inputs',
            title: 'Loan Parameters',
            inputs: [
              { label: 'Loan Amount', value: fmtCurrency(la) },
              { label: 'Annual Interest Rate', value: `${ar}%` },
              { label: 'Tenure', value: `${ty} years (${ty * 12} months)` },
              { label: 'Prepayments', value: prepayments.length > 0 ? `${prepayments.length} configured` : 'None' },
            ],
          },
          {
            type: 'metrics',
            title: 'Loan Summary',
            metrics: [
              { label: 'Monthly EMI', value: fmtCurrency(emi) },
              { label: 'Total Interest', value: fmtCurrency(summary?.totalInterest || 0) },
              { label: 'Total Amount', value: fmtCurrency(summary?.totalAmount || 0) },
              { label: 'Interest Saved', value: fmtCurrency(summary?.interestSaved || 0), subtitle: summary ? `Actual tenure: ${summary.actualTenure} months` : undefined },
            ],
          },
          ...(summary && summary.interestSaved > 0 ? [{
            type: 'message' as const,
            message: {
              heading: 'Prepayment Impact',
              text: `You save ${fmtCurrency(summary.interestSaved)} in interest and reduce tenure by ${(ty * 12) - summary.actualTenure} months through prepayments.`,
            },
          }] : []),
          {
            type: 'charts' as const,
            title: 'Visual Analysis',
            charts: [
              { title: 'Loan Breakdown (Principal vs Interest)', elementId: 'emi-chart-pie' },
              { title: 'Outstanding Balance Over Time', elementId: 'emi-chart-balance' },
              { title: 'Yearly Payment Breakdown', elementId: 'emi-chart-yearly' },
              { title: 'Cumulative Payment Analysis', elementId: 'emi-chart-cumulative' },
            ],
          },
          {
            type: 'table',
            title: 'Amortization Schedule',
            table: {
              title: 'Payment Schedule',
              columns: [
                { header: 'Month', key: 'month', align: 'left' },
                { header: 'EMI', key: 'emi', align: 'right' },
                { header: 'Principal', key: 'principal', align: 'right' },
                { header: 'Interest', key: 'interest', align: 'right' },
                { header: 'Balance', key: 'balance', align: 'right' },
              ],
              rows: schedule.map(p => ({
                month: String(p.month),
                emi: fmtCurrency(p.totalPayment),
                principal: fmtCurrency(p.principal),
                interest: fmtCurrency(p.interest),
                balance: fmtCurrency(p.remainingBalance),
              })),
              maxRows: 60,
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
  }, [loanAmount, annualRate, tenureYears, emi, summary, schedule, prepayments]);

  const handleExportExcel = useCallback(() => {
    setExporting('excel');
    try {
      if (schedule.length > 0) {
        exportToExcel(schedule, 'EMI_Amortization_Schedule.xlsx');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [schedule]);

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
    const text = `Check out my EMI calculation: ₹${Number(loanAmount).toLocaleString('en-IN')} loan at ${annualRate}% for ${tenureYears} years = ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })} EMI/month!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [loanAmount, annualRate, tenureYears, emi]);

  const handleShareTwitter = useCallback(() => {
    const text = `My loan EMI: ₹${Number(loanAmount).toLocaleString('en-IN')} at ${annualRate}% for ${tenureYears} yrs = ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/month. Calculate yours:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [loanAmount, annualRate, tenureYears, emi]);

  // Chart data preparation (Recharts format)
  const chartData = useMemo(() => {
    if (schedule.length === 0) return null;
    const skipFactor = Math.max(1, Math.ceil(schedule.length / 50));

    // Balance over time
    const balanceData = schedule
      .filter((_, i) => i % skipFactor === 0 || i === schedule.length - 1)
      .map(p => ({ month: `M${p.month}`, balance: Math.round(p.remainingBalance) }));

    // Principal vs Interest per month
    const piData = schedule
      .filter((_, i) => i % skipFactor === 0 || i === schedule.length - 1)
      .map(p => ({ month: `M${p.month}`, principal: Math.round(p.principal), interest: Math.round(p.interest) }));

    // Doughnut data
    const pieData = [
      { name: 'Principal', value: parseFloat(loanAmount) || 0 },
      { name: 'Interest', value: summary?.totalInterest || 0 },
    ];

    // Yearly breakdown
    const numYears = Math.ceil(schedule.length / 12);
    const yearlyData = Array.from({ length: numYears }, (_, y) => {
      const yr = schedule.slice(y * 12, (y + 1) * 12);
      return {
        year: `Y${y + 1}`,
        principal: Math.round(yr.reduce((s, p) => s + p.principal, 0)),
        interest: Math.round(yr.reduce((s, p) => s + p.interest, 0)),
      };
    });

    // Cumulative
    let cumP = 0, cumI = 0;
    const cumulativeData = schedule
      .filter((_, i) => i % skipFactor === 0 || i === schedule.length - 1)
      .map(p => {
        // Approximate: sum up to this point
        const idx = schedule.indexOf(p);
        cumP = schedule.slice(0, idx + 1).reduce((s, x) => s + x.principal, 0);
        cumI = schedule.slice(0, idx + 1).reduce((s, x) => s + x.interest, 0);
        return { month: `M${p.month}`, cumPrincipal: Math.round(cumP), cumInterest: Math.round(cumI) };
      });

    // Interest per year
    const interestPerYear = Array.from({ length: numYears }, (_, y) => {
      const yr = schedule.slice(y * 12, (y + 1) * 12);
      return { year: `Year ${y + 1}`, interest: Math.round(yr.reduce((s, p) => s + p.interest, 0)) };
    });

    // Payment composition %
    const compositionData = schedule
      .filter((_, i) => i % skipFactor === 0 || i === schedule.length - 1)
      .map(p => {
        const total = p.principal + p.interest;
        return {
          month: `M${p.month}`,
          principalPct: total > 0 ? Math.round((p.principal / total) * 1000) / 10 : 0,
          interestPct: total > 0 ? Math.round((p.interest / total) * 1000) / 10 : 0,
        };
      });

    // Prepayment timeline
    const prepaymentData = prepayments.slice(0, 20).map(p => ({
      month: `M${p.month}`,
      amount: p.amount,
    }));

    return { balanceData, piData, pieData, yearlyData, cumulativeData, interestPerYear, compositionData, prepaymentData };
  }, [schedule, loanAmount, summary, prepayments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/20 py-3 px-4" id="emi-calculator-content">
      <article className="max-w-7xl mx-auto" itemScope itemType="https://schema.org/WebApplication">
        <header className="text-center mb-4" id="calculator">
          <h1 className="text-3xl font-bold text-slate-900 mb-1" itemProp="name">
            EMI Calculator for Home Loan, Car Loan & Personal Loan
          </h1>
          <p className="text-sm text-slate-600" itemProp="description">
            Free Advanced Loan EMI Calculator with Prepayment Impact Analysis — Reduce EMI vs Reduce Tenure Comparison
          </p>
          <meta itemProp="applicationCategory" content="FinanceApplication" />
          <meta itemProp="operatingSystem" content="Any" />
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

        {/* Compact Input Sections in Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Loan Details - Compact */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-50 text-blue-600 border border-blue-100 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">1</span>
              Loan Details
            </h2>
            
            {errors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                <p className="font-bold">Errors:</p>
                <ul className="list-disc list-inside mt-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="5000000"
                />
                <p className="text-xs text-slate-500 mt-1">
                  ₹{parseFloat(loanAmount || '0').toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="8.5"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">
                  Tenure (Years)
                </label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md text-sm"
              >
                Calculate EMI
              </button>
              <button
                onClick={handleReset}
                className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg transition duration-200 text-sm"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Prepayments - Compact */}
          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6" id="prepayment-calculator">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-cyan-50 text-cyan-600 border border-cyan-100 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">2</span>
              Loan Prepayment Calculator
            </h2>

            <div className="mb-3">
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Frequency</label>
              <div className="grid grid-cols-4 gap-2">
                {(['one-time', 'monthly', 'quarterly', 'yearly'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setPrepaymentFrequency(freq)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition ${
                      prepaymentFrequency === freq
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {freq === 'one-time' ? 'One-time' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-slate-700 font-semibold mb-2 text-sm">Strategy</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPrepaymentStrategy('reduce-tenure')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    prepaymentStrategy === 'reduce-tenure'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🎯 Reduce Tenure
                </button>
                <button
                  onClick={() => setPrepaymentStrategy('reduce-emi')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    prepaymentStrategy === 'reduce-emi'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  💰 Reduce EMI
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {prepaymentFrequency === 'one-time' ? (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">Month #</label>
                  <input
                    type="number"
                    value={newPrepaymentMonth}
                    onChange={(e) => setNewPrepaymentMonth(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                    placeholder="12"
                    min="1"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">Start Month</label>
                  <input
                    type="number"
                    value={prepaymentStartMonth}
                    onChange={(e) => setPrepaymentStartMonth(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                    placeholder="12"
                    min="1"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Amount (₹)</label>
                <input
                  type="number"
                  value={newPrepaymentAmount}
                  onChange={(e) => setNewPrepaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-sm"
                  placeholder="50000"
                  min="0"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddPrepayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md text-sm"
                >
                  + Add
                </button>
              </div>
            </div>

            {prepayments.length > 0 && (
              <div className="max-h-32 overflow-y-auto">
                <p className="text-xs font-semibold text-slate-700 mb-2">Scheduled ({prepayments.length}):</p>
                <div className="space-y-1">
                  {prepayments.slice(0, 3).map((prep) => (
                    <div key={prep.id} className="flex items-center justify-between bg-teal-50 p-2 rounded-lg border border-teal-200 text-xs">
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">
                          M{prep.month}: ₹{prep.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="ml-2 text-slate-600 text-xs">
                          {prep.strategy === 'reduce-tenure' ? '🎯' : '💰'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemovePrepayment(prep.id)}
                        className="ml-2 text-red-600 hover:text-red-800 font-semibold text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {prepayments.length > 3 && (
                    <p className="text-xs text-slate-500 text-center">+{prepayments.length - 3} more</p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Results Section */}
        {emi > 0 && summary && (
          <>
            {/* Summary Cards - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md p-4 text-white">
                <p className="text-blue-100 mb-1 text-xs font-semibold">Monthly EMI</p>
                <p className="text-3xl font-bold">₹{emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-md p-4 text-white">
                <p className="text-teal-100 mb-1 text-xs font-semibold">Total Interest</p>
                <p className="text-3xl font-bold">₹{summary.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md p-4 text-white">
                <p className="text-blue-100 mb-1 text-xs font-semibold">Total Amount</p>
                <p className="text-3xl font-bold">₹{summary.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-md p-4 text-white">
                <p className="text-teal-100 mb-1 text-xs font-semibold">Interest Saved</p>
                <p className="text-3xl font-bold">₹{summary.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                {summary.interestSaved > 0 && (
                  <p className="text-teal-100 text-xs mt-1">
                    Loan done in {summary.actualTenure} months (saved {(parseInt(tenureYears) * 12) - summary.actualTenure})
                  </p>
                )}
              </div>
            </div>



            {/* Prepayment Impact Analysis */}
            {summary.prepaymentImpacts && summary.prepaymentImpacts.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-2xl shadow-md p-5 mb-6 text-white">
                <h3 className="text-xl font-bold mb-4">📊 Prepayment Impact Analysis</h3>
                
                {/* Cumulative Impact Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-white/80 text-xs mb-1">Total Prepayments</p>
                    <p className="text-2xl font-bold">{summary.prepaymentImpacts.length}</p>
                    <p className="text-white/80 text-xs">payments made</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 text-xs mb-1">Total Interest Saved</p>
                    <p className="text-2xl font-bold">
                      ₹{summary.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-white/80 text-xs">exact savings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/80 text-xs mb-1">Total Months Saved</p>
                    <p className="text-2xl font-bold">
                      {(parseInt(tenureYears) * 12) - summary.actualTenure}
                    </p>
                    <p className="text-white/80 text-xs">{summary.actualTenure} months actual vs {parseInt(tenureYears) * 12} original</p>
                  </div>
                </div>

                {/* Completion Date Message */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-5 border-2 border-white/30">
                  <p className="text-lg font-bold mb-2">🎉 Awesome! Your loan will be completed in:</p>
                  <p className="text-3xl font-bold mb-2">
                    {Math.floor(summary.actualTenure / 12)} years {summary.actualTenure % 12} months
                  </p>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {(() => {
                      const today = new Date();
                      const completionDate = new Date(today.getFullYear(), today.getMonth() + summary.actualTenure, today.getDate());
                      const monthsSaved = (parseInt(tenureYears) * 12) - summary.actualTenure;
                      const hasReduceEMI = summary.prepaymentImpacts.some(p => p.strategy === 'reduce-emi');
                      const hasReduceTenure = summary.prepaymentImpacts.some(p => p.strategy === 'reduce-tenure');
                      const allReduceEMI = summary.prepaymentImpacts.length > 0 && summary.prepaymentImpacts.every(p => p.strategy === 'reduce-emi');
                      const reduceEmiImpacts = summary.prepaymentImpacts.filter(p => p.strategy === 'reduce-emi');
                      const firstReduceEmi = reduceEmiImpacts[0];
                      const lastReduceEmi = reduceEmiImpacts[reduceEmiImpacts.length - 1];
                      const fromEmi = firstReduceEmi?.oldEMI ?? emi;
                      const toEmi = lastReduceEmi?.newEMI ?? emi;
                      
                      return (
                        <>
                          Expected completion: <span className="font-bold">{completionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          <br />
                          {monthsSaved > 0 ? (
                            <>
                              You're saving <span className="font-bold">{monthsSaved} months</span> from your original {parseInt(tenureYears) * 12}-month tenure!
                              {allReduceEMI && (
                                <>
                                  <br />
                                  💡 <em>With EMI reduction strategy: Although the tenure doesn't decrease with each prepayment, your disciplined prepayments reduce the principal faster. This completes your loan <span className="font-bold">{monthsSaved} months earlier</span> than the original schedule!</em>
                                </>
                              )}
                              {hasReduceEMI && hasReduceTenure && (
                                <>
                                  <br />
                                  💡 <em>You're using a mix of strategies - some prepayments reduce tenure directly, others reduce EMI but collectively accelerate loan completion!</em>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {allReduceEMI ? (
                                <>
                                  💰 <strong>EMI Reduction Strategy:</strong> With this approach, your <span className="font-bold">monthly EMI burden is reduced from ₹{fromEmi.toLocaleString('en-IN', { maximumFractionDigits: 0 })} to ₹{toEmi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> as you make prepayments.
                                  <br />
                                  The loan tenure remains at {parseInt(tenureYears)} years, but you enjoy <span className="font-bold">lower monthly payments</span> throughout, giving you more cash flow flexibility!
                                </>
                              ) : (
                                <>Original {parseInt(tenureYears) * 12}-month tenure maintained.</>
                              )}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </p>
                </div>

                {/* Individual Impact Table */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 overflow-x-auto max-h-80 overflow-y-auto">
                  <h4 className="text-base font-bold mb-3">Individual Prepayment Impacts</h4>
                  <table className="min-w-full text-xs">
                    <thead className="border-b border-white/20 sticky top-0 z-10 bg-slate-900/70 backdrop-blur">
                      <tr>
                        <th className="px-3 py-2 text-left text-white/90">#</th>
                        <th className="px-3 py-2 text-left text-white/90">Month</th>
                        <th className="px-3 py-2 text-left text-white/90">Amount</th>
                        <th className="px-3 py-2 text-left text-white/90">Strategy</th>
                        <th className="px-3 py-2 text-left text-white/90">Old EMI</th>
                        <th className="px-3 py-2 text-left text-white/90">New EMI</th>
                        <th className="px-3 py-2 text-left text-white/90">Old Months</th>
                        <th className="px-3 py-2 text-left text-white/90">New Months</th>
                        <th className="px-3 py-2 text-left text-white/90">Interest Saved</th>
                        <th className="px-3 py-2 text-left text-white/90">Cum. Saved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.prepaymentImpacts.map((impact, index) => (
                        <tr key={impact.prepaymentId} className="border-b border-white/10 hover:bg-white/5">
                          <td className="px-3 py-2 font-semibold">{index + 1}</td>
                          <td className="px-3 py-2">M{impact.prepaymentMonth}</td>
                          <td className="px-3 py-2 font-semibold">₹{impact.prepaymentAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              impact.strategy === 'reduce-tenure' 
                                ? 'bg-blue-500/30 text-blue-100' 
                                : 'bg-teal-500/30 text-teal-100'
                            }`}>
                              {impact.strategy === 'reduce-tenure' ? '🎯 Tenure' : '💰 EMI'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-white/80">
                            ₹{impact.oldEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-3 py-2 font-semibold">
                            {impact.newEMI > 0
                              ? `₹${impact.newEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                              : '✅ Paid off'}
                          </td>
                          <td className="px-3 py-2 text-white/80">{impact.oldRemainingMonths}</td>
                          <td className="px-3 py-2 font-semibold">
                            {impact.newRemainingMonths === 0 ? '✅ Done' : impact.newRemainingMonths}
                          </td>
                          <td className="px-3 py-2 text-teal-200 font-semibold">
                            ₹{impact.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-3 py-2 font-bold text-yellow-200">
                            ₹{impact.cumulativeInterestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Charts Grid */}
            {chartData && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Donut Chart */}
                  <div id="emi-chart-pie" className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Loan Breakdown</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={chartData.pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                            {chartData.pieData.map((_, idx) => (
                              <Cell key={idx} fill={PIE_COLORS[idx]} stroke={PIE_COLORS[idx]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<ChartTooltip />} />
                          <Legend formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Balance Area Chart */}
                  <div id="emi-chart-balance" className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Outstanding Balance</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.balanceData}>
                          <defs>
                            <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                          <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <RechartsTooltip content={<ChartTooltip />} />
                          <Area type="monotone" dataKey="balance" name="Balance" stroke={CHART_COLORS.primary} fill="url(#balGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Principal vs Interest Stacked Area */}
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Principal vs Interest</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.piData}>
                          <defs>
                            <linearGradient id="piPrinGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="piIntGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.4} />
                              <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                          <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <RechartsTooltip content={<ChartTooltip />} />
                          <Legend formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>} />
                          <Area type="monotone" dataKey="principal" name="Principal" stackId="1" stroke={CHART_COLORS.primary} fill="url(#piPrinGrad)" strokeWidth={2} />
                          <Area type="monotone" dataKey="interest" name="Interest" stackId="1" stroke={CHART_COLORS.secondary} fill="url(#piIntGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Yearly Payment Bar Chart */}
                  <div id="emi-chart-yearly" className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Yearly Payment Breakdown</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.yearlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                          <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <RechartsTooltip content={<ChartTooltip />} />
                          <Legend formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>} />
                          <Bar dataKey="principal" name="Principal" stackId="a" fill={CHART_COLORS.primary} radius={[0, 0, 0, 0]} />
                          <Bar dataKey="interest" name="Interest" stackId="a" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Cumulative Chart */}
                <div id="emi-chart-cumulative" className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Cumulative Payment Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.cumulativeData}>
                        <defs>
                          <linearGradient id="cumPGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="cumIGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                        <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                        <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                        <RechartsTooltip content={<ChartTooltip />} />
                        <Legend formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>} />
                        <Area type="monotone" dataKey="cumPrincipal" name="Cumulative Principal" stroke={CHART_COLORS.primary} fill="url(#cumPGrad)" strokeWidth={2} />
                        <Area type="monotone" dataKey="cumInterest" name="Cumulative Interest" stroke={CHART_COLORS.secondary} fill="url(#cumIGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Advanced Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Interest Per Year */}
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Interest Paid Per Year</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.interestPerYear}>
                          <defs>
                            <linearGradient id="intYrGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                          <XAxis dataKey="year" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <RechartsTooltip content={<ChartTooltip />} />
                          <Area type="monotone" dataKey="interest" name="Interest Paid" stroke={CHART_COLORS.secondary} fill="url(#intYrGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Payment Composition % */}
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Payment Composition Over Time</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.compositionData}>
                          <defs>
                            <linearGradient id="pctPGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="pctIGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.4} />
                              <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                          <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <RechartsTooltip content={<PctTooltip />} />
                          <Legend formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>} />
                          <Area type="monotone" dataKey="principalPct" name="Principal %" stackId="1" stroke={CHART_COLORS.primary} fill="url(#pctPGrad)" strokeWidth={2} />
                          <Area type="monotone" dataKey="interestPct" name="Interest %" stackId="1" stroke={CHART_COLORS.secondary} fill="url(#pctIGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Prepayment Timeline */}
                {prepayments.length > 0 && chartData.prepaymentData.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Prepayment Timeline Impact</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.prepaymentData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                          <XAxis dataKey="month" stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <YAxis tickFormatter={formatYAxis} stroke={CHART_COLORS.axis} fontSize={11} tickLine={false} />
                          <RechartsTooltip content={<ChartTooltip />} />
                          <Bar dataKey="amount" name="Prepayment" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Compact Amortization Table */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Payment Schedule (First 12 Months)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">EMI</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Principal</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Interest</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Prepay</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {schedule.slice(0, 12).map((payment) => (
                      <tr 
                        key={payment.month} 
                        className={`hover:bg-blue-50 transition ${payment.prepaymentAmount ? 'bg-teal-50' : ''}`}
                      >
                        <td className="px-4 py-2 whitespace-nowrap font-semibold text-slate-900">{payment.month}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-slate-900">
                          ₹{(payment.principal + payment.interest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-teal-600 font-semibold">
                          ₹{payment.principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-orange-600">
                          ₹{payment.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap font-bold text-teal-700">
                          {payment.prepaymentAmount ? `₹${payment.prepaymentAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '-'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-slate-900 font-semibold">
                          ₹{payment.remainingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-center py-4 border-t border-slate-200">
                  <p className="text-slate-600 text-sm">
                    Showing first 12 months of {schedule.length} total months
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">📊 Calculation History</h2>
                <div className="flex gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={handleClearHistory}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(false)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-lg">No calculation history yet</p>
                    <p className="text-sm mt-2">Your calculations will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleLoadHistory(item)}
                        className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 border-2 border-slate-200 hover:border-blue-400 cursor-pointer transition shadow-sm hover:shadow-md"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">
                              {new Date(item.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                              ₹{item.loanAmount.toLocaleString('en-IN')} @ {item.annualRate}% for {item.tenureYears} years
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                            {item.prepayments.length} prepayments
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600 text-xs">Monthly EMI</p>
                            <p className="font-bold text-blue-600">₹{item.emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-xs">Total Interest</p>
                            <p className="font-bold text-teal-600">₹{item.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-xs">Interest Saved</p>
                            <p className="font-bold text-teal-600">₹{item.interestSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-xs">Actual Tenure</p>
                            <p className="font-bold text-blue-600">{Math.floor(item.actualTenure / 12)}y {item.actualTenure % 12}m</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Button - Floating */}
        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl transition duration-200 flex items-center gap-2 z-40"
          >
            📊 History ({history.length})
          </button>
        )}

      </article>
    </div>
  );
};

export default EMICalculator;
