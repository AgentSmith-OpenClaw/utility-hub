'use client';

import React, { useState, useCallback, useRef } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'processing' | 'done' | 'error';
type BgMode = 'transparent' | 'white' | 'custom';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function changeExtension(filename: string): string {
  const dot = filename.lastIndexOf('.');
  if (dot === -1) return `${filename}.png`;
  return `${filename.slice(0, dot)}.png`;
}

function parseViewBox(svgText: string): { width: number; height: number } | null {
  const viewBoxMatch = svgText.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/\s+/);
    if (parts.length === 4) {
      const w = parseFloat(parts[2]);
      const h = parseFloat(parts[3]);
      if (w > 0 && h > 0) return { width: w, height: h };
    }
  }
  const widthMatch = svgText.match(/<svg[^>]*\s+width\s*=\s*["'](\d+)(?:px)?["']/i);
  const heightMatch = svgText.match(/<svg[^>]*\s+height\s*=\s*["'](\d+)(?:px)?["']/i);
  if (widthMatch && heightMatch) {
    const w = parseFloat(widthMatch[1]);
    const h = parseFloat(heightMatch[1]);
    if (w > 0 && h > 0) return { width: w, height: h };
  }
  return null;
}

const SCALE_PRESETS = [1, 2, 3, 4] as const;

export default function SvgToPng() {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [svgText, setSvgText] = useState<string>('');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [bgMode, setBgMode] = useState<BgMode>('transparent');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const originalDimensions = useRef<{ width: number; height: number } | null>(null);

  const handleFiles = useCallback(async (incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setFile(f);
    setOutput(null);
    setError(null);
    setStatus('idle');
    setScale(1);
    setBgMode('transparent');
    setBgColor('#ffffff');

    try {
      const text = await f.text();
      setSvgText(text);
      const dims = parseViewBox(text);
      if (dims) {
        originalDimensions.current = dims;
        setWidth(Math.round(dims.width));
        setHeight(Math.round(dims.height));
        setLockRatio(true);
        setFileName(changeExtension(f.name));
      } else {
        const url = URL.createObjectURL(f);
        const img = new Image();
        img.onload = () => {
          originalDimensions.current = { width: img.naturalWidth, height: img.naturalHeight };
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
          setLockRatio(true);
          setFileName(changeExtension(f.name));
          URL.revokeObjectURL(url);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          setWidth(0);
          setHeight(0);
          setFileName(changeExtension(f.name));
          setError('Could not determine SVG dimensions — check that the file is valid');
        };
        img.src = url;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to read SVG file';
      setError(msg);
      setStatus('error');
    }
  }, []);

  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth);
    if (lockRatio && originalDimensions.current) {
      const ratio = originalDimensions.current.width / originalDimensions.current.height;
      setHeight(Math.max(1, Math.round(newWidth / ratio)));
    }
  }, [lockRatio]);

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight);
    if (lockRatio && originalDimensions.current) {
      const ratio = originalDimensions.current.width / originalDimensions.current.height;
      setWidth(Math.max(1, Math.round(newHeight * ratio)));
    }
  }, [lockRatio]);

  const applyScale = useCallback((newScale: number) => {
    setScale(newScale);
    if (originalDimensions.current) {
      const origW = originalDimensions.current.width;
      const origH = originalDimensions.current.height;
      setWidth(Math.max(1, Math.round(origW * newScale)));
      setHeight(Math.max(1, Math.round(origH * newScale)));
    }
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || !svgText || width <= 0 || height <= 0) return;
    setStatus('processing');
    setError(null);

    try {
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const imageEl = new Image();
        imageEl.onload = () => resolve(imageEl);
        imageEl.onerror = () => reject(new Error('Failed to render SVG — check the file for syntax errors'));
        imageEl.src = svgUrl;
      });

      URL.revokeObjectURL(svgUrl);

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      const ctx = canvas.getContext('2d')!;

      if (bgMode !== 'transparent') {
        ctx.fillStyle = bgMode === 'white' ? '#ffffff' : bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToBlob(canvas, 'image/png');
      setOutput(blob);
      setFileName(changeExtension(file.name));
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      setError(msg);
      setStatus('error');
    }
  }, [file, svgText, width, height, bgMode, bgColor]);

  const handleReset = useCallback(() => {
    setFile(null);
    setSvgText('');
    setWidth(0);
    setHeight(0);
    setScale(1);
    setLockRatio(true);
    setBgMode('transparent');
    setBgColor('#ffffff');
    setOutput(null);
    setError(null);
    setStatus('idle');
    setFileName('');
    originalDimensions.current = null;
  }, []);

  const isBusy = status === 'processing';
  const canConvert = status === 'idle' && file !== null && width > 0 && height > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <ImageTrustBadge />

      {status === 'done' && output ? (
        <ToolCard title="Conversion complete" action={
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
          >
            Start over
          </button>
        }>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Original</div>
                <div className="text-sm font-medium text-slate-800 mt-1">
                  {originalDimensions.current
                    ? `${originalDimensions.current.width} × ${originalDimensions.current.height}`
                    : '–'}
                </div>
                <div className="text-sm text-slate-500">{file ? formatBytes(file.size) : '–'}</div>
                <span className="inline-flex mt-1.5 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-sky-50 text-sky-700 border border-sky-200/60">
                  SVG
                </span>
              </div>
              <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3">
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Converted</div>
                <div className="text-sm font-medium text-slate-800 mt-1">
                  {width} × {height}
                </div>
                <div className="text-sm text-slate-500">{formatBytes(output.size)}</div>
                <span className="inline-flex mt-1.5 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  PNG
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label htmlFor="svg-filename" className="sr-only">Filename</label>
                <input
                  id="svg-filename"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                />
              </div>
              <ImageDownloadButton blob={output} fileName={fileName} />
            </div>
          </div>
        </ToolCard>
      ) : (
        <>
          {file && svgText ? (
            <>
              <ToolCard title="SVG loaded" action={
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                >
                  Remove
                </button>
              }>
                <ImagePreview file={file} dimensions={originalDimensions.current ?? undefined} />

                {file.size > 25 * 1024 * 1024 && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <span aria-hidden="true">⚠️</span>
                    Large SVG — rendering may be slow on mobile
                  </div>
                )}
              </ToolCard>

              <ToolCard title="Dimensions">
                <div className="space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label htmlFor="svg-width" className="block text-sm font-medium text-slate-700 mb-1">Width (px)</label>
                      <input
                        id="svg-width"
                        type="number"
                        min={1}
                        max={10000}
                        value={width || ''}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v) && v > 0) handleWidthChange(v);
                          else if (e.target.value === '') setWidth(0);
                        }}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                        disabled={isBusy}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setLockRatio(!lockRatio)}
                      className={`flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border transition-colors min-w-[44px] min-h-[44px] ${
                        lockRatio
                          ? 'border-sky-300 bg-sky-50 text-sky-600 hover:bg-sky-100'
                          : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'
                      }`}
                      aria-label={lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                    >
                      {lockRatio ? '🔗' : '🔓'}
                    </button>
                    <div className="flex-1">
                      <label htmlFor="svg-height" className="block text-sm font-medium text-slate-700 mb-1">Height (px)</label>
                      <input
                        id="svg-height"
                        type="number"
                        min={1}
                        max={10000}
                        value={height || ''}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v) && v > 0) handleHeightChange(v);
                          else if (e.target.value === '') setHeight(0);
                        }}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                        disabled={isBusy}
                      />
                    </div>
                  </div>
                  {lockRatio && originalDimensions.current && (
                    <p className="text-xs text-slate-500">
                      Aspect ratio locked — {originalDimensions.current.width}:{originalDimensions.current.height}
                    </p>
                  )}

                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Scale</p>
                    <div className="flex gap-2">
                      {SCALE_PRESETS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => applyScale(s)}
                          className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                            scale === s
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          disabled={isBusy}
                        >
                          {s}×
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ToolCard>

              <ToolCard title="Background">
                <div className="space-y-4">
                  <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setBgMode('transparent')}
                      className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-md text-sm font-semibold transition-colors ${
                        bgMode === 'transparent'
                          ? 'bg-white text-sky-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      disabled={isBusy}
                    >
                      Transparent
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgMode('white')}
                      className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-md text-sm font-semibold transition-colors ${
                        bgMode === 'white'
                          ? 'bg-white text-sky-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      disabled={isBusy}
                    >
                      White
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgMode('custom')}
                      className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-md text-sm font-semibold transition-colors ${
                        bgMode === 'custom'
                          ? 'bg-white text-sky-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      disabled={isBusy}
                    >
                      Custom
                    </button>
                  </div>

                  {bgMode === 'custom' && (
                    <div className="flex items-center gap-3">
                      <label htmlFor="bg-color" className="text-sm font-medium text-slate-700">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          id="bg-color"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                          disabled={isBusy}
                        />
                        <input
                          type="text"
                          value={bgColor}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setBgColor(v);
                          }}
                          className="w-24 px-2 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                          disabled={isBusy}
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    {bgMode === 'transparent'
                      ? 'PNG preserves alpha-channel transparency. Ideal for logos, icons, and graphics that overlay other content.'
                      : bgMode === 'white'
                      ? 'Fills the canvas with solid white before rendering. Useful when you need an opaque PNG with a fixed background.'
                      : 'Fills the canvas with your chosen color. Useful when matching a specific design background.'}
                  </p>
                </div>
              </ToolCard>
            </>
          ) : (
            <ToolCard title="Upload SVG">
              <ImageDropzone
                onFiles={handleFiles}
                accept="image/svg+xml,.svg"
                label="SVG files only — up to 50 MB"
              />
            </ToolCard>
          )}

          {status === 'idle' && file && svgText && (
            <button
              type="button"
              onClick={handleConvert}
              disabled={!canConvert}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                canConvert
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              📐 Convert to PNG
            </button>
          )}

          {status === 'processing' && (
            <ToolCard title="Converting…">
              <div className="flex items-center gap-3 py-4">
                <svg className="animate-spin h-5 w-5 text-sky-600 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-slate-600">
                  Rendering SVG to {width} × {height} pixels…
                </span>
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
