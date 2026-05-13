import Link from 'next/link';
import type { BlogArticle } from '../types';

export const mortgageBasicsFindingTheBestDeal: BlogArticle = {
  slug: 'mortgage-basics-finding-the-best-deal',
  category: 'Real Estate',
    title: 'Mortgage Basics: How to Find the Best Home Loan Deal',
    description: 'Master the fundamentals of mortgages. Learn how rates, terms, and down payments affect your total cost, and the questions to ask lenders before signing.',
    publishedDate: '2026-05-07',
    readTime: '9 min read',
    keywords: 'mortgage, home loan, mortgage rates, mortgage terms, down payment, APR, fixed vs variable',
    relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
    { name: '15 vs 30 Year Mortgage Calculator', href: '/finance/15-year-vs-30-year-mortgage-calculator' },
    { name: 'Mortgage Payoff Calculator', href: '/finance/mortgage-payoff-calculator' },
    ],
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          A mortgage is likely the largest financial commitment you'll ever make. The difference between a great deal and a mediocre one can cost you hundreds of thousands of dollars over the life of the loan.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Mortgage 101: The Fundamentals</h2>
        <p>
          A mortgage is a loan secured by real estate. You borrow money from a lender to buy a home, and the home itself serves as collateral. If you fail to pay, the lender can foreclose and sell the home to recover the loan.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Key Mortgage Components</h2>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Principal</h3>
        <p>
          The amount you're borrowing. If a home costs $400,000 and you put down $80,000, your principal is $320,000.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Interest Rate</h3>
        <p>
          The lender's cost for lending you money. A 0.5% difference on a $300,000 mortgage adds up to tens of thousands in total interest. This is why shopping rates matters enormously.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Loan Term</h3>
        <p>
          How long you have to repay. Common terms are 15, 20, and 30 years. Longer terms mean lower monthly payments but higher total interest. Shorter terms accelerate wealth building but require higher monthly cash flow.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Points (Discount Points)</h3>
        <p>
          Upfront fees paid to the lender to lower your interest rate. One point typically costs 1% of the loan amount and lowers your rate by ~0.25%. Useful if you plan to stay long-term.
        </p>

        <div className="my-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Calculate your exact mortgage:</strong> See how rate, term, and down payment affect your payment:
          </p>
          <Link
            href="/finance/mortgage-calculator"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Use Mortgage Calculator →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Fixed vs Adjustable Rate Mortgages</h2>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Fixed-Rate Mortgage</h3>
        <p>
          Your interest rate stays the same for the entire loan term (15, 20, 30 years). Monthly payments never change, making budgeting predictable. Best when rates are historically low.
        </p>
        <p className="font-semibold">Advantages:</p>
        <ul className="list-disc pl-6 space-y-1 my-2">
          <li>Predictable payments forever</li>
          <li>Protected from rate increases</li>
          <li>Simpler to understand and compare</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">Adjustable-Rate Mortgage (ARM)</h3>
        <p>
          Your rate is low initially (3-7 years), then adjusts periodically (usually annually) based on a market index. Can be cheaper initially but risky long-term.
        </p>
        <p className="font-semibold">Advantages:</p>
        <ul className="list-disc pl-6 space-y-1 my-2">
          <li>Lower initial rate</li>
          <li>Good if planning to sell before rate adjusts</li>
        </ul>
        <p className="font-semibold">Disadvantages:</p>
        <ul className="list-disc pl-6 space-y-1 my-2">
          <li>Payment shock when rate increases</li>
          <li>Unaffordable if rates spike</li>
          <li>Bad for long-term planning</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Down Payment: How Much Do You Need?</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>3-5% down:</strong> Minimal down payment, but requires mortgage insurance (PMI) and higher rates. Costs 0.5-1% extra annually until you reach 20% equity.</li>
          <li><strong>10-15% down:</strong> Middle ground, still requires PMI, better rates than 3-5%.</li>
          <li><strong>20% down:</strong> Sweet spot. Eliminates PMI, qualifies for best rates, shows lender you're serious.</li>
          <li><strong>25%+ down:</strong> Strongest negotiating position, best rates, fastest equity build.</li>
        </ul>

        <div className="my-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Pro Tip: PMI Math</h3>
          <p className="text-sm text-gray-700">
            If a 5% down payment costs $300/month in PMI vs $0 with 20% down, you're paying $3,600/year for the down payment difference. On a $400,000 home, that's $32,000. Only worth it if you'll invest that saved down payment at returns higher than your mortgage rate.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Understanding APR vs Interest Rate</h2>
        <p>
          <strong>Interest Rate:</strong> The cost you pay on the principal (e.g., 6.5%)
        </p>
        <p>
          <strong>APR (Annual Percentage Rate):</strong> The effective cost including interest, points, and fees (e.g., 6.8%)
        </p>
        <p>
          Always compare APRs, not just rates. A lender offering 6.5% with high fees might have a 7.2% APR compared to a 6.5% APR elsewhere. Over 30 years, this matters enormously.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How to Find the Best Mortgage Deal</h2>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">1. Get Your Credit Score Right</h3>
        <p>
          Credit scores directly impact your rate:
        </p>
        <ul className="list-disc pl-6 space-y-1 my-4">
          <li>760+: Best rates available</li>
          <li>700-759: Good rates</li>
          <li>680-699: Acceptable but pricier</li>
          <li>Below 680: Significantly higher rates or potential denial</li>
        </ul>
        <p>
          Even a 20-point credit score difference can mean $30,000-50,000 more in lifetime interest on a $300,000 mortgage.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">2. Shop Multiple Lenders</h3>
        <p>
          Get quotes from at least 3-5 lenders (bank, credit union, mortgage broker). Lock rates for 45 days so you can compare apples-to-apples.
        </p>
        <p>
          On a $300,000 mortgage, a 0.25% rate difference = ~$100/month or $36,000 over 30 years. Shopping is worth the time.
        </p>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">3. Compare the Loan Estimate</h3>
        <p>
          By law, lenders must provide a Loan Estimate within 3 days of application. This shows:
        </p>
        <ul className="list-disc pl-6 space-y-1 my-4">
          <li>Interest rate and APR</li>
          <li>Monthly payment (principal, interest, taxes, insurance, PMI)</li>
          <li>Closing costs and fees</li>
          <li>Points and origination fees</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">4. Negotiate Closing Costs</h3>
        <p>
          Closing costs typically run 2-5% of the loan amount. Many are negotiable:
        </p>
        <ul className="list-disc pl-6 space-y-1 my-4">
          <li>Origination fee (0.5-1%)</li>
          <li>Appraisal fees</li>
          <li>Title insurance</li>
          <li>Attorney fees</li>
        </ul>
        <p>
          Try: "Can you waive the origination fee or appraisal?" Often they'll negotiate rather than lose your business.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Key Questions to Ask Lenders</h2>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>"Is the rate locked? For how many days?"</li>
          <li>"What's the total APR, including all fees?"</li>
          <li>"Can I lock in a rate for free?"</li>
          <li>"What happens if I prepay? Any penalties?"</li>
          <li>"What's included in your closing costs?"</li>
          <li>"Do you service the loan, or sell it?"</li>
          <li>"Can you waive any fees?"</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Total Cost Comparison</h2>
        <p>
          Don't just look at the monthly payment. Calculate the total cost over the life of the loan:
        </p>
        <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-200">
          <p className="text-center font-mono text-lg mb-2">
            Total Cost = (Monthly Payment × Months) + Closing Costs + PMI (if applicable)
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            A slightly higher rate might mean lower total costs if closing costs are lower.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">30-Year vs 15-Year Mortgages</h2>
        <table className="w-full my-6 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Factor</th>
              <th className="px-4 py-3 text-left font-bold">30-Year</th>
              <th className="px-4 py-3 text-left font-bold">15-Year</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Monthly Payment</td>
              <td className="px-4 py-2">Lower (~$1,432 per $300k)</td>
              <td className="px-4 py-2">Higher (~$2,066 per $300k)</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Total Interest Paid</td>
              <td className="px-4 py-2">Higher (~$216k)</td>
              <td className="px-4 py-2">Lower (~$72k)</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Equity Build Speed</td>
              <td className="px-4 py-2">Slow initially</td>
              <td className="px-4 py-2">Fast</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2 font-semibold">Best For</td>
              <td className="px-4 py-2">Flexibility, investing difference</td>
              <td className="px-4 py-2">Wealth building, debt-free living</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Your Next Steps</h2>
        <p>
          Use our <Link href="/finance/mortgage-calculator" className="text-blue-600 font-semibold hover:underline">Mortgage Calculator</Link> to model different scenarios: down payment amounts, interest rates, and loan terms. Then cross-reference with the <Link href="/finance/buy-vs-rent-calculator" className="text-blue-600 font-semibold hover:underline">Buy vs Rent Calculator</Link> to ensure buying actually makes financial sense before you commit.
        </p>
        <p>
          Once you're ready to shop, remember: every 0.25% in interest rate matters. Shop hard, negotiate every fee, and get the best possible deal.
        </p>
      </div>
    ),
};
