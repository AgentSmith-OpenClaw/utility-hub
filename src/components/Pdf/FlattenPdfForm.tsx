import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'reading' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

async function flattenPdf(
  file: File,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<{ blob: Blob; fieldCount: number }> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const form = doc.getForm();
  const fields = form.getFields();
  const fieldCount = fields.length;
  form.flatten();
  const outBytes = await doc.save();
  return { blob: new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' }), fieldCount };
}

export default function FlattenPdfForm() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldCount, setFieldCount] = useState(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f || !pdfLib) return;
    setFile(f);
    setStatus('reading');
    setErrorMsg(null);
    setOutputBlob(null);

    try {
      const { blob, fieldCount: fc } = await flattenPdf(f, pdfLib.PDFDocument);
      setFieldCount(fc);
      setOutputBlob(blob);
      setOutputName(f.name.replace(/\.pdf$/i, '') + '-flattened.pdf');
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setErrorMsg('This PDF is password-protected. Unlock it first.');
      } else {
        setErrorMsg('Failed to flatten the PDF. Make sure it is a valid PDF file.');
      }
      setFile(null);
      setStatus('error');
    }
  }, [pdfLib]);

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setErrorMsg(null);
    setFieldCount(0);
    setOutputBlob(null);
    setOutputName('');
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
      {!hasFile && <PdfDropzone onFiles={handleFiles} label="Drop a PDF with form fields here to flatten them." />}
      {status === 'reading' && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full" aria-hidden="true" />
          <span>Flattening form fields…</span>
        </div>
      )}
      {status === 'error' && errorMsg && file === null && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">{errorMsg}</div>
      )}
      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>
              {fieldCount > 0
                ? `${fieldCount} form field${fieldCount !== 1 ? 's' : ''} flattened — ${formatMB(outputBlob.size)} MB`
                : 'No form fields found — this PDF is already flat'}
            </span>
          </div>
          {fieldCount > 0 && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input type="text" value={outputName} onChange={(e) => setOutputName(e.target.value)} className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400" aria-label="Output filename" />
                <button type="button" onClick={handleDownload} className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all whitespace-nowrap">Download</button>
              </div>
            </>
          )}
          <button type="button" onClick={handleRemove} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">← Start over</button>
        </div>
      )}
    </div>
  );
}
