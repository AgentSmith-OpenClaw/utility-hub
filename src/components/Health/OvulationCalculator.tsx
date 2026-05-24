'use client';
import React, { useState, useMemo } from 'react';

const LUTEAL_PHASE = 14;
const FERTILE_WINDOW_DAYS = 6;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getCycleDays(startDate: Date, cycleLength: number): Date[] {
  return Array.from({ length: cycleLength }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function getMostFertileDay(ovulationDay: Date): Date {
  const d = new Date(ovulationDay);
  d.setDate(d.getDate() - 2);
  return d;
}

interface CycleDisplayProps {
  periodStart: Date;
  cycleLength: number;
  ovulationDay: Date;
  fertileStart: Date;
  mostFertile: Date;
  nextPeriod: Date;
  label: string;
  highlightOvulation: boolean;
}

function CycleDisplay({ periodStart, cycleLength, ovulationDay, fertileStart, mostFertile, nextPeriod, label, highlightOvulation }: CycleDisplayProps) {
  const days = getCycleDays(periodStart, cycleLength);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{label}</p>
        <p className="text-xs text-slate-500">{cycleLength} day cycle</p>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isFertileStart = day.toDateString() === fertileStart.toDateString();
          const isOvulation = day.toDateString() === ovulationDay.toDateString();
          const isMostFertile = day.toDateString() === mostFertile.toDateString();
          const isToday = day.toDateString() === today.toDateString();
          const isPast = day < today && !isToday;

          let bg = 'bg-white';
          let text = 'text-slate-700';
          let border = 'border-slate-100';
          let ring = '';
          let fontWeight = 'font-medium';

          if (isMostFertile) {
            bg = 'bg-violet-600';
            text = 'text-white';
            border = 'border-violet-600';
            fontWeight = 'font-bold';
          } else if (isOvulation) {
            bg = 'bg-fuchsia-500';
            text = 'text-white';
            border = 'border-fuchsia-500';
            fontWeight = 'font-bold';
          } else if (isFertileStart) {
            bg = 'bg-violet-100';
            text = 'text-violet-800';
            border = 'border-violet-300';
          }

          if (isToday) {
            ring = 'ring-2 ring-violet-400 ring-offset-1';
          }

          return (
            <div
              key={i}
              className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 text-[10px] ${bg} ${text} ${border} ${ring} ${fontWeight} ${isPast && !isToday ? 'opacity-40' : ''}`}
            >
              <span className="leading-none">{day.getDate()}</span>
              {isMostFertile && <span className="text-[8px] mt-0.5 opacity-80">Peak</span>}
              {isOvulation && !isMostFertile && <span className="text-[8px] mt-0.5 opacity-80">OV</span>}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-violet-600 inline-block" />
          <span>Most fertile</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-fuchsia-500 inline-block" />
          <span>Ovulation</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-violet-100 border border-violet-300 inline-block" />
          <span>Fertile window</span>
        </span>
      </div>
    </div>
  );
}

export default function OvulationCalculator() {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, [today]);

  const [periodDate, setPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState(28);

  const results = useMemo(() => {
    if (!periodDate) return null;

    const periodStart = new Date(periodDate + 'T00:00:00');

    const ovulationDay = new Date(periodStart);
    ovulationDay.setDate(ovulationDay.getDate() + cycleLength - LUTEAL_PHASE);

    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const mostFertile = new Date(ovulationDay);
    mostFertile.setDate(mostFertile.getDate() - 2);

    const nextPeriod = new Date(periodStart);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    const currentCycleDay = Math.floor((today.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const inCurrentCycle = currentCycleDay > 0 && currentCycleDay <= cycleLength;

    const nextOvulationDay = new Date(nextPeriod);
    nextOvulationDay.setDate(nextOvulationDay.getDate() + cycleLength - LUTEAL_PHASE);

    const nextFertileStart = new Date(nextOvulationDay);
    nextFertileStart.setDate(nextFertileStart.getDate() - 5);

    const nextMostFertile = new Date(nextOvulationDay);
    nextMostFertile.setDate(nextMostFertile.getDate() - 2);

    const nextCycleStart = new Date(nextPeriod);

    return {
      ovulationDay,
      fertileStart,
      mostFertile,
      nextPeriod,
      currentCycleDay: inCurrentCycle ? currentCycleDay : null,
      nextOvulationDay,
      nextFertileStart,
      nextMostFertile,
      nextCycleStart,
    };
  }, [periodDate, cycleLength, today]);

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
      </div>

      {results && (
        <>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 mb-0.5">Predicted ovulation</p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatDateFull(results.ovulationDay)}</p>
                <p className="text-xs text-slate-500 mt-0.5">Day {cycleLength - LUTEAL_PHASE} of your cycle</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 mb-0.5">Fertile window</p>
                <p className="text-sm font-bold text-slate-800">{formatDate(results.fertileStart)} – {formatDate(results.ovulationDay)}</p>
              </div>
              <div className="bg-fuchsia-50 rounded-lg p-3 border border-fuchsia-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-fuchsia-600 mb-0.5">Most fertile days</p>
                <p className="text-sm font-bold text-slate-800">{formatDate(results.mostFertile)} – {formatDate(results.ovulationDay)}</p>
              </div>
            </div>

            {results.currentCycleDay !== null && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Current cycle</p>
                <p className="text-sm font-bold text-slate-800">Day {results.currentCycleDay} of {cycleLength}</p>
              </div>
            )}

            <CycleDisplay
              periodStart={new Date(periodDate + 'T00:00:00')}
              cycleLength={cycleLength}
              ovulationDay={results.ovulationDay}
              fertileStart={results.fertileStart}
              mostFertile={results.mostFertile}
              nextPeriod={results.nextPeriod}
              label="Current Cycle"
              highlightOvulation={true}
            />

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Next Cycle</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 mb-0.5">Next ovulation</p>
                  <p className="text-sm font-bold text-slate-800">{formatDate(results.nextOvulationDay)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Next period expected</p>
                  <p className="text-sm font-bold text-slate-800">{formatDate(results.nextPeriod)}</p>
                </div>
              </div>
              <CycleDisplay
                periodStart={results.nextCycleStart}
                cycleLength={cycleLength}
                ovulationDay={results.nextOvulationDay}
                fertileStart={results.nextFertileStart}
                mostFertile={results.nextMostFertile}
                nextPeriod={new Date(results.nextPeriod.getTime() + cycleLength * 24 * 60 * 60 * 1000)}
                label="Next Cycle"
                highlightOvulation={false}
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                This calculator is for <strong>planning purposes only</strong>. It uses an average luteal phase of 14 days and assumes regular cycles. Many factors affect ovulation timing. This tool is not a form of contraception and should not be used as a method of birth control.
              </p>
            </div>
          </div>
        </>
      )}

      {!results && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-500">Enter your last period start date above to see your ovulation prediction and fertile window.</p>
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center px-2">
        This tool is for informational purposes only. Consult a qualified healthcare provider for personalized advice.
      </p>
    </div>
  );
}