'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImageDownloadButton from './ImageDownloadButton';
import { ToolCard } from '../Tools/ToolShell';
import { loadImage, canvasToBlob } from '../../hooks/useImageCanvas';

interface CropArea {
  unit: '%' | 'px';
  x: number;
  y: number;
  width: number;
  height: number;
}

type Status = 'idle' | 'loading-lib' | 'cropping' | 'done' | 'error';
type OutputFormat = 'original' | 'jpeg' | 'png' | 'webp';

interface AspectPresetItem {
  key: string;
  label: string;
  value: number | undefined;
  display: string;
}

const ASPECT_PRESETS: AspectPresetItem[] = [
  { key: 'free', label: 'Free', value: undefined, display: 'Free' },
  { key: '1:1', label: 'Square', value: 1, display: '1:1' },
  { key: '16:9', label: '16:9', value: 16 / 9, display: '16:9 Landscape' },
  { key: '9:16', label: '9:16', value: 9 / 16, display: '9:16 Portrait' },
  { key: '4:3', label: '4:3', value: 4 / 3, display: '4:3 Classic' },
  { key: '4:5', label: 'Instagram', value: 4 / 5, display: '4:5 Instagram' },
  { key: 'fb-cover', label: 'FB Cover', value: 820 / 312, display: '820:312 FB Cover' },
  { key: 'yt-thumb', label: 'YT Thumb', value: 1280 / 720, display: '1280:720 YT' },
];

