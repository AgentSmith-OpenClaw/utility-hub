'use client';
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type UnitSystem = 'metric' | 'imperial';

const DEFICIT_OPTIONS = [250, 500, 750, 1000] as const;
const KCAL_PER_LB = 3500;

interface ProjectionPoint {
  week: number;
  weight: number;
  deficit: number;
}

function kgToLbs(kg: number) { return kg * 2.20462; }
function lbsToKg(lbs: number) { return lbs / 2.20462; }

function calcWeeklyLossLbs(dailyDeficit: number): number {
  return (dailyDeficit * 7) / KCAL_PER_LB;
}

function calcWeeksToGoal(currentKg: number, goalKg: number, dailyDeficit: number): number | null {
  const weeklyLossLbs = calcWeeklyLossLbs(dailyDeficit);
  if (weeklyLossLbs <= 0) return null;
  const weeklyLossKg = weeklyLossLbs / 2.20462;
  if (weeklyLossKg <= 0) return null;
  return (currentKg - goalKg) / weeklyLossKg;
}

function buildProjection(currentKg: number, dailyDeficit: number, goalKg: number): ProjectionPoint[] {
  const weeklyLossLbs = calcWeeklyLossLbs(dailyDeficit);
  const weeklyLossKg = weeklyLossLbs / 2.20462;
  const points: ProjectionPoint[] = [];
  const milestones = [0, 4, 8, 12, 16, 20, 24, 30, 40, 52];
  let weight = currentKg;

  for (const week of milestones) {
    const projected = Math.max(goalKg, currentKg - weeklyLossKg * week);
    points.push({ week, weight: projected, deficit: dailyDeficit });
    if (projected <= goalKg) break;
  }
  return points;
}

const formatWeeks = (w: number): string => {
  if (w <= 0) return 'Already there';
  if (w < 4) return `${Math.ceil(w)} weeks`;
  const months = w / 4.33;
  if (months < 12) return `${months.toFixed(1)} months`;
  const years = months / 12;
  return `${years.toFixed(1)} years`;
};

