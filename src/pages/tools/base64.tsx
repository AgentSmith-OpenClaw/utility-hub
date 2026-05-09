import Head from 'next/head';
import Base64Encoder from '../../components/Tools/Base64Encoder';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FAQS = [
  { q: 'What is Base64 used for?', a: 'Base64 is used to transmit binary data over text-only channels — email attachments (MIME), inline images (data URLs), JSON Web Tokens, HTTP Basic auth headers, and config files. It encodes 3 bytes of binary as 4 ASCII characters, expanding size by ~33%.' },
  { q: 'When should I use URL-safe Base64?', a: 'When the encoded value will be placed in a URL or filename. Standard Base64 uses + and / which have special meaning in URLs. URL-safe Base64 swaps them for - and _ and removes the trailing = padding.' },
  { q: 'Is Base64 a form of encryption?', a: "No. Base64 is encoding, not encryption. Anyone who sees a Base64 string can decode it instantly. Use Base64 to transport binary data, never to hide secrets." },
  { q: 'Why does my Base64 string contain "="?', a: 'The "=" characters at the end are padding. Base64 always works in groups of 4 characters; if your input doesn\'t divide evenly, padding is added so it does. URL-safe variants typically drop the padding.' },
  { q: 'Does this work with emoji and unicode?', a: 'Yes. The tool encodes input using UTF-8 first, then converts to Base64. This means 🚀, 中文, and any other unicode round-trips correctly.' },
];

export default function Base64Page() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/base64');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Base64 Encoder & Decoder',
    slug: '/tools/base64',
    description: 'Convert text to Base64 and back, with full UTF-8 and URL-safe variants. Free, browser-based.',
    featureList: 'Encode and decode, UTF-8 support, URL-safe variant, Copy to clipboard',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Base64 Encoder / Decoder — UTF-8 & URL-Safe | Toolisk</title>
        <meta
          name="description"
          content="Convert text to Base64 and back, with full UTF-8 support and URL-safe variants. Free, browser-based Base64 encoder and decoder."
        />
        <meta
          name="keywords"
          content="base64 encoder, base64 decoder, url-safe base64, base64 utf-8, encode base64 online, decode base64 online"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/base64`} />
        <meta property="og:title" content="Base64 Encoder / Decoder | Toolisk" />
        <meta property="og:description" content="Convert text to Base64 and back, with UTF-8 and URL-safe support." />
        <meta property="og:url" content={`${SITE_URL}/tools/base64`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🔐"
        title="Base64 Encoder / Decoder"
        tagline="Encode and decode Base64 text with full UTF-8 and URL-safe support."
      >
        <Base64Encoder />
      </ToolShell>

      <ToolSEOContent
        description="A free, browser-based Base64 encoder and decoder. Convert any text to Base64 and back, with full UTF-8 support for emoji and unicode, plus a URL-safe variant for use in URLs and JWTs."
        features={[
          '🔄 Encode and decode in one tool',
          '🌍 Full UTF-8 support — works with emoji and any unicode',
          '🔗 URL-safe Base64 variant for use in URLs',
          '📋 One-click copy to clipboard',
          '🛡️ Runs locally in your browser',
          '🆓 No sign-ups, no usage limits',
        ]}
        steps={[
          { title: 'Choose Encode or Decode', desc: 'Switch between converting text to Base64 and decoding Base64 back to text.' },
          { title: 'Pick the variant', desc: 'Standard Base64 uses + / =. URL-safe Base64 swaps + and / for - and _ and drops padding.' },
          { title: 'Paste input', desc: 'Output appears instantly as you type. Errors highlighted clearly if input is not valid Base64.' },
          { title: 'Copy or swap', desc: 'Use Copy to grab the result, or Swap to feed the output back as input for the opposite operation.' },
        ]}
        faqs={[
          {
            q: 'What is Base64 used for?',
            a: 'Base64 is used to transmit binary data over text-only channels — email attachments (MIME), inline images (data URLs), JSON Web Tokens, HTTP Basic auth headers, and config files. It encodes 3 bytes of binary as 4 ASCII characters, expanding size by ~33%.',
          },
          {
            q: 'When should I use URL-safe Base64?',
            a: 'When the encoded value will be placed in a URL or filename. Standard Base64 uses + and / which have special meaning in URLs. URL-safe Base64 swaps them for - and _ and removes the trailing = padding.',
          },
          {
            q: 'Is Base64 a form of encryption?',
            a: "No. Base64 is encoding, not encryption. Anyone who sees a Base64 string can decode it instantly. Use Base64 to transport binary data, never to hide secrets.",
          },
          {
            q: 'Why does my Base64 string contain "="?',
            a: 'The "=" characters at the end are padding. Base64 always works in groups of 4 characters; if your input doesn\'t divide evenly, padding is added so it does. URL-safe variants typically drop the padding.',
          },
          {
            q: 'Does this work with emoji and unicode?',
            a: 'Yes. The tool encodes input using UTF-8 first, then converts to Base64. This means 🚀, 中文, and any other unicode round-trips correctly.',
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">A 60-second Base64 explanation</h2>
            <p className="text-slate-600 leading-relaxed">
              Computers store data as bytes (0–255). But many transport channels — email headers, URL query strings,
              HTTP Basic auth — only allow a limited set of printable ASCII characters. Base64 solves this by mapping
              every 3 bytes of binary into 4 characters from a 64-character alphabet (<code className="text-xs bg-slate-100 px-1 rounded">A-Z a-z 0-9 + /</code>).
            </p>
            <p className="text-slate-600 leading-relaxed">
              The output is always ASCII, always safe to paste into emails or JSON, and always reversible. The cost is
              a ~33% size increase — perfectly acceptable for the small payloads where Base64 shines.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">When NOT to use Base64</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>For large files — the 33% overhead is wasteful when you could use a binary upload.</li>
              <li>For secrets — Base64 is encoding, not encryption. Anyone can decode it.</li>
              <li>For database storage of files — modern databases support binary columns natively.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
          { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer', icon: '🧩' },
        ]}
        relatedArticles={[
          { title: 'Base64 & Data URLs', href: '/tools/learn/base64-and-data-urls' },
          { title: 'Hashing vs Encryption', href: '/tools/learn/hashing-vs-encryption' },
        ]}
      />
    </>
  );
}
