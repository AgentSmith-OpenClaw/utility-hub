import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';
import { usePdfLib } from '../../hooks/usePdfLib';

type Status = 'idle' | 'reading' | 'needs-password' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

const MAGIC = new TextEncoder().encode('TPWLOCK');

async function unlockStandardPdf(
  file: File,
  PDFDocument: typeof import('pdf-lib').PDFDocument,
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const outBytes = await doc.save();
  return new Blob([outBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

async function unlockTooliskPdf(file: File, password: string): Promise<Blob> {
  const buf = new Uint8Array(await file.arrayBuffer());

  // header: 8 magic + 1 version + 16 salt + 12 iv = 37 bytes
  const salt = buf.slice(MAGIC.length + 1, MAGIC.length + 1 + 16);
  const iv = buf.slice(MAGIC.length + 1 + 16, MAGIC.length + 1 + 16 + 12);
  const ciphertext = buf.slice(MAGIC.length + 1 + 16 + 12);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  );

  return new Blob([plaintext], { type: 'application/pdf' });
}

function checkTooliskFormat(buf: Uint8Array): boolean {
  if (buf.length < MAGIC.length) return false;
  for (let i = 0; i < MAGIC.length; i++) {
    if (buf[i] !== MAGIC[i]) return false;
  }
  return true;
}

export default function UnlockPdf() {
  const { lib: pdfLib, error: pdfLibError } = usePdfLib();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState<boolean | null>(null);
  const [isToolisk, setIsToolisk] = useState(false);
  const [password, setPassword] = useState('');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f || !pdfLib) return;
    setFile(f);
    setStatus('reading');
    setErrorMsg(null);
    setPassword('');
    setIsEncrypted(null);
    setIsToolisk(false);
    setOutputBlob(null);

    try {
      const buf = new Uint8Array(await f.arrayBuffer());

      if (checkTooliskFormat(buf)) {
        setIsEncrypted(true);
        setIsToolisk(true);
        setStatus('needs-password');
        return;
      }

      await pdfLib.PDFDocument.load(buf);
      setIsEncrypted(false);
      setOutputName(f.name.replace(/\.pdf$/i, '') + '-unlocked.pdf');
      setOutputBlob(new Blob([buf], { type: 'application/pdf' }));
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('encrypt') || msg.toLowerCase().includes('password')) {
        setIsEncrypted(true);
        setStatus('needs-password');
      } else {
        setErrorMsg('Failed to read the PDF. Make sure it is a valid PDF file.');
        setStatus('error');
        setFile(null);
      }
    }
  }, [pdfLib]);

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setErrorMsg(null);
    setPassword('');
    setIsEncrypted(null);
    setIsToolisk(false);
    setOutputBlob(null);
    setOutputName('');
  };

  const handleUnlock = async () => {
    if (!file || !password) return;
    setStatus('processing');
    setErrorMsg(null);

    try {
      let blob: Blob;

      if (isToolisk) {
        blob = await unlockTooliskPdf(file, password);
      } else if (pdfLib) {
        blob = await unlockStandardPdf(file, pdfLib.PDFDocument);
      } else {
        throw new Error('PDF engine not loaded');
      }

      setOutputBlob(blob);
      setOutputName(file.name.replace(/\.pdf$/i, '') + '-unlocked.pdf');
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (isToolisk || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('incorrect')) {
        setErrorMsg('Incorrect password. Please try again.');
      } else {
        setErrorMsg(`Failed to unlock PDF. ${msg}`);
      }
      setStatus('needs-password');
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

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && password) {
      handleUnlock();
    }
  };

  if (pdfLibError) {
    return (
      <div className="text-center py-10 text-rose-600 text-sm">
        {pdfLibError}
      </div>
    );
  }

  const hasFile = !!file;

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {!hasFile && (
        <PdfDropzone
          onFiles={handleFiles}
          label="Drop a password-protected PDF here, or click to browse."
        />
      )}

      {status === 'reading' && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-300 border-t-rose-500 rounded-full" aria-hidden="true" />
          <span>Reading PDF…</span>
        </div>
      )}

      {hasFile && status !== 'done' && status !== 'error' && (
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
      )}

      {(status === 'needs-password' || status === 'processing') && isEncrypted && (
        <div className="space-y-3">
          <div className="px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            {isToolisk
              ? 'This PDF was protected with Toolisk. Enter the password to unlock it.'
              : 'This PDF is password-protected. Enter the password below to unlock it.'}
          </div>

          <div className="flex gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyDown}
              placeholder="Enter PDF password"
              autoFocus
              className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              aria-label="PDF password"
            />
            <button
              type="button"
              onClick={handleUnlock}
              disabled={!password || status === 'processing'}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all whitespace-nowrap"
            >
              {status === 'processing' ? 'Unlocking…' : 'Unlock PDF'}
            </button>
          </div>

          {errorMsg && (
            <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}
        </div>
      )}

      {status === 'error' && errorMsg && (
        <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {errorMsg}
        </div>
      )}

      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>
              {isEncrypted === false
                ? 'This PDF is not password-protected — ready to download'
                : `PDF unlocked — ${formatMB(outputBlob.size)} MB`}
            </span>
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
