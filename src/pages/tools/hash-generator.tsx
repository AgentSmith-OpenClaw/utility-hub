import Head from 'next/head';
import HashGenerator from '../../components/Tools/HashGenerator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const FAQS = [
  { q: 'Is my input sent anywhere?', a: "No. All hashing happens in your browser using the Web Crypto API (and a JavaScript implementation for MD5). Nothing is uploaded." },
  { q: 'Should I use MD5 for passwords?', a: 'No, never. MD5 is cryptographically broken — collisions can be generated easily. For passwords, use a slow, salted, memory-hard algorithm like Argon2, bcrypt, or scrypt. For digital signatures and integrity, use SHA-256 or higher.' },
  { q: 'When is MD5 still acceptable?', a: 'MD5 is fine for non-adversarial use cases like deduplication, content addressing, and basic file checksums where you only need to detect accidental corruption — not malicious tampering.' },
  { q: 'What does "salt" mean in hashing?', a: "A salt is a random value added to the input before hashing, so identical inputs produce different hashes. This prevents attackers from precomputing hash tables (rainbow tables) for common passwords. Salts must be unique per-record for full protection." },
  { q: 'Why is the same input producing the same hash every time?', a: 'That is the defining property of a hash function — it is deterministic. Same input always produces the same output. If you need different outputs for the same input, add a salt (a unique random value) before hashing.' },
];

export default function HashGeneratorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/tools/hash-generator');
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Hash Generator',
    slug: '/tools/hash-generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally using the Web Crypto API.',
    category: 'SecurityApplication',
    featureList: 'MD5, SHA-1, SHA-256, SHA-384, SHA-512, Real-time hashing, Web Crypto API',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Hash Generator — MD5, SHA-1, SHA-256, SHA-512 | Toolisk</title>
        <meta
          name="description"
          content="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. Free, browser-based — your input never leaves your device."
        />
        <meta
          name="keywords"
          content="hash generator, md5, sha-1, sha-256, sha-512, online hash, checksum, fingerprint"
        />
        <link rel="canonical" href={`${SITE_URL}/tools/hash-generator`} />
        <meta property="og:title" content="Hash Generator | Toolisk" />
        <meta property="og:description" content="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally." />
        <meta property="og:url" content={`${SITE_URL}/tools/hash-generator`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell
        icon="🔏"
        title="Hash Generator"
        tagline="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes — all locally in your browser."
      >
        <HashGenerator />
      </ToolShell>

      <ToolSEOContent
        description="Generate cryptographic hashes from any text input. The tool computes MD5, SHA-1, SHA-256, SHA-384, and SHA-512 simultaneously using the Web Crypto API. Your input is never transmitted to any server, making this safe for sensitive data."
        features={[
          '🔐 5 hash algorithms in one view',
          '⚡ Real-time computation as you type',
          '🛡️ Web Crypto API — runs locally',
          '🔠 Toggle between lowercase and uppercase output',
          '📋 One-click copy for any hash',
          '🆓 No sign-ups, no usage limits',
        ]}
        steps={[
          { title: 'Type or paste input', desc: 'Any string works — short messages, JSON payloads, file contents, etc.' },
          { title: 'See all hashes', desc: 'MD5, SHA-1, SHA-256, SHA-384, and SHA-512 update simultaneously as you type.' },
          { title: 'Pick the right one', desc: 'For checksums, MD5 or SHA-256 are common. For security-critical use, prefer SHA-256 or higher.' },
          { title: 'Copy the digest', desc: 'Each row has its own copy button. Toggle uppercase if you need the canonical hex format for your platform.' },
        ]}
        faqs={[
          {
            q: 'Is my input sent anywhere?',
            a: "No. All hashing happens in your browser using the Web Crypto API (and a JavaScript implementation for MD5). Nothing is uploaded.",
          },
          {
            q: 'Should I use MD5 for passwords?',
            a: 'No, never. MD5 is cryptographically broken — collisions can be generated easily. For passwords, use a slow, salted, memory-hard algorithm like Argon2, bcrypt, or scrypt. For digital signatures and integrity, use SHA-256 or higher.',
          },
          {
            q: 'When is MD5 still acceptable?',
            a: 'MD5 is fine for non-adversarial use cases like deduplication, content addressing, and basic file checksums where you only need to detect accidental corruption — not malicious tampering.',
          },
          {
            q: 'What does "salt" mean in hashing?',
            a: "A salt is a random value added to the input before hashing, so identical inputs produce different hashes. This prevents attackers from precomputing hash tables (rainbow tables) for common passwords. Salts must be unique per-record for full protection.",
          },
          {
            q: 'Why is the same input producing the same hash every time?',
            a: 'That is the defining property of a hash function — it is deterministic. Same input always produces the same output. If you need different outputs for the same input, add a salt (a unique random value) before hashing.',
          },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">A quick guide to hash algorithms</h2>
            <p className="text-slate-600 leading-relaxed">
              A cryptographic hash function maps any input of any size to a fixed-length output (the digest). Good hash
              functions have three properties: same input always produces the same output, it&apos;s computationally
              infeasible to find two inputs with the same output (collision resistance), and the output reveals nothing
              about the input (preimage resistance).
            </p>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-4">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Algorithm</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Output bits</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Recommended for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="px-4 py-2 font-mono">MD5</td><td className="px-4 py-2">128</td><td className="px-4 py-2 text-red-600">Broken</td><td className="px-4 py-2">Non-security checksums only</td></tr>
                  <tr><td className="px-4 py-2 font-mono">SHA-1</td><td className="px-4 py-2">160</td><td className="px-4 py-2 text-red-600">Broken</td><td className="px-4 py-2">Legacy compatibility only</td></tr>
                  <tr><td className="px-4 py-2 font-mono">SHA-256</td><td className="px-4 py-2">256</td><td className="px-4 py-2 text-emerald-600">Strong</td><td className="px-4 py-2">General purpose, signatures</td></tr>
                  <tr><td className="px-4 py-2 font-mono">SHA-384</td><td className="px-4 py-2">384</td><td className="px-4 py-2 text-emerald-600">Strong</td><td className="px-4 py-2">Higher-security signatures</td></tr>
                  <tr><td className="px-4 py-2 font-mono">SHA-512</td><td className="px-4 py-2">512</td><td className="px-4 py-2 text-emerald-600">Strong</td><td className="px-4 py-2">High-security applications</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Base64 Encoder / Decoder', href: '/tools/base64', icon: '🔐' },
          { name: 'UUID Generator', href: '/tools/uuid-generator', icon: '🆔' },
          { name: 'URL Encoder / Decoder', href: '/tools/url-encoder', icon: '🔗' },
        ]}
        relatedArticles={[
          { title: 'Hashing vs Encryption', href: '/tools/learn/hashing-vs-encryption' },
        ]}
      />
    </>
  );
}
