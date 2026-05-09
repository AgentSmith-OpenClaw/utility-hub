import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways, Comparison } from '../components';

export const cdLaddersVsTreasuryBills: BlogArticle = {
  slug: 'cd-ladders-vs-treasury-bills',
  category: 'Investing',
  title: 'CD Ladders vs Treasury Bills: Which Wins in 2026?',
  description:
    "CDs and T-bills both pay you to hold cash safely, but they differ in tax treatment, liquidity, and yield in ways that can flip the winner depending on your bracket and state.",
  publishedDate: '2026-05-10',
  readTime: '12 min read',
  keywords:
    'cd ladder, treasury bills, t-bills vs cds, brokered cd, bank cd, treasury direct, cash management, yield comparison, taxable equivalent yield',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        With cash yields above 4% in 2026, the question of where to park liquid savings has stopped being academic.
        CD ladders and Treasury bill ladders both work — but the right choice depends heavily on your federal bracket,
        your state of residence, and how often you might need the money back.
      </Lead>

      <H2>The two products in 30 seconds</H2>
      <Comparison
        leftTitle="Bank CD"
        left={
          <>
            <p>Time deposit at a bank or credit union. Fixed term (3 mo to 5 yr).</p>
            <p className="mt-2">FDIC-insured to $250K per depositor per bank.</p>
            <p className="mt-2">Early withdrawal: penalty (typically 3–6 months of interest).</p>
            <p className="mt-2">Interest fully taxable federal + state.</p>
          </>
        }
        rightTitle="Treasury Bill"
        right={
          <>
            <p>Short-term US government debt (4, 8, 13, 17, 26, 52 weeks).</p>
            <p className="mt-2">Backed by US government — no FDIC needed.</p>
            <p className="mt-2">Sold at discount; full face value at maturity.</p>
            <p className="mt-2">Interest exempt from state and local tax.</p>
          </>
        }
      />

      <H2>The state-tax wedge that changes the answer</H2>
      <p>
        Treasury bill interest is exempt from state and local income tax. CD interest isn&apos;t. So even when nominal
        yields look identical, the after-tax yields can differ significantly:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>California (13.3% top): T-bill at 5.0% beats CD at 5.5% on after-tax basis.</li>
        <li>New York (10.9% top): T-bill at 5.0% beats CD at 5.4%.</li>
        <li>Texas / Florida (0%): no advantage — go for the higher nominal rate.</li>
      </ul>

      <Callout title="Compute the taxable-equivalent yield" accent="indigo">
        T-bill yield ÷ (1 − state tax rate) = the CD rate that would tie. At 5% T-bill in California (13.3% state):
        5% ÷ (1 − 0.133) = <strong>5.77%</strong>. The CD has to clear that to be the better deal.
      </Callout>

      <H2>Liquidity: who actually wins</H2>
      <p>
        Both are illiquid in the sense that you should hold to maturity. The difference is what happens if you
        <em> can&apos;t</em>:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>Bank CD early-out penalty:</strong> typically 3 months interest on short-term CDs, 6 months on
          longer. Predictable, formulaic.
        </li>
        <li>
          <strong>Brokered CD secondary market:</strong> you can sell early, but at the prevailing market price —
          which may be below par if rates have risen since you bought.
        </li>
        <li>
          <strong>T-bill secondary market:</strong> deeply liquid. You can sell any T-bill on TreasuryDirect or your
          brokerage at the current market price within a day. Same interest-rate risk as brokered CDs.
        </li>
      </ul>

      <H2>The ladder structure (works the same for both)</H2>
      <p>
        A ladder spreads maturities across multiple rungs so you have something maturing at regular intervals. A
        12-month ladder of $5,000 each at 1, 2, 3, 4 months means $5,000 matures every month (after rollover begins),
        giving you a regular source of available cash plus the average of recent rates.
      </p>
      <H3>Ladder benefits</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Cash availability without paying early-out penalties.</li>
        <li>Reduces interest-rate risk — you&apos;re always re-pricing some of your money.</li>
        <li>Captures longer-end yields without locking up everything.</li>
      </ul>

      <H2>Where to buy each</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>
          <strong>Bank CDs:</strong> direct from your bank or credit union. Typically the best rates come from online
          banks (Marcus, Ally, Synchrony, Capital One) rather than brick-and-mortar branches.
        </li>
        <li>
          <strong>Brokered CDs:</strong> through Fidelity, Schwab, Vanguard, etc. Aggregates rates from many banks.
          Convenient inside an existing brokerage account; tradable on secondary market.
        </li>
        <li>
          <strong>T-bills via TreasuryDirect:</strong> free, direct from the US Treasury. Can&apos;t be sold there — must
          hold to maturity or transfer out.
        </li>
        <li>
          <strong>T-bills via brokerage:</strong> Fidelity / Schwab let you buy at auction or on the secondary market.
          Better for ladders because you can manage them in one account.
        </li>
        <li>
          <strong>T-bill ETFs (BIL, SGOV, USFR):</strong> instant liquidity, automatic ladder, slight expense ratio
          (0.07–0.15%). Loses the state-tax exemption only if held in a fund that mixes other instruments — pure-Treasury
          ETFs preserve it.
        </li>
      </ul>

      <H2>Special case: high-yield savings (HYSA)</H2>
      <p>
        If your alternative is a 4.5% HYSA with full liquidity and no maturity, the bar for CDs and T-bills is whether
        they pay enough <em>more</em> to justify the term commitment. In an inverted yield curve (which has been the
        norm 2023–2026), short-term yields can be higher than long, which actually favors HYSA over a 5-year CD.
      </p>

      <H2>Which to pick</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Live in a high-tax state (CA, NY, NJ, OR):</strong> default to T-bills.</li>
        <li><strong>Live in a no-income-tax state:</strong> compare nominal yields; CDs often win by 10–25 bps.</li>
        <li><strong>Want maximum simplicity:</strong> T-bill ETF (SGOV, USFR) or brokered CD ladder in your existing brokerage.</li>
        <li><strong>Have $250K+ at one bank already:</strong> T-bills sidestep FDIC limits since they&apos;re Treasury-backed regardless of size.</li>
        <li><strong>Need cash unpredictably:</strong> HYSA + small ladder, not a deep ladder of either product.</li>
      </ul>

      <Callout title="Don't forget I-Bonds and TIPS" accent="amber">
        For inflation-protected savings, US Series I Savings Bonds (I-Bonds) pay a CPI-linked rate up to $10K/person/year,
        and TIPS (Treasury Inflation-Protected Securities) work similarly with no annual cap. Both are state-tax-exempt
        like T-bills. Different product category, but worth a slot in any cash-management strategy.
      </Callout>

      <KeyTakeaways
        items={[
          "CD interest is taxed federal+state; T-bill interest is federal-only — huge swing in CA / NY / NJ.",
          'Build a ladder for both: regular maturities, less rate risk, no early-out penalties.',
          "Brokered CDs and T-bills both trade on a secondary market — early exit at market price, not a penalty.",
          "TreasuryDirect is free for T-bills but inflexible; a brokerage account is more practical for active ladders.",
          'In flat or inverted yield curves, HYSA + short ladder often beats locking into 5-year CDs.',
        ]}
      />
    </div>
  ),
};
