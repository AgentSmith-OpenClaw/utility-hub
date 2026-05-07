import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { articleList } from '../../../content/blog/tools';

const ALL = 'All';

export default function ToolsLearnIndexPage() {
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
        <title>Tools Learn Hub — Developer &amp; Web Utility Guides | Toolisk</title>
        <meta
          name="description"
          content="Browse all Toolisk web utility guides in one place. Learn about URL encoding, JSON, regex, Base64, hashing, color theory, UUIDs, JWT, CORS, HTTP status codes and more."
        />
        <meta
          name="keywords"
          content="developer guides, web utility tutorials, regex guide, json guide, url encoding guide, hashing tutorial, jwt, cors, http"
        />
        <link rel="canonical" href="https://toolisk.com/tools/learn" />
        <meta property="og:title" content="Tools Learn Hub — Toolisk" />
        <meta
          property="og:description"
          content="Read all developer and web utility guides from Toolisk in one organized place."
        />
        <meta property="og:url" content="https://toolisk.com/tools/learn" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/40 min-h-screen">
        <article className="max-w-6xl mx-auto px-4 py-10">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Tools Learn Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Developer &amp; Web Utility Guides
            </h1>
            <p className="text-slate-600 max-w-3xl leading-relaxed">
              Practical guides on the technologies behind everyday web utilities — encoding standards, regex
              patterns, color theory, hashing, and more. Every guide links to the relevant tool so you can apply
              what you learn immediately.
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
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-sm"
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
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700')
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
                  href={`/tools/learn/${article.slug}`}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 p-6 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400">{article.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors mb-2">
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
                    <span className="font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
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
