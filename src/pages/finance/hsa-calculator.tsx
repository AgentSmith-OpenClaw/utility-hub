import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';
import DisclaimerBanner from '../../components/Tools/DisclaimerBanner';

const HSACalculator = dynamic(
  () => import('../../components/HSACalculator/HSACalculator'),
  { ssr: false },
);

const SLUG = '/finance/hsa-calculator';

const FAQS = [
  {
    q: 'What is the triple tax advantage of an HSA?',
    a: 'An HSA gives you three tax breaks no other account matches: (1) Contributions are tax-deductible federally — and avoid FICA taxes if made via payroll. (2) Growth inside the HSA is completely tax-free. (3) Withdrawals for qualified medical expenses are tax-free. Compare this to a 401(k), which gives you breaks (1) and (2) but not (3) for most withdrawals.',
  },
  {
    q: 'Can I use an HSA as a retirement account?',
    a: "Yes — after age 65, you can withdraw HSA funds for any reason and pay ordinary income tax (just like a traditional IRA). Before 65, non-medical withdrawals are taxed plus a 20% penalty. Many financial planners recommend 'super-funding' your HSA, paying medical bills out of pocket, and letting the HSA compound tax-free for decades — then using it as a stealth retirement account.",
  },
  {
    q: 'Which states don\'t recognize the HSA federal tax break?',
    a: "California and New Jersey do not conform to the federal HSA tax exclusion. If you live in CA or NJ, your HSA contributions and growth are subject to state income tax, and you should set the state tax rate to 0% in this calculator's state tax field to avoid overstating your savings. All other states follow the federal treatment.",
  },
  {
    q: 'What counts as a qualified HSA expense?',
    a: "Qualified expenses include most medical, dental, and vision costs — deductibles, copays, prescription drugs, dental procedures, eyeglasses, contact lenses, and many over-the-counter items (post-CARES Act). Health insurance premiums generally don't qualify unless you're on COBRA, receiving unemployment, or over 65 paying Medicare premiums. Keep receipts — the IRS can audit HSA withdrawals.",
  },
];

export default function HSACalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'HSA Calculator',
    slug: SLUG,
    description: 'Project your Health Savings Account balance and quantify the triple-tax advantage vs a taxable account. 2026 IRS limits included.',
    category: 'FinanceApplication',
    featureList: '2026 HSA contribution limits, Triple-tax advantage, Federal/FICA/state savings, HSA vs taxable comparison, Balance projection chart, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>HSA Calculator: Health Savings Account 2026 | Toolisk</title>
        <meta name="description" content="Project HSA balance growth, quantify the triple-tax advantage (federal, state, FICA), and compare HSA vs taxable savings. 2026 IRS limits. Free." />
        <meta name="keywords" content="hsa calculator, health savings account, hsa contribution limit 2026, hsa triple tax advantage, hsa vs 401k, hsa retirement calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="HSA Calculator" />
        <meta property="og:description" content="Quantify the triple-tax advantage of your HSA and see how it compares to a taxable account." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HSA Calculator | Toolisk" />
        <meta name="twitter:description" content="HSA balance projection with 2026 IRS limits, triple-tax savings, and taxable comparison." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <HSACalculator />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">The HSA Triple Tax Advantage — Explained</h2>
          <p className="text-slate-600 mb-3">A Health Savings Account (HSA) is the only savings vehicle that offers three distinct tax benefits simultaneously. To qualify, you must be enrolled in an HSA-eligible High-Deductible Health Plan (HDHP) and not be enrolled in Medicare or claimed as a dependent on someone else's tax return.</p>
          <p className="text-slate-600 mb-3"><strong>Tax break #1 — Contributions are pre-tax.</strong> Money you contribute to an HSA reduces your federal taxable income dollar-for-dollar. Better still, contributions made through payroll also avoid FICA taxes (6.2% Social Security + 1.45% Medicare = 7.65%) — a savings that IRAs and 401(k)s don't provide on payroll contributions.</p>
          <p className="text-slate-600 mb-3"><strong>Tax break #2 — Growth is tax-free.</strong> Invested HSA funds — stocks, bonds, mutual funds — grow completely tax-free. No capital gains tax, no dividend tax, no annual tax drag. This compounding advantage compounds for decades if you leave the money invested.</p>
          <p className="text-slate-600"><strong>Tax break #3 — Qualified withdrawals are tax-free.</strong> When you pay for eligible medical expenses with HSA funds, the withdrawal is completely tax-free — no income tax, no penalties. Compare this to a traditional IRA where every withdrawal is ordinary income. For 2026, the IRS contribution limit is $4,400 for self-only coverage and $8,750 for family coverage, plus a $1,000 catch-up for those 55 and older.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How This Calculator Models HSA Growth</h2>
          <p className="text-slate-600 mb-3">The calculator runs a year-by-year accumulation loop. Each year, employee and employer contributions are added to the balance, any medical withdrawals are deducted, and the remaining balance grows at your expected investment return. Separately, it runs the same loop for a taxable account — but with after-tax contributions (reduced by your marginal rate) and tax-dragged returns (growth reduced by your effective tax rate annually).</p>
          <p className="text-slate-600 mb-3">The FICA savings calculation is a meaningful differentiator: if you contribute through payroll, the $4,400 self-only contribution avoids 7.65% in FICA taxes — that's $337 in year-one savings that a direct (non-payroll) IRA contribution doesn't capture. Over a 30-year horizon, this compounding FICA savings becomes substantial.</p>
          <p className="text-slate-600">The taxable comparison uses a simplified tax-drag model (applying the effective tax rate annually to investment returns). Real taxable accounts have more nuanced treatment of capital gains, qualified dividends, and tax-loss harvesting — the comparison is directionally accurate but intentionally simplified to highlight the HSA's structural advantage.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Worked Example</h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-slate-700 mb-2"><strong>Scenario:</strong> Age 35, self-only coverage, current balance $2,500, $4,400 annual employee contribution via payroll, $500 employer contribution, 7% return, 22% federal rate, 5% state rate, 30 years.</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Annual tax savings (22% federal + 5% state + 7.65% FICA) = 34.65% × $4,400 = <strong>$1,525/year</strong></li>
              <li>Effective cost of $4,400 contribution = $4,400 − $1,525 = <strong>$2,875 after-tax</strong></li>
              <li>Total annual contributions = $4,400 + $500 employer = <strong>$4,900/year</strong></li>
              <li>After 30 years at 7% return, HSA balance ≈ <strong>$520,000</strong></li>
              <li>Taxable account (after-tax contrib + dragged returns) ≈ <strong>$285,000</strong></li>
              <li>HSA advantage over 30 years ≈ <strong>$235,000</strong></li>
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
            <li><Link href="/finance/roth-conversion-calculator" className="text-indigo-600 hover:underline">Roth Conversion Calculator</Link> — Another triple-tax strategy for retirement.</li>
            <li><Link href="/finance/rmd-calculator" className="text-indigo-600 hover:underline">RMD Calculator</Link> — Plan required withdrawals from pre-tax accounts.</li>
            <li><Link href="/finance/529-college-savings-calculator" className="text-indigo-600 hover:underline">529 College Savings Calculator</Link> — Tax-advantaged savings for education costs.</li>
          </ul>
        </section>
      <DisclaimerBanner type="finance" />
      </div>
    </>
  );
}
