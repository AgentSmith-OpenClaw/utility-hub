'use client';

import React, { useState, useCallback, useRef } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import { loadImage } from '../../hooks/useImageCanvas';

interface PickedColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  hsl: { h: number; s: number; l: number };
}

type Status = 'idle' | 'loading' | 'ready' | 'error';

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function quantizeColor(r: number, g: number, b: number, bucketSize: number): string {
  const rb = Math.floor(r / bucketSize) * bucketSize;
  const gb = Math.floor(g / bucketSize) * bucketSize;
  const bb = Math.floor(b / bucketSize) * bucketSize;
  return `${rb},${gb},${bb}`;
}

export default function ImageColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<HTMLImageElement | null>(null);
  const [pickedColor, setPickedColor] = useState<PickedColor | null>(null);
  const [palette, setPalette] = useState<{ hex: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFiles = useCallback(async (incoming: File[]) => {
    const f = incoming[0];
    setFile(f);
    setStatus('loading');
    setError(null);
    setPickedColor(null);
    setPalette([]);
    setShowPalette(false);
    try {
      const img = await loadImage(f);
      setImageLoaded(img);
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0);
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
      setStatus('error');
    }
  }, []);

  const readPixelFromClick = useCallback((clientX: number, clientY: number) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const x = Math.floor(Math.max(0, Math.min(rect.width - 1, clientX - rect.left)) * scaleX);
    const y = Math.floor(Math.max(0, Math.min(rect.height - 1, clientY - rect.top)) * scaleY);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    setPickedColor({ r, g, b, hex: rgbToHex(r, g, b), hsl: rgbToHsl(r, g, b) });
  }, []);

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    readPixelFromClick(e.clientX, e.clientY);
  }, [readPixelFromClick]);

  const handleImageTouch = useCallback((e: React.TouchEvent<HTMLImageElement>) => {
    const touch = e.changedTouches[0];
    if (touch) readPixelFromClick(touch.clientX, touch.clientY);
  }, [readPixelFromClick]);

  const handleExtractPalette = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const colorMap = new Map<string, number>();
    const bucketSize = 32;
    const samples = 2500;
    const step = Math.max(1, Math.floor(Math.sqrt((width * height) / samples)));
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        const key = quantizeColor(data[idx], data[idx + 1], data[idx + 2], bucketSize);
        colorMap.set(key, (colorMap.get(key) ?? 0) + 1);
      }
    }
    const sorted = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => {
        const [rr, gg, bb] = key.split(',').map(Number);
        return { hex: rgbToHex(rr, gg, bb) };
      });
    setPalette(sorted);
    setShowPalette(true);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setImageLoaded(null);
    setPickedColor(null);
    setPalette([]);
    setShowPalette(false);
    setStatus('idle');
    setError(null);
  }, []);

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'idle' && (
        <ToolCard title="Upload an image">
          <ImageDropzone
            onFiles={handleFiles}
            label="Drop any image to pick and extract colors"
          />
        </ToolCard>
      )}

      {status === 'loading' && (
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

      {status === 'ready' && imageLoaded && file && (
        <>
          <ToolCard title="Click the image to pick a color" action={
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
            >
              Try another image
            </button>
          }>
            <div className="space-y-3">
              <ImagePreview file={file} dimensions={{ width: imageLoaded.naturalWidth, height: imageLoaded.naturalHeight }} />
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <img
                  ref={imageRef}
                  src={imageLoaded.src}
                  alt="Click to pick a color"
                  className="w-full h-auto block cursor-crosshair"
                  onClick={handleImageClick}
                  onTouchEnd={handleImageTouch}
                  draggable={false}
                />
              </div>
            </div>
          </ToolCard>

          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

          {pickedColor && (
            <ToolCard title="Picked color">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-slate-300 shadow-md ring-2 ring-sky-100"
                    style={{ backgroundColor: pickedColor.hex }}
                  />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Pixel</span>
                </div>
                <div className="flex-1 space-y-3 min-w-0 w-full">
                  <div className="flex items-center gap-3 group">
                    <span className="text-xs font-semibold text-slate-500 w-10 shrink-0">HEX</span>
                    <code className="flex-1 text-sm font-mono text-slate-800 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 select-all">
                      {pickedColor.hex}
                    </code>
                    <CopyButton value={pickedColor.hex} />
                  </div>
                  <div className="flex items-center gap-3 group">
                    <span className="text-xs font-semibold text-slate-500 w-10 shrink-0">RGB</span>
                    <code className="flex-1 text-sm font-mono text-slate-800 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 select-all">
                      rgb({pickedColor.r}, {pickedColor.g}, {pickedColor.b})
                    </code>
                    <CopyButton value={`rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`} />
                  </div>
                  <div className="flex items-center gap-3 group">
                    <span className="text-xs font-semibold text-slate-500 w-10 shrink-0">HSL</span>
                    <code className="flex-1 text-sm font-mono text-slate-800 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 select-all">
                      hsl({pickedColor.hsl.h}, {pickedColor.hsl.s}%, {pickedColor.hsl.l}%)
                    </code>
                    <CopyButton value={`hsl(${pickedColor.hsl.h}, ${pickedColor.hsl.s}%, ${pickedColor.hsl.l}%)`} />
                  </div>
                </div>
              </div>
            </ToolCard>
          )}

          <ToolCard title="Color palette">
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleExtractPalette}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors"
              >
                Extract Dominant Colors
              </button>

              {showPalette && palette.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {palette.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-lg border border-slate-200 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <code className="text-[11px] font-mono text-slate-600">{color.hex}</code>
                      <div className="-mt-1">
                        <CopyButton value={color.hex} label="" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-500">
                Scans the image at a regular grid and returns the 5 most frequent colors using color quantization.
              </p>
            </div>
          </ToolCard>
        </>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
          <span aria-hidden="true">&#9888;</span>
          {error}
        </div>
      )}
    </div>
  );
}
