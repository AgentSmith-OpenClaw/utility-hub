import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const whenMortgageRefinanceIsWorthIt: BlogArticle = {
  slug: 'when-mortgage-refinance-is-worth-it',
  category: 'Loans',
  title: 'When Mortgage Refinancing Is Actually Worth It (2026 Guide)',
  description:
    "Forget the 1%-rule rule of thumb — refinancing math has gotten more nuanced. Walk through break-even, cash-out vs rate-and-term, and the cases where refi quietly costs you money even at a lower rate.",
  publishedDate: '2026-05-10',
  readTime: '13 min read',
  keywords:
    'mortgage refinance, refinance calculator, mortgage refinance break-even, cash-out refinance, rate-and-term refinance, when to refinance mortgage',
  relatedTools: [
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
    { name: 'Amortization Calculator', href: '/finance/amortization-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        The old "refi if rates drop 1%" rule of thumb was always sloppy. With 2026 rates volatile and closing costs
        often $4,000–$8,000, the right question isn&apos;t "is the rate lower?" — it&apos;s "how long until I break even,
        and will I still be in this house then?"
      </Lead>

      <H2>The break-even math that actually matters</H2>
      <p>
        Refinancing has two costs: the explicit closing costs (origination, title, appraisal, recording), and the
        implicit cost of <em>resetting your amortization clock</em>. The first is easy to see; the second is what
        most calculators ignore.
      </p>
      <p>
        Break-even months = total closing costs ÷ monthly payment savings.
      </p>
      <p>
        On a $400,000 loan, dropping from 7.0% to 6.0% saves about $267/month. With $6,000 in closing costs, you
        break even in 22 months. If you sell or refinance again before then, you lose money.
      </p>

      <Callout title="Use the no-cost option as a benchmark" accent="indigo">
        Lenders offer "no closing cost" refis where the cost is rolled into a slightly higher rate. Always price-check
        a no-cost quote against a paid-closing quote — the right answer depends on how long you&apos;ll keep the loan.
      </Callout>

      <H2>The amortization reset trap</H2>
      <p>
        If you&apos;re 8 years into a 30-year mortgage and refinance into another 30-year, you just bought yourself
        38 years of mortgage payments. Even at a lower rate, you may pay <em>more</em> total interest because you
        re-set the clock to 30 years of mostly-interest payments at the start.
      </p>
      <H3>Three ways to dodge it</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Refinance to a shorter term.</strong> 30→20 or 30→15. Higher payment, but the math usually destroys the new-30-year option.</li>
        <li><strong>Keep your original payment.</strong> Refi to a new 30 but voluntarily pay the same dollar amount you were paying before. The extra now goes to principal.</li>
        <li><strong>Match remaining term.</strong> If you have 22 years left, refinance into a 20- or 25-year loan instead of restarting at 30.</li>
      </ul>

      <H2>When refinancing genuinely wins</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li>
          <strong>Rate drop ≥ 0.75% AND you&apos;ll be in the home 3+ years.</strong> The 0.75 figure is a working
          minimum at typical loan sizes; anything less rarely beats break-even within a reasonable horizon.
        </li>
        <li>
          <strong>You can drop PMI.</strong> If your home value rose and you&apos;re now under 80% LTV, refinancing kills
          PMI even if the rate is identical. Often $100–$300/month saved with no break-even — pure win.
        </li>
        <li>
          <strong>You bought when credit was thin and now have an 800 score.</strong> Even with the same market rate,
          you may qualify 0.25–0.50% cheaper than before.
        </li>
        <li>
          <strong>You&apos;re moving from ARM to fixed before the reset.</strong> If your 5/1 or 7/1 ARM is about to
          adjust above prevailing fixed rates, locking in beats the variable risk.
        </li>
      </ol>

      <H2>Cash-out refinance: separate calculation entirely</H2>
      <p>
        Cash-out refinances let you tap home equity by borrowing more than you currently owe. They&apos;re a different
        product mathematically:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>The "rate" you should care about is on the <em>new cash</em>, not the rolled-over balance.</li>
        <li>Compare against a HELOC and a home equity loan — both often beat cash-out refi when the cash isn&apos;t huge.</li>
        <li>Closing costs scale with loan size; bigger loan, bigger absolute fees.</li>
      </ul>
      <p>
        The single best case for cash-out refi: paying off credit card debt at 22% APR with mortgage debt at 6.5%.
        That arbitrage is real and powerful, but only if you don&apos;t re-rack the credit cards.
      </p>

      <H2>Hidden costs people forget</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Lost mortgage interest deduction phasing.</strong> If you currently itemize and your refi is just under the standard deduction threshold, you may lose a chunk of tax benefit.</li>
        <li><strong>Escrow re-funding.</strong> Lenders often want a fresh escrow cushion at closing — $2,000–$5,000 of cash you don&apos;t get back for months.</li>
        <li><strong>Prepayment penalties.</strong> Rare on most current loans, but check your existing note before you commit.</li>
        <li><strong>Credit pulls.</strong> Refi shopping involves multiple hard pulls; cluster them within 14 days so they count as one for FICO.</li>
      </ul>

      <H2>The 4-question screen</H2>
      <p>
        Before you spend a Saturday on lender quotes, run these four checks:
      </p>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Will I be in this house ≥ 3 years?</strong> If no — almost never refi unless dropping PMI.</li>
        <li><strong>Is the rate drop ≥ 0.75%?</strong> Or is there another structural reason (PMI, ARM-to-fixed)?</li>
        <li><strong>Can I keep the original payment?</strong> If you can&apos;t resist taking the lower payment, you&apos;ll lose to the amortization reset.</li>
        <li><strong>Is my credit at least as good as when I bought?</strong> Post-pandemic life events often hurt scores; check before quoting.</li>
      </ol>

      <Callout title="Run the numbers, then run them again" accent="emerald">
        Use the Toolisk Mortgage Calculator and Amortization Calculator side-by-side: model the new loan and the
        existing-loan-with-extra-principal scenario. The right move often turns out to be "send an extra $400/month to
        principal" rather than refinance at all.
      </Callout>

      <KeyTakeaways
        items={[
          'Break-even = closing costs ÷ monthly savings. Be in the house at least that long.',
          "Refinancing into another 30-year resets your amortization. Match the remaining term or self-impose the old payment.",
          'PMI removal is the cleanest refi win — often saves $100–$300/month with negligible break-even.',
          'Cash-out is a separate analysis: compare against HELOC and home equity loans before locking in.',
          "Don't refi just because rates fell — check rate drop, time horizon, and amortization reset together.",
        ]}
      />
    </div>
  ),
};
