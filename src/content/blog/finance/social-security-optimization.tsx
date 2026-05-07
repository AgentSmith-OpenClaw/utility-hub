import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const socialSecurityOptimization: BlogArticle = {
  slug: 'social-security-optimization',
  category: 'Retirement',
  title: 'Social Security Optimization: When to Claim and Why It Matters More Than You Think',
  description:
    'Claiming Social Security at 62 vs 70 is the single biggest retirement decision most people make — worth $300,000+ in expected lifetime payouts. Learn the math, the breakeven analysis, and the special cases.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    'social security, full retirement age, fra, claiming strategy, delayed retirement credits, spousal benefits, social security optimization',
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        62 or 70? It's the simplest-looking decision in retirement planning, and the one most people get
        wrong. Claim at 62 and your monthly check is permanently 30% lower than your full retirement age (FRA).
        Wait until 70 and it's 24% higher than FRA. Over 25 years of retirement, the gap between extreme
        choices can exceed $300,000.
      </Lead>

      <H2>The mechanics of claiming age</H2>
      <p>
        Three claiming ages matter:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Earliest eligibility (62):</strong> reduced benefit, locked permanently.</li>
        <li><strong>Full Retirement Age (FRA):</strong> 66–67 depending on birth year. 100% of your "Primary Insurance Amount" (PIA).</li>
        <li><strong>Delayed Retirement Credits cap (70):</strong> +8% per year of delay between FRA and 70. After 70, no further increase.</li>
      </ul>
      <p>
        The math:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Claim at 62: ~70% of PIA (if FRA is 67).</li>
        <li>Claim at FRA (67): 100% of PIA.</li>
        <li>Claim at 70: ~124% of PIA.</li>
      </ul>
      <p>
        Total spread: a benefit at 70 is roughly 77% larger than the same person's benefit at 62, for life
        and adjusted for inflation.
      </p>

      <H2>The breakeven analysis</H2>
      <p>
        For most people, the breakeven age between claiming early and waiting is around age 79–82. If you live
        past that, delaying wins; if you die before, claiming early wins. So it depends on longevity.
      </p>
      <p>
        Average US life expectancy at age 65 is about 84 (men) and 87 (women). For couples, the joint life
        expectancy — the age both spouses have died — is over 90. Median outcomes favor delaying for most
        people.
      </p>

      <Callout title="The longevity insurance frame" accent="indigo">
        Social Security isn't just retirement income — it's longevity insurance. The risk it's
        protecting against is living longer than your savings can support. Delaying maximizes the inflation-adjusted,
        guaranteed monthly check at exactly the time it's needed most: deep into retirement, when other
        savings may be depleted.
      </Callout>

      <H2>Why most people claim early</H2>
      <p>
        About 35% of new claimants take Social Security at 62. The rationales:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>"I want my money before the system changes."</strong> Social Security has political risk, but cuts to existing claimants are politically toxic. Most credible reform proposals affect only those born many years out.</li>
        <li><strong>"The breakeven means I'll be dead."</strong> True for some, but the math at the breakeven assumes investment returns on the early checks. With realistic 4–6% real returns, breakeven shifts later. And if you're wrong about longevity, the downside (running out of money at 92) is far worse than the upside (extra checks at 75).</li>
        <li><strong>"I need the money now."</strong> Sometimes legitimate. Often, taking small distributions from retirement accounts during gap years and delaying SS produces a higher lifetime total.</li>
      </ul>

      <H2>Spousal and survivor benefits</H2>
      <p>
        These add complexity that often changes the optimal claiming strategy:
      </p>

      <H3>Spousal benefit</H3>
      <p>
        A spouse who didn't earn enough credits independently can claim up to 50% of their working
        partner's PIA at FRA — but reduced if claimed earlier. Cannot be claimed until the working spouse
        files. Maxes out at FRA — no benefit from waiting past FRA on the spousal portion.
      </p>

      <H3>Survivor benefit</H3>
      <p>
        When one spouse dies, the survivor takes the larger of their own benefit or the deceased spouse's
        benefit. This is why the higher-earning spouse should usually delay to 70 — that benefit becomes the
        survivor's permanent check, often for many years.
      </p>

      <H3>The couple's strategy</H3>
      <p>
        For most married couples, the optimal pattern is:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Lower-earning spouse: claim at FRA or even at 62 (since their benefit will be replaced by survivor benefit later).</li>
        <li>Higher-earning spouse: delay to 70 to maximize the survivor benefit for whichever spouse outlives the other.</li>
      </ul>
      <p>
        This pattern can add tens of thousands in lifetime household income vs both spouses claiming at FRA.
      </p>

      <H2>The earnings test (under FRA)</H2>
      <p>
        If you claim Social Security before FRA and continue working, the earnings test reduces your benefit:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Below FRA, full year:</strong> $1 of benefit withheld per $2 earned over ~$22,320 (2026).</li>
        <li><strong>Year of reaching FRA:</strong> $1 withheld per $3 earned over ~$59,520, only counted before the FRA month.</li>
        <li><strong>FRA and after:</strong> no earnings limit. Earn anything without affecting benefits.</li>
      </ul>
      <p>
        Important: withheld benefits aren't lost forever — they're recaptured via a higher monthly
        amount after FRA. But during the working years, you may receive much less than expected.
      </p>

      <H2>Taxation of Social Security</H2>
      <p>
        Up to 85% of Social Security benefits are taxable at the federal level depending on "combined
        income" (AGI + tax-exempt interest + 50% of SS):
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Below $25k single / $32k joint: 0% taxable.</li>
        <li>$25k–$34k single / $32k–$44k joint: up to 50% taxable.</li>
        <li>Above $34k single / $44k joint: up to 85% taxable.</li>
      </ul>
      <p>
        These thresholds aren't indexed for inflation, so increasingly more retirees fall into them. Roth
        withdrawals don't count toward combined income — strategic Roth conversions before claiming SS can
        reduce SS taxation later.
      </p>
      <p>
        Some states tax Social Security benefits; most don't. Worth checking before relocating in
        retirement.
      </p>

      <H2>Special cases to know</H2>

      <H3>Government Pension Offset (GPO) and Windfall Elimination Provision (WEP)</H3>
      <p>
        If you receive a pension from work not covered by Social Security (some state and federal employment),
        these provisions can reduce or eliminate your Social Security benefits. SECURE Act 2.0 changes are
        affecting these — talk to a specialist if relevant.
      </p>

      <H3>Divorced spouse benefits</H3>
      <p>
        If you were married 10+ years and are now divorced, you can claim a spousal benefit on your ex's
        record. Doesn't affect their benefit. They don't even need to know. Multiple ex-spouses can
        each claim independently.
      </p>

      <H3>Claim and suspend (mostly gone)</H3>
      <p>
        Old "file and suspend" strategies that allowed couples to maximize benefits were eliminated by
        the Bipartisan Budget Act of 2015. Most articles describing these strategies are outdated.
      </p>

      <H2>The actual decision framework</H2>
      <p>
        Use this prioritization:
      </p>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>If you have terminal illness or strong family history of early death:</strong> claim early.</li>
        <li><strong>If you have substantial retirement savings (well-funded):</strong> delay to 70 (longevity insurance).</li>
        <li><strong>If you must work past 62 because savings are insufficient:</strong> delay to FRA at minimum to avoid the earnings test reduction.</li>
        <li><strong>If you're the higher-earning spouse:</strong> delay to 70 to maximize the survivor benefit.</li>
        <li><strong>If you're the lower-earning spouse:</strong> claim at FRA if needed, since survivor benefit will replace it.</li>
        <li><strong>If you're single, healthy, with at least 5 years of expenses in liquid savings:</strong> delay to 70.</li>
      </ol>

      <H2>The bridge strategy</H2>
      <p>
        Many early retirees use a "Social Security bridge": spend down retirement savings between
        retirement and 70, delaying SS to maximize the lifetime payout. Counterintuitively, this often
        increases lifetime portfolio safety:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>The larger SS check after 70 reduces required portfolio withdrawals for life.</li>
        <li>Lower withdrawals from the portfolio = lower sequence-of-returns risk.</li>
        <li>Spending down pre-tax 401(k) before SS can lower future RMDs.</li>
      </ul>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Claiming at 62 from anxiety about "running out of money."</strong> Often the wrong move. Bridge with savings; delay SS.</li>
        <li><strong>Not coordinating with spouse.</strong> The household optimal often differs from the individual optimal.</li>
        <li><strong>Claiming early while still working.</strong> Earnings test eats benefits and you've permanently locked in a smaller monthly amount.</li>
        <li><strong>Forgetting to compare to ex-spouse benefits.</strong> 10+ year marriages create spousal benefit eligibility forever.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Claiming at 70 vs 62 means roughly 77% more inflation-adjusted income for life — worth $300k+ over a long retirement.',
          'Breakeven age is around 79–82. Median life expectancy at 65 is well past breakeven for most people.',
          'For couples, the higher-earning spouse should usually delay to 70 to maximize the survivor benefit.',
          'Earnings test reduces benefits if you claim before FRA and keep working. Disappears at FRA.',
          'Bridge strategies (live off savings, delay SS to 70) often increase lifetime security despite the temporary higher withdrawal rate.',
        ]}
      />
    </div>
  ),
};
