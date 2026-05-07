import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Callout, Comparison, KeyTakeaways } from '../components';

export const rothVsTraditionalIra: BlogArticle = {
  slug: 'roth-vs-traditional-ira',
  category: 'Retirement',
  title: 'Roth IRA vs Traditional IRA: Which Tax-Advantaged Account Should You Choose?',
  description:
    'Decode the tax math behind Roth and Traditional IRAs. Learn when to pay taxes now, when to defer them, and the income limits, conversion rules, and edge cases that change the answer.',
  publishedDate: '2026-05-08',
  readTime: '14 min read',
  keywords:
    'roth ira, traditional ira, ira comparison, roth vs traditional, retirement account, tax deferred, after tax retirement, ira contribution limits',
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Two retirement accounts with the same contribution limit, the same growth potential, and the same penalties
        for early withdrawal. The only real difference is <em>when</em> you pay tax — and that timing decision can be
        worth tens of thousands of dollars over your lifetime.
      </Lead>

      <H2>The fundamental tax tradeoff</H2>
      <p>
        Both accounts shelter your investments from annual taxation on dividends, interest, and capital gains. The
        difference is which side of the timeline gets taxed:
      </p>

      <Comparison
        leftTitle="Traditional IRA"
        rightTitle="Roth IRA"
        left={
          <ul className="list-disc pl-5 space-y-2">
            <li>Contributions may be deductible <em>now</em></li>
            <li>Growth is tax-deferred</li>
            <li>Withdrawals taxed as ordinary income</li>
            <li>Required Minimum Distributions (RMDs) at 73</li>
          </ul>
        }
        right={
          <ul className="list-disc pl-5 space-y-2">
            <li>Contributions made with <em>after-tax</em> dollars</li>
            <li>Growth is tax-free</li>
            <li>Qualified withdrawals are tax-free</li>
            <li>No RMDs during the original owner's lifetime</li>
          </ul>
        }
      />

      <H2>The simple decision rule (and why it's wrong)</H2>
      <p>
        Most articles tell you: <em>if you expect to be in a higher tax bracket in retirement, use Roth. If lower, use
        Traditional.</em> That captures the core insight but misses three forces that complicate things:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>The contribution-limit asymmetry.</strong> $7,000 into a Roth shelters more wealth than $7,000 into a Traditional, because the Roth dollars are post-tax — you're effectively contributing more.</li>
        <li><strong>Future tax rate uncertainty.</strong> The current US federal tax structure is set to revert to higher pre-2018 rates after 2025 unless extended. Most analysts assume rates trend up over decades.</li>
        <li><strong>Sequencing flexibility.</strong> Roth dollars give you control over your effective retirement income tax rate. Mixing both account types is a hedge.</li>
      </ul>

      <ToolCTA
        href="/finance/fire-calculator"
        label="Project Your Retirement Corpus"
        hint="See how tax-free vs tax-deferred growth changes your final balance over 30+ years."
        accent="indigo"
      />

      <H2>Income limits and contribution rules (2026)</H2>
      <p>
        Both accounts share a $7,000 annual contribution limit ($8,000 if age 50+). But the rules diverge sharply on
        who can contribute or deduct:
      </p>

      <H3>Traditional IRA</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Anyone with earned income can contribute, regardless of income level.</li>
        <li>Deductibility phases out if you (or your spouse) are covered by a workplace retirement plan: roughly $77k–$87k single, $123k–$143k joint.</li>
        <li>Above the deduction phase-out, you can still contribute non-deductible — but you're creating a tracking nightmare with IRS Form 8606 unless you convert it (see backdoor Roth).</li>
      </ul>

      <H3>Roth IRA</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Direct contribution phases out: roughly $146k–$161k single, $230k–$240k joint (Modified AGI).</li>
        <li>High earners can still get money in via the <Link href="/finance/learn/backdoor-roth-strategy" className="text-indigo-600 font-semibold hover:underline">backdoor Roth</Link>.</li>
        <li>Five-year rule: each conversion has its own five-year clock for tax-free withdrawal of converted principal.</li>
      </ul>

      <H2>Run the actual math</H2>
      <p>
        Imagine $7,000 contributed at age 30, growing at 8% real return for 35 years. Your marginal bracket today is
        24%; in retirement, you withdraw at the same 24% bracket.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Traditional:</strong> $7,000 × (1.08)^35 = ~$103,500 → after 24% tax = ~$78,700</li>
        <li><strong>Roth:</strong> $7,000 × (1.08)^35 = ~$103,500 → tax-free = $103,500</li>
      </ul>
      <p>
        Wait — the Roth wins by $25,000? Only because the $7,000 going in was already <em>post-tax</em>. To be apples-to-apples,
        you'd compare $7,000 Roth to $7,000 Traditional <em>plus</em> $1,680 invested in a taxable account (the
        deduction savings). At identical bracket in/out, both end up identical after taxes — that's the math working.
      </p>
      <p>
        The Roth still wins in practice because most savers don't actually invest the deduction in a side account
        — they spend it. The Roth's post-tax framing forces savings discipline.
      </p>

      <Callout title="The asymmetric upside" accent="indigo">
        Roth contributions effectively allow you to shelter <em>more</em> total wealth at the same nominal limit.
        $7,000 of post-tax money requires earning ~$9,200 pre-tax at a 24% bracket — so you've really sheltered
        $9,200 of economic activity per year, vs $7,000 in a Traditional.
      </Callout>

      <H2>Six scenarios with clear answers</H2>

      <H3>1. Early-career, low bracket (12% or less)</H3>
      <p>
        <strong>Roth, hands down.</strong> Tax rates are unlikely to be lower than your current 12% in retirement
        unless something has gone badly wrong. Lock in the rate and let decades of growth accrue tax-free.
      </p>

      <H3>2. Peak-career, high bracket (32% or higher)</H3>
      <p>
        <strong>Traditional, then Roth conversions in early retirement.</strong> Take the deduction at 32%, retire,
        then convert chunks at 12–22% in the gap years before Social Security and RMDs hit. This is the classic
        "Roth conversion ladder" used in early retirement planning.
      </p>

      <H3>3. Mid-career, 22–24% bracket</H3>
      <p>
        <strong>Split contributions or favor Roth.</strong> Tax rates are uncertain over 30+ years; diversifying
        gives you optionality. Roth wins on flexibility (no RMDs, tax-free heirs) even if the after-tax math is
        a wash.
      </p>

      <H3>4. Anticipating a sabbatical or low-income year</H3>
      <p>
        <strong>Save Traditional now, convert in the low-income year.</strong> This is the most powerful single
        tax-arbitrage move available to most workers — converting at 12% what would have been withdrawn at 24%+ later.
      </p>

      <H3>5. You expect a large pension or rental income in retirement</H3>
      <p>
        <strong>Roth.</strong> Your retirement bracket may exceed your working bracket once pensions, Social Security,
        and rental cash flow stack on top of withdrawals.
      </p>

      <H3>6. Estate planning is a priority</H3>
      <p>
        <strong>Roth.</strong> No RMDs means it can grow untouched for your lifetime, then transfer tax-free to heirs
        (subject to the SECURE Act 10-year drawdown rule for non-spouse beneficiaries).
      </p>

      <H2>The early-withdrawal flexibility advantage</H2>
      <p>
        Roth IRAs have a unique feature: <strong>contributions</strong> (not earnings) can be withdrawn at any time,
        for any reason, without tax or penalty. This makes the Roth a quasi-emergency-fund for younger savers — your
        money isn't locked away the way it is in a 401(k) or Traditional IRA.
      </p>
      <p>
        For someone building both an emergency fund and a retirement balance on a tight income, prioritizing Roth
        contributions can be more efficient than splitting cash into a separate emergency reserve.
      </p>

      <H2>The five-year rules (yes, plural)</H2>
      <p>
        Roth withdrawals come with two distinct five-year clocks people frequently confuse:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Earnings five-year rule:</strong> earnings can't be withdrawn tax-free until five years after your <em>first</em> Roth contribution, even if you're past 59½.</li>
        <li><strong>Conversion five-year rule:</strong> each Roth conversion has its own five-year clock before the converted principal can be withdrawn penalty-free if you're under 59½.</li>
      </ul>
      <p>
        Open even a tiny Roth IRA in your first year of earned income just to start the earnings five-year clock. It
        costs you nothing and removes a constraint decades later.
      </p>

      <H2>Common mistakes that cost real money</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Contributing then exceeding the income limit.</strong> The IRS charges a 6% excise tax per year on excess contributions until you remove them. Watch your AGI, and recharacterize or convert as needed.</li>
        <li><strong>Treating spousal IRAs as the higher earner's.</strong> A non-working spouse can contribute up to the limit based on the working spouse's income — but the account is in the spouse's name.</li>
        <li><strong>Skipping a year because cash is tight in April.</strong> You have until tax-filing deadline (April 15) of the following year to make prior-year contributions.</li>
        <li><strong>Overlooking the Saver's Credit.</strong> Modest-income contributors get up to 50% of their first $2,000 contributed back as a tax credit.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Roth = pay tax now, withdraw tax-free. Traditional = deduct now, pay tax in retirement.',
          'For most people in 22–24% brackets, Roth tends to win on flexibility and post-tax sheltering, even if the after-tax math is even.',
          'High earners in 32%+ brackets should usually take the deduction now and convert in lower-income years later.',
          'Roth contributions (not earnings) are accessible anytime — useful as a backup emergency reserve.',
          'Open a Roth in your first earning year just to start the five-year clock, even with a $100 contribution.',
        ]}
      />

      <p>
        Run your numbers through our <Link href="/finance/fire-calculator" className="text-indigo-600 font-semibold hover:underline">FIRE Calculator</Link> to
        see how a 30-year tax-free vs tax-deferred growth path changes your retirement outcome — the difference is
        often larger than people expect.
      </p>
    </div>
  ),
};
