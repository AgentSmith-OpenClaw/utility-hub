'use client';
import React, { useState, useMemo } from 'react';

type SkinType = 'light' | 'medium' | 'dark';
type Season = 'summer' | 'winter';

const SKIN_TYPES: { value: SkinType; label: string; desc: string }[] = [
  { value: 'light', label: 'I–II (Light)', desc: 'Fair skin, blue/green eyes, blonde/red hair — burns easily' },
  { value: 'medium', label: 'III–IV (Medium)', desc: 'Olive to brown skin, dark hair — burns moderately' },
  { value: 'dark', label: 'V–VI (Dark)', desc: 'Dark brown to black skin — rarely burns' },
];

const LATITUDES: { value: string; label: string; uvFactor: number }[] = [
  { value: 'tropical', label: 'Tropical (0°–23°)', uvFactor: 1.2 },
  { value: 'subtropical', label: 'Subtropical (23°–35°)', uvFactor: 1.0 },
  { value: 'temperate', label: 'Temperate (35°–50°)', uvFactor: 0.7 },
  { value: 'northern', label: 'Northern (>50°)', uvFactor: 0.4 },
];

const FOOD_SOURCES: { name: string; iuPerServing: number; serving: string }[] = [
  { name: 'Cod liver oil', iuPerServing: 1360, serving: '1 tbsp' },
  { name: 'Salmon (wild)', iuPerServing: 988, serving: '3 oz' },
  { name: 'Salmon (farmed)', iuPerServing: 660, serving: '3 oz' },
  { name: 'Mackerel', iuPerServing: 643, serving: '3 oz' },
  { name: 'Sardines (canned)', iuPerServing: 164, serving: '3 oz' },
  { name: 'Tuna (canned)', iuPerServing: 68, serving: '3 oz' },
  { name: 'Egg yolk', iuPerServing: 44, serving: '1 large' },
  { name: 'Beef liver', iuPerServing: 42, serving: '3 oz' },
  { name: 'Fortified milk', iuPerServing: 120, serving: '1 cup' },
  { name: 'Fortified cereal', iuPerServing: 80, serving: '1 serving' },
  { name: 'Fortified orange juice', iuPerServing: 100, serving: '1 cup' },
  { name: 'Swiss cheese', iuPerServing: 18, serving: '1 oz' },
];

interface RiskLevel {
  label: string;
  range: string;
  rangeNm: string;
  color: string;
  bg: string;
  border: string;
  text: string;
}

