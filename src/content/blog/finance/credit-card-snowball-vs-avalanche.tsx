import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const creditCardSnowballVsAvalanche: BlogArticle = {
  slug: 'credit-card-snowball-vs-avalanche',
  category: 'Credit',
  title: 'Snowball vs Avalanche: Real Numbers on Three Real Debts',
  description:
    "Most snowball-vs-avalanche explainers wave their hands. Here are three actual debt scenarios with the actual interest difference, so you can pick on evidence rather than vibes.",
  publishedDate: '2026-05-10',
  readTime: '11 min read',
  keywords:
    'debt snowball vs avalanche, credit card payoff strategy, debt avalanche calculator, debt payoff method, multiple credit card debt, fastest way to pay off credit cards',
  relatedTools: [
    { name: 'Credit Card Payoff Calculator', href: '/finance/credit-card-payoff-calculator' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        The classic debate: pay off the smallest balance first (snowball) for psychological wins, or the highest APR
        first (avalanche) for math wins. The real answer is "it depends on the actual numbers" — so here are the actual
        numbers across three realistic debt situations.
      </Lead>

      <H2>The two methods</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>Snowball:</strong> minimum payments on every card, all extra cash to the smallest balance. When that&apos;s
          gone, roll its payment into the next-smallest. Wins by motivation: a card hits $0 quickly, which builds momentum.
        </li>
        <li>
          <strong>Avalanche:</strong> minimum payments on every card, all extra cash to the highest APR. When that&apos;s
          paid, roll into the next-highest APR. Wins by math: always the lowest total interest paid.
        </li>
      </ul>

      <H2>Scenario 1: balanced debt, similar APRs</H2>
      <p>
        Three cards, $400/month total budget for debt:
      </p>
      <ul className="list-disc pl-6 space-y-1.5 my-4">
        <li>Card A: $4,000 balance @ 19.99% APR, $80 minimum</li>
        <li>Card B: $3,000 balance @ 21.99% APR, $60 minimum</li>
        <li>Card C: $2,000 balance @ 18.99% APR, $40 minimum</li>
      </ul>
      <p>
        Snowball order: C → B → A (smallest first). Avalanche order: B → A → C (highest APR first).
      </p>
      <p>
        <strong>Snowball:</strong> debt-free in ~31 months, total interest paid ≈ $2,420.<br />
        <strong>Avalanche:</strong> debt-free in ~31 months, total interest paid ≈ $2,360.
      </p>
      <p>
        Difference: $60 of interest, same payoff time. When APRs are within ~3 percentage points of each other,
        snowball is essentially free. The motivation boost wins by default.
      </p>

      <H2>Scenario 2: one nasty store card, two regular cards</H2>
      <ul className="list-disc pl-6 space-y-1.5 my-4">
        <li>Visa: $5,000 @ 18.99%, $100 minimum</li>
        <li>Mastercard: $3,500 @ 19.99%, $70 minimum</li>
        <li>Store card: $1,200 @ 28.99%, $35 minimum</li>
      </ul>
      <p>
        Budget: $500/month. Snowball: store → Mastercard → Visa. Avalanche: store → Mastercard → Visa.
      </p>
      <p>
        Same order — both methods agree because the smallest balance also happens to be the highest APR. This is the
        ideal case: you get the snowball win <em>and</em> the optimal interest savings simultaneously.
      </p>
      <p>
        Result: debt-free in ~25 months, total interest ≈ $2,150.
      </p>

      <Callout title="Watch for store cards" accent="rose">
        Retail store cards (Target, Best Buy, furniture stores) routinely run 25–30% APR. They're almost always the
        right card to kill first regardless of method. The high APR makes carrying any balance brutal.
      </Callout>

      <H2>Scenario 3: huge premium card, small high-rate card</H2>
      <ul className="list-disc pl-6 space-y-1.5 my-4">
        <li>Premium card: $12,000 @ 16.99%, $240 minimum</li>
        <li>Small store card: $800 @ 27.99%, $30 minimum</li>
      </ul>
      <p>
        Budget: $400/month. Snowball: store → premium. Avalanche: store → premium.
      </p>
      <p>
        Again, same order — smallest happens to be highest APR. Both methods finish in ~38 months with about $3,800
        of interest.
      </p>

      <H3>The version that diverges</H3>
      <p>
        Now flip the APRs: large premium card at 22% and small store card at 18%. Now snowball still attacks the
        store card first, but avalanche correctly goes after the premium card.
      </p>
      <ul className="list-disc pl-6 space-y-1.5 my-4">
        <li>Snowball: ~38 months, ≈ $4,420 interest.</li>
        <li>Avalanche: ~37 months, ≈ $4,310 interest.</li>
      </ul>
      <p>
        Difference: $110, one month earlier. Even when avalanche "wins," the absolute dollar gap is often modest. But
        every dollar saved on interest is a dollar you didn&apos;t have to earn after-tax. At a 25% marginal tax bracket,
        $110 in saved interest = $147 in saved gross pay.
      </p>

      <H2>The actual decision framework</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li>
          <strong>Look at your APRs first.</strong> If the highest is &gt;5 percentage points above the lowest,
          avalanche pays meaningfully more. If they&apos;re within 3 points, snowball is ~free.
        </li>
        <li>
          <strong>Look at your history with debt.</strong> If you&apos;ve abandoned payoff plans before, snowball&apos;s
          motivation effect is worth real money — quitting halfway through is the most expensive outcome of all.
        </li>
        <li>
          <strong>Look at your largest absolute balance.</strong> If one card holds &gt;60% of total debt, killing the
          others first feels like progress but barely moves the needle. Avalanche wins clearly here.
        </li>
        <li>
          <strong>Negotiate the rates first.</strong> Before optimizing strategy, ask each issuer for an APR reduction.
          Approval rate is roughly 50% if your account is in good standing — saves a percentage point or two with no math required.
        </li>
      </ol>

      <H2>The hidden third strategy: balance transfer + avalanche</H2>
      <p>
        A 0% APR balance transfer card (typically 12–21 months promotional period) can compress 30 months of avalanche
        payoff into the promotional window. The math:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Transfer fee: typically 3–5% of the balance moved.</li>
        <li>Promotional APR: 0% for 12–21 months.</li>
        <li>Post-promo APR: usually 18–25% — back to square one if you don&apos;t finish in time.</li>
      </ul>
      <p>
        If you can pay off the entire transferred balance during the promo period, even a 4% transfer fee crushes the
        equivalent interest you would have paid. If you can&apos;t, you&apos;re paying the fee for nothing.
      </p>

      <Callout title="The discipline trap" accent="amber">
        The single biggest reason payoff plans fail isn&apos;t methodology — it&apos;s re-using the cards. The day you
        clear a card, freeze it (literally, in a block of ice if you have to). Closing it hurts your score; not using
        it doesn&apos;t.
      </Callout>

      <H2>Bottom line</H2>
      <p>
        Math says avalanche always wins, but usually by less than people think — typically $50–$300 across a multi-card
        payoff. Snowball wins on adherence: a 70%-completed avalanche plan saves less than a 100%-completed snowball plan.
      </p>
      <p>
        Run your actual numbers in a payoff calculator. If avalanche saves you &lt;$200, pick the method you&apos;ll stick to.
        If it saves &gt;$500, the discipline tax is real and avalanche is worth the patience.
      </p>

      <KeyTakeaways
        items={[
          'Snowball = smallest balance first (motivation). Avalanche = highest APR first (math).',
          'When APRs are within 3 percentage points, the difference is typically <$100 — pick by personality.',
          'When one card has a 5%+ APR premium over the others, avalanche meaningfully wins.',
          'Negotiate APR reductions before optimizing strategy — often a 50/50 shot at saving 2+ points.',
          'A 0% balance transfer plus avalanche-style payment beats both pure strategies if you can finish in the promo window.',
        ]}
      />
    </div>
  ),
};
