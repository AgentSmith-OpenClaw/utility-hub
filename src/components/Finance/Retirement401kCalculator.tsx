import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ToolCard } from '../Tools/ToolShell';
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency';

const CONTRIBUTION_LIMIT_2026 = 24000;
const CATCH_UP_LIMIT_2026 = 8000;
const COMBINED_LIMIT_2026 = 71000;

interface YearProjection {
  age: number;
  year: number;
  salary: number;
  yourContribution: number;
  employerContribution: number;
  growth: number;
  balance: number;
  cumContrib: number;
  cumEmployer: number;
}

function project(
  age: number,
  retirementAge: number,
  salary: number,
  salaryGrowth: number,
  contribPct: number,
  matchPct: number,
  matchUpToPct: number,
  currentBalance: number,
  returnRate: number,
): YearProjection[] {
  const rows: YearProjection[] = [];
  let bal = currentBalance;
  let sal = salary;
  let cumContrib = 0;
  let cumEmployer = 0;
  for (let a = age; a <= retirementAge; a++) {
    const userPct = contribPct / 100;
    const matchableSal = sal * (matchUpToPct / 100);
    const userContrib = Math.min(sal * userPct, a >= 50 ? CONTRIBUTION_LIMIT_2026 + CATCH_UP_LIMIT_2026 : CONTRIBUTION_LIMIT_2026);
    const employerMatch = Math.min(sal * userPct, matchableSal) * (matchPct / 100);
    const totalContrib = userContrib + employerMatch;
    const growth = (bal + totalContrib / 2) * (returnRate / 100);
    bal = bal + totalContrib + growth;
    cumContrib += userContrib;
    cumEmployer += employerMatch;
    rows.push({
      age: a,
      year: new Date().getFullYear() + (a - age),
      salary: Math.round(sal),
      yourContribution: Math.round(userContrib),
      employerContribution: Math.round(employerMatch),
      growth: Math.round(growth),
      balance: Math.round(bal),
      cumContrib: Math.round(cumContrib),
      cumEmployer: Math.round(cumEmployer),
    });
    sal *= 1 + salaryGrowth / 100;
  }
  return rows;
}

export default function Retirement401kCalculator() {
  const [age, setAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [salary, setSalary] = useState(85000);
  const [salaryGrowth, setSalaryGrowth] = useState(3);
  const [contribPct, setContribPct] = useState(10);
  const [matchPct, setMatchPct] = useState(50);
  const [matchUpToPct, setMatchUpToPct] = useState(6);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [returnRate, setReturnRate] = useState(7);

  const projections = useMemo(
    () => project(age, retirementAge, salary, salaryGrowth, contribPct, matchPct, matchUpToPct, currentBalance, returnRate),
    [age, retirementAge, salary, salaryGrowth, contribPct, matchPct, matchUpToPct, currentBalance, returnRate],
  );

  const final = projections[projections.length - 1];
  const totalContrib = final?.cumContrib ?? 0;
  const totalEmployer = final?.cumEmployer ?? 0;
  const totalGrowth = (final?.balance ?? 0) - totalContrib - totalEmployer - currentBalance;
  const monthlyAt4Pct = (final?.balance ?? 0) * 0.04 / 12;

  const chartData = projections.map(p => ({
    age: p.age,
    Balance: p.balance,
    'Your Contributions': p.cumContrib,
    'Employer Match': p.cumEmployer,
  }));

  const matchedSalary = salary * (matchUpToPct / 100);
  const userMatchableContrib = Math.min(salary * contribPct / 100, matchedSalary);
  const annualEmployerMatch = userMatchableContrib * (matchPct / 100);
  const missingMatch = annualEmployerMatch < matchedSalary * (matchPct / 100);

  return (
    <div className="space-y-5">
      <ToolCard title="Your Information">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Current age</label>
            <input type="number" value={age} onChange={(e) => setAge(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Retirement age</label>
            <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Annual salary ($)</label>
            <input type="number" value={salary} onChange={(e) => setSalary(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Salary growth (%/yr)</label>
            <input type="number" step="0.1" value={salaryGrowth} onChange={(e) => setSalaryGrowth(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Current 401(k) balance ($)</label>
            <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Expected return (%/yr)</label>
            <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Contribution & Employer Match">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Your contribution (% of salary)</label>
            <input type="number" step="0.5" value={contribPct} onChange={(e) => setContribPct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Employer match rate (%)</label>
            <input type="number" step="1" value={matchPct} onChange={(e) => setMatchPct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
            <p className="text-[11px] text-slate-400 mt-1">Common: 50% (50¢ per $1) or 100%</p>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Up to (% of salary)</label>
            <input type="number" step="0.5" value={matchUpToPct} onChange={(e) => setMatchUpToPct(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
            <p className="text-[11px] text-slate-400 mt-1">Common: 6% of salary cap</p>
          </div>
        </div>
        {missingMatch && (
          <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            ⚠️ You&apos;re leaving free money on the table. Increase your contribution to at least {matchUpToPct}% to capture the full employer match.
          </div>
        )}
      </ToolCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard title="Balance at retirement">
          <p className="text-2xl font-bold text-emerald-700">{formatCurrencyCompact(final?.balance ?? 0, 'USD')}</p>
          <p className="text-xs text-slate-500 mt-1">{formatCurrency(final?.balance ?? 0, 'USD')}</p>
        </ToolCard>
        <ToolCard title="Your contributions">
          <p className="text-xl font-bold text-slate-800">{formatCurrencyCompact(totalContrib, 'USD')}</p>
          <p className="text-xs text-slate-500 mt-1">over {retirementAge - age} years</p>
        </ToolCard>
        <ToolCard title="Employer match (free)">
          <p className="text-xl font-bold text-emerald-700">{formatCurrencyCompact(totalEmployer, 'USD')}</p>
          <p className="text-xs text-slate-500 mt-1">vested wealth</p>
        </ToolCard>
        <ToolCard title="Investment growth">
          <p className="text-xl font-bold text-blue-700">{formatCurrencyCompact(totalGrowth, 'USD')}</p>
          <p className="text-xs text-slate-500 mt-1">compound returns</p>
        </ToolCard>
      </div>

      <ToolCard title="Retirement income (4% safe withdrawal rule)">
        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(monthlyAt4Pct, 'USD')}/mo</p>
          <p className="text-sm text-slate-500">≈ {formatCurrency(monthlyAt4Pct * 12, 'USD')}/year</p>
        </div>
        <p className="text-xs text-slate-500 mt-1">Adjusted for inflation, this withdrawal rate has historically lasted 30+ years.</p>
      </ToolCard>

      <ToolCard title="Balance Growth">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="age" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrencyCompact(v, 'USD')} />
              <Tooltip formatter={(v: number | undefined) => formatCurrency(v ?? 0, 'USD')} labelFormatter={(l) => `Age ${l}`} />
              <Legend />
              <Line type="monotone" dataKey="Balance" stroke="#10b981" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="Your Contributions" stroke="#64748b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Employer Match" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ToolCard>

      <ToolCard title="2026 Contribution Limits">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs text-slate-500">Employee limit (under 50)</div>
            <div className="font-bold text-slate-800">{formatCurrency(CONTRIBUTION_LIMIT_2026, 'USD')}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs text-slate-500">Catch-up (50+)</div>
            <div className="font-bold text-slate-800">+{formatCurrency(CATCH_UP_LIMIT_2026, 'USD')}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="text-xs text-slate-500">Combined (employee + employer)</div>
            <div className="font-bold text-slate-800">{formatCurrency(COMBINED_LIMIT_2026, 'USD')}</div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
