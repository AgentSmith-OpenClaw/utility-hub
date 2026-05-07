import Link from 'next/link';
import type { BlogArticle } from '../types';

export const regexCheatsheet: BlogArticle = {
  slug: 'regex-cheatsheet',
  category: 'Developer',
    title: 'Regex Cheatsheet & Common Patterns: Email, URL, Phone Validation',
    description:
      'Practical regex patterns for everyday validation tasks — and the tricky edge cases that catch most developers.',
    publishedDate: '2026-05-07',
    readTime: '11 min read',
    keywords: 'regex cheatsheet, email regex, url regex, phone regex, regex patterns',
    relatedTools: [
      { name: 'Regex Tester', href: '/tools/regex-tester' },
      { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Regex is one of those tools where 80% of what you need fits on a single page. The other 20% is a thicket of
          edge cases, language-specific quirks, and patterns that look right but quietly miss valid inputs. This guide
          gives you the 80% — and warns about the 20%.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The metacharacter quick-reference</h2>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left py-2">Symbol</th><th className="text-left py-2">Meaning</th></tr>
            </thead>
            <tbody className="font-mono">
              <tr><td className="py-1">.</td><td className="font-sans">Any character (except newline)</td></tr>
              <tr><td className="py-1">^</td><td className="font-sans">Start of string (or line, with /m)</td></tr>
              <tr><td className="py-1">$</td><td className="font-sans">End of string (or line, with /m)</td></tr>
              <tr><td className="py-1">\d \D</td><td className="font-sans">Digit / non-digit</td></tr>
              <tr><td className="py-1">\w \W</td><td className="font-sans">Word char [A-Za-z0-9_] / non-word</td></tr>
              <tr><td className="py-1">\s \S</td><td className="font-sans">Whitespace / non-whitespace</td></tr>
              <tr><td className="py-1">*</td><td className="font-sans">0 or more (greedy)</td></tr>
              <tr><td className="py-1">+</td><td className="font-sans">1 or more (greedy)</td></tr>
              <tr><td className="py-1">?</td><td className="font-sans">0 or 1, or non-greedy modifier</td></tr>
              <tr><td className="py-1">{'{n,m}'}</td><td className="font-sans">Between n and m times</td></tr>
              <tr><td className="py-1">[abc]</td><td className="font-sans">Any of a, b, c</td></tr>
              <tr><td className="py-1">[^abc]</td><td className="font-sans">None of a, b, c</td></tr>
              <tr><td className="py-1">(...)</td><td className="font-sans">Capturing group</td></tr>
              <tr><td className="py-1">{'(?<name>...)'}</td><td className="font-sans">Named group</td></tr>
              <tr><td className="py-1">|</td><td className="font-sans">Alternation</td></tr>
            </tbody>
          </table>
        </div>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Test patterns live:</strong> Paste a regex and see matches highlight on your text.
          </p>
          <Link
            href="/tools/regex-tester"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open Regex Tester →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pattern: Email validation</h2>
        <p>
          The classic question. The answer most developers give is wrong, but practical:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{'}2,{'}'}$</p>
        </div>
        <p>
          This matches the structure most people expect: some-name@some-domain.tld. It will reject <code>foo@bar</code>{' '}
          (no TLD) and <code>foo@bar.c</code> (TLD too short). It will accept many edge cases that are valid per RFC
          5322 but rare in practice (quoted local parts, IP-literal domains).
        </p>
        <p>
          The strict RFC 5322 regex is over 6,000 characters long. <strong>Don&apos;t use it.</strong> Instead, accept
          a permissive pattern at validation time, then verify the address by sending an email. That&apos;s the only
          way to know it really works.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pattern: URL detection</h2>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">https?:\/\/[\w.-]+(?:\/[\w\-./?%&amp;=]*)?</p>
        </div>
        <p>
          For <em>finding</em> URLs in text (e.g. auto-linking), this is plenty. For validating that a string is a
          well-formed URL, use the <code>URL</code> constructor in JavaScript: <code>{`new URL(input)`}</code>{' '}
          throws if the input isn&apos;t a valid URL.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pattern: Phone numbers</h2>
        <p>
          Phone formats vary wildly by country. For US numbers in common formats:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">^\(?\d{'{3}'}\)?[-.\s]?\d{'{3}'}[-.\s]?\d{'{4}'}$</p>
        </div>
        <p>
          For international numbers, don&apos;t use regex. Use Google&apos;s libphonenumber library — it knows the
          rules for every country and is constantly updated as numbering plans change.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pattern: IPv4 addresses</h2>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){'{'}3{'}'}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$</p>
        </div>
        <p>
          This is the strict version that rejects values like 999.999.999.999. The simpler{' '}
          <code>(?:\d{'{1,3}'}\.){'{3}'}\d{'{1,3}'}</code> matches the structure but accepts invalid octets.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Greedy vs lazy quantifiers</h2>
        <p>
          By default, <code>*</code> and <code>+</code> are <em>greedy</em> — they match as much as possible.
          Adding <code>?</code> after them (<code>*?</code>, <code>+?</code>) makes them <em>lazy</em> — match
          as little as possible.
        </p>
        <p>
          Classic example: extracting the content of an HTML tag.
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">
            Input: &lt;b&gt;hello&lt;/b&gt; world &lt;b&gt;again&lt;/b&gt;<br />
            Greedy <code>&lt;b&gt;.*&lt;/b&gt;</code>: matches everything from first &lt;b&gt; to last &lt;/b&gt;<br />
            Lazy <code>&lt;b&gt;.*?&lt;/b&gt;</code>: matches each &lt;b&gt;…&lt;/b&gt; pair separately
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Lookarounds</h2>
        <p>
          Lookaheads and lookbehinds let you assert what comes before or after a match without including it in the match.
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><code>foo(?=bar)</code> — &ldquo;foo&rdquo; only if followed by &ldquo;bar&rdquo;</li>
          <li><code>foo(?!bar)</code> — &ldquo;foo&rdquo; only if NOT followed by &ldquo;bar&rdquo;</li>
          <li><code>(?&lt;=foo)bar</code> — &ldquo;bar&rdquo; only if preceded by &ldquo;foo&rdquo;</li>
          <li><code>(?&lt;!foo)bar</code> — &ldquo;bar&rdquo; only if NOT preceded by &ldquo;foo&rdquo;</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">When NOT to use regex</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>HTML/XML:</strong> use a real parser (DOMParser, BeautifulSoup, jsdom).</li>
          <li><strong>Strict spec compliance:</strong> for things like RFC-strict email validation, regex is the wrong tool.</li>
          <li><strong>Recursive structures:</strong> JavaScript regex cannot match nested parens reliably. Use a parser.</li>
          <li><strong>Performance-critical paths:</strong> a complex regex can backtrack catastrophically. Test with adversarial input.</li>
        </ul>
      </div>
    ),
};
