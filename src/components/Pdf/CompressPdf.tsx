import React, { useState, useCallback, useEffect, useRef } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';
import { usePdfJs } from '../../hooks/usePdfJs';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

type CompressionLevel = 'light' | 'medium' | 'strong';
type Status = 'idle' | 'previewing' | 'ready' | 'warning' | 'processing' | 'done' | 'error';

interface Level {
  quality: number;
  maxPx: number;
  label: string;
  description: string;
}

const LEVELS: Record<CompressionLevel, Level> = {
  light:  { quality: 0.85, maxPx: 2400, label: 'Light',  description: 'Best detail, modest size reduction' },
  medium: { quality: 0.70, maxPx: 1800, label: 'Medium', description: 'Best balance of quality & size' },
  strong: { quality: 0.55, maxPx: 1200, label: 'Strong', description: 'Smallest file, lower image quality' },
};

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function compressPage(
  pdfJsDoc: PDFDocumentProxy,
  pageIndex: number,
  level: CompressionLevel,
): Promise<{ jpgBytes: Uint8Array; nativeW: number; nativeH: number }> {
  const { quality, maxPx } = LEVELS[level];
  const page = await pdfJsDoc.getPage(pageIndex + 1);
  const native = page.getViewport({ scale: 1 });
  const longSide = Math.max(native.width, native.height);
  const scale = Math.min(1, maxPx / longSide);
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(vp.width);
  canvas.height = Math.floor(vp.height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Some pdf.js versions require both canvasContext AND canvas
  await page.render({ canvasContext: ctx, viewport: vp, canvas } as Parameters<typeof page.render>[0]).promise;
  const blob: Blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b!), 'image/jpeg', quality),
  );
  page.cleanup();
  return {
    jpgBytes: new Uint8Array(await blob.arrayBuffer()),
    nativeW: native.width,
    nativeH: native.height,
  };
}

async function renderOriginalPage(
  pdfJsDoc: PDFDocumentProxy,
  pageIndex: number,
  maxPx: number,
): Promise<string> {
  const page = await pdfJsDoc.getPage(pageIndex + 1);
  const native = page.getViewport({ scale: 1 });
  const longSide = Math.max(native.width, native.height);
  const scale = Math.min(1, maxPx / longSide);
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(vp.width);
  canvas.height = Math.floor(vp.height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp, canvas } as Parameters<typeof page.render>[0]).promise;
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  page.cleanup();
  return dataUrl;
}

async function compressPdf(
  pdfJsDoc: PDFDocumentProxy,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
  level: CompressionLevel,
  onProgress: (pct: number) => void,
): Promise<Blob> {
  const out = await PDFDocument.create();
  const n = pdfJsDoc.numPages;
  for (let i = 0; i < n; i++) {
    const { jpgBytes, nativeW, nativeH } = await compressPage(pdfJsDoc, i, level);
    const embedded = await out.embedJpg(jpgBytes);
    const outPage = out.addPage([nativeW, nativeH]);
    outPage.drawImage(embedded, { x: 0, y: 0, width: nativeW, height: nativeH });
    onProgress(((i + 1) / n) * 100);
  }
  const bytesOut = await out.save({ useObjectStreams: true });
  return new Blob([bytesOut.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function CompressPdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();
  const { lib: pdfJs, error: pdfJsError } = usePdfJs();

  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');
  const [progress, setProgress] = useState(0);

  // Preview state
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Size estimates
  const [page1JpgSize, setPage1JpgSize] = useState<number | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);

  // Warning state
  const [showWarning, setShowWarning] = useState(false);
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);

  // Refs (stable, don't trigger re-renders)
  const pdfJsDocRef = useRef<PDFDocumentProxy | null>(null);
  const fileBytesRef = useRef<ArrayBuffer | null>(null);
  const numPagesRef = useRef<number>(0);

  // Load pdf.js document when file changes
  useEffect(() => {
    if (!file || !pdfJs) return;
    let cancelled = false;

    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        if (cancelled) return;
        fileBytesRef.current = bytes;
        const loadingTask = pdfJs.getDocument({ data: bytes });
        const doc = await loadingTask.promise;
        if (cancelled) { doc.destroy(); return; }
        pdfJsDocRef.current = doc;
        numPagesRef.current = doc.numPages;
        setStatus('previewing');
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.toLowerCase().includes('password') ||
          msg.toLowerCase().includes('encrypt') ||
          (err as { name?: string }).name === 'PasswordException'
        ) {
          setErrorMsg('This PDF is password-protected. Unlock it first, then compress.');
        } else {
          setErrorMsg('Failed to read the PDF. Make sure it is a valid PDF file.');
        }
        setFile(null);
        setStatus('idle');
      }
    })();

    return () => { cancelled = true; };
  }, [file, pdfJs]);

  // Generate preview whenever status is 'previewing' and level changes
  useEffect(() => {
    const doc = pdfJsDocRef.current;
    if (!doc || status !== 'previewing') return;
    let cancelled = false;

    setPreviewLoading(true);
    setCompressedPreview(null);

    (async () => {
      try {
        // Render original (use same maxPx as selected level for fair comparison)
        const origUrl = await renderOriginalPage(doc, 0, LEVELS[level].maxPx);
        if (cancelled) return;
        setOriginalPreview(origUrl);

        // Render compressed
        const { jpgBytes } = await compressPage(doc, 0, level);
        if (cancelled) return;

        const blob = new Blob([jpgBytes.buffer as ArrayBuffer], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setCompressedPreview(url);
        setPage1JpgSize(jpgBytes.byteLength);

        // Estimate total size
        const numPages = numPagesRef.current;
        const estimated = jpgBytes.byteLength * numPages;
        setEstimatedSize(estimated);

        if (!cancelled) {
          setPreviewLoading(false);
          setStatus('ready');
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setPreviewLoading(false);
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('encrypt')) {
            setErrorMsg('This PDF is password-protected. Unlock it first.');
          } else {
            setErrorMsg('Failed to generate preview. The file may be corrupted.');
          }
          setStatus('error');
        }
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // Intentional: pdfJsDocRef/numPagesRef are refs (stable), setters are stable — only re-run on status/level change
  }, [status, level]);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;

    // Clean up old doc
    if (pdfJsDocRef.current) {
      pdfJsDocRef.current.destroy();
      pdfJsDocRef.current = null;
    }
    fileBytesRef.current = null;
    numPagesRef.current = 0;

    setFile(f);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-compressed.pdf');
    setProgress(0);
    setOriginalPreview(null);
    setCompressedPreview(null);
    setPage1JpgSize(null);
    setEstimatedSize(null);
    setShowWarning(false);
    setWarningAcknowledged(false);
  }, []);

  const handleRemove = useCallback(() => {
    if (pdfJsDocRef.current) {
      pdfJsDocRef.current.destroy();
      pdfJsDocRef.current = null;
    }
    fileBytesRef.current = null;
    numPagesRef.current = 0;

    setFile(null);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName('');
    setProgress(0);
    setOriginalPreview(null);
    setCompressedPreview(null);
    setPage1JpgSize(null);
    setEstimatedSize(null);
    setShowWarning(false);
    setWarningAcknowledged(false);
  }, []);

  const handleLevelChange = (newLevel: CompressionLevel) => {
    if (newLevel === level) return;
    setLevel(newLevel);
    if (status === 'ready' || status === 'warning') {
      setStatus('previewing');
      setShowWarning(false);
    }
  };

  const handleCompressClick = () => {
    if (!file || !pdfLib || !pdfJsDocRef.current) return;

    // Check text-only warning: page1JpgSize > file.size / numPages
    if (
      !warningAcknowledged &&
      page1JpgSize !== null &&
      numPagesRef.current > 0 &&
      page1JpgSize > file.size / numPagesRef.current
    ) {
      setShowWarning(true);
      return;
    }

    runCompression();
  };

  const handleWarningContinue = () => {
    setWarningAcknowledged(true);
    setShowWarning(false);
    runCompression();
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
  };

  const runCompression = async () => {
    const doc = pdfJsDocRef.current;
    if (!doc || !pdfLib) return;

    setStatus('processing');
    setErrorMsg(null);
    setProgress(0);

    try {
      const blob = await compressPdf(doc, pdfLib.PDFDocument, level, (pct) => {
        setProgress(pct);
      });
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(
        `Compression failed. ${err instanceof Error ? err.message : 'Unknown error.'}`
      );
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
  const numPages = numPagesRef.current;

  const compressionPct =
    file && outputBlob
      ? Math.round(((file.size - outputBlob.size) / file.size) * 100)
      : null;

  const estimatedPct =
    file && estimatedSize !== null
      ? Math.round(((file.size - estimatedSize) / file.size) * 100)
      : null;

  const isReady = status === 'ready' || status === 'error';

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {/* Empty state */}
      {!hasFile && (
        <PdfDropzone
          onFiles={handleFiles}
          label="Drop a single PDF here, or click to browse."
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
              {numPages ? `${numPages} page${numPages !== 1 ? 's' : ''}` : '—'}
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

          {/* Compression level selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Compression Level
            </p>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Compression level">
              {(Object.keys(LEVELS) as CompressionLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  aria-pressed={level === lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
                    level === lvl
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-semibold">{LEVELS[lvl].label}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {LEVELS[lvl].description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview pane */}
          {(status === 'previewing' || isReady || status === 'warning' || status === 'processing') && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Page 1 Preview
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Original */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-500 text-center">Original</p>
                  <div className="bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[140px]">
                    {originalPreview ? (
                      <img
                        src={originalPreview}
                        alt="Original page 1"
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">Loading…</span>
                    )}
                  </div>
                  {file && (
                    <p className="text-xs text-slate-500 text-center">{formatMB(file.size)} MB</p>
                  )}
                </div>

                {/* Compressed */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-500 text-center">Compressed</p>
                  <div className="bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[140px]">
                    {previewLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-5 h-5 animate-spin text-rose-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span className="text-xs text-slate-400">Processing…</span>
                      </div>
                    ) : compressedPreview ? (
                      <img
                        src={compressedPreview}
                        alt="Compressed page 1 preview"
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">Loading…</span>
                    )}
                  </div>
                  {estimatedSize !== null && (
                    <p className="text-xs text-slate-500 text-center">~{formatMB(estimatedSize)} MB est.</p>
                  )}
                </div>
              </div>

              {/* Estimated size row */}
              {estimatedSize !== null && file && estimatedPct !== null && (
                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Original: <strong>{formatMB(file.size)} MB</strong>
                  {' → '}
                  Estimated: <strong>~{formatMB(estimatedSize)} MB</strong>
                  {' '}
                  {estimatedPct >= 0 ? (
                    <span className="text-emerald-600 font-semibold">(−{estimatedPct}%)</span>
                  ) : (
                    <span className="text-amber-600 font-semibold">(+{Math.abs(estimatedPct)}% larger)</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* pdf.js load error — show graceful message */}
          {pdfJsError && (
            <div className="px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Preview unavailable — the PDF engine failed to load. You can still attempt compression.
            </div>
          )}

          {/* Text-only warning */}
          {showWarning && (
            <div className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-300 space-y-3">
              <p className="text-sm text-amber-800 font-medium">
                ⚠️ This PDF appears to be text-heavy. Compressing it may produce a{' '}
                <strong>larger</strong> file, not smaller. Continue anyway?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleWarningContinue}
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={handleWarningCancel}
                  className="px-4 py-2 rounded-lg bg-white border border-amber-300 text-amber-800 text-sm font-medium hover:bg-amber-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Processing progress bar */}
          {status === 'processing' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Compressing pages…</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Compression progress"
                  className="bg-rose-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error from processing */}
          {status === 'error' && errorMsg && (
            <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          {/* Action button */}
          {!showWarning && (
            <button
              type="button"
              onClick={handleCompressClick}
              disabled={!isReady}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
            >
              {status === 'processing' ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Compressing…
                </>
              ) : (
                'Compress PDF'
              )}
            </button>
          )}
        </>
      )}

      {/* Done state */}
      {status === 'done' && outputBlob && file && (
        <div className="space-y-4">
          {/* Result summary */}
          <div className="px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
            <div className="flex items-center gap-2 text-sm text-emerald-800">
              <span aria-hidden="true">✓</span>
              <span className="font-semibold">Compression complete</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Original <strong>{formatMB(file.size)} MB</strong>
              {' / '}
              Compressed <strong>{formatMB(outputBlob.size)} MB</strong>
              {compressionPct !== null && compressionPct >= 0 && (
                <span className="text-emerald-600 font-semibold ml-1">(−{compressionPct}%)</span>
              )}
              {compressionPct !== null && compressionPct < 0 && (
                <span className="text-amber-600 font-semibold ml-1">(+{Math.abs(compressionPct)}% larger — original was already compact)</span>
              )}
            </div>
          </div>

          {/* Filename + download */}
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
