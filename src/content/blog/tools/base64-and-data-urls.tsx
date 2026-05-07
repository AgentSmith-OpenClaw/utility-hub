import Link from 'next/link';
import type { BlogArticle } from '../types';

export const base64AndDataUrls: BlogArticle = {
  slug: 'base64-and-data-urls',
  category: 'Web',
    title: 'Base64 & Data URLs: When to Inline Binary Content',
    description:
      'Why we encode binary data as text, when data URLs help, and when they hurt page performance.',
    publishedDate: '2026-05-07',
    readTime: '8 min read',
    keywords: 'base64, data url, inline image, base64 encoding, data uri',
    relatedTools: [
      { name: 'Base64 Encoder / Decoder', href: '/tools/base64' },
      { name: 'URL Encoder / Decoder', href: '/tools/url-encoder' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Base64 is one of those technologies that&apos;s been around for so long, most developers take it for granted
          without really understanding it. Data URLs build on Base64 to embed entire files into HTML, CSS, and JSON.
          Both are powerful — and both are misused regularly.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why does Base64 exist?</h2>
        <p>
          Many transport channels — email headers (RFC 822), URLs, JSON strings, HTTP Basic auth — only support a
          limited set of printable ASCII characters. But computers store data as bytes (0–255), most of which
          aren&apos;t printable. Base64 bridges the gap by mapping every 3 bytes of binary into 4 characters from a
          64-character alphabet (<code>A-Z a-z 0-9 + /</code>).
        </p>
        <p>
          The output is always ASCII, always safe to paste into emails or JSON, and always reversible. The cost is
          a ~33% size increase — perfectly acceptable for the small payloads where Base64 shines.
        </p>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Try the encoder:</strong>
          </p>
          <Link
            href="/tools/base64"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open Base64 Encoder →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Where Base64 actually appears</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Email attachments:</strong> MIME wraps binary in Base64 for transport.</li>
          <li><strong>HTTP Basic auth:</strong> <code>Authorization: Basic dXNlcjpwYXNz</code> is just <code>user:pass</code> in Base64.</li>
          <li><strong>JSON Web Tokens (JWT):</strong> three Base64-encoded segments separated by dots.</li>
          <li><strong>Data URLs:</strong> embedding images and fonts directly in HTML/CSS.</li>
          <li><strong>Storage in JSON:</strong> binary data (file uploads, images) sent as Base64 strings.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Standard vs URL-safe Base64</h2>
        <p>
          The standard alphabet uses <code>+</code> and <code>/</code> — both have special meaning in URLs.
          URL-safe Base64 swaps them for <code>-</code> and <code>_</code>, and drops the trailing <code>=</code>{' '}
          padding (since some URL grammars don&apos;t allow it).
        </p>
        <p>
          When you see a JWT, the <code>-</code> and <code>_</code> in the encoded segments are URL-safe Base64.
          When you see Base64 in an email, with <code>+</code> and <code>/</code>, that&apos;s standard Base64.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Data URLs: inlining files</h2>
        <p>
          A data URL is a way to embed a file inline, using Base64 (or sometimes percent-encoding for text):
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">data:image/png;base64,iVBORw0KGgo...</p>
        </div>
        <p>
          The browser treats this as if it had downloaded a real file with the given MIME type. You can use data URLs
          as <code>img src</code>, CSS <code>background-image</code>, even <code>iframe src</code>.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">When data URLs help</h3>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Tiny icons (a few hundred bytes) where the cost of a separate HTTP request exceeds the size penalty.</li>
          <li>Generating images dynamically client-side for download or display.</li>
          <li>Email templates where external images would be blocked or stripped.</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">When data URLs hurt</h3>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Large images — the 33% size penalty multiplies, and you lose browser caching.</li>
          <li>Anything that should be reused across pages — separate files cache; inlined files re-download every page.</li>
          <li>Performance-critical pages — large data URLs in CSS block rendering.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common Base64 misuses</h2>
        <ul className="list-disc pl-6 space-y-3 my-4">
          <li>
            <strong>Storing it as &ldquo;encryption&rdquo;:</strong> Base64 is encoding, not encryption. Anyone can
            decode it instantly.
          </li>
          <li>
            <strong>Base64-encoding URLs:</strong> URLs are already ASCII. There&apos;s no reason to Base64-encode them.
            (URL encoding for unsafe characters is different — that&apos;s percent encoding.)
          </li>
          <li>
            <strong>Base64-encoding entire files for upload:</strong> a multipart/form-data request sends binary
            directly with no encoding overhead. Only Base64 if your transport channel demands it.
          </li>
        </ul>
      </div>
    ),
};
