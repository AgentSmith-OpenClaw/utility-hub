'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';
type Method = 'navy' | 'bmi';

interface BodyFatResult {
  bfPercent: number;
  category: string;
  categoryColor: string;
  categoryBgColor: string;
  fatMassKg: number;
  leanMassKg: number;
  gaugePercent: number;
  method: Method;
}

const CATEGORIES_MALE = [
  { label: 'Essential', min: 2, max: 5.99, color: 'text-sky-600', bgColor: 'bg-sky-50 border-sky-200' },
  { label: 'Athletes', min: 6, max: 13.99, color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' },
  { label: 'Fitness', min: 14, max: 17.99, color: 'text-teal-600', bgColor: 'bg-teal-50 border-teal-200' },
  { label: 'Average', min: 18, max: 24.99, color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200' },
  { label: 'Obese', min: 25, max: 100, color: 'text-rose-600', bgColor: 'bg-rose-50 border-rose-200' },
];

const CATEGORIES_FEMALE = [
  { label: 'Essential', min: 10, max: 13.99, color: 'text-sky-600', bgColor: 'bg-sky-50 border-sky-200' },
  { label: 'Athletes', min: 14, max: 20.99, color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-200' },
  { label: 'Fitness', min: 21, max: 24.99, color: 'text-teal-600', bgColor: 'bg-teal-50 border-teal-200' },
  { label: 'Average', min: 25, max: 31.99, color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200' },
  { label: 'Obese', min: 32, max: 100, color: 'text-rose-600', bgColor: 'bg-rose-50 border-rose-200' },
];

function getCategory(bf: number, sex: Sex) {
  const cats = sex === 'male' ? CATEGORIES_MALE : CATEGORIES_FEMALE;
  return cats.find((c) => bf >= c.min && bf <= c.max) ?? cats[cats.length - 1];
}

function bfToGauge(bf: number, sex: Sex): number {
  const min = sex === 'male' ? 2 : 10;
  const max = sex === 'male' ? 40 : 50;
  return Math.min(100, Math.max(0, ((bf - min) / (max - min)) * 100));
}

function calcNavy(
  sex: Sex,
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm: number
): number | null {
  if (heightCm <= 0 || neckCm <= 0 || waistCm <= 0) return null;
  if (sex === 'female' && hipCm <= 0) return null;

  if (sex === 'male') {
    const wMinusN = waistCm - neckCm;
    if (wMinusN <= 0) return null;
    return 495 / (1.0324 - 0.19077 * Math.log10(wMinusN) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    const wPlusHMinusN = waistCm + hipCm - neckCm;
    if (wPlusHMinusN <= 0) return null;
    return 495 / (1.29579 - 0.35004 * Math.log10(wPlusHMinusN) + 0.221 * Math.log10(heightCm)) - 450;
  }
}

function calcBmiMethod(bmi: number, age: number, sex: Sex): number {
  const sexVal = sex === 'male' ? 1 : 0;
  return 1.2 * bmi + 0.23 * age - 10.8 * sexVal - 5.4;
}

function calcBmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const hM = heightCm / 100;
  return weightKg / (hM * hM);
}

function cmToIn(cm: number) { return cm / 2.54; }
function inToCm(inches: number) { return inches * 2.54; }
function kgToLbs(kg: number) { return kg * 2.20462; }
function lbsToKg(lbs: number) { return lbs / 2.20462; }
function cmToFtIn(cm: number): { ft: number; inch: number } {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), inch: Math.round(totalIn % 12) };
}

export default function BodyFatCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');
  const [method, setMethod] = useState<Method>('navy');

  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('70');
  const [neckCm, setNeckCm] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [hipCm, setHipCm] = useState('');
  const [age, setAge] = useState('');

  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [weightLbs, setWeightLbs] = useState('154');
  const [neckIn, setNeckIn] = useState('');
  const [waistIn, setWaistIn] = useState('');
  const [hipIn, setHipIn] = useState('');

  const result = useMemo<BodyFatResult | null>(() => {
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

    let bfPercent: number;
    let actualMethod: Method;

    if (method === 'navy') {
      let neckVal: number, waistVal: number, hipVal: number;

      if (system === 'metric') {
        neckVal = parseFloat(neckCm);
        waistVal = parseFloat(waistCm);
        hipVal = parseFloat(hipCm);
      } else {
        neckVal = inToCm(parseFloat(neckIn) || 0);
        waistVal = inToCm(parseFloat(waistIn) || 0);
        hipVal = inToCm(parseFloat(hipIn) || 0);
      }

      const bf = calcNavy(sex, hCm, neckVal, waistVal, hipVal);
      if (bf === null || bf <= 0 || bf > 60) return null;
      bfPercent = bf;
      actualMethod = 'navy';
    } else {
      const ageNum = parseFloat(age);
      if (!ageNum || ageNum < 1 || ageNum > 120) return null;
      const bmi = calcBmi(wKg, hCm);
      if (bmi <= 0) return null;
      bfPercent = calcBmiMethod(bmi, ageNum, sex);
      actualMethod = 'bmi';
    }

    if (bfPercent <= 0 || bfPercent > 60) return null;

    const cat = getCategory(bfPercent, sex);
    const fatMassKg = wKg * (bfPercent / 100);
    const leanMassKg = wKg - fatMassKg;
    const gaugePercent = bfToGauge(bfPercent, sex);

    return {
      bfPercent,
      category: cat.label,
      categoryColor: cat.color,
      categoryBgColor: cat.bgColor,
      fatMassKg,
      leanMassKg,
      gaugePercent,
      method: actualMethod,
    };
  }, [system, sex, method, heightCm, weightKg, neckCm, waistCm, hipCm, age, heightFt, heightIn, weightLbs, neckIn, waistIn, hipIn]);

  const formatMass = (kg: number) => {
    if (system === 'metric') {
      return { value: kg.toFixed(1), unit: 'kg' };
    }
    return { value: kgToLbs(kg).toFixed(1), unit: 'lbs' };
  };

  const GAUGE_STOPS_MALE = [
    { label: 'Essential', pct: 7.5, color: 'bg-sky-400' },
    { label: 'Athletes', pct: 30, color: 'bg-emerald-400' },
    { label: 'Fitness', pct: 47.5, color: 'bg-teal-400' },
    { label: 'Average', pct: 65, color: 'bg-amber-400' },
    { label: 'Obese', pct: 85, color: 'bg-rose-400' },
  ];

  const GAUGE_STOPS_FEMALE = [
    { label: 'Essential', pct: 10, color: 'bg-sky-400' },
    { label: 'Athletes', pct: 30, color: 'bg-emerald-400' },
    { label: 'Fitness', pct: 47.5, color: 'bg-teal-400' },
    { label: 'Average', pct: 65, color: 'bg-amber-400' },
    { label: 'Obese', pct: 85, color: 'bg-rose-400' },
  ];

  const gaugeStops = sex === 'male' ? GAUGE_STOPS_MALE : GAUGE_STOPS_FEMALE;

  const categories = sex === 'male' ? CATEGORIES_MALE : CATEGORIES_FEMALE;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Method toggle */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex gap-2 mb-4">
          {(['navy', 'bmi'] as Method[]).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                method === m
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              {m === 'navy' ? 'US Navy Method' : 'BMI-Based'}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 mb-4">
          {method === 'navy'
            ? 'Uses neck, waist, and hip measurements for higher accuracy.'
            : 'Uses BMI, age, and sex. Less accurate but requires fewer inputs.'}
        </div>

        {/* Sex toggle */}
        <div className="mb-4">
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

        {/* Unit toggle */}
        <div className="flex gap-2 mb-4">
          {(['metric', 'imperial'] as UnitSystem[]).map((s) => (
            <button
              key={s}
              onClick={() => setSystem(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                system === s
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
              }`}
            >
              {s === 'metric' ? 'Metric (cm / kg)' : 'Imperial (in / lbs)'}
            </button>
          ))}
        </div>

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

          {method === 'bmi' && (
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
          )}

          {method === 'navy' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Neck circumference</label>
                <div className="flex items-center gap-2">
                  {system === 'metric' ? (
                    <>
                      <input
                        type="number"
                        value={neckCm}
                        onChange={(e) => setNeckCm(e.target.value)}
                        placeholder="e.g. 38"
                        min={1} max={100}
                        className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                      />
                      <span className="text-sm text-slate-500">cm</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="number"
                        value={neckIn}
                        onChange={(e) => setNeckIn(e.target.value)}
                        placeholder="e.g. 15"
                        min={1} max={40}
                        step="0.1"
                        className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                      />
                      <span className="text-sm text-slate-500">in</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Waist circumference</label>
                <div className="flex items-center gap-2">
                  {system === 'metric' ? (
                    <>
                      <input
                        type="number"
                        value={waistCm}
                        onChange={(e) => setWaistCm(e.target.value)}
                        placeholder="e.g. 85"
                        min={1} max={200}
                        className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                      />
                      <span className="text-sm text-slate-500">cm</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="number"
                        value={waistIn}
                        onChange={(e) => setWaistIn(e.target.value)}
                        placeholder="e.g. 34"
                        min={1} max={80}
                        step="0.1"
                        className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                      />
                      <span className="text-sm text-slate-500">in</span>
                    </>
                  )}
                </div>
              </div>

              {sex === 'female' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hip circumference</label>
                  <div className="flex items-center gap-2">
                    {system === 'metric' ? (
                      <>
                        <input
                          type="number"
                          value={hipCm}
                          onChange={(e) => setHipCm(e.target.value)}
                          placeholder="e.g. 95"
                          min={1} max={200}
                          className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                        />
                        <span className="text-sm text-slate-500">cm</span>
                      </>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={hipIn}
                          onChange={(e) => setHipIn(e.target.value)}
                          placeholder="e.g. 38"
                          min={1} max={80}
                          step="0.1"
                          className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                        />
                        <span className="text-sm text-slate-500">in</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500 mb-0.5">Body Fat</p>
              <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
                {result.bfPercent.toFixed(1)}<span className="text-2xl text-slate-400 font-bold">%</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {result.method === 'navy' ? 'US Navy Method' : 'BMI-Based Method'}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${result.categoryColor}`}>{result.category}</span>
              <p className="text-xs text-slate-400 mt-0.5">Category</p>
            </div>
          </div>

          {/* Gauge bar */}
          <div className="mb-4">
            <div className="relative h-3 rounded-full overflow-hidden flex">
              <div className="w-[7.5%] bg-sky-300" />
              <div className="w-[22.5%] bg-emerald-300" />
              <div className="w-[17.5%] bg-teal-300" />
              <div className="w-[17.5%] bg-amber-300" />
              <div className="flex-1 bg-rose-300" />
            </div>
            <div className="relative h-3 -mt-3">
              <div
                className="absolute top-0 w-0.5 h-3 bg-slate-800 rounded-full transition-all duration-500"
                style={{ left: `${result.gaugePercent}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 select-none">
              <span>{sex === 'male' ? '2' : '10'}</span>
              <span>{sex === 'male' ? '6' : '14'}</span>
              <span>{sex === 'male' ? '14' : '21'}</span>
              <span>{sex === 'male' ? '18' : '25'}</span>
              <span>{sex === 'male' ? '25' : '32'}</span>
              <span>{sex === 'male' ? '40' : '50'}</span>
            </div>
          </div>

          {/* Category reference */}
          <div className="grid grid-cols-5 gap-1.5 text-center mb-4">
            {categories.map((cat) => (
              <div key={cat.label} className={`rounded-lg border px-1.5 py-2 text-[11px] font-semibold ${cat.bgColor} ${cat.color}`}>
                <div>{cat.label}</div>
              </div>
            ))}
          </div>

          {/* Fat and lean mass */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
              <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider mb-0.5">Fat Mass</p>
              <p className="text-xl font-bold text-slate-800">
                {formatMass(result.fatMassKg).value}
                <span className="text-sm font-normal text-slate-500 ml-1">{formatMass(result.fatMassKg).unit}</span>
              </p>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Lean Mass</p>
              <p className="text-xl font-bold text-slate-800">
                {formatMass(result.leanMassKg).value}
                <span className="text-sm font-normal text-slate-500 ml-1">{formatMass(result.leanMassKg).unit}</span>
              </p>
            </div>
          </div>

          {/* Healthy range note */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
            <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Healthy Range</p>
            <p className="text-sm text-slate-700">
              {sex === 'male'
                ? 'Men: 6–24% body fat is typical for average adults. Below 6% is essential only.'
                : 'Women: 14–31% body fat is typical for average adults. Below 14% is essential only.'}
            </p>
          </div>
        </div>
      )}

      {/* Measurement guide */}
      {method === 'navy' && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">How to measure</h3>
          <ul className="text-xs text-slate-500 space-y-1">
            <li><span className="font-medium text-slate-600">Neck:</span> Measure at the narrowest point, slightly below the Adam's apple.</li>
            <li><span className="font-medium text-slate-600">Waist:</span> Men — measure at navel height. Women — measure at the narrowest point.</li>
            <li><span className="font-medium text-slate-600">Hip (women only):</span> Measure at the widest point of the buttocks.</li>
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        Body fat percentage estimates are approximate. The US Navy method is a population-level regression and may be inaccurate for individuals with atypical body shapes. This tool is for informational purposes only. Consult a qualified healthcare provider for personalized body composition assessment.
      </p>
    </div>
  );
}