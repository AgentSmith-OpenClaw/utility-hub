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
    name: 'Income Tax Calculator',
    description:
      'Compare Old vs New Tax Regimes for FY 2025-26 with latest budget updates. Calculate tax liability, rebates, and standard deductions for salaried and business professionals.',
    path: '/finance/income-tax-calculator',
    icon: '🧾',
    tags: ['Finance', 'Tax', 'India', 'Budget 2025'],
    isNew: true,
  },
  {
    name: 'US Paycheck Calculator',
    description:
      'Calculate your take-home pay with federal & state tax, FICA, and pre-tax deductions. Covers all 50 states with 2025 tax brackets.',
    path: '/finance/us-paycheck-calculator',
    icon: '💵',
    tags: ['Finance', 'Tax', 'US', 'Paycheck', 'Salary'],
    isNew: true,
  },
  {
    name: 'EMI Calculator',
    description:
      'Advanced EMI calculator for home loan, car loan & personal loan. Compare Reduce EMI vs Reduce Tenure strategies, view 8 interactive charts, prepayment impact analysis, and export to Excel.',
    path: '/finance/emi-calculator',
    icon: '🏦',
    tags: ['Finance', 'Loan', 'Home Loan', 'Prepayment'],
    isNew: false,
  },
  {
    name: 'FIRE Calculator',
    description:
      'Calculate your Financial Independence Retire Early number. Compare Lean, Fat, Coast & Barista FIRE strategies with interactive charts, milestone tracking, and portfolio projections.',
    path: '/finance/fire-calculator',
    icon: '🔥',
    tags: ['Finance', 'Retirement', 'FIRE', 'Independence'],
    isNew: true,
  },
  {
    name: 'SIP Calculator',
    description:
      'Calculate returns on Systematic Investment Plans. Analyze mutual fund SIP investments with step-up options and goal planning.',
    path: '/finance/sip-calculator',
    icon: '📈',
    tags: ['Finance', 'Investment', 'SIP'],
    isNew: true,
  },
  {
    name: 'Buy vs Rent Calculator',
    description:
      'Make smarter housing decisions. Compare buying vs renting with net worth analysis, opportunity cost calculations, and personalized recommendations.',
    path: '/finance/buy-vs-rent-calculator',
    icon: '🏠',
    tags: ['Finance', 'Real Estate', 'Home'],
    isNew: true,
  },
  {
    name: 'Compound Interest Calculator',
    description:
      'Calculate compound interest with flexible compounding frequencies. Visualize growth over time with interactive charts, account for inflation, and see the power of compounding.',
    path: '/finance/compound-interest-calculator',
    icon: '💰',
    tags: ['Finance', 'Investment', 'Interest'],
    isNew: true,
  },
  {
    name: 'Amortization Calculator',
    description:
      'Generate detailed amortization schedules for any loan. Compare different loan terms and see principal vs interest breakdown over time.',
    path: '/finance/amortization-calculator',
    icon: '📊',
    tags: ['Finance', 'Loan', 'Amortization'],
    isNew: false,
  },
  {
    name: 'Mortgage Calculator',
    description:
      'Estimate your monthly house payment including principal, interest, property taxes, home insurance, and PMI. Perfect for budgeting your next home purchase.',
    path: '/finance/mortgage-calculator',
    icon: '🏠',
    tags: ['Finance', 'Real Estate', 'Mortgage', 'Global'],
    isNew: true,
  },
];

