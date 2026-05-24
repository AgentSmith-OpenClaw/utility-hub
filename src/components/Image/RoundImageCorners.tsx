'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'processing' | 'done' | 'error';

export default function RoundImageCorners() {
  const [file, setFile] = useState<File | null>(null);
  const [radius, setRadius] = useState(20);
  const [padding, setPadding] = useState(0);
  const [bgColor, setBgColor] = useState('transparent');
  const [status, setStatus] = useState<Status>('idle');
  const [output, setOutput] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUrlRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);

  const cleanupPreview = useCallback(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
  }, []);

  const renderToCanvas = useCallback(
    async (img: HTMLImageElement) => {
      setStatus('processing');

      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const pad = padding;
        const canvasW = w + 2 * pad;
        const canvasH = h + 2 * pad;
        const cornerRadius = (radius / 100) * Math.min(w, h);
        const r = Math.max(0, cornerRadius);

        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext('2d')!;

        const x = pad;
        const y = pad;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
        ctx.clip();

        if (bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvasW, canvasH);
        }

        ctx.drawImage(img, pad, pad);

        if (cancelledRef.current) return;

        const blob = await canvasToBlob(canvas, 'image/png');
        if (cancelledRef.current) return;

        setOutput(blob);

        const url = URL.createObjectURL(blob);
        cleanupPreview();
        prevUrlRef.current = url;
        setPreviewUrl(url);

        setStatus('done');
      } catch {
        if (!cancelledRef.current) {
          setStatus('error');
        }
      }
    },
    [radius, padding, bgColor, cleanupPreview],
  );

  const handleFiles = useCallback(
    (incoming: File[]) => {
      if (incoming.length === 0) return;
      const f = incoming[0];
      loadedImgRef.current = null;
      setFile(f);
      setRadius(20);
      setPadding(0);
      setBgColor('transparent');
      setOutput(null);
      setPreviewUrl(null);
      setStatus('idle');
      setDimensions(null);
      cleanupPreview();
    },
    [cleanupPreview],
  );

  const handleReset = useCallback(() => {
    cancelledRef.current = true;
    loadedImgRef.current = null;
    setFile(null);
    setRadius(20);
    setPadding(0);
    setBgColor('transparent');
    setOutput(null);
    setStatus('idle');
    setPreviewUrl(null);
    setDimensions(null);
    cleanupPreview();
  }, [cleanupPreview]);

  useEffect(() => {
    if (!file) {
      loadedImgRef.current = null;
      return;
    }

    let cancelled = false;
    cancelledRef.current = false;

    loadImage(file)
      .then((img) => {
        if (cancelled) return;
        loadedImgRef.current = img;
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        renderToCanvas(img);
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [file]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const img = loadedImgRef.current;
    if (!img) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      renderToCanvas(img);
    }, 80);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [radius, padding, bgColor]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      cleanupPreview();
    };
  }, [cleanupPreview]);

  const isBusy = status === 'processing';
  const canDownload = status === 'done' && output !== null;

  const getFileName = (): string => {
    if (!file) return 'rounded-image.png';
    const base = file.name.includes('.')
      ? file.name.slice(0, file.name.lastIndexOf('.'))
      : file.name;
    return `${base}-rounded.png`;
  };

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      <ToolCard title="Upload image">
        <ImageDropzone
          onFiles={handleFiles}
          multiple={false}
          label="Drop an image to add rounded corners — JPG, PNG, WebP, GIF, BMP, AVIF"
        />
      </ToolCard>

      {file && (
        <ToolCard
          title="Corner radius"
          action={
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
            >
              New image
            </button>
          }
        >
          <div className="space-y-5">
            <ImagePreview file={file} dimensions={dimensions ?? undefined} />

            {previewUrl && (
              <div className="flex justify-center">
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVQ4T2NkYPj/n4EHAz4BRgYqAiMDEwMDQwwDA8N/BjQAESBrRRRgADIJsAsCAI+WCWkwWeAbAAAAAElFTkSuQmCC')] bg-repeat p-1">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-72 max-w-full object-contain rounded-md"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="radius-slider">
                  Radius
                </label>
                <span className="text-sm font-medium text-sky-600 tabular-nums">{radius}%</span>
              </div>
              <input
                id="radius-slider"
                type="range"
                min={0}
                max={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                disabled={isBusy}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[11px] text-slate-400">0%</span>
                <span className="text-[11px] text-slate-400">50%</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setRadius(0)}
                disabled={isBusy}
                className={`px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                  isBusy
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : radius === 0
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                No rounding
              </button>
              <button
                type="button"
                onClick={() => setRadius(10)}
                disabled={isBusy}
                className={`px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                  isBusy
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : radius === 10
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                Slight
              </button>
              <button
                type="button"
                onClick={() => setRadius(25)}
                disabled={isBusy}
                className={`px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                  isBusy
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : radius === 25
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setRadius(50)}
                disabled={isBusy}
                className={`px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                  isBusy
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : radius === 50
                      ? 'bg-sky-600 text-white'
                      : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                Fully rounded
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="padding-slider">
                  Padding
                </label>
                <span className="text-sm font-medium text-sky-600 tabular-nums">{padding}px</span>
              </div>
              <input
                id="padding-slider"
                type="range"
                min={0}
                max={50}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                disabled={isBusy}
                className="w-full accent-sky-600"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[11px] text-slate-400">0px</span>
                <span className="text-[11px] text-slate-400">50px</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Background color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setBgColor('transparent')}
                  disabled={isBusy}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                    isBusy
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : bgColor === 'transparent'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Transparent
                </button>
                <button
                  type="button"
                  onClick={() => setBgColor('#FFFFFF')}
                  disabled={isBusy}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                    isBusy
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : bgColor === '#FFFFFF'
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  White
                </button>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200">
                  <input
                    type="color"
                    value={bgColor !== 'transparent' && bgColor !== '#FFFFFF' ? bgColor : '#000000'}
                    onChange={(e) => setBgColor(e.target.value)}
                    disabled={isBusy}
                    className="w-8 h-6 rounded border-0 cursor-pointer p-0 bg-transparent"
                  />
                  Custom
                </label>
              </div>
            </div>

            {status === 'processing' && (
              <div className="text-center py-3">
                <span className="text-sm text-slate-500">Rendering preview&hellip;</span>
              </div>
            )}
          </div>
        </ToolCard>
      )}

      {canDownload && (
        <ToolCard title="Download">
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Your image with rounded corners is ready. Download as a PNG with transparency
              preserved.
            </p>
            <ImageDownloadButton blob={output} fileName={getFileName()} />
          </div>
        </ToolCard>
      )}
    </div>
  );
}
