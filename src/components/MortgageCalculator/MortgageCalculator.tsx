import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
} from 'recharts';
import { calculateMortgage, MortgageInputs } from './MortgageCalculator.utils';

const COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#14b8a6', '#f59e0b', '#f43f5e'];

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

  const result = useMemo(() => calculateMortgage(inputs), [inputs]);

  const pieData = [
    { name: 'P&I', value: result.monthlyPrincipalAndInterest },
    { name: 'Tax', value: result.monthlyPropertyTax },
    { name: 'Insurance', value: result.monthlyHomeInsurance },
    { name: 'PMI', value: result.monthlyPMI },
    { name: 'HOA', value: result.monthlyHOA },
  ].filter(item => item.value > 0);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Mortgage Calculator</h1>
          <p className="text-lg text-slate-600">Estimate your monthly mortgage payments with taxes and insurance</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Loan Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Home Price ($)</label>
                <input
                  type="number"
                  value={inputs.homePrice}
                  onChange={(e) => setInputs({ ...inputs, homePrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Down Payment ($)</label>
                <input
                  type="number"
                  value={inputs.downPayment}
                  onChange={(e) => setInputs({ ...inputs, downPayment: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
                <p className="mt-1 text-xs text-slate-500">{result.downPaymentPercentage.toFixed(1)}% down payment</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Term (Years)</label>
                  <input
                    type="number"
                    value={inputs.loanTerm}
                    onChange={(e) => setInputs({ ...inputs, loanTerm: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.interestRate}
                    onChange={(e) => setInputs({ ...inputs, interestRate: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
              <hr className="border-slate-100" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Taxes & Insurance</h3>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property Tax (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.propertyTaxRate}
                  onChange={(e) => setInputs({ ...inputs, propertyTaxRate: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Insurance ($/mo)</label>
                  <input
                    type="number"
                    value={inputs.homeInsurance}
                    onChange={(e) => setInputs({ ...inputs, homeInsurance: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">HOA ($/mo)</label>
                  <input
                    type="number"
                    value={inputs.hoaFees}
                    onChange={(e) => setInputs({ ...inputs, hoaFees: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-indigo-100 text-lg font-medium mb-2">Your Estimated Monthly Payment</p>
                <p className="text-6xl font-black">{formatCurrency(result.totalMonthlyPayment)}</p>
              </div>
              {/* Decorative circle */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Payment Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val: any) => formatCurrency(Number(val ?? 0))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Loan Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Loan Amount</span>
                    <span className="font-bold text-slate-900">{formatCurrency(result.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Principal & Interest</span>
                    <span className="font-bold text-slate-900">{formatCurrency(result.monthlyPrincipalAndInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Property Tax</span>
                    <span className="font-bold text-slate-900">{formatCurrency(result.monthlyPropertyTax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Insurance & HOA</span>
                    <span className="font-bold text-slate-900">{formatCurrency(result.monthlyHomeInsurance + result.monthlyHOA)}</span>
                  </div>
                  {result.monthlyPMI > 0 && (
                    <div className="flex justify-between items-center text-rose-600">
                      <span className="text-rose-500">PMI</span>
                      <span className="font-bold">{formatCurrency(result.monthlyPMI)}</span>
                    </div>
                  )}
                  <hr className="border-slate-100" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Total Interest Paid</span>
                    <span className="font-bold text-slate-900">{formatCurrency(result.totalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Content & FAQ */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Master Your Mortgage: The Ultimate Guide</h2>
              
              <section className="mb-12">
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">Why Use a Mortgage Calculator?</h3>
                <p>
                  Buying a home is likely the largest financial decision you'll ever make. A mortgage isn't just a monthly bill; it's a complex financial instrument with multiple moving parts. 
                  Our <strong>Mortgage Calculator</strong> cuts through the confusion by providing a transparent, line-item breakdown of your monthly obligation.
                </p>
                <p>
                  Most buyers focus solely on the principal and interest (P&I). However, the "real" cost of homeownership includes property taxes, homeowners insurance, private mortgage insurance (PMI), and HOA fees. 
                  Ignoring these can lead to "house poor" syndrome—where your income covers the mortgage, but leaves nothing for life.
                </p>
                <p>
                  Use this tool to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Budget Accurately:</strong> See the full PITI (Principal, Interest, Taxes, Insurance) payment.</li>
                  <li><strong>Scenario Test:</strong> Adjust down payments to see how it affects your rate and PMI.</li>
                  <li><strong>Amortization Insight:</strong> Understand how much of your payment goes to interest vs. equity in the early years.</li>
                </ul>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">Deep Dive: The Math Behind Your Monthly Payment</h3>
                <p>
                  Your monthly mortgage payment is the sum of four distinct components, often referred to as PITI. Understanding how each variable impacts your bottom line gives you leverage when shopping for a loan.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <h4 className="text-lg font-bold text-indigo-700 mb-2">1. Principal & Interest (P&I)</h4>
                    <p className="text-slate-700 text-sm">
                      <strong>Principal</strong> pays down your loan balance. <strong>Interest</strong> is the bank's profit. 
                      In the early years of a 30-year fixed loan, nearly 70% of your payment goes to interest. This shifts over time as the principal balance decreases.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                    <h4 className="text-lg font-bold text-blue-700 mb-2">2. Property Taxes</h4>
                    <p className="text-slate-700 text-sm">
                      Taxes fund local services like schools and roads. Rates vary wildly by location (e.g., NJ averages ~2.4%, while HI is ~0.28%). 
                      This cost never goes away, even after the mortgage is paid off.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-cyan-50 border border-cyan-100">
                    <h4 className="text-lg font-bold text-cyan-700 mb-2">3. Homeowners Insurance</h4>
                    <p className="text-slate-700 text-sm">
                      Lenders require this to protect the asset against fire, theft, and disasters. 
                      Costs depend on coverage limits, deductibles, and location risks (flood zones, wildfire areas).
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100">
                    <h4 className="text-lg font-bold text-teal-700 mb-2">4. Mortgage Insurance (PMI)</h4>
                    <p className="text-slate-700 text-sm">
                      If you put down less than 20%, lenders usually charge PMI (0.5% - 1.5% of loan annually). 
                      It protects <em>them</em> if you default. It drops off automatically once you reach 22% equity.
                    </p>
                  </div>
                </div>

                <h4 className="text-xl font-bold text-slate-800 mt-8 mb-3">The Amortization Curve</h4>
                <p>
                  Mortgage loans use an amortization schedule. This means your payment amount stays the same (for fixed-rate loans), but the allocation changes.
                  Initially, you pay mostly interest. For example, on a $400k loan at 6.5%, your first payment might be $2,528, with $2,166 going to interest and only $362 to principal.
                  It takes about 13 years before your principal payment exceeds your interest payment.
                </p>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">Strategic Advice: Save Thousands on Your Mortgage</h3>
                <p>
                  A mortgage is a contract, but it's not set in stone. Smart borrowers use strategies to reduce the total interest paid over the life of the loan.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-bold text-slate-900">Make One Extra Payment Per Year</h5>
                    <p>
                      By making 13 payments a year instead of 12, you can shave 4-6 years off a 30-year mortgage and save tens of thousands in interest. 
                      This works because the extra payment goes 100% toward principal, reducing the balance that accrues interest.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Recast Instead of Refinance</h5>
                    <p>
                      If you come into a lump sum of cash, ask your lender for a "recast." You pay a large sum toward the principal, and they re-amortize the remaining balance over the same term. 
                      This lowers your monthly payment without the closing costs of refinancing.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Shop for PMI</h5>
                    <p>
                      PMI rates vary by insurer. Ask your lender if they can shop around for cheaper PMI, or consider an "upfront PMI" buyout if you have extra cash at closing but less than 20% down.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Avoid the "Rate Trap"</h5>
                    <p>
                      Don't obsess over the interest rate alone. A lower rate might come with high "points" (prepaid interest) that take 7+ years to break even. 
                      Calculate the "break-even point" before buying points.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-semibold text-slate-800 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                    <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                      <span>How much house can I afford?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-slate-600">
                      <p>The "28/36 rule" is a standard guideline. Your housing costs (PITI) shouldn't exceed 28% of your gross monthly income, and your total debt (including car loans, student loans, credit cards) shouldn't exceed 36%. However, with current interest rates, many lenders stretch this to 43% or even 50% for qualified borrowers.</p>
                    </div>
                  </details>
                  <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                    <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                      <span>What is a good interest rate for a mortgage?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-slate-600">
                      <p>Mortgage rates fluctuate daily based on the bond market and Federal Reserve policy. A "good" rate is one that is at or below the national average for your credit score tier. Borrowers with credit scores above 760 typically qualify for the best available rates.</p>
                    </div>
                  </details>
                  <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                    <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                      <span>Is it better to put 20% down?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-slate-600">
                      <p>Ideally, yes. Putting 20% down avoids Private Mortgage Insurance (PMI), secures a lower interest rate, and provides immediate equity. However, for many first-time buyers, a 3.5% (FHA) or 3-5% (Conventional) down payment is a smarter path to homeownership than waiting years to save 20% while home prices rise.</p>
                    </div>
                  </details>
                  <details className="group border border-slate-200 rounded-xl bg-slate-50 open:bg-white open:shadow-sm transition-all">
                    <summary className="flex items-center justify-between p-4 font-semibold cursor-pointer list-none text-slate-800">
                      <span>What are closing costs?</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-slate-600">
                      <p>Closing costs are fees paid at the final signing of your loan. They typically range from 2% to 5% of the loan amount and include appraisal fees, title insurance, origination fees, and prepaid taxes/insurance. You can sometimes negotiate for the seller to pay a portion of these costs.</p>
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
                      "name": "How much house can I afford?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The '28/36 rule' is a standard guideline. Your housing costs (PITI) shouldn't exceed 28% of your gross monthly income, and your total debt shouldn't exceed 36%. However, many lenders stretch this to 43% or even 50% for qualified borrowers."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What is a good interest rate for a mortgage?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Mortgage rates fluctuate daily based on the bond market. A 'good' rate is one that is at or below the national average for your credit score tier. Borrowers with scores above 760 typically qualify for the best rates."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is it better to put 20% down?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ideally, yes, to avoid PMI and secure a lower rate. However, for many first-time buyers, a 3-5% down payment is a smarter path to homeownership than waiting years to save 20% while prices rise."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What are closing costs?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Closing costs are fees paid at signing, typically 2-5% of the loan amount. They include appraisal fees, title insurance, origination fees, and prepaids. Sellers can sometimes pay a portion of these costs."
                      }
                    }
                  ]
                })}} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
