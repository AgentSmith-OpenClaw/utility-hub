import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'processing' | 'done' | 'error';

const POSITIONS = [
  { label: 'Bottom center', value: 'bc', x: 0.5, y: 30 },
  { label: 'Bottom right', value: 'br', x: 0.95, y: 30 },
  { label: 'Bottom left', value: 'bl', x: 0.05, y: 30 },
  { label: 'Top center', value: 'tc', x: 0.5, y: -8 },
  { label: 'Top right', value: 'tr', x: 0.95, y: -8 },
  { label: 'Top left', value: 'tl', x: 0.05, y: -8 },
];

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function addPageNumbers(
  file: File,
  startNum: number,
  fontSize: number,
  positionIdx: number,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
  rgb: (r: number, g: number, b: number) => ReturnType<typeof import('pdf-lib').rgb>,
  StandardFonts: typeof import('pdf-lib').StandardFonts,
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pos = POSITIONS[positionIdx];

  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const num = (startNum + i).toString();
    const textWidth = font.widthOfTextAtSize(num, fontSize);
    const x = pos.x * width - textWidth / 2;
    const y = pos.y > 0 ? pos.y : height + pos.y;

    page.drawText(num, {
      x: pos.value.startsWith('b') && pos.value.endsWith('c') ? width / 2 - textWidth / 2
        : pos.value.endsWith('r') ? width - textWidth - 20
        : 20,
      y,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  const outBytes = await doc.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function AddPageNumbers() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startNum, setStartNum] = useState('1');
  const [fontSize, setFontSize] = useState('12');
  const [positionIdx, setPositionIdx] = useState(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-numbered.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null); setStatus('idle'); setErrorMsg(null); setOutputBlob(null); setOutputName('');
  };

  const handleAdd = async () => {
    if (!file || !pdfLib) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const blob = await addPageNumbers(file, parseInt(startNum) || 1, parseInt(fontSize) || 12, positionIdx, pdfLib.PDFDocument, pdfLib.rgb, pdfLib.StandardFonts);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Unlock it first.');
      } else {
        setErrorMsg(`Failed to add page numbers. ${msg}`);
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
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here to add page numbers." />}
      {hasFile && status !== 'done' && (
        <>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">{truncateName(file.name)}</span>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{formatMB(file.size)} MB</span>
            <button type="button" onClick={handleRemove} className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Remove ${file.name}`}>×</button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            <div className="px-4 py-3 flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Start at</label>
                <input type="number" min="1" value={startNum} onChange={(e) => setStartNum(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Font size</label>
                <input type="number" min="6" max="48" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" />
              </div>
            </div>
            <div className="px-4 py-3">
              <label className="block text-xs text-slate-500 mb-1">Position</label>
              <select value={positionIdx} onChange={(e) => setPositionIdx(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400">
                {POSITIONS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {status === 'error' && errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}

          <button type="button" onClick={handleAdd} disabled={status === 'processing'} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
            {status === 'processing' ? 'Adding numbers…' : 'Add page numbers & download'}
          </button>
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>Page numbers added — {formatMB(outputBlob.size)} MB</span></div>
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
