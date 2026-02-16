import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMortgagePayoff } from '../../hooks/useMortgagePayoff';
import {
  formatCurrency,
  formatPercent,
  formatMonths,
} from './MortgagePayoffCalculator.utils';
import { exportToExcel } from '../../utils/excel';
import {
  generatePDFReport,
  type PDFReportConfig,
} from '../../utils/pdf';
import { CHART_COLORS as BASE_COLORS } from '../../utils/chartColors';

const COLORS = {
  prepay: BASE_COLORS.primary,
  invest: BASE_COLORS.teal,
  accent: BASE_COLORS.accent,
  rose: BASE_COLORS.rose,
};

/* ─── Custom Tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 px-4 py-3">
      <p className="text-sm font-bold text-slate-900">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs mt-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

const formatYAxis = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

/* ─── FAQ Item ─── */
interface FAQItemProps {
  question: string;
  answer: string;
}
const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 pb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-sm font-semibold text-slate-800">{question}</h3>
        <span className="text-slate-400 text-lg">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-2 text-xs text-slate-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const MortgagePayoffCalculator: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useMortgagePayoff();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'networth' | 'comparison'>(
    'networth'
  );
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  // Yearly data for charts (every 12 months)
  const yearlyData = result.monthlyData
    .filter((d) => d.month % 12 === 0)
    .map((d) => ({
      name: `Year ${d.year}`,
      'Prepay Path': Math.round(d.prepayNetWorth),
      'Invest Path': Math.round(d.investNetWorth),
    }));

  // Bar chart data for interest/profit comparison
  const comparisonData = [
    {
      name: 'Prepay Path',
      'Interest Saved': Math.round(result.scenarioA.interestSaved),
      'Portfolio Growth': Math.round(result.scenarioA.finalPortfolioValue),
    },
    {
      name: 'Invest Path',
      'After-Tax Portfolio': Math.round(result.scenarioB.finalPortfolioValue),
      'Tax Paid': Math.round(result.scenarioB.taxPaid),
    },
  ];

  /* ─── Copy URL ─── */
  const handleCopyURL = useCallback(() => {
    const params = new URLSearchParams({
      balance: String(inputs.currentBalance),
      rate: String(inputs.interestRate),
      tenure: String(inputs.remainingTenure),
      emi: String(inputs.monthlyEMI),
      lump: String(inputs.lumpSumAmount),
      extra: String(inputs.extraMonthlyPayment),
      roi: String(inputs.expectedMarketReturn),
      tax: String(inputs.capitalGainsTax),
    });
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inputs]);

  /* ─── Export PDF ─── */
  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const fmt = (v: number) => '$' + Math.round(v).toLocaleString('en-US');
      const config: PDFReportConfig = {
        title: 'Mortgage Payoff vs Investment Report',
        subtitle: `${formatMonths(inputs.remainingTenure)} Horizon Analysis`,
        filename: 'Mortgage_Payoff_vs_Investment.pdf',
        sections: [
          {
            type: 'inputs',
            title: 'Scenario Parameters',
            inputs: [
              { label: 'Loan Balance', value: fmt(inputs.currentBalance) },
              { label: 'Interest Rate', value: `${inputs.interestRate}%` },
              { label: 'Remaining Tenure', value: formatMonths(inputs.remainingTenure) },
              { label: 'Monthly EMI', value: fmt(inputs.monthlyEMI) },
              { label: 'Lump Sum', value: fmt(inputs.lumpSumAmount) },
              { label: 'Extra Monthly', value: fmt(inputs.extraMonthlyPayment) },
              { label: 'Expected Market Return', value: `${inputs.expectedMarketReturn}%` },
              { label: 'Capital Gains Tax', value: `${inputs.capitalGainsTax}%` },
            ],
          },
          {
            type: 'metrics',
            title: 'Results Summary',
            metrics: [
              { label: 'Winner', value: result.winner === 'prepay' ? 'Prepay Mortgage' : result.winner === 'invest' ? 'Invest in Market' : 'Too Close to Call' },
              { label: 'Net Worth Difference', value: fmt(result.netWorthDiff) },
              { label: 'Breakeven ROI', value: `${result.breakevenROI}%` },
              { label: 'Interest Saved (Prepay)', value: fmt(result.scenarioA.interestSaved) },
              { label: 'After-Tax Portfolio (Invest)', value: fmt(result.scenarioB.finalPortfolioValue) },
            ],
          },
          {
            type: 'charts',
            charts: [{ title: 'Net Worth Race', elementId: 'networth-chart' }],
          },
        ],
      };
      await generatePDFReport(config);
    } finally {
      setExporting(null);
    }
  }, [inputs, result]);

  /* ─── Export Excel ─── */
  const handleExportExcel = useCallback(() => {
    setExporting('excel');
    try {
      const data = result.monthlyData
        .filter((d) => d.month % 12 === 0)
        .map((d) => ({
          Year: d.year,
          'Prepay Balance': Math.round(d.prepayBalance),
          'Prepay Equity': Math.round(d.prepayEquity),
          'Prepay Portfolio': Math.round(d.prepayPortfolio),
          'Prepay Net Worth': Math.round(d.prepayNetWorth),
          'Invest Balance': Math.round(d.investBalance),
          'Invest Equity': Math.round(d.investEquity),
          'Invest Portfolio': Math.round(d.investPortfolio),
          'Invest Net Worth': Math.round(d.investNetWorth),
        }));
      exportToExcel(data as any, 'Mortgage_Payoff_vs_Investment.xlsx');
    } finally {
      setExporting(null);
    }
  }, [result]);

  /* ─── Share WhatsApp ─── */
  const handleShareWhatsApp = useCallback(() => {
    const winnerLabel =
      result.winner === 'prepay'
        ? 'Prepaying the mortgage'
        : result.winner === 'invest'
        ? 'Investing in the market'
        : 'Both strategies are close';
    const msg = `*Mortgage Payoff vs Investment Analysis*\n\n${winnerLabel} wins by ${formatCurrency(result.netWorthDiff)}!\nBreakeven ROI: ${result.breakevenROI}%\n\nTry it: ${window.location.href}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  }, [result]);

  /* ─── Share Twitter ─── */
  const handleShareTwitter = useCallback(() => {
    const text = `Should I pay off my mortgage or invest? The math says ${result.winner === 'invest' ? 'invest' : result.winner === 'prepay' ? 'prepay' : "it's close"} — by ${formatCurrency(result.netWorthDiff)}! Try this free calculator:`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-3 px-4">
      <article className="max-w-7xl mx-auto">
        <div id="mortgage-payoff-content">
          {/* ─── Header ─── */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Opportunity Cost Calculator
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mortgage Payoff vs. Investment
            </h1>
            <p className="mt-2 text-slate-500 text-sm max-w-2xl mx-auto">
              Should you pay off your mortgage early or invest the extra cash in
              the stock market? Run the numbers and find out.
            </p>
          </div>

          {/* ─── Export Bar ─── */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <button
              onClick={handleExportPDF}
              disabled={exporting === 'pdf'}
              className="flex items-center gap-2 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {exporting === 'pdf' ? '⏳ Generating…' : '📄 Export PDF'}
            </button>
            <button
              onClick={handleExportExcel}
              disabled={exporting === 'excel'}
              className="flex items-center gap-2 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 text-slate-600 hover:text-emerald-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {exporting === 'excel' ? '⏳ Exporting…' : '📊 Export Excel'}
            </button>
            <button
              onClick={handleCopyURL}
              className="flex items-center gap-2 bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-slate-600 hover:text-blue-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              {copied ? '✅ Copied!' : '🔗 Copy URL'}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 bg-white hover:bg-green-50 border border-slate-100 hover:border-green-200 text-slate-600 hover:text-green-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              💬 WhatsApp
            </button>
            <button
              onClick={handleShareTwitter}
              className="flex items-center gap-2 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 text-slate-600 hover:text-sky-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              🐦 Twitter
            </button>
          </div>

          {/* ─── Main Grid: Inputs + Results ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* ── LEFT: Inputs ── */}
            <div className="space-y-6">
              {/* Loan Details */}
              <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  🏠 Current Loan Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Outstanding Balance ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.currentBalance}
                      onChange={(e) =>
                        updateInputs({
                          currentBalance: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      min={0}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(inputs.currentBalance)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.interestRate}
                      onChange={(e) =>
                        updateInputs({
                          interestRate: Number(e.target.value),
                        })
                      }
                      step={0.1}
                      min={0}
                      max={30}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                    <input
                      type="range"
                      value={inputs.interestRate}
                      onChange={(e) =>
                        updateInputs({
                          interestRate: Number(e.target.value),
                        })
                      }
                      min={0}
                      max={15}
                      step={0.1}
                      className="w-full mt-1 accent-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Remaining Tenure (months)
                    </label>
                    <input
                      type="number"
                      value={inputs.remainingTenure}
                      onChange={(e) =>
                        updateInputs({
                          remainingTenure: Number(e.target.value),
                        })
                      }
                      min={1}
                      max={480}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formatMonths(inputs.remainingTenure)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Monthly EMI ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.monthlyEMI}
                      onChange={(e) =>
                        updateInputs({
                          monthlyEMI: Number(e.target.value),
                        })
                      }
                      min={0}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(inputs.monthlyEMI)}/mo
                    </p>
                  </div>
                </div>
              </section>

              {/* Extra Capital */}
              <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  💰 Extra Capital
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Lump Sum Amount ($)
                      <span
                        title="One-time windfall available right now to either pay down mortgage or invest."
                        className="ml-1 cursor-help"
                      >
                        ℹ️
                      </span>
                    </label>
                    <input
                      type="number"
                      value={inputs.lumpSumAmount}
                      onChange={(e) =>
                        updateInputs({
                          lumpSumAmount: Number(e.target.value),
                        })
                      }
                      min={0}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(inputs.lumpSumAmount)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Extra Monthly ($)
                      <span
                        title="Additional monthly amount beyond your regular EMI that you can allocate."
                        className="ml-1 cursor-help"
                      >
                        ℹ️
                      </span>
                    </label>
                    <input
                      type="number"
                      value={inputs.extraMonthlyPayment}
                      onChange={(e) =>
                        updateInputs({
                          extraMonthlyPayment: Number(e.target.value),
                        })
                      }
                      min={0}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(inputs.extraMonthlyPayment)}/mo
                    </p>
                  </div>
                </div>
              </section>

              {/* Investment Parameters */}
              <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  📈 Investment Parameters
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Expected Market Return (%)
                      <span
                        title="Expected annual ROI from market investments (e.g., 10% for S&P 500 historical average)."
                        className="ml-1 cursor-help"
                      >
                        ℹ️
                      </span>
                    </label>
                    <input
                      type="number"
                      value={inputs.expectedMarketReturn}
                      onChange={(e) =>
                        updateInputs({
                          expectedMarketReturn: Number(e.target.value),
                        })
                      }
                      step={0.5}
                      min={-20}
                      max={50}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                    <input
                      type="range"
                      value={inputs.expectedMarketReturn}
                      onChange={(e) =>
                        updateInputs({
                          expectedMarketReturn: Number(e.target.value),
                        })
                      }
                      min={-10}
                      max={20}
                      step={0.5}
                      className="w-full mt-1 accent-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-sm">
                      Capital Gains Tax (%)
                      <span
                        title="Tax rate applied to investment profits when you sell."
                        className="ml-1 cursor-help"
                      >
                        ℹ️
                      </span>
                    </label>
                    <input
                      type="number"
                      value={inputs.capitalGainsTax}
                      onChange={(e) =>
                        updateInputs({
                          capitalGainsTax: Number(e.target.value),
                        })
                      }
                      step={1}
                      min={0}
                      max={50}
                      className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    />
                    <input
                      type="range"
                      value={inputs.capitalGainsTax}
                      onChange={(e) =>
                        updateInputs({
                          capitalGainsTax: Number(e.target.value),
                        })
                      }
                      min={0}
                      max={40}
                      step={1}
                      className="w-full mt-1 accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Advanced Toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition flex items-center gap-1"
                >
                  {showAdvanced ? '▲ Hide' : '▼ Show'} Advanced
                </button>
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-4 mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <label className="block text-slate-700 font-medium mb-1 text-xs">
                            Mortgage Interest Tax Deduction (%)
                            <span
                              title="Your marginal tax bracket if mortgage interest is deductible. Set to 0 if not applicable."
                              className="ml-1 cursor-help"
                            >
                              ℹ️
                            </span>
                          </label>
                          <input
                            type="number"
                            value={inputs.mortgageTaxDeduction}
                            onChange={(e) =>
                              updateInputs({
                                mortgageTaxDeduction: Number(e.target.value),
                              })
                            }
                            step={1}
                            min={0}
                            max={50}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Reset Button */}
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition text-sm"
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* ── RIGHT: Results ── */}
            <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
              {/* Winner Banner */}
              <div
                className={`rounded-2xl shadow-md p-5 text-white ${
                  result.winner === 'prepay'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : result.winner === 'invest'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    : 'bg-gradient-to-br from-slate-500 to-slate-600'
                }`}
              >
                <p className="text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">
                  The Winner
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold mb-1">
                  {result.winner === 'prepay'
                    ? '🏠 Prepay Your Mortgage'
                    : result.winner === 'invest'
                    ? '📈 Invest in the Market'
                    : '⚖️ Too Close to Call'}
                </p>
                <p className="text-white/90 text-sm">
                  Net worth difference:{' '}
                  <span className="font-bold">
                    {formatCurrency(result.netWorthDiff)}
                  </span>{' '}
                  over {formatMonths(inputs.remainingTenure)}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                  <p className="text-slate-500 text-xs font-semibold mb-1">
                    Breakeven ROI
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatPercent(result.breakevenROI)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Min. return to beat prepaying
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                  <p className="text-slate-500 text-xs font-semibold mb-1">
                    Interest Saved
                  </p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(result.scenarioA.interestSaved)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    By prepaying the mortgage
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4">
                  <p className="text-slate-500 text-xs font-semibold mb-1">
                    Months Saved
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {result.scenarioA.monthsSaved}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatMonths(result.scenarioA.monthsSaved)} earlier payoff
                  </p>
                </div>
              </div>

              {/* Scenario Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Scenario A */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS.prepay }}
                    />
                    <h3 className="text-sm font-bold text-slate-800">
                      Scenario A: Prepay
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">New Tenure</span>
                      <span className="font-semibold text-slate-800">
                        {formatMonths(result.scenarioA.newTenureMonths)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest Paid</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(result.scenarioA.totalInterestPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Portfolio Value</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          result.scenarioA.finalPortfolioValue
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-700 font-semibold">
                        Final Net Worth
                      </span>
                      <span className="font-bold text-indigo-600">
                        {formatCurrency(result.scenarioA.finalNetWorth)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scenario B */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS.invest }}
                    />
                    <h3 className="text-sm font-bold text-slate-800">
                      Scenario B: Invest
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Contributed</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          result.scenarioB.totalInvestmentContributed
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gross Profit</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(result.scenarioB.grossProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tax Paid</span>
                      <span className="font-semibold text-rose-500">
                        -{formatCurrency(result.scenarioB.taxPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-700 font-semibold">
                        Final Net Worth
                      </span>
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(result.scenarioB.finalNetWorth)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cheap Debt Flag */}
              {result.cheapDebtFlag && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm font-semibold flex items-center gap-2">
                    💡 {result.cheapDebtMessage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Charts ─── */}
          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('networth')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'networth'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Net Worth Comparison
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'comparison'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Interest vs Profit
              </button>
            </div>

            {activeTab === 'networth' && (
              <div id="networth-chart" className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearlyData}>
                    <defs>
                      <linearGradient
                        id="gradPrepay"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.prepay}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.prepay}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gradInvest"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.invest}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.invest}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={BASE_COLORS.grid}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      stroke={BASE_COLORS.axis}
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      tick={{ fontSize: 11 }}
                      stroke={BASE_COLORS.axis}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Prepay Path"
                      stroke={COLORS.prepay}
                      fill="url(#gradPrepay)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Invest Path"
                      stroke={COLORS.invest}
                      fill="url(#gradInvest)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'comparison' && (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={BASE_COLORS.grid}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      stroke={BASE_COLORS.axis}
                    />
                    <YAxis
                      tickFormatter={formatYAxis}
                      tick={{ fontSize: 11 }}
                      stroke={BASE_COLORS.axis}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="Interest Saved"
                      fill={COLORS.prepay}
                      stackId="a"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Portfolio Growth"
                      fill={COLORS.accent}
                      stackId="a"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="After-Tax Portfolio"
                      fill={COLORS.invest}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Tax Paid"
                      fill={COLORS.rose}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* ─── Insight Cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="text-3xl mb-2">🧮</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                The Math vs. The Feeling
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mathematically, if your expected investment return exceeds your
                mortgage rate after tax, investing wins. But the psychological
                value of being debt-free is real and personal.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Consider Opportunity Cost
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every dollar sent to prepay your mortgage is a dollar not
                compounding in the market. Over 20+ years this can mean hundreds
                of thousands in foregone gains.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Risk Matters
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prepaying guarantees savings equal to your mortgage rate. Market
                returns are uncertain — past performance is no guarantee. Your
                risk tolerance matters as much as the numbers.
              </p>
            </div>
          </div>

          {/* ─── FAQ ─── */}
          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              <FAQItem
                question="How accurate is this calculator?"
                answer="This calculator provides estimates based on constant rates of return and regular payments. Real-world results vary due to market volatility, variable interest rates, and changes in personal circumstances. Use it as a directional guide, not a guarantee."
              />
              <FAQItem
                question="What does the breakeven ROI mean?"
                answer="The breakeven ROI is the minimum annualized market return you would need to earn for investing to match the benefit of prepaying your mortgage. If you expect to earn above this rate, the math favors investing."
              />
              <FAQItem
                question="Should I consider tax implications?"
                answer="Yes. If your mortgage interest is tax-deductible, your effective mortgage rate is lower, making investing more attractive. Similarly, capital gains tax reduces your investment returns. This calculator accounts for both."
              />
              <FAQItem
                question="What if the market crashes?"
                answer="Market volatility is the key risk of the investing path. Try setting the Expected Market Return to 0% or negative to see the worst-case scenario. Prepaying your mortgage is a guaranteed 'return' equal to your interest rate."
              />
              <FAQItem
                question="Does this account for inflation?"
                answer="This calculator uses nominal returns (not inflation-adjusted). Both the mortgage rate and market return are in nominal terms, so the comparison remains valid. For a more conservative analysis, reduce the expected market return by 2-3%."
              />
            </div>
          </section>

          {/* ─── SEO Content ─── */}
          <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Understanding the Mortgage Payoff vs. Investment Decision
            </h2>
            <div className="prose max-w-none text-slate-700 space-y-3 text-sm leading-relaxed">
              <p>
                One of the most debated questions in personal finance is whether
                to pay off your mortgage early or invest the extra money in the
                stock market. This calculator helps you make an informed decision
                by running a dual-simulation engine that compares both strategies
                side by side over your remaining loan term.
              </p>
              <p>
                The core tension is simple: your mortgage charges you interest
                (say 6.5% per year), while the stock market has historically
                returned about 10% per year on average. On the surface, investing
                seems like the clear winner. But the real answer depends on
                several factors including tax deductions, capital gains taxes,
                your risk tolerance, and the psychological value of being
                debt-free.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                How the Two Paths Work
              </h3>
              <p>
                <strong>The Prepay Path (Scenario A)</strong> takes your extra
                capital — both the lump sum and monthly surplus — and applies it
                directly to your mortgage principal. This accelerates your
                payoff, saving you thousands in interest. Once the mortgage is
                paid off early, you redirect your entire former payment (EMI +
                extra) into market investments for the remaining months until the
                original loan end-date.
              </p>
              <p>
                <strong>The Invest Path (Scenario B)</strong> keeps your
                mortgage on its original schedule and puts all extra capital into
                a market investment portfolio from day one. The lump sum starts
                compounding immediately, and the monthly surplus is added each
                month. At the horizon date, capital gains tax is applied to the
                profits.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                Key Factors in the Decision
              </h3>
              <p>
                <strong>Interest Rate vs. Market Return:</strong> The wider the
                gap between your expected market return and your mortgage rate,
                the more investing is favored. A 6.5% mortgage vs. a 10% market
                return leaves a 3.5% spread — significant over decades.
              </p>
              <p>
                <strong>Tax Efficiency:</strong> Mortgage interest deductions
                effectively lower your borrowing cost. If you are in the 22% tax
                bracket and can deduct interest, your effective rate drops from
                6.5% to roughly 5.1%. Meanwhile, investment gains are taxed upon
                sale — typically at 15% for long-term capital gains. This
                calculator factors in both effects.
              </p>
              <p>
                <strong>Time Horizon:</strong> The longer your remaining tenure,
                the more compounding works in favor of the invest path. Over 25+
                years, even modest differences in annual return compound into
                large differences in final net worth.
              </p>
              <p>
                <strong>Risk Tolerance:</strong> Market returns are not
                guaranteed. Paying off your mortgage provides a guaranteed
                &quot;return&quot; equal to your interest rate. If you lose sleep
                over market volatility, the peace of mind from being debt-free
                has real value that no calculator can quantify.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                The Breakeven ROI Explained
              </h3>
              <p>
                The breakeven ROI is the minimum market return where investing
                exactly ties with prepaying. If your mortgage rate is 6.5% and
                the breakeven shows 7.2%, you know that any expected return above
                7.2% makes investing the mathematically superior choice. This
                accounts for taxes, the time value of the prepayment gap, and the
                post-payoff investing period.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                When Prepaying Makes More Sense
              </h3>
              <p>
                Prepaying is often better when your mortgage rate is high
                (above 7%), when you are risk-averse, when you are close to
                retirement and want to reduce fixed expenses, or when the market
                outlook is uncertain. It is also psychologically powerful — being
                completely debt-free changes your relationship with money and
                reduces financial stress.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                When Investing Makes More Sense
              </h3>
              <p>
                Investing tends to win when your mortgage rate is low
                (below 5%), when you have a long time horizon (20+ years),
                when you can stomach market volatility, and when you maximize tax
                advantages. If your effective mortgage rate after deductions is
                below 5%, your debt is essentially &quot;cheap money&quot; — borrowing at
                4% to earn 10% is a positive carry trade that wealthy investors
                use regularly.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mt-6">
                Making the Right Choice for You
              </h3>
              <p>
                There is no universally correct answer. The best approach often
                combines both strategies: maintain an emergency fund, max out
                tax-advantaged retirement accounts, make some extra mortgage
                payments for peace of mind, and invest the rest. Use this
                calculator to understand the mathematical trade-offs, then factor
                in your personal risk tolerance, job stability, and financial
                goals to make the decision that lets you sleep well at night.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};

export default MortgagePayoffCalculator;
