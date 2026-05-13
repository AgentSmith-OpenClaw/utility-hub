import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, FormulaBox, KeyTakeaways, Callout } from '../components';

export const mortgageRefinanceBreakEven: BlogArticle = {
  slug: 'mortgage-refinance-break-even',
  category: 'Real Estate',
  title: 'Mortgage Refinance Break-Even: How to Calculate It',
  description: 'Learn how refinance break-even works, what costs to include, and when a lower mortgage rate still may not be worth switching.',
  publishedDate: '2026-05-14',
  readTime: '8 min read',
  keywords: 'mortgage refinance break even, refinance break even calculator, when to refinance mortgage, refinance savings',
  relatedTools: [
    { name: 'Mortgage Refinance Calculator', href: '/finance/mortgage-refinance-calculator' },
    { name: 'Mortgage Payoff Calculator', href: '/finance/mortgage-payoff-calculator' },
    { name: 'Extra Mortgage Payment Calculator', href: '/finance/extra-mortgage-payment-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        A lower mortgage rate is not automatically a good refinance. You need to recover closing costs before you
        move, sell, refinance again, or reset the loan term too far.
      </Lead>

      <FormulaBox>
        <p className="font-mono text-lg">Break-Even Months = Refinance Costs ÷ Monthly Savings</p>
      </FormulaBox>

      <ToolCTA
        href="/finance/mortgage-refinance-calculator"
        label="Calculate Refinance Break-Even"
        hint="Compare current loan, new loan, closing costs, and break-even month."
        accent="blue"
      />

      <H2>Costs to include</H2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Origination, underwriting, and processing fees</li>
        <li>Appraisal, title, recording, and legal costs</li>
        <li>Points paid to buy down the rate</li>
        <li>Prepayment penalties, if any</li>
        <li>Any rolled-in costs that increase your new balance</li>
      </ul>

      <H2>The term-reset trap</H2>
      <p>
        Refinancing from a loan with 22 years left into a fresh 30-year mortgage can lower the payment while increasing
        lifetime interest. Compare payoff date and total interest, not only monthly savings.
      </p>

      <H3>When refinancing is strongest</H3>
      <p>
        It works best when the rate drop is meaningful, closing costs are reasonable, and you expect to keep the loan
        beyond the break-even point. Then use the <Link href="/finance/mortgage-payoff-calculator" className="text-indigo-600 font-semibold hover:underline">Mortgage Payoff Calculator</Link> to
        see if keeping the old payment on the new lower-rate loan accelerates payoff.
      </p>

      <Callout title="Cash-out refinance is a different decision" accent="amber">
        Cash-out refinancing adds borrowing. Judge it as a new debt decision, not just a rate decision.
      </Callout>

      <KeyTakeaways
        items={[
          'Break-even is refinance cost divided by monthly savings.',
          'Include all closing costs and points.',
          'A lower payment can still increase lifetime interest if the term resets.',
          'Refinance only if you expect to keep the loan beyond break-even.',
        ]}
      />
    </div>
  ),
};
