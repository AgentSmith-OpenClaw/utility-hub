import Head from 'next/head';
import Link from 'next/link';
import MortgageCalculator from '../../components/MortgageCalculator/MortgageCalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function MortgageCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/mortgage-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much should I budget for home loan EMI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Financial advisors recommend keeping total housing costs (EMI + property tax + insurance + maintenance) under 40% of take-home income, with EMI itself below 33%. For a ₹1 lakh monthly income, keep EMI under ₹33,000 and total housing cost under ₹40,000. This leaves room for other investments and expenses while remaining comfortably affordable."
        }
      },
      {
        "@type": "Question",
        "name": "Is a 20-year or 30-year loan better?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shorter tenure costs less total interest but higher monthly EMI. Longer tenure reduces EMI but dramatically increases total interest paid. Most people prefer 15-20 years balancing affordability with interest costs. Consider prepaying aggressively on a longer tenure loan for flexibility - you get lower mandatory EMI with option to prepay, while short tenure locks you into high EMI."
        }
      },
      {
        "@type": "Question",
        "name": "Should I make partial prepayments or invest the money?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your loan rate is 8.5% and you're in 30% tax bracket, post-tax loan cost is roughly 6% (after interest deduction). If you can reliably earn over 10-12% investing, mathematically investing wins. However, prepayment provides guaranteed returns and psychological benefit of reduced debt. Many prefer a balanced approach - invest 60-70% while prepaying 30-40%."
        }
      },
      {
        "@type": "Question",
        "name": "What hidden costs should I budget beyond EMI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Budget for property tax (₹15-40k annually), home insurance (₹8-15k), maintenance charges (₹2-4 per sq ft monthly for apartments), major repairs (1-2% property value yearly), and initial costs like registration (7-10% of property price). These easily add ₹15-25k monthly to your effective housing cost beyond just EMI."
        }
      },
      {
        "@type": "Question",
        "name": "When is the best time to prepay my home loan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Prepay early in the loan tenure for maximum interest savings, as loans are front-loaded with interest. Use windfalls like bonuses, tax refunds, or maturity proceeds. Reduce tenure rather than EMI to save more interest. Don't prepay so aggressively you lack emergency funds or miss higher-return investment opportunities - maintain balance based on your overall financial situation."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mortgage Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate home loan EMI, total interest, and affordability. Understand true cost of property ownership including taxes, insurance, and maintenance.",
    "url": `${SITE_URL}/finance/mortgage-calculator`
  };

  return (
    <>
      <Head>
        <title>Mortgage Calculator - Home Loan EMI & Affordability | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate home loan EMI, total interest costs, and affordability. Understand complete housing costs including property tax, insurance, and maintenance beyond just EMI." 
        />
        <meta 
          name="keywords" 
          content="mortgage calculator, home loan calculator, EMI calculator, loan affordability, property tax, home insurance, housing costs" 
        />
        <link rel="canonical" href={`${SITE_URL}/finance/mortgage-calculator`} />
        <meta property="og:title" content="Mortgage Calculator - Home Loan EMI & Affordability" />
        <meta property="og:description" content="Calculate home loan EMI and understand total housing costs for informed property decisions." />
        <meta property="og:url" content={`${SITE_URL}/finance/mortgage-calculator`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema]) }}
        />
      </Head>

      <MortgageCalculator />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Lead */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">Home Loans: The Complete Cost Picture</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
            Your EMI is just one piece. Property tax, insurance, maintenance, and registration fees add 25–40% more. Understanding the true cost before you commit is non-negotiable.
          </p>
        </div>

        {/* True cost */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">💸 The True Cost of Ownership</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🏛️', label: 'Property Tax', val: '₹15–40k/yr', desc: '0.15–0.4% of property value annually. Non-optional and increases over time.' },
              { icon: '🛡️', label: 'Home Insurance', val: '₹8–15k/yr', desc: 'Covers structure and contents. Mandatory for lenders — protect yourself properly.' },
              { icon: '🔧', label: 'Maintenance', val: '₹25–58k/yr', desc: '₹2–4/sqft/month for apartments. Standalone homes bear individual costs.' },
              { icon: '🏗️', label: 'Repairs & Reno', val: '1–2% value/yr', desc: 'Plumbing, paint, appliances — budget ₹1–2L/yr on a ₹1Cr home.' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-slate-800 text-sm">{c.label}</div>
                <div className="text-blue-600 font-bold text-xs mb-2">{c.val}</div>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-blue-900 text-sm"><strong>Plus upfront:</strong> Stamp duty + registration (7–10% of property value) + loan processing fees (0.5–1%) + brokerage. Your out-of-pocket at purchase is typically 27–30% of the property price, not just the 20% down payment.</p>
          </div>
        </section>

        {/* Tenure comparison */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">⏳ Tenure: The Total Interest Trade-off</h2>
          <p className="text-slate-500 mb-6">Shorter tenure costs more monthly but far less in total. On a ₹50L loan at 8.5%:</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border-2 border-blue-400 bg-blue-50 p-6">
              <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">15-Year Tenure</div>
              <div className="text-2xl font-bold text-slate-900 mb-2">₹49,000/mo EMI</div>
              <div className="text-sm text-slate-600 space-y-1">
                <div>Total interest paid: <strong className="text-emerald-600">₹38 Lakhs</strong></div>
                <div>Loan closed by age: <strong>~45</strong> (if taken at 30)</div>
              </div>
              <div className="mt-3 bg-emerald-100 rounded-xl p-2 text-xs text-emerald-800 font-medium">Saves ₹50L in interest vs 30yr</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">30-Year Tenure</div>
              <div className="text-2xl font-bold text-slate-900 mb-2">₹38,400/mo EMI</div>
              <div className="text-sm text-slate-600 space-y-1">
                <div>Total interest paid: <strong className="text-red-500">₹88 Lakhs</strong></div>
                <div>Loan closed by age: <strong>~60</strong> (if taken at 30)</div>
              </div>
              <div className="mt-3 bg-amber-50 rounded-xl p-2 text-xs text-amber-900">Lower EMI but ₹50L more interest. Use only for affordability.</div>
            </div>
          </div>
        </section>

        {/* Prepayment */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">💡 When to Prepay Your Home Loan</h2>
          <p className="text-slate-500 mb-6">Prepayment saves most when done early. The same ₹5L prepayment has vastly different impact depending on timing.</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="font-bold text-emerald-800 text-lg mb-2">Year 2 Prepayment</div>
              <p className="text-sm text-emerald-700">₹5L prepayment in year 2 eliminates years of high-interest EMIs. Each rupee you prepay removes the compounding of that debt. <br/><strong>Interest saved: ~₹9.5L+</strong></p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="font-bold text-slate-700 text-lg mb-2">Year 15 Prepayment</div>
              <p className="text-sm text-slate-600">By year 15, you&apos;re mostly paying principal anyway. The same ₹5L has less interest to eliminate.<br/><strong>Interest saved: ~₹2.8L</strong></p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-sm"><strong>Strategy tip:</strong> Always choose <em>tenure reduction</em> over EMI reduction when prepaying. Shortening tenure eliminates future interest-heavy instalments. A lower EMI just keeps you in debt longer.</p>
          </div>
        </section>

        {/* Tax benefits */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🧾 Tax Benefits on Home Loans</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="font-bold text-slate-800 mb-1">Section 24 — Interest</div>
              <div className="text-blue-600 font-bold text-lg mb-2">Up to ₹2 Lakh/yr</div>
              <p className="text-sm text-slate-500">Deductible from income. At 30% bracket = ₹60k tax saved annually. Only available in old regime.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="font-bold text-slate-800 mb-1">Section 80C — Principal</div>
              <div className="text-blue-600 font-bold text-lg mb-2">Part of ₹1.5L limit</div>
              <p className="text-sm text-slate-500">Principal repayment counts within the ₹1.5L 80C umbrella alongside ELSS, PPF, etc. Old regime only.</p>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="text-blue-900 text-sm"><strong>Regime caution:</strong> New regime eliminates both deductions. If you have a home loan, old regime often saves far more tax. Run the comparison before declaring your regime each April.</p>
          </div>
        </section>

        {/* Common mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🚫 Home Loan Mistakes to Avoid</h2>
          <div className="space-y-3">
            {[
              { n: '01', t: 'Maxing out the bank-approved amount', d: 'Lenders approve 50–60% of gross income. Your comfort threshold is much lower. Borrow what allows lifestyle flexibility, not the maximum.' },
              { n: '02', t: 'Never reviewing your interest rate', d: 'Banks give better rates to new borrowers. Check once a year — if you\'re paying 0.5%+ above market, negotiate or refinance.' },
              { n: '03', t: 'Exhausting savings for down payment', d: 'Always retain 6–12 months expenses in liquid savings. New homeowners face immediate unplanned costs — appliances, repairs, moving.' },
              { n: '04', t: 'Taking 30-year tenure out of habit', d: '30 years = likely past retirement age. Calculate your exit age and choose tenure accordingly. Pay off your home before you stop earning.' },
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
              { href: '/finance/buy-vs-rent-calculator', title: 'Buy vs Rent Calculator', desc: 'Compare true total cost of owning vs renting with opportunity cost.' },
              { href: '/finance/amortization-calculator', title: 'Amortization Calculator', desc: 'Month-by-month principal vs interest breakdown for your loan.' },
              { href: '/finance/income-tax-calculator', title: 'Income Tax Calculator', desc: 'Calculate tax savings from Section 24 and 80C home loan deductions.' },
              { href: '/finance/compound-interest-calculator', title: 'Compound Interest Calculator', desc: 'Compare investing your down payment vs using it for a property purchase.' },
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

