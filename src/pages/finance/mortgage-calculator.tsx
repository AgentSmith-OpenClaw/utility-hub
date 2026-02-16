import React from 'react';
import Head from 'next/head';
import MortgageCalculator from '../../components/MortgageCalculator/MortgageCalculator';

export default function MortgageCalculatorPage() {
  return (
    <>
      <Head>
        <title>Mortgage Calculator with PMI, Taxes & Insurance | Toolisk</title>
        <meta name="description" content="Free mortgage calculator to estimate your monthly house payment. Includes property taxes, home insurance, PMI, and HOA fees for accurate budgeting." />
        <meta name="keywords" content="mortgage calculator, monthly payment, house payment calculator, mortgage with pmi and taxes, home loan calculator" />
      </Head>
      
      <main>
        <MortgageCalculator />
      </main>
    </>
  );
}
