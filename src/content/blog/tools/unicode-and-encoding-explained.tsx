import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const unicodeAndEncodingExplained: BlogArticle = {
  slug: 'unicode-and-encoding-explained',
  category: 'Developer',
  title: 'Unicode, UTF-8, and Why "String Length" Lies to You',
  description:
    'Codepoints, code units, grapheme clusters, surrogate pairs. Learn why JavaScript says "👨‍👩‍👧".length is 8, why emoji break your form validation, and how to actually count characters correctly.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'unicode, utf-8, utf-16, character encoding, emoji, grapheme cluster, codepoint, javascript string',
  relatedTools: [
    { name: 'URL Encoder', href: '/tools/url-encoder' },
    { name: 'Word Counter', href: '/tools/word-counter' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Strings look simple until you encounter an emoji, a non-Latin script, or international names.
        "Length" isn't one number — it can be three different things depending on what you mean.
        Truncating a tweet, validating a username, or pricing per-character SMS all hit Unicode complexity that
        most code is blind to.
      </Lead>

      <H2>The layered model</H2>
      <p>
        Unicode separates several concepts that pre-Unicode encodings conflated:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Character / Codepoint:</strong> a unique number assigned to each character. "A" is U+0041. "😀" is U+1F600. There are about 150,000 codepoints assigned in Unicode 16.</li>
        <li><strong>Encoding:</strong> how those numbers are turned into bytes. UTF-8, UTF-16, UTF-32 are all valid encodings of the same Unicode codepoints.</li>
        <li><strong>Code unit:</strong> the fixed-size chunks an encoding splits into. UTF-8 uses 8-bit units; UTF-16 uses 16-bit units.</li>
        <li><strong>Grapheme cluster:</strong> a single user-perceived "character". May span multiple codepoints. "👨‍👩‍👧" is one grapheme cluster but 5 codepoints.</li>
      </ul>

      <H2>UTF-8: variable-width 8-bit encoding</H2>
      <p>
        UTF-8 encodes each codepoint in 1–4 bytes:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>U+0000–U+007F (ASCII): 1 byte. Backwards-compatible with ASCII.</li>
        <li>U+0080–U+07FF: 2 bytes (Latin Extended, Greek, Cyrillic, Hebrew, Arabic).</li>
        <li>U+0800–U+FFFF: 3 bytes (most Asian scripts, common symbols).</li>
        <li>U+10000–U+10FFFF: 4 bytes (rare scripts, emoji).</li>
      </ul>
      <p>
        UTF-8 is the dominant web encoding (98%+ of websites). Use it everywhere unless you have a strong reason
        not to.
      </p>

      <H2>UTF-16: the JavaScript trap</H2>
      <p>
        JavaScript strings are sequences of UTF-16 code units. For codepoints above U+FFFF (most emoji), UTF-16
        uses two 16-bit code units called a "surrogate pair."
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`'A'.length      // 1 (one code unit)
'é'.length      // 1 (single code unit)
'中'.length     // 1 (single code unit)
'😀'.length     // 2 (surrogate pair: D83D DE00)
'👨‍👩‍👧'.length    // 8 (emoji + ZWJ + emoji + ZWJ + emoji)`}</code></pre>

      <p>
        The string "😀" is one character to humans, one codepoint, but two UTF-16 code units. JavaScript
        reports length as 2.
      </p>

      <Callout title="Why this is a security and UX issue" accent="amber">
        Server-side validation truncating usernames at 30 "characters" via JavaScript string length
        actually limits emoji users to 15 visible characters. Worse, splitting a string at code-unit boundaries
        can produce invalid surrogate pairs — broken text. Validation, truncation, and indexing all need
        Unicode-aware handling.
      </Callout>

      <H2>Iterating correctly</H2>
      <p>
        For codepoints, use the spread operator or for-of:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`[...'😀'].length         // 1 (codepoints)
Array.from('😀').length  // 1
'😀'.length              // 2 (UTF-16 code units — wrong)

for (const ch of '😀a') {
  console.log(ch); // '😀', then 'a'
}`}</code></pre>

      <p>
        For grapheme clusters (the user-perceived "character"), use <code>Intl.Segmenter</code>:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
const segments = [...seg.segment('👨‍👩‍👧 hi')];
console.log(segments.length); // 4 (family emoji + space + h + i)`}</code></pre>

      <p>
        <code>Intl.Segmenter</code> is the modern, correct way. Older browsers may need polyfills.
      </p>

      <H2>Normalization: the "same-but-different" problem</H2>
      <p>
        Unicode allows multiple ways to represent the same visual character:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>"é" can be U+00E9 (single precomposed character)...</li>
        <li>... or U+0065 + U+0301 (e + combining acute accent).</li>
      </ul>
      <p>
        These look identical but are not equal as strings:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`'é'.length             // 1
'é'.length       // 2
'é' === 'é' // false`}</code></pre>

      <p>
        For comparison, normalize first:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`'é'.normalize() === 'é'.normalize()  // true`}</code></pre>

      <p>
        Four normalization forms:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>NFC (Canonical Composition):</strong> default for most use. Compresses where possible.</li>
        <li><strong>NFD (Canonical Decomposition):</strong> expands. Useful for diacritic-insensitive search.</li>
        <li><strong>NFKC / NFKD:</strong> "compatibility" forms. Treats "ﬁ" (ligature) as "fi". Use when comparing text for search; avoid for storage.</li>
      </ul>

      <H2>Common emojis as multi-codepoint sequences</H2>
      <p>
        Modern emojis often combine multiple codepoints with Zero-Width Joiners (ZWJ, U+200D):
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>👨‍👩‍👧:</strong> 👨 + ZWJ + 👩 + ZWJ + 👧 = 5 codepoints, 1 grapheme.</li>
        <li><strong>👍🏽:</strong> 👍 + skin tone modifier = 2 codepoints, 1 grapheme.</li>
        <li><strong>🇺🇸:</strong> Regional Indicator U + Regional Indicator S = 2 codepoints, 1 grapheme.</li>
      </ul>
      <p>
        Display as one icon if the platform supports the combination; otherwise as separate components. Always
        test with target platforms — Slack, Twitter, iOS, Android, Windows all render some sequences differently.
      </p>

      <H2>Bytes vs characters</H2>
      <p>
        For storage limits, byte count is what matters:
      </p>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-6 text-sm overflow-x-auto"><code>{`new TextEncoder().encode('A').length     // 1 byte
