'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type Goal = 'maintain' | 'lose' | 'gain';

type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active_strength' | 'very_active_endurance' | 'extreme';

interface ActivityOption {
  key: ActivityLevel;
  label: string;
  multiplier: number;
  description: string;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
  { key: 'sedentary', label: 'Sedentary', multiplier: 0.8, description: 'Little or no exercise, desk job' },
  { key: 'lightly_active', label: 'Lightly Active', multiplier: 1.0, description: 'Light exercise 1–3 days/week' },
  { key: 'moderately_active', label: 'Moderately Active', multiplier: 1.2, description: 'Moderate exercise 3–5 days/week' },
  { key: 'very_active_strength', label: 'Very Active (Strength)', multiplier: 1.6, description: 'Hard exercise 6–7 days/week (strength training)' },
  { key: 'very_active_endurance', label: 'Very Active (Endurance)', multiplier: 1.4, description: 'Hard exercise 6–7 days/week (endurance sports)' },
  { key: 'extreme', label: 'Extreme', multiplier: 2.0, description: 'Professional athlete or intense twice-daily training' },
];

const GOAL_ADJUSTMENT: Record<Goal, number> = {
  maintain: 0,
  lose: 0.3,
  gain: 0.3,
};

const HIGH_PROTEIN_FOODS = [
  { name: 'Chicken Breast (grilled)', portion: '100g', protein: 31 },
  { name: 'Salmon (baked)', portion: '100g', protein: 25 },
  { name: 'Greek Yogurt (plain)', portion: '170g', protein: 17 },
  { name: 'Cottage Cheese (low-fat)', portion: '100g', protein: 12 },
  { name: 'Eggs (whole, boiled)', portion: '2 large', protein: 13 },
  { name: 'Lean Ground Beef (cooked)', portion: '100g', protein: 26 },
  { name: 'Tofu (firm)', portion: '100g', protein: 17 },
  { name: 'Lentils (cooked)', portion: '100g', protein: 9 },
  { name: 'Almonds (raw)', portion: '28g', protein: 6 },
  { name: 'Whey Protein Powder', portion: '1 scoop (~30g)', protein: 25 },
];

const TYPICAL_INTAKE = 50;

function lbsToKg(lbs: number) { return lbs / 2.20462; }
function kgToLbs(kg: number) { return kg * 2.20462; }

export default function ProteinCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [weightKg, setWeightKg] = useState('70');
  const [weightLbs, setWeightLbs] = useState('154');
  const [sex, setSex] = useState<Sex>('male');
  const [activity, setActivity] = useState<ActivityLevel>('moderately_active');
  const [goal, setGoal] = useState<Goal>('maintain');

  const result = useMemo(() => {
    const wKg = system === 'metric' ? parseFloat(weightKg) : lbsToKg(parseFloat(weightLbs) || 0);
    if (!wKg || wKg <= 0) return null;

    const activityOption = ACTIVITY_OPTIONS.find(a => a.key === activity);
    if (!activityOption) return null;

    const goalAdj = GOAL_ADJUSTMENT[goal];
    const multiplier = activityOption.multiplier + goalAdj;
    const dailyProtein = wKg * multiplier;
    const proteinPerMeal = dailyProtein / 4;
    const caloriesFromProtein = dailyProtein * 4;
    const proteinPctOf2000 = (dailyProtein * 4 / 2000) * 100;
    const typicalDiff = dailyProtein - TYPICAL_INTAKE;

    return {
      dailyProtein,
      proteinPerMeal,
      caloriesFromProtein,
      proteinPctOf2000,
      typicalDiff,
      multiplier,
      activityOption,
    };
  }, [system, weightKg, weightLbs, sex, activity, goal]);

  const displayWeight = system === 'metric' ? weightKg : weightLbs;
  const setDisplayWeight = system === 'metric' ? setWeightKg : setWeightLbs;

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
              {s === 'metric' ? 'Metric (kg)' : 'Imperial (lbs)'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Body Weight</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={displayWeight}
                onChange={(e) => setDisplayWeight(e.target.value)}
                min={20} max={500}
                className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{system === 'metric' ? 'kg' : 'lbs'}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biological Sex</label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Activity Level</label>
            <div className="space-y-2">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setActivity(opt.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    activity === opt.key
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  <div className="font-semibold">{opt.label}</div>
                  <div className={`text-xs mt-0.5 ${activity === opt.key ? 'text-violet-100' : 'text-slate-400'}`}>
                    {opt.description} · {opt.multiplier}g/kg base
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {(['lose', 'maintain', 'gain'] as Goal[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`py-2 rounded-lg text-sm font-medium border capitalize transition-all ${
                    goal === g
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {g === 'maintain' ? 'Maintain' : g === 'lose' ? 'Fat Loss' : 'Muscle Gain'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-violet-600 font-semibold uppercase tracking-wider mb-1">Daily Protein Target</p>
                <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  {Math.round(result.dailyProtein)}
                  <span className="text-2xl text-slate-400 font-normal ml-1">g/day</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {result.multiplier.toFixed(1)}g/kg × {system === 'metric' ? parseFloat(weightKg).toFixed(1) : kgToLbs(parseFloat(weightKg) || 0).toFixed(1)} {system === 'metric' ? 'kg' : 'lbs'}
                </p>
              </div>
              <div>
                <p className="text-sm text-violet-600 font-semibold uppercase tracking-wider mb-1">Per Meal (4 meals)</p>
                <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  {Math.round(result.proteinPerMeal)}
                  <span className="text-2xl text-slate-400 font-normal ml-1">g</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Ideal for evenly-spaced protein intake</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">Calories from Protein</p>
                <p className="text-xl font-bold text-slate-800">{Math.round(result.caloriesFromProtein).toLocaleString()} <span className="text-sm font-normal text-slate-500">kcal</span></p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">% of 2,000 kcal diet</p>
                <p className="text-xl font-bold text-slate-800">{result.proteinPctOf2000.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">Recommended vs Typical Intake</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-24 text-right">Typical intake</span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-slate-300 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (TYPICAL_INTAKE / result.dailyProtein) * 100)}%` }}
                  />
                  <span className="absolute right-2 top-0 h-full flex items-center text-[10px] text-slate-500">{TYPICAL_INTAKE}g</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-24 text-right">Recommended</span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: '100%' }}
                  />
                  <span className="absolute right-2 top-0 h-full flex items-center text-[10px] text-slate-500">{Math.round(result.dailyProtein)}g</span>
                </div>
              </div>
            </div>
            <p className={`text-xs mt-3 font-medium ${result.typicalDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {result.typicalDiff >= 0
                ? `You need +${Math.round(result.typicalDiff)}g more protein than the typical intake to meet your goals.`
                : `Your target is ${Math.abs(Math.round(result.typicalDiff))}g lower than typical — adjust based on your needs.`
              }
            </p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">High-Protein Food Sources</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 pr-4 font-semibold text-slate-600">Food</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-600">Portion</th>
                    <th className="text-right py-2 pl-3 font-semibold text-slate-600">Protein</th>
                  </tr>
                </thead>
                <tbody>
                  {HIGH_PROTEIN_FOODS.map((food, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="py-2 pr-4 text-slate-700">{food.name}</td>
                      <td className="py-2 px-3 text-right text-slate-500">{food.portion}</td>
                      <td className="py-2 pl-3 text-right font-semibold text-violet-700">{food.protein}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Protein needs vary based on individual health, age, and specific conditions. Consult a qualified healthcare provider or registered dietitian for personalized nutrition advice.
      </p>
    </div>
  );
}