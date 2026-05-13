import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Comparison, KeyTakeaways, Callout } from '../components';

export const socialSecurity62Vs67Vs70: BlogArticle = {
  slug: 'social-security-62-vs-67-vs-70',
  category: 'Retirement',
  title: 'Social Security at 62 vs 67 vs 70: Break-Even Guide',
  description: 'Compare Social Security claiming at 62, full retirement age, and 70. Learn how break-even age, health, work, and spouse benefits affect the decision.',
  publishedDate: '2026-05-14',
  readTime: '8 min read',
  keywords: 'social security 62 vs 67 vs 70, social security break even, when to claim social security, delayed retirement credit',
  relatedTools: [
    { name: 'Social Security 62 vs 67 Calculator', href: '/finance/social-security-62-vs-67-calculator' },
    { name: 'Social Security Break-Even Calculator', href: '/finance/social-security-break-even-calculator' },
    { name: 'Delayed Retirement Credit Calculator', href: '/finance/delayed-retirement-credit-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Claiming Social Security early gives income sooner but permanently lowers monthly benefits. Waiting increases
        monthly checks, but you need to live long enough for the larger payments to catch up.
      </Lead>

      <ToolCTA
        href="/finance/social-security-break-even-calculator"
        label="Calculate Social Security Break-Even"
        hint="Compare lifetime benefits across claiming ages and see where delayed claiming catches up."
        accent="violet"
      />

      <Comparison
        leftTitle="Claim at 62"
        left={<p>More checks sooner, lower monthly benefit, useful when health or cashflow is uncertain.</p>}
        rightTitle="Claim at 70"
        right={<p>Fewer checks upfront, highest monthly benefit, useful for longevity and spouse protection.</p>}
      />

      <H2>The break-even idea</H2>
      <p>
        Break-even age is when the total lifetime dollars from waiting exceed the total from claiming early. It is not
        the only factor, but it frames the trade-off clearly.
      </p>

      <H3>Factors that change the answer</H3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Health and family longevity</li>
        <li>Whether you are still working</li>
        <li>Spousal or survivor benefit planning</li>
        <li>Portfolio size and withdrawal pressure</li>
        <li>Taxes on Social Security benefits</li>
      </ul>

      <Callout title="Spouses should plan together" accent="amber">
        The higher earner’s delayed claim can increase survivor benefits. That makes the household decision different
        from a simple single-person break-even calculation.
      </Callout>

      <p>
        Use the <Link href="/finance/social-security-62-vs-67-calculator" className="text-indigo-600 font-semibold hover:underline">62 vs 67 calculator</Link> for
        early-versus-full retirement age, then test age 70 with the delayed retirement credit page.
      </p>

      <KeyTakeaways
        items={[
          'Claiming early gives income sooner but lowers monthly benefits.',
          'Waiting can improve longevity protection and survivor benefits.',
          'Break-even age is useful but not the whole decision.',
          'Married households should evaluate benefits jointly.',
        ]}
      />
    </div>
  ),
};
