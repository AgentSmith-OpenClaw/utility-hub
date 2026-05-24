'use client';

import React, { useState, useEffect } from 'react';

interface ImagePreviewProps {
  file: File;
  dimensions?: { width: number; height: number };
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatLabel(file: File): string {
  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toUpperCase() : '';
  if (ext) return ext;
  if (file.type.startsWith('image/')) return file.type.split('/')[1].toUpperCase();
  return 'IMG';
}

export default function ImagePreview({ file, dimensions, className = '' }: ImagePreviewProps) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white ${className}`}>
      {url && (
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
          <img
            src={url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
          {dimensions && (
            <>
              <span className="text-xs text-slate-300" aria-hidden="true">·</span>
              <span className="text-xs text-slate-500">{dimensions.width} × {dimensions.height}</span>
            </>
          )}
        </div>
        <span className="inline-block mt-1.5 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-sky-50 text-sky-700 border border-sky-200/60">
          {formatLabel(file)}
        </span>
      </div>
    </div>
  );
}