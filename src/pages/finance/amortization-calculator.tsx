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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and interest that comprise each payment until the loan is paid off at the end of its term. Early in the schedule, the majority of payments go toward interest; later in the schedule, the majority goes toward principal."
        }
      },
      {
        "@type": "Question",
        "name": "How is amortization calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The calculation involves finding the fixed monthly payment that will pay off the loan in full over a specific time period, given a fixed interest rate. The formula for the monthly payment (A) is: A = P * (r(1+r)^n) / ((1+r)^n - 1), where P is principal, r is the monthly interest rate, and n is the total number of payments."
        }
      },
      {
        "@type": "Question",
        "name": "Does extra payment reduce interest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. Any extra payment made goes directly toward the principal balance (assuming no prepayment penalties). Reducing the principal reduces the amount of interest calculated in subsequent months, which can shorten the loan term and save thousands in total interest costs."
        }
      },
      {
        "@type": "Question",
        "name": "What loans are amortized?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most installment loans are amortized. This includes 30-year and 15-year fixed-rate mortgages, auto loans, personal loans, and student loans. Credit cards are NOT amortized because they are revolving debt with varying balances and minimum payments."
        }
      },
      {
        "@type": "Question",
        "name": "What is negative amortization?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Negative amortization occurs when your monthly payment is less than the interest charged for that month. The unpaid interest is added to the principal balance, causing the total debt to increase rather than decrease. This is risky and common in certain types of adjustable-rate mortgages (ARMs)."
        }
      }
    ]
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
          content="amortization calculator, loan schedule, repayment breakdown, principal vs interest, mortgage calculator, loan table, monthly payment schedule, loan payoff calculator, amortization schedule excel, amortization formula" 
        />
        <link rel="canonical" href="https://toolisk.com/finance/amortization-calculator" />
        <meta property="og:title" content="Amortization Calculator — Loan Repayment Schedule & Table | Toolisk" />
        <meta property="og:description" content="Calculate your loan amortization schedule with our free online tool. See monthly principal vs interest breakdown, yearly summaries, and total interest paid." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://toolisk.com/finance/amortization-calculator" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, faqSchema]) }}
        />
      </Head>

      <AmortizationCalculator />

      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-lg text-gray-700">
        <h1>Amortization Calculator: Master Your Debt Payoff Strategy</h1>

        <p className="lead text-xl text-gray-600 mb-8">
          Debt isn't just a number; it's a relationship between time, interest, and your money. Our Amortization Calculator doesn't just show you what you owe—it reveals <em>how</em> you owe it, and more importantly, how to get out of it faster.
        </p>

        <p>
          Whether you're managing a mortgage, a car loan, or a personal loan, understanding amortization is the "cheat code" to financial freedom. Most people just pay the monthly bill and forget it. By analyzing your amortization schedule, you can identify exactly when your payments switch from "mostly interest" to "mostly principal," allowing you to make strategic extra payments that can shave years off your debt.
        </p>

        <h2>Why Amortization Matters (The "Front-Loaded" Trap)</h2>
        <p>
          Have you ever looked at your mortgage statement after five years of payments and wondered why the balance has barely moved? That's amortization in action. Lenders structure loans so that they collect the majority of their profit (interest) in the early years.
        </p>
        <p>
          For example, on a standard 30-year mortgage at 6% interest:
        </p>
        <ul>
          <li><strong>Year 1:</strong> ~83% of your payment goes to interest. Only 17% pays down debt.</li>
          <li><strong>Year 15:</strong> It finally flips. You start paying more principal than interest.</li>
          <li><strong>Year 29:</strong> Almost 99% of your payment goes to principal.</li>
        </ul>
        <p>
          This "front-loading" of interest is why refinancing late in a loan term is often a bad idea—you reset the clock and go back to paying mostly interest. Using this calculator allows you to see exactly where you stand on that curve.
        </p>

        <h2>How to Use This Calculator</h2>
        <p>
          Our tool is designed for clarity and precision. Here’s what the inputs mean:
        </p>
        
        <h3>1. Loan Amount</h3>
        <p>
          This is the starting principal. If you just bought a house for $400,000 and put $80,000 down, your loan amount is $320,000. Do not include your down payment here.
        </p>

        <h3>2. Interest Rate (APR)</h3>
        <p>
          Enter your annual interest rate. Even a small difference here changes the trajectory significantly. For instance, on a $300k loan, the difference between 6% and 7% is over $60,000 in total interest paid over 30 years.
        </p>

        <h3>3. Loan Term</h3>
        <p>
          How long do you have to pay it back? Common terms are:
        </p>
        <ul>
          <li><strong>Mortgages:</strong> 15 or 30 years.</li>
          <li><strong>Car Loans:</strong> 36, 48, 60, or 72 months (3-6 years).</li>
          <li><strong>Personal Loans:</strong> 2-5 years.</li>
        </ul>

        <h2>Strategic Advice: Beating the Bank</h2>
        <p>
          Once you've generated your schedule, don't just look at it—act on it. Here are three strategies to save money using amortization data:
        </p>

        <h3>Strategy A: The "Round Up" Method</h3>
        <p>
          If your mortgage payment is $1,840, round it up to $2,000. That extra $160 goes 100% toward principal. Early in the loan, $160 of principal reduction might be equivalent to a regular payment's worth of equity building.
        </p>

        <h3>Strategy B: The Bi-Weekly Hack</h3>
        <p>
          Instead of paying monthly, split your payment in half and pay every two weeks. Since there are 52 weeks in a year, you end up making 26 half-payments, which equals 13 full payments. That one extra payment per year can knock 4-6 years off a 30-year mortgage.
        </p>

        <h3>Strategy C: Recasting</h3>
        <p>
          If you come into a lump sum (inheritance, bonus) and pay a large chunk of principal, your amortization schedule changes. You can ask your lender to "recast" the loan. They keep the same term and interest rate but lower your monthly payment to reflect the new, lower balance. This is great for cash flow management.
        </p>

        <h2>The Math Behind the Schedule</h2>
        <p>
          For the math nerds, here is the formula lenders use to calculate your fixed monthly payment ($A$):
        </p>
        <div className="bg-gray-100 p-6 rounded-lg my-6 overflow-x-auto">
          <code className="text-lg font-mono">
             A = P × [r(1+r)^n] / [(1+r)^n - 1]
          </code>
        </div>
        <p>
          Where:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>P:</strong> Principal loan amount</li>
          <li><strong>r:</strong> Monthly interest rate (Annual Rate divided by 12)</li>
          <li><strong>n:</strong> Total number of payments (Loan years multiplied by 12)</li>
        </ul>
        <p>
          Each month, the interest portion is calculated as <code>Current Balance × r</code>. The rest of your fixed payment ($A$) subtracts from the balance. Because the balance shrinks slightly every month, the interest portion shrinks too, leaving more room for principal in the next payment.
        </p>

        <h2>Frequently Asked Questions</h2>
        
        <div className="space-y-6 mt-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">What is an amortization schedule?</h3>
            <p className="text-gray-700">
              An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and interest that comprise each payment until the loan is paid off at the end of its term. Early in the schedule, the majority of payments go toward interest; later in the schedule, the majority goes toward principal.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">How is amortization calculated?</h3>
            <p className="text-gray-700">
              The calculation involves finding the fixed monthly payment that will pay off the loan in full over a specific time period, given a fixed interest rate. The formula balances the shrinking interest payments (as principal drops) with increasing principal payments to keep the total monthly check constant.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Does extra payment reduce interest?</h3>
            <p className="text-gray-700">
              Yes, absolutely. Any extra payment made goes directly toward the principal balance (assuming no prepayment penalties). Reducing the principal reduces the amount of interest calculated in subsequent months, which can shorten the loan term and save thousands in total interest costs.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">What loans are amortized?</h3>
            <p className="text-gray-700">
              Most installment loans are amortized. This includes 30-year and 15-year fixed-rate mortgages, auto loans, personal loans, and student loans. Credit cards are NOT amortized because they are revolving debt with varying balances and minimum payments.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">What is negative amortization?</h3>
            <p className="text-gray-700">
              Negative amortization occurs when your monthly payment is less than the interest charged for that month. The unpaid interest is added to the principal balance, causing the total debt to increase rather than decrease. This is risky and common in certain types of adjustable-rate mortgages (ARMs).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
