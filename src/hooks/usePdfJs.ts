import { useState, useEffect } from 'react';

type PdfJs = typeof import('pdfjs-dist');
let cached: PdfJs | null = null;

export function usePdfJs(): { lib: PdfJs | null; error: string | null } {
  const [lib, setLib] = useState<PdfJs | null>(cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cached) { setLib(cached); return; }
    import('pdfjs-dist')
      .then((pdfjsLib) => {
        // Set worker — use the bundled worker from the package
        // Worker is served from /public to avoid Terser trying to minify it.
        // The file is copied to public/ as part of project setup.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        cached = pdfjsLib;
        setLib(pdfjsLib);
      })
      .catch(() => {
        setError('Failed to load PDF engine. Please refresh the page.');
      });
  }, []);

  return { lib, error };
}
