import React, { useState, useEffect, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type Unit = 'seconds' | 'milliseconds';

function pad(n: number, size = 2): string {
  return String(n).padStart(size, '0');
}

function formatLocal(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatUTC(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

function relative(d: Date): string {
  const diff = (Date.now() - d.getTime()) / 1000;
  const abs = Math.abs(diff);
  const future = diff < 0;
  let value: string;
  if (abs < 60) value = `${Math.round(abs)} second${Math.round(abs) === 1 ? '' : 's'}`;
  else if (abs < 3600) value = `${Math.round(abs / 60)} minute${Math.round(abs / 60) === 1 ? '' : 's'}`;
  else if (abs < 86400) value = `${Math.round(abs / 3600)} hour${Math.round(abs / 3600) === 1 ? '' : 's'}`;
  else if (abs < 86400 * 30) value = `${Math.round(abs / 86400)} day${Math.round(abs / 86400) === 1 ? '' : 's'}`;
  else if (abs < 86400 * 365) value = `${Math.round(abs / 86400 / 30)} month${Math.round(abs / 86400 / 30) === 1 ? '' : 's'}`;
  else value = `${Math.round(abs / 86400 / 365)} year${Math.round(abs / 86400 / 365) === 1 ? '' : 's'}`;
  return future ? `in ${value}` : `${value} ago`;
}

export default function TimestampConverter() {
  const [now, setNow] = useState(Date.now());
  const [unit, setUnit] = useState<Unit>('seconds');
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const tsParsed = useMemo(() => {
    const n = Number(tsInput);
    if (!tsInput.trim() || isNaN(n)) return null;
    const ms = unit === 'seconds' ? n * 1000 : n;
    if (ms < -8.64e15 || ms > 8.64e15) return null;
    return new Date(ms);
  }, [tsInput, unit]);

  const dateParsed = useMemo(() => {
    if (!dateInput.trim()) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    return d;
  }, [dateInput]);

  const currentDate = new Date(now);

  return (
    <div className="space-y-5">
      <ToolCard title="Current time">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Stat label="Unix (seconds)" value={Math.floor(now / 1000).toString()} />
          <Stat label="Unix (milliseconds)" value={now.toString()} />
          <Stat label="ISO 8601" value={currentDate.toISOString()} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{formatLocal(currentDate)} (local)</span>
          <span>{formatUTC(currentDate)}</span>
        </div>
      </ToolCard>

      {/* Timestamp -> Date */}
      <ToolCard title="Timestamp → Date">
        <div className="flex flex-wrap items-stretch gap-2 mb-3">
          <input
            type="text"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder={unit === 'seconds' ? 'e.g. 1782518400' : 'e.g. 1782518400000'}
            className="flex-1 min-w-[200px] px-4 py-3 text-base font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            spellCheck={false}
          />
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {(['seconds', 'milliseconds'] as Unit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  unit === u ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTsInput(unit === 'seconds' ? Math.floor(now / 1000).toString() : now.toString())}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors"
          >
            Use now
          </button>
        </div>
        {tsInput && !tsParsed && (
          <div className="text-xs text-red-600 mb-3">Invalid timestamp.</div>
        )}
        {tsParsed && (
          <div className="space-y-2">
            <Row label="Local" value={formatLocal(tsParsed)} />
            <Row label="UTC" value={formatUTC(tsParsed)} />
            <Row label="ISO 8601" value={tsParsed.toISOString()} />
            <Row label="RFC 2822" value={tsParsed.toUTCString()} />
            <Row label="Relative" value={relative(tsParsed)} />
          </div>
        )}
      </ToolCard>

      {/* Date -> Timestamp */}
      <ToolCard title="Date → Timestamp">
        <div className="flex flex-wrap items-stretch gap-2 mb-3">
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="2026-05-07T08:30:00Z, 2026-05-07, May 7 2026"
            className="flex-1 min-w-[200px] px-4 py-3 text-base font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setDateInput(currentDate.toISOString())}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors"
          >
            Use now
          </button>
        </div>
        {dateInput && !dateParsed && (
          <div className="text-xs text-red-600 mb-3">
            Could not parse date. Try ISO 8601 (2026-05-07T08:30:00Z) or a common format.
          </div>
        )}
        {dateParsed && (
          <div className="space-y-2">
            <Row label="Unix (s)" value={Math.floor(dateParsed.getTime() / 1000).toString()} />
            <Row label="Unix (ms)" value={dateParsed.getTime().toString()} />
            <Row label="ISO 8601" value={dateParsed.toISOString()} />
            <Row label="Relative" value={relative(dateParsed)} />
          </div>
        )}
      </ToolCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-100 rounded-xl p-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">{label}</div>
      <code className="text-base sm:text-lg font-mono font-bold text-slate-900 break-all">{value}</code>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 w-24 flex-shrink-0">{label}</span>
      <code className="flex-1 text-sm font-mono text-slate-800 break-all">{value}</code>
      <CopyButton value={value} />
    </div>
  );
}
