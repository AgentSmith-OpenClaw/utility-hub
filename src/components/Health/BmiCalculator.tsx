'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';

interface BmiResult {
  bmi: number;
  category: string;
  categoryColor: string;
  gaugePercent: number;
  minHealthyKg: number;
  maxHealthyKg: number;
  bmr: number | null;
}

function calcBmi(system: UnitSystem, heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const hM = heightCm / 100;
  return weightKg / (hM * hM);
}

function bmiCategory(bmi: number): { category: string; categoryColor: string } {
  if (bmi < 18.5) return { category: 'Underweight', categoryColor: 'text-blue-600' };
  if (bmi < 25)   return { category: 'Normal weight', categoryColor: 'text-emerald-600' };
  if (bmi < 30)   return { category: 'Overweight', categoryColor: 'text-amber-600' };
  return { category: 'Obese', categoryColor: 'text-rose-600' };
}

// Maps BMI 10–45 to 0–100% gauge position
function bmiToGauge(bmi: number): number {
  const min = 10, max = 45;
  return Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100));
}

// Mifflin-St Jeor BMR (kcal/day)
function calcBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function kgToLbs(kg: number) { return kg * 2.20462; }
function lbsToKg(lbs: number) { return lbs / 2.20462; }
function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), inch: Math.round(totalIn % 12) };
}

export default function BmiCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');

  // Metric inputs
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');

  // Imperial inputs
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');

  // BMR extras
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [showBmr, setShowBmr] = useState(false);

  const result = useMemo<BmiResult | null>(() => {
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

    if (!hCm || !wKg || hCm <= 0 || wKg <= 0) return null;

    const bmi = calcBmi(system, hCm, wKg);
    if (bmi <= 0) return null;

    const { category, categoryColor } = bmiCategory(bmi);
    const gaugePercent = bmiToGauge(bmi);

    // Healthy weight range for this height: BMI 18.5–24.9
    const hM = hCm / 100;
    const minHealthyKg = 18.5 * hM * hM;
    const maxHealthyKg = 24.9 * hM * hM;

    let bmr: number | null = null;
    const ageNum = parseFloat(age);
    if (showBmr && ageNum > 0 && ageNum < 120) {
      bmr = calcBmr(wKg, hCm, ageNum, sex);
    }

    return { bmi, category, categoryColor, gaugePercent, minHealthyKg, maxHealthyKg, bmr };
  }, [system, heightCm, weightKg, heightFt, heightIn, weightLbs, age, sex, showBmr]);

  const healthyRange = result
    ? system === 'metric'
      ? `${result.minHealthyKg.toFixed(1)}–${result.maxHealthyKg.toFixed(1)} kg`
      : `${kgToLbs(result.minHealthyKg).toFixed(1)}–${kgToLbs(result.maxHealthyKg).toFixed(1)} lbs`
    : null;

  const GAUGE_STOPS = [
    { label: 'Under', pct: 0, color: 'bg-blue-400' },
    { label: 'Normal', pct: 24, color: 'bg-emerald-400' },
    { label: 'Over', pct: 52, color: 'bg-amber-400' },
    { label: 'Obese', pct: 67, color: 'bg-rose-400' },
  ];

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

        {/* Inputs */}
        <div className="space-y-4">
          {/* Height */}
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
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500 mb-0.5">Your BMI</p>
              <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
                {result.bmi.toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${result.categoryColor}`}>{result.category}</span>
              <p className="text-xs text-slate-400 mt-0.5">WHO classification</p>
            </div>
          </div>

          {/* Gauge bar */}
          <div className="mb-4">
            <div className="relative h-3 rounded-full overflow-hidden flex">
              <div className="w-[24%] bg-blue-300" />
              <div className="w-[28%] bg-emerald-300" />
              <div className="w-[15%] bg-amber-300" />
              <div className="flex-1 bg-rose-300" />
            </div>
            {/* Needle */}
            <div className="relative h-3 -mt-3">
              <div
                className="absolute top-0 w-0.5 h-3 bg-slate-800 rounded-full transition-all duration-500"
                style={{ left: `${result.gaugePercent}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            {/* Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 select-none">
              <span>10</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>45</span>
            </div>
          </div>

          {/* Category reference */}
          <div className="grid grid-cols-4 gap-1.5 text-center mb-4">
            {[
              { label: 'Underweight', range: '< 18.5', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { label: 'Normal', range: '18.5–24.9', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
              { label: 'Overweight', range: '25–29.9', color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { label: 'Obese', range: '≥ 30', color: 'bg-rose-50 border-rose-200 text-rose-700' },
            ].map(({ label, range, color }) => (
              <div key={label} className={`rounded-lg border px-1.5 py-2 text-[11px] font-semibold ${color}`}>
                <div>{label}</div>
                <div className="font-normal opacity-80 mt-0.5">{range}</div>
              </div>
            ))}
          </div>

          {/* Healthy weight range */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
            <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Healthy weight for your height</p>
            <p className="text-base font-bold text-slate-800">{healthyRange}</p>
          </div>
        </div>
      )}

      {/* BMR toggle */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <button
          onClick={() => setShowBmr((v) => !v)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-semibold text-slate-700">
            Also calculate BMR (Basal Metabolic Rate)
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${showBmr ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showBmr && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 30"
                    min={1} max={120}
                    className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                  />
                  <span className="text-sm text-slate-500">years</span>
                </div>
              </div>
              <div>
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
            </div>

            {result?.bmr != null && (
              <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
                <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Basal Metabolic Rate (Mifflin-St Jeor)</p>
                <p className="text-2xl font-bold text-slate-800">{Math.round(result.bmr).toLocaleString()} <span className="text-base font-normal text-slate-500">kcal/day</span></p>
                <p className="text-xs text-slate-400 mt-1">Calories your body burns at complete rest. Multiply by your activity factor for TDEE.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        BMI is a screening tool, not a diagnostic measure. It does not directly measure body fat or account for muscle mass, bone density, age, or sex. Consult a qualified healthcare provider for personalized health advice.
      </p>
    </div>
  );
}
