import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';

interface Tool {
  name: string;
  description: string;
  path: string;
  icon: string;
  tags: string[];
  isNew?: boolean;
}

const tools: Tool[] = [
  {
    name: 'URL Encoder / Decoder',
    description:
      'Encode or decode URL components instantly. Handles special characters, query strings, and percent-encoding for safe transmission of URLs.',
    path: '/tools/url-encoder',
    icon: '🔗',
    tags: ['Web', 'Encoding', 'URL'],
    isNew: true,
  },
  {
    name: 'JSON Viewer & Formatter',
    description:
      'Format, validate, minify, and beautify JSON. Tree view with collapsible nodes, syntax highlighting, and copy-to-clipboard support.',
    path: '/tools/json-viewer',
    icon: '🧩',
    tags: ['Developer', 'JSON', 'Formatter'],
    isNew: true,
  },
  {
    name: 'Word Counter',
    description:
      'Count words, characters, sentences, paragraphs, and reading time. Perfect for essays, articles, and SEO optimization with character limits.',
    path: '/tools/word-counter',
    icon: '✍️',
    tags: ['Writing', 'SEO', 'Text'],
    isNew: true,
  },
  {
    name: 'Base64 Encoder / Decoder',
    description:
      'Convert text to Base64 and back. Supports UTF-8 characters, file encoding, and URL-safe Base64 variants for emails and data URLs.',
    path: '/tools/base64',
    icon: '🔐',
    tags: ['Developer', 'Encoding', 'Base64'],
    isNew: true,
  },
  {
    name: 'Color Converter',
    description:
      'Convert colors between HEX, RGB, HSL, and CMYK formats. Live preview, accessibility contrast checking, and palette suggestions.',
    path: '/tools/color-converter',
    icon: '🎨',
    tags: ['Design', 'Color', 'CSS'],
    isNew: true,
  },
  {
    name: 'Hash Generator',
    description:
      'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text. All processing happens in your browser — no data is ever sent to a server.',
    path: '/tools/hash-generator',
    icon: '🔏',
    tags: ['Security', 'Hash', 'Crypto'],
    isNew: true,
  },
  {
    name: 'Lorem Ipsum Generator',
    description:
      'Generate placeholder text for designs and mockups. Choose paragraphs, sentences, or words, with classic Lorem Ipsum or modern alternatives.',
    path: '/tools/lorem-ipsum',
    icon: '📝',
    tags: ['Design', 'Text', 'Placeholder'],
    isNew: true,
  },
  {
    name: 'Case Converter',
    description:
      'Convert text between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, Title Case, and more. Essential for developers and writers.',
    path: '/tools/case-converter',
    icon: '🔤',
    tags: ['Text', 'Developer', 'Format'],
    isNew: true,
  },
  {
    name: 'Regex Tester',
    description:
      'Test regular expressions live with match highlighting, capture groups, and flags support. Reference cheatsheet and quick examples included.',
    path: '/tools/regex-tester',
    icon: '🧪',
    tags: ['Developer', 'Regex', 'Pattern'],
    isNew: true,
  },
  {
    name: 'Timestamp Converter',
    description:
      'Convert Unix timestamps to human-readable dates and back. Supports milliseconds, multiple timezones, and ISO 8601 formats.',
    path: '/tools/timestamp-converter',
    icon: '⏱️',
    tags: ['Developer', 'Date', 'Unix'],
    isNew: true,
  },
  {
    name: 'UUID Generator',
    description:
      'Generate UUID v4 and UUID v7 identifiers in bulk. Copy individually or export entire batches — perfect for testing and database seeding.',
    path: '/tools/uuid-generator',
    icon: '🆔',
    tags: ['Developer', 'UUID', 'ID'],
    isNew: false,
  },
  {
    name: 'JWT Decoder',
    description:
      'Decode JSON Web Tokens locally — view header, payload, claims, and expiration. Cryptographically safe in your browser.',
    path: '/tools/jwt-decoder',
    icon: '🔑',
    tags: ['Security', 'JWT', 'Auth'],
    isNew: true,
  },
  {
    name: 'Password Generator',
    description:
      'Generate strong random passwords or memorable passphrases with cryptographic entropy. Customize length, symbols, digits, and ambiguous-char filtering.',
    path: '/tools/password-generator',
    icon: '🔒',
    tags: ['Security', 'Password', 'Crypto'],
    isNew: true,
  },
  {
    name: 'HTML Entities Encoder/Decoder',
    description:
      'Encode special characters to HTML entities (named, numeric, hex) or decode them back. Unicode-safe with smart-quote handling.',
    path: '/tools/html-entities',
    icon: '🏷️',
    tags: ['Web', 'HTML', 'Encoding'],
    isNew: true,
  },
  {
    name: 'SQL Formatter',
    description:
      'Format and beautify any SQL query. Uppercase keywords, indented clauses, JOIN/WHERE splitting. Plus single-line minify mode.',
    path: '/tools/sql-formatter',
    icon: '🗃️',
    tags: ['Developer', 'SQL', 'Database'],
    isNew: true,
  },
  {
    name: 'URL Slug Generator',
    description:
      'Convert any title to a clean, SEO-friendly URL slug. Strip accents, configurable separator and length, bulk mode for many titles at once.',
    path: '/tools/slug-generator',
    icon: '🔗',
    tags: ['SEO', 'URL', 'Web'],
    isNew: true,
  },
  {
    name: 'CSS Unit Converter',
    description:
      'Convert between px, em, rem, pt, pc, %, vw, and vh — with adjustable root font size and viewport context. Built for designers and front-end devs.',
    path: '/tools/css-unit-converter',
    icon: '📐',
    tags: ['Design', 'CSS', 'Web'],
    isNew: true,
  },
  {
    name: 'Cron Expression Parser',
    description:
      'Parse cron expressions into plain English. Preview the next 10 runs in UTC. One-click presets for common schedules.',
    path: '/tools/cron-parser',
    icon: '⏰',
    tags: ['Developer', 'Cron', 'Scheduling'],
    isNew: true,
  },
  {
    name: 'Text Diff Checker',
    description:
      'Compare two pieces of text line by line. Highlights added, removed, and unchanged lines. Ignore case or whitespace toggles.',
    path: '/tools/text-diff',
    icon: '🔍',
    tags: ['Developer', 'Diff', 'Text'],
    isNew: true,
  },
  {
    name: 'Markdown Preview',
    description:
      'Live markdown editor with side-by-side HTML preview. Headings, lists, code blocks, links — copy markdown source or rendered HTML.',
    path: '/tools/markdown-preview',
    icon: '📑',
    tags: ['Writing', 'Markdown', 'Web'],
    isNew: true,
  },
  {
    name: 'YAML / JSON Converter',
    description:
      'Convert YAML to JSON or JSON to YAML in your browser. Live preview, sample data, helpful error messages. Pure client-side.',
    path: '/tools/yaml-json-converter',
    icon: '🔄',
    tags: ['Developer', 'YAML', 'JSON'],
    isNew: true,
  },
];

