import React, { useCallback, useMemo, useState } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { CurrencyCode } from '../../utils/currency';
import { fmtCurrency, fmtPercent } from '../../utils/pdf';

interface LoanInput {
  name: string;
  amount: string;
  rate: string;
  term: string;
}

function calcEMI(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || annualRate < 0 || years <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };
  if (annualRate === 0) {
    const emi = principal / (years * 12);
    return { emi, totalPayment: principal, totalInterest: 0 };
  }
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}

export default function LoanComparisonCalculator() {
  const [currency, setCurrency] = useCurrency();
  const [loans, setLoans] = useState<LoanInput[]>([
    { name: 'Loan A', amount: '500000', rate: '8.5', term: '20' },
    { name: 'Loan B', amount: '500000', rate: '9.0', term: '15' },
    { name: 'Loan C', amount: '500000', rate: '7.5', term: '30' },
  ]);

  const results = useMemo(() => {
    return loans.map((loan) => {
      const principal = parseFloat(loan.amount) || 0;
      const rate = parseFloat(loan.rate) || 0;
      const term = parseFloat(loan.term) || 0;
      return { ...calcEMI(principal, rate, term), principal, rate, term };
    });
  }, [loans]);

  const updateLoan = (index: number, field: keyof LoanInput, value: string) => {
    setLoans((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const addLoan = () => {
    if (loans.length >= 3) return;
    const names = ['A', 'B', 'C'];
    setLoans((prev) => [...prev, { name: `Loan ${names[prev.length] || prev.length}`, amount: '500000', rate: '8.0', term: '20' }]);
  };

  const removeLoan = (index: number) => {
    if (loans.length <= 2) return;
    setLoans((prev) => prev.filter((_, i) => i !== index));
  };

  const cur = currency as CurrencyCode;
  const fmt = useCallback((n: number) => fmtCurrency(n, cur), [cur]);

  const best = useMemo(() => {
    const valid = results.filter((r) => r.emi > 0);
    if (valid.length === 0) return { lowestEmi: -1, lowestInterest: -1 };
    const lowestEmi = valid.reduce((min, r, i) => (r.emi < valid[min].emi ? i : min), 0);
    const lowestInterest = valid.reduce((min, r, i) => (r.totalInterest < valid[min].totalInterest ? i : min), 0);
    return { lowestEmi, lowestInterest };
  }, [results]);

  const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-amber-600'];
  const lightColors = ['bg-indigo-50 border-indigo-200', 'bg-emerald-50 border-emerald-200', 'bg-amber-50 border-amber-200'];
  const textColors = ['text-indigo-700', 'text-emerald-700', 'text-amber-700'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>
        {loans.length < 3 && (
          <button onClick={addLoan} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            + Add Loan
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {loans.map((loan, i) => (
          <div key={i} className={`rounded-xl border p-4 ${lightColors[i] ?? 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <input
                value={loan.name}
                onChange={(e) => updateLoan(i, 'name', e.target.value)}
                className={`text-sm font-bold ${textColors[i] ?? 'text-slate-700'} bg-transparent border-none outline-none w-32`}
              />
              {loans.length > 2 && (
                <button onClick={() => removeLoan(i)} className="text-slate-400 hover:text-red-500 text-xs">Remove</button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Loan Amount</label>
                <input
                  type="number"
                  value={loan.amount}
                  onChange={(e) => updateLoan(i, 'amount', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  value={loan.rate}
                  onChange={(e) => updateLoan(i, 'rate', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Loan Term (Years)</label>
                <input
                  type="number"
                  value={loan.term}
                  onChange={(e) => updateLoan(i, 'term', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  min="1"
                  max="40"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToolCard title="Comparison Summary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-semibold text-slate-600">Metric</th>
                {loans.map((loan, i) => (
                  <th key={i} className="text-right py-2 px-3 font-semibold text-slate-600">{loan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-3 text-slate-600">Loan Amount</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2 px-3 font-medium tabular-nums">{fmt(r.principal)}</td>
                ))}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-3 text-slate-600">Interest Rate</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2 px-3 tabular-nums">{r.rate.toFixed(2)}%</td>
                ))}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-3 text-slate-600">Term</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2 px-3 tabular-nums">{r.term} yrs</td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 bg-indigo-50/50">
                <td className="py-2 px-3 font-semibold text-slate-700">Monthly EMI</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2 px-3 font-bold tabular-nums">
                    {r.emi > 0 ? (
                      <span className={i === best.lowestEmi ? 'text-emerald-600' : ''}>
                        {fmt(r.emi)}{i === best.lowestEmi ? ' ★' : ''}
                      </span>
                    ) : '—'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-3 text-slate-600">Total Payment</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2 px-3 tabular-nums">{fmt(r.totalPayment)}</td>
                ))}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-3 text-slate-600">Total Interest</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2 px-3 font-medium tabular-nums">
                    {r.totalInterest > 0 ? (
                      <span className={i === best.lowestInterest ? 'text-emerald-600' : 'text-red-600'}>
                        {fmt(r.totalInterest)}{i === best.lowestInterest ? ' ★' : ''}
                      </span>
                    ) : fmt(0)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600">Interest-to-Principal Ratio</td>
                {results.map((r, i) => (
                  <td key={i} className="text-right py-2 px-3 tabular-nums">
                    {r.principal > 0 ? ((r.totalInterest / r.principal) * 100).toFixed(1) + '%' : '0%'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">★ Best value in that row</p>
      </ToolCard>

      <ToolCard title="Visual Comparison">
        <div className="space-y-4">
          {results.map((r, i) => {
            const maxPayment = Math.max(...results.map((x) => x.totalPayment), 1);
            const principalWidth = r.totalPayment > 0 ? (r.principal / maxPayment) * 100 : 0;
            const interestWidth = r.totalPayment > 0 ? (r.totalInterest / maxPayment) * 100 : 0;
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{loans[i].name}</span>
                  <span className="text-slate-500">{fmt(r.emi)}/mo &middot; {fmt(r.totalInterest)} interest</span>
                </div>
                <div className="flex h-6 rounded-lg overflow-hidden bg-slate-100">
                  <div
                    className={`${colors[i] ?? 'bg-slate-600'} transition-all duration-500 flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${principalWidth}%` }}
                  >
                    {principalWidth > 15 ? 'Principal' : ''}
                  </div>
                  <div
                    className={`${colors[i].replace('600', '300')} transition-all duration-500 flex items-center justify-center text-xs font-medium`}
                    style={{ width: `${interestWidth}%` }}
                  >
                    {interestWidth > 15 ? 'Interest' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ToolCard>

      <ToolCard title="Key Insights" action={<CopyButton value="" label="" />}>
        <div className="space-y-3">
          {(() => {
            const insights: string[] = [];
            if (results.some((r) => r.emi > 0)) {
              const emiRange = results.filter((r) => r.emi > 0);
              const maxEmi = Math.max(...emiRange.map((r) => r.emi));
              const minEmi = Math.min(...emiRange.map((r) => r.emi));
              if (maxEmi !== minEmi) {
                const diff = maxEmi - minEmi;
                insights.push(`Monthly EMI varies by ${fmt(diff)} between the cheapest and most expensive option.`);
              }
              const maxInt = Math.max(...emiRange.map((r) => r.totalInterest));
              const minInt = Math.min(...emiRange.map((r) => r.totalInterest));
              if (maxInt !== minInt) {
                const savings = maxInt - minInt;
                insights.push(`Choosing the lowest-interest option saves ${fmt(savings)} in total interest.`);
              }
              const longest = results.reduce((a, b) => (a.term > b.term ? a : b));
              const shortest = results.reduce((a, b) => (a.term < b.term ? a : b));
              if (longest.term !== shortest.term) {
                insights.push(`The ${longest.term}-year loan spreads payments over ${longest.term - shortest.term} more years than the ${shortest.term}-year option.`);
              }
            }
            if (insights.length === 0) {
              insights.push('Enter valid loan details above to see comparison insights.');
            }
            return insights.map((text, i) => (
              <div key={i} className="flex gap-2 items-start text-sm text-slate-600">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>{text}</span>
              </div>
            ));
          })()}
        </div>
      </ToolCard>
    </div>
  );
}