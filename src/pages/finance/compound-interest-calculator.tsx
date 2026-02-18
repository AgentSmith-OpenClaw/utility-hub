import Head from 'next/head';
import Link from 'next/link';
import CompoundInterestCalculator from '../../components/CompoundInterestCalculator/CompoundInterestCalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function CompoundInterestCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/compound-interest-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does compounding frequency affect returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Higher compounding frequency increases returns, though the difference is often modest. Daily compounding slightly outperforms annual compounding - on a ₹1 lakh investment at 10% for 20 years, daily compounding yields about ₹7.32 lakhs versus ₹6.73 lakhs with annual compounding. The real impact comes from the interest rate and time invested, not frequency alone."
        }
      },
      {
        "@type": "Question",
        "name": "Should I invest lump-sum or via monthly SIP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you have a lump sum available, investing it immediately typically beats rupee cost averaging due to longer market exposure. However, if you're accumulating money monthly from salary, SIP is your only option. The best strategy is investing lump sums when available (bonuses, inheritance) while maintaining regular SIPs from monthly income."
        }
      },
      {
        "@type": "Question",
        "name": "What's a realistic compound interest rate to expect?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Conservative estimates use 10-12% for equity investments, 6-8% for debt, and 8-10% for balanced portfolios. Historical Indian equity returns average 12-15%, but past performance doesn't guarantee future results. For financial planning, using modest assumptions prevents over-optimism. You can always beat conservative projections, but undershooting aggressive ones derails goals."
        }
      },
      {
        "@type": "Question",
        "name": "How does inflation affect compound returns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Inflation erodes purchasing power, so focus on real returns (nominal returns minus inflation). If you're earning 12% but inflation is 6%, your real return is roughly 6%. When planning for future expenses, increase your target corpus to account for inflation, or calculate based on today's values and inflate the goal amount using expected inflation rates."
        }
      },
      {
        "@type": "Question",
        "name": "When should I withdraw and stop compounding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Only withdraw when you reach your goal or genuinely need the money. Every early withdrawal sacrifices years of compounding. For retirement planning, consider systematic withdrawal plans that let remaining corpus continue compounding while you draw income. Premature withdrawals for non-essential expenses are among the costliest financial mistakes."
        }
      }
    ]
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Compound Interest Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate compound interest on lump-sum investments with various compounding frequencies and visualize exponential wealth growth."
  };

  return (
    <>
      <Head>
        <title>Compound Interest Calculator - Exponential Growth Projections | Utility Hub</title>
        <meta 
          name="description" 
          content="Calculate compound interest on lump-sum investments. Compare compounding frequencies, visualize exponential growth, and understand how time multiplies wealth over decades." 
        />
        <meta 
          name="keywords" 
          content="compound interest calculator, compounding frequency, investment growth, exponential returns, lump sum investment, wealth calculator" 
        />
        <link rel="canonical" href="https://utilityhub.app/finance/compound-interest-calculator" />
        <meta property="og:title" content="Compound Interest Calculator - Exponential Growth Projections" />
        <meta property="og:description" content="Calculate how lump-sum investments grow with compound interest over time." />
        <meta property="og:url" content="https://utilityhub.app/finance/compound-interest-calculator" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema]) }}
        />
      </Head>

      <CompoundInterestCalculator />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Lead */}
        <div className="bg-gradient-to-br from-violet-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">Compound Interest: The 8th Wonder</h2>
          <p className="text-violet-100 text-lg leading-relaxed max-w-3xl">
            Compound interest rewards patience, punishes withdrawals, and accelerates exponentially — but only if you stay invested long enough for the snowball to build real mass.
          </p>
        </div>

        {/* The 3 variables */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🎛️ The Three Variables That Control Your Outcome</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-3xl mb-3">⏳</div>
              <div className="font-bold text-slate-800 mb-2">Time</div>
              <p className="text-sm text-slate-500 mb-3">The most powerful variable — and the one you can never buy back. Starting 10 years earlier can be worth more than doubling your investment amount.</p>
              <div className="bg-violet-50 rounded-xl p-3 text-xs text-violet-800">₹10L at 25 vs 35 @ 12% → ₹2.95Cr vs ₹95L by age 60</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <div className="font-bold text-slate-800 mb-2">Rate of Return</div>
              <p className="text-sm text-slate-500 mb-3">A 2% difference compounds dramatically. The gap between 10% and 12% on ₹10L over 25 years is over ₹62 lakhs.</p>
              <div className="bg-violet-50 rounded-xl p-3 text-xs text-violet-800">Fund selection and asset allocation matter enormously</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-3xl mb-3">💰</div>
              <div className="font-bold text-slate-800 mb-2">Principal</div>
              <p className="text-sm text-slate-500 mb-3">Doubling principal doubles the final corpus if all else stays equal. Combined with monthly additions, the effect is multiplicative.</p>
              <div className="bg-violet-50 rounded-xl p-3 text-xs text-violet-800">Lump sum + SIP creates two simultaneous compounding streams</div>
            </div>
          </div>
        </section>

        {/* Compounding frequency */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">🔁 Does Compounding Frequency Matter?</h2>
          <p className="text-slate-500 mb-6">More frequent compounding is better — but the practical impact is smaller than most expect.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Frequency</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">₹1L @ 10% for 20 yrs</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Effective APY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { f: 'Annual', val: '₹6,72,750', apy: '10.00%' },
                  { f: 'Quarterly', val: '₹7,00,000', apy: '10.38%' },
                  { f: 'Monthly', val: '₹7,29,000', apy: '10.47%' },
                  { f: 'Daily', val: '₹7,31,948', apy: '10.52%' },
                ].map(r => (
                  <tr key={r.f} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 text-slate-700">{r.f}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-800">{r.val}</td>
                    <td className="px-5 py-3 text-right text-slate-500">{r.apy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-400 mt-2 pl-1">The rate and time invested matter far more than compounding frequency.</p>
        </section>

        {/* Inflation / real returns */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🌡️ Real Returns vs Nominal Returns</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="font-bold text-amber-900 mb-2">The Inflation Problem</div>
              <p className="text-sm text-amber-800">₹1 crore in 25 years at 6% inflation has the purchasing power of just ~₹23 lakhs today. You need ~₹4.3 crores to maintain equivalent value.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="font-bold text-slate-800 mb-2">Work With Real Returns</div>
              <p className="text-sm text-slate-500">Nominal return (12%) − inflation (6%) ≈ real return (6%). Plan future expenses in today&apos;s rupees using real returns, or explicitly inflate targets to account for purchasing power erosion.</p>
            </div>
          </div>
        </section>

        {/* Tax-advantaged compounding */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🛡️ Tax-Free vs Taxable Compounding</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Account Type</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">₹10L @ 12% for 20 yrs</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Final Corpus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50"><td className="px-5 py-3 text-slate-700">Tax-free (EPF / PPF)</td><td className="px-5 py-3 text-right text-slate-500">Full compounding</td><td className="px-5 py-3 text-right font-bold text-emerald-600">₹96.5L</td></tr>
                <tr className="hover:bg-slate-50"><td className="px-5 py-3 text-slate-700">Taxable (effective ~10.8%)</td><td className="px-5 py-3 text-right text-slate-500">Annual tax drag</td><td className="px-5 py-3 text-right font-semibold text-slate-700">~₹78L</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-400 mt-2 pl-1">The ₹18L difference is the cost of interrupted compounding. Max out tax-advantaged accounts first.</p>
        </section>

        {/* Getting started */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🚀 Practical Starting Points</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '💳', t: 'Clear expensive debt first', d: 'Compound interest at 18–36% on credit cards destroys wealth faster than any investment builds it.' },
              { icon: '🛡️', t: 'Build an emergency fund', d: '3–6 months in a liquid fund. This buffer lets long-term investments compound uninterrupted through surprises.' },
              { icon: '📅', t: 'Start today, not "someday"', d: 'Every delayed month is a real lost return. A ₹50k lump sum invested today begins compounding immediately.' },
              { icon: '🎯', t: 'Use conservative projections', d: 'Plan on 10% equity returns, not 15%. Pleasant surprises beat shortfalls when you\'re close to your goal.' },
            ].map(c => (
              <div key={c.t} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex gap-3">
                <div className="text-2xl">{c.icon}</div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-1">{c.t}</div>
                  <p className="text-xs text-slate-500">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
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
              { href: '/finance/sip-calculator', title: 'SIP Calculator', desc: 'Combine monthly SIPs with lump-sum compounding for maximum growth.' },
              { href: '/finance/fire-calculator', title: 'FIRE Calculator', desc: 'See how your compounding corpus funds decades of retirement.' },
              { href: '/finance/income-tax-calculator', title: 'Income Tax Calculator', desc: 'Maximise after-tax compound returns with the right deductions.' },
              { href: '/finance/mortgage-calculator', title: 'Mortgage Calculator', desc: 'Compare compound growth of investments vs paying down a home loan.' },
            ].map(t => (
              <Link key={t.href} href={t.href} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-violet-400 hover:shadow-md transition-all">
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

