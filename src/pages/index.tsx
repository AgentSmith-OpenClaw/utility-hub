import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { ALL_ITEMS, CALCULATOR_COUNT, TOOL_COUNT, PDF_COUNT, UTILITY_COUNT, HEALTH_COUNT, type ItemType } from '../data/masterItems';

type FilterType = 'all' | ItemType;

const TOTAL = ALL_ITEMS.length;

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredItems = useMemo(() => {
    let items = activeFilter === 'all' ? ALL_ITEMS : ALL_ITEMS.filter(i => i.type === activeFilter);
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }, [search, activeFilter]);

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: TOTAL },
    { key: 'calculator', label: 'Calculators', count: CALCULATOR_COUNT },
    { key: 'tool', label: 'Dev Tools', count: TOOL_COUNT },
    { key: 'pdf', label: 'PDF Tools', count: PDF_COUNT },
    { key: 'utility', label: 'Utilities', count: UTILITY_COUNT },
    { key: 'health', label: 'Health', count: HEALTH_COUNT },
  ];

  return (
    <>
      <Head>
        <title>Toolisk — Free Finance Calculators, Developer Tools, PDF Utilities &amp; Everyday Tools</title>
        <meta
          name="description"
          content="Free finance calculators, developer tools, PDF utilities, and everyday utilities — 401k, mortgage, JSON formatter, merge PDF, percentage calculator, unit converter, and more. All client-side, no sign-up."
        />
        <meta
          name="keywords"
          content="finance calculators, 401k calculator, capital gains tax calculator, mortgage calculator, developer tools, json formatter, jwt decoder, pdf tools, merge pdf, compress pdf, percentage calculator, unit converter, age calculator, qr code generator, free online tools"
        />
        <link rel="canonical" href="https://toolisk.com/" />
        <meta property="og:title" content="Toolisk — Free Finance Calculators, Developer Tools & PDF Utilities" />
        <meta
          property="og:description"
          content="Finance calculators for 401k, mortgage, capital gains, HSA, RMD, FIRE and more — plus developer utilities and PDF tools (merge, split, compress, convert). All client-side, no sign-up."
        />
        <meta property="og:url" content="https://toolisk.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Toolisk — Free Finance Calculators, Developer Tools & PDF Utilities" />
        <meta
          name="twitter:description"
          content="Finance calculators for 401k, mortgage, capital gains, HSA, RMD, FIRE and more — plus developer tools and PDF utilities. All client-side, no sign-up."
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Toolisk — Finance Calculators & Developer Tools',
              description: 'Free online finance calculators and developer utilities with interactive charts, detailed reports, and Excel export.',
              numberOfItems: TOTAL,
              itemListElement: ALL_ITEMS.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: item.name,
                url: `https://toolisk.com${item.path}`,
                description: item.description,
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
                  name: 'Are all Toolisk calculators really free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Every calculator on Toolisk is completely free with no sign-ups, no paywalls, and no usage limits. You get detailed reports, interactive charts, and Excel export — all at no cost.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my financial data safe on Toolisk?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. All calculations run entirely in your browser (client-side). No data is ever sent to a server. Your salary, loan details, and investment amounts stay on your device.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I export calculator results to Excel?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. The EMI Calculator, Amortization Calculator, and other tools include a one-click Excel export that generates a detailed .xlsx file with amortization schedules, payment breakdowns, and charts.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What makes Toolisk calculators different from other online tools?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Toolisk calculators go beyond simple number crunching. Each tool includes multiple interactive charts, prepayment strategy comparisons, detailed breakdowns, goal planning, and export features — the depth you find in paid software, available free.',
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-14 sm:pt-14 sm:pb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src="/logo.svg" alt="Toolisk Logo" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg" />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Toolisk
              </h1>
            </div>
            <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Free, high-performance tools — fast, private, no sign-ups.
            </p>

            {/* Hero Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${TOTAL} tools… e.g. EMI, 401k, JWT, mortgage`}
                  className="w-full pr-12 py-4 rounded-2xl border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-indigo-900/20 transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  aria-label="Search tools"
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
                      {TOTAL} items
                    </kbd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filter + Grid */}
        <section id="tools" className="max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeFilter === f.key
                    ? f.key === 'calculator'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : f.key === 'tool'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : f.key === 'pdf'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : f.key === 'utility'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : f.key === 'health'
                      ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                      : 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeFilter === f.key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
            {search.trim() && (
              <span className="text-sm text-slate-400 ml-2">
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
              </span>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No results for &ldquo;{search}&rdquo;</p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('all'); }}
                className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group relative bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                    item.type === 'pdf'
                      ? 'hover:shadow-rose-100/50 hover:border-rose-200'
                      : item.type === 'utility'
                      ? 'hover:shadow-amber-100/50 hover:border-amber-200'
                      : item.type === 'health'
                      ? 'hover:shadow-violet-100/50 hover:border-violet-200'
                      : item.type === 'tool'
                      ? 'hover:shadow-teal-100/50 hover:border-teal-200'
                      : 'hover:shadow-indigo-100/50 hover:border-indigo-200'
                  }`}
                >
                  {/* Icon + badges row */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl leading-none">{item.icon}</span>
                    <div className="flex items-center gap-1.5">
                      {/* Type badge */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.type === 'calculator'
                          ? 'text-indigo-600 bg-indigo-50 border-indigo-200/60'
                          : item.type === 'pdf'
                          ? 'text-rose-600 bg-rose-50 border-rose-200/60'
                          : item.type === 'utility'
                          ? 'text-amber-700 bg-amber-50 border-amber-200/60'
                          : item.type === 'health'
                          ? 'text-violet-700 bg-violet-50 border-violet-200/60'
                          : 'text-teal-700 bg-teal-50 border-teal-200/60'
                      }`}>
                        {item.type === 'calculator' ? 'Calculator' : item.type === 'pdf' ? 'PDF' : item.type === 'utility' ? 'Utility' : item.type === 'health' ? 'Health' : 'Tool'}
                      </span>
                      {item.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          New
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-semibold text-slate-900 transition-colors mb-1.5 ${
                    item.type === 'pdf'
                      ? 'group-hover:text-rose-600'
                      : item.type === 'utility'
                      ? 'group-hover:text-amber-600'
                      : item.type === 'health'
                      ? 'group-hover:text-violet-600'
                      : item.type === 'tool'
                      ? 'group-hover:text-teal-600'
                      : 'group-hover:text-indigo-600'
                  }`}>
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                          item.type === 'pdf'
                            ? 'text-rose-500/80 bg-rose-50/80'
                            : item.type === 'utility'
                            ? 'text-amber-600/80 bg-amber-50/80'
                            : item.type === 'health'
                            ? 'text-violet-600/80 bg-violet-50/80'
                            : item.type === 'tool'
                            ? 'text-teal-600/80 bg-teal-50/80'
                            : 'text-indigo-500/80 bg-indigo-50/80'
                        }`}
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Toolisk?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most online calculators give you a single number and stop there. Toolisk is different. Every calculator includes <strong>interactive charts</strong>, <strong>detailed breakdowns</strong>, and <strong>export to Excel</strong> — the depth you expect from paid financial software, available completely free.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Whether you are planning a home loan, calculating capital gains tax, projecting your 529 savings, formatting JSON at 11pm, or editing a PDF without uploading it to a stranger's server — Toolisk has you covered. All {TOTAL} tools run entirely in your browser — your data never leaves your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Finance Calculators</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">
                    <Link href="/finance/emi-calculator" className="text-indigo-600 hover:underline">EMI Calculator</Link> — Loan Repayment with Prepayment Strategies
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Compare Reduce EMI vs Reduce Tenure side by side, view 8 interactive charts, and export the full amortization schedule to Excel.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">
                    <Link href="/finance/fire-calculator" className="text-indigo-600 hover:underline">FIRE Calculator</Link> — Financial Independence, Retire Early
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Calculate your FIRE number and compare Lean, Fat, Coast, and Barista FIRE strategies with a year-by-year portfolio projection.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">
                    <Link href="/finance/capital-gains-tax-calculator" className="text-indigo-600 hover:underline">Capital Gains Tax Calculator</Link> — Federal + State + NIIT
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Compute US short-term and long-term capital gains tax on stocks, crypto, or real estate with 2026 brackets, NIIT, Section 121 exclusion, and all 50 state rates.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">
                    <Link href="/finance/rmd-calculator" className="text-indigo-600 hover:underline">RMD Calculator</Link> — Required Minimum Distributions
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Compute IRS Required Minimum Distributions from Traditional IRA or 401(k) using the Uniform Lifetime Table with 30-year projections.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">
                    <Link href="/finance/hsa-calculator" className="text-indigo-600 hover:underline">HSA Calculator</Link> — Triple-Tax Advantage
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Project HSA balance growth and quantify federal, state, and FICA tax savings versus a taxable account over decades.
                  </p>
                </div>
              </div>
              <p className="mt-4">
                <Link href="/finance" className="text-sm text-indigo-600 font-medium hover:underline">
                  Browse all {CALCULATOR_COUNT} finance calculators →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Developer Tools</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                {TOOL_COUNT} free utilities for developers and power users — JSON formatter, JWT decoder, regex tester, SQL formatter, password generator, Base64 encoder, color converter, cron parser, and more. All client-side.
              </p>
              <p>
                <Link href="/tools" className="text-sm text-indigo-600 font-medium hover:underline">
                  Browse all {TOOL_COUNT} developer tools →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Everyday Utilities — Quick Answers for Common Tasks</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                {UTILITY_COUNT} free everyday utilities for the tasks that keep coming up — percentage calculations, unit conversions, age and date math, QR code generation, and focus timers. All instant, all browser-based.
              </p>
              <p>
                <Link href="/utilities" className="text-sm text-amber-600 font-medium hover:underline">
                  Browse all {UTILITY_COUNT} everyday utilities →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Tools — Private, Browser-Based</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                {HEALTH_COUNT} free health calculators built with privacy first — your weight, height, and age never leave your browser. Start with the BMI calculator to find your Body Mass Index, WHO category, healthy weight range, and an optional BMR estimate using the Mifflin-St Jeor equation.
              </p>
              <p>
                <Link href="/health" className="text-sm text-violet-600 font-medium hover:underline">
                  Browse all {HEALTH_COUNT} health tool{HEALTH_COUNT !== 1 ? 's' : ''} →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">PDF Tools — No Upload, No Account</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                {PDF_COUNT} free PDF utilities that run entirely in your browser. Merge, split, compress, reorder pages, rotate, delete pages, and convert PDF to JPG or PNG — all without uploading your file to any server. Your documents stay on your device.
              </p>
              <p>
                <Link href="/pdf" className="text-sm text-rose-600 font-medium hover:underline">
                  Browse all {PDF_COUNT} PDF tools →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">100% Client-Side — Your Data Stays Private</h2>
              <p className="text-slate-600 leading-relaxed">
                Unlike most finance tools that send your data to a server, Toolisk runs every calculation directly in your browser using JavaScript. Your income, loan amounts, investment figures, and tax details are never transmitted anywhere. There are no accounts, no cookies tracking your financial data, and no server-side processing. This is by design — financial information is personal, and we believe the best way to protect it is to never collect it in the first place.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Are all Toolisk tools really free?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Yes. Every tool is completely free with no sign-ups, no paywalls, and no usage limits. Finance calculators include detailed reports, interactive charts, and Excel export — all at no cost.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Is my data safe on Toolisk?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Absolutely. All calculations run entirely in your browser. No data is ever sent to a server. Your salary, loan details, and investment amounts stay on your device.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Can I export calculator results to Excel?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Yes. Finance calculators include a one-click Excel export that generates a detailed .xlsx file with schedules, payment breakdowns, and summary data.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Do I need to create an account?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    No. All tools work instantly without any sign-up. Your inputs are saved in your browser&apos;s local storage, so they persist between sessions on the same device.
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
