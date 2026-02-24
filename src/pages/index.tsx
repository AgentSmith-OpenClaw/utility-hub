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
        <title>Toolisk — Free Online Tools</title>
        <meta
          name="description"
          content="Toolisk is a collection of high-performance, free online tools for daily use. Fast, private, and feature-rich utilities — all in one place."
        />
        <meta
          name="keywords"
          content="toolisk, online tools, free tools, web utilities, calculator tools, productivity tools, developer tools"
        />
        <link rel="canonical" href="https://toolisk.com/" />
        <meta property="og:title" content="Toolisk — Free Online Tools" />
        <meta
          property="og:description"
          content="Free online tools for daily use. Fast, private, and feature-rich utilities — all consolidated in one place."
        />
        <meta property="og:url" content="https://toolisk.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Toolisk — Free Online Tools" />
        <meta
          name="twitter:description"
          content="High-performance online tools for daily use. Start with our advanced EMI calculator and explore more."
        />
      </Head>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Actively developed and continuously improving
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
              <img src="/logo.svg" alt="Toolisk Logo" className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-2xl" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Toolisk
              </h1>
            </div>
            <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              A collection of <span className="text-white font-semibold">high-performance</span> free
              online tools with advanced features you actually need — fast, private, and all in one place.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#tools"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              >
                Explore Tools ↓
              </a>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 px-5 py-3 flex items-center gap-3">
            <span className="text-lg">💡</span>
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">Toolisk</strong> — practical web tools that are fast, private, and client-side. No sign-ups, no data sent to servers.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Tools</h2>
            <p className="mt-2 text-slate-500">
              Pick a tool to get started.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools… e.g. EMI, tax, SIP, mortgage"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-shadow"
                aria-label="Search tools"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No tools match &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch('')} className="mt-3 text-sm text-indigo-600 hover:underline">Clear search</button>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const CardContent = (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {tool.isNew && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              );

              return (
                <Link
                  key={tool.name}
                  href={tool.path}
                  className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 p-6 flex flex-col transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 text-slate-300 group-hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  {CardContent}
                </Link>
              );
            })}
          </div>
          )}
        </section>
      </div>
    </>
  );
}
