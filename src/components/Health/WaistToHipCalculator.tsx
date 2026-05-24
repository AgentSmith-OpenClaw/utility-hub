'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';

interface WhrResult {
  whr: number;
  category: string;
  categoryColor: string;
  categoryBg: string;
  categoryBorder: string;
  riskLabel: string;
  gaugePercent: number;
}

const RISK_MALE = { low: 0.9, moderate: 0.99 };
const RISK_FEMALE = { low: 0.8, moderate: 0.85 };

function calcWhr(waistCm: number, hipCm: number): number {
  if (hipCm <= 0) return 0;
  return waistCm / hipCm;
}

function whrCategory(whr: number, sex: Sex): WhrResult {
  const thresholds = sex === 'male' ? RISK_MALE : RISK_FEMALE;
  let category: string;
  let categoryColor: string;
  let categoryBg: string;
  let categoryBorder: string;
  let riskLabel: string;

  if (whr <= thresholds.low) {
    category = 'Low Risk';
    categoryColor = 'text-emerald-600';
    categoryBg = 'bg-emerald-50';
    categoryBorder = 'border-emerald-200';
    riskLabel = 'Lower risk of cardiovascular disease and type 2 diabetes';
  } else if (whr <= thresholds.moderate) {
    category = 'Moderate Risk';
    categoryColor = 'text-amber-600';
    categoryBg = 'bg-amber-50';
    categoryBorder = 'border-amber-200';
    riskLabel = 'Moderately increased risk of cardiovascular disease and type 2 diabetes';
  } else {
    category = 'High Risk';
    categoryColor = 'text-rose-600';
    categoryBg = 'bg-rose-50';
    categoryBorder = 'border-rose-200';
    riskLabel = 'Higher risk of cardiovascular disease and type 2 diabetes';
  }

  const maxWHR = sex === 'male' ? 1.3 : 1.2;
  const minWHR = sex === 'male' ? 0.7 : 0.6;
  const gaugePercent = Math.min(100, Math.max(0, ((whr - minWHR) / (maxWHR - minWHR)) * 100));

  return { whr, category, categoryColor, categoryBg, categoryBorder, riskLabel, gaugePercent };
}

function cmToIn(cm: number) { return cm / 2.54; }
function inToCm(inches: number) { return inches * 2.54; }

