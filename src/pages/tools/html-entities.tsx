import Head from 'next/head';
import HtmlEntities from '../../components/Tools/HtmlEntities';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/tools/html-entities';

export default function HtmlEntitiesPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HTML Entities Encoder & Decoder',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Encode special characters to HTML entities (named, numeric, or hex) and decode them back. Handles Unicode, smart quotes, and reserved characters.',
    url: `${SITE_URL}${SLUG}`,
    featureList: 'Named entities, Numeric entities, Hex entities, Encode all chars option, Bidirectional conversion',
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'When do I need to HTML-encode characters?', acceptedAnswer: { '@type': 'Answer', text: 'Whenever you embed user-supplied text into HTML. Without encoding, characters like < > " and & break the markup or open XSS holes. Templating engines usually do this automatically — manual encoding is for emails, hand-written HTML, and legacy systems.' } },
      { '@type': 'Question', name: 'Named, numeric, or hex entities — which should I use?', acceptedAnswer: { '@type': 'Answer', text: 'Named entities (&amp;, &copy;) are most readable. Numeric entities (&#38;) work everywhere. Hex entities (&#x26;) are common in XML and email headers. Pick based on what your downstream system parses cleanly.' } },
      { '@type': 'Question', name: 'Why does my email show "â€™" instead of an apostrophe?', acceptedAnswer: { '@type': 'Answer', text: 'That\'s a UTF-8 string being read as Latin-1 (or vice versa). The fix is making sure both sides agree on encoding — declare charset=utf-8 in headers and meta tags. HTML-encoding the smart quote (&rsquo;) avoids the issue entirely.' } },
    ],
  };

  return (
    <>
      <Head>
        <title>HTML Entities Encoder &amp; Decoder — Online | Toolisk</title>
        <meta name="description" content="Free HTML entity encoder and decoder. Convert special characters to &amp;amp;, &amp;lt;, &amp;copy; or numeric entities. Decode entities back to plain text. Supports Unicode." />
        <meta name="keywords" content="html entities, html encoder, html decoder, html escape, html entity encoder, ampersand encoder, special characters" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="HTML Entities Encoder & Decoder | Toolisk" />
        <meta property="og:description" content="Encode/decode HTML entities — named, numeric, or hex. Unicode-safe." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell icon="🏷️" title="HTML Entities Encoder & Decoder" tagline="Convert special characters to safe HTML entities, or decode them back to plain text. Named, numeric, or hex.">
        <HtmlEntities />
      </ToolShell>

      <ToolSEOContent
        description="Encode any text to HTML entities or decode entity-encoded text back to plain characters. Supports the full Unicode range with named entities for the common ones (&copy;, &mdash;, &ldquo;) and numeric/hex fallbacks for everything else."
        features={[
          '🔄 Bidirectional encode and decode',
          '🏷️ Named entities (&amp;, &copy;, &mdash;)',
          '🔢 Numeric entities (&#38;)',
          '🔠 Hex entities (&#x26;)',
          '🌐 Full Unicode support',
          '⚡ Live preview as you type',
        ]}
        steps={[
          { title: 'Pick encode or decode', desc: 'Encode converts plain text to HTML-safe form. Decode reverses it.' },
          { title: 'Choose entity style', desc: 'Named entities are most readable; numeric/hex are universally compatible.' },
          { title: 'Optional: encode all chars', desc: 'Useful for obfuscating email addresses against simple scrapers.' },
          { title: 'Copy the output', desc: 'One click puts the result on your clipboard.' },
        ]}
        faqs={faqSchema.mainEntity.map((f) => ({ q: f.name, a: f.acceptedAnswer.text }))}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Reserved characters and why we encode</h2>
            <p className="text-slate-600 leading-relaxed">
              HTML reserves five characters that must be encoded when used as content: <code>&amp;</code> (becomes <code>&amp;amp;</code>),
              <code>&lt;</code> (<code>&amp;lt;</code>), <code>&gt;</code> (<code>&amp;gt;</code>), <code>&quot;</code> (<code>&amp;quot;</code>),
              and <code>&apos;</code> (<code>&amp;#39;</code>). Skipping this is the original sin of XSS — user input that
              contains a <code>&lt;script&gt;</code> tag will execute in someone else&apos;s browser.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Modern frameworks usually handle this</h3>
            <p className="text-slate-600 leading-relaxed">
              React, Vue, Svelte, Angular, and modern templating engines auto-escape interpolated values. You typically only
              need manual encoding for raw HTML strings, email body content, RSS feeds, or when bypassing the framework&apos;s
              escape mechanism (e.g. <code>dangerouslySetInnerHTML</code>).
            </p>
          </section>
        }
        relatedTools={[
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
          { name: 'Markdown Preview', href: '/tools/markdown-preview', icon: '📑' },
        ]}
      />
    </>
  );
}
