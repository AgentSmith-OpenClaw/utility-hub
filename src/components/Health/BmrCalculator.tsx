'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';

interface BmrResult {
  bmr: number;
  bsa: number;
  avgBmr: number;
  spectrumPercent: number;
  label: string;
}

function calcBmr(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function calcBsa(weightKg: number, heightCm: number): number {
  return 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
}

function bmrToSpectrum(bmr: number, sex: Sex): { percent: number; label: string } {
  if (sex === 'male') {
    if (bmr < 1200) return { percent: 10, label: 'Very Low' };
    if (bmr < 1500) return { percent: 25, label: 'Low' };
    if (bmr < 1800) return { percent: 50, label: 'Average' };
    if (bmr < 2100) return { percent: 72, label: 'High' };
    return { percent: 90, label: 'Very High' };
  } else {
    if (bmr < 1000) return { percent: 10, label: 'Very Low' };
    if (bmr < 1250) return { percent: 25, label: 'Low' };
    if (bmr < 1500) return { percent: 50, label: 'Average' };
    if (bmr < 1750) return { percent: 72, label: 'High' };
    return { percent: 90, label: 'Very High' };
  }
}

function kgToLbs(kg: number) { return kg * 2.20462; }
function lbsToKg(lbs: number) { return lbs / 2.20462; }
function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), inch: Math.round(totalIn % 12) };
}

export default function BmrCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('');

  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');

  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('154');

  const result = useMemo<BmrResult | null>(() => {
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
    const bsa = calcBsa(wKg, hCm);
    const avgBmr = sex === 'male' ? 1700 : 1400;
    const { percent, label } = bmrToSpectrum(bmr, sex);

    return { bmr, bsa, avgBmr, spectrumPercent: percent, label };
  }, [system, sex, age, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  const displayBsa = result
    ? system === 'metric'
      ? `${result.bsa.toFixed(2)} m²`
      : `${(result.bsa * 3.861 * 10).toFixed(2)} in²`
    : null;

  const SPECTRUM_STOPS = [
    { label: 'Very Low', color: 'bg-blue-400' },
    { label: 'Low', color: 'bg-sky-400' },
    { label: 'Average', color: 'bg-emerald-400' },
    { label: 'High', color: 'bg-amber-400' },
    { label: 'Very High', color: 'bg-rose-400' },
  ];

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
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biological sex</label>
            <div className="flex gap-2">
              {(['male', 'female'] as Sex[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                    sex === s
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
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
                min={1} max={119}
                className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
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

      {result && (
        <>
          <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500 mb-0.5 text-center">Your Basal Metabolic Rate</p>
            <p className="text-6xl font-extrabold text-slate-900 tracking-tight text-center mb-1">
              {Math.round(result.bmr).toLocaleString()}
            </p>
            <p className="text-base text-slate-500 text-center mb-5">kcal / day</p>

            <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 mb-4">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5 text-center">
                This is the calories your body needs at complete rest
              </p>
            </div>

            <div className="mb-4">
              <div className="relative h-4 rounded-full overflow-hidden flex">
                <div className="w-[10%] bg-blue-300" />
                <div className="w-[15%] bg-sky-300" />
                <div className="w-[25%] bg-emerald-300" />
                <div className="w-[22%] bg-amber-300" />
                <div className="flex-1 bg-rose-300" />
              </div>
              <div className="relative h-4 -mt-4">
                <div
                  className="absolute top-0 w-0.5 h-4 bg-slate-800 rounded-full transition-all duration-500"
                  style={{ left: `${result.spectrumPercent}%`, transform: 'translateX(-50%)' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 select-none">
                <span>Very Low</span>
                <span>Low</span>
                <span>Average</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-center">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Body Surface Area</p>
                <p className="text-base font-bold text-slate-800">{displayBsa}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-center">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Your Level</p>
                <p className="text-base font-bold text-slate-800">{result.label}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Comparison to Average</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Your BMR</span>
                <span className="text-sm font-bold text-slate-800">{Math.round(result.bmr).toLocaleString()} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Average {sex === 'male' ? 'Men' : 'Women'}</span>
                <span className="text-sm font-bold text-slate-800">{result.avgBmr.toLocaleString()} kcal</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                <span className="text-sm text-slate-600">Difference</span>
                <span className={`text-sm font-bold ${result.bmr >= result.avgBmr ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {result.bmr >= result.avgBmr ? '+' : ''}{Math.round(result.bmr - result.avgBmr).toLocaleString()} kcal
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. BMR varies based on muscle mass, thyroid conditions, and other factors. Consult a qualified healthcare provider for personalized advice.
      </p>
    </div>
  );
}