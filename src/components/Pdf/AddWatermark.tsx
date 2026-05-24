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

async function addWatermark(
  file: File,
  text: string,
  fontSize: number,
  color: 'gray' | 'red' | 'blue',
  PDFDocument: typeof import('pdf-lib').PDFDocument,
  rgb: (r: number, g: number, b: number) => ReturnType<typeof import('pdf-lib').rgb>,
  StandardFonts: typeof import('pdf-lib').StandardFonts,
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  const colorMap = {
    gray: rgb(0.75, 0.75, 0.75),
    red: rgb(0.85, 0.7, 0.7),
    blue: rgb(0.65, 0.7, 0.85),
  };

  const pages = doc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: (height - fontSize) / 2,
      size: fontSize,
      font,
      color: colorMap[color],
    });
  }

  const outBytes = await doc.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function AddWatermark() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState('48');
  const [color, setColor] = useState<'gray' | 'red' | 'blue'>('gray');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-watermarked.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null); setStatus('idle'); setErrorMsg(null); setOutputBlob(null); setOutputName('');
  };

  const handleAdd = async () => {
    if (!file || !pdfLib || !text.trim()) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const blob = await addWatermark(file, text.trim(), parseInt(fontSize) || 48, color, pdfLib.PDFDocument, pdfLib.rgb, pdfLib.StandardFonts);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Unlock it first.');
      } else {
        setErrorMsg(`Failed to add watermark. ${msg}`);
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
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here to add a text watermark." />}
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
              <label className="block text-xs text-slate-500 mb-1">Watermark text</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" />
            </div>
            <div className="px-4 py-3">
              <label className="block text-xs text-slate-500 mb-1">Font size</label>
              <input type="number" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" />
            </div>
            <div className="px-4 py-3">
              <label className="block text-xs text-slate-500 mb-1">Color</label>
              <div className="flex gap-2">
                {(['gray', 'red', 'blue'] as const).map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${color === c ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {status === 'error' && errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}

          <button type="button" onClick={handleAdd} disabled={status === 'processing' || !text.trim()} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
            {status === 'processing' ? 'Adding watermark…' : 'Add watermark & download'}
          </button>
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>Watermark added — {formatMB(outputBlob.size)} MB</span></div>
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
