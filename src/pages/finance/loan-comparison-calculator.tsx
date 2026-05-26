import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const LoanComparisonCalculator = dynamic(
  () => import('../../components/Finance/LoanComparisonCalculator'),
  { ssr: false },
);

const SLUG = '/finance/loan-comparison-calculator';

const FAQS = [
  { q: 'How do I compare two or three loans side by side?', a: 'Enter each loan\'s amount, interest rate, and term in its own column. The comparison table and bar chart update live, showing monthly EMI, total interest, and total payment for each. The best values are marked with a star.' },
  { q: 'Should I choose the loan with the lowest EMI or lowest total interest?', a: 'It depends on your priority. Lowest EMI gives you cash-flow flexibility but usually costs more in total interest (longer term). Lowest total interest saves money overall but requires higher monthly payments. Use this calculator to see both numbers for each option before deciding.' },
  { q: 'How is EMI calculated for each loan?', a: 'EMI uses the standard amortization formula: EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is principal, r is monthly interest rate (annual rate ÷ 12 ÷ 100), and n is total months. This is the same formula banks use.' },
  { q: 'What does "interest-to-principal ratio" mean?', a: 'It shows how much interest you pay relative to the amount borrowed. A ratio of 85% means you pay 85% of the loan amount as interest over the full term. Higher ratios mean the loan costs more relative to what you borrowed — often the case with long-tenure, high-rate loans.' },
  { q: 'Can I compare loans with different amounts?', a: 'Yes. The comparison table shows all metrics side by side regardless of amount. However, the "best" markers (★) compare the absolute numbers, so a smaller loan will always have a lower EMI. For fair rate comparisons when amounts differ, focus on the interest-to-principal ratio column.' },
  { q: 'Does this account for prepayment or variable rates?', a: 'This calculator uses fixed-rate, no-prepayment assumptions. For prepayment scenarios, use the EMI Calculator. For variable-rate comparisons, model the initial fixed period here and note that rates may change after that period.' },
];

export default function LoanComparisonPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Loan Comparison Calculator',
    slug: SLUG,
    description: 'Compare 2-3 loans side by side: monthly EMI, total interest, and total payment. Multi-currency with visual bar chart.',
    category: 'FinanceApplication',
    featureList: 'Side-by-side loan comparison, Monthly EMI comparison, Total interest comparison, Interest-to-principal ratio, Visual bar chart, Multi-currency',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Loan Comparison Calculator — Compare 2-3 Loans Side by Side | Toolisk</title>
        <meta name="description" content="Compare up to 3 loans side by side: monthly EMI, total interest, interest-to-principal ratio, and visual chart. Free, multi-currency." />
        <meta name="keywords" content="loan comparison calculator, compare loans, side by side loan comparison, EMI comparison, loan interest comparison, which loan is cheaper" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Loan Comparison Calculator | Toolisk" />
        <meta property="og:description" content="Compare up to 3 loans side by side — EMI, total interest, and total payment." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="⚖️" title="Loan Comparison Calculator" tagline="Compare up to 3 loans side by side — see which one saves you the most in monthly EMI and total interest." gradient="from-blue-600 via-indigo-600 to-violet-600">
        <LoanComparisonCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A side-by-side loan comparison tool that lets you enter 2 or 3 loan scenarios with different amounts, rates, and terms. Instantly see the monthly EMI, total payment, total interest, and interest-to-principal ratio for each. The best values get a star marker, and a visual bar chart shows how principal and interest stack up."
        features={[
          '⚖️ Compare 2 or 3 loans side by side',
          '💰 Monthly EMI, total interest, total payment',
          '📊 Visual principal vs interest bar chart',
          '★ Best-value markers on lowest EMI & interest',
          '💱 Multi-currency (USD, EUR, GBP, AUD, CAD, INR)',
          '🔍 Interest-to-principal ratio column',
        ]}
        steps={[
          { title: 'Enter loan details', desc: 'Fill in the amount, interest rate, and term for each loan scenario you want to compare.' },
          { title: 'Adjust currency', desc: 'Pick your currency using the selector in the top-right corner. All values update automatically.' },
          { title: 'Compare results', desc: 'The table shows EMI, total interest, total payment, and interest ratio. Stars mark the cheapest option per metric.' },
          { title: 'Read the insight', desc: 'The Key Insights card highlights the biggest savings opportunity and the EMI difference between options.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why comparing loans matters</h2>
            <p className="text-slate-600 leading-relaxed">
              A 1% difference in interest rate or a 5-year difference in term can change your total interest by tens of thousands. Side-by-side comparison makes the real cost visible — not just the monthly EMI, but the total amount you hand over to the lender over the full loan term.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-6">EMI vs total interest: the trade-off</h3>
            <p className="text-slate-600 leading-relaxed">
              Longer terms reduce your monthly EMI but dramatically increase total interest. For example, on a ₹10 lakh loan at 9%: a 15-year term costs ₹10.13 lakh in interest, while a 20-year term costs ₹14.46 lakh — that&apos;s ₹4.33 lakh more just for extending 5 years. The monthly EMI drops from ₹10,143 to ₹8,997, but you pay significantly more over time. This calculator shows both numbers so you can make an informed trade-off.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-6">Interest-to-principal ratio explained</h3>
            <p className="text-slate-600 leading-relaxed">
              The interest-to-principal ratio tells you how much interest you pay for every rupee of principal. A ratio of 85% means you pay 85 paise in interest for every rupee borrowed. Use this metric to compare loans fairly when the borrowed amounts differ — a lower ratio always means a cheaper loan relative to what you borrowed.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-6">When to pick the lowest EMI vs the lowest interest</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Pick lowest EMI when:</strong> Cash flow is tight, you have other financial obligations, or you plan to prepay aggressively in the first few years.</li>
              <li><strong>Pick lowest total interest when:</strong> You can comfortably afford the higher EMI, you value total savings over monthly convenience, or you plan to hold the loan for its full term.</li>
              <li><strong>Refinancing opportunity:</strong> If the lowest-EMI loan has a higher rate, consider starting with it for cash-flow flexibility, then refinancing to the lowest-rate option once you can handle the higher EMI.</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '🏦' },
          { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
          { name: 'Auto Loan Calculator', href: '/finance/auto-loan-calculator', icon: '🚗' },
        ]}
      />
    </>
  );
}