export default function Home() {
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
        <title>Toolisk — Free Online Finance Calculators & Tools</title>
        <meta
          name="description"
          content="Free finance calculators with detailed reports and Excel export. EMI, FIRE, SIP, compound interest, income tax, amortization, mortgage & buy-vs-rent — all client-side and private."
        />
        <meta
          name="keywords"
          content="finance calculators, EMI calculator, FIRE calculator, SIP calculator, compound interest calculator, income tax calculator, amortization schedule, mortgage calculator, buy vs rent, free online tools, Excel export"
        />
        <link rel="canonical" href="https://toolisk.com/" />
        <meta property="og:title" content="Toolisk — Free Online Finance Calculators & Tools" />
        <meta
          property="og:description"
          content="8 free finance calculators with detailed reports, interactive charts, and Excel export. EMI, FIRE, SIP, tax, mortgage & more — all client-side."
        />
        <meta property="og:url" content="https://toolisk.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Toolisk — Free Online Finance Calculators & Tools" />
        <meta
          name="twitter:description"
          content="8 free finance calculators with detailed reports, charts, and Excel export. Fast, private, no sign-ups."
        />

        {/* ItemList schema — helps Google surface tools as a list */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Toolisk Finance Calculators',
              description: 'Free online finance calculators with interactive charts, detailed reports, and Excel export.',
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

        {/* FAQ schema for homepage */}
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
        {/* Hero — compact with integrated search */}
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools… e.g. EMI, tax, SIP, mortgage"
                  className="w-full pl-13 pr-12 py-4 rounded-2xl border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-indigo-900/20 transition-all"
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
          {/* Result count when searching */}
          {search.trim() && filteredTools.length > 0 && (
            <p className="text-sm text-slate-500 mb-6 text-center">
              {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No tools match &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">Clear search</button>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.path}
                className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-indigo-100/50 hover:border-indigo-200 hover:-translate-y-0.5"
              >
                {/* Icon + Badge row */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl leading-none">{tool.icon}</span>
                  <div className="flex items-center gap-2">
                    {tool.isNew && (
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
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                  {tool.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {tool.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-indigo-500/80 bg-indigo-50/80 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          )}

          {/* Bottom tagline */}
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

            {/* Why Toolisk */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Toolisk Calculators?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Most online calculators give you a single number and stop there. Toolisk is different. Every calculator includes <strong>interactive charts</strong>, <strong>detailed breakdowns</strong>, and <strong>export to Excel</strong> — the depth you expect from paid financial software, available completely free.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Whether you are planning a home loan, comparing tax regimes, or charting your path to early retirement, Toolisk gives you the full picture — not just a headline number. All calculations run in your browser, so your salary, loan amounts, and investment details never leave your device.
              </p>
            </section>

            {/* What Each Tool Does */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What You Can Do with Each Calculator</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/emi-calculator" className="text-indigo-600 hover:underline">EMI Calculator</Link> — Plan Loan Repayment with Prepayment Strategies
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Go beyond simple EMI calculation. Compare <strong>Reduce EMI vs Reduce Tenure</strong> prepayment strategies side by side, view <strong>8 interactive charts</strong> including interest-vs-principal breakdown over time, and <strong>export the full amortization schedule to Excel</strong>. Supports one-time, monthly, quarterly, and yearly prepayments — see exactly how much interest you save with each approach.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/income-tax-calculator" className="text-indigo-600 hover:underline">Income Tax Calculator</Link> — Old vs New Regime for FY 2025-26
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Compare your tax liability under both regimes instantly. Input Section 80C, HRA, NPS, and other deductions — the calculator shows which regime saves you more, with marginal relief and rebate calculations built in. Updated for the latest Union Budget changes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/fire-calculator" className="text-indigo-600 hover:underline">FIRE Calculator</Link> — Financial Independence, Retire Early
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Calculate your FIRE number using the 4% rule (or any custom withdrawal rate). Compare <strong>Lean, Fat, Coast, and Barista FIRE</strong> strategies. Track milestones, see your net worth projection year by year, and understand how sequence-of-returns risk affects your retirement timeline.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/sip-calculator" className="text-indigo-600 hover:underline">SIP Calculator</Link> — Systematic Investment Plan Returns
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Model SIP investments with <strong>annual step-up</strong> (increasing monthly contribution each year). Visualize how rupee cost averaging builds wealth over 10, 20, or 30 years. Set financial goals and see how much you need to invest monthly to reach them.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/compound-interest-calculator" className="text-indigo-600 hover:underline">Compound Interest Calculator</Link> — Visualize Investment Growth
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    See how a lump-sum investment grows with daily, monthly, quarterly, or yearly compounding. Interactive charts show exponential growth over decades, and you can toggle inflation adjustment to see real purchasing power — not just nominal returns.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/buy-vs-rent-calculator" className="text-indigo-600 hover:underline">Buy vs Rent Calculator</Link> — Data-Driven Housing Decisions
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Compare 20+ cost factors: down payment opportunity cost, maintenance, property tax appreciation, rental yield, and wealth accumulation over time. The calculator gives a clear recommendation based on your specific numbers — not generic rules of thumb.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/amortization-calculator" className="text-indigo-600 hover:underline">Amortization Calculator</Link> — Month-by-Month Loan Schedules
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Generate a complete amortization table showing principal and interest for every single payment. See cumulative interest paid, remaining balance at any point, and how extra payments shorten your loan. Export the full schedule to Excel for record-keeping.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    <Link href="/finance/mortgage-calculator" className="text-indigo-600 hover:underline">Mortgage Calculator</Link> — Full Housing Cost Breakdown
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Calculate your actual monthly housing cost — not just principal and interest, but also property taxes, homeowners insurance, and PMI. Compare 15-year vs 30-year terms and see the total cost difference over the life of the loan.
                  </p>
                </div>
              </div>
            </section>

            {/* Export & Reports */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Detailed Reports & Excel Export</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Every Toolisk calculator is designed to give you more than a quick answer. You get <strong>comprehensive reports</strong> with multiple chart types — bar charts, area charts, pie charts, and line graphs — that visualize your data from different angles. The EMI Calculator alone includes 8 distinct charts covering payment structure, prepayment impact, interest savings, and loan balance over time.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                When you need to keep a record or share results with a spouse, financial advisor, or bank, use the <strong>one-click Excel export</strong>. The generated .xlsx file includes formatted tables, amortization schedules, and summary statistics — ready to open in Excel, Google Sheets, or Numbers.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Your calculation history is saved locally in your browser. Come back later and your previous inputs and results are still there — no account needed.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">100% Client-Side — Your Data Stays Private</h2>
              <p className="text-slate-600 leading-relaxed">
                Unlike most finance tools that send your data to a server, Toolisk runs every calculation directly in your browser using JavaScript. Your income, loan amounts, investment figures, and tax details are never transmitted anywhere. There are no accounts, no cookies tracking your financial data, and no server-side processing. This is by design — financial information is personal, and we believe the best way to protect it is to never collect it in the first place.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Are all Toolisk calculators really free?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Yes. Every calculator is completely free with no sign-ups, no paywalls, and no usage limits. You get detailed reports, interactive charts, and Excel export — all at no cost.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Is my financial data safe on Toolisk?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Absolutely. All calculations run entirely in your browser. No data is ever sent to a server. Your salary, loan details, and investment amounts stay on your device.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Can I export calculator results to Excel?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Yes. The EMI Calculator, Amortization Calculator, and other tools include a one-click Excel export that generates a detailed .xlsx file with amortization schedules, payment breakdowns, and summary data.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">What makes Toolisk different from other online calculators?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Toolisk calculators include interactive charts, strategy comparisons (like reduce EMI vs reduce tenure), detailed breakdowns, goal planning, and export features. Most online calculators give you a number — Toolisk gives you a complete analysis you can actually act on.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">Do I need to create an account?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    No. All tools work instantly without any sign-up. Your calculation history is saved in your browser&apos;s local storage, so it persists between sessions on the same device.
                  </p>
                </div>
              </div>
            </section>

            {/* Learn More */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Learn More About Personal Finance</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Beyond the calculators, Toolisk publishes practical guides on personal finance topics. Each article is written to complement a specific calculator with deeper context and real-world examples.
              </p>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <Link href="/finance/learn/understanding-emi-calculations" className="text-indigo-600 hover:underline font-medium">Understanding EMI Calculations</Link> — How EMI formulas work and what affects your monthly payment.
                </li>
                <li>
                  <Link href="/finance/learn/prepayment-strategies-guide" className="text-indigo-600 hover:underline font-medium">Prepayment Strategies Guide</Link> — When to prepay, how much to prepay, and which strategy saves the most.
                </li>
                <li>
                  <Link href="/finance/learn/fire-movement-explained" className="text-indigo-600 hover:underline font-medium">FIRE Movement Explained</Link> — A practical introduction to financial independence and early retirement.
                </li>
                <li>
                  <Link href="/finance/learn/step-up-sip-vs-flat-sip" className="text-indigo-600 hover:underline font-medium">Step-Up SIP vs Flat SIP</Link> — Why increasing your SIP annually makes a massive difference over time.
                </li>
                <li>
                  <Link href="/finance/learn/understanding-compound-interest" className="text-indigo-600 hover:underline font-medium">Understanding Compound Interest</Link> — The math behind exponential growth and how to use it.
                </li>
              </ul>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
