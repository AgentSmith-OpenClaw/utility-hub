import React, { useState, useCallback } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

interface ShadowLayer {
  id:       number;
  offsetX:  number;
  offsetY:  number;
  blur:     number;
  spread:   number;
  color:    string;
  opacity:  number;
  inset:    boolean;
}

const defaultLayer = (): ShadowLayer => ({
  id: Date.now(),
  offsetX: 4, offsetY: 4, blur: 12, spread: 0,
  color: '#000000', opacity: 20, inset: false,
});

const PRESETS: { label: string; layers: Omit<ShadowLayer, 'id'>[] }[] = [
  { label: 'Soft card', layers: [{ offsetX: 0, offsetY: 4, blur: 24, spread: -4, color: '#000000', opacity: 15, inset: false }] },
  { label: 'Material 2', layers: [{ offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: '#000000', opacity: 14, inset: false }, { offsetX: 0, offsetY: 4, blur: 16, spread: 0, color: '#000000', opacity: 12, inset: false }] },
  { label: 'Hard offset', layers: [{ offsetX: 6, offsetY: 6, blur: 0, spread: 0, color: '#000000', opacity: 100, inset: false }] },
  { label: 'Glow blue',  layers: [{ offsetX: 0, offsetY: 0, blur: 20, spread: 4, color: '#3b82f6', opacity: 60, inset: false }] },
  { label: 'Neumorphic', layers: [{ offsetX: 6, offsetY: 6, blur: 12, spread: 0, color: '#bebebe', opacity: 100, inset: false }, { offsetX: -6, offsetY: -6, blur: 12, spread: 0, color: '#ffffff', opacity: 100, inset: false }] },
  { label: 'Inner press', layers: [{ offsetX: 2, offsetY: 2, blur: 6, spread: 0, color: '#000000', opacity: 20, inset: true }, { offsetX: -2, offsetY: -2, blur: 6, spread: 0, color: '#ffffff', opacity: 60, inset: true }] },
];

function layerToCss(l: ShadowLayer): string {
  const a = Math.round(l.opacity * 2.55).toString(16).padStart(2, '0');
  const color = l.color + a;
  return `${l.inset ? 'inset ' : ''}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${color}`;
}

function layersToProperty(layers: ShadowLayer[]): string {
  return layers.map(layerToCss).join(',\n  ');
}

function Slider({ label, min, max, value, onChange, unit = '' }: {
  label: string; min: number; max: number; value: number; onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <span className="text-xs font-mono text-slate-500">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 accent-emerald-600 cursor-pointer" />
    </div>
  );
}

export default function BoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultLayer()]);
  const [active, setActive] = useState<number>(0);

  const update = useCallback((idx: number, partial: Partial<ShadowLayer>) => {
    setLayers((prev) => prev.map((l, i) => i === idx ? { ...l, ...partial } : l));
  }, []);

  const addLayer = () => {
    const newLayer = defaultLayer();
    setLayers((prev) => [...prev, newLayer]);
    setActive(layers.length);
  };

  const removeLayer = (idx: number) => {
    if (layers.length === 1) return;
    setLayers((prev) => prev.filter((_, i) => i !== idx));
    setActive((a) => Math.max(0, a === idx ? idx - 1 : a > idx ? a - 1 : a));
  };

  const loadPreset = (p: typeof PRESETS[0]) => {
    setLayers(p.layers.map((l) => ({ ...l, id: Date.now() + Math.random() })));
    setActive(0);
  };

  const cssValue = layersToProperty(layers);
  const fullCss = `box-shadow: ${cssValue};`;

  const l = layers[active] || layers[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Preview */}
      <ToolCard title="Preview">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center justify-center bg-slate-100 rounded-lg py-10">
            <div className="w-28 h-28 bg-white rounded-xl" style={{ boxShadow: cssValue }} />
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg border border-slate-200 py-10">
            <button
              className="px-6 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
              style={{ boxShadow: cssValue }}
            >
              Button
            </button>
          </div>
        </div>
      </ToolCard>

      {/* Presets */}
      <ToolCard title="Presets">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => loadPreset(p)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[36px]">
              {p.label}
            </button>
          ))}
        </div>
      </ToolCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Layer list */}
        <ToolCard title="Shadow layers" action={
          <button onClick={addLayer} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 min-h-[36px]">
            + Add layer
          </button>
        }>
          <div className="space-y-2">
            {layers.map((layer, idx) => (
              <div
                key={layer.id}
                onClick={() => setActive(idx)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${active === idx ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                <div className="w-5 h-5 rounded border border-slate-300 shrink-0" style={{ background: layer.color }} />
                <span className="text-sm font-mono text-slate-700 flex-1 truncate">{layerToCss(layer)}</span>
                <button onClick={(e) => { e.stopPropagation(); removeLayer(idx); }}
                  className="text-slate-400 hover:text-rose-500 px-1 shrink-0 min-h-[24px]">✕</button>
              </div>
            ))}
          </div>
        </ToolCard>

        {/* Controls for active layer */}
        <ToolCard title={`Layer ${active + 1} controls`}>
          {l && (
            <div className="space-y-3">
              <Slider label="Offset X" min={-50} max={50} value={l.offsetX} onChange={(v) => update(active, { offsetX: v })} unit="px" />
              <Slider label="Offset Y" min={-50} max={50} value={l.offsetY} onChange={(v) => update(active, { offsetY: v })} unit="px" />
              <Slider label="Blur radius" min={0} max={100} value={l.blur} onChange={(v) => update(active, { blur: v })} unit="px" />
              <Slider label="Spread radius" min={-50} max={50} value={l.spread} onChange={(v) => update(active, { spread: v })} unit="px" />
              <Slider label="Opacity" min={0} max={100} value={l.opacity} onChange={(v) => update(active, { opacity: v })} unit="%" />
              <div className="flex gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={l.color} onChange={(e) => update(active, { color: e.target.value })} className="h-9 w-9 rounded border border-slate-200 cursor-pointer" />
                    <input type="text" value={l.color} onChange={(e) => update(active, { color: e.target.value })} className="w-24 font-mono text-sm px-2 py-1.5 rounded-lg border border-slate-200 outline-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input type="checkbox" checked={l.inset} onChange={(e) => update(active, { inset: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                  <span className="text-sm text-slate-700">inset</span>
                </label>
              </div>
            </div>
          )}
        </ToolCard>
      </div>

      {/* CSS output */}
      <ToolCard title="CSS output" action={<CopyButton value={fullCss} />}>
        <pre className="font-mono text-sm bg-slate-50 rounded-lg border border-slate-200 p-3 whitespace-pre-wrap break-all text-slate-800">{fullCss}</pre>
      </ToolCard>
    </div>
  );
}
