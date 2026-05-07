import Link from 'next/link';
import type { BlogArticle } from '../types';

export const urlEncodingExplained: BlogArticle = {
  slug: 'url-encoding-explained',
  category: 'Web',
    title: 'URL Encoding Explained: When and Why Characters Are Percent-Encoded',
    description:
      'Learn why URLs need encoding, how percent-encoding works, and when to use encodeURIComponent vs encodeURI in real applications.',
    publishedDate: '2026-05-07',
    readTime: '7 min read',
    keywords: 'url encoding, percent encoding, encodeURIComponent, encodeURI, url escape',
    relatedTools: [
      { name: 'URL Encoder / Decoder', href: '/tools/url-encoder' },
      { name: 'Base64 Encoder / Decoder', href: '/tools/base64' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          You&apos;ve seen <code>%20</code> in a URL and wondered what it means. You&apos;ve had a URL break in mysterious ways
          when it contained an ampersand. URL encoding is the unsung hero of the web — and the source of countless
          bugs when you misunderstand it.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What is URL encoding?</h2>
        <p>
          URL encoding (officially called <strong>percent encoding</strong>) is a way to represent characters in a URL
          that would otherwise have special meaning, or that aren&apos;t allowed at all. Each unsafe character is
          replaced with a percent sign followed by two hex digits representing its byte value.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="text-center font-mono text-base">
            space → %20  ·  &amp; → %26  ·  ? → %3F  ·  / → %2F  ·  é → %C3%A9
          </p>
        </div>

        <p>
          The result is a URL that contains only ASCII letters, digits, and a small set of punctuation —
          guaranteed to survive transmission through any system that follows the HTTP and URI specs.
        </p>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Try the encoder:</strong> Paste any string and see the encoded form instantly:
          </p>
          <Link
            href="/tools/url-encoder"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open URL Encoder →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why do we need it?</h2>
        <p>
          URLs have a strict grammar. Specific characters separate components:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><code>?</code> separates the path from the query string</li>
          <li><code>&amp;</code> separates query parameters from each other</li>
          <li><code>=</code> separates a parameter name from its value</li>
          <li><code>#</code> introduces the fragment identifier</li>
          <li><code>/</code> separates path segments</li>
        </ul>
        <p>
          If your data contains any of these characters, it must be encoded. Otherwise the URL parser cannot tell
          where one part ends and the next begins.
        </p>
        <p>
          Consider a search query for <code>black &amp; white</code>. Without encoding, the URL{' '}
          <code>?q=black &amp; white&amp;page=1</code> would parse as three parameters: <code>q=black </code>,{' '}
          <code>white</code>, and <code>page=1</code>. With encoding, <code>?q=black%20%26%20white&amp;page=1</code>
          {' '}parses correctly.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">encodeURIComponent vs encodeURI</h2>
        <p>
          JavaScript provides two encoding functions, and the difference matters.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">encodeURIComponent — escapes everything</h3>
        <p>
          Use this when you&apos;re encoding <em>part of</em> a URL — a query string value, a path segment, a fragment.
          It escapes <code>?</code>, <code>&amp;</code>, <code>=</code>, <code>/</code>, and almost everything else
          except letters, digits, and a handful of safe punctuation marks.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">encodeURI — preserves URL structure</h3>
        <p>
          Use this when you have a <em>complete URL</em> that contains spaces or unicode characters, but where the URL
          structure (the slashes, query separators, etc.) should be preserved as-is.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="text-sm font-mono">
            <strong>Input:</strong> <code>https://example.com/search?q=hello world</code>
          </p>
          <p className="text-sm font-mono mt-2">
            <strong>encodeURI:</strong> <code>https://example.com/search?q=hello%20world</code>
          </p>
          <p className="text-sm font-mono mt-2">
            <strong>encodeURIComponent:</strong> <code>https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world</code>
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common pitfalls</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Double encoding:</strong> If you encode something twice (encode the encoded result), you get
            <code>%2520</code> where you wanted <code>%20</code>. Decoding once returns the encoded form, not the
            original. This breaks form submissions and URL handlers in subtle ways.
          </li>
          <li>
            <strong>Plus sign confusion:</strong> In query strings, historically <code>+</code> meant a space (legacy
            from form submissions). Modern <code>encodeURIComponent</code> uses <code>%20</code> for spaces. If you
            need to handle legacy URLs, replace <code>+</code> with space before decoding.
          </li>
          <li>
            <strong>Forgetting unicode:</strong> Non-ASCII characters like é, 中, 🚀 must be encoded as their UTF-8 byte
            sequence — multiple percent-escapes for a single character.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Practical examples</h2>
        <ul className="list-disc pl-6 space-y-3 my-4">
          <li>
            <strong>Search forms:</strong> <code>?q=encodeURIComponent(userInput)</code> — always encode user-provided
            search terms.
          </li>
          <li>
            <strong>OAuth redirects:</strong> <code>redirect_uri=encodeURIComponent(callbackUrl)</code> — the callback
            URL contains <code>?</code> and <code>&amp;</code> that must not collide with the outer URL&apos;s structure.
          </li>
          <li>
            <strong>API path with user IDs:</strong> <code>/users/{`\${encodeURIComponent(id)}`}</code> — protects against
            user IDs containing slashes.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When you can skip it</h2>
        <p>
          For URLs you control entirely (hardcoded paths to your own assets), you don&apos;t need to encode. The risk
          comes when <em>any part of the URL is user-provided or dynamic</em>. In that case, encode the dynamic part
          to be safe.
        </p>
      </div>
    ),
};
