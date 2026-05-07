import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const creditScoreFundamentals: BlogArticle = {
  slug: 'credit-score-fundamentals',
  category: 'Credit',
  title: 'Credit Score Fundamentals: How to Build and Maintain Excellent Credit',
  description:
    'Decode the FICO formula, understand which actions move your score, and learn the small-print habits that take you from 700 to 800+. The score isn\'t random — it\'s deeply mechanical.',
  publishedDate: '2026-05-08',
  readTime: '14 min read',
  keywords:
    'credit score, fico, vantagescore, credit report, credit utilization, payment history, credit building',
  relatedTools: [
    { name: 'EMI Calculator', href: '/finance/emi-calculator' },
    { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Your credit score determines whether you get a mortgage, what interest rate you pay on a car loan, the
        deposit required on a rental, and increasingly even your insurance premiums. It's not arbitrary — it's
        a deterministic function of five inputs you control. Understanding that function is the difference between
        730 and 800+.
      </Lead>

      <H2>FICO vs VantageScore: which one matters</H2>
      <p>
        There are two major scoring systems, both running 300–850, but they weight inputs differently:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>FICO Score:</strong> used in ~90% of US lending decisions. The version you should care about.</li>
        <li><strong>VantageScore:</strong> developed by the three credit bureaus jointly. What free apps like Credit Karma show you. Useful as a directional indicator, but lenders rarely use it.</li>
      </ul>
      <p>
        If your VantageScore on Credit Karma is 750 but your actual FICO when applying for a mortgage is 720, that's
        normal — they're different formulas. The directional movements correlate, so VantageScore monitoring is
        useful even if the absolute number lies.
      </p>

      <Callout title="Free FICO access" accent="indigo">
        Most major credit cards now offer free FICO score access in their mobile app or statements. Discover, Capital
        One, Amex, and Citi all do. If you have one of these, your real FICO is just a click away.
      </Callout>

      <H2>The five FICO factors and their weights</H2>
      <p>
        The published weights for FICO 8 (the most common version):
      </p>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Payment history — 35%.</strong> Have you paid on time, every time? One 30-day late payment can drop your score 60–110 points.</li>
        <li><strong>Amounts owed (utilization) — 30%.</strong> What fraction of your available credit are you using? The single biggest lever you can pull this month.</li>
        <li><strong>Length of credit history — 15%.</strong> How long has your average account been open? Slow to grow, easy to damage by closing old accounts.</li>
        <li><strong>Credit mix — 10%.</strong> Do you have a mix of revolving (cards) and installment (loans, mortgage)? Marginal but real.</li>
        <li><strong>New credit — 10%.</strong> How many recent applications and new accounts? Each hard pull drops you 5–10 points temporarily.</li>
      </ul>

      <H2>The 35% you must never lose</H2>
      <p>
        Payment history is non-negotiable. A single 30-day late payment stays on your report for 7 years, even after
        it's paid. Bankruptcy stays for 10. The damage from one slip is wildly disproportionate to any benefit
        from optimization elsewhere.
      </p>
      <p>
        Practical rules:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Autopay the minimum on every card.</strong> Even if you forget the full balance, autopay-minimum prevents the "late" flag.</li>
        <li><strong>30 days late ≠ 1 day late.</strong> Lenders generally don't report missed payments to the bureaus until you're 30+ days past due. If you realize you're a few days late on the 5th, pay immediately and you're fine.</li>
        <li><strong>Goodwill letters work surprisingly often.</strong> If a single late payment slips through, a polite letter to the lender asking for a goodwill removal is approved 30–50% of the time for otherwise-clean accounts.</li>
      </ul>

      <H2>The utilization lever: 30% of your score, fully controllable</H2>
      <p>
        Credit utilization = (current balance) / (credit limit), measured both per-card and across all your cards
        combined.
      </p>
      <p>
        FICO 8 weights utilization heavily, with rough breakpoints:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>0% utilization: slight ding (looks like an unused account)</li>
        <li>1–9%: optimal range, especially on at least one card</li>
        <li>10–29%: still good</li>
        <li>30–49%: noticeable score drop</li>
        <li>50%+: significant drop</li>
        <li>90%+: large drop</li>
      </ul>

      <H3>The reporting date trick</H3>
      <p>
        Utilization is reported once per month, on the "statement closing date" — not when you pay. If
        you charge $4,000 on a $5,000 limit card, your statement closes at $4,000 utilization (80%) <em>even if you
        pay it off in full before the due date</em>.
      </p>
      <p>
        Three ways to game this:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li><strong>Pay before the statement closes</strong>, not by the due date. Cuts reported utilization to near zero.</li>
        <li><strong>Request a credit limit increase</strong>. Same balance over a higher limit = lower utilization. Most cards allow soft-pull increases every 6 months.</li>
        <li><strong>Use AZEO (All Zero Except One).</strong> Pay all cards to $0 before statement, leave one card at 1–9%. This combination has historically optimized FICO 8.</li>
      </ol>

      <Callout title="When optimization matters" accent="amber">
        Don't bother fine-tuning utilization 12 months a year. Aim for under 10% always, then dial in to 1–9%
        on a single card the month before any major application — mortgage, auto loan, apartment. Score bumps
        from optimization can be worth 10–30 points temporarily.
      </Callout>

      <H2>Length of history: the slow-growing factor</H2>
      <p>
        FICO weighs:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Average age of all accounts (AAoA)</strong></li>
        <li><strong>Age of oldest account</strong></li>
        <li><strong>Age of newest account</strong></li>
      </ul>
      <p>
        Two practical implications:
      </p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li><strong>Never close your oldest credit card.</strong> Closed accounts keep contributing to AAoA for ~10 years, then drop off — when they do, your score takes a one-time hit. Keep the oldest open with a small recurring charge and autopay.</li>
        <li><strong>Authorized user trick for young credit files.</strong> Adding a young person as an authorized user on an old, well-managed family card boosts their AAoA dramatically — useful for a teenager building toward college or a first apartment.</li>
      </ol>

      <H2>The credit-mix factor (10%)</H2>
      <p>
        FICO rewards having both <em>revolving</em> credit (credit cards, lines of credit) and <em>installment</em>
        credit (mortgage, car loan, student loan, personal loan). If you've never had an installment loan, taking
        out a small one and paying it off can add 10–20 points.
      </p>
      <p>
        That said, don't take loans you don't need just to chase points. The cost of interest dwarfs the
        benefit of a marginal score increase for most people.
      </p>

      <H2>Hard inquiries (10%)</H2>
      <p>
        A hard pull happens when you apply for credit. Each one drops your score 5–10 points and stays on your report
        for 2 years (though FICO only counts them for 1 year).
      </p>
      <p>
        Special rules to know:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Mortgage and auto rate-shopping window:</strong> multiple inquiries within ~14–45 days for the same purpose count as one inquiry. Shop around freely in a tight window.</li>
        <li><strong>Soft pulls don't count.</strong> "Pre-approval" offers, your own credit checks, and most card-issuer credit-line increases are soft.</li>
        <li><strong>Hard pulls don't affect long-term score much.</strong> The 5–10 point drop fades within 6–12 months. Don't obsess.</li>
      </ul>

      <H2>The path from 700 to 800+</H2>
      <p>
        If you're already at 700+, the path to 800+ is mechanical:
      </p>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Zero late payments for 24+ months.</strong> The recency of negative marks decays — old missed payments hurt less.</li>
        <li><strong>Keep utilization under 10% always, under 5% before applications.</strong> The single biggest controllable factor.</li>
        <li><strong>Have at least 5+ years of credit history.</strong> If your oldest account is 3 years old, you cannot reach 800+ until time passes. No shortcut.</li>
        <li><strong>Mix of 3+ credit cards and at least one installment loan paid down to zero.</strong></li>
        <li><strong>Don't open new accounts in the 12 months before a major application.</strong></li>
      </ol>

      <H2>Common myths that won't move your score</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>"Carrying a small balance helps."</strong> No. Pay in full every month. The myth comes from confusing "activity" with "balance." Activity helps; balance hurts.</li>
        <li><strong>"Income affects your credit score."</strong> No. FICO doesn't see your income at all. Lenders use income for approval decisions separately.</li>
        <li><strong>"Checking your own score hurts it."</strong> No. Personal checks are soft pulls.</li>
        <li><strong>"Closing a card removes the late payment."</strong> No. Closing changes nothing about historical reporting; the negative mark stays for 7 years either way.</li>
        <li><strong>"Credit-repair services have secrets."</strong> No. Anything they can do, you can do yourself for free, including disputing errors.</li>
      </ul>

      <H2>Disputing errors</H2>
      <p>
        About 1 in 5 credit reports has an error material enough to affect rates. Pull all three bureau reports
        (Equifax, Experian, TransUnion) free at <code>annualcreditreport.com</code>. Look for:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Accounts you don't recognize (possible identity theft)</li>
        <li>Late payments that weren't actually late</li>
        <li>Closed accounts showing as open or vice versa</li>
        <li>Wrong credit limits (which inflates your utilization)</li>
        <li>Old debts past the 7-year reporting limit</li>
      </ul>
      <p>
        Disputes can be filed online at each bureau. Each must respond within 30 days, and the burden of proof is
        on the data furnisher (the lender), not you.
      </p>

      <KeyTakeaways
        items={[
          'Payment history is 35% of your score and the only factor with permanent damage from a single mistake.',
          'Utilization is 30% and fully controllable — keep below 10%, dip to 1–9% before major applications.',
          'Don\'t close your oldest card; length of history is hard to rebuild.',
          'Hard pulls drop you 5–10 points but recover in 6–12 months. Don\'t obsess.',
          'Pull all three bureau reports yearly via annualcreditreport.com — 20% have material errors.',
        ]}
      />
    </div>
  ),
};
