'use client';

import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'processing' | 'done' | 'error';

export default function FlipImage() {
  const [file, setFile] = useState<File | null>(null);
  const [flippedH, setFlippedH] = useState(false);
  const [flippedV, setFlippedV] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [output, setOutput] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFiles = useCallback((incoming: File[]) => {
    if (incoming.length === 0) return;
    setFile(incoming[0]);
    setFlippedH(false);
    setFlippedV(false);
    setOutput(null);
    setStatus('idle');
    setError(null);

    const url = URL.createObjectURL(incoming[0]);
    setPreviewUrl(url);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setFlippedH(false);
    setFlippedV(false);
    setOutput(null);
    setStatus('idle');
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  }, [previewUrl]);

  const applyFlips = useCallback(async (h: boolean, v: boolean) => {
    if (!file) return;
    setStatus('processing');
    setError(null);

    try {
      const img = await loadImage(file);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;

      ctx.save();
      ctx.scale(h ? -1 : 1, v ? -1 : 1);
      ctx.drawImage(img, h ? -canvas.width : 0, v ? -canvas.height : 0);
      ctx.restore();

      const mimeType = file.type && file.type.startsWith('image/') ? file.type : 'image/png';
      const blob = await canvasToBlob(canvas, mimeType);
      setOutput(blob);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to flip image');
      setStatus('error');
    }
  }, [file]);

  const handleFlipH = useCallback(() => {
    const newFlippedH = !flippedH;
    setFlippedH(newFlippedH);
    applyFlips(newFlippedH, flippedV);
  }, [flippedH, flippedV, applyFlips]);

  const handleFlipV = useCallback(() => {
    const newFlippedV = !flippedV;
    setFlippedV(newFlippedV);
    applyFlips(flippedH, newFlippedV);
  }, [flippedH, flippedV, applyFlips]);

  const handleUndoFlips = useCallback(() => {
    setFlippedH(false);
    setFlippedV(false);
    applyFlips(false, false);
  }, [applyFlips]);

  const isBusy = status === 'processing';

  const canDownload = status === 'done' && output !== null;

  const getFileName = (): string => {
    if (!file) return 'flipped-image.png';
    const ext = file.name.includes('.') ? file.name.split('.').pop()! : 'png';
    const base = file.name.includes('.')
      ? file.name.slice(0, file.name.lastIndexOf('.'))
      : file.name;
    return `${base}-flipped.${ext}`;
  };

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      <ToolCard title="Upload image">
        <ImageDropzone
          onFiles={handleFiles}
          multiple={false}
          label="Drop an image to flip it — JPG, PNG, WebP, GIF, BMP, AVIF"
        />
      </ToolCard>

      {file && (
        <ToolCard title="Flip controls" action={
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
          >
            New image
          </button>
        }>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <ImagePreview file={file} />
              </div>
            </div>

            <div className="flex items-center justify-center">
              {previewUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100 p-1">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 max-w-full object-contain rounded-md transition-transform duration-200"
                    style={{
                      transform: `scaleX(${flippedH ? -1 : 1}) scaleY(${flippedV ? -1 : 1})`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleFlipH}
                disabled={isBusy}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                  isBusy
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : flippedH
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                ↔ Flip Horizontal
              </button>
              <button
                type="button"
                onClick={handleFlipV}
                disabled={isBusy}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                  isBusy
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : flippedV
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                ↕ Flip Vertical
              </button>
            </div>

            {(flippedH || flippedV) && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleUndoFlips}
                  disabled={isBusy}
                  className="text-xs font-medium text-slate-500 hover:text-sky-600 transition-colors min-h-[44px] flex items-center"
                >
                  Reset flips
                </button>
              </div>
            )}

            {status === 'processing' && (
              <div className="text-center py-3">
                <span className="text-sm text-slate-500">Applying flip…</span>
              </div>
            )}
          </div>
        </ToolCard>
      )}

      {canDownload && (
        <ToolCard title="Download">
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Your image has been flipped. Click below to download.
            </p>
            <ImageDownloadButton blob={output} fileName={getFileName()} />
          </div>
        </ToolCard>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
          <span aria-hidden="true">⚠</span>
          {error}
        </div>
      )}
    </div>
  );
}
