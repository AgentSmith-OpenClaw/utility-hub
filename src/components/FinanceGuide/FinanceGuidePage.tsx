import Head from 'next/head';
import Link from 'next/link';
import { FinanceGuide } from '../../types/financeGuide';

interface FinanceGuidePageProps {
  guide: FinanceGuide;
}

const toId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export default function FinanceGuidePage({ guide }: FinanceGuidePageProps) {
  const canonical = `https://toolisk.com/finance/${guide.slug}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const articleText = [
    ...guide.intro,
    ...guide.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets || [])]),
    ...guide.faq.flatMap((item) => [item.question, item.answer]),
  ].join(' ');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.metaDescription,
    mainEntityOfPage: canonical,
    author: {
      '@type': 'Organization',
      name: 'Toolisk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toolisk',
    },
    articleBody: articleText,
  };

  return (
    <>
      <Head>
        <title>{guide.title}</title>
        <meta name="description" content={guide.metaDescription} />
        <meta name="keywords" content={guide.keywords} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, faqSchema]) }}
        />
      </Head>

      <main className="bg-slate-50 py-10 px-4 md:px-6">
        <article className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <header className="mb-8 border-b border-slate-200 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{guide.h1}</h1>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={guide.toolPath}
                className="inline-flex items-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 transition"
              >
                {guide.toolCtaLabel}
              </Link>
              <Link
                href={guide.toolPath}
                className="inline-flex items-center rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-semibold px-5 py-3 transition"
              >
                Open tool-only page
              </Link>
            </div>
            <div className="mt-6 space-y-4 text-slate-700 leading-relaxed">
              {guide.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </header>

          <nav aria-label="On page" className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8">
            <p className="font-semibold text-slate-800 mb-3">Jump to a section</p>
            <ul className="grid md:grid-cols-2 gap-2 text-sm">
              {guide.sections.map((section) => (
                <li key={section.heading}>
                  <a className="text-blue-700 hover:text-blue-800" href={`#${toId(section.heading)}`}>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-8">
            {guide.sections.map((section) => (
              <section key={section.heading} id={toId(section.heading)} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 36)}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 list-disc pl-6 space-y-2 text-slate-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet.slice(0, 32)}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-10 pt-8 border-t border-slate-200" id="faq">
            <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently asked questions</h2>
            <div className="space-y-4">
              {guide.faq.map((item) => (
                <div key={item.question} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.question}</h3>
                  <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related finance tools</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {guide.relatedLinks.map((linkItem) => (
                <Link
                  key={linkItem.href}
                  href={linkItem.href}
                  className="border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 text-slate-800 font-medium transition"
                >
                  {linkItem.label}
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
