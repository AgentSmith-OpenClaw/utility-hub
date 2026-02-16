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
                      <RechartsTooltip formatter={(val: number) => formatCurrency(val)} />
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

            {/* Educational Content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Understanding Your Mortgage Payment</h2>
              <p>
                A standard mortgage payment consists of four main components, often referred to as <strong>PITI</strong>: Principal, Interest, Taxes, and Insurance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 not-prose">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-indigo-600 mb-1">Principal & Interest</h4>
                  <p className="text-sm text-slate-600">The bulk of your payment. Principal pays down the loan balance, while interest is the cost of borrowing.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-blue-600 mb-1">Property Taxes</h4>
                  <p className="text-sm text-slate-600">Levied by your local government. The national average is around 1.1%, but varies significantly by state.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-cyan-600 mb-1">Home Insurance</h4>
                  <p className="text-sm text-slate-600">Protects your home against damage. Lenders require this to protect their investment.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-teal-600 mb-1">PMI</h4>
                  <p className="text-sm text-slate-600">Private Mortgage Insurance is usually required if your down payment is less than 20% of the home price.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
