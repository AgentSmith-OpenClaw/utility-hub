import Head from 'next/head';
import Link from 'next/link';

interface Tool {
  name: string;
  description: string;
  path: string;
  icon: string;
  tags: string[];
  isNew?: boolean;
  comingSoon?: boolean;
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
    path: '#',
    icon: '📊',
    tags: ['Finance', 'Loan', 'Amortization'],
    comingSoon: true,
  },
  {
    name: 'Regex Tester',
    description:
      'Build, test, and debug regular expressions in real time with match highlighting and cheat sheet.',
    path: '#',
    icon: '🔍',
    tags: ['Developer', 'Testing', 'Text'],
    comingSoon: true,
  },
];

export default function Home() {
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

        {/* Developer Note */}
        <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
                💡
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Developer&apos;s Note</h2>
                <p className="text-slate-600 leading-relaxed">
                  There are many tools I use daily on the internet, but nothing was consolidated and
                  most tools missed many features I needed. This project aims to solve those problems
                  — creating a more complete set of daily tools. If these tools help me, hopefully
                  they help you as well.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Tools</h2>
            <p className="mt-2 text-slate-500">
              Pick a tool to get started. More tools are on the way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
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
                        {tool.comingSoon && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            Coming Soon
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

              if (tool.comingSoon) {
                return (
                  <div
                    key={tool.name}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col opacity-75 cursor-default"
                  >
                    {CardContent}
                  </div>
                );
              }

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
        </section>
      </div>
    </>
  );
}
