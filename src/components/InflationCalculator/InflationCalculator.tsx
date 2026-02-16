import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  calculatePurchasingPower, 
  US_CPI_DATA 
} from './InflationCalculator.utils';
import { CHART_COLORS } from '../../utils/chartColors';

const InflationCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [startYear, setStartYear] = useState<number>(2000);
  const [endYear, setEndYear] = useState<number>(2026);

  const years = useMemo(() => {
    return Object.keys(US_CPI_DATA)
      .map(Number)
      .sort((a, b) => b - a);
  }, []);

  const results = useMemo(() => {
    try {
      return calculatePurchasingPower(amount, startYear, endYear);
    } catch (e) {
      return null;
    }
  }, [amount, startYear, endYear]);

  const chartData = useMemo(() => {
    const data = [];
    const minYear = Math.min(startYear, endYear);
    const maxYear = Math.max(startYear, endYear);
    
    for (let y = minYear; y <= maxYear; y++) {
      if (US_CPI_DATA[y]) {
        const val = calculatePurchasingPower(amount, minYear, y).futureValue;
        data.push({
          year: y,
          value: parseFloat(val.toFixed(2))
        });
      }
    }
    return data;
  }, [amount, startYear, endYear]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          US Inflation Calculator (1913-2026)
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate how the value of a dollar has changed over time using official Consumer Price Index (CPI) data.
          Updated with **February 2026** projections.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Initial Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Start Year
          </label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
          >
            {[...years].reverse().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            End Year
          </label>
          <select
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {results && (
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl text-center border border-blue-100 dark:border-blue-800"
          >
            <p className="text-lg text-slate-600 dark:text-slate-400">
              ${amount.toLocaleString()} in {startYear} is worth
            </p>
            <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400 my-4">
              ${results.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              in {endYear}
            </p>
            <div className="mt-6 pt-6 border-t border-blue-100 dark:border-blue-800 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Total Inflation</p>
                <p className="text-xl font-semibold">{results.cumulativeRate.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Buying Power Difference</p>
                <p className="text-xl font-semibold">
                  {results.futureValue > amount ? 'Decreased' : 'Increased'}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Value Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
                <XAxis 
                  dataKey="year" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: CHART_COLORS.secondary }}
                  formatter={(value) => [`$${value}`, 'Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <footer className="mt-12 space-y-6">
        <section className="prose dark:prose-invert max-w-none">
          <h3 className="text-xl font-semibold">How is inflation calculated?</h3>
          <p>
            This calculator uses the **Consumer Price Index (CPI)** data provided by the Bureau of Labor Statistics (BLS). 
            The CPI represents the average change over time in the prices paid by urban consumers for a market basket of 
            consumer goods and services.
          </p>
          <p>
            The formula used is: `Value in End Year = Amount * (CPI in End Year / CPI in Start Year)`. 
            For 2026, we use early projections based on January 2026 economic reports.
          </p>
        </section>
      </footer>
    </div>
  );
};

export default InflationCalculator;
