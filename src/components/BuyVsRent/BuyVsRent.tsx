import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useBuyVsRent } from '../../hooks/useBuyVsRent';
import { formatCurrency, formatPercent } from './BuyVsRent.utils';

const CHART_COLORS = {
  buying: '#3b82f6',
  renting: '#10b981',
  netWorth: '#8b5cf6',
  home: '#f59e0b',
  equity: '#06b6d4',
};

export const BuyVsRent: React.FC = () => {
  const { inputs, result, updateInputs, reset } = useBuyVsRent();
  const [activeTab, setActiveTab] = useState<'networth' | 'costs' | 'breakdown'>('networth');

  // Sample data for charts (every 12 months to reduce data points)
  const yearlyData = result.monthlyData.filter((d) => d.month % 12 === 0 || d.month === result.monthlyData.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Buy vs Rent Calculator
              </h1>
              <p className="text-slate-600 mt-1">
                Compare the financial impact of buying versus renting a home
              </p>
            </div>
            <button
              onClick={reset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  1
                </div>
                <h2 className="text-xl font-bold text-slate-800">Property Details</h2>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Home Price"
                  value={inputs.homePrice}
                  onChange={(val) => updateInputs({ homePrice: val })}
                  min={50000}
                  max={5000000}
                  step={10000}
                  prefix="$"
                  tooltip="The purchase price of the home"
                />

                <InputField
                  label="Down Payment"
                  value={inputs.downPaymentPercent}
                  onChange={(val) => updateInputs({ downPaymentPercent: val })}
                  min={0}
                  max={50}
                  step={1}
                  suffix="%"
                  tooltip="Percentage of home price paid upfront (typically 20%)"
                />

                <InputField
                  label="Loan Term"
                  value={inputs.loanTermYears}
                  onChange={(val) => updateInputs({ loanTermYears: val })}
                  min={5}
                  max={30}
                  step={5}
                  suffix=" years"
                  tooltip="Length of the mortgage in years (typically 30 years)"
                />

                <InputField
                  label="Interest Rate"
                  value={inputs.interestRate}
                  onChange={(val) => updateInputs({ interestRate: val })}
                  min={2}
                  max={12}
                  step={0.25}
                  suffix="%"
                  tooltip="Annual mortgage interest rate"
                />
              </div>
            </motion.div>

            {/* Buying Costs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  2
                </div>
                <h2 className="text-xl font-bold text-slate-800">Buying Costs</h2>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Property Tax Rate"
                  value={inputs.propertyTaxRate}
                  onChange={(val) => updateInputs({ propertyTaxRate: val })}
                  min={0}
                  max={5}
                  step={0.1}
                  suffix="%"
                  tooltip="Annual property tax as percentage of home value"
                />

                <InputField
                  label="Home Insurance"
                  value={inputs.homeInsurance}
                  onChange={(val) => updateInputs({ homeInsurance: val })}
                  min={0}
                  max={10000}
                  step={100}
                  prefix="$"
                  suffix="/year"
                  tooltip="Annual homeowners insurance premium"
                />

                <InputField
                  label="HOA/Maintenance"
                  value={inputs.hoaMaintenance}
                  onChange={(val) => updateInputs({ hoaMaintenance: val })}
                  min={0}
                  max={1000}
                  step={50}
                  prefix="$"
                  suffix="/mo"
                  tooltip="Monthly HOA fees or condo maintenance costs"
                />

                <InputField
                  label="Maintenance Rate"
                  value={inputs.maintenanceRate}
                  onChange={(val) => updateInputs({ maintenanceRate: val })}
                  min={0}
                  max={3}
                  step={0.1}
                  suffix="%"
                  tooltip="Annual maintenance costs as percentage of home value (typically 1%)"
                />

                <InputField
                  label="Closing Costs"
                  value={inputs.closingCostPercent}
                  onChange={(val) => updateInputs({ closingCostPercent: val })}
                  min={0}
                  max={6}
                  step={0.5}
                  suffix="%"
                  tooltip="One-time closing costs as percentage of home price"
                />

                <InputField
                  label="Home Appreciation"
                  value={inputs.homeAppreciationRate}
                  onChange={(val) => updateInputs({ homeAppreciationRate: val })}
                  min={-5}
                  max={10}
                  step={0.5}
                  suffix="%"
                  tooltip="Expected annual increase in home value"
                />
              </div>
            </motion.div>

            {/* Renting Costs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  3
                </div>
                <h2 className="text-xl font-bold text-slate-800">Renting Costs</h2>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Monthly Rent"
                  value={inputs.monthlyRent}
                  onChange={(val) => updateInputs({ monthlyRent: val })}
                  min={500}
                  max={10000}
                  step={100}
                  prefix="$"
                  tooltip="Current monthly rent payment"
                />

                <InputField
                  label="Renters Insurance"
                  value={inputs.rentersInsurance}
                  onChange={(val) => updateInputs({ rentersInsurance: val })}
                  min={0}
                  max={100}
                  step={5}
                  prefix="$"
                  suffix="/mo"
                  tooltip="Monthly renters insurance premium"
                />

                <InputField
                  label="Rent Increase Rate"
                  value={inputs.rentIncreaseRate}
                  onChange={(val) => updateInputs({ rentIncreaseRate: val })}
                  min={0}
                  max={10}
                  step={0.5}
                  suffix="%"
                  tooltip="Expected annual rent increase (typically 3%)"
                />
              </div>
            </motion.div>

            {/* Investment Assumptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  4
                </div>
                <h2 className="text-xl font-bold text-slate-800">Investment & Analysis</h2>
              </div>

              <div className="space-y-6">
                <InputField
                  label="Investment Return"
                  value={inputs.investmentReturnRate}
                  onChange={(val) => updateInputs({ investmentReturnRate: val })}
                  min={0}
                  max={15}
                  step={0.5}
                  suffix="%"
                  tooltip="Expected annual return on invested savings (e.g., stock market)"
                />

                <InputField
                  label="Years to Analyze"
                  value={inputs.yearsToAnalyze}
                  onChange={(val) => updateInputs({ yearsToAnalyze: val })}
                  min={1}
                  max={30}
                  step={1}
                  suffix=" years"
                  tooltip="Time horizon for the comparison"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">Upfront Costs</h3>
              <div className="space-y-4">
                <MetricCard
                  label="Down Payment"
                  value={formatCurrency(result.downPayment)}
                  color="text-blue-600"
                />
                <MetricCard
                  label="Closing Costs"
                  value={formatCurrency(result.closingCosts)}
                  color="text-blue-600"
                />
                <MetricCard
                  label="Total Upfront"
                  value={formatCurrency(result.downPayment + result.closingCosts)}
                  color="text-indigo-600"
                  highlight
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Costs</h3>
              <div className="space-y-4">
                <MetricCard
                  label="Mortgage Payment"
                  value={formatCurrency(result.monthlyMortgage)}
                  color="text-blue-600"
                />
                <MetricCard
                  label="Monthly Rent"
                  value={formatCurrency(inputs.monthlyRent)}
                  color="text-green-600"
                />
              </div>
            </motion.div>

            {/* Final Net Worth Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-lg border border-indigo-400 p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4">
                Net Worth After {inputs.yearsToAnalyze} Years
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-indigo-100 text-sm mb-1">Buying</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(result.finalBuyingNetWorth)}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-100 text-sm mb-1">Renting</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(result.finalRentingNetWorth)}
                  </p>
                </div>
                <div className="pt-4 border-t border-indigo-400">
                  <p className="text-indigo-100 text-sm mb-1">Difference</p>
                  <p className="text-3xl font-bold">
                    {result.netWorthDifference >= 0 ? '+' : ''}
                    {formatCurrency(result.netWorthDifference)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Recommendation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl shadow-md border p-6 ${
                result.recommendation === 'buy'
                  ? 'bg-blue-50 border-blue-200'
                  : result.recommendation === 'rent'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <h3 className="text-lg font-bold text-slate-800 mb-2">Recommendation</h3>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    result.recommendation === 'buy'
                      ? 'bg-blue-100 text-blue-700'
                      : result.recommendation === 'rent'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {result.recommendation === 'buy' ? '🏠 Buy' : result.recommendation === 'rent' ? '🏢 Rent' : '⚖️ Neutral'}
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                {result.recommendationReason}
              </p>
              {result.breakEvenYears && (
                <p className="text-slate-600 text-xs mt-3">
                  Break-even point: {result.breakEvenYears.toFixed(1)} years
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl shadow-md border border-slate-100 p-6"
        >
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
                Net Worth Comparison
              </button>
              <button
                onClick={() => setActiveTab('costs')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'costs'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Cumulative Costs
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
                    formatter={(value: number) => formatCurrency(value)}
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
                    fill={CHART_COLORS.buying}
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="rentingNetWorth"
                    name="Renting Net Worth"
                    stroke={CHART_COLORS.renting}
                    fill={CHART_COLORS.renting}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'costs' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    label={{ value: 'Cumulative Cost', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalBuyingCost"
                    name="Total Buying Cost"
                    stroke={CHART_COLORS.buying}
                    fill={CHART_COLORS.buying}
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalRentingCost"
                    name="Total Renting Cost"
                    stroke={CHART_COLORS.renting}
                    fill={CHART_COLORS.renting}
                    fillOpacity={0.3}
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
                          { name: 'Mortgage', value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeMortgagePayments || 0 },
                          { name: 'Property Tax', value: result.monthlyData[result.monthlyData.length - 1]?.cumulativePropertyTax || 0 },
                          { name: 'Insurance', value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeInsurance || 0 },
                          { name: 'HOA', value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeHOA || 0 },
                          { name: 'Maintenance', value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeMaintenance || 0 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${((entry.value / result.totalBuyingCost) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[CHART_COLORS.buying, CHART_COLORS.home, CHART_COLORS.netWorth, CHART_COLORS.equity, '#f97316'].map(
                          (color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          )
                        )}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
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
                          { name: 'Rent', value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeRent || 0 },
                          { name: 'Insurance', value: result.monthlyData[result.monthlyData.length - 1]?.cumulativeRentersInsurance || 0 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${((entry.value / result.totalRentingCost) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[CHART_COLORS.renting, CHART_COLORS.equity].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Educational Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            title="Consider Opportunity Cost"
            content="When buying, your down payment is tied up in the home. When renting, you can invest that money in stocks, bonds, or other assets that may provide higher returns than home appreciation."
            icon="💰"
          />
          <InsightCard
            title="Hidden Costs of Ownership"
            content="Buying involves many costs beyond the mortgage: property taxes, insurance, maintenance, HOA fees, and closing costs. These can add up to 1-3% of the home's value annually."
            icon="🏠"
          />
          <InsightCard
            title="Flexibility vs Stability"
            content="Renting offers flexibility to move for job opportunities or life changes. Buying provides stability, tax benefits, and the potential for appreciation, but with less mobility and higher transaction costs."
            icon="⚖️"
          />
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl shadow-md border border-slate-100 p-6"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="How accurate is this calculator?"
              answer="This calculator provides estimates based on your inputs and standard financial formulas. Actual results may vary based on market conditions, individual circumstances, and unforeseen expenses. It's meant to help you compare scenarios, not predict exact outcomes."
            />
            <FAQItem
              question="What is the break-even point?"
              answer="The break-even point is when your net worth from buying equals your net worth from renting. Before this point, renting may be financially better; after it, buying typically provides more wealth accumulation."
            />
            <FAQItem
              question="Should I include tax deductions?"
              answer="This calculator uses a simplified model. In reality, mortgage interest and property taxes may be tax-deductible, which could make buying more attractive. Consult a tax professional for personalized advice."
            />
            <FAQItem
              question="What investment return should I assume?"
              answer="Historical stock market returns average around 7-10% annually. Conservative investors might use 5-7%, while aggressive investors might use 8-10%. The default of 7% represents a moderate assumption."
            />
          </div>
        </motion.div>

        {/* Content for SEO */}
        <div className="mt-8 prose max-w-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-8"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Understanding the Buy vs Rent Decision
            </h2>
            <p className="text-slate-700 mb-4">
              The decision to buy or rent a home is one of the most significant financial choices
              you'll make. While homeownership has long been considered part of the American Dream,
              renting can sometimes be the smarter financial move, especially in expensive markets
              or for those who value flexibility.
            </p>
            <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">Key Factors to Consider</h3>
            <p className="text-slate-700 mb-4">
              <strong>Financial Factors:</strong> Beyond the monthly payment, consider property taxes,
              insurance, maintenance costs, HOA fees, and closing costs. These can add 30-50% to your
              base mortgage payment. On the renting side, you'll have more predictable monthly costs
              but no equity building.
            </p>
            <p className="text-slate-700 mb-4">
              <strong>Market Conditions:</strong> In high-appreciation markets, buying can be very
              profitable. In flat or declining markets, renting might make more sense. The
              price-to-rent ratio (home price divided by annual rent) is a useful metric: above 20
              often favors renting, below 15 typically favors buying.
            </p>
            <p className="text-slate-700 mb-4">
              <strong>Personal Circumstances:</strong> How long do you plan to stay? If less than 5
              years, renting is usually better due to transaction costs. Do you have stable income?
              Homeownership requires emergency funds for unexpected repairs. Do you value flexibility
              or stability more?
            </p>
            <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">
              Making the Right Choice for You
            </h3>
            <p className="text-slate-700 mb-4">
              Use this calculator to understand the financial implications, but remember that the best
              choice depends on your unique situation, goals, and preferences. Financial outcomes are
              important, but so are lifestyle factors like mobility, control over your living space,
              and peace of mind. Consider consulting with a financial advisor or real estate
              professional for personalized guidance.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  tooltip,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
          {label}
          {tooltip && (
            <span className="text-slate-400 text-xs" title={tooltip}>
              ℹ️
            </span>
          )}
        </label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-slate-600">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-right text-sm"
            min={min}
            max={max}
            step={step}
          />
          {suffix && <span className="text-sm text-slate-600">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, color, highlight }) => {
  return (
    <div className={`${highlight ? 'border-t pt-4' : ''}`}>
      <p className="text-sm text-slate-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

interface InsightCardProps {
  title: string;
  content: string;
  icon: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, content, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
    </motion.div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-lg font-semibold text-slate-800">{question}</h3>
        <span className="text-slate-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <p className="mt-2 text-slate-600">{answer}</p>}
    </div>
  );
};

export default BuyVsRent;
