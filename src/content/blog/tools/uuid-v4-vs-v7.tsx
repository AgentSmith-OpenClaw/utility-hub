import Link from 'next/link';
import type { BlogArticle } from '../types';

export const uuidV4VsV7: BlogArticle = {
  slug: 'uuid-v4-vs-v7',
  category: 'Developer',
    title: 'UUID v4 vs UUID v7: Choosing the Right Identifier',
    description:
      'Why time-ordered UUIDs are quietly replacing v4 for database primary keys — and when v4 is still the right choice.',
    publishedDate: '2026-05-07',
    readTime: '7 min read',
    keywords: 'uuid v4, uuid v7, time-ordered uuid, database primary key, identifier',
    relatedTools: [
      { name: 'UUID Generator', href: '/tools/uuid-generator' },
      { name: 'Timestamp Converter', href: '/tools/timestamp-converter' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          For two decades, UUID v4 was the default. Now UUID v7 is quietly replacing it for database primary keys —
          and there&apos;s a good reason. If you&apos;re still reaching for v4 by reflex, it&apos;s worth understanding
          when the newer version is the better choice.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">A quick UUID refresher</h2>
        <p>
          A UUID (Universally Unique Identifier) is a 128-bit value designed to be unique across space and time without
          coordination. The defining feature: any machine can generate one, right now, and it&apos;ll still be unique.
        </p>
        <p>
          UUIDs are usually displayed as 32 hex digits in five groups separated by dashes:{' '}
          <code>xxxxxxxx-xxxx-Vxxx-Vxxx-xxxxxxxxxxxx</code>. The position of the version digit (V) tells you which
          UUID variant created it.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">UUID v4: random</h2>
        <p>
          UUID v4 is 122 bits of randomness (with 6 bits reserved for version and variant). The chance of collision is
          astronomically small — you&apos;d need to generate billions per second for many years before you&apos;d
          expect to see a duplicate.
        </p>
        <p>
          v4 is great for: session tokens, API keys, public-facing IDs where unpredictability matters, anywhere the
          ID will be displayed or shared and you don&apos;t want users to guess neighboring values.
        </p>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Generate UUIDs:</strong> Get v4 or v7 IDs in bulk for testing or seeding databases.
          </p>
          <Link
            href="/tools/uuid-generator"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open UUID Generator →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">UUID v7: time-ordered</h2>
        <p>
          UUID v7 starts with a 48-bit Unix timestamp in milliseconds, followed by random bits. The first part of the
          UUID encodes when it was created — so identifiers naturally sort by creation time.
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">
            UUID v7: 0192e95b-3a48-7000-8a39-1f5c3b2e9d10<br />
            ↑↑↑↑↑↑↑↑↑↑↑<br />
            48-bit timestamp (ms)
          </p>
        </div>
        <p>
          Two UUIDs generated even a millisecond apart will sort in the order they were created. This is enormously
          useful for database primary keys.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why v7 is better for database keys</h2>
        <p>
          Most databases use B-tree indexes for primary keys. B-trees stay balanced and fast when new keys are
          inserted at the end (or in approximate order). Random UUID v4 inserts cause:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Index fragmentation:</strong> new keys land in random positions, splitting pages constantly.</li>
          <li><strong>Cache thrashing:</strong> recently-inserted rows aren&apos;t adjacent in the index, so the page cache misses more often.</li>
          <li><strong>Slower bulk inserts:</strong> each insert is essentially a random write to disk.</li>
        </ul>
        <p>
          UUID v7 fixes all of this. Inserts go to the end of the index. Adjacent rows in time are adjacent in the
          index. Bulk inserts are sequential writes. In benchmarks, this translates to 2–10× faster write throughput
          on large tables.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When to stick with v4</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Security-sensitive identifiers:</strong> session tokens, password reset tokens, API keys. v7&apos;s
            timestamp prefix makes IDs partially predictable, which is a non-issue for primary keys but problematic for
            secrets.
          </li>
          <li>
            <strong>Public IDs you don&apos;t want to leak creation time:</strong> if knowing when a record was created
            is sensitive (say, billing records), use v4.
          </li>
          <li>
            <strong>Maximum entropy needs:</strong> v4 has 122 bits of randomness; v7 has only 74 bits in the random
            portion. Both are way more than enough for uniqueness, but v4 is the right answer for cryptographic uses.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">UUID vs auto-incrementing integer</h2>
        <p>
          Auto-incrementing integers are smaller (4 or 8 bytes vs UUIDs&apos; 16) and faster. Use them when:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>You have a single source of truth — no need for cross-system uniqueness.</li>
          <li>You don&apos;t mind exposing &ldquo;there are 47,000 users&rdquo; via sequential IDs.</li>
          <li>Storage and index size matter — UUIDs are 4× larger than 32-bit ints.</li>
        </ul>
        <p>
          Use UUIDs (v7 for keys, v4 for tokens) when:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>You generate IDs across multiple services or databases without coordination.</li>
          <li>You don&apos;t want to leak record counts.</li>
          <li>You need to merge data from different systems without ID conflicts.</li>
        </ul>
      </div>
    ),
};
