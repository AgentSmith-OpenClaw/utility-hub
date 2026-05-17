import React, { useState, useCallback, useRef, useEffect } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { ToolCard } from '../Tools/ToolShell';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'processing' | 'done' | 'error';
type PageSizeOption = 'fit' | 'letter' | 'a4' | 'legal';
type OrientationOption = 'auto' | 'portrait' | 'landscape';
type MarginMm = 0 | 12 | 25 | 40;

interface ImageFile {
  id: string;
  file: File;
  name: string;
  sizeLabel: string;
  objectUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function truncateName(name: string, max = 28): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

const MM_TO_PT = 2.834645669;

async function normaliseImage(file: File): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const jpgBlob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92),
  );
  return new Uint8Array(await jpgBlob.arrayBuffer());
}

async function imagesToPdf(
  files: File[],
  opts: {
    pageSize: PageSizeOption;
    orientation: OrientationOption;
    marginMm: MarginMm;
  },
  pdfLib: typeof import('pdf-lib'),
  onProgress: (pct: number) => void,
): Promise<Blob> {
  const { PDFDocument, PageSizes } = pdfLib;
  const doc = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Normalise all images through canvas — handles EXIF orientation for JPEG,
    // converts WebP (unsupported by pdf-lib) to JPEG, and corrects PNG as JPEG too.
    const jpgBytes = await normaliseImage(file);
    const img = await doc.embedJpg(jpgBytes);

    let pageW: number, pageH: number;
    if (opts.pageSize === 'fit') {
      pageW = img.width;
      pageH = img.height;
    } else {
      const base =
        opts.pageSize === 'letter'
          ? PageSizes.Letter
          : opts.pageSize === 'legal'
          ? PageSizes.Legal
          : PageSizes.A4;
      const portrait =
        opts.orientation === 'portrait'
          ? true
          : opts.orientation === 'landscape'
          ? false
          : img.height >= img.width;
      [pageW, pageH] = portrait ? [base[0], base[1]] : [base[1], base[0]];
    }

    const page = doc.addPage([pageW, pageH]);
    const margin = opts.marginMm * MM_TO_PT;
    const availW = pageW - 2 * margin;
    const availH = pageH - 2 * margin;
    const scale = Math.min(availW / img.width, availH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    page.drawImage(img, {
      x: (pageW - w) / 2,
      y: (pageH - h) / 2,
      width: w,
      height: h,
    });

    onProgress(((i + 1) / files.length) * 100);
  }

  const out = await doc.save();
  return new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function JpgToPdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('images.pdf');
  const [outputSize, setOutputSize] = useState<string>('');

  // Options
  const [pageSize, setPageSize] = useState<PageSizeOption>('fit');
  const [orientation, setOrientation] = useState<OrientationOption>('auto');
  const [marginMm, setMarginMm] = useState<MarginMm>(0);

  // DnD state
  const dragSrcIdRef = useRef<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('after');

  // Keep track of all object URLs for cleanup
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const heicFiles = files.filter(
      (f) => f.type === 'image/heic' || f.name.toLowerCase().endsWith('.heic'),
    );
    if (heicFiles.length > 0) {
      setErrorMsg(`HEIC isn't supported. Convert to JPG first.`);
      return;
    }

    setErrorMsg(null);
    const newEntries: ImageFile[] = files.map((file) => {
      const objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(objectUrl);
      return {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        sizeLabel: formatBytes(file.size),
        objectUrl,
      };
    });
    setImageFiles((prev) => [...prev, ...newEntries]);
  }, []);

  const handleDelete = (id: string) => {
    setImageFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.objectUrl);
        objectUrlsRef.current = objectUrlsRef.current.filter((u) => u !== removed.objectUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleClearAll = () => {
    imageFiles.forEach((f) => {
      URL.revokeObjectURL(f.objectUrl);
    });
    objectUrlsRef.current = [];
    setImageFiles([]);
    setStatus('idle');
    setProgress(0);
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName('images.pdf');
    setOutputSize('');
  };

  const handleCreate = async () => {
    if (!pdfLib || imageFiles.length === 0) return;
    setStatus('processing');
    setProgress(0);
    setErrorMsg(null);

    try {
      const blob = await imagesToPdf(
        imageFiles.map((f) => f.file),
        { pageSize, orientation, marginMm },
        pdfLib,
        (pct) => setProgress(pct),
      );
      setOutputBlob(blob);
      setOutputSize(formatBytes(blob.size));
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(`Failed to create PDF. ${err instanceof Error ? err.message : 'Unknown error.'}`);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputName.endsWith('.pdf') ? outputName : `${outputName}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // HTML5 DnD handlers for grid tiles
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    dragSrcIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    setDropTargetId(id);
    setDropPosition(e.clientX < midX ? 'before' : 'after');
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const srcId = dragSrcIdRef.current;
    if (!srcId || srcId === targetId) {
      setDropTargetId(null);
      return;
    }
    setImageFiles((prev) => {
      const items = [...prev];
      const srcIdx = items.findIndex((f) => f.id === srcId);
      const tgtIdx = items.findIndex((f) => f.id === targetId);
      if (srcIdx === -1 || tgtIdx === -1) return prev;
      const [removed] = items.splice(srcIdx, 1);
      const newTgtIdx = items.findIndex((f) => f.id === targetId);
      const insertAt = dropPosition === 'before' ? newTgtIdx : newTgtIdx + 1;
      items.splice(insertAt, 0, removed);
      return items;
    });
    dragSrcIdRef.current = null;
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    dragSrcIdRef.current = null;
    setDropTargetId(null);
  };

  const hasFiles = imageFiles.length > 0;
  const canCreate = imageFiles.length >= 1 && !!pdfLib && status !== 'processing';

  if (pdfLibError) {
    return (
      <div className="text-center py-10 text-rose-600 text-sm">{pdfLibError}</div>
    );
  }

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {/* Empty state */}
      {!hasFiles && status !== 'done' && (
        <PdfDropzone
          multiple
          accept="image/jpeg,image/png,image/webp"
          onFiles={handleFiles}
          label="Drop JPGs, PNGs, or WebPs here, or click to browse."
        />
      )}

      {/* Files loaded state */}
      {hasFiles && status !== 'done' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
          {/* Left: image grid + controls */}
          <div className="space-y-4">
            {/* Add more dropzone */}
            <PdfDropzone
              compact
              multiple
              accept="image/jpeg,image/png,image/webp"
              onFiles={handleFiles}
              label="Add more images"
            />

            {/* Image tile grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {imageFiles.map((imgFile) => {
                const isDropTarget = dropTargetId === imgFile.id;
                return (
                  <div key={imgFile.id} className="relative flex">
                    {isDropTarget && dropPosition === 'before' && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-500 rounded-full z-10 -translate-x-1" />
                    )}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, imgFile.id)}
                      onDragOver={(e) => handleDragOver(e, imgFile.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, imgFile.id)}
                      onDragEnd={handleDragEnd}
                      className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden w-full select-none"
                    >
                      {/* Thumbnail */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgFile.objectUrl}
                        alt={imgFile.name}
                        className="w-full aspect-square object-cover"
                      />

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(imgFile.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        aria-label={`Remove ${imgFile.name}`}
                      >
                        ×
                      </button>

                      {/* Info + drag handle */}
                      <div className="px-2 py-1.5 border-t border-slate-100">
                        <p className="text-xs text-slate-700 font-medium truncate leading-tight">
                          {truncateName(imgFile.name)}
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[11px] text-slate-400">{imgFile.sizeLabel}</span>
                          <span
                            className="text-slate-300 cursor-grab active:cursor-grabbing text-sm leading-none select-none"
                            aria-hidden="true"
                          >
                            ⋮⋮
                          </span>
                        </div>
                      </div>
                    </div>
                    {isDropTarget && dropPosition === 'after' && (
                      <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-rose-500 rounded-full z-10 translate-x-1" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            {status === 'processing' && (
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Error */}
            {status === 'error' && errorMsg && (
              <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {errorMsg}
              </div>
            )}

            {/* HEIC warning (when no error but rejections occurred) */}
            {!status && errorMsg && (
              <div className="px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                {errorMsg}
              </div>
            )}

            {/* Action bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCreate}
                disabled={!canCreate}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
              >
                {status === 'processing'
                  ? 'Creating PDF…'
                  : `Create PDF (${imageFiles.length} image${imageFiles.length !== 1 ? 's' : ''})`}
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={status === 'processing'}
                className="px-5 py-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Right: options panel */}
          <div className="lg:w-64 w-full">
            <ToolCard title="Page options">
              <div className="space-y-4">
                {/* Page size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="jpg-page-size">
                    Page size
                  </label>
                  <select
                    id="jpg-page-size"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                  >
                    <option value="fit">Fit to image</option>
                    <option value="letter">Letter (8.5 × 11 in)</option>
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="legal">Legal (8.5 × 14 in)</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="jpg-orientation">
                    Orientation
                  </label>
                  <select
                    id="jpg-orientation"
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as OrientationOption)}
                    disabled={pageSize === 'fit'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="auto">Auto (by image shape)</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                  {pageSize === 'fit' && (
                    <p className="text-[11px] text-slate-400 mt-1">Not used when fitting to image.</p>
                  )}
                </div>

                {/* Margin */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="jpg-margin">
                    Margin
                  </label>
                  <select
                    id="jpg-margin"
                    value={marginMm}
                    onChange={(e) => setMarginMm(Number(e.target.value) as MarginMm)}
                    disabled={pageSize === 'fit'}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value={0}>None</option>
                    <option value={12}>Small (12 mm)</option>
                    <option value={25}>Medium (25 mm)</option>
                    <option value={40}>Large (40 mm)</option>
                  </select>
                  {pageSize === 'fit' && (
                    <p className="text-[11px] text-slate-400 mt-1">Not used when fitting to image.</p>
                  )}
                </div>
              </div>
            </ToolCard>
          </div>
        </div>
      )}

      {/* Error shown even without files (e.g. HEIC rejection on empty state) */}
      {!hasFiles && errorMsg && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {/* Done state */}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>PDF created successfully · Output: {outputSize}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="text"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              aria-label="Output filename"
            />
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all whitespace-nowrap"
            >
              Download
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
  );
}
