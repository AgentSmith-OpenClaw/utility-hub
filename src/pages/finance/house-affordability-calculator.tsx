import Head from 'next/head';
import HouseAffordabilityCalculator from '../../components/Finance/HouseAffordabilityCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/finance/house-affordability-calculator';

const FAQS = [
  {
    q: 'What is the 28/36 rule for buying a house?',
    a: 'The 28/36 rule says your monthly housing payment (PITI — principal, interest, taxes, insurance) should not exceed 28% of gross monthly income, and your total debt payments (housing + car + student loans + minimums) should not exceed 36%. Staying within both limits keeps you solidly within conventional loan guidelines and leaves financial buffer for emergencies.',
  },
  {
    q: 'What does DTI mean for a mortgage?',
    a: 'DTI stands for Debt-to-Income ratio. Front-end DTI is housing cost ÷ gross income; back-end DTI is (housing + all debts) ÷ gross income. Conventional lenders typically want front-end ≤28% and back-end ≤36–43%. FHA allows up to 31/43 with standard documentation and up to 40/50 with compensating factors. The lower your DTI, the better rate you typically qualify for.',
  },
  {
    q: 'What is the difference between conventional and FHA affordability?',
    a: 'Conventional loans (Fannie/Freddie backed) typically require 5–20% down and cap back-end DTI at 43–45%. FHA loans allow 3.5% down with credit score ≥580, and stretch DTI to 50% with compensating factors. FHA loans carry an upfront MIP (1.75% of loan) and annual MIP (0.55–1.05%), which adds to monthly cost. Use the "FHA Stretch" DTI preset in this calculator to model FHA affordability.',
  },
  {
    q: 'Should I stretch my budget to buy the most house I can afford?',
    a: 'Rarely advisable. The calculator shows the ceiling — not the target. A comfortable housing budget leaves room for maintenance (budget 1–2% of home value per year), property tax increases, HOA dues creep, and the inevitable appliance replacements. Many financial planners recommend targeting a home price of 2.5–3× your annual gross income rather than the DTI maximum, especially if you have other financial goals.',
  },
  {
    q: 'How much down payment do I really need?',
    a: 'Technically as little as 3% (conventional) or 3.5% (FHA). But under 20% you will pay Private Mortgage Insurance (PMI) on conventional loans — typically 0.5–1.5%/yr of the loan added to monthly payments. PMI disappears once you hit 20% equity. Putting 20% down avoids PMI, reduces monthly payment, and gets you a lower interest rate. If 20% means waiting 2–3 years, run the rent-vs-buy math first.',
  },
  {
    q: 'How much house can I afford on a $100,000 salary?',
    a: 'With $100k annual income, 20% down, 7% rate, and $400/month in existing debts, the standard 31/43 DTI guideline puts your max home price around $280,000–$320,000. Conservative 28/36 DTI brings it closer to $250k–$270k. FHA-stretch 36/50 DTI reaches ~$340k–$380k. Enter your exact numbers into the calculator for a precise figure — these are illustrative ranges.',
  },
];

