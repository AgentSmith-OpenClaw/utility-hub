import Head from 'next/head';
import SocialSecurityCalculator from '../../components/Finance/SocialSecurityCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/finance/social-security-calculator';

const FAQS = [
  {
    q: 'Should I claim Social Security at 62 or wait until 67?',
    a: 'It depends on your health and break-even math. Claiming at 62 versus FRA (67 for those born 1960+) reduces your monthly benefit by about 30%. The break-even age — where total lifetime benefits equalize — typically falls around age 78–80. If you expect to live past 80, waiting usually wins on cumulative dollars. If your health is poor or you need income now, claiming early can make sense.',
  },
  {
    q: 'What is the Social Security break-even age?',
    a: 'The break-even age is when the cumulative benefits from delaying surpass what you would have collected by claiming earlier. For claiming 62 vs 67, break-even is typically around age 78–79. For 67 vs 70, it is around age 82–83. Use the cumulative chart in this calculator to see exactly where the lines cross for your benefit amount.',
  },
  {
    q: 'How much does Social Security increase for each year you delay past 62?',
    a: 'From FRA to 70, benefits grow at 8% per year (delayed retirement credits). Before FRA, each month of early claiming reduces benefits by 5/9% per month for the first 36 months and 5/12% per month beyond that. The total swing from claiming at 62 vs 70 is roughly 76–77% more monthly benefit for waiting — a dramatic difference if you live into your 80s.',
  },
  {
    q: 'What is Full Retirement Age (FRA) and how is it determined?',
    a: 'FRA is the age at which you receive 100% of your calculated benefit — no reduction for early claiming, no credit for late claiming. It is determined by birth year: born 1954 or earlier = FRA 66; born 1955 = 66 + 2 months; born 1960+ = 67. This calculator uses SSA\'s exact schedule.',
  },
  {
    q: 'Are Social Security benefits taxable?',
    a: 'Up to 85% of your Social Security benefit can be taxable at the federal level if your combined income (AGI + non-taxable interest + half of SS benefit) exceeds $34,000 (single) or $44,000 (married filing jointly). Eleven states also tax SS benefits. This calculator shows gross benefit amounts; run the post-tax income through a tax calculator to get net figures.',
  },
  {
    q: 'How do spousal Social Security benefits work?',
    a: 'A spouse can claim up to 50% of the higher earner\'s FRA benefit — even if the spouse never worked. This "spousal benefit" has its own early-claiming reduction if taken before the spouse\'s FRA. Survivor benefits are up to 100% of the deceased spouse\'s benefit. Toggle "Include spousal +50%" in this calculator to model combined household benefits.',
  },
];

