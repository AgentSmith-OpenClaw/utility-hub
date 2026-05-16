import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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

      <RMDCalculator />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is an RMD and Who Must Take One?</h2>
          <p className="text-slate-600 mb-3">A Required Minimum Distribution (RMD) is the minimum amount the IRS requires you to withdraw each year from tax-deferred retirement accounts — Traditional IRAs, SEP IRAs, SIMPLE IRAs, 401(k)s, 403(b)s, 457(b)s, and similar plans. Because contributions to these accounts were made pre-tax, the IRS eventually mandates withdrawals so the funds get taxed as ordinary income.</p>
          <p className="text-slate-600 mb-3">The SECURE 2.0 Act of 2022 raised the RMD starting age to <strong>73</strong> for anyone who hadn't yet turned 72 by the end of 2022, with a further increase to <strong>75</strong> scheduled for those born in 1960 or later. Roth IRAs are a notable exception — they are <em>not</em> subject to RMDs during the original owner's lifetime, making Roth conversions a popular strategy to reduce future mandatory withdrawals.</p>
          <p className="text-slate-600">Each year's RMD is calculated using the account balance as of December 31 of the <em>prior</em> year divided by a life-expectancy factor from an IRS table. This calculator uses the <strong>Uniform Lifetime Table</strong> (IRS Publication 590-B, Table III), which applies to the vast majority of account owners. A separate Joint Life and Last Survivor Table applies only when the sole beneficiary is a spouse more than 10 years younger.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How This Calculator Projects Future RMDs</h2>
          <p className="text-slate-600 mb-3">The formula for each year's RMD is straightforward: <code className="bg-slate-100 px-1 rounded">RMD = Prior-Year-End Balance ÷ Distribution Period</code>, where the distribution period comes from the IRS table for your age. What makes projection complex is that the balance itself changes each year — it's reduced by the RMD withdrawal, then grown by investment returns before the next year's calculation.</p>
          <p className="text-slate-600 mb-3">This calculator runs a year-by-year loop: withdraw the RMD, apply your expected return to the remainder, then compute next year's RMD with the new balance and age. The result is a projection you can trace from age 73 to any target age (default 100), showing both the growing RMD amounts (as the distribution period shrinks with age) and the declining account balance.</p>
          <p className="text-slate-600">An important nuance: your first RMD can technically be deferred to April 1 of the year <em>after</em> you turn 73. Most advisors recommend against deferral because taking two RMDs in one calendar year compounds tax impact. This calculator uses the simpler assumption that you take each RMD in the year it's due.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Worked Example</h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-slate-700 mb-2"><strong>Scenario:</strong> $425,000 IRA balance as of Dec 31, account owner age 73, 22% marginal rate, 5.5% expected return.</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Distribution period at age 73 (Uniform Lifetime Table) = <strong>26.5</strong></li>
              <li>Year-1 RMD = $425,000 ÷ 26.5 = <strong>$16,038</strong></li>
              <li>Estimated federal tax (22%) = <strong>$3,528</strong></li>
              <li>Net after-tax distribution = <strong>$12,509</strong></li>
              <li>Remaining balance grows: ($425,000 − $16,038) × 1.055 = <strong>$432,137</strong> enters next year</li>
              <li>Year-2 RMD (age 74, divisor 25.5) = $432,137 ÷ 25.5 = <strong>$16,946</strong></li>
            </ul>
            <p className="text-slate-500 text-sm mt-3">RMD amounts grow each year as the distribution period shrinks — even if the balance stays flat. At higher return rates, the balance grows faster than withdrawals, so RMDs can increase substantially in dollar terms.</p>
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
            <li><Link href="/finance/roth-conversion-calculator" className="text-indigo-600 hover:underline">Roth Conversion Calculator</Link> — Convert pre-tax balances to reduce future RMDs.</li>
            <li><Link href="/finance/annuity-calculator" className="text-indigo-600 hover:underline">Annuity Calculator</Link> — Turn IRA withdrawals into a guaranteed income stream.</li>
            <li><Link href="/finance/reverse-mortgage-calculator" className="text-indigo-600 hover:underline">Reverse Mortgage Calculator</Link> — Other options for retirement income.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
