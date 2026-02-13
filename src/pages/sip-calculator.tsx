import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SIPCalculatorRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/finance/sip-calculator');
  }, [router]);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/finance/sip-calculator" />
        <link rel="canonical" href="https://toolisk.com/finance/sip-calculator" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to SIP Calculator...</p>
        </div>
      </div>
    </>
  );
}
