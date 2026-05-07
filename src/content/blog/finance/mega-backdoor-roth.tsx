import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const megaBackdoorRoth: BlogArticle = {
  slug: 'mega-backdoor-roth',
  category: 'Retirement',
  title: 'Mega Backdoor Roth: The $46,000 Tax Shelter Most Workers Don\'t Know About',
  description:
    'If your 401(k) plan supports after-tax contributions and in-service conversions, you can shelter up to $46,000 of additional money in a Roth — every year. Learn the requirements, the steps, and how to lobby HR if your plan doesn\'t support it yet.',
  publishedDate: '2026-05-08',
  readTime: '11 min read',
  keywords:
    'mega backdoor roth, after tax 401k, in service conversion, 415 limit, 401k roth conversion, high earner retirement',
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Standard 401(k) contribution limit: $23,000 (2026). The actual IRS-mandated limit on combined employee +
        employer + after-tax contributions: $69,000. The gap — up to $46,000 — is the mega backdoor Roth, a tool
        that turns the 401(k) into the largest available Roth shelter for high earners. Few plans support it.
        Of the ones that do, most participants don't use it.
      </Lead>

      <H2>The contribution limits, demystified</H2>
      <p>
        The IRS sets two separate 401(k) caps:
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Section 402(g) elective deferral limit: $23,000 (2026).</strong> This is what most people mean by "the 401(k) max." It's your pre-tax + Roth contributions combined.</li>
        <li><strong>Section 415(c) total contribution limit: $69,000 (2026).</strong> This is the cap on everything that goes into the plan — your contributions plus employer match plus after-tax contributions.</li>
      </ul>
      <p>
        The gap between $23k and $69k is potentially $46k of additional contribution room. After subtracting your
        employer match (say, $5k), you have $41k of room for "after-tax" contributions — which can then
        be converted to Roth.
      </p>

      <Callout title="The 50+ catch-up" accent="indigo">
        At 50+, the 402(g) limit increases by $7,500 — but the 415(c) total stays at $69k. So the mega backdoor
        room actually <em>shrinks</em> by $7,500 if you're using the catch-up. Plan accordingly.
      </Callout>

      <H2>The two requirements your plan must support</H2>

      <H3>1. After-tax contributions (different from Roth contributions)</H3>
      <p>
        After-tax contributions go in with money you've already paid tax on (like Roth). But unlike Roth,
        the <em>earnings</em> on after-tax money are taxed as ordinary income at withdrawal — UNLESS you convert
        them to Roth.
      </p>

      <H3>2. In-service Roth conversion or distribution</H3>
      <p>
        Without this, after-tax money is stuck. The plan must allow either:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>In-plan Roth conversion:</strong> after-tax balance converted to Roth 401(k) within the plan.</li>
        <li><strong>In-service distribution:</strong> after-tax balance rolled out to a Roth IRA while still employed.</li>
      </ul>
      <p>
        Either works — the goal is to move after-tax dollars into a Roth wrapper before they accrue taxable
        earnings.
      </p>

      <H2>How to find out if your plan supports it</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Read the Summary Plan Description (SPD).</strong> Look for "after-tax contributions" (not "Roth contributions" — different thing).</li>
        <li><strong>Check the contribution election form.</strong> If you can elect a Roth contribution and an "after-tax" contribution as separate categories, your plan likely supports it.</li>
        <li><strong>Call your plan administrator.</strong> Ask specifically: "Does my plan allow after-tax contributions, and can I do in-plan Roth conversions or in-service distributions of those contributions?"</li>
        <li><strong>Look at plan documents in detail.</strong> The legalese will say "non-Roth after-tax contributions" or similar.</li>
      </ol>
      <p>
        If your plan doesn't support it: lobby HR. Plans can be amended to add this feature; it's
        usually free for the employer.
      </p>

      <H2>The optimal execution flow</H2>

      <H3>Step 1: Max your regular 402(g) contribution</H3>
      <p>
        $23,000 in either pre-tax or Roth (your choice based on bracket). You almost always max this first because
        it captures any employer match.
      </p>

      <H3>Step 2: Calculate your after-tax contribution room</H3>
      <p>
        $69,000 total - $23,000 your deferral - employer match = available after-tax room. Set this as your
        after-tax contribution percentage. On a $200k salary with $5k match, you have $41k of after-tax room,
        which is 20.5% of salary.
      </p>

      <H3>Step 3: Set up automatic in-plan conversions</H3>
      <p>
        The most efficient setup is automatic conversion at the time of contribution — every paycheck, your
        after-tax contribution converts to Roth instantly. This minimizes accrued earnings (which would be
        taxable on conversion).
      </p>
      <p>
        Plans that support this automation: Microsoft, Google, Meta, many other tech employers. Plans without
        automation: you'll need to call quarterly or annually to convert manually. Some accrued earnings
        will be taxable in the conversion year.
      </p>

      <H3>Step 4: Decide between in-plan Roth 401(k) or rollout to Roth IRA</H3>
      <p>
        Both work. Considerations:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>In-plan Roth 401(k):</strong> stays in the plan's investment menu (might be limited). Required Minimum Distributions (RMDs) at 73 — though SECURE 2.0 eliminated RMDs on Roth 401(k)s starting 2024.</li>
        <li><strong>Rollout to Roth IRA:</strong> more investment options, no RMDs ever. The cleaner long-term home for the money.</li>
      </ul>
      <p>
        For most savers, rolling to a Roth IRA when allowed is the cleaner option.
      </p>

      <H2>The math, made concrete</H2>
      <p>
        Software engineer at a supportive employer earns $250k. Maxes 402(g) at $23k. Employer matches $10k.
        Available 415(c) room: $69k - $23k - $10k = $36k. Contributes $36k after-tax annually, converts to Roth
        immediately.
      </p>
      <p>
        Over a 10-year career at this employer, that's $360k of additional Roth contributions, plus growth.
        At 8% real return, $360k of contributions over 10 years grows to ~$520k by year 10. After another 25
        years of compounding (accumulating tax-free), it becomes ~$3.5 million tax-free in retirement.
      </p>

      <H2>The pitfalls</H2>

      <H3>1. Highly compensated employee (HCE) testing</H3>
      <p>
        Plans must satisfy non-discrimination tests on after-tax contributions (ACP test). If too few non-HCEs
        participate, the plan may have to refund HCE after-tax contributions in March/April — taxable event.
        Plans with strong "Safe Harbor" design avoid this.
      </p>

      <H3>2. Plan caps</H3>
      <p>
        Some plans cap after-tax contributions at a percentage of salary (often 6–10%) below the 415(c) limit.
        Read the plan rules carefully.
      </p>

      <H3>3. Cash flow</H3>
      <p>
        $36k in after-tax contributions out of after-tax salary requires substantial spare cash. Most workers
        making the math work have already maxed everything else and have a lifestyle below their means. Don't
        max the mega backdoor at the expense of an emergency fund or HSA contributions.
      </p>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Confusing after-tax with Roth.</strong> Different categories. Many workers select "Roth" thinking it's the mega backdoor — it's not, it's the regular Roth 401(k) within the $23k cap.</li>
        <li><strong>Skipping in-service conversion.</strong> After-tax dollars without conversion are the worst of both worlds: taxed at contribution and taxed on growth.</li>
        <li><strong>Letting earnings accrue between contribution and conversion.</strong> Each dollar of accrued earnings becomes taxable on conversion. Convert immediately, ideally automated.</li>
        <li><strong>Stopping at the 402(g) max.</strong> If your plan supports the mega backdoor and you have the cash flow, this is the largest tax shelter available to most workers.</li>
      </ul>

      <H2>If your plan doesn't support it</H2>
      <p>
        Lobby HR. The features cost the employer little to enable. Many tech companies adopted this in the
        2010s after employee pressure. If you work at a smaller employer, suggest they review the SECURE Act 2.0
        provisions which made several mega backdoor mechanics easier.
      </p>
      <p>
        If lobbying fails: the regular <Link href="/finance/learn/backdoor-roth-strategy" className="text-indigo-600 font-semibold hover:underline">backdoor
        Roth IRA</Link> still gives you $7k/year. Combined with $23k 402(g) deferrals, that's $30k/year of Roth
        space available without the mega backdoor — still meaningful.
      </p>

      <KeyTakeaways
        items={[
          'IRS allows up to $69k total annual 401(k) contributions (2026); the gap above your $23k deferral and employer match is potentially $46k of mega backdoor room.',
          'Two requirements: plan must allow after-tax contributions AND in-service Roth conversions or distributions.',
          'Convert immediately to avoid taxable earnings accruing in the after-tax bucket. Automate if possible.',
          'Best used after maxing 402(g), HSA, and Roth IRA. Requires substantial spare cash flow.',
          'Not the same as Roth 401(k). Read your plan document carefully — many workers conflate the two.',
        ]}
      />
    </div>
  ),
};