function getOutputMime(originalType: string, format: OutputFormat): string {
  if (format !== 'original') return `image/${format}`;
  if (originalType === 'image/png') return 'image/png';
  if (originalType === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}

function getDownloadName(originalName: string, format: OutputFormat): string {
  const dotIdx = originalName.lastIndexOf('.');
  const baseName = dotIdx > 0 ? originalName.slice(0, dotIdx) : originalName;
  const origExt = dotIdx > 0 ? originalName.slice(dotIdx) : '.jpg';
  const extMap: Record<string, string> = {
    jpeg: '.jpg',
    png: '.png',
    webp: '.webp',
  };
  const ext = format === 'original' ? origExt : extMap[format] || '.jpg';
  return `${baseName}-cropped${ext}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CropImage() {
  const [ReactCrop, setReactCrop] = useState<React.ComponentType<any> | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<CropArea>({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<CropArea | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original');
  const [quality, setQuality] = useState(90);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const originalSizeRef = useRef<number>(0);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    import('react-image-crop')
      .then((mod) => {
        setReactCrop(() => mod.default);
      })
      .catch(() => {
        setError('Failed to load crop editor');
      });
    // @ts-ignore -- CSS module has no type declarations
    import('react-image-crop/dist/ReactCrop.css');
  }, []);

  const handleFiles = useCallback((incoming: File[]) => {
    const f = incoming[0];
    if (!f) return;

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    setFile(f);
    originalSizeRef.current = f.size;
    setOutput(null);
    setError(null);
    setStatus('idle');
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setCompletedCrop(null);
    setOutputFormat('original');
    setQuality(90);
    setAspect(undefined);

    const url = URL.createObjectURL(f);
    objectUrlRef.current = url;
    setImgSrc(url);
    setFileName(getDownloadName(f.name, 'original'));
  }, []);

  const handleAspectChange = useCallback((key: string) => {
    const preset = ASPECT_PRESETS.find((p) => p.key === key);
    if (!preset) return;
    setAspect(preset.value);
    setCrop((prev) => ({ ...prev, width: 50, height: 50, x: 25, y: 25 }));
    setCompletedCrop(null);
    setOutput(null);
    setStatus('idle');
  }, []);

  const handleFormatChange = useCallback(
    (fmt: OutputFormat) => {
      setOutputFormat(fmt);
      if (file) setFileName(getDownloadName(file.name, fmt));
    },
    [file],
  );

  const handleCropConfirm = useCallback(async () => {
    if (!file || !completedCrop) return;
    setStatus('cropping');
    setError(null);

    try {
      const img = await loadImage(file);
      imgRef.current = img;

      let cropX: number;
      let cropY: number;
      let cropW: number;
      let cropH: number;

      if (completedCrop.unit === '%') {
        cropX = (completedCrop.x / 100) * img.naturalWidth;
        cropY = (completedCrop.y / 100) * img.naturalHeight;
        cropW = (completedCrop.width / 100) * img.naturalWidth;
        cropH = (completedCrop.height / 100) * img.naturalHeight;
      } else {
        cropX = completedCrop.x;
        cropY = completedCrop.y;
        cropW = completedCrop.width;
        cropH = completedCrop.height;
      }

      cropW = Math.max(1, Math.round(cropW));
      cropH = Math.max(1, Math.round(cropH));
      cropX = Math.max(0, Math.min(cropX, img.naturalWidth - 1));
      cropY = Math.max(0, Math.min(cropY, img.naturalHeight - 1));

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const mimeType = getOutputMime(file.type, outputFormat);
      const qualityFraction =
        mimeType === 'image/jpeg' || mimeType === 'image/webp' ? quality / 100 : undefined;

      const blob = await canvasToBlob(canvas, mimeType, qualityFraction);
      setOutput(blob);
      setFileName(getDownloadName(file.name, outputFormat));
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Crop failed');
      setStatus('error');
    }
  }, [file, completedCrop, outputFormat, quality]);

  const handleReset = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFile(null);
    setImgSrc('');
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setAspect(undefined);
    setCompletedCrop(null);
    setOutput(null);
    setError(null);
    setStatus('idle');
    setFileName('');
    setOutputFormat('original');
    setQuality(90);
    imgRef.current = null;
    originalSizeRef.current = 0;
  }, []);

  const canCrop = status === 'idle' && file !== null && completedCrop !== null;
  const effectiveMime =
    outputFormat === 'original' ? file?.type || 'image/jpeg' : `image/${outputFormat}`;
  const showQuality = effectiveMime === 'image/jpeg' || effectiveMime === 'image/webp';

  return (
    <div className="space-y-4 sm:space-y-6">
      <ImageTrustBadge />

      {!ReactCrop && status !== 'done' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 text-slate-500">
            <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading crop editor…
          </div>
        </div>
      )}

      {status === 'done' && output ? (
        <ToolCard title="Crop complete" action={
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
          >
            Crop another image
          </button>
        }>
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span aria-hidden="true">✓</span>
              <span>
                Cropped image ready — {formatBytes(output.size)}
                {originalSizeRef.current > 0 && output.size < originalSizeRef.current &&
                  ` (${Math.round((1 - output.size / originalSizeRef.current) * 100)}% smaller)`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label htmlFor="crop-filename" className="sr-only">Filename</label>
                <input
                  id="crop-filename"
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
          {!file ? (
            <ToolCard title="Upload an image">
              <ImageDropzone
                onFiles={handleFiles}
                label="JPG, PNG, WebP, GIF, BMP — up to 50 MB"
              />
            </ToolCard>
          ) : (
            <>
              <ToolCard title="Crop image" action={
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                >
                  Remove
                </button>
              }>
                <div className="space-y-4">
                  {imgSrc && ReactCrop && (
                    <div className="max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      <ReactCrop
                        crop={crop}
                        onChange={(_px: CropArea, pct: CropArea) => {
                          setCrop(pct || _px);
                        }}
                        onComplete={(_px: CropArea, pct: CropArea) => {
                          setCompletedCrop(pct || _px);
                        }}
                        aspect={aspect}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc}
                          alt="Crop preview"
                          className="max-w-full max-h-[60vh] object-contain"
                        />
                      </ReactCrop>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    Drag the handles to select the area to keep. Move the selection by dragging inside the crop box.
                  </p>
                </div>
              </ToolCard>

              <ToolCard title="Aspect ratio">
                <div className="flex flex-wrap gap-2">
                  {ASPECT_PRESETS.map((preset) => {
                    const isActive = aspect === preset.value;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => handleAspectChange(preset.key)}
                        className={`px-3 py-2 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {preset.display}
                      </button>
                    );
                  })}
                </div>
              </ToolCard>

              <ToolCard title="Output format">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="crop-format-select" className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                    <select
                      id="crop-format-select"
                      value={outputFormat}
                      onChange={(e) => handleFormatChange(e.target.value as OutputFormat)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[44px]"
                    >
                      <option value="original">
                        Original ({file.type ? file.type.split('/')[1]?.toUpperCase() || 'JPEG' : 'JPEG'})
                      </option>
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>

                  {showQuality && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="crop-quality-slider" className="text-sm font-medium text-slate-700">Quality</label>
                        <span className="text-sm font-bold text-slate-800 tabular-nums">{quality}%</span>
                      </div>
                      <input
                        id="crop-quality-slider"
                        type="range"
                        min={1}
                        max={100}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-sky-600"
                      />
                      <p className="text-xs text-slate-500">
                        Higher quality = larger file. 90% is a good balance for most crops.
                      </p>
                    </div>
                  )}
                </div>
              </ToolCard>
            </>
          )}

          {status === 'idle' && file && completedCrop && (
            <button
              type="button"
              onClick={handleCropConfirm}
              disabled={!canCrop}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors ${
                canCrop
                  ? 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              ✂️ Crop Image
            </button>
          )}

          {status === 'cropping' && (
            <ToolCard title="Cropping…">
              <div className="flex items-center gap-3 py-4">
                <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-slate-600">Cropping image…</span>
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
