import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';
import { CALCULATORS as financeTools } from '../../data/masterItems';

const categories = ['All', 'Loan', 'Tax', 'Retirement', 'Investing', 'Real Estate', 'Savings'];

const longTailGroups = [
  {
    title: 'Loan and EMI calculators',
    links: [
      { name: 'Home Loan EMI Calculator', href: '/finance/home-loan-emi-calculator', desc: 'Housing loan monthly payment and interest schedule.' },
      { name: 'Home Loan Prepayment Calculator', href: '/finance/home-loan-prepayment-calculator', desc: 'See interest saved from part-payments.' },
      { name: 'Reduce EMI vs Reduce Tenure', href: '/finance/reduce-emi-vs-reduce-tenure-calculator', desc: 'Compare both lender options after prepayment.' },
      { name: 'Personal Loan EMI Calculator', href: '/finance/personal-loan-emi-calculator', desc: 'Plan unsecured loan payments and total interest.' },
      { name: 'Car Loan EMI Calculator', href: '/finance/car-loan-emi-calculator', desc: 'Estimate auto loan EMI and repayment cost.' },
      { name: 'Education Loan EMI Calculator', href: '/finance/education-loan-emi-calculator', desc: 'Model student and education loan repayments.' },
    ],
  },
  {
    title: 'Mortgage and home-buying calculators',
    links: [
      { name: 'Mortgage Payoff Calculator', href: '/finance/mortgage-payoff-calculator', desc: 'Estimate payoff date and early-payoff scenarios.' },
      { name: 'Extra Mortgage Payment Calculator', href: '/finance/extra-mortgage-payment-calculator', desc: 'Test monthly extras and one-time principal payments.' },
      { name: 'Mortgage Refinance Calculator', href: '/finance/mortgage-refinance-calculator', desc: 'Calculate refinance savings and break-even time.' },
      { name: '15 vs 30 Year Mortgage Calculator', href: '/finance/15-year-vs-30-year-mortgage-calculator', desc: 'Compare payment pressure and lifetime interest.' },
      { name: 'FHA Loan Affordability Calculator', href: '/finance/fha-loan-affordability-calculator', desc: 'Estimate affordability under FHA-style assumptions.' },
      { name: 'DTI Home Loan Calculator', href: '/finance/dti-home-loan-calculator', desc: 'Check front-end and back-end debt ratios.' },
    ],
  },
  {
    title: 'FIRE and retirement calculators',
    links: [
      { name: 'Financial Independence Retire Early Calculator', href: '/finance/financial-independence-retire-early-calculator', desc: 'Full FIRE phrase landing page with timeline planning.' },
      { name: 'FIRE Number Calculator', href: '/finance/fire-number-calculator', desc: 'Turn expenses into a 25x, 30x, or custom target.' },
      { name: 'How Much Money Do I Need to Retire Calculator', href: '/finance/how-much-money-do-i-need-to-retire-calculator', desc: 'Estimate retirement corpus from spending and age.' },
      { name: 'Coast FIRE Calculator', href: '/finance/coast-fire-calculator', desc: 'See when your portfolio can coast to retirement.' },
      { name: 'Social Security Break-Even Calculator', href: '/finance/social-security-break-even-calculator', desc: 'Compare lifetime benefits by claiming age.' },
      { name: 'Delayed Retirement Credit Calculator', href: '/finance/delayed-retirement-credit-calculator', desc: 'Estimate higher benefits from delayed claiming.' },
    ],
  },
  {
    title: 'Inflation, salary, and tax calculators',
    links: [
      { name: 'Purchasing Power Calculator', href: '/finance/purchasing-power-calculator', desc: 'Convert dollar values across years using CPI.' },
      { name: 'Cost of Living Inflation Calculator', href: '/finance/cost-of-living-inflation-calculator', desc: 'Inflation-adjust expenses, salary, or rent.' },
      { name: 'Gross to Net Salary Calculator', href: '/finance/gross-to-net-salary-calculator', desc: 'Convert gross salary into take-home pay.' },
      { name: 'After-Tax Income Calculator', href: '/finance/after-tax-income-calculator', desc: 'Estimate income after federal, state, and payroll taxes.' },
      { name: 'Take-Home Pay Calculator', href: '/finance/take-home-pay-calculator', desc: 'Paycheck-focused salary planning.' },
      { name: 'GST Calculator India', href: '/finance/gst-calculator-india', desc: 'Add or remove GST from Indian prices.' },
    ],
  },
];

