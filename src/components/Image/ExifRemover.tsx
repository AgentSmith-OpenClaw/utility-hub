'use client';

import React, { useState, useCallback } from 'react';
import { ToolCard } from '../Tools/ToolShell';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import ImageDownloadButton from './ImageDownloadButton';
import { loadImage, drawToCanvas, canvasToBlob } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'analyzing' | 'processing' | 'done' | 'error';

interface OutputItem {
  name: string;
  blob: Blob;
  originalSize: number;
  newSize: number;
  savings: number;
  exifInfo: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readStr(view: DataView, offset: number, length: number): string {
  let s = '';
  for (let i = 0; i < length; i++) {
    const c = view.getUint8(offset + i);
    if (c === 0) break;
    s += String.fromCharCode(c);
  }
  return s.trim();
}

function parseExifDetails(view: DataView, tiffStart: number, isLe: boolean, maxOffset: number): string[] {
  const details: string[] = [];
  const get16 = (o: number) => (isLe ? view.getUint16(o, true) : view.getUint16(o, false));
  const get32 = (o: number) => (isLe ? view.getUint32(o, true) : view.getUint32(o, false));

  let ifdOffset = tiffStart + (isLe ? view.getUint32(tiffStart + 4, true) : view.getUint32(tiffStart + 4, false));
  if (ifdOffset < 0 || ifdOffset >= maxOffset) return details;

  let gpsIfd: number | null = null;
  let exifIfd: number | null = null;

  // Parse IFD0
  const tags0 = new Map<number, string>();
  const entryCount = get16(ifdOffset);
  for (let i = 0; i < entryCount; i++) {
    const entryOff = ifdOffset + 2 + i * 12;
    if (entryOff + 12 > maxOffset) break;
    const tag = get16(entryOff);
    const type = get16(entryOff + 2);
    const count = get32(entryOff + 4);
    const valueOffset = entryOff + 8;

    if (tag === 0x010F && type === 2) {
      // Make
      const len = Math.min(count, 4);
      const val = readStr(view, valueOffset, len <= 4 ? len : 4);
      if (val) tags0.set(tag, val);
    } else if (tag === 0x0110 && type === 2) {
      // Model
      const len = Math.min(count, 4);
      const val = readStr(view, valueOffset, len <= 4 ? len : 4);
      if (val) tags0.set(tag, val);
    } else if (tag === 0x0132 && type === 2) {
      const val = readStr(view, valueOffset, Math.min(count, 4));
      if (val) details.push(`Date: ${val.replace(/\0/g, '')}`);
    } else if (tag === 0x8825) {
      // GPS IFD pointer
      gpsIfd = get32(valueOffset);
    } else if (tag === 0x8769) {
      // Exif IFD pointer
      exifIfd = get32(valueOffset);
    }
  }

  if (tags0.has(0x010F) || tags0.has(0x0110)) {
    const make = tags0.get(0x010F) || '';
    const model = tags0.get(0x0110) || '';
    const camera = [make, model].filter(Boolean).join(' ');
    if (camera) details.push(`Camera: ${camera}`);
  }

  // Parse Exif sub-IFD for DateTimeOriginal
  if (exifIfd !== null && exifIfd > 0 && exifIfd < maxOffset) {
    const subCount = get16(exifIfd);
    for (let i = 0; i < subCount; i++) {
      const entryOff = exifIfd + 2 + i * 12;
      if (entryOff + 12 > maxOffset) break;
      const tag = get16(entryOff);
      const type = get16(entryOff + 2);
      const count = get32(entryOff + 4);
      const valueOffset = entryOff + 8;
      if (tag === 0x9003 && type === 2) {
        const val = readStr(view, valueOffset, Math.min(count, 4));
        if (val) details.push(`Date: ${val.replace(/\0/g, '')}`);
        break;
      }
    }
  }

  // Check GPS
  if (gpsIfd !== null && gpsIfd > 0 && gpsIfd < maxOffset) {
    const gpsCount = get16(gpsIfd);
    let hasGps = false;
    for (let i = 0; i < gpsCount; i++) {
      const entryOff = gpsIfd + 2 + i * 12;
      if (entryOff + 12 > maxOffset) break;
      const tag = get16(entryOff);
      if (tag >= 0x0001 && tag <= 0x0004) {
        hasGps = true;
        break;
      }
    }
    if (hasGps) details.push('GPS coordinates');
  }

  return details;
}

async function analyzeExifFile(file: File): Promise<string> {
  const isJpeg =
    file.type === 'image/jpeg' ||
    file.name.toLowerCase().endsWith('.jpg') ||
    file.name.toLowerCase().endsWith('.jpeg');

  if (!isJpeg) {
    const ext = file.name.includes('.') ? file.name.split('.').pop()!.toUpperCase() : (file.type || 'image');
    return `EXIF is JPEG-specific. This ${ext} file may contain other metadata, which will be stripped during re-encoding.`;
  }

  try {
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength < 4) return 'Not a valid JPEG file';
    const view = new DataView(buffer);
    if (view.getUint16(0) !== 0xFFD8) return 'Not a valid JPEG file';

    let offset = 2;
    while (offset < buffer.byteLength - 2) {
      const marker = view.getUint16(offset);

      if (marker === 0xFFE1) {
        // APP1 — check for EXIF identifier
        if (offset + 10 >= buffer.byteLength) break;
        const id = String.fromCharCode(
          view.getUint8(offset + 4),
          view.getUint8(offset + 5),
          view.getUint8(offset + 6),
          view.getUint8(offset + 7),
        );
        if (id === 'Exif' && view.getUint8(offset + 8) === 0 && view.getUint8(offset + 9) === 0) {
          const tiffStart = offset + 10;
          if (tiffStart + 8 > buffer.byteLength) break;
          const byteOrder = String.fromCharCode(view.getUint8(tiffStart), view.getUint8(tiffStart + 1));
          if (byteOrder === 'II' || byteOrder === 'MM') {
            const details = parseExifDetails(view, tiffStart, byteOrder === 'II', buffer.byteLength);
            if (details.length > 0) {
              return `Contains EXIF data: ${details.join('; ')}`;
            }
            return 'Contains EXIF data';
          }
          return 'Contains EXIF data';
        }
      }

      if (marker >= 0xFFE0 && marker <= 0xFFEF) {
        offset += 2 + view.getUint16(offset + 2);
      } else if ((marker & 0xFF00) === 0xFF00) {
        if (marker === 0xFFDA) break;
        offset += 2 + view.getUint16(offset + 2);
      } else {
        break;
      }
    }

    return 'No EXIF data found';
  } catch {
    return 'Could not analyze file';
  }
}

