import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import CompoundInterestCalculator from '../../components/CompoundInterestCalculator/CompoundInterestCalculator';

export default function CompoundInterestPage() {
  return (
    <>
      <Head>
        <title>Compound Interest Calculator — Visualize Your Wealth Growth | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate compound interest with monthly contributions, inflation adjustments, and detailed charts. See how your investments grow over time with our free calculator." 
        />
        <meta 
          name="keywords" 
          content="compound interest calculator, wealth projection, savings calculator, monthly contribution, inflation adjusted returns, financial planning" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/compound-interest-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Compound Interest Calculator — Visualize Your Wealth Growth" />
        <meta property="og:description" content="Free tool to calculate compound interest with monthly contributions and inflation adjustments. See your future wealth today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/compound-interest-calculator" />
        
        {/* Schema.org for WebApp */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Compound Interest Calculator",
            "url": "https://toolisk.com/finance/compound-interest-calculator",
            "description": "Calculate compound interest with monthly contributions, inflation adjustments, and detailed charts.",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All"
          })}
        </script>
      </Head>

      <main>
        <CompoundInterestCalculator />
      </main>
    </>
  );
}
