'use client';

import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';

interface CompressedResult {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  savings: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CompressImage() {
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CompressedResult[]>([]);
  const [zipping, setZipping] = useState(false);

  const handleFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => [...prev, ...incoming]);
    setStatus('idle');
    setResults([]);
    setError(null);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResults([]);
    setStatus('idle');
  }, []);

  const handleCompress = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('loading-lib');
    setError(null);
    setResults([]);

    try {
      const imageCompression = (await import('browser-image-compression')).default;

      setStatus('processing');
      const compressedResults: CompressedResult[] = [];

      for (let i = 0; i < files.length; i++) {
        setProgress(i + 1);
        const file = files[i];

        try {
          const mimeType = file.type || 'image/jpeg';
          const isPng = mimeType === 'image/png';
          const outputMime = isPng ? 'image/png' : 'image/jpeg';
          const qualityFraction = quality / 100;

          if (isPng) {
            const img = await loadImage(file);
            const canvas = drawToCanvas(img);
            const blob = await canvasToBlob(canvas, 'image/png', qualityFraction);

            const savings = file.size > 0
              ? Math.round((1 - blob.size / file.size) * 100)
              : 0;

            compressedResults.push({
              originalFile: file,
              compressedBlob: blob,
              originalSize: file.size,
              compressedSize: blob.size,
              savings,
            });
          } else {
            const options = {
              maxSizeMB: Infinity,
              maxSizeMBStrict: false,
              initialQuality: qualityFraction,
              useWebWorker: true,
              fileType: outputMime as string,
            };

            const compressed = await imageCompression(file, options);

            const savings = file.size > 0
              ? Math.round((1 - compressed.size / file.size) * 100)
              : 0;

            compressedResults.push({
              originalFile: file,
              compressedBlob: compressed,
              originalSize: file.size,
              compressedSize: compressed.size,
              savings,
            });
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setError(`Failed to compress ${file.name}: ${msg}`);
        }
      }

      setResults(compressedResults);
      if (compressedResults.length > 0) setStatus('done');
      else if (error) setStatus('error');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load compression library';
      setError(msg);
      setStatus('error');
    }
  }, [files, quality, error]);

  const handleDownloadAllZip = useCallback(async () => {
    if (results.length === 0) return;
    setZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const r of results) {
        const ext = r.originalFile.name.includes('.')
          ? r.originalFile.name.split('.').pop()!
          : 'jpg';
        const baseName = r.originalFile.name.includes('.')
          ? r.originalFile.name.slice(0, r.originalFile.name.lastIndexOf('.'))
          : r.originalFile.name;
        zip.file(`${baseName}-compressed.${ext}`, r.compressedBlob);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to create ZIP file');
    } finally {
      setZipping(false);
    }
  }, [results]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setResults([]);
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, []);

  const isBusy = status === 'loading-lib' || status === 'processing';
  const canCompress = status === 'idle' && files.length > 0;

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'done' ? (
        <ToolCard title="Compression results" action={
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
          >
            Start over
          </button>
        }>
          <div className="space-y-3">
            {results.map((r, i) => {
              const ext = r.originalFile.name.includes('.')
                ? r.originalFile.name.split('.').pop()!
                : 'jpg';
              const baseName = r.originalFile.name.includes('.')
                ? r.originalFile.name.slice(0, r.originalFile.name.lastIndexOf('.'))
                : r.originalFile.name;
              const downloadName = `${baseName}-compressed.${ext}`;

              return (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.originalFile.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-500">
                        {formatBytes(r.originalSize)}
                        <span className="mx-1 text-slate-300">→</span>
                        {formatBytes(r.compressedSize)}
                      </span>
                      {r.savings > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          −{r.savings}% smaller
                        </span>
                      )}
                      {r.savings <= 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          No size reduction
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ImageDownloadButton
                      blob={r.compressedBlob}
                      fileName={downloadName}
                    />
                  </div>
                </div>
              );
            })}

            {results.length > 1 && (
              <div className="pt-3 flex justify-center">
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={zipping}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {zipping ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating ZIP…
                    </>
                  ) : (
                    <>📦 Download all as .zip</>
                  )}
                </button>
              </div>
            )}
          </div>
        </ToolCard>
      ) : (
        <>
          <ToolCard title="Upload images">
            <ImageDropzone
              onFiles={handleFiles}
              multiple
              label="JPG, PNG, WebP, GIF, BMP — up to 50 MB each"
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
                    Compression quality
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
                  Lower quality = smaller file. 80–85% is a good balance for most uses.
                </p>
              </div>
            </ToolCard>
          )}

          {status === 'idle' && (
            <button
              type="button"
              onClick={handleCompress}
              disabled={!canCompress}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                canCompress
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              🗜️ Compress {files.length === 1 ? 'Image' : `${files.length} Images`}
            </button>
          )}

          {status === 'loading-lib' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading compression engine…
              </div>
            </div>
          )}

          {status === 'processing' && (
            <ToolCard title="Compressing…">
              <div className="space-y-4">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${files.length > 0 ? (progress / files.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Compressing {progress} of {files.length}…
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