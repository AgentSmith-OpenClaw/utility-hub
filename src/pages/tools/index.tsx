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
  {
    name: 'Number Base Converter',
    description:
      'Convert numbers between binary, octal, decimal, hexadecimal, and any custom base from 2 to 36. Live conversion with per-base breakdown.',
    path: '/tools/number-base-converter',
    icon: '🔢',
    tags: ['Developer', 'Math', 'Binary', 'Hex'],
    isNew: true,
  },
  {
    name: 'Image to Base64 Converter',
    description:
      'Convert any image to a Base64 data URL — or decode Base64 back to an image. Drag-and-drop upload, MIME detection, instant preview.',
    path: '/tools/image-base64',
    icon: '🖼️',
    tags: ['Web', 'Encoding', 'Image'],
    isNew: true,
  },
  {
    name: 'Percentage Calculator',
    description:
      'Calculate X% of Y, find what percent X is of Y, compute percent change, and add or subtract percentages. Four calculators in one.',
    path: '/tools/percentage-calculator',
    icon: '%',
    tags: ['Math', 'Finance', 'Utility'],
    isNew: true,
  },
  {
    name: 'Age & Date Calculator',
    description:
      'Calculate exact age from a birthday, find the number of days between two dates, and add or subtract days for deadline math.',
    path: '/tools/age-calculator',
    icon: '📅',
    tags: ['Utility', 'Date', 'Calendar'],
    isNew: true,
  },
  {
    name: 'Unit Converter',
    description:
      'Convert between 50+ units across length, weight, temperature, volume, area, and speed. Metric and imperial, all in one place.',
    path: '/tools/unit-converter',
    icon: '⚖️',
    tags: ['Utility', 'Math', 'Conversion'],
    isNew: true,
  },
  {
    name: 'Color Palette Generator',
    description:
      'Generate tints, shades, complementary, analogous, and triadic color palettes from any base color. Includes a full 100–900 color scale.',
    path: '/tools/color-palette',
    icon: '🎨',
    tags: ['Design', 'Color', 'CSS'],
    isNew: true,
  },
  {
    name: 'Morse Code Converter',
    description:
      'Translate text to Morse code or decode Morse back to text. Includes audio playback, a reference chart, and support for all letters and digits.',
    path: '/tools/morse-code',
    icon: '📡',
    tags: ['Encoding', 'Fun', 'Audio'],
    isNew: true,
  },
  {
    name: 'Text to Binary / Hex',
    description:
      'Encode text as binary, hexadecimal, decimal (ASCII), or octal bytes — and decode back. UTF-8 aware with per-character breakdown.',
    path: '/tools/text-binary',
    icon: '01',
    tags: ['Developer', 'Encoding', 'Binary'],
    isNew: true,
  },
  {
    name: 'Caesar Cipher & ROT13',
    description:
      'Encrypt and decrypt text with Caesar cipher. Adjustable shift 0–25, one-click ROT13, brute-force all 26 shifts, letter frequency analysis.',
    path: '/tools/caesar-cipher',
    icon: '🔒',
    tags: ['Security', 'Encoding', 'Fun'],
    isNew: true,
  },
  {
    name: 'XML Formatter & Validator',
    description:
      'Format (pretty-print), minify, and validate XML. Choose 2 or 4-space indentation. Browser-based using DOMParser — no upload needed.',
    path: '/tools/xml-formatter',
    icon: '📋',
    tags: ['Developer', 'XML', 'Formatter'],
    isNew: true,
  },
  {
    name: 'HTTP Status Codes',
    description:
      'Searchable reference for all HTTP 1xx–5xx status codes. Plain-English descriptions, usage guidance, and common pitfalls for 38 codes.',
    path: '/tools/http-status-codes',
    icon: '🌐',
    tags: ['Developer', 'HTTP', 'Reference'],
    isNew: true,
  },
  {
    name: 'Aspect Ratio Calculator',
    description:
      'Calculate missing dimensions from any aspect ratio, detect image ratios, and compute contain or cover fit dimensions for any target box.',
    path: '/tools/aspect-ratio',
    icon: '📐',
    tags: ['Design', 'Math', 'Video'],
    isNew: true,
  },
  {
    name: 'Pomodoro Timer',
    description:
      'Stay focused with 25-minute work sessions, 5-minute short breaks, and 15-minute long breaks. Customizable, with browser notifications.',
    path: '/tools/pomodoro-timer',
    icon: '🍅',
    tags: ['Productivity', 'Timer', 'Focus'],
    isNew: true,
  },
  {
    name: 'JSON ↔ CSV Converter',
    description:
      'Convert JSON arrays to CSV or CSV back to JSON. Choose comma, semicolon, tab, or pipe delimiter. Download result or copy to clipboard.',
    path: '/tools/json-csv',
    icon: '📊',
    tags: ['Developer', 'JSON', 'CSV'],
    isNew: true,
  },
  {
    name: 'Chmod Calculator',
    description:
      'Generate Unix file permissions with checkboxes or octal input. Get both octal (chmod 755) and symbolic commands. Common presets included.',
    path: '/tools/chmod-calculator',
    icon: '🔐',
    tags: ['Developer', 'Linux', 'Unix'],
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
        <title>Toolisk Tools — 36 Free Online Developer &amp; Productivity Utilities</title>
        <meta
          name="description"
          content="36 free online utilities for developers, designers, and writers. Unit converter, percent calculator, pomodoro timer, chmod calculator, JSON to CSV, morse code, caesar cipher, XML formatter, HTTP status codes, and more — all client-side, private, no sign-ups."
        />
        <meta
          name="keywords"
          content="online utilities, developer tools, unit converter, percentage calculator, pomodoro timer, chmod calculator, json csv converter, morse code, caesar cipher, xml formatter, http status codes, number base converter, image base64, age calculator, free web tools"
        />
        <link rel="canonical" href="https://toolisk.com/tools" />
        <meta property="og:title" content="Toolisk Tools — 36 Free Online Developer & Productivity Utilities" />
        <meta
          property="og:description"
          content="36 free online utilities — unit converter, pomodoro timer, JSON to CSV, chmod calculator, morse code, XML formatter and more. Fast, private, no sign-ups."
        />
        <meta property="og:url" content="https://toolisk.com/tools" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Toolisk Tools — 36 Free Online Developer & Productivity Utilities" />
        <meta
          name="twitter:description"
          content="36 free utilities for developers, designers, and writers. All run client-side."
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
      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-500" />
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-14 text-center">
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
                  className="w-full pl-13 pr-12 py-4 rounded-lg border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-emerald-900/20 transition-all"
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

        {/* Intro — unique content for Google, explains who the tools are for */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Developer and productivity tools that work in your browser</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
            Toolisk&apos;s developer utilities cover the everyday tasks that interrupt real work: formatting a JSON blob, decoding a JWT, testing a regex, converting between base64 and raw bytes, generating a secure password, or parsing a cron expression. Every tool runs entirely in your browser — nothing leaves your machine, no account required.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
            The collection is built specifically for software engineers and technical teams: a <strong>JSON Viewer</strong> with collapsible tree rendering and search, a <strong>Regex Tester</strong> with live match highlighting, a <strong>JWT Decoder</strong> that surfaces expiry and claims without sending tokens to a third party, and utilities for common web tasks like URL encoding, CSS unit conversion, HTML entity lookup, and Lorem Ipsum generation.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            New tools ship regularly. Use the search below to find what you need, or browse all <strong>36 tools</strong> across categories — <strong>Text</strong>, <strong>Dev</strong>, <strong>Conversion</strong>, <strong>Security</strong>, and <strong>Productivity</strong>.
          </p>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.path}
                  className="group relative bg-white rounded-lg border border-slate-200 p-5 flex flex-col min-h-[13.5rem] transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100/50 hover:border-emerald-200 hover:-translate-y-0.5"
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

                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
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
          <div className="bg-white rounded-lg border border-slate-200/80 p-8 sm:p-10 space-y-10">

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
