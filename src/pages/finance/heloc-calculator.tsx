import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';
import DisclaimerBanner from '../../components/Tools/DisclaimerBanner';

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

      <HELOCCalculator />

      {/* SEO content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a HELOC and How Does This Calculator Model It?</h2>
          <p className="text-slate-600 mb-3">A Home Equity Line of Credit (HELOC) is a revolving loan secured by your home — similar to a credit card, but with your equity as collateral and significantly lower interest rates. Unlike a home equity loan (which delivers a fixed lump sum at a fixed rate) or a cash-out refinance (which replaces your entire mortgage), a HELOC gives you a flexible credit line you can draw from as needed during a set <strong>draw period</strong>, then repay during a separate <strong>repayment period</strong>.</p>
          <p className="text-slate-600 mb-3">What makes HELOCs uniquely complex — and what most generic mortgage calculators miss — is this two-phase structure. During the draw period (typically 10 years), you typically pay <strong>interest only</strong> on what you've borrowed, and your balance can fluctuate as you draw and repay. When the draw period ends, the outstanding balance converts to a fully amortizing loan with <strong>principal + interest payments</strong> spread over the repayment period (typically 10–20 years).</p>
          <p className="text-slate-600 mb-3">This calculator models both phases correctly. You'll see the interest-only draw payment, the P&I repayment payment, the total interest cost, and — critically — the payment jump between phases (often called "payment shock"). HELOC rates are variable in practice (typically Prime + a margin), but for projection purposes this calculator treats the input rate as fixed and discloses this clearly.</p>
          <p className="text-slate-600">The maximum credit line is determined by your lender's Combined Loan-to-Value (CLTV) cap — typically 80–90% of the home's appraised value minus any existing mortgage balance. The calculator enforces this cap so you see a realistic borrowing limit, not an inflated theoretical maximum.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How the Math Works</h2>
          <p className="text-slate-600 mb-3">The HELOC credit limit calculation starts with your Combined Loan-to-Value cap: <code className="bg-slate-100 px-1 rounded">Max HELOC = (Home Value × CLTV%) − Existing Mortgage</code>. If the amount you plan to draw exceeds this cap, the calculator surfaces a warning and caps the calculation at the allowed maximum.</p>
          <p className="text-slate-600 mb-3">During the <strong>draw period</strong>, monthly interest-only payments equal <code className="bg-slate-100 px-1 rounded">Balance × (Annual Rate / 12)</code>. Because you're paying interest only, the principal doesn't shrink — the full drawn balance carries into the repayment phase.</p>
          <p className="text-slate-600 mb-3">During the <strong>repayment period</strong>, the outstanding balance amortizes using the standard P&I formula: <code className="bg-slate-100 px-1 rounded">PMT = P × r(1+r)ⁿ / ((1+r)ⁿ − 1)</code>, where P is the balance at repayment start, r is the monthly rate, and n is the number of repayment months. This gives a fixed monthly payment that fully retires the balance by the end of the repayment term.</p>
          <p className="text-slate-600">Total interest = (draw-phase payments) + (repayment-phase payments − original principal). Because the draw-phase balance doesn't decrease, borrowers often underestimate how much interest a HELOC costs over its full life.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Worked Example</h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-slate-700 mb-2"><strong>Scenario:</strong> Home worth $525,000, existing mortgage $220,000, lender CLTV cap 85%.</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Max combined loan = $525,000 × 0.85 = $446,250</li>
              <li><strong>Maximum HELOC = $446,250 − $220,000 = $226,250</strong></li>
              <li>Borrower draws $50,000 at 8.5% rate</li>
              <li>Draw period monthly payment (interest-only) = $50,000 × (0.085 / 12) = <strong>$354/month</strong></li>
              <li>At repayment start, balance is still $50,000. Amortized over 20 years at 8.5%: <strong>$434/month</strong></li>
              <li>Payment shock: $434 − $354 = <strong>$80/month increase</strong></li>
              <li>Total interest: 120 × $354 (draw) + (240 × $434 − $50,000) (repayment) = $42,480 + $54,160 = <strong>$96,640</strong></li>
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
            <li><Link href="/finance/mortgage-refinance-breakeven-calculator" className="text-indigo-600 hover:underline">Mortgage Refinance Break-Even Calculator</Link> — Should you refinance instead of tapping equity?</li>
            <li><Link href="/finance/reverse-mortgage-calculator" className="text-indigo-600 hover:underline">Reverse Mortgage Calculator</Link> — Compare HELOC vs HECM for seniors 62+.</li>
            <li><Link href="/finance/mortgage-calculator" className="text-indigo-600 hover:underline">Mortgage Calculator</Link> — See how a larger first mortgage compares to adding a HELOC.</li>
          </ul>
        </section>
      <DisclaimerBanner type="finance" />
      </div>
    </>
  );
}
