import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const sequenceOfReturnsRisk: BlogArticle = {
  slug: 'sequence-of-returns-risk',
  category: 'Retirement',
  title: 'Sequence of Returns Risk: The Hidden Threat to Early Retirement',
  description:
    'Two retirees with identical average returns can have wildly different outcomes — one retires comfortably, the other runs out of money. Learn why the order of returns matters more than the average.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    'sequence of returns risk, retirement risk, early retirement, withdrawal rate, safe withdrawal rate, retirement planning',
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Two retirees, both with $1 million, both withdrawing 4%, both earning a 7% average return. One ends with
        $2 million after 25 years. The other runs out of money in year 17. The difference: the order in which
        returns arrived. This is sequence of returns risk — the most important concept most pre-retirees have
        never heard of.
      </Lead>

      <H2>The arithmetic that breaks intuition</H2>
      <p>
        While you're accumulating, only the average return matters. A 7% average over 30 years grows the same
        amount whether the bad years come first or last — you're not selling anything.
      </p>
      <p>
        But once you're withdrawing, you're selling shares to fund expenses. Selling shares <em>after</em>
        a market drop crystallizes the loss. The portfolio can't fully recover because the shares used to fund
        the withdrawal aren't around to participate in the rebound.
      </p>

      <Callout title="The asymmetry" accent="amber">
        Pull $40k from a $1M portfolio after a 30% drop, and you've sold a larger fraction of shares than you
        would have at the original price. You've permanently reduced your share count. When the market
        eventually recovers, you don't.
      </Callout>

      <H2>Two retirees, same average return</H2>
      <p>
        Both start with $1M, withdraw $40k/year (4%) growing 3% with inflation, and earn 7% average over 25 years.
        The only difference is when the bad years happen.
      </p>

      <H3>Retiree A: bad sequence (recession in years 1–5)</H3>
      <p>
        Years 1–5: returns of -15%, -10%, +5%, +5%, +5%.<br />
        Years 6–25: average ~10% to make the long-run average 7%.
      </p>
      <p>
        End balance after 25 years: <strong>broke around year 17</strong>. The early drawdowns ate the seed capital.
      </p>

      <H3>Retiree B: good sequence (recession in years 21–25)</H3>
      <p>
        Years 1–20: average ~10%.<br />
        Years 21–25: returns of -15%, -10%, +5%, +5%, +5%.
      </p>
      <p>
        End balance after 25 years: <strong>over $2 million</strong>. Early gains compounded enough that even the
        late-stage drop didn't threaten the portfolio.
      </p>

      <p>
        Same average return. Same withdrawals. Wildly different outcomes — entirely from the order. This is what
        sequence of returns risk does.
      </p>

      <H2>Why the "4% rule" was designed for this</H2>
      <p>
        Bill Bengen's original 1994 study tested every historical 30-year window in US market history. The 4%
        withdrawal rate isn't the historical average — it's the rate that survived even the
        <em> worst</em> sequence: someone retiring in 1966, just before a brutal decade of stagflation.
      </p>
      <p>
        4% is a stress-test result, not a baseline. It assumes:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>50–75% stocks, 25–50% bonds.</li>
        <li>30-year horizon (longer horizons need lower rates).</li>
        <li>Constant inflation-adjusted withdrawal regardless of market.</li>
      </ul>
      <p>
        Modern updates (Trinity study, Pfau's research) generally find 3.5–4% is appropriate for 30-year
        retirements; 3.0–3.3% for 50+ year early-retirement windows.
      </p>

      <H2>The danger zone</H2>
      <p>
        Sequence risk is most dangerous in the 5–10 years <em>just before and after</em> retirement. Why:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Your portfolio is at its largest dollar value — a 30% drop costs more than ever.</li>
        <li>You're about to start (or have just started) withdrawals.</li>
        <li>You no longer have decades to recover.</li>
        <li>Going back to work to wait it out is harder than people imagine.</li>
      </ul>

      <H2>How to defuse the bomb</H2>

      <H3>1. Glide-path your asset allocation</H3>
      <p>
        Reduce equity exposure as you approach retirement, then optionally <em>increase</em> it through retirement
        — counterintuitively. Pfau's "rising equity glidepath" research suggests starting retirement
        at 30–40% stocks and gradually moving to 60–70% as the danger zone passes.
      </p>

      <H3>2. Build a bond/cash tent</H3>
      <p>
        Hold 2–3 years of withdrawals in cash or short-term bonds at retirement. When markets drop, fund
        withdrawals from the bond tent rather than selling stocks at lows. Refill the tent in good years.
      </p>

      <H3>3. Use a flexible withdrawal strategy</H3>
      <p>
        Instead of mechanically withdrawing 4% inflation-adjusted, adapt:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Guardrails (Guyton-Klinger):</strong> increase or decrease withdrawal based on portfolio performance vs target. Allows higher initial withdrawal (~5%) but requires willingness to cut spending in bad years.</li>
        <li><strong>VPW (Variable Percentage Withdrawal):</strong> withdraw a fixed percentage that grows with age — like RMDs but flexible.</li>
        <li><strong>Bucket strategy:</strong> short-term, medium-term, long-term buckets refilled from each other based on market conditions.</li>
      </ul>

      <H3>4. Have flexibility in expenses</H3>
      <p>
        If your retirement spending is 80% essential (housing, healthcare, food) and 20% discretionary (travel,
        dining), you can tolerate sequence risk because you can cut the 20% during bad years. If 100% is
        essential, sequence risk hits much harder.
      </p>

      <H3>5. Have human capital reserves</H3>
      <p>
        Maintain skills, network, and willingness to do part-time work. A bad retirement year that requires you
        to earn $20k of part-time income for 2 years can rescue a portfolio that would otherwise fail.
      </p>

      <H2>The early retiree's special problem</H2>
      <p>
        FIRE retirees face sequence risk on steroids:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>50+ year horizons mean even small 4% mistakes compound to failure.</li>
        <li>Less Social Security cushion at the back end.</li>
        <li>Fewer years of human capital to fall back on.</li>
        <li>No employer health insurance to cushion bad years.</li>
      </ul>
      <p>
        Most FIRE planners use 3.0–3.5% withdrawal rates and have a written "Plan B" that includes
        part-time work, downsizing housing, or relocating to lower-cost-of-living areas if portfolio drops below
        threshold.
      </p>

      <H2>Modeling it for yourself</H2>
      <p>
        Pure averages lie. Use Monte Carlo simulation tools that run your plan against hundreds of historical
        sequences. Look at:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>The 5th–10th percentile outcome (your worst-case).</li>
        <li>The probability of failure (running out before age 95).</li>
        <li>The required portfolio drop that would force a Plan B.</li>
      </ul>
      <p>
        A 95% "success rate" sounds great, but it means a 5% chance you spend your last decades in
        forced poverty. Many planners aim for 99%+ success rates and accept the lower withdrawal rate that
        requires.
      </p>

      <Callout title="The cruelest variant: high inflation + low returns" accent="rose">
        The 1966 cohort that defines the 4% rule didn't suffer from a single market crash. They suffered
        from a decade of stagflation: 7% inflation, low real stock returns. The withdrawals scaled up with
        inflation while the portfolio couldn't keep pace. Modern stress tests should include this
        scenario — not just "2008 happens."
      </Callout>

      <H2>Behavioral pitfalls</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Increasing equity exposure right before retirement</strong> because you finally have enough money to "take risk." This is when you can least afford it.</li>
        <li><strong>Front-loading retirement spending</strong> for the "go-go years" without a written cap. A bad sequence in year 3 means you've overspent the money that needed to last.</li>
        <li><strong>Not annuitizing any portion</strong>. A small fixed annuity (covering essentials) immunizes essential spending from sequence risk entirely.</li>
        <li><strong>Believing "the market always comes back."</strong> Yes, but if you're selling shares at the bottom, you don't.</li>
      </ul>

      <KeyTakeaways
        items={[
          'During accumulation, only average return matters. During withdrawal, the order of returns can change outcomes by years of solvency.',
          'The danger zone is the 5–10 years before and after retirement — biggest dollar drops, smallest recovery time.',
          'Defenses: glide-path equity allocation, 2–3 year bond/cash tent, flexible withdrawal strategy, expense flexibility.',
          '4% rule is a stress-test result, not an average. For 50-year FIRE horizons, 3.0–3.5% is more defensible.',
          'Run Monte Carlo simulations. Look at 5th-percentile outcomes, not just averages or medians.',
        ]}
      />

      <p>
        Stress-test your retirement plan with our <Link href="/finance/fire-calculator" className="text-indigo-600 font-semibold hover:underline">FIRE
        Calculator</Link> — try different return paths and see how the order changes outcomes.
      </p>
    </div>
  ),
};
