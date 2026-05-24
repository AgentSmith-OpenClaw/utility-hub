'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'processing' | 'done' | 'error';

export default function RotateImage() {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(0);
  const [previewAngle, setPreviewAngle] = useState(0);
  const [output, setOutput] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl('');
  }, [file]);

  const handleFile = useCallback((incoming: File[]) => {
    const f = incoming[0];
    setFile(f);
    setAngle(0);
    setPreviewAngle(0);
    setOutput(null);
    setError(null);
    setStatus('idle');
  }, []);

  const handleRemove = useCallback(() => {
    setFile(null);
    setAngle(0);
    setPreviewAngle(0);
    setOutput(null);
    setError(null);
    setStatus('idle');
  }, []);

  const handleAngleChange = useCallback((newAngle: number) => {
    const normalized = ((newAngle % 360) + 360) % 360;
    setAngle(normalized);
    setPreviewAngle(normalized);
    setOutput(null);
    setStatus('idle');
  }, []);

  const handleRotateLeft = useCallback(() => handleAngleChange((angle + 270) % 360), [angle, handleAngleChange]);
  const handleRotateRight = useCallback(() => handleAngleChange((angle + 90) % 360), [angle, handleAngleChange]);
  const handleRotate180 = useCallback(() => handleAngleChange((angle + 180) % 360), [angle, handleAngleChange]);
  const handleReset = useCallback(() => handleAngleChange(0), [handleAngleChange]);

  const handleApply = useCallback(async () => {
    if (!file) return;
    setStatus('processing');
    setError(null);

    try {
      const img = await loadImage(file);
      const rad = (angle * Math.PI) / 180;
      const w = img.naturalWidth ?? img.width;
      const h = img.naturalHeight ?? img.height;

      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const canvasW = Math.ceil(w * cos + h * sin);
      const canvasH = Math.ceil(w * sin + h * cos);

      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.translate(canvasW / 2, canvasH / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -w / 2, -h / 2);

      const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : '';
      let mimeType = 'image/jpeg';
      if (ext === 'png') mimeType = 'image/png';
      else if (ext === 'webp') mimeType = 'image/webp';

      const blob = await canvasToBlob(canvas, mimeType, 0.92);
      setOutput(blob);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rotate image');
      setStatus('error');
    }
  }, [file, angle]);

  const canApply = file !== null && status === 'idle';

  const getOutputFileName = (): string => {
    if (!file) return 'rotated.jpg';
    const baseName = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    return `${baseName}-rotated-${angle}deg.${ext}`;
  };

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'done' ? (
        <ToolCard title="Rotation complete" action={
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
          >
            Start over
          </button>
        }>
          {output && (
            <ImageDownloadButton blob={output} fileName={getOutputFileName()} />
          )}
        </ToolCard>
      ) : (
        <>
          {!file ? (
            <ToolCard title="Upload image">
              <ImageDropzone
                onFiles={handleFile}
                label="JPG, PNG, WebP, GIF, BMP — up to 50 MB"
              />
            </ToolCard>
          ) : (
            <>
              <ToolCard title="Image" action={
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                >
                  Remove
                </button>
              }>
                <ImagePreview file={file} />

                {previewUrl && (
                  <div className="mt-4 flex justify-center overflow-hidden">
                    <div
                      style={{ transform: `rotate(${previewAngle}deg)` }}
                      className="w-48 h-48 flex items-center justify-center transition-transform duration-200"
                    >
                      <img
                        src={previewUrl}
                        alt="Rotated preview"
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                  </div>
                )}
              </ToolCard>

              <ToolCard title="Rotation angle">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800 tabular-nums">{angle}&deg;</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label htmlFor="angle-slider" className="text-sm font-medium text-slate-700 whitespace-nowrap">
                      Free rotate
                    </label>
                    <input
                      id="angle-slider"
                      type="range"
                      min={0}
                      max={360}
                      step={1}
                      value={angle}
                      onChange={(e) => handleAngleChange(Number(e.target.value))}
                      className="flex-1 accent-sky-600"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={handleRotateLeft}
                      className="px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      &olarr; 90&deg; Left
                    </button>
                    <button
                      type="button"
                      onClick={handleRotateRight}
                      className="px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      90&deg; Right &orarr;
                    </button>
                    <button
                      type="button"
                      onClick={handleRotate180}
                      className="px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      ↻ 180&deg;
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </ToolCard>

              <button
                type="button"
                onClick={handleApply}
                disabled={!canApply}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                  canApply
                    ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                🔄 Apply &amp; Download
              </button>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 text-slate-600">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Rotating image&hellip;
              </div>
            </div>
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
