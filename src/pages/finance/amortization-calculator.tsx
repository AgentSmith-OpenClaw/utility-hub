import Head from 'next/head';
import AmortizationCalculator from '../../components/AmortizationCalculator/AmortizationCalculator';

export default function AmortizationPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Amortization Calculator",
    "url": "https://toolisk.com/finance/amortization-calculator",
    "description": "Professional loan amortization schedule calculator. See monthly principal vs interest breakdown, yearly summaries, and total interest paid.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Head>
        <title>Amortization Calculator — Loan Repayment Schedule & Table | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate your loan amortization schedule with our free online tool. See monthly principal vs interest breakdown, yearly summaries, and total interest paid. Perfect for mortgages, car loans, and personal loans." 
        />
        <meta 
          name="keywords" 
          content="amortization calculator, loan schedule, repayment breakdown, principal vs interest, mortgage calculator, loan table, monthly payment schedule, loan payoff calculator" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/amortization-calculator" />
        <meta property="og:title" content="Amortization Calculator — Loan Repayment Schedule & Table | Toolisk" />
        <meta property="og:description" content="Calculate your loan amortization schedule with our free online tool. See monthly principal vs interest breakdown, yearly summaries, and total interest paid." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/amortization-calculator" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main>
        <AmortizationCalculator />
      </main>
    </>
  );
}
