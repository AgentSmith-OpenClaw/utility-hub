import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways, Comparison } from '../components';

export const aprVsApyExplained: BlogArticle = {
  slug: 'apr-vs-apy-explained',
  category: 'Banking',
  title: 'APR vs APY: The One-Letter Difference That Hides Real Money',
  description:
    "APR and APY look almost identical, but the gap between them can quietly distort every financial comparison you make. Here's how to read both correctly.",
  publishedDate: '2026-05-10',
  readTime: '10 min read',
  keywords:
    'apr vs apy, apr definition, apy definition, annual percentage rate, annual percentage yield, compounding, savings account apy, credit card apr',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'Credit Card Payoff Calculator', href: '/finance/credit-card-payoff-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        APR (annual percentage rate) and APY (annual percentage yield) are reported on virtually every loan, deposit
        account, and credit card you touch. They&apos;re not interchangeable — and which one you&apos;re looking at depends on
        whether the institution wants the number to look bigger or smaller.
      </Lead>

      <H2>The core distinction</H2>
      <p>
        APR is the interest rate <em>without</em> compounding factored in. APY is the interest rate <em>with</em> compounding
        factored in. For a single year, with no compounding (or annual-only compounding), APR and APY are identical.
        For monthly or daily compounding, APY is always slightly higher than APR.
      </p>
      <Comparison
        leftTitle="APR (Annual Percentage Rate)"
        left={
          <>
            <p>The simple, non-compounded rate.</p>
            <p className="mt-2">Required disclosure under TILA for loans.</p>
            <p className="mt-2">Used for: mortgages, car loans, credit cards.</p>
          </>
        }
        rightTitle="APY (Annual Percentage Yield)"
        right={
          <>
            <p>The effective rate including compounding.</p>
            <p className="mt-2">Required disclosure under TISA for deposits.</p>
            <p className="mt-2">Used for: savings, CDs, money market accounts.</p>
          </>
        }
      />

      <H2>The math</H2>
      <p>
        For a nominal rate <em>r</em> compounded <em>n</em> times per year:
      </p>
      <p className="font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 my-4 text-center">
        APY = (1 + r/n)<sup>n</sup> − 1
      </p>
      <p>
        At 5% APR compounded monthly: APY = (1 + 0.05/12)<sup>12</sup> − 1 = <strong>5.116%</strong>. The difference looks
        small, but on a $50,000 deposit over 30 years, the APY-vs-APR distinction is the difference between $216,097
        and $221,667 — about $5,500.
      </p>

      <H3>The compounding-frequency effect</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>5% APR compounded annually → 5.000% APY</li>
        <li>5% APR compounded quarterly → 5.094% APY</li>
        <li>5% APR compounded monthly → 5.116% APY</li>
        <li>5% APR compounded daily → 5.127% APY</li>
        <li>5% APR compounded continuously → 5.127% APY (limit)</li>
      </ul>
      <p>
        Beyond daily, compounding frequency stops mattering — the marginal benefit collapses to nothing. So when a bank
        brags "we compound continuously," it&apos;s essentially marketing on a number that&apos;s identical to "compounded
        daily."
      </p>

      <H2>How institutions exploit the framing</H2>
      <p>
        Lenders quote APR because it makes the cost of borrowing look smaller. Banks quote APY on deposits because it
        makes the return look larger. Same underlying mechanic, opposite spin.
      </p>
      <p>
        On a credit card with a 22.99% APR, the actual <em>effective</em> annual cost — if you carry a balance and let
        it compound monthly — is closer to <strong>25.59% APY</strong>. That extra 2.6 percentage points is what your
        statement never explicitly shows you.
      </p>
      <Callout title="The trick for credit cards" accent="rose">
        Always think in APY when computing what carrying a balance actually costs you. The card&apos;s monthly periodic
        rate (APR ÷ 12) compounds against itself, so a 22.99% APR balance grows by ~25.6% over a year if you only pay
        interest.
      </Callout>

      <H2>Loan APR includes more than just interest</H2>
      <p>
        For closed-end loans (mortgage, auto), APR is required by federal law (TILA) to reflect <em>all required loan
        costs</em>, not just the interest rate. So a 6.5% mortgage with origination fees and points might be quoted as
        "6.50% rate, 6.78% APR." The APR is more honest about total cost over the life of the loan.
      </p>
      <p>
        This makes APR comparison-shopping useful: a low rate with high fees and a higher rate with no fees can both
        come out to the same APR, exposing the gimmick.
      </p>

      <H2>Practical reading guide</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Savings & CDs:</strong> compare APY to APY. Two banks both quoting "5%" may have different compounding frequencies — APY normalizes them.</li>
        <li><strong>Credit cards:</strong> use APR as quoted, but mentally bump it up ~2 percentage points if you carry a balance.</li>
        <li><strong>Mortgages & auto loans:</strong> compare APR to APR (it includes fees) — but then double-check by running both quotes through a payment calculator. APR can mask differences if loan terms differ.</li>
        <li><strong>Promotional 0% APR offers:</strong> read the fine print for "deferred interest" — some retailers charge back-dated interest from the original purchase date if you don&apos;t pay off the entire balance by the promo end.</li>
      </ol>

      <H2>The mental model</H2>
      <p>
        APR is "what the rate is on paper." APY is "what the rate actually does to your money." When you&apos;re paying
        money, ask for APY (the bank won&apos;t volunteer it). When you&apos;re receiving money, the bank already gives you
        APY because it looks better.
      </p>

      <KeyTakeaways
        items={[
          'APR ignores compounding; APY includes it. APY is always ≥ APR.',
          'Loans quote APR (looks smaller); deposits quote APY (looks bigger).',
          'For credit cards with monthly compounding, true cost is APY ≈ APR × 1.115 at typical rates.',
          'Mortgage APR includes mandatory fees, making it more comparable across lenders than the raw rate.',
          'Compounding more often than daily adds essentially nothing — "continuous compounding" is marketing.',
        ]}
      />
    </div>
  ),
};
