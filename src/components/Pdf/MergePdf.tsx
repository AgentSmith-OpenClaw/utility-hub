import React, { useState, useCallback, useRef, useEffect } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';

interface PdfFile {
  id: string;
  file: File;
  name: string;
  pageCount: number | null;
  sizeLabel: string;
}

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function mergePdfs(
  files: File[],
  PDFDocument: typeof import('pdf-lib').PDFDocument,
  onProgress: (pct: number) => void,
): Promise<Blob> {
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const bytes = await files[i].arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const indices = src.getPageIndices();
    const copied = await out.copyPages(src, indices);
    copied.forEach((p) => out.addPage(p));
    onProgress(((i + 1) / files.length) * 100);
  }
  const merged = await out.save();
  return new Blob([merged.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function MergePdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('merged.pdf');
  const [outputSize, setOutputSize] = useState<string>('');
  const [largeSizeWarning, setLargeSizeWarning] = useState<string | null>(null);

  // DnD state
  const dragSrcIdRef = useRef<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after'>('after');

  // Load page counts when pdfLib becomes available for already-added files
  useEffect(() => {
    if (!pdfLib) return;
    pdfFiles.forEach((pf) => {
      if (pf.pageCount === null) {
        loadPageCount(pf.id, pf.file, pdfLib.PDFDocument);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfLib]);

  async function loadPageCount(
    id: string,
    file: File,
    PDFDocument: typeof import('pdf-lib').PDFDocument,
  ) {
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPdfFiles((prev) =>
        prev.map((pf) => (pf.id === id ? { ...pf, pageCount: doc.getPageCount() } : pf)),
      );
    } catch {
      // If it fails to load (e.g. encrypted), keep pageCount null
    }
  }

  const handleFiles = useCallback(
    (files: File[]) => {
      const newEntries: PdfFile[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        pageCount: null,
        sizeLabel: `${formatMB(file.size)} MB`,
      }));

      setPdfFiles((prev) => {
        const updated = [...prev, ...newEntries];
        // Check combined size warning
        const totalBytes = updated.reduce((sum, pf) => sum + pf.file.size, 0);
        const totalMB = totalBytes / (1024 * 1024);
        if (totalMB > 200) {
          setLargeSizeWarning(`Combined files are large (~${Math.round(totalMB)} MB). May take 30+ seconds on mobile.`);
        } else {
          setLargeSizeWarning(null);
        }
        return updated;
      });

      // Load page counts for new entries
      if (pdfLib) {
        newEntries.forEach((entry) => {
          loadPageCount(entry.id, entry.file, pdfLib.PDFDocument);
        });
      }
    },
    [pdfLib],
  );

  const handleDelete = (id: string) => {
    setPdfFiles((prev) => {
      const updated = prev.filter((pf) => pf.id !== id);
      const totalBytes = updated.reduce((sum, pf) => sum + pf.file.size, 0);
      const totalMB = totalBytes / (1024 * 1024);
      setLargeSizeWarning(totalMB > 200 ? `Combined files are large (~${Math.round(totalMB)} MB). May take 30+ seconds on mobile.` : null);
      return updated;
    });
  };

  const handleClearAll = () => {
    setPdfFiles([]);
    setStatus('idle');
    setProgress(0);
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName('merged.pdf');
    setOutputSize('');
    setLargeSizeWarning(null);
  };

  const handleMerge = async () => {
    if (!pdfLib || pdfFiles.length < 2) return;
    setStatus('processing');
    setProgress(0);
    setErrorMsg(null);

    try {
      const blob = await mergePdfs(
        pdfFiles.map((pf) => pf.file),
        pdfLib.PDFDocument,
        (pct) => setProgress(pct),
      );
      setOutputBlob(blob);
      setOutputSize(`${formatMB(blob.size)} MB`);
      setStatus('done');
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message.toLowerCase().includes('encrypt')
          ? `A PDF is password-protected. Unlock it first.`
          : `Merge failed. ${err instanceof Error ? err.message : 'Unknown error.'}`;
      setErrorMsg(msg);
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

  // HTML5 DnD handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    dragSrcIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDropTargetId(id);
    setDropPosition(e.clientY < midY ? 'before' : 'after');
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
    setPdfFiles((prev) => {
      const items = [...prev];
      const srcIdx = items.findIndex((pf) => pf.id === srcId);
      const tgtIdx = items.findIndex((pf) => pf.id === targetId);
      if (srcIdx === -1 || tgtIdx === -1) return prev;
      const [removed] = items.splice(srcIdx, 1);
      const newTgtIdx = items.findIndex((pf) => pf.id === targetId);
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

  const hasFiles = pdfFiles.length > 0;
  const canMerge = pdfFiles.length >= 2 && status !== 'processing';

  if (pdfLibError) {
    return (
      <div className="text-center py-10 text-rose-600 text-sm">
        {pdfLibError}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {/* Empty state */}
      {!hasFiles && (
        <PdfDropzone
          multiple
          onFiles={handleFiles}
          label="Drop PDFs here, or click to browse. Order them, then merge."
        />
      )}

      {/* Files queued state */}
      {hasFiles && status !== 'done' && (
        <>
          <PdfDropzone
            compact
            multiple
            onFiles={handleFiles}
            label="Add more PDFs"
          />

          {largeSizeWarning && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <span aria-hidden="true" className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{largeSizeWarning}</span>
            </div>
          )}

          {/* File list */}
          <div className="space-y-2">
            {pdfFiles.map((pf) => {
              const isDropTarget = dropTargetId === pf.id;
              return (
                <div key={pf.id}>
                  {isDropTarget && dropPosition === 'before' && (
                    <div className="h-0.5 bg-rose-500 rounded-full mx-3 mb-1" />
                  )}
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, pf.id)}
                    onDragOver={(e) => handleDragOver(e, pf.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, pf.id)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2 cursor-grab active:cursor-grabbing select-none"
                  >
                    <span
                      className="text-slate-400 select-none text-lg leading-none flex-shrink-0"
                      aria-hidden="true"
                    >
                      ⋮⋮
                    </span>
                    <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
                    <span className="text-sm font-medium text-slate-800 flex-1 truncate">
                      {truncateName(pf.name)}
                    </span>
                    <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                      {pf.pageCount !== null ? `${pf.pageCount} page${pf.pageCount !== 1 ? 's' : ''}` : '—'} · {pf.sizeLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(pf.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      aria-label={`Remove ${pf.name}`}
                    >
                      ×
                    </button>
                  </div>
                  {isDropTarget && dropPosition === 'after' && (
                    <div className="h-0.5 bg-rose-500 rounded-full mx-3 mt-1" />
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

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleMerge}
              disabled={!canMerge || !pdfLib}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
            >
              {status === 'processing' ? 'Merging…' : `Merge PDFs (${pdfFiles.length} file${pdfFiles.length !== 1 ? 's' : ''})`}
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
        </>
      )}

      {/* Done state */}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>Merged successfully · Output: {outputSize}</span>
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
