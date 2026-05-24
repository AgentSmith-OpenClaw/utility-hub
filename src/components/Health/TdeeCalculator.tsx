'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';

interface ActivityLevel {
  key: string;
  label: string;
  description: string;
  factor: number;
}

const ACTIVITY_LEVELS: ActivityLevel[] = [
  { key: 'sedentary', label: 'Sedentary', description: 'Office job, little or no exercise', factor: 1.2 },
  { key: 'light', label: 'Lightly Active', description: 'Light exercise 1–3 days/week', factor: 1.375 },
  { key: 'moderate', label: 'Moderately Active', description: 'Moderate exercise 3–5 days/week', factor: 1.55 },
  { key: 'very', label: 'Very Active', description: 'Hard exercise 6–7 days/week', factor: 1.725 },
  { key: 'extreme', label: 'Extremely Active', description: 'Physical job + hard daily training', factor: 1.9 },
];

function calcBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function lbsToKg(lbs: number) { return lbs / 2.20462; }
function kgToLbs(kg: number) { return kg * 2.20462; }
function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), inch: Math.round(totalIn % 12) };
}

interface TdeeResult {
  bmr: number;
  tdee: number;
  activityCalories: number;
  activityPercent: number;
}

export default function TdeeCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [activityKey, setActivityKey] = useState('moderate');

  // Metric inputs
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');

  // Imperial inputs
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');

  const result = useMemo<TdeeResult | null>(() => {
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
    if (!hCm || !wKg || hCm <= 0 || wKg <= 0 || !ageNum || ageNum <= 0 || ageNum >= 120) {
      return null;
    }

    const bmr = calcBmr(wKg, hCm, ageNum, sex);
    const activity = ACTIVITY_LEVELS.find(a => a.key === activityKey);
    const factor = activity?.factor ?? 1.55;
    const tdee = Math.round(bmr * factor);
    const activityCalories = tdee - Math.round(bmr);
    const activityPercent = Math.round((activityCalories / tdee) * 100);

    return { bmr: Math.round(bmr), tdee, activityCalories, activityPercent };
  }, [system, sex, age, activityKey, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  const displayWeight = system === 'metric'
    ? `${weightKg} kg`
    : `${weightLbs} lbs`;

  const displayHeight = system === 'metric'
    ? `${heightCm} cm`
    : `${heightFt}'${heightIn}"`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Unit toggle */}
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

        {/* Sex toggle */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biological sex</label>
          <div className="flex gap-2">
            {(['male', 'female'] as Sex[]).map((s) => (
              <button
                key={s}
                onClick={() => setSex(s)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
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

        {/* Age */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 30"
              min={1} max={119}
              className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
            <span className="text-sm text-slate-500">years</span>
          </div>
        </div>

        {/* Height */}
        <div className="mb-5">
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

        {/* Weight */}
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

      {/* Activity level selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Activity level</label>
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.key}
              onClick={() => setActivityKey(level.key)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                activityKey === level.key
                  ? 'bg-violet-50 border-violet-400 border-2'
                  : 'bg-white border-slate-200 hover:border-violet-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${activityKey === level.key ? 'text-violet-700' : 'text-slate-700'}`}>
                  {level.label}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  activityKey === level.key ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  ×{level.factor}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${activityKey === level.key ? 'text-violet-600' : 'text-slate-400'}`}>
                {level.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main TDEE result */}
          <div className="bg-violet-50 border-2 border-violet-300 rounded-xl p-6 text-center">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-1">Your TDEE</p>
            <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
              {result.tdee.toLocaleString()}
            </p>
            <p className="text-base text-slate-500 mt-1">calories per day</p>
          </div>

          {/* BMR vs Activity breakdown */}
          <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-600 mb-4 text-center">Daily energy breakdown</p>

            {/* Bar chart */}
            <div className="mb-4">
              <div className="flex h-8 rounded-full overflow-hidden">
                <div
                  className="bg-violet-400 flex items-center justify-center"
                  style={{ width: `${100 - result.activityPercent}%` }}
                >
                  {100 - result.activityPercent > 15 && (
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {100 - result.activityPercent}% BMR
                    </span>
                  )}
                </div>
                <div
                  className="bg-fuchsia-400 flex items-center justify-center"
                  style={{ width: `${result.activityPercent}%` }}
                >
                  {result.activityPercent > 15 && (
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {result.activityPercent}% Activity
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Rest (BMR)</span>
                <span>Activity</span>
              </div>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">BMR</p>
                <p className="text-xl font-bold text-slate-800">{result.bmr.toLocaleString()}</p>
                <p className="text-xs text-slate-400">kcal/day at rest</p>
              </div>
              <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-fuchsia-600 font-semibold uppercase tracking-wider mb-0.5">Activity</p>
                <p className="text-xl font-bold text-slate-800">+{result.activityCalories.toLocaleString()}</p>
                <p className="text-xs text-slate-400">kcal/day from activity</p>
              </div>
            </div>

            {/* Comparison */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <p className="text-xs text-slate-500">Avg Male</p>
                <p className="text-sm font-bold text-slate-700">2,500 kcal</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <p className="text-xs text-slate-500">Avg Female</p>
                <p className="text-sm font-bold text-slate-700">2,000 kcal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. TDEE is an estimate based on the Mifflin-St Jeor equation and activity multipliers. Individual needs vary based on muscle mass, medical conditions, and other factors. Consult a qualified healthcare provider for personalized advice.
      </p>
    </div>
  );
}