import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Clarity from '@microsoft/clarity';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import '../styles/globals.css';

const GA_ID = 'G-8ZXGEHK3C0';
const CLARITY_ID = 'vgegy4bksa';

function trackPageView(path: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_ID, { page_path: path });
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Initialize Microsoft Clarity
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Clarity.init(CLARITY_ID);
    }
  }, []);

  useEffect(() => {
    trackPageView(router.asPath);

    const handleRouteChange = (url: string) => trackPageView(url);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.asPath, router.events]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <meta property="og:site_name" content="Toolisk" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@toolisk" />
      </Head>
      <Header />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
