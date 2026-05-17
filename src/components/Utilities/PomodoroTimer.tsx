import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ToolCard } from '../Tools/ToolShell';

type Phase = 'work' | 'short-break' | 'long-break';

const PHASE_CONFIG: Record<Phase, { label: string; color: string; minutes: number }> = {
  'work': { label: 'Focus', color: 'text-red-600', minutes: 25 },
  'short-break': { label: 'Short Break', color: 'text-amber-600', minutes: 5 },
  'long-break': { label: 'Long Break', color: 'text-blue-600', minutes: 15 },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>('work');
  const [settings, setSettings] = useState({ work: 25, short: 5, long: 15 });
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [history, setHistory] = useState<{ phase: Phase; completedAt: string }[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPhaseSeconds = useCallback((p: Phase, s: typeof settings) => {
    return p === 'work' ? s.work * 60 : p === 'short-break' ? s.short * 60 : s.long * 60;
  }, []);

  const advancePhase = useCallback((currentPhase: Phase, currentSessions: number) => {
    const newSessions = currentPhase === 'work' ? currentSessions + 1 : currentSessions;
    let nextPhase: Phase;
    if (currentPhase === 'work') {
      nextPhase = newSessions % 4 === 0 ? 'long-break' : 'short-break';
    } else {
      nextPhase = 'work';
    }
    return { nextPhase, newSessions };
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setHistory((h) => [...h, { phase, completedAt: new Date().toLocaleTimeString() }]);
            setSessions((s) => {
              const { nextPhase, newSessions } = advancePhase(phase, s);
              setPhase(nextPhase);
              setSeconds(getPhaseSeconds(nextPhase, settings));
              return newSessions;
            });
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('Pomodoro', { body: `${PHASE_CONFIG[phase].label} session complete!` });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, settings, advancePhase, getPhaseSeconds]);

  const switchPhase = (p: Phase) => {
    setRunning(false);
    setPhase(p);
    setSeconds(getPhaseSeconds(p, settings));
  };

  const reset = () => {
    setRunning(false);
    setSeconds(getPhaseSeconds(phase, settings));
  };

  const resetAll = () => {
    setRunning(false);
    setPhase('work');
    setSessions(0);
    setHistory([]);
    setSeconds(settings.work * 60);
  };

  const requestNotifications = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  const total = getPhaseSeconds(phase, settings);
  const progress = total > 0 ? (1 - seconds / total) * 100 : 0;
  const cfg = PHASE_CONFIG[phase];

  const circumference = 2 * Math.PI * 70;

  return (
    <div className="space-y-5">
      <div className="flex gap-2 justify-center flex-wrap">
        {(Object.keys(PHASE_CONFIG) as Phase[]).map((p) => (
          <button key={p} onClick={() => switchPhase(p)} className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors ${phase === p ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}>
            {PHASE_CONFIG[p].label}
          </button>
        ))}
      </div>

      <ToolCard title="">
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                stroke={phase === 'work' ? '#ef4444' : phase === 'short-break' ? '#10b981' : '#3b82f6'}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold font-mono ${cfg.color}`}>{formatTime(seconds)}</span>
              <span className="text-xs text-slate-500 mt-1">{cfg.label}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRunning(!running)}
              className={`px-8 py-2.5 rounded-xl font-semibold text-white transition-colors ${running ? 'bg-slate-600 hover:bg-slate-700' : 'bg-amber-600 hover:bg-amber-700'}`}
            >
              {running ? 'Pause' : 'Start'}
            </button>
            <button onClick={reset} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-slate-400 transition-colors text-sm">
              Reset
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Sessions: <strong className="text-slate-800">{sessions}</strong></span>
            <span>Next long break: <strong className="text-slate-800">{sessions % 4 === 0 && sessions > 0 ? 'now' : `in ${4 - (sessions % 4)}`}</strong></span>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Settings" action={
        <button onClick={() => setShowSettings(!showSettings)} className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded border border-slate-200">
          {showSettings ? 'Done' : 'Edit'}
        </button>
      }>
        {showSettings ? (
          <div className="grid grid-cols-3 gap-3">
            {([['Focus', 'work'], ['Short Break', 'short'], ['Long Break', 'long']] as const).map(([label, key]) => (
              <div key={key}>
                <label className="text-xs text-slate-500 mb-1 block">{label} (min)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={settings[key]}
                  onChange={(e) => {
                    const val = Math.min(60, Math.max(1, +e.target.value));
                    setSettings((s) => ({ ...s, [key]: val }));
                    if (!running) setSeconds(getPhaseSeconds(phase, { ...settings, [key]: val }));
                  }}
                  className="w-full px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 text-sm text-slate-600">
            <span>Focus: <strong>{settings.work}m</strong></span>
            <span>Short break: <strong>{settings.short}m</strong></span>
            <span>Long break: <strong>{settings.long}m</strong></span>
          </div>
        )}
        <div className="mt-2 flex gap-2 flex-wrap">
          <button onClick={requestNotifications} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-amber-400 transition-colors">
            Enable notifications
          </button>
          <button onClick={resetAll} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
            Reset all
          </button>
        </div>
      </ToolCard>

      {history.length > 0 && (
        <ToolCard title="Session History">
          <div className="space-y-1 max-h-40 overflow-auto">
            {[...history].reverse().map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1">
                <span className={`w-2 h-2 rounded-full ${h.phase === 'work' ? 'bg-red-400' : h.phase === 'short-break' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                <span className="text-slate-700">{PHASE_CONFIG[h.phase].label} completed</span>
                <span className="text-slate-400 text-xs ml-auto">{h.completedAt}</span>
              </div>
            ))}
          </div>
        </ToolCard>
      )}
    </div>
  );
}
