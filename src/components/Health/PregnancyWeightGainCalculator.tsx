'use client';
import React, { useState, useMemo } from 'react';

type UnitSystem = 'metric' | 'imperial';

interface BMICategory {
  name: string;
  rangeKg: [number, number];
  rangeLbs: [number, number];
  color: string;
}

const BMI_CATEGORIES: BMICategory[] = [
  { name: 'Underweight', rangeKg: [12.5, 18], rangeLbs: [28, 40], color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Normal', rangeKg: [11.5, 16], rangeLbs: [25, 35], color: 'text-green-600 bg-green-50 border-green-200' },
  { name: 'Overweight', rangeKg: [7, 11.5], rangeLbs: [15, 25], color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'Obese', rangeKg: [5, 9], rangeLbs: [11, 20], color: 'text-rose-600 bg-rose-50 border-rose-200' },
];

const TRIMESTER_BREAKDOWN = [
  { trimester: 1, weeks: '1–12', expectedGainKg: 0.5, expectedGainLbs: 1, description: 'First trimester — minimal weight gain, some women lose due to nausea' },
  { trimester: 2, weeks: '13–26', expectedGainKg: 2.5, expectedGainLbs: 5.5, description: 'Second trimester — steady weight gain, ~1 lb per week' },
  { trimester: 3, weeks: '27–40', expectedGainKg: 4.5, expectedGainLbs: 10, description: 'Third trimester — ~1 lb per week, baby grows rapidly' },
];

function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return BMI_CATEGORIES[0];
  if (bmi < 25) return BMI_CATEGORIES[1];
  if (bmi < 30) return BMI_CATEGORIES[2];
  return BMI_CATEGORIES[3];
}

function getRecommendedRange(category: BMICategory, isTwins: boolean): { kg: [number, number]; lbs: [number, number] } {
  const addKg = isTwins ? 4.5 : 0;
  const addLbs = isTwins ? 10 : 0;
  return {
    kg: [category.rangeKg[0] + addKg, category.rangeKg[1] + addKg],
    lbs: [category.rangeLbs[0] + addLbs, category.rangeLbs[1] + addLbs],
  };
}

function getTypicalGainAtWeek(week: number, isNormalBMI: boolean): number {
  if (!isNormalBMI) return 0;
  if (week <= 12) return 0.5;
  if (week <= 26) return 2.5 + (week - 12) * 1;
  return 5.5 + (week - 26) * 1;
}

