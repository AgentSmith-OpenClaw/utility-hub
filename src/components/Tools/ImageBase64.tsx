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
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 text-sm rounded-lg border font-medium transition-colors capitalize ${
              mode === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
            }`}
          >
            {m === 'encode' ? 'Image → Base64' : 'Base64 → Image'}
          </button>
        ))}
      </div>

      {mode === 'encode' ? (
        <>
          <ToolCard title="Upload Image">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
              }`}
            >
              <p className="text-slate-500 text-sm">Drag & drop an image here, or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPEG, GIF, WebP, SVG supported</p>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            </div>
          </ToolCard>

          {dataUrl && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ToolCard title="Preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={dataUrl} alt="preview" className="max-h-48 object-contain mx-auto rounded" />
                  <p className="text-xs text-slate-500 mt-2 text-center">{fileName} · {fmtSize(fileSize)} · {mimeType}</p>
                </ToolCard>
                <ToolCard title="Info">
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between"><dt className="text-slate-500">File</dt><dd className="font-mono text-slate-800 truncate max-w-[160px]">{fileName}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Size</dt><dd className="font-mono text-slate-800">{fmtSize(fileSize)}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Base64 size</dt><dd className="font-mono text-slate-800">{fmtSize(base64Only.length)}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">Overhead</dt><dd className="font-mono text-slate-800">{fileSize ? `+${Math.round((base64Only.length / fileSize - 1) * 100)}%` : '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-slate-500">MIME type</dt><dd className="font-mono text-slate-800">{mimeType}</dd></div>
                  </dl>
                </ToolCard>
              </div>

              <ToolCard title="Data URL (full)" action={<CopyButton value={dataUrl} />}>
                <textarea readOnly value={dataUrl} className="w-full h-24 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none" />
              </ToolCard>

              <ToolCard title="Base64 only" action={<CopyButton value={base64Only} />}>
                <textarea readOnly value={base64Only} className="w-full h-24 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg resize-none" />
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
              className="w-full h-32 px-3 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
            />
            {decodeError && <p className="text-xs text-red-600 mt-1">{decodeError}</p>}
            <button
              onClick={handleDecode}
              disabled={!decodeInput.trim()}
              className="mt-2 px-4 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 transition-colors"
            >
              Decode
            </button>
          </ToolCard>

          {dataUrl && fileName === 'decoded-image' && (
            <ToolCard title="Decoded Image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="decoded" className="max-h-64 object-contain mx-auto rounded" />
              <p className="text-xs text-slate-500 mt-2 text-center">{fmtSize(fileSize)} decoded · {mimeType}</p>
              <a
                href={dataUrl}
                download="decoded-image"
                className="mt-2 inline-block px-4 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Download
              </a>
            </ToolCard>
          )}
        </>
      )}
    </div>
  );
}