export default function CalorieDeficitCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [currentKg, setCurrentKg] = useState('80');
  const [goalKg, setGoalKg] = useState('70');
  const [dailyDeficit, setDailyDeficit] = useState<250 | 500 | 750 | 1000>(500);

  const currentLbs = useMemo(() => parseFloat(currentKg) * 2.20462, [currentKg]);
  const goalLbs = useMemo(() => parseFloat(goalKg) * 2.20462, [goalKg]);

  const displayWeight = (kg: string) => {
    if (system === 'imperial') return `${(parseFloat(kg) * 2.20462).toFixed(1)} lbs`;
    return `${parseFloat(kg).toFixed(1)} kg`;
  };

  const currentVal = parseFloat(currentKg) || 0;
  const goalVal = parseFloat(goalKg) || 0;
  const isGoalHigher = goalVal >= currentVal;

  const results = useMemo(() => {
    if (!currentVal || !goalVal || isGoalHigher) return null;

    const weeklyLossLbs = calcWeeklyLossLbs(dailyDeficit);
    const weeklyLossKg = weeklyLossLbs / 2.20462;
    const weeks = calcWeeksToGoal(currentVal, goalVal, dailyDeficit);
    const totalCalDeficit = (currentVal - goalVal) * KCAL_PER_LB * 2.20462;
    const projection = buildProjection(currentVal, dailyDeficit, goalVal);

    return { weeklyLossLbs, weeklyLossKg, weeks, totalCalDeficit, projection };
  }, [currentVal, goalVal, dailyDeficit, isGoalHigher]);

  const comparison = useMemo(() => {
    if (!currentVal || !goalVal || isGoalHigher) return null;
    return DEFICIT_OPTIONS.map((d) => ({
      deficit: d,
      weeks: calcWeeksToGoal(currentVal, goalVal, d),
      weeklyLoss: calcWeeklyLossLbs(d),
    }));
  }, [currentVal, goalVal, isGoalHigher]);

  const chartData = useMemo(() => {
    if (!results) return [];
    const maxWeeks = Math.max(...results.projection.map((p) => p.week));
    const maxWeight = system === 'imperial' ? kgToLbs(currentVal) : currentVal;
    const minWeight = system === 'imperial' ? kgToLbs(goalVal) : goalVal;
    return results.projection.map((p) => ({
      week: `Week ${p.week}`,
      weight: system === 'imperial' ? parseFloat(kgToLbs(p.weight).toFixed(1)) : parseFloat(p.weight.toFixed(1)),
    }));
  }, [results, system, currentVal, goalVal]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Unit toggle */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex gap-2">
          {(['metric', 'imperial'] as UnitSystem[]).map((s) => (
            <button
              key={s}
              onClick={() => setSystem(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                system === s
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              {s === 'metric' ? 'Metric (kg)' : 'Imperial (lbs)'}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Weight</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={system === 'imperial' ? currentLbs.toFixed(1) : currentKg}
              onChange={(e) => {
                const v = e.target.value;
                if (system === 'imperial') setCurrentKg((parseFloat(v) / 2.20462).toFixed(1));
                else setCurrentKg(v);
              }}
              min={1}
              className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
            <span className="text-sm text-slate-500">{system === 'metric' ? 'kg' : 'lbs'}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Goal Weight</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={system === 'imperial' ? goalLbs.toFixed(1) : goalKg}
              onChange={(e) => {
                const v = e.target.value;
                if (system === 'imperial') setGoalKg((parseFloat(v) / 2.20462).toFixed(1));
                else setGoalKg(v);
              }}
              min={1}
              className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
            <span className="text-sm text-slate-500">{system === 'metric' ? 'kg' : 'lbs'}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Daily Calorie Deficit</label>
          <div className="grid grid-cols-4 gap-2">
            {DEFICIT_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDailyDeficit(d)}
                className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                  dailyDeficit === d
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}
              >
                {d} kcal
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggressive deficit warning */}
      {dailyDeficit >= 1000 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm text-amber-800">
            <strong>A 1000 kcal/day deficit is aggressive</strong> and may lead to muscle loss, nutrient deficiencies, and metabolic slowdown. Consider consulting a healthcare provider.
          </p>
        </div>
      )}

      {/* Goal validation */}
      {isGoalHigher && currentVal > 0 && goalVal > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-sm text-amber-800">Your goal weight is higher than your current weight. Enter a lower goal to see projections.</p>
        </div>
      )}

      {/* Results */}
      {results && !isGoalHigher && (
        <>
          {/* Summary card */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5">
            <p className="text-sm text-violet-600 font-semibold uppercase tracking-wider mb-1">Time to Reach Goal</p>
            <p className="text-3xl font-extrabold text-slate-900 mb-1">
              {formatWeeks(results.weeks ?? 0)}
            </p>
            <p className="text-sm text-slate-500">
              {results.weeklyLossLbs.toFixed(2)} lbs / {results.weeklyLossKg.toFixed(3)} kg per week
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Weekly Loss</p>
              <p className="text-2xl font-bold text-slate-800">{results.weeklyLossLbs.toFixed(2)} <span className="text-sm font-medium text-slate-400">lbs</span></p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Deficit Needed</p>
              <p className="text-2xl font-bold text-slate-800">{Math.round(results.totalCalDeficit).toLocaleString()} <span className="text-sm font-medium text-slate-400">kcal</span></p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-4">Projected Weight Curve</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                    formatter={(val) => [`${Number(val).toFixed(1)} ${system === 'metric' ? 'kg' : 'lbs'}`, 'Weight']}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#6d28d9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison table */}
          {comparison && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-700 mb-3">Deficit Comparison</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 text-slate-500 font-semibold">Deficit</th>
                      <th className="text-right py-2 text-slate-500 font-semibold">Weekly Loss</th>
                      <th className="text-right py-2 text-slate-500 font-semibold">Time to Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row) => (
                      <tr key={row.deficit} className={`border-b border-slate-50 ${row.deficit === dailyDeficit ? 'bg-violet-50' : ''}`}>
                        <td className="py-2.5 font-medium text-slate-700">{row.deficit} kcal/day</td>
                        <td className="py-2.5 text-right text-slate-600">{row.weeklyLoss.toFixed(2)} lbs</td>
                        <td className="py-2.5 text-right font-semibold text-violet-700">{row.weeks ? formatWeeks(row.weeks) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Weight loss results vary based on individual metabolism, activity level, and other factors. Consult a qualified healthcare provider before starting any diet or exercise program.
      </p>
    </div>
  );
}