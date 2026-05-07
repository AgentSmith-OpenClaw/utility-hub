import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { articleMap } from '../../../content/blog/finance';
import BlogArticleSchema from '../../../components/SEO/BlogArticleSchema';
import BreadcrumbSchema from '../../../components/SEO/BreadcrumbSchema';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const article = slug && typeof slug === 'string' ? articleMap[slug] : null;

  if (!article) {
    return (
      <>
        <Head>
          <title>Finance Blog - Toolisk</title>
          <meta name="description" content="Financial insights and guides to help you make better money decisions." />
          <link rel="canonical" href={`https://toolisk.com/finance/learn/${slug || ''}`} />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12">
              <div className="text-center">
                <span className="text-6xl mb-6 block">📚</span>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Article Not Found or Coming Soon
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  We&apos;re preparing educational content about personal finance, loans, investments, and FIRE.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const pageTitle = `${article.title} | Toolisk Finance`;
  const slugStr = typeof slug === 'string' ? slug : '';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.keywords} />
        <link rel="canonical" href={`https://toolisk.com/finance/learn/${slugStr}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={`https://toolisk.com/finance/learn/${slugStr}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.publishedDate} />
      </Head>
      <BlogArticleSchema
        title={article.title}
        description={article.description}
        slug={slugStr}
        category={article.category}
        publishedDate={article.publishedDate}
        readTime={article.readTime}
        keywords={article.keywords}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://toolisk.com' },
          { name: 'Finance Learn', url: 'https://toolisk.com/finance/learn' },
          { name: article.category, url: `https://toolisk.com/finance/learn?category=${article.category}` },
          { name: article.title, url: `https://toolisk.com/finance/learn/${slug}` },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <article className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>→</span>
            <Link href="/finance/learn" className="hover:text-blue-600 transition-colors">Finance Learn</Link>
            <span>→</span>
            <span className="text-gray-700">{article.category}</span>
          </nav>

          <header className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{article.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time>{new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-8 border border-gray-100">
            {article.content}
          </div>

          <aside className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🧮</span>
              Try Our Calculators
            </h3>
            <p className="text-gray-600 mb-6">
              Put these concepts into practice with our free, easy-to-use financial calculators:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between bg-white rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-blue-100"
                >
                  <span className="font-semibold text-gray-900">{tool.name}</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </aside>
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(articleMap).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  if (!articleMap[slug]) return { notFound: true };
  return { props: { slug } };
};
