import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FIRECalculatorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/finance/fire-calculator');
  }, [router]);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/finance/fire-calculator" />
        <link rel="canonical" href="https://toolisk.com/finance/fire-calculator" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to FIRE Calculator...</p>
        </div>
      </div>
    </>
  );
}
