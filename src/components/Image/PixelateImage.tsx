'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Mode = 'pixelate' | 'blur';
type Status = 'idle' | 'processing' | 'done' | 'error';

interface Selection {
  x: number;
  y: number;
  w: number;
  h: number;
}

function pixelateRegion(
  ctx: CanvasRenderingContext2D,
  srcCanvas: HTMLCanvasElement,
  sel: Selection,
  blockSize: number,
) {
  const smallW = Math.max(1, Math.floor(sel.w / blockSize));
  const smallH = Math.max(1, Math.floor(sel.h / blockSize));

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = smallW;
  tempCanvas.height = smallH;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.imageSmoothingEnabled = false;
  tempCtx.drawImage(srcCanvas, sel.x, sel.y, sel.w, sel.h, 0, 0, smallW, smallH);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, sel.x, sel.y, sel.w, sel.h);
}

function blurImageDataChunk(src: ImageData, radius: number): ImageData {
  const { data, width, height } = src;
  const result = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const idx = (ny * width + nx) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            a += data[idx + 3];
            count++;
          }
        }
      }
      const idx = (y * width + x) * 4;
      result[idx] = Math.round(r / count);
      result[idx + 1] = Math.round(g / count);
      result[idx + 2] = Math.round(b / count);
      result[idx + 3] = Math.round(a / count);
    }
  }

  return new ImageData(result, width, height);
}

