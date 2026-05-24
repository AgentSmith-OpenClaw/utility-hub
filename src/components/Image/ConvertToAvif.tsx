'use client';

import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'processing' | 'done' | 'error';
type QualityPreset = 30 | 55 | 75;

interface OutputItem {
  name: string;
  blob: Blob;
  size: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ConvertToAvif() {
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(75);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [zipping, setZipping] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);

  const handleFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => [...prev, ...incoming]);
    setStatus('idle');
    setOutputs([]);
    setError(null);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setOutputs([]);
    setStatus('idle');
  }, []);

  const handleConvert = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setError(null);
    setOutputs([]);

    try {
      const testCanvas = document.createElement('canvas');
      testCanvas.width = 1;
      testCanvas.height = 1;
      const testCtx = testCanvas.getContext('2d')!;
      testCtx.fillStyle = '#ffffff';
      testCtx.fillRect(0, 0, 1, 1);

      const testBlob = await new Promise<Blob | null>((resolve) => {
        testCanvas.toBlob((b) => resolve(b), 'image/avif');
      });

      if (!testBlob || testBlob.size === 0) {
        setBrowserSupported(false);
        setStatus('error');
        setError(
          'AVIF encoding is only available in Chrome, Edge, and Opera right now. Safari and Firefox don\'t support AVIF encoding yet. Try Convert to WebP instead.',
        );
        return;
      }

      const results: OutputItem[] = [];

      for (let i = 0; i < files.length; i++) {
        setProgress(i + 1);
        const file = files[i];

        try {
          const img = await loadImage(file);
          const canvas = drawToCanvas(img);
          const blob = await canvasToBlob(canvas, 'image/avif', quality / 100);

          const baseName = file.name.includes('.')
            ? file.name.slice(0, file.name.lastIndexOf('.'))
            : file.name;
          const outputName = `${baseName}.avif`;

          results.push({ name: outputName, blob, size: blob.size });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setError(`Failed to convert ${file.name}: ${msg}`);
        }
      }

      setOutputs(results);
      if (results.length > 0) setStatus('done');
      else if (error) setStatus('error');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      setError(msg);
      setStatus('error');
    }
  }, [files, quality, error]);

  const handleDownloadSingle = useCallback((item: OutputItem) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadAllZip = useCallback(async () => {
    if (outputs.length === 0) return;
    setZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const item of outputs) {
        zip.file(item.name, item.blob);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-avif-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to create ZIP file');
    } finally {
      setZipping(false);
    }
  }, [outputs]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setOutputs([]);
    setStatus('idle');
    setProgress(0);
    setError(null);
    setBrowserSupported(true);
  }, []);

  const isBusy = status === 'processing';
  const canConvert = status === 'idle' && files.length > 0;

  const totalSavings = (() => {
    let totalOriginalSize = 0;
    let totalAvifSize = 0;
    files.forEach((f, i) => {
      const matched = outputs.find((o) => o.name.startsWith(
        f.name.includes('.') ? f.name.slice(0, f.name.lastIndexOf('.')) : f.name,
      ));
      totalOriginalSize += f.size;
      totalAvifSize += matched ? matched.size : 0;
    });
    if (totalOriginalSize === 0 || totalAvifSize === 0) return null;
    return Math.round((1 - totalAvifSize / totalOriginalSize) * 100);
  })();

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {!browserSupported && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          <span aria-hidden="true">⚠️</span>
          <span>
            AVIF encoding is only available in Chrome, Edge, and Opera right now. Safari and
            Firefox don&apos;t support AVIF encoding yet. Try Convert to WebP instead.
          </span>
        </div>
      )}

      {status === 'done' ? (
        <ToolCard
          title="Conversion results"
          action={
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
            >
              Start over
            </button>
          }
        >
          <div className="space-y-3">
            {totalSavings !== null && totalSavings > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <span aria-hidden="true">📉</span>
                <span>
                  AVIF saved {totalSavings}% in total — up to 50% smaller than JPG with the same
                  visual quality
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span aria-hidden="true">✓</span>
              <span>
                {outputs.length} file{outputs.length !== 1 ? 's' : ''} ready
              </span>
            </div>

            <div className="space-y-2">
              {outputs.map((item) => {
                const matchedFile = files.find(
                  (f) =>
                    item.name ===
                    `${f.name.includes('.') ? f.name.slice(0, f.name.lastIndexOf('.')) : f.name}.avif`,
                );
                const originalSize = matchedFile ? matchedFile.size : 0;
                const savings =
                  originalSize > 0
                    ? Math.round((1 - item.size / originalSize) * 100)
                    : 0;

                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2"
                  >
                    <span className="text-base flex-shrink-0" aria-hidden="true">
                      ✨
                    </span>
                    <span className="text-sm font-medium text-slate-800 flex-1 truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                      {formatBytes(originalSize)}
                      <span className="mx-1 text-slate-300">→</span>
                      {formatBytes(item.size)}
                      {savings > 0 && (
                        <span className="ml-1.5 text-emerald-700 font-semibold">
                          −{savings}%
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-medium transition-colors"
                    >
                      Download
                    </button>
                  </div>
                );
              })}
            </div>

            {outputs.length > 1 && (
              <button
                type="button"
                onClick={handleDownloadAllZip}
                disabled={zipping}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-60 transition-all"
              >
                {zipping ? 'Packing zip…' : 'Download all as .zip'}
              </button>
            )}
          </div>
        </ToolCard>
      ) : (
        <>
          <ToolCard title="Upload images">
            <ImageDropzone
              onFiles={handleFiles}
              multiple
              label="JPG, PNG, WebP, GIF, BMP, AVIF — up to 50 MB each. Convert to next-gen AVIF."
            />
          </ToolCard>

          {files.length > 0 && (
            <ToolCard
              title={`${files.length} image${files.length === 1 ? '' : 's'} selected`}
              action={
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                >
                  Clear all
                </button>
              }
            >
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div
                    key={`${f.name}-${f.size}-${i}`}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <ImagePreview file={f} />
                    </div>
                    {status === 'idle' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(i)}
                        className="flex-shrink-0 w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-colors min-w-[44px] min-h-[44px]"
                        aria-label={`Remove ${f.name}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {status === 'idle' && files.length > 0 && (
                <div className="mt-2">
                  <ImageDropzone
                    onFiles={handleFiles}
                    multiple
                    compact
                  />
                </div>
              )}
            </ToolCard>
          )}

          {files.length > 0 && status === 'idle' && (
            <ToolCard title="Quality">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="quality-slider"
                    className="text-sm font-medium text-slate-700 whitespace-nowrap"
                  >
                    AVIF quality
                  </label>
                  <input
                    id="quality-slider"
                    type="range"
                    min={1}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="flex-1 accent-sky-600"
                    disabled={isBusy}
                  />
                  <span className="text-sm font-bold text-slate-800 tabular-nums w-10 text-right">
                    {quality}%
                  </span>
                </div>

                <div className="flex gap-2">
                  {([
                    { label: 'Low', value: 30 as QualityPreset },
                    { label: 'Medium', value: 55 as QualityPreset },
                    { label: 'High', value: 75 as QualityPreset },
                  ]).map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setQuality(preset.value)}
                      className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                        quality === preset.value
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      disabled={isBusy}
                    >
                      {preset.label} ({preset.value}%)
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-500">
                  AVIF at 75% quality often beats JPG at 90% in visual quality while being
                  50% smaller. AVIF is the most efficient next-gen format.
                </p>
              </div>
            </ToolCard>
          )}

          {status === 'idle' && (
            <button
              type="button"
              onClick={handleConvert}
              disabled={!canConvert}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                canConvert
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              ✨ Convert {files.length === 1 ? 'Image' : `${files.length} Images`} to AVIF
            </button>
          )}

          {status === 'processing' && (
            <ToolCard title="Converting to AVIF…">
              <div className="space-y-4">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${files.length > 0 ? (progress / files.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Converting {progress} of {files.length}…
                </p>
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
