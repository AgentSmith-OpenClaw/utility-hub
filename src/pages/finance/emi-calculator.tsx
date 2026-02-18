import Head from 'next/head';
import Link from 'next/link';
import EMICalculator from '../../components/EMICalculator/EMICalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function EMICalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/emi-calculator');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much EMI is safe for my income?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A safe EMI depends on your take-home income, existing commitments, and emergency buffer. Most experts suggest keeping total EMIs within 40-50% of net income, but your personal comfort zone may be lower. Test different scenarios in the calculator and ensure you have breathing room for unexpected expenses.',
        },
      },
      {
        '@type': 'Question',
        name: 'Should I prepay loan or invest the surplus?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use a balanced approach. If your loan rate is high or you want guaranteed savings, prepayment works well. If cashflow is stable and you are disciplined, investing part of surplus for long-term growth makes sense. The right mix depends on your risk tolerance and consistency.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is better: reduce EMI or reduce tenure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Reduce tenure usually saves more interest and makes you debt-free faster. Reduce EMI gives monthly cashflow relief. Your choice depends on income stability and whether you can maintain prepayment discipline. Use the calculator to compare both strategies.',
        },
      },
      {
        '@type': 'Question',
        name: 'When should I refinance my loan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Refinance when market rates drop materially, your credit score improves, or existing terms are restrictive. Calculate total switching cost versus projected savings. Don\'t switch only for marketing headlines - run the numbers first.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do EMI and total interest both matter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'EMI shows monthly burden; total interest shows lifetime cost. A comfortable EMI can hide expensive long-term repayment if tenure is stretched too much. You need both metrics to make a complete decision.',
        },
      },
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EMI Calculator',
    url: 'https://utilityhub.app/finance/emi-calculator',
    description: 'Free advanced EMI calculator with prepayment simulation, amortization schedule, and tenure vs EMI comparison for home loans, car loans, and personal loans.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <Head>
        <title>EMI Calculator: Plan Loan Repayment with Prepayment Strategy - Toolisk</title>
        <meta
          name="description"
          content="Calculate EMI for home loan, car loan, or personal loan. Compare prepayment strategies, see amortization schedule, and plan loan repayment with realistic assumptions."
        />
        <meta
          name="keywords"
          content="EMI calculator, home loan EMI, car loan calculator, personal loan EMI, prepayment strategy, loan amortization, reduce EMI vs reduce tenure"
        />
        <link rel="canonical" href={`${SITE_URL}/finance/emi-calculator`} />
        <meta property="og:title" content="EMI Calculator: Plan Loan Repayment with Prepayment Strategy" />
        <meta
          property="og:description"
          content="Free EMI calculator with prepayment impact analysis. Compare reduce EMI vs reduce tenure strategies and see full amortization schedule."
        />
        <meta property="og:url" content={`${SITE_URL}/finance/emi-calculator`} />
        <meta property="og:type" content="article" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }}
        />
      </Head>

      <EMICalculator />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Lead */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">Plan Your Loan Without Guesswork</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
            Most borrowers only look at the monthly EMI — missing total interest, cashflow stress, and prepayment impact. A weak EMI plan means the loan controls your life. A clear one means you control the loan.
          </p>
        </div>

        {/* Affordability Rule */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">💡 Start with Affordability, Not Eligibility</h2>
          <p className="text-slate-500 mb-6">Banks approve loans based on their risk — your comfort is a separate calculation.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: '🏠', label: 'Use take-home pay', desc: 'Base your EMI plan on net income, not gross CTC.' },
              { icon: '🛡️', label: 'Keep an emergency buffer', desc: 'Finalize EMI only after reserving 3–6 months of expenses.' },
              { icon: '🔗', label: 'Look at total debt load', desc: 'Optimize total EMI burden, not each loan in isolation.' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-slate-800 mb-1">{c.label}</div>
                <p className="text-sm text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-sm leading-relaxed">
              <strong>Rule of thumb:</strong> Keep total EMIs under 40–50% of take-home pay. If your income fluctuates (commissions, business), model on your <em>normal</em> month — not your best.
            </p>
          </div>
        </section>

        {/* Tenure choice */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📅 Tenure Choice: Lower EMI vs Less Interest</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-blue-600 font-bold text-sm uppercase tracking-wide mb-2">Long Tenure</div>
              <div className="text-slate-800 font-semibold text-lg mb-2">Lower monthly EMI</div>
              <p className="text-sm text-slate-500">Monthly cashflow is comfortable, but total interest balloons significantly over the extended period. Good if income is variable or other obligations are high.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-emerald-600 font-bold text-sm uppercase tracking-wide mb-2">Short Tenure</div>
              <div className="text-slate-800 font-semibold text-lg mb-2">Maximum interest savings</div>
              <p className="text-sm text-slate-500">Higher monthly pressure, but you save lakhs in interest and become debt-free faster. Best when income is stable and other commitments are low.</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-4 pl-1">An overly tight EMI that forces credit card use during emergencies defeats the purpose of "saving" on interest.</p>
        </section>

        {/* Prepayment */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">⚡ Prepayment: Reduce EMI or Reduce Tenure?</h2>
          <p className="text-slate-500 mb-6">When you prepay, your lender typically offers two paths. Here's how they compare:</p>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-6">
              <div className="font-bold text-emerald-800 mb-1">✅ Reduce Tenure (Recommended)</div>
              <p className="text-sm text-emerald-900">Keep same EMI, but become debt-free years earlier. Saves the most total interest. Best when cashflow is stable.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="font-bold text-slate-700 mb-1">🔄 Reduce EMI</div>
              <p className="text-sm text-slate-500">Lower monthly burden, but same tenure = more interest paid overall. Good when you need cashflow relief for other goals.</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-blue-900 text-sm"><strong>Pro tip:</strong> In high-income years, reduce tenure. In tight years, reduce EMI. You can switch strategies across prepayment events — stay flexible.</p>
          </div>
        </section>

        {/* Hidden costs */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🔍 Lender Terms That Quietly Raise Your Cost</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Processing & legal fees', desc: 'Upfront charges that add 0.5–1% to your effective loan cost. Compare net disbursement, not just interest rate.' },
              { label: 'Insurance bundling', desc: 'Many lenders push insurance products at disbursement. These are usually optional — and rarely the best deal.' },
              { label: 'Prepayment restrictions', desc: 'Fixed-rate loans often have limits or penalties on part-payment. Verify before committing if prepayment is your strategy.' },
              { label: 'Rate reset clauses', desc: 'Floating rate loans reset periodically. Understand how your EMI or tenure adjusts when the benchmark rate changes.' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex gap-3">
                <div className="w-2 rounded-full bg-red-400 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">{c.label}</div>
                  <p className="text-sm text-slate-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🚫 Common EMI Mistakes</h2>
          <div className="space-y-3">
            {[
              { n: '01', t: 'Stretching tenure and never prepaying', d: "A 30-year loan taken with \"I'll prepay later\" intent often runs full term. Discipline beats intention every time." },
              { n: '02', t: 'Borrowing near upper eligibility while investing aggressively', d: 'Leaves no safety buffer if investment returns disappoint or income dips unexpectedly.' },
              { n: '03', t: 'Never reviewing the loan annually', d: 'Interest rates, salaries, and priorities change. A yearly review can save lakhs through refinancing or prepayment.' },
            ].map(m => (
              <div key={m.n} className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-slate-300 font-black text-2xl leading-none mt-0.5">{m.n}</span>
                <div>
                  <div className="font-semibold text-slate-800 mb-1">{m.t}</div>
                  <p className="text-sm text-slate-500">{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related Finance Tools</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { href: '/finance/mortgage-calculator', title: 'Mortgage Calculator', desc: 'Full housing cost with taxes, insurance, and PMI.' },
              { href: '/finance/amortization-calculator', title: 'Amortization Schedule', desc: 'Month-by-month principal vs interest breakdown.' },
              { href: '/finance/compound-interest-calculator', title: 'Compound Interest Calculator', desc: 'Model how investing your surplus grows over time.' },
              { href: '/finance/buy-vs-rent-calculator', title: 'Buy vs Rent Calculator', desc: 'Compare total cost of owning vs renting.' },
            ].map(t => (
              <Link key={t.href} href={t.href} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all">
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
