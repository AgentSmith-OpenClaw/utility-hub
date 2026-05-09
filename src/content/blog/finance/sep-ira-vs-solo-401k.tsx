import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways, Comparison } from '../components';

export const sepIraVsSolo401k: BlogArticle = {
  slug: 'sep-ira-vs-solo-401k',
  category: 'Retirement',
  title: 'SEP IRA vs Solo 401(k): The Self-Employed Tax Decision',
  description:
    "If you have self-employment income — even a side gig — you can stash far more for retirement than W-2 employees. SEP IRA and Solo 401(k) both work, but one is dramatically more powerful at most income levels.",
  publishedDate: '2026-05-10',
  readTime: '13 min read',
  keywords:
    'sep ira vs solo 401k, self employed retirement, solo 401k vs sep ira, 1099 retirement plan, freelancer retirement, contractor 401k, sep ira limits 2026',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Self-employment is taxed harder than W-2 work — but it also unlocks retirement plans most employees don&apos;t
        have access to. Choosing between a SEP IRA and a Solo 401(k) is the most consequential retirement decision a
        freelancer makes after deciding to save at all.
      </Lead>

      <H2>Both plans in 30 seconds</H2>
      <Comparison
        leftTitle="SEP IRA"
        left={
          <>
            <p>Simplified Employee Pension. Open at any brokerage in minutes.</p>
            <p className="mt-2">Contribute up to 25% of net self-employment income, max $70,000 (2026).</p>
            <p className="mt-2">Employer-only contributions (no employee deferral).</p>
            <p className="mt-2">No Roth option. No catch-up at 50+.</p>
          </>
        }
        rightTitle="Solo 401(k)"
        right={
          <>
            <p>One-participant 401(k). Slightly more setup paperwork but still trivial.</p>
            <p className="mt-2">Employee deferral up to $23,500 ($31,000 if 50+) PLUS 25% employer share.</p>
            <p className="mt-2">Roth option available (great for lower-income years).</p>
            <p className="mt-2">Allows loans from the plan.</p>
          </>
        }
      />

      <H2>The contribution math</H2>
      <p>
        For self-employed folks, "25% of compensation" means 25% of net self-employment income after deducting half of
        your self-employment tax. The effective rate for sole proprietors works out to about 20% of net Schedule C
        profit.
      </p>
      <p>
        Take a freelance income of $100,000 (after expenses). Net SE earnings ≈ $92,935 after the SE tax adjustment.
        Maximum employer contribution ≈ $18,587.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>SEP IRA total contribution:</strong> $18,587.</li>
        <li><strong>Solo 401(k) total contribution:</strong> $23,500 (employee deferral) + $18,587 (employer) = <strong>$42,087</strong>.</li>
      </ul>
      <p>
        At $100K of self-employment income, the Solo 401(k) lets you stash <em>more than double</em> what a SEP IRA
        does. This gap is the entire reason most CFPs recommend Solo 401(k) for almost everyone.
      </p>

      <Callout title="The break point" accent="indigo">
        SEP IRA only catches up to Solo 401(k) at very high income — roughly $345,000+ where the 25% formula alone
        hits the $70K cap. Below that, Solo 401(k) wins by tens of thousands of dollars in annual contribution capacity.
      </Callout>

      <H2>The Roth angle</H2>
      <p>
        Solo 401(k) lets the employee deferral portion go Roth (after-tax in, tax-free forever). SEP IRA does not — it
        was traditional-only until SECURE 2.0 added a Roth SEP option, but adoption is rare and not all custodians
        support it yet.
      </p>
      <p>
        Roth contributions are particularly powerful for self-employed people whose income is lumpy. In a low-income
        year (early business, sabbatical), Roth contributions are dirt cheap tax-wise; future tax-free withdrawals are
        a huge optionality bonus.
      </p>

      <H2>The deadline difference</H2>
      <p>
        SEP IRAs can be opened <em>and</em> funded by your tax filing deadline (April 15, or October 15 with an
        extension). This is huge for freelancers who don&apos;t do their books until tax season.
      </p>
      <p>
        Solo 401(k) requires you to <em>open</em> the plan by December 31 of the contribution year, but employee
        deferrals can be made through the tax deadline. So if you decide on November 30 that you want to contribute
        for the current tax year, Solo 401(k) is still possible — but you have to open the plan before year-end.
      </p>

      <H2>Practical setup</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>SEP IRA:</strong> open at Vanguard, Fidelity, or Schwab. 10 minutes online. No annual paperwork
          beyond contributions.
        </li>
        <li>
          <strong>Solo 401(k):</strong> Vanguard&apos;s solo 401(k) is the most basic; Fidelity and Schwab now offer
          robust solo 401(k)s with Roth and after-tax options. ETrade&apos;s solo 401(k) is a power user&apos;s favorite.
          Once balance hits $250K, you must file IRS Form 5500-EZ annually (one page, no big deal).
        </li>
      </ul>

      <H2>What about the SIMPLE IRA?</H2>
      <p>
        SIMPLE IRAs are a third option, primarily designed for businesses with employees. For pure self-employed:
        contribution limit is much lower ($16,500 + 25% match in 2026), Roth not standardly available, and the early
        withdrawal penalty is a brutal 25% in the first 2 years (vs 10% normally). SIMPLE IRA almost never beats Solo
        401(k) for a one-person business.
      </p>

      <H2>The "I have W-2 income too" wrinkle</H2>
      <p>
        If you have a day job with a 401(k) where you already maxed your $23,500 employee deferral, your Solo 401(k)
        deferral is reduced or eliminated — you only get one $23,500 employee contribution across all plans. But the
        25% employer side stacks separately, so you can still contribute the employer portion to your Solo 401(k) on top
        of maxing your day-job 401(k).
      </p>
      <p>
        SEP IRA limits don&apos;t interact with your day-job 401(k) at all — you can max the SEP regardless. So when you
        already max a workplace 401(k), the SEP&apos;s simplicity becomes more attractive.
      </p>

      <H2>What about employees?</H2>
      <p>
        The instant you hire an eligible employee (1+ year of service, 1000+ hours), Solo 401(k) eligibility ends and
        you have to convert to a regular small-business 401(k) — much more paperwork. SEP IRA can include employees
        but you must contribute the same percentage to their accounts as to yours. Hiring even one part-time worker
        changes both plans dramatically.
      </p>

      <Callout title="The default recommendation" accent="emerald">
        For most one-person businesses (no employees, &lt;$345K income, want flexibility): <strong>Solo 401(k)</strong> is
        the right answer. Higher contribution capacity, Roth option, plan loans available, no annual paperwork until
        $250K. SEP IRA wins on simplicity if you set it up at the last minute or already max a workplace 401(k).
      </Callout>

      <H2>Backdoor Roth IRA still works alongside both</H2>
      <p>
        Both SEP IRA and Solo 401(k) participants can still do a backdoor Roth IRA — the workaround for high earners
        to fund a Roth IRA when income exceeds direct contribution limits. SEP IRA balances trigger the pro-rata rule
        on the conversion (bad), while Solo 401(k) balances do not (good). One more reason Solo 401(k) wins for
        sophisticated planning.
      </p>

      <KeyTakeaways
        items={[
          'Solo 401(k) lets you contribute employee + employer share — usually 2× SEP IRA at incomes under $345K.',
          'Solo 401(k) supports Roth contributions; SEP IRA largely does not (in practice).',
          'SEP IRA can be opened up to the tax deadline; Solo 401(k) plan must be open by Dec 31.',
          'Solo 401(k) does not trigger the backdoor-Roth pro-rata rule; SEP IRA does.',
          'Default to Solo 401(k) unless you specifically want SEP IRA simplicity at very high income or last-minute setup.',
        ]}
      />
    </div>
  ),
};
