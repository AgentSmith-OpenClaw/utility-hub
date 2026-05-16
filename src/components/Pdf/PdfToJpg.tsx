import React, { useState, useCallback, useRef, useEffect } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { ToolCard } from '../Tools/ToolShell';
import { usePdfJs } from '../../hooks/usePdfJs';
import PdfPageGrid, { PageThumb } from './PdfPageGrid';

type Status = 'idle' | 'loading' | 'processing' | 'done' | 'error';
type DpiOption = 72 | 150 | 300;

interface OutputFile {
  name: string;
  blob: Blob;
  url: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function renderPageToJpg(
  page: import('pdfjs-dist').PDFPageProxy,
  dpi: 72 | 150 | 300,
  quality: number, // 0-1
): Promise<Blob> {
  const scale = dpi / 72;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality));
}

async function convertPdfToJpg(
  file: File,
  selectedIndices: number[], // 0-indexed
  dpi: 72 | 150 | 300,
  quality: number, // 0-1
  pdfJs: typeof import('pdfjs-dist'),
  onProgress: (pct: number) => void,
): Promise<{ name: string; blob: Blob; url: string }[]> {
  const bytes = await file.arrayBuffer();
  const doc = await pdfJs.getDocument({ data: bytes }).promise;
  const base = file.name.replace(/\.pdf$/i, '');
  const out: { name: string; blob: Blob; url: string }[] = [];
  for (let i = 0; i < selectedIndices.length; i++) {
    const pageNum = selectedIndices[i] + 1;
    const page = await doc.getPage(pageNum);
    const blob = await renderPageToJpg(page, dpi, quality);
    const url = URL.createObjectURL(blob);
    out.push({ name: `${base}-page-${String(pageNum).padStart(3, '0')}.jpg`, blob, url });
    page.cleanup();
    onProgress(((i + 1) / selectedIndices.length) * 100);
  }
  return out;
}

async function downloadZip(files: { name: string; blob: Blob }[], baseName: string) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f.blob));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseName}-pages.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Estimated output size in bytes: width * height * 3 bytes/px * quality factor * pages
function estimateOutputMb(
  pageCount: number,
  dpi: DpiOption,
  quality: number,
  // A4 page in inches ~8.3x11.7
  widthIn = 8.3,
  heightIn = 11.7,
): number {
  const w = Math.floor(widthIn * dpi);
  const h = Math.floor(heightIn * dpi);
  // JPEG compression ratio roughly ~1/10 at q=0.9, scale with quality
  const compressionRatio = 0.1 * (quality / 0.9);
  return (w * h * 3 * compressionRatio * pageCount) / (1024 * 1024);
}

