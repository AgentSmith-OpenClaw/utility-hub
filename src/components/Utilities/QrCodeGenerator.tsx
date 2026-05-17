import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { ToolCard, CopyButton } from '../Tools/ToolShell';

type Preset = 'url' | 'text' | 'wifi' | 'email' | 'sms' | 'vcard';
type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

const PRESET_LABELS: Record<Preset, string> = {
  url: 'URL', text: 'Text', wifi: 'Wi-Fi', email: 'Email', sms: 'SMS', vcard: 'vCard',
};

function buildContent(preset: Preset, fields: Record<string, string>): string {
  switch (preset) {
    case 'url':   return fields.url || '';
    case 'text':  return fields.text || '';
    case 'email': return `mailto:${fields.email}?subject=${encodeURIComponent(fields.subject || '')}&body=${encodeURIComponent(fields.body || '')}`;
    case 'sms':   return `SMSTO:${fields.phone}:${fields.message || ''}`;
    case 'wifi':  return `WIFI:T:${fields.security || 'WPA'};S:${fields.ssid || ''};P:${fields.password || ''};;`;
    case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nFN:${fields.name || ''}\nTEL:${fields.phone || ''}\nEMAIL:${fields.email || ''}\nEND:VCARD`;
    default: return '';
  }
}

export default function QrCodeGenerator() {
  const [preset, setPreset] = useState<Preset>('url');
  const [fields, setFields]   = useState<Record<string, string>>({ url: 'https://toolisk.com' });
  const [ecLevel, setEcLevel] = useState<ErrorLevel>('M');
  const [size, setSize]       = useState(256);
  const [fg, setFg]           = useState('#000000');
  const [bg, setBg]           = useState('#ffffff');
  const [dataUrl, setDataUrl] = useState('');
  const [svgStr, setSvgStr]   = useState('');
  const [error, setError]     = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const content = buildContent(preset, fields);

  const generate = useCallback(async () => {
    if (!content.trim()) { setDataUrl(''); setSvgStr(''); return; }
    setError('');
    try {
      const opts: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: ecLevel,
        width: size,
        color: { dark: fg, light: bg },
        margin: 2,
      };
      const url = await QRCode.toDataURL(content, opts);
      setDataUrl(url);
      const svg = await QRCode.toString(content, { ...opts, type: 'svg' } as QRCode.QRCodeToStringOptions);
      setSvgStr(svg);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [content, ecLevel, size, fg, bg]);

  useEffect(() => { generate(); }, [generate]);

  const downloadPng = () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  const downloadSvg = () => {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const setField = (k: string, v: string) => setFields((prev) => ({ ...prev, [k]: v }));

  const renderFields = () => {
    const cls = 'w-full text-sm px-3 py-2.5 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none min-h-[44px]';
    switch (preset) {
      case 'url':   return <input type="url" value={fields.url || ''} onChange={(e) => setField('url', e.target.value)} placeholder="https://example.com" className={cls} />;
      case 'text':  return <textarea value={fields.text || ''} onChange={(e) => setField('text', e.target.value)} placeholder="Enter any text…" rows={4} className={`${cls} min-h-[100px] resize-y`} />;
      case 'email': return (
        <div className="space-y-2">
          <input type="email" value={fields.email || ''} onChange={(e) => setField('email', e.target.value)} placeholder="Email address" className={cls} />
          <input type="text"  value={fields.subject || ''} onChange={(e) => setField('subject', e.target.value)} placeholder="Subject (optional)" className={cls} />
          <textarea value={fields.body || ''} onChange={(e) => setField('body', e.target.value)} placeholder="Body (optional)" rows={2} className={`${cls} min-h-[60px]`} />
        </div>
      );
      case 'sms': return (
        <div className="space-y-2">
          <input type="tel" value={fields.phone || ''} onChange={(e) => setField('phone', e.target.value)} placeholder="Phone number" className={cls} />
          <textarea value={fields.message || ''} onChange={(e) => setField('message', e.target.value)} placeholder="Message (optional)" rows={2} className={`${cls} min-h-[60px]`} />
        </div>
      );
      case 'wifi': return (
        <div className="space-y-2">
          <input type="text" value={fields.ssid || ''} onChange={(e) => setField('ssid', e.target.value)} placeholder="Network name (SSID)" className={cls} />
          <input type="text" value={fields.password || ''} onChange={(e) => setField('password', e.target.value)} placeholder="Password" className={cls} />
          <select value={fields.security || 'WPA'} onChange={(e) => setField('security', e.target.value)} className={cls}>
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None</option>
          </select>
        </div>
      );
      case 'vcard': return (
        <div className="space-y-2">
          <input type="text"  value={fields.name || ''}  onChange={(e) => setField('name', e.target.value)}  placeholder="Full name" className={cls} />
          <input type="tel"   value={fields.phone || ''} onChange={(e) => setField('phone', e.target.value)} placeholder="Phone" className={cls} />
          <input type="email" value={fields.email || ''} onChange={(e) => setField('email', e.target.value)} placeholder="Email" className={cls} />
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 sm:gap-6">
      {/* Left: inputs */}
      <div className="space-y-4">
        {/* Preset picker */}
        <ToolCard title="Content type">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESET_LABELS) as Preset[]).map((p) => (
              <button
                key={p}
                onClick={() => { setPreset(p); setFields({}); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border min-h-[36px] transition-colors ${preset === p ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
              >
                {PRESET_LABELS[p]}
              </button>
            ))}
          </div>
          <div className="mt-3">{renderFields()}</div>
        </ToolCard>

        {/* Options */}
        <ToolCard title="Options">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Error correction</label>
              <select value={ecLevel} onChange={(e) => setEcLevel(e.target.value as ErrorLevel)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-400 outline-none min-h-[44px]">
                <option value="L">L — 7%</option>
                <option value="M">M — 15%</option>
                <option value="Q">Q — 25%</option>
                <option value="H">H — 30%</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Size (px)</label>
              <input type="number" min={64} max={1024} step={64} value={size} onChange={(e) => setSize(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-400 outline-none min-h-[44px]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Foreground</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-10 rounded border border-slate-200 cursor-pointer" />
                <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="flex-1 font-mono text-sm px-2 py-2 rounded-lg border border-slate-200 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Background</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-10 rounded border border-slate-200 cursor-pointer" />
                <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 font-mono text-sm px-2 py-2 rounded-lg border border-slate-200 outline-none" />
              </div>
            </div>
          </div>
        </ToolCard>
      </div>

      {/* Right: preview */}
      <ToolCard title="QR code">
        {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 mb-3">{error}</p>}
        {dataUrl ? (
          <>
            <div className="flex justify-center mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="QR code" width={size} height={size} style={{ maxWidth: '100%', imageRendering: 'pixelated' }} />
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={downloadPng} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 min-h-[44px]">
                Download PNG
              </button>
              <button onClick={downloadSvg} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[44px]">
                Download SVG
              </button>
              <CopyButton value={dataUrl} label="Copy data URL" className="w-full justify-center" />
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm italic text-center py-12">Fill in the form to generate your QR code.</p>
        )}
      </ToolCard>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
