import Head from 'next/head';
import EMICalculator from '../../components/EMICalculator/EMICalculator';

export default function EMICalculatorPage() {
  return (
    <>
      <Head>
        <title>Mortgage Calculator & Home Loan Interest Calculator — Toolisk</title>
        <meta
          name="description"
          content="Free mortgage calculator and home loan interest calculator for US, UK, Canada, and Europe. Compare prepayment strategies, analyze impact, view 8 interactive charts, and export amortization schedules."
        />
        <meta
          name="keywords"
          content="mortgage calculator, home loan calculator, home loan interest calculator, loan payment calculator, mortgage payment calculator, loan amortization calculator, prepayment calculator, extra payment calculator, mortgage payoff calculator"
        />
        <link rel="canonical" href="https://toolisk.com/emi-calculator" />
        <meta property="og:title" content="Mortgage Calculator & Home Loan Interest Calculator — Toolisk" />
        <meta
          property="og:description"
          content="Calculate mortgage payments, compare prepayment strategies, analyze extra payment impact, and export amortization schedules."
        />
        <meta property="og:url" content="https://toolisk.com/emi-calculator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Calculator & Home Loan Interest Calculator" />
        <meta
          name="twitter:description"
          content="Free mortgage calculator with charts, prepayment analysis, and Excel export."
        />
      </Head>

      <EMICalculator />
    </>
  );
}
