'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'processing' | 'done' | 'error';

interface ConvertedResult {
  originalFile: File;
  outputBlob: Blob;
  originalSize: number;
  outputSize: number;
  savings: number;
  outputName: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function changeExtToWebp(fileName: string): string {
  const dotIdx = fileName.lastIndexOf('.');
  if (dotIdx > 0) return `${fileName.slice(0, dotIdx)}.webp`;
  return `${fileName}.webp`;
}

export default function ConvertToWebp() {
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<ConvertedResult[]>([]);
  const [zipping, setZipping] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [supportChecked, setSupportChecked] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    canvas.toBlob(
      (blob) => {
        if (blob && blob.size > 0) {
          setBrowserSupported(true);
        } else {
          setBrowserSupported(false);
        }
        setSupportChecked(true);
      },
      'image/webp',
      0.8,
    );
  }, []);

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
      const results: ConvertedResult[] = [];

      for (let i = 0; i < files.length; i++) {
        setProgress(i + 1);
        const file = files[i];

        try {
          const img = await loadImage(file);
          const canvas = drawToCanvas(img);
          const blob = await canvasToBlob(canvas, 'image/webp', quality / 100);

          const savings = file.size > 0
            ? Math.round((1 - blob.size / file.size) * 100)
            : 0;

          results.push({
            originalFile: file,
            outputBlob: blob,
            originalSize: file.size,
            outputSize: blob.size,
            savings,
            outputName: changeExtToWebp(file.name),
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setError(`Failed to convert ${file.name}: ${msg}`);
        }
      }

      setOutputs(results);
      if (results.length > 0) setStatus('done');
      else if (error) setStatus('error');
      else setStatus('error');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      setError(msg);
      setStatus('error');
    }
  }, [files, quality, error]);

  const handleDownloadFile = useCallback((r: ConvertedResult) => {
    const url = URL.createObjectURL(r.outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = r.outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadZip = useCallback(async () => {
    if (outputs.length === 0) return;
    setZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const r of outputs) {
        zip.file(r.outputName, r.outputBlob);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'webp-converted-images.zip';
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
  }, []);

  const isBusy = status === 'processing';
  const canConvert = status === 'idle' && files.length > 0 && browserSupported;

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {!supportChecked && (
        <div className="text-center py-6 text-slate-500 text-sm">
          Checking browser support…
        </div>
      )}

      {supportChecked && !browserSupported && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
          <span aria-hidden="true">⚠️</span>
          Your browser doesn&rsquo;t support WebP encoding. Try Chrome, Edge, or Safari.
        </div>
      )}

      {supportChecked && browserSupported && (
        <>
          {status === 'done' ? (
            <>
              <ToolCard title="Conversion results" action={
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
                    <span>{outputs.length} file{outputs.length !== 1 ? 's' : ''} ready</span>
                  </div>

                  <div className="space-y-2">
                    {outputs.map((r) => (
                      <div key={r.outputName} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
                        <span className="text-base flex-shrink-0" aria-hidden="true">🌐</span>
                        <span className="text-sm font-medium text-slate-800 flex-1 truncate">{r.outputName}</span>
                        <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                          {formatBytes(r.originalSize)} → {formatBytes(r.outputSize)}
                          {r.savings > 0 && (
                            <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              −{r.savings}%
                            </span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(r)}
                          className="flex-shrink-0 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-medium transition-colors min-h-[44px]"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>

                  {outputs.length > 1 && (
                    <button
                      type="button"
                      onClick={handleDownloadZip}
                      disabled={zipping}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-60 transition-all min-h-[44px]"
                    >
                      {zipping ? 'Packing zip…' : 'Download all as .zip'}
                    </button>
                  )}
                </div>
              </ToolCard>

              <ToolCard title="Size savings">
                <div className="space-y-3">
                  {(() => {
                    const totalOrig = outputs.reduce((sum, r) => sum + r.originalSize, 0);
                    const totalOut = outputs.reduce((sum, r) => sum + r.outputSize, 0);
                    const totalSavings = totalOrig > 0
                      ? Math.round((1 - totalOut / totalOrig) * 100)
                      : 0;
                    const savingsMb = ((totalOrig - totalOut) / (1024 * 1024)).toFixed(2);
                    return (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Total original</span>
                          <span className="font-semibold text-slate-800">{formatBytes(totalOrig)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Total WebP</span>
                          <span className="font-semibold text-slate-800">{formatBytes(totalOut)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                          <span className="text-slate-600">Total saved</span>
                          <span className="font-bold text-emerald-700">
                            −{savingsMb} MB ({totalSavings}%)
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </ToolCard>
            </>
          ) : (
            <>
              <ToolCard title="Upload images">
                <ImageDropzone
                  onFiles={handleFiles}
                  multiple
                  label="JPG, PNG, WebP, GIF, BMP, AVIF — up to 50 MB each"
                />
              </ToolCard>

              {files.length > 0 && (
                <ToolCard title={`${files.length} image${files.length === 1 ? '' : 's'} selected`} action={
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Clear all
                  </button>
                }>
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div key={`${f.name}-${f.size}-${i}`} className="flex items-center gap-2">
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
                      <label htmlFor="quality-slider" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                        WebP quality
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
                      <span className="text-sm font-bold text-slate-800 tabular-nums w-10 text-right">{quality}%</span>
                    </div>

                    <div className="flex gap-2">
                      {([
                        { label: 'Low', value: 40 },
                        { label: 'Medium', value: 65 },
                        { label: 'High', value: 85 },
                      ] as const).map((preset) => (
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
                      Higher quality = larger files. 80–85% is typically near-lossless for WebP.
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
                  🌐 Convert {files.length === 1 ? 'to WebP' : `${files.length} Images to WebP`}
                </button>
              )}

              {status === 'processing' && (
                <ToolCard title="Converting to WebP…">
                  <div className="space-y-4">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${files.length > 0 ? (progress / files.length) * 100 : 0}%` }}
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
        </>
      )}
    </div>
  );
}
