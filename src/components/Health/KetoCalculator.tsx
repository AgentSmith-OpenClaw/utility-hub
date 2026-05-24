'use client';
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
type Goal = 'lose' | 'maintain';
type CarbLimit = 20 | 25 | 30 | 50;

interface KetoResult {
  bmr: number;
  tdee: number;
  target: number;
  netCarbs: number;
  protein: number;
  fat: number;
  totalCalories: number;
  carbPct: number;
  proteinPct: number;
  fatPct: number;
  carbWarning: boolean;
}

const ACTIVITY_FACTORS: Record<ActivityLevel, { label: string; factor: number; desc: string }> = {
  sedentary: { label: 'Sedentary',      factor: 1.2,   desc: 'Little or no exercise' },
  light:     { label: 'Lightly Active', factor: 1.375, desc: 'Light exercise 1–3 days/week' },
  moderate:  { label: 'Moderately Active', factor: 1.55, desc: 'Moderate exercise 3–5 days/week' },
  very:      { label: 'Very Active',   factor: 1.725, desc: 'Hard exercise 6–7 days/week' },
  extra:     { label: 'Extra Active',  factor: 1.9,   desc: 'Very hard exercise & physical job' },
};

const CARB_LABELS: Record<CarbLimit, { label: string; desc: string }> = {
  20: { label: 'Strict (20g)', desc: 'Classic keto — maximum ketosis' },
  25: { label: 'Moderate (25g)', desc: 'Transitional or maintenance' },
  30: { label: 'Liberal (30g)', desc: 'Less restrictive low-carb' },
  50: { label: 'Lazy (50g)', desc: 'Moderate low-carb, easier to maintain' },
};

function calcBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function calcTdee(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_FACTORS[activity].factor);
}

function calcKeto(bmr: number, tdee: number, goal: Goal, carbLimit: CarbLimit, weightKg: number): KetoResult {
  const target = goal === 'lose' ? Math.round(tdee * 0.90) : tdee;

  const netCarbs = carbLimit;
  const protein = Math.round(weightKg * 1.4);
  const carbCalories = netCarbs * 4;
  const proteinCalories = protein * 4;
  const remainingCalories = target - carbCalories - proteinCalories;
  const fat = Math.max(0, Math.round(remainingCalories / 9));
  const fatCalories = fat * 9;
  const totalCalories = carbCalories + proteinCalories + fatCalories;

  const carbPct = Math.round((carbCalories / totalCalories) * 100);
  const proteinPct = Math.round((proteinCalories / totalCalories) * 100);
  const fatPct = 100 - carbPct - proteinPct;

  const carbWarning = carbLimit >= 50;

  return { bmr, tdee, target, netCarbs, protein, fat, totalCalories, carbPct, proteinPct, fatPct, carbWarning };
}

function lbsToKg(lbs: number) { return lbs / 2.20462; }
function kgToLbs(kg: number) { return kg * 2.20462; }

