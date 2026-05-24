import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'reading' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2);
}

function formatKB(bytes: number): string {
  return (bytes / 1024).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

interface PdfInfo {
  pageCount: number;
  fileName: string;
  fileSize: number;
  encrypted: boolean;
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  pageWidth: number;
  pageHeight: number;
}

async function readPdfInfo(
  file: File,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<PdfInfo> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(buf, { updateMetadata: false });
  const pageCount = doc.getPageCount();
  let pageWidth = 0;
  let pageHeight = 0;

  if (pageCount > 0) {
    try {
      const page = doc.getPage(0);
      const size = page.getSize();
      pageWidth = Math.round(size.width);
      pageHeight = Math.round(size.height);
    } catch {
      // ignore dimension errors
    }
  }

  return {
    pageCount,
    fileName: file.name,
    fileSize: file.size,
    encrypted: doc.isEncrypted,
    title: doc.getTitle() || '—',
    author: doc.getAuthor() || '—',
    subject: doc.getSubject() || '—',
    keywords: doc.getKeywords() || '—',
    creator: doc.getCreator() || '—',
    producer: doc.getProducer() || '—',
    pageWidth,
    pageHeight,
  };
}

function formatDimensions(w: number, h: number): string {
  if (!w || !h) return '—';
  const wIn = (w / 72).toFixed(1);
  const hIn = (h / 72).toFixed(1);
  return `${wIn}" × ${hIn}" (${w} × ${h} pt)`;
}

function pageSizeName(w: number, h: number): string | null {
  if (!w || !h) return null;
  if (w === 612 && h === 792) return 'Letter';
  if (w === 792 && h === 612) return 'Letter (Landscape)';
  if (w === 595 && h === 842) return 'A4';
  if (w === 842 && h === 595) return 'A4 (Landscape)';
  if (w === 612 && h === 1008) return 'Legal';
  if (Math.abs(w - 419) <= 1 && Math.abs(h - 595) <= 1) return 'A5';
  if (Math.abs(w - 595) <= 1 && Math.abs(h - 419) <= 1) return 'A5 (Landscape)';
  if (Math.abs(w - 297) <= 1 && Math.abs(h - 420) <= 1) return 'A3';
  if (Math.abs(w - 420) <= 1 && Math.abs(h - 297) <= 1) return 'A3 (Landscape)';
  if (Math.abs(w - 792) <= 1 && Math.abs(h - 1224) <= 1) return 'Tabloid';
  return null;
}

export default function PdfPageCounter() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f || !pdfLib) return;
    setFile(f);
    setStatus('reading');
    setErrorMsg(null);
    setPdfInfo(null);

    try {
      const info = await readPdfInfo(f, pdfLib.PDFDocument);
      setPdfInfo(info);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Use the Unlock PDF tool to remove the password first.');
      } else {
        setErrorMsg('Failed to read the PDF. Make sure it is a valid PDF file.');
      }
      setFile(null);
      setStatus('error');
    }
  }, [pdfLib]);

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setErrorMsg(null);
    setPdfInfo(null);
  };

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

      {!file && (
        <PdfDropzone
          onFiles={handleFiles}
          label="Drop a PDF here to see its page count, size, and details."
        />
      )}

      {status === 'reading' && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full" aria-hidden="true" />
          <span>Reading PDF…</span>
        </div>
      )}

      {status === 'error' && errorMsg && file === null && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {status === 'done' && pdfInfo && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">
              {truncateName(pdfInfo.fileName)}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Remove ${pdfInfo.fileName}`}
            >
              ×
            </button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">Pages</span>
              <span className="text-sm font-semibold text-slate-900">{pdfInfo.pageCount}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">File size</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatMB(pdfInfo.fileSize)} MB ({formatKB(pdfInfo.fileSize)} KB)
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">Avg size per page</span>
              <span className="text-sm font-semibold text-slate-900">
                {pdfInfo.pageCount > 0
                  ? `${formatKB(pdfInfo.fileSize / pdfInfo.pageCount)} KB`
                  : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">Page dimensions</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatDimensions(pdfInfo.pageWidth, pdfInfo.pageHeight)}
                {pageSizeName(pdfInfo.pageWidth, pdfInfo.pageHeight) && (
                  <span className="ml-1.5 text-xs font-normal text-slate-500">
                    ({pageSizeName(pdfInfo.pageWidth, pdfInfo.pageHeight)})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">Encrypted</span>
              <span className={`text-sm font-semibold ${pdfInfo.encrypted ? 'text-amber-600' : 'text-slate-900'}`}>
                {pdfInfo.encrypted ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            <div className="px-4 py-2.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Metadata</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-slate-600">Title</span>
              <span className="text-sm font-medium text-slate-800 max-w-[60%] truncate text-right">{pdfInfo.title}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-slate-600">Author</span>
              <span className="text-sm font-medium text-slate-800 max-w-[60%] truncate text-right">{pdfInfo.author}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-slate-600">Subject</span>
              <span className="text-sm font-medium text-slate-800 max-w-[60%] truncate text-right">{pdfInfo.subject}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-slate-600">Keywords</span>
              <span className="text-sm font-medium text-slate-800 max-w-[60%] truncate text-right">{pdfInfo.keywords}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-slate-600">Creator</span>
              <span className="text-sm font-medium text-slate-800 max-w-[60%] truncate text-right">{pdfInfo.creator}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-slate-600">Producer</span>
              <span className="text-sm font-medium text-slate-800 max-w-[60%] truncate text-right">{pdfInfo.producer}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Check another PDF
          </button>
        </div>
      )}
    </div>
  );
}
