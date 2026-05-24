import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'reading' | 'editing' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

interface MetadataFields {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

async function readMetadata(
  file: File,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<{ metadata: MetadataFields; blob: Blob }> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });

  return {
    metadata: {
      title: doc.getTitle() || '',
      author: doc.getAuthor() || '',
      subject: doc.getSubject() || '',
      keywords: doc.getKeywords() || '',
      creator: doc.getCreator() || '',
      producer: doc.getProducer() || '',
    },
    blob: new Blob([bytes], { type: 'application/pdf' }),
  };
}

async function saveMetadata(
  file: File,
  fields: MetadataFields,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: true });

  if (fields.title) doc.setTitle(fields.title);
  if (fields.author) doc.setAuthor(fields.author);
  if (fields.subject) doc.setSubject(fields.subject);
  if (fields.keywords) doc.setKeywords(fields.keywords.split(',').map((k) => k.trim()).filter(Boolean));
  if (fields.creator) doc.setCreator(fields.creator);
  if (fields.producer) doc.setProducer(fields.producer);

  const outBytes = await doc.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export default function PdfMetadataEditor() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fields, setFields] = useState<MetadataFields>({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' });
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
      const { metadata } = await readMetadata(f, pdfLib.PDFDocument);
      setFields(metadata);
      setOutputName(f.name.replace(/\.pdf$/i, '') + '-meta.pdf');
      setStatus('editing');
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
    setFields({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' });
    setOutputBlob(null);
    setOutputName('');
  };

  const handleFieldChange = (field: keyof MetadataFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!file || !pdfLib) return;
    setStatus('processing');
    setErrorMsg(null);

    try {
      const blob = await saveMetadata(file, fields, pdfLib.PDFDocument);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Failed to update metadata. ${msg}`);
      setStatus('editing');
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
    return (
      <div className="text-center py-10 text-rose-600 text-sm">
        {pdfLibError}
      </div>
    );
  }

  const hasFile = !!file;
  const fieldRows: { key: keyof MetadataFields; label: string; placeholder: string }[] = [
    { key: 'title', label: 'Title', placeholder: 'PDF title' },
    { key: 'author', label: 'Author', placeholder: 'Author name' },
    { key: 'subject', label: 'Subject', placeholder: 'Subject' },
    { key: 'keywords', label: 'Keywords', placeholder: 'comma, separated, keywords' },
    { key: 'creator', label: 'Creator', placeholder: 'Application that created this PDF' },
    { key: 'producer', label: 'Producer', placeholder: 'PDF producer library' },
  ];

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {!hasFile && (
        <PdfDropzone
          onFiles={handleFiles}
          label="Drop a PDF here to view and edit its metadata."
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

      {(status === 'editing' || status === 'processing') && hasFile && (
        <>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-base flex-shrink-0" aria-hidden="true">📄</span>
            <span className="text-sm font-medium text-slate-800 flex-1 truncate">
              {truncateName(file.name)}
            </span>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
              {formatMB(file.size)} MB
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
            {fieldRows.map(({ key, label, placeholder }) => (
              <div key={key} className="px-4 py-2.5">
                <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                <input
                  type="text"
                  value={fields[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                  aria-label={label}
                />
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'processing'}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
          >
            {status === 'processing' ? 'Saving…' : 'Save metadata & download'}
          </button>
        </>
      )}

      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>Metadata updated — {formatMB(outputBlob.size)} MB</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="text"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              aria-label="Output filename"
            />
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-all whitespace-nowrap"
            >
              Download
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
  );
}
