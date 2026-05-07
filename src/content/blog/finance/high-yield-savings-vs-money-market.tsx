import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Comparison, Callout, KeyTakeaways } from '../components';

export const highYieldSavingsVsMoneyMarket: BlogArticle = {
  slug: 'high-yield-savings-vs-money-market',
  category: 'Banking',
  title: 'High-Yield Savings vs Money Market vs T-Bills: Where to Park Cash',
  description:
    'Cash that earns 0.01% in your checking account is bleeding $300+ per year per $10k. Learn the four serious cash options, when each wins, and the tax angle that often flips the answer.',
  publishedDate: '2026-05-08',
  readTime: '11 min read',
  keywords:
    'high yield savings, money market, hysa, treasury bills, cash management, money market fund, cd ladder',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Big banks pay 0.01% on savings while online banks, money-market funds, and Treasury bills offer 4–5%. On
        $50k of cash, that's $2,500/year of preventable loss. The choice between cash vehicles isn't
        about chasing yield — it's about matching liquidity needs to the right tool, with the right tax
        treatment.
      </Lead>

      <H2>The four serious cash options</H2>

      <H3>1. High-Yield Savings Account (HYSA)</H3>
      <p>
        FDIC-insured savings at online banks (Marcus, Ally, Wealthfront, SoFi, Discover, Synchrony, etc.). Yields
        track Fed funds rate closely. Same-day or next-day access. Federal deposit insurance up to $250k per
        bank, per ownership type.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Best for: emergency fund, short-term savings goals, sinking funds.</li>
        <li>Yield: 4.0–4.5% as of 2026.</li>
        <li>Tax: interest taxed as ordinary income, federal and state.</li>
      </ul>

      <H3>2. Money Market Fund (MMF)</H3>
      <p>
        A mutual fund that holds short-term securities (T-bills, commercial paper, repos). Held in a brokerage
        account. Examples: SPAXX (Fidelity), VMFXX (Vanguard), SWVXX (Schwab).
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Best for: cash held in a brokerage account, awaiting investment.</li>
        <li>Yield: 4.5–5.0% as of 2026 (typically slightly higher than HYSA).</li>
        <li>Not FDIC insured (but extremely low historical loss rates).</li>
        <li>Tax: ordinary income; some funds (e.g., VUSXX) are largely state-tax-exempt due to Treasury holdings.</li>
      </ul>

      <H3>3. Treasury Bills (T-bills)</H3>
      <p>
        Short-term US government debt (4-week, 8-week, 13-week, 26-week, 52-week). Bought at TreasuryDirect or
        through a brokerage. Backed by the full faith of the US government.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Best for: cash you don't need for a known period.</li>
        <li>Yield: 4.5–5.0% as of 2026 (varies with maturity).</li>
        <li>Tax: federal taxable, <strong>state tax-exempt</strong>. Big advantage in CA, NY, NJ.</li>
        <li>Liquidity: can be sold before maturity, but at market price (slight premium or discount).</li>
      </ul>

      <H3>4. Certificates of Deposit (CDs)</H3>
      <p>
        Time-locked deposits at a bank, FDIC-insured. Sacrifice liquidity for slightly higher yield.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Best for: cash with a known future need date.</li>
        <li>Yield: 4.5–5.0% for 1-year terms, often slightly higher for 6-month and 1-year than HYSA.</li>
        <li>Tax: ordinary income, federal and state.</li>
        <li>Penalty: typically 3–6 months of interest for early withdrawal.</li>
      </ul>

      <H2>The tax angle that often flips the answer</H2>
      <p>
        For investors in high-tax states, T-bills (state tax-exempt) often outperform higher-stated-yield HYSAs
        and CDs after taxes:
      </p>
      <p>
        Suppose you live in California (top bracket: 13.3%) and have $100k cash:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>HYSA at 4.5%: $4,500 income, taxed federal + state (~37% combined). After-tax: ~$2,835.</li>
        <li>T-bill at 4.4%: $4,400 income, taxed federal only (~24%). After-tax: ~$3,344.</li>
      </ul>
      <p>
        T-bill wins by ~$500/year despite the lower headline rate. Run the math at <code>your_marginal_tax_rate</code>
        to see whether T-bills win in your state.
      </p>

      <Callout title="The state-tax-exempt money market trick" accent="indigo">
        Vanguard's VUSXX is a money-market fund holding ~80% Treasuries, so most of its income is state-tax-exempt.
        It combines money-market liquidity with most of T-bills' tax advantage. As of 2026 it's the
        default cash sweep at Vanguard.
      </Callout>

      <H2>The decision framework</H2>

      <Comparison
        leftTitle="Use HYSA"
        rightTitle="Use Money Market Fund"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>Emergency fund (instant access)</li>
            <li>Sinking funds with monthly contributions</li>
            <li>You don't want a brokerage account</li>
            <li>You want FDIC insurance</li>
            <li>State has no income tax</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>Cash sitting in brokerage between trades</li>
            <li>Slightly higher yield matters</li>
            <li>You hold investments at the same broker</li>
            <li>You want to occasionally invest the cash</li>
          </ul>
        }
      />

      <Comparison
        leftTitle="Use T-Bills"
        rightTitle="Use CDs"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>You live in a high-tax state (CA, NY, NJ, OR)</li>
            <li>Cash you can lock for 4 weeks to a year</li>
            <li>You want zero credit risk</li>
            <li>You want flexibility to sell early</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>You want FDIC insurance over Treasury backing</li>
            <li>Bank offers a promotional rate above market</li>
            <li>State has no income tax (T-bill advantage moot)</li>
            <li>You can lock for the full term</li>
          </ul>
        }
      />

      <H2>The cash management waterfall</H2>
      <p>
        For someone with multiple cash buckets, structure them by liquidity tier:
      </p>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Checking ($2k–$5k):</strong> bills and daily spending only. Don't care about yield.</li>
        <li><strong>HYSA Tier 1 (1 month expenses):</strong> instant access for actual emergencies.</li>
        <li><strong>HYSA Tier 2 or T-bill ladder (2–5 months expenses):</strong> 1-day access via ACH transfer.</li>
        <li><strong>T-bills or CDs (longer-term cash, sinking funds with known dates):</strong> matched maturity to need.</li>
        <li><strong>Brokerage money market (overflow cash awaiting investment):</strong> SPAXX, VMFXX, etc.</li>
      </ol>

      <H2>T-bill ladder: a practical setup</H2>
      <p>
        Buy a series of T-bills with staggered maturity dates so one matures every few weeks/months. Re-invest
        each maturing bill into a new long-term bill. The ladder yields the longer-term rate while always having
        cash maturing in the near term.
      </p>
      <p>
        Example: $40k split into 4-week, 8-week, 13-week, and 26-week T-bills, each $10k. As each matures, roll
        it into a new 26-week bill. After ~6 months, all your cash is yielding the 26-week rate while one bill
        matures every few weeks.
      </p>

      <H2>Don't forget the FDIC limits</H2>
      <p>
        FDIC insurance is $250k per depositor, per bank, per ownership category. If you have $400k in cash:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Split across 2 different FDIC banks ($200k each), or</li>
        <li>Use a single account with a sweep that distributes across multiple banks (some HYSAs offer this), or</li>
        <li>Hold the excess in T-bills (no FDIC needed — Treasury backing).</li>
      </ul>
      <p>
        Joint accounts and trust beneficiaries can multiply the coverage — but the rules are detailed enough that
        you should verify with the FDIC's coverage calculator if you're close to the limit.
      </p>

      <H2>What to avoid</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Big-bank checking/savings as a cash vehicle.</strong> Chase, BofA, and Wells Fargo savings rates are typically 0.01–0.05%. They count on inertia.</li>
        <li><strong>Brokered CDs you don't understand.</strong> Some are callable (the bank can return your money early at their discretion). Read the prospectus.</li>
        <li><strong>Reaching for "7% yield" in obscure instruments.</strong> Anything yielding far above the Treasury rate carries hidden risk. The cost of that risk usually appears at exactly the wrong moment.</li>
        <li><strong>Holding cash long-term "to time the market."</strong> Cash isn't an investment vehicle for years-long horizons. Inflation eats it. Either deploy or accept the cash drag.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Online HYSAs and money-market funds yield 4–5% in 2026; big-bank savings yields ~0.01%. The gap is preventable.',
          'T-bills are state-tax-exempt — meaningful advantage in CA, NY, NJ, OR; meaningless in TX, FL, WA.',
          'Money-market funds (esp. VUSXX) combine HYSA-like liquidity with T-bill-like tax efficiency.',
          'CD ladders can yield slightly more than HYSAs but lock liquidity. T-bill ladders offer similar yield with state-tax exemption.',
          'Match each cash bucket to the right tool by access need and tax treatment.',
        ]}
      />

      <p>
        Run the after-tax math on your specific bracket using our{' '}
        <Link href="/finance/income-tax-calculator" className="text-indigo-600 font-semibold hover:underline">Income Tax Calculator</Link>.
      </p>
    </div>
  ),
};
