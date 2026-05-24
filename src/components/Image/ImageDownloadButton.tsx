'use client';

import React, { useCallback } from 'react';

interface ImageDownloadButtonProps {
  blob: Blob | null;
  fileName: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function ImageDownloadButton({
  blob,
  fileName,
  disabled = false,
  className = '',
  children,
}: ImageDownloadButtonProps) {
  const handleDownload = useCallback(() => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [blob, fileName]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || !blob}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
        disabled || !blob
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
          : 'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800'
      } ${className}`}
    >
      {children ?? `Download ${fileName}`}
    </button>
  );
}