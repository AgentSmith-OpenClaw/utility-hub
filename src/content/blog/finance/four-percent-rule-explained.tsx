import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, FormulaBox, KeyTakeaways, Callout } from '../components';

export const fourPercentRuleExplained: BlogArticle = {
  slug: 'four-percent-rule-explained',
  category: 'Retirement',
  title: '4% Rule Explained: When It Works and When It Fails',
  description: 'Understand the 4% rule, why it leads to a 25x expenses target, and when early retirees should use a more conservative withdrawal rate.',
  publishedDate: '2026-05-14',
  readTime: '8 min read',
  keywords: '4 percent rule, 4% rule explained, safe withdrawal rate, 25x expenses, fire withdrawal rate',
  relatedTools: [
    { name: 'FIRE Number Calculator', href: '/finance/fire-number-calculator' },
    { name: 'Financial Independence Retire Early Calculator', href: '/finance/financial-independence-retire-early-calculator' },
    { name: 'Investment Calculator', href: '/finance/investment-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        The 4% rule says a retiree can withdraw 4% of a portfolio in year one, then adjust that dollar amount for
        inflation each year. It is a useful starting point, not a universal guarantee.
      </Lead>

      <FormulaBox>
        <p className="font-mono text-lg">Portfolio Target = Annual Spending × 25</p>
        <p className="text-sm text-gray-600 mt-2">25x comes from 1 ÷ 0.04.</p>
      </FormulaBox>

      <ToolCTA
        href="/finance/fire-number-calculator"
        label="Test Withdrawal Rates"
        hint="Compare 4%, 3.5%, and 3% targets with your own expense level."
        accent="rose"
      />

      <H2>Where the rule works best</H2>
      <p>
        The 4% rule is strongest for diversified stock/bond portfolios, traditional retirement lengths, flexible
        spending, and lower tax drag. It becomes weaker when retirement is very long, inflation is volatile, or the
        portfolio is concentrated.
      </p>

      <H2>When to use less than 4%</H2>
      <ul className="list-disc pl-6 space-y-2">
        <li>You are retiring in your 30s or 40s.</li>
        <li>Your expenses have little room to cut during bear markets.</li>
        <li>You expect high healthcare or family-support costs.</li>
        <li>You are planning in a higher-inflation country or currency.</li>
      </ul>

      <H3>Flexible withdrawals beat rigid rules</H3>
      <p>
        A retiree who can reduce spending after a market crash needs less safety margin than one who must withdraw
        the same real amount every year.
      </p>

      <Callout title="Use the rule as a dashboard, not autopilot" accent="amber">
        Revisit the withdrawal plan every year. A safe starting rate can still become unsafe after bad markets,
        higher inflation, or lifestyle creep.
      </Callout>

      <KeyTakeaways
        items={[
          'The 4% rule implies a 25x expenses portfolio.',
          'Early retirees often need 3-3.5% instead.',
          'Spending flexibility is one of the strongest retirement safety tools.',
          'Withdrawal rate should be reviewed, not set once forever.',
        ]}
      />
    </div>
  ),
};
