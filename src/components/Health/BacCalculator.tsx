'use client';
import React, { useState, useMemo } from 'react';

type Sex = 'male' | 'female';
type WeightUnit = 'lbs' | 'kg';

const ALCOHOL_PER_DRINK = 0.6;
const WIDMARK_MEN = 0.68;
const WIDMARK_WOMEN = 0.55;
const METABOLISM_RATE = 0.015;

const DRINK_TYPES = [
  { label: 'Beer (12 oz, 5%)', alcoholOz: 0.6 },
  { label: 'Wine (5 oz, 12%)', alcoholOz: 0.6 },
  { label: 'Spirits (1.5 oz, 40%)', alcoholOz: 0.6 },
];

interface BacResult {
  bac: number;
  status: 'sober' | 'low' | 'elevated' | 'high' | 'veryHigh';
  statusLabel: string;
  statusColor: string;
  gaugePercent: number;
  timeToSober: number;
  decimalBac: string;
}

function calcBac(
  sex: Sex,
  weightLbs: number,
  drinks: number,
  hoursConsuming: number,
  hoursSinceFirst: number,
): BacResult {
  const totalOz = drinks * ALCOHOL_PER_DRINK;
  const r = sex === 'male' ? WIDMARK_MEN : WIDMARK_WOMEN;
  const bacRaw = (totalOz * 5.14) / (weightLbs * r) - METABOLISM_RATE * hoursSinceFirst;
  const bac = Math.max(0, bacRaw);

  let status: BacResult['status'];
  let statusLabel: string;
  let statusColor: string;

  if (bac < 0.02) {
    status = 'sober';
    statusLabel = 'Sober';
    statusColor = 'text-emerald-600';
  } else if (bac < 0.04) {
    status = 'low';
    statusLabel = 'Low';
    statusColor = 'text-teal-600';
  } else if (bac < 0.08) {
    status = 'elevated';
    statusLabel = 'Elevated';
    statusColor = 'text-amber-600';
  } else if (bac < 0.15) {
    status = 'high';
    statusLabel = 'High';
    statusColor = 'text-orange-600';
  } else {
    status = 'veryHigh';
    statusLabel = 'Very High';
    statusColor = 'text-rose-600';
  }

  const gaugePercent = Math.min(100, (bac / 0.25) * 100);
  const timeToSober = bac > 0 ? bac / METABOLISM_RATE : 0;
  const decimalBac = bac.toFixed(4);

  return { bac, status, statusLabel, statusColor, gaugePercent, timeToSober, decimalBac };
}

function lbsToKg(lbs: number) { return lbs / 2.20462; }
function kgToLbs(kg: number) { return kg * 2.20462; }

const LEGAL_LIMITS = [
  { country: 'United States (most states)', limit: '0.08%' },
  { country: 'United Kingdom', limit: '0.08%' },
  { country: 'Canada', limit: '0.08%' },
  { country: 'Australia', limit: '0.05%' },
  { country: 'Germany', limit: '0.05%' },
  { country: 'Japan', limit: '0.05%' },
  { country: 'Russia', limit: '0.03%' },
  { country: 'China', limit: '0.02% (0.03 for some)' },
  { country: 'Sweden', limit: '0.02%' },
  { country: 'Norway', limit: '0.02%' },
];

