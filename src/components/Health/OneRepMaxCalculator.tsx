'use client';
import React, { useState, useMemo } from 'react';

type Unit = 'lb' | 'kg';

interface FormulaResult {
  name: string;
  oneRM: number;
  formula: string;
}

function epley(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

function brzycki(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
}

function lombardi(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * Math.pow(reps, 0.1);
}

function oconnor(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 40);
}

const PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

export default function OneRepMaxCalculator() {
  const [unit, setUnit] = useState<Unit>('lb');
  const [weight, setWeight] = useState('135');
  const [reps, setReps] = useState('5');

  const weightNum = parseFloat(weight) || 0;
  const repsNum = parseInt(reps, 10) || 0;

  const results = useMemo<{ formulas: FormulaResult[]; avg: number } | null>(() => {
    if (weightNum <= 0 || repsNum <= 0) return null;
    const f: FormulaResult[] = [
      { name: 'Epley', oneRM: epley(weightNum, repsNum), formula: 'w × (1 + r/30)' },
      { name: 'Brzycki', oneRM: brzycki(weightNum, repsNum), formula: 'w × 36/(37−r)' },
      { name: 'Lombardi', oneRM: lombardi(weightNum, repsNum), formula: 'w × r^0.1' },
      { name: "O'Conner", oneRM: oconnor(weightNum, repsNum), formula: 'w × (1 + r/40)' },
    ];
    const avg = f.reduce((s, x) => s + x.oneRM, 0) / f.length;
    return { formulas: f, avg };
  }, [weightNum, repsNum]);

  const unitLabel = unit === 'lb' ? 'lbs' : 'kg';
  const convertedAvg = results
    ? unit === 'lb'
      ? Math.round(results.avg / 2.20462)
      : Math.round(results.avg * 2.20462)
    : null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Unit toggle */}
      <div className="flex justify-end">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(['lb', 'kg'] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                unit === u
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Weight lifted ({unitLabel})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="135"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Reps performed
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="5"
              min="1"
              max="20"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Enter the weight and reps from any set with 1–10 reps. Estimates are most accurate for 5 reps or fewer.
        </p>
      </div>

      {/* Results */}
      {results && (
        <>
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-5 py-4">
            <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">
              Estimated One-Rep Max (average of 4 formulas)
            </p>
            <p className="text-3xl font-bold text-slate-800">
              {Math.round(results.avg).toLocaleString()} <span className="text-base font-normal text-slate-500">{unitLabel}</span>
            </p>
            {convertedAvg !== null && (
              <p className="text-sm text-slate-500 mt-1">
                ≈ {convertedAvg.toLocaleString()} {unit === 'lb' ? 'kg' : 'lbs'}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Percentage breakdown</h3>
            <div className="space-y-1.5">
              {PERCENTAGES.map((pct) => {
                const w = Math.round(results.avg * pct / 100);
                const repsForPct = pct >= 95 ? '1–2' : pct >= 85 ? '3–5' : pct >= 75 ? '5–8' : '8+';
                return (
                  <div key={pct} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 w-10 text-right">{pct}%</span>
                      <span className="font-semibold text-slate-800">{w.toLocaleString()} {unitLabel}</span>
                    </div>
                    <span className="text-xs text-slate-400">~{repsForPct} reps</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">By formula</h3>
            <div className="space-y-2">
              {results.formulas.map((f) => (
                <div key={f.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-700">{f.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{f.formula}</span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {Math.round(f.oneRM).toLocaleString()} {unitLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        One-rep max estimates are approximations based on submaximal sets. Always use a spotter when testing actual 1RM. Consult a qualified trainer before starting any new strength program.
      </p>
    </div>
  );
}
