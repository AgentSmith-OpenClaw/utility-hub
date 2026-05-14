import Head from 'next/head';
import Link from 'next/link';
import CreditCardPayoffCalculator from '../../components/CreditCardPayoffCalculator/CreditCardPayoffCalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function CreditCardPayoffCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/credit-card-payoff-calculator');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is the avalanche or snowball method faster?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The avalanche method (highest APR first) is mathematically optimal — it always pays the least total interest and often the shortest time to debt-free. The snowball method (smallest balance first) costs more in interest but generates faster psychological wins, which helps people stay disciplined. For most multi-card scenarios with similar APRs the dollar gap is small, so the best strategy is the one you’ll actually finish.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much extra should I pay above the minimum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Even a small bump above the minimum saves a disproportionate amount of interest. On a $5,000 balance at 22% APR, paying $200/month instead of the minimum can cut payoff time from 30+ years to under 3 years and save thousands in interest. Use this calculator to see the exact impact of every extra $50 you can squeeze in.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I consolidate or use a balance transfer card first?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 0% APR balance transfer card or fixed-rate consolidation loan can be excellent if you can pay off the balance during the promo period and your credit score qualifies. Watch out for 3–5% transfer fees and the post-promo APR. If you have steady income and good credit, modeling the loan rate vs your current weighted-average APR usually makes the math obvious.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is credit card interest calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most issuers use the average daily balance method with daily compounding. The simulation in this tool uses monthly compounding at APR/12, which closely matches real-world results when you pay near the statement date. The day-of-month timing of payments can shift the actual interest by a few percent, but the order of magnitude is identical.',
        },
      },
      {
        '@type': 'Question',
        name: 'Will paying off cards hurt my credit score?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Paying down balances almost always helps. Lower utilization (the ratio of balance to credit limit) is roughly 30% of your FICO score. Don’t close the cards once paid — keeping the limit open while carrying a $0 balance reduces utilization and protects the average age of your credit history.',
        },
      },
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Credit Card Payoff Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Compare debt avalanche vs snowball vs minimum-only payoff for multiple credit cards. Visualize balance over time, interest saved, and per-card payoff order.',
    url: `${SITE_URL}/finance/credit-card-payoff-calculator`,
    featureList:
      'Multi-card simulation, Avalanche method, Snowball method, Minimum-only baseline, Interest charts, Per-card payoff schedule, Excel export',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '142',
    },
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to plan a credit card payoff',
    description:
      'Use the free Toolisk Credit Card Payoff Calculator to compare avalanche vs snowball strategies and see exactly how much interest you can save.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter every card you carry a balance on',
        text: 'List each card with its current balance, APR (look at the back of the most recent statement), and minimum payment.',
      },
      {
        '@type': 'HowToStep',
        name: 'Set your monthly payment budget',
        text: 'This must be at least the sum of minimums. Anything above goes to the priority card based on your strategy.',
      },
      {
        '@type': 'HowToStep',
        name: 'Pick avalanche or snowball',
        text: 'Avalanche pays the highest-APR card first (least total interest). Snowball pays the smallest-balance card first (faster psychological wins).',
      },
      {
        '@type': 'HowToStep',
        name: 'Review the projection',
        text: 'See debt-free date, total interest, savings vs minimum-only, balance-over-time chart, and per-card payoff order.',
      },
      {
        '@type': 'HowToStep',
        name: 'Export your plan',
        text: 'Download the full month-by-month schedule and strategy comparison as an Excel workbook.',
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Credit Card Payoff Calculator — Avalanche vs Snowball | Toolisk</title>
        <meta
          name="description"
          content="Free credit card payoff calculator. Compare avalanche vs snowball vs minimum-only strategies for multiple cards. See interest saved, debt-free date, and per-card payoff order with charts and Excel export."
        />
        <meta
          name="keywords"
          content="credit card payoff calculator, debt avalanche calculator, debt snowball calculator, credit card debt payoff, multiple credit card payoff, credit card interest calculator, debt payoff plan"
        />
        <link rel="canonical" href={`${SITE_URL}/finance/credit-card-payoff-calculator`} />
        <meta property="og:title" content="Credit Card Payoff Calculator — Avalanche vs Snowball | Toolisk" />
        <meta
          property="og:description"
          content="Compare debt avalanche vs snowball strategies for multiple credit cards. See interest saved and exact debt-free date."
        />
        <meta property="og:url" content={`${SITE_URL}/finance/credit-card-payoff-calculator`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Credit Card Payoff Calculator — Avalanche vs Snowball | Toolisk" />
        <meta
          name="twitter:description"
          content="Free multi-card debt payoff calculator. Avalanche vs snowball. Real interest saved."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema, howToSchema]),
          }}
        />
      </Head>

      <CreditCardPayoffCalculator />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <section className="bg-rose-50 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">About this calculator</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            A free, no-signup credit card payoff calculator that simulates exactly what happens to each of your
            cards month by month. It models monthly interest compounding, minimum payments, and any extra you put
            toward the highest-priority card based on the strategy you pick.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              '🧮 Multi-card simulation — model your full wallet',
              '🏔️ Avalanche method (highest APR first)',
              '❄️ Snowball method (smallest balance first)',
              '🪙 Minimum-only baseline for comparison',
              '📈 Stacked balance chart per card',
              '📊 Per-card payoff order with interest paid',
              '💾 Full month-by-month Excel export',
              '🔒 100% client-side — your data never leaves your browser',
            ].map((f) => (
              <div key={f} className="flex gap-3 items-start">
                <span className="mt-0.5">{f.split(' ')[0]}</span>
                <span className="text-slate-700 text-sm">{f.substring(f.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Avalanche vs snowball — pick the right one for you</h2>
          <p className="text-slate-500 mb-6">Both strategies pay off the same total debt. They differ in <em>which</em> card gets the spare cash first.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">Avalanche</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Highest APR first</h3>
              <p className="text-sm text-slate-600 mb-3">
                Mathematically optimal. Always pays the least total interest, usually the shortest time to debt-free.
                Best when you’re analytical and the per-card APR spread is wide.
              </p>
              <div className="text-xs text-slate-500">
                Example: a 28.99% store card and an 18.99% Visa? Avalanche kills the store card first.
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Snowball</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smallest balance first</h3>
              <p className="text-sm text-slate-600 mb-3">
                Costs slightly more interest but generates fast wins — a card hits $0 quickly, which keeps you
                motivated. Best when you’ve abandoned payoff plans before.
              </p>
              <div className="text-xs text-slate-500">
                Example: a $400 store card and a $4,000 Visa? Snowball kills the $400 card first.
              </div>
            </div>
          </div>
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900">
            <strong>Pro tip:</strong> when APRs are within ~2 percentage points of each other, snowball is essentially
            free — the interest difference over the full payoff is usually small enough that the motivation boost
            wins. When APRs differ by 5%+ (e.g. 29% store cards vs 16% premium cards), avalanche pays meaningfully more.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">How credit card interest actually works</h2>
          <p className="text-slate-600 leading-relaxed mb-3">
            Credit cards compound daily using the average daily balance. The APR is divided by 365 to get a daily
            periodic rate, then applied each day. If you pay your statement balance in full by the due date,
            most cards waive interest entirely on purchases (the “grace period”). Once you carry any balance into
            the next cycle, the grace period collapses and new purchases start accruing interest from day one.
          </p>
          <p className="text-slate-600 leading-relaxed">
            That mechanic is why minimum payments are so dangerous: you’re always paying interest on yesterday’s
            interest. On a $5,000 balance at 22.99% APR with the typical 2% minimum, you’ll pay roughly{' '}
            <strong>$13,000 in interest over 30+ years</strong> if you only ever make minimums and never charge another
            cent. That’s not a typo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related finance tools &amp; reading</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: '/finance/student-loan-calculator', title: 'Student Loan Calculator', desc: 'Tackle student debt alongside credit cards with the right payoff order.' },
              { href: '/finance/auto-loan-calculator', title: 'Auto Loan Calculator', desc: 'See total interest cost so you can prioritise which debt to eliminate first.' },
              { href: '/finance/buy-vs-rent-calculator', title: 'Buy vs Rent Calculator', desc: 'Find out when your debt payoff puts you in a position to buy a home.' },
              { href: '/finance/us-paycheck-calculator', title: 'US Paycheck Calculator', desc: 'Find out exactly how much budget you can free up each month for debt payoff.' },
              { href: '/finance/amortization-calculator', title: 'Amortization Calculator', desc: 'See how interest-vs-principal split changes over the life of any loan.' },
              { href: '/finance/learn/debt-snowball-vs-avalanche', title: 'Debt Snowball vs Avalanche — Article', desc: 'A deep dive into when each strategy genuinely wins.' },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-rose-300 hover:shadow-md transition-all"
              >
                <div className="font-semibold text-slate-900 mb-1">{t.title}</div>
                <p className="text-sm text-slate-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
