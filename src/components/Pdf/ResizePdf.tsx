import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'reading' | 'processing' | 'done' | 'error';

const PAGE_SIZES: { label: string; width: number; height: number }[] = [
  { label: 'A4 (595 × 842 pt)', width: 595, height: 842 },
  { label: 'Letter (612 × 792 pt)', width: 612, height: 792 },
  { label: 'Legal (612 × 1008 pt)', width: 612, height: 1008 },
  { label: 'A5 (420 × 595 pt)', width: 420, height: 595 },
  { label: 'A3 (842 × 1191 pt)', width: 842, height: 1191 },
  { label: 'Tabloid (792 × 1224 pt)', width: 792, height: 1224 },
];

const FIT_OPTIONS = [
  { label: 'Scale to fit (maintain aspect ratio)', value: 'fit' },
  { label: 'Stretch to fill', value: 'stretch' },
  { label: 'Keep original size (center on page)', value: 'none' },
];

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function resizePdf(
  file: File,
  sizeIdx: number,
  fitMode: string,
  customW: number,
  customH: number,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });

  const targetW = sizeIdx >= 0 ? PAGE_SIZES[sizeIdx].width : customW;
  const targetH = sizeIdx >= 0 ? PAGE_SIZES[sizeIdx].height : customH;

  const pages = doc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    page.setSize(targetW, targetH);

    if (fitMode === 'fit') {
      const scale = Math.min(targetW / width, targetH / height);
      page.scaleContent(scale, scale);
      const tx = (targetW - width * scale) / 2;
      const ty = (targetH - height * scale) / 2;
      page.translateContent(tx, ty);
    } else if (fitMode === 'stretch') {
      page.scaleContent(targetW / width, targetH / height);
    }
  }

  const outBytes = await doc.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function ResizePdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [fitMode, setFitMode] = useState('fit');
  const [customW, setCustomW] = useState('595');
  const [customH, setCustomH] = useState('842');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-resized.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null); setStatus('idle'); setErrorMsg(null); setOutputBlob(null); setOutputName('');
  };

  const handleResize = async () => {
    if (!file || !pdfLib) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const blob = await resizePdf(file, sizeIdx, fitMode, parseInt(customW) || 595, parseInt(customH) || 842, pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Unlock it first.');
      } else {
        setErrorMsg(`Failed to resize PDF. ${msg}`);
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

  return (
    <div className="space-y-4">
      <PdfTrustBadge />
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here to resize its pages." />}
      {hasFile && status !== 'done' && (
        <>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">{truncateName(file.name)}</span>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{formatMB(file.size)} MB</span>
            <button type="button" onClick={handleRemove} className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Remove ${file.name}`}>×</button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            <div className="px-4 py-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Target page size</label>
              <select value={sizeIdx} onChange={(e) => setSizeIdx(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400">
                {PAGE_SIZES.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
                <option value={-1}>Custom (pt)</option>
              </select>
            </div>

            {sizeIdx === -1 && (
              <div className="px-4 py-3 flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Width (pt)</label>
                  <input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Height (pt)</label>
                  <input type="number" value={customH} onChange={(e) => setCustomH(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" />
                </div>
              </div>
            )}

            <div className="px-4 py-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Content fit</label>
              <select value={fitMode} onChange={(e) => setFitMode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400">
                {FIT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {status === 'error' && errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}

          <button type="button" onClick={handleResize} disabled={status === 'processing'} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
            {status === 'processing' ? 'Resizing…' : 'Resize & download'}
          </button>
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>PDF resized — {formatMB(outputBlob.size)} MB</span></div>
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
