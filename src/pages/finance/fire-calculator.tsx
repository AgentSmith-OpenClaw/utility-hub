import Head from 'next/head';
import FIRECalculator from '../../components/FIRECalculator/FIRECalculator';

export default function FIRECalculatorPage() {
  return (
    <>
      <Head>
        <title>
          FIRE Calculator — Financial Independence Retire Early | Toolisk
        </title>
        <meta
          name="description"
          content="Free FIRE calculator to plan your early retirement. Calculate your FIRE number, compare Lean/Fat/Coast/Barista FIRE types, visualize portfolio growth, and track milestones to financial independence."
        />
        <meta
          name="keywords"
          content="FIRE calculator, financial independence calculator, retire early calculator, FIRE number, 4 percent rule calculator, early retirement calculator, lean fire, fat fire, coast fire, barista fire, retirement savings calculator"
        />
        <link rel="canonical" href="https://toolisk.com/fire-calculator" />
        <meta
          property="og:title"
          content="FIRE Calculator — Financial Independence Retire Early | Toolisk"
        />
        <meta
          property="og:description"
          content="Calculate your FIRE number, compare Lean/Fat/Coast/Barista FIRE strategies, and visualize your path to financial independence. Free and feature-rich."
        />
        <meta
          property="og:url"
          content="https://toolisk.com/fire-calculator"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="FIRE Calculator — Financial Independence Retire Early"
        />
        <meta
          name="twitter:description"
          content="Free FIRE calculator with interactive charts, milestone tracking, and FIRE type comparison."
        />
      </Head>

      <FIRECalculator />
    </>
  );
}
