import React, { useState, useCallback, useRef } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'reading' | 'signing' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function signPdf(
  file: File,
  signatureBytes: Uint8Array,
  pageIdx: number,
  x: number,
  y: number,
  scale: number,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });

  const pages = doc.getPages();
  if (pageIdx < 0 || pageIdx >= pages.length) throw new Error('Invalid page number');

  const sigImage = await doc.embedPng(signatureBytes);
  const iw = sigImage.width * scale;
  const ih = sigImage.height * scale;

  const page = pages[pageIdx];
  page.drawImage(sigImage, { x, y, width: iw, height: ih });

  const outBytes = await doc.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}

function SignaturePad({ onSave, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={300}
        height={120}
        className="w-full border border-slate-200 rounded-lg bg-white cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className="flex gap-2">
        <button type="button" onClick={handleClear} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Clear</button>
        <button type="button" onClick={handleSave} className="flex-1 px-3 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors">Save signature</button>
      </div>
    </div>
  );
}

export default function PdfSignature() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [sigX, setSigX] = useState('50');
  const [sigY, setSigY] = useState('50');
  const [sigScale, setSigScale] = useState('1');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f || !pdfLib) return;
    setFile(f);
    setStatus('reading');
    setErrorMsg(null);
    setSignatureData(null);
    setOutputBlob(null);

    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const doc = await pdfLib.PDFDocument.load(bytes, { updateMetadata: false });
      setPageCount(doc.getPageCount());
      setPageIdx(0);
      setOutputName(f.name.replace(/\.pdf$/i, '') + '-signed.pdf');
      setStatus('signing');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Unlock it first.');
      } else {
        setErrorMsg('Failed to read the PDF.');
      }
      setFile(null);
      setStatus('error');
    }
  }, [pdfLib]);

  const handleRemove = () => {
    setFile(null); setPageCount(0); setStatus('idle'); setErrorMsg(null); setSignatureData(null); setOutputBlob(null); setOutputName('');
  };

  const handleSign = async () => {
    if (!file || !pdfLib || !signatureData) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const resp = await fetch(signatureData);
      const buf = new Uint8Array(await resp.arrayBuffer());
      const blob = await signPdf(file, buf, pageIdx, Number(sigX) || 50, Number(sigY) || 50, Number(sigScale) || 1, pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to place signature.');
      setStatus('signing');
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
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here to add a signature." />}
      {status === 'reading' && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full" aria-hidden="true" />
          <span>Reading PDF…</span>
        </div>
      )}
      {status === 'error' && errorMsg && file === null && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}
      {(status === 'signing' || status === 'processing') && hasFile && (
        <>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">{truncateName(file.name)}</span>
            <span className="text-xs text-slate-500">{pageCount} page{pageCount !== 1 ? 's' : ''}</span>
            <button type="button" onClick={handleRemove} className="text-slate-400 hover:text-rose-500 transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Remove ${file.name}`}>×</button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Draw your signature</p>
            <SignaturePad
              onSave={(dataUrl) => setSignatureData(dataUrl)}
              onClear={() => setSignatureData(null)}
            />
            {signatureData && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <span aria-hidden="true">✓</span><span>Signature saved</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            <div className="px-4 py-3">
              <label className="block text-xs text-slate-500 mb-1">Place on page</label>
              <select value={pageIdx} onChange={(e) => setPageIdx(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400">
                {Array.from({ length: pageCount }, (_, i) => <option key={i} value={i}>Page {i + 1}</option>)}
              </select>
            </div>
            <div className="px-4 py-3 flex gap-3">
              <div className="flex-1"><label className="block text-xs text-slate-500 mb-1">X (pt)</label><input type="number" value={sigX} onChange={(e) => setSigX(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" /></div>
              <div className="flex-1"><label className="block text-xs text-slate-500 mb-1">Y (pt)</label><input type="number" value={sigY} onChange={(e) => setSigY(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" /></div>
              <div className="flex-1"><label className="block text-xs text-slate-500 mb-1">Scale</label><input type="number" step="0.1" min="0.1" value={sigScale} onChange={(e) => setSigScale(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" /></div>
            </div>
          </div>

          {status === 'processing' && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full" />
              <span>Placing signature…</span>
            </div>
          )}

          {errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}

          <button type="button" onClick={handleSign} disabled={!signatureData || status === 'processing'} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
            Place signature & download
          </button>
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>Signature placed — {formatMB(outputBlob.size)} MB</span></div>
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