export default function PixelateImage() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>('pixelate');
  const [intensity, setIntensity] = useState(10);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ w: number; h: number } | null>(null);
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayScaleRef = useRef(1);

  const computeDisplaySize = useCallback((imgW: number, imgH: number) => {
    const maxW = Math.min(900, window.innerWidth - 48);
    const maxH = Math.min(600, window.innerHeight * 0.6);
    const s = Math.min(maxW / imgW, maxH / imgH, 1);
    displayScaleRef.current = s;
    setDisplaySize({ w: Math.round(imgW * s), h: Math.round(imgH * s) });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (imgDimensions) {
        computeDisplaySize(imgDimensions.w, imgDimensions.h);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imgDimensions, computeDisplaySize]);

  const drawSelectionOnOverlay = useCallback(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay || !imgDimensions) return;
    const ctx = overlay.getContext('2d')!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    if (!selection || selection.w <= 0 || selection.h <= 0) return;
    ctx.save();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
    ctx.restore();
  }, [selection, imgDimensions]);

  useEffect(() => {
    drawSelectionOnOverlay();
  }, [drawSelectionOnOverlay]);

  const handleFiles = useCallback(
    async (incoming: File[]) => {
      if (incoming.length === 0) return;
      const f = incoming[0];

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      setFile(f);
      setSelection(null);
      setOutput(null);
      setStatus('idle');
      setError(null);

      try {
        const img = await loadImage(f);
        const canvas = drawToCanvas(img);
        setImgDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        setOriginalCanvas(canvas);

        const url = canvas.toDataURL('image/png');
        setPreviewUrl(url);

        computeDisplaySize(img.naturalWidth, img.naturalHeight);

        requestAnimationFrame(() => {
          const displayCanvas = displayCanvasRef.current;
          const overlay = overlayCanvasRef.current;
          if (displayCanvas) {
            displayCanvas.width = img.naturalWidth;
            displayCanvas.height = img.naturalHeight;
            const ctx = displayCanvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);
          }
          if (overlay) {
            overlay.width = img.naturalWidth;
            overlay.height = img.naturalHeight;
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load image');
      }
    },
    [previewUrl, computeDisplaySize],
  );

  const redrawDisplay = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;
    const ctx = displayCanvas.getContext('2d')!;
    if (originalCanvas) {
      ctx.drawImage(originalCanvas, 0, 0);
    }
  }, [originalCanvas]);

  const handleApply = useCallback(async () => {
    if (!file || !originalCanvas || !selection) return;
    setStatus('processing');
    setError(null);

    try {
      const displayCanvas = displayCanvasRef.current;
      if (!displayCanvas) throw new Error('Canvas not ready');
      const ctx = displayCanvas.getContext('2d')!;

      ctx.drawImage(originalCanvas, 0, 0);

      if (mode === 'pixelate') {
        pixelateRegion(ctx, originalCanvas, selection, intensity);
      } else {
        const imageData = ctx.getImageData(
          Math.round(selection.x),
          Math.round(selection.y),
          Math.round(selection.w),
          Math.round(selection.h),
        );
        const blurred = blurImageDataChunk(imageData, intensity);
        ctx.putImageData(blurred, Math.round(selection.x), Math.round(selection.y));
      }

      const mimeType = file.type && file.type.startsWith('image/') ? file.type : 'image/png';
      const blob = await canvasToBlob(displayCanvas, mimeType);
      setOutput(blob);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
      setStatus('error');
    }
  }, [file, originalCanvas, selection, mode, intensity]);

  const handleUndo = useCallback(() => {
    redrawDisplay();
    setOutput(null);
    setStatus('idle');
  }, [redrawDisplay]);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setSelection(null);
    setOriginalCanvas(null);
    setOutput(null);
    setPreviewUrl(null);
    setStatus('idle');
    setError(null);
    setImgDimensions(null);
    setDisplaySize({ w: 0, h: 0 });
  }, [previewUrl]);

  const handleSelectAll = useCallback(() => {
    if (!imgDimensions) return;
    setSelection({ x: 0, y: 0, w: imgDimensions.w, h: imgDimensions.h });
  }, [imgDimensions]);

  const getFileName = (): string => {
    if (!file) return 'pixelated-image.png';
    const base = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
    const ext = file.name.includes('.') ? file.name.split('.').pop()! : 'png';
    return `${base}-${mode}.${ext}`;
  };

  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const dragRef = useRef<{ active: boolean; startX: number; startY: number }>({
    active: false,
    startX: 0,
    startY: 0,
  });
  const [dragRect, setDragRect] = useState<Selection | null>(null);

  const drawDragOnOverlay = useCallback(
    (sel: Selection | null) => {
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext('2d')!;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (!sel || sel.w <= 0 || sel.h <= 0) {
        if (selection && selection.w > 0 && selection.h > 0) {
          ctx.save();
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 4]);
          ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
          ctx.restore();
        }
        return;
      }

      ctx.save();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(sel.x, sel.y, sel.w, sel.h);
      ctx.restore();
    },
    [selection],
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!file) return;
      e.preventDefault();
      const coords = getCanvasCoords(e.clientX, e.clientY);
      dragRef.current = { active: true, startX: coords.x, startY: coords.y };
      setDragRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
    },
    [file, getCanvasCoords],
  );

  useEffect(() => {
    if (!file) return;

    const handleMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const sel: Selection = {
        x: Math.min(dragRef.current.startX, coords.x),
        y: Math.min(dragRef.current.startY, coords.y),
        w: Math.abs(coords.x - dragRef.current.startX),
        h: Math.abs(coords.y - dragRef.current.startY),
      };
      setDragRect(sel);
      drawDragOnOverlay(sel);
    };

    const handleUp = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const sel: Selection = {
        x: Math.min(dragRef.current.startX, coords.x),
        y: Math.min(dragRef.current.startY, coords.y),
        w: Math.abs(coords.x - dragRef.current.startX),
        h: Math.abs(coords.y - dragRef.current.startY),
      };
      setDragRect(null);
      if (sel.w >= 5 && sel.h >= 5) {
        setSelection(sel);
      }
      drawDragOnOverlay(null);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [file, getCanvasCoords, drawDragOnOverlay]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!file) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const coords = getCanvasCoords(touch.clientX, touch.clientY);
      dragRef.current = { active: true, startX: coords.x, startY: coords.y };
      setDragRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
    },
    [file, getCanvasCoords],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!dragRef.current.active) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const coords = getCanvasCoords(touch.clientX, touch.clientY);
      const sel: Selection = {
        x: Math.min(dragRef.current.startX, coords.x),
        y: Math.min(dragRef.current.startY, coords.y),
        w: Math.abs(coords.x - dragRef.current.startX),
        h: Math.abs(coords.y - dragRef.current.startY),
      };
      setDragRect(sel);
      drawDragOnOverlay(sel);
    },
    [getCanvasCoords, drawDragOnOverlay],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      const touch = e.changedTouches[0];
      if (!touch) return;
      const coords = getCanvasCoords(touch.clientX, touch.clientY);
      const sel: Selection = {
        x: Math.min(dragRef.current.startX, coords.x),
        y: Math.min(dragRef.current.startY, coords.y),
        w: Math.abs(coords.x - dragRef.current.startX),
        h: Math.abs(coords.y - dragRef.current.startY),
      };
      setDragRect(null);
      if (sel.w >= 5 && sel.h >= 5) {
        setSelection(sel);
      }
      drawDragOnOverlay(null);
    },
    [getCanvasCoords, drawDragOnOverlay],
  );

  const isBusy = status === 'processing';

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      <ToolCard title="Upload image">
        <ImageDropzone
          onFiles={handleFiles}
          multiple={false}
          label="Drop an image to pixelate or blur specific areas — JPG, PNG, WebP, etc."
        />
      </ToolCard>

      {file && imgDimensions && (
        <ToolCard
          title="Workspace"
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
          <div className="space-y-4">
            <ImagePreview file={file} dimensions={{ width: imgDimensions.w, height: imgDimensions.h }} />

            <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
              <div className="relative inline-block" style={{ maxWidth: '100%' }}>
                <canvas
                  ref={displayCanvasRef}
                  style={{
                    width: displaySize.w || undefined,
                    height: displaySize.h || undefined,
                    maxWidth: '100%',
                    display: 'block',
                  }}
                  onMouseDown={handlePointerDown}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                <canvas
                  ref={overlayCanvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: displaySize.w || undefined,
                    height: displaySize.h || undefined,
                    maxWidth: '100%',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 w-14">Mode</span>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setMode('pixelate')}
                    disabled={isBusy}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors min-h-[44px] flex items-center ${
                      mode === 'pixelate'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-sky-600'
                    }`}
                  >
                    Pixelate
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('blur')}
                    disabled={isBusy}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors min-h-[44px] flex items-center ${
                      mode === 'blur'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-sky-600'
                    }`}
                  >
                    Blur
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 w-14">
                  {mode === 'pixelate' ? 'Block size' : 'Radius'}
                </span>
                <input
                  type="range"
                  min={1}
                  max={mode === 'pixelate' ? 50 : 20}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  disabled={isBusy}
                  className="flex-1 accent-sky-600 min-h-[44px]"
                />
                <span className="text-xs font-medium text-slate-500 w-8 text-right">{intensity}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  disabled={isBusy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[44px] disabled:opacity-40"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isBusy || !selection}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all min-h-[44px]"
                >
                  {isBusy ? 'Processing...' : 'Apply to Selection'}
                </button>
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={isBusy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 min-h-[44px] disabled:opacity-40"
                >
                  Undo
                </button>
              </div>

              {selection && (
                <p className="text-xs text-slate-500">
                  Selection: {Math.round(selection.w)} × {Math.round(selection.h)} px
                </p>
              )}

              {!selection && (
                <p className="text-xs text-slate-400">
                  Draw a rectangle on the image to select the area to {mode}
                </p>
              )}
            </div>

            {status === 'processing' && (
              <div className="text-center py-3">
                <span className="text-sm text-slate-500">Processing...</span>
              </div>
            )}
          </div>
        </ToolCard>
      )}

      {status === 'done' && output && (
        <ToolCard title="Download">
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Your image has been {mode === 'pixelate' ? 'pixelated' : 'blurred'}. Click below to
              download the result.
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
