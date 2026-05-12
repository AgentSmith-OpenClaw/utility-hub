import React, { useCallback, useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, ReferenceLine,
} from 'recharts';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import ExportShareBar from '../Tools/ExportShareBar';

const CLAIM_COLORS: Record<number, string> = {
  62: '#dc2626',
  65: '#d97706',
  67: '#2563eb',
  70: '#16a34a',
};

function getFullRetirementAge(birthYear: number): number {
  if (birthYear <= 1954) return 66;
  if (birthYear >= 1960) return 67;
  // 1955–1959: FRA = 66 + 2 months per year after 1954
  return 66; // simplified to 66 for years 55-59 (close enough for display)
}

function getFraExact(birthYear: number): { years: number; months: number } {
  if (birthYear <= 1954) return { years: 66, months: 0 };
  if (birthYear === 1955) return { years: 66, months: 2 };
  if (birthYear === 1956) return { years: 66, months: 4 };
  if (birthYear === 1957) return { years: 66, months: 6 };
  if (birthYear === 1958) return { years: 66, months: 8 };
  if (birthYear === 1959) return { years: 66, months: 10 };
  return { years: 67, months: 0 };
}

function getAdjustmentFactor(claimAge: number, birthYear: number): number {
  const fra = getFraExact(birthYear);
  const fraMonths = fra.years * 12 + fra.months;
  const claimMonths = claimAge * 12;
  const monthsDiff = claimMonths - fraMonths;

  if (monthsDiff >= 0) {
    // Delayed: 8% per year past FRA, up to age 70
    return 1 + Math.min(monthsDiff, (70 - fra.years) * 12) * (0.08 / 12);
  } else {
    // Early: first 36 months = 5/9% per month; additional months = 5/12% per month
    const first36 = Math.min(-monthsDiff, 36) * (5 / 9 / 100);
    const remaining = Math.max(0, -monthsDiff - 36) * (5 / 12 / 100);
    return 1 - first36 - remaining;
  }
}

const CLAIM_AGES = [62, 65, 67, 70] as const;