export default function ExifRemover() {
  const [status, setStatus] = useState<Status>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [exifInfoMap, setExifInfoMap] = useState<Record<string, string>>({});
  const [zipping, setZipping] = useState(false);

  const handleFiles = useCallback(
    async (incoming: File[]) => {
      const combined = [...files, ...incoming];
      setFiles(combined);
      setOutputs([]);
      setError(null);
      setStatus('analyzing');
      setProgress(0);

      const infoMap: Record<string, string> = { ...exifInfoMap };

      for (let i = 0; i < combined.length; i++) {
        setProgress(i + 1);
        const file = combined[i];
        const key = `${file.name}-${file.size}`;
        if (infoMap[key]) continue;
        const info = await analyzeExifFile(file);
        infoMap[key] = info;
      }

      setExifInfoMap(infoMap);
      setStatus('idle');
    },
    [files, exifInfoMap],
  );

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const infoMap: Record<string, string> = {};
      for (const f of next) {
        const key = `${f.name}-${f.size}`;
        if (exifInfoMap[key]) infoMap[key] = exifInfoMap[key];
      }
      setExifInfoMap(infoMap);
      return next;
    });
    setOutputs([]);
    setStatus('idle');
  }, [exifInfoMap]);

  const handleRemoveExif = useCallback(async () => {
    if (files.length === 0) return;
    setStatus('processing');
    setError(null);
    setOutputs([]);

    const results: OutputItem[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgress(i + 1);
      const file = files[i];
      const key = `${file.name}-${file.size}`;

      try {
        const img = await loadImage(file);
        const isJpeg =
          file.type === 'image/jpeg' ||
          file.name.toLowerCase().endsWith('.jpg') ||
          file.name.toLowerCase().endsWith('.jpeg');
        const canvas = drawToCanvas(img);
        const mime = isJpeg ? 'image/jpeg' : 'image/png';
        const blob = await canvasToBlob(canvas, mime, 0.92);

        const ext = file.name.includes('.') ? file.name.split('.').pop()! : (isJpeg ? 'jpg' : 'png');
        const baseName = file.name.includes('.')
          ? file.name.slice(0, file.name.lastIndexOf('.'))
          : file.name;
        const outName = `${baseName}-no-exif.${ext}`;

        const savings = file.size > 0 ? Math.round((1 - blob.size / file.size) * 100) : 0;

        results.push({
          name: outName,
          blob,
          originalSize: file.size,
          newSize: blob.size,
          savings,
          exifInfo: exifInfoMap[key] || 'Unknown',
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to process ${file.name}: ${msg}`);
      }
    }

    setOutputs(results);
    if (results.length > 0) setStatus('done');
    else if (error) setStatus('error');
  }, [files, exifInfoMap, error]);

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
      a.download = 'exif-removed-images.zip';
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
    setExifInfoMap({});
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, []);

  const isBusy = status === 'analyzing' || status === 'processing';
  const canRemove = status === 'idle' && files.length > 0;

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'done' ? (
        <ToolCard
          title="Results — EXIF removed"
          action={
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
            >
              Start over
            </button>
          }
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <span aria-hidden="true">✓</span>
              <span>
                {outputs.length} image{outputs.length !== 1 ? 's' : ''} ready — EXIF stripped, no upload
              </span>
            </div>

            <div className="space-y-2">
              {outputs.map((o) => (
                <div
                  key={o.name}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{o.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{o.exifInfo}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-500">
                        {formatBytes(o.originalSize)}
                        <span className="mx-1 text-slate-300">→</span>
                        {formatBytes(o.newSize)}
                      </span>
                      {o.savings > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          −{o.savings}% smaller
                        </span>
                      )}
                      {o.savings <= 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          Size similar
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ImageDownloadButton blob={o.blob} fileName={o.name} />
                  </div>
                </div>
              ))}
            </div>

            {outputs.length > 1 && (
              <div className="pt-3 flex justify-center">
                <button
                  type="button"
                  onClick={handleDownloadZip}
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
              label="JPG, PNG, WebP, GIF, BMP — up to 50 MB each. Strip GPS and camera metadata before sharing."
            />
          </ToolCard>

          {files.length > 0 && (
            <ToolCard
              title={`${files.length} image${files.length === 1 ? '' : 's'} selected`}
              action={
                status === 'idle' ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
                  >
                    Clear all
                  </button>
                ) : undefined
              }
            >
              <div className="space-y-2">
                {files.map((f, i) => {
                  const key = `${f.name}-${f.size}`;
                  const exifInfo = exifInfoMap[key];
                  const hasExif = exifInfo?.startsWith('Contains EXIF');
                  const isJpeg =
                    f.type === 'image/jpeg' ||
                    f.name.toLowerCase().endsWith('.jpg') ||
                    f.name.toLowerCase().endsWith('.jpeg');

                  return (
                    <div key={`${f.name}-${f.size}-${i}`} className="space-y-1">
                      <div className="flex items-center gap-2">
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

                      {exifInfo && (
                        <div
                          className={`flex items-start gap-2 px-3 py-1.5 rounded-lg text-xs ml-[76px] ${
                            hasExif
                              ? 'bg-amber-50 border border-amber-200 text-amber-800'
                              : isJpeg
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                              : 'bg-slate-50 border border-slate-200 text-slate-600'
                          }`}
                        >
                          <span aria-hidden="true">
                            {hasExif ? '📍' : isJpeg ? '✓' : 'ℹ️'}
                          </span>
                          <span>{exifInfo}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {status === 'idle' && files.length > 0 && (
                <div className="mt-2">
                  <ImageDropzone onFiles={handleFiles} multiple compact />
                </div>
              )}
            </ToolCard>
          )}

          {status === 'analyzing' && (
            <ToolCard title="Analyzing EXIF data…">
              <div className="space-y-4">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${files.length > 0 ? (progress / files.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Scanning {progress} of {files.length} for EXIF metadata…
                </p>
              </div>
            </ToolCard>
          )}

          {canRemove && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-800">
                <span aria-hidden="true">🔒</span>
                <span>
                  Re-encoding strips all EXIF data — GPS location, camera model, and date metadata are permanently removed.
                  Your original file is never modified.
                </span>
              </div>

              <button
                type="button"
                onClick={handleRemoveExif}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-lg text-sm font-bold transition-colors bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800"
              >
                🔒 Remove EXIF from {files.length === 1 ? 'Image' : `${files.length} Images`}
              </button>
            </div>
          )}

          {status === 'processing' && (
            <ToolCard title="Removing EXIF data…">
              <div className="space-y-4">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${files.length > 0 ? (progress / files.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Processing {progress} of {files.length}…
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