export default function SocialSecurityCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Social Security Calculator',
    slug: SLUG,
    description:
      'Free Social Security calculator — compare monthly benefits and lifetime totals for claiming at 62, 65, 67, or 70. Break-even analysis, cumulative chart, and optimal claiming recommendation.',
    category: 'FinanceApplication',
    featureList:
      'Monthly benefit at any claiming age, Lifetime cumulative comparison, Break-even ages, FRA schedule, Spousal benefit toggle',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Social Security Calculator — When Should You Claim? | Toolisk</title>
        <meta
          name="description"
          content="Free Social Security calculator. Compare monthly benefits and lifetime totals for claiming at 62, 65, 67, or 70. Break-even analysis, cumulative line chart, and spousal benefit option."
        />
        <meta
          name="keywords"
          content="social security calculator, social security benefits calculator, when to take social security, social security break even calculator, social security 62 vs 67, optimal social security age, delayed retirement credit calculator"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Social Security Calculator — When Should You Claim? | Toolisk" />
        <meta
          property="og:description"
          content="Compare Social Security benefits at 62 vs 67 vs 70 — monthly income, lifetime totals, and break-even ages."
        />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        parent="finance"
        icon="🏛️"
        title="Social Security Calculator"
        tagline="Compare monthly benefits and lifetime totals for claiming at 62, 65, 67, or 70. Break-even analysis, cumulative chart, and spousal benefit modeling."
        gradient="from-slate-700 via-blue-700 to-indigo-700"
      >
        <SocialSecurityCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A Social Security benefit calculator that shows you the full picture: monthly benefit at each possible claiming age (62, 65, FRA, 70), cumulative lifetime totals, cross-over break-even ages, and an optimal claiming recommendation based on your expected lifespan. Works with the exact SSA Full Retirement Age schedule by birth year."
        features={[
          '🏛️ Monthly benefit at 62, 65, 67, and 70',
          '📈 Cumulative lifetime chart with break-even crossover',
          '🧮 Exact SSA Full Retirement Age by birth year',
          '⚖️ Break-even age between each claiming strategy pair',
          '👫 Spousal benefit toggle (+50% of FRA benefit)',
          '💾 PDF / Excel export with full scenario tables',
        ]}
        steps={[
          { title: 'Enter birth year', desc: 'Determines your Full Retirement Age (66–67 depending on year).' },
          { title: 'Enter FRA monthly benefit', desc: 'Find this on your SSA statement at ssa.gov/myaccount. It is the benefit you get at exactly FRA.' },
          { title: 'Choose claiming age', desc: 'Toggle between 62, 65, 67, and 70 to see how monthly amount changes.' },
          { title: 'Set expected lifespan', desc: 'Slide to your lifespan assumption — this drives lifetime totals and the optimal strategy recommendation.' },
          { title: 'Read the analysis', desc: 'Monthly benefits, cumulative chart, break-even ages, and recommendation update instantly.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The math behind early vs delayed claiming</h2>
            <p className="text-slate-600 leading-relaxed">
              Every month you claim before FRA permanently reduces your benefit. Every month you delay past FRA (up to 70) permanently increases it. The SSA uses two rates: for the first 36 months before FRA, benefits are reduced by 5/9% per month (6.67%/yr). For months beyond that, the reduction is 5/12% per month (5%/yr). Past FRA, the credit is a flat 8%/yr — one of the best risk-free returns in finance.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">FRA by birth year</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="text-left px-3 py-2 rounded-tl-lg">Birth Year</th>
                    <th className="text-right px-3 py-2 rounded-tr-lg">Full Retirement Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="px-3 py-2">1954 and earlier</td><td className="px-3 py-2 text-right">66</td></tr>
                  <tr><td className="px-3 py-2">1955</td><td className="px-3 py-2 text-right">66 + 2 months</td></tr>
                  <tr><td className="px-3 py-2">1956</td><td className="px-3 py-2 text-right">66 + 4 months</td></tr>
                  <tr><td className="px-3 py-2">1957</td><td className="px-3 py-2 text-right">66 + 6 months</td></tr>
                  <tr><td className="px-3 py-2">1958</td><td className="px-3 py-2 text-right">66 + 8 months</td></tr>
                  <tr><td className="px-3 py-2">1959</td><td className="px-3 py-2 text-right">66 + 10 months</td></tr>
                  <tr><td className="px-3 py-2">1960 and later</td><td className="px-3 py-2 text-right">67</td></tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-4">When to claim: a framework</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Claim early (62–64)</strong> if you have a serious health condition, need income to retire, or a spouse with a significantly lower benefit who will receive the spousal bump</li>
              <li><strong>Claim at FRA (66–67)</strong> if you are unsure of longevity or want a clean default — no reduction, no special calculation needed</li>
              <li><strong>Delay to 70</strong> if you are in good health, have other income sources, and want to maximize the survivor benefit for a spouse</li>
              <li><strong>Coordinate spouses:</strong> The lower earner claims early for household income; the higher earner delays to 70 to maximize the survivor benefit</li>
            </ul>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-sm text-indigo-900">
              <strong>Key insight:</strong> Delaying to 70 is essentially buying longevity insurance. The 8%/yr delayed credit is guaranteed and inflation-adjusted — a return that no Treasury bond or annuity can match with the same safety. If you have a family history of longevity and alternative income to bridge the gap, delay is almost always the mathematically optimal strategy.
            </div>
          </section>
        }
        relatedTools={[
          { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
          { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
          { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
        ]}
      />
    </>
  );
}
