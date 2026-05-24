'use client';

import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';

const SIZES: { name: string; width: number; height: number }[] = [
  { name: 'favicon-16x16.png', width: 16, height: 16 },
  { name: 'favicon-32x32.png', width: 32, height: 32 },
  { name: 'apple-touch-icon.png', width: 180, height: 180 },
  { name: 'android-chrome-192x192.png', width: 192, height: 192 },
  { name: 'android-chrome-512x512.png', width: 512, height: 512 },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildIco(png16: Uint8Array, png32: Uint8Array): Blob {
  const headerSize = 6;
  const entrySize = 16;
  const count = 2;
  const dirOffset = headerSize;
  const png16Offset = headerSize + count * entrySize;
  const png32Offset = png16Offset + png16.byteLength;
  const totalSize = png32Offset + png32.byteLength;

  const buf = new Uint8Array(totalSize);
  const dv = new DataView(buf.buffer);

  dv.setUint16(0, 0, true);
  dv.setUint16(2, 1, true);
  dv.setUint16(4, count, true);

  const writeEntry = (base: number, width: number, height: number, size: number, offset: number) => {
    dv.setUint8(base, width === 16 ? 16 : 0);
    dv.setUint8(base + 1, height === 16 ? 16 : 0);
    dv.setUint8(base + 2, 0);
    dv.setUint8(base + 3, 0);
    dv.setUint16(base + 4, 1, true);
    dv.setUint16(base + 6, 32, true);
    dv.setUint32(base + 8, size, true);
    dv.setUint32(base + 12, offset, true);
  };

  writeEntry(dirOffset, 16, 16, png16.byteLength, png16Offset);
  writeEntry(dirOffset + entrySize, 32, 32, png32.byteLength, png32Offset);

  buf.set(png16, png16Offset);
  buf.set(png32, png32Offset);

  return new Blob([buf], { type: 'image/x-icon' });
}

function buildWebmanifest(): Blob {
  const json = JSON.stringify({
    name: '',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2);
  return new Blob([json], { type: 'application/manifest+json' });
}

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [outputs, setOutputs] = useState<{ name: string; blob: Blob; size: number }[]>([]);
  const [progress, setProgress] = useState(0);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((incoming: File[]) => {
    const f = incoming[0] ?? null;
    setFile(f);
    setStatus('idle');
    setOutputs([]);
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!file) return;
    setStatus('loading-lib');
    setError(null);
    setOutputs([]);
    setProgress(0);

    try {
      const img = await loadImage(file);
      setStatus('processing');

      const results: { name: string; blob: Blob; size: number }[] = [];
      let png16Bytes: Uint8Array | null = null;
      let png32Bytes: Uint8Array | null = null;

      for (let i = 0; i < SIZES.length; i++) {
        const { name, width, height } = SIZES[i];
        setProgress(i + 1);

        const canvas = drawToCanvas(img, width, height);
        const blob = await canvasToBlob(canvas, 'image/png');

        const bytes = new Uint8Array(await blob.arrayBuffer());
        if (name === 'favicon-16x16.png') png16Bytes = bytes;
        if (name === 'favicon-32x32.png') png32Bytes = bytes;

        results.push({ name, blob, size: blob.size });
      }

      setProgress(SIZES.length + 1);

      if (png16Bytes && png32Bytes) {
        const icoBlob = buildIco(png16Bytes, png32Bytes);
        results.push({ name: 'favicon.ico', blob: icoBlob, size: icoBlob.size });
      }

      setProgress(SIZES.length + 2);

      const manifestBlob = buildWebmanifest();
      results.push({ name: 'site.webmanifest', blob: manifestBlob, size: manifestBlob.size });

      setOutputs(results);
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate favicon pack';
      setError(msg);
      setStatus('error');
    }
  }, [file]);

  const handleDownloadFile = useCallback((o: { name: string; blob: Blob }) => {
    const url = URL.createObjectURL(o.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = o.name;
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

      for (const o of outputs) {
        zip.file(o.name, o.blob);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicon-pack.zip';
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
    setFile(null);
    setOutputs([]);
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, []);

  const isBusy = status === 'loading-lib' || status === 'processing';
  const canGenerate = status === 'idle' && file !== null;

  const totalSteps = SIZES.length + 2;

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'done' ? (
        <ToolCard title="Favicon pack ready" action={
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
          >
            Start over
          </button>
        }>
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span aria-hidden="true">&#10003;</span>
              <span>{outputs.length} files ready</span>
            </div>

            <div className="space-y-2">
              {outputs.map((o) => (
                <div key={o.name} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
                  <span className="text-base flex-shrink-0" aria-hidden="true">&#128279;</span>
                  <span className="text-sm font-medium text-slate-800 flex-1 truncate">{o.name}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{formatBytes(o.size)}</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(o)}
                    className="flex-shrink-0 px-3 py-1.5 min-h-[44px] min-w-[44px] rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-xs font-medium transition-colors"
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
                className="w-full flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-60 transition-all"
              >
                {zipping ? 'Packing zip…' : 'Download all as .zip'}
              </button>
            )}
          </div>
        </ToolCard>
      ) : (
        <>
          <ToolCard title="Upload image">
            <ImageDropzone
              onFiles={handleFiles}
              label="Drop a square or high-resolution image — logo, icon, or photo"
            />
          </ToolCard>

          {file && (
            <ToolCard title="Selected image" action={
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
              >
                Remove
              </button>
            }>
              <ImagePreview file={file} />
            </ToolCard>
          )}

          {file && (
            <ToolCard title="Output sizes">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  The following files will be generated from your image:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SIZES.map((s) => (
                    <div key={s.name} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="flex-shrink-0 w-10 h-10 rounded bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-bold">
                        {s.width}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.width}&times;{s.height} px</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="flex-shrink-0 w-10 h-10 rounded bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-bold">
                      ICO
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">favicon.ico</p>
                      <p className="text-xs text-slate-500">16&times;16 + 32&times;32</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="flex-shrink-0 w-10 h-10 rounded bg-sky-100 flex items-center justify-center text-sky-700 text-xs font-bold">
                      PWA
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">site.webmanifest</p>
                      <p className="text-xs text-slate-500">PWA manifest</p>
                    </div>
                  </div>
                </div>
              </div>
            </ToolCard>
          )}

          {status === 'idle' && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                canGenerate
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              &#127760; Generate Favicon Pack
            </button>
          )}

          {status === 'loading-lib' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading image…
              </div>
            </div>
          )}

          {status === 'processing' && (
            <ToolCard title="Generating favicon pack…">
              <div className="space-y-4">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${totalSteps > 0 ? (progress / totalSteps) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Generating {progress} of {totalSteps}…
                </p>
              </div>
            </ToolCard>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              <span aria-hidden="true">&#9888;&#65039;</span>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
