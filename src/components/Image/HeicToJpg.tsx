'use client';

import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';

interface OutputFile {
  name: string;
  blob: Blob;
  size: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function changeExt(name: string): string {
  const lower = name.toLowerCase();
  const ext = lower.endsWith('.heic') ? '.heic' : lower.endsWith('.heif') ? '.heif' : '';
  if (!ext) return name.includes('.') ? name.slice(0, name.lastIndexOf('.')) + '.jpg' : name + '.jpg';
  return name.slice(0, name.length - ext.length) + '.jpg';
}

export default function HeicToJpg() {
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(85);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<OutputFile[]>([]);
  const [zipping, setZipping] = useState(false);

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
    setStatus('loading-lib');
    setError(null);
    setOutputs([]);

    try {
      const { default: heic2any } = await import('heic2any');

      setStatus('processing');
      const results: OutputFile[] = [];

      for (let i = 0; i < files.length; i++) {
        setProgress(i + 1);
        const file = files[i];

        try {
          const resultBlobs = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: quality / 100,
          });

          const blob = Array.isArray(resultBlobs) ? resultBlobs[0] : resultBlobs;

          results.push({
            name: changeExt(file.name),
            blob,
            size: blob.size,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setError(`Failed to convert ${file.name}: ${msg}`);
        }
      }

      setOutputs(results);
      if (results.length > 0) {
        setStatus('done');
      } else if (error) {
        setStatus('error');
      } else {
        setStatus('idle');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load HEIC engine';
      setError(msg);
      setStatus('error');
    }
  }, [files, quality, error]);

  const handleDownloadFile = useCallback((f: OutputFile) => {
    const url = URL.createObjectURL(f.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = f.name;
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

      for (const f of outputs) {
        zip.file(f.name, f.blob);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'heic-to-jpg.zip';
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

  const isBusy = status === 'loading-lib' || status === 'processing';
  const canConvert = status === 'idle' && files.length > 0;

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'done' ? (
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
              <span>{outputs.length} JPG{outputs.length !== 1 ? 's' : ''} ready</span>
            </div>

            <div className="space-y-2">
              {outputs.map((f) => (
                <div key={f.name} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
                  <span className="text-base flex-shrink-0" aria-hidden="true">🖼️</span>
                  <span className="text-sm font-medium text-slate-800 flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{formatBytes(f.size)}</span>
                  <button type="button" onClick={() => handleDownloadFile(f)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-medium transition-colors min-h-[44px]">
                    Download
                  </button>
                </div>
              ))}
            </div>

            {outputs.length > 1 && (
              <button type="button" onClick={handleDownloadZip} disabled={zipping}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-60 transition-all min-h-[44px]">
                {zipping ? 'Packing zip…' : 'Download all as .zip'}
              </button>
            )}
          </div>
        </ToolCard>
      ) : (
        <>
          <ToolCard title="Upload HEIC photos">
            <ImageDropzone
              onFiles={handleFiles}
              multiple
              accept=".heic,.heif,image/heic,image/heif"
              label="HEIC / HEIF photos from your iPhone — up to 50 MB each"
            />
          </ToolCard>

          {files.length > 0 && (
            <ToolCard title={`${files.length} photo${files.length === 1 ? '' : 's'} selected`} action={
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
                    accept=".heic,.heif,image/heic,image/heif"
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
                    JPEG quality
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
                    { label: 'Low', value: 60 },
                    { label: 'Medium', value: 80 },
                    { label: 'High', value: 95 },
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
                  85–95% is near-lossless for photos. 60% gives smaller files with slight quality reduction.
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
              📱 Convert {files.length === 1 ? 'HEIC to JPG' : `${files.length} HEIC Files to JPG`}
            </button>
          )}

          {status === 'loading-lib' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading HEIC engine…
              </div>
            </div>
          )}

          {status === 'processing' && (
            <ToolCard title="Converting…">
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
    </div>
  );
}