export default function PdfToJpg() {
  const { lib: pdfJs, error: pdfJsError } = usePdfJs();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const [dpi, setDpi] = useState<DpiOption>(150);
  const [quality, setQuality] = useState(90);

  const [outputs, setOutputs] = useState<OutputFile[]>([]);
  const [isZipping, setIsZipping] = useState(false);

  const outputUrlsRef = useRef<string[]>([]);

  // Initialize all pages as selected when file loads
  useEffect(() => {
    if (pageCount > 0) {
      setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)));
    }
  }, [pageCount]);

  // Cleanup output URLs on unmount
  useEffect(() => {
    return () => {
      outputUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const revokeOutputUrls = useCallback(() => {
    outputUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    outputUrlsRef.current = [];
  }, []);

  const handleFile = useCallback(
    async (files: File[]) => {
      const f = files[0];
      if (!f || !pdfJs) return;

      setFile(f);
      setStatus('loading');
      setErrorMsg(null);
      setThumbs([]);
      setOutputs([]);
      revokeOutputUrls();

      try {
        const bytes = await f.arrayBuffer();
        const doc = await pdfJs.getDocument({ data: bytes }).promise;
        const count = doc.numPages;
        setPageCount(count);

        // Render thumbnails at 72 DPI (scale = 1.0)
        const generatedThumbs: PageThumb[] = [];
        for (let i = 0; i < count; i++) {
          const page = await doc.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1.0 });
          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          generatedThumbs.push({ index: i, thumbnail: canvas.toDataURL('image/jpeg', 0.7) });
          page.cleanup();
        }
        setThumbs(generatedThumbs);
        setStatus('idle');
      } catch (err: unknown) {
        // Check for password-protected PDF
        if (
          err instanceof Error &&
          (err.name === 'PasswordException' || err.message.includes('Password'))
        ) {
          setErrorMsg(`"${f.name}" is password-protected. Unlock it first.`);
        } else {
          setErrorMsg(`Failed to load PDF. ${err instanceof Error ? err.message : 'Unknown error.'}`);
        }
        setStatus('error');
        setFile(null);
      }
    },
    [pdfJs, revokeOutputUrls],
  );

  const handleSelect = useCallback((index: number, selected: boolean) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (selected) next.add(index);
      else next.delete(index);
      return next;
    });
  }, []);

  const handleSelectAll = () => {
    setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)));
  };

  const handleSelectNone = () => {
    setSelectedPages(new Set());
  };

  const handleConvert = async () => {
    if (!pdfJs || !file || selectedPages.size === 0) return;

    setStatus('processing');
    setProgress(0);
    setErrorMsg(null);
    revokeOutputUrls();

    try {
      const selectedIndices = Array.from(selectedPages).sort((a, b) => a - b);
      const result = await convertPdfToJpg(
        file,
        selectedIndices,
        dpi,
        quality / 100,
        pdfJs,
        (pct) => setProgress(pct),
      );
      result.forEach((r) => outputUrlsRef.current.push(r.url));
      setOutputs(result);
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(`Conversion failed. ${err instanceof Error ? err.message : 'Unknown error.'}`);
      setStatus('error');
    }
  };

  const handleStartOver = () => {
    revokeOutputUrls();
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setErrorMsg(null);
    setPageCount(0);
    setThumbs([]);
    setSelectedPages(new Set());
    setOutputs([]);
  };

  const handleDownloadZip = async () => {
    if (outputs.length === 0) return;
    setIsZipping(true);
    try {
      const baseName = file?.name.replace(/\.pdf$/i, '') ?? 'pages';
      await downloadZip(outputs, baseName);
    } finally {
      setIsZipping(false);
    }
  };

  const qualityFraction = quality / 100;
  const estimatedMb =
    file && pageCount > 0 && selectedPages.size > 0
      ? estimateOutputMb(selectedPages.size, dpi, qualityFraction)
      : 0;
  const showSizeWarning = estimatedMb > 100;

  const canConvert = !!pdfJs && !!file && selectedPages.size > 0 && status !== 'processing' && status !== 'loading';

  if (pdfJsError) {
    return (
      <div className="text-center py-10 text-rose-600 text-sm">{pdfJsError}</div>
    );
  }

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {/* Empty state */}
      {!file && status !== 'done' && (
        <>
          <PdfDropzone
            accept="application/pdf"
            onFiles={handleFile}
            label="Drop a PDF here, or click to browse."
          />
          {errorMsg && (
            <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}
        </>
      )}

      {/* Loading thumbnails */}
      {file && status === 'loading' && (
        <div className="text-center py-8 text-slate-500 text-sm">Loading PDF…</div>
      )}

      {/* Loaded state */}
      {file && (status === 'idle' || status === 'processing' || status === 'error') && thumbs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* File info row */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-sm">
              <span className="text-xl" aria-hidden="true">📄</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatBytes(file.size)} · {pageCount} page{pageCount !== 1 ? 's' : ''}</p>
              </div>
              <button
                type="button"
                onClick={handleStartOver}
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors whitespace-nowrap"
              >
                Remove
              </button>
            </div>

            {/* Size warning */}
            {showSizeWarning && (
              <div className="px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Estimated output size is ~{estimatedMb.toFixed(0)} MB. At 300 DPI with many pages, this may be large. Consider reducing resolution or selecting fewer pages.
              </div>
            )}

            {/* Selection bar */}
            <div className="flex items-center gap-3 text-sm">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
              >
                Select all
              </button>
              <span className="text-slate-300" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={handleSelectNone}
                className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
              >
                Select none
              </button>
              <span className="text-slate-500 ml-auto">
                {selectedPages.size} of {pageCount} page{pageCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Page grid */}
            <PdfPageGrid
              pages={thumbs}
              mode="multi"
              selected={selectedPages}
              onSelect={handleSelect}
            />

            {/* Progress bar */}
            {status === 'processing' && (
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Error message */}
            {status === 'error' && errorMsg && (
              <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {errorMsg}
              </div>
            )}

            {/* Action button */}
            <button
              type="button"
              onClick={handleConvert}
              disabled={!canConvert}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
            >
              {status === 'processing'
                ? `Converting… ${Math.round(progress)}%`
                : `Convert ${selectedPages.size} page${selectedPages.size !== 1 ? 's' : ''} to JPG`}
            </button>
          </div>

          {/* Right column: options panel */}
          <div>
            <ToolCard title="Export options">
              <div className="space-y-4">
                {/* Resolution */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="pdf-jpg-dpi">
                    Resolution
                  </label>
                  <select
                    id="pdf-jpg-dpi"
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value) as DpiOption)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                  >
                    <option value={72}>Low (72 DPI)</option>
                    <option value={150}>Medium (150 DPI)</option>
                    <option value={300}>High (300 DPI)</option>
                  </select>
                </div>

                {/* Quality slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700" htmlFor="pdf-jpg-quality">
                      Quality
                    </label>
                    <span className="text-xs font-medium text-slate-500">{quality}%</span>
                  </div>
                  <input
                    id="pdf-jpg-quality"
                    type="range"
                    min={50}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Smaller file</span>
                    <span>Best quality</span>
                  </div>
                </div>
              </div>
            </ToolCard>
          </div>
        </div>
      )}

      {/* Done state */}
      {status === 'done' && outputs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>{outputs.length} JPG{outputs.length !== 1 ? 's' : ''} ready — click a filename below to download individually, or grab them all as a zip.</span>
          </div>

          {/* Result grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {outputs.map((out) => (
              <div key={out.name} className="flex flex-col items-center gap-1.5">
                <div className="relative overflow-hidden rounded-md border border-slate-200 w-20 h-[110px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={out.url}
                    alt={out.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <a
                  href={out.url}
                  download={out.name}
                  className="text-[10px] text-rose-600 hover:text-rose-700 font-medium text-center truncate max-w-[80px] transition-colors"
                  title={out.name}
                >
                  {out.name.replace(/^.*-page-(\d+)\.jpg$/i, 'Page $1')}
                </a>
              </div>
            ))}
          </div>

          {/* Zip download (only when > 1 output) */}
          {outputs.length > 1 && (
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:opacity-60 transition-all"
            >
              {isZipping ? 'Packing zip…' : `Download all as .zip (${outputs.length} files)`}
            </button>
          )}

          <button
            type="button"
            onClick={handleStartOver}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
  );
}
