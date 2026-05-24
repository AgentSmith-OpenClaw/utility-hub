'use client';

import React, { useState, useCallback } from 'react';
import ImageDropzone from './ImageDropzone';
import ImageTrustBadge from './ImageTrustBadge';
import ImagePreview from './ImagePreview';
import { ToolCard, CopyButton } from '../Tools/ToolShell';
import { getBytes } from '../../hooks/useImageCanvas';

type Status = 'idle' | 'analyzing' | 'done' | 'error';

interface FormatInfo {
  trueFormat: string;
  declaredExt: string;
  mime: string;
  size: string;
  dimensions: { width: number; height: number } | null;
  magicBytes: string;
  colorDepth?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes.slice(0, 16))
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}

const FORMAT_EXTENSIONS: Record<string, string[]> = {
  'PNG': ['png'],
  'JPEG': ['jpg', 'jpeg', 'jpe', 'jfif'],
  'GIF': ['gif'],
  'WebP': ['webp'],
  'BMP': ['bmp', 'dib'],
  'AVIF': ['avif'],
  'SVG': ['svg', 'svgz'],
  'ICO': ['ico', 'cur'],
  'HEIC': ['heic', 'heif', 'heix'],
  'TIFF': ['tiff', 'tif'],
};

function detectFormat(bytes: Uint8Array): string {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'PNG';

  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'JPEG';

  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'GIF';

  if (bytes[0] === 0x42 && bytes[1] === 0x4D) return 'BMP';

  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) return 'ICO';

  if (bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2A && bytes[3] === 0x00) return 'TIFF';
  if (bytes[0] === 0x4D && bytes[1] === 0x4D && bytes[2] === 0x00 && bytes[3] === 0x2A) return 'TIFF';

  if (bytes.length >= 12 &&
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'WebP';

  if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    if (bytes[8] === 0x61 && bytes[9] === 0x76 && bytes[10] === 0x69 && bytes[11] === 0x66) return 'AVIF';
    if (bytes[8] === 0x68 && bytes[9] === 0x65 && bytes[10] === 0x69) return 'HEIC';
  }

  if ((bytes[0] === 0x3C && bytes[1] === 0x3F && bytes[2] === 0x78 && bytes[3] === 0x6D && bytes[4] === 0x6C) ||
      (bytes[0] === 0x3C && bytes[1] === 0x73 && bytes[2] === 0x76 && bytes[3] === 0x67)) return 'SVG';

  return 'Unknown';
}

function getDeclaredExt(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length < 2) return 'none';
  return parts[parts.length - 1].toLowerCase();
}

function extensionsMatch(detectedFormat: string, extension: string): boolean {
  const valid = FORMAT_EXTENSIONS[detectedFormat];
  if (!valid) return true;
  return valid.map((e) => e.toLowerCase()).includes(extension);
}

function formatBadgeColor(format: string): string {
  switch (format) {
    case 'PNG': return 'text-sky-600 bg-sky-50 border-sky-200/60';
    case 'JPEG': return 'text-emerald-600 bg-emerald-50 border-emerald-200/60';
    case 'GIF': return 'text-purple-600 bg-purple-50 border-purple-200/60';
    case 'WebP': return 'text-blue-600 bg-blue-50 border-blue-200/60';
    case 'BMP': return 'text-slate-600 bg-slate-100 border-slate-200';
    case 'AVIF': return 'text-amber-600 bg-amber-50 border-amber-200/60';
    case 'SVG': return 'text-orange-600 bg-orange-50 border-orange-200/60';
    case 'ICO': return 'text-rose-600 bg-rose-50 border-rose-200/60';
    case 'HEIC': return 'text-teal-600 bg-teal-50 border-teal-200/60';
    case 'TIFF': return 'text-indigo-600 bg-indigo-50 border-indigo-200/60';
    default: return 'text-slate-500 bg-slate-50 border-slate-200';
  }
}

