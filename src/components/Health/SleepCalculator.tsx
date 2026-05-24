'use client';
import React, { useState, useMemo } from 'react';

type SleepMode = 'wake' | 'sleep';

const FALL_ASLEEP_MINUTES = 14;
const CYCLE_MINUTES = 90;
const CYCLES = [4, 5, 6];

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function minutesToHoursAndMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

interface SleepRecommendation {
  cycles: number;
  time: Date;
  durationMinutes: number;
}

export default function SleepCalculator() {
  const [mode, setMode] = useState<SleepMode>('wake');

  const [hour, setHour] = useState('6');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');

  const [selectedCycles, setSelectedCycles] = useState(5);

  const now = useMemo(() => new Date(), []);

  const recommendations = useMemo<SleepRecommendation[]>(() => {
    const h = parseInt(hour) || 0;
    const m = parseInt(minute) || 0;
    const hour24 = ampm === 'PM' && h !== 12 ? h + 12 : ampm === 'AM' && h === 12 ? 0 : h;

    let baseTime: Date;
    if (mode === 'wake') {
      baseTime = new Date(now);
      baseTime.setHours(hour24, m, 0, 0);
    } else {
      baseTime = new Date(now);
      baseTime.setHours(hour24, m, 0, 0);
    }

    return CYCLES.map((cycles) => {
      const sleepDuration = cycles * CYCLE_MINUTES;
      const targetTime = new Date(baseTime);

      if (mode === 'wake') {
        targetTime.setMinutes(targetTime.getMinutes() - sleepDuration - FALL_ASLEEP_MINUTES);
      } else {
        targetTime.setMinutes(targetTime.getMinutes() + sleepDuration + FALL_ASLEEP_MINUTES);
      }

      return { cycles, time: targetTime, durationMinutes: sleepDuration };
    });
  }, [mode, hour, minute, ampm, now]);

  const qualityLabel = useMemo(() => {
    switch (selectedCycles) {
      case 4: return { label: '4 cycles (6h) — Minimum rest', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
      case 5: return { label: '5 cycles (7.5h) — Optimal for most adults', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' };
      case 6: return { label: '6 cycles (9h) — Maximum restorative', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
      default: return { label: '', color: '', bg: '' };
    }
  }, [selectedCycles]);

  const timeUntilAlarm = useMemo(() => {
    if (mode !== 'sleep') return null;
    const h = parseInt(hour) || 0;
    const m = parseInt(minute) || 0;
    const hour24 = ampm === 'PM' && h !== 12 ? h + 12 : ampm === 'AM' && h === 12 ? 0 : h;
    const sleepTime = new Date(now);
    sleepTime.setHours(hour24, m, 0, 0);

    const diff = sleepTime.getTime() - now.getTime();
    if (diff <= 0) return null;
    return Math.round(diff / 60000);
  }, [mode, hour, minute, ampm, now]);

  const timelineSpan = useMemo(() => {
    const recs = recommendations;
    if (!recs.length) return { earliest: now, latest: now, span: 0 };
    const times = recs.map((r) => r.time.getTime());
    const earliest = Math.min(...times);
    const latest = Math.max(...times);
    return { earliest: new Date(earliest), latest: new Date(latest), span: latest - earliest };
  }, [recommendations, now]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-700">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setMode('wake')}
            className={`flex-1 py-3 px-3 rounded-lg text-sm font-semibold border transition-all ${
              mode === 'wake'
                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-violet-500 hover:bg-slate-700'
            }`}
          >
            <span className="block text-base mb-0.5">I want to wake up at...</span>
            <span className="block text-xs opacity-70 font-normal">Calculate best bedtimes</span>
          </button>
          <button
            onClick={() => setMode('sleep')}
            className={`flex-1 py-3 px-3 rounded-lg text-sm font-semibold border transition-all ${
              mode === 'sleep'
                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-600 hover:border-violet-500 hover:bg-slate-700'
            }`}
          >
            <span className="block text-base mb-0.5">I&apos;m going to sleep now...</span>
            <span className="block text-xs opacity-70 font-normal">Calculate best wake times</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-16 bg-slate-800 text-white border border-slate-600 rounded-lg px-2 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={String(h)}>{String(h).padStart(2, '0')}</option>
              ))}
            </select>
            <span className="text-slate-400 text-2xl font-bold">:</span>
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-16 bg-slate-800 text-white border border-slate-600 rounded-lg px-2 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 cursor-pointer"
            >
              {['00', '15', '30', '45'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={ampm}
              onChange={(e) => setAmpm(e.target.value as 'AM' | 'PM')}
              className="w-16 bg-slate-800 text-white border border-slate-600 rounded-lg px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 cursor-pointer"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <span className="text-slate-400 text-sm">
            {mode === 'wake' ? '— wake time' : '— sleep time'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-3">Sleep cycles</p>
        <div className="grid grid-cols-3 gap-2">
          {CYCLES.map((c) => {
            const isSelected = selectedCycles === c;
            const durationLabel = c === 4 ? '6h' : c === 5 ? '7.5h' : '9h';
            return (
              <button
                key={c}
                onClick={() => setSelectedCycles(c)}
                className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                }`}
              >
                <span className="block text-base">{c} cycles</span>
                <span className={`block text-xs font-normal ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>{durationLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className={`rounded-xl border p-5 ${qualityLabel.bg}`}>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Recommendation</p>
          </div>
          <p className={`text-sm font-bold ${qualityLabel.color}`}>{qualityLabel.label}</p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {recommendations.map((rec) => {
            const isHighlighted = rec.cycles === selectedCycles;
            return (
              <button
                key={rec.cycles}
                onClick={() => setSelectedCycles(rec.cycles)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isHighlighted
                    ? 'bg-violet-600 border-violet-600 shadow-md text-white'
                    : 'bg-white border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isHighlighted ? 'text-violet-200' : 'text-slate-400'}`}>
                      {rec.cycles} cycles · {minutesToHoursAndMinutes(rec.durationMinutes)}
                    </p>
                    <p className="text-2xl font-extrabold tracking-tight">
                      {formatTime(rec.time)}
                    </p>
                    <p className={`text-xs mt-0.5 ${isHighlighted ? 'text-violet-200' : 'text-slate-400'}`}>
                      {mode === 'wake'
                        ? `Go to bed by ${formatTime(rec.time)}`
                        : `Wake up at ${formatTime(rec.time)}`}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isHighlighted ? 'bg-violet-500' : 'bg-slate-100'
                  }`}>
                    <span className={`text-sm font-bold ${isHighlighted ? 'text-white' : 'text-slate-500'}`}>
                      {rec.cycles}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {mode === 'sleep' && timeUntilAlarm !== null && (
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 text-center">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Time until alarm</p>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {minutesToHoursAndMinutes(timeUntilAlarm)}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Based on {selectedCycles} cycles
          </p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">Sleep window</p>
          <div className="relative h-12 rounded-full overflow-hidden bg-slate-100">
            <div className="absolute inset-0 flex">
              {recommendations.map((rec, i) => {
                const start = rec.cycles === 4 ? 0 : rec.cycles === 5 ? 33 : 66;
                const width = 34;
                return (
                  <div
                    key={rec.cycles}
                    className={`h-full flex items-center justify-center text-xs font-bold ${
                      rec.cycles === selectedCycles
                        ? 'bg-violet-500 text-white'
                        : 'bg-violet-200 text-violet-700'
                    }`}
                    style={{ width: `${width}%`, marginLeft: i === 0 ? `${start}%` : '0' }}
                  >
                    {formatTime(rec.time)}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-slate-400">
            <span>Earlier</span>
            <span>Later</span>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        Sleep cycle recommendations are based on 90-minute cycles plus a ~14-minute fall-asleep offset. Individual needs vary — use this as a guide, not a guarantee. Consult a healthcare professional for personalized sleep advice.
      </p>
    </div>
  );
}