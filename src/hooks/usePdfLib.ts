import { useState, useEffect } from 'react';

let cached: typeof import('pdf-lib') | null = null;

export function usePdfLib(): { lib: typeof import('pdf-lib') | null; error: string | null } {
  const [lib, setLib] = useState<typeof import('pdf-lib') | null>(cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cached) { setLib(cached); return; }
    import('pdf-lib')
      .then((m) => {
        cached = m;
        setLib(m);
      })
      .catch(() => {
        setError('Failed to load PDF engine. Please refresh the page.');
      });
  }, []);

  return { lib, error };
}
