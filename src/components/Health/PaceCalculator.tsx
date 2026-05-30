'use client';
import React, { useState, useMemo } from 'react';

type DistUnit = 'km' | 'miles';

interface PaceResult {
  pacePerKm: number;
  pacePerMile: number;
  speedKmh: number;
  speedMph: number;
  totalSeconds: number;
}

const SPLIT_DISTANCES: { label: string; km: number }[] = [
  { label: '400m', km: 0.4 },
  { label: '800m', km: 0.8 },
  { label: '1K', km: 1 },
  { label: '5K', km: 5 },
  { label: '10K', km: 10 },
  { label: 'Half Marathon', km: 21.0975 },
  { label: 'Marathon', km: 42.195 },
];

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatPace(secondsPerKm: number): string {
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function PaceCalculator() {
  const [distUnit, setDistUnit] = useState<DistUnit>('km');
  const [distance, setDistance] = useState(distUnit === 'km' ? '5' : '3.1');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState(distUnit === 'km' ? '25' : '24');
  const [seconds, setSeconds] = useState('0');

  function handleUnitChange(u: DistUnit) {
    setDistUnit(u);
    setDistance(u === 'km' ? '5' : '3.1');
    setMinutes(u === 'km' ? '25' : '24');
  }

  const result = useMemo<PaceResult | null>(() => {
    const dist = parseFloat(distance);
    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;

    if (!dist || dist <= 0) return null;
    if (h === 0 && m === 0 && s === 0) return null;

    const totalSeconds = h * 3600 + m * 60 + s;
    const distKm = distUnit === 'miles' ? dist * 1.60934 : dist;

    const pacePerKm = totalSeconds / distKm;
    const pacePerMile = pacePerKm * 1.60934;
    const speedKmh = (distKm / totalSeconds) * 3600;
    const speedMph = speedKmh / 1.60934;

    return { totalSeconds, pacePerKm, pacePerMile, speedKmh, speedMph };
  }, [distance, hours, minutes, seconds, distUnit]);

  const unitLabel = distUnit === 'km' ? 'km' : 'mi';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Unit toggle */}
      <div className="flex justify-end">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(['km', 'miles'] as DistUnit[]).map((u) => (
            <button
              key={u}
              onClick={() => handleUnitChange(u)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                distUnit === u
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Distance ({distUnit})
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              step="0.1"
              placeholder={distUnit === 'km' ? '5' : '3.1'}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Time (hh:mm:ss)</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
                min="0"
                className="w-14 px-2 py-2.5 rounded-lg border border-slate-200 text-lg font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="25"
                min="0"
                max="59"
                className="w-14 px-2 py-2.5 rounded-lg border border-slate-200 text-lg font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
              <span className="text-slate-400 font-bold">:</span>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="0"
                min="0"
                max="59"
                className="w-14 px-2 py-2.5 rounded-lg border border-slate-200 text-lg font-semibold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
              />
            </div>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '5K', dist: '5', time: '25' },
            { label: '10K', dist: '10', time: '52' },
            { label: 'Half', dist: '21.1', time: '120' },
            { label: 'Marathon', dist: '42.2', time: '240' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setDistance(preset.dist); setDistUnit('km'); setHours('0'); setMinutes(preset.time); setSeconds('0'); }}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-50 border border-violet-200 rounded-lg px-5 py-4">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Pace per km</p>
              <p className="text-2xl font-bold text-slate-800">{formatPace(result.pacePerKm)} <span className="text-sm font-normal text-slate-500">/km</span></p>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-lg px-5 py-4">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-0.5">Pace per mile</p>
              <p className="text-2xl font-bold text-slate-800">{formatPace(result.pacePerMile)} <span className="text-sm font-normal text-slate-500">/mi</span></p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Speed</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">km/h</p>
                <p className="text-lg font-bold text-slate-800">{result.speedKmh.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">mph</p>
                <p className="text-lg font-bold text-slate-800">{result.speedMph.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Estimated splits at this pace</h3>
            <div className="space-y-1.5">
              {SPLIT_DISTANCES.map((split) => {
                const splitSeconds = result.pacePerKm * split.km;
                return (
                  <div key={split.label} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-slate-50">
                    <span className="font-medium text-slate-700">{split.label}</span>
                    <span className="font-mono font-semibold text-slate-800">{formatDuration(splitSeconds)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        Pace estimates assume a constant speed throughout. Actual race performance depends on terrain, weather, and fitness. Use this as a training guide, not a guarantee.
      </p>
    </div>
  );
}
