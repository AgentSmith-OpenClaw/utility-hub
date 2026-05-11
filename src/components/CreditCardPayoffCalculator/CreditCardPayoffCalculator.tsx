import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
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
} from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface CardInput {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
}

type Strategy = 'avalanche' | 'snowball' | 'minimum';

interface MonthlyRow {
  month: number;
  totalBalance: number;
  totalInterest: number;
  totalPaid: number;
  perCard: Record<string, number>;
}

interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  monthly: MonthlyRow[];
  perCardSummary: Array<{ id: string; name: string; payoffMonth: number; interest: number }>;
}

const fmt = (n: number) =>
  '$' +
  Math.round(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

const newCard = (i: number, defaults?: Partial<CardInput>): CardInput => ({
  id: `c-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
  name: defaults?.name ?? `Card ${i + 1}`,
  balance: defaults?.balance ?? 0,
  apr: defaults?.apr ?? 19.99,
  minPayment: defaults?.minPayment ?? 0,
});

const STRATEGY_LABEL: Record<Strategy, string> = {
  avalanche: 'Avalanche (highest APR first)',
  snowball: 'Snowball (smallest balance first)',
  minimum: 'Minimum payments only',
};

function simulate(
  cards: CardInput[],
  monthlyBudget: number,
  strategy: Strategy,
  maxMonths = 600,
): PayoffResult {
  const working = cards.map((c) => ({
    ...c,
    balance: c.balance,
    interestPaid: 0,
    payoffMonth: 0,
  }));

  const minSum = working.reduce((s, c) => s + (c.balance > 0 ? Math.max(c.minPayment, 0) : 0), 0);
  const budget = strategy === 'minimum' ? minSum : Math.max(monthlyBudget, minSum);

  const monthly: MonthlyRow[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  while (working.some((c) => c.balance > 0.01) && month < maxMonths) {
    month++;

    // Accrue interest first
    working.forEach((c) => {
      if (c.balance > 0) {
        const interest = (c.balance * (c.apr / 100)) / 12;
        c.balance += interest;
        c.interestPaid += interest;
        totalInterest += interest;
      }
    });

    // Pay minimums on every card with balance
    let remainingBudget = budget;
    working.forEach((c) => {
      if (c.balance > 0) {
        const pay = Math.min(c.minPayment, c.balance);
        c.balance -= pay;
        remainingBudget -= pay;
        totalPaid += pay;
      }
    });

    if (remainingBudget < 0) remainingBudget = 0;

    // Allocate extra to the priority card
    if (strategy !== 'minimum' && remainingBudget > 0) {
      const sorted = [...working].filter((c) => c.balance > 0).sort((a, b) => {
        if (strategy === 'avalanche') return b.apr - a.apr;
        return a.balance - b.balance;
      });
      for (const target of sorted) {
        if (remainingBudget <= 0) break;
        const pay = Math.min(remainingBudget, target.balance);
        target.balance -= pay;
        remainingBudget -= pay;
        totalPaid += pay;
      }
    }

    // Record payoff month per card
    working.forEach((c) => {
      if (c.balance <= 0.01 && c.payoffMonth === 0) c.payoffMonth = month;
    });

    const totalBalance = working.reduce((s, c) => s + Math.max(c.balance, 0), 0);
    const perCard: Record<string, number> = {};
    working.forEach((c) => {
      perCard[c.id] = Math.max(c.balance, 0);
    });
    monthly.push({ month, totalBalance, totalInterest, totalPaid, perCard });
  }

  return {
    months: month,
    totalInterest,
    totalPaid,
    monthly,
    perCardSummary: working.map((c) => ({
      id: c.id,
      name: c.name,
      payoffMonth: c.payoffMonth || month,
      interest: c.interestPaid,
    })),
  };
}

const COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#f97316', '#8b5cf6'];

interface CreditCardPayoffCalculatorProps {
  hideHeader?: boolean;
}

export default function CreditCardPayoffCalculator({ hideHeader = false }: CreditCardPayoffCalculatorProps = {}) {
  const [cards, setCards] = useState<CardInput[]>([
    newCard(0, { name: 'Visa', balance: 5000, apr: 22.99, minPayment: 100 }),
    newCard(1, { name: 'Mastercard', balance: 3500, apr: 18.99, minPayment: 70 }),
    newCard(2, { name: 'Store card', balance: 1200, apr: 26.99, minPayment: 35 }),
  ]);
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [strategy, setStrategy] = useState<Strategy>('avalanche');

  const updateCard = (id: string, patch: Partial<CardInput>) =>
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const addCard = () => setCards((prev) => [...prev, newCard(prev.length)]);
  const removeCard = (id: string) => setCards((prev) => prev.filter((c) => c.id !== id));

  const totals = useMemo(() => {
    const balance = cards.reduce((s, c) => s + (c.balance || 0), 0);
    const minSum = cards.reduce((s, c) => s + (c.minPayment || 0), 0);
    const wAvgApr = balance > 0
      ? cards.reduce((s, c) => s + (c.balance || 0) * (c.apr || 0), 0) / balance
      : 0;
    return { balance, minSum, wAvgApr };
  }, [cards]);

  const results = useMemo(() => {
    const validCards = cards.filter((c) => c.balance > 0);
    if (validCards.length === 0) return null;
    return {
      avalanche: simulate(validCards, monthlyBudget, 'avalanche'),
      snowball: simulate(validCards, monthlyBudget, 'snowball'),
      minimum: simulate(validCards, monthlyBudget, 'minimum'),
    };
  }, [cards, monthlyBudget]);

  const active = results?.[strategy];
  const interestVsMin = results
    ? results.minimum.totalInterest - (active?.totalInterest ?? 0)
    : 0;
  const monthsVsMin = results ? results.minimum.months - (active?.months ?? 0) : 0;

  const monthsToYearStr = (m: number) => {
    if (!Number.isFinite(m) || m <= 0) return '—';
    const years = Math.floor(m / 12);
    const months = m % 12;
    if (years === 0) return `${months} mo`;
    if (months === 0) return `${years} yr`;
    return `${years} yr ${months} mo`;
  };

  const exportToExcel = () => {
    if (!active || !results) return;
    const wb = XLSX.utils.book_new();
    const summary = [
      { Metric: 'Strategy', Value: STRATEGY_LABEL[strategy] },
      { Metric: 'Total starting balance', Value: fmt(totals.balance) },
      { Metric: 'Weighted average APR', Value: `${totals.wAvgApr.toFixed(2)}%` },
      { Metric: 'Monthly payment budget', Value: fmt(monthlyBudget) },
      { Metric: 'Months to debt-free', Value: active.months },
      { Metric: 'Total interest paid', Value: fmt(active.totalInterest) },
      { Metric: 'Total paid', Value: fmt(active.totalPaid) },
      { Metric: '', Value: '' },
      { Metric: 'Interest saved vs minimums', Value: fmt(interestVsMin) },
      { Metric: 'Months saved vs minimums', Value: monthsVsMin },
    ];
    const ws1 = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

    const compare = [
      { Strategy: 'Avalanche (highest APR)', Months: results.avalanche.months, 'Total Interest': Math.round(results.avalanche.totalInterest), 'Total Paid': Math.round(results.avalanche.totalPaid) },
      { Strategy: 'Snowball (smallest balance)', Months: results.snowball.months, 'Total Interest': Math.round(results.snowball.totalInterest), 'Total Paid': Math.round(results.snowball.totalPaid) },
      { Strategy: 'Minimum only', Months: results.minimum.months, 'Total Interest': Math.round(results.minimum.totalInterest), 'Total Paid': Math.round(results.minimum.totalPaid) },
    ];
    const ws2 = XLSX.utils.json_to_sheet(compare);
    XLSX.utils.book_append_sheet(wb, ws2, 'Strategy Comparison');

    const sched = active.monthly.map((m) => {
      const row: Record<string, number | string> = {
        Month: m.month,
        'Total Balance': Math.round(m.totalBalance),
        'Cumulative Interest': Math.round(m.totalInterest),
        'Cumulative Paid': Math.round(m.totalPaid),
      };
      cards.forEach((c) => {
        row[c.name] = Math.round(m.perCard[c.id] ?? 0);
      });
      return row;
    });
    const ws3 = XLSX.utils.json_to_sheet(sched);
    XLSX.utils.book_append_sheet(wb, ws3, 'Monthly Schedule');

    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }),
      'credit_card_payoff_plan.xlsx',
    );
  };

  // Chart data: balance over time for each card
  const balanceChartData = useMemo(() => {
    if (!active) return [];
    return active.monthly.map((m) => {
      const row: Record<string, number | string> = { month: m.month };
      cards.forEach((c) => {
        row[c.name] = Math.round(m.perCard[c.id] ?? 0);
      });
      return row;
    });
  }, [active, cards]);

  const interestVsPrincipalData = useMemo(() => {
    if (!active) return [];
    return [
      { name: 'Principal', value: Math.max(active.totalPaid - active.totalInterest, 0) },
      { name: 'Interest', value: Math.round(active.totalInterest) },
    ];
  }, [active]);

  const strategyCompareData = useMemo(() => {
    if (!results) return [];
    return [
      { strategy: 'Avalanche', interest: Math.round(results.avalanche.totalInterest), months: results.avalanche.months },
      { strategy: 'Snowball', interest: Math.round(results.snowball.totalInterest), months: results.snowball.months },
      { strategy: 'Minimum', interest: Math.round(results.minimum.totalInterest), months: results.minimum.months },
    ];
  }, [results]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-red-600 to-orange-500" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-12">
          <nav className="text-xs text-white/80 mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/finance/credit-card-payoff-calculator" className="hover:text-white">Finance</Link>
            <span>›</span>
            <span className="text-white font-medium">Credit Card Payoff Calculator</span>
          </nav>
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-4xl sm:text-5xl drop-shadow-lg">💳</span>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Credit Card Payoff Calculator
              </h1>
              <p className="text-white/90 text-sm sm:text-base mt-1 max-w-2xl">
                Compare avalanche vs snowball vs minimum-only payoff. See real interest saved, payoff date, and a per-card schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Your cards</h2>
            <div className="space-y-4">
              {cards.map((c, idx) => (
                <div key={c.id} className="rounded-xl border border-slate-200 p-3 bg-slate-50/40">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: COLORS[idx % COLORS.length] }}
                    />
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCard(c.id, { name: e.target.value })}
                      className="flex-1 text-sm font-semibold bg-transparent border-b border-transparent focus:border-rose-300 focus:outline-none px-1"
                    />
                    {cards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCard(c.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded transition-colors"
                        aria-label="Remove card"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <label className="block">
                      <span className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">Balance</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1.5">
                        <span className="text-slate-400 mr-1">$</span>
                        <input
                          type="number"
                          min={0}
                          value={c.balance || ''}
                          onChange={(e) => updateCard(c.id, { balance: parseFloat(e.target.value) || 0 })}
                          className="w-full text-sm font-semibold bg-transparent outline-none"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">APR %</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1.5">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={c.apr || ''}
                          onChange={(e) => updateCard(c.id, { apr: parseFloat(e.target.value) || 0 })}
                          className="w-full text-sm font-semibold bg-transparent outline-none"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="block text-[10px] font-semibold uppercase text-slate-500 mb-0.5">Min pmt</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1.5">
                        <span className="text-slate-400 mr-1">$</span>
                        <input
                          type="number"
                          min={0}
                          value={c.minPayment || ''}
                          onChange={(e) => updateCard(c.id, { minPayment: parseFloat(e.target.value) || 0 })}
                          className="w-full text-sm font-semibold bg-transparent outline-none"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addCard}
              className="mt-3 w-full text-sm font-semibold text-rose-700 border border-dashed border-rose-300 rounded-xl py-2.5 hover:bg-rose-50 transition-colors"
            >
              + Add another card
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Total monthly payment budget
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span className="text-slate-400 mr-1">$</span>
                <input
                  type="number"
                  min={totals.minSum}
                  step={25}
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(parseFloat(e.target.value) || 0)}
                  className="flex-1 text-base font-bold bg-transparent outline-none"
                />
                <span className="text-xs text-slate-400">/ mo</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Sum of minimums: <strong>{fmt(totals.minSum)}</strong>. Anything above goes to the priority card.
              </p>
              <input
                type="range"
                min={Math.max(totals.minSum, 50)}
                max={Math.max(totals.minSum * 5, 2000)}
                step={25}
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
                className="w-full accent-rose-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Strategy</label>
              <div className="space-y-1.5">
                {(['avalanche', 'snowball', 'minimum'] as Strategy[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStrategy(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
                      strategy === s
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {STRATEGY_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {!active ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <p className="text-slate-500">Add a card with a balance to see your payoff plan.</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Debt-free in</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{monthsToYearStr(active.months)}</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total interest</div>
                  <div className="text-xl font-extrabold text-rose-600 mt-1">{fmt(active.totalInterest)}</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total paid</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{fmt(active.totalPaid)}</div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg APR</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{totals.wAvgApr.toFixed(2)}%</div>
                </div>
              </div>

              {strategy !== 'minimum' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900">
                  <strong>vs minimum payments:</strong> save{' '}
                  <span className="font-bold">{fmt(interestVsMin)}</span> in interest and become debt-free{' '}
                  <span className="font-bold">{monthsVsMin} months earlier</span>.
                </div>
              )}

              {/* Balance over time */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-800 mb-3">Balance over time</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Month', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                      <Tooltip formatter={(v: number | undefined) => fmt(v ?? 0)} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {cards.map((c, i) => (
                        <Area
                          key={c.id}
                          type="monotone"
                          dataKey={c.name}
                          stackId="1"
                          stroke={COLORS[i % COLORS.length]}
                          fill={COLORS[i % COLORS.length]}
                          fillOpacity={0.6}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strategy comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-slate-800 mb-3">Strategies compared</h2>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={strategyCompareData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="strategy" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(v: number | undefined) => fmt(v ?? 0)} />
                        <Bar dataKey="interest" fill="#ef4444" radius={[4, 4, 0, 0]} name="Total interest" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-sm font-bold text-slate-800 mb-3">Where each dollar goes</h2>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={interestVsPrincipalData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                          label={(e: { name?: string; percent?: number }) =>
                            `${e.name ?? ''} ${(((e.percent as number) || 0) * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip formatter={(v: number | undefined) => fmt(v ?? 0)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Per-card payoff */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-800 mb-3">Per-card payoff order</h2>
                <div className="space-y-2">
                  {[...active.perCardSummary]
                    .sort((a, b) => a.payoffMonth - b.payoffMonth)
                    .map((c, i) => {
                      const orig = cards.find((x) => x.id === c.id);
                      const colorIdx = cards.findIndex((x) => x.id === c.id);
                      return (
                        <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-lg">
                          <span className="text-xs font-bold text-slate-400 w-6">#{i + 1}</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: COLORS[colorIdx % COLORS.length] }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {orig ? `${fmt(orig.balance)} @ ${orig.apr.toFixed(2)}%` : ''}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-semibold text-slate-700">paid off in</div>
                            <div className="text-sm font-bold text-emerald-600">{monthsToYearStr(c.payoffMonth)}</div>
                          </div>
                          <div className="text-right ml-3">
                            <div className="text-xs text-slate-400">interest</div>
                            <div className="text-sm font-bold text-rose-600">{fmt(c.interest)}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportToExcel}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export to Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
