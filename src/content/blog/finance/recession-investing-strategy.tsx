import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const recessionInvestingStrategy: BlogArticle = {
  slug: 'recession-investing-strategy',
  category: 'Investing',
  title: 'Recession Investing: What History Says About Buying During Downturns',
  description:
    'When the market drops 30%, every instinct tells you to sell. Decades of data say to buy. Learn what actually happens during recessions, the playbook that beats the index, and the behavioral pitfalls.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'recession investing, market crash, bear market, dollar cost averaging, buying the dip, market downturn, stock buying',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        The best investing returns of the past century came from money invested in 2009, 1932, 2002, and 2020 —
        all moments when the news said the financial system was ending. The hardest investing skill isn't
        selecting stocks; it's sitting still while everyone around you is selling, and adding more when
        prices drop.
      </Lead>

      <H2>What recession actually does to markets</H2>
      <p>
        Since 1928, US stocks have entered a "bear market" (20%+ drop) roughly once every 4–5 years.
        Average duration: about 14 months. Average drop: about 35%. Average time to full recovery from peak:
        about 24 months.
      </p>
      <p>
        That's the average. Specific examples:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>2008–2009 (GFC):</strong> -57% peak to trough. Recovery to peak: ~4 years.</li>
        <li><strong>2000–2002 (dotcom):</strong> -49% peak to trough. Recovery to peak: ~7 years.</li>
        <li><strong>2020 (COVID):</strong> -34% in 23 days. Recovery to peak: ~6 months.</li>
        <li><strong>2022 (rate-hike correction):</strong> -25%. Recovery to peak: ~14 months.</li>
      </ul>
      <p>
        Pattern: drops are sharp and scary; recoveries are slower but reliable. Markets have recovered from
        every drawdown in US history. Eventually.
      </p>

      <H2>The cost of selling during a drop</H2>
      <p>
        JPMorgan's research famously showed that missing the 10 best days of the market over 20 years cuts
        your return by more than half. The catch: those best days cluster around the worst days. If you sell
        after a 5% drop and miss the 8% rebound the next week, you've permanently locked in the loss.
      </p>
      <p>
        Most of the data on retail investor returns shows individuals consistently underperform the funds they
        invest in by 1–3% annually — almost entirely because of timing decisions during volatile periods. Buying
        high (after gains), selling low (during drops). The behavior gap.
      </p>

      <Callout title="The real risk isn't the market — it's your behavior" accent="amber">
        Looking at historical drawdowns, no buy-and-hold investor in a diversified US portfolio has lost money
        over any 20-year window since 1928. Investors who repeatedly bought after gains and sold after drops
        regularly underperformed inflation. The strategy works; the human running it often doesn't.
      </Callout>

      <H2>The recession playbook</H2>

      <H3>1. Don't sell anything you didn't already plan to sell</H3>
      <p>
        Selling because the market dropped is market timing in disguise. If you wouldn't have sold at the
        peak, your decision now is just "sell low." The exception: tax-loss harvesting in taxable
        accounts to capture losses, while immediately re-buying similar exposure.
      </p>

      <H3>2. Continue all automated contributions</H3>
      <p>
        401(k) deductions, IRA auto-deposits, brokerage transfers — keep them flowing. Each contribution during
        a drop buys more shares than it would have at the peak. Mathematically, drops are when DCA does its best
        work.
      </p>

      <H3>3. Deploy emergency cash reserves slowly, on a schedule</H3>
      <p>
        If you have cash beyond your emergency fund earmarked for investing, this is when to deploy it. But
        don't try to call the bottom — you can't. Instead, set a deployment schedule:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Deploy 25% of available cash at -15% from peak.</li>
        <li>Deploy 50% of remaining cash at -30%.</li>
        <li>Deploy the rest at -45% or after the market is up 10% from a clear bottom.</li>
      </ul>
      <p>
        Mechanical rules eliminate the freeze-up that prevents most retail investors from buying when scared.

      </p>

      <H3>4. Tax-loss harvest aggressively</H3>
      <p>
        Recessions create the year's biggest TLH opportunities. See our <Link href="/finance/learn/tax-loss-harvesting-explained" className="text-indigo-600 font-semibold hover:underline">tax-loss
        harvesting guide</Link>. Harvested losses carry forward forever and can be applied to future gains or
        ordinary income.
      </p>

      <H3>5. Rebalance to target</H3>
      <p>
        After a 30% stock drop, your 70/30 portfolio is now ~60/35/5 (with cash from any new contributions).
        Rebalancing back to 70/30 means selling some bonds and buying more stocks — exactly when stocks are
        cheap. Rebalancing forces buy-low, sell-high.
      </p>

      <H3>6. Roth conversions if income drops</H3>
      <p>
        If a job loss or income reduction puts you in a lower tax bracket, this is a prime year to convert
        Traditional 401(k) or IRA balances to Roth. Same conversion, lower tax cost. This applied especially well
        to early retirees during 2020's low-income year.
      </p>

      <H2>What history says about recession recoveries</H2>
      <p>
        Looking at the 9 US recessions since 1950, average S&amp;P 500 returns:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>1 year after market trough:</strong> +43% average</li>
        <li><strong>3 years after trough:</strong> +75% average</li>
        <li><strong>5 years after trough:</strong> +125% average</li>
      </ul>
      <p>
        The catch: you don't know when the trough is until well after. Markets often rally hardest in the
        first three months — when news headlines still scream recession. By the time it's "safe"
        to invest again, half the gains have happened.
      </p>

      <H2>What NOT to do</H2>

      <H3>Stop contributing</H3>
      <p>
        The single biggest mistake. Pausing 401(k) contributions during 2008 cost thousands their early-career
        compounding. The 2009 recovery alone produced 60%+ gains; missing that single year hurts decades of
        wealth.
      </p>

      <H3>Move to cash "until things stabilize"</H3>
      <p>
        By the time anything "stabilizes," the market has rebounded 30%+. You bought high and sold low.
      </p>

      <H3>Pile into single stocks because they're "cheap"</H3>
      <p>
        During recessions, individual stocks have wildly different fates. Some recover; some go bankrupt. Sector
        ETFs and broad-market index funds capture the recovery without single-stock risk.
      </p>

      <H3>Bet on a specific recovery shape</H3>
      <p>
        V-shaped, U-shaped, L-shaped, K-shaped — pundits will debate this in real-time. Your portfolio should be
        agnostic to recovery shape. If you're right about the shape and wrong about timing, you've still
        lost. Better to be allocated correctly and ignore the predictions.
      </p>

      <H2>The recession-as-opportunity mindset</H2>
      <p>
        For long-term investors with income still flowing, recessions are sales. The same companies — Apple,
        Microsoft, Costco, JPM — at 30% off. Investors who came out of 2008–2009 with the largest wealth didn't
        time anything; they kept buying through the entire drawdown.
      </p>
      <p>
        Build your psychology in advance. Write down — physically — what you will do during the next bear market.
        Read it during the bear market. Stick to it. Most of investing is about not doing dumb things during
        emotional periods.
      </p>

      <Callout title="The Buffett Maxim" accent="indigo">
        "Be fearful when others are greedy and greedy when others are fearful." This is easier to quote
        than execute. The first half is doable — staying defensive during euphoria. The second half — buying
        more during fear — requires the kind of cash reserves and emotional preparation most investors
        don't build until they've lived through one full cycle.
      </Callout>

      <H2>If you're already retired</H2>
      <p>
        Recession behavior in retirement differs:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Pull from the bond/cash tent, not stocks.</li>
        <li>Reduce discretionary spending if your withdrawal rate exceeds guardrail thresholds.</li>
        <li>Consider part-time work to reduce withdrawals during the down year.</li>
        <li>Defer Social Security if you can — it grows 8% per deferral year.</li>
      </ul>
      <p>
        See our guide on <Link href="/finance/learn/sequence-of-returns-risk" className="text-indigo-600 font-semibold hover:underline">sequence
        of returns risk</Link> for the math behind why these matter.
      </p>

      <KeyTakeaways
        items={[
          'Bear markets happen every 4–5 years on average. They\'re features of investing, not bugs.',
          'No 20-year window in US history has lost money in a buy-and-hold diversified portfolio. Behavior is the bigger risk than the market.',
          'Continue all automated contributions during downturns — DCA does its best work when prices drop.',
          'Use mechanical rules to deploy emergency cash (e.g., 25% at -15%, 50% at -30%) to remove decision freeze.',
          'Rebalance to target during recessions — it forces buying low. TLH aggressively in taxable accounts.',
        ]}
      />
    </div>
  ),
};
