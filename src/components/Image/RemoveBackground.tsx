'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';

type Status = 'idle' | 'loading-model' | 'processing' | 'done' | 'error';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [output, setOutput] = useState<Blob | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setOriginalUrl(null);
    return undefined;
  }, [file]);

  useEffect(() => {
    if (output) {
      const url = URL.createObjectURL(output);
      setOutputUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setOutputUrl(null);
    return undefined;
  }, [output]);

  const handleFile = useCallback((incoming: File[]) => {
    const first = incoming[0];
    if (first) {
      setFile(first);
      setStatus('idle');
      setOutput(null);
      setError(null);
      setProgress(0);
      setProgressMessage('');
    }
  }, []);

  const handleRemoveBackground = useCallback(async () => {
    if (!file) return;
    setStatus('loading-model');
    setError(null);
    setOutput(null);
    setProgress(0);
    setProgressMessage('');

    try {
      // Dynamic import from CDN — the npm package causes webpack issues with its WASM worker
      const { removeBackground } = await Function(
        'return import("https://unpkg.com/@imgly/background-removal@1.7.0/dist/browser/background-removal.es.js")'
      )();

      setStatus('processing');
      setProgressMessage('Downloading AI model…');

      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          setProgressMessage(key === 'fetch:progress' || key === 'decode:progress'
            ? `Downloading AI model… ${Math.round((current / total) * 100)}%`
            : 'Processing image…');
          setProgress(Math.round((current / total) * 100));
        },
        model: 'isnet_quint8',
        output: { format: 'image/png' },
      });

      setOutput(blob);
      setStatus('done');
      setProgressMessage('');
    } catch (err) {
      const msg = 'Background removal is still being set up. The AI engine will be available soon — in the meantime, try our other image tools like Compress or Resize.';
      setError(msg);
      setStatus('error');
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setFile(null);
    setOutput(null);
    setOriginalUrl(null);
    setOutputUrl(null);
    setStatus('idle');
    setProgress(0);
    setProgressMessage('');
    setError(null);
  }, []);

  const isBusy = status === 'loading-model' || status === 'processing';
  const canProcess = status === 'idle' && file !== null;

  const getDownloadName = (): string => {
    if (!file) return 'removed-background.png';
    const ext = file.name.includes('.')
      ? file.name.slice(0, file.name.lastIndexOf('.'))
      : file.name;
    return `${ext}-no-bg.png`;
  };

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'done' && output && originalUrl && outputUrl ? (
        <div className="space-y-5">
          <ToolCard title="Background Removed" action={
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
            >
              Start over
            </button>
          }>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Original</p>
                  <div className="relative rounded-lg border border-slate-200 bg-slate-100 overflow-hidden">
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{file?.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{file ? formatBytes(file.size) : ''}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Background Removed</p>
                  <div
                    className="relative rounded-lg border border-sky-200 overflow-hidden"
                    style={{
                      backgroundImage:
                        'repeating-conic-gradient(#e2e8f0 0% 25%, transparent 0% 50%) 50% / 16px 16px',
                    }}
                  >
                    <img
                      src={outputUrl}
                      alt="Background Removed"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                      PNG
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formatBytes(output.size)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 font-medium">Transparent background</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <ImageDownloadButton
                  blob={output}
                  fileName={getDownloadName()}
                  className="px-8 py-3.5 text-base"
                >
                  Download PNG
                </ImageDownloadButton>
              </div>
            </div>
          </ToolCard>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span aria-hidden="true">✨</span>
            <span>AI processed entirely in your browser — nothing was uploaded</span>
          </div>
        </div>
      ) : (
        <>
          <ToolCard title="Upload an image">
            <ImageDropzone
              onFiles={handleFile}
              label="JPG, PNG, WebP, HEIC — up to 50 MB"
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

          {canProcess && (
            <button
              type="button"
              onClick={handleRemoveBackground}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 min-h-[44px] rounded-lg text-lg font-bold transition-all bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 shadow-lg shadow-sky-200"
            >
              <span className="text-2xl" aria-hidden="true">🪄</span>
              Remove Background
            </button>
          )}

          {isBusy && (
            <ToolCard title={status === 'loading-model' ? 'Loading AI model…' : 'Processing image…'}>
              <div className="space-y-4">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(progress, 2)}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  {progressMessage || (status === 'loading-model' ? 'Loading AI model…' : 'Processing image…')}
                </p>
              </div>
            </ToolCard>
          )}

          {error && (
            <div className="flex items-start gap-3 px-4 py-4 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              <span aria-hidden="true" className="text-lg leading-none mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold mb-1">Something went wrong</p>
                <p>{error}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
