import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function CompoundInterestRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/finance/compound-interest-calculator');
  }, [router]);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/finance/compound-interest-calculator" />
        <link rel="canonical" href="https://toolisk.com/finance/compound-interest-calculator" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Redirecting to Compound Interest Calculator...</p>
        </div>
      </div>
    </>
  );
}
