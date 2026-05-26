import React, { useCallback, useMemo, useState } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

type GradientType = 'linear' | 'radial' | 'conic';

interface ColorStop {
  color: string;
  position: number;
}

const PRESETS: { name: string; stops: ColorStop[]; type: GradientType; angle: number }[] = [
  { name: 'Sunset', stops: [{ color: '#f97316', position: 0 }, { color: '#ef4444', position: 50 }, { color: '#a855f7', position: 100 }], type: 'linear', angle: 135 },
  { name: 'Ocean', stops: [{ color: '#0ea5e9', position: 0 }, { color: '#6366f1', position: 100 }], type: 'linear', angle: 135 },
  { name: 'Forest', stops: [{ color: '#10b981', position: 0 }, { color: '#065f46', position: 100 }], type: 'linear', angle: 180 },
  { name: 'Berry', stops: [{ color: '#ec4899', position: 0 }, { color: '#7c3aed', position: 50 }, { color: '#3b82f6', position: 100 }], type: 'linear', angle: 135 },
  { name: 'Warm Flame', stops: [{ color: '#f59e0b', position: 0 }, { color: '#ef4444', position: 100 }], type: 'linear', angle: 90 },
  { name: 'Cosmic', stops: [{ color: '#1e1b4b', position: 0 }, { color: '#7c3aed', position: 40 }, { color: '#ec4899', position: 100 }], type: 'radial', angle: 0 },
  { name: 'Peach', stops: [{ color: '#fbbf24', position: 0 }, { color: '#f472b6', position: 100 }], type: 'linear', angle: 45 },
  { name: 'Mint', stops: [{ color: '#d1fae5', position: 0 }, { color: '#6ee7b7', position: 50 }, { color: '#059669', position: 100 }], type: 'linear', angle: 180 },
];

function buildGradientCSS(type: GradientType, angle: number, stops: ColorStop[], radialShape: string): { standard: string; webkit: string; moz: string } {
  const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
  let standard: string;
  let webkit: string;
  let moz: string;

  if (type === 'linear') {
    standard = `linear-gradient(${angle}deg, ${stopsStr})`;
    webkit = `-webkit-linear-gradient(${angle}deg, ${stopsStr})`;
    moz = `-moz-linear-gradient(${angle}deg, ${stopsStr})`;
  } else if (type === 'radial') {
    standard = `radial-gradient(${radialShape}, ${stopsStr})`;
    webkit = `-webkit-radial-gradient(${radialShape}, ${stopsStr})`;
    moz = `-moz-radial-gradient(${radialShape}, ${stopsStr})`;
  } else {
    standard = `conic-gradient(from ${angle}deg, ${stopsStr})`;
    webkit = `-webkit-conic-gradient(from ${angle}deg, ${stopsStr})`;
    moz = standard;
  }

  return { standard, webkit, moz };
}

export default function GradientGenerator() {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#6366f1', position: 0 },
    { color: '#ec4899', position: 100 },
  ]);
  const [radialShape, setRadialShape] = useState('circle');
  const [cssFormat, setCssFormat] = useState<'standard' | 'full' | 'tailwind'>('standard');

  const addStop = () => {
    const lastPos = stops[stops.length - 1]?.position ?? 50;
    const newPos = Math.min(lastPos + 10, 100);
    setStops([...stops, { color: '#8b5cf6', position: newPos }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, field: keyof ColorStop, value: string | number) => {
    setStops(stops.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const loadPreset = (preset: typeof PRESETS[number]) => {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((s) => ({ ...s })));
  };

  const css = useMemo(() => buildGradientCSS(type, angle, stops, radialShape), [type, angle, stops, radialShape]);

  const fullCss = useMemo(() => {
    if (cssFormat === 'full') {
      return `background: ${css.standard};\nbackground: ${css.webkit};\nbackground: ${css.moz};`;
    }
    if (cssFormat === 'tailwind') {
      return `style={{ background: '${css.standard}' }}`;
    }
    return `background: ${css.standard};`;
  }, [css, cssFormat]);

  const copyText = useMemo(() => {
    if (cssFormat === 'full') {
      return `background: ${css.standard};\nbackground: ${css.webkit};\nbackground: ${css.moz};`;
    }
    return `background: ${css.standard};`;
  }, [css, cssFormat]);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ToolCard title="Gradient Type">
            <div className="flex gap-2">
              {(['linear', 'radial', 'conic'] as GradientType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    type === t ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </ToolCard>

          {type === 'linear' && (
            <ToolCard title="Angle">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="flex-1 accent-teal-600"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={angle}
                    onChange={(e) => setAngle(Math.min(360, Math.max(0, Number(e.target.value))))}
                    className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-lg text-center"
                  />
                  <span className="text-sm text-slate-500">deg</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                  <button key={a} onClick={() => setAngle(a)} className={`px-2.5 py-1 text-xs rounded-md ${angle === a ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {a}°
                  </button>
                ))}
              </div>
            </ToolCard>
          )}

          {type === 'radial' && (
            <ToolCard title="Shape">
              <div className="flex gap-2">
                {['circle', 'ellipse'].map((s) => (
                  <button key={s} onClick={() => setRadialShape(s)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${radialShape === s ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </ToolCard>
          )}

          {type === 'conic' && (
            <ToolCard title="Starting Angle">
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="flex-1 accent-teal-600" />
                <div className="flex items-center gap-1">
                  <input type="number" value={angle} onChange={(e) => setAngle(Math.min(360, Math.max(0, Number(e.target.value))))} className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-lg text-center" />
                  <span className="text-sm text-slate-500">deg</span>
                </div>
              </div>
            </ToolCard>
          )}

          <ToolCard title="Color Stops">
            <div className="space-y-3">
              {stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(i, 'color', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateStop(i, 'color', e.target.value)}
                    className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg font-mono"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => updateStop(i, 'position', Number(e.target.value))}
                    className="flex-1 accent-teal-600"
                  />
                  <span className="text-sm text-slate-500 w-10 text-right">{stop.position}%</span>
                  {stops.length > 2 && (
                    <button onClick={() => removeStop(i)} className="text-slate-400 hover:text-red-500 text-sm">×</button>
                  )}
                </div>
              ))}
              {stops.length < 6 && (
                <button onClick={addStop} className="w-full py-2 text-sm text-teal-600 border border-dashed border-teal-300 rounded-lg hover:bg-teal-50 transition-colors">
                  + Add Color Stop
                </button>
              )}
            </div>
          </ToolCard>
        </div>

        <div className="space-y-5">
          <ToolCard title="Preview">
            <div
              className="w-full aspect-square max-h-72 rounded-lg border border-slate-200"
              style={{ background: css.standard }}
            />
          </ToolCard>

          <ToolCard title="CSS Output" action={<CopyButton value={copyText} />}>
            <div className="flex gap-2 mb-3">
              {(['standard', 'full', 'tailwind'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setCssFormat(f)}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${cssFormat === f ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {f === 'standard' ? 'CSS' : f === 'full' ? 'Full' : 'Tailwind'}
                </button>
              ))}
            </div>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre-wrap">
              {fullCss}
            </pre>
          </ToolCard>
        </div>
      </div>

      <ToolCard title="Presets">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const preview = buildGradientCSS(preset.type, preset.angle, preset.stops, 'circle');
            return (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset)}
                className="group flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all"
              >
                <div className="w-full aspect-video rounded-lg" style={{ background: preview.standard }} />
                <span className="text-xs font-medium text-slate-600 group-hover:text-teal-700">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </ToolCard>
    </div>
  );
}