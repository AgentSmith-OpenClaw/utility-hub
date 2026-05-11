import Head from 'next/head';
import InflationCalculator from '../../components/InflationCalculator/InflationCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/inflation-calculator';

const FAQS = [
  { q: 'How is inflation measured?', a: 'In the US, inflation is measured by the Consumer Price Index (CPI), published monthly by the Bureau of Labor Statistics. The CPI tracks the price changes of a basket of goods and services typical urban consumers buy: food, housing, transportation, medical care, recreation, and education.' },
  { q: 'What is the historical US inflation rate?', a: 'The long-run average US inflation rate (1913–2025) is approximately 3.1%. This includes deflationary periods like the 1930s and high-inflation decades like the 1970s. The Federal Reserve targets 2% as a healthy long-term rate.' },
  { q: 'Why does inflation happen?', a: 'Inflation results from money supply growth exceeding economic output, supply chain shocks, energy price spikes, wage-price spirals, and government deficit spending. Central banks use interest rates to slow inflation by reducing borrowing and spending.' },
  { q: 'How does inflation affect retirement planning?', a: 'Even at 3% annual inflation, prices double in 24 years. A $50,000/year retirement budget today needs $90,000+/year in 20 years just to maintain purchasing power. This is why Social Security has cost-of-living adjustments (COLA) and why retirement projections must use inflation-adjusted ("real") returns.' },
  { q: 'Is the CPI a perfect inflation measure?', a: 'No. The CPI has known limitations: it underweights housing, struggles with quality improvements, and may understate inflation for retirees (who consume more healthcare). Many economists believe true cost-of-living inflation runs 0.5–1% higher than reported CPI.' },
];

export default function InflationCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'US Inflation Calculator',
    slug: SLUG,
    description: 'Calculate the change in purchasing power of the US dollar from 1913 to 2026 using official Consumer Price Index data.',
    category: 'FinanceApplication',
    featureList: 'Historical CPI data 1913–2026, Year-by-year chart, Cumulative inflation, Purchasing power calculator',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>US Inflation Calculator (1913–2026) — CPI Purchasing Power | Toolisk</title>
        <meta name="description" content="Calculate the change in purchasing power of the US dollar from 1913 to 2026 using official BLS Consumer Price Index data. See cumulative inflation between any two years." />
        <meta name="keywords" content="inflation calculator, us inflation calculator, cpi calculator, purchasing power calculator, dollar value over time, historical inflation, bls cpi" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="US Inflation Calculator (1913–2026) | Toolisk" />
        <meta property="og:description" content="See how the dollar's purchasing power has changed using official CPI data." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="💵" title="US Inflation Calculator" tagline="See how the purchasing power of the US dollar has changed from 1913 to today using official BLS data." gradient="from-amber-500 via-orange-600 to-red-600">
        <InflationCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A US inflation calculator using official Bureau of Labor Statistics Consumer Price Index data from 1913 to 2026. Find out what a dollar from any year is worth today, or how much an item that cost X in year A would cost in year B."
        features={[
          '📅 113 years of CPI data (1913–2026)',
          '📈 Year-by-year purchasing power chart',
          '🔢 Cumulative inflation between any two years',
          '🏛️ Official BLS Consumer Price Index source',
          '⚡ Instant calculation as you change inputs',
          '🔒 100% browser-based — runs offline',
        ]}
        steps={[
          { title: 'Enter the original amount', desc: 'How much money you are converting (e.g., $100).' },
          { title: 'Pick the start year', desc: 'The year the original amount was spent or earned.' },
          { title: 'Pick the end year', desc: 'Usually the current year or your target year.' },
          { title: 'Read the comparison', desc: 'See the inflation-adjusted value, total cumulative inflation %, and the year-by-year chart.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Why inflation matters for everyone</h2>
            <p className="text-slate-600 leading-relaxed">
              Inflation is a silent tax on cash and fixed-income assets. A savings account earning 0.5% in a 3% inflation environment loses 2.5% of purchasing power per year — even though the nominal balance grows. This is why financial planners insist on stock market exposure for long-term goals: equities have historically outpaced inflation by ~7% per year, while cash typically loses ground.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">High-inflation periods to remember</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>1917–1920:</strong> Post-WWI inflation peaked at 17%</li>
              <li><strong>1973–1982:</strong> The Great Inflation, peaking near 14% in 1980</li>
              <li><strong>2021–2023:</strong> Post-pandemic surge, peaked at 9.1% in June 2022</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Compound Interest', href: '/finance/compound-interest-calculator', icon: '📊' },
          { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
          { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
        ]}
      />
    </>
  );
}
