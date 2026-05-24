import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

const CollegeSavings529Calculator = dynamic(
  () => import('../../components/CollegeSavings529/CollegeSavings529Calculator'),
  { ssr: false },
);

const SLUG = '/finance/529-college-savings-calculator';

const FAQS = [
  {
    q: "Which state's 529 plan should I pick?",
    a: "You can use any state's 529 plan regardless of where you or your child go to school. The key factor is whether your home state offers a tax deduction for contributions. If it does, contribute at least enough to the in-state plan to max out the deduction, then consider opening an additional account in a plan with lower fees or better investment options (Vanguard-based plans in Nevada, Utah, and New York are often recommended). If your state offers no deduction (e.g., California, Florida, Texas), choose based purely on fees and investment options.",
  },
  {
    q: "What if my child doesn't go to college?",
    a: "You have several options. You can change the beneficiary to another family member (a sibling, cousin, or even yourself) with no tax consequences. Starting in 2024, the SECURE 2.0 Act allows rolling unused 529 funds into a Roth IRA for the beneficiary — up to $35,000 lifetime, subject to the annual IRA contribution limit, and the account must be at least 15 years old. You can also withdraw the funds and pay income tax plus a 10% penalty on the earnings (not the contributions). In practice, most families find another use.",
  },
  {
    q: 'Are K-12 tuition payments qualified 529 expenses?',
    a: "Yes — since the Tax Cuts and Jobs Act of 2017, up to $10,000 per year per student can be withdrawn from a 529 for K-12 tuition at public, private, or religious schools. However, only a handful of states conform to this federal rule for state tax purposes. In many states, K-12 withdrawals may be treated as non-qualified at the state level, triggering state income tax and possibly a state penalty on the earnings. Check your state's rules before using 529 funds for K-12.",
  },
  {
    q: 'How does the 529-to-Roth IRA rollover work?',
    a: "Starting in 2024, the SECURE 2.0 Act allows rolling over unused 529 funds directly into a Roth IRA for the beneficiary. Three key rules: (1) The 529 account must be at least 15 years old. (2) Rollovers count against the beneficiary's annual Roth IRA contribution limit ($7,000 in 2025). (3) The lifetime rollover limit is $35,000. This makes overfunding a 529 far less risky — excess funds can become tax-free retirement savings for your child. Contributions (and earnings on them) from the last 5 years are ineligible for rollover.",
  },
];

export default function CollegeSavings529Page() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: '529 College Savings Calculator',
    slug: SLUG,
    description: 'Project 529 plan growth, inflate future college costs, and see the monthly savings needed to fully fund tuition.',
    category: 'FinanceApplication',
    featureList: '529 balance projection, College cost inflation, Funding gap analysis, Recommended monthly contribution, Binary-search PMT solver, State tax savings, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>529 College Savings Calculator | Toolisk</title>
        <meta name="description" content="Project 529 plan growth, inflate future college costs, and see the monthly savings needed to fully fund tuition. Free." />
        <meta name="keywords" content="529 calculator, college savings calculator, 529 plan growth, college cost calculator, tuition savings, 529 contribution calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="529 College Savings Calculator" />
        <meta property="og:description" content="Plan your 529 contributions against inflated future college costs." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="529 College Savings Calculator | Toolisk" />
        <meta name="twitter:description" content="Project 529 growth against inflated college costs and find the monthly contribution to fully fund the goal." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell parent="finance" icon="🎓" title="529 College Savings Calculator" tagline="Project 529 plan growth, inflate future college costs, and see the monthly savings needed." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <CollegeSavings529Calculator />
      </ToolShell>

      <ToolSEOContent
        description="Project 529 plan growth, inflate future college costs, and see the monthly savings needed to fully fund tuition. Supports state tax deductions, multiple children, and binary-search PMT solver."
        features={[
          '🎓 529 balance projection with monthly compounding',
          '📈 College cost inflation modeling',
          '💰 Funding gap analysis',
          '🔢 Binary-search PMT solver for target contribution',
          '🗺️ State tax savings estimates',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Enter child details', desc: 'Input child age, current 529 balance, and monthly contribution.' },
          { title: 'Set college parameters', desc: 'Choose college type, expected annual cost, cost inflation rate, and years of college.' },
          { title: 'Configure returns', desc: 'Set expected investment return and state for tax deduction estimates.' },
          { title: 'Review projection', desc: 'See year-by-year balance growth, college cost projections, and funding gap analysis.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What Is a 529 Plan and How Does It Differ From Other College Savings Vehicles?</h2>
            <p className="text-slate-600 leading-relaxed">A 529 plan is a state-sponsored, tax-advantaged savings account designed specifically for education expenses. While contributions are made with after-tax dollars at the federal level (no federal deduction), growth inside the account is completely tax-free, and withdrawals for qualified education expenses — tuition, fees, room and board, books, computers — are also tax-free. This double tax-free benefit (on growth and withdrawal) distinguishes 529s from taxable brokerage accounts, where both growth and income are taxed annually.</p>
            <p className="text-slate-600 leading-relaxed">Many states sweeten the deal with a state income tax deduction or credit for contributions to their own plan. For example, New York allows a deduction of up to $5,000 per year (single) or $10,000 (married) for contributions to NY's 529 plan. These state benefits can meaningfully reduce the effective cost of contributions.</p>
            <p className="text-slate-600 leading-relaxed">Two important recent changes: First, since 2017 (TCJA), up to $10,000 per year per student can be used tax-free for K-12 tuition (subject to state rules). Second, the SECURE 2.0 Act (2024+) allows rolling unused 529 balances up to $35,000 lifetime into a Roth IRA for the beneficiary — making overfunding far less risky than it once was.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How This Calculator Models Savings, Withdrawals, and Inflation</h3>
            <p className="text-slate-600 leading-relaxed">The calculator uses monthly compounding during the accumulation phase. The annual return is converted to a monthly rate (r = (1 + R)^(1/12) − 1), and the future value formula accounts for both the existing balance (growing as a lump sum) and ongoing monthly contributions (growing as an ordinary annuity). This gives a more accurate projection than simple annual compounding.</p>
            <p className="text-slate-600 leading-relaxed">College cost inflation is modeled year by year. Current annual costs are inflated at your specified rate (default 5%) to each year of college — not just the first year. So if costs today are $30,000/year and inflation is 5%, year-1 of college (13 years out for a 5-year-old) costs about $56,400, and year-4 costs about $65,300.</p>
          </section>
        }
        relatedTools={[
          { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
          { name: 'Inflation Calculator', href: '/finance/inflation-calculator', icon: '📉' },
          { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
        ]}
        relatedArticles={[
          { title: 'Inflation-Proof Investing Guide', href: '/finance/learn/inflation-proof-investing-guide' },
        ]}
      />
    </>
  );
}
