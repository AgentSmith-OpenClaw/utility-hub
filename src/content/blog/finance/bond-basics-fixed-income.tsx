import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const bondBasicsFixedIncome: BlogArticle = {
  slug: 'bond-basics-fixed-income',
  category: 'Investing',
  title: 'Bond Basics: Why Every Portfolio Needs Fixed Income',
  description:
    'Bonds aren\'t exciting, but they\'re what keeps your portfolio from a 50% loss when the stock market panics. Learn the math, the types, and how to size your bond allocation correctly.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    'bonds, fixed income, treasury bonds, corporate bonds, bond ladder, duration risk, yield curve, tips bonds',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Bonds are the part of personal finance that gets the least attention and the most muddled writing. Equity
        gets all the glamour — but in 2008, while stocks fell 37%, US Treasuries gained 14%. That kind of
        diversification is what bonds are for.
      </Lead>

      <H2>What a bond actually is</H2>
      <p>
        A bond is a loan you make to a borrower (government, corporation, municipality) in exchange for two
        things:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Periodic interest payments</strong> (the "coupon") for a fixed term.</li>
        <li><strong>Return of principal</strong> at maturity.</li>
      </ul>
      <p>
        Buy a $1,000 5-year Treasury at 4.5% coupon: you receive $45/year for 5 years and $1,000 back at the end.
        Total: $1,225 from a $1,000 investment. Predictable in a way stocks aren't.
      </p>

      <H2>The two main risks</H2>

      <H3>1. Interest rate risk (duration)</H3>
      <p>
        Bond prices move <em>inversely</em> to interest rates. If you hold a 4% bond and rates rise to 5%, your
        bond is worth less because new bonds offer better terms. The longer the bond's duration, the more
        sensitive it is.
      </p>
      <p>
        Rule of thumb: a 1% rate increase causes a roughly 1% price drop per year of duration. A 10-year bond
        loses about 10% in value when rates rise 1%; a 1-year bond loses about 1%.
      </p>

      <Callout title="2022 was a duration disaster" accent="amber">
        The Fed raised rates from 0% to 4.5% in one year. The Vanguard Total Bond ETF (BND) fell 13% — its worst
        year ever. Long-Treasury ETFs (TLT) fell 31%. Investors who thought bonds were "safe" learned
        about duration risk the hard way.
      </Callout>

      <H3>2. Credit risk</H3>
      <p>
        The borrower might default. US Treasury bonds are essentially default-free (the government can print
        money to pay them). Corporate bonds, junk bonds, and municipal bonds vary widely in default risk:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Investment-grade (BBB- or higher):</strong> ~0.1–1% annual default rate.</li>
        <li><strong>High-yield/junk (BB+ or lower):</strong> ~3–10% annual default rate, varies with economy.</li>
      </ul>
      <p>
        Higher credit risk = higher yield, but also higher correlation with stocks during recessions. Junk bonds
        often crash <em>with</em> the stock market — failing at the diversification job bonds are supposed to do.
      </p>

      <H2>The bond types you'll encounter</H2>

      <H3>US Treasury bonds</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>T-bills:</strong> 4-week to 52-week maturity. Used for short-term cash management.</li>
        <li><strong>T-notes:</strong> 2 to 10 years.</li>
        <li><strong>T-bonds:</strong> 20 to 30 years.</li>
        <li><strong>TIPS (Treasury Inflation-Protected Securities):</strong> principal adjusts with CPI inflation. Real-yield instrument.</li>
        <li><strong>I bonds:</strong> retail-only, inflation-adjusted, max $10k/year. Held at TreasuryDirect.</li>
      </ul>
      <p>
        Treasury interest is exempt from state income tax — meaningful in California, New York, etc. Worth
        comparing yields on an after-state-tax basis.
      </p>

      <H3>Corporate bonds</H3>
      <p>
        Loans to companies. Higher yield than Treasuries to compensate for credit risk. Most retail investors
        access via funds (LQD for investment grade, HYG for high yield) rather than buying individual bonds.
      </p>

      <H3>Municipal bonds ("munis")</H3>
      <p>
        Loans to state and local governments. Federal tax-exempt; sometimes state-tax-exempt if you live in the
        issuer's state. Worth considering for high-bracket investors in taxable accounts. Calculate
        equivalent taxable yield: <code>muni yield ÷ (1 - your marginal tax rate)</code>.
      </p>

      <H3>International bonds</H3>
      <p>
        Government and corporate debt from foreign issuers. Adds currency risk on top of credit and duration
        risk. Vanguard's research suggests diversification benefit is modest; many simple portfolios skip
        them.
      </p>

      <H2>How much bond exposure?</H2>
      <p>
        The classic rule was "your age in bonds." That's probably too conservative now given
        longer life expectancy and higher historical equity returns. Modern guidance:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Accumulation phase (20s–40s):</strong> 0–20% bonds. Time horizon is long; sequence risk doesn't apply.</li>
        <li><strong>Pre-retirement (50s):</strong> 20–40% bonds. Begin reducing equity to manage sequence risk.</li>
        <li><strong>Early retirement:</strong> 30–50% bonds. The danger zone for sequence risk.</li>
        <li><strong>Late retirement (75+):</strong> 30–60% bonds. Spending stability matters more than growth.</li>
      </ul>
      <p>
        Personal factors that should adjust these:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Pension or Social Security covering essentials → can hold more equity.</li>
        <li>Variable income or no pension → hold more bonds.</li>
        <li>Long expected longevity (family history) → hold more equity.</li>
        <li>Strong stomach for volatility → hold more equity.</li>
      </ul>

      <H2>Individual bonds vs bond funds</H2>
      <p>
        Bond <strong>funds</strong> are continually rolled — never "mature." Their value fluctuates daily
        with interest rates. Convenient but exposes you fully to duration risk.
      </p>
      <p>
        Individual bonds, if held to maturity, return your principal regardless of interim price changes. You
        know exactly what you'll get.
      </p>
      <p>
        For bond ladders (buying bonds maturing in successive years to fund expenses), individual Treasuries can
        be superior. For broad diversification with low effort, bond funds win.
      </p>

      <Callout title="The bond ladder for retirement" accent="indigo">
        Buy 5 individual Treasuries maturing in years 1, 2, 3, 4, 5. Each year, one matures and you spend it.
        Re-invest the others into a new 5-year. This locks in known income for 5 years regardless of interest
        rate movements — a powerful sequence-risk defense.
      </Callout>

      <H2>The yield curve and what it tells you</H2>
      <p>
        The yield curve plots Treasury yields against maturity. Normally upward-sloping: longer terms pay more
        because you're locking up money for longer.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Steep upward curve:</strong> typical, healthy economy.</li>
        <li><strong>Flat curve:</strong> uncertainty about future growth or inflation.</li>
        <li><strong>Inverted curve (short rates higher than long):</strong> historically a recession signal. The 2022–2023 inversion preceded predicted but slow-arriving slowdown.</li>
      </ul>
      <p>
        For investing decisions, the yield curve doesn't need to drive your strategy — but it explains why
        sometimes a 1-year T-bill yields more than a 10-year bond.
      </p>

      <H2>TIPS and I-bonds: the inflation hedges</H2>
      <p>
        Both adjust principal or interest with inflation. Critical when inflation is volatile.
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>TIPS:</strong> trade like regular bonds but principal adjusts with CPI. Held in a brokerage account or via TIPS funds (SCHP, VTIP).</li>
        <li><strong>I-bonds:</strong> retail-only, $10k/year limit per person. Yield resets every 6 months based on CPI. Tax-deferred federal interest, exempt from state. Cannot be sold in first year, partial penalty for years 1–5.</li>
      </ul>
      <p>
        For retirees worried about high inflation eroding fixed bond income, a 10–20% TIPS allocation within the
        bond portion is a reasonable hedge.
      </p>

      <H2>Common bond mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Chasing yield in junk bonds.</strong> The extra yield disappears in recessions when you need bonds to be safe.</li>
        <li><strong>Holding long-duration bonds for stability.</strong> Counterintuitive but true: long bonds are <em>more</em> volatile than short bonds.</li>
        <li><strong>Avoiding bonds entirely "because they don't earn anything."</strong> Even a 4% bond return reduces overall portfolio volatility — meaning higher risk-adjusted return.</li>
        <li><strong>Treating bond funds like savings accounts.</strong> They lose value when rates rise. Don't hold money you'll need in 1 year in BND.</li>
        <li><strong>Forgetting taxes.</strong> Treasury interest is federal-only; corporate bond interest is fully taxable. Munis can be tax-free. The right bond for taxable account differs by bracket.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Bonds = predictable income + return of principal at maturity. Two risks: interest rate (duration) and credit.',
          'Treasuries are state-tax-exempt and effectively default-free. Corporate bonds carry credit risk that can correlate with stocks.',
          '"Age in bonds" is too conservative; modern guidance is 0–20% accumulation, ramping to 30–50% in retirement.',
          'Individual bonds + ladder strategy can outperform bond funds for retirement income because hold-to-maturity returns principal regardless of rate moves.',
          'TIPS and I-bonds defend against inflation; useful in 10–20% of bond allocation for retirees worried about purchasing power.',
        ]}
      />

      <p>
        Stress-test your bond allocation against your expected retirement timeline using our{' '}
        <Link href="/finance/fire-calculator" className="text-indigo-600 font-semibold hover:underline">FIRE Calculator</Link>.
      </p>
    </div>
  ),
};
