import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';

interface BlogArticle {
  title: string;
  description: string;
  publishedDate: string;
  readTime: string;
  keywords: string;
  relatedTools: Array<{ name: string; href: string }>;
  content: JSX.Element;
}

const articles: Record<string, BlogArticle> = {
  'url-encoding-explained': {
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
  },

  'json-essentials': {
    title: 'JSON Essentials for Developers: Beyond Pretty-Printing',
    description:
      'Schemas, validation, common pitfalls, and the parser quirks every developer should know about JSON.',
    publishedDate: '2026-05-07',
    readTime: '9 min read',
    keywords: 'json, json schema, json validation, json parser, json pitfalls',
    relatedTools: [
      { name: 'JSON Viewer & Formatter', href: '/tools/json-viewer' },
      { name: 'Regex Tester', href: '/tools/regex-tester' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          JSON looks deceptively simple. Six data types, two structural constructs, no comments. But the moment you
          go beyond hello-world, you bump into edge cases that have been confusing developers for two decades.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">A 30-second refresher</h2>
        <p>
          JSON (JavaScript Object Notation) is a text format for structured data. It supports six types:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>String:</strong> double-quoted, with escapes for control characters and unicode</li>
          <li><strong>Number:</strong> integer or float, no leading zeros, no <code>NaN</code> or <code>Infinity</code></li>
          <li><strong>Boolean:</strong> <code>true</code> or <code>false</code></li>
          <li><strong>Null:</strong> <code>null</code></li>
          <li><strong>Array:</strong> ordered list, comma-separated</li>
          <li><strong>Object:</strong> string-keyed map, comma-separated</li>
        </ul>
        <p>
          That&apos;s it. No dates, no binary, no UUIDs as a native type — those are all encoded as strings or numbers
          by convention.
        </p>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Test JSON instantly:</strong> Paste any payload and see structure, errors, and stats:
          </p>
          <Link
            href="/tools/json-viewer"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open JSON Viewer →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common pitfalls</h2>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">1. No trailing commas</h3>
        <p>
          JavaScript allows trailing commas in objects and arrays. JSON does not.
          <code>{`{"a": 1, "b": 2,}`}</code> is invalid JSON — most parsers will error on the trailing comma.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">2. Keys must be double-quoted strings</h3>
        <p>
          <code>{`{name: "Ada"}`}</code> is JavaScript, not JSON. Valid JSON requires{' '}
          <code>{`{"name": "Ada"}`}</code>. Single quotes are also forbidden — only double quotes.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">3. No comments</h3>
        <p>
          Standard JSON has no comments. If you need them, you&apos;re not using JSON — you&apos;re using JSON5,
          JSONC, or YAML. Many config files use these JSON-with-comments variants, but a strict <code>JSON.parse</code>{' '}
          will reject them.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">4. Numbers have surprises</h3>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>No <code>NaN</code>, <code>Infinity</code>, or <code>-Infinity</code> — these are not valid JSON.</li>
          <li>JavaScript parses all numbers as 64-bit floats, so integers larger than 2^53 lose precision.</li>
          <li>If you need bigger integers (big database IDs), encode them as strings.</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">5. Dates are strings</h3>
        <p>
          JSON has no native date type. Convention is to use ISO 8601 strings (<code>2026-05-07T08:30:00Z</code>).
          When parsing, you&apos;ll need to convert strings back to <code>Date</code> objects manually.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Schemas: validating shape</h2>
        <p>
          For any non-trivial JSON exchange, you should validate the structure. The de-facto standard is{' '}
          <strong>JSON Schema</strong> — a vocabulary for declaring expected shapes:
        </p>

        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <pre className="text-sm font-mono overflow-x-auto">{`{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 },
    "email": { "type": "string", "format": "email" }
  }
}`}</pre>
        </div>

        <p>
          Libraries like Ajv (Node.js), jsonschema (Python), and json-schema (Java) validate any JSON value against a
          schema and produce detailed error reports. For TypeScript, libraries like Zod and io-ts give you both
          runtime validation and static types from a single declaration.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Streaming and large payloads</h2>
        <p>
          <code>JSON.parse</code> reads the entire string into memory. For very large payloads, this is a problem.
          Streaming parsers like <code>jsonstream</code> (Node.js) or <code>ijson</code> (Python) emit events as
          they walk the input, letting you process gigabyte-sized files without exhausting memory.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">JSON alternatives worth knowing</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>JSON5:</strong> JSON with comments, trailing commas, unquoted keys. Used in config files (Babel, ESLint).</li>
          <li><strong>YAML:</strong> human-friendly format with comments, multi-line strings, anchors. Used in DevOps (Kubernetes, GitHub Actions).</li>
          <li><strong>TOML:</strong> minimal config-file format used by Rust&apos;s Cargo and Python&apos;s pyproject.toml.</li>
          <li><strong>MessagePack / CBOR:</strong> binary formats with the same data model as JSON, but smaller and faster.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Pretty-print etiquette</h2>
        <p>
          Two-space indent is the de facto standard for JSON files in version control. Four spaces is acceptable but
          uses more disk and bandwidth. Minified JSON (no whitespace) is appropriate for HTTP responses where size
          matters.
        </p>
        <p>
          Object key order matters for some use cases (deterministic diffs, content addressing). Most parsers preserve
          insertion order, but the JSON spec doesn&apos;t require it. If you need stable order, sort keys explicitly
          before serializing.
        </p>
      </div>
    ),
  },

  'regex-cheatsheet': {
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
  },

  'base64-and-data-urls': {
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
  },

  'hashing-vs-encryption': {
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
  },

  'color-theory-for-developers': {
    title: 'Color Theory for Developers: HEX, RGB, HSL, and WCAG Contrast',
    description:
      'Everything a developer needs to know about color models — and why HSL changes how you think about palettes.',
    publishedDate: '2026-05-07',
    readTime: '9 min read',
    keywords: 'color theory, hex, rgb, hsl, wcag contrast, color palette, accessibility',
    relatedTools: [
      { name: 'Color Converter', href: '/tools/color-converter' },
      { name: 'Lorem Ipsum Generator', href: '/tools/lorem-ipsum' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Most developers know HEX. They might know RGB. Few really use HSL — and that&apos;s a missed opportunity.
          HSL is the color model that maps how humans actually think about color, and once you switch to it, building
          palettes and theming UI becomes dramatically easier.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The four color models, in plain English</h2>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">HEX (#10b981)</h3>
        <p>
          Six hex digits representing red, green, and blue intensities (0–255 each). Compact, but completely opaque to
          humans. Want a slightly lighter version of <code>#10b981</code>? You&apos;d have to do math in your head.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">RGB (16, 185, 129)</h3>
        <p>
          Same data as HEX, just in decimal. Three values, 0–255 each, for red, green, and blue light intensity. Add
          alpha for transparency: <code>rgba(16, 185, 129, 0.5)</code>.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">HSL (160, 84%, 39%)</h3>
        <p>
          Three values: <strong>hue</strong> (0–360°, the &ldquo;color&rdquo; itself), <strong>saturation</strong>{' '}
          (0–100%, how vibrant), <strong>lightness</strong> (0–100%, how light or dark). Want a lighter version?
          Increase the lightness. Want it more muted? Drop the saturation. The model maps to how humans naturally
          describe colors.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">CMYK (Cyan, Magenta, Yellow, Key/Black)</h3>
        <p>
          The print world&apos;s native color space. Used by printers — RGB doesn&apos;t translate directly because
          screens emit light (additive) while printers absorb light (subtractive). Bright neon colors that look great
          on screen often flatten significantly in print.
        </p>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Try the converter:</strong> Type a color in any format and see all of them at once.
          </p>
          <Link
            href="/tools/color-converter"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open Color Converter →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Why HSL changes how you build palettes</h2>
        <p>
          A common need: starting from a brand color, generate a full set of tints and shades. In HEX or RGB, this
          requires real conversion math. In HSL, you just adjust the lightness:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="font-mono text-sm">
            Brand:    hsl(160, 84%, 39%)<br />
            Lighter: hsl(160, 84%, 50%)<br />
            Darker:   hsl(160, 84%, 28%)<br />
            Faded:    hsl(160, 30%, 39%)
          </p>
        </div>
        <p>
          This is exactly what design systems like Tailwind&apos;s color palette do under the hood. Each color has 11
          shades (50, 100, …, 950), and the differences are mostly lightness adjustments at the same hue.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">WCAG contrast: the accessibility standard</h2>
        <p>
          Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios between text and background:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>AA</strong> (legal minimum in many jurisdictions): 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt bold).</li>
          <li><strong>AAA</strong> (best practice): 7:1 for normal text, 4.5:1 for large text.</li>
        </ul>
        <p>
          These ratios are calculated using the relative luminance of the two colors — a perceptual measure of
          brightness that accounts for the human eye&apos;s sensitivity to green vs blue.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Common color mistakes</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>
            <strong>Light gray on white:</strong> looks elegant in design mockups, fails WCAG. <code>#aaa</code>{' '}
            on <code>#fff</code> has a contrast ratio of 2.85:1.
          </li>
          <li>
            <strong>Pure black on pure white:</strong> 21:1 contrast feels harsh; many designers prefer a slight
            softening (<code>#1a1a1a</code> on <code>#fafafa</code> is still well over 7:1).
          </li>
          <li>
            <strong>Color-only signals:</strong> green = good, red = bad — a problem for the ~5% of users with red-green
            colorblindness. Always pair color with an icon, label, or pattern.
          </li>
          <li>
            <strong>Mid-tone backgrounds:</strong> a brand background that&apos;s neither very light nor very dark forces
            text into a contrast trap. Stick to backgrounds at the lightness extremes.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Practical tips</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Pick brand colors in HSL.</strong> Your designer can describe them naturally; you can extend them mathematically.</li>
          <li><strong>Always test contrast at design time,</strong> not after launch when retrofitting accessibility is expensive.</li>
          <li><strong>Use CSS custom properties</strong> for theme colors. Switching to dark mode becomes a matter of swapping a handful of variables.</li>
          <li><strong>Don&apos;t forget hover and focus states</strong> — they often have weaker contrast than the resting state.</li>
        </ul>
      </div>
    ),
  },

  'uuid-v4-vs-v7': {
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
  },

  'naming-conventions-guide': {
    title: 'Naming Conventions: camelCase, snake_case, kebab-case Explained',
    description:
      'A practical guide to the casing conventions used across programming languages, frameworks, and platforms.',
    publishedDate: '2026-05-07',
    readTime: '6 min read',
    keywords: 'naming conventions, camelCase, snake_case, kebab-case, PascalCase, code style',
    relatedTools: [
      { name: 'Case Converter', href: '/tools/case-converter' },
      { name: 'Word Counter', href: '/tools/word-counter' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Programming has surprisingly many ways to write a multi-word name. Most communities have settled on
          conventions, and following them isn&apos;t pedantry — it&apos;s a courtesy that lets the next developer
          read your code without friction.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The casing zoo</h2>
        <ul className="list-none space-y-3 my-4">
          <li><strong>camelCase</strong> — first word lowercase, subsequent words capitalized. <em>userProfile</em></li>
          <li><strong>PascalCase</strong> — every word capitalized. <em>UserProfile</em></li>
          <li><strong>snake_case</strong> — lowercase, words joined by underscores. <em>user_profile</em></li>
          <li><strong>SCREAMING_SNAKE_CASE</strong> — uppercase snake_case. <em>USER_PROFILE</em></li>
          <li><strong>kebab-case</strong> — lowercase, words joined by hyphens. <em>user-profile</em></li>
          <li><strong>Train-Case</strong> — capitalized words joined by hyphens. <em>User-Profile</em></li>
          <li><strong>dot.case</strong> — lowercase, words joined by dots. <em>user.profile</em></li>
        </ul>

        <div className="my-8 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Convert any name:</strong> Paste in one case, get every variation instantly.
          </p>
          <Link
            href="/tools/case-converter"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Open Case Converter →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Conventions by language</h2>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left py-2">Language</th><th className="text-left py-2">Variables</th><th className="text-left py-2">Functions</th><th className="text-left py-2">Classes/Types</th><th className="text-left py-2">Constants</th></tr></thead>
            <tbody>
              <tr><td className="py-2 font-semibold">JavaScript / TypeScript</td><td>camelCase</td><td>camelCase</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">Python</td><td>snake_case</td><td>snake_case</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">Java</td><td>camelCase</td><td>camelCase</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">Go</td><td>camelCase / PascalCase*</td><td>camelCase / PascalCase*</td><td>PascalCase</td><td>PascalCase</td></tr>
              <tr><td className="py-2 font-semibold">Rust</td><td>snake_case</td><td>snake_case</td><td>PascalCase</td><td>SCREAMING_SNAKE</td></tr>
              <tr><td className="py-2 font-semibold">C#</td><td>camelCase</td><td>PascalCase</td><td>PascalCase</td><td>PascalCase</td></tr>
              <tr><td className="py-2 font-semibold">SQL</td><td>snake_case</td><td>—</td><td>—</td><td>—</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">* In Go, capitalization controls visibility: PascalCase is exported, camelCase is private to the package.</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Conventions by context</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>URLs:</strong> kebab-case (<code>/user-profile</code>) — readable, no encoding needed.</li>
          <li><strong>CSS class names:</strong> kebab-case (<code>.user-profile</code>) — matches CSS naming tradition.</li>
          <li><strong>HTML attributes:</strong> kebab-case (<code>data-user-id</code>) — required by spec for custom data attributes.</li>
          <li><strong>HTTP headers:</strong> Train-Case (<code>Content-Type</code>) — case-insensitive but conventionally Train-Case.</li>
          <li><strong>Environment variables:</strong> SCREAMING_SNAKE (<code>DATABASE_URL</code>) — universal Unix convention.</li>
          <li><strong>JSON keys:</strong> usually camelCase (matches JavaScript) or snake_case (matches Python).</li>
          <li><strong>File names:</strong> kebab-case (<code>user-profile.tsx</code>) is most common in JS/TS; snake_case in Python/Ruby; PascalCase for class files in Java/C#.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">JSON: the cross-cultural minefield</h2>
        <p>
          JSON traveled between every language ecosystem, so naming conventions vary. Common practices:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>JavaScript/Node APIs:</strong> camelCase (<code>{`{"firstName": "Ada"}`}</code>)</li>
          <li><strong>Python/Ruby APIs:</strong> snake_case (<code>{`{"first_name": "Ada"}`}</code>)</li>
          <li><strong>Public APIs serving multiple languages:</strong> often snake_case for clarity</li>
        </ul>
        <p>
          When consuming third-party APIs, accept their convention; don&apos;t force your local style. Use mapping
          libraries (Jackson, Gson, attrs) to translate between JSON keys and your in-language field names.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Practical tips</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Follow the convention of the existing codebase</strong> over personal preference.</li>
          <li><strong>Use auto-formatters</strong> (Prettier, Black, gofmt) — they don&apos;t change names but enforce a clean baseline.</li>
          <li><strong>Use linters</strong> like ESLint and pylint to catch convention violations.</li>
          <li><strong>Don&apos;t rename across the codebase</strong> just because you prefer a different convention. Pick your battles.</li>
        </ul>
      </div>
    ),
  },
};

export default function ToolsLearnArticle() {
  const router = useRouter();
  const slug = router.query.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <>
        <Head>
          <title>Article Not Found | Toolisk</title>
        </Head>
        <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Article not found</h1>
            <p className="text-slate-500 mb-4">We could not find the article you&apos;re looking for.</p>
            <Link href="/tools/learn" className="text-emerald-600 font-semibold hover:underline">
              ← Browse all guides
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} | Toolisk</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.keywords} />
        <link rel="canonical" href={`https://toolisk.com/tools/learn/${slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={`https://toolisk.com/tools/learn/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.publishedDate} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/40 py-12">
        <article className="max-w-4xl mx-auto px-4">
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>→</span>
            <Link href="/tools" className="hover:text-emerald-600 transition-colors">Tools</Link>
            <span>→</span>
            <Link href="/tools/learn" className="hover:text-emerald-600 transition-colors">Learn</Link>
          </nav>

          <header className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{article.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <time>
                {new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 mb-8 border border-gray-100">
            {article.content}
          </div>

          <aside className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-3xl">🛠️</span>
              Try the related tools
            </h3>
            <p className="text-gray-600 mb-6">
              Put these concepts into practice with our free, browser-based utilities:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.relatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between bg-white rounded-xl px-5 py-4 hover:shadow-md transition-all group border border-emerald-100"
                >
                  <span className="font-semibold text-gray-900">{tool.name}</span>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </aside>
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(articles).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  if (!articles[slug]) return { notFound: true };
  return { props: { slug } };
};
