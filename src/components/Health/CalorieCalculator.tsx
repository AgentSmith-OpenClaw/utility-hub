'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
type Goal = 'lose' | 'maintain' | 'gain';

interface CalorieResult {
  bmr: number;
  tdee: number;
  target: number;
  deficit: number;
  surplus: number;
  macros: { protein: number; carbs: number; fat: number };
  goalLabel: string;
}

const ACTIVITY_FACTORS: Record<ActivityLevel, { label: string; factor: number; desc: string }> = {
  sedentary:  { label: 'Sedentary',      factor: 1.2,   desc: 'Little or no exercise' },
  light:      { label: 'Lightly Active', factor: 1.375, desc: 'Light exercise 1–3 days/week' },
  moderate:   { label: 'Moderately Active', factor: 1.55,  desc: 'Moderate exercise 3–5 days/week' },
  very:       { label: 'Very Active',   factor: 1.725, desc: 'Hard exercise 6–7 days/week' },
  extra:      { label: 'Extra Active',   factor: 1.9,   desc: 'Very hard exercise & physical job' },
};

function calcBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function calcTdee(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_FACTORS[activity].factor);
}

function calcTarget(tdee: number, goal: Goal): { target: number; label: string; deficit: number; surplus: number } {
  if (goal === 'lose') return { target: tdee - 500, label: 'Weight Loss', deficit: 500, surplus: 0 };
  if (goal === 'gain') return { target: tdee + 300, label: 'Muscle Gain', deficit: 0, surplus: 300 };
  return { target: tdee, label: 'Maintenance', deficit: 0, surplus: 0 };
}

function calcMacros(target: number): { protein: number; carbs: number; fat: number } {
  return {
    protein: Math.round((target * 0.30) / 4),
    carbs:   Math.round((target * 0.40) / 4),
    fat:     Math.round((target * 0.30) / 9),
  };
}

function lbsToKg(lbs: number) { return lbs / 2.20462; }
function kgToLbs(kg: number) { return kg * 2.20462; }
function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), inch: Math.round(totalIn % 12) };
}

export default function CalorieCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');

  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');

  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');

  const result = useMemo<CalorieResult | null>(() => {
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
    const { target, label, deficit, surplus } = calcTarget(tdee, goal);
    const macros = calcMacros(target);

    return { bmr: Math.round(bmr), tdee, target: Math.round(target), deficit, surplus, macros, goalLabel: label };
  }, [system, sex, age, activity, goal, heightCm, weightKg, heightFt, heightIn, weightLbs]);

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
        <div className="grid grid-cols-3 gap-2">
          {(['lose', 'maintain', 'gain'] as Goal[]).map((g) => {
            const labels = { lose: 'Lose', maintain: 'Maintain', gain: 'Gain' };
            const colors = {
              lose:    goal === g ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50',
              maintain: goal === g ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50',
              gain:    goal === g ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50',
            };
            const icons = { lose: '📉', maintain: '⚖️', gain: '💪' };
            return (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`py-3 rounded-lg text-sm font-semibold border transition-all flex flex-col items-center gap-1 ${colors[g]}`}
              >
                <span className="text-lg">{icons[g]}</span>
                <span>{labels[g]}</span>
                <span className="text-[10px] font-normal opacity-70">
                  {g === 'lose' ? '-500 kcal' : g === 'gain' ? '+300 kcal' : 'TDEE'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Target Calorie Intake</p>
                <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{result.target.toLocaleString()} <span className="text-base font-normal text-slate-500">kcal/day</span></p>
                <p className="text-sm text-slate-500 mt-1">{result.goalLabel}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                {result.deficit > 0 && <p className="text-amber-600 font-medium">−{result.deficit} kcal deficit</p>}
                {result.surplus > 0 && <p className="text-emerald-600 font-medium">+{result.surplus} kcal surplus</p>}
              </div>
            </div>

            <div className="relative bg-slate-100 rounded-full h-4 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-violet-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (result.target / result.tdee) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0</span>
              <span>TDEE: {result.tdee.toLocaleString()}</span>
              <span>2× TDEE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">BMR</p>
              <p className="text-2xl font-bold text-slate-800">{result.bmr.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-0.5">kcal/day at rest</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">TDEE</p>
              <p className="text-2xl font-bold text-slate-800">{result.tdee.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-0.5">with activity factor</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">Macro Split Recommendation</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center mx-auto mb-1">
                  <span className="text-rose-600 font-bold text-sm">{result.macros.protein}g</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">Protein</p>
                <p className="text-[10px] text-slate-400">30% · {result.macros.protein * 4} kcal</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center mx-auto mb-1">
                  <span className="text-amber-600 font-bold text-sm">{result.macros.carbs}g</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">Carbs</p>
                <p className="text-[10px] text-slate-400">40% · {result.macros.carbs * 4} kcal</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center mx-auto mb-1">
                  <span className="text-sky-600 font-bold text-sm">{result.macros.fat}g</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">Fat</p>
                <p className="text-[10px] text-slate-400">30% · {result.macros.fat * 9} kcal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Calorie needs are estimates based on the Mifflin-St Jeor equation and may not reflect your actual requirements. Consult a qualified healthcare provider or registered dietitian for personalized nutrition advice.
      </p>
    </div>
  );
}