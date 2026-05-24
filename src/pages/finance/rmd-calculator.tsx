import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

const RMDCalculator = dynamic(
  () => import('../../components/RMDCalculator/RMDCalculator'),
  { ssr: false },
);

const SLUG = '/finance/rmd-calculator';

const FAQS = [
  {
    q: 'What age do I have to start taking RMDs?',
    a: 'Under the SECURE 2.0 Act (2022), the RMD starting age is 73 for anyone who turns 72 after December 31, 2022. It rises further to 75 for those born in 1960 or later (starting in 2033). Roth IRAs are not subject to RMDs during the original owner\'s lifetime — only traditional IRAs, 401(k)s, 403(b)s, and similar pre-tax accounts are affected.',
  },
  {
    q: 'What is the penalty for missing an RMD?',
    a: 'Under SECURE 2.0, the penalty for failing to take a required minimum distribution dropped from 50% to 25% of the missed amount. If you correct the shortfall within two years (the "correction window"), the penalty is further reduced to 10%. File IRS Form 5329 to report and pay the excise tax.',
  },
  {
    q: 'Can I delay my first RMD?',
    a: 'Yes — your very first RMD can be deferred until April 1 of the year after you turn 73. However, this means you must take two RMDs in that second year (one by April 1 and the normal second-year RMD by December 31), which could push you into a higher tax bracket. Most advisors recommend taking the first RMD in the year you turn 73 to smooth out income.',
  },
  {
    q: 'Do RMDs affect Social Security taxes or Medicare premiums?',
    a: 'Yes on both counts. RMDs count as ordinary income and can push more of your Social Security benefits into taxable territory (up to 85% becomes taxable). They also count toward the MAGI thresholds for Medicare IRMAA surcharges — the income-related adjustment to Part B and Part D premiums. Roth conversions before age 73 are a common strategy to reduce future RMD size and these secondary effects.',
  },
];

export default function RMDCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'RMD Calculator',
    slug: SLUG,
    description: 'Calculate your Required Minimum Distribution from a Traditional IRA, 401(k), or other pre-tax retirement account and project future RMDs.',
    category: 'FinanceApplication',
    featureList: 'IRS Uniform Lifetime Table, Current-year RMD, Future-year projection, Federal tax estimate, Balance projection chart, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>RMD Calculator: Required Minimum Distribution | Toolisk</title>
        <meta name="description" content="Calculate your Required Minimum Distribution using the IRS Uniform Lifetime Table. Project RMDs from your IRA or 401(k) to age 100. Free." />
        <meta name="keywords" content="rmd calculator, required minimum distribution, ira rmd, 401k rmd, uniform lifetime table, rmd age 73, secure act rmd" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="RMD Calculator" />
        <meta property="og:description" content="Compute your IRA or 401(k) Required Minimum Distribution using IRS tables. Project RMDs through retirement." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RMD Calculator | Toolisk" />
        <meta name="twitter:description" content="IRS-table RMD calculation with year-by-year projection to age 100." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell parent="finance" icon="📋" title="RMD Calculator" tagline="Calculate your Required Minimum Distribution from a Traditional IRA, 401(k), or other pre-tax account." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <RMDCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your Required Minimum Distribution using the IRS Uniform Lifetime Table. Project RMDs from your IRA or 401(k) to age 100."
        features={[
          '📋 IRS Uniform Lifetime Table lookup',
          '📊 Current-year RMD calculation',
          '📈 Future-year RMD projection',
          '💰 Federal tax estimate',
          '📉 Balance projection chart',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Enter account details', desc: 'Input your IRA or 401(k) balance as of December 31 of last year.' },
          { title: 'Set your age', desc: 'Enter your current age (must be 73+ for RMDs under SECURE 2.0).' },
          { title: 'Configure assumptions', desc: 'Set expected investment return and marginal tax rate.' },
          { title: 'Review projections', desc: 'See current-year RMD, future RMDs to age 100, and estimated federal tax.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What Is an RMD and Who Must Take One?</h2>
            <p className="text-slate-600 leading-relaxed">A Required Minimum Distribution (RMD) is the minimum amount the IRS requires you to withdraw each year from tax-deferred retirement accounts — Traditional IRAs, SEP IRAs, SIMPLE IRAs, 401(k)s, 403(b)s, 457(b)s, and similar plans. The SECURE 2.0 Act of 2022 raised the RMD starting age to <strong>73</strong> for anyone who hadn't yet turned 72 by the end of 2022, with a further increase to <strong>75</strong> scheduled for those born in 1960 or later.</p>
            <p className="text-slate-600 leading-relaxed">Roth IRAs are a notable exception — they are <em>not</em> subject to RMDs during the original owner's lifetime, making Roth conversions a popular strategy to reduce future mandatory withdrawals.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How This Calculator Projects Future RMDs</h3>
            <p className="text-slate-600 leading-relaxed">Each year's RMD is calculated using the account balance as of December 31 of the <em>prior</em> year divided by a life-expectancy factor from the IRS Uniform Lifetime Table. The calculator runs a year-by-year loop: withdraw the RMD, apply your expected return to the remainder, then compute next year's RMD with the new balance and age.</p>
          </section>
        }
        relatedTools={[
          { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
          { name: 'Roth Conversion Calculator', href: '/finance/roth-conversion-calculator', icon: '🔄' },
          { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏦' },
          { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
        ]}
        relatedArticles={[
          { title: 'Retirement Savings Age Milestones', href: '/finance/learn/retirement-savings-age-milestones' },
        ]}
      />
    </>
  );
}
