import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { articleMap } from '../../../content/blog/tools';
import BlogArticleSchema from '../../../components/SEO/BlogArticleSchema';
import BreadcrumbSchema from '../../../components/SEO/BreadcrumbSchema';

export default function ToolsLearnArticle() {
  const router = useRouter();
  const slug = router.query.slug as string;
  const article = articleMap[slug];

  if (!article) {
    return (
      <>
        <Head>
          <title>Article Not Found | Toolisk</title>
        </Head>
        <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Article not found</h1>
            <p className="text-slate-500 mb-4">We could not find the article you&apos;re looking for.</p>
            <Link href="/tools/learn" className="text-emerald-600 font-semibold hover:underline">
              ← Browse all guides
            </Link>
          </div>
        </div>
      </>
    );
  }

  const pageTitle = `${article.title} | Toolisk`;
  const slugStr = slug || '';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.keywords} />
        <link rel="canonical" href={`https://toolisk.com/tools/learn/${slugStr}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={`https://toolisk.com/tools/learn/${slugStr}`} />
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
          { name: 'Tools', url: 'https://toolisk.com/tools' },
          { name: 'Learn', url: 'https://toolisk.com/tools/learn' },
          { name: article.title, url: `https://toolisk.com/tools/learn/${slug}` },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/40 py-12">
        <article className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>→</span>
            <Link href="/tools" className="hover:text-emerald-600 transition-colors">Tools</Link>
            <span>→</span>
            <Link href="/tools/learn" className="hover:text-emerald-600 transition-colors">Learn</Link>
          </nav>

          <header className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{article.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time>
                {new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-8 border border-gray-100">
            {article.content}
          </div>

          <aside className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🛠️</span>
              Try the related tools
            </h3>
            <p className="text-gray-600 mb-6">
              Put these concepts into practice with our free, browser-based utilities:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between bg-white rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-emerald-100"
                >
                  <span className="font-semibold text-gray-900">{tool.name}</span>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
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
