import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import IncomeTaxCalculator from '../../components/IncomeTaxCalculator/IncomeTaxCalculator';

export default function IncomeTaxPage() {
  return (
    <>
      <Head>
        <title>Income Tax Calculator FY 2025-26 — Old vs New Regime Comparison | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate your income tax for FY 2025-26 (AY 2026-27) with the latest budget changes. Compare Old vs New Tax Regimes, including 87A rebate and ₹75k standard deduction." 
        />
        <meta 
          name="keywords" 
          content="income tax calculator fy 2025-26, new tax regime vs old regime, tax calculator india, income tax budget 2025, 87A rebate, salaried tax calculator" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/income-tax-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Income Tax Calculator FY 2025-26 — Old vs New Regime Comparison" />
        <meta property="og:description" content="Compare Old vs New Tax Regimes for FY 2025-26 with latest budget updates. Free, fast and accurate tax projections." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/income-tax-calculator" />
      </Head>

      <main>
        <IncomeTaxCalculator />
      </main>
    </>
  );
}
