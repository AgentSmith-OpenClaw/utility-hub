import React, { useState, useCallback, useEffect } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import PdfPageGrid, { PageThumb } from './PdfPageGrid';
import { usePdfLib } from '../../hooks/usePdfLib';
import { usePdfJs } from '../../hooks/usePdfJs';

type Status = 'idle' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

function reorder(order: number[], fromIndex: number, toIndex: number): number[] {
  const next = order.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

async function reorderPdf(
  file: File,
  newOrder: number[],
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, newOrder);
  copied.forEach((p) => out.addPage(p));
  const bytesOut = await out.save();
  return new Blob([bytesOut.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function ReorderPdfPages() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();
  const { lib: pdfJs, error: pdfJsError } = usePdfJs();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [order, setOrder] = useState<number[]>([]);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  // Load page count when file + pdfLib are available
  useEffect(() => {
    if (!file || !pdfLib) return;
    let cancelled = false;
    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await pdfLib.PDFDocument.load(bytes);
        if (!cancelled) {
          const count = doc.getPageCount();
          setPageCount(count);
          setOrder(Array.from({ length: count }, (_, i) => i));
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
            setErrorMsg('This PDF is password-protected. Unlock it first.');
          } else {
            setErrorMsg('Failed to read the PDF. Make sure it is a valid PDF file.');
          }
          setFile(null);
        }
      }
    })();
    return () => { cancelled = true; };
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
    setOrder([]);
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-reordered.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null);
    setPageCount(0);
    setOrder([]);
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName('');
  };

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setOrder((prev) => reorder(prev, fromIndex, toIndex));
  }, []);

  // Quick actions
  const handleReset = () => {
    setOrder(Array.from({ length: pageCount }, (_, i) => i));
  };

  const handleReverse = () => {
    setOrder((prev) => [...prev].reverse());
  };

  const handleFirstToLast = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
  };

  const handleLastToFirst = () => {
    setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
  };

  const isOrderUnchanged =
    order.length > 0 &&
    JSON.stringify(order) === JSON.stringify(Array.from({ length: pageCount }, (_, i) => i));

  const actionDisabled =
    !file || !pdfLib || status === 'processing' || !pageCount || isOrderUnchanged;

  const handleSave = async () => {
    if (!file || !pdfLib || order.length === 0) return;
    setStatus('processing');
    setErrorMsg(null);

    try {
      const blob = await reorderPdf(file, order, pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.toLowerCase().includes('encrypt')) {
        setErrorMsg(`"${file.name}" is password-protected. Unlock it first.`);
      } else {
        setErrorMsg(
          `Failed to reorder pages. ${err instanceof Error ? err.message : 'Unknown error.'}`,
        );
      }
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputName.endsWith('.pdf') ? outputName : `${outputName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (pdfLibError) {
    return (
      <div className="text-center py-10 text-rose-600 text-sm">
        {pdfLibError}
      </div>
    );
  }

  const hasFile = !!file;

  // Build ordered thumbnails for the grid
  const orderedThumbs: PageThumb[] = order.map((origIdx, position) => {
    const t = thumbs.find((th) => th.index === origIdx) ?? thumbs[origIdx];
    // Return with a stable key based on position in order
    return t ? { ...t, index: origIdx } : { index: origIdx, thumbnail: '' };
  });

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

      {/* Error from file load (shown below dropzone) */}
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
              className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          </div>

          {/* Quick-action toolbar */}
          {pageCount > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium mr-1">Quick actions:</span>
              <button
                type="button"
                onClick={handleReset}
                disabled={isOrderUnchanged}
                className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Reset to original order
              </button>
              <button
                type="button"
                onClick={handleReverse}
                className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
              >
                Reverse all
              </button>
              <button
                type="button"
                onClick={handleFirstToLast}
                className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
              >
                Move first to last
              </button>
              <button
                type="button"
                onClick={handleLastToFirst}
                className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
              >
                Move last to first
              </button>
            </div>
          )}

          {/* Thumbnail grid */}
          {thumbs.length > 0 && orderedThumbs.every((t) => t.thumbnail) && (
            <PdfPageGrid
              pages={orderedThumbs}
              mode="reorder"
              order={order}
              onReorder={handleReorder}
            />
          )}
          {thumbs.length > 0 && !orderedThumbs.every((t) => t.thumbnail) && (
            <PdfPageGrid
              pages={thumbs.filter((t) => t.thumbnail)}
              mode="reorder"
              order={order.filter((idx) => thumbs[idx]?.thumbnail)}
              onReorder={handleReorder}
            />
          )}
          {thumbs.length === 0 && pageCount > 0 && !pdfJsError && (
            <p className="text-xs text-slate-500">Loading page thumbnails…</p>
          )}
          {pdfJsError && thumbs.length === 0 && (
            <p className="text-xs text-amber-600">
              Thumbnails unavailable — page count loaded. You can still use quick actions above.
            </p>
          )}

          {/* Error from processing */}
          {status === 'error' && errorMsg && (
            <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          {/* Action button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={actionDisabled}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
          >
            {status === 'processing' ? 'Saving…' : 'Save reordered PDF'}
          </button>
          {isOrderUnchanged && pageCount > 1 && (
            <p className="text-xs text-slate-500 text-center -mt-2">
              Drag pages to change their order, then save.
            </p>
          )}
        </>
      )}

      {/* Done state */}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>PDF reordered — {formatMB(outputBlob.size)} MB</span>
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
