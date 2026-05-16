import Head from 'next/head';
import UrlEncoder from '../../components/Tools/UrlEncoder';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

export default function UrlEncoderPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/url-encoder');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'URL Encoder & Decoder',
    slug: '/tools/url-encoder',
    description: 'Percent-encode or decode URL components. Supports encodeURIComponent and encodeURI variants.',
    featureList: 'encodeURIComponent, encodeURI, Decode, Live preview, Copy to clipboard',
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is URL encoding?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'URL encoding (percent encoding) replaces unsafe characters in a URL with a percent sign followed by two hex digits. For example, a space becomes %20, and an ampersand becomes %26. This makes URLs safe to transmit through systems that have reserved meanings for those characters.',
        },
      },
      {
        '@type': 'Question',
        name: 'When should I use encodeURIComponent vs encodeURI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use encodeURIComponent for individual URL parts (query string values, path segments). Use encodeURI when you have a complete URL and only want to escape spaces and unicode while preserving structural characters like / : ? & = #.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is URL encoding the same as Base64?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. URL encoding only escapes characters that have special meaning in URLs, while Base64 converts arbitrary binary data into a 64-character ASCII alphabet. URL encoding is for safety in URLs; Base64 is for transmitting binary as text.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data sent to any server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. The URL encoder runs entirely in your browser using built-in JavaScript functions. Nothing is uploaded.',
        },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>URL Encoder / Decoder — Free Online Tool | Toolisk</title>
        <meta
          name="description"
          content="Encode or decode URL components instantly. Free, browser-based URL encoder with support for encodeURIComponent and encodeURI variants."
        />
        <meta
          name="keywords"
          content="URL encoder, URL decoder, percent encoding, encodeURIComponent, encodeURI, URL escape, query string"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/url-encoder`} />
        <meta property="og:title" content="URL Encoder / Decoder — Free Online Tool | Toolisk" />
        <meta property="og:description" content="Encode or decode URL components instantly. Free and browser-based." />
        <meta property="og:url" content={`${SITE_URL}/tools/url-encoder`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🔗"
        title="URL Encoder / Decoder"
        tagline="Percent-encode special characters or decode an encoded URL — instantly, in your browser."
      >
        <UrlEncoder />
      </ToolShell>

      <ToolSEOContent
        description="Free online URL encoder and decoder. Convert any string into a percent-encoded URL component, or decode an existing encoded URL back to its readable form. Supports both encodeURIComponent (full escaping) and encodeURI (preserves URL structure) variants."
        features={[
          '⚡ Real-time encoding and decoding',
          '🔁 Encode and decode in one tool',
          '🧩 Both encodeURIComponent and encodeURI',
          '🛡️ 100% client-side — your data never leaves your browser',
          '📋 One-click copy to clipboard',
          '🆓 Free, no sign-ups, no usage limits',
        ]}
        steps={[
          {
            title: 'Choose Encode or Decode',
            desc: 'Switch between encoding plain text into a URL-safe string and decoding an already-encoded URL.',
          },
          {
            title: 'Pick the variant',
            desc: 'Use Component for query string values and path segments (escapes everything). Use Full URL when you have a complete URL and want to preserve / : ? & =.',
          },
          {
            title: 'Paste your input',
            desc: 'The output appears instantly as you type. There is no submit button.',
          },
          {
            title: 'Copy or swap',
            desc: 'Use the Copy button to grab the result, or Swap to feed the output back as input for the opposite operation.',
          },
        ]}
        faqs={[
          {
            q: 'What is URL encoding?',
            a: 'URL encoding (also called percent encoding) replaces unsafe characters in a URL with a percent sign followed by two hex digits. For example, a space becomes %20 and an ampersand becomes %26. This makes URLs safe to transmit through systems that have reserved meanings for those characters.',
          },
          {
            q: 'When should I use encodeURIComponent vs encodeURI?',
            a: 'Use encodeURIComponent for individual URL parts like query string values and path segments — it escapes almost everything. Use encodeURI when you have a complete URL and only want to escape spaces and unicode while preserving structural characters like / : ? & = #.',
          },
          {
            q: 'Is URL encoding the same as HTML encoding or Base64?',
            a: 'No. URL encoding only escapes characters with special meaning in URLs. HTML encoding converts characters like < and > into entities like &lt; and &gt;. Base64 transforms arbitrary binary into a 64-character ASCII alphabet — a completely different concept.',
          },
          {
            q: 'Is my data sent to any server?',
            a: 'No. The URL encoder runs entirely in your browser using built-in JavaScript functions. Nothing is uploaded.',
          },
          {
            q: 'Why does decoding fail with "URI malformed"?',
            a: 'JavaScript throws this error when it encounters an invalid percent-escape sequence — for example a stray "%" not followed by two hex digits. Check that every "%" in the input is followed by a valid two-character hex code.',
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why URL encoding matters</h2>
            <p className="text-slate-600 leading-relaxed">
              URLs have a fixed grammar. Characters like <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">?</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">&amp;</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">=</code> separate the path, query string, and key/value pairs. If the actual data you want to send <em>contains</em> those characters, it must be escaped — otherwise the receiving server will misinterpret your input.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The encoded form is unambiguous. <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">%20</code> is always a space; <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">%26</code> is always an ampersand that should be treated as data, not as a parameter separator.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Common use cases</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Building search query strings: <code className="text-xs bg-slate-100 px-1 rounded">?q=hello%20world</code></li>
              <li>Passing URLs as parameters in OAuth redirect flows</li>
              <li>Constructing REST API paths with user-provided IDs that might contain spaces or slashes</li>
              <li>Embedding URLs inside JSON config files for tools that don&apos;t auto-escape</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'cURL to Code', href: '/tools/curl-to-code', icon: '🔄' },
          { name: 'QR Code Generator', href: '/tools/qr-code-generator', icon: '📱' },
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
        ]}
        relatedArticles={[
          { title: 'URL Encoding Explained', href: '/tools/learn/url-encoding-explained' },
          { title: 'Base64 & Data URLs', href: '/tools/learn/base64-and-data-urls' },
        ]}
      />
    </>
  );
}
