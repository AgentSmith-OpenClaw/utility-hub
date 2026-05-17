import React, { useState, useCallback, useEffect, useRef } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfJs } from '../../hooks/usePdfJs';

type PageMode = 'all' | 'range';
type LayoutMode = 'preserve' | 'joined';

interface ExtractOpts {
  pages: 'all' | number[]; // 0-indexed page numbers
  joinParagraphs: boolean;
  includePageNumbers: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parsePageRange(input: string, total: number): number[] | null {
  const indices: number[] = [];
  for (const part of input.split(',')) {
    const s = part.trim();
    const range = s.match(/^(\d+)-(\d+)$/);
    if (range) {
      const lo = parseInt(range[1]) - 1,
        hi = parseInt(range[2]) - 1;
      if (lo < 0 || hi >= total || lo > hi) return null;
      for (let j = lo; j <= hi; j++) indices.push(j);
    } else {
      const n = parseInt(s) - 1;
      if (isNaN(n) || n < 0 || n >= total) return null;
      indices.push(n);
    }
  }
  return indices.length ? Array.from(new Set(indices)).sort((a, b) => a - b) : null;
}

async function extractText(
  pdfJs: typeof import('pdfjs-dist'),
  file: File,
  opts: ExtractOpts,
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const doc = await pdfJs.getDocument({ data: bytes }).promise;
  const pageIndices =
    opts.pages === 'all'
      ? Array.from({ length: doc.numPages }, (_, i) => i)
      : opts.pages;
  const parts: string[] = [];
  for (const i of pageIndices) {
    const page = await doc.getPage(i + 1);
    const content = await page.getTextContent();
    let text = '';
    let lastY: number | null = null;
    for (const item of content.items) {
      const it = item as { str?: string; transform: number[] };
      if (typeof it.str !== 'string') continue;
      const y = it.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 1) text += '\n';
      text += it.str;
      lastY = y;
    }
    if (opts.joinParagraphs) {
      text = text.replace(/([^\n])\n(?!\n)/g, '$1 ').replace(/\n{2,}/g, '\n\n');
    }
    if (opts.includePageNumbers) {
      parts.push(`--- Page ${i + 1} ---\n${text}`);
    } else {
      parts.push(text);
    }
    page.cleanup();
  }
  return parts.join('\n\n');
}

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function triggerDownload(text: string, filename: string, mimeType: string) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function PdfToText() {
  const { lib: pdfJs, error: pdfJsError } = usePdfJs();

  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageMode, setPageMode] = useState<PageMode>('all');
  const [rangeInput, setRangeInput] = useState('');
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('preserve');
  const [includePageNumbers, setIncludePageNumbers] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [isScanned, setIsScanned] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive page indices from page mode + range input
  const getPageIndices = useCallback((): 'all' | number[] | null => {
    if (pageMode === 'all') return 'all';
    if (rangeInput.trim() === '') return null;
    const parsed = parsePageRange(rangeInput, numPages);
    return parsed;
  }, [pageMode, rangeInput, numPages]);

  const runExtraction = useCallback(async () => {
    if (!pdfJs || !file) return;
    const pages = getPageIndices();
    if (pages === null) {
      setRangeError('Invalid page range. Use format like: 1-5, 8, 10-12');
      return;
    }
    setRangeError(null);
    setIsExtracting(true);
    setExtractError(null);
    setIsScanned(false);
    try {
      const text = await extractText(pdfJs, file, {
        pages,
        joinParagraphs: layoutMode === 'joined',
        includePageNumbers,
      });
      setExtractedText(text);
      // Scanned PDF detection
      const totalChars = text.replace(/\s/g, '').length;
      if (totalChars < 10 && numPages > 0) {
        setIsScanned(true);
      }
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err.name === 'PasswordException' || err.message.toLowerCase().includes('password'))
      ) {
        setExtractError('This PDF is password-protected. Unlock it first.');
      } else {
        setExtractError(
          `Extraction failed. ${err instanceof Error ? err.message : 'Unknown error.'}`,
        );
      }
      setExtractedText('');
    } finally {
      setIsExtracting(false);
    }
  }, [pdfJs, file, getPageIndices, layoutMode, includePageNumbers, numPages]);

  // Load PDF meta when file changes
  useEffect(() => {
    if (!pdfJs || !file) return;
    let cancelled = false;
    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await pdfJs.getDocument({ data: bytes }).promise;
        if (!cancelled) setNumPages(doc.numPages);
      } catch { /* caught during extraction */ }
    })();
    return () => { cancelled = true; };
  }, [pdfJs, file]);

  // Auto-extract whenever file or options change
  useEffect(() => {
    if (!file || !pdfJs || numPages === 0) return;
    if (pageMode === 'range' && rangeInput.trim() === '') return;
    runExtraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, pdfJs, numPages, pageMode, rangeInput, layoutMode, includePageNumbers]);

  const handleFile = useCallback(
    (files: File[]) => {
      const f = files[0];
      if (!f) return;
      setFile(f);
      setNumPages(0);
      setExtractedText('');
      setExtractError(null);
      setIsScanned(false);
      setRangeInput('');
      setRangeError(null);
      setPageMode('all');
      setLayoutMode('preserve');
      setIncludePageNumbers(false);
    },
    [],
  );

  const handleStartOver = () => {
    setFile(null);
    setNumPages(0);
    setExtractedText('');
    setExtractError(null);
    setIsScanned(false);
    setRangeInput('');
    setRangeError(null);
    setPageMode('all');
    setLayoutMode('preserve');
    setIncludePageNumbers(false);
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch {
      // Safari fallback
      const ta = document.createElement('textarea');
      ta.value = extractedText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!file || !extractedText) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(extractedText, `${base}-text.txt`, 'text/plain');
  };

  const handleDownloadMd = () => {
    if (!file || !extractedText) return;
    const base = file.name.replace(/\.pdf$/i, '');
    triggerDownload(extractedText, `${base}-text.md`, 'text/markdown');
  };

  useEffect(() => () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
  }, []);

  const wordCount = countWords(extractedText);
  const charCount = extractedText.length;

  if (pdfJsError) {
    return (
      <div className="px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
        PDF engine failed to load. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {/* Empty state */}
      {!file && (
        <PdfDropzone
          accept="application/pdf"
          onFiles={handleFile}
          label="Drop a PDF here, or click to browse."
        />
      )}

      {/* Loaded state */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
          {/* Left column: file row + output */}
          <div className="space-y-4">
            {/* File info row */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-sm">
              <span className="text-xl" aria-hidden="true">📄</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatBytes(file.size)}
                  {numPages > 0 && ` · ${numPages} page${numPages !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartOver}
                className="text-xs text-slate-400 hover:text-rose-500 transition-colors whitespace-nowrap"
              >
                Remove
              </button>
            </div>

            {/* Scanned PDF warning */}
            {isScanned && (
              <div className="px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                This PDF has no extractable text — it looks like a scan. OCR is needed to read text
                from scanned pages, which we don&apos;t yet offer client-side.
              </div>
            )}

            {/* Error */}
            {extractError && (
              <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {extractError}
              </div>
            )}

            {/* Spinner while extracting */}
            {isExtracting && (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
                <svg
                  className="animate-spin h-4 w-4 text-rose-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Extracting text…
              </div>
            )}

            {/* Output panel */}
            {!isExtracting && !extractError && extractedText !== '' && (
              <div className="space-y-2">
                {/* Stats */}
                <p className="text-xs text-slate-500">
                  {wordCount.toLocaleString()} word{wordCount !== 1 ? 's' : ''} &middot;{' '}
                  {charCount.toLocaleString()} character{charCount !== 1 ? 's' : ''} &middot;{' '}
                  {numPages} page{numPages !== 1 ? 's' : ''}
                </p>

                {/* Textarea */}
                <textarea
                  readOnly
                  value={extractedText}
                  rows={20}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                  aria-label="Extracted text"
                />

                {/* Action row */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-rose-300 hover:text-rose-600 transition-colors"
                  >
                    ↓ Download .txt
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadMd}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-rose-300 hover:text-rose-600 transition-colors"
                  >
                    ↓ Download .md
                  </button>
                </div>
              </div>
            )}

            {/* Empty text (no error, not extracting, no text yet) — placeholder */}
            {!isExtracting && !extractError && extractedText === '' && numPages > 0 && !isScanned && (
              <div className="flex items-center justify-center py-8 text-slate-400 text-sm">
                No text found on the selected pages.
              </div>
            )}
          </div>

          {/* Right column: options */}
          <div className="space-y-4">
            {/* Page selector */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Pages</p>
              {/* Segmented control */}
              <div role="group" aria-label="Page selection">
                <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
                  <button
                    type="button"
                    aria-pressed={pageMode === 'all'}
                    onClick={() => { setPageMode('all'); setRangeError(null); }}
                    className={`flex-1 py-2 font-medium transition-colors ${
                      pageMode === 'all'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All pages
                  </button>
                  <button
                    type="button"
                    aria-pressed={pageMode === 'range'}
                    onClick={() => setPageMode('range')}
                    className={`flex-1 py-2 font-medium transition-colors border-l border-slate-200 ${
                      pageMode === 'range'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Page range
                  </button>
                </div>
              </div>
              {pageMode === 'range' && (
                <div>
                  <input
                    type="text"
                    value={rangeInput}
                    aria-label="Page range (e.g. 1-5, 8, 10-12)"
                    onChange={(e) => { setRangeInput(e.target.value); setRangeError(null); }}
                    placeholder={`e.g. 1-5, 8, 10-12${numPages > 0 ? ` (of ${numPages})` : ''}`}
                    className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 ${
                      rangeError ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {rangeError && (
                    <p className="text-xs text-rose-600 mt-1">{rangeError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Layout mode */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Layout</p>
              <div role="group" aria-label="Layout mode">
                <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
                  <button
                    type="button"
                    aria-pressed={layoutMode === 'preserve'}
                    onClick={() => setLayoutMode('preserve')}
                    className={`flex-1 py-2 font-medium transition-colors ${
                      layoutMode === 'preserve'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Preserve line breaks
                  </button>
                  <button
                    type="button"
                    aria-pressed={layoutMode === 'joined'}
                    onClick={() => setLayoutMode('joined')}
                    className={`flex-1 py-2 font-medium transition-colors border-l border-slate-200 ${
                      layoutMode === 'joined'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Joined paragraphs
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {layoutMode === 'preserve'
                  ? 'Each line break in the PDF is kept as-is.'
                  : 'Single newlines are collapsed into spaces; paragraph breaks are preserved.'}
              </p>
            </div>

            {/* Include page numbers */}
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="w-4 h-4 rounded accent-rose-600"
                />
                <div>
                  <p className="text-sm font-medium text-slate-800">Include page numbers</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Adds <code className="font-mono bg-slate-100 px-1 rounded">--- Page n ---</code> before each page&apos;s text.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
