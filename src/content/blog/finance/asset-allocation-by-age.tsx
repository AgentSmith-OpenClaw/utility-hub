import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const assetAllocationByAge: BlogArticle = {
  slug: 'asset-allocation-by-age',
  category: 'Investing',
  title: 'Asset Allocation by Age: Beyond the Outdated "Age in Bonds" Rule',
  description:
    'The right mix of stocks, bonds, and cash isn\'t a simple formula. Learn how to set allocation based on time horizon, risk capacity, and what\'s missing from generic age-based rules.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'asset allocation, age in bonds, stock bond split, target date fund, glide path, portfolio rebalancing',
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        "Subtract your age from 100 — that's your stock allocation." This rule is intuitive, easy to
        remember, and decades out of date. With longer life expectancy, lower bond yields, and lower equity
        return assumptions than the era when the rule was coined, modern allocation needs more nuance.
      </Lead>

      <H2>Why generic age-based rules fail</H2>
      <p>
        The "100 minus age" rule was reasonable when:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Life expectancy at 65 was ~15 years (now: 20+ years).</li>
        <li>Bond yields were 6–8% (now: 4–5%).</li>
        <li>Equity returns were assumed to be 10–12% (now: 6–8% real, depending on valuation).</li>
        <li>Pensions covered most retirees' essential spending (now: rare).</li>
      </ul>
      <p>
        Modern updates push the equity allocation higher — "110 minus age" or "120 minus age"
        for younger investors. But even those undersell the actual variables that should drive the decision.
      </p>

      <H2>The four real inputs</H2>

      <H3>1. Time horizon</H3>
      <p>
        Money you don't need for 20+ years has very little need to be in bonds. Money you need next year
        has no business being in stocks. The age-vs-bonds rule conflates these by assuming everyone has the same
        single-bucket portfolio and the same retirement age.
      </p>

      <H3>2. Risk capacity (financial)</H3>
      <p>
        How much loss can you absorb without changing your goals? A 30-year-old saver with 35 years to retirement
        and a stable job has high risk capacity — even a 50% drawdown won't derail them. A retiree with
        $500k and no pension has low capacity — a 50% drawdown is existential.
      </p>

      <H3>3. Risk tolerance (psychological)</H3>
      <p>
        Will you actually hold through a 40% drawdown without panic-selling? Most people overestimate their
        tolerance until they live through one. The 2008 financial crisis caused tens of millions of people to
        sell at the bottom — exactly the wrong time. If you'd sell at -40%, you should hold less in stocks
        even if your time horizon and risk capacity say otherwise.
      </p>

      <H3>4. Income stability</H3>
      <p>
        A stable W-2 worker can hold more equity than a freelancer with variable income. A doctor or engineer
        with high "human capital" reserves (employability) has more equity capacity than someone in a
        declining industry.
      </p>

      <H2>A more realistic framework</H2>
      <p>
        Use a base allocation by age, then adjust by ±10–20% based on your specific situation:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Age</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Stocks</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Bonds</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Cash</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border-b px-4 py-2">20s</td><td className="border-b px-4 py-2">90–100%</td><td className="border-b px-4 py-2">0–10%</td><td className="border-b px-4 py-2">Emergency fund only</td></tr>
            <tr><td className="border-b px-4 py-2">30s</td><td className="border-b px-4 py-2">85–95%</td><td className="border-b px-4 py-2">5–15%</td><td className="border-b px-4 py-2">Emergency fund only</td></tr>
            <tr><td className="border-b px-4 py-2">40s</td><td className="border-b px-4 py-2">75–90%</td><td className="border-b px-4 py-2">10–25%</td><td className="border-b px-4 py-2">Emergency fund only</td></tr>
            <tr><td className="border-b px-4 py-2">50s</td><td className="border-b px-4 py-2">60–80%</td><td className="border-b px-4 py-2">20–40%</td><td className="border-b px-4 py-2">1–2 years living expenses</td></tr>
            <tr><td className="border-b px-4 py-2">60s</td><td className="border-b px-4 py-2">50–70%</td><td className="border-b px-4 py-2">30–50%</td><td className="border-b px-4 py-2">2–3 years living expenses</td></tr>
            <tr><td className="px-4 py-2">70s+</td><td className="px-4 py-2">40–60%</td><td className="px-4 py-2">35–55%</td><td className="px-4 py-2">2–3 years living expenses</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        Adjustments to apply:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Pension covering essentials → +10% stocks (more risk capacity)</li>
        <li>Variable income freelancer → -10% stocks (less risk capacity)</li>
        <li>Plan to work past 65 → +10% stocks (longer effective accumulation)</li>
        <li>Documented panic-selling history → -10% stocks (lower behavioral tolerance)</li>
        <li>Family history of long life (90+) → +5–10% stocks at retirement (longer horizon)</li>
      </ul>

      <H2>The three-fund portfolio</H2>
      <p>
        Within your stock allocation, three index funds cover essentially everything:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>US total market (VTI / FZROX / SWTSX):</strong> 50–60% of equity</li>
        <li><strong>International (VXUS / FZILX / SWISX):</strong> 30–40% of equity</li>
        <li><strong>Total US bond (BND / FXNAX / SWAGX):</strong> the bond portion</li>
      </ul>
      <p>
        That's it. Three funds, well-diversified, low expenses (under 0.10% blended). Adding more usually
        adds complexity without improving outcomes.
      </p>

      <Callout title="The international debate" accent="indigo">
        Some advisors say go 0% international (US is already global). Vanguard's research suggests 20–40%
        is optimal for diversification. The honest answer: it's likely a small effect either way over 30
        years. Pick a number you can stick with through periods of US outperformance (which makes you doubt
        international) and US underperformance (which makes you doubt your conviction).
      </Callout>

      <H2>Target-date funds: when to use them</H2>
      <p>
        Target-date funds (e.g., Vanguard 2055, Fidelity Freedom 2050) automatically glide allocation from
        equity-heavy to bond-heavy as you approach the target year. Pros:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Set-and-forget — no annual rebalancing needed.</li>
        <li>Built-in international diversification.</li>
        <li>Encourages discipline — you can't panic-sell "just the bonds".</li>
      </ul>
      <p>
        Cons:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Higher fees than DIY (~0.10–0.15% vs 0.03% for a 3-fund portfolio).</li>
        <li>Fixed glide path may be too conservative or too aggressive for you.</li>
        <li>Holds bonds in taxable accounts (tax-inefficient).</li>
      </ul>
      <p>
        Best use: target-date in 401(k); 3-fund portfolio in IRA and taxable. This separates "set and
        forget" for the captive 401(k) menu from optimized location for the accounts you control.
      </p>

      <H2>Asset location: where to hold what</H2>
      <p>
        Where you hold each asset class affects after-tax return:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Bonds in tax-deferred accounts (401k, Traditional IRA).</strong> Bond interest is taxed as ordinary income — sheltering it is most valuable.</li>
        <li><strong>International stocks in taxable accounts.</strong> Foreign tax credit can be claimed only in taxable.</li>
        <li><strong>High-growth (small-cap, REIT, emerging) in Roth accounts.</strong> The biggest growth deserves the tax-free treatment.</li>
        <li><strong>US total market in any account.</strong> Tax-efficient already; can go anywhere.</li>
      </ul>
      <p>
        These are tweaks, not foundations. Don't let optimal location complexity prevent you from contributing
        in the first place.
      </p>

      <H2>Rebalancing</H2>
      <p>
        Over time, your target allocation drifts. A 60/40 portfolio after a strong stock year might be 70/30 —
        pulling you toward higher risk just as valuations get richer. Rebalancing back to target:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Calendar rebalancing:</strong> annually, on a fixed date.</li>
        <li><strong>Threshold rebalancing:</strong> when allocation drifts more than 5% absolute or 25% relative from target.</li>
        <li><strong>Cash-flow rebalancing:</strong> direct new contributions to underweight assets — no selling needed.</li>
      </ul>
      <p>
        In tax-advantaged accounts, rebalance freely. In taxable, prefer cash-flow rebalancing to avoid creating
        capital gains.
      </p>

      <KeyTakeaways
        items={[
          '"Age in bonds" is too conservative for modern longevity. Most savers should run 10–20% more equity than the rule suggests.',
          'Adjust base allocation by your specific risk capacity, time horizon, and behavioral tolerance.',
          '3-fund portfolio (US stocks + international + bonds) covers 95% of allocation needs at lowest cost.',
          'Target-date funds are great for 401(k); 3-fund portfolio is more efficient for IRA and taxable.',
          'Asset location (which account holds which asset) affects after-tax return — bonds in 401k, growth in Roth.',
        ]}
      />
    </div>
  ),
};
