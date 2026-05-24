'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

interface CycleProjection {
  periodStart: Date;
  periodEnd: Date;
  pmsStart: Date;
  pmsEnd: Date;
  fertileStart: Date;
  fertileEnd: Date;
  ovulationDay: Date;
  label: string;
}

export default function PeriodCalculator() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [periodDate, setPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  const projections = useMemo((): CycleProjection[] | null => {
    if (!periodDate) return null;

    const start = new Date(periodDate + 'T00:00:00');
    const cycles: CycleProjection[] = [];

    for (let i = 0; i < 3; i++) {
      const cycleStart = addDays(start, i * cycleLength);
      const periodEnd = addDays(cycleStart, periodLength - 1);
      const pmsStart = addDays(cycleStart, cycleLength - 5);
      const pmsEnd = addDays(cycleStart, cycleLength - 1);
      const ovulationDay = addDays(cycleStart, cycleLength - 14);
      const fertileStart = addDays(ovulationDay, -5);
      const fertileEnd = ovulationDay;

      cycles.push({
        periodStart: cycleStart,
        periodEnd,
        pmsStart,
        pmsEnd,
        fertileStart,
        fertileEnd,
        ovulationDay,
        label: i === 0 ? 'Current Cycle' : i === 1 ? 'Next Cycle' : 'Cycle After',
      });
    }

    return cycles;
  }, [periodDate, cycleLength, periodLength]);

  const daysUntilNext = useMemo(() => {
    if (!projections || projections.length === 0) return null;
    const diff = projections[0].periodStart.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [projections, today]);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Last period start date
          </label>
          <input
            type="date"
            value={periodDate}
            max={todayStr}
            onChange={(e) => setPeriodDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Average cycle length: <span className="text-violet-600">{cycleLength} days</span>
          </label>
          <input
            type="range"
            min={20}
            max={45}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-violet-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>20 days</span>
            <span>45 days</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Average period length: <span className="text-violet-600">{periodLength} days</span>
          </label>
          <input
            type="range"
            min={2}
            max={10}
            value={periodLength}
            onChange={(e) => setPeriodLength(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-violet-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>2 days</span>
            <span>10 days</span>
          </div>
        </div>
      </div>

      {projections && projections.length > 0 && (
        <>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-0.5">Next period expected</p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatDateFull(projections[0].periodStart)}</p>
                {daysUntilNext !== null && daysUntilNext > 0 && (
                  <p className="text-sm text-violet-700 mt-1 font-medium">
                    in {daysUntilNext} {daysUntilNext === 1 ? 'day' : 'days'}
                  </p>
                )}
                {daysUntilNext !== null && daysUntilNext <= 0 && (
                  <p className="text-sm text-rose-600 mt-1 font-medium">
                    {daysUntilNext === 0 ? 'Today' : `${Math.abs(daysUntilNext)} days ago`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-0.5">PMS Window</p>
                <p className="text-xs text-amber-700">
                  {formatDate(projections[0].pmsStart)} – {formatDate(projections[0].pmsEnd)} — Expect mood changes, bloating, and other PMS symptoms during this time.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">3-Cycle Projection</p>
            <div className="space-y-4">
              {projections.map((cycle, i) => {
                const isCurrent = i === 0;
                const isPast = cycle.periodStart < today;

                return (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 ${isPast ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-violet-700' : 'text-slate-500'}`}>
                        {cycle.label}
                        {isCurrent && <span className="ml-1 text-violet-400">← You are here</span>}
                      </p>
                      {isPast && <span className="text-[10px] text-slate-400">Past</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-rose-50 rounded p-2 border border-rose-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 mb-0.5">Period</p>
                        <p className="font-semibold text-slate-700">{formatDate(cycle.periodStart)} – {formatDate(cycle.periodEnd)}</p>
                      </div>
                      <div className="bg-amber-50 rounded p-2 border border-amber-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-0.5">PMS Window</p>
                        <p className="font-semibold text-slate-700">{formatDate(cycle.pmsStart)} – {formatDate(cycle.pmsEnd)}</p>
                      </div>
                      <div className="bg-violet-50 rounded p-2 border border-violet-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 mb-0.5">Fertile Window</p>
                        <p className="font-semibold text-slate-700">{formatDate(cycle.fertileStart)} – {formatDate(cycle.fertileEnd)}</p>
                      </div>
                      <div className="bg-fuchsia-50 rounded p-2 border border-fuchsia-100">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-600 mb-0.5">Ovulation Day</p>
                        <p className="font-semibold text-slate-700">{formatDate(cycle.ovulationDay)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Want to know your fertile window?</p>
              <p className="text-sm text-slate-700">Use the Ovulation Calculator for a detailed view.</p>
            </div>
            <Link
              href="/health/ovulation-calculator"
              className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              <span>Ovulation Calculator</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-rose-800 leading-relaxed">
                <strong>Tracking, not diagnosis.</strong> This calculator uses averages and assumes regular cycles. Actual cycle lengths vary. This tool is for informational purposes only — consult a healthcare provider for personalized advice.
              </p>
            </div>
          </div>
        </>
      )}

      {!projections && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-500">Enter your last period start date above to see your period prediction and 3-cycle projection.</p>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Consult a qualified healthcare provider for personalized advice.
      </p>
    </div>
  );
}