export default function BacCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [weight, setWeight] = useState('160');
  const [drinks, setDrinks] = useState(2);
  const [hoursConsuming, setHoursConsuming] = useState(1);
  const [hoursSinceFirst, setHoursSinceFirst] = useState(1);

  const result = useMemo<BacResult | null>(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    const wLbs = weightUnit === 'kg' ? kgToLbs(w) : w;
    if (drinks <= 0 || hoursConsuming <= 0) return null;
    return calcBac(sex, wLbs, drinks, hoursConsuming, hoursSinceFirst);
  }, [sex, weight, weightUnit, drinks, hoursConsuming, hoursSinceFirst]);

  const GAUGE_STOPS = [
    { label: 'Sober', pct: 8, color: 'bg-emerald-400' },
    { label: 'Low', pct: 16, color: 'bg-teal-400' },
    { label: 'Elevated', pct: 32, color: 'bg-amber-400' },
    { label: 'High', pct: 60, color: 'bg-orange-400' },
    { label: 'Very High', pct: 100, color: 'bg-rose-400' },
  ];

  function formatTime(hours: number): string {
    if (hours <= 0) return '0h 0m';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
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
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Weight</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min={50} max={700}
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <div className="flex gap-1">
                {(['lbs', 'kg'] as WeightUnit[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setWeightUnit(u)}
                    className={`px-2 py-1 rounded text-xs font-medium border transition-all ${
                      weightUnit === u
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-violet-300'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Number of standard drinks
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrinks(Math.max(0, drinks - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50 transition-all text-lg font-bold"
            >
              −
            </button>
            <span className="text-2xl font-bold text-slate-800 w-12 text-center">{drinks}</span>
            <button
              onClick={() => setDrinks(drinks + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-violet-300 hover:bg-violet-50 transition-all text-lg font-bold"
            >
              +
            </button>
            <span className="text-xs text-slate-400 ml-1">≈ {drinks * ALCOHOL_PER_DRINK} oz pure alcohol</span>
          </div>
          <div className="flex gap-2 mt-2">
            {DRINK_TYPES.map((d) => (
              <div key={d.label} className="text-[11px] text-slate-400 bg-slate-50 rounded px-2 py-1 border border-slate-100">
                {d.label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Time over which consumed
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={hoursConsuming}
                onChange={(e) => setHoursConsuming(Math.max(0.1, parseFloat(e.target.value) || 0))}
                min={0.1} max={24} step={0.5}
                className="w-20 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">hrs</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Time since first drink
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={hoursSinceFirst}
                onChange={(e) => setHoursSinceFirst(Math.max(0, parseFloat(e.target.value) || 0))}
                min={0} max={72} step={0.5}
                className="w-20 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">hrs</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-slate-500 mb-0.5">Current Estimated BAC</p>
                <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  {result.bac.toFixed(3)}<span className="text-3xl text-slate-400">%</span>
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">{result.decimalBac}</p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${result.statusColor}`}>{result.statusLabel}</span>
                <p className="text-xs text-slate-400 mt-0.5">BAC level</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative h-4 rounded-full overflow-hidden flex">
                <div className="w-[8%] bg-emerald-300" />
                <div className="w-[8%] bg-teal-300" />
                <div className="w-[16%] bg-amber-300" />
                <div className="w-[28%] bg-orange-300" />
                <div className="flex-1 bg-rose-300" />
              </div>
              <div className="relative h-4 -mt-4">
                <div
                  className="absolute top-0 w-1 h-4 bg-slate-800 rounded-full transition-all duration-500"
                  style={{ left: `calc(${result.gaugePercent}% - 2px)` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 select-none">
                <span>0.00</span>
                <span>0.02</span>
                <span>0.04</span>
                <span>0.08</span>
                <span>0.15</span>
                <span>0.25+</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 text-center mb-4">
              {[
                { label: 'Sober', range: '< 0.02', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                { label: 'Low', range: '0.02–0.04', color: 'bg-teal-50 border-teal-200 text-teal-700' },
                { label: 'Elevated', range: '0.04–0.08', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                { label: 'High', range: '0.08–0.15', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                { label: 'Very High', range: '> 0.15', color: 'bg-rose-50 border-rose-200 text-rose-700' },
              ].map(({ label, range, color }) => (
                <div key={label} className={`rounded-lg border px-1 py-2 text-[10px] font-semibold ${color}`}>
                  <div>{label}</div>
                  <div className="font-normal opacity-75 mt-0.5">{range}</div>
                </div>
              ))}
            </div>

            {result.bac >= 0.08 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 mb-3">
                <p className="text-rose-700 font-bold text-sm">
                  ⚠️ You are above the legal driving limit in most US states (0.08%).
                </p>
                <p className="text-rose-600 text-xs mt-1">
                  Do not drive. Arrange alternative transport. BAC can continue to rise even after you stop drinking.
                </p>
              </div>
            )}

            <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Time to reach 0.00% (legally sober)</p>
              <p className="text-2xl font-bold text-slate-800">{formatTime(result.timeToSober)}</p>
              <p className="text-xs text-slate-400 mt-1">
                Based on average alcohol metabolism of 0.015 BAC/hr. Individual rates vary by genetics, food intake, liver health, and more.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Legal BAC Limits Worldwide</h3>
            <div className="space-y-2">
              {LEGAL_LIMITS.map(({ country, limit }) => (
                <div key={country} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{country}</span>
                  <span className="font-semibold text-slate-800">{limit}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Limits shown are for adult drivers (non-commercial). Commercial drivers often face stricter limits.
            </p>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for educational and informational purposes only. BAC estimates are based on the Widmark formula and may differ significantly from actual values due to individual genetics, metabolism, food intake, health conditions, and other factors. Never drink and drive. If you have been drinking, use a certified breathalyzer or wait well beyond any estimated sober time before operating a vehicle. Consult a qualified healthcare provider for personalized advice.
      </p>
    </div>
  );
}