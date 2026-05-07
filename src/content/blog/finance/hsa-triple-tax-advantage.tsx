import Link from 'next/link';
import type { BlogArticle } from '../types';
import { Lead, H2, H3, Callout, KeyTakeaways } from '../components';

export const hsaTripleTaxAdvantage: BlogArticle = {
  slug: 'hsa-triple-tax-advantage',
  category: 'Retirement',
  title: 'HSA: The Triple-Tax-Advantaged Account Most People Underuse',
  description:
    'Health Savings Accounts are the only account in US tax law with three layers of tax shelter — and most users treat them like checking accounts. Learn the long-term strategy that turns an HSA into the best retirement account you have.',
  publishedDate: '2026-05-08',
  readTime: '13 min read',
  keywords:
    'hsa, health savings account, hdhp, triple tax advantage, hsa investing, retirement healthcare',
  relatedTools: [
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
    { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator' },
    { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Most retirement accounts give you one tax break. The HSA gives you three: tax-deductible contributions,
        tax-free growth, and tax-free withdrawals for medical expenses. There's no other account in US tax
        code that matches this. Yet most HSAs in the country sit in cash earning nothing — used as a checking
        account for copays.
      </Lead>

      <H2>The triple advantage in detail</H2>

      <H3>1. Tax-deductible contribution</H3>
      <p>
        HSA contributions reduce both your federal income tax and FICA tax (the 7.65% Social Security + Medicare
        payroll tax). That FICA savings is uncommon — even traditional 401(k) contributions don't avoid FICA.
      </p>
      <p>
        For a worker in a 24% federal bracket and 5% state bracket, every $1 contributed to an HSA via payroll
        deduction saves about 36.65 cents in immediate tax. A maxed family HSA at $8,300 saves over $3,000 in
        first-year tax.
      </p>

      <H3>2. Tax-free growth</H3>
      <p>
        Once invested, HSA assets compound tax-free — no annual tax drag from dividends or capital gains, no
        deferred tax bill at withdrawal. This is the same as a Roth IRA, but with the added benefit that you got
        the deduction going in.
      </p>

      <H3>3. Tax-free withdrawal (for qualified medical)</H3>
      <p>
        Withdrawals used for qualified medical expenses are tax-free. The list is broad: doctor copays, dental,
        vision, prescriptions, mental health, and many more.
      </p>
      <p>
        Crucially: <strong>there's no time limit on reimbursement</strong>. You can pay a $200 copay in 2026
        with after-tax cash, save the receipt, let the HSA invest and grow for 30 years, and reimburse yourself in
        2056 with the (now much larger) HSA balance — tax-free.
      </p>

      <Callout title="Why this is so powerful" accent="indigo">
        $1 contributed to an HSA at age 30 and invested at 8% real return becomes about $10 at age 60. If you
        spent $1 of medical expenses out-of-pocket at age 30 and reimbursed yourself in 2056, you'd withdraw
        $1 of that $10 — and still have $9 of tax-free assets. The receipt is your "tax-free withdrawal
        ticket."
      </Callout>

      <H2>Eligibility: HDHP only</H2>
      <p>
        You can only contribute to an HSA if you're covered by a High-Deductible Health Plan (HDHP) and have
        no other disqualifying coverage. 2026 HDHP definition:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Minimum deductible: $1,650 single / $3,300 family</li>
        <li>Maximum out-of-pocket: $8,300 single / $16,600 family</li>
        <li>No pre-deductible coverage except preventive care</li>
      </ul>
      <p>
        Disqualifying coverage includes: traditional health plans (PPO, HMO), Medicare, FSA (in most cases), TRICARE,
        VA benefits used in last 3 months, or being claimed as a dependent on someone else's tax return.
      </p>

      <H2>Contribution limits (2026)</H2>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>Self-only coverage:</strong> $4,150</li>
        <li><strong>Family coverage:</strong> $8,300</li>
        <li><strong>Age 55+ catch-up:</strong> additional $1,000 per spouse</li>
      </ul>
      <p>
        Family-coverage limit is per family, not per person. A married couple can split the $8,300 between two
        HSAs but cannot double it. Each spouse 55+ can contribute their own $1,000 catch-up — but it must go in
        their own HSA, not a shared one.
      </p>

      <H2>The optimal HSA strategy: invest, don't spend</H2>
      <p>
        Default behavior — using the HSA debit card to pay every copay — wastes the strategy. Optimal:
      </p>
      <ol className="list-decimal pl-6 space-y-3 my-4">
        <li><strong>Max contributions every year via payroll deduction</strong> for the FICA savings.</li>
        <li><strong>Invest the HSA in low-cost index funds</strong>. Most providers (Fidelity, Lively) offer free investment options.</li>
        <li><strong>Pay current medical expenses out-of-pocket</strong> with after-tax cash from your checking account.</li>
        <li><strong>Save every receipt forever.</strong> Photo, scan, store in cloud — they're worth real money.</li>
        <li><strong>Reimburse yourself decades later</strong>, after the HSA has compounded tax-free.</li>
      </ol>

      <H3>Why this is "legal time travel"</H3>
      <p>
        You're effectively turning a $200 copay paid in 2026 into a $200 tax-free withdrawal in 2056 — and
        the difference between the $200 you paid and the $2,000 your HSA grew to becomes a tax-free retirement
        nest egg. The IRS has explicitly blessed this; it's in the HSA rules.
      </p>

      <Callout title="The receipt rule" accent="amber">
        You don't submit receipts to anyone — just keep them. If the IRS audits an HSA withdrawal years later,
        you produce the receipts then. Many people use a dedicated cloud folder or service like HSA Receipt Vault.
      </Callout>

      <H2>HSA after age 65</H2>
      <p>
        At 65, the HSA changes character:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Withdrawals for non-medical expenses are taxed as ordinary income (no 20% penalty).</li>
        <li>Effectively becomes a Traditional IRA.</li>
        <li>Medicare premiums (Parts B, C, D) are qualified medical expenses — withdraw tax-free to pay them.</li>
        <li>Long-term care premiums up to age-based limits are qualified.</li>
      </ul>
      <p>
        This means the HSA is "worst case" just a Traditional IRA after 65 — but its upside (tax-free
        medical withdrawals, including reimbursing decades-old receipts) makes it superior in practice.
      </p>

      <H2>HSA vs FSA: don't confuse them</H2>
      <p>
        Health FSAs (Flexible Spending Accounts) are a different animal. Key differences:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>FSA:</strong> use-it-or-lose-it (mostly) at year-end. Can't be invested. Tied to employer.</li>
        <li><strong>HSA:</strong> rolls over forever. Can be invested. Portable across employers.</li>
      </ul>
      <p>
        You generally can't have both at the same time. A "Limited Purpose FSA" (dental and vision
        only) is sometimes available alongside an HSA.
      </p>

      <H2>The investment options trap</H2>
      <p>
        Many employer-provided HSA custodians have:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>High investment thresholds (often $1,000–$2,000 must stay in cash)</li>
        <li>High expense ratios on the available funds (1%+)</li>
        <li>Monthly maintenance fees</li>
      </ul>
      <p>
        Solution: <strong>roll your HSA balance to a better custodian periodically.</strong> Fidelity HSA is the
        best-in-class option as of 2026 — no fees, no minimums, full brokerage. You can transfer once a year (or
        more, if your plan allows). Your employer payroll contributions still go to their preferred custodian, but
        you sweep the balance to Fidelity quarterly.
      </p>

      <H2>HSA vs Roth IRA priority</H2>
      <p>
        For someone with both options, HSA edges out Roth IRA in the contribution priority order because of:
      </p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>FICA savings (Roth IRA has no FICA benefit)</li>
        <li>The receipt-banking time-travel trick</li>
        <li>Tax-free spending on Medicare and long-term care later</li>
      </ul>
      <p>
        Standard priority order: capture 401(k) match → max HSA → max Roth IRA → max 401(k) → mega backdoor →
        taxable brokerage.
      </p>

      <H2>Common mistakes</H2>
      <ul className="list-disc pl-6 space-y-3 my-4">
        <li><strong>Using the HSA debit card for current expenses.</strong> Wastes the compounding opportunity.</li>
        <li><strong>Letting all the cash sit uninvested.</strong> Inflation eats it at 3%/year. Invest the portion you don't need short-term.</li>
        <li><strong>Forgetting to enroll in Medicare correctly.</strong> Once enrolled, you can't contribute to an HSA. Stop contributions in the month you turn 65 unless you're delaying Medicare.</li>
        <li><strong>Not consolidating accounts after job changes.</strong> Old employer HSAs accumulate fees. Roll them to Fidelity.</li>
      </ul>

      <KeyTakeaways
        items={[
          'HSA = deductible going in + tax-free growth + tax-free withdrawal for medical = unique triple advantage.',
          'Contribute via payroll for FICA savings. Pay current medical out-of-pocket. Invest the HSA. Reimburse decades later with saved receipts.',
          'Available only with HDHP. 2026 limits: $4,150 single / $8,300 family + $1,000 catch-up at 55+.',
          'After 65, HSA acts like a Traditional IRA for non-medical withdrawals — no 20% penalty, just income tax.',
          'Roll balances to Fidelity HSA periodically — most employer custodians have high fees and limited investments.',
        ]}
      />
    </div>
  ),
};
