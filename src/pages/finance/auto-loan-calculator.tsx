import Head from 'next/head';
import AutoLoanCalculator from '../../components/Finance/AutoLoanCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/auto-loan-calculator';

const FAQS = [
  { q: 'How is a car loan payment calculated?', a: 'The standard amortization formula: Payment = Loan × (r / (1 − (1+r)^−n)), where r is the monthly interest rate (APR ÷ 12) and n is the number of months. Each payment splits between interest (high at first) and principal (high at the end).' },
  { q: 'Should I get a longer loan term to lower the monthly payment?', a: 'Long-term loans (72 or 84 months) lower the monthly payment but cost much more in total interest. They also leave you upside-down (owing more than the car is worth) for years. The sweet spot for most borrowers is 48–60 months on a new car, 36–48 on used.' },
  { q: 'How much down payment should I make on a car?', a: 'For new cars, aim for 20% down to avoid being upside-down quickly (new cars depreciate ~20% in year one). For used cars, 10% is acceptable since depreciation has already taken its hit. The bigger the down payment, the lower your interest cost over the loan.' },
  { q: 'Is dealer financing or bank financing better?', a: 'Get pre-approved by your bank or credit union first, then let the dealer try to beat it. Dealers often inflate rates to earn back-end commissions, but they sometimes have manufacturer-subsidized rates (0%, 1.9%) you cannot get elsewhere. Always compare.' },
  { q: 'What APR should I expect on a car loan?', a: 'In 2026, with prime credit (740+), expect 6–8% APR on a new car loan. Used car rates run 1–2% higher. If your credit is below 660, expect 12%+ — refinancing after 6–12 months of on-time payments often saves significant interest.' },
];

export default function AutoLoanCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Auto Loan Calculator',
    slug: SLUG,
    description: 'Calculate car loan monthly payment, total interest, and term comparison. Multi-currency (USD/EUR/GBP/AUD/CAD/INR) with sales tax and trade-in support.',
    category: 'FinanceApplication',
    featureList: 'Multi-currency, Sales tax, Trade-in value, Term comparison, Amortization chart',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Auto Loan Calculator — Monthly Payment with Tax & Trade-In | Toolisk</title>
        <meta name="description" content="Free auto loan calculator with sales tax, down payment, trade-in, and term comparison. Multi-currency support: USD, EUR, GBP, AUD, CAD. See total interest and amortization chart." />
        <meta name="keywords" content="auto loan calculator, car loan calculator, monthly car payment, vehicle finance calculator, car loan apr, car payment with tax, car loan amortization" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Auto Loan Calculator | Toolisk" />
        <meta property="og:description" content="Calculate car loan payment with sales tax and trade-in. Multi-currency support." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="🚗" title="Auto Loan Calculator" tagline="Find your monthly payment, total interest, and which loan term actually saves money." gradient="from-blue-600 via-indigo-600 to-violet-600">
        <AutoLoanCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A complete auto loan calculator that handles sales tax, down payment, trade-in value, and dealer fees. Compare 36, 48, 60, 72, and 84-month terms side-by-side to see exactly how much extra interest a longer loan really costs. Supports USD, EUR, GBP, AUD, CAD, and INR."
        features={[
          '💰 Multi-currency: USD, EUR, GBP, AUD, CAD, INR',
          '🧾 Includes sales tax, dealer fees, and trade-in',
          '📊 Side-by-side term comparison (36–84 months)',
          '📈 Amortization chart with principal/interest breakdown',
          '🎯 Real-time updates as you adjust inputs',
          '🔒 100% browser-based — no upload',
        ]}
        steps={[
          { title: 'Enter vehicle price and down payment', desc: 'Include trade-in value if applicable.' },
          { title: 'Add sales tax and fees', desc: 'Most US states charge sales tax on the full vehicle price. Doc fees and title cost typically run $200–800.' },
          { title: 'Set APR and term', desc: 'Use the rate from your pre-approval, or shop based on credit tier (6–8% prime, 12%+ subprime).' },
          { title: 'Compare terms', desc: 'The term comparison table shows the trade-off between monthly payment and total interest paid.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The 20/4/10 rule for car affordability</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>20% down</strong> to avoid being underwater quickly</li>
              <li><strong>4-year (48-month) loan</strong> max — anything longer signals you can&apos;t afford the car</li>
              <li><strong>10% of monthly take-home</strong> total transportation cost (loan + insurance + gas + maintenance)</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              Most Americans violate this rule by stretching to 72-84 month loans on cars they can&apos;t comfortably afford. The result: an average car payment of $750+ in 2026 and millions of borrowers underwater. The calculator&apos;s term comparison shows you the real cost of stretching.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
          { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📊' },
          { name: 'Credit Card Payoff', href: '/finance/credit-card-payoff-calculator', icon: '💳' },
          { name: 'Loan Comparison', href: '/finance/loan-comparison-calculator', icon: '⚖️' },
        ]}
      />
    </>
  );
}
