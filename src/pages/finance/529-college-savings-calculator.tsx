import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';
import DisclaimerBanner from '../../components/Tools/DisclaimerBanner';

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

      <CollegeSavings529Calculator />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a 529 Plan and How Does It Differ From Other College Savings Vehicles?</h2>
          <p className="text-slate-600 mb-3">A 529 plan is a state-sponsored, tax-advantaged savings account designed specifically for education expenses. While contributions are made with after-tax dollars at the federal level (no federal deduction), growth inside the account is completely tax-free, and withdrawals for qualified education expenses — tuition, fees, room and board, books, computers — are also tax-free. This double tax-free benefit (on growth and withdrawal) distinguishes 529s from taxable brokerage accounts, where both growth and income are taxed annually.</p>
          <p className="text-slate-600 mb-3">Many states sweeten the deal with a state income tax deduction or credit for contributions to their own plan. For example, New York allows a deduction of up to $5,000 per year (single) or $10,000 (married) for contributions to NY's 529 plan. These state benefits can meaningfully reduce the effective cost of contributions.</p>
          <p className="text-slate-600">Two important recent changes: First, since 2017 (TCJA), up to $10,000 per year per student can be used tax-free for K-12 tuition (subject to state rules). Second, the SECURE 2.0 Act (2024+) allows rolling unused 529 balances up to $35,000 lifetime into a Roth IRA for the beneficiary — making overfunding far less risky than it once was.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How This Calculator Models Savings, Withdrawals, and Inflation</h2>
          <p className="text-slate-600 mb-3">The calculator uses monthly compounding during the accumulation phase. The annual return is converted to a monthly rate (r = (1 + R)^(1/12) − 1), and the future value formula accounts for both the existing balance (growing as a lump sum) and ongoing monthly contributions (growing as an ordinary annuity). This gives a more accurate projection than simple annual compounding.</p>
          <p className="text-slate-600 mb-3">College cost inflation is modeled year by year. Current annual costs are inflated at your specified rate (default 5%) to each year of college — not just the first year. So if costs today are $30,000/year and inflation is 5%, year-1 of college (13 years out for a 5-year-old) costs about $56,400, and year-4 costs about $65,300. This front-loaded withdrawal approach is realistic because college costs are paid at the start of each academic year.</p>
          <p className="text-slate-600">During the college years, the calculator simulates the withdrawal-then-growth cycle: it deducts the year's tuition at the start, then lets the remaining balance grow for another year. This is more accurate than treating college as a simple lump-sum withdrawal. A 5% college cost inflation rate reflects historical College Board data — real college costs have risen significantly faster than general CPI.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Worked Example</h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-slate-700 mb-2"><strong>Scenario:</strong> Child age 5, college starts in 13 years, 4-year college, balance $8,000, $300/month contribution, 6% return, $30,000 current annual cost, 5% cost inflation.</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Monthly rate = (1.06)^(1/12) − 1 ≈ 0.487%</li>
              <li>FV of $8,000 lump sum over 156 months + FV of $300/month annuity ≈ <strong>$95,400</strong></li>
              <li>College year 1 cost: $30,000 × (1.05)^13 ≈ $56,400</li>
              <li>College year 4 cost: $30,000 × (1.05)^16 ≈ $65,300</li>
              <li>Four-year total ≈ <strong>$236,000</strong></li>
              <li>The $95,400 runs out partway through Year 2 → funding shortfall ≈ <strong>$140,000</strong></li>
              <li>To fully fund: binary-search PMT solver recommends ≈ <strong>$840/month</strong></li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="font-semibold text-slate-800 mb-2">{f.q}</h3>
                <p className="text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Related Calculators</h2>
          <ul className="space-y-2 text-slate-600">
            <li><Link href="/finance/hsa-calculator" className="text-indigo-600 hover:underline">HSA Calculator</Link> — Another tax-advantaged account with triple-tax benefits.</li>
            <li><Link href="/finance/roth-conversion-calculator" className="text-indigo-600 hover:underline">Roth Conversion Calculator</Link> — Coordinate 529 and Roth funding strategies.</li>
            <li><Link href="/finance/capital-gains-tax-calculator" className="text-indigo-600 hover:underline">Capital Gains Tax Calculator</Link> — Tax implications of selling investments to fund education.</li>
          </ul>
        </section>
      <DisclaimerBanner type="finance" />
      </div>
    </>
  );
}
