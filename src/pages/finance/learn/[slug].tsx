import Head from 'next/head';
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>{slug ? `${slug} - Toolisk Finance` : 'Finance Blog - Toolisk'}</title>
        <meta name="description" content="Financial insights and guides to help you make better money decisions." />
        <link rel="canonical" href={`https://toolisk.com/finance/learn/${slug}`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12">
            <div className="text-center">
              <span className="text-6xl mb-6 block">📚</span>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Finance Blog Coming Soon
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                We&apos;re preparing educational content about personal finance, loans, investments, and FIRE.
              </p>
              <p className="text-slate-500">
                Slug: <code className="bg-slate-100 px-2 py-1 rounded text-sm">{slug}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