export default function FinanceHome() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const breadcrumbSchema = generateBreadcrumbs('/finance');

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    return financeTools.filter((tool) => {
      const matchesCategory = category === 'All' || tool.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase()));
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <>
      <Head>
        <title>{`Free Finance Calculators — ${financeTools.length} Tools for Loans, Retirement & Investing | Toolisk`}</title>
        <meta
          name="description"
          content={`Use ${financeTools.length} free finance calculators for loans, mortgages, tax, retirement, investing, savings, inflation, real estate, and everyday money decisions.`}
        />
        <meta
          name="keywords"
          content="finance calculators, free finance calculators, EMI calculator, mortgage calculator, retirement calculator, investment calculator, tax calculator"
        />
        <link rel="canonical" href={`${SITE_URL}/finance`} />
        <meta property="og:title" content={`Free Finance Calculators — ${financeTools.length} Tools for Loans, Retirement & Investing | Toolisk`} />
        <meta
          property="og:description"
          content={`${financeTools.length} free finance calculators for loans, mortgages, tax, retirement, investing, savings, inflation, and real estate decisions.`}
        />
        <meta property="og:url" content={`${SITE_URL}/finance`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={`Free Finance Calculators — ${financeTools.length} Tools for Loans, Retirement & Investing | Toolisk`} />
        <meta
          name="twitter:description"
          content={`${financeTools.length} free finance calculators for loans, mortgages, tax, retirement, investing, savings, and real estate.`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              breadcrumbSchema,
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Toolisk Finance Calculators',
                description: 'Free online finance calculators for loans, retirement, investing, tax, savings, and real estate.',
                numberOfItems: financeTools.length,
                itemListElement: financeTools.map((tool, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name: tool.name,
                  url: `${SITE_URL}${tool.path}`,
                  description: tool.description,
                })),
              },
            ]),
          }}
        />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500" />
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-14 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">📊</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Finance Calculators
              </h1>
            </div>
            <p className="text-blue-50 text-base sm:text-lg max-w-3xl mx-auto mb-8">
              Free calculators for loans, taxes, retirement, investing, savings, inflation, real estate, and day-to-day money decisions. Every tool runs in your browser, with no sign-ups and no data sent to a server.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search calculators... e.g. EMI, tax, retirement"
                  className="w-full pr-12 py-4 rounded-lg border-2 border-white/20 bg-white text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white shadow-xl shadow-blue-900/20 transition-all"
                  style={{ paddingLeft: '3.25rem' }}
                  aria-label="Search finance calculators"
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
                      {financeTools.length} tools
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
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">🌍</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">India &amp; US finance</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Old vs New tax, EMI, SIP, FD for India — plus 401(k), Roth IRA, mortgage, FIRE, and Social Security for the US. Multi-currency: ₹ $ € £ A$ C$.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">🔒</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">100% private, client-side</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Salary, loan, and investment data never leaves your browser. No server calls, no sign-up required, and no data stored anywhere.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">📊</div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Depth beyond the basics</h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Amortization schedules, prepayment strategies, multi-scenario FIRE comparisons, and Excel export — features most paid tools charge for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {(search.trim() || category !== 'All') && (
            <p className="text-sm text-slate-500 mb-6 text-center">
              {filteredTools.length} calculator{filteredTools.length !== 1 ? 's' : ''} found
            </p>
          )}

          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-medium">No finance calculators match your filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                }}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="group relative bg-white rounded-lg border border-slate-200 p-5 flex flex-col min-h-[14rem] transition-all duration-200 hover:shadow-lg hover:shadow-blue-100/50 hover:border-blue-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl leading-none">{tool.icon}</span>
                    <div className="flex items-center gap-2">
                      {tool.isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          New
                        </span>
                      )}
                      <span className="text-slate-300 group-hover:text-blue-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                    {tool.name}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-medium text-blue-600/80 bg-blue-50/80 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!search.trim() && category === 'All' && (
            <div className="text-center mt-12">
              <p className="text-sm text-slate-400">
                All calculators run client-side, so your salary, loan, tax, and investment data stays on your device.
              </p>
            </div>
          )}
        </section>

        {!search.trim() && category === 'All' && (
          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Popular calculator shortcuts</h2>
              <p className="text-sm text-slate-500 mt-1">
                More specific calculator pages for common loan, retirement, mortgage, salary, and inflation searches.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
              {longTailGroups.map((group) => (
                <section key={group.title} className="bg-white rounded-lg border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-900 mb-4">{group.title}</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                      >
                        <span className="block text-sm font-semibold text-slate-900">{link.name}</span>
                        <span className="block text-xs text-slate-500 mt-1 leading-relaxed">{link.desc}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        )}

        <article className="max-w-4xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-lg border border-slate-200/80 p-8 sm:p-10 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What You Can Calculate</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Toolisk finance calculators cover the decisions where a single headline number is not enough: loan affordability, repayment schedules, tax regime comparison, investment growth, retirement readiness, inflation, and real estate trade-offs.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Start with the <Link href="/finance/emi-calculator" className="text-blue-600 font-semibold hover:underline">EMI calculator</Link> for loan repayment planning, use the <Link href="/finance/amortization-calculator" className="text-blue-600 font-semibold hover:underline">amortization calculator</Link> to inspect principal versus interest, or compare long-term goals with the <Link href="/finance/fire-calculator" className="text-blue-600 font-semibold hover:underline">FIRE calculator</Link> and investment tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Private by Design</h2>
              <p className="text-slate-600 leading-relaxed">
                Financial inputs are sensitive. These calculators run locally in your browser, so your loan amount, salary, taxes, assets, and investment plans are not uploaded just to get a result.
              </p>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
