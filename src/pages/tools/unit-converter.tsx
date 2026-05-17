import Head from 'next/head';
import Link from 'next/link';
import { SITE_URL } from '../../utils/siteConfig';

const NEW_PATH = '/utilities/unit-converter';

export default function RedirectStub() {
  return (
    <>
      <Head>
        <title>Unit Converter — Moved</title>
        <meta httpEquiv="refresh" content={`0; url=${NEW_PATH}`} />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href={`${SITE_URL}${NEW_PATH}`} />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <p className="text-slate-600 mb-4">This tool has moved.</p>
          <Link href={NEW_PATH} className="text-amber-600 font-medium hover:underline">
            Go to the new page →
          </Link>
        </div>
      </div>
    </>
  );
}
