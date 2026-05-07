import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Comparison, Callout, KeyTakeaways } from '../components';

export const indexFundsVsMutualFundsVsEtfs: BlogArticle = {
  slug: 'index-funds-vs-mutual-funds-vs-etfs',
  category: 'Investing',
  title: 'Index Funds vs Mutual Funds vs ETFs: A Plain-English Comparison',
  description:
    'Three terms that overlap, confuse, and shape your portfolio. Learn the structural differences, when each format wins, and the small-print details that actually move returns over decades.',
  publishedDate: '2026-05-08',
  readTime: '14 min read',
  keywords:
    'index funds, mutual funds, etf, etf vs mutual fund, index investing, expense ratio, vanguard fidelity, passive investing',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'SIP Calculator', href: '/finance/sip-calculator' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        These three terms get used interchangeably by most articles — and that's wrong. <em>Index fund</em> describes
        a strategy. <em>Mutual fund</em> and <em>ETF</em> describe legal/structural wrappers. You can have an index
        ETF, an index mutual fund, an actively managed mutual fund, an actively managed ETF. Sorting out which
        applies to your situation drives small but compounding differences over decades.
      </Lead>

      <H2>The two-axis grid</H2>
      <p>
        Funds vary along two independent axes: <strong>strategy</strong> (active vs passive/index) and
        <strong> structure</strong> (mutual fund vs ETF). Every fund occupies one cell of a 2×2 grid:
      </p>

      <div className="my-6 overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 px-4 py-2 text-left"></th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">Mutual Fund</th>
              <th className="border-b border-gray-200 px-4 py-2 text-left">ETF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-gray-200 px-4 py-2 font-semibold">Index (passive)</td>
              <td className="border-b border-gray-200 px-4 py-2">VTSAX, FXAIX</td>
              <td className="border-b border-gray-200 px-4 py-2">VTI, IVV, VOO</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Active</td>
              <td className="px-4 py-2">FCNTX, ARKK's mutual cousin</td>
              <td className="px-4 py-2">ARKK, JEPI</td>
            </tr>
          </tbody>
        </table>
      </div>

      <H2>Strategy: index vs active</H2>
      <p>
        An <strong>index fund</strong> tries to mirror a market index — the S&amp;P 500, the total US market, the
        MSCI World — by holding all (or a sample of) the constituent securities in proportion. There's no
        manager picking winners, just a rule-based replication.
      </p>
      <p>
        An <strong>actively managed fund</strong> employs a portfolio manager who decides what to buy and sell,
        attempting to beat the index. Pay for that ambition: active funds typically charge 0.5–1.5% expense ratios
        vs 0.02–0.10% for index funds.
      </p>

      <H3>Why index almost always wins</H3>
      <p>
        The math is unforgiving. SPIVA (S&amp;P's long-term scorecard) shows that ~85% of active US large-cap
        funds underperform their benchmark over 10-year periods, after fees. The ones that win in any given year are
        rarely the same year over year — making selecting a winning fund in advance roughly equivalent to picking
        winning stocks.
      </p>

      <Callout title="The fee gap matters more than you think" accent="amber">
        A 1% expense ratio difference compounded over 30 years on $100k initial capital costs about $200,000 in
        final balance — even if both funds had identical pre-fee returns. Fees compound as inversely as returns do.
      </Callout>

      <H2>Structure: mutual fund vs ETF</H2>
      <p>
        Both are pooled investment vehicles. The differences are in how they trade, how they're taxed, and
        how easy they are to access.
      </p>

      <Comparison
        leftTitle="Mutual Fund"
        rightTitle="ETF"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>Priced once daily at NAV after market close</li>
            <li>Buy/sell directly with the fund company</li>
            <li>Often supports dollar-amount investing ($500.00)</li>
            <li>Many require a minimum ($1k–$3k typical)</li>
            <li>Capital gain distributions to all shareholders, even non-sellers</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>Trades intraday on an exchange like a stock</li>
            <li>Buy/sell through a broker; bid/ask spread applies</li>
            <li>Whole share trades historically (most brokers now allow fractional)</li>
            <li>No minimum beyond one share (~$50–$500)</li>
            <li>In-kind creation/redemption avoids triggering capital gains</li>
          </ul>
        }
      />

      <H3>The tax-efficiency advantage of ETFs</H3>
      <p>
        ETFs use a creation/redemption mechanism with "authorized participants" that lets the fund
        rebalance without selling appreciated holdings. The result: ETFs almost never distribute capital gains.
      </p>
      <p>
        Mutual funds, in contrast, must sell holdings to meet redemptions, distributing gains to <em>every</em>
        shareholder — even those who didn't sell. In a taxable account, this means an unavoidable tax bill
        each year you hold an active mutual fund.
      </p>
      <p>
        For tax-deferred accounts (401k, IRA), this difference is irrelevant. For taxable accounts, ETFs win on
        tax efficiency by a wide margin.
      </p>

      <H2>The big four index ETFs you'll see referenced</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>VTI / ITOT — Total US Stock Market.</strong> ~4,000 stocks, expense ratio 0.03%. The most diversified single-fund US holding.</li>
        <li><strong>VOO / IVV / SPY — S&amp;P 500.</strong> Top 500 US companies by market cap. Slightly less diversified than VTI but with a longer track record.</li>
        <li><strong>VXUS / IXUS — Total International (ex-US).</strong> ~7,000 stocks across developed and emerging markets, 0.07% expense ratio.</li>
        <li><strong>BND / AGG — Total US Bond Market.</strong> Investment-grade bonds across the maturity spectrum, 0.03% expense ratio.</li>
      </ul>
      <p>
        A 3-fund portfolio (VTI + VXUS + BND, mixed to your risk tolerance) covers ~95% of what most retirement
        savers need. Simplicity beats complexity at this level.
      </p>

      <H2>When mutual funds still win</H2>
      <p>
        Mutual funds aren't always wrong. They retain a few specific advantages:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Dollar-amount investing.</strong> Want to put exactly $1,234.56 in? Mutual funds buy fractional shares natively. Some brokers don't support fractional ETF shares.</li>
        <li><strong>Workplace 401(k)s.</strong> Most plan menus offer mutual funds, not ETFs. Your choice may be limited there.</li>
        <li><strong>Set-and-forget automatic investing.</strong> Mutual fund auto-deposits are simpler than dollar-cost averaging into ETFs through scheduled buys.</li>
        <li><strong>Vanguard's old admiral-class index funds.</strong> Functionally identical to the ETF cousins (VTSAX ↔ VTI), with no bid/ask spread to manage.</li>
      </ul>

      <H2>The expense-ratio threshold</H2>
      <p>
        Total cost of ownership = expense ratio + bid/ask spread (ETFs) + transaction costs + tax drag. Modern
        retail investors at major brokers rarely pay transaction costs, so the comparison narrows to expense ratio
        and tax drag.
      </p>
      <p>
        Decision rule for an index investor: <strong>any expense ratio above 0.20% is too high for a
        broad-market index fund</strong>. Many 401(k) menus serve up index funds with hidden 0.50–1.0% expense
        ratios — if so, contribute up to the match, then prioritize an IRA where you have control.
      </p>

      <H2>Active funds that are arguably worth it</H2>
      <p>
        A small set of active strategies can be defensible:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Truly tax-managed funds.</strong> A few funds explicitly optimize for after-tax return, useful in taxable accounts at high income levels.</li>
        <li><strong>Specific factor exposures (small-cap value, quality).</strong> Some research argues these add risk-adjusted return. Vanguard's VIOV, Avantis AVUV are examples — though purists argue these are still rule-based and shouldn't count as "active."</li>
        <li><strong>Niche markets where indices are flawed.</strong> Some emerging-market or frontier strategies arguably benefit from active management given index construction issues.</li>
      </ul>
      <p>
        For 90% of investors, the answer is: skip active. The math doesn't favor you.
      </p>

      <H2>The "same fund, different wrapper" trick</H2>
      <p>
        Vanguard pioneered offering identical underlying portfolios as both a mutual fund and an ETF. VTSAX and VTI
        hold the same securities. Schwab and Fidelity have similar pairs. Practically:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>If you prefer dollar-amount automatic investing → use the mutual fund version.</li>
        <li>If you have a brokerage that supports fractional ETFs and prefer intraday trading or maximum portability → use the ETF version.</li>
        <li>Don't buy <em>both</em> — they perform identically; you're just splitting your tracking work.</li>
      </ul>

      <H2>Switching between formats</H2>
      <p>
        Selling a mutual fund in a taxable account creates a capital-gains event. Vanguard offers a unique
        "mutual-fund-to-ETF conversion" that's tax-free for their pairs. No other major broker offers
        this — so for portability, ETFs are the cleaner choice in a taxable account.
      </p>
      <p>
        In tax-deferred accounts (401k, IRA), you can switch freely with no tax consequences.
      </p>

      <KeyTakeaways
        items={[
          'Index = strategy (rule-based replication). Mutual fund / ETF = wrapper (how it trades). They\'re independent dimensions.',
          'For most investors, low-cost broad-market index ETFs (VTI, VXUS, BND) beat active alternatives over 10+ years.',
          'ETFs are more tax-efficient in taxable accounts; mutual funds are equivalent in tax-deferred accounts.',
          'Watch the expense ratio — 1% extra cost over 30 years can cost $200k+ on a $100k starting balance.',
          'A 3-fund portfolio (US stocks + international stocks + bonds) covers 95% of what retirement savers need.',
        ]}
      />

      <p>
        Once you've picked a strategy, the discipline of investing matters more than the choice of format.
        Use our <Link href="/finance/sip-calculator" className="text-indigo-600 font-semibold hover:underline">SIP Calculator</Link> to
        plan automatic contributions and let the boring magic of compound growth do the work.
      </p>
    </div>
  ),
};