new TextEncoder().encode('é').length     // 2 bytes (U+00E9)
new TextEncoder().encode('中').length    // 3 bytes
new TextEncoder().encode('😀').length    // 4 bytes`}</code></pre>

      <p>
        SMS pricing, MySQL VARCHAR limits, and storage validation all care about bytes. UTF-8 makes this 1–4×
        the codepoint count.
      </p>

      <H2>Database considerations</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>MySQL <code>utf8</code> is broken.</strong> It only supports up to 3 bytes per character — no emoji. Always use <code>utf8mb4</code>.</li>
        <li><strong>PostgreSQL is full UTF-8 by default.</strong> No special configuration needed.</li>
        <li><strong>VARCHAR(255) means different things.</strong> Some databases count characters; others count bytes. Check yours.</li>
        <li><strong>Collation affects sorting and comparison.</strong> Choose case-insensitive or case-sensitive deliberately.</li>
      </ul>

      <H2>Common bugs</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Truncating at code-unit boundaries.</strong> Splits surrogate pairs, produces invalid strings.</li>
        <li><strong>Counting JavaScript .length as "characters."</strong> Wrong for any non-BMP character.</li>
        <li><strong>Form validation by length.</strong> A user with an emoji name fails validation that ASCII-only users don't.</li>
        <li><strong>Displaying byte length as character count.</strong> Says "3 characters" for an emoji.</li>
        <li><strong>Comparing without normalization.</strong> User logs in with one form, system stores another, login fails.</li>
        <li><strong>UTF-8 BOM in JSON files.</strong> Some tools choke. Strip it server-side.</li>
      </ul>

      <H2>Testing checklist</H2>
      <p>
        For any feature handling user-provided text, test with:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Plain ASCII (baseline)</li>
        <li>Latin with diacritics (é, ñ, ö)</li>
        <li>Non-Latin scripts (中, 日, ع, हिन्दी)</li>
        <li>Single-codepoint emoji (😀)</li>
        <li>Multi-codepoint emoji (👨‍👩‍👧, 👍🏽, 🇺🇸)</li>
        <li>Right-to-left text (Arabic, Hebrew)</li>
        <li>Combining marks (e + ́ = é, but as two codepoints)</li>
      </ul>

      <KeyTakeaways
        items={[
          'Unicode separates codepoints (the abstract characters) from encodings (UTF-8/16/32 byte representations).',
          'JavaScript .length counts UTF-16 code units. Emoji often need 2 code units — "😀".length is 2.',
          'Use spread or for-of to iterate codepoints; Intl.Segmenter for grapheme clusters (user-visible characters).',
          'Normalize strings before comparison. NFC for storage and equality; NFKC for search.',
          'Test with emoji, non-Latin scripts, and combining marks. ASCII-only testing hides Unicode bugs.',
        ]}
      />
    </div>
  ),
};
