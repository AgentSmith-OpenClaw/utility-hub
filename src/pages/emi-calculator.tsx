import Head from 'next/head';
import AdSlot from '../components/AdSlot/AdSlot';
import EMICalculator from '../components/EMICalculator/EMICalculator';

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

      {/* Top Banner Ad */}
      <div className="w-full flex justify-center py-2 bg-white/50">
        <AdSlot slotId="top-banner" format="horizontal" label="Top Banner Ad" />
      </div>

      {/* 3-Column Layout: Left Ad | Calculator | Right Ad */}
      <div className="flex justify-center gap-4 px-2">
        {/* Left Sidebar Ads */}
        <aside
          className="hidden 2xl:flex flex-col gap-4 sticky top-4 self-start pt-4"
          aria-label="Advertisements"
        >
          <AdSlot slotId="left-skyscraper-1" format="vertical" label="Left Ad 1" />
          <AdSlot slotId="left-rectangle" format="rectangle" label="Left Ad 2" className="mt-4" />
        </aside>

        {/* Main Calculator Content */}
        <main className="flex-1 max-w-7xl min-w-0">
          <EMICalculator />
        </main>

        {/* Right Sidebar Ads */}
        <aside
          className="hidden 2xl:flex flex-col gap-4 sticky top-4 self-start pt-4"
          aria-label="Advertisements"
        >
          <AdSlot slotId="right-skyscraper-1" format="vertical" label="Right Ad 1" />
          <AdSlot slotId="right-rectangle" format="rectangle" label="Right Ad 2" className="mt-4" />
        </aside>
      </div>
    </>
  );
}
