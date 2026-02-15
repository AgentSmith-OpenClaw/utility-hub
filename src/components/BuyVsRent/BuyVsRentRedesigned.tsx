import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useBuyVsRent } from '../../hooks/useBuyVsRent';
import { formatCurrency, formatPercent } from './BuyVsRent.utils';
import { exportToExcel } from '../../utils/excel';
import { exportToPDF } from '../../utils/pdf';

const CHART_COLORS = {
  buying: '#3b82f6',
  renting: '#10b981',
  buyingGradient: ['#6366f1', '#3b82f6'],
  rentingGradient: ['#10b981', '#14b8a6'],
};

export const BuyVsRentRedesigned: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useBuyVsRent();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'networth' | 'breakdown'>('networth');
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [copied, setCopied] = useState(false);

  // Sample data for charts (every 12 months)
  const yearlyData = result.monthlyData.filter((d) => d.month % 12 === 0 || d.month === result.monthlyData.length);

  const handleCalculate = () => {
    // Force recalculation (already happens automatically via hook)
  };

  const handleExportPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      await exportToPDF('buy-vs-rent-content', 'Buy_vs_Rent_Analysis.pdf', {
        title: 'Buy vs Rent Analysis',
        orientation: 'portrait',
        quality: 0.92,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, []);

  const handleExportExcel = useCallback(() => {
    setExporting('excel');
    try {
      const data = result.monthlyData.map((d, i) => ({
        Month: i + 1,
        Year: Math.floor(i / 12) + 1,
        'Buying Net Worth': Math.round(d.buyingNetWorth),
        'Renting Net Worth': Math.round(d.rentingNetWorth),
        'Buying Cumulative Cost': Math.round(d.cumulativeMortgagePayments + d.cumulativePropertyTax + d.cumulativeInsurance + d.cumulativeHOA + d.cumulativeMaintenance),
        'Renting Cumulative Cost': Math.round(d.cumulativeRent + d.cumulativeRentersInsurance),
      }));
      // Generic Excel export - cast to any to avoid type issues
      exportToExcel(data as any, 'Buy_vs_Rent_Comparison.xlsx');
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(null);
    }
  }, [result.monthlyData]);

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
    const text = `Check out my Buy vs Rent analysis: ${result.recommendation === 'buy' ? 'Buying' : 'Renting'} is better for me with a ${formatCurrency(Math.abs(result.netWorthDifference))} advantage over ${inputs.yearsToAnalyze} years!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, [result.recommendation, result.netWorthDifference, inputs.yearsToAnalyze]);

  const handleShareTwitter = useCallback(() => {
    const text = `${result.recommendation === 'buy' ? '🏠 Buying' : '🏢 Renting'} is the smarter choice for me! Net worth difference: ${formatCurrency(Math.abs(result.netWorthDifference))} over ${inputs.yearsToAnalyze} years. Analyze your decision:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  }, [result.recommendation, result.netWorthDifference, inputs.yearsToAnalyze]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-3 px-4">
      <article className="max-w-7xl mx-auto" itemScope itemType="https://schema.org/WebApplication">
        <header className="text-center mb-4">
          <h1 className="text-3xl font-bold text-slate-900 mb-1" itemProp="name">
            Buy vs Rent Calculator — Smart Housing Decision Tool
          </h1>
          <p className="text-sm text-slate-600" itemProp="description">
            Compare net worth impact, opportunity costs, and break-even analysis for buying vs renting a home
          </p>
          <meta itemProp="applicationCategory" content="FinanceApplication" />
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

        <div id="buy-vs-rent-content">

        {/* Quick Compare - Essential Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-50 text-blue-600 border border-blue-100 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">1</span>
              Quick Compare
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">
                  Home Price ($)
                </label>
                <input
                  type="number"
                  value={inputs.homePrice}
                  onChange={(e) => updateInputs({ homePrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="500000"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formatCurrency(inputs.homePrice)}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">
                  Down Payment (%)
                </label>
                <input
                  type="number"
                  value={inputs.downPaymentPercent}
                  onChange={(e) => updateInputs({ downPaymentPercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  value={inputs.monthlyRent}
                  onChange={(e) => updateInputs({ monthlyRent: Number(e.target.value) })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="2500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formatCurrency(inputs.monthlyRent)}/mo
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-sm">
                  Years to Analyze
                </label>
                <input
                  type="number"
                  value={inputs.yearsToAnalyze}
                  onChange={(e) => updateInputs({ yearsToAnalyze: Number(e.target.value) })}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg transition duration-200 text-sm flex items-center justify-center gap-2"
              >
                <span>{showAdvanced ? '▲' : '▼'}</span>
                Advanced Settings
              </button>
              <button
                onClick={reset}
                className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg transition duration-200 text-sm"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Key Results at Top */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm">2</span>
              Quick Results
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Monthly Mortgage:</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(result.monthlyMortgage)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Monthly Rent:</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(inputs.monthlyRent)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">Upfront Cost to Buy:</span>
                  <span className="text-lg font-bold text-slate-800">
                    {formatCurrency(result.downPayment + result.closingCosts)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings - Collapsible */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Buying Costs */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Buying Costs</h3>
                  <div className="space-y-3">
                    <InputField
                      label="Interest Rate (%)"
                      value={inputs.interestRate}
                      onChange={(val) => updateInputs({ interestRate: val })}
                    />
                    <InputField
                      label="Loan Term (years)"
                      value={inputs.loanTermYears}
                      onChange={(val) => updateInputs({ loanTermYears: val })}
                    />
                    <InputField
                      label="Property Tax Rate (%)"
                      value={inputs.propertyTaxRate}
                      onChange={(val) => updateInputs({ propertyTaxRate: val })}
                    />
                    <InputField
                      label="Home Insurance ($/yr)"
                      value={inputs.homeInsurance}
                      onChange={(val) => updateInputs({ homeInsurance: val })}
                    />
                    <InputField
                      label="HOA/Maintenance ($/mo)"
                      value={inputs.hoaMaintenance}
                      onChange={(val) => updateInputs({ hoaMaintenance: val })}
                    />
                  </div>
                </div>

                {/* Renting & Appreciation */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Renting & Growth</h3>
                  <div className="space-y-3">
                    <InputField
                      label="Renters Insurance ($/mo)"
                      value={inputs.rentersInsurance}
                      onChange={(val) => updateInputs({ rentersInsurance: val })}
                    />
                    <InputField
                      label="Rent Increase Rate (%)"
                      value={inputs.rentIncreaseRate}
                      onChange={(val) => updateInputs({ rentIncreaseRate: val })}
                    />
                    <InputField
                      label="Home Appreciation (%)"
                      value={inputs.homeAppreciationRate}
                      onChange={(val) => updateInputs({ homeAppreciationRate: val })}
                    />
                    <InputField
                      label="Investment Return (%)"
                      value={inputs.investmentReturnRate}
                      onChange={(val) => updateInputs({ investmentReturnRate: val })}
                    />
                  </div>
                </div>

                {/* Additional Costs */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Additional Costs</h3>
                  <div className="space-y-3">
                    <InputField
                      label="Maintenance Rate (%)"
                      value={inputs.maintenanceRate}
                      onChange={(val) => updateInputs({ maintenanceRate: val })}
                    />
                    <InputField
                      label="Closing Costs (%)"
                      value={inputs.closingCostPercent}
                      onChange={(val) => updateInputs({ closingCostPercent: val })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>



        {/* imatePresence>

        {/* Results Section - Prominent Display */}
        <section className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-md p-5 text-white">
              <p className="text-blue-100 mb-1 text-xs font-semibold">Buying Net Worth</p>
              <p className="text-3xl font-bold mb-2">{formatCurrency(result.finalBuyingNetWorth)}</p>
              <p className="text-blue-100 text-xs">after {inputs.yearsToAnalyze} years</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-md p-5 text-white">
              <p className="text-emerald-100 mb-1 text-xs font-semibold">Renting Net Worth</p>
              <p className="text-3xl font-bold mb-2">{formatCurrency(result.finalRentingNetWorth)}</p>
              <p className="text-emerald-100 text-xs">after {inputs.yearsToAnalyze} years</p>
            </div>

            <div
              className={`rounded-2xl shadow-md p-5 text-white ${
                result.recommendation === 'buy'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
                  : result.recommendation === 'rent'
                  ? 'bg-gradient-to-br from-green-600 to-emerald-700'
                  : 'bg-gradient-to-br from-slate-600 to-slate-700'
              }`}
            >
              <p className="mb-1 text-xs font-semibold opacity-90">Recommendation</p>
              <p className="text-3xl font-bold mb-1">
                {result.recommendation === 'buy' ? '🏠 Buy' : result.recommendation === 'rent' ? '🏢 Rent' : '⚖️ Neutral'}
              </p>
              <p className="text-xs opacity-90">
                {result.netWorthDifference >= 0 ? '+' : ''}
                {formatCurrency(Math.abs(result.netWorthDifference))} difference
              </p>
            </div>
          </div>

          {/* Recommendation Message */}
          <div
            className={`rounded-2xl shadow-md p-5 ${
              result.recommendation === 'buy'
                ? 'bg-blue-50 border border-blue-200'
                : result.recommendation === 'rent'
                ? 'bg-green-50 border border-green-200'
                : 'bg-slate-50 border border-slate-200'
            }`}
          >
            <p className="text-slate-700 leading-relaxed">{result.recommendationReason}</p>
            {result.breakEvenYears && (
              <p className="text-slate-600 text-sm mt-2">
                💡 Break-even point: {result.breakEvenYears.toFixed(1)} years
              </p>
            )}
          </div>
        </section>

        {/* Charts Section */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('networth')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'networth'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Net Worth Over Time
              </button>
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'breakdown'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Cost Breakdown
              </button>
            </div>
          </div>

          <div className="h-96">
            {activeTab === 'networth' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData}>
                  <defs>
                    <linearGradient id="buyingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.buying} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.buying} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rentingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.renting} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.renting} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    label={{ value: 'Net Worth', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="buyingNetWorth"
                    name="Buying Net Worth"
                    stroke={CHART_COLORS.buying}
                    fill="url(#buyingGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="rentingNetWorth"
                    name="Renting Net Worth"
                    stroke={CHART_COLORS.renting}
                    fill="url(#rentingGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'breakdown' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <div>
                  <h4 className="text-center font-semibold text-slate-700 mb-4">
                    Buying Cost Breakdown
                  </h4>
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: 'Mortgage',
                            value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeMortgagePayments || 0,
                          },
                          {
                            name: 'Property Tax',
                            value: result.monthlyData[result.monthlyData.length - 1]?.cumulativePropertyTax || 0,
                          },
                          {
                            name: 'Insurance',
                            value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeInsurance || 0,
                          },
                          {
                            name: 'HOA',
                            value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeHOA || 0,
                          },
                          {
                            name: 'Maintenance',
                            value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeMaintenance || 0,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) =>
                          `${entry.name}: ${((entry.value / result.totalBuyingCost) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {['#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-center font-semibold text-slate-700 mb-4">
                    Renting Cost Breakdown
                  </h4>
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: 'Rent',
                            value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeRent || 0,
                          },
                          {
                            name: 'Insurance',
                            value:
                              result.monthlyData[result.monthlyData.length - 1]?.cumulativeRentersInsurance || 0,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) =>
                          `${entry.name}: ${((entry.value / result.totalRentingCost) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[CHART_COLORS.renting, '#06b6d4'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Educational Insights - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <InsightCard
            icon="💰"
            title="Opportunity Cost"
            content="Your down payment could be invested in stocks/bonds. Consider if the investment returns exceed home appreciation."
          />
          <InsightCard
            icon="🏠"
            title="Hidden Costs"
            content="Buying includes property tax, insurance, maintenance (1-3% of home value annually), HOA, and closing costs."
          />
          <InsightCard
            icon="⚖️"
            title="Flexibility"
            content="Renting offers mobility for career moves. Buying provides stability and tax benefits but has higher transaction costs."
          />
        </div>

        {/* FAQ Section - Compact */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Common Questions</h2>
          <div className="space-y-3">
            <FAQItem
              question="How accurate is this calculator?"
              answer="This calculator provides estimates based on your inputs and standard financial formulas. Actual results may vary. It's meant to help you compare scenarios, not predict exact outcomes."
            />
            <FAQItem
              question="What is the break-even point?"
              answer="The break-even point is when your net worth from buying equals your net worth from renting. Before this point, renting may be financially better; after it, buying typically provides more wealth accumulation."
            />
            <FAQItem
              question="What investment return should I assume?"
              answer="Historical stock market returns average around 7-10% annually. Conservative investors might use 5-7%, while aggressive investors might use 8-10%. The default of 7% represents a moderate assumption."
            />
          </div>
        </section>

        {/* Content for SEO - Compact */}
        <section className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Understanding Buy vs Rent</h2>
          <div className="prose max-w-none text-slate-700 space-y-3 text-sm leading-relaxed">
            <p>
              The decision to buy or rent a home is one of the most significant financial choices you'll make.
              While homeownership has long been considered part of the American Dream, renting can sometimes be
              the smarter financial move, especially in expensive markets or for those who value flexibility.
            </p>
            <p>
              <strong>Financial Factors:</strong> Beyond the monthly payment, consider property taxes, insurance,
              maintenance costs, HOA fees, and closing costs. These can add 30-50% to your base mortgage payment.
              On the renting side, you'll have more predictable monthly costs but no equity building.
            </p>
            <p>
              <strong>Market Conditions:</strong> In high-appreciation markets, buying can be very profitable. In
              flat or declining markets, renting might make more sense. The price-to-rent ratio (home price divided
              by annual rent) is a useful metric: above 20 often favors renting, below 15 typically favors buying.
            </p>
            <p>
              <strong>Personal Circumstances:</strong> How long do you plan to stay? If less than 5 years, renting
              is usually better due to transaction costs. Do you have stable income? Homeownership requires emergency
              funds for unexpected repairs. Consider consulting with a financial advisor for personalized guidance.
            </p>
            <h3 className="text-lg font-bold text-slate-900 mt-6">A Practical Framework for Better Decisions</h3>
            <p>
              The best buy-versus-rent decision is rarely emotional when numbers are compared honestly. Start with time horizon.
              If your expected stay is short, buying costs such as registration, brokerage, loan setup, and resale friction can wipe out expected appreciation.
              If your horizon is longer, principal repayment and property value growth can create a meaningful net-worth advantage.
            </p>
            <p>
              Next, compare opportunity cost. A down payment invested in diversified assets can compound significantly over a decade.
              That means the true cost of buying is not just the EMI, but also the foregone growth of that capital.
              This calculator includes that perspective so you can evaluate both paths on a comparable net-worth basis instead of monthly payment alone.
            </p>
            <p>
              Risk management matters as much as returns. Homeowners face concentration risk in a single asset and location.
              Renters face rent escalation and less control over tenancy terms. Your choice should align with income stability,
              mobility needs, family plans, and your ability to maintain an emergency buffer after upfront payments.
            </p>
            <p>
              Use scenario testing before deciding. Increase interest rates, lower appreciation assumptions, and test higher maintenance.
              If buying still wins under conservative assumptions, confidence in that decision is higher.
              If outcomes flip easily, renting while investing the difference may be the safer route until conditions improve.
            </p>
            <p>
              Finally, remember that financial optimum and lifestyle optimum are not always identical.
              Some households value stability, customization, and long-term roots enough to accept a modest financial trade-off.
              Others prioritize flexibility and career mobility. A strong decision is one that fits both your balance sheet and your life stage.
            </p>
          </div>
        </section>
        </div>
      </article>
    </div>
  );
};

// Helper Components
interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-slate-700 font-medium mb-1 text-xs">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

interface InsightCardProps {
  icon: string;
  title: string;
  content: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ icon, title, content }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
};

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
      {isOpen && <p className="mt-2 text-xs text-slate-600 leading-relaxed">{answer}</p>}
    </div>
  );
};

export default BuyVsRentRedesigned;
