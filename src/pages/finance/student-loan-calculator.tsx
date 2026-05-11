import Head from 'next/head';
import StudentLoanCalculator from '../../components/Finance/StudentLoanCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/student-loan-calculator';

const FAQS = [
  { q: 'Should I refinance my federal student loans?', a: 'Refinancing federal loans into a private loan permanently forfeits federal benefits: income-driven repayment plans, Public Service Loan Forgiveness (PSLF), forbearance options, and death/disability discharge. Only refinance federal loans if you have stable high income, no plan to use forgiveness, and the new rate is at least 1% lower.' },
  { q: 'How does extra payment shorten my loan?', a: 'Extra payments go directly to principal, reducing the balance interest is charged on. On a $35,000 loan at 6.5% with $400/month payments, an extra $100/month cuts the payoff by roughly 3 years and saves around $5,000 in interest.' },
  { q: 'What credit score do I need to refinance student loans?', a: 'Most lenders require a 680 minimum, with the best rates reserved for 740+. Your debt-to-income ratio also matters — lenders generally want DTI below 40%. Co-signers can help if you have limited credit history.' },
  { q: 'What is income-driven repayment (IDR)?', a: 'US federal IDR plans cap your monthly payment at 5–20% of discretionary income, with the remaining balance forgiven after 20–25 years (or 10 for PSLF). The forgiven amount may be taxable — though current rules provide tax-free forgiveness through 2025 and proposed extensions.' },
  { q: 'Should I pay off student loans or invest?', a: 'A common rule: if your loan rate is below ~5%, prioritize investing (long-term S&P 500 returns are 7–10%). If above ~7%, pay off the loan first (guaranteed return). Between 5–7% it is a personal preference based on your risk tolerance and emotional attachment to debt.' },
];

export default function StudentLoanCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Student Loan Calculator',
    slug: SLUG,
    description: 'Calculate student loan payoff time, total interest, and refinance savings. Multi-currency with extra payment and refinance scenarios.',
    category: 'FinanceApplication',
    featureList: 'Standard payoff, Extra payment scenario, Refinance comparison, Multi-currency, Balance over time chart',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Student Loan Calculator — Payoff Time, Refinance & Extra Payments | Toolisk</title>
        <meta name="description" content="Calculate your student loan payoff time, total interest, and savings from extra payments or refinancing. Compare three scenarios side-by-side. Multi-currency support." />
        <meta name="keywords" content="student loan calculator, student loan payoff calculator, student loan refinance calculator, federal student loan, student loan extra payment, loan amortization" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Student Loan Calculator | Toolisk" />
        <meta property="og:description" content="Compare standard payoff vs extra payments vs refinancing." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="🎓" title="Student Loan Calculator" tagline="Compare standard payoff, aggressive extra payments, and refinancing — see exact savings in months and dollars." gradient="from-violet-600 via-purple-600 to-fuchsia-600">
        <StudentLoanCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A three-scenario student loan calculator: see how long you will pay under your current plan, what an extra monthly payment changes, and how much a refinance to a lower rate saves over the loan&apos;s life. Useful for federal and private loans across the US, UK, Canada, and Australia."
        features={[
          '🎯 Three scenarios side-by-side: standard, extra payment, refinanced',
          '💰 Multi-currency: USD, EUR, GBP, AUD, CAD, INR',
          '📊 Balance over time chart',
          '⚠️ Warns when payment is below the monthly interest',
          '⏱️ Exact months and currency saved per strategy',
          '🌍 Decision guide for federal vs private loans',
        ]}
        steps={[
          { title: 'Enter your balance and rate', desc: 'Use the weighted average if you have multiple loans. Most servicers show this on the dashboard.' },
          { title: 'Set your monthly payment', desc: 'Your standard payment from the loan servicer.' },
          { title: 'Try an extra amount', desc: 'Even $50/month extra typically saves thousands and shaves years off the payoff.' },
          { title: 'Compare a refinance rate', desc: 'Get a real quote from SoFi, Earnest, or your local credit union and plug in the rate to see the savings.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Federal vs private loans — completely different strategies</h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>US federal loans</strong> have access to income-driven repayment, deferment, forbearance, and forgiveness programs that private loans don&apos;t. Refinancing federal loans into private loans is irreversible. Only do it if you&apos;re certain you don&apos;t need those protections — typically a high-income borrower with no PSLF eligibility.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Private loans</strong> have no special protections, so refinancing whenever you can drop the rate by 1%+ is almost always a win. Watch for variable-rate loans — they look cheap today but can reset higher in a rising-rate environment.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Auto Loan Calculator', href: '/finance/auto-loan-calculator', icon: '🚗' },
          { name: 'Credit Card Payoff', href: '/finance/credit-card-payoff-calculator', icon: '💳' },
          { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📊' },
        ]}
      />
    </>
  );
}
