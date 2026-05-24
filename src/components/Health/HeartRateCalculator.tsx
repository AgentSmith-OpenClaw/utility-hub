'use client';
import React, { useState, useMemo } from 'react';

interface HeartRateZone {
  name: string;
  minPct: number;
  maxPct: number;
  color: string;
  bgColor: string;
  description: string;
}

const ZONES: HeartRateZone[] = [
  { name: 'Light', minPct: 50, maxPct: 60, color: 'text-blue-600', bgColor: 'bg-blue-500', description: 'Fat burning zone — comfortable pace, easy recovery. Ideal for warm-ups, cool-downs, and building aerobic base.' },
  { name: 'Moderate', minPct: 60, maxPct: 70, color: 'text-emerald-600', bgColor: 'bg-emerald-500', description: 'Aerobic/cardio zone — sustainable effort that strengthens heart and improves endurance. Burns primarily carbohydrates and fats.' },
  { name: 'Hard', minPct: 70, maxPct: 80, color: 'text-amber-600', bgColor: 'bg-amber-500', description: 'Anaerobic threshold — tempo effort. Improves lactate clearance and sustainable power. You can hold this pace for ~20–40 minutes.' },
  { name: 'Maximum', minPct: 80, maxPct: 90, color: 'text-orange-600', bgColor: 'bg-orange-500', description: 'VO2 max zone — high-intensity intervals. Maximizes oxygen uptake and performance. Sustainable for 2–10 minutes at a time.' },
  { name: 'All-Out', minPct: 90, maxPct: 100, color: 'text-rose-600', bgColor: 'bg-rose-500', description: 'Peak zone — all-out effort or sprint intervals. Only for short bursts of 1–2 minutes. Not sustainable and not recommended for beginners.' },
];

interface CalcResult {
  maxHr: number;
  restingHr: number;
  hrr: number;
  zones: { zone: HeartRateZone; min: number; max: number }[];
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-block ml-1 align-middle cursor-help">
      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {text}
      </span>
    </span>
  );
}

export default function HeartRateCalculator() {
  const [age, setAge] = useState('30');
  const [restingHr, setRestingHr] = useState('70');

  const result = useMemo<CalcResult | null>(() => {
    const ageNum = parseFloat(age);
    const restingNum = parseFloat(restingHr) || 70;

    if (!ageNum || ageNum < 1 || ageNum > 120) return null;

    const maxHr = Math.round(208 - 0.7 * ageNum);
    const hrr = maxHr - restingNum;

    const zones = ZONES.map((zone) => ({
      zone,
      min: Math.round(hrr * (zone.minPct / 100) + restingNum),
      max: Math.round(hrr * (zone.maxPct / 100) + restingNum),
    }));

    return { maxHr, restingHr: restingNum, hrr, zones };
  }, [age, restingHr]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Age
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={1}
                max={120}
                placeholder="e.g. 30"
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">years</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Resting Heart Rate{' '}
              <InfoTooltip text="Measured first thing in the morning, before getting up. Average adults are 60–100 bpm; fit individuals can be 40–60 bpm." />
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={restingHr}
                onChange={(e) => setRestingHr(e.target.value)}
                min={30}
                max={200}
                placeholder="70"
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">bpm</span>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-slate-500 mb-0.5">Max Heart Rate</p>
                <p className="text-5xl font-extrabold text-slate-900 tracking-tight">
                  {result.maxHr} <span className="text-2xl font-medium text-slate-400">bpm</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Tanaka formula: 208 − (0.7 × age)</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-violet-600">❤️</p>
                <p className="text-xs text-slate-400 mt-0.5">HR Reserve: {result.hrr} bpm</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-700 mb-4">Your Target Heart Rate Zones</h3>

            <div className="space-y-3">
              {result.zones.map(({ zone, min, max }) => (
                <div key={zone.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${zone.bgColor}`} />
                      <span className={`text-sm font-semibold ${zone.color}`}>{zone.name}</span>
                      <span className="text-xs text-slate-400">{zone.minPct}%–{zone.maxPct}%</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {min}–{max} <span className="font-normal text-slate-400 text-xs">bpm</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${zone.bgColor} transition-all duration-300`}
                      style={{ width: `${zone.maxPct - zone.minPct}%`, marginLeft: `${zone.minPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-4 leading-relaxed">{zone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Target heart rate zones are estimates based on the Karvonen formula and may vary based on fitness level, medications, and health conditions. Consult a qualified healthcare provider or exercise professional before starting any exercise program.
      </p>
    </div>
  );
}