'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'processing' | 'done' | 'error';
type WatermarkType = 'text' | 'image';

const POSITIONS = [
  { key: 'TL', label: 'TL' },
  { key: 'TC', label: 'TC' },
  { key: 'TR', label: 'TR' },
  { key: 'ML', label: 'ML' },
  { key: 'MC', label: 'MC' },
  { key: 'MR', label: 'MR' },
  { key: 'BL', label: 'BL' },
  { key: 'BC', label: 'BC' },
  { key: 'BR', label: 'BR' },
] as const;

type PositionKey = (typeof POSITIONS)[number]['key'];

function getTextAlign(pos: PositionKey): CanvasTextAlign {
  if (pos[1] === 'L') return 'left';
  if (pos[1] === 'R') return 'right';
  return 'center';
}

function getImageCoords(
  pos: PositionKey,
  canvasW: number,
  canvasH: number,
  elemW: number,
  elemH: number,
  padding = 30,
): { x: number; y: number } {
  let x: number;
  if (pos[1] === 'L') x = padding;
  else if (pos[1] === 'R') x = canvasW - padding - elemW;
  else x = (canvasW - elemW) / 2;

  let y: number;
  if (pos[0] === 'T') y = padding;
  else if (pos[0] === 'B') y = canvasH - padding - elemH;
  else y = (canvasH - elemH) / 2;

  return { x, y };
}

