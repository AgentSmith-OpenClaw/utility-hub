import Head from 'next/head';
import RealHourlyWageCalculator from '../../components/RealHourlyWageCalculator/RealHourlyWageCalculator';

export default function RealHourlyWagePage() {
  return (
    <>
      <Head>
        <title>Real Hourly Wage Calculator — Discover Your True Earnings | Toolisk</title>
        <meta
          name="description"
          content="Calculate your real hourly wage after accounting for commute time, unpaid overtime, work-related costs, and shadow work. Discover what you truly earn per hour."
        />
        <meta
          name="keywords"
          content="real hourly wage calculator, true hourly rate, shadow work calculator, commute cost calculator, work life balance, salary analysis, wage erosion"
        />
        <link rel="canonical" href="https://toolisk.com/finance/real-hourly-wage-calculator" />

        {/* Open Graph */}
        <meta property="og:title" content="Real Hourly Wage Calculator — Discover Your True Earnings" />
        <meta property="og:description" content="Free tool to calculate your real hourly wage after shadow work, commute time, and hidden employment costs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/real-hourly-wage-calculator" />

        {/* Schema.org for WebApp */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Real Hourly Wage Calculator",
            "url": "https://toolisk.com/finance/real-hourly-wage-calculator",
            "description": "Calculate your real hourly wage after accounting for commute time, unpaid overtime, work-related costs, and shadow work.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
          })}
        </script>
      </Head>

      <main>
        <RealHourlyWageCalculator />
      </main>
    </>
  );
}