export default function ToolsHome() {
  const [search, setSearch] = useState('');

  const filteredTools = useMemo(() => {
    if (!search.trim()) return tools;
    const q = search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <>
      <Head>
        <title>Toolisk Tools — 21 Free Online Developer &amp; Productivity Utilities</title>
        <meta
          name="description"
          content="21 free online utilities for developers, designers, and writers. JWT decoder, password generator, SQL formatter, JSON viewer, regex tester, cron parser, CSS unit converter and more — all client-side, private, no sign-ups."
        />
        <meta
          name="keywords"
          content="online utilities, developer tools, jwt decoder, password generator, sql formatter, url encoder, JSON formatter, word counter, base64 encoder, color converter, hash generator, regex tester, cron parser, css unit converter, free web tools"
        />
        <link rel="canonical" href="https://toolisk.com/tools" />
        <meta property="og:title" content="Toolisk Tools — 21 Free Online Developer & Productivity Utilities" />
        <meta
          property="og:description"
          content="21 free online utilities — JWT decoder, password generator, SQL formatter, JSON viewer, regex tester, cron parser and more. Fast, private, no sign-ups."
        />
        <meta property="og:url" content="https://toolisk.com/tools" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Toolisk Tools — 21 Free Online Developer & Productivity Utilities" />
        <meta
          name="twitter:description"
          content="21 free utilities for developers, designers, and writers. All run client-side."
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Toolisk Online Utilities',
              description: 'Free online utilities for developers, designers, and writers.',
              numberOfItems: tools.length,
              itemListElement: tools.map((tool, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: tool.name,
                url: `https://toolisk.com${tool.path}`,
                description: tool.description,
              })),
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Are all Toolisk utilities really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Every tool is completely free with no sign-ups, no paywalls, and no usage limits.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my data safe when I use these tools?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. Every utility runs entirely in your browser. Your text, JSON payloads, hashes, and other inputs never leave your device.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need an account to use these tools?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No account, no sign-up, no email required. Just open the page and start using the tool.',
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-500" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-14 sm:pt-14 sm:pb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">🛠️</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Toolisk Tools
              </h1>
            </div>
            <p className="text-emerald-50 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Developer & productivity utilities — fast, private, no sign-ups.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools… e.g. JSON, base64, regex"
                  className="w-full pl-13 pr-12 py-4 rounded-2xl border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-emerald-900/20 transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  aria-label="Search utilities"
                  autoComplete="off"
                />
                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-400 bg-slate-100 rounded-md border border-slate-200">
                      {tools.length} tools
                    </kbd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="max-w-6xl mx-auto px-4 pt-10 pb-16">
          {search.trim() && filteredTools.length > 0 && (
            <p className="text-sm text-slate-500 mb-6 text-center">
              {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No tools match &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">Clear search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.path}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:border-emerald-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl leading-none">{tool.icon}</span>
                    <div className="flex items-center gap-2">
                      {tool.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          New
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-emerald-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1.5">
                    {tool.name}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-emerald-600/80 bg-emerald-50/80 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!search.trim() && (
            <div className="text-center mt-12">
              <p className="text-sm text-slate-400">
                All tools run client-side — your data never leaves your browser.
              </p>
            </div>
          )}
        </section>

        {/* SEO Content Section */}
        <article className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Use Toolisk Tools?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most online utilities are slow, ad-heavy, or upload your data to a server. Toolisk Tools are different. Every utility is <strong>built as a single-page app</strong>, runs <strong>entirely in your browser</strong>, and works <strong>without sign-ups</strong>. Whether you are formatting JSON during an API debug session, encoding a URL for a query string, or counting words for an SEO description, you get instant results without leaving the page.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Each tool is built with a focus on the small details — keyboard shortcuts, copy-to-clipboard buttons, sample data, and clean error messages. These are the kind of utilities you bookmark and open ten times a day.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What You Can Do with Each Tool</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/url-encoder" className="text-emerald-600 hover:underline">URL Encoder / Decoder</Link> — Safe URLs in One Click
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Convert special characters into percent-encoded URL components. Useful for query strings, REST APIs, and OAuth flows where you need to pass spaces, ampersands, or unicode safely.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/json-viewer" className="text-emerald-600 hover:underline">JSON Viewer & Formatter</Link> — Read Any API Response
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Paste raw JSON to get a readable, syntax-highlighted view with collapsible nodes. Format, minify, validate, and copy back the cleaned-up output. Catches syntax errors with line numbers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/word-counter" className="text-emerald-600 hover:underline">Word Counter</Link> — Track Length and Reading Time
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time. Includes Twitter, SEO meta description, and Open Graph length indicators.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/base64" className="text-emerald-600 hover:underline">Base64 Encoder / Decoder</Link> — Standard and URL-Safe
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Convert text to Base64 and back, with full UTF-8 support and URL-safe variants. Useful for email attachments, data URLs, JWTs, and config files where binary data must travel as text.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/color-converter" className="text-emerald-600 hover:underline">Color Converter</Link> — HEX, RGB, HSL, CMYK
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Convert between every common color model with a live preview swatch. Includes contrast ratio calculator for WCAG accessibility checks and tint/shade variations for design palettes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/hash-generator" className="text-emerald-600 hover:underline">Hash Generator</Link> — MD5, SHA-1, SHA-256, SHA-512
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Generate cryptographic hashes from any text input. All hashing happens locally using the Web Crypto API — your input is never transmitted. Useful for checksums, fingerprints, and password verification flows.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/regex-tester" className="text-emerald-600 hover:underline">Regex Tester</Link> — Live Match Highlighting
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Build and test regular expressions with real-time match highlighting, capture group breakdowns, and flag support. Quick reference cheatsheet covers metacharacters, quantifiers, and groups.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/tools/case-converter" className="text-emerald-600 hover:underline">Case Converter</Link> — All Common Formats
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Convert text between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, Title Case, and Sentence case. Essential for renaming variables, generating slugs, and cleaning up exported data.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Built for Speed and Privacy</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Every Toolisk Tool is a static page with zero server-side processing. The page loads, the tool runs, and your input never leaves your machine. This means: <strong>no telemetry on your data</strong>, <strong>no ads injected into your output</strong>, and <strong>no rate limits</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed">
                You can paste credentials, API keys, secret JSON payloads, or sensitive text into any of these tools without worrying about server-side logging. They are designed exactly the way you would build them for yourself.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Are all Toolisk tools really free?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Yes. Every tool is completely free, with no sign-ups, paywalls, or usage limits.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Is my data safe when I use these tools?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Absolutely. Every utility runs entirely in your browser. Text, JSON, hashes, and other inputs never leave your device. There is no upload, no server-side storage, and no telemetry on your inputs.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Do I need to install anything?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    No. Toolisk Tools are web pages — open the URL and the tool is ready. They work on desktop and mobile browsers.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Can I bookmark a specific tool?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Yes. Each tool has its own URL — bookmark whichever ones you use most often.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Learn More About Web Utilities</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Beyond the tools themselves, Toolisk publishes practical guides on the technologies behind these utilities — encoding standards, regex patterns, color theory, and more.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link href="/tools/learn/url-encoding-explained" className="text-emerald-600 hover:underline font-medium">URL Encoding Explained</Link> — When and why characters are percent-encoded.
                </li>
                <li>
                  <Link href="/tools/learn/json-essentials" className="text-emerald-600 hover:underline font-medium">JSON Essentials for Developers</Link> — Beyond pretty-printing: schemas, validation, and common pitfalls.
                </li>
                <li>
                  <Link href="/tools/learn/regex-cheatsheet" className="text-emerald-600 hover:underline font-medium">Regex Cheatsheet & Common Patterns</Link> — Email, URL, phone validation patterns and tricky edge cases.
                </li>
                <li>
                  <Link href="/tools/learn/base64-and-data-urls" className="text-emerald-600 hover:underline font-medium">Base64 & Data URLs</Link> — Why we encode binary data as text, and when to skip it.
                </li>
                <li>
                  <Link href="/tools/learn/hashing-vs-encryption" className="text-emerald-600 hover:underline font-medium">Hashing vs Encryption</Link> — Two completely different concepts that are constantly confused.
                </li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
