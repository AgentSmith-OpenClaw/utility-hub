import React, { useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

interface Field {
  name: string;
  min: number;
  max: number;
  values: number[];
}

interface ParsedCron {
  minute: Field;
  hour: Field;
  day: Field;
  month: Field;
  weekday: Field;
}

const NAMED: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

function parseField(token: string, min: number, max: number, name: string): Field {
  const values = new Set<number>();
  const parts = token.split(',');
  for (const part of parts) {
    let [range, stepStr] = part.split('/');
    const step = stepStr ? parseInt(stepStr, 10) : 1;
    if (range === '*') {
      for (let i = min; i <= max; i += step) values.add(i);
      continue;
    }
    if (range.includes('-')) {
      const [a, b] = range.split('-').map((s) => parseInt(s, 10));
      if (Number.isNaN(a) || Number.isNaN(b)) throw new Error(`Bad range in ${name}: ${range}`);
      for (let i = a; i <= b; i += step) values.add(i);
    } else {
      const v = parseInt(range, 10);
      if (Number.isNaN(v)) throw new Error(`Bad value in ${name}: ${range}`);
      values.add(v);
    }
  }
  const arr = Array.from(values).filter((v) => v >= min && v <= max).sort((a, b) => a - b);
  if (!arr.length) throw new Error(`${name} has no valid values`);
  return { name, min, max, values: arr };
}

function parseCron(input: string): ParsedCron {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Empty expression');
  const expanded = NAMED[trimmed.toLowerCase()] ?? trimmed;
  const tokens = expanded.split(/\s+/);
  if (tokens.length !== 5) throw new Error('Expression must have 5 fields: minute hour day month weekday');
  const [m, h, dom, mon, dow] = tokens;
  return {
    minute: parseField(m, 0, 59, 'minute'),
    hour: parseField(h, 0, 23, 'hour'),
    day: parseField(dom, 1, 31, 'day'),
    month: parseField(mon, 1, 12, 'month'),
    weekday: parseField(dow.replace(/7/g, '0'), 0, 6, 'weekday'),
  };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function describeField(f: Field, names?: string[]): string {
  if (f.values.length === f.max - f.min + 1) return 'every';
  if (f.values.length === 1) {
    const v = f.values[0];
    return names ? names[v] : String(v);
  }
  // Detect step pattern
  if (f.values.length > 2) {
    const step = f.values[1] - f.values[0];
    const allStep = f.values.every((v, i) => i === 0 || v - f.values[i - 1] === step);
    if (allStep && step > 1) return `every ${step} (${f.values.slice(0, 3).join(', ')}…)`;
  }
  return f.values.map((v) => (names ? names[v] : String(v))).join(', ');
}

function describe(cron: ParsedCron): string {
  const minuteDesc = describeField(cron.minute);
  const hourDesc = describeField(cron.hour);
  const dayDesc = describeField(cron.day);
  const monthDesc = describeField(cron.month, ['', ...MONTHS]);
  const weekdayDesc = describeField(cron.weekday, WEEKDAYS);

  const timePart =
    minuteDesc === 'every' && hourDesc === 'every'
      ? 'Every minute'
      : minuteDesc === 'every'
      ? `Every minute of hour ${hourDesc}`
      : hourDesc === 'every'
      ? `At minute ${minuteDesc} of every hour`
      : `At ${pad(cron.hour.values[0])}:${pad(cron.minute.values[0])}` +
        (cron.hour.values.length > 1 || cron.minute.values.length > 1
          ? ` (multiple times: ${minuteDesc} min × ${hourDesc} hr)`
          : '');

  const dayPart =
    dayDesc === 'every' && weekdayDesc === 'every'
      ? 'every day'
      : weekdayDesc === 'every'
      ? `on day ${dayDesc} of the month`
      : dayDesc === 'every'
      ? `on ${weekdayDesc}`
      : `on day ${dayDesc} or ${weekdayDesc}`;

  const monthPart = monthDesc === 'every' ? '' : `, in ${monthDesc}`;
  return `${timePart}, ${dayPart}${monthPart}.`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function nextRuns(cron: ParsedCron, count: number, from: Date): Date[] {
  const out: Date[] = [];
  const minSet = new Set(cron.minute.values);
  const hrSet = new Set(cron.hour.values);
  const dowSet = new Set(cron.weekday.values);
  const domSet = new Set(cron.day.values);
  const monSet = new Set(cron.month.values);

  // Both day-of-month and day-of-week restricted (neither *) → match if either matches (cron quirk)
  const dowAll = cron.weekday.values.length === 7;
  const domAll = cron.day.values.length === 31;

  const d = new Date(from.getTime());
  d.setUTCSeconds(0, 0);
  d.setUTCMinutes(d.getUTCMinutes() + 1);

  let safety = 0;
  while (out.length < count && safety < 366 * 24 * 60) {
    safety++;
    if (
      monSet.has(d.getUTCMonth() + 1) &&
      hrSet.has(d.getUTCHours()) &&
      minSet.has(d.getUTCMinutes())
    ) {
      const dom = d.getUTCDate();
      const dow = d.getUTCDay();
      const dayMatch = dowAll && domAll
        ? true
        : dowAll
        ? domSet.has(dom)
        : domAll
        ? dowSet.has(dow)
        : domSet.has(dom) || dowSet.has(dow);
      if (dayMatch) out.push(new Date(d.getTime()));
    }
    d.setUTCMinutes(d.getUTCMinutes() + 1);
  }
  return out;
}

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every Monday 9am', expr: '0 9 * * 1' },
  { label: 'First of each month', expr: '0 0 1 * *' },
  { label: 'Weekdays 8am', expr: '0 8 * * 1-5' },
  { label: 'Every 15 min, business hours', expr: '*/15 9-17 * * 1-5' },
];

export default function CronParser() {
  const [expr, setExpr] = useState('*/15 9-17 * * 1-5');
  const result = useMemo(() => {
    try {
      const parsed = parseCron(expr);
      return { ok: true as const, parsed, description: describe(parsed) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : 'Invalid cron expression' };
    }
  }, [expr]);

  const upcoming = useMemo(() => {
    if (!result.ok) return [];
    return nextRuns(result.parsed, 10, new Date());
  }, [result]);

  return (
    <div className="space-y-5">
      <ToolCard title="Cron expression" action={<CopyButton value={expr} />}>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          spellCheck={false}
          className="w-full px-3 py-3 text-lg font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          placeholder="* * * * *"
        />
        <div className="mt-3 grid grid-cols-5 gap-2 text-[10px] font-bold uppercase text-slate-400">
          <div>min (0-59)</div>
          <div>hour (0-23)</div>
          <div>day (1-31)</div>
          <div>month (1-12)</div>
          <div>weekday (0-6)</div>
        </div>
      </ToolCard>

      <ToolCard title="Presets">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.expr}
              type="button"
              onClick={() => setExpr(p.expr)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                expr === p.expr
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </ToolCard>

      {result.ok ? (
        <>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-900">
            <strong>{result.description}</strong>
          </div>
          <ToolCard title="Next 10 runs (UTC)">
            <div className="space-y-1">
              {upcoming.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg text-sm font-mono"
                >
                  <span className="text-[10px] text-slate-400 w-6">{i + 1}</span>
                  <span className="text-slate-800">{d.toUTCString()}</span>
                  <span className="ml-auto text-[11px] text-slate-400">{d.toISOString()}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              Times are in UTC. Schedules typically run in the timezone of the host (or UTC for cloud schedulers).
            </p>
          </ToolCard>
        </>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700">
          {result.error}
        </div>
      )}
    </div>
  );
}
