import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { HEALTH } from '../../data/masterItems';

export default function HealthHome() {
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    if (!search.trim()) return HEALTH;
    const q = search.toLowerCase();
    return HEALTH.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <>
      <Head>
        <title>{`Health Tools — ${HEALTH.length} Free Online Health Calculators | Toolisk`}</title>
        <meta
          name="description"
          content={`${HEALTH.length} free health calculators — BMI calculator, healthy weight range, BMR estimator, and more. All client-side, no sign-up.`}
        />
        <meta
          name="keywords"
          content="health tools, free health calculators, bmi calculator, body mass index, healthy weight, bmr calculator, basal metabolic rate, online health tools"
        />
        <link rel="canonical" href="https://toolisk.com/health" />
        <meta property="og:title" content={`Health Tools — ${HEALTH.length} Free Online Health Calculators | Toolisk`} />
        <meta
          property="og:description"
          content={`${HEALTH.length} free health calculators — BMI, healthy weight range, BMR, and more. All client-side, no sign-up.`}
        />
        <meta property="og:url" content="https://toolisk.com/health" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Health Tools — ${HEALTH.length} Free Online Health Calculators | Toolisk`} />
        <meta name="twitter:description" content={`${HEALTH.length} free health calculators — all client-side, no sign-up.`} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Toolisk Health Tools',
              description: 'Free health calculators — BMI, healthy weight range, BMR, and more.',
              numberOfItems: HEALTH.length,
              itemListElement: HEALTH.map((h, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: h.name,
                url: `https://toolisk.com${h.path}`,
                description: h.description,
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
                  name: 'Are all Toolisk health calculators free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Every health calculator is completely free with no sign-ups, no paywalls, and no usage limits.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my health data safe on Toolisk?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. All calculations run entirely in your browser. Your height, weight, and other personal details are never sent to a server.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Should I rely on these calculators for medical decisions?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'These tools are for informational purposes only. BMI and BMR are screening metrics, not diagnostic measures. Always consult a qualified healthcare provider for personalized medical advice.',
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
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500" />
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">🩺</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Health Tools
              </h1>
            </div>
            <p className="text-violet-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Free health calculators for BMI, healthy weight, BMR, and more — private, browser-based.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search health tools… e.g. BMI, weight, calories"
                  className="w-full pr-12 py-4 rounded-lg border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-violet-900/20 transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  aria-label="Search health tools"
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
                      {HEALTH.length} tool{HEALTH.length !== 1 ? 's' : ''}
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
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-xl">🔒</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Completely private</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Health data is sensitive. All calculations run locally in your browser — your weight, height, and age are never sent anywhere.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-xl">⚡</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Instant results</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    BMI, healthy weight range, BMR — all calculated as you type, no button to press, no page reload.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-xl">🆓</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Free, no account</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Open the page, use the tool. No sign-up, no install, no email. Works on desktop and mobile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <section id="health" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {search.trim() && filteredItems.length > 0 && (
            <p className="text-sm text-slate-500 mb-6 text-center">
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No tools match &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline transition-colors">Clear search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="group relative bg-white rounded-lg border border-slate-200 p-5 flex flex-col min-h-[13.5rem] transition-all duration-200 hover:shadow-lg hover:shadow-violet-100/50 hover:border-violet-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl leading-none">{item.icon}</span>
                    <div className="flex items-center gap-2">
                      {item.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200/60">
                          New
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-violet-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-violet-600 transition-colors mb-1.5">
                    {item.name}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-violet-600/80 bg-violet-50/80 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!search.trim() && HEALTH.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-sm text-slate-400">
                All health tools run client-side — your data never leaves your browser.
              </p>
            </div>
          )}
        </section>

        {/* SEO Content */}
        <article className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-lg border border-slate-200/80 p-8 sm:p-10 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Free Health Calculators — Private by Design</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Health information is personal. Toolisk&apos;s health calculators run entirely in your browser — your weight, height, age, and other measurements never leave your device. There are no accounts, no cookies tracking your health data, and no server-side processing.
              </p>
              <p className="text-slate-600 leading-relaxed">
                These tools use established clinical formulas — the WHO BMI classification, the Mifflin-St Jeor equation for BMR — to give you accurate, reference-quality results. They are not a substitute for medical advice, but they are a reliable starting point for understanding your numbers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">BMI Calculator — Body Mass Index</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                The BMI calculator computes your Body Mass Index from height and weight, classifies it using WHO categories (Underweight, Normal, Overweight, Obese), and shows the healthy weight range for your height. Supports both metric (cm/kg) and imperial (ft, in/lbs) units. The optional BMR section estimates your Basal Metabolic Rate using the Mifflin-St Jeor equation.
              </p>
              <p>
                <Link href="/health/bmi-calculator" className="text-sm text-violet-600 font-medium hover:underline">
                  Open the BMI Calculator →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Are all Toolisk health tools really free?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Yes. Every tool is completely free with no sign-ups, paywalls, or usage limits.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Is my health data safe?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    Absolutely. All calculations run entirely in your browser. Your height, weight, age, and other inputs never leave your device.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Can I use these for medical decisions?</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    These tools are informational screening aids, not diagnostic instruments. Always consult a qualified healthcare provider for personalized medical guidance.
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
