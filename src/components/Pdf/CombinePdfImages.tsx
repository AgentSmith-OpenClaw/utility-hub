import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'processing' | 'done' | 'error';

interface MixedFile {
  id: string;
  file: File;
  type: 'pdf' | 'image';
  sizeLabel: string;
  pageCount?: number;
}

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 30): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function fileType(file: File): 'pdf' | 'image' {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'image';
}

async function combineMixed(
  files: MixedFile[],
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const out = await PDFDocument.create();

  for (const mf of files) {
    const bytes = new Uint8Array(await mf.file.arrayBuffer());

    if (mf.type === 'pdf') {
      try {
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pageCount = src.getPageCount();
        if (pageCount > 0) {
          const indices = Array.from({ length: pageCount }, (_, i) => i);
          const copied = await out.copyPages(src, indices);
          copied.forEach((p) => out.addPage(p));
        }
      } catch {
        throw new Error(`Failed to read PDF: "${mf.file.name}"`);
      }
    } else {
      let image;
      const ext = mf.file.name.split('.').pop()?.toLowerCase();
      if (ext === 'png') {
        image = await out.embedPng(bytes);
      } else {
        image = await out.embedJpg(bytes);
      }
      const page = out.addPage();
      const { width, height } = page.getSize();
      const iw = image.width;
      const ih = image.height;
      const scale = Math.min(width / iw, height / ih, 1);
      page.drawImage(image, {
        x: (width - iw * scale) / 2,
        y: (height - ih * scale) / 2,
        width: iw * scale,
        height: ih * scale,
      });
    }
  }

  const outBytes = await out.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

let nextId = 0;

export default function CombinePdfImages() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [files, setFiles] = useState<MixedFile[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('combined.pdf');

  const handleFiles = useCallback((newFiles: File[]) => {
    const items: MixedFile[] = newFiles.map((f) => ({
      id: String(++nextId),
      file: f,
      type: fileType(f),
      sizeLabel: formatMB(f.size),
    }));
    setFiles((prev) => [...prev, ...items]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
  }, []);

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClear = () => {
    setFiles([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
  };

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    setFiles((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= files.length - 1) return;
    setFiles((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleCombine = async () => {
    if (!pdfLib || files.length === 0) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const blob = await combineMixed(files, pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to combine files.');
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

  if (pdfLibError) return <div className="text-center py-10 text-rose-600 text-sm">{pdfLibError}</div>;

  return (
    <div className="space-y-4">
      <PdfTrustBadge />
      {status !== 'done' && (
        <>
          {files.length === 0 ? (
            <PdfDropzone onFiles={handleFiles} accept="application/pdf,image/jpeg,image/png,image/webp" multiple label="Drop PDFs and images here, or click to browse." />
          ) : (
            <PdfDropzone onFiles={handleFiles} accept="application/pdf,image/jpeg,image/png,image/webp" multiple compact label="Add more files" />
          )}

          {files.length > 0 && (
            <div className="space-y-1">
              {files.map((f, i) => (
                <div key={f.id} className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2">
                  <span className="text-base flex-shrink-0">{f.type === 'pdf' ? '📄' : '🖼️'}</span>
                  <span className="text-sm font-medium text-slate-800 flex-1 truncate">{truncateName(f.file.name)}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0">{f.sizeLabel} MB</span>
                  <button type="button" onClick={() => handleMoveUp(i)} disabled={i === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Move up">▲</button>
                  <button type="button" onClick={() => handleMoveDown(i)} disabled={i === files.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Move down">▼</button>
                  <button type="button" onClick={() => handleDelete(f.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={`Remove ${f.file.name}`}>×</button>
                </div>
              ))}
            </div>
          )}

          {status === 'error' && errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}

          {files.length > 0 && (
            <div className="flex gap-3">
              <button type="button" onClick={handleCombine} disabled={status === 'processing'} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
                {status === 'processing' ? 'Combining…' : `Combine ${files.length} file${files.length !== 1 ? 's' : ''}`}
              </button>
              <button type="button" onClick={handleClear} disabled={status === 'processing'} className="px-5 py-3 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors whitespace-nowrap">Clear all</button>
            </div>
          )}
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>Combined — {formatMB(outputBlob.size)} MB</span></div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input type="text" value={outputName} onChange={(e) => setOutputName(e.target.value)} className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" aria-label="Output filename" />
            <button type="button" onClick={handleDownload} className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all whitespace-nowrap">Download</button>
          </div>
          <button type="button" onClick={handleClear} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">← Start over</button>
        </div>
      )}
    </div>
  );
}
