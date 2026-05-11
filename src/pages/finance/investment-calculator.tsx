import Head from 'next/head';
import InvestmentCalculator from '../../components/Finance/InvestmentCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/investment-calculator';

const FAQS = [
  { q: 'What is a realistic long-term return for stocks?', a: 'The S&P 500 has averaged around 10% annual nominal return (7% real, after inflation) since 1957. For planning, assume 7% real return — anything higher is overly optimistic and risks under-saving.' },
  { q: 'Is lump sum or DCA better?', a: 'Historically, lump sum beats dollar-cost averaging about 70% of the time because the market trends up over long periods, so getting money invested sooner means more compounding. DCA is better when you fear bad timing — it smooths volatility but accepts a lower expected return.' },
  { q: 'How does inflation affect my returns?', a: 'Inflation reduces the purchasing power of your future balance. A 7% nominal return with 3% inflation gives a 4% real return. The "Real value" card on this calculator shows what your future balance is worth in today\'s dollars.' },
  { q: 'What is a step-up contribution?', a: 'A step-up means increasing your monthly contribution each year, typically matching salary growth. A 3% annual step-up roughly doubles your final balance over 30 years compared to flat contributions, since you contribute more in your higher-earning years.' },
  { q: 'Why is compound growth so powerful?', a: 'Compounding earns returns on prior returns. $1,000 invested at 8% becomes $4,661 in 20 years (4.7×) but $46,901 in 50 years (47×). The first 20 years feel slow; the last 20 years grow exponentially. This is why starting early matters so much.' },
];

export default function InvestmentCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Investment Calculator',
    slug: SLUG,
    description: 'Project investment growth from lump sum + monthly contributions. Includes inflation adjustment, annual step-up, and DCA vs lump-sum comparison.',
    category: 'FinanceApplication',
    featureList: 'Multi-currency, Inflation-adjusted real value, Annual step-up, DCA vs lump-sum, Year-by-year chart',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Investment Calculator — Lump Sum + Monthly Contributions with Inflation | Toolisk</title>
        <meta name="description" content="Free investment growth calculator. Project lump-sum + monthly contributions over time with inflation adjustment, annual step-up, and DCA vs lump-sum comparison. Multi-currency." />
        <meta name="keywords" content="investment calculator, compound interest calculator, dca calculator, lump sum vs dca, future value calculator, investment growth, retirement calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Investment Calculator | Toolisk" />
        <meta property="og:description" content="Project investment growth with inflation adjustment and step-up contributions." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="📈" title="Investment Calculator" tagline="Project lump-sum + monthly contributions with inflation, step-ups, and a real DCA vs lump-sum comparison." gradient="from-emerald-600 via-green-600 to-lime-500">
        <InvestmentCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A complete investment growth calculator. Combine an initial lump sum with monthly contributions, set an expected return, and see your projected balance year by year. Built-in inflation adjustment shows you the real purchasing power of your future balance, and an annual step-up models the contribution increases that come with raises."
        features={[
          '💰 Multi-currency: USD, EUR, GBP, AUD, CAD, INR',
          '📊 Year-by-year area chart with three layers',
          '💵 Inflation-adjusted real value of future balance',
          '📈 Annual step-up for raise-driven contribution growth',
          '⚖️ Lump sum vs DCA side-by-side comparison',
          '⚡ Live updates — no submit button',
        ]}
        steps={[
          { title: 'Enter your starting amount', desc: 'Initial lump sum and monthly contribution.' },
          { title: 'Set the timeline and return', desc: 'Years to invest and expected annual return (7–8% is realistic for stock-heavy portfolios).' },
          { title: 'Add inflation and step-up', desc: 'Inflation shows real value; step-up grows monthly contributions each year.' },
          { title: 'Compare strategies', desc: 'See lump sum vs DCA at the bottom — same total invested, very different outcomes.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Real returns are what matters</h2>
            <p className="text-slate-600 leading-relaxed">
              A nominal balance of $2 million in 30 years sounds amazing — until you realize that with 3% inflation, it has the purchasing power of about $824,000 in today&apos;s dollars. The "Real value" card on this calculator shows the inflation-adjusted balance, which is the only number that matters for retirement planning.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Why step-ups matter</h3>
            <p className="text-slate-600 leading-relaxed">
              Most people contribute a fixed dollar amount and never increase it. But your raises grow with inflation and career progression. Stepping up your contribution by 3–5% annually roughly doubles your final balance over 30 years compared to flat contributions, because you save more in your highest-earning years (when it compounds more aggressively).
            </p>
          </section>
        }
        relatedTools={[
          { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
          { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
          { name: 'Compound Interest', href: '/finance/compound-interest-calculator', icon: '📊' },
        ]}
        relatedArticles={[
          { title: 'Dollar-Cost Averaging vs Lump Sum', href: '/finance/learn/dollar-cost-averaging-vs-lump-sum' },
          { title: 'Asset Allocation by Age', href: '/finance/learn/asset-allocation-by-age' },
        ]}
      />
    </>
  );
}
