'use client';
import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const LineChart = dynamic(
  () => import('recharts').then((m) => m.LineChart),
  { ssr: false }
);
const Line = dynamic(() => import('recharts').then((m) => m.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((m) => m.CartesianGrid), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then((m) => m.ReferenceLine), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false });

const HALF_LIFE_HOURS = 5.5;
const FDA_MAX_MG = 400;

interface CaffeineSource {
  id: string;
  name: string;
  mg: number;
  isCustom: boolean;
}

interface AddedDrink {
  id: string;
  sourceId: string;
  name: string;
  mg: number;
  consumedAt: Date;
}

const COMMON_SOURCES: CaffeineSource[] = [
  { id: 'brew-coffee', name: 'Brewed Coffee (8oz)', mg: 95, isCustom: false },
  { id: 'espresso', name: 'Espresso (1oz)', mg: 63, isCustom: false },
  { id: 'latte', name: 'Latte / Mocha', mg: 90, isCustom: false },
  { id: 'drip-coffee', name: 'Drip Coffee (12oz)', mg: 140, isCustom: false },
  { id: 'black-tea', name: 'Black Tea (8oz)', mg: 47, isCustom: false },
  { id: 'green-tea', name: 'Green Tea (8oz)', mg: 28, isCustom: false },
  { id: 'energy-16', name: 'Energy Drink (16oz)', mg: 160, isCustom: false },
  { id: 'energy-8', name: 'Energy Drink (8oz)', mg: 80, isCustom: false },
  { id: 'cola', name: 'Cola (12oz)', mg: 40, isCustom: false },
  { id: 'dark-choc', name: 'Dark Chocolate (1.5oz)', mg: 30, isCustom: false },
  { id: 'coffee-ice-cream', name: 'Coffee Ice Cream (1/2 cup)', mg: 30, isCustom: false },
];

function generateId() {
  return Math.random().toString(36).slice(2);
}

