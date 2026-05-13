import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, KeyTakeaways, Callout } from '../components';

export const fireNumberByAge: BlogArticle = {
  slug: 'fire-number-by-age',
  category: 'Retirement',
  title: 'FIRE Number by Age: How Much You Need to Retire Early',
  description: 'Estimate FIRE targets by age and learn why the right number changes with retirement length, spending, healthcare, and withdrawal rate.',
  publishedDate: '2026-05-14',
  readTime: '7 min read',
  keywords: 'fire number by age, fire number at 30, fire number at 40, how much to retire early, financial independence by age',
  relatedTools: [
    { name: 'FIRE Number Calculator', href: '/finance/fire-number-calculator' },
    { name: 'How Much Money Do I Need to Retire Calculator', href: '/finance/how-much-money-do-i-need-to-retire-calculator' },
    { name: 'Coast FIRE Calculator', href: '/finance/coast-fire-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Your FIRE number at 35 should not be the same as your number at 60. Earlier retirement means more years of
        withdrawals, more sequence risk, and a larger healthcare and inflation buffer.
      </Lead>

      <ToolCTA
        href="/finance/fire-number-calculator"
        label="Calculate Your FIRE Number"
        hint="Start with expenses and withdrawal rate, then stress-test the result by retirement age."
        accent="rose"
      />

      <H2>A practical age-based framework</H2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Retiring in your 30s:</strong> consider 33x+ annual expenses because the withdrawal period is very long.</li>
        <li><strong>Retiring in your 40s:</strong> 30x-33x is a more resilient range than the basic 25x rule.</li>
        <li><strong>Retiring in your 50s:</strong> 28x-30x may work if healthcare and housing are controlled.</li>
        <li><strong>Traditional retirement age:</strong> 25x can be reasonable if Social Security, pension, or annuity income helps.</li>
      </ul>

      <H2>Why age changes the target</H2>
      <p>
        A longer retirement magnifies every assumption. Inflation, medical costs, bear markets, and lifestyle changes
        have more time to compound. That is why early retirees often use a lower withdrawal rate than traditional
        retirement plans.
      </p>

      <H3>Use Coast FIRE as a checkpoint</H3>
      <p>
        If full FIRE feels far away, check whether your current investments can coast to a traditional retirement
        target. The <Link href="/finance/coast-fire-calculator" className="text-indigo-600 font-semibold hover:underline">Coast FIRE Calculator</Link> is useful for this midpoint.
      </p>

      <Callout title="Do not compare corpus without comparing expenses" accent="amber">
        A $1M portfolio can be enough for one household and too small for another. Annual spending is the anchor.
      </Callout>

      <KeyTakeaways
        items={[
          'Earlier retirement usually needs a larger expense multiple.',
          'Age changes the safe withdrawal rate more than people expect.',
          'Housing and healthcare are the biggest FIRE-number swing factors.',
          'Coast FIRE is a useful checkpoint before full FIRE.',
        ]}
      />
    </div>
  ),
};
