import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

interface Permission { read: boolean; write: boolean; execute: boolean; }

const ENTITIES = ['Owner', 'Group', 'Others'] as const;
type Entity = typeof ENTITIES[number];

function permToOctal(p: Permission): number {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
}

function octalToPerm(n: number): Permission {
  return { read: !!(n & 4), write: !!(n & 2), execute: !!(n & 1) };
}

function permToSymbol(p: Permission): string {
  return `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`;
}

const COMMON_PRESETS = [
  { label: '755', desc: 'rwxr-xr-x — typical executable/directory', value: '755' },
  { label: '644', desc: 'rw-r--r-- — typical file', value: '644' },
  { label: '600', desc: 'rw------- — private files (SSH keys)', value: '600' },
  { label: '777', desc: 'rwxrwxrwx — full access (avoid!)', value: '777' },
  { label: '700', desc: 'rwx------ — private directory', value: '700' },
  { label: '444', desc: 'r--r--r-- — read-only', value: '444' },
  { label: '666', desc: 'rw-rw-rw- — world-writable (avoid!)', value: '666' },
  { label: '750', desc: 'rwxr-x--- — owner+group exec', value: '750' },
];

export default function ChmodCalculator() {
  const [perms, setPerms] = useState<Record<Entity, Permission>>({
    Owner: { read: true, write: true, execute: true },
    Group: { read: true, write: false, execute: true },
    Others: { read: true, write: false, execute: true },
  });
  const [octalInput, setOctalInput] = useState('755');
  const [inputMode, setInputMode] = useState<'checkboxes' | 'octal'>('checkboxes');

  const octal = useMemo(() => ENTITIES.map(e => permToOctal(perms[e])).join(''), [perms]);
  const symbolic = useMemo(() => ENTITIES.map(e => permToSymbol(perms[e])).join(''), [perms]);

  const applyOctal = (val: string) => {
    setOctalInput(val);
    if (/^[0-7]{3}$/.test(val)) {
      const [o, g, oth] = val.split('').map(Number);
      setPerms({ Owner: octalToPerm(o), Group: octalToPerm(g), Others: octalToPerm(oth) });
    }
  };

  const applyPreset = (value: string) => {
    setOctalInput(value);
    applyOctal(value);
  };

  const toggle = (entity: Entity, perm: keyof Permission) => {
    setPerms(prev => {
      const next = { ...prev, [entity]: { ...prev[entity], [perm]: !prev[entity][perm] } };
      setOctalInput(ENTITIES.map(e => permToOctal(next[e])).join(''));
      return next;
    });
  };

  const chmodCmd = `chmod ${octal} filename`;
  const chmodSymCmd = `chmod ${
    ENTITIES.map((e, i) => {
      const prefix = ['u', 'g', 'o'][i];
      const p = perms[e];
      const bits = `${p.read ? 'r' : ''}${p.write ? 'w' : ''}${p.execute ? 'x' : ''}`;
      return `${prefix}=${bits}`;
    }).join(',')
  } filename`;

  return (
    <div className="space-y-5">
      <ToolCard title="Common Presets">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COMMON_PRESETS.map((p) => (
            <button key={p.label} onClick={() => applyPreset(p.value)} className={`text-left p-2 rounded-lg border text-xs transition-colors ${octal === p.value ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}>
              <div className="font-mono font-bold text-slate-800">{p.label}</div>
              <div className="text-slate-500 leading-tight mt-0.5">{p.desc.split('—')[0].trim()}</div>
            </button>
          ))}
        </div>
      </ToolCard>

      <ToolCard title="Mode">
        <div className="flex gap-2">
          {(['checkboxes', 'octal'] as const).map((m) => (
            <button key={m} onClick={() => setInputMode(m)} className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors capitalize ${inputMode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {m === 'checkboxes' ? 'Checkboxes' : 'Octal Input'}
            </button>
          ))}
        </div>
      </ToolCard>

      {inputMode === 'checkboxes' ? (
        <ToolCard title="Permissions">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 pr-4 text-slate-500 font-medium">Entity</th>
                  {(['read', 'write', 'execute'] as const).map(p => (
                    <th key={p} className="text-center py-2 px-3 text-slate-500 font-medium capitalize">{p}</th>
                  ))}
                  <th className="text-center py-2 px-3 text-slate-500 font-medium">Octal</th>
                  <th className="text-center py-2 px-3 text-slate-500 font-medium">Symbol</th>
                </tr>
              </thead>
              <tbody>
                {ENTITIES.map((entity) => (
                  <tr key={entity} className="border-t border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-700">{entity}</td>
                    {(['read', 'write', 'execute'] as const).map(perm => (
                      <td key={perm} className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={perms[entity][perm]}
                          onChange={() => toggle(entity, perm)}
                          className="w-4 h-4 accent-emerald-600 cursor-pointer"
                        />
                      </td>
                    ))}
                    <td className="py-3 px-3 text-center font-mono text-slate-800 font-bold">{permToOctal(perms[entity])}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-800">{permToSymbol(perms[entity])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ToolCard>
      ) : (
        <ToolCard title="Octal Input">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={octalInput}
              onChange={(e) => applyOctal(e.target.value)}
              maxLength={3}
              placeholder="755"
              className={`w-24 px-3 py-2.5 text-2xl font-mono text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${!/^[0-7]{3}$/.test(octalInput) && octalInput ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
            />
            <div>
              <p className="text-sm font-mono text-slate-800">{symbolic}</p>
              <p className="text-xs text-slate-400">symbolic notation</p>
            </div>
          </div>
        </ToolCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ToolCard title="chmod (octal)" action={<CopyButton value={chmodCmd} />}>
          <code className="text-sm font-mono text-slate-800 bg-slate-100 px-3 py-1.5 rounded break-all">{chmodCmd}</code>
        </ToolCard>
        <ToolCard title="chmod (symbolic)" action={<CopyButton value={chmodSymCmd} />}>
          <code className="text-sm font-mono text-slate-800 bg-slate-100 px-3 py-1.5 rounded break-all">{chmodSymCmd}</code>
        </ToolCard>
      </div>

      <ToolCard title="Permission Meaning">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {ENTITIES.map((entity) => {
            const p = perms[entity];
            const bits: string[] = [];
            if (p.read) bits.push('read');
            if (p.write) bits.push('write');
            if (p.execute) bits.push('execute');
            return (
              <div key={entity} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="font-semibold text-slate-700 mb-1">{entity}</div>
                <div className="font-mono text-xs text-emerald-700 mb-1">{permToSymbol(p)}</div>
                <div className="text-xs text-slate-500">{bits.length ? bits.join(', ') : 'no access'}</div>
              </div>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}
