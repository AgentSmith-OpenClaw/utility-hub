import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import IncomeTaxCalculator from '../../components/IncomeTaxCalculator/IncomeTaxCalculator';

export default function IncomeTaxPage() {
  return (
    <>
      <Head>
        <title>India 2026 Tax Calculator — Old vs New Regime Comparison | Toolisk</title>
        <meta 
          name="description" 
          content="India 2026 Tax Calculator for FY 2025-26 (AY 2026-27). Compare Old vs New Regimes with surcharge, slab-wise breakdown, monthly projections, and tax curve analysis. Updated with Union Budget 2025 changes." 
        />
        <meta 
          name="keywords" 
          content="india 2026 tax calculator, income tax calculator fy 2025-26, new tax regime vs old regime, tax calculator india, income tax budget 2025, 87A rebate, surcharge calculator, salaried tax calculator" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/income-tax-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="India 2026 Tax Calculator — Old vs New Regime Comparison" />
        <meta property="og:description" content="Compare Old vs New Tax Regimes for FY 2025-26 with surcharge, slab-wise breakdown, and tax curve. Free, fast and accurate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/income-tax-calculator" />
      </Head>

      <main>
        <IncomeTaxCalculator />
      </main>
    </>
  );
}
