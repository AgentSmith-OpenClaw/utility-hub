import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

const GA_ID = 'G-8ZXGEHK3C0';

function trackPageView(path: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_ID, { page_path: path });
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    trackPageView(router.asPath);

    const handleRouteChange = (url: string) => trackPageView(url);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.asPath, router.events]);

  return <Component {...pageProps} />;
}
