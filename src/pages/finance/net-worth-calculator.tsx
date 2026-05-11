import Head from 'next/head';
import NetWorthCalculator from '../../components/Finance/NetWorthCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/net-worth-calculator';

const FAQS = [
  { q: 'What is net worth?', a: 'Net worth is the value of everything you own (assets) minus everything you owe (liabilities). It is the single best snapshot of financial health and the metric you should track over time, regardless of income.' },
  { q: 'Should I include my home in net worth?', a: 'Yes — your home equity (market value minus mortgage balance) is a real asset. However, many planners track "investable net worth" separately, which excludes your primary residence and personal vehicles. Both numbers tell different stories.' },
  { q: 'What is a good net worth by age?', a: 'A common benchmark: net worth = (age × pretax income) ÷ 10. So a 35-year-old earning $80k would target $280k. The US median by age (per Federal Reserve SCF): ~$39k for under 35, ~$135k for 35–44, ~$250k for 45–54, ~$365k for 55–64.' },
  { q: 'How often should I update net worth?', a: 'Monthly is ideal — it takes 5 minutes and creates the data trail to spot trends. Quarterly is the practical minimum. Annual is too infrequent — you miss the feedback loop that makes financial habits stick.' },
  { q: 'Why is my net worth negative?', a: 'Negative net worth is normal early in life — student loans, mortgages, and car loans frequently exceed initial assets. The trajectory matters more than the snapshot. As long as net worth is trending up year over year, you are on the right path.' },
];

export default function NetWorthCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Net Worth Calculator',
    slug: SLUG,
    description: 'Calculate your net worth (assets minus liabilities) with editable categories, asset allocation pie chart, and US benchmark comparison by age.',
    category: 'FinanceApplication',
    featureList: 'Editable assets and liabilities, Multi-currency, Asset pie chart, US benchmark by age, Add/remove rows',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Net Worth Calculator — Track Assets & Liabilities | Toolisk</title>
        <meta name="description" content="Free net worth calculator with editable asset and liability categories, allocation pie chart, and US benchmark comparison by age. Multi-currency support." />
        <meta name="keywords" content="net worth calculator, net worth tracker, assets and liabilities calculator, net worth by age, financial health calculator, wealth calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Net Worth Calculator | Toolisk" />
        <meta property="og:description" content="Track your net worth with allocation chart and US age benchmarks." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="📊" title="Net Worth Calculator" tagline="Add up your assets, subtract liabilities, and see how you compare to US benchmarks by age." gradient="from-indigo-600 via-blue-600 to-cyan-600">
        <NetWorthCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A net worth tracker with editable categories, an asset allocation pie chart, and benchmark comparison against US Federal Reserve age-based percentiles. Add or remove rows to match your situation, switch currencies, and export the breakdown."
        features={[
          '➕ Editable asset and liability rows',
          '🥧 Asset allocation pie chart',
          '📊 US benchmark comparison by age (median + top 10%)',
          '💰 Multi-currency: USD, EUR, GBP, AUD, CAD, INR',
          '⚡ Live updates as you edit',
          '🔒 100% browser-based — nothing uploaded',
        ]}
        steps={[
          { title: 'List your assets', desc: 'Cash, investments, retirement, home, vehicles. Be honest with valuations (Zillow estimate for home, Kelley Blue Book for cars).' },
          { title: 'List your liabilities', desc: 'Mortgage, auto loans, student loans, credit cards, any other debt.' },
          { title: 'See your net worth', desc: 'The headline number is total assets minus total liabilities.' },
          { title: 'Compare to benchmarks', desc: 'Set your age and see how you stack up against US median and top 10% for your bracket.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Net worth vs income — track the right thing</h2>
            <p className="text-slate-600 leading-relaxed">
              Income is what you make; net worth is what you keep. Two people earning $150k can have wildly different net worths depending on lifestyle and savings rate. Tracking net worth shifts the focus from earnings (which you partly control) to wealth (which you fully control through saving, investing, and debt management).
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">The "first $100k" milestone</h3>
            <p className="text-slate-600 leading-relaxed">
              Charlie Munger famously said the first $100k is the hardest. Once you cross it, compound returns start adding noticeably to your balance year over year. A $100k portfolio earning 8% adds $8k/year — about as much as someone saving $666/month from scratch. After $250k, the gap accelerates dramatically.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
          { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
          { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
        ]}
      />
    </>
  );
}