export default function HouseAffordabilityCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'House Affordability Calculator',
    slug: SLUG,
    description:
      'Free house affordability calculator — find the maximum home price you can afford based on income, debts, down payment, and DTI guidelines. PITI breakdown, three DTI scenarios.',
    category: 'FinanceApplication',
    featureList:
      'Max home price, PITI breakdown, DTI color-flagging, Conservative vs FHA stretch scenarios, Charts',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>House Affordability Calculator — How Much Home Can You Afford? | Toolisk</title>
        <meta
          name="description"
          content="Free house affordability calculator. Enter income, debts, and down payment to find your max home price, monthly PITI, and front/back DTI — with conservative vs FHA stretch scenarios."
        />
        <meta
          name="keywords"
          content="house affordability calculator, home affordability calculator, how much house can I afford, mortgage affordability calculator, dti home loan calculator, fha affordability calculator, piti calculator"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="House Affordability Calculator — How Much Home Can You Afford? | Toolisk" />
        <meta
          property="og:description"
          content="Find your max home price with PITI breakdown, DTI color-flagging, and three DTI scenarios."
        />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        parent="finance"
        icon="🏠"
        title="House Affordability Calculator"
        tagline="Find the maximum home price you can comfortably afford — with full PITI breakdown, DTI color-flagging, and conservative vs FHA stretch scenarios."
        gradient="from-blue-600 via-indigo-600 to-violet-600"
      >
        <HouseAffordabilityCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A complete home affordability calculator that works backwards from your income and debts to the maximum home price you can qualify for — across three DTI guidelines (conservative 28/36, standard 31/43, and FHA stretch 36/50). Includes full PITI payment breakdown and side-by-side scenario charts."
        features={[
          '🏠 Max home price for three DTI scenarios',
          '📊 PITI breakdown (principal, interest, tax, insurance, HOA)',
          '🚦 Front-end and back-end DTI with color-coded limit flags',
          '🏦 Conservative, standard, and FHA stretch comparison',
          '💰 Percentage or flat-amount down payment mode',
          '💾 PDF / Excel export with all scenarios',
        ]}
        steps={[
          { title: 'Enter income & debts', desc: 'Annual gross income and monthly non-housing debt payments (car, student loan, credit card minimums).' },
          { title: 'Set down payment', desc: 'Percentage or flat amount — 3.5% FHA minimum up to 20%+ conventional.' },
          { title: 'Fill loan details', desc: 'Interest rate, term (15/20/30 yr), and DTI guideline (conservative / standard / FHA stretch).' },
          { title: 'Add taxes & insurance', desc: 'Property tax rate, homeowners insurance, and HOA — all affect PITI and therefore your max price.' },
          { title: 'Read the result', desc: 'Max home price, monthly PITI, DTI ratios, and a three-scenario comparison chart update instantly.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How "max home price" is calculated</h2>
            <p className="text-slate-600 leading-relaxed">
              The calculator solves for the home price that exhausts your DTI allowance: given your gross income, debts, and the DTI limits you choose, it derives the maximum monthly PITI, then back-calculates the loan size and home price that produces exactly that payment. Because property tax and HOA are also part of PITI, the calculation is iterative — the home price affects the tax amount, which affects the affordable price. Two passes converge the result.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">What PITI includes</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>P — Principal:</strong> The loan repayment portion of your mortgage payment</li>
              <li><strong>I — Interest:</strong> The lender's cost for the outstanding balance</li>
              <li><strong>T — Taxes:</strong> Monthly property tax escrow (lender collects to pay the county)</li>
              <li><strong>I — Insurance:</strong> Homeowners insurance escrow, and PMI if down payment &lt;20%</li>
              <li><strong>HOA:</strong> Not technically PITI but often counted in front-end DTI by lenders</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-4">DTI thresholds at a glance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="text-left px-3 py-2 rounded-tl-lg">Loan Type</th>
                    <th className="text-right px-3 py-2">Front-end DTI</th>
                    <th className="text-right px-3 py-2 rounded-tr-lg">Back-end DTI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr><td className="px-3 py-2">Conventional (ideal)</td><td className="px-3 py-2 text-right">≤28%</td><td className="px-3 py-2 text-right">≤36%</td></tr>
                  <tr><td className="px-3 py-2">Conventional (max)</td><td className="px-3 py-2 text-right">≤31%</td><td className="px-3 py-2 text-right">≤43%</td></tr>
                  <tr><td className="px-3 py-2">FHA standard</td><td className="px-3 py-2 text-right">≤31%</td><td className="px-3 py-2 text-right">≤43%</td></tr>
                  <tr><td className="px-3 py-2">FHA with compensating factors</td><td className="px-3 py-2 text-right">≤40%</td><td className="px-3 py-2 text-right">≤50%</td></tr>
                  <tr><td className="px-3 py-2">VA / USDA</td><td className="px-3 py-2 text-right">N/A</td><td className="px-3 py-2 text-right">≤41%</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-900">
              <strong>Practical rule:</strong> If stretching to the FHA limit leaves you with under 3 months of emergency fund post-closing, the deal is too tight. Lenders approve the loan; they do not feel the month-to-month squeeze. Model the mortgage payment against your actual budget, not just the DTI ratio.
            </div>
          </section>
        }
        relatedTools={[
          { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
          { name: 'Buy vs Rent Calculator', href: '/finance/buy-vs-rent-calculator', icon: '🏡' },
          { name: 'Amortization Calculator', href: '/finance/amortization-calculator', icon: '📊' },
        ]}
      />
    </>
  );
}