export default function KetoCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [carbLimit, setCarbLimit] = useState<CarbLimit>(20);

  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');

  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');

  const result = useMemo<KetoResult | null>(() => {
    let hCm: number, wKg: number;

    if (system === 'metric') {
      hCm = parseFloat(heightCm);
      wKg = parseFloat(weightKg);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      hCm = (ft * 12 + inch) * 2.54;
      wKg = lbsToKg(parseFloat(weightLbs) || 0);
    }

    const ageNum = parseFloat(age);
    if (!hCm || !wKg || hCm <= 0 || wKg <= 0 || ageNum <= 0 || ageNum > 120) return null;

    const bmr = calcBmr(wKg, hCm, ageNum, sex);
    const tdee = calcTdee(bmr, activity);

    return calcKeto(bmr, tdee, goal, carbLimit, wKg);
  }, [system, sex, age, activity, goal, carbLimit, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  const pieData = result ? [
    { name: 'Net Carbs', value: result.carbPct, grams: result.netCarbs, color: '#f43f5e' },
    { name: 'Protein', value: result.proteinPct, grams: result.protein, color: '#8b5cf6' },
    { name: 'Fat', value: result.fatPct, grams: result.fat, color: '#f59e0b' },
  ] : [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex gap-2 mb-6">
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
              {s === 'metric' ? 'Metric (cm / kg)' : 'Imperial (ft, in / lbs)'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sex</label>
            <div className="flex gap-2">
              {(['male', 'female'] as Sex[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border capitalize transition-all ${
                    sex === s
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 30"
                min={1} max={120}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">years</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Height</label>
            {system === 'metric' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  min={50} max={300}
                  className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
                <span className="text-sm text-slate-500">cm</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  min={1} max={10}
                  className="w-20 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
                <span className="text-sm text-slate-500">ft</span>
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  min={0} max={11}
                  className="w-20 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
                <span className="text-sm text-slate-500">in</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Weight</label>
            {system === 'metric' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  min={10} max={500}
                  className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
                <span className="text-sm text-slate-500">kg</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  min={20} max={1100}
                  className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
                <span className="text-sm text-slate-500">lbs</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Level</label>
        <div className="grid grid-cols-5 gap-1.5">
          {(Object.keys(ACTIVITY_FACTORS) as ActivityLevel[]).map((key) => {
            const { label, factor, desc } = ACTIVITY_FACTORS[key];
            return (
              <button
                key={key}
                onClick={() => setActivity(key)}
                title={desc}
                className={`py-2 px-1 rounded-lg text-[11px] font-medium border transition-all text-center ${
                  activity === key
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}
              >
                <div className="leading-tight">{label}</div>
                <div className="opacity-70 font-normal mt-0.5">{factor}×</div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">{ACTIVITY_FACTORS[activity].desc}</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Goal</label>
        <div className="grid grid-cols-2 gap-2">
          {(['lose', 'maintain'] as Goal[]).map((g) => {
            const labels = { lose: 'Lose Weight', maintain: 'Maintain' };
            const colors = {
              lose: goal === g ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50',
              maintain: goal === g ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50',
            };
            const icons = { lose: '📉', maintain: '⚖️' };
            return (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`py-3 rounded-lg text-sm font-semibold border transition-all flex flex-col items-center gap-1 ${colors[g]}`}
              >
                <span className="text-lg">{icons[g]}</span>
                <span>{labels[g]}</span>
                <span className="text-[10px] font-normal opacity-70">
                  {g === 'lose' ? 'TDEE − 10%' : 'TDEE'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Daily Net Carb Limit</label>
        <div className="grid grid-cols-2 gap-2">
          {([20, 25, 30, 50] as CarbLimit[]).map((c) => (
            <button
              key={c}
              onClick={() => setCarbLimit(c)}
              className={`py-3 rounded-lg text-sm font-semibold border transition-all flex flex-col items-center gap-0.5 ${
                carbLimit === c
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              <span>{CARB_LABELS[c].label}</span>
              <span className="text-[10px] font-normal opacity-70">{CARB_LABELS[c].desc}</span>
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {result.carbWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">High Carb Limit</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  50g net carbs may not maintain ketosis for most people. Consider 20–30g for stricter ketone production.
                </p>
              </div>
            </div>
          )}

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5">
            <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Daily Target</p>
            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {result.totalCalories.toLocaleString()} <span className="text-base font-normal text-slate-500">kcal/day</span>
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {result.target === result.tdee ? 'Maintenance' : 'Weight Loss (TDEE − 10%)'}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-1">Keto Macro Targets</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center mx-auto mb-1">
                  <span className="text-rose-600 font-bold text-sm">{result.netCarbs}g</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">Net Carbs</p>
                <p className="text-[10px] text-slate-400">{result.carbPct}% · {result.netCarbs * 4} kcal</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-violet-100 border-2 border-violet-200 flex items-center justify-center mx-auto mb-1">
                  <span className="text-violet-600 font-bold text-sm">{result.protein}g</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">Protein</p>
                <p className="text-[10px] text-slate-400">{result.proteinPct}% · {result.protein * 4} kcal</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center mx-auto mb-1">
                  <span className="text-amber-600 font-bold text-sm">{result.fat}g</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">Fat</p>
                <p className="text-[10px] text-slate-400">{result.fatPct}% · {result.fat * 9} kcal</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-700">Macro Split</p>
              <p className="text-xs text-slate-400">Standard keto: 5% / 25% / 70%</p>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value}% (${(props as any).payload?.grams ?? value}g)`, name]}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-slate-600">{entry.name} {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">Energy Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">BMR</p>
                <p className="text-lg font-bold text-slate-800">{result.bmr.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span></p>
                <p className="text-[10px] text-slate-400">At rest only</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">TDEE</p>
                <p className="text-lg font-bold text-slate-800">{result.tdee.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span></p>
                <p className="text-[10px] text-slate-400">With activity</p>
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-violet-700 mb-2">💧 Electrolyte Targets (Approximate)</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-bold text-violet-800">2000–3000mg</p>
                <p className="text-[10px] text-violet-600">Sodium</p>
              </div>
              <div>
                <p className="text-sm font-bold text-violet-800">1000–1500mg</p>
                <p className="text-[10px] text-violet-600">Potassium</p>
              </div>
              <div>
                <p className="text-sm font-bold text-violet-800">300–400mg</p>
                <p className="text-[10px] text-violet-600">Magnesium</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Keto is not suitable for everyone — consult a qualified healthcare provider before making significant dietary changes, especially with underlying health conditions.
      </p>
    </div>
  );
}