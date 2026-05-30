'use client';
import React, { useState, useMemo } from 'react';

const FALL_ASLEEP_MINUTES = 15;
const CYCLE_LENGTH_MINUTES = 90;

interface SleepResult {
  time: Date;
  cycles: number;
  label: string;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

function cycleResults(baseTime: Date, direction: 'wake' | 'sleep', count: number): SleepResult[] {
  const results: SleepResult[] = [];
  const sign = direction === 'wake' ? -1 : 1;

  for (let cycles = 1; cycles <= count; cycles++) {
    const totalMinutes = sign * (FALL_ASLEEP_MINUTES + cycles * CYCLE_LENGTH_MINUTES);
    results.push({
      time: addMinutes(baseTime, totalMinutes),
      cycles,
      label: `${cycles} cycle${cycles > 1 ? 's' : ''} (${(cycles * 1.5).toFixed(1)}h)`,
    });
  }

  return results;
}

export default function SleepCalculator() {
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake');
  const [hour, setHour] = useState(mode === 'wake' ? '7' : '10');
  const [minute, setMinute] = useState('0');
  const [period, setPeriod] = useState<'AM' | 'PM'>(mode === 'wake' ? 'AM' : 'PM');

  function handleModeChange(newMode: typeof mode) {
    setMode(newMode);
    setHour(newMode === 'wake' ? '7' : '10');
    setPeriod(newMode === 'wake' ? 'AM' : 'PM');
  }

  const baseTime = useMemo(() => {
    let h = parseInt(hour, 10) || 0;
    let m = parseInt(minute, 10) || 0;
    if (h < 1 || h > 12) return null;
    if (m < 0 || m > 59) return null;

    let h24 = h;
    if (period === 'PM' && h !== 12) h24 = h + 12;
    if (period === 'AM' && h === 12) h24 = 0;

    const d = new Date();
    d.setHours(h24, m, 0, 0);
    return d;
  }, [hour, minute, period]);

  const results = useMemo(() => {
    if (!baseTime) return null;
    return cycleResults(baseTime, mode, 6);
  }, [baseTime, mode]);

  const bedtimeDisplay = mode === 'wake'
    ? results?.filter(r => r.cycles <= 4).reverse()
    : results?.filter(r => r.cycles <= 4);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Mode selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-3">What do you want to calculate?</label>
        <div className="flex gap-2">
          {([
            { key: 'wake' as const, label: 'I need to wake up at...' },
            { key: 'sleep' as const, label: 'I go to bed at...' },
          ]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleModeChange(opt.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                mode === opt.key
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time input */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          {mode === 'wake' ? 'Wake-up time' : 'Bedtime'}
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
              ))}
            </select>
            <span className="text-slate-400 font-bold">:</span>
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i * 5} value={String(i * 5)}>{String(i * 5).padStart(2, '0')}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  period === p
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            {mode === 'wake' ? 'For the best sleep, go to bed at one of these times:' : 'You should wake up at one of these times:'}
          </h3>
          <div className="space-y-3">
            {bedtimeDisplay?.map((r, i) => {
              const best = i === (mode === 'wake' ? bedtimeDisplay.length - 1 : 0);
              return (
                <div
                  key={r.cycles}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 border ${
                    best ? 'bg-violet-50 border-violet-200' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      best ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {r.cycles}
                    </div>
                    <span className="text-2xl font-bold text-slate-800">{formatTime(r.time)}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    {best && (
                      <span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              Sleep cycles last about 90 minutes. Waking up mid-cycle leaves you groggy. 
              Add {FALL_ASLEEP_MINUTES} minutes to fall asleep. Aim for 4–6 cycles per night 
              (6–9 hours). The recommended 4-cycle option gives you {mode === 'wake' ? '6 hours' : '7.5 hours'} of sleep.
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Individual sleep needs vary. Consult a healthcare provider for persistent sleep issues.
      </p>
    </div>
  );
}
