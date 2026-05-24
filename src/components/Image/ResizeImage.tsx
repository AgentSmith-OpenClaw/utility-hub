'use client';

import React, { useState, useCallback, useRef } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';
type Mode = 'pixels' | 'percent';
type OutputFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getOutputMime(originalType: string, format: OutputFormat): string {
  if (format !== 'original') return format;
  if (originalType === 'image/png') return 'image/png';
  if (originalType === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}

function getExtAndName(originalName: string, format: OutputFormat): string {
  const dotIdx = originalName.lastIndexOf('.');
  const baseName = dotIdx > 0 ? originalName.slice(0, dotIdx) : originalName;
  const origExt = dotIdx > 0 ? originalName.slice(dotIdx) : '.jpg';
  const extMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  const ext = format === 'original' ? origExt : (extMap[format] || '.jpg');
  return `${baseName}-resized${ext}`;
}

export default function ResizeImage() {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [mode, setMode] = useState<Mode>('pixels');
  const [percent, setPercent] = useState<number>(100);
  const [format, setFormat] = useState<OutputFormat>('original');
  const [quality, setQuality] = useState<number>(85);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [newDimensions, setNewDimensions] = useState<{ width: number; height: number } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFiles = useCallback((incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setFile(f);
    setOriginalSize(f.size);
    setOutput(null);
    setError(null);
    setStatus('idle');
    setNewDimensions(null);
    setFormat('original');
    setQuality(85);
    setMode('pixels');

    loadImage(f).then((img) => {
      imgRef.current = img;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setDimensions({ width: w, height: h });
      setWidth(w);
      setHeight(h);
      setPercent(100);
      setLockRatio(true);
      setFileName(getExtAndName(f.name, 'original'));
    }).catch(() => {
      setError('Failed to load image');
      setStatus('error');
    });
  }, []);

  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth);
    if (lockRatio && dimensions) {
      const ratio = dimensions.width / dimensions.height;
      setHeight(Math.max(1, Math.round(newWidth / ratio)));
    }
  }, [lockRatio, dimensions]);

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight);
    if (lockRatio && dimensions) {
      const ratio = dimensions.width / dimensions.height;
      setWidth(Math.max(1, Math.round(newHeight * ratio)));
    }
  }, [lockRatio, dimensions]);

  const handlePercentChange = useCallback((newPercent: number) => {
    setPercent(newPercent);
    if (dimensions) {
      setWidth(Math.max(1, Math.round(dimensions.width * newPercent / 100)));
      setHeight(Math.max(1, Math.round(dimensions.height * newPercent / 100)));
    }
  }, [dimensions]);

  const handleModeSwitch = useCallback((newMode: Mode) => {
    setMode(newMode);
    if (newMode === 'percent' && dimensions) {
      const pct = Math.round((width / dimensions.width) * 100);
      setPercent(Math.min(200, Math.max(10, pct)));
    }
  }, [dimensions, width]);

  const handleFormatChange = useCallback((newFormat: OutputFormat) => {
    setFormat(newFormat);
    if (file) {
      setFileName(getExtAndName(file.name, newFormat));
    }
  }, [file]);

  const handleResize = useCallback(async () => {
    if (!file || !dimensions) return;
    setStatus('loading-lib');
    setError(null);

    try {
      const picaFactory = (await import('pica')).default;
      const picaInstance = picaFactory();

      setStatus('processing');

      const img = imgRef.current || await loadImage(file);
      const srcCanvas = drawToCanvas(img);
      const targetWidth = Math.max(1, Math.round(width));
      const targetHeight = Math.max(1, Math.round(height));

      const dstCanvas = document.createElement('canvas');
      dstCanvas.width = targetWidth;
      dstCanvas.height = targetHeight;

      await picaInstance.resize(srcCanvas, dstCanvas, {
        filter: 'lanczos3',
        quality: 3,
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      });

      const mimeType = getOutputMime(file.type, format);
      const qualityFraction = (mimeType === 'image/jpeg' || mimeType === 'image/webp')
        ? quality / 100
        : undefined;

      const blob = await picaInstance.toBlob(dstCanvas, mimeType, qualityFraction);

      setOutput(blob);
      setNewDimensions({ width: targetWidth, height: targetHeight });
      setFileName(getExtAndName(file.name, format));
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Resize failed';
      setError(msg);
      setStatus('error');
    }
  }, [file, dimensions, width, height, format, quality]);

  const handleReset = useCallback(() => {
    setFile(null);
    setDimensions(null);
    setWidth(0);
    setHeight(0);
    setLockRatio(true);
    setPercent(100);
    setMode('pixels');
    setFormat('original');
    setQuality(85);
    setOutput(null);
    setError(null);
    setStatus('idle');
    setFileName('');
    setOriginalSize(0);
    setNewDimensions(null);
    imgRef.current = null;
  }, []);

  const isBusy = status === 'loading-lib' || status === 'processing';
  const canResize = status === 'idle' && file !== null && width > 0 && height > 0;
  const effectiveMime = format === 'original'
    ? (file?.type || 'image/jpeg')
    : format;
  const showQuality = effectiveMime === 'image/jpeg' || effectiveMime === 'image/webp';

  return (
    <div className="space-y-4 sm:space-y-6">
      <ImageTrustBadge />

      {status === 'done' && output ? (
        <ToolCard title="Resize complete" action={
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
          >
            Resize another image
          </button>
        }>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Original</div>
                <div className="text-sm font-medium text-slate-800 mt-1">
                  {dimensions ? `${dimensions.width} × ${dimensions.height}` : '–'}
                </div>
                <div className="text-sm text-slate-500">{formatBytes(originalSize)}</div>
              </div>
              <div className="bg-sky-50 rounded-lg border border-sky-200 p-3">
                <div className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Resized</div>
                <div className="text-sm font-medium text-slate-800 mt-1">
                  {newDimensions ? `${newDimensions.width} × ${newDimensions.height}` : '–'}
                </div>
                <div className="text-sm text-slate-500">{formatBytes(output.size)}</div>
              </div>
            </div>

            {originalSize > 0 && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <span aria-hidden="true">✓</span>
                <span>
                  {output.size < originalSize
                    ? `${Math.round((1 - output.size / originalSize) * 100)}% smaller than original`
                    : output.size > originalSize
                    ? `${Math.round((output.size / originalSize - 1) * 100)}% larger than original`
                    : 'Same file size as original'}
                  {' — '}{newDimensions ? `${newDimensions.width} × ${newDimensions.height} px` : ''}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label htmlFor="resize-filename" className="sr-only">Filename</label>
                <input
                  id="resize-filename"
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
          {file && dimensions ? (
            <>
              <ToolCard title="Image loaded" action={
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                >
                  Remove
                </button>
              }>
                <ImagePreview file={file} dimensions={dimensions} />
              </ToolCard>

              <ToolCard title="Resize mode">
                <div className="space-y-4">
                  <div className="flex rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                    {(['pixels', 'percent'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleModeSwitch(m)}
                        className={`flex-1 px-4 py-2.5 min-h-[44px] text-sm font-semibold transition-colors ${
                          mode === m
                            ? 'bg-sky-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {m === 'pixels' ? 'Pixels' : 'Percent'}
                      </button>
                    ))}
                  </div>

                  {mode === 'pixels' && (
                    <div className="space-y-3">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label htmlFor="resize-width" className="block text-sm font-medium text-slate-700 mb-1">Width (px)</label>
                          <input
                            id="resize-width"
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
                          title={lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                        >
                          {lockRatio ? '🔗' : '🔓'}
                        </button>
                        <div className="flex-1">
                          <label htmlFor="resize-height" className="block text-sm font-medium text-slate-700 mb-1">Height (px)</label>
                          <input
                            id="resize-height"
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
                      {lockRatio && (
                        <p className="text-xs text-slate-500">
                          Aspect ratio locked — {dimensions.width}:{dimensions.height}
                        </p>
                      )}
                    </div>
                  )}

                  {mode === 'percent' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label htmlFor="percent-slider" className="text-sm font-medium text-slate-700 whitespace-nowrap">Scale</label>
                        <input
                          id="percent-slider"
                          type="range"
                          min={10}
                          max={200}
                          value={percent}
                          onChange={(e) => handlePercentChange(Number(e.target.value))}
                          className="flex-1 accent-sky-600"
                          disabled={isBusy}
                        />
                        <span className="text-sm font-bold text-slate-800 tabular-nums w-14 text-right">{percent}%</span>
                      </div>
                      <div className="flex gap-2">
                        {([50, 75, 100, 150, 200] as const).map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handlePercentChange(preset)}
                            className={`flex-1 px-2 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                              percent === preset
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            disabled={isBusy}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Result: {Math.round(dimensions.width * percent / 100)} × {Math.round(dimensions.height * percent / 100)} px
                      </p>
                    </div>
                  )}
                </div>
              </ToolCard>

              <ToolCard title="Output format">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="format-select" className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                    <select
                      id="format-select"
                      value={format}
                      onChange={(e) => handleFormatChange(e.target.value as OutputFormat)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                      disabled={isBusy}
                    >
                      <option value="original">
                        Original ({file.type ? file.type.split('/')[1].toUpperCase() : 'JPEG'})
                      </option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                      <option value="image/webp">WebP</option>
                    </select>
                  </div>

                  {showQuality && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="quality-slider" className="text-sm font-medium text-slate-700">Quality</label>
                        <span className="text-sm font-bold text-slate-800 tabular-nums">{quality}%</span>
                      </div>
                      <input
                        id="quality-slider"
                        type="range"
                        min={1}
                        max={100}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-sky-600"
                        disabled={isBusy}
                      />
                      <p className="text-xs text-slate-500">
                        Higher quality = larger file. 85% is a good balance.
                      </p>
                    </div>
                  )}
                </div>
              </ToolCard>
            </>
          ) : (
            <ToolCard title="Upload an image">
              <ImageDropzone
                onFiles={handleFiles}
                label="JPG, PNG, WebP, GIF, BMP — up to 50 MB"
              />
            </ToolCard>
          )}

          {status === 'idle' && file && dimensions && (
            <button
              type="button"
              onClick={handleResize}
              disabled={!canResize}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                canResize
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              📐 Resize Image
            </button>
          )}

          {status === 'loading-lib' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading resize engine…
              </div>
            </div>
          )}

          {status === 'processing' && (
            <ToolCard title="Resizing…">
              <div className="flex items-center gap-3 py-4">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-slate-600">
                  Resizing to {width} × {height} pixels…
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