export default function WaistToHipCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [sex, setSex] = useState<Sex>('male');

  const [waistCm, setWaistCm] = useState('80');
  const [hipCm, setHipCm] = useState('100');

  const [waistIn, setWaistIn] = useState('31.5');
  const [hipIn, setHipIn] = useState('39.4');

  const result = useMemo<WhrResult | null>(() => {
    let wCm: number;
    let hCm: number;

    if (system === 'metric') {
      wCm = parseFloat(waistCm);
      hCm = parseFloat(hipCm);
    } else {
      wCm = inToCm(parseFloat(waistIn) || 0);
      hCm = inToCm(parseFloat(hipIn) || 0);
    }

    if (!wCm || !hCm || wCm <= 0 || hCm <= 0) return null;

    const whr = calcWhr(wCm, hCm);
    if (whr <= 0) return null;

    return whrCategory(whr, sex);
  }, [system, waistCm, hipCm, waistIn, hipIn, sex]);

  const thresholds = sex === 'male'
    ? { low: '≤ 0.90', moderate: '0.91 – 0.99', high: '≥ 1.00', lowLabel: 'Low', modLabel: 'Moderate', hiLabel: 'High' }
    : { low: '≤ 0.80', moderate: '0.81 – 0.85', high: '≥ 0.86', lowLabel: 'Low', modLabel: 'Moderate', hiLabel: 'High' };

  const GAUGE_MALE_STOPS = [
    { label: 'Low', pct: 0, color: 'bg-emerald-400' },
    { label: 'Moderate', pct: 50, color: 'bg-amber-400' },
    { label: 'High', pct: 75, color: 'bg-rose-400' },
  ];

  const GAUGE_FEMALE_STOPS = [
    { label: 'Low', pct: 0, color: 'bg-emerald-400' },
    { label: 'Moderate', pct: 63, color: 'bg-amber-400' },
    { label: 'High', pct: 81, color: 'bg-rose-400' },
  ];

  const gaugeStops = sex === 'male' ? GAUGE_MALE_STOPS : GAUGE_FEMALE_STOPS;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Sex toggle */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Biological sex</label>
        <div className="flex gap-2">
          {(['male', 'female'] as Sex[]).map((s) => (
            <button
              key={s}
              onClick={() => setSex(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border capitalize transition-all ${
                sex === s
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">WHO thresholds differ by sex due to body fat distribution patterns.</p>
      </div>

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
              {s === 'metric' ? 'Metric (cm)' : 'Imperial (in)'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Waist */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Waist circumference</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={system === 'metric' ? waistCm : waistIn}
                onChange={(e) => system === 'metric' ? setWaistCm(e.target.value) : setWaistIn(e.target.value)}
                min={1}
                max={500}
                className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{system === 'metric' ? 'cm' : 'in'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Measure at the narrowest point, typically just above the belly button.</p>
          </div>

          {/* Hip */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hip circumference</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={system === 'metric' ? hipCm : hipIn}
                onChange={(e) => system === 'metric' ? setHipCm(e.target.value) : setHipIn(e.target.value)}
                min={1}
                max={500}
                className="w-36 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">{system === 'metric' ? 'cm' : 'in'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Measure at the widest point of your buttocks.</p>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500 mb-0.5">Your Waist-to-Hip Ratio</p>
              <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
                {result.whr.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${result.categoryColor}`}>{result.category}</span>
              <p className="text-xs text-slate-400 mt-0.5">WHO classification</p>
            </div>
          </div>

          {/* Visual gauge */}
          <div className="mb-4">
            <div className="relative h-4 rounded-full overflow-hidden flex">
              <div className="w-[42%] bg-emerald-300" />
              <div className="w-[25%] bg-amber-300" />
              <div className="flex-1 bg-rose-300" />
            </div>
            <div className="relative h-4 -mt-4">
              <div
                className="absolute top-0 w-0.5 h-4 bg-slate-800 rounded-full transition-all duration-500"
                style={{ left: `${result.gaugePercent}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 select-none">
              <span>{sex === 'male' ? '0.70' : '0.60'}</span>
              <span>{thresholds.low}</span>
              <span>{thresholds.moderate}</span>
              <span>{sex === 'male' ? '1.00' : '0.90'}</span>
            </div>
          </div>

          {/* Risk card */}
          <div className={`rounded-lg border px-4 py-3 mb-4 ${result.categoryBg} ${result.categoryBorder}`}>
            <p className={`text-sm font-semibold ${result.categoryColor} mb-0.5`}>{result.riskLabel}</p>
            <p className="text-xs text-slate-500">
              {sex === 'male'
                ? 'For men, WHR ≤ 0.90 is low risk, 0.91–0.99 is moderate risk, and ≥ 1.0 is high risk.'
                : 'For women, WHR ≤ 0.80 is low risk, 0.81–0.85 is moderate risk, and ≥ 0.86 is high risk.'}
            </p>
          </div>

          {/* What WHR means */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold">What is WHR?</span> Your waist-to-hip ratio measures how fat is distributed in your body. 
              A higher ratio means more abdominal (visceral) fat, which is associated with greater risk of insulin resistance, 
              heart disease, and metabolic syndrome. WHR is considered a better predictor than BMI because it captures body shape.
            </p>
          </div>
        </div>
      )}

      {/* Category reference */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-3">WHO Risk Categories</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-2.5">
            <div className="text-xs font-semibold text-emerald-700">Low Risk</div>
            <div className="text-xs text-emerald-600 mt-0.5">{thresholds.lowLabel}: {thresholds.low}</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-2.5">
            <div className="text-xs font-semibold text-amber-700">Moderate Risk</div>
            <div className="text-xs text-amber-600 mt-0.5">{thresholds.modLabel}: {thresholds.moderate}</div>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-2.5">
            <div className="text-xs font-semibold text-rose-700">High Risk</div>
            <div className="text-xs text-rose-600 mt-0.5">{thresholds.hiLabel}: {thresholds.high}</div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">Thresholds differ for men and women due to natural differences in fat distribution.</p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. WHR is a screening tool, not a diagnosis. 
        Consult a qualified healthcare provider for personalized health advice.
      </p>
    </div>
  );
}