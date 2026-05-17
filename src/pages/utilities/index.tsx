import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { UTILITIES as utilities } from '../../data/masterItems';

export default function UtilitiesHome() {
  const [search, setSearch] = useState('');

  const filteredUtils = useMemo(() => {
    if (!search.trim()) return utilities;
    const q = search.toLowerCase();
    return utilities.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <>
      <Head>
        <title>{`Everyday Tools — ${utilities.length} Free Online Utilities | Toolisk`}</title>
        <meta
          name="description"
          content={`${utilities.length} free everyday utilities — percentage calculator, age & date calculator, unit converter, QR code generator, pomodoro timer, and more. All client-side, no sign-up.`}
        />
        <meta
          name="keywords"
          content="everyday tools, free online utilities, percentage calculator, age calculator, unit converter, qr code generator, pomodoro timer, free calculators, online utilities"
        />
        <link rel="canonical" href="https://toolisk.com/utilities" />
        <meta property="og:title" content={`Everyday Tools — ${utilities.length} Free Online Utilities | Toolisk`} />
        <meta
          property="og:description"
          content={`${utilities.length} free everyday utilities — percentage calculator, unit converter, QR code generator, and more. All client-side, no sign-up.`}
        />
        <meta property="og:url" content="https://toolisk.com/utilities" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Everyday Tools — ${utilities.length} Free Online Utilities | Toolisk`} />
        <meta
          name="twitter:description"
          content={`${utilities.length} free everyday utilities — all client-side, no sign-up.`}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Toolisk Everyday Tools',
              description: 'Free everyday online utilities — percentage calculator, unit converter, QR code generator, and more.',
              numberOfItems: utilities.length,
              itemListElement: utilities.map((u, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: u.name,
                url: `https://toolisk.com${u.path}`,
                description: u.description,
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
                  name: 'Are all Toolisk everyday utilities really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Every utility is completely free with no sign-ups, no paywalls, and no usage limits.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my data safe when I use these utilities?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. Every utility runs entirely in your browser. Your input never leaves your device — there is no upload and no server-side processing.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need an account to use these utilities?',
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
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">⚡</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Everyday Tools
              </h1>
            </div>
            <p className="text-amber-50 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Quick utilities for everyday tasks — percentage, unit conversion, QR codes, and more.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search utilities… e.g. percentage, units, QR"
                  className="w-full pr-12 py-4 rounded-lg border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-amber-900/20 transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  aria-label="Search everyday utilities"
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
                      {utilities.length} utilities
                    </kbd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Feature strip */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-xl">⚡</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Instant results</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Percentage math, unit conversion, age calculations, QR codes — answers in seconds, no loading, no waiting.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-xl">🔒</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">100% private</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Every utility runs entirely in your browser. Nothing is uploaded to a server — your inputs stay on your device.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-xl">🆓</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Free, no account</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Open the page, use the tool. No sign-up, no install, no extension. Works on any browser, desktop or mobile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Utilities Grid */}
        <section id="utilities" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {search.trim() && filteredUtils.length > 0 && (
            <p className="text-sm text-slate-500 mb-6 text-center">
              {filteredUtils.length} result{filteredUtils.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          {filteredUtils.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No utilities match &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="mt-4 text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors">Clear search</button>
            </div>
          ) : utilities.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">⚡</div>
              <p className="text-slate-500 text-lg font-medium">Everyday utilities coming soon.</p>
              <Link href="/" className="mt-4 text-sm font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors block">Browse all tools →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredUtils.map((util) => (
                <Link
                  key={util.name}
                  href={util.path}
                  className="group relative bg-white rounded-lg border border-slate-200 p-5 flex flex-col min-h-[13.5rem] transition-all duration-200 hover:shadow-lg hover:shadow-amber-100/50 hover:border-amber-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl leading-none">{util.icon}</span>
                    <div className="flex items-center gap-2">
                      {util.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                          New
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-amber-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-amber-600 transition-colors mb-1.5">
                    {util.name}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {util.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {util.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-amber-600/80 bg-amber-50/80 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!search.trim() && utilities.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-sm text-slate-400">
                All utilities run client-side — your data never leaves your browser.
              </p>
            </div>
          )}
        </section>

        {/* SEO Content Section */}
        <article className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-lg border border-slate-200/80 p-8 sm:p-10 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Free Everyday Online Utilities</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Everyday tasks shouldn&apos;t require a spreadsheet. Whether you need to figure out what 15% off $84 is, find out how many days until your birthday, convert kilometers to miles, or generate a QR code for a Wi-Fi password — these utilities give you the answer in seconds.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Unlike generic calculation sites, every tool here is designed for clarity. Each one explains what it&apos;s calculating, shows the formula when relevant, and lets you copy the result with one click. All {utilities.length} utilities run entirely in your browser — your inputs are never sent to a server.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What These Utilities Can Do</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Percentage Calculator — Four Modes in One</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Calculate X% of Y, find what percent X is of Y, compute percent change between two values, and add or subtract a percentage from a number. Useful for discounts, tips, tax, grade calculations, and financial comparisons.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Age & Date Calculator — Exact Time Math</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Find your exact age in years, months, and days. Count the number of days, weeks, or months between any two dates. Add or subtract days for deadline calculations.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Unit Converter — 50+ Units Across 6 Categories</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Convert between metric and imperial units for length, weight, temperature, volume, area, and speed. All conversions happen instantly as you type.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">QR Code Generator — For URLs, Text, Wi-Fi, and More</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Create scannable QR codes for any URL, text, vCard, email, SMS, or Wi-Fi password. Download as PNG or SVG. Custom colors and error correction levels.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Pomodoro Timer — Focus Without Distraction</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Work in focused 25-minute intervals with 5-minute short breaks and 15-minute long breaks after every fourth session. Browser notifications remind you when to switch — no app required.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Client-Side Utilities Are Better</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most online calculators send your input to a server, process it, and return the result. That means latency, potential logging, and a dependency on internet connectivity. Toolisk&apos;s utilities run directly in your browser using JavaScript — which means results are <strong>instant</strong>, they <strong>work offline</strong> once the page loads, and your input is <strong>never transmitted</strong> anywhere.
              </p>
              <p className="text-slate-600 leading-relaxed">
                This matters most when you are working with something sensitive — salary numbers, personal dates, private contact details for a QR code. With browser-based utilities, the data never leaves your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Are all Toolisk everyday utilities really free?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Yes. Every utility is completely free with no sign-ups, paywalls, or usage limits.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Is my data safe when I use these utilities?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Absolutely. Every utility runs entirely in your browser. Your inputs never leave your device — there is no upload, no server-side storage, and no telemetry.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Do I need to install anything?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    No. Open the URL and the utility is ready. Works on desktop and mobile browsers.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Do these utilities work offline?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Yes, once the page has loaded. Since all processing happens in your browser, you can continue using an already-open utility without an internet connection.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
