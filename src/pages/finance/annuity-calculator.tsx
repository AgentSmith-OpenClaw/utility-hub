import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

const AnnuityCalculator = dynamic(
  () => import('../../components/AnnuityCalculator/AnnuityCalculator'),
  { ssr: false },
);

const SLUG = '/finance/annuity-calculator';

const FAQS = [
  {
    q: 'What is the difference between an immediate and deferred annuity?',
    a: "An immediate annuity (SPIA — Single Premium Immediate Annuity) converts a lump sum into an income stream that starts right away — typically within 30 days of purchase. A deferred annuity has an accumulation phase where your money grows tax-deferred before converting to income. Immediate annuities are for people already in or near retirement who want guaranteed income now. Deferred annuities are for those still accumulating, who want to lock in a future income floor.",
  },
  {
    q: "How is an annuity's payment calculated?",
    a: 'For a period-certain annuity (fixed term), the payment uses the present-value-of-annuity formula: PMT = PV × r / (1 − (1 + r)^−n), where PV is the principal, r is the periodic interest rate, and n is the total number of payment periods. This calculator uses a simple periodic rate convention (annual rate ÷ payment frequency), which is standard for annuity and TVM calculations.',
  },
  {
    q: 'What is a COLA (cost-of-living adjustment) on an annuity?',
    a: "A COLA rider allows your annuity payment to grow each year at a specified percentage — typically 1–3%. This protects against inflation but comes at a cost: the initial payment is lower than a non-COLA annuity because the insurer prices in the future increases. For a 20-year annuity on $250,000 at 4.5% with a 2% COLA, the first monthly payment might be $1,400 vs $1,580 without COLA — but by year 20, the COLA payment has grown to nearly $2,100.",
  },
  {
    q: "What happens to annuity payments when the annuitant dies?",
    a: "It depends on the payout option chosen. A 'life-only' annuity stops paying at death — maximum income, no residual value. A 'period-certain' annuity guarantees payments for a fixed term (e.g., 20 years) regardless of when you die — if you die in year 5, payments continue to your beneficiary through year 20. A 'joint and survivor' annuity continues to a spouse or co-annuitant. This calculator models period-certain annuities — discuss life-contingent options with a licensed insurance professional.",
  },
];

export default function AnnuityCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Annuity Calculator',
    slug: SLUG,
    description: 'Calculate annuity payments for immediate (SPIA), deferred accumulation, and fixed-period scenarios. See total payout and interest earned.',
    category: 'FinanceApplication',
    featureList: 'Immediate annuity payment, Deferred accumulation, Fixed-period TVM, COLA adjustment, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Annuity Calculator: SPIA, Deferred & Fixed-Period | Toolisk</title>
        <meta name="description" content="Calculate annuity payments for immediate (SPIA), deferred accumulation, and fixed-period scenarios. COLA adjustments, total payout, and interest earned. Free." />
        <meta name="keywords" content="annuity calculator, spia calculator, immediate annuity, deferred annuity, annuity payment calculator, fixed annuity, retirement annuity" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Annuity Calculator" />
        <meta property="og:description" content="Compute annuity payments for immediate, deferred, and fixed-period scenarios with optional COLA." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Annuity Calculator | Toolisk" />
        <meta name="twitter:description" content="SPIA, deferred, and fixed-period annuity calculations with COLA, total payout, and interest." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell parent="finance" icon="💰" title="Annuity Calculator" tagline="Calculate annuity payments for immediate (SPIA), deferred accumulation, and fixed-period scenarios." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <AnnuityCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate annuity payments for immediate (SPIA), deferred accumulation, and fixed-period (TVM) scenarios. Supports optional COLA adjustments, multiple payment frequencies, and shows total payout and interest earned."
        features={[
          '💰 Immediate annuity (SPIA) payment calculation',
          '📈 Deferred annuity accumulation projection',
          '🔧 Fixed-period TVM solver (any 3 of 5 variables)',
          '📊 COLA adjustment for inflation protection',
          '📅 Monthly, quarterly, or annual payment frequencies',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Choose annuity type', desc: 'Select immediate (SPIA), deferred accumulation, or fixed-period TVM mode.' },
          { title: 'Enter principal and rate', desc: 'Input your lump sum or contribution amount, guaranteed interest rate, and payment period.' },
          { title: 'Set COLA (optional)', desc: 'Enable a cost-of-living adjustment to see how payments grow annually to offset inflation.' },
          { title: 'Review results', desc: 'See monthly payment, total payout, total interest earned, and a year-by-year breakdown.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding Annuities: Immediate, Deferred, and Fixed-Period</h2>
            <p className="text-slate-600 leading-relaxed">An annuity is a contract with an insurance company: you give them money (either as a lump sum or through periodic contributions), and they promise to return it with interest over time — either as a guaranteed income stream or a future lump sum. Annuities are among the most misunderstood financial products, partly because the term covers three very different scenarios that this calculator handles separately.</p>
            <p className="text-slate-600 leading-relaxed"><strong>Immediate annuities (SPIA).</strong> A Single Premium Immediate Annuity takes your lump sum and starts paying you back immediately — typically monthly. The payment is determined by your principal, the guaranteed interest rate, and the payment period. The math is the present-value-of-annuity formula, which this calculator solves for you. An optional COLA (cost-of-living adjustment) rider lets payments grow annually to offset inflation.</p>
            <p className="text-slate-600 leading-relaxed"><strong>Deferred annuities.</strong> These have an accumulation phase — contributions grow tax-deferred over time, then the lump sum can either be taken as cash or "annuitized" into an income stream. This mode shows the future value of contributions at your expected return, and optionally computes the income stream that future lump sum could generate.</p>
            <p className="text-slate-600 leading-relaxed"><strong>Fixed-period (TVM solver).</strong> This mode solves general time-value-of-money problems: given any three of (present value, payment, future value, rate, periods), solve for the fourth. Useful for any periodic savings or income scenario — not just insurance products.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">The Math Behind Annuity Payments</h3>
            <p className="text-slate-600 leading-relaxed">This calculator uses the <strong>simple periodic rate convention</strong>: annual rate ÷ payment frequency. For monthly payments at 4.5% annual rate, the monthly rate is 4.5% ÷ 12 = 0.375%. This is the standard convention used by insurers, textbooks, and competing calculators, and it produces payments consistent with actuarial quotes.</p>
            <p className="text-slate-600 leading-relaxed">The core PMT formula is: <code className="bg-slate-100 px-1 rounded">PMT = PV × r / (1 − (1 + r)^−n)</code>, where PV is the principal, r is the per-period rate, and n is total payment periods. When r = 0 (zero-rate edge case), PMT = PV / n.</p>
            <p className="text-slate-600 leading-relaxed">With a COLA (growing annuity), the formula becomes: <code className="bg-slate-100 px-1 rounded">PMT₀ = PV × (r − g) / (1 − ((1 + g)/(1 + r))^n)</code>, where g is the per-period growth rate. The initial payment is lower than a flat annuity, but grows each period — protecting purchasing power over a long payout horizon.</p>
          </section>
        }
        relatedTools={[
          { name: 'RMD Calculator', href: '/finance/rmd-calculator', icon: '📋' },
          { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏦' },
          { name: 'Roth Conversion Calculator', href: '/finance/roth-conversion-calculator', icon: '🔄' },
        ]}
        relatedArticles={[
          { title: 'Retirement Savings Age Milestones', href: '/finance/learn/retirement-savings-age-milestones' },
        ]}
      />
    </>
  );
}
