import Head from 'next/head';
import RothVsTraditionalIra from '../../components/Finance/RothVsTraditionalIra';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/roth-vs-traditional-ira';

const FAQS = [
  { q: 'What is the difference between a Roth IRA and a Traditional IRA?', a: 'Traditional IRA contributions are pre-tax (deductible) and withdrawals are taxed as ordinary income. Roth IRA contributions are post-tax and qualified withdrawals (after age 59½) are completely tax-free, including all growth.' },
  { q: 'What are the 2026 IRA contribution limits?', a: 'For 2026, the IRA contribution limit is $7,500 for those under 50 and $8,500 for those 50 and older (with the $1,000 catch-up). This is the combined limit across all your IRAs (Roth + Traditional).' },
  { q: 'Are there income limits for Roth IRA contributions?', a: 'Yes. For 2026, single filers with modified AGI above $165,000 phase out, and Married Filing Jointly above $246,000 phase out. High earners can use the backdoor Roth strategy: contribute to a Traditional IRA, then convert to Roth.' },
  { q: 'Which is better, Roth or Traditional?', a: 'It depends on your tax rate now vs in retirement. If your retirement tax rate will be HIGHER than today, Roth wins (pay tax now at the lower rate). If LOWER, Traditional wins (defer tax to the lower rate). If they are equal, the result is mathematically identical.' },
  { q: 'What about Required Minimum Distributions (RMDs)?', a: 'Traditional IRAs require you to start withdrawing minimum amounts at age 73 (RMDs), whether you need the money or not. Roth IRAs have no RMDs during your lifetime — you can leave the money to grow tax-free indefinitely or pass it to heirs.' },
];

export default function RothVsTraditionalIraPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Roth vs Traditional IRA Calculator',
    slug: SLUG,
    description: 'Compare Roth IRA vs Traditional IRA after-tax balances at retirement. Includes side-fund analysis for the Traditional tax savings.',
    category: 'FinanceApplication',
    featureList: 'After-tax comparison, Side fund modeling, RMD vs no-RMD, 2026 limits, Side-by-side chart',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Roth IRA vs Traditional IRA Calculator — 2026 Tax Comparison | Toolisk</title>
        <meta name="description" content="Compare Roth IRA vs Traditional IRA with after-tax balance at retirement. Includes side fund modeling for Traditional tax savings, 2026 limits, and the RMD impact." />
        <meta name="keywords" content="roth vs traditional ira, ira calculator, roth ira contribution limits 2026, traditional ira tax deduction, ira tax calculator, retirement account comparison" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Roth vs Traditional IRA Calculator | Toolisk" />
        <meta property="og:description" content="See which IRA wins after taxes — Roth or Traditional + side fund." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="⚖️" title="Roth vs Traditional IRA" tagline="See which IRA wins after taxes — including the side-fund analysis for the Traditional tax savings." gradient="from-emerald-600 via-blue-600 to-indigo-600">
        <RothVsTraditionalIra />
      </ToolShell>

      <ToolSEOContent
        description="Compare a Roth IRA and a Traditional IRA on an apples-to-apples after-tax basis. The calculator models the Traditional + side fund correctly: when you contribute pre-tax, the tax savings get invested in a taxable account at the same return, then taxed at long-term capital gains rates on withdrawal. This is the only fair comparison."
        features={[
          '⚖️ True after-tax comparison (not just balance comparison)',
          '💰 Side-fund modeling for Traditional tax savings',
          '🎯 2026 IRA contribution limits and catch-up',
          '📊 Side-by-side bar chart',
          '🔁 Adjusts for current vs retirement tax rate',
          '⏰ Shows RMD impact and Roth withdrawal flexibility',
        ]}
        steps={[
          { title: 'Enter your tax rates', desc: 'Current marginal rate (federal + state) and your expected retirement rate.' },
          { title: 'Set contribution and timeline', desc: 'How much per year and how many years until retirement.' },
          { title: 'Read the verdict', desc: 'The winner is the option with the higher after-tax balance at retirement.' },
          { title: 'Sanity-check with the table', desc: 'The comparison table shows the structural differences (RMDs, income limits, etc.) that matter beyond the math.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why most simple IRA calculators are wrong</h2>
            <p className="text-slate-600 leading-relaxed">
              A common mistake is comparing the gross balance of a Traditional IRA to a Roth IRA without accounting for the pre-tax savings. If you contribute $7,500 to a Traditional, the IRS effectively gives you back $1,800 in tax savings (at a 24% rate). If you don&apos;t reinvest that $1,800, the comparison is unfair to Traditional. This calculator assumes you reinvest the savings in a taxable account — the only honest comparison.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">The forgotten tiebreakers</h3>
            <p className="text-slate-600 leading-relaxed">
              When the math is close, the tiebreakers matter: <strong>Roth has no RMDs</strong>, so you can let it compound indefinitely or leave it to heirs. <strong>Roth contributions can be withdrawn anytime tax-free</strong>, making it more flexible if you might need the money before 59½. <strong>Traditional gives you the deduction now</strong>, which can drop you into a lower bracket and unlock other tax benefits.
            </p>
          </section>
        }
        relatedTools={[
          { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
          { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
          { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
        ]}
        relatedArticles={[
          { title: 'Backdoor Roth Strategy', href: '/finance/learn/backdoor-roth-strategy' },
          { title: 'Asset Allocation by Age', href: '/finance/learn/asset-allocation-by-age' },
        ]}
      />
    </>
  );
}
