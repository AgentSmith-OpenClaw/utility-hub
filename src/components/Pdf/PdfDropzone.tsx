import React, { useRef, useState, useCallback } from 'react';

interface PdfDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;     // default: 'application/pdf'
  multiple?: boolean;  // default: false
  label?: string;      // helper text shown inside the zone
  compact?: boolean;   // when true, renders as a small "+ Add more" row
}

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function getExtensions(accept: string): string[] {
  // e.g. 'application/pdf' → ['.pdf'], 'image/jpeg,image/png' → ['.jpeg', '.png']
  return accept.split(',').map((mime) => {
    const m = mime.trim();
    if (m === 'application/pdf') return '.pdf';
    const sub = m.split('/')[1];
    return sub ? `.${sub}` : '';
  }).filter(Boolean);
}

function validateFile(file: File, accept: string): 'ok' | 'large' | 'toobig' | 'invalid' {
  const extensions = getExtensions(accept);
  const mimeOk = accept.split(',').some((m) => file.type === m.trim());
  const extOk = extensions.some((ext) => file.name.toLowerCase().endsWith(ext));
  if (!mimeOk && !extOk) return 'invalid';
  if (file.size > 100 * 1024 * 1024) return 'toobig';
  if (file.size > 30 * 1024 * 1024) return 'large';
  return 'ok';
}

interface FileMessage {
  name: string;
  kind: 'large' | 'toobig' | 'invalid';
  mb?: string;
}

export default function PdfDropzone({
  onFiles,
  accept = 'application/pdf',
  multiple = false,
  label,
  compact = false,
}: PdfDropzoneProps) {
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
          valid.push(file); // still accepted, but warn
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
      // reset so same file can be picked again
      e.target.value = '';
    },
    [processFiles],
  );

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  if (compact) {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={openPicker}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors min-h-[44px]"
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
            ? 'border-rose-400 bg-rose-50'
            : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/40'
        }`}
        aria-label="Drop PDF files here or click to browse"
      >
        <span className="text-4xl" aria-hidden="true">📄</span>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            {dragOver ? 'Drop to upload' : 'Drag & drop or click to browse'}
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
                    <strong>{msg.name}</strong> — File too large ({msg.mb} MB &gt;100 MB) — try splitting first
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
