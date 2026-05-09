import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const capitalGainsTaxStrategies: BlogArticle = {
  slug: 'capital-gains-tax-strategies',
  category: 'Tax',
  title: 'Capital Gains Tax 2026: Short vs Long-Term Strategy',
  description:
    "The federal capital gains tax has three brackets, two holding-period categories, and a state tax overlay that can swing your effective rate from 0% to 37%+. Here's the framework to plan around.",
  publishedDate: '2026-05-10',
  readTime: '14 min read',
  keywords:
    'capital gains tax, short term capital gains, long term capital gains, ltcg, stcg, capital gains brackets 2026, tax loss harvesting, capital gains strategy',
  relatedTools: [
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Capital gains tax is one of the few major US tax decisions you actually <em>control</em> — almost entirely
        through timing. The difference between holding for 364 days versus 366 can be 17 percentage points of tax.
        Knowing the rules turns that into real money.
      </Lead>

      <H2>Short-term vs long-term: the holding period rule</H2>
      <p>
        The IRS classifies capital gains by how long you held the asset before selling:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Short-term:</strong> held one year or less. Taxed at your ordinary income rate (10–37%).</li>
        <li><strong>Long-term:</strong> held more than one year. Taxed at preferential rates (0%, 15%, or 20%).</li>
      </ul>
      <p>
        The clock starts the day after you acquire the asset and ends the day you sell it. To get long-term treatment,
        you must hold strictly <em>more than</em> 365 days — not exactly one year.
      </p>

      <H2>2026 long-term capital gains brackets</H2>
      <p>
        Long-term rates are based on <em>total taxable income</em> (which includes the gain itself):
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>0%:</strong> single up to ~$48,350; married filing jointly up to ~$96,700.</li>
        <li><strong>15%:</strong> single ~$48,350–$533,400; MFJ ~$96,700–$600,050.</li>
        <li><strong>20%:</strong> single above ~$533,400; MFJ above ~$600,050.</li>
      </ul>
      <p>
        Add a 3.8% Net Investment Income Tax (NIIT) for high earners — single $200K+ MAGI, MFJ $250K+. So the actual
        top federal rate on long-term gains is 23.8%, not 20%.
      </p>

      <Callout title="The 0% bracket is real and underused" accent="emerald">
        If you can keep your taxable income (including the gain) below the 0% threshold, the federal rate on long-term
        gains is literally zero. Sabbatical years, low-income years between jobs, and early retirement all create
        windows for tax-free realization.
      </Callout>

      <H2>Short-term gains: just ordinary income</H2>
      <p>
        Short-term gains stack on top of your salary as ordinary income. At a $200K salary in the 24% federal bracket,
        $20K of short-term gains adds $4,800 in federal tax. The same gain held one extra day to qualify long-term
        would owe $3,000 (15%). Free $1,800 for the patience.
      </p>

      <H2>The state tax overlay</H2>
      <p>
        Most states tax capital gains as ordinary income — there is no preferential long-term rate. So in California,
        long-term gains get federal 15% + state up to 13.3% = effective 28.3% (before NIIT). In Texas, Florida,
        Washington, and other no-income-tax states, long-term gains stop at the federal rate.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>No state tax on capital gains:</strong> AK, FL, NV, SD, TN, TX, WA (some), WY.</li>
        <li><strong>Special low rates:</strong> Hawaii caps at 7.25%; some others have partial exclusions.</li>
        <li><strong>Highest combined burden:</strong> CA, NY, NJ, OR — combined federal+state can exceed 35%.</li>
      </ul>

      <H2>Strategies that move the needle</H2>

      <H3>1. Tax-loss harvesting</H3>
      <p>
        Realize losses to offset gains. Capital losses first cancel gains of the same character (short or long), then
        apply against the other. Excess losses up to $3,000/year reduce ordinary income; the rest carries forward
        indefinitely.
      </p>
      <p>
        Watch the wash-sale rule: you can&apos;t buy back the same security (or "substantially identical") within 30 days
        before or after the loss sale. Easy workaround: swap into a similar-but-different fund (S&P 500 → total US
        market, for example).
      </p>

      <H3>2. Specific lot identification</H3>
      <p>
        When you sell partial holdings, brokerages default to FIFO (first-in-first-out). For appreciated positions
        bought at multiple price points, FIFO maximizes your gain. Switch your account&apos;s default to "specific lot"
        and pick which shares to sell — usually the highest-cost ones to minimize the gain.
      </p>

      <H3>3. Tax-gain harvesting in low-income years</H3>
      <p>
        The mirror image of loss harvesting. In years when you&apos;re below the 0% LTCG threshold, deliberately sell
        appreciated long-term positions to <em>realize</em> the gain at zero tax — then rebuy immediately (no wash-sale
        rule on gains). Resets your cost basis higher for free.
      </p>

      <H3>4. Hold appreciated assets until death</H3>
      <p>
        Inherited assets get a "step-up in basis" — heirs receive them at fair market value at date of death, wiping
        out all unrealized gains forever. This is why ultra-wealthy families often borrow against appreciated stock
        rather than sell during their lifetime.
      </p>

      <H3>5. Donate appreciated stock instead of cash</H3>
      <p>
        Donating appreciated long-term stock to charity lets you deduct fair market value while avoiding the capital
        gains tax entirely. For a $10,000 stock with $7,000 of gain, you save the gain tax (~$1,500) and get the
        full $10,000 deduction.
      </p>

      <H2>Special asset categories</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>Collectibles (art, gold coins, rare wine):</strong> long-term gains taxed at a flat 28%, not 15/20%.
          Holding gold ETFs that own physical bullion (GLD, IAU) triggers this rate.
        </li>
        <li>
          <strong>Section 1250 real estate gain (depreciation recapture):</strong> taxed up to 25% even at long-term.
        </li>
        <li>
          <strong>Qualified small business stock (Section 1202):</strong> can be 100% excluded from federal tax if held
          5+ years and other requirements met.
        </li>
        <li>
          <strong>Crypto:</strong> taxed identically to stock for capital gains purposes; same short/long-term rules.
        </li>
      </ul>

      <H2>The home-sale exclusion</H2>
      <p>
        Selling your primary residence: $250K of gain excluded for single, $500K for married filing jointly, if you
        owned and lived in the home 2 of the last 5 years. Above the exclusion, normal long-term rates apply
        (assuming you owned more than a year).
      </p>

      <Callout title="Keep records" accent="amber">
        For long-held homes and investments, the basis (your original cost plus improvements) is the entire battle.
        IRS audits target taxpayers who can&apos;t document basis — they&apos;ll assume zero, which means the entire sale
        proceeds are gain. Save closing statements, receipts for major improvements, and brokerage purchase confirmations.
      </Callout>

      <KeyTakeaways
        items={[
          'Hold > 365 days for preferential 0/15/20% long-term rates instead of ordinary income.',
          "Below ~$48K single / ~$97K married, the federal LTCG rate is 0% — actively use sabbatical and gap years.",
          'Tax-loss harvesting, specific lot ID, and gain harvesting are the three biggest controllable levers.',
          "State tax overlay matters: CA/NY/NJ residents lose ~10–13% on top; FL/TX/WA residents pay only the federal.",
          'Charitable giving of appreciated stock and step-up at death are the most powerful gain-eliminators.',
        ]}
      />
    </div>
  ),
};