export default function PregnancyWeightGainCalculator() {
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [prePregWeight, setPrePregWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [gestationalWeek, setGestationalWeek] = useState('');
  const [isTwins, setIsTwins] = useState(false);

  const results = useMemo(() => {
    const weight = parseFloat(prePregWeight);
    const gestationalWk = parseInt(gestationalWeek);

    let heightValue: number;
    if (unit === 'metric') {
      heightValue = parseFloat(heightCm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      heightValue = (ft * 30.48) + (inches * 2.54);
    }

    if (!weight || !heightValue || isNaN(gestationalWk) || gestationalWk < 1 || gestationalWk > 42) {
      return null;
    }

    const heightM = heightValue / 100;
    const bmi = weight / (heightM * heightM);
    const category = getBMICategory(bmi);
    const range = getRecommendedRange(category, isTwins);

    const weightLbs = unit === 'metric' ? weight * 2.20462 : weight;
    const rangeLbs = range.lbs;
    const rangeKg = range.kg;

    const weeklyGainKg = category.name === 'Normal' ? 0.45 : 0.4;
    const weeklyGainLbs = weeklyGainKg * 2.20462;

    const typicalGainLbs = getTypicalGainAtWeek(gestationalWk, category.name === 'Normal');
    const typicalGainKg = typicalGainLbs / 2.20462;

    const minGainRemainingLbs = Math.max(0, rangeLbs[0] - typicalGainLbs);
    const maxGainRemainingLbs = Math.max(0, rangeLbs[1] - typicalGainLbs);
    const minGainRemainingKg = minGainRemainingLbs / 2.20462;
    const maxGainRemainingKg = maxGainRemainingLbs / 2.20462;

    const progressPercent = Math.min(100, (typicalGainLbs / rangeLbs[1]) * 100);

    return {
      bmi,
      category,
      rangeKg,
      rangeLbs,
      weeklyGainKg,
      weeklyGainLbs,
      typicalGainKg,
      typicalGainLbs,
      minGainRemainingKg,
      maxGainRemainingKg,
      minGainRemainingLbs,
      maxGainRemainingLbs,
      progressPercent,
      gestationalWk,
    };
  }, [unit, prePregWeight, heightCm, heightFt, heightIn, gestationalWeek, isTwins]);

  const formatRange = (min: number, max: number, unitLabel: string) => {
    return `${min.toFixed(1)}–${max.toFixed(1)} ${unitLabel}`;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setUnit('metric')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold border transition-all ${
              unit === 'metric'
                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
            }`}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold border transition-all ${
              unit === 'imperial'
                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
            }`}
          >
            Imperial (lbs/ft)
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Pre-pregnancy weight {unit === 'metric' ? '(kg)' : '(lbs)'}
            </label>
            <input
              type="number"
              value={prePregWeight}
              onChange={(e) => setPrePregWeight(e.target.value)}
              placeholder={unit === 'metric' ? '60' : '130'}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
              min="30"
              max="250"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Height {unit === 'metric' ? '(cm)' : '(ft + in)'}
            </label>
            {unit === 'metric' ? (
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="165"
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                min="120"
                max="220"
                step="0.1"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="5"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                  min="4"
                  max="7"
                  step="1"
                />
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="6"
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
                  min="0"
                  max="11"
                  step="1"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Current gestational week
            </label>
            <input
              type="number"
              value={gestationalWeek}
              onChange={(e) => setGestationalWeek(e.target.value)}
              placeholder="20"
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
              min="1"
              max="42"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Are you carrying twins?
            </label>
            <button
              onClick={() => setIsTwins(!isTwins)}
              className={`w-full py-3 px-4 rounded-lg text-sm font-semibold border transition-all ${
                isTwins
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              {isTwins ? 'Yes, twins' : 'No, single pregnancy'}
            </button>
          </div>
        </div>
      </div>

      {results && (
        <>
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 rounded-xl p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Recommended Total Weight Gain</p>
            <p className="text-4xl font-extrabold tracking-tight mb-2">
              {unit === 'metric'
                ? formatRange(results.rangeKg[0], results.rangeKg[1], 'kg')
                : formatRange(results.rangeLbs[0], results.rangeLbs[1], 'lbs')}
            </p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${results.category.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-80 text-white')}`}>
              {results.category.name} (BMI {results.bmi.toFixed(1)})
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">Weekly Rate (2nd/3rd)</p>
              <p className="text-2xl font-extrabold text-violet-800">
                {unit === 'metric'
                  ? `${results.weeklyGainKg.toFixed(1)} kg`
                  : `${results.weeklyGainLbs.toFixed(1)} lbs`}
              </p>
              <p className="text-xs text-violet-500 font-medium">per week</p>
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">Pre-pregnancy BMI</p>
              <p className="text-2xl font-extrabold text-violet-800">{results.bmi.toFixed(1)}</p>
              <p className="text-xs text-violet-500 font-medium">{results.category.name}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">Trimester breakdown</p>
            <div className="space-y-3">
              {TRIMESTER_BREAKDOWN.map((t) => {
                const isPast = results.gestationalWk >= (t.trimester === 2 ? 13 : t.trimester === 3 ? 27 : 0);
                return (
                  <div key={t.trimester} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPast ? 'bg-violet-600' : 'bg-slate-100'
                    }`}>
                      <span className={`text-xs font-bold ${isPast ? 'text-white' : 'text-slate-400'}`}>
                        T{t.trimester}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-semibold ${isPast ? 'text-slate-800' : 'text-slate-400'}`}>
                          Trimester {t.trimester} — {t.weeks} weeks
                        </p>
                        {isPast && (
                          <span className="text-xs text-violet-600 font-medium">
                            ~{unit === 'metric' ? `${t.expectedGainKg} kg` : `${t.expectedGainLbs} lbs`}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${isPast ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Current progress</p>
              <span className="text-sm font-bold text-violet-600">{results.progressPercent.toFixed(0)}%</span>
            </div>
            <div className="relative h-6 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${results.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-400">0 lbs</span>
              <span className="text-xs text-slate-400">
                {unit === 'metric' ? `${results.typicalGainKg.toFixed(1)} kg gained` : `${results.typicalGainLbs.toFixed(1)} lbs gained`}
              </span>
              <span className="text-xs text-slate-400">
                {unit === 'metric'
                  ? formatRange(results.rangeKg[0], results.rangeKg[1], 'kg')
                  : formatRange(results.rangeLbs[0], results.rangeLbs[1], 'lbs')}
              </span>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-violet-700 mb-1">Remaining weight to gain</p>
            <p className="text-xl font-extrabold text-violet-800">
              {unit === 'metric'
                ? formatRange(results.minGainRemainingKg, results.maxGainRemainingKg, 'kg')
                : formatRange(results.minGainRemainingLbs, results.maxGainRemainingLbs, 'lbs')}
            </p>
            <p className="text-xs text-violet-500 mt-1">
              Based on {results.gestationalWk} weeks pregnant with typical gain of ~1 lb/week in 2nd/3rd trimester
            </p>
          </div>
        </>
      )}

      {!results && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-sm font-semibold text-violet-700 mb-1">Enter your details above</p>
          <p className="text-xs text-violet-500">
            Enter your pre-pregnancy weight, height, and current gestational week to see your recommended weight gain range based on IOM guidelines.
          </p>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This calculator uses IOM (Institute of Medicine) 2009 guidelines for pregnancy weight gain. Recommended ranges are based on pre-pregnancy BMI categories. Every pregnancy is unique — consult your healthcare provider to discuss your individual weight gain goals and nutritional needs.
      </p>
    </div>
  );
}