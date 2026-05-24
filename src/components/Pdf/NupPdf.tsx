import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'processing' | 'done' | 'error';

const LAYOUTS = [
  { label: '2-up (side by side)', value: 2, cols: 2, rows: 1, scaleX: 0.48, scaleY: 0.92, gapX: 0.02, gapY: 0.04 },
  { label: '4-up (2×2 grid)', value: 4, cols: 2, rows: 2, scaleX: 0.48, scaleY: 0.46, gapX: 0.02, gapY: 0.04 },
];

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function nupPdf(
  file: File,
  layout: typeof LAYOUTS[0],
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const src = await PDFDocument.load(bytes, { updateMetadata: false });
  const totalPages = src.getPageCount();

  if (totalPages === 0) throw new Error('PDF has no pages');

  const out = await PDFDocument.create();
  const pagesPerSheet = layout.value;
  const nSheets = Math.ceil(totalPages / pagesPerSheet);

  for (let s = 0; s < nSheets; s++) {
    const sheet = out.addPage();
    const { width, height } = sheet.getSize();
    const outW = width * layout.scaleX;
    const outH = height * layout.scaleY;

    for (let c = 0; c < pagesPerSheet; c++) {
      const pageIdx = s * pagesPerSheet + c;
      if (pageIdx >= totalPages) break;

      const col = c % layout.cols;
      const row = Math.floor(c / layout.cols);
      const padX = width * layout.gapX;
      const padY = height * layout.gapY;

      const cellX = padX + col * (outW + padX * 2);
      const cellY = height - (row + 1) * (outH + padY * 2) + padY;

      const srcPage = src.getPage(pageIdx);
      const { width: pw, height: ph } = srcPage.getSize();
      const scale = Math.min(outW / pw, outH / ph);

      const e = await out.embedPage(srcPage);
      sheet.drawPage(e, {
        x: cellX + (outW - pw * scale) / 2,
        y: cellY + (outH - ph * scale) / 2,
        width: pw * scale,
        height: ph * scale,
      });
    }
  }

  const outBytes = await out.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function NupPdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [layoutIdx, setLayoutIdx] = useState(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-nup.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null); setStatus('idle'); setErrorMsg(null); setOutputBlob(null); setOutputName('');
  };

  const handleNup = async () => {
    if (!file || !pdfLib) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const blob = await nupPdf(file, LAYOUTS[layoutIdx], pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Unlock it first.');
      } else {
        setErrorMsg(`Failed to process. ${msg}`);
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
    a.click();
    URL.revokeObjectURL(url);
  };

  if (pdfLibError) return <div className="text-center py-10 text-rose-600 text-sm">{pdfLibError}</div>;

  const hasFile = !!file;

  return (
    <div className="space-y-4">
      <PdfTrustBadge />
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here to combine pages per sheet." />}
      {hasFile && status !== 'done' && (
        <>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">{truncateName(file.name)}</span>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{formatMB(file.size)} MB</span>
            <button type="button" onClick={handleRemove} className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Remove ${file.name}`}>×</button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
            <label className="block text-xs text-slate-500 mb-1">Layout</label>
            <select value={layoutIdx} onChange={(e) => setLayoutIdx(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400">
              {LAYOUTS.map((l, i) => <option key={i} value={i}>{l.label}</option>)}
            </select>
            <p className="text-xs text-slate-400 mt-1.5">2-up halves the page count. 4-up quarters it. Ideal for printing handouts or slide decks.</p>
          </div>

          {status === 'error' && errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}

          <button type="button" onClick={handleNup} disabled={status === 'processing'} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
            {status === 'processing' ? 'Processing…' : 'Combine pages & download'}
          </button>
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>Pages combined — {formatMB(outputBlob.size)} MB</span></div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input type="text" value={outputName} onChange={(e) => setOutputName(e.target.value)} className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" aria-label="Output filename" />
            <button type="button" onClick={handleDownload} className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all whitespace-nowrap">Download</button>
          </div>
          <button type="button" onClick={handleRemove} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">← Start over</button>
        </div>
      )}
    </div>
  );
}
