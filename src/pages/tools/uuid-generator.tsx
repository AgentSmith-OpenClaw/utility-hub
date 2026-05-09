import Head from 'next/head';
import UuidGenerator from '../../components/Tools/UuidGenerator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FAQS = [
  { q: "What's the difference between UUID v4 and UUID v7?", a: "UUID v4 is fully random — perfect when you need unpredictability and don't care about ordering. UUID v7 starts with a millisecond timestamp, so identifiers generated later sort after earlier ones. v7 is increasingly recommended for database primary keys because it preserves index locality." },
  { q: 'Are UUIDs really unique?', a: "For UUID v4, the chance of collision is astronomically small. You'd need to generate billions of UUIDs per second for many years to have a meaningful probability of duplication. In practice, treat them as unique." },
  { q: 'Can I use UUIDs as database primary keys?', a: "Yes, but be aware of trade-offs. UUID v4's randomness causes B-tree index fragmentation in some databases. UUID v7's time-ordered design avoids this. Both UUIDs are 16 bytes vs 4 or 8 for an integer." },
  { q: 'Is this generator cryptographically secure?', a: "Yes. The tool uses crypto.randomUUID and crypto.getRandomValues, which are backed by your operating system's secure random number generator." },
  { q: "What is the 'nil' UUID?", a: "The nil UUID is a special all-zeros value (00000000-0000-0000-0000-000000000000). It's defined in the UUID spec as a placeholder representing 'no UUID'." },
];

export default function UuidGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/uuid-generator');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'UUID Generator',
    slug: '/tools/uuid-generator',
    description: 'Generate UUID v4 and UUID v7 identifiers in bulk. Cryptographically secure via Web Crypto API.',
    featureList: 'UUID v4, UUID v7, Bulk generation, Uppercase / dash-removal, Web Crypto',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>UUID Generator — UUID v4 & v7 in Bulk | Toolisk</title>
        <meta
          name="description"
          content="Generate UUID v4 and UUID v7 identifiers in bulk. Copy individually or export entire batches. Free, browser-based, cryptographically secure."
        />
        <meta
          name="keywords"
          content="uuid generator, uuid v4, uuid v7, guid generator, unique id generator, bulk uuid"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/uuid-generator`} />
        <meta property="og:title" content="UUID Generator | Toolisk" />
        <meta property="og:description" content="Generate UUID v4 and UUID v7 identifiers in bulk." />
        <meta property="og:url" content={`${SITE_URL}/tools/uuid-generator`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🆔"
        title="UUID Generator"
        tagline="Generate cryptographically secure UUID v4 and UUID v7 identifiers in bulk — perfect for testing and database seeding."
      >
        <UuidGenerator />
      </ToolShell>

      <ToolSEOContent
        description="A free UUID generator that produces UUID v4 (random) and UUID v7 (time-ordered) identifiers using your browser's crypto.getRandomValues API. Generate up to 100 at once, with options for uppercase output or removing dashes."
        features={[
          '🎲 UUID v4 — fully random, 122 bits of entropy',
          '⏱️ UUID v7 — time-sortable for database keys',
          '🔢 Bulk generation up to 100 at a time',
          '🔠 Uppercase and dash-removal options',
          '📋 Per-row and copy-all support',
          '🛡️ Cryptographically secure (Web Crypto API)',
        ]}
        steps={[
          { title: 'Pick a version', desc: 'UUID v4 for general use (random). UUID v7 if you need natural time ordering for database primary keys.' },
          { title: 'Choose count', desc: 'The slider goes from 1 to 100. Useful for seeding test data or generating many keys at once.' },
          { title: 'Toggle formatting', desc: 'Uppercase or remove dashes if your platform expects a specific format.' },
          { title: 'Copy', desc: 'Each UUID has its own copy button. Use Copy All to grab the entire list at once.' },
        ]}
        faqs={[
          {
            q: "What's the difference between UUID v4 and UUID v7?",
            a: "UUID v4 is fully random — perfect when you need unpredictability and don't care about ordering. UUID v7 starts with a millisecond timestamp, so identifiers generated later sort after earlier ones. v7 is increasingly recommended for database primary keys because it preserves index locality.",
          },
          {
            q: 'Are UUIDs really unique?',
            a: 'For UUID v4, the chance of collision is astronomically small. You\'d need to generate billions of UUIDs per second for many years to have a meaningful probability of duplication. In practice, treat them as unique.',
          },
          {
            q: 'Can I use UUIDs as database primary keys?',
            a: "Yes, but be aware of trade-offs. UUID v4's randomness causes B-tree index fragmentation in some databases. UUID v7's time-ordered design avoids this. Both UUIDs are 16 bytes vs 4 or 8 for an integer, so storage and index size are larger.",
          },
          {
            q: 'Is this generator cryptographically secure?',
            a: 'Yes. The tool uses crypto.randomUUID and crypto.getRandomValues, which are backed by your operating system\'s secure random number generator. Output is suitable for security-sensitive use cases like session tokens.',
          },
          {
            q: "What is the 'nil' UUID?",
            a: "The nil UUID is a special all-zeros value (00000000-0000-0000-0000-000000000000). It's defined in the UUID spec as a placeholder representing 'no UUID', commonly used as a default or sentinel value in databases.",
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">UUIDs in the real world</h2>
            <p className="text-slate-600 leading-relaxed">
              A UUID (Universally Unique Identifier) is a 128-bit value designed to be unique across space and time
              without needing a central authority. The defining feature is that you can generate one on any machine,
              right now, with no coordination — and it&apos;ll still be unique.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Use UUIDs when you need identifiers that won&apos;t collide across systems: distributed databases, public
              APIs, file uploads, event sourcing. Use auto-incrementing integers when you control the database
              centrally and don&apos;t need cross-system uniqueness — they&apos;re smaller and faster.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8">Choosing v4 vs v7</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>UUID v4:</strong> use it for security-sensitive identifiers (session tokens, API keys) where unpredictability matters.</li>
              <li><strong>UUID v7:</strong> use it for database primary keys, event IDs, and any case where time ordering helps performance or debugging.</li>
              <li><strong>Both versions are unique;</strong> v7&apos;s only &ldquo;weakness&rdquo; is that the timestamp prefix is mildly inferable — usually a non-issue.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Hash Generator', href: '/tools/hash-generator', icon: '🔏' },
          { name: 'Timestamp Converter', href: '/tools/timestamp-converter', icon: '⏱️' },
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
        ]}
      />
    </>
  );
}
