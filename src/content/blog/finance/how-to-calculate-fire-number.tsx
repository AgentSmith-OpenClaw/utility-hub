import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, FormulaBox, KeyTakeaways, Callout } from '../components';

export const howToCalculateFireNumber: BlogArticle = {
  slug: 'how-to-calculate-fire-number',
  category: 'Retirement',
  title: 'How to Calculate Your FIRE Number',
  description: 'Learn the simple FIRE number formula, when 25x expenses is too aggressive, and how to choose a safer withdrawal-rate target.',
  publishedDate: '2026-05-14',
  readTime: '7 min read',
  keywords: 'how to calculate fire number, fire number formula, 25x expenses, financial independence number, retire early corpus',
  relatedTools: [
    { name: 'FIRE Number Calculator', href: '/finance/fire-number-calculator' },
    { name: 'Financial Independence Retire Early Calculator', href: '/finance/financial-independence-retire-early-calculator' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Your FIRE number is the portfolio size that can support your annual expenses without salary income. The
        math is simple, but the assumptions behind it decide whether the plan is resilient or fragile.
      </Lead>

      <FormulaBox>
        <p className="font-mono text-lg">FIRE Number = Annual Expenses ÷ Safe Withdrawal Rate</p>
        <p className="text-sm text-gray-600 mt-2">At 4%, this becomes Annual Expenses × 25.</p>
      </FormulaBox>

      <ToolCTA
        href="/finance/fire-number-calculator"
        label="Calculate Your FIRE Number"
        hint="Run your spending and withdrawal-rate assumptions through the dedicated FIRE number calculator."
        accent="rose"
      />

      <H2>Start with spending, not income</H2>
      <p>
        FIRE is controlled by expenses. If you spend $60,000 per year, a 4% withdrawal rate implies a $1.5M target.
        At 3.33%, the same lifestyle needs about $1.8M. A higher salary helps you reach the target faster, but it
        does not reduce the target unless your spending falls.
      </p>

      <H2>When 25x is not enough</H2>
      <p>
        The 25x rule assumes a 4% withdrawal rate. That may be reasonable for a traditional 30-year retirement, but
        early retirees often need a longer runway. If your retirement could last 45-55 years, use 28x-33x as a
        conservative planning range.
      </p>

      <H3>Use three scenarios</H3>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Base:</strong> current annual expenses × 25.</li>
        <li><strong>Safer:</strong> current annual expenses × 30.</li>
        <li><strong>Stress case:</strong> future expenses after healthcare, housing, and tax changes × 33.</li>
      </ul>

      <Callout title="The practical test" accent="amber">
        If a 10% spending increase or a 1% lower return breaks the plan, your FIRE number is probably too lean.
      </Callout>

      <H2>Next steps</H2>
      <p>
        After estimating the target, use the full <Link href="/finance/financial-independence-retire-early-calculator" className="text-indigo-600 font-semibold hover:underline">Financial Independence Retire Early Calculator</Link> to
        test your timeline, then compare Coast and Barista FIRE if full early retirement feels too far away.
      </p>

      <KeyTakeaways
        items={[
          'Your FIRE number is annual expenses divided by withdrawal rate.',
          '25x expenses is a starting point, not a guarantee.',
          'Long early retirements usually need a 28x-33x range.',
          'Reducing spending helps twice: it raises savings and lowers the required portfolio.',
        ]}
      />
    </div>
  ),
};
