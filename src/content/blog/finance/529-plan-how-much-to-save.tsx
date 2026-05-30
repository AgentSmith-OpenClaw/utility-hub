import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Callout, KeyTakeaways } from '../components';

export const fiftyTwoNinePlanHowMuchToSave: BlogArticle = {
  slug: '529-plan-how-much-to-save',
  category: 'Investing',
  title: '529 Plan: How Much You Actually Need to Save for College',
  description:
    'Most 529 plan advice is vague. Here is the actual math — with real numbers, state tax breaks, and the overfunding fix that changed in 2024.',
  publishedDate: '2026-05-30',
  readTime: '11 min read',
  keywords:
    '529 plan, 529 calculator, college savings, 529 plan calculator, how much to save for college, 529 vs roth ira, college cost calculator, 529 contribution limits',
  relatedTools: [
    { name: '529 College Savings Calculator', href: '/finance/529-college-savings-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'Investment Calculator', href: '/finance/investment-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        A 529 plan is the single best way to save for college in the US. Growth is tax-free.
        Withdrawals for qualified expenses are tax-free. And since 2024, you can roll unused
        funds into a Roth IRA. There is no real downside — only the mistake of not starting one.
      </Lead>

      <H2>The numbers that matter</H2>
      <p>
        College costs have risen about 5% annually for decades — roughly double the general inflation rate.
        A four-year public university now averages $28,000/year (in-state, including room and board). Private:
        $60,000/year. In 18 years, at 5% inflation, those numbers become $67,000 and $143,000 per year.
      </p>
      <p>
        That means a child born today needs roughly $270,000 for a public university or $570,000 for a
        private one. Fully funding that requires $800–$1,700/month depending on your investment returns.
        Most families can't do that. The point is not to cover 100% — it is to cover enough that your
        child graduates with manageable debt, not crushing debt.
      </p>

      <ToolCTA
        href="/finance/529-college-savings-calculator"
        label="Open the 529 Calculator"
        hint="Enter your child's age, current balance, and monthly contribution — see exactly how much you'll have at college time and the funding gap."
        accent="blue"
      />

      <H2>How the math works</H2>
      <p>
        A 529 grows through monthly compounding. Your annual return converts to a monthly rate.
        The future value formula accounts for your existing balance (growing as a lump sum) and
        your ongoing contributions (growing as an annuity). The calculator uses binary search to
        find the exact monthly contribution that fully funds the gap.
      </p>
      <p>
        The key variables: child's current age, years until college, current balance, monthly
        contribution, expected return, current college cost, and cost inflation rate. Change
        any one of these and the required contribution shifts dramatically.
      </p>

      <H3>Worked example</H3>
      <p>
        Child is 5. College in 13 years. Current balance: $8,000. Monthly contribution: $300.
        Expected return: 6%. Current annual cost: $30,000. Cost inflation: 5%.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Four-year total cost at inflation: ~$236,000</li>
        <li>Projected 529 balance at college start: ~$95,400</li>
        <li>Funding shortfall: ~$140,000</li>
        <li>To fully fund: increase contribution to ~$840/month</li>
      </ul>
      <p>
        That $300/month gap is the difference between your child graduating debt-free and
        graduating with $140,000 in loans. The calculator shows you this number instantly.
      </p>

      <H2>State tax deductions: free money most people miss</H2>
      <p>
        About 30 states offer a tax deduction or credit for 529 contributions. This is not a
        federal benefit — it is state-level. The rules vary wildly:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>New York:</strong> up to $5,000 deduction (single) or $10,000 (married)</li>
        <li><strong>Illinois:</strong> up to $10,000 deduction per taxpayer</li>
        <li><strong>Indiana:</strong> 20% credit on contributions, up to $1,000 credit</li>
        <li><strong>California, Florida, Texas:</strong> no state tax deduction</li>
      </ul>
      <p>
        If your state offers a deduction, contribute at least enough to max it out. That is a
        guaranteed return on your money before any investment growth. If your state has no
        deduction, choose a plan based purely on fees and investment options — Vanguard-based
        plans in Nevada, Utah, and New York are consistently rated highest.
      </p>

      <Callout title="You can use any state's plan" accent="emerald">
        You do not need to live in a state to use its 529 plan. You can open a Nevada plan
        while living in Ohio. The only catch: you only get the tax deduction from your own
        state's plan. So the strategy is: contribute enough to your in-state plan to max the
        deduction, then put additional savings in a lower-fee out-of-state plan.
      </Callout>

      <H2>The 2024 overfunding fix: 529 to Roth IRA rollover</H2>
      <p>
        Before 2024, overfunding a 529 was risky. If your child got a scholarship or chose not
        to college, you faced a 10% penalty on earnings for non-qualified withdrawals. The
        SECURE 2.0 Act changed this.
      </p>
      <p>
        Starting in 2024, you can roll unused 529 funds directly into a Roth IRA for the
        beneficiary. Three rules: the account must be at least 15 years old, rollovers count
        against the annual Roth contribution limit ($7,000 in 2025), and the lifetime rollover
        cap is $35,000.
      </p>
      <p>
        This does not make overfunding risk-free — $35,000 is a fraction of what a well-funded
        529 might hold. But it removes the worst-case scenario. If your child does not need the
        money, it becomes tax-free retirement savings for them.
      </p>

      <H2>K-12 tuition: technically allowed, usually a bad idea</H2>
      <p>
        Since 2017, you can withdraw up to $10,000/year per student from a 529 for K-12 tuition.
        Federal tax-free. But most states do not conform to this rule for state tax purposes.
        In many states, K-12 withdrawals trigger state income tax and possibly a penalty on
        earnings. Check your state before using 529 funds for private school.
      </p>
      <p>
        More importantly: the money you pull out for kindergarten is money that will not compound
        for 13 more years. At 7% annual return, $10,000 withdrawn at age 5 would have grown to
        $24,000 by age 18. Only use 529 funds for K-12 if you are already maxing out the plan
        and have no other source.
      </p>

      <H2>What to actually do</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Open a 529 now.</strong> Even $50/month starts the clock. The biggest cost of 529 plans is delay.</li>
        <li><strong>Check your state's deduction.</strong> If one exists, contribute at least enough to max it.</li>
        <li><strong>Use the calculator.</strong> Enter your real numbers. See the gap. Decide what you can afford.</li>
        <li><strong>Set up automatic monthly contributions.</strong> Treat it like a bill, not a discretionary savings goal.</li>
        <li><strong>Revisit annually.</strong> As your income grows, increase contributions. A 10% annual step-up nearly doubles your final balance over 18 years.</li>
      </ol>

      <ToolCTA
        href="/finance/529-college-savings-calculator"
        label="Calculate Your 529 Savings Gap"
        hint="See exactly how much you need to save monthly to fully fund your child's college education."
        accent="emerald"
      />

      <KeyTakeaways items={[
        'A 529 plan offers tax-free growth and tax-free withdrawals for education expenses.',
        'College costs inflate at ~5% annually — a four-year public university will cost ~$270,000 for a child born today.',
        'About 30 states offer tax deductions for 529 contributions. Max your state\'s deduction first.',
        'Since 2024, unused 529 funds can roll into a Roth IRA (up to $35,000 lifetime).',
        'The biggest 529 mistake is not starting one. Even small contributions compound significantly over 18 years.',
      ]} />
    </div>
  ),
};
