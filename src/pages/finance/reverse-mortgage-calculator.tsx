import Head from 'next/head';
import dynamic from 'next/dynamic';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
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

      <ToolShell parent="finance" icon="🏠" title="Reverse Mortgage Calculator" tagline="Estimate HECM reverse mortgage proceeds across lump sum, line of credit, term, and lifetime tenure." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <ReverseMortgageCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Estimate HECM reverse mortgage proceeds across lump sum, line of credit, term, and lifetime tenure. 2026 limits, PLF lookup, and fee breakdown."
        features={[
          '🏠 HECM principal limit calculation',
          '📊 Principal Limit Factor (PLF) lookup',
          '💰 All four payout options compared',
          '📋 Upfront fee breakdown',
          '📈 25-year equity projection',
          '💾 PDF and Excel export',
        ]}
        steps={[
          { title: 'Enter home details', desc: 'Input home value, existing mortgage, and youngest borrower age.' },
          { title: 'Set rate assumptions', desc: 'Enter expected interest rate for PLF lookup and projection.' },
          { title: 'Choose payout option', desc: 'Compare lump sum, line of credit, term, and tenure payouts.' },
          { title: 'Review results', desc: 'See principal limit, net available, fee breakdown, and equity projection.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What Is a HECM Reverse Mortgage and Who Qualifies?</h2>
            <p className="text-slate-600 leading-relaxed">A Home Equity Conversion Mortgage (HECM) is the federally insured reverse mortgage program administered by HUD. It allows homeowners aged 62 or older to convert a portion of their home equity into cash — without selling the home or making monthly mortgage payments.</p>
            <p className="text-slate-600 leading-relaxed">Eligibility requirements: (1) You or your co-borrower must be at least 62. (2) The home must be your primary residence. (3) You must have sufficient equity (most lenders require 50%+). (4) Any existing mortgage must be paid off at closing. (5) You must complete a session with a HUD-approved HECM counselor.</p>
            <p className="text-slate-600 leading-relaxed">A HECM differs fundamentally from a HELOC or home equity loan: there are no monthly payments required. The loan balance grows over time (interest accrues) and is repaid when the last borrower leaves the home. Because it's non-recourse, the lender can never pursue you or your heirs for more than the home's value.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How Proceeds Are Calculated</h3>
            <p className="text-slate-600 leading-relaxed">The HECM amount starts with the <strong>Maximum Claim Amount (MCA)</strong> = the lesser of your home's appraised value or the FHA HECM lending limit ($1,209,750 in 2026). The MCA is then multiplied by a <strong>Principal Limit Factor (PLF)</strong> — a percentage from HUD's published table, determined by the youngest borrower's age and the expected interest rate.</p>
          </section>
        }
        relatedTools={[
          { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
          { name: 'HELOC Calculator', href: '/finance/heloc-calculator', icon: '💳' },
          { name: 'Social Security Calculator', href: '/finance/social-security-calculator', icon: '🏦' },
        ]}
        relatedArticles={[
          { title: 'Retirement Savings Age Milestones', href: '/finance/learn/retirement-savings-age-milestones' },
        ]}
      />
    </>
  );
}