function getRiskLevel(ngml: number): RiskLevel {
  if (ngml < 20) return { label: 'Deficient', range: '< 20 ng/mL', rangeNm: '< 50 nmol/L', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' };
  if (ngml < 30) return { label: 'Insufficient', range: '20–29 ng/mL', rangeNm: '50–74 nmol/L', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
  if (ngml <= 50) return { label: 'Sufficient', range: '30–50 ng/mL', rangeNm: '75–125 nmol/L', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
  if (ngml <= 70) return { label: 'Optimal', range: '50–70 ng/mL', rangeNm: '125–175 nmol/L', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' };
  return { label: 'Excess', range: '> 100 ng/mL', rangeNm: '> 250 nmol/L', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
}

function calcSunIU(minutes: number, skin: SkinType, lat: string, season: Season): number {
  if (minutes === 0) return 0;
  const basePerMin = 67;
  const skinMult = skin === 'light' ? 1.0 : skin === 'medium' ? 0.65 : 0.4;
  const latObj = LATITUDES.find((l) => l.value === lat) ?? LATITUDES[1];
  const seasonMult = season === 'summer' ? 1.0 : latObj.value === 'tropical' || latObj.value === 'subtropical' ? 0.8 : 0.4;
  return Math.round(minutes * basePerMin * skinMult * latObj.uvFactor * seasonMult);
}

function calcNeededIU(
  age: number,
  skin: SkinType,
  lat: string,
  season: Season,
  sunMin: number,
  dietIU: number,
  supplement: boolean,
): { dailyNeed: number; estimatedSerum: number; supplementDose: number | null } {
  const baseNeed = age >= 70 ? 800 : age >= 65 ? 750 : 700;
  const skinExtra = skin === 'dark' ? 200 : skin === 'medium' ? 100 : 0;
  const latExtra = lat === 'northern' ? 150 : lat === 'temperate' ? 80 : 0;
  const seasonExtra = season === 'winter' ? 100 : 0;
  const indoorExtra = sunMin === 0 ? 200 : sunMin < 15 ? 100 : 0;
  const totalNeed = Math.min(2000, baseNeed + skinExtra + latExtra + seasonExtra + indoorExtra);
  const sunIU = calcSunIU(sunMin, skin, lat, season);
  const totalIntake = dietIU + (supplement ? 1000 : 0) + sunIU;
  const diff = totalNeed - totalIntake;
  const supplementDose = diff > 100 ? Math.round(diff) : null;
  const estimatedSerum = Math.min(100, 15 + (totalIntake / totalNeed) * 35);
  return { dailyNeed: totalNeed, estimatedSerum, supplementDose };
}

export default function VitaminDCalculator() {
  const [age, setAge] = useState('35');
  const [skin, setSkin] = useState<SkinType>('light');
  const [lat, setLat] = useState('subtropical');
  const [season, setSeason] = useState<Season>('summer');
  const [sunMin, setSunMin] = useState(15);
  const [selectedFoods, setSelectedFoods] = useState<Set<number>>(new Set([8, 9]));
  const [supplement, setSupplement] = useState(false);

  const dietIU = useMemo(() => {
    return Array.from(selectedFoods).reduce((sum, i) => sum + FOOD_SOURCES[i].iuPerServing, 0);
  }, [selectedFoods]);

  const result = useMemo(() => {
    const ageNum = parseInt(age) || 35;
    return calcNeededIU(ageNum, skin, lat, season, sunMin, dietIU, supplement);
  }, [age, skin, lat, season, sunMin, dietIU, supplement]);

  const risk = getRiskLevel(result.estimatedSerum);

  const toggleFood = (i: number) => {
    setSelectedFoods((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={1} max={120}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Season</label>
            <div className="flex gap-2">
              {(['summer', 'winter'] as Season[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border capitalize transition-all ${
                    season === s
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Skin Type (Fitzpatrick)</label>
          <div className="space-y-2">
            {SKIN_TYPES.map((st) => (
              <button
                key={st.value}
                onClick={() => setSkin(st.value)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm text-left transition-all ${
                  skin === st.value
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'
                }`}
              >
                <span className="font-semibold">{st.label}</span>
                <span className={`text-xs ${skin === st.value ? 'text-violet-200' : 'text-slate-400'} ml-2`}>{st.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Latitude / Climate</label>
            <select
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            >
              {LATITUDES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sun Exposure</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0} max={60} step={5}
                value={sunMin}
                onChange={(e) => setSunMin(parseInt(e.target.value))}
                className="flex-1 accent-violet-600"
              />
              <span className="text-sm font-medium text-slate-700 w-16 text-right">{sunMin} min</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Vitamin D Sources</label>
          <div className="grid grid-cols-2 gap-1.5">
            {FOOD_SOURCES.map((f, i) => (
              <button
                key={i}
                onClick={() => toggleFood(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs text-left transition-all ${
                  selectedFoods.has(i)
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                }`}
              >
                <span>{selectedFoods.has(i) ? '✓' : ''}</span>
                <span className="font-medium">{f.name}</span>
                <span className={`ml-auto ${selectedFoods.has(i) ? 'text-violet-200' : 'text-slate-400'}`}>{f.iuPerServing} IU</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Selected: <span className="font-semibold text-violet-600">{dietIU} IU/day</span> from diet
          </p>
        </div>

        <div>
          <button
            onClick={() => setSupplement((v) => !v)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-semibold transition-all ${
              supplement
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
            }`}
          >
            <span>Take a Vitamin D Supplement</span>
            <span className="text-xs opacity-80">~1000 IU/day</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-violet-200 p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
            <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Recommended Daily Intake</p>
            <p className="text-2xl font-bold text-slate-800">{result.dailyNeed} <span className="text-sm font-normal text-slate-500">IU/day</span></p>
          </div>
          <div className={`${risk.bg} border ${risk.border} rounded-lg px-4 py-3`}>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${risk.color}`}>Estimated Serum 25(OH)D</p>
            <p className="text-2xl font-bold text-slate-800">{result.estimatedSerum.toFixed(0)} <span className="text-sm font-normal text-slate-500">ng/mL</span></p>
          </div>
        </div>

        <div className={`rounded-lg border px-4 py-3 mb-4 ${risk.bg} ${risk.border}`}>
          <div className="flex items-center gap-3">
            <span className={`text-xl font-black ${risk.color}`}>{risk.label}</span>
            <div className="text-xs text-slate-500">
              <span>{risk.range}</span>
              <span className="mx-1">·</span>
              <span>{risk.rangeNm}</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-white/60 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${risk.color.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min(100, (result.estimatedSerum / 100) * 100)}%` }}
            />
          </div>
        </div>

        {result.supplementDose !== null && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-0.5">Suggested Supplement Dose</p>
            <p className="text-xl font-bold text-slate-800">
              {result.supplementDose} <span className="text-sm font-normal text-slate-500">IU/day</span>
            </p>
            <p className="text-xs text-amber-600 mt-1">
              To reach ~{result.dailyNeed} IU/day based on your sun exposure and diet. Do not exceed 2000 IU/day without medical supervision.
            </p>
          </div>
        )}

        {result.supplementDose === null && result.estimatedSerum >= 30 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            <p className="text-sm font-semibold text-emerald-700">You may be getting enough Vitamin D.</p>
            <p className="text-xs text-emerald-600 mt-1">
              Continue current sun exposure, diet, and supplementation habits. A blood test can confirm your levels.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span>☀️</span> Top Food Sources of Vitamin D
        </h3>
        <div className="space-y-2">
          {FOOD_SOURCES.slice(0, 6).map((f, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
              <div>
                <span className="text-sm font-medium text-slate-700">{f.name}</span>
                <span className="text-xs text-slate-400 ml-2">{f.serving}</span>
              </div>
              <span className="text-sm font-bold text-violet-600">{f.iuPerServing} IU</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">☀️ Sun Exposure Tips</h3>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">•</span>
            <span>Midday sun (10 AM–3 PM) produces the most Vitamin D — but also the most UV damage. Limit exposure based on your skin type.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">•</span>
            <span>Light skin: ~10–15 min of midday sun on face and arms can produce ~1000 IU. Dark skin may need 3–5× longer.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">•</span>
            <span>Windows block most UVB rays — outdoor exposure is needed for Vitamin D synthesis.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">•</span>
            <span>Sunscreen (SPF 15+) can reduce Vitamin D production by up to 99%. Balance sun safety with Vitamin D needs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-500 mt-0.5">•</span>
            <span>Winter, high latitudes, and cloudy days significantly reduce UV-B availability for Vitamin D synthesis.</span>
          </li>
        </ul>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-4">
        <h3 className="text-sm font-bold text-violet-800 mb-2">Serum 25(OH)D Reference Ranges</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Deficient', range: '< 20 ng/mL', nmol: '< 50 nmol/L', color: 'text-rose-600' },
            { label: 'Insufficient', range: '20–29 ng/mL', nmol: '50–74 nmol/L', color: 'text-amber-600' },
            { label: 'Sufficient', range: '30–50 ng/mL', nmol: '75–125 nmol/L', color: 'text-emerald-600' },
            { label: 'Optimal', range: '50–70 ng/mL', nmol: '125–175 nmol/L', color: 'text-violet-600' },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className={`font-semibold ${r.color}`}>{r.label}</span>
              <span className="text-slate-500">{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This calculator is for informational purposes only and uses Endocrine Society 2011 guidelines. It provides estimates, not medical advice. A blood test measuring serum 25(OH)D is the only way to know your true Vitamin D status. Consult a qualified healthcare provider before starting any supplement regimen.
      </p>
    </div>
  );
}