export default function SocialSecurityCalculator() {
  const [birthYear, setBirthYear] = useState('1965');
  const [fraMonthlyBenefit, setFraMonthlyBenefit] = useState('2500');
  const [claimAge, setClaimAge] = useState<62 | 65 | 67 | 70>(67);
  const [lifespan, setLifespan] = useState(85);
  const [includeSpousal, setIncludeSpousal] = useState(false);

  const result = useMemo(() => {
    const bYear = parseInt(birthYear) || 1965;
    const fraBase = parseFloat(fraMonthlyBenefit) || 0;
    const fra = getFraExact(bYear);

    const benefitAt: Record<number, number> = {};
    for (const age of CLAIM_AGES) {
      const factor = getAdjustmentFactor(age, bYear);
      const monthly = fraBase * factor * (includeSpousal ? 1.5 : 1);
      benefitAt[age] = Math.max(0, monthly);
    }

    // Cumulative lifetime totals at chosen lifespan
    const lifetimeTotals: Record<number, number> = {};
    for (const age of CLAIM_AGES) {
      const yearsCollecting = Math.max(0, lifespan - age);
      lifetimeTotals[age] = benefitAt[age] * 12 * yearsCollecting;
    }

    // Break-even ages between pairs
    const breakEven: { from: number; to: number; age: number | null }[] = [];
    for (let i = 0; i < CLAIM_AGES.length - 1; i++) {
      const a = CLAIM_AGES[i];
      const b = CLAIM_AGES[i + 1];
      const monthlyA = benefitAt[a];
      const monthlyB = benefitAt[b];
      if (monthlyB > monthlyA) {
        // At age b, B starts. They intersect when cumulative(B) = cumulative(A)
        // cumA collects from age a, cumB from age b
        // After b: both accumulate. B gains (monthlyB - monthlyA) per month over A's lead
        const aLead = monthlyA * 12 * (b - a); // A's head start
        const monthsToBreakEven = monthlyB > monthlyA ? aLead / (monthlyB - monthlyA) : null;
        const breakEvenAge = monthsToBreakEven !== null ? b + monthsToBreakEven / 12 : null;
        breakEven.push({ from: a, to: b, age: breakEvenAge });
      } else {
        breakEven.push({ from: a, to: b, age: null });
      }
    }

    // Cumulative chart data — one point per age year from 62 to lifespan
    const chartData: Array<Record<string, number | string>> = [];
    for (let age = 62; age <= Math.min(lifespan, 100); age++) {
      const row: Record<string, number | string> = { age };
      for (const ca of CLAIM_AGES) {
        const yearsCollecting = Math.max(0, age - ca);
        row[`claim${ca}`] = +(benefitAt[ca] * 12 * yearsCollecting).toFixed(0);
      }
      chartData.push(row);
    }

    // Monthly benefit bar chart data
    const monthlyBarData = CLAIM_AGES.map((a) => ({
      age: `Age ${a}`,
      monthly: +benefitAt[a].toFixed(0),
    }));

    const selectedMonthly = benefitAt[claimAge];
    const selectedLifetime = lifetimeTotals[claimAge];

    // Recommendation
    let recommendation = '';
    if (lifespan >= 80) {
      if (claimAge === 70) recommendation = 'Delaying to 70 maximizes lifetime benefits if you live to 80+.';
      else if (claimAge === 62) recommendation = 'Claiming at 62 gives the most years of income but the lowest monthly benefit.';
      else recommendation = `Claiming at ${claimAge} is a middle-ground between monthly benefit size and years collected.`;
    } else {
      recommendation = 'With a shorter lifespan assumption, earlier claiming often wins on cumulative totals.';
    }

    return { benefitAt, lifetimeTotals, breakEven, chartData, monthlyBarData, selectedMonthly, selectedLifetime, fra, recommendation };
  }, [birthYear, fraMonthlyBenefit, claimAge, lifespan, includeSpousal]);

  const fmt = (n: number) =>
    `$${Math.round(n).toLocaleString()}`;
  const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

  const buildPdfConfig = useCallback(
    () => ({
      title: 'Social Security Calculator Report',
      subtitle: `Claim at ${claimAge}: ${fmt(result.selectedMonthly)}/month | Lifetime to ${lifespan}: ${fmt(result.selectedLifetime)}`,
      filename: 'Social_Security_Calculator.pdf',
      sections: [
        {
          type: 'inputs' as const,
          title: 'Inputs',
          inputs: [
            { label: 'Birth year', value: birthYear },
            { label: 'FRA monthly benefit', value: fmt(parseFloat(fraMonthlyBenefit) || 0) },
            { label: 'Claiming age', value: `${claimAge}` },
            { label: 'Expected lifespan', value: `${lifespan}` },
            { label: 'Include spousal (50%)', value: includeSpousal ? 'Yes' : 'No' },
          ],
        },
        {
          type: 'metrics' as const,
          title: 'Result',
          metrics: CLAIM_AGES.map((a) => ({
            label: `Monthly at age ${a}`,
            value: fmt(result.benefitAt[a]),
          })),
        },
      ],
    }),
    [result, birthYear, fraMonthlyBenefit, claimAge, lifespan, includeSpousal],
  );

  const buildExcelSheets = useCallback(
    () => [
      {
        name: 'Monthly Benefits',
        rows: CLAIM_AGES.map((a) => ({
          'Claim Age': a,
          'Monthly Benefit': +result.benefitAt[a].toFixed(2),
          [`Lifetime to ${lifespan}`]: Math.round(result.lifetimeTotals[a]),
        })),
      },
      {
        name: 'Cumulative by Age',
        rows: result.chartData.map((row) => ({
          Age: row.age,
          'Claim 62': row.claim62,
          'Claim 65': row.claim65,
          'Claim 67': row.claim67,
          'Claim 70': row.claim70,
        })),
      },
    ],
    [result, lifespan],
  );

  const fraLabel = result.fra.months > 0
    ? `${result.fra.years} yrs ${result.fra.months} mo`
    : `${result.fra.years} years`;

  return (
    <div className="space-y-5">
      <ExportShareBar
        filenameBase="Social_Security_Calculator"
        buildPdfConfig={buildPdfConfig}
        buildExcelSheets={buildExcelSheets}
        shareMessage={`Social Security: claiming at ${claimAge} gives $${Math.round(result.selectedMonthly).toLocaleString()}/month and $${Math.round(result.selectedLifetime / 1000)}k lifetime to age ${lifespan}.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ToolCard title="Your Details">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Birth year</label>
              <input
                type="number" min={1943} max={2000} value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
              />
              <p className="text-xs text-slate-400 mt-1">
                Your Full Retirement Age (FRA): <strong>{fraLabel}</strong>
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Monthly benefit at FRA ({fraLabel})
              </label>
              <input
                type="number" min={0} step={50} value={fraMonthlyBenefit}
                onChange={(e) => setFraMonthlyBenefit(e.target.value)}
                className="w-full px-3 py-2 text-base border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono"
              />
              <p className="text-xs text-slate-400 mt-1">Find this on your SSA statement at ssa.gov/myaccount</p>
            </div>
          </div>
        </ToolCard>

        <ToolCard title="Claiming & Lifespan">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 mb-2 block">Claim at age</label>
              <div className="grid grid-cols-4 gap-2">
                {CLAIM_AGES.map((a) => (
                  <button
                    key={a}
                    onClick={() => setClaimAge(a)}
                    className={`py-2 text-sm rounded-lg border font-medium transition-colors ${
                      claimAge === a
                        ? 'text-white border-transparent'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                    }`}
                    style={claimAge === a ? { backgroundColor: CLAIM_COLORS[a], borderColor: CLAIM_COLORS[a] } : {}}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">
                Expected lifespan: <strong>{lifespan}</strong>
              </label>
              <input
                type="range" min={70} max={100} value={lifespan}
                onChange={(e) => setLifespan(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                <span>70</span><span>80</span><span>90</span><span>100</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="spousal" checked={includeSpousal}
                onChange={(e) => setIncludeSpousal(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="spousal" className="text-sm text-slate-700">
                Include spousal benefit (+50%)
              </label>
            </div>
          </div>
        </ToolCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CLAIM_AGES.map((a) => (
          <ToolCard
            key={a}
            title={`Claim at ${a}`}
            action={<CopyButton value={Math.round(result.benefitAt[a]).toString()} />}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: CLAIM_COLORS[a] }}
            >
              {fmt(result.benefitAt[a])}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">/month</p>
            <p className="text-xs text-slate-400 mt-1">{fmtK(result.lifetimeTotals[a])} to {lifespan}</p>
          </ToolCard>
        ))}
      </div>

      <ToolCard title={`Cumulative Lifetime Benefits to Age ${lifespan}`}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={result.chartData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: 'Age', position: 'insideBottom', offset: -2, fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: number | undefined, name: string | undefined) => [
                `$${(v ?? 0).toLocaleString()}`,
                `Claim at ${(name ?? '').replace('claim', '')}`,
              ]}
              labelFormatter={(l) => `Age ${l}`}
            />
            <Legend formatter={(v) => `Claim at ${v.replace('claim', '')}`} />
            {CLAIM_AGES.map((a) => (
              <Line
                key={a}
                type="monotone"
                dataKey={`claim${a}`}
                stroke={CLAIM_COLORS[a]}
                strokeWidth={a === claimAge ? 3 : 1.5}
                dot={false}
                strokeDasharray={a === claimAge ? undefined : '4 2'}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ToolCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ToolCard title="Monthly Benefit by Claiming Age">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={result.monthlyBarData} margin={{ left: 8, right: 8 }}>
              <XAxis dataKey="age" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number | undefined) => [`$${(v ?? 0).toLocaleString()}`, 'Monthly benefit']} />
              <Bar dataKey="monthly" radius={[4, 4, 0, 0]}>
                {CLAIM_AGES.map((a) => (
                  <rect key={a} fill={CLAIM_COLORS[a]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ToolCard>

        <ToolCard title="Break-Even Ages">
          <div className="space-y-3">
            {result.breakEven.map(({ from, to, age }) => (
              <div key={`${from}-${to}`} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Claim <span style={{ color: CLAIM_COLORS[from] }} className="font-semibold">{from}</span> vs{' '}
                  <span style={{ color: CLAIM_COLORS[to] }} className="font-semibold">{to}</span>
                </span>
                <span className="font-semibold text-slate-800">
                  {age !== null ? `Break even at age ${age.toFixed(1)}` : 'No break-even'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-900">
            {result.recommendation}
          </div>
        </ToolCard>
      </div>

      <ToolCard title="Benefit Summary Table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs">
                <th className="text-left py-2 text-slate-500 font-medium">Claim Age</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Monthly</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Annual</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Lifetime to {lifespan}</th>
                <th className="text-right py-2 px-2 text-slate-500 font-medium">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {CLAIM_AGES.map((a) => {
                const fraBase = parseFloat(fraMonthlyBenefit) || 0;
                const bYear = parseInt(birthYear) || 1965;
                const factor = getAdjustmentFactor(a, bYear);
                const pctAdj = ((factor - 1) * 100).toFixed(1);
                const sign = factor >= 1 ? '+' : '';
                return (
                  <tr key={a} className={claimAge === a ? 'bg-blue-50' : ''}>
                    <td className="py-1.5 font-medium" style={{ color: CLAIM_COLORS[a] }}>Age {a}</td>
                    <td className="py-1.5 px-2 text-right">{fmt(result.benefitAt[a])}</td>
                    <td className="py-1.5 px-2 text-right">{fmt(result.benefitAt[a] * 12)}</td>
                    <td className="py-1.5 px-2 text-right">{fmtK(result.lifetimeTotals[a])}</td>
                    <td className={`py-1.5 px-2 text-right ${factor >= 1 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {sign}{pctAdj}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  );
}