function calcRemainingCaffeine(initialMg: number, hoursElapsed: number): number {
  if (hoursElapsed < 0 || initialMg <= 0) return 0;
  const halfLives = hoursElapsed / HALF_LIFE_HOURS;
  return initialMg * Math.pow(0.5, halfLives);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

interface DecayPoint {
  hours: number;
  label: string;
  caffeine: number;
}

export default function CaffeineCalculator() {
  const [drinks, setDrinks] = useState<AddedDrink[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(COMMON_SOURCES[0].id);
  const [customMg, setCustomMg] = useState('');
  const [customName, setCustomName] = useState('');
  const [consumedAt, setConsumedAt] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  const now = useMemo(() => new Date(), []);

  const selectedSource = useMemo(
    () => COMMON_SOURCES.find((s) => s.id === selectedSourceId) ?? COMMON_SOURCES[0],
    [selectedSourceId]
  );

  const totalIntake = useMemo(() => drinks.reduce((sum, d) => sum + d.mg, 0), [drinks]);

  const currentCaffeine = useMemo<{ total: number; percentOfMax: number }>(() => {
    const refTime = new Date(currentTime);
    let total = 0;
    drinks.forEach((d) => {
      const hoursElapsed = (refTime.getTime() - d.consumedAt.getTime()) / (1000 * 60 * 60);
      total += calcRemainingCaffeine(d.mg, hoursElapsed);
    });
    return { total: Math.round(total), percentOfMax: Math.min(100, (total / FDA_MAX_MG) * 100) };
  }, [drinks, currentTime]);

  const decayMilestones = useMemo<{ mg: number; label: string; time: Date | null }[]>(() => {
    const refTime = new Date(currentTime);
    const milestones = [
      { mg: 200, label: 'Below half max (200mg)' },
      { mg: 100, label: 'Low (100mg)' },
      { mg: 50, label: 'Minimal (50mg)' },
      { mg: 25, label: 'Trace (25mg)' },
    ];

    return milestones.map(({ mg, label }) => {
      let time: Date | null = null;
      for (const drink of drinks) {
        const hoursElapsed = (refTime.getTime() - drink.consumedAt.getTime()) / (1000 * 60 * 60);
        const remaining = calcRemainingCaffeine(drink.mg, hoursElapsed);
        if (remaining > 0) {
          let t = new Date(drink.consumedAt);
          while (calcRemainingCaffeine(drink.mg, (t.getTime() - drink.consumedAt.getTime()) / (1000 * 60 * 60)) > mg) {
            t = new Date(t.getTime() + HALF_LIFE_HOURS * 0.5 * 60 * 60 * 1000);
          }
          const candidateTime = new Date(t);
          if (candidateTime > refTime && (time === null || candidateTime < time)) {
            time = candidateTime;
          }
        }
      }
      return { mg, label, time };
    });
  }, [drinks, currentTime]);

  const chartData = useMemo<DecayPoint[]>(() => {
    const refTime = new Date(currentTime);
    const points: DecayPoint[] = [];
    for (let h = 0; h <= 24; h += 0.5) {
      let total = 0;
      drinks.forEach((d) => {
        const elapsed = (refTime.getTime() - d.consumedAt.getTime()) / (1000 * 60 * 60) + h;
        total += calcRemainingCaffeine(d.mg, elapsed);
      });
      const label = h === 0 ? 'Now' : h === 24 ? '+24h' : `+${h}h`;
      points.push({ hours: h, label, caffeine: Math.round(total) });
    }
    return points;
  }, [drinks, currentTime]);

  function addDrink() {
    const mg = selectedSource.isCustom ? parseInt(customMg) || 0 : selectedSource.mg;
    if (mg <= 0) return;
    const name = selectedSource.isCustom ? (customName.trim() || `Custom (${mg}mg)`) : selectedSource.name;
    const drink: AddedDrink = {
      id: generateId(),
      sourceId: selectedSource.id,
      name,
      mg,
      consumedAt: new Date(consumedAt),
    };
    setDrinks((prev) => [...prev, drink]);
    setCustomMg('');
  }

  function removeDrink(id: string) {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
  }

  function addCustomDrink() {
    const mg = parseInt(customMg) || 0;
    if (mg <= 0) return;
    const drink: AddedDrink = {
      id: generateId(),
      sourceId: 'custom',
      name: customName.trim() || `Custom (${mg}mg)`,
      mg,
      consumedAt: new Date(consumedAt),
    };
    setDrinks((prev) => [...prev, drink]);
    setCustomMg('');
    setCustomName('');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">Add a caffeine source</p>
          <p className="text-xs text-slate-400">FDA max: {FDA_MAX_MG}mg/day</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Source</label>
            <select
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 cursor-pointer"
            >
              <optgroup label="Common Drinks">
                {COMMON_SOURCES.filter(s => !s.isCustom).map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.mg}mg</option>
                ))}
              </optgroup>
              <optgroup label="Custom">
                <option value="custom">Custom (enter mg below)</option>
              </optgroup>
            </select>
          </div>

          {selectedSourceId === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Cold Brew"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Caffeine (mg)</label>
                <input
                  type="number"
                  value={customMg}
                  onChange={(e) => setCustomMg(e.target.value)}
                  placeholder="e.g. 120"
                  min={1}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
              </div>
            </div>
          )}

          {selectedSourceId !== 'custom' && (
            <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-sm text-violet-700 font-medium">{selectedSource.name}</span>
              <span className="text-sm font-bold text-violet-600">{selectedSource.mg}mg</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Time consumed</label>
              <input
                type="datetime-local"
                value={consumedAt}
                onChange={(e) => setConsumedAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Reference time</label>
              <input
                type="datetime-local"
                value={currentTime}
                onChange={(e) => setCurrentTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
            </div>
          </div>

          <button
            onClick={selectedSourceId === 'custom' ? addCustomDrink : addDrink}
            className="w-full py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-sm"
          >
            Add to tracking
          </button>
        </div>
      </div>

      {drinks.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">Tracked drinks ({drinks.length})</p>
            <span className="text-xs text-slate-400">Total: {totalIntake}mg</span>
          </div>
          <div className="space-y-2">
            {drinks.map((drink) => (
              <div key={drink.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-800">{drink.name}</p>
                  <p className="text-xs text-slate-400">{formatDateTime(drink.consumedAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600">{drink.mg}mg</span>
                  <button
                    onClick={() => removeDrink(drink.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label="Remove drink"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setDrinks([])}
            className="mt-2 text-xs text-slate-400 hover:text-rose-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {drinks.length > 0 && (
        <>
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-slate-700">Current caffeine in system</span>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{currentCaffeine.total}</span>
              <span className="text-lg text-slate-400 font-medium mb-1.5">mg</span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>0mg</span>
                <span className="text-violet-600 font-semibold">{currentCaffeine.percentOfMax.toFixed(0)}% of FDA max</span>
                <span>{FDA_MAX_MG}mg</span>
              </div>
              <div className="relative h-4 rounded-full overflow-hidden bg-slate-100">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                    currentCaffeine.total > FDA_MAX_MG ? 'bg-rose-500' : 'bg-violet-500'
                  }`}
                  style={{ width: `${Math.min(100, currentCaffeine.percentOfMax)}%` }}
                />
                <div
                  className="absolute top-0 h-full border-l-2 border-dashed border-violet-400"
                  style={{ left: '50%' }}
                />
              </div>
            </div>

            {currentCaffeine.total > FDA_MAX_MG && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 mb-3">
                <p className="text-sm font-semibold text-rose-700">
                  ⚠️ You've exceeded the FDA recommended daily limit of {FDA_MAX_MG}mg
                </p>
                <p className="text-xs text-rose-500 mt-0.5">
                  Healthy adults should limit caffeine to {FDA_MAX_MG}mg/day. Consider cutting off caffeine consumption for today.
                </p>
              </div>
            )}

            {decayMilestones.some(m => m.time !== null) && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Caffeine decay timeline</p>
                {decayMilestones.filter(m => m.time !== null).map((m) => (
                  <div key={m.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{m.label}</span>
                    <span className="font-medium text-violet-600">{formatDateTime(m.time!)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Caffeine decay curve — next 24 hours</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-block w-3 h-0.5 bg-violet-500 rounded-full" />
                <span>Based on 5.5h half-life</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}`}
                  width={30}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value)}mg`, 'Caffeine']}
                  labelStyle={{ color: '#475569', fontSize: 12 }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <ReferenceLine y={FDA_MAX_MG} stroke="#f43f5e" strokeDasharray="5 3" label={{ value: 'FDA max', fill: '#f43f5e', fontSize: 10 }} />
                <ReferenceLine y={200} stroke="#a78bfa" strokeDasharray="3 3" label={{ value: '200mg', fill: '#a78bfa', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="caffeine"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#7c3aed' }}
                  name="Caffeine (mg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {drinks.length === 0 && (
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-5 text-center">
          <p className="text-3xl mb-2">☕</p>
          <p className="text-sm font-semibold text-violet-700">Track your caffeine intake</p>
          <p className="text-xs text-violet-500 mt-1">Add drinks above to see your current caffeine level and decay timeline.</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-3">Common caffeine sources</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium text-right">Caffeine (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {COMMON_SOURCES.map((s) => (
                <tr key={s.id} className="hover:bg-violet-50/50 transition-colors">
                  <td className="py-2 text-slate-700">{s.name}</td>
                  <td className="py-2 text-right font-medium text-slate-600">{s.mg}mg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        Caffeine half-life is approximately 5–6 hours in healthy adults — varies by age, liver function, pregnancy, and genetics. FDA recommends max 400mg/day for healthy adults. This tool is for informational purposes only. Consult a qualified healthcare provider for personalized advice.
      </p>
    </div>
  );
}