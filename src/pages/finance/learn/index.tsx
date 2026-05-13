import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { articleList } from '../../../content/blog/finance';
import { generateBreadcrumbs, SITE_URL } from '../../../utils/siteConfig';

const ALL = 'All';

export default function FinanceLearnIndexPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/learn');
  const categories = useMemo(() => {
    const set = new Set<string>(articleList.map((a) => a.category));
    return [ALL, ...Array.from(set)];
  }, []);

  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articleList.filter((a) => {
      if (activeCategory !== ALL && a.category !== activeCategory) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.keywords.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, query]);

  return (
    <>
      <Head>
        <title>Finance Learn Hub — All Personal Finance Guides | Toolisk</title>
        <meta
          name="description"
          content="Browse all Toolisk finance blogs in one place. Learn about EMI, prepayments, FIRE, SIP strategy, inflation, compound interest, IRAs, 401k, HSA, and more."
        />
        <meta
          name="keywords"
          content="finance blogs, personal finance guides, EMI guide, FIRE guide, SIP strategy, compound interest articles, retirement planning, investing"
        />
        <link rel="canonical" href="https://toolisk.com/finance/learn" />
        <meta property="og:title" content="Finance Learn Hub — Toolisk" />
        <meta
          property="og:description"
          content="Read all finance guides and tutorials from Toolisk in one organized place."
        />
        <meta property="og:url" content="https://toolisk.com/finance/learn" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              breadcrumbSchema,
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Toolisk Finance Guides',
                description: 'Personal finance guides and tutorials from Toolisk.',
                numberOfItems: articleList.length,
                itemListElement: articleList.map((article, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: article.title,
                  url: `${SITE_URL}/finance/learn/${article.slug}`,
                  description: article.description,
                })),
              },
            ]),
          }}
        />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <article className="max-w-6xl mx-auto px-4 py-10">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Finance Learn Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Personal Finance Blogs &amp; Guides
            </h1>
            <p className="text-slate-600 max-w-3xl leading-relaxed">
              Explore practical, plain-English finance articles to make better money decisions. Every guide
              links to the relevant calculator so you can apply what you learn immediately.
            </p>
            <p className="text-slate-500 text-sm mt-2">{articleList.length} articles and growing.</p>
          </header>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <input
                type="search"
                placeholder="Search articles, topics, keywords…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={
                      'text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ' +
                      (activeCategory === cat
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700')
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
              <p className="text-slate-500">No articles match your search.</p>
            </div>
          ) : (
            <section
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              itemScope
              itemType="https://schema.org/CollectionPage"
            >
              {filtered.map((article) => (
                <Link
                  key={article.slug}
                  href={`/finance/learn/${article.slug}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 p-6 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400">{article.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{article.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <time>
                      {new Date(article.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                      Read article →
                    </span>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </article>
      </div>
    </>
  );
}
