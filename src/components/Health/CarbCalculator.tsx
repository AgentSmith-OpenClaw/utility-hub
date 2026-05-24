'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
type DietProfile = 'standard' | 'low-carb' | 'keto';
type CalorieMode = 'tdee' | 'manual';

interface CarbResult {
  totalCarbs: number;
  netCarbs: number;
  caloriesFromCarbs: number;
  carbPercent: number;
  fiberRecommendation: number;
  proteinCalories: number;
  fatCalories: number;
  proteinGrams: number;
  fatGrams: number;
}

const ACTIVITY_FACTORS: Record<ActivityLevel, { label: string; factor: number; desc: string }> = {
  sedentary: { label: 'Sedentary', factor: 1.2, desc: 'Little or no exercise' },
  light: { label: 'Lightly Active', factor: 1.375, desc: 'Light exercise 1–3 days/week' },
  moderate: { label: 'Moderately Active', factor: 1.55, desc: 'Moderate exercise 3–5 days/week' },
  very: { label: 'Very Active', factor: 1.725, desc: 'Hard exercise 6–7 days/week' },
  extra: { label: 'Extra Active', factor: 1.9, desc: 'Very hard exercise & physical job' },
};

const DIET_RANGES: Record<DietProfile, { label: string; minPct: number; maxPct: number; desc: string }> = {
  standard: { label: 'Standard', minPct: 0.45, maxPct: 0.55, desc: '45–55% of calories — balanced diet' },
  'low-carb': { label: 'Low-Carb', minPct: 0.25, maxPct: 0.35, desc: '25–35% of calories — reduced carbs' },
  keto: { label: 'Keto', minPct: 0.05, maxPct: 0.10, desc: '5–10% of calories — strict ketosis' },
};

const HIGH_CARB_FOODS = [
  { name: 'White Rice (cooked)', serving: '1 cup (158g)', carbs: 45 },
  { name: 'Banana', serving: '1 medium (118g)', carbs: 27 },
  { name: 'Oatmeal (cooked)', serving: '1 cup (234g)', carbs: 27 },
  { name: 'Sweet Potato', serving: '1 medium (150g)', carbs: 26 },
  { name: 'Whole Wheat Bread', serving: '1 slice (43g)', carbs: 20 },
  { name: 'Pasta (cooked)', serving: '1 cup (140g)', carbs: 37 },
  { name: 'Apple', serving: '1 medium (182g)', carbs: 25 },
  { name: 'Quinoa (cooked)', serving: '1 cup (185g)', carbs: 39 },
  { name: 'Black Beans (cooked)', serving: '1 cup (172g)', carbs: 41 },
  { name: 'Chickpeas (cooked)', serving: '1 cup (164g)', carbs: 45 },
];

function calcBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function calcTdee(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_FACTORS[activity].factor);
}

function lbsToKg(lbs: number) { return lbs / 2.20462; }
function kgToLbs(kg: number) { return kg * 2.20462; }

export default function CarbCalculator() {
  const [mode, setMode] = useState<CalorieMode>('tdee');
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [dietProfile, setDietProfile] = useState<DietProfile>('standard');

  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');

  const [manualCalories, setManualCalories] = useState('2000');

  const result = useMemo<CarbResult | null>(() => {
    let dailyCalories: number;

    if (mode === 'manual') {
      dailyCalories = parseFloat(manualCalories) || 0;
      if (dailyCalories <= 0) return null;
    } else {
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
      dailyCalories = calcTdee(bmr, activity);
    }

    const diet = DIET_RANGES[dietProfile];
    const midPct = (diet.minPct + diet.maxPct) / 2;
    const totalCarbs = Math.round((dailyCalories * midPct) / 4);
    const fiberRecommendation = Math.round(dailyCalories / 1000 * 14);

    let netCarbs = totalCarbs;
    if (dietProfile === 'keto') {
      netCarbs = Math.max(0, totalCarbs - fiberRecommendation);
    }

    const caloriesFromCarbs = totalCarbs * 4;

    const proteinPct = dietProfile === 'keto' ? 0.20 : 0.25;
    const proteinGrams = Math.round((dailyCalories * proteinPct) / 4);
    const proteinCalories = proteinGrams * 4;

    const fatCalories = dailyCalories - caloriesFromCarbs - proteinCalories;
    const fatGrams = Math.round(fatCalories / 9);

    return {
      totalCarbs,
      netCarbs,
      caloriesFromCarbs,
      carbPercent: Math.round(midPct * 100),
      fiberRecommendation,
      proteinCalories,
      fatCalories,
      proteinGrams,
      fatGrams,
    };
  }, [mode, system, sex, age, activity, dietProfile, heightCm, weightKg, heightFt, heightIn, weightLbs, manualCalories]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex gap-2 mb-6">
          {(['tdee', 'manual'] as CalorieMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                mode === m
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              {m === 'tdee' ? 'Calculate from TDEE' : 'Enter manually'}
            </button>
          ))}
        </div>

        {mode === 'tdee' && (
          <>
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
          </>
        )}

        {mode === 'manual' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Daily Calorie Target</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                min={500} max={10000}
                className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">kcal/day</span>
            </div>
          </div>
        )}
      </div>

      {mode === 'tdee' && (
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
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Diet Profile</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(DIET_RANGES) as DietProfile[]).map((key) => {
            const { label, desc } = DIET_RANGES[key];
            return (
              <button
                key={key}
                onClick={() => setDietProfile(key)}
                className={`py-3 rounded-lg text-sm font-semibold border transition-all ${
                  dietProfile === key
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">{DIET_RANGES[dietProfile].desc}</p>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5">
            <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-1">Recommended Daily Carbohydrate Intake</p>
            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{result.totalCarbs}g <span className="text-base font-normal text-slate-500">carbs/day</span></p>
            <p className="text-sm text-slate-500 mt-1">{DIET_RANGES[dietProfile].label} — {result.carbPercent}% of daily calories</p>

            <div className="mt-4">
              <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-slate-200">
                <div className="bg-rose-400 transition-all" style={{ width: `${(result.proteinCalories / (result.proteinCalories + result.caloriesFromCarbs + result.fatCalories)) * 100}%` }} />
                <div className="bg-amber-400 transition-all" style={{ width: `${(result.caloriesFromCarbs / (result.proteinCalories + result.caloriesFromCarbs + result.fatCalories)) * 100}%` }} />
                <div className="bg-sky-400 transition-all" style={{ width: `${(result.fatCalories / (result.proteinCalories + result.caloriesFromCarbs + result.fatCalories)) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />Protein {Math.round((result.proteinCalories / (result.proteinCalories + result.caloriesFromCarbs + result.fatCalories)) * 100)}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Carbs {result.carbPercent}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />Fat {Math.round((result.fatCalories / (result.proteinCalories + result.caloriesFromCarbs + result.fatCalories)) * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total Carbs</p>
              <p className="text-2xl font-bold text-slate-800">{result.totalCarbs}g</p>
              <p className="text-xs text-slate-400 mt-0.5">{result.caloriesFromCarbs} kcal</p>
            </div>
            {dietProfile === 'keto' && (
              <div className="bg-violet-50 rounded-lg border border-violet-200 p-4 shadow-sm text-center">
                <p className="text-xs text-violet-600 font-medium uppercase tracking-wider mb-1">Net Carbs (keto)</p>
                <p className="text-2xl font-bold text-violet-700">{result.netCarbs}g</p>
                <p className="text-xs text-violet-500 mt-0.5">total − fiber</p>
              </div>
            )}
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Fiber Target</p>
              <p className="text-2xl font-bold text-slate-800">{result.fiberRecommendation}g</p>
              <p className="text-xs text-slate-400 mt-0.5">14g per 1000 kcal</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">Macro Breakdown</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Carbohydrates
                </span>
                <span className="text-sm font-semibold text-slate-800">{result.totalCarbs}g · {result.caloriesFromCarbs} kcal · {result.carbPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-400 h-2.5 rounded-full transition-all" style={{ width: `${result.carbPercent}%` }} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" /> Protein
                </span>
                <span className="text-sm font-semibold text-slate-800">{result.proteinGrams}g · {result.proteinCalories} kcal</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-rose-400 h-2.5 rounded-full transition-all" style={{ width: `${Math.round((result.proteinCalories / (result.proteinCalories + result.caloriesFromCarbs + result.fatCalories)) * 100)}%` }} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" /> Fat
                </span>
                <span className="text-sm font-semibold text-slate-800">{result.fatGrams}g · {Math.round(result.fatCalories)} kcal</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-sky-400 h-2.5 rounded-full transition-all" style={{ width: `${Math.round((result.fatCalories / (result.proteinCalories + result.caloriesFromCarbs + result.fatCalories)) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-4">Common High-Carb Foods</p>
        <div className="space-y-2">
          {HIGH_CARB_FOODS.map((food) => (
            <div key={food.name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div>
                <span className="text-sm font-medium text-slate-700">{food.name}</span>
                <span className="text-xs text-slate-400 ml-2">{food.serving}</span>
              </div>
              <span className="text-sm font-semibold text-amber-600">{food.carbs}g carbs</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Carbohydrate needs vary by individual based on activity level, metabolic health, and goals. Consult a qualified healthcare provider or registered dietitian for personalized nutrition advice.
      </p>
    </div>
  );
}