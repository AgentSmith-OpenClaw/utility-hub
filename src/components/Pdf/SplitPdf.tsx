import React, { useState, useCallback, useEffect } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import PdfPageGrid, { PageThumb } from './PdfPageGrid';
import { usePdfLib } from '../../hooks/usePdfLib';
import { usePdfJs } from '../../hooks/usePdfJs';

type Mode = 'ranges' | 'every' | 'fixed';
type Status = 'idle' | 'loading-lib' | 'processing' | 'done' | 'error';

interface OutputFile {
  name: string;
  blob: Blob;
  pageCount: number;
  sizeLabel: string;
}

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

function parseRanges(str: string, maxPage: number): number[][] {
  // Returns 0-indexed page arrays per chunk.
  // "1-3, 5, 8-12" -> [[0,1,2], [4], [7,8,9,10,11]]
  return str.split(',').map((chunk) => {
    const part = chunk.trim();
    if (!part) throw new Error('Empty range segment');
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(`Invalid range "${part}" — use numbers and dashes only`);
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end > maxPage || start > end)
      throw new Error(`Range "${part}" is out of bounds (1–${maxPage})`);
    return Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
  });
}

function getChunks(mode: Mode, rangeStr: string, fixedN: number, pageCount: number): number[][] {
  if (mode === 'every') {
    return Array.from({ length: pageCount }, (_, i) => [i]);
  }
  if (mode === 'fixed') {
    const n = Math.max(1, fixedN);
    const chunks: number[][] = [];
    for (let i = 0; i < pageCount; i += n) {
      chunks.push(Array.from({ length: Math.min(n, pageCount - i) }, (_, j) => i + j));
    }
    return chunks;
  }
  return parseRanges(rangeStr, pageCount);
}

async function splitPdf(
  file: File,
  chunks: number[][],
  PDFDocument: typeof import('pdf-lib').PDFDocument,
  onProgress: (pct: number) => void,
): Promise<{ name: string; blob: Blob }[]> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const baseName = file.name.replace(/\.pdf$/i, '');
  const out: { name: string; blob: Blob }[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(src, chunks[i]);
    copied.forEach((p) => doc.addPage(p));
    const bytesOut = await doc.save();
    const first = chunks[i][0] + 1;
    const last = chunks[i][chunks[i].length - 1] + 1;
    const suffix = first === last ? `page-${first}` : `pages-${first}-${last}`;
    out.push({
      name: `${baseName}-${suffix}.pdf`,
      blob: new Blob([bytesOut.buffer as ArrayBuffer], { type: 'application/pdf' }),
    });
    onProgress(((i + 1) / chunks.length) * 100);
  }
  return out;
}

async function downloadAllAsZip(files: OutputFile[], baseName: string) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f.blob));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseName}-split.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function SplitPdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();
  const { lib: pdfJs, error: pdfJsError } = usePdfJs();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<Mode>('ranges');
  const [rangeStr, setRangeStr] = useState('');
  const [fixedN, setFixedN] = useState<number>(1);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputFiles, setOutputFiles] = useState<OutputFile[]>([]);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);

  // Parse validation
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [parsedChunks, setParsedChunks] = useState<number[][] | null>(null);

  // Validate range input live
  useEffect(() => {
    if (mode !== 'ranges' || !pageCount) {
      setRangeError(null);
      setParsedChunks(null);
      return;
    }
    if (!rangeStr.trim()) {
      setRangeError(null);
      setParsedChunks(null);
      return;
    }
    try {
      const chunks = parseRanges(rangeStr, pageCount);
      setParsedChunks(chunks);
      setRangeError(null);
    } catch (err) {
      setRangeError(err instanceof Error ? err.message : 'Invalid range');
      setParsedChunks(null);
    }
  }, [rangeStr, mode, pageCount]);

  // Load page count when file + pdfLib are available
  useEffect(() => {
    if (!file || !pdfLib) return;
    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await pdfLib.PDFDocument.load(bytes);
        setPageCount(doc.getPageCount());
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
          const viewport = page.getViewport({ scale: 0.2 });
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
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputFiles([]);
    setRangeStr('');
    setParsedChunks(null);
    setRangeError(null);
  }, []);

  const handleRemove = () => {
    setFile(null);
    setPageCount(0);
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputFiles([]);
    setRangeStr('');
    setParsedChunks(null);
    setRangeError(null);
  };

  const computeChunks = (): number[][] | null => {
    if (!pageCount) return null;
    try {
      return getChunks(mode, rangeStr, fixedN, pageCount);
    } catch {
      return null;
    }
  };

  const isActionDisabled = (): boolean => {
    if (!file || !pdfLib || status === 'processing' || !pageCount) return true;
    const chunks = computeChunks();
    if (!chunks || chunks.length === 0) return true;
    // Disable if only 1 chunk and it has only 1 page (trivial)
    if (chunks.length === 1 && chunks[0].length === 1 && pageCount > 1) return false;
    if (chunks.length === 1 && chunks[0].length <= 1 && pageCount <= 1) return true;
    return false;
  };

  const chunkCount = (() => {
    try {
      const chunks = computeChunks();
      return chunks?.length ?? 0;
    } catch {
      return 0;
    }
  })();

  const handleSplit = async () => {
    if (!file || !pdfLib) return;
    const chunks = computeChunks();
    if (!chunks || chunks.length === 0) return;

    setStatus('processing');
    setProgress(0);
    setErrorMsg(null);
    setOutputFiles([]);

    try {
      const results = await splitPdf(file, chunks, pdfLib.PDFDocument, (pct) => setProgress(pct));
      const outputs: OutputFile[] = results.map((r) => ({
        name: r.name,
        blob: r.blob,
        pageCount: chunks[results.indexOf(r)]?.length ?? 0,
        sizeLabel: `${formatMB(r.blob.size)} MB`,
      }));
      // Fix pageCount using index since indexOf may be off
      const outputsFixed: OutputFile[] = results.map((r, i) => ({
        name: r.name,
        blob: r.blob,
        pageCount: chunks[i]?.length ?? 0,
        sizeLabel: `${formatMB(r.blob.size)} MB`,
      }));
      setOutputFiles(outputsFixed);
      setStatus('done');
    } catch (err: unknown) {
      let msg: string;
      if (err instanceof Error && err.message.toLowerCase().includes('encrypt')) {
        msg = `"${file.name}" is password-protected. Unlock it first.`;
      } else {
        msg = `Split failed. ${err instanceof Error ? err.message : 'Unknown error.'}`;
      }
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const handleDownloadFile = (f: OutputFile) => {
    const url = URL.createObjectURL(f.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = f.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleDownloadZip = async () => {
    if (!file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    try {
      await downloadAllAsZip(outputFiles, baseName);
    } catch {
      setErrorMsg('Failed to create zip. Please try downloading files individually.');
    }
  };

  if (pdfLibError) {
    return (
      <div className="text-center py-10 text-rose-600 text-sm">
        {pdfLibError}
      </div>
    );
  }

  const hasFile = !!file;

  // Range validation chip content
  const rangeChip = (() => {
    if (mode !== 'ranges' || !rangeStr.trim()) return null;
    if (rangeError) return { ok: false, text: rangeError };
    if (parsedChunks) {
      const fileWord = parsedChunks.length === 1 ? 'file' : 'files';
      const preview = parsedChunks.map((chunk) => {
        const first = chunk[0] + 1;
        const last = chunk[chunk.length - 1] + 1;
        return first === last ? `${first}` : `${first}-${last}`;
      }).join(', ');
      return { ok: true, text: `→ ${parsedChunks.length} output ${fileWord}: ${preview}` };
    }
    return null;
  })();

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {/* Empty state */}
      {!hasFile && (
        <PdfDropzone
          accept="application/pdf"
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
            <p className="text-xs font-medium text-slate-600 mb-2">Split mode</p>
            <div className="flex rounded-lg overflow-hidden border border-slate-200">
              {(['ranges', 'every', 'fixed'] as Mode[]).map((m) => {
                const labels: Record<Mode, string> = {
                  ranges: 'By ranges',
                  every: 'Every page',
                  fixed: 'Fixed size',
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

          {/* Range input */}
          {mode === 'ranges' && (
            <div className="space-y-1.5">
              <input
                type="text"
                value={rangeStr}
                onChange={(e) => setRangeStr(e.target.value)}
                placeholder={pageCount ? `e.g. 1-3, 5, 8-${Math.min(12, pageCount)}` : 'e.g. 1-3, 5, 8-12'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-50 outline-none"
                aria-label="Page ranges"
              />
              {rangeChip && (
                <p className={`text-xs font-medium ${rangeChip.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {rangeChip.text}
                </p>
              )}
            </div>
          )}

          {/* Fixed size input */}
          {mode === 'fixed' && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600 whitespace-nowrap">Pages per chunk:</label>
              <input
                type="number"
                min={1}
                max={pageCount || 9999}
                value={fixedN}
                onChange={(e) => setFixedN(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-50 outline-none"
                aria-label="Pages per chunk"
              />
              {pageCount > 0 && (
                <p className="text-xs text-slate-500">
                  → {Math.ceil(pageCount / Math.max(1, fixedN))} output file{Math.ceil(pageCount / Math.max(1, fixedN)) !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Every page info */}
          {mode === 'every' && pageCount > 0 && (
            <p className="text-xs text-slate-500">
              → {pageCount} output file{pageCount !== 1 ? 's' : ''} (one per page)
            </p>
          )}

          {/* Thumbnail strip */}
          {thumbs.length > 0 && (
            <div className="overflow-x-auto">
              <PdfPageGrid pages={thumbs} mode="display" />
            </div>
          )}
          {pdfJsError && thumbs.length === 0 && (
            <p className="text-xs text-amber-600">Thumbnails unavailable.</p>
          )}

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

          {/* Action button */}
          <button
            type="button"
            onClick={handleSplit}
            disabled={isActionDisabled()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
          >
            {status === 'processing'
              ? 'Splitting…'
              : chunkCount > 0
                ? `Split into ${chunkCount} file${chunkCount !== 1 ? 's' : ''}`
                : 'Split PDF'}
          </button>
        </>
      )}

      {/* Done state */}
      {status === 'done' && outputFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>Split into {outputFiles.length} file{outputFiles.length !== 1 ? 's' : ''} successfully</span>
          </div>

          {/* Output file list */}
          <div className="space-y-2">
            {outputFiles.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2"
              >
                <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
                <span className="text-sm font-medium text-slate-800 flex-1 truncate">
                  {truncateName(f.name)}
                </span>
                <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                  {f.pageCount} page{f.pageCount !== 1 ? 's' : ''} · {f.sizeLabel}
                </span>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(f)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-medium transition-colors"
                >
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Download all as zip */}
          {outputFiles.length > 1 && (
            <button
              type="button"
              onClick={handleDownloadZip}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all"
            >
              Download all as .zip
            </button>
          )}

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