export default function ImageWatermark() {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkImage, setWatermarkImageFile] = useState<File | null>(null);
  const [opacity, setOpacity] = useState(30);
  const [position, setPosition] = useState<PositionKey>('MC');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#ffffff');
  const [tiled, setTiled] = useState(false);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [scale, setScale] = useState(50);
  const [output, setOutput] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const watermarkImgRef = useRef<HTMLImageElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFiles = useCallback((incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;
    setFile(f);
    setOutput(null);
    setError(null);
    setStatus('idle');
    setPreviewUrl('');

    const dotIdx = f.name.lastIndexOf('.');
    const baseName = dotIdx > 0 ? f.name.slice(0, dotIdx) : f.name;
    const ext = dotIdx > 0 ? f.name.slice(dotIdx) : '.jpg';
    setFileName(`${baseName}-watermarked${ext}`);

    loadImage(f)
      .then((img) => {
        imgRef.current = img;
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      })
      .catch(() => {
        setError('Failed to load image');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    if (!watermarkImage) {
      watermarkImgRef.current = null;
      return;
    }
    const url = URL.createObjectURL(watermarkImage);
    const img = new Image();
    img.onload = () => {
      watermarkImgRef.current = img;
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError('Failed to load watermark image');
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [watermarkImage]);

  const renderWatermark = useCallback((): HTMLCanvasElement | null => {
    const img = imgRef.current;
    if (!img || !file) return null;

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(img, 0, 0);

    if (watermarkType === 'text' && watermarkText) {
      ctx.globalAlpha = opacity / 100;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = textColor;

      if (tiled) {
        const stepX = canvas.width / 3;
        const stepY = canvas.height / 3;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            ctx.textAlign = 'center';
            ctx.fillText(watermarkText, col * stepX, row * stepY + fontSize);
          }
        }
      } else {
        ctx.textAlign = getTextAlign(position as PositionKey);

        let x: number;
        if (position[1] === 'L') x = 30;
        else if (position[1] === 'R') x = canvas.width - 30;
        else x = canvas.width / 2;

        let y: number;
        if (position[0] === 'T') y = 30 + fontSize;
        else if (position[0] === 'B') y = canvas.height - 30;
        else y = canvas.height / 2;

        ctx.fillText(watermarkText, x, y);
      }
    } else if (watermarkType === 'image' && watermarkImgRef.current) {
      const wmImg = watermarkImgRef.current;
      const wmW = (wmImg.naturalWidth * scale) / 100;
      const wmH = (wmImg.naturalHeight * scale) / 100;

      ctx.globalAlpha = opacity / 100;

      if (tiled) {
        const stepX = Math.max(wmW + 40, 100);
        const stepY = Math.max(wmH + 40, 100);
        for (let y = 0; y < canvas.height; y += stepY) {
          for (let x = 0; x < canvas.width; x += stepX) {
            ctx.drawImage(wmImg, x, y, wmW, wmH);
          }
        }
      } else {
        const coords = getImageCoords(position as PositionKey, canvas.width, canvas.height, wmW, wmH);
        ctx.drawImage(wmImg, coords.x, coords.y, wmW, wmH);
      }
    }

    ctx.globalAlpha = 1;
    return canvas;
  }, [file, watermarkText, opacity, position, fontSize, textColor, tiled, watermarkType, scale, watermarkImage]);

  useEffect(() => {
    if (!file || !imgRef.current) return;
    if (watermarkType === 'image' && !watermarkImgRef.current && !tiled) {
      return;
    }
    const timer = setTimeout(() => {
      const canvas = renderWatermark();
      if (canvas) {
        setPreviewUrl(canvas.toDataURL('image/png'));
        outputCanvasRef.current = canvas;
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [renderWatermark, file, watermarkType, tiled]);

  const handleApply = useCallback(async () => {
    if (!file) return;
    setStatus('processing');
    setError(null);

    try {
      const canvas = outputCanvasRef.current || renderWatermark();
      if (!canvas) throw new Error('Failed to render watermark');

      const mimeType = file.type || 'image/png';
      const blob = await canvasToBlob(canvas, mimeType, 0.92);
      setOutput(blob);
      setStatus('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to apply watermark';
      setError(msg);
      setStatus('error');
    }
  }, [file, renderWatermark]);

  const handleReset = useCallback(() => {
    setFile(null);
    setDimensions(null);
    setWatermarkText('');
    setWatermarkImageFile(null);
    setOpacity(30);
    setPosition('MC');
    setFontSize(24);
    setTextColor('#ffffff');
    setTiled(false);
    setWatermarkType('text');
    setScale(50);
    setOutput(null);
    setPreviewUrl('');
    setError(null);
    setStatus('idle');
    setFileName('');
    imgRef.current = null;
    watermarkImgRef.current = null;
    outputCanvasRef.current = null;
  }, []);

  const handleWatermarkImageUpload = useCallback((files: File[]) => {
    const f = files[0];
    if (f) setWatermarkImageFile(f);
  }, []);

  const canApply = status === 'idle' && file !== null;
  const canApplyDisabled = !canApply || !(watermarkType === 'text' ? watermarkText : watermarkImage);

  return (
    <div className="space-y-4 sm:space-y-6">
      <ImageTrustBadge />

      {status === 'done' && output ? (
        <ToolCard
          title="Watermark applied"
          action={
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
            >
              Watermark another image
            </button>
          }
        >
          <div className="space-y-4">
            {previewUrl && (
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img src={previewUrl} alt="Watermarked preview" className="w-full h-auto" />
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span aria-hidden="true">✓</span>
              <span>Watermark applied successfully</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label htmlFor="watermark-filename" className="sr-only">
                  Filename
                </label>
                <input
                  id="watermark-filename"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                />
              </div>
              <ImageDownloadButton blob={output} fileName={fileName} />
            </div>
          </div>
        </ToolCard>
      ) : (
        <>
          {file && dimensions ? (
            <>
              <ToolCard
                title="Image loaded"
                action={
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Remove
                  </button>
                }
              >
                <ImagePreview file={file} dimensions={dimensions} />
              </ToolCard>

              <ToolCard title="Watermark type">
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                  {(['text', 'image'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWatermarkType(t)}
                      className={`flex-1 px-4 py-2.5 min-h-[44px] text-sm font-semibold transition-colors ${
                        watermarkType === t
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t === 'text' ? 'Text' : 'Image'}
                    </button>
                  ))}
                </div>
              </ToolCard>

              <ToolCard title="Watermark settings">
                {watermarkType === 'text' ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="watermark-text" className="block text-sm font-medium text-slate-700 mb-1">
                        Watermark text
                      </label>
                      <input
                        id="watermark-text"
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="© Company Name, CONFIDENTIAL, etc."
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label htmlFor="font-size" className="block text-sm font-medium text-slate-700 mb-1">
                        Font size: {fontSize}px
                      </label>
                      <input
                        id="font-size"
                        type="range"
                        min={8}
                        max={72}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-sky-600"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>8px</span>
                        <span>72px</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label htmlFor="text-color" className="text-sm font-medium text-slate-700">
                        Color
                      </label>
                      <input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <span className="text-xs text-slate-500">{textColor}</span>
                    </div>

                    <div>
                      <label htmlFor="text-opacity" className="block text-sm font-medium text-slate-700 mb-1">
                        Opacity: {opacity}%
                      </label>
                      <input
                        id="text-opacity"
                        type="range"
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-sky-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Watermark image</label>
                      {watermarkImage ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                          <span className="text-sm text-slate-600 truncate flex-1">{watermarkImage.name}</span>
                          <button
                            type="button"
                            onClick={() => setWatermarkImageFile(null)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700 min-h-[44px] px-2"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <ImageDropzone
                          onFiles={handleWatermarkImageUpload}
                          label="PNG with transparency recommended"
                          compact
                        />
                      )}
                    </div>

                    <div>
                      <label htmlFor="wm-opacity" className="block text-sm font-medium text-slate-700 mb-1">
                        Opacity: {opacity}%
                      </label>
                      <input
                        id="wm-opacity"
                        type="range"
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-sky-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="wm-scale" className="block text-sm font-medium text-slate-700 mb-1">
                        Scale: {scale}%
                      </label>
                      <input
                        id="wm-scale"
                        type="range"
                        min={10}
                        max={100}
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full accent-sky-600"
                      />
                    </div>
                  </div>
                )}
              </ToolCard>

              <ToolCard title="Position">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {POSITIONS.map((pos) => {
                      const isActive = position === pos.key && !tiled;
                      const titles: Record<PositionKey, string> = {
                        TL: 'Top Left', TC: 'Top Center', TR: 'Top Right',
                        ML: 'Middle Left', MC: 'Middle Center', MR: 'Middle Right',
                        BL: 'Bottom Left', BC: 'Bottom Center', BR: 'Bottom Right',
                      };
                      return (
                        <button
                          key={pos.key}
                          type="button"
                          onClick={() => {
                            setPosition(pos.key);
                            setTiled(false);
                          }}
                          className={`px-3 py-2.5 min-h-[44px] rounded-lg text-xs font-semibold transition-colors ${
                            isActive
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={titles[pos.key]}
                        >
                          {pos.key}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTiled(!tiled)}
                    className={`w-full px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                      tiled
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tiled (repeat across image)
                  </button>
                </div>
              </ToolCard>

              {previewUrl && (
                <ToolCard title="Preview">
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={previewUrl} alt="Watermark preview" className="w-full h-auto" />
                  </div>
                </ToolCard>
              )}
            </>
          ) : (
            <ToolCard title="Upload an image">
              <ImageDropzone onFiles={handleFiles} label="JPG, PNG, WebP, GIF, BMP — up to 50 MB" />
            </ToolCard>
          )}

          {canApply && (
            <button
              type="button"
              onClick={handleApply}
              disabled={canApplyDisabled}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                !canApplyDisabled
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              💧 Apply Watermark
            </button>
          )}

          {status === 'processing' && (
            <ToolCard title="Applying watermark…">
              <div className="flex items-center gap-3 py-4">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-slate-600">Applying watermark to image…</span>
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
