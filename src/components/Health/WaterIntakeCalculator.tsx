'use client';
import React, { useState, useMemo } from 'react';

type WeightUnit = 'kg' | 'lbs';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
type Climate = 'temperate' | 'hot' | 'cold';
type Goal = 'maintain' | 'lose' | 'gain';

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  athlete: 'Athlete / Intense Training',
};

const ACTIVITY_BASE_ML: Record<ActivityLevel, number> = {
  sedentary: 30,
  light: 35,
  moderate: 38,
  active: 40,
  athlete: 45,
};

const GOAL_LABELS: Record<Goal, string> = {
  maintain: 'Maintain Weight',
  lose: 'Lose Weight',
  gain: 'Gain Muscle',
};

function kgToLbs(kg: number) { return kg * 2.20462; }
function lbsToKg(lbs: number) { return lbs / 2.20462; }

interface WaterResult {
  dailyMl: number;
  dailyCups: number;
  perMealMl: number;
  perMealCups: number;
  typicalMl: number;
  differenceMl: number;
}

export default function WaterIntakeCalculator() {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [weightKg, setWeightKg] = useState('70');
  const [weightLbs, setWeightLbs] = useState('154');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [exerciseMin, setExerciseMin] = useState('30');
  const [climate, setClimate] = useState<Climate>('temperate');
  const [goal, setGoal] = useState<Goal>('maintain');

  const result = useMemo<WaterResult | null>(() => {
    const wKg = weightUnit === 'kg'
      ? parseFloat(weightKg) || 0
      : lbsToKg(parseFloat(weightLbs) || 0);

    if (wKg <= 0) return null;

    let baseMlPerKg = ACTIVITY_BASE_ML[activity];
    let dailyMl = wKg * baseMlPerKg;

    const exercise = parseFloat(exerciseMin) || 0;
    const exerciseBlocks = Math.floor(exercise / 30);
    dailyMl += exerciseBlocks * 350;

    if (climate === 'hot') dailyMl += 250;

    if (goal === 'lose') dailyMl *= 1.20;
    else if (goal === 'gain') dailyMl *= 1.15;

    const perMealMl = dailyMl / 4;
    const typicalMl = 2000;
    const differenceMl = dailyMl - typicalMl;

    return {
      dailyMl: Math.round(dailyMl),
      dailyCups: Math.round(dailyMl / 240),
      perMealMl: Math.round(perMealMl),
      perMealCups: Math.round(perMealMl / 240),
      typicalMl,
      differenceMl: Math.round(differenceMl),
    };
  }, [weightUnit, weightKg, weightLbs, activity, exerciseMin, climate, goal]);

  const filledCups = result ? Math.min(4, Math.round(result.dailyCups / 3)) : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex gap-2 mb-6">
          {(['kg', 'lbs'] as WeightUnit[]).map((u) => (
            <button
              key={u}
              onClick={() => setWeightUnit(u)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                weightUnit === u
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              {u === 'kg' ? 'Kilograms (kg)' : 'Pounds (lbs)'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Body Weight</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weightUnit === 'kg' ? weightKg : weightLbs}
                onChange={(e) => {
                  if (weightUnit === 'kg') setWeightKg(e.target.value);
                  else setWeightLbs(e.target.value);
                }}
                min={20}
                max={500}
                className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{weightUnit}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Activity Level</label>
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setActivity(k)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border text-left transition-all ${
                    activity === k
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  {ACTIVITY_LABELS[k]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Exercise Minutes per Day
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={exerciseMin}
                onChange={(e) => setExerciseMin(e.target.value)}
                min={0}
                max={480}
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">min</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Climate</label>
            <div className="flex gap-2">
              {(['temperate', 'hot', 'cold'] as Climate[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setClimate(c)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border capitalize transition-all ${
                    climate === c
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`py-2.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all capitalize ${
                    goal === g
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  {GOAL_LABELS[g]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5 shadow-sm">
            <p className="text-sm text-violet-600 font-semibold uppercase tracking-wider mb-1">Daily Water Target</p>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                {result.dailyMl.toLocaleString()}
              </span>
              <span className="text-lg text-slate-500 font-medium">mL</span>
            </div>
            <p className="text-base text-slate-600 font-medium">
              ~{result.dailyCups} standard cups (8 oz / 240 mL)
            </p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-violet-200">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Per Meal (4/day)</p>
                <p className="text-lg font-bold text-slate-800">{result.perMealMl.toLocaleString()} mL</p>
                <p className="text-xs text-slate-400">~{result.perMealCups} cups</p>
              </div>
              <div className="w-px h-10 bg-violet-200" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Typical Intake</p>
                <p className="text-lg font-bold text-slate-800">{result.typicalMl.toLocaleString()} mL</p>
                <p className="text-xs text-slate-400">~8 cups</p>
              </div>
              <div className="w-px h-10 bg-violet-200" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Difference</p>
                <p className={`text-lg font-bold ${result.differenceMl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {result.differenceMl >= 0 ? '+' : ''}{result.differenceMl.toLocaleString()} mL
                </p>
                <p className="text-xs text-slate-400">vs typical</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-4">Glass Tracker (4 cups per serving)</p>
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-14 h-20 rounded-t-xl border-2 transition-all duration-500 flex items-end justify-center overflow-hidden ${
                      i <= filledCups
                        ? 'bg-violet-100 border-violet-400'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {i <= filledCups && (
                      <div className="w-full bg-violet-400 rounded-b-xl transition-all duration-500" style={{ height: '70%' }} />
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{i}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">
              {filledCups} of 4 cups visualized — each representing ~3 cups (720 mL)
            </p>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool provides general hydration guidance based on commonly used formulas. Individual water needs vary based on health conditions, pregnancy, breastfeeding, illness, and other factors. Consult a qualified healthcare provider for personalized hydration recommendations.
      </p>
    </div>
  );
}