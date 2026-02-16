import React from 'react';
import Head from 'next/head';
import MortgageCalculator from '../../components/MortgageCalculator/MortgageCalculator';

export default function MortgageCalculatorPage() {
  return (
    <>
      <Head>
        <title>Mortgage Calculator (2026): Estimate Payments with Taxes & PMI</title>
        <meta name="description" content="Calculate your monthly mortgage payment with our free, no-ad calculator. Includes PMI, property taxes, insurance, and HOA fees. Plan your home purchase with confidence." />
        <meta name="keywords" content="mortgage calculator 2026, monthly house payment, mortgage with taxes and pmi, best mortgage calculator no ads, home loan calculator" />
        <link rel="canonical" href="https://toolisk.com/finance/mortgage-calculator" />
        <meta property="og:title" content="Mortgage Calculator (2026): Accurate Monthly Payments" />
        <meta property="og:description" content="Get a full breakdown of your monthly mortgage payment including Principal, Interest, Taxes, and Insurance (PITI)." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/mortgage-calculator" />
      </Head>
      
      <main>
        <MortgageCalculator />
      </main>
    </>
  );
}
