import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

const HELOCCalculator = dynamic(
  () => import('../../components/HELOC/HELOCCalculator'),
  { ssr: false },
);

const SLUG = '/finance/heloc-calculator';

const FAQS = [
  {
    q: "What's the difference between a HELOC and a home equity loan?",
    a: 'A HELOC is a revolving line of credit with a variable rate — you borrow what you need, when you need it, and pay interest only on what you draw during the draw period. A home equity loan gives you a lump sum at a fixed rate with fixed P&I payments from day one. If you need flexibility, a HELOC wins. If you want payment certainty, a home equity loan is simpler.',
  },
  {
    q: 'What happens when my HELOC enters repayment?',
    a: "At the end of the draw period (typically 10 years), your HELOC converts to a fully-amortizing loan. You can no longer draw funds, and your payment jumps from interest-only to full P&I. This 'payment shock' is one of the most common HELOC surprises — this calculator shows you exactly how much it is before you sign.",
  },
  {
    q: 'Can my lender cut my credit line during the draw period?',
    a: "Yes. Lenders can reduce or freeze a HELOC if your home value drops significantly, your credit score declines, or the lender experiences financial stress. This is a key risk vs. a home equity loan, where the funds are committed upfront. Keep your credit score strong and monitor your home equity throughout the draw period.",
  },
  {
    q: 'Is HELOC interest still tax deductible?',
    a: "Under current tax law (TCJA through 2025, extended pending legislation), HELOC interest is deductible only if the funds are used to 'buy, build, or substantially improve' the home securing the loan. Interest used for debt consolidation, vacations, or other personal expenses is generally not deductible. Consult a tax advisor for your specific situation.",
  },
];

export default function HELOCCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'HELOC Calculator',
    slug: SLUG,
    description: 'Calculate HELOC limit, draw-phase interest-only payments, and repayment-phase P&I. See your total interest cost instantly.',
    category: 'FinanceApplication',
    featureList: 'HELOC credit limit, Interest-only draw payments, P&I repayment payments, Total interest cost, Payment schedule chart, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>HELOC Calculator: Home Equity Line of Credit | Toolisk</title>
        <meta name="description" content="Calculate HELOC limit, draw-phase interest-only payments and repayment-phase P&I. See your total interest cost instantly. Free." />
        <meta name="keywords" content="heloc calculator, home equity line of credit, heloc payment, draw period, repayment period, heloc interest only, home equity calculator" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="HELOC Calculator" />
        <meta property="og:description" content="Project HELOC payments through both draw and repayment phases." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HELOC Calculator | Toolisk" />
        <meta name="twitter:description" content="See your HELOC credit limit, interest-only draw payments, and repayment-phase payment shock." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ToolShell parent="finance" icon="💳" title="HELOC Calculator" tagline="Calculate HELOC limit, draw-phase interest-only payments, and repayment-phase P&I." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <HELOCCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate HELOC credit limit, draw-phase interest-only payments, and repayment-phase P&I. See payment shock, total interest cost, and a complete payment schedule."
        features={[
          '💳 HELOC credit limit calculation',
          '📊 Draw-period interest-only payments',
          '💰 Repayment-phase P&I amortization',
          '⚠️ Payment shock analysis',
          '📈 Total interest cost breakdown',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Enter home details', desc: 'Input home value, existing mortgage balance, and lender CLTV cap.' },
          { title: 'Set HELOC terms', desc: 'Enter draw amount, interest rate, draw period length, and repayment period.' },
          { title: 'Review credit limit', desc: 'See your maximum HELOC based on CLTV and existing mortgage.' },
          { title: 'Compare phases', desc: 'View draw-period vs repayment-phase payments and the payment shock between them.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What Is a HELOC and How Does This Calculator Model It?</h2>
            <p className="text-slate-600 leading-relaxed">A Home Equity Line of Credit (HELOC) is a revolving loan secured by your home — similar to a credit card, but with your equity as collateral and significantly lower interest rates. Unlike a home equity loan (which delivers a fixed lump sum at a fixed rate) or a cash-out refinance (which replaces your entire mortgage), a HELOC gives you a flexible credit line you can draw from as needed during a set <strong>draw period</strong>, then repay during a separate <strong>repayment period</strong>.</p>
            <p className="text-slate-600 leading-relaxed">What makes HELOCs uniquely complex — and what most generic mortgage calculators miss — is this two-phase structure. During the draw period (typically 10 years), you typically pay <strong>interest only</strong> on what you've borrowed, and your balance can fluctuate as you draw and repay. When the draw period ends, the outstanding balance converts to a fully amortizing loan with <strong>principal + interest payments</strong> spread over the repayment period (typically 10–20 years).</p>
            <p className="text-slate-600 leading-relaxed">This calculator models both phases correctly. You'll see the interest-only draw payment, the P&I repayment payment, the total interest cost, and — critically — the payment jump between phases (often called "payment shock"). HELOC rates are variable in practice (typically Prime + a margin), but for projection purposes this calculator treats the input rate as fixed and discloses this clearly.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How the Math Works</h3>
            <p className="text-slate-600 leading-relaxed">The HELOC credit limit calculation starts with your Combined Loan-to-Value cap: <code className="bg-slate-100 px-1 rounded">Max HELOC = (Home Value × CLTV%) − Existing Mortgage</code>. During the draw period, monthly interest-only payments equal <code className="bg-slate-100 px-1 rounded">Balance × (Annual Rate / 12)</code>. During the repayment period, the outstanding balance amortizes using the standard P&I formula.</p>
          </section>
        }
        relatedTools={[
          { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
          { name: 'Mortgage Refinance Calculator', href: '/finance/mortgage-refinance-breakeven-calculator', icon: '📊' },
          { name: 'House Affordability Calculator', href: '/finance/house-affordability-calculator', icon: '🏡' },
        ]}
        relatedArticles={[
          { title: 'When Mortgage Refinance Is Worth It', href: '/finance/learn/when-mortgage-refinance-is-worth-it' },
        ]}
      />
    </>
  );
}
