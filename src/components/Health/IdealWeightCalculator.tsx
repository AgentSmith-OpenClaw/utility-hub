'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Sex = 'male' | 'female';

interface FormulaResult {
  name: string;
  formula: string;
  weightKg: number;
  weightLbs: number;
}

function calcIdealWeight(heightInches: number, sex: Sex): FormulaResult[] {
  const results: FormulaResult[] = [];

  if (sex === 'male') {
    results.push({
      name: 'Devine',
      formula: '50 + 2.3×(height − 60)',
      weightKg: 50 + 2.3 * (heightInches - 60),
      weightLbs: (50 + 2.3 * (heightInches - 60)) * 2.20462,
    });
    results.push({
      name: 'Robinson',
      formula: '52 + 1.9×(height − 60)',
      weightKg: 52 + 1.9 * (heightInches - 60),
      weightLbs: (52 + 1.9 * (heightInches - 60)) * 2.20462,
    });
    results.push({
      name: 'Miller',
      formula: '56.2 + 1.41×(height − 60)',
      weightKg: 56.2 + 1.41 * (heightInches - 60),
      weightLbs: (56.2 + 1.41 * (heightInches - 60)) * 2.20462,
    });
    results.push({
      name: 'Hamwi',
      formula: '48 + 2.7×(height − 60)',
      weightKg: 48 + 2.7 * (heightInches - 60),
      weightLbs: (48 + 2.7 * (heightInches - 60)) * 2.20462,
    });
  } else {
    results.push({
      name: 'Devine',
      formula: '45.5 + 2.3×(height − 60)',
      weightKg: 45.5 + 2.3 * (heightInches - 60),
      weightLbs: (45.5 + 2.3 * (heightInches - 60)) * 2.20462,
    });
    results.push({
      name: 'Robinson',
      formula: '49 + 1.7×(height − 60)',
      weightKg: 49 + 1.7 * (heightInches - 60),
      weightLbs: (49 + 1.7 * (heightInches - 60)) * 2.20462,
    });
    results.push({
      name: 'Miller',
      formula: '53.1 + 1.36×(height − 60)',
      weightKg: 53.1 + 1.36 * (heightInches - 60),
      weightLbs: (53.1 + 1.36 * (heightInches - 60)) * 2.20462,
    });
    results.push({
      name: 'Hamwi',
      formula: '45.5 + 2.2×(height − 60)',
      weightKg: 45.5 + 2.2 * (heightInches - 60),
      weightLbs: (45.5 + 2.2 * (heightInches - 60)) * 2.20462,
    });
  }

  return results;
}

function cmToInches(cm: number): number {
  return cm / 2.54;
}

export default function IdealWeightCalculator() {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [heightCm, setHeightCm] = useState('170');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('7');
  const [sex, setSex] = useState<Sex>('male');

  const results = useMemo<FormulaResult[] | null>(() => {
    let heightInches: number;

    if (system === 'metric') {
      const cm = parseFloat(heightCm);
      if (!cm || cm <= 0) return null;
      heightInches = cmToInches(cm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      if (ft <= 0) return null;
      heightInches = ft * 12 + inch;
    }

    if (heightInches < 48 || heightInches > 96) return null;

    return calcIdealWeight(heightInches, sex);
  }, [system, heightCm, heightFt, heightIn, sex]);

  const stats = useMemo(() => {
    if (!results) return null;
    const weights = results.map((r) => r.weightKg);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    return { min, max, avg };
  }, [results]);

  const formatWeight = (kg: number) => {
    if (system === 'metric') {
      return `${kg.toFixed(1)} kg`;
    }
    return `${(kg * 2.20462).toFixed(1)} lbs`;
  };

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
              {s === 'metric' ? 'Metric (cm)' : 'Imperial (ft, in)'}
            </button>
          ))}
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
                  min={120} max={250}
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
                  min={4} max={8}
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
        </div>
      </div>

      {results && stats && (
        <>
          <div className="bg-white rounded-lg border border-violet-200 p-5 shadow-sm">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {results.map((r) => (
                <div key={r.name} className="text-center">
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">{r.name}</p>
                  <p className="text-xl font-extrabold text-slate-900">{formatWeight(r.weightKg)}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{r.formula}</p>
                </div>
              ))}
            </div>

            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
              {(() => {
                const range = stats.max - stats.min;
                const positions = results.map((r) => ({
                  name: r.name,
                  pct: range > 0 ? ((r.weightKg - stats.min) / range) * 100 : 25,
                }));
                return positions.map((p, i) => (
                  <div
                    key={p.name}
                    className="absolute top-0 h-full bg-violet-400 opacity-80"
                    style={{
                      left: `${p.pct}%`,
                      width: i === 0 ? '4px' : `${Math.abs(positions[i].pct - positions[i - 1].pct)}%`,
                    }}
                  />
                ));
              })()}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{formatWeight(stats.min)}</span>
              <span>{formatWeight(stats.max)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-center">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-1">Average</p>
              <p className="text-3xl font-extrabold text-slate-900">{formatWeight(stats.avg)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Range</p>
              <p className="text-lg font-bold text-slate-700 mt-1">
                {formatWeight(stats.min)}
                <span className="text-slate-400 font-normal mx-1">–</span>
                {formatWeight(stats.max)}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">About these formulas:</strong> Each formula was developed by different researchers — Devine (1974), Robinson (1983), Miller (1983), and Hamwi (1964). They use slightly different coefficients, which is why results vary. No single formula is universally "correct." These estimates are useful starting points but do not account for muscle mass, bone density, age, or body composition. Consult a healthcare provider for personalized advice.
            </p>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Consult a qualified healthcare provider for personalized advice.
      </p>
    </div>
  );
}