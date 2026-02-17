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
        "name": "How is compound interest different from simple interest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simple interest is calculated only on the principal amount (your initial deposit). Compound interest is calculated on the principal *plus* any accumulated interest. Over time, compound interest grows your wealth exponentially, while simple interest grows it linearly."
        }
      },
      {
        "@type": "Question",
        "name": "What is the formula for compound interest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The formula is A = P(1 + r/n)^(nt). Here, A is the future value, P is the principal, r is the annual interest rate, n is the number of compounding periods per year, and t is the time in years."
        }
      },
      {
        "@type": "Question",
        "name": "How often is interest compounded in most savings accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most high-yield savings accounts compound interest daily or monthly. The more frequent the compounding, the higher the Annual Percentage Yield (APY) compared to the Annual Percentage Rate (APR)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Rule of 72?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Rule of 72 is a mental shortcut to estimate how long it takes to double your money. Divide 72 by your annual interest rate. For example, at a 6% return, your money doubles in 12 years (72 ÷ 6 = 12)."
        }
      },
      {
        "@type": "Question",
        "name": "Does this calculator account for inflation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. By enabling the 'Inflation Adjustment' toggle, you can see your future wealth in 'today's dollars.' This shows your Real Rate of Return (Nominal Return minus Inflation Rate)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best way to maximize compound interest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start early. Time is the most powerful variable in the compounding formula. Investing smaller amounts in your 20s often yields more than investing larger amounts in your 40s due to the exponential nature of compounding."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Compound Interest Calculator — Visualize Wealth Growth & ROI | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate compound interest with monthly contributions, inflation adjustments, and tax scenarios. Visualize how small investments grow into massive wealth over time." 
        />
        <meta 
          name="keywords" 
          content="compound interest calculator, investment calculator, roi calculator, future value calculator, compound interest formula, inflation adjusted return, rule of 72, wealth growth" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/compound-interest-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Compound Interest Calculator — The 8th Wonder of the World" />
        <meta property="og:description" content="See the magic of compounding. Calculate returns with monthly deposits, inflation, and dynamic charts. Free, no signup required." />
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
                "description": "A comprehensive financial tool to calculate future value based on principal, interest rate, frequency, and inflation.",
                "applicationCategory": "FinanceApplication",
                "operatingSystem": "All",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              faqSchema
            ]
          })}
        </script>
      </Head>

      <div className="bg-slate-50 min-h-screen">
        <Header />
        
        <main className="pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Tool Section */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-4">
                Compound Interest Calculator
              </h1>
              <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-8">
                Watch your money make money. Calculate the future value of your investments with monthly contributions and inflation adjustments.
              </p>
              <CompoundInterestCalculator />
            </div>

            {/* Content Section */}
            <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 prose prose-slate prose-lg">
              
              <h2>The Eighth Wonder of the World</h2>
              <p>
                Albert Einstein reportedly called compound interest "the eighth wonder of the world." Whether the quote is authentic or not, the mathematical principle behind it is undeniable. Compounding is the engine of wealth creation. It is the reason why saving a few hundred dollars a month in your 20s can make you a millionaire by retirement, while saving thousands in your 50s might struggle to achieve the same result.
              </p>
              <p>
                At its core, <strong>compound interest</strong> is simple: it is interest on interest. When you invest money, you earn a return. In the next period, you earn a return on your original money <em>plus</em> the return you just earned. Over short periods, this effect is barely noticeable. Over long periods (10, 20, or 30 years), the curve goes vertical. This calculator is designed to help you visualize that curve and plan your financial future with precision.
              </p>

              <h3>How the Compound Interest Formula Works</h3>
              <p>
                While our calculator handles the heavy lifting, understanding the math helps you make better decisions. The standard formula for compound interest is:
              </p>
              <div className="bg-slate-100 p-6 rounded-lg font-mono text-sm overflow-x-auto my-6 border-l-4 border-blue-600">
                A = P (1 + r/n)<sup>nt</sup>
              </div>
              <p>Let's break down the variables:</p>
              <ul>
                <li><strong>A (Amount):</strong> The future value of the investment, including interest.</li>
                <li><strong>P (Principal):</strong> Your initial deposit.</li>
                <li><strong>r (Rate):</strong> The annual interest rate (in decimal form; e.g., 5% becomes 0.05).</li>
                <li><strong>n (Number of times):</strong> How often interest is compounded per year (e.g., 12 for monthly, 365 for daily).</li>
                <li><strong>t (Time):</strong> The number of years the money is invested.</li>
              </ul>
              <p>
                The most important variable here is <strong>t (Time)</strong>. Because time is an exponent in the formula, doubling the time period doesn't just double your money—it often quadruples or octuples it. This is why "starting early" is the single most effective investment strategy.
              </p>

              <h3>Simple vs. Compound Interest: A Case Study</h3>
              <p>
                To truly appreciate the power of compounding, compare it to simple interest.
              </p>
              <p>
                Imagine you invest <strong>$10,000</strong> at a <strong>7%</strong> annual return for <strong>30 years</strong>.
              </p>
              <ul>
                <li>
                  <strong>With Simple Interest:</strong> You earn 7% of $10,000 ($700) every year.
                  <br />
                  $700 × 30 years = $21,000 in interest.
                  <br />
                  <strong>Total Value: $31,000.</strong>
                </li>
                <li>
                  <strong>With Compound Interest:</strong> In year one, you earn $700. In year two, you earn 7% on $10,700 ($749). By year 30, you aren't earning $700; you're earning over $5,000 <em>per year</em> in interest alone.
                  <br />
                  <strong>Total Value: $76,123.</strong>
                </li>
              </ul>
              <p>
                The difference is staggering. The simple interest account grew by roughly 3x. The compound interest account grew by over 7.6x. That extra $45,000 didn't come from working harder; it came from the mathematical force of compounding.
              </p>

              <h3>The "Snowball Effect" of Monthly Contributions</h3>
              <p>
                Most of us don't just invest a lump sum and walk away. We contribute monthly from our paychecks. This adds fuel to the fire.
              </p>
              <p>
                If you start with $0 but invest <strong>$500/month</strong> at <strong>8%</strong> return:
              </p>
              <ul>
                <li><strong>10 Years:</strong> You have roughly <strong>$91,000</strong>. (You contributed $60,000).</li>
                <li><strong>20 Years:</strong> You have roughly <strong>$294,000</strong>. (You contributed $120,000).</li>
                <li><strong>30 Years:</strong> You have roughly <strong>$745,000</strong>. (You contributed $180,000).</li>
                <li><strong>40 Years:</strong> You have roughly <strong>$1.75 Million</strong>. (You contributed $240,000).</li>
              </ul>
              <p>
                Notice what happens between year 30 and year 40. You only contributed an extra $60,000 of your own money, but your wealth grew by <strong>over $1 million</strong>. This is the "hockey stick" moment of compounding. The money your money makes is now making more money than you can save from your salary.
              </p>

              <h3>Inflation: The Silent Wealth Killer</h3>
              <p>
                There is one catch: <strong>Inflation</strong>. A million dollars in 2050 won't buy what a million dollars buys today.
              </p>
              <p>
                To get an accurate picture of your future purchasing power, you must look at the <strong>Real Rate of Return</strong>.
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 text-slate-800 italic my-4">
                Real Return ≈ Nominal Return - Inflation Rate
              </div>
              <p>
                If your investment portfolio returns 8% per year, but inflation is running at 3%, your <em>real</em> wealth is only growing at 5%.
              </p>
              <p>
                Our calculator includes an <strong>"Inflation Adjustment"</strong> toggle. When enabled, it discounts your future value back to "today's dollars." This is crucial for retirement planning. If you need $50,000/year to live on today, you might need $100,000/year in 25 years just to maintain the same standard of living.
              </p>

              <h3>The Rule of 72</h3>
              <p>
                Want to do a quick calculation in your head? Use the <strong>Rule of 72</strong>.
              </p>
              <p>
                Divide 72 by your expected annual interest rate to find out how many years it will take for your money to double.
              </p>
              <ul>
                <li><strong>4% Return:</strong> Doubles in 18 years (72 ÷ 4).</li>
                <li><strong>6% Return:</strong> Doubles in 12 years (72 ÷ 6).</li>
                <li><strong>8% Return:</strong> Doubles in 9 years (72 ÷ 8).</li>
                <li><strong>10% Return:</strong> Doubles in 7.2 years (72 ÷ 10).</li>
                <li><strong>12% Return:</strong> Doubles in 6 years (72 ÷ 12).</li>
              </ul>
              <p>
                This rule highlights the importance of fees. If you are paying a 2% fee to a financial advisor, your 8% return becomes 6%. That seemingly small fee extends your doubling time from 9 years to 12 years—a massive delay in your financial freedom.
              </p>

              <h3>Frequency of Compounding</h3>
              <p>
                The frequency—how often interest is added to the principal—matters.
              </p>
              <ul>
                <li><strong>Daily Compounding:</strong> Standard for savings accounts. Interest is calculated 365 times a year.</li>
                <li><strong>Monthly Compounding:</strong> Common for mortgages and some investment products.</li>
                <li><strong>Annually Compounding:</strong> Interest is added once a year.</li>
              </ul>
              <p>
                The difference between monthly and annual compounding on a $10,000 investment at 5% over 10 years is relatively small (about $60), but for large loans or long time horizons, it adds up. Always ask for the <strong>APY (Annual Percentage Yield)</strong>, which accounts for compounding, rather than just the APR.
              </p>

              <h3>Actionable Tips to Accelerate Wealth</h3>
              <ol>
                <li>
                  <strong>Automate Your Savings:</strong> The best way to benefit from compounding is consistency. Set up an automatic transfer (SIP) the day your paycheck hits. You can't spend what isn't in your checking account.
                </li>
                <li>
                  <strong>Increase Contributions Annually:</strong> If you get a 3% raise, increase your savings rate by 1-2%. This "lifestyle creep" prevention ensures your savings grow faster than your spending.
                </li>
                <li>
                  <strong>Reinvest Dividends:</strong> If you own stocks or funds that pay dividends, turn on DRIP (Dividend Reinvestment Plan). Using dividends to buy more shares accelerates the compounding snowball.
                </li>
                <li>
                  <strong>Minimize Taxes:</strong> Use tax-advantaged accounts like 401(k)s, IRAs, or ISAs. Taxes are a drag on compounding. Paying taxes at the end (deferred) allows your money to compound on the gross amount for decades.
                </li>
              </ol>

              <hr className="my-12 border-slate-200" />

              <h3>Frequently Asked Questions</h3>
              <div className="not-prose space-y-8 mt-8">
                {faqSchema.mainEntity.map((faq, index) => (
                  <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h4 className="font-bold text-slate-900 text-lg mb-2">{faq.name}</h4>
                    <p className="text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>

            </article>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
