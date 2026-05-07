import Link from 'next/link';
import type { BlogArticle } from '../types';

export const hashingVsEncryption: BlogArticle = {
  slug: 'hashing-vs-encryption',
  category: 'Security',
    title: 'Hashing vs Encryption: Two Concepts Constantly Confused',
    description:
      'Hashing is one-way; encryption is two-way. Get the difference right and avoid catastrophic security mistakes.',
    publishedDate: '2026-05-07',
    readTime: '8 min read',
    keywords: 'hashing, encryption, sha-256, md5, password hashing, security',
    relatedTools: [
      { name: 'Hash Generator', href: '/tools/hash-generator' },
      { name: 'Base64 Encoder / Decoder', href: '/tools/base64' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          &ldquo;Encrypted in our database&rdquo; is a phrase that should make every security engineer wince. Half
          the time, the speaker actually means hashed. The other half, they really do mean encrypted, and that&apos;s
          its own problem. Knowing the difference is one of the most consequential pieces of vocabulary in software.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The core difference</h2>
        <p>
          <strong>Hashing</strong> is one-way. You feed input in; a fixed-length digest comes out. There&apos;s no
          mathematical way to reverse the digest back to the input. Same input always produces the same output.
        </p>
        <p>
          <strong>Encryption</strong> is two-way. You encrypt with a key, you decrypt with a key (the same one, for
          symmetric encryption; a different one, for asymmetric). The whole point is that the original data can be
          recovered.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-2"> </th><th className="text-left py-2">Hashing</th><th className="text-left py-2">Encryption</th></tr></thead>
            <tbody>
              <tr><td className="py-2 font-semibold">Reversible?</td><td>No</td><td>Yes (with key)</td></tr>
              <tr><td className="py-2 font-semibold">Key required?</td><td>No</td><td>Yes</td></tr>
              <tr><td className="py-2 font-semibold">Output size</td><td>Fixed</td><td>Roughly input size</td></tr>
              <tr><td className="py-2 font-semibold">Same input → same output?</td><td>Always</td><td>Depends (initialization vector)</td></tr>
              <tr><td className="py-2 font-semibold">Use cases</td><td>Passwords, integrity, fingerprints</td><td>Confidentiality of data at rest or in transit</td></tr>
            </tbody>
          </table>
        </div>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Try a hash:</strong> See how the same input always produces the same digest.
          </p>
          <Link
            href="/tools/hash-generator"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open Hash Generator →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When to hash</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Passwords:</strong> store the hash, not the password. When the user logs in, hash their input and
            compare hashes. Use a slow, salted, memory-hard algorithm: <strong>Argon2</strong>, <strong>bcrypt</strong>,
            or <strong>scrypt</strong>. Never raw SHA-256 — it&apos;s too fast, allowing brute-force attacks.
          </li>
          <li>
            <strong>Integrity:</strong> compute a SHA-256 of a file, publish it, and consumers can verify their copy
            matches. Used everywhere from package managers to git commits.
          </li>
          <li>
            <strong>Content addressing:</strong> name files by their hash. Same content always has the same name.
            Used by IPFS, git, and content delivery networks.
          </li>
          <li>
            <strong>Fingerprinting:</strong> dedupe files, detect changes, build cache keys.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When to encrypt</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Data at rest:</strong> database fields containing PII, credit cards, health info. AES-256-GCM is
            the modern default.
          </li>
          <li>
            <strong>Data in transit:</strong> TLS handles this for you. Every HTTPS connection uses asymmetric crypto
            to exchange keys, then symmetric crypto to bulk-encrypt the conversation.
          </li>
          <li>
            <strong>End-to-end messaging:</strong> Signal&apos;s protocol uses asymmetric keys to encrypt messages so
            only the recipient can read them, even Signal can&apos;t.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why &ldquo;we hash passwords&rdquo; isn&apos;t enough</h2>
        <p>
          Two attacker techniques break naive password hashing:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Rainbow tables:</strong> precomputed hash tables for common passwords. Defense: <strong>salt</strong>{' '}
            — add a unique random value per user before hashing.
          </li>
          <li>
            <strong>Brute force:</strong> hash every possible password until you find a match. Modern GPUs can do
            billions of SHA-256 hashes per second. Defense: use a slow algorithm like Argon2 that takes ~100ms per
            hash, making brute force 1,000,000× slower.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common confusion: tokens, secrets, and signatures</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>API keys:</strong> these are secrets, not encryption keys. They prove identity. Don&apos;t hash
            them on the server side and reject anything that doesn&apos;t match — instead store them hashed and
            compare hashes (like passwords).
          </li>
          <li>
            <strong>JWTs:</strong> the &ldquo;signature&rdquo; in a JWT is a HMAC (a kind of keyed hash) — not encryption.
            JWT contents are visible to anyone who has the token.
          </li>
          <li>
            <strong>HMAC:</strong> hash with a secret key. Used to verify integrity AND authenticity (only someone with
            the key could have produced this hash).
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">A simple test</h2>
        <p>
          Whenever you hear &ldquo;encrypted&rdquo; about a stored value, ask: <strong>can the system recover the
          original?</strong> If yes, it&apos;s encrypted. If no, it&apos;s hashed. Most password databases should
          answer &ldquo;no&rdquo; — if a system can email you your forgotten password, that&apos;s a red flag.
        </p>
      </div>
    ),
};
