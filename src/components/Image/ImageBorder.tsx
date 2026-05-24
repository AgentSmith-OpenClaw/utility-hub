'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type BorderStyle = 'solid' | 'double' | 'gradient';
type OutputFormat = 'original' | 'jpeg' | 'png';

const PRESETS: Array<{ label: string; width: number; color: string; style: BorderStyle; gradientColor2?: string }> = [
  { label: 'Thin black', width: 2, color: '#000000', style: 'solid' },
  { label: 'Photo frame', width: 20, color: '#ffffff', style: 'solid' },
  { label: 'Polaroid', width: 30, color: '#ffffff', style: 'solid' },
];

export default function ImageBorder() {
  const [file, setFile] = useState<File | null>(null);
  const [borderWidth, setBorderWidth] = useState(10);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('solid');
  const [gradientColor2, setGradientColor2] = useState('#ffffff');
  const [padding, setPadding] = useState(0);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original');
  const [output, setOutput] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFiles = useCallback((incoming: File[]) => {
    if (incoming.length === 0) return;
    const f = incoming[0];
    setFile(f);
    setOutput(null);
    setPreviewUrl(null);
    setError(null);
    setStatus('idle');
    imgRef.current = null;

    loadImage(f)
      .then((img) => {
        imgRef.current = img;
      })
      .catch(() => {
        setError('Failed to load image');
        setStatus('error');
      });
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setBorderWidth(10);
    setBorderColor('#000000');
    setBorderStyle('solid');
    setGradientColor2('#ffffff');
    setPadding(0);
    setOutputFormat('original');
    setOutput(null);
    setPreviewUrl(null);
    setError(null);
    setStatus('idle');
    imgRef.current = null;
  }, []);

  const getOutputMimeType = useCallback((): string => {
    if (outputFormat === 'jpeg') return 'image/jpeg';
    if (outputFormat === 'png') return 'image/png';
    if (!file) return 'image/png';
    return file.type && file.type.startsWith('image/') ? file.type : 'image/png';
  }, [file, outputFormat]);

  const getOutputFileName = useCallback((): string => {
    if (!file) return 'image-with-border.png';
    const dotIdx = file.name.lastIndexOf('.');
    const baseName = dotIdx > 0 ? file.name.slice(0, dotIdx) : file.name;
    const ext = outputFormat === 'jpeg' ? '.jpg' : outputFormat === 'png' ? '.png' : (dotIdx > 0 ? file.name.slice(dotIdx) : '.png');
    return `${baseName}-border${ext}`;
  }, [file, outputFormat]);

  const renderBorder = useCallback((): HTMLCanvasElement | null => {
    const img = imgRef.current;
    if (!img) return null;

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const totalBorder = borderWidth + padding;
    const canvasW = imgW + 2 * totalBorder;
    const canvasH = imgH + 2 * totalBorder;

    const canvas = document.createElement('canvas');
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d')!;

    if (borderStyle === 'solid') {
      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvasW, canvasH);
    } else if (borderStyle === 'double') {
      const innerW = borderWidth * 0.4;
      const outerW = borderWidth * 0.6;

      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvasW, canvasH);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(
        outerW,
        outerW,
        canvasW - 2 * outerW,
        canvasH - 2 * outerW,
      );

      ctx.fillStyle = borderColor;
      ctx.fillRect(
        outerW + innerW,
        outerW + innerW,
        canvasW - 2 * (outerW + innerW),
        canvasH - 2 * (outerW + innerW),
      );
    } else if (borderStyle === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvasW, canvasH);
      gradient.addColorStop(0, borderColor);
      gradient.addColorStop(1, gradientColor2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    ctx.drawImage(img, totalBorder, totalBorder);
    return canvas;
  }, [borderWidth, borderColor, borderStyle, gradientColor2, padding]);

  useEffect(() => {
    if (!file || !imgRef.current) {
      setPreviewUrl(null);
      return;
    }
    const canvas = renderBorder();
    if (canvas) {
      setPreviewUrl(canvas.toDataURL('image/png'));
    }
  }, [file, renderBorder]);

  const handleApply = useCallback(async () => {
    if (!file || !imgRef.current) return;
    setStatus('processing');
    setError(null);

    try {
      const canvas = renderBorder();
      if (!canvas) throw new Error('Failed to render border');

      const mimeType = getOutputMimeType();
      const blob = await canvasToBlob(canvas, mimeType, 0.92);
      setOutput(blob);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply border');
      setStatus('error');
    }
  }, [file, renderBorder, getOutputMimeType]);

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[number]) => {
      setBorderWidth(preset.width);
      setBorderColor(preset.color);
      setBorderStyle(preset.style);
      if (preset.gradientColor2) setGradientColor2(preset.gradientColor2);
    },
    [],
  );

  const canApply = file !== null && status === 'idle';

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {!file ? (
        <ToolCard title="Upload image">
          <ImageDropzone
            onFiles={handleFiles}
            label="Drop an image to add a border — JPG, PNG, WebP, GIF, BMP, AVIF"
          />
        </ToolCard>
      ) : (
        <>
          <ToolCard
            title="Image loaded"
            action={
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
              >
                New image
              </button>
            }
          >
            <ImagePreview file={file} />
          </ToolCard>

          <ToolCard title="Quick presets">
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </ToolCard>

          <ToolCard title="Border settings">
            <div className="space-y-5">
              <div>
                <label htmlFor="border-width" className="block text-sm font-medium text-slate-700 mb-1">
                  Border width: {borderWidth}px
                </label>
                <input
                  id="border-width"
                  type="range"
                  min={1}
                  max={100}
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1px</span>
                  <span>100px</span>
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-700 mb-2">Border style</span>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                  {(['solid', 'double', 'gradient'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBorderStyle(s)}
                      className={`flex-1 px-4 py-2.5 min-h-[44px] text-sm font-semibold transition-colors ${
                        borderStyle === s
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="border-color" className="text-sm font-medium text-slate-700">
                  Border color
                </label>
                <input
                  id="border-color"
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-mono">{borderColor}</span>
              </div>

              {borderStyle === 'gradient' && (
                <div className="flex items-center gap-4">
                  <label htmlFor="gradient-color-2" className="text-sm font-medium text-slate-700">
                    Gradient color 2
                  </label>
                  <input
                    id="gradient-color-2"
                    type="color"
                    value={gradientColor2}
                    onChange={(e) => setGradientColor2(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 font-mono">{gradientColor2}</span>
                </div>
              )}

              <div>
                <label htmlFor="padding" className="block text-sm font-medium text-slate-700 mb-1">
                  Padding: {padding}px
                </label>
                <input
                  id="padding"
                  type="range"
                  min={0}
                  max={50}
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0px</span>
                  <span>50px</span>
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-700 mb-2">Output format</span>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                  {(['original', 'jpeg', 'png'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setOutputFormat(f)}
                      className={`flex-1 px-4 py-2.5 min-h-[44px] text-sm font-semibold transition-colors ${
                        outputFormat === f
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {f === 'original' ? 'Original' : f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ToolCard>

          {previewUrl && (
            <ToolCard title="Preview">
              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                <img src={previewUrl} alt="Border preview" className="max-w-full h-auto" />
              </div>
            </ToolCard>
          )}

          {status === 'done' && output ? (
            <ToolCard title="Border applied" action={
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
              >
                Start over
              </button>
            }>
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <span aria-hidden="true">✓</span>
                  <span>Border applied successfully</span>
                </div>
                <ImageDownloadButton blob={output} fileName={getOutputFileName()} />
              </div>
            </ToolCard>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              disabled={!canApply}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                canApply
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              🖼️ Apply &amp; Download
            </button>
          )}

          {status === 'processing' && (
            <ToolCard title="Applying border…">
              <div className="flex items-center gap-3 py-4">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-slate-600">Applying border to image…</span>
              </div>
            </ToolCard>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              <span aria-hidden="true">⚠️</span>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
