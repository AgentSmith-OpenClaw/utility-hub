import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from '../Tools/ToolShell';

function pad(n: number) { return String(n).padStart(2, '0'); }

function diffDates(a: Date, b: Date) {
  const later = a > b ? a : b;
  const earlier = a > b ? b : a;
  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();
  if (days < 0) { months -= 1; const prev = new Date(later.getFullYear(), later.getMonth(), 0); days += prev.getDate(); }
  if (months < 0) { years -= 1; months += 12; }
  const totalDays = Math.round((later.getTime() - earlier.getTime()) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  return { years, months, days, totalDays, totalWeeks, totalHours, totalMinutes };
}

export default function AgeCalculator() {
  const today = new Date().toISOString().split('T')[0];
  const [mode, setMode] = useState<'age' | 'diff' | 'add'>('age');
  const [dob, setDob] = useState('1990-01-01');
  const [refDate, setRefDate] = useState(today);
  const [date1, setDate1] = useState('2020-01-01');
  const [date2, setDate2] = useState(today);
  const [baseDate, setBaseDate] = useState(today);
  const [addDays, setAddDays] = useState('30');
  const [addSign, setAddSign] = useState<'+' | '-'>('+');

  const ageResult = useMemo(() => {
    if (mode !== 'age') return null;
    const birth = new Date(dob);
    const ref = new Date(refDate);
    if (isNaN(birth.getTime()) || isNaN(ref.getTime()) || birth > ref) return null;
    const d = diffDates(ref, birth);
    const next = new Date(birth);
    next.setFullYear(ref.getFullYear());
    if (next < ref) next.setFullYear(ref.getFullYear() + 1);
    next.setHours(0, 0, 0, 0);
    ref.setHours(0, 0, 0, 0);
    const daysToNext = Math.round((next.getTime() - ref.getTime()) / 86400000);
    return { ...d, daysToNext };
  }, [mode, dob, refDate]);

  const diffResult = useMemo(() => {
    if (mode !== 'diff') return null;
    const d1 = new Date(date1), d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    return diffDates(d1, d2);
  }, [mode, date1, date2]);

  const addResult = useMemo(() => {
    if (mode !== 'add') return null;
    const base = new Date(baseDate);
    const n = parseInt(addDays);
    if (isNaN(base.getTime()) || isNaN(n)) return null;
    const result = new Date(base);
    result.setDate(result.getDate() + (addSign === '+' ? n : -n));
    return result.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [mode, baseDate, addDays, addSign]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {([['age', 'Age Calculator'], ['diff', 'Date Difference'], ['add', 'Add / Subtract Days']] as const).map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors ${mode === m ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'age' && (
        <>
          <ToolCard title="Date of Birth">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Birthday</label>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={today} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">As of date</label>
                <input type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
              </div>
            </div>
          </ToolCard>
          {ageResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Age', value: `${ageResult.years} yrs`, sub: `${ageResult.months} mo ${ageResult.days} d` },
                { label: 'Total days', value: ageResult.totalDays.toLocaleString(), sub: `${ageResult.totalWeeks.toLocaleString()} weeks` },
                { label: 'Total hours', value: ageResult.totalHours.toLocaleString(), sub: '' },
                { label: 'Next birthday', value: ageResult.daysToNext === 0 ? 'Today! 🎂' : `${ageResult.daysToNext} days`, sub: '' },
              ].map(({ label, value, sub }) => (
                <ToolCard key={label} title={label}>
                  <p className="text-xl font-bold text-amber-700">{value}</p>
                  {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
                </ToolCard>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'diff' && (
        <>
          <ToolCard title="Two Dates">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Start date</label>
                <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">End date</label>
                <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
              </div>
            </div>
          </ToolCard>
          {diffResult && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Exact age', value: `${diffResult.years}y ${diffResult.months}m ${diffResult.days}d` },
                { label: 'Total days', value: diffResult.totalDays.toLocaleString() },
                { label: 'Total weeks', value: diffResult.totalWeeks.toLocaleString() },
                { label: 'Total hours', value: diffResult.totalHours.toLocaleString() },
                { label: 'Total minutes', value: diffResult.totalMinutes.toLocaleString() },
              ].map(({ label, value }) => (
                <ToolCard key={label} title={label} action={<CopyButton value={value} />}>
                  <p className="text-xl font-bold text-amber-700">{value}</p>
                </ToolCard>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'add' && (
        <>
          <ToolCard title="Add or Subtract Days">
            <div className="flex items-center gap-3 flex-wrap">
              <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
              <div className="flex gap-1">
                {(['+', '-'] as const).map((s) => (
                  <button key={s} onClick={() => setAddSign(s)} className={`w-8 h-8 rounded-lg border text-sm font-bold transition-colors ${addSign === s ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'}`}>{s}</button>
                ))}
              </div>
              <input type="number" min={0} value={addDays} onChange={(e) => setAddDays(e.target.value)} className="w-20 px-2 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
              <span className="text-sm text-slate-500">days</span>
            </div>
          </ToolCard>
          {addResult && (
            <ToolCard title="Result" action={<CopyButton value={addResult} />}>
              <p className="text-xl font-bold text-amber-700">{addResult}</p>
            </ToolCard>
          )}
        </>
      )}
    </div>
  );
}
