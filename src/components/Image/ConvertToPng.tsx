'use client';

import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';

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

const HEIC_MIME = 'image/heic';
const HEIF_MIME = 'image/heif';
const HEIC_EXTENSIONS = /\.(heic|heif)$/i;

function isHeic(file: File): boolean {
  return (
    file.type === HEIC_MIME ||
    file.type === HEIF_MIME ||
    HEIC_EXTENSIONS.test(file.name)
  );
}

export default function ConvertToPng() {
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [transparentBg, setTransparentBg] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<{ name: string; blob: Blob; size: number }[]>([]);
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
      let heic2any: ((opts: { blob: Blob; toType?: string; multiple?: true; quality?: number; gifInterval?: number }) => Promise<Blob | Blob[]>) | null = null;
      const hasHeic = files.some(isHeic);
      if (hasHeic) {
        const mod = await import('heic2any');
        heic2any = mod.default;
      }

      setStatus('processing');
      const results: { name: string; blob: Blob; size: number }[] = [];

      for (let i = 0; i < files.length; i++) {
        setProgress(i + 1);
        const file = files[i];

        try {
          let img: HTMLImageElement;

          if (heic2any && isHeic(file)) {
            const converted = await heic2any({ blob: file, toType: 'image/png' });
            const blob = Array.isArray(converted) ? converted[0] : converted;
            img = await loadImage(new File([blob], file.name, { type: 'image/png' }));
          } else {
            img = await loadImage(file);
          }

          const canvas = drawToCanvas(img);

          if (!transparentBg) {
            const ctx = canvas.getContext('2d')!;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
          }

          const blob = await canvasToBlob(canvas, 'image/png');

          results.push({
            name: changeExtension(file.name),
            blob,
            size: blob.size,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setError(`Failed to convert ${file.name}: ${msg}`);
        }
      }

      setOutputs(results);
      if (results.length > 0) setStatus('done');
      else if (error) setStatus('error');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load conversion libraries';
      setError(msg);
      setStatus('error');
    }
  }, [files, transparentBg, error]);

  const handleDownloadAllZip = useCallback(async () => {
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
      a.download = 'converted-to-png.zip';
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
            {outputs.map((o, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{o.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs text-slate-500">
                      {formatBytes(o.size)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      PNG
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <ImageDownloadButton
                    blob={o.blob}
                    fileName={o.name}
                  />
                </div>
              </div>
            ))}

            {outputs.length > 1 && (
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
              label="JPG, WebP, AVIF, HEIC, GIF, BMP — up to 50 MB each"
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
            <ToolCard title="Background">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTransparentBg(true)}
                  className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-md text-sm font-semibold transition-colors ${
                    transparentBg
                      ? 'bg-white text-sky-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Transparent background
                </button>
                <button
                  type="button"
                  onClick={() => setTransparentBg(false)}
                  className={`flex-1 px-3 py-2.5 min-h-[44px] rounded-md text-sm font-semibold transition-colors ${
                    !transparentBg
                      ? 'bg-white text-sky-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  White background
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {transparentBg
                  ? 'Preserves transparency. Ideal for logos, icons, and PNGs that need alpha channel.'
                  : 'Fills canvas with white before drawing. Useful when converting JPG or WebP without alpha to PNG.'}
              </p>
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
              🖼️ Convert {files.length === 1 ? 'to PNG' : `${files.length} Images to PNG`}
            </button>
          )}

          {status === 'loading-lib' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading conversion engine…
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
