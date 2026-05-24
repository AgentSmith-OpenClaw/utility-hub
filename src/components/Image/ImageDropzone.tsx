'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface ImageDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  compact?: boolean;
}

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

const IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico', '.tiff', '.tif', '.avif', '.heic', '.heif',
];

const IMAGE_MIMES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
  'image/svg+xml', 'image/x-icon', 'image/tiff', 'image/avif',
];

function validateFile(file: File, accept: string): 'ok' | 'large' | 'toobig' | 'invalid' {
  const acceptMimes = accept.split(',').map((m) => m.trim());
  const mimeOk = acceptMimes.includes('image/*')
    ? IMAGE_MIMES.includes(file.type)
    : acceptMimes.includes(file.type);
  const extOk = IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
  if (!mimeOk && !extOk) return 'invalid';
  if (file.size > 50 * 1024 * 1024) return 'toobig';
  if (file.size > 25 * 1024 * 1024) return 'large';
  return 'ok';
}

interface FileMessage {
  name: string;
  kind: 'large' | 'toobig' | 'invalid';
  mb?: string;
}

export default function ImageDropzone({
  onFiles,
  accept = 'image/*',
  multiple = false,
  label,
  compact = false,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [messages, setMessages] = useState<FileMessage[]>([]);

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const valid: File[] = [];
      const msgs: FileMessage[] = [];

      Array.from(fileList).forEach((file) => {
        const result = validateFile(file, accept);
        if (result === 'ok') {
          valid.push(file);
        } else if (result === 'large') {
          valid.push(file);
          msgs.push({ name: file.name, kind: 'large', mb: formatMB(file.size) });
        } else if (result === 'toobig') {
          msgs.push({ name: file.name, kind: 'toobig', mb: formatMB(file.size) });
        } else {
          msgs.push({ name: file.name, kind: 'invalid' });
        }
      });

      setMessages(msgs);
      if (valid.length > 0) onFiles(multiple ? valid : [valid[0]]);
    },
    [accept, multiple, onFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      e.target.value = '';
    },
    [processFiles],
  );

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const files = e.clipboardData?.files;
      if (files && files.length > 0) processFiles(files);
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [processFiles]);

  if (compact) {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={openPicker}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors min-h-[44px]"
        >
          <span>+</span>
          <span>Add more</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPicker()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg px-6 py-12 cursor-pointer transition-colors select-none ${
          dragOver
            ? 'border-sky-400 bg-sky-50'
            : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40'
        }`}
        aria-label="Drop image files here or click to browse"
      >
        <span className="text-4xl" aria-hidden="true">🖼️</span>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            {dragOver ? 'Drop to upload' : 'Drag & drop, paste, or click to browse'}
          </p>
          {label && <p className="text-xs text-slate-500 mt-1">{label}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />

      {messages.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {messages.map((msg) => {
            if (msg.kind === 'large') {
              return (
                <div
                  key={`${msg.kind}-${msg.name}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800"
                >
                  <span aria-hidden="true">⚠️</span>
                  <span>
                    <strong>{msg.name}</strong> — Large file (~{msg.mb} MB) — processing may be slow on mobile
                  </span>
                </div>
              );
            }
            if (msg.kind === 'toobig') {
              return (
                <div
                  key={`${msg.kind}-${msg.name}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800"
                >
                  <span aria-hidden="true">🚫</span>
                  <span>
                    <strong>{msg.name}</strong> — File too large ({msg.mb} MB &gt;50 MB)
                  </span>
                </div>
              );
            }
            return (
              <div
                key={`${msg.kind}-${msg.name}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800"
              >
                <span aria-hidden="true">🚫</span>
                <span>
                  <strong>{msg.name}</strong> — Unsupported file type
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}