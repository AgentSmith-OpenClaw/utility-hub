import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { generateAmortizationSchedule, calculateAmortizationSummary } from './AmortizationCalculator.utils';

const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#3b82f6',
  accent: '#06b6d4',
  teal: '#14b8a6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  grid: '#f1f5f9',
  axis: '#94a3b8',
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

const AmortizationCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const schedule = useMemo(() => 
    generateAmortizationSchedule(loanAmount, annualRate, tenureYears * 12),
    [loanAmount, annualRate, tenureYears]
  );

  const summary = useMemo(() => 
    calculateAmortizationSummary(loanAmount, annualRate, tenureYears * 12, schedule),
    [loanAmount, annualRate, tenureYears, schedule]
  );

  const chartData = useMemo(() => {
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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Amortization Calculator</h1>
          <p className="text-lg text-slate-600">Detailed breakdown of your loan repayment schedule</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Loan Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tenure (Years)</label>
                <input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                <p className="text-indigo-100 text-sm font-medium mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold">₹{summary.monthlyEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm font-medium mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-slate-900">₹{summary.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-sm font-medium mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-slate-900">₹{summary.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Balance & Repayment Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
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
                    <Area type="monotone" dataKey="balance" name="Balance" stroke={CHART_COLORS.primary} fill="url(#balGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Amortization Schedule</h3>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Month</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedule.map((p) => (
                  <tr key={p.month} className="hover:bg-slate-50/50 transition">
                    <td className="px-8 py-4 text-sm font-semibold text-slate-700">Month {p.month}</td>
                    <td className="px-8 py-4 text-sm text-slate-600">₹{p.principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="px-8 py-4 text-sm text-slate-600">₹{p.interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="px-8 py-4 text-sm font-medium text-slate-900">₹{p.totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="px-8 py-4 text-sm text-slate-500 font-mono">₹{p.remainingBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Learn More Section - SEO Optimized */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <article className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What is an Amortization Schedule?</h2>
            <p className="text-slate-600 leading-relaxed">
              An <strong>amortization schedule</strong> is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Early in the schedule, the majority of each payment is devoted to interest. As the loan matures, a larger portion of each payment goes toward the principal. Our calculator helps you visualize this shift with an interactive balance trend chart and a detailed monthly breakdown.
            </p>
          </article>

          <article className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Use an Amortization Calculator?</h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span><strong>Plan Your Budget:</strong> Know exactly how much you'll pay every month for the life of the loan.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span><strong>Interest Tracking:</strong> Understand exactly how much total interest you will pay to the lender.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span><strong>Debt Strategy:</strong> Visualize how increasing your monthly payment can drastically reduce your loan term and total interest paid.</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
};

export default AmortizationCalculator;
