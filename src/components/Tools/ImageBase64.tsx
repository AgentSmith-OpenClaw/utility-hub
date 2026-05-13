import React, { useState, useRef, useCallback } from 'react';
import { ToolCard, CopyButton } from './ToolShell';

export default function ImageBase64() {
  const [dataUrl, setDataUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setDataUrl(e.target?.result as string ?? '');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const base64Only = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';

  const handleDecode = useCallback(() => {
    setDecodeError('');
    try {
      const raw = decodeInput.trim();
      const base64 = raw.includes(',') ? raw.split(',')[1] : raw;
      atob(base64);
      const mime = raw.startsWith('data:') ? raw.split(';')[0].slice(5) : 'image/png';
      setDataUrl(`data:${mime};base64,${base64}`);
      setFileName('decoded-image');
      setFileSize(Math.round(base64.length * 0.75));
      setMimeType(mime);
    } catch {
      setDecodeError('Invalid Base64 string. Make sure it is a valid image data URL or raw Base64.');
    }
  }, [decodeInput]);

  const fmtSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                mode === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'encode' ? 'Image → Base64' : 'Base64 → Image'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'encode' ? (
        <>
          <ToolCard title="Upload Image">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 sm:p-14 text-center cursor-pointer transition-colors ${
                dragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-slate-600 text-sm font-semibold">Drag &amp; drop an image here, or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPEG, GIF, WebP, SVG supported</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            </div>
          </ToolCard>

          {dataUrl && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ToolCard title="Preview">
                  <div className="flex items-center justify-center min-h-[16rem] bg-slate-50 rounded-lg border border-slate-200 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={dataUrl} alt="preview" className="max-h-72 object-contain rounded" />
                  </div>
                  <p className="text-xs text-slate-500 mt-3 text-center">{fileName} · {fmtSize(fileSize)} · {mimeType}</p>
                </ToolCard>
                <ToolCard title="Info">
                  <dl className="divide-y divide-slate-100 text-sm">
                    <div className="flex justify-between py-2"><dt className="text-slate-500">File</dt><dd className="font-mono text-slate-800 truncate max-w-[160px]">{fileName}</dd></div>
                    <div className="flex justify-between py-2"><dt className="text-slate-500">Original size</dt><dd className="font-mono text-slate-800">{fmtSize(fileSize)}</dd></div>
                    <div className="flex justify-between py-2"><dt className="text-slate-500">Base64 size</dt><dd className="font-mono text-slate-800">{fmtSize(base64Only.length)}</dd></div>
                    <div className="flex justify-between py-2"><dt className="text-slate-500">Overhead</dt><dd className="font-mono text-slate-800">{fileSize ? `+${Math.round((base64Only.length / fileSize - 1) * 100)}%` : '—'}</dd></div>
                    <div className="flex justify-between py-2"><dt className="text-slate-500">MIME type</dt><dd className="font-mono text-slate-800">{mimeType}</dd></div>
                  </dl>
                </ToolCard>
              </div>

              <ToolCard title="Data URL (full)" action={<CopyButton value={dataUrl} />}>
                <textarea readOnly value={dataUrl} className="w-full h-48 sm:h-56 px-4 py-3 text-[13px] font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none" />
              </ToolCard>

              <ToolCard title="Base64 only" action={<CopyButton value={base64Only} />}>
                <textarea readOnly value={base64Only} className="w-full h-48 sm:h-56 px-4 py-3 text-[13px] font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none" />
              </ToolCard>
            </>
          )}
        </>
      ) : (
        <>
          <ToolCard title="Paste Base64 or Data URL">
            <textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Paste base64 string or data:image/png;base64,... here"
              className="w-full h-56 sm:h-72 px-4 py-3 text-[13px] font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
            />
            {decodeError && <p className="text-xs text-red-600 mt-2 font-mono">{decodeError}</p>}
            <button
              onClick={handleDecode}
              disabled={!decodeInput.trim()}
              className="mt-3 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Decode
            </button>
          </ToolCard>

          {dataUrl && fileName === 'decoded-image' && (
            <ToolCard title="Decoded Image">
              <div className="flex items-center justify-center min-h-[18rem] bg-slate-50 rounded-lg border border-slate-200 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUrl} alt="decoded" className="max-h-80 object-contain rounded" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-slate-500">{fmtSize(fileSize)} decoded · {mimeType}</p>
                <a
                  href={dataUrl}
                  download="decoded-image"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
            </ToolCard>
          )}
        </>
      )}
    </div>
  );
}
