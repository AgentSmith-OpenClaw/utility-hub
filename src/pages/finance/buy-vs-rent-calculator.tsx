import Head from 'next/head';
import Link from 'next/link';
import BuyVsRentRedesigned from '../../components/BuyVsRent/BuyVsRentRedesigned';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function BuyVsRentCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/buy-vs-rent-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is buying always better than renting in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not necessarily. While cultural preferences favor ownership, buying only makes financial sense when property appreciation and tax benefits outweigh the opportunity cost of invested capital plus all ownership expenses. In expensive markets with low rental yields, renting and investing the difference often produces superior wealth outcomes over 10-15 years."
        }
      },
      {
        "@type": "Question",
        "name": "What hidden costs do home buyers often miss?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Beyond EMI and down payment, homeowners face registration costs (7-10% in many states), annual property tax, insurance, maintenance reserves (1-2% of property value annually), renovation costs, and major repairs. These can add 30-40% to the total cost of ownership over 20 years. Factor all expenses for accurate buy vs rent comparison."
        }
      },
      {
        "@type": "Question",
        "name": "How do I estimate realistic property appreciation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Historical Indian real estate returns average 8-10% in major metros, but vary dramatically by location and period. Conservative planning uses 6-8% to avoid over-optimism. Check actual transaction prices in your specific area over the past decade using registration data. Avoid basing decisions on seller claims or outlier appreciation stories."
        }
      },
      {
        "@type": "Question",
        "name": "Should I buy if I might relocate in 5 years?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Probably not. Transaction costs typically require 7-10 years to break even. Buying for short durations locks capital, incurs high entry/exit costs, and risks selling during market downturns. If career mobility is likely, renting preserves flexibility while investing the would-be down payment in liquid assets typically produces better outcomes."
        }
      },
      {
        "@type": "Question",
        "name": "How does rental yield affect the buy vs rent decision?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rental yield (annual rent divided by property price) indicates market pricing. Yields below 2-2.5% suggest overpriced property relative to rents, favoring renting. Higher yields (3-4%+) indicate better value for buyers. Mumbai and Bangalore often have 1.5-2% yields, making renting economically attractive compared to many tier-2 cities with 3-4% yields."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Buy vs Rent Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Compare the full financial impact of buying versus renting property, including hidden costs, opportunity costs, and wealth accumulation."
  };

  return (
    <>
      <Head>
        <title>Buy vs Rent Calculator - Complete Cost Comparison | Utility Hub</title>
        <meta 
          name="description" 
          content="Compare buying vs renting with full cost analysis including hidden ownership expenses, opportunity costs, and wealth accumulation. Make informed property decisions with real numbers." 
        />
        <meta 
          name="keywords" 
          content="buy vs rent calculator, property comparison, home ownership cost, rental yield, real estate calculator, property investment" 
        />
        <link rel="canonical" href={`${SITE_URL}/finance/buy-vs-rent-calculator`} />
        <meta property="og:title" content="Buy vs Rent Calculator - Complete Cost Comparison" />
        <meta property="og:description" content="Analyze whether buying or renting makes better financial sense with comprehensive cost comparison." />
        <meta property="og:url" content={`${SITE_URL}/finance/buy-vs-rent-calculator`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema]) }}
        />
      </Head>

      <BuyVsRentRedesigned />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Lead */}
        <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">Buy vs Rent: The Math May Surprise You</h2>
          <p className="text-teal-100 text-lg leading-relaxed max-w-3xl">
            &quot;Rent is money down the drain&quot; is Indian common wisdom — but in cities where rental yields sit below 2%, the numbers often tell a very different story.
          </p>
        </div>

        {/* True ownership costs */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🏠 True Cost of Ownership (Beyond EMI)</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            {[
              { icon: '📋', label: 'Stamp Duty + Registration', val: '7–10% upfront', desc: 'Paid at purchase on property value. On a ₹1Cr home = ₹7–10L out of pocket before EMI 1.' },
              { icon: '💰', label: 'Down Payment', val: '20% minimum', desc: '₹20L on ₹1Cr home — locked capital that forfeits investment returns.' },
              { icon: '🏛️', label: 'Property Tax', val: '₹15–40k/yr', desc: 'Ongoing, non-negotiable, and increases over time.' },
              { icon: '🛡️', label: 'Insurance', val: '₹8–15k/yr', desc: 'Home + contents insurance. Mandatory for lenders.' },
              { icon: '🔧', label: 'Maintenance Charges', val: '₹29–58k/yr', desc: 'For a 1,200 sqft apartment. Standalone homes bear individual costs.' },
              { icon: '🏗️', label: 'Repairs & Renovation', val: '1–2% of value/yr', desc: '₹1–2L/yr amortized for plumbing, painting, appliances on a ₹1Cr home.' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-slate-800 text-sm">{c.label}</div>
                <div className="text-teal-600 font-bold text-xs mb-2">{c.val}</div>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-sm">When ₹25k rent is compared to ₹60k EMI, the actual comparison is <strong>₹25k all-in (renting) vs ₹75k+ all-in (owning)</strong> after all recurring costs.</p>
          </div>
        </section>

        {/* Opportunity cost */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">📈 The Opportunity Cost That Changes Everything</h2>
          <p className="text-slate-500 mb-6">The ₹30L spent on down payment + registration isn&apos;t gone — it&apos;s locked in property. Here&apos;s what it could have done instead.</p>
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-2">₹30L down payment invested</div>
              <div className="text-3xl font-bold mb-1">₹2.8 Crore</div>
              <p className="text-slate-400 text-sm">At 12% for 20 years — that capital is completely liquid.</p>
            </div>
            <div>
              <div className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-2">₹50k/mo difference invested</div>
              <div className="text-3xl font-bold mb-1">₹4.5 Crore</div>
              <p className="text-slate-400 text-sm">Monthly cost gap (own vs rent) invested as a SIP at 12% for 20 years.</p>
            </div>
            <div className="sm:col-span-2 bg-teal-500/20 rounded-2xl p-4 border border-teal-500/30">
              <div className="text-teal-300 font-semibold mb-1">Combined renter&apos;s portfolio after 20 years</div>
              <div className="text-2xl font-bold text-white">~₹7.3 Crore (liquid)</div>
              <p className="text-teal-200 text-sm mt-1">The property must appreciate to ₹7.3Cr (10.6% CAGR) for buying to match — before selling costs.</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-blue-900 text-sm"><strong>The catch:</strong> This only works if you actually invest the difference. People who won&apos;t do that consistently may build more wealth through the forced savings of a home loan.</p>
          </div>
        </section>

        {/* Rental yield */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📊 Rental Yield by City: Who Benefits From Buying?</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Market</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Typical Rental Yield</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { city: 'Mumbai (premium areas)', yield: '< 2%', verdict: 'Rent favoured', color: 'text-red-500' },
                  { city: 'Bangalore (tech corridors)', yield: '1.8–2.5%', verdict: 'Rent favoured', color: 'text-red-500' },
                  { city: 'Pune / Hyderabad', yield: '3–4%', verdict: 'Neutral / Buy OK', color: 'text-amber-600' },
                  { city: 'Tier-2 cities', yield: '3.5–4.5%', verdict: 'Buying reasonable', color: 'text-emerald-600' },
                ].map(r => (
                  <tr key={r.city} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 text-slate-700">{r.city}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-800">{r.yield}</td>
                    <td className={`px-5 py-3 text-right font-medium ${r.color}`}>{r.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-400 mt-2 pl-1">Yields below 2.5% signal properties are expensive relative to rents. The lower the yield, the stronger the case for renting.</p>
        </section>

        {/* Time horizon */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">⏳ How Long You Stay Changes Everything</h2>
          <div className="space-y-3">
            {[
              { horizon: 'Under 5 years', verdict: 'Rent — almost always', color: 'text-red-600', bg: 'bg-red-50 border-red-200', desc: 'Transaction costs (stamp duty, registration, brokerage) consume 8–12% of property value. Appreciation rarely overcomes this in under 5 years.' },
              { horizon: '5–10 years', verdict: 'Run the numbers', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', desc: 'Depends heavily on city, rental yield, and actual appreciation. Use the calculator above with realistic inputs — not hopeful ones.' },
              { horizon: '10–15+ years', verdict: 'Buying often wins', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', desc: 'Appreciation compounds, transaction costs amortize over many years, and forced equity building has had time to work in your favour.' },
            ].map(row => (
              <div key={row.horizon} className={`flex gap-4 rounded-2xl border p-5 ${row.bg}`}>
                <div className="w-32 flex-shrink-0">
                  <div className="text-sm font-semibold text-slate-700">{row.horizon}</div>
                  <div className={`text-xs font-bold mt-0.5 ${row.color}`}>{row.verdict}</div>
                </div>
                <p className="text-sm text-slate-600">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Non-financial factors */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">💡 When the Math Doesn&apos;t Tell the Full Story</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🔒', t: 'Security of tenure', d: 'Landlords can ask you to vacate. Rental negotiations every few years create stress. For families with school-age children, stability matters.' },
              { icon: '🎨', t: 'Freedom to customise', d: 'You can\'t knock walls, paint freely, or renovate a rented home. For many people, making a home truly their own has real value.' },
              { icon: '💪', t: 'Forced savings', d: 'Undisciplined savers rarely invest the monthly difference. For them, the EMI acts as mandatory wealth-building regardless of the spreadsheet outcome.' },
              { icon: '🌍', t: 'Career mobility', d: 'If there\'s a 30%+ chance you relocate cities in 5–7 years, ownership locks you in during potentially bad selling conditions.' },
            ].map(c => (
              <div key={c.t} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex gap-3">
                <div className="text-2xl flex-shrink-0">{c.icon}</div>
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
              { href: '/finance/mortgage-calculator', title: 'Mortgage Calculator', desc: 'Calculate home loan EMI, total interest, and full repayment cost.' },
              { href: '/finance/compound-interest-calculator', title: 'Compound Interest Calculator', desc: 'Model how your down payment grows if invested instead.' },
              { href: '/finance/sip-calculator', title: 'SIP Calculator', desc: 'Calculate returns from investing the monthly rent-vs-EMI gap.' },
              { href: '/finance/fire-calculator', title: 'FIRE Calculator', desc: 'Plan financial independence factoring in housing as a major variable.' },
            ].map(t => (
              <Link key={t.href} href={t.href} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-teal-400 hover:shadow-md transition-all">
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

