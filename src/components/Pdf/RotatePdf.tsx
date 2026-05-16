import React, { useState, useCallback, useEffect } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import PdfPageGrid, { PageThumb } from './PdfPageGrid';
import { usePdfLib } from '../../hooks/usePdfLib';
import { usePdfJs } from '../../hooks/usePdfJs';

type Rotation = 0 | 90 | 180 | 270;
type Mode = 'all' | 'individual';
type Status = 'idle' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function rotatePdf(
  file: File,
  rotations: Rotation[],
  PDFDocument: typeof import('pdf-lib').PDFDocument,
  degrees: (angle: number) => import('pdf-lib').Rotation,
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const add = rotations[i] ?? 0;
    if (!add) return;
    const existing = page.getRotation().angle as number;
    const newAngle = (existing + add) % 360;
    page.setRotation(degrees(newAngle));
  });
  const out = await doc.save();
  return new Blob([out.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function RotatePdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();
  const { lib: pdfJs, error: pdfJsError } = usePdfJs();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<Mode>('all');
  const [globalAngle, setGlobalAngle] = useState<Rotation>(90);
  const [perPage, setPerPage] = useState<Rotation[]>([]);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  // Load page count when file + pdfLib are available
  useEffect(() => {
    if (!file || !pdfLib) return;
    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await pdfLib.PDFDocument.load(bytes);
        const count = doc.getPageCount();
        setPageCount(count);
        setPerPage(Array(count).fill(0) as Rotation[]);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.toLowerCase().includes('encrypt')) {
          setErrorMsg(`"${file.name}" is password-protected. Unlock it first.`);
          setFile(null);
        }
      }
    })();
  }, [file, pdfLib]);

  // Render thumbnails with pdf.js
  useEffect(() => {
    if (!file || !pdfJs || !pageCount) return;
    let cancelled = false;
    setThumbs([]);

    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        const pdf = await pdfJs.getDocument({ data: bytes }).promise;
        const newThumbs: PageThumb[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) break;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          newThumbs.push({ index: i - 1, thumbnail: canvas.toDataURL('image/jpeg', 0.7) });
          if (!cancelled) setThumbs([...newThumbs]);
        }
      } catch {
        // thumbnails are best-effort
      }
    })();

    return () => { cancelled = true; };
  }, [file, pdfJs, pageCount]);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setPageCount(0);
    setPerPage([]);
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-rotated.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null);
    setPageCount(0);
    setPerPage([]);
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName('');
  };

  const isActionDisabled = (): boolean => {
    if (!file || !pdfLib || status === 'processing' || !pageCount) return true;
    if (mode === 'all') return false;
    // individual mode: disabled when all perPage values are 0
    return perPage.every((r) => r === 0);
  };

  const handleApply = async () => {
    if (!file || !pdfLib) return;
    const { PDFDocument, degrees } = pdfLib;

    setStatus('processing');
    setErrorMsg(null);

    try {
      let rotations: Rotation[];
      if (mode === 'all') {
        rotations = Array(pageCount).fill(globalAngle) as Rotation[];
      } else {
        rotations = [...perPage];
      }

      const blob = await rotatePdf(file, rotations, PDFDocument, degrees);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(`Rotation failed. ${err instanceof Error ? err.message : 'Unknown error.'}`);
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

  const handleRotatePage = useCallback((i: number) => {
    setPerPage((prev) => {
      const n = [...prev];
      n[i] = (((n[i] + 90) % 360) as Rotation);
      return n;
    });
  }, []);

  const handleBulkRotate = (angle: Rotation) => {
    setPerPage((prev) => prev.map((r) => (((r + angle) % 360) as Rotation)));
  };

  const handleResetAll = () => {
    setPerPage(Array(pageCount).fill(0) as Rotation[]);
  };

  if (pdfLibError) {
    return (
      <div className="text-center py-10 text-rose-600 text-sm">
        {pdfLibError}
      </div>
    );
  }

  const hasFile = !!file;
  const rotationRecord: Record<number, 0 | 90 | 180 | 270> = Object.fromEntries(
    perPage.map((r, i) => [i, r]),
  );

  const ANGLES: Rotation[] = [90, 180, 270];

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {/* Empty state */}
      {!hasFile && (
        <PdfDropzone
          onFiles={handleFiles}
          label="Drop a PDF here, or click to browse."
        />
      )}

      {/* Error from file load */}
      {!hasFile && errorMsg && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {/* Loaded state */}
      {hasFile && status !== 'done' && (
        <>
          {/* File info row */}
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">
              {truncateName(file.name)}
            </span>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
              {pageCount ? `${pageCount} page${pageCount !== 1 ? 's' : ''}` : '—'}
              {' · '}{formatMB(file.size)} MB
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          </div>

          {/* Mode segmented control */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-2">Rotation mode</p>
            <div className="flex rounded-lg overflow-hidden border border-slate-200">
              {(['all', 'individual'] as Mode[]).map((m) => {
                const labels: Record<Mode, string> = {
                  all: 'Rotate all pages',
                  individual: 'Rotate individual pages',
                };
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      mode === m
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-700 border-l border-slate-200 first:border-l-0 hover:bg-slate-50'
                    }`}
                  >
                    {labels[m]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk mode: angle picker */}
          {mode === 'all' && (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Rotation angle</p>
              <div className="flex gap-2">
                {ANGLES.map((angle) => (
                  <button
                    key={angle}
                    type="button"
                    onClick={() => setGlobalAngle(angle)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      globalAngle === angle
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Individual mode: bulk toolbar + thumbnail grid */}
          {mode === 'individual' && (
            <>
              {/* Bulk toolbar chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkRotate(90)}
                  className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
                >
                  Rotate all 90°
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkRotate(180)}
                  className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
                >
                  Rotate all 180°
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkRotate(270)}
                  className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
                >
                  Rotate all 270°
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-2 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
                >
                  Reset all
                </button>
              </div>

              {/* Thumbnail grid */}
              {thumbs.length > 0 && (
                <PdfPageGrid
                  pages={thumbs}
                  mode="display"
                  onRotate={handleRotatePage}
                  rotation={rotationRecord}
                />
              )}
              {thumbs.length === 0 && pageCount > 0 && !pdfJsError && (
                <p className="text-xs text-slate-500">Loading page thumbnails…</p>
              )}
              {pdfJsError && thumbs.length === 0 && (
                <p className="text-xs text-amber-600">Thumbnails unavailable. You can still apply rotation.</p>
              )}
            </>
          )}

          {/* Bulk mode: thumbnail strip (display only) */}
          {mode === 'all' && thumbs.length > 0 && (
            <div className="overflow-x-auto">
              <PdfPageGrid
                pages={thumbs}
                mode="display"
              />
            </div>
          )}

          {/* Error */}
          {status === 'error' && errorMsg && (
            <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          {/* Action button */}
          <button
            type="button"
            onClick={handleApply}
            disabled={isActionDisabled()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
          >
            {status === 'processing' ? 'Applying rotation…' : 'Apply rotation & download'}
          </button>
        </>
      )}

      {/* Done state */}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>Rotation applied — {formatMB(outputBlob.size)} MB</span>
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
            onClick={handleRemove}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
  );
}
