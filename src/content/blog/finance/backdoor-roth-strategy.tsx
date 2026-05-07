import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const backdoorRothStrategy: BlogArticle = {
  slug: 'backdoor-roth-strategy',
  category: 'Retirement',
  title: 'Backdoor Roth IRA: The High-Earner Workaround Explained Step-by-Step',
  description:
    'Earn too much for direct Roth contributions? The backdoor Roth lets you contribute anyway — legally. Learn the mechanics, the pro-rata trap, and how to execute without triggering surprise taxes.',
  publishedDate: '2026-05-08',
  readTime: '12 min read',
  keywords:
    'backdoor roth, backdoor roth ira, pro rata rule, non deductible contribution, ira contribution, high earner roth',
  relatedTools: [
    { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Direct Roth IRA contributions phase out at $146k–$161k single, $230k–$240k joint (2026 MAGI). The
        backdoor Roth — a fully legal two-step that takes ~10 minutes — lets you contribute the full $7,000 anyway.
        It's a tax-strategy gift to high earners. Just don't step on the pro-rata landmine.
      </Lead>

      <H2>The two-step</H2>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li>
          <strong>Contribute non-deductible to a Traditional IRA.</strong> Anyone with earned income can do this,
          regardless of income. You don't take the deduction.
        </li>
        <li>
          <strong>Convert that contribution to a Roth IRA.</strong> The conversion of post-tax dollars is a
          non-event tax-wise — you've already paid tax on the money.
        </li>
      </ol>
      <p>
        End state: $7,000 in your Roth IRA, growing tax-free for life, exactly as if you'd been able to
        contribute directly. The IRS has explicitly blessed this. It's not a loophole — it's an
        intentional feature of how the rules interact.
      </p>

      <H2>Step-by-step execution</H2>

      <H3>Step 1: open both accounts at the same broker</H3>
      <p>
        Use Fidelity, Schwab, or Vanguard. Open both a Traditional IRA and a Roth IRA at the same broker — makes
        the conversion a one-click operation.
      </p>

      <H3>Step 2: contribute $7,000 to the Traditional IRA</H3>
      <p>
        Don't check "deductible." If your provider asks, you're making a <em>non-deductible
        contribution</em>.
      </p>

      <H3>Step 3: wait for the cash to settle (1–2 days), then convert</H3>
      <p>
        Convert <em>all</em> the cash from the Traditional IRA to the Roth IRA. Most brokers offer a one-click
        conversion option in the Traditional IRA interface.
      </p>
      <p>
        Some practitioners recommend a 1-day wait, others a 1-week wait. The IRS has not specified a required
        period, and waiting longer just exposes you to tiny gains (which would become taxable on conversion).
      </p>

      <H3>Step 4: invest the Roth IRA</H3>
      <p>
        After conversion, the Roth IRA holds $7,000 cash. Invest it however you want — most savers use a low-cost
        broad-market index fund.
      </p>

      <H3>Step 5: file IRS Form 8606 with your taxes</H3>
      <p>
        This is the required reporting form. It tracks your non-deductible basis to ensure the IRS doesn't
        tax the conversion as if it were pre-tax money. Tax software (TurboTax, FreeTaxUSA) handles this if you
        answer the right questions.
      </p>

      <H2>The pro-rata rule: the trap that catches everyone</H2>
      <p>
        Here's where most backdoor Roths go wrong. The IRS treats <em>all</em> your Traditional, SEP, and
        SIMPLE IRAs as a single pool for tax purposes during a Roth conversion. If <em>any</em> of those have
        pre-tax money, the conversion is partly taxable.
      </p>

      <H3>The math</H3>
      <p>
        Suppose you have:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Old rollover IRA from a 401(k): $93,000 (pre-tax)</li>
        <li>New non-deductible Traditional IRA: $7,000 (post-tax)</li>
        <li>Total IRA pool: $100,000, of which 7% is post-tax basis</li>
      </ul>
      <p>
        If you convert $7,000 to Roth, the IRS treats the conversion as 7% post-tax (non-taxable) and 93%
        pre-tax (taxable). You pay income tax on $6,510 — a surprise tax bill of ~$2,000 at a 32% bracket.
      </p>

      <Callout title="The fix: empty the Traditional IRA pool" accent="amber">
        Either roll your existing pre-tax IRA balances <em>into your 401(k)</em> (most plans accept rollovers
        in), or convert them to Roth in chunks at lower brackets. Once your Traditional/SEP/SIMPLE IRA balance
        is zero on December 31 of the year you do the backdoor, the pro-rata rule has nothing to apply to.
      </Callout>

      <H3>The December 31 snapshot</H3>
      <p>
        The IRS measures your IRA balance on the last day of the year you do the conversion. If you do the
        rollover-into-401(k) on December 30, you're fine. If you do it on January 2, you've missed
        the window. Plan accordingly.
      </p>

      <H2>Spousal backdoor Roth</H2>
      <p>
        A non-working spouse can do a backdoor Roth based on the working spouse's earned income. Pro-rata is
        evaluated separately for each spouse — your IRAs are not pooled with theirs. So one spouse could have
        Traditional IRA balances while the other does a clean backdoor Roth.
      </p>

      <H2>Timing across years</H2>
      <p>
        Each year's contribution gets its own 5-year clock for tax-free principal withdrawal under 59½. But:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Once you're 59½ <em>and</em> have had any Roth IRA for 5+ years, the conversion 5-year clocks become moot.</li>
        <li>Open even a tiny Roth IRA in your first earning year (deposit $100) to start the lifetime 5-year clock as early as possible.</li>
      </ul>

      <H2>Common backdoor Roth mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Pro-rata oversight.</strong> Doing the backdoor while you have a $50k rollover IRA. Surprise tax bill.</li>
        <li><strong>Forgetting Form 8606.</strong> Without it, the IRS treats your conversion as pre-tax. You pay tax twice — once now, once at withdrawal.</li>
        <li><strong>Letting cash sit in the Traditional IRA earning interest.</strong> Even $0.30 of interest before conversion creates a small taxable amount and Form 8606 complications.</li>
        <li><strong>Doing the conversion in the wrong account.</strong> If your broker has a separate "Conversion IRA" or "Rollover IRA," make sure you're converting from the Traditional to the Roth, not creating a new account.</li>
      </ul>

      <H2>The mega backdoor Roth: similar but bigger</H2>
      <p>
        Some 401(k) plans allow after-tax contributions <em>beyond</em> the $23,000 employee deferral limit, with
        in-plan or in-service Roth conversions. This is the
        <Link href="/finance/learn/mega-backdoor-roth" className="text-indigo-600 font-semibold hover:underline"> mega backdoor Roth</Link> — same
        concept at much larger scale. Up to ~$46,000 of additional Roth contribution per year if your plan supports
        it.
      </p>

      <H2>Future legislative risk</H2>
      <p>
        Multiple proposals over the past several years have attempted to close the backdoor Roth. None has passed
        as of 2026. If you can do a backdoor Roth, do it now while the rule still permits — there's little
        downside, and the risk is one-directional (the door could close, but unlikely to open wider).
      </p>

      <H2>Process summary</H2>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li>Empty Traditional/SEP/SIMPLE IRAs (roll to 401(k) if pre-tax) — or skip backdoor if you can't.</li>
        <li>January: contribute $7,000 non-deductible to Traditional IRA.</li>
        <li>Wait 1–7 days for funds to settle.</li>
        <li>Convert all to Roth IRA in one click.</li>
        <li>Invest the Roth.</li>
        <li>File Form 8606 with that year's tax return.</li>
        <li>Verify on December 31 that your Traditional/SEP/SIMPLE IRA balance is zero.</li>
        <li>Repeat next January.</li>
      </ol>

      <KeyTakeaways
        items={[
          'Backdoor Roth = non-deductible Traditional IRA contribution + immediate conversion to Roth. Fully legal, IRS-blessed.',
          'Pro-rata rule pools all your IRAs. Have $100k of pre-tax IRA money? The backdoor will be 93% taxable.',
          'Fix: roll pre-tax IRA balances into your 401(k) before doing the backdoor. December 31 balance must be zero.',
          'File Form 8606 with your taxes. Without it, you\'ll pay tax twice on the same money.',
          'Open even a tiny Roth IRA in your first earning year to start the 5-year clock.',
        ]}
      />
    </div>
  ),
};
