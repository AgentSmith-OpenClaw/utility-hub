import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

const CapitalGainsTaxCalculator = dynamic(
  () => import('../../components/CapitalGainsTax/CapitalGainsTaxCalculator'),
  { ssr: false },
);

const SLUG = '/finance/capital-gains-tax-calculator';

const FAQS = [
  {
    q: 'How is crypto taxed in the US?',
    a: "Cryptocurrency is treated as property by the IRS, not currency. Every time you sell, swap, or spend crypto, it's a taxable event. If you held the crypto for more than 365 days, the gain is long-term (taxed at 0%, 15%, or 20% depending on income). If you held for 365 days or fewer, it's short-term (taxed at ordinary income rates). Mining rewards and staking income are taxed as ordinary income when received. This calculator models standard buy-sell scenarios; cost basis methods (FIFO/LIFO/HIFO) are not modeled but noted.",
  },
  {
    q: "Do I owe tax on a stock I haven't sold?",
    a: "No. Unrealized gains — paper profits on investments you still hold — are not taxed. Capital gains tax is triggered only when you sell, exchange, or otherwise dispose of an asset (a 'realization event'). This is why buy-and-hold strategies are tax-efficient: you defer the tax bill indefinitely and can sometimes avoid it entirely if the assets are passed on at a stepped-up cost basis at death.",
  },
  {
    q: 'How does the wash-sale rule affect my taxes?',
    a: "The wash-sale rule disallows a capital loss if you buy the same or 'substantially identical' security within 30 days before or after the sale. For example, if you sell a stock at a loss and buy it back 10 days later, the loss is disallowed — it's added back to your cost basis in the replacement shares instead. This calculator does not model the wash-sale rule. Cryptocurrency currently has no wash-sale restriction under existing law, though that may change.",
  },
  {
    q: 'Are capital losses deductible against income?',
    a: "Capital losses first offset capital gains of the same type (short-term losses vs. short-term gains, etc.), then any remaining losses offset gains of the opposite type. Net capital losses beyond that can deduct up to $3,000 against ordinary income per year. Excess losses carry forward indefinitely to future tax years. Capital loss carryforwards are valuable and worth tracking — consult a tax professional to ensure you're using them optimally.",
  },
];

export default function CapitalGainsTaxCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Capital Gains Tax Calculator (US 2026)',
    slug: SLUG,
    description: 'Calculate federal short/long-term capital gains tax, NIIT, and state tax on stock, crypto, or property sales. 2026 brackets.',
    category: 'FinanceApplication',
    featureList: '2026 LTCG brackets, Short vs long-term classification, NIIT calculation, Section 121 exclusion, State tax preset, Bracket fill visualization, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Capital Gains Tax Calculator (US 2026) | Toolisk</title>
        <meta name="description" content="Calculate federal short/long-term capital gains tax, NIIT, and state tax on stock, crypto, or property sales. 2026 brackets. Free." />
        <meta name="keywords" content="capital gains tax calculator, long term capital gains, short term capital gains, niit calculator, crypto tax calculator, stock sale tax" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Capital Gains Tax Calculator (US)" />
        <meta property="og:description" content="See federal, NIIT, and state tax on stock, crypto, and real estate sales." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Capital Gains Tax Calculator | Toolisk" />
        <meta name="twitter:description" content="2026 US capital gains tax: federal, NIIT, and state — for stocks, crypto, real estate, and primary residence." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <p className="text-center text-xs text-slate-500 py-2 bg-amber-50 border-b border-amber-100">Estimates only — consult a CPA for your specific situation.</p>
      <ToolShell parent="finance" icon="📊" title="Capital Gains Tax Calculator" tagline="Calculate federal short/long-term capital gains tax, NIIT, and state tax on stock, crypto, or property sales." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <CapitalGainsTaxCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate federal short-term and long-term capital gains tax, Net Investment Income Tax (NIIT), and state tax on stock, crypto, or property sales using 2026 brackets."
        features={[
          '📊 2026 LTCG brackets (0%, 15%, 20%)',
          '📈 Short vs long-term classification',
          '🏥 NIIT 3.8% surtax calculation',
          '🏠 Section 121 primary residence exclusion',
          '🗺️ State tax presets for all 50 states',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Enter sale details', desc: 'Input purchase price, sale price, holding period, and any commissions or fees.' },
          { title: 'Set your income', desc: 'Enter your other ordinary income to determine which LTCG bracket applies.' },
          { title: 'Choose state', desc: 'Select your state for state capital gains tax, or enter a custom rate.' },
          { title: 'Review tax breakdown', desc: 'See federal LTCG, NIIT, state tax, and total effective rate with bracket visualization.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Short-Term vs Long-Term Capital Gains</h2>
            <p className="text-slate-600 leading-relaxed">The most important factor in capital gains tax is how long you held the asset. If you held it for <strong>365 days or fewer</strong>, the gain is <strong>short-term</strong> — taxed at ordinary federal income rates (10% to 37%), exactly like wages. If you held it for <strong>more than 365 days</strong>, the gain is <strong>long-term</strong> — taxed at preferential rates of 0%, 15%, or 20% based on your income.</p>
            <p className="text-slate-600 leading-relaxed">For 2026, the long-term capital gains brackets for a single filer are approximately: 0% on income up to $48,350, 15% from $48,350 to $533,400, and 20% above $533,400. Married filing jointly thresholds are roughly double. Critically, LTCG rates apply to the gain <em>stacked on top of</em> your other ordinary income — so if your ordinary income already exceeds the 0% bracket ceiling, all your long-term gains are taxed at 15% or 20%.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">NIIT, State Tax, and the Section 121 Exclusion</h3>
            <p className="text-slate-600 leading-relaxed"><strong>Net Investment Income Tax (NIIT).</strong> A 3.8% surtax applies to the lesser of (a) your net investment income (including capital gains) or (b) the amount by which your MAGI exceeds $200,000 (single) or $250,000 (married filing jointly). NIIT is separate from — and additive to — the regular capital gains tax. It can push an effective 15% rate to 18.8%, or a 20% rate to 23.8%.</p>
            <p className="text-slate-600 leading-relaxed"><strong>State tax.</strong> State capital gains treatment varies enormously. Florida, Texas, Nevada, Washington (for income), and several others have no state income tax on capital gains. California taxes capital gains as ordinary income — up to 13.3% at the top bracket. This calculator uses a flat state rate with preset rates for all 50 states, which you can override.</p>
            <p className="text-slate-600 leading-relaxed"><strong>Section 121 exclusion.</strong> If you sell your primary residence and lived in it for at least 2 of the last 5 years, you can exclude up to $250,000 of gain (single) or $500,000 (married filing jointly) from tax entirely. Only the gain above the exclusion is taxable. This is one of the most valuable tax breaks in the code — for many homeowners, it makes a home sale largely or entirely tax-free.</p>
          </section>
        }
        relatedTools={[
          { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🧾' },
          { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator', icon: '💵' },
          { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
        ]}
        relatedArticles={[
          { title: 'Tax-Loss Harvesting Explained', href: '/finance/learn/tax-loss-harvesting-explained' },
          { title: 'Capital Gains Tax Strategies', href: '/finance/learn/capital-gains-tax-strategies' },
        ]}
      />
    </>
  );
}
