import React, { useState, useMemo } from 'react';
import { ToolCard } from '../Tools/ToolShell';
import CurrencySelector, { useCurrency } from '../CurrencySelector';
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

export default function RentalROICalculator() {
  const [currency, setCurrency] = useCurrency();
  const [purchasePrice, setPurchasePrice] = useState(350000);
  const [downPaymentPct, setDownPaymentPct] = useState(25);
  const [closingCosts, setClosingCosts] = useState(8000);
  const [rehab, setRehab] = useState(5000);
  const [mortgageRate, setMortgageRate] = useState(7);
  const [mortgageYears, setMortgageYears] = useState(30);
  const [monthlyRent, setMonthlyRent] = useState(2800);
  const [vacancyPct, setVacancyPct] = useState(5);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(4200);
  const [insuranceAnnual, setInsuranceAnnual] = useState(1500);
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [maintenancePct, setMaintenancePct] = useState(8);
  const [mgmtPct, setMgmtPct] = useState(8);

  const downPayment = purchasePrice * downPaymentPct / 100;
  const loanAmount = purchasePrice - downPayment;
  const totalCashIn = downPayment + closingCosts + rehab;

  const monthlyMortgage = useMemo(() => {
    if (loanAmount <= 0 || mortgageRate <= 0) return 0;
    const r = mortgageRate / 100 / 12;
    const n = mortgageYears * 12;
    return (loanAmount * r) / (1 - Math.pow(1 + r, -n));
  }, [loanAmount, mortgageRate, mortgageYears]);

  const grossAnnualRent = monthlyRent * 12;
  const vacancyLoss = grossAnnualRent * vacancyPct / 100;
  const effectiveRent = grossAnnualRent - vacancyLoss;
  const propertyTax = propertyTaxAnnual;
  const insurance = insuranceAnnual;
  const hoa = hoaMonthly * 12;
  const maintenance = effectiveRent * maintenancePct / 100;
  const mgmt = effectiveRent * mgmtPct / 100;
  const operatingExpenses = propertyTax + insurance + hoa + maintenance + mgmt;
  const noi = effectiveRent - operatingExpenses;
  const debtService = monthlyMortgage * 12;
  const cashFlow = noi - debtService;
  const monthlyCashFlow = cashFlow / 12;

  const capRate = (noi / purchasePrice) * 100;
  const cashOnCash = totalCashIn > 0 ? (cashFlow / totalCashIn) * 100 : 0;
  const grm = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0;
  const onePctRule = (monthlyRent / purchasePrice) * 100;
  const dscr = debtService > 0 ? noi / debtService : 0;

  const verdict = (() => {
    if (cashFlow < 0) return { color: 'text-red-700', label: 'Negative cash flow' };
    if (capRate >= 8 && cashOnCash >= 12) return { color: 'text-emerald-700', label: 'Excellent deal' };
    if (capRate >= 6 && cashOnCash >= 8) return { color: 'text-emerald-700', label: 'Good deal' };
    if (capRate >= 4) return { color: 'text-amber-700', label: 'Marginal — depends on appreciation' };
    return { color: 'text-red-700', label: 'Weak — below most market norms' };
  })();

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <ToolCard title="Purchase">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Purchase price</label>
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Down payment (%)</label>
            <input type="number" value={downPaymentPct} onChange={(e) => setDownPaymentPct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Closing costs</label>
            <input type="number" value={closingCosts} onChange={(e) => setClosingCosts(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Rehab</label>
            <input type="number" value={rehab} onChange={(e) => setRehab(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Mortgage rate (%)</label>
            <input type="number" step="0.1" value={mortgageRate} onChange={(e) => setMortgageRate(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Loan term (yrs)</label>
            <input type="number" value={mortgageYears} onChange={(e) => setMortgageYears(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Income & Expenses">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Monthly rent</label>
            <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Vacancy (%)</label>
            <input type="number" value={vacancyPct} onChange={(e) => setVacancyPct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Property tax (yr)</label>
            <input type="number" value={propertyTaxAnnual} onChange={(e) => setPropertyTaxAnnual(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Insurance (yr)</label>
            <input type="number" value={insuranceAnnual} onChange={(e) => setInsuranceAnnual(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">HOA/month</label>
            <input type="number" value={hoaMonthly} onChange={(e) => setHoaMonthly(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Maintenance (%)</label>
            <input type="number" value={maintenancePct} onChange={(e) => setMaintenancePct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Mgmt fee (%)</label>
            <input type="number" value={mgmtPct} onChange={(e) => setMgmtPct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="Cash flow / mo">
          <p className={`text-2xl font-bold ${monthlyCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {formatCurrency(monthlyCashFlow, currency)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(cashFlow, currency)}/year</p>
        </ToolCard>
        <ToolCard title="Cap rate">
          <p className="text-2xl font-bold text-blue-700">{capRate.toFixed(2)}%</p>
          <p className="text-xs text-slate-500 mt-1">NOI / price</p>
        </ToolCard>
        <ToolCard title="Cash-on-cash return">
          <p className="text-2xl font-bold text-emerald-700">{cashOnCash.toFixed(2)}%</p>
          <p className="text-xs text-slate-500 mt-1">on {formatCurrencyCompact(totalCashIn, currency)} cash</p>
        </ToolCard>
        <ToolCard title="DSCR">
          <p className={`text-2xl font-bold ${dscr >= 1.25 ? 'text-emerald-700' : dscr >= 1 ? 'text-amber-700' : 'text-red-700'}`}>
            {dscr.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-1">lenders want ≥1.25</p>
        </ToolCard>
      </div>

      <ToolCard title="Verdict">
        <p className={`text-xl font-bold ${verdict.color}`}>{verdict.label}</p>
      </ToolCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolCard title="Income & Expense Breakdown (annual)">
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between"><dt className="text-slate-500">Gross rent</dt><dd className="font-mono">{formatCurrency(grossAnnualRent, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">− Vacancy</dt><dd className="font-mono text-rose-600">−{formatCurrency(vacancyLoss, currency)}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-1 font-medium"><dt>Effective rent</dt><dd className="font-mono">{formatCurrency(effectiveRent, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">− Property tax</dt><dd className="font-mono text-rose-600">−{formatCurrency(propertyTax, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">− Insurance</dt><dd className="font-mono text-rose-600">−{formatCurrency(insurance, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">− HOA</dt><dd className="font-mono text-rose-600">−{formatCurrency(hoa, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">− Maintenance</dt><dd className="font-mono text-rose-600">−{formatCurrency(maintenance, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">− Management</dt><dd className="font-mono text-rose-600">−{formatCurrency(mgmt, currency)}</dd></div>
            <div className="flex justify-between border-t border-slate-100 pt-1 font-semibold"><dt>NOI</dt><dd className="font-mono text-blue-700">{formatCurrency(noi, currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">− Mortgage</dt><dd className="font-mono text-rose-600">−{formatCurrency(debtService, currency)}</dd></div>
            <div className="flex justify-between border-t border-slate-200 pt-1 font-bold"><dt>Cash flow</dt><dd className={`font-mono ${cashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatCurrency(cashFlow, currency)}</dd></div>
          </dl>
        </ToolCard>
        <ToolCard title="Investor Rules of Thumb">
          <dl className="text-sm space-y-2">
            <div>
              <div className="flex justify-between font-medium"><dt>1% rule</dt><dd className="font-mono">{onePctRule.toFixed(2)}%</dd></div>
              <div className="text-xs text-slate-500">Monthly rent ≥ 1% of price (above 1.0% is good)</div>
            </div>
            <div>
              <div className="flex justify-between font-medium"><dt>GRM</dt><dd className="font-mono">{grm.toFixed(1)}×</dd></div>
              <div className="text-xs text-slate-500">Gross rent multiplier (lower is better; 8–12 typical)</div>
            </div>
            <div>
              <div className="flex justify-between font-medium"><dt>Cash needed</dt><dd className="font-mono">{formatCurrencyCompact(totalCashIn, currency)}</dd></div>
              <div className="text-xs text-slate-500">Down + closing + rehab</div>
            </div>
            <div>
              <div className="flex justify-between font-medium"><dt>Mortgage P&amp;I</dt><dd className="font-mono">{formatCurrency(monthlyMortgage, currency)}/mo</dd></div>
              <div className="text-xs text-slate-500">{mortgageYears}yr @ {mortgageRate}%</div>
            </div>
          </dl>
        </ToolCard>
      </div>
    </div>
  );
}
