'use client';
import React, { useState, useMemo } from 'react';

interface BpResult {
  category: string;
  categoryColor: string;
  bgColor: string;
  borderColor: string;
  labelColor: string;
  explanation: string;
  pulsePressure: number;
  map: number;
  isCrisis: boolean;
}

function classifyBp(systolic: number, diastolic: number): BpResult | null {
  if (systolic <= 0 || diastolic <= 0) return null;

  const isCrisis = systolic > 180 || diastolic > 120;

  if (isCrisis) {
    return {
      category: 'Hypertensive Crisis',
      categoryColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      labelColor: 'bg-red-100 text-red-800',
      explanation:
        'Your readings indicate a Hypertensive Crisis. This requires immediate medical attention. Do not delay — seek emergency care right away.',
      pulsePressure: systolic - diastolic,
      map: diastolic + (systolic - diastolic) / 3,
      isCrisis: true,
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'Hypertension Stage 2',
      categoryColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      labelColor: 'bg-red-100 text-red-700',
      explanation:
        'Your readings indicate Stage 2 Hypertension. Consult your healthcare provider about a treatment plan. Lifestyle changes and possibly medication are recommended.',
      pulsePressure: systolic - diastolic,
      map: diastolic + (systolic - diastolic) / 3,
      isCrisis: false,
    };
  }

  if (systolic >= 130 || diastolic >= 80) {
    return {
      category: 'Hypertension Stage 1',
      categoryColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      labelColor: 'bg-orange-100 text-orange-700',
      explanation:
        'Your readings indicate Stage 1 Hypertension. Consider lifestyle modifications such as reducing sodium, exercising more, and managing stress. Discuss with your doctor.',
      pulsePressure: systolic - diastolic,
      map: diastolic + (systolic - diastolic) / 3,
      isCrisis: false,
    };
  }

  if (systolic >= 120 || diastolic >= 80) {
    return {
      category: 'Elevated',
      categoryColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      labelColor: 'bg-amber-100 text-amber-700',
      explanation:
        'Your readings indicate Elevated blood pressure. This stage tends to worsen over time. Adopt heart-healthy habits: reduce sodium, stay active, and maintain a healthy weight.',
      pulsePressure: systolic - diastolic,
      map: diastolic + (systolic - diastolic) / 3,
      isCrisis: false,
    };
  }

  return {
    category: 'Normal',
    categoryColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    labelColor: 'bg-emerald-100 text-emerald-700',
    explanation:
      'Great news — your blood pressure is in the Normal range. Keep up the healthy habits: balanced diet, regular physical activity, and avoiding excessive sodium and alcohol.',
    pulsePressure: systolic - diastolic,
    map: diastolic + (systolic - diastolic) / 3,
    isCrisis: false,
  };
}

export default function BloodPressureCalculator() {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');

  const result = useMemo<BpResult | null>(() => {
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    if (isNaN(sys) || isNaN(dia)) return null;
    return classifyBp(sys, dia);
  }, [systolic, diastolic]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Systolic (top number)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="e.g. 120"
                min={1}
                max={300}
                className="w-32 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">mmHg</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">The pressure when your heart beats</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Diastolic (bottom number)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="e.g. 80"
                min={1}
                max={200}
                className="w-32 px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-sm text-slate-500">mmHg</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">The pressure when your heart rests between beats</p>
          </div>
        </div>
      </div>

      {result && (
        <>
          {result.isCrisis && (
            <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <div>
                <p className="font-bold text-red-800 text-sm">⚠️ Hypertensive Crisis — Seek Immediate Care</p>
                <p className="text-red-700 text-sm mt-1">
                  Your readings are in a dangerous range. Do not ignore this. Call your doctor or go to an emergency room immediately.
                </p>
              </div>
            </div>
          )}

          <div className={`rounded-xl border-2 ${result.bgColor} ${result.borderColor} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Classification</p>
                <p className={`text-4xl font-extrabold tracking-tight ${result.categoryColor}`}>
                  {result.category}
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${result.labelColor}`}>
                {result.category}
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-6">{result.explanation}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 rounded-lg border border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pulse Pressure</p>
                <p className="text-2xl font-bold text-slate-800">
                  {result.pulsePressure}
                  <span className="text-sm font-normal text-slate-500 ml-1">mmHg</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Systolic − Diastolic</p>
              </div>
              <div className="bg-white/70 rounded-lg border border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mean Arterial Pressure</p>
                <p className="text-2xl font-bold text-slate-800">
                  {result.map.toFixed(0)}
                  <span className="text-sm font-normal text-slate-500 ml-1">mmHg</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Diastolic + (Pulse ÷ 3)</p>
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-violet-700 mb-2">Understanding Blood Pressure Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { range: '< 120 and < 80', label: 'Normal', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                { range: '120–129 and < 80', label: 'Elevated', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                { range: '130–139 or 80–89', label: 'Stage 1 HTN', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                { range: '≥ 140 or ≥ 90', label: 'Stage 2 HTN', color: 'bg-red-100 text-red-700 border-red-200' },
                { range: '> 180 or > 120', label: 'Crisis ⚠️', color: 'bg-red-200 text-red-800 border-red-300' },
              ].map(({ range, label, color }) => (
                <div key={label} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${color}`}>
                  <span className="font-semibold">{label}</span>
                  <span className="opacity-80">{range}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool uses the AHA/ACC 2017 blood pressure classification guidelines for adults. It is for informational purposes only and is not a diagnosis. Consult a qualified healthcare provider for personalized medical advice.
      </p>
    </div>
  );
}