import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Callout, Comparison, KeyTakeaways } from '../components';

export const studentLoanRefinanceDecision: BlogArticle = {
  slug: 'student-loan-refinance-decision',
  category: 'Loans',
  title: 'Student Loan Refinance: When It Pays Off (and When It Doesn\'t)',
  description:
    'Refinancing student loans can save tens of thousands — or cost you valuable federal protections forever. The decision framework, the numbers, and the questions to ask before you sign.',
  publishedDate: '2026-05-11',
  readTime: '11 min read',
  keywords: 'student loan refinance, refinance student loans, federal student loans, private student loans, sofi earnest, pslf, income driven repayment',
  relatedTools: [
    { name: 'Student Loan Calculator', href: '/finance/student-loan-calculator' },
    { name: 'Investment Calculator', href: '/finance/investment-calculator' },
    { name: 'Net Worth Calculator', href: '/finance/net-worth-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        Refinancing a student loan can lower your interest rate, shrink your monthly payment, and shave years off
        your payoff timeline. It can also strip away every federal protection you have — for good. There&apos;s no
        going back. The decision deserves more than a slick lender ad.
      </Lead>

      <H2>Federal vs private: completely different worlds</H2>
      <p>
        Before talking refinancing, understand which type of loan you have:
      </p>
      <Comparison
        leftTitle="Federal (US Direct, FFEL, Perkins)"
        left={<p>Government-backed. Includes income-driven repayment, forbearance, PSLF, death/disability discharge, and protections during economic hardship.</p>}
        rightTitle="Private (SoFi, Earnest, banks)"
        right={<p>Bank loans with no federal protections. Standard amortization, credit-based interest rates, and no forgiveness or income-driven options.</p>}
      />
      <p>
        Refinancing federal loans into a private loan <strong>permanently forfeits</strong> all federal benefits.
        This is one of the most consequential financial decisions a young borrower can make — and most don&apos;t
        understand what they&apos;re giving up.
      </p>

      <ToolCTA
        href="/finance/student-loan-calculator"
        label="Open the Student Loan Calculator"
        hint="Compare standard payoff vs extra payments vs refinance scenarios side-by-side."
        accent="blue"
      />

      <H2>What you give up by refinancing federal loans</H2>
      <ol className="space-y-2">
        <li>
          <strong>Income-Driven Repayment (IDR)</strong> — caps your monthly payment at 5–20% of discretionary
          income. Critical safety net if income drops.
        </li>
        <li>
          <strong>Public Service Loan Forgiveness (PSLF)</strong> — full balance forgiven tax-free after 120 qualifying
          payments while working for a government or qualifying nonprofit.
        </li>
        <li>
          <strong>Forgiveness after 20–25 years on IDR</strong> — remaining balance forgiven, currently tax-free
          through 2025 (and proposed extensions).
        </li>
        <li>
          <strong>Forbearance and deferment</strong> — pause payments during economic hardship without
          credit damage.
        </li>
        <li>
          <strong>Death and disability discharge</strong> — federal loans wiped out if borrower dies or becomes
          permanently disabled. Private loans usually still owed by estate or co-signer.
        </li>
      </ol>

      <H2>When refinancing federal loans makes sense</H2>
      <p>
        For a small subset of borrowers, refinancing federal loans is the right call. The criteria are strict:
      </p>
      <ul>
        <li><strong>High, stable income</strong> (typically $80k+) — you&apos;ll never need IDR.</li>
        <li><strong>No PSLF eligibility</strong> — you don&apos;t work in qualifying public service and won&apos;t.</li>
        <li><strong>Strong credit (740+) and low DTI</strong> — qualifies you for the best rates.</li>
        <li><strong>Loan rate &gt; 6%</strong> — refinancing materially drops your rate (1%+ savings minimum).</li>
        <li><strong>Emergency fund + job security</strong> — can survive 6+ months of unemployment without forbearance.</li>
      </ul>

      <Callout accent="amber">
        <strong>The reversibility test:</strong> can you afford to be wrong? If you refinance and then need IDR
        five years later because of disability or job loss, you&apos;re stuck. Federal protections only exist if you
        keep federal loans.
      </Callout>

      <H2>When refinancing private loans is almost always smart</H2>
      <p>
        Private loans have no federal protections to lose, so the decision is purely about rate:
      </p>
      <ul>
        <li>If you can drop your rate by 1%+ and have credit ≥720, refinance.</li>
        <li>Watch for variable-rate offers — they look cheap today but can reset higher.</li>
        <li>Multiple soft pull pre-quotes (SoFi, Earnest, Splash, Credible) won&apos;t hurt your credit; choose the best.</li>
      </ul>

      <H2>The math: how much does refinancing save?</H2>
      <p>
        On a $35,000 balance at 6.5% over 10 years with $400/month payments, here&apos;s how the scenarios stack up:
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Scenario</th><th className="text-left p-3 font-semibold">Payoff time</th><th className="text-left p-3 font-semibold">Total interest</th><th className="text-left p-3 font-semibold">Savings vs baseline</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Standard 6.5% / $400 monthly</td><td className="p-3 font-mono">11 years</td><td className="p-3 font-mono">$13,200</td><td className="p-3 text-gray-600">Baseline scenario.</td></tr>
            <tr><td className="p-3">+ $100/month extra</td><td className="p-3 font-mono">8 years</td><td className="p-3 font-mono">$9,400</td><td className="p-3 text-emerald-700">3 years, $3,800 saved</td></tr>
            <tr><td className="p-3">Refinance to 4.5% / $400 monthly</td><td className="p-3 font-mono">9 years</td><td className="p-3 font-mono">$7,800</td><td className="p-3 text-emerald-700">2 years, $5,400 saved</td></tr>
            <tr><td className="p-3 font-semibold">Refinance + $100/month extra</td><td className="p-3 font-mono">7 years</td><td className="p-3 font-mono">$5,700</td><td className="p-3 text-emerald-700 font-semibold">4 years, $7,500 saved</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        The combination of refinancing and extra payments compounds — refinancing reduces interest each month, and
        extra payments wipe out principal faster. If you can do both, do both.
      </p>

      <H2>Should you pay off student loans or invest?</H2>
      <p>
        A common dilemma when you have spare cash flow:
      </p>
      <ul>
        <li><strong>Loan rate &lt; 5%:</strong> usually invest. Long-term S&P 500 returns of 7-10% beat the loan rate.</li>
        <li><strong>Loan rate 5–7%:</strong> personal preference. Investing has higher expected return; payoff is guaranteed.</li>
        <li><strong>Loan rate &gt; 7%:</strong> usually pay off the loan. Guaranteed return beats most investment risk.</li>
      </ul>
      <p>
        That math ignores the psychological effect — many people sleep better with no debt and lower investment
        balances. There&apos;s no objectively wrong answer if your debt rate is 5–7%.
      </p>

      <H2>The international view</H2>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Country</th><th className="text-left p-3 font-semibold">System</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">🇺🇸 United States</td><td className="p-3">Mix of federal + private</td><td className="p-3 text-gray-600">Refinance landscape mature; IDR + PSLF complex but valuable.</td></tr>
            <tr><td className="p-3">🇬🇧 United Kingdom</td><td className="p-3">Plan 1, 2, 4, 5 (income-contingent)</td><td className="p-3 text-gray-600">Many never repay in full; don&apos;t refinance to private.</td></tr>
            <tr><td className="p-3">🇦🇺 Australia</td><td className="p-3">HECS-HELP (income-contingent)</td><td className="p-3 text-gray-600">Indexed to inflation; voluntary repayment efficient when rates favor it.</td></tr>
            <tr><td className="p-3">🇨🇦 Canada</td><td className="p-3">Federal CSL + provincial</td><td className="p-3 text-gray-600">Repayment Assistance Plan available; private refinance market less mature.</td></tr>
          </tbody>
        </table>
      </div>

      <KeyTakeaways
        items={[
          'Refinancing federal loans into private permanently forfeits IDR, PSLF, forbearance, and discharge.',
          'Only refinance federal loans if you have stable high income, no PSLF eligibility, and credit 740+.',
          'Refinancing private loans is almost always smart if you can drop the rate by 1%+.',
          'On a $35k loan, refinance + extra payments can save $7,500+ vs standard.',
          'For loan rates above 7%, pay off the loan; below 5%, prioritize investing; 5–7% is personal preference.',
          'UK Plan 2 borrowers should generally NOT refinance — most never repay in full.',
        ]}
      />
    </div>
  ),
};
