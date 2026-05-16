import { useState, useEffect } from 'react';

let cached: typeof import('pdf-lib') | null = null;

export function usePdfLib() {
  const [lib, setLib] = useState<typeof import('pdf-lib') | null>(cached);

  useEffect(() => {
    if (cached) { setLib(cached); return; }
    import('pdf-lib').then((m) => {
      cached = m;
      setLib(m);
    });
  }, []);

  return lib;
}
