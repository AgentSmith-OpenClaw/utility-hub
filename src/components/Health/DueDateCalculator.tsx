'use client';
import React, { useState, useMemo } from 'react';

type InputMode = 'lmp' | 'conception';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getWeeksAndDays(daysDiff: number): { weeks: number; days: number } {
  const weeks = Math.floor(daysDiff / 7);
  const days = daysDiff % 7;
  return { weeks, days };
}

interface Milestone {
  week: number;
  label: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  { week: 4, label: '4 weeks', description: 'Home pregnancy test may turn positive' },
  { week: 8, label: '8 weeks', description: 'Baby\'s heart is beating' },
  { week: 12, label: '12 weeks', description: 'End of first trimester — miscarriage risk drops significantly' },
  { week: 16, label: '16 weeks', description: 'Baby can hear sounds, tiny movements begin' },
  { week: 20, label: '20 weeks', description: 'Halfway point — anatomy scan typically done' },
  { week: 24, label: '24 weeks', description: 'Baby is viable outside womb with medical support' },
  { week: 28, label: '28 weeks', description: 'Third trimester begins — rapid brain growth' },
  { week: 32, label: '32 weeks', description: 'Baby practices breathing, more active movements' },
  { week: 36, label: '36 weeks', description: 'Baby is head-down and ready for birth position' },
  { week: 40, label: '40 weeks', description: 'Full term — your estimated due date' },
];

export default function DueDateCalculator() {
  const [mode, setMode] = useState<InputMode>('lmp');
  const [dateValue, setDateValue] = useState('');
  const [cycleLength, setCycleLength] = useState('28');

  const results = useMemo(() => {
    if (!dateValue) return null;

    const inputDate = new Date(dateValue);
    if (isNaN(inputDate.getTime())) return null;

    let lmp: Date;
    let edd: Date;
    let conceptionDate: Date;

    if (mode === 'lmp') {
      lmp = inputDate;
      const cycle = parseInt(cycleLength) || 28;
      const lutealPhase = 14;
      const daysToAdd = cycle - lutealPhase;
      conceptionDate = addDays(lmp, daysToAdd);
      edd = addDays(lmp, 280);
    } else {
      conceptionDate = inputDate;
      const avgLmp = addDays(conceptionDate, -14);
      lmp = avgLmp;
      edd = addDays(conceptionDate, 266);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysSinceLmp = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilDue = Math.max(0, Math.floor((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    const { weeks, days } = getWeeksAndDays(Math.max(0, daysSinceLmp));

    let trimester: number;
    if (weeks < 13) trimester = 1;
    else if (weeks < 27) trimester = 2;
    else trimester = 3;

    const completedWeeks = Math.min(weeks, 40);
    const milestoneProgress = Math.min((completedWeeks / 40) * 100, 100);

    return {
      lmp,
      conceptionDate,
      edd,
      gestationalAge: { weeks, days },
      daysUntilDue,
      trimester,
      daysSinceLmp,
      milestoneProgress,
    };
  }, [mode, dateValue, cycleLength]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setMode('lmp')}
            className={`flex-1 py-3 px-3 rounded-lg text-sm font-semibold border transition-all ${
              mode === 'lmp'
                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
            }`}
          >
            <span className="block text-base mb-0.5">Last Period</span>
            <span className="block text-xs opacity-70 font-normal">Most common method</span>
          </button>
          <button
            onClick={() => setMode('conception')}
            className={`flex-1 py-3 px-3 rounded-lg text-sm font-semibold border transition-all ${
              mode === 'conception'
                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
            }`}
          >
            <span className="block text-base mb-0.5">Conception Date</span>
            <span className="block text-xs opacity-70 font-normal">If known exactly</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {mode === 'lmp' ? 'First day of last period' : 'Date of conception'}
            </label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {mode === 'lmp' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Cycle length (days)
              </label>
              <select
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 cursor-pointer transition-all"
              >
                {Array.from({ length: 26 }, (_, i) => i + 20).map((n) => (
                  <option key={n} value={String(n)}>{n} days</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1.5">Standard is 28 days. Adjust if your cycle is longer or shorter.</p>
            </div>
          )}
        </div>
      </div>

      {results && (
        <>
          <div className="bg-gradient-from-violet-600 via-purple-600 to-fuchsia-500 rounded-xl p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Estimated Due Date</p>
            <p className="text-3xl font-extrabold tracking-tight mb-1">{formatDate(results.edd)}</p>
            <p className="text-sm opacity-80">{results.daysUntilDue} days to go</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">Currently</p>
              <p className="text-2xl font-extrabold text-violet-800">
                {results.gestationalAge.weeks} weeks
              </p>
              <p className="text-sm text-violet-600 font-medium">
                {results.gestationalAge.days} days
              </p>
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">Trimester</p>
              <p className="text-2xl font-extrabold text-violet-800">
                {results.trimester}
                <span className="text-base font-semibold ml-1">/ 3</span>
              </p>
              <p className="text-sm text-violet-600 font-medium">
                {results.trimester === 1 ? 'Weeks 1–12' : results.trimester === 2 ? 'Weeks 13–26' : 'Weeks 27–40+'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">Key dates</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Conception date (approx.)</p>
                  <p className="text-sm font-semibold text-slate-700">{formatDate(results.conceptionDate)}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-violet-600">💡</span>
                </div>
              </div>
              {mode === 'lmp' && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Last period start</p>
                    <p className="text-sm font-semibold text-slate-700">{formatDate(results.lmp)}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-600">📅</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Days since last period</p>
                  <p className="text-sm font-semibold text-slate-700">{results.daysSinceLmp} days</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-violet-600">⏱</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-3">Pregnancy progress</p>
            <div className="relative h-6 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${results.milestoneProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-400">Conception</span>
              <span className="text-xs text-slate-400">Due Date</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              <span className="text-xs font-semibold text-violet-600 whitespace-nowrap">
                {Math.round(results.milestoneProgress)}% complete
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-700 mb-4">Milestone timeline</p>
            <div className="space-y-3">
              {MILESTONES.map((milestone) => {
                const isPast = results.gestationalAge.weeks >= milestone.week;
                const isCurrent = Math.abs(results.gestationalAge.weeks - milestone.week) <= 1 && results.gestationalAge.weeks >= milestone.week - 1;
                return (
                  <div key={milestone.week} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPast ? 'bg-violet-600' : isCurrent ? 'bg-violet-200' : 'bg-slate-100'
                    }`}>
                      <span className={`text-xs font-bold ${
                        isPast ? 'text-white' : isCurrent ? 'text-violet-700' : 'text-slate-400'
                      }`}>
                        {milestone.week}w
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-semibold ${isPast ? 'text-slate-800' : isCurrent ? 'text-violet-700' : 'text-slate-400'}`}>
                        {milestone.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isPast ? 'text-slate-500' : 'text-slate-400'}`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {!results && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🤰</div>
          <p className="text-sm font-semibold text-violet-700 mb-1">Enter your dates above</p>
          <p className="text-xs text-violet-500">
            {mode === 'lmp'
              ? 'Enter the first day of your last period to calculate your due date and current gestational age.'
              : 'Enter your conception date to calculate your estimated due date.'}
          </p>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This calculator uses Naegele&apos;s rule (LMP + 280 days) for due date estimation. Conception date is calculated as LMP + 14 days (average). Actual due dates vary — only about 4% of babies are born on their exact due date. This tool is for informational purposes only. Consult a qualified healthcare provider for personalized prenatal care.
      </p>
    </div>
  );
}