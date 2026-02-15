import { NextPage } from 'next';
import Head from 'next/head';
import BuyVsRentRedesigned from '../../components/BuyVsRent/BuyVsRentRedesigned';

const BuyVsRentCalculatorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Buy vs Rent Calculator - Compare Buying vs Renting a Home | Utility Hub</title>
        <meta
          name="description"
          content="Make an informed decision with our Buy vs Rent Calculator. Compare the total costs, net worth impact, and break-even analysis of buying versus renting a home over time."
        />
        <meta
          name="keywords"
          content="buy vs rent calculator, rent or buy calculator, home buying calculator, rent vs buy comparison, real estate calculator, homeownership calculator"
        />
        <meta property="og:title" content="Buy vs Rent Calculator - Home Ownership Comparison Tool" />
        <meta
          property="og:description"
          content="Compare buying vs renting with detailed cost analysis, net worth projections, and personalized recommendations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://utilityhub.app/finance/buy-vs-rent-calculator" />
        <link rel="canonical" href="https://utilityhub.app/finance/buy-vs-rent-calculator" />
      </Head>
      <div itemScope itemType="https://schema.org/WebApplication">
        <meta itemProp="name" content="Buy vs Rent Calculator" />
        <meta
          itemProp="description"
          content="Compare the financial outcomes of buying versus renting a home"
        />
        <meta itemProp="applicationCategory" content="FinanceApplication" />
        <BuyVsRentRedesigned />
      </div>
    </>
  );
};

export default BuyVsRentCalculatorPage;
