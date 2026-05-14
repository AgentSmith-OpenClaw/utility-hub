import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const TARGET = '/finance/learn/home-loan-prepayment-strategy';

export default function PrepaymentStrategiesRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace(TARGET); }, [router]);
  return (
    <Head>
      <meta httpEquiv="refresh" content={`0;url=${TARGET}`} />
      <link rel="canonical" href={`https://toolisk.com${TARGET}`} />
      <title>Redirecting…</title>
    </Head>
  );
}
