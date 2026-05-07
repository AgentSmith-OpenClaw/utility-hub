import Head from 'next/head';
import Link from 'next/link';

const toolsArticles = [
  {
    slug: 'url-encoding-explained',
    title: 'URL Encoding Explained: When and Why Characters Are Percent-Encoded',
    description:
      "Learn why URLs need encoding, how percent-encoding works, and when to use encodeURIComponent vs encodeURI in real applications.",
    readTime: '7 min read',
    publishedDate: '2026-05-07',
    category: 'Web',
  },
  {
    slug: 'json-essentials',
    title: 'JSON Essentials for Developers: Beyond Pretty-Printing',
    description:
      'Schemas, validation, common pitfalls, and the parser quirks every developer should know about JSON.',
    readTime: '9 min read',
    publishedDate: '2026-05-07',
    category: 'Developer',
  },
  {
    slug: 'regex-cheatsheet',
    title: 'Regex Cheatsheet & Common Patterns: Email, URL, Phone Validation',
    description:
      'Practical regex patterns for everyday validation tasks — and the tricky edge cases that catch most developers.',
    readTime: '11 min read',
    publishedDate: '2026-05-07',
    category: 'Developer',
  },
  {
    slug: 'base64-and-data-urls',
    title: 'Base64 & Data URLs: When to Inline Binary Content',
    description:
      'Why we encode binary data as text, when data URLs help, and when they hurt page performance.',
    readTime: '8 min read',
    publishedDate: '2026-05-07',
    category: 'Web',
  },
  {
    slug: 'hashing-vs-encryption',
    title: 'Hashing vs Encryption: Two Concepts Constantly Confused',
    description:
      'Hashing is one-way; encryption is two-way. Get the difference right and avoid catastrophic security mistakes.',
    readTime: '8 min read',
    publishedDate: '2026-05-07',
    category: 'Security',
  },
  {
    slug: 'color-theory-for-developers',
    title: 'Color Theory for Developers: HEX, RGB, HSL, and WCAG Contrast',
    description:
      'Everything a developer needs to know about color models — and why HSL changes how you think about palettes.',
    readTime: '9 min read',
    publishedDate: '2026-05-07',
    category: 'Design',
  },
  {
    slug: 'uuid-v4-vs-v7',
    title: 'UUID v4 vs UUID v7: Choosing the Right Identifier',
    description:
      'Why time-ordered UUIDs are quietly replacing v4 for database primary keys — and when v4 is still the right choice.',
    readTime: '7 min read',
    publishedDate: '2026-05-07',
    category: 'Developer',
  },
  {
    slug: 'naming-conventions-guide',
    title: 'Naming Conventions: camelCase, snake_case, kebab-case Explained',
    description:
      'A practical guide to the casing conventions used across programming languages, frameworks, and platforms.',
    readTime: '6 min read',
    publishedDate: '2026-05-07',
    category: 'Developer',
  },
];

export default function ToolsLearnIndexPage() {
  return (
    <>
      <Head>
        <title>Tools Learn Hub — Developer & Web Utility Guides | Toolisk</title>
        <meta
          name="description"
          content="Browse all Toolisk web utility guides in one place. Learn about URL encoding, JSON, regex, Base64, hashing, color theory, UUIDs, and more."
        />
        <meta
          name="keywords"
          content="developer guides, web utility tutorials, regex guide, json guide, url encoding guide, hashing tutorial"
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
              Developer & Web Utility Guides
            </h1>
            <p className="text-slate-600 max-w-3xl leading-relaxed">
              Practical guides on the technologies behind everyday web utilities — encoding standards, regex
              patterns, color theory, hashing, and more. Every guide links to the relevant tool so you can apply
              what you learn immediately.
            </p>
          </header>

          <section
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            itemScope
            itemType="https://schema.org/CollectionPage"
          >
            {toolsArticles.map((article) => (
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
        </article>
      </div>
    </>
  );
}
