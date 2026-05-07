import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const taxLossHarvestingExplained: BlogArticle = {
  slug: 'tax-loss-harvesting-explained',
  category: 'Tax',
  title: 'Tax-Loss Harvesting Explained: Save Thousands Without Changing Your Investments',
  description:
    'Turn a paper loss into real tax savings. Learn the wash-sale rule, when harvesting actually pays, and how to do it without changing your portfolio\'s direction.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    'tax loss harvesting, capital gains, wash sale rule, tax efficient investing, taxable account, tax alpha',
  relatedTools: [
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Tax-loss harvesting (TLH) is the strangest free lunch in personal finance: you sell an investment at a loss,
        immediately buy something nearly identical, and the IRS rewards you for it. Done right, it's worth
        thousands per year for a typical taxable account — and zero for tax-advantaged accounts.
      </Lead>

      <H2>The basic mechanic</H2>
      <p>
        Suppose you bought $50,000 of VTI (Vanguard Total Stock Market ETF) at $200/share. The market drops and VTI
        is now $170/share — your position is worth $42,500, an unrealized loss of $7,500.
      </p>
      <p>
        Tax-loss harvesting:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li>Sell all 250 shares of VTI at $170 → realize a $7,500 capital loss.</li>
        <li>Immediately buy a <em>similar but not identical</em> fund — say, ITOT (iShares Core Total US Stock).</li>
        <li>Your portfolio now holds nearly the same exposure as before, but you've banked $7,500 of tax-deductible loss.</li>
      </ol>

      <H2>How the loss saves you money</H2>
      <p>
        Realized capital losses are deducted from realized capital gains, dollar-for-dollar. If you have no gains,
        up to $3,000 of net loss can be deducted against ordinary income each year, with the remainder carried
        forward indefinitely.
      </p>
      <p>
        At a 24% federal bracket plus 5% state bracket, a $7,500 short-term loss applied against ordinary income
        saves about $2,175 in tax. Applied against long-term capital gains at 15% federal + 5% state, it saves
        $1,500.
      </p>

      <Callout title="The math you should remember" accent="indigo">
        Approximate tax-savings rate from harvesting depends on what the loss offsets:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Short-term gains or ordinary income: marginal rate (often 22–37% federal + state)</li>
          <li>Long-term gains: 15% (or 20% if you're in the top bracket) + state</li>
          <li>If carried forward: same rates apply when used</li>
        </ul>
      </Callout>

      <H2>The wash-sale rule (the trap)</H2>
      <p>
        IRS Section 1091 disallows the loss if you buy back the "substantially identical" security within
        30 days before or after the sale (61-day total window). Violate this and:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>The loss is disallowed for the current tax year.</li>
        <li>The disallowed loss is added to the cost basis of the replacement shares — eventually recoverable, but you've lost the timing benefit.</li>
        <li>Wash sales can apply across accounts including IRAs and your spouse's accounts.</li>
      </ul>

      <H3>What counts as "substantially identical"</H3>
      <p>
        The IRS hasn't fully clarified, but practitioner consensus:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Same security:</strong> obvious wash. Selling VTI and buying VTI back is identical.</li>
        <li><strong>Same fund, different share class:</strong> wash. VTSAX (mutual fund) and VTI (ETF) hold identical portfolios, IRS-flagged risk.</li>
        <li><strong>Different fund tracking the same index:</strong> generally <em>not</em> a wash, in practice. ITOT vs VTI track different indices (CRSP vs Russell 3000) — most tax preparers treat as safe.</li>
        <li><strong>Different fund, similar exposure:</strong> safe. VTI ↔ SCHB is a textbook safe harvest pair.</li>
      </ul>

      <H2>Harvest pairs that work</H2>
      <p>
        These pairs are generally accepted as "similar but not identical" by mainstream tax practitioners
        and robo-advisors:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Sell</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Replace With</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Exposure</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border-b px-4 py-2">VTI</td><td className="border-b px-4 py-2">ITOT or SCHB</td><td className="border-b px-4 py-2">US total market</td></tr>
            <tr><td className="border-b px-4 py-2">VOO</td><td className="border-b px-4 py-2">IVV or SPLG</td><td className="border-b px-4 py-2">S&amp;P 500</td></tr>
            <tr><td className="border-b px-4 py-2">VXUS</td><td className="border-b px-4 py-2">IXUS or SPDW+SPEM</td><td className="border-b px-4 py-2">Int'l developed + EM</td></tr>
            <tr><td className="border-b px-4 py-2">BND</td><td className="border-b px-4 py-2">AGG or SCHZ</td><td className="border-b px-4 py-2">US bond market</td></tr>
            <tr><td className="px-4 py-2">VTV</td><td className="px-4 py-2">SCHV</td><td className="px-4 py-2">US large-cap value</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        After 31+ days, if you want, you can swap back to the original holding without triggering wash-sale rules.
        Or just stay in the replacement — both are fine.
      </p>

      <H2>When TLH isn't worth it</H2>

      <H3>Tax-advantaged accounts</H3>
      <p>
        IRAs, 401(k)s, HSAs, 529s — these have no capital gains tax to harvest against. TLH is irrelevant. Worse,
        selling at a loss in a tax-advantaged account and buying the equivalent in a taxable account triggers a
        wash-sale across accounts.
      </p>

      <H3>Position is too small</H3>
      <p>
        Harvesting $200 of loss saves you $40–$60 in tax — likely below the bid/ask spread cost and your time. Set
        a floor, e.g. $1,000+ losses only.
      </p>

      <H3>You're in the 0% LTCG bracket</H3>
      <p>
        For couples filing jointly under ~$94k taxable income, long-term capital gains are taxed at 0%. Harvesting
        losses to offset 0%-taxed gains saves you nothing. Consider tax-gain harvesting instead.
      </p>

      <H3>You plan to give the appreciated assets to charity or heirs</H3>
      <p>
        Charitable donations of appreciated stock and step-up basis at death both eliminate capital gains
        permanently. Selling those positions at a loss converts a step-up opportunity into a realized event.
      </p>

      <H2>Tax-loss harvesting at scale</H2>
      <p>
        Robo-advisors (Wealthfront, Betterment) and direct-indexing services (Schwab Personalized, Wealthfront,
        Frec) automate TLH at the individual-stock level. Instead of buying VTI as one position, they hold the
        underlying ~500 stocks. Some go up, some down, providing many more harvesting opportunities per year.
      </p>
      <p>
        Marketing claims of "1–2% tax alpha" are usually overstated — peer-reviewed studies suggest
        the realistic value is 0.3–1.0% annually for someone in a high tax bracket with new money flowing in.
        Still meaningful: on a $1M portfolio at 0.5% effective alpha, that's $5,000/year of tax savings.
      </p>

      <H2>The carryforward trap to know</H2>
      <p>
        Any losses you don't use this year carry forward indefinitely on your IRS records. But:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Carryforward dies with you — your heirs don't inherit it.</li>
        <li>It's state-specific. If you move to a state with different rules (e.g., California treats things differently), tracking gets messy.</li>
        <li>It must be used in chronological order, against the same character (long vs short).</li>
      </ul>
      <p>
        Software (TurboTax, FreeTaxUSA, Wealthfront) handles this — but if you DIY, keep meticulous records.
      </p>

      <H2>The end-of-year vs ongoing question</H2>
      <p>
        December is when most retail investors think about TLH. But the bigger opportunities come during sharp
        market corrections — when many positions are simultaneously underwater. A March/April drawdown of 10–15%
        offers far more harvesting than late-year cleanup of straggling positions.
      </p>
      <p>
        Set up alerts for individual position losses exceeding $1,000 (or whatever floor makes sense for your
        portfolio size). Most brokers will let you do this.
      </p>

      <H2>Mistakes that cost real money</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Buying replacement shares in your spouse's IRA.</strong> Triggers wash sale. The IRS sees household-level activity.</li>
        <li><strong>Reinvesting dividends into the same fund within 30 days of harvesting.</strong> Each reinvestment is a small wash that contaminates a portion of the loss.</li>
        <li><strong>Harvesting then immediately re-buying the same position 32 days later just to "get back."</strong> Fine, but this is two transactions and possibly a tax inefficiency if the replacement was already comparable. Just stay in the replacement.</li>
        <li><strong>Harvesting positions in 401(k) at retirement to "use the loss."</strong> Doesn't work — losses inside qualified plans aren't deductible.</li>
      </ul>

      <KeyTakeaways
        items={[
          'TLH realizes a paper loss to offset realized gains or up to $3k of ordinary income; carryforward is unlimited.',
          '30-day wash-sale rule: don\'t buy "substantially identical" replacements within ±30 days.',
          'Funds tracking different indices (e.g., VTI vs ITOT) are widely treated as safe replacement pairs.',
          'TLH is worthless in tax-advantaged accounts and minimally valuable for low-income filers in 0% LTCG bracket.',
          'Robo-advisors automate TLH at the individual-stock level; realistic tax-alpha is 0.3–1.0% annually for high earners.',
        ]}
      />

      <p>
        See how much your harvest is worth using our <Link href="/finance/income-tax-calculator" className="text-indigo-600 font-semibold hover:underline">Income
        Tax Calculator</Link> to model your effective bracket.
      </p>
    </div>
  ),
};
