import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

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

      <ToolShell parent="finance" icon="📊" title="Mortgage Refinance Break-Even Calculator" tagline="Calculate the exact month your refinance pays for itself." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <MortgageRefinanceBreakeven />
      </ToolShell>

      <ToolSEOContent
        description="Calculate the exact month your refinance pays for itself. Compare monthly savings, closing-cost recovery period, and lifetime interest savings."
        features={[
          '📊 Break-even month calculation',
          '💰 Stay-horizon net savings',
          '📈 Monthly P&I comparison',
          '📉 Lifetime interest comparison',
          '📊 Cumulative cost chart',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Enter current loan', desc: 'Input your current balance, interest rate, and remaining term.' },
          { title: 'Enter refinance terms', desc: 'Input the new rate, new term, and closing costs.' },
          { title: 'Set your stay horizon', desc: 'Enter how many years you plan to stay in the home.' },
          { title: 'Review break-even', desc: 'See the break-even month, monthly savings, and net savings over your stay horizon.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What This Calculator Does</h2>
            <p className="text-slate-600 leading-relaxed">A mortgage refinance involves replacing your existing loan with a new one — ideally at a lower interest rate. But refinancing always has a cost: closing fees typically run 2–5% of the loan amount, or $4,000–$10,000 on a $300,000 loan. The core questions every refinance decision requires answering are: <strong>How many months until my accumulated monthly savings cover those closing costs?</strong> And more importantly: <strong>Given how long I actually plan to stay in this home, will I come out ahead?</strong></p>
            <p className="text-slate-600 leading-relaxed">This calculator goes beyond a plain mortgage calculator by modeling both the <em>break-even point</em> (when savings offset costs) and the <em>stay-horizon net savings</em> — the actual dollars you pocket if you stay for your specified number of years. The distinction matters because lifetime interest savings can be misleading: resetting from a 27-year remaining term to a new 30-year loan looks attractive on a per-month basis but adds years of compounding interest.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How Break-Even Is Computed</h3>
            <p className="text-slate-600 leading-relaxed">The break-even calculation is straightforward: divide your upfront closing costs by the monthly payment reduction. If closing costs are $5,500 and your new payment is $242 lower than your current payment, break-even = ⌈$5,500 ÷ $242⌉ = 23 months.</p>
            <p className="text-slate-600 leading-relaxed">A subtlety worth noting: <em>lower rate ≠ savings if the term resets.</em> Dropping from 6.75% with 27 years left to 5.5% over a new 30-year loan stretches your debt by 3 years. The calculator surfaces this "lifetime interest savings" figure with a clear sign — negative means the term reset hurt you in the long run.</p>
          </section>
        }
        relatedTools={[
          { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
          { name: 'HELOC Calculator', href: '/finance/heloc-calculator', icon: '💳' },
          { name: 'Buy vs Rent Calculator', href: '/finance/buy-vs-rent-calculator', icon: '🏘️' },
        ]}
        relatedArticles={[
          { title: 'When Mortgage Refinance Is Worth It', href: '/finance/learn/when-mortgage-refinance-is-worth-it' },
          { title: 'Mortgage Refinance Break-Even', href: '/finance/learn/mortgage-refinance-break-even' },
        ]}
      />
    </>
  );
}
