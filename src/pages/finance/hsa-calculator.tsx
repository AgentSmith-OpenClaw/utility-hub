import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

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

      <ToolShell parent="finance" icon="🏥" title="HSA Calculator" tagline="Project HSA balance growth and quantify the triple-tax advantage vs a taxable account." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <HSACalculator />
      </ToolShell>

      <ToolSEOContent
        description="Project your Health Savings Account balance and quantify the triple-tax advantage vs a taxable account. 2026 IRS limits included."
        features={[
          '🏥 2026 HSA contribution limits',
          '💰 Triple-tax advantage calculation',
          '📊 Federal/FICA/state savings breakdown',
          '📈 HSA vs taxable account comparison',
          '📉 Balance projection chart',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Enter your basics', desc: 'Input age, current HSA balance, coverage type (self-only or family).' },
          { title: 'Set contributions', desc: 'Enter employee and employer annual contributions.' },
          { title: 'Configure assumptions', desc: 'Set expected return, federal/state tax rates, and investment horizon.' },
          { title: 'Review the advantage', desc: 'See HSA balance vs taxable account, total tax savings, and FICA savings.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The HSA Triple Tax Advantage — Explained</h2>
            <p className="text-slate-600 leading-relaxed">A Health Savings Account (HSA) is the only savings vehicle that offers three distinct tax benefits simultaneously. To qualify, you must be enrolled in an HSA-eligible High-Deductible Health Plan (HDHP) and not be enrolled in Medicare or claimed as a dependent.</p>
            <p className="text-slate-600 leading-relaxed"><strong>Tax break #1 — Contributions are pre-tax.</strong> Money you contribute reduces your federal taxable income dollar-for-dollar. Contributions through payroll also avoid FICA taxes (7.65%) — a savings that IRAs and 401(k)s don't provide.</p>
            <p className="text-slate-600 leading-relaxed"><strong>Tax break #2 — Growth is tax-free.</strong> Invested HSA funds grow completely tax-free. No capital gains tax, no dividend tax, no annual tax drag.</p>
            <p className="text-slate-600 leading-relaxed"><strong>Tax break #3 — Qualified withdrawals are tax-free.</strong> When you pay for eligible medical expenses with HSA funds, the withdrawal is completely tax-free. For 2026, the IRS contribution limit is $4,400 for self-only and $8,750 for family coverage, plus a $1,000 catch-up for those 55+.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How This Calculator Models HSA Growth</h3>
            <p className="text-slate-600 leading-relaxed">The calculator runs a year-by-year accumulation loop. Each year, contributions are added, medical withdrawals deducted, and the balance grows at your expected return. Separately, it runs the same loop for a taxable account with after-tax contributions and tax-dragged returns to show the HSA's structural advantage.</p>
          </section>
        }
        relatedTools={[
          { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
          { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
          { name: 'Roth Conversion Calculator', href: '/finance/roth-conversion-calculator', icon: '🔄' },
        ]}
        relatedArticles={[
          { title: 'HSA Triple Tax Advantage', href: '/finance/learn/hsa-triple-tax-advantage' },
          { title: 'HDHP vs PPO Comparison', href: '/finance/learn/hdhp-vs-ppo-comparison' },
        ]}
      />
    </>
  );
}
