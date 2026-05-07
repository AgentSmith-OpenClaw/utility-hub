import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Callout, KeyTakeaways } from '../components';

export const fourOhOneKEmployerMatchStrategy: BlogArticle = {
  slug: '401k-employer-match-strategy',
  category: 'Retirement',
  title: '401(k) Employer Match: The Free Money Most People Leave on the Table',
  description:
    'Decode 401(k) match formulas, understand vesting cliffs, and build a contribution strategy that captures every employer dollar — including the per-paycheck timing trap that costs people thousands.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    '401k match, employer match, vesting schedule, 401k strategy, retirement contribution, true up, safe harbor 401k',
  relatedTools: [
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Employer 401(k) matches are the only investment in personal finance with a guaranteed 50–100% return on day
        one. Yet roughly 1 in 5 employees with access to a match doesn't contribute enough to capture all of it.
        Worse, even diligent contributors can lose match dollars through a quirk in payroll timing.
      </Lead>

      <H2>What "match" actually means</H2>
      <p>
        An employer match is the company contributing additional money to your 401(k) based on what you contribute.
        The formula is what matters. Three common structures:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>Dollar-for-dollar up to X%.</strong> "100% of your first 4% of salary." Contribute 4%, get
          4% from the company. Max free money: 4% of salary per year.
        </li>
        <li>
          <strong>Partial match up to X%.</strong> "50% of your first 6%." Contribute 6%, get 3% from the
          company. Max free money: 3% of salary per year.
        </li>
        <li>
          <strong>Tiered or stretched match.</strong> "100% of first 3%, 50% of next 2%." Encourages a
          higher contribution rate. Max free money here: 4% of salary if you contribute at least 5%.
        </li>
      </ul>

      <Callout title="Why employers stretch matches" accent="indigo">
        A "100% of first 6%" formula and a "50% of first 12%" formula cost the employer the same
        — 6% of your salary. But the second one nudges you to save 12% of your salary instead of 6%. Companies use
        this structure to improve workforce retirement readiness without changing their cost.
      </Callout>

      <H2>Vesting: the catch on the catch</H2>
      <p>
        Match dollars don't fully belong to you the day they hit the account. Most plans have a <strong>vesting
        schedule</strong> that determines what fraction is actually yours when you leave. Three common patterns:
      </p>

      <ul className="list-disc pl-6 space-y-3 my-4">
        <li>
          <strong>Immediate.</strong> 100% yours on day one. The gold standard, mandatory for "Safe Harbor"
          plans. Increasingly common at competitive employers.
        </li>
        <li>
          <strong>Cliff vesting (often 3 years).</strong> 0% vested for 2 years, 100% vested at 3 years. Walk away at
          2 years, 11 months — you forfeit every dollar of match.
        </li>
        <li>
          <strong>Graded vesting (often 6 years).</strong> Typically 20% per year starting in year 2, fully vested at
          year 6.
        </li>
      </ul>

      <p>
        Your <em>own</em> contributions are always 100% yours immediately — vesting schedules apply only to employer
        money. Find your plan's schedule in the Summary Plan Description (SPD).
      </p>

      <H2>The job-change calculation</H2>
      <p>
        When you're considering switching jobs, value your unvested match like a delayed signing bonus from your
        next employer. If you're 11 months from a 3-year cliff with $25,000 unvested, that's real money —
        either negotiate a sign-on bonus to cover it, or time your exit accordingly. Recruiters routinely treat this
        as a negotiable line item.
      </p>

      <H2>The per-paycheck timing trap</H2>
      <p>
        Here's the mistake that costs high-savers the most: <strong>front-loading your 401(k)</strong> can forfeit
        match dollars if your employer doesn't offer a "true-up."
      </p>
      <p>
        The IRS contribution limit is annual ($23,000 in 2026), but most employer matches are calculated <em>per
        paycheck</em>. If you max out your contribution by July, you stop contributing for the rest of the year — and
        without a true-up, the match stops too.
      </p>

      <H3>Concrete example</H3>
      <p>
        Salary $200,000. Match: 100% of first 5% per paycheck, capped at $10,000/year. You contribute 25% of every
        paycheck and hit the $23,000 limit by paycheck 14 of 26.
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Paychecks 1–14: contributed enough to get 5% match each. Match earned: ~$5,400.</li>
        <li>Paychecks 15–26: $0 contribution → $0 match. <strong>Forfeited match: ~$4,600.</strong></li>
      </ul>

      <H3>How to avoid it</H3>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Check your plan for a true-up provision.</strong> A true-up reconciles your match at year-end and tops up the missed dollars. Roughly half of plans have it.</li>
        <li><strong>Without true-up, spread contributions evenly.</strong> Set your % so you hit $23,000 right at the last paycheck of the year, not earlier.</li>
        <li><strong>If you change jobs mid-year, ask the new employer about how their match calculation handles partial-year contributions.</strong></li>
      </ul>

      <ToolCTA
        href="/finance/us-paycheck-calculator"
        label="Model Your Paycheck"
        hint="See how 401(k) contribution percentages affect take-home pay and match capture."
        accent="indigo"
      />

      <H2>Roth 401(k) vs Traditional 401(k)</H2>
      <p>
        Most plans now offer both. The <em>match</em> always goes to the Traditional bucket (taxable on withdrawal,
        per IRS rules). Your contribution choice between Roth and Traditional follows the same logic as the
        <Link href="/finance/learn/roth-vs-traditional-ira" className="text-indigo-600 font-semibold hover:underline"> Roth vs Traditional IRA decision</Link>:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Lower brackets, expecting growth → Roth.</li>
        <li>Peak-earning years, expecting lower retirement income → Traditional.</li>
        <li>Uncertain → split.</li>
      </ul>
      <p>
        Note: $23,000 of Roth 401(k) contributions shelters more total wealth than $23,000 of Traditional, because
        Roth dollars are post-tax. High earners who can afford the extra tax bite often prefer Roth for this
        asymmetric upside.
      </p>

      <H2>The contribution priority order</H2>
      <p>
        Once you have an emergency fund and high-interest debt under control, the standard prioritization for
        retirement contributions is:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li><strong>401(k) up to the full match.</strong> 50–100% guaranteed return — nothing beats it.</li>
        <li><strong>HSA if eligible (HDHP).</strong> Triple tax-advantaged.</li>
        <li><strong>Roth IRA up to limit ($7,000).</strong> More investment options, simpler tax treatment.</li>
        <li><strong>Back to 401(k) up to limit ($23,000).</strong> Larger total shelter, often with employer-match true-up.</li>
        <li><strong>Mega backdoor Roth if available.</strong> Up to ~$46,000 additional shelter.</li>
        <li><strong>Taxable brokerage.</strong> Unlimited, with tax efficiency from index funds.</li>
      </ol>

      <H2>Special cases: what most articles miss</H2>

      <H3>Roth match (new in 2024+)</H3>
      <p>
        SECURE Act 2.0 allows employers to offer match dollars as Roth — taxable to you in the year contributed,
        but tax-free in retirement. Few plans have implemented this yet, but it's worth asking HR. For high-bracket
        savers planning to retire in a similar bracket, this can be a meaningful win.
      </p>

      <H3>Highly compensated employee (HCE) limits</H3>
      <p>
        If your plan fails non-discrimination testing, HCEs (employees earning over ~$155k) can be forced to take
        contributions back as taxable income. Plans with Safe Harbor design avoid this entirely; non-Safe Harbor
        plans may surprise you in March or April.
      </p>

      <H3>After-tax contributions and the mega backdoor</H3>
      <p>
        Some plans allow after-tax contributions <em>beyond</em> the $23,000 employee limit, up to a total
        $69,000 cap (2026, employee + employer combined). With in-service Roth conversions, this becomes the
        <Link href="/finance/learn/mega-backdoor-roth" className="text-indigo-600 font-semibold hover:underline"> mega backdoor Roth</Link> — the
        biggest legal Roth shelter available.
      </p>

      <H2>Common mistakes that cost real dollars</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Auto-enroll default rate (often 3%) that's below the match maximum.</strong> Always check what % gets the full match and adjust up.</li>
        <li><strong>Contributing 100% to company stock.</strong> Concentration risk — your salary already depends on the company. Diversify within the plan.</li>
        <li><strong>Forgetting a 401(k) at an old employer.</strong> Roll it to your IRA or new 401(k) within a year. Old plans tend to have higher fees and worse fund options.</li>
        <li><strong>Cashing out at job change.</strong> 10% penalty + ordinary income tax + decades of lost compounding. Always roll instead.</li>
      </ul>

      <KeyTakeaways
        items={[
          'Capture every dollar of employer match before doing anything else with retirement money — it\'s a guaranteed 50–100% return.',
          'Without a true-up provision, hitting the 401(k) max early in the year forfeits later-paycheck match dollars.',
          'Vesting schedules can mean walking away from tens of thousands. Know your cliff before quitting.',
          'Match dollars always go to Traditional (pre-tax) regardless of whether your contributions are Roth or Traditional.',
          'After capturing the match, the optimal order is HSA → Roth IRA → 401(k) max → mega backdoor → taxable.',
        ]}
      />
    </div>
  ),
};
