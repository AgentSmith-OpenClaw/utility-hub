import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';
import DisclaimerBanner from '../../components/Tools/DisclaimerBanner';

const MortgageRefinanceBreakeven = dynamic(
  () => import('../../components/MortgageRefinanceBreakeven/MortgageRefinanceBreakeven'),
  { ssr: false },
);

const SLUG = '/finance/mortgage-refinance-breakeven-calculator';

const FAQS = [
  {
    q: 'Should I roll closing costs into the loan?',
    a: 'Rolling closing costs into the loan eliminates the upfront payment but increases your principal, meaning you pay interest on those costs for the life of the loan. For a $5,500 roll-in at 5.5% over 30 years, you pay about $5,800 extra in interest — roughly doubling the effective cost. Pay upfront if you have the cash and plan to stay past break-even.',
  },
  {
    q: 'Does a "no-closing-cost" refinance ever beat paying upfront?',
    a: 'A no-closing-cost refi trades a slightly higher interest rate (typically +0.125–0.25%) for zero upfront fees. If you plan to sell or refinance again within 3–5 years, the higher rate usually costs less than paying $5,000–$8,000 upfront. If you plan to stay 10+ years, paying upfront wins almost every time. Use this calculator to compare scenarios directly.',
  },
  {
    q: 'How does a cash-out refinance change break-even?',
    a: 'Cash-out increases your new loan balance, raising your new monthly payment and eroding the monthly savings. It can push break-even past your planned stay horizon. However, if you use the cash to eliminate higher-rate debt (e.g., credit cards at 20%+), the combined savings may still make it worthwhile. Model each scenario separately.',
  },
  {
    q: 'What rate drop justifies a refinance?',
    a: 'The old "need at least 1%" rule is outdated. What matters is: (monthly savings) × (months you stay) > closing costs. On a $300k loan, dropping from 7% to 6.5% saves about $100/month. With $6,000 in closing costs, break-even is 60 months — fine if you plan to stay 7+ years, bad if you plan to sell in 4. There is no universal rate-drop threshold; run your specific numbers.',
  },
];

export default function MortgageRefinanceBreakevenPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Mortgage Refinance Break-Even Calculator',
    slug: SLUG,
    description: 'Calculate the exact month your refinance pays for itself. Compare monthly savings, closing-cost recovery period, and lifetime interest savings.',
    category: 'FinanceApplication',
    featureList: 'Break-even months, Stay-horizon net savings, Monthly P&I comparison, Lifetime interest comparison, Cumulative cost chart, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Mortgage Refinance Break-Even Calculator | Toolisk</title>
        <meta name="description" content="See exactly when a refinance pays off. Compare monthly savings, closing-cost recovery & lifetime interest. Free, instant." />
        <meta name="keywords" content="mortgage refinance calculator, refinance break-even, refi calculator, mortgage savings, closing cost recovery, lifetime interest, refinance worth it" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Mortgage Refinance Break-Even Calculator" />
        <meta property="og:description" content="Calculate the exact month your refinance pays for itself plus total lifetime savings." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Refinance Break-Even Calculator | Toolisk" />
        <meta name="twitter:description" content="See exactly when a refinance pays off — monthly savings, break-even, and lifetime interest." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <MortgageRefinanceBreakeven />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <article className="prose prose-slate max-w-none">
          <h2>What This Calculator Does</h2>
          <p>
            A mortgage refinance involves replacing your existing loan with a new one — ideally at a lower interest rate. But refinancing always has a cost: closing fees typically run 2–5% of the loan amount, or $4,000–$10,000 on a $300,000 loan. The core questions every refinance decision requires answering are: <strong>How many months until my accumulated monthly savings cover those closing costs?</strong> And more importantly: <strong>Given how long I actually plan to stay in this home, will I come out ahead?</strong>
          </p>
          <p>
            This calculator goes beyond a plain mortgage calculator by modeling both the <em>break-even point</em> (when savings offset costs) and the <em>stay-horizon net savings</em> — the actual dollars you pocket if you stay for your specified number of years. The distinction matters because lifetime interest savings can be misleading: resetting from a 27-year remaining term to a new 30-year loan looks attractive on a per-month basis but adds years of compounding interest that can make the refinance net-negative over a lifetime even if you save money monthly.
          </p>
          <p>
            Use this tool before calling your lender, before locking a rate, and again every time rates drop significantly. Bookmark your results and revisit when market rates move.
          </p>

          <h2>How Break-Even Is Computed</h2>
          <p>
            The break-even calculation is straightforward: divide your upfront closing costs by the monthly payment reduction. If closing costs are $5,500 and your new payment is $242 lower than your current payment, break-even = ⌈$5,500 ÷ $242⌉ = 23 months. You recover the investment at month 23.
          </p>
          <p>
            But break-even alone is incomplete. Someone who plans to sell in 18 months has a clear answer: don't refinance. Someone staying 20 years also has a clear answer: absolutely refinance. The ambiguity lives in the 3–8 year range — and that's where the <strong>stay-horizon net savings</strong> number is most useful. It computes total payments under each scenario over exactly the years you plan to stay, making the comparison apples-to-apples.
          </p>
          <p>
            A subtlety worth noting: <em>lower rate ≠ savings if the term resets.</em> Dropping from 6.75% with 27 years left to 5.5% over a new 30-year loan stretches your debt by 3 years. On a 10-year horizon you may save money monthly, but on a lifetime basis you end up paying more interest because you extended the amortization window. The calculator surfaces this "lifetime interest savings" figure with a clear sign — negative means the term reset hurt you in the long run, even if you got a lower rate.
          </p>

          <h2>Worked Numeric Example</h2>
          <p>
            A homeowner has a <strong>$280,000 balance at 6.75%</strong> with <strong>27 years remaining</strong>. Their monthly principal + interest is approximately <strong>$1,832</strong>. A refinance offer: <strong>5.50% over 30 years, $5,500 closing costs paid upfront</strong>.
          </p>
          <p>
            New monthly P&I ≈ <strong>$1,590</strong>. Monthly savings = $1,832 − $1,590 = <strong>$242</strong>. Break-even = ⌈$5,500 ÷ $242⌉ = <strong>23 months</strong>. If the homeowner stays <strong>10 years</strong>, they save 120 × $242 = $29,040 in payments minus $5,500 closing costs = <strong>$23,540 net savings on a 10-year horizon</strong>.
          </p>
          <p>
            However, lifetime interest tells a different story. The original loan had 27 years remaining — the new loan resets to 30. Compounding over the extra 3 years, total lifetime interest <em>rises</em> by roughly $46,000, even at the lower rate. This illustrates why <strong>stay-horizon net savings, not lifetime interest, should drive your decision</strong> — unless you genuinely plan to keep the loan for its entire term.
          </p>

          <h2>Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-5 not-prose mb-3">
              <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </article>

        {/* Related Tools */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related Calculators</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: '/finance/mortgage-calculator', title: '🏠 Mortgage Calculator', desc: 'Estimate monthly payment for a new home purchase including PITI.' },
              { href: '/finance/heloc-calculator', title: '💳 HELOC Calculator', desc: 'Model home equity line of credit payments through draw and repayment phases.' },
              { href: '/finance/amortization-calculator', title: '📊 Amortization Calculator', desc: 'See month-by-month principal vs interest breakdown for any loan.' },
              { href: '/finance/house-affordability-calculator', title: '🏡 House Affordability Calculator', desc: 'Find the maximum home price you can afford based on income and debts.' },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all">
                <div className="font-semibold text-slate-900 mb-1">{t.title}</div>
                <p className="text-sm text-slate-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      <DisclaimerBanner type="finance" />
      </div>
    </>
  );
}
