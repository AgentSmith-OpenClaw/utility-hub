import { NextPage } from 'next';
import Head from 'next/head';
import MortgagePayoffCalculator from '../../components/MortgagePayoffCalculator/MortgagePayoffCalculator';

const MortgagePayoffCalculatorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mortgage Payoff vs Investment Calculator - Should You Prepay or Invest? | Toolisk</title>
        <meta
          name="description"
          content="Should you pay off your mortgage early or invest in the stock market? Compare both strategies with our free Opportunity Cost Calculator. See net worth projections, breakeven ROI, and interest savings."
        />
        <meta
          name="keywords"
          content="mortgage payoff calculator, mortgage vs investment, prepay mortgage or invest, opportunity cost calculator, mortgage prepayment, stock market vs mortgage, debt payoff calculator"
        />
        <meta property="og:title" content="Mortgage Payoff vs Investment Calculator - Opportunity Cost Analysis" />
        <meta
          property="og:description"
          content="Compare paying off your mortgage early vs investing in the stock market. Dual-simulation engine with breakeven ROI, net worth projections, and tax impact."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/mortgage-payoff-calculator" />
        <link rel="canonical" href="https://toolisk.com/finance/mortgage-payoff-calculator" />
      </Head>
      <div itemScope itemType="https://schema.org/WebApplication">
        <meta itemProp="name" content="Mortgage Payoff vs Investment Calculator" />
        <meta
          itemProp="description"
          content="Compare the financial outcomes of paying off your mortgage early versus investing in the stock market"
        />
        <meta itemProp="applicationCategory" content="FinanceApplication" />
        <MortgagePayoffCalculator />
      </div>
    </>
  );
};

export default MortgagePayoffCalculatorPage;
