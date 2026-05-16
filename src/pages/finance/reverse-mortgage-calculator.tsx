import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { generateBreadcrumbs, generateSoftwareAppSchema, generateFaqSchema, SITE_URL } from '../../utils/siteConfig';

const ReverseMortgageCalculator = dynamic(
  () => import('../../components/ReverseMortgage/ReverseMortgageCalculator'),
  { ssr: false },
);

const SLUG = '/finance/reverse-mortgage-calculator';

const FAQS = [
  {
    q: 'Will I lose my home with a reverse mortgage?',
    a: "No — you retain title and can stay in your home as long as you meet the loan obligations: paying property taxes, homeowners insurance, and HOA fees; maintaining the property; and living in it as your primary residence. The loan becomes due when you permanently move out, sell the home, or pass away. At that point, you (or your estate) must repay the loan — typically by selling the home. Any equity above the loan balance belongs to you or your heirs.",
  },
  {
    q: 'What happens to the loan when I die or move?',
    a: "When the last surviving borrower dies, sells, or permanently vacates the home, the loan becomes due. Heirs have several options: sell the home and use the proceeds to repay the loan (keeping any equity); pay off the loan from other assets and keep the home; or simply walk away — because HECMs are non-recourse loans, the lender can only recover the home's value. Even if the balance exceeds the home's value, neither you nor your heirs owe the difference (the FHA mortgage insurance covers the shortfall).",
  },
  {
    q: 'How does the line-of-credit growth feature work?',
    a: "The HECM line of credit has a unique feature: the unused portion grows over time at the same rate the loan balance accrues (expected rate + 0.5% ongoing MIP). So a $169,850 LOC today might grow to $200,000+ in a few years if left unused. This growth is not taxable income — it's additional borrowing capacity. This LOC growth feature makes a HECM LOC fundamentally different from a HELOC, which can be frozen or reduced by the lender.",
  },
  {
    q: 'Can a non-borrowing spouse stay in the home?',
    a: "Yes — since 2015, HUD rules protect 'Eligible Non-Borrowing Spouses' (ENBS). If your spouse is under 62 at closing (and therefore not on the loan), they can remain in the home after the borrower dies or moves to a care facility — without the loan coming due — as long as they maintain the home and pay taxes and insurance. However, payments stop and the LOC freezes during the deferral period. Consult a HUD-approved counselor before closing to understand ENBS rights.",
  },
];

export default function ReverseMortgageCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Reverse Mortgage Calculator',
    slug: SLUG,
    description: 'Estimate HECM reverse mortgage proceeds across lump sum, line of credit, term, and lifetime tenure. 2026 limits.',
    category: 'FinanceApplication',
    featureList: 'HECM principal limit, PLF lookup, All four payout options, Upfront fee breakdown, 25-year equity projection, PDF and Excel export',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Reverse Mortgage Calculator (HECM) | Toolisk</title>
        <meta name="description" content="Estimate HECM reverse mortgage proceeds across lump sum, line of credit, term, and lifetime tenure. 2026 limits. Free." />
        <meta name="keywords" content="reverse mortgage calculator, hecm calculator, reverse mortgage proceeds, principal limit factor, hecm tenure payment, hecm line of credit" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Reverse Mortgage Calculator" />
        <meta property="og:description" content="Estimate HECM proceeds and compare all four payout options side-by-side." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reverse Mortgage Calculator | Toolisk" />
        <meta name="twitter:description" content="Estimate HECM principal limit, compare lump sum / LOC / term / tenure payouts, and project 25-year equity." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <ReverseMortgageCalculator />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">What Is a HECM Reverse Mortgage and Who Qualifies?</h2>
          <p className="text-slate-600 mb-3">A Home Equity Conversion Mortgage (HECM) is the federally insured reverse mortgage program administered by HUD (the Department of Housing and Urban Development). It allows homeowners aged 62 or older to convert a portion of their home equity into cash — without selling the home or making monthly mortgage payments. This calculator models only HECMs, not proprietary "jumbo" reverse mortgages offered by private lenders for higher-value homes.</p>
          <p className="text-slate-600 mb-3">Eligibility requirements: (1) You or your co-borrower must be at least 62. (2) The home must be your primary residence — vacation homes and investment properties don't qualify. (3) You must have sufficient equity (most lenders require 50%+, though the exact amount depends on your age and interest rate). (4) Any existing mortgage must be paid off at closing, typically using HECM proceeds. (5) You must complete a session with a HUD-approved HECM counselor — this is required by federal law, not just recommended.</p>
          <p className="text-slate-600">A HECM differs fundamentally from a HELOC or home equity loan: there are no monthly payments required. The loan balance grows over time (interest accrues) and is repaid when the last borrower leaves the home. Because it's non-recourse, the lender can never pursue you or your heirs for more than the home's value — even if the loan balance grows to exceed the home's worth.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How Proceeds Are Calculated</h2>
          <p className="text-slate-600 mb-3">The HECM amount starts with the <strong>Maximum Claim Amount (MCA)</strong> = the lesser of your home's appraised value or the FHA HECM lending limit ($1,209,750 in 2026). The MCA is then multiplied by a <strong>Principal Limit Factor (PLF)</strong> — a percentage from HUD's published table, determined by the youngest borrower's age and the "expected interest rate." At age 70 with a 6% expected rate, the PLF is approximately 0.474, so a $525,000 home yields an initial principal limit of ~$248,850.</p>
          <p className="text-slate-600 mb-3">From that principal limit, upfront costs are deducted: the Initial Mortgage Insurance Premium (IMIP) at 2% of the MCA, an origination fee capped at $6,000 (and floored at $2,500), and any other closing costs. The existing mortgage payoff is also deducted. What remains is the net amount available to you.</p>
          <p className="text-slate-600">This calculator uses an illustrative PLF table calibrated at a 6% expected rate. The actual PLF from your lender will be based on current market rates and may differ. Always get a formal quote from a HUD-approved HECM counselor or lender before making any financial decision. The four payout options — lump sum, line of credit, term monthly payments, and tenure (lifetime) monthly payments — all start from the same net available amount but structure the distribution very differently.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Worked Example</h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <p className="text-slate-700 mb-2"><strong>Scenario:</strong> 70-year-old single borrower, $525,000 home, $60,000 existing mortgage, $2,500 other closing costs, 6% expected rate.</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Max Claim = min($525,000, $1,209,750) = <strong>$525,000</strong></li>
              <li>PLF at age 70, 6% ≈ 0.474 → Initial Principal Limit = <strong>$248,850</strong></li>
              <li>IMIP = $525,000 × 2% = $10,500</li>
              <li>Origination = capped at <strong>$6,000</strong></li>
              <li>Net available: $248,850 − $10,500 − $6,000 − $2,500 − $60,000 = <strong>$169,850</strong></li>
              <li>Tenure (lifetime, to age 100 = 360 months): ≈ <strong>$1,090/month for life</strong></li>
              <li>10-year term: ≈ <strong>$1,890/month for 120 months</strong></li>
              <li>Lump sum or LOC: <strong>$169,850 today</strong></li>
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
            <li><Link href="/finance/heloc-calculator" className="text-indigo-600 hover:underline">HELOC Calculator</Link> — Compare HECM vs a traditional home equity line of credit.</li>
            <li><Link href="/finance/rmd-calculator" className="text-indigo-600 hover:underline">RMD Calculator</Link> — Coordinate HECM income with Required Minimum Distributions.</li>
            <li><Link href="/finance/annuity-calculator" className="text-indigo-600 hover:underline">Annuity Calculator</Link> — Another source of guaranteed lifetime income for retirement.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
