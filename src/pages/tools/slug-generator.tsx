import Head from 'next/head';
import SlugGenerator from '../../components/Tools/SlugGenerator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/slug-generator';

export default function SlugGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'URL Slug Generator',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Convert any title or text to a clean, URL-friendly slug. Strips accents, spaces, and special characters. Bulk mode for batch processing.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'URL slug creation, Diacritic stripping, Configurable separator, Stop-word removal, Bulk processing',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'What\'s the ideal slug length for SEO?', acceptedAnswer: { '@type': 'Answer', text: 'Aim for 3–6 words and under 60 characters. Search engines truncate long URLs in results, and short slugs are easier to share. Strip stop words like "the" and "of" if it stays meaningful.' } },
      { '@type': 'Question', name: 'Should I use hyphens or underscores?', acceptedAnswer: { '@type': 'Answer', text: 'Hyphens. Google explicitly treats hyphens as word separators in URLs but treats underscores as part of a single word. So "my-best-tip" indexes as three words; "my_best_tip" indexes as one.' } },
      { '@type': 'Question', name: 'How do I handle non-Latin characters?', acceptedAnswer: { '@type': 'Answer', text: 'This generator transliterates accented characters to ASCII (café → cafe). For non-Latin scripts (Cyrillic, Arabic, CJK), the modern approach is to keep them as URL-encoded UTF-8 — search engines and browsers handle them well. Use Latin-only slugs only if your audience is English-first.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>URL Slug Generator — Convert Titles to Clean URLs | Toolisk</title>
        <meta name="description" content="Free URL slug generator. Turn any title into a clean, SEO-friendly slug. Strips accents, spaces, special characters. Bulk mode for converting many at once." />
        <meta name="keywords" content="slug generator, url slug, seo slug, slugify, url friendly text, permalink generator, title to slug" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="URL Slug Generator | Toolisk" />
        <meta property="og:description" content="Convert titles to clean, SEO-friendly URL slugs." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🔗" title="URL Slug Generator" tagline="Turn any title into a clean, lowercase, hyphen-separated slug — perfect for blog URLs, file names, and database keys.">
        <SlugGenerator />
      </ToolShell>

      <ToolSEOContent
        description="A URL slug generator that handles all the messy edge cases — accented characters, smart quotes, ampersands, multi-line titles, stop-word removal, and length capping. Bulk mode lets you paste a whole list and get one slug per line."
        features={[
          '🌍 Strips accents (café → cafe)',
          '✂️ Configurable max length',
          '🚫 Optional stop-word stripping',
          '🔁 Bulk slugify (one title per line)',
          '🔠 Lowercase / uppercase / preserve modes',
          '📋 Copy individual or all slugs',
        ]}
        steps={[
          { title: 'Type or paste your title', desc: 'Use one line for a single slug or many lines for bulk processing.' },
          { title: 'Choose separator', desc: 'Hyphen (recommended for URLs), underscore, or dot.' },
          { title: 'Set length & stop words', desc: 'Cap to 60 chars for SEO. Strip "the / of / and" for terser slugs.' },
          { title: 'Copy and use', desc: 'Drop the slug into your CMS, route file, or filename.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Slug rules that actually matter for SEO</h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Use hyphens, not underscores.</strong> Google treats hyphens as word separators.</li>
              <li><strong>Stay under 60 characters.</strong> Search results truncate long URLs.</li>
              <li><strong>Include your primary keyword.</strong> URLs are a (small) ranking signal and a click-through signal.</li>
              <li><strong>Lowercase only.</strong> Mixed-case URLs cause duplicate-content headaches and case-sensitive 404s.</li>
              <li><strong>Don&apos;t change established URLs.</strong> Once published, redirect old URLs to new ones — never just rename.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Case Converter', href: '/tools/case-converter', icon: '🔤' },
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'Word Counter', href: '/tools/word-counter', icon: '✍️' },
        ]}
      />
    </>
  );
}
