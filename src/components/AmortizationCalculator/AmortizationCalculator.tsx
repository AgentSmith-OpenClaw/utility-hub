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
        <section className="mt-16 space-y-16">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm prose prose-slate max-w-none">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight not-prose">The Ultimate Guide to Loan Amortization</h2>
            <p className="lead text-xl text-slate-600 font-medium">
              Loans can be deceptive. A simple monthly payment often hides the true cost of borrowing. 
              Our <strong>Amortization Calculator</strong> doesn't just show you what you pay; it reveals <em>where</em> your money goes.
            </p>
            <p>
              Whether you're managing a 30-year home mortgage, a 5-year car loan, or a personal loan, understanding your amortization schedule is the single most effective way to save money and become debt-free faster.
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">What is Amortization?</h3>
            <p>
              Amortization is the process of spreading out a loan into a series of fixed payments over time. While your total monthly payment remains constant, the ratio of <strong>Principal</strong> (the money you borrowed) to <strong>Interest</strong> (the lender's profit) changes with every single payment.
            </p>
            <p>
              This is often represented by an "Amortization Curve":
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Early Years:</strong> Your payments are almost entirely interest. You barely make a dent in the loan balance.</li>
              <li><strong>Middle Years:</strong> The tide begins to turn. Principal payments increase, interest decreases.</li>
              <li><strong>Final Years:</strong> Your payments are almost entirely principal, rapidly clearing the remaining debt.</li>
            </ul>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">The "Front-Loaded" Interest Trap</h3>
            <p>
              Many borrowers are shocked to see that after 5 years of paying a 20-year mortgage, they still owe 90% of the original loan amount. 
              This isn't a scam; it's math. Lenders calculate interest based on the <em>outstanding balance</em>. Since the balance is highest at the start, the interest charge is highest.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-6 not-prose">
              <h4 className="font-bold text-amber-900 mb-2">Example: ₹50 Lakh Loan @ 8.5% for 20 Years</h4>
              <p className="text-sm text-amber-800">
                <strong>Month 1 Payment:</strong> ₹43,391<br/>
                Interest: ₹35,417 (82%)<br/>
                Principal: ₹7,974 (18%)
              </p>
              <p className="text-sm text-amber-800 mt-4">
                <strong>Month 120 (Year 10) Payment:</strong> ₹43,391<br/>
                Interest: ₹24,800 (57%)<br/>
                Principal: ₹18,591 (43%)
              </p>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">The Power of Prepayment</h3>
            <p>
              Because interest is calculated on the remaining balance, <strong>any extra payment</strong> you make goes 100% towards the principal. This has a compounding effect:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>You reduce the principal immediately.</li>
              <li>The interest charged next month is lower (because the balance is lower).</li>
              <li>More of your <em>regular</em> payment goes towards principal next month.</li>
              <li>This cycle repeats, accelerating your debt freedom.</li>
            </ol>
            <p>
              <strong>Pro Tip:</strong> Making just one extra EMI per year can reduce a 20-year loan term by approx. 2-3 years and save lakhs in interest.
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Flat Rate vs. Reducing Balance Interest</h3>
            <p>
              Be careful when comparing loans. A "Flat Rate" of 5% is often more expensive than a "Reducing Balance Rate" of 9%.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Reducing Balance (Standard):</strong> Interest is calculated on the remaining principal. This is fair and standard for home loans.</li>
              <li><strong>Flat Rate (Deceptive):</strong> Interest is calculated on the <em>original</em> loan amount for the entire tenure. You continue paying interest on money you have already paid back! Always convert a Flat Rate to an effective Reducing Rate (IRR) to compare.</li>
            </ul>

            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Frequently Asked Questions (FAQ)</h3>
            <div className="not-prose space-y-4">
              <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                  <span>Does paying extra reduce monthly EMI or Tenure?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  <p>Usually, lenders reduce the <strong>Tenure</strong> by default, keeping the EMI same. This saves you the maximum interest. However, you can specifically request the lender to reduce the <strong>EMI</strong> if you want to lower your monthly burden while keeping the tenure same.</p>
                </div>
              </details>
              <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                  <span>What is a Negative Amortization?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  <p>This happens when your monthly payment is <em>less</em> than the interest due. The unpaid interest gets added to your principal balance, causing your debt to <strong>grow</strong> instead of shrink. This is dangerous and common in certain student loans or complex mortgage products.</p>
                </div>
              </details>
              <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                  <span>How often is interest calculated?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  <p>For most home and auto loans, interest is compounded <strong>monthly</strong>. However, some personal loans or credit cards may compound daily. The more frequent the compounding, the higher the effective interest rate.</p>
                </div>
              </details>
            </div>

            {/* JSON-LD Schema for FAQ */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Does paying extra reduce monthly EMI or Tenure?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Usually, it reduces the Tenure, which maximizes savings. You can request to reduce EMI instead if you prefer lower monthly payments."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is a Negative Amortization?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It occurs when payments don't cover the interest due, causing the loan balance to increase over time."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How often is interest calculated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most loans compound monthly. Daily compounding (like on credit cards) results in higher total interest."
                  }
                }
              ]
            })}} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AmortizationCalculator;
