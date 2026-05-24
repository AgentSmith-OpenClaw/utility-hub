import React, { useState, useCallback, useEffect } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import PdfPageGrid, { PageThumb } from './PdfPageGrid';
import SelectionBar from './SelectionBar';
import { usePdfLib } from '../../hooks/usePdfLib';
import { usePdfJs } from '../../hooks/usePdfJs';

type Status = 'idle' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

function parseRangeToSet(str: string, maxPage: number): Set<number> {
  const result = new Set<number>();
  const parts = str.split(',');
  for (const chunk of parts) {
    const part = chunk.trim();
    if (!part) throw new Error('Empty range segment');
    const m = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) throw new Error(`Invalid range "${part}" — use numbers and dashes only`);
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    if (start < 1 || end > maxPage || start > end)
      throw new Error(`Range "${part}" is out of bounds (1–${maxPage})`);
    for (let i = start; i <= end; i++) result.add(i - 1);
  }
  return result;
}

async function extractPages(file: File, pagesToExtract: Set<number>, PDFDocument: typeof import('pdf-lib').PDFDocument): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const kept = Array.from(pagesToExtract).sort((a, b) => a - b);
  if (kept.length === 0) throw new Error('No pages selected');
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, kept);
  copied.forEach((p) => out.addPage(p));
  const bytesOut = await out.save();
  return new Blob([bytesOut.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function ExtractPdfPages() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();
  const { lib: pdfJs, error: pdfJsError } = usePdfJs();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const [rangeOpen, setRangeOpen] = useState(false);
  const [rangeStr, setRangeStr] = useState('');
  const [rangeError, setRangeError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !pdfLib) return;
    let cancelled = false;
    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await pdfLib.PDFDocument.load(bytes);
        if (!cancelled) setPageCount(doc.getPageCount());
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
            setErrorMsg('This PDF is password-protected. Unlock it first.');
          } else {
            setErrorMsg('Failed to read the PDF. Make sure it is a valid PDF file.');
          }
          setFile(null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [file, pdfLib]);

  useEffect(() => {
    if (!file || !pdfJs || !pageCount) return;
    let cancelled = false;
    setThumbs([]);
    (async () => {
      try {
        const bytes = await file.arrayBuffer();
        const pdf = await pdfJs.getDocument({ data: bytes }).promise;
        const newThumbs: PageThumb[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) break;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.25 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          newThumbs.push({ index: i - 1, thumbnail: canvas.toDataURL('image/jpeg', 0.7) });
          if (!cancelled) setThumbs([...newThumbs]);
        }
      } catch {
        // thumbnails are best-effort
      }
    })();
    return () => { cancelled = true; };
  }, [file, pdfJs, pageCount]);

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setPageCount(0);
    setSelected(new Set());
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setRangeStr('');
    setRangeError(null);
    setRangeOpen(false);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-extracted.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null);
    setPageCount(0);
    setSelected(new Set());
    setThumbs([]);
    setStatus('idle');
    setErrorMsg(null);
    setOutputBlob(null);
    setOutputName('');
    setRangeStr('');
    setRangeError(null);
    setRangeOpen(false);
  };

  const handleSelect = useCallback((index: number, isSelected: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(index);
      else next.delete(index);
      return next;
    });
  }, []);

  const handleSelectAll = () => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)));
  const handleSelectNone = () => setSelected(new Set());
  const handleInvert = () => {
    setSelected((prev) => {
      const next = new Set<number>();
      for (let i = 0; i < pageCount; i++) if (!prev.has(i)) next.add(i);
      return next;
    });
  };

  const handleRangeApply = () => {
    if (!rangeStr.trim() || !pageCount) return;
    try {
      const pages = parseRangeToSet(rangeStr, pageCount);
      setSelected(pages);
      setRangeError(null);
    } catch (err) {
      setRangeError(err instanceof Error ? err.message : 'Invalid range');
    }
  };

  const isSinglePage = pageCount === 1;
  const actionDisabled = !file || !pdfLib || status === 'processing' || !pageCount || selected.size === 0;

  const handleExtract = async () => {
    if (!file || !pdfLib || selected.size === 0) return;
    setStatus('processing');
    setErrorMsg(null);
    try {
      const blob = await extractPages(file, selected, pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(`Failed to extract pages. ${err instanceof Error ? err.message : 'Unknown error.'}`);
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
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF here, or click to browse." />}
      {!hasFile && errorMsg && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>
      )}
      {hasFile && status !== 'done' && (
        <>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">{truncateName(file.name)}</span>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
              {pageCount ? `${pageCount} page${pageCount !== 1 ? 's' : ''}` : '—'} · {formatMB(file.size)} MB
            </span>
            <button type="button" onClick={handleRemove} className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={`Remove ${file.name}`}>×</button>
          </div>
          {pageCount > 0 && (
            <SelectionBar selected={selected.size} total={pageCount} onSelectAll={handleSelectAll} onSelectNone={handleSelectNone} onInvert={handleInvert} />
          )}
          {thumbs.length > 0 && <PdfPageGrid pages={thumbs} mode="multi" selected={selected} onSelect={handleSelect} />}
          {thumbs.length === 0 && pageCount > 0 && !pdfJsError && <p className="text-xs text-slate-500">Loading page thumbnails…</p>}
          {pdfJsError && thumbs.length === 0 && <p className="text-xs text-amber-600">Thumbnails unavailable. Use range input below.</p>}
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <button type="button" onClick={() => setRangeOpen((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors" aria-expanded={rangeOpen}>
              <span>Use a range instead</span>
              <span className={`text-slate-400 transition-transform ${rangeOpen ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
            </button>
            {rangeOpen && (
              <div className="px-4 pb-4 space-y-2 border-t border-slate-100">
                <p className="text-xs text-slate-500 pt-3">Enter pages to extract (e.g. <code className="bg-slate-100 px-1 rounded">1-5, 8, 10-12</code>). Replaces current selection.</p>
                <div className="flex gap-2">
                  <input type="text" value={rangeStr} onChange={(e) => { setRangeStr(e.target.value); if (rangeError) setRangeError(null); }} onKeyDown={(e) => e.key === 'Enter' && handleRangeApply()} placeholder={pageCount ? `e.g. 1-3, 5, 8-${Math.min(12, pageCount)}` : 'e.g. 1-3, 5, 8-12'} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-50 outline-none" />
                  <button type="button" onClick={handleRangeApply} disabled={!rangeStr.trim() || !pageCount} className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors whitespace-nowrap">Apply</button>
                </div>
                {rangeError && <p className="text-xs text-rose-600 font-medium">{rangeError}</p>}
              </div>
            )}
          </div>
          {isSinglePage && <p className="text-xs text-amber-700 font-medium px-1">This PDF has only one page — select it to extract.</p>}
          {status === 'error' && errorMsg && <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>}
          <button type="button" onClick={handleExtract} disabled={actionDisabled} className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all">
            {status === 'processing' ? 'Extracting…' : selected.size > 0 ? `Extract ${selected.size} page${selected.size !== 1 ? 's' : ''} & download` : 'Extract pages & download'}
          </button>
        </>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800"><span aria-hidden="true">✓</span><span>Pages extracted — {formatMB(outputBlob.size)} MB</span></div>
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
