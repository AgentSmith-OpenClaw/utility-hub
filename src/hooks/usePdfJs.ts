import { useState, useEffect } from 'react';

type PdfJs = typeof import('pdfjs-dist');
let cached: PdfJs | null = null;

export function usePdfJs() {
  const [lib, setLib] = useState<PdfJs | null>(cached);

  useEffect(() => {
    if (cached) { setLib(cached); return; }
    import('pdfjs-dist').then((pdfjsLib) => {
      // Set worker — use the bundled worker from the package
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url,
      ).toString();
      cached = pdfjsLib;
      setLib(pdfjsLib);
    });
  }, []);

  return lib;
}
