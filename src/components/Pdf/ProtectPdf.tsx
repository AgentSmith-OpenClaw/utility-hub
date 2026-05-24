import React, { useState, useCallback } from 'react';
import PdfDropzone from './PdfDropzone';
import PdfTrustBadge from './PdfTrustBadge';

type Status = 'idle' | 'reading' | 'ready' | 'processing' | 'done' | 'error';

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function truncateName(name: string, max = 40): string {
  if (name.length <= max) return name;
  return name.slice(0, max - 1) + '…';
}

const MAGIC = new TextEncoder().encode('TPWLOCK');

async function encryptPdf(file: File, password: string): Promise<Blob> {
  const pdfBytes = new Uint8Array(await file.arrayBuffer());
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

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
    ['encrypt'],
  );

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    pdfBytes,
  );

  const header = new Uint8Array(MAGIC.length + 1 + salt.length + iv.length);
  header.set(MAGIC, 0);
  header[MAGIC.length] = 1; // version
  header.set(salt, MAGIC.length + 1);
  header.set(iv, MAGIC.length + 1 + salt.length);

  const out = new Uint8Array(header.length + ciphertext.byteLength);
  out.set(header, 0);
  out.set(new Uint8Array(ciphertext), header.length);

  return new Blob([out], { type: 'application/pdf' });
}

export default function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('');

  const handleFiles = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStatus('ready');
    setErrorMsg(null);
    setPassword('');
    setConfirmPassword('');
    setOutputBlob(null);
    setOutputName(f.name.replace(/\.pdf$/i, '') + '-protected.pdf');
  }, []);

  const handleRemove = () => {
    setFile(null);
    setStatus('idle');
    setErrorMsg(null);
    setPassword('');
    setConfirmPassword('');
    setOutputBlob(null);
    setOutputName('');
  };

  const handleProtect = async () => {
    if (!file || !password) return;

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setStatus('processing');
    setErrorMsg(null);

    try {
      const blob = await encryptPdf(file, password);
      setOutputBlob(blob);
      setStatus('done');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Failed to protect PDF. ${msg}`);
      setStatus('ready');
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
    if (e.key === 'Enter' && password && confirmPassword && status === 'ready') {
      handleProtect();
    }
  };

  const hasFile = !!file;

  return (
    <div className="space-y-4">
      <PdfTrustBadge />

      {!hasFile && (
        <PdfDropzone
          onFiles={handleFiles}
          label="Drop a PDF here to password-protect it, or click to browse."
        />
      )}

      {hasFile && status !== 'done' && (
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

          <div className="space-y-3">
            <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Set a password to encrypt this PDF. Only someone with the password will be able to unlock it.
            </div>

            <div className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                placeholder="Enter a password (min 4 characters)"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                aria-label="PDF password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                placeholder="Confirm password"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                aria-label="Confirm PDF password"
              />
            </div>

            {errorMsg && (
              <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleProtect}
              disabled={!password || !confirmPassword || status === 'processing'}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
            >
              {status === 'processing' ? 'Encrypting…' : 'Protect PDF'}
            </button>
          </div>
        </>
      )}

      {status === 'done' && outputBlob && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <span aria-hidden="true">✓</span>
            <span>PDF protected with AES-256 encryption — {formatMB(outputBlob.size)} MB</span>
          </div>

          <div className="px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <strong>Important:</strong> This file can be unlocked using Toolisk&apos;s <a href="/pdf/unlock-pdf" className="underline text-rose-600 hover:text-rose-700">Unlock PDF</a> tool. Save your password in a safe place — it cannot be recovered.
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
