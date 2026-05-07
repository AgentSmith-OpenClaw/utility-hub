import Head from 'next/head';
import Link from 'next/link';

const financeArticles = [
  {
    slug: 'understanding-compound-interest',
    title: 'The Magic of Compound Interest: How to Grow Your Wealth Exponentially',
    description:
      'Learn the principles of compound interest, how monthly contributions accelerate growth, and why starting early is the most important decision you can make.',
    readTime: '9 min read',
    publishedDate: '2026-02-15',
    category: 'Investing',
  },
  {
    slug: 'understanding-emi-calculations',
    title: 'Understanding EMI Calculations: Formula, Factors & Examples',
    description:
      'Learn how EMI is calculated, what factors affect your monthly payment, and how to use this knowledge to make better loan decisions.',
    readTime: '8 min read',
    publishedDate: '2026-02-13',
    category: 'Loans',
  },
  {
    slug: 'prepayment-strategies-guide',
    title: 'Prepayment Strategies: Reduce EMI vs Reduce Tenure Explained',
    description:
      'Understand how prepayment strategy changes total interest paid and when to prioritize lower EMI versus faster loan closure.',
    readTime: '7 min read',
    publishedDate: '2026-02-13',
    category: 'Loans',
  },
  {
    slug: 'fire-movement-explained',
    title: 'FIRE Movement Explained: A Practical Guide to Financial Independence',
    description:
      'A comprehensive guide to achieving financial independence and retiring early with realistic planning assumptions.',
    readTime: '10 min read',
    publishedDate: '2026-02-14',
    category: 'Retirement',
  },
  {
    slug: 'coast-fire-strategy',
    title: 'Coast FIRE Strategy: Retire Early Without Extreme Frugality',
    description:
      'Explore Coast FIRE, a strategy that lets you stop aggressive investing earlier while still reaching retirement goals.',
    readTime: '8 min read',
    publishedDate: '2026-02-14',
    category: 'Retirement',
  },
  {
    slug: 'step-up-sip-vs-flat-sip',
    title: 'Step-Up SIP vs Flat SIP: Which Strategy Builds More Wealth?',
    description:
      'See how annual step-ups can dramatically increase final corpus and how to choose a realistic step-up percentage.',
    readTime: '7 min read',
    publishedDate: '2026-02-14',
    category: 'Mutual Funds',
  },
  {
    slug: 'inflation-proof-investing-guide',
    title: 'Inflation-Proof Investing Guide: Protect the Real Value of Your Money',
    description:
      'Learn how inflation changes your target corpus and why planning in real purchasing power is essential for long-term goals.',
    readTime: '6 min read',
    publishedDate: '2026-02-14',
    category: 'Mutual Funds',
  },
  {
    slug: 'buy-vs-rent-decision-framework',
    title: 'Buy vs Rent: The Complete Financial Decision Framework',
    description:
      'Stop wondering if renting or buying is better. Learn the financial metrics that matter, real-world scenarios, and how to calculate the right choice for your situation.',
    readTime: '11 min read',
    publishedDate: '2026-05-07',
    category: 'Real Estate',
  },
  {
    slug: 'mortgage-basics-finding-the-best-deal',
    title: 'Mortgage Basics: How to Find the Best Home Loan Deal',
    description:
      'Master the fundamentals of mortgages. Learn how rates, terms, and down payments affect your total cost, and the questions to ask lenders before signing.',
    readTime: '9 min read',
    publishedDate: '2026-05-07',
    category: 'Real Estate',
  },
  {
    slug: 'amortization-explained-why-interest-heavy-early',
    title: 'Amortization Explained: Why Your Early Payments Go Mostly to Interest',
    description:
      'Understand the amortization schedule behind every loan. See why paying interest upfront is inevitable, and how to strategically pay down principal faster.',
    readTime: '8 min read',
    publishedDate: '2026-05-07',
    category: 'Loans',
  },
  {
    slug: 'us-tax-brackets-deductions-take-home-pay',
    title: 'US Tax Brackets & Deductions: Maximize Your Take-Home Pay',
    description:
      'Decode federal and state taxes. Learn how tax brackets work, which deductions matter most, and how to optimize your paycheck before it arrives.',
    readTime: '10 min read',
    publishedDate: '2026-05-07',
    category: 'Tax',
  },
  {
    slug: 'real-estate-investment-vs-stock-market',
    title: 'Real Estate Investment vs Stock Market: Which Builds More Wealth?',
    description:
      'Compare the two wealth-building paths head-to-head. Analyze returns, risks, liquidity, leverage, and tax implications to find the right investment for you.',
    readTime: '10 min read',
    publishedDate: '2026-05-07',
    category: 'Investing',
  },
  {
    slug: 'personal-loan-vs-alternatives',
    title: 'Personal Loan vs Home Equity Loan vs Credit Card: Which Debt is Cheapest?',
    description:
      'Understand your borrowing options. Compare interest rates, terms, and flexibility to find the cheapest debt for your situation and avoid financial traps.',
    readTime: '8 min read',
    publishedDate: '2026-05-07',
    category: 'Loans',
  },
  {
    slug: 'retirement-savings-age-milestones',
    title: 'Retirement Savings Milestones: Are You On Track?',
    description:
      'Know how much you should have saved by 30, 40, and 50. Compare your progress to age-based benchmarks and adjust course before it\'s too late.',
    readTime: '7 min read',
    publishedDate: '2026-05-07',
    category: 'Retirement',
  },
];

export default function FinanceLearnIndexPage() {
  return (
    <>
      <Head>
        <title>Finance Learn Hub — All Personal Finance Guides | Toolisk</title>
        <meta
          name="description"
          content="Browse all Toolisk finance blogs in one place. Learn about EMI, prepayments, FIRE, SIP strategy, inflation, and compound interest with practical examples."
        />
        <meta
          name="keywords"
          content="finance blogs, personal finance guides, EMI guide, FIRE guide, SIP strategy, compound interest articles"
        />
        <link rel="canonical" href="https://toolisk.com/finance/learn" />
        <meta property="og:title" content="Finance Learn Hub — Toolisk" />
        <meta
          property="og:description"
          content="Read all finance guides and tutorials from Toolisk in one organized place."
        />
        <meta property="og:url" content="https://toolisk.com/finance/learn" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <article className="max-w-6xl mx-auto px-4 py-10">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Finance Learn Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Personal Finance Blogs & Guides
            </h1>
            <p className="text-slate-600 max-w-3xl leading-relaxed">
              Explore practical, plain-English finance articles to make better money decisions. Every guide links to the relevant calculator so you can apply what you learn immediately.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6" itemScope itemType="https://schema.org/CollectionPage">
            {financeArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/finance/learn/${article.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 p-6 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <time>{new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                  <span className="font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">Read article →</span>
                </div>
              </Link>
            ))}
          </section>
        </article>
      </div>
    </>
  );
}