import React, { useState, useMemo } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

function simplifyRatio(w: number, h: number): string {
  if (!w || !h) return '—';
  const d = gcd(Math.round(w), Math.round(h));
  return `${Math.round(w) / d}:${Math.round(h) / d}`;
}

const PRESETS = [
  { label: '16:9 (HD/4K video)', w: 16, h: 9 },
  { label: '4:3 (Old TV / iPad)', w: 4, h: 3 },
  { label: '1:1 (Square)', w: 1, h: 1 },
  { label: '21:9 (Ultrawide)', w: 21, h: 9 },
  { label: '3:2 (DSLR sensor)', w: 3, h: 2 },
  { label: '4:5 (Portrait social)', w: 4, h: 5 },
  { label: '9:16 (Stories/Reels)', w: 9, h: 16 },
  { label: '2.39:1 (Cinema)', w: 2.39, h: 1 },
];

export default function AspectRatio() {
  const [rw, setRw] = useState(16);
  const [rh, setRh] = useState(9);
  const [lockSide, setLockSide] = useState<'w' | 'h'>('w');
  const [knownW, setKnownW] = useState(1920);
  const [knownH, setKnownH] = useState(1080);
  const [imgW, setImgW] = useState(1920);
  const [imgH, setImgH] = useState(1080);
  const [targetW, setTargetW] = useState(800);
  const [targetH, setTargetH] = useState(450);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  const computedFromW = useMemo(() => {
    if (!rw || !rh || !knownW) return 0;
    return Math.round(knownW * rh / rw);
  }, [rw, rh, knownW]);

  const computedFromH = useMemo(() => {
    if (!rw || !rh || !knownH) return 0;
    return Math.round(knownH * rw / rh);
  }, [rw, rh, knownH]);

  const fitted = useMemo(() => {
    if (!imgW || !imgH || !targetW || !targetH) return null;
    const srcRatio = imgW / imgH;
    const dstRatio = targetW / targetH;
    if (fitMode === 'contain') {
      if (srcRatio > dstRatio) return { w: targetW, h: Math.round(targetW / srcRatio) };
      return { w: Math.round(targetH * srcRatio), h: targetH };
    } else {
      if (srcRatio > dstRatio) return { w: Math.round(targetH * srcRatio), h: targetH };
      return { w: targetW, h: Math.round(targetW / srcRatio) };
    }
  }, [imgW, imgH, targetW, targetH, fitMode]);

  const detectedRatio = simplifyRatio(imgW, imgH);
  const selectedRatio = simplifyRatio(rw, rh);

  return (
    <div className="space-y-5">
      <ToolCard title="Ratio Presets">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => { setRw(p.w); setRh(p.h); }} className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${rw === p.w && rh === p.h ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-xs text-slate-500">Custom ratio:</label>
          <input type="number" value={rw} onChange={(e) => setRw(+e.target.value)} className="w-16 px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" min={0.1} step={0.1} />
          <span className="text-slate-400">:</span>
          <input type="number" value={rh} onChange={(e) => setRh(+e.target.value)} className="w-16 px-2 py-1.5 text-sm text-center border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" min={0.1} step={0.1} />
          <span className="text-sm font-mono text-emerald-700 font-bold">= {selectedRatio}</span>
        </div>
      </ToolCard>

      <ToolCard title="Calculate Missing Dimension">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Width (px)</label>
              <input type="number" value={knownW} onChange={(e) => setKnownW(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
              <p className="text-xs text-slate-400 mt-1">→ Height: <span className="font-mono font-semibold text-emerald-700">{computedFromW} px</span></p>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Height (px)</label>
              <input type="number" value={knownH} onChange={(e) => setKnownH(+e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
              <p className="text-xs text-slate-400 mt-1">→ Width: <span className="font-mono font-semibold text-emerald-700">{computedFromH} px</span></p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Using ratio <strong>{selectedRatio}</strong></p>
        </div>
      </ToolCard>

      <ToolCard title="Image Fit Calculator">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Source dimensions</label>
              <div className="flex items-center gap-2">
                <input type="number" value={imgW} onChange={(e) => setImgW(+e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                <span className="text-slate-400 text-sm">×</span>
                <input type="number" value={imgH} onChange={(e) => setImgH(+e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Ratio: {detectedRatio}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Target box</label>
              <div className="flex items-center gap-2">
                <input type="number" value={targetW} onChange={(e) => setTargetW(+e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
                <span className="text-slate-400 text-sm">×</span>
                <input type="number" value={targetH} onChange={(e) => setTargetH(+e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {(['contain', 'cover'] as const).map((m) => (
              <button key={m} onClick={() => setFitMode(m)} className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors capitalize ${fitMode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}>
                {m} {m === 'contain' ? '(letterbox)' : '(crop)'}
              </button>
            ))}
          </div>
          {fitted && (
            <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
              <span className="text-sm text-slate-500">{fitMode === 'contain' ? 'Fits inside' : 'Fills'} target as:</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{fitted.w} × {fitted.h}</span>
              <CopyButton value={`${fitted.w}x${fitted.h}`} />
            </div>
          )}
        </div>
      </ToolCard>
    </div>
  );
}
