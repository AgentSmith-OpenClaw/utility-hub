import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function cropPdf(
  file: File,
  top: number,
  bottom: number,
  left: number,
  right: number,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });

  const pages = doc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const nx = left;
    const ny = bottom;
    const nw = width - left - right;
    const nh = height - top - bottom;
    if (nw <= 0 || nh <= 0) throw new Error('Crop margins exceed page dimensions');
    page.setCropBox(nx, ny, nw, nh);
  }

  const outBytes = await doc.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function CropPdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [top, setTop] = useState('0');
  const [bottom, setBottom] = useState('0');
  const [left, setLeft] = useState('0');
  const [right, setRight] = useState('0');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-cropped.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null); setStatus('idle'); setErrorMsg(null); setOutputBlob(null); setOutputName('');
    setTop('0'); setBottom('0'); setLeft('0'); setRight('0');
  };

  const handleCrop = async () => {
    if (!file || !pdfLib) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const blob = await cropPdf(file, Number(top) || 0, Number(bottom) || 0, Number(left) || 0, Number(right) || 0, pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Unlock it first.');
      } else {
        setErrorMsg(`Failed to crop PDF. ${msg}`);
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

  if (pdfLibError) {
    return <div className="text-center py-10 text-rose-600 text-sm">{pdfLibError}</div>;
  }

  const hasFile = !!file;

  const marginInput = (label: string, value: string, setter: (v: string) => void) => (
    <div className="flex-1">
      <label className="block text-xs text-slate-500 mb-1">{label} (pt)</label>
      <input type="number" min="0" value={value} onChange={(e) => setter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" />
    </div>
  );

  return (
    <div className="space-y-4">
      <PdfTrustBadge />
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here to crop its pages." />}
      {hasFile && status !== 'done' && (
        <>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">{truncateName(file.name)}</span>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{formatMB(file.size)} MB</span>
            <button type="button" onClick={handleRemove} className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Remove ${file.name}`}>×</button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <p className="text-xs text-slate-500">Set crop margins in points (1 inch = 72 pt). Margins are applied to all pages.</p>
            {marginInput('Top', top, setTop)}
            <div className="flex gap-3">
              {marginInput('Left', left, setLeft)}
              {marginInput('Right', right, setRight)}
            </div>
            {marginInput('Bottom', bottom, setBottom)}
          </div>

          {status === 'error' && errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}

          <button type="button" onClick={handleCrop} disabled={status === 'processing'} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
            {status === 'processing' ? 'Cropping…' : 'Crop & download'}
          </button>
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>PDF cropped — {formatMB(outputBlob.size)} MB</span></div>
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
