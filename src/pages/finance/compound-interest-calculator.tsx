import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import CompoundInterestCalculator from '../../components/CompoundInterestCalculator/CompoundInterestCalculator';

export default function CompoundInterestPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does compound interest work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Compound interest is calculated on the principal amount and also on the accumulated interest of previous periods, allowing your investment to grow at an accelerating rate."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Rule of 72?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Rule of 72 is a quick mental formula to estimate the number of years required to double the invested money at a given annual rate of return. Divide 72 by the interest rate to get the years."
        }
      },
      {
        "@type": "Question",
        "name": "How often should interest create compound?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The more frequent the compounding interval (e.g., daily vs. monthly vs. annually), the more interest you earn. Most savings accounts compound daily or monthly."
        }
      },
      {
        "@type": "Question",
        "name": "Does this calculator adjust for inflation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our tool includes an optional inflation rate input to show you the 'Real Value' of your future savings in today's purchasing power terms."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between nominal and real return?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nominal return is the raw percentage growth. Real return is the nominal return minus the inflation rate, representing the actual increase in purchasing power."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Compound Interest Calculator — Visualize Wealth Growth | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate compound interest with monthly contributions and inflation adjustments. See how your investments grow over time with our free calculator and charts." 
        />
        <meta 
          name="keywords" 
          content="compound interest calculator, wealth projection, savings calculator, monthly contribution, inflation adjusted returns, financial planning, rule of 72" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/compound-interest-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Compound Interest Calculator — Visualize Your Wealth Growth" />
        <meta property="og:description" content="Free tool to calculate compound interest with monthly contributions and inflation adjustments. See your future wealth today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/compound-interest-calculator" />
        
        {/* Schema.org for WebApp + FAQ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "Compound Interest Calculator",
                "url": "https://toolisk.com/finance/compound-interest-calculator",
                "description": "Calculate compound interest with monthly contributions, inflation adjustments, and detailed charts.",
                "applicationCategory": "FinanceApplication",
                "operatingSystem": "All"
              },
              faqSchema
            ]
          })}
        </script>
      </Head>

      <main className="bg-slate-50 min-h-screen">
        <CompoundInterestCalculator />
        
        {/* SEO Content Section */}
        <article className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 prose prose-slate prose-lg">
          
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Master the Power of Compound Interest</h2>
          
          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">The Eighth Wonder of the World</h3>
            <p className="text-slate-600 mb-4">
              Albert Einstein is often reputed to have said, "Compound interest is the eighth wonder of the world. He who understands it, earns it... he who doesn't... pays it." Whether the quote is apocryphal or not, the mathematical truth remains: compounding is the most powerful force in finance.
            </p>
            <p className="text-slate-600 mb-4">
              Unlike <strong>simple interest</strong>, which is calculated only on the principal amount, <strong>compound interest</strong> is calculated on the principal <em>plus</em> the accumulated interest. This creates a snowball effect: your money earns money, and then that new money earns even more money. Over long periods (10, 20, or 30 years), this exponential growth separates the wealthy from the rest.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">How the Formula Works</h3>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 font-mono text-sm overflow-x-auto">
              <strong>A = P (1 + r/n)<sup>nt</sup></strong>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>A</strong>: The future value of the investment/loan, including interest.</li>
              <li><strong>P</strong>: The principal investment amount (the initial deposit).</li>
              <li><strong>r</strong>: The annual interest rate (decimal).</li>
              <li><strong>n</strong>: The number of times that interest is compounded per unit t.</li>
              <li><strong>t</strong>: The time the money is invested or borrowed for, in years.</li>
            </ul>
            <p className="text-slate-600 mt-4">
              Our calculator handles this math for you instantly, including complex scenarios like monthly contributions and inflation adjustment.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">The Rule of 72</h3>
            <p className="text-slate-600 mb-4">
              Want a quick mental shortcut? Use the <strong>Rule of 72</strong> to estimate how long it will take for an investment to double.
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 italic text-slate-700 mb-4">
              Years to Double = 72 ÷ Interest Rate
            </div>
            <p className="text-slate-600">
              For example, at a <strong>6%</strong> return, your money doubles in roughly <strong>12 years</strong> (72 / 6). At <strong>10%</strong>, it takes just <strong>7.2 years</strong>. This rule highlights why chasing even small improvements in return rates can shave years off your journey to financial freedom.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Frequency Matters: Daily vs. Monthly vs. Annual</h3>
            <p className="text-slate-600 mb-4">
              The frequency of compounding—how often interest is added back to the principal—can significantly affect your final return.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Daily Compounding:</strong> Best for savers. Interest is added every day. (Common in high-yield savings accounts).</li>
              <li><strong>Monthly Compounding:</strong> Standard for most investment accounts.</li>
              <li><strong>Annual Compounding:</strong> Interest is added only once a year.</li>
            </ul>
            <p className="text-slate-600 mt-4">
              Always check the compounding frequency of any financial product. A "5% APY" (Annual Percentage Yield) already accounts for compounding, whereas "5% APR" (Annual Percentage Rate) does not.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Inflation: The Silent Wealth Killer</h3>
            <p className="text-slate-600 mb-4">
              A million dollars today won't buy a million dollars' worth of goods in 20 years. This is due to <strong>inflation</strong>.
            </p>
            <p className="text-slate-600 mb-4">
              To understand your <em>true</em> wealth, you must look at the <strong>Real Rate of Return</strong>.
            </p>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 font-mono text-sm">
              Real Return ≈ Nominal Return - Inflation Rate
            </div>
            <p className="text-slate-600">
              If your investments grow by <strong>8%</strong> but inflation is <strong>3%</strong>, your real purchasing power only grows by roughly <strong>5%</strong>. Our calculator includes an "Expected Inflation" field to help you visualize this reality.
            </p>
          </section>

          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">3 Strategic Tips to Maximize Returns</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-900">1. Start Early (Time is King)</h4>
                <p className="text-slate-600">The biggest factor in the compound interest formula is <em>t</em> (time). Starting at age 25 vs. age 35 can result in having double the retirement corpus, even if you invest less money overall.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">2. Increase Contributions Annually</h4>
                <p className="text-slate-600">Don't let your monthly contribution stay flat. As your income grows, increase your SIP (Systematic Investment Plan) by 10% each year. This "step-up" approach dramatically accelerates wealth accumulation.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">3. Watch the Fees</h4>
                <p className="text-slate-600">Investment fees (expense ratios) compound negatively. A 1% fee might sound small, but over 30 years, it can eat up 20-30% of your potential returns. Choose low-cost index funds or ETFs when possible.</p>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, index) => (
                <div key={index}>
                  <h4 className="font-bold text-slate-800 mb-2">{faq.name}</h4>
                  <p className="text-slate-600">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

        </article>
      </main>
    </>
  );
}