export default function ImageFormatDetector() {
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<FormatInfo | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (incoming: File[]) => {
    if (incoming.length === 0) return;
    const selected = incoming[0];
    setFile(selected);
    setInfo(null);
    setError(null);
    setStatus('analyzing');

    try {
      const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(selected.slice(0, 16));
      });

      const bytes = new Uint8Array(buffer);
      const trueFormat = detectFormat(bytes);
      const declaredExt = getDeclaredExt(selected.name);
      const magicHex = bytesToHex(bytes);

      let dimensions: { width: number; height: number } | null = null;
      try {
        dimensions = await getBytes(selected);
      } catch {
        // dimensions unavailable for SVG or unsupported formats
      }

      let colorDepth: string | undefined;
      if (dimensions) {
        try {
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const url = URL.createObjectURL(selected);
            const image = new Image();
            image.onload = () => {
              URL.revokeObjectURL(url);
              resolve(image);
            };
            image.onerror = () => {
              URL.revokeObjectURL(url);
              reject();
            };
            image.src = url;
          });
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 1, 1);
            const pixel = ctx.getImageData(0, 0, 1, 1);
            colorDepth = '24-bit (8 bits per channel)';
            if (pixel.data[3] !== 255) {
              colorDepth = '32-bit (RGBA, 8 bits per channel)';
            }
          }
        } catch {
          // ignore
        }
      }

      setInfo({
        trueFormat,
        declaredExt,
        mime: selected.type || 'unknown',
        size: formatBytes(selected.size),
        dimensions,
        magicBytes: magicHex,
        colorDepth,
      });
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze file');
      setStatus('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setInfo(null);
    setStatus('idle');
    setError(null);
  }, []);

  const mismatch = info && !extensionsMatch(info.trueFormat, info.declaredExt);

  const copyText = info
    ? [
        `True Format: ${info.trueFormat}`,
        `Declared Extension: .${info.declaredExt}`,
        `MIME Type: ${info.mime}`,
        `File Size: ${info.size}`,
        info.dimensions ? `Dimensions: ${info.dimensions.width} x ${info.dimensions.height} px` : null,
        info.colorDepth ? `Color Depth: ${info.colorDepth}` : null,
        `Magic Bytes: ${info.magicBytes}`,
      ].filter(Boolean).join('\n')
    : '';

  return (
    <div className="space-y-5">
      <ImageTrustBadge />

      {status === 'idle' || !file ? (
        <ToolCard title="Drop any image to detect its real format">
          <ImageDropzone
            onFiles={handleFile}
            label="JPG, PNG, WebP, GIF, BMP, SVG, HEIC, AVIF, ICO, TIFF"
          />
        </ToolCard>
      ) : status === 'analyzing' ? (
        <ToolCard title="Analyzing…">
          <div className="flex items-center gap-3 text-slate-600 py-4">
            <svg className="animate-spin h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Reading magic bytes and analyzing {file.name}…</span>
          </div>
        </ToolCard>
      ) : (
        <>
          {info && (
            <ToolCard title="Format Detection Results" action={
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
              >
                Analyze another
              </button>
            }>
              <div className="space-y-4">
                <ImagePreview file={file} dimensions={info.dimensions ?? undefined} />

                {mismatch && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                    <span aria-hidden="true">⚠️</span>
                    <span>
                      <strong>Extension mismatch:</strong> The file uses a <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-mono">.{info.declaredExt}</code> extension but is actually a <strong>{info.trueFormat}</strong>.
                    </span>
                  </div>
                )}

                {!mismatch && info.trueFormat !== 'Unknown' && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                    <span aria-hidden="true">✓</span>
                    <span>Extension and file content match — this is a valid <strong>.{info.declaredExt}</strong> ({info.trueFormat}) file.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">True Format</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${formatBadgeColor(info.trueFormat)}`}>
                      {info.trueFormat}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Declared Extension</p>
                    <p className="text-sm font-mono font-semibold text-slate-800">.{info.declaredExt}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">MIME Type</p>
                    <p className="text-sm font-mono font-semibold text-slate-800">{info.mime}</p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">File Size</p>
                    <p className="text-sm font-semibold text-slate-800">{info.size}</p>
                  </div>
                </div>

                {info.dimensions && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Dimensions</p>
                    <p className="text-sm font-semibold text-slate-800">{info.dimensions.width} x {info.dimensions.height} px</p>
                  </div>
                )}

                {info.colorDepth && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Color Depth</p>
                    <p className="text-sm font-semibold text-slate-800">{info.colorDepth}</p>
                  </div>
                )}

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Magic Bytes (first 16)</p>
                  <p className="text-sm font-mono text-slate-800 break-all">{info.magicBytes}</p>
                </div>

                <div className="flex justify-end">
                  <CopyButton value={copyText} label="Copy All Info" className="min-h-[44px] px-4 py-2.5" />
                </div>
              </div>
            </ToolCard>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              <span aria-hidden="true">⚠️</span>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
