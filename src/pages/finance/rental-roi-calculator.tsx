import Head from 'next/head';
import RentalROICalculator from '../../components/Finance/RentalROICalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/rental-roi-calculator';

const FAQS = [
  { q: 'What is a good cap rate?', a: 'Cap rate (NOI ÷ purchase price) varies by market. In high-demand US metros (LA, NYC, Bay Area), 4–5% is typical. Mid-tier cities (Atlanta, Denver) target 6–8%. Cash-flow markets (Kansas City, Indianapolis, Memphis) often hit 8–10%+. Lower cap rate generally means higher appreciation potential.' },
  { q: 'What is the 1% rule?', a: 'The 1% rule says monthly rent should be at least 1% of the purchase price. A $300,000 property should rent for $3,000+/month. In most US markets in 2026 this is hard to achieve — it remains a useful screening filter for cash-flow markets.' },
  { q: 'What is cash-on-cash return?', a: 'Cash-on-cash return = annual cash flow ÷ total cash invested (down payment + closing + rehab). It tells you the actual return on the money you put in, ignoring loan paydown and appreciation. A 10%+ cash-on-cash is considered strong.' },
  { q: 'What expenses do beginners forget?', a: 'New investors typically forget: vacancy (assume 5–8%), maintenance (8–10% of rent), management fees (8–10% even if self-managed, to value your time), capital expenditures (roof, HVAC, plumbing — budget 1% of property value annually). These four can turn a "great deal" into a money pit.' },
  { q: 'What is DSCR and why do lenders care?', a: 'Debt Service Coverage Ratio = NOI ÷ annual debt service (mortgage P&I). DSCR-only loans (no income verification) require 1.20–1.25 minimum. A DSCR of 1.5+ qualifies for the best rates. DSCR < 1.0 means the property does not generate enough to cover the mortgage.' },
];

export default function RentalROICalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Rental Property ROI Calculator',
    slug: SLUG,
    description: 'Analyze rental property cash flow, cap rate, cash-on-cash return, and DSCR. Multi-currency with full income/expense breakdown.',
    category: 'FinanceApplication',
    featureList: 'Cash flow, Cap rate, Cash-on-cash, DSCR, 1% rule, GRM, Multi-currency, Verdict scoring',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Rental Property ROI Calculator — Cap Rate, Cash Flow & DSCR | Toolisk</title>
        <meta name="description" content="Free rental property analyzer with cap rate, cash flow, cash-on-cash return, DSCR, 1% rule, and GRM. Includes vacancy, maintenance, management fees. Multi-currency." />
        <meta name="keywords" content="rental property calculator, cap rate calculator, cash flow calculator, real estate roi, dscr calculator, 1 percent rule, rental property analysis" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Rental Property ROI Calculator | Toolisk" />
        <meta property="og:description" content="Cap rate, cash flow, DSCR, and the 1% rule — all in one place." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="🏘️" title="Rental Property ROI Calculator" tagline="Cap rate, cash flow, cash-on-cash return, DSCR — analyze any rental in 60 seconds." gradient="from-amber-600 via-orange-600 to-rose-600">
        <RentalROICalculator />
      </ToolShell>

      <ToolSEOContent
        description="The rental property analyzer real estate investors actually use. Calculates cap rate, cash flow, cash-on-cash return, DSCR, GRM, and the 1% rule in one view. Includes the four expenses beginners forget — vacancy, maintenance, management, and capital expenditures — so the numbers reflect reality, not a pro-forma fantasy."
        features={[
          '🏠 Cap rate, cash flow, cash-on-cash, DSCR',
          '📊 1% rule and GRM screening filters',
          '💰 Multi-currency: USD, EUR, GBP, AUD, CAD, INR',
          '🧾 Full income & expense breakdown',
          '✅ Verdict scoring (excellent / good / marginal / weak)',
          '⚠️ Includes vacancy, maintenance, and management',
        ]}
        steps={[
          { title: 'Enter purchase details', desc: 'Price, down payment, closing costs, rehab, mortgage rate, and term.' },
          { title: 'Add income and expenses', desc: 'Monthly rent, vacancy %, property tax, insurance, HOA, maintenance %, management %.' },
          { title: 'Read the metrics', desc: 'Cap rate, cash flow, cash-on-cash, and DSCR all calculated in real time.' },
          { title: 'Use the verdict', desc: 'A quick screening signal that combines cap rate and cash-on-cash to flag deal quality.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The four expenses that kill "great deals"</h2>
            <ol className="list-decimal pl-6 space-y-1.5 text-slate-600">
              <li><strong>Vacancy:</strong> assume 5–8% even in hot markets. Tenants move out, units sit empty between leases.</li>
              <li><strong>Maintenance:</strong> 8–10% of rent for ongoing repairs (clogged drains, broken appliances, paint).</li>
              <li><strong>Capital expenditures:</strong> roof every 20 years, HVAC every 15, water heater every 10. Budget 1% of property value annually as a sinking fund.</li>
              <li><strong>Management:</strong> even if self-managing, value your time at 8–10% of rent. Your time is not free.</li>
            </ol>
            <p className="text-slate-600 leading-relaxed">
              A pro-forma that shows $400/month cash flow with no vacancy, no maintenance, and no management is fiction. Plug in realistic numbers and many "good deals" become break-even or negative. The deals that survive these filters are the ones worth doing.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator', icon: '🏠' },
          { name: 'Buy vs Rent Calculator', href: '/finance/buy-vs-rent-calculator', icon: '🔑' },
          { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
        ]}
      />
    </>
  );
}
