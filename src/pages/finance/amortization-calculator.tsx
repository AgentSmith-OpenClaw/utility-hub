import Head from 'next/head';
import Link from 'next/link';
import AmortizationCalculator from '../../components/AmortizationCalculator/AmortizationCalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function AmortizationCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/amortization-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An amortization schedule is a detailed table showing every payment over your loan life, breaking down how much goes to principal versus interest each month. It reveals that early payments are mostly interest while later payments are mostly principal. This schedule helps you understand true loan costs and optimal prepayment timing."
        }
      },
      {
        "@type": "Question",
        "name": "Why is most of my early EMI going to interest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Loans calculate interest on outstanding principal balance. Early on, your principal is highest, so interest is highest. As you repay principal over time, interest charges decrease while your EMI stays constant, meaning more goes to principal. This front-loading of interest explains why prepaying early saves dramatically more than prepaying late."
        }
      },
      {
        "@type": "Question",
        "name": "How do prepayments affect my amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Prepayments directly reduce principal, which decreases interest on all future payments. You can either reduce EMI (keeping tenure same) or reduce tenure (keeping EMI same). Reducing tenure saves more total interest. A ₹5 lakh prepayment on a ₹50 lakh loan can cut years off your loan and save lakhs in interest."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use amortization schedules for tax planning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, schedules show exactly how much interest you'll pay each year, helping you plan Section 24 deductions (up to ₹2 lakhs). You'll see when interest deduction drops below the limit, which might inform your new vs old tax regime choice. Schedules also show principal repayment for Section 80C planning within the ₹1.5 lakh limit."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I review my amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Review annually or when making prepayments to track progress and plan future prepayments. After each prepayment, generate a new schedule reflecting reduced principal. This helps you visualize how much faster you're reducing debt and motivates continued prepayment. Some people review quarterly to stay engaged with their loan reduction progress."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Amortization Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Generate detailed amortization schedules showing principal and interest breakdown for every loan payment over the full tenure.",
    "url": `${SITE_URL}/finance/amortization-calculator`
  };

  return (
    <>
      <Head>
        <title>Amortization Calculator — Loan Schedule & Interest Breakdown | Toolisk</title>
        <meta 
          name="description" 
          content="Generate month-by-month amortization schedules. Track principal vs interest for every payment, see cumulative interest, and analyze how prepayments shorten your loan." 
        />
        <meta 
          name="keywords" 
          content="amortization calculator, loan schedule, principal interest breakdown, prepayment planning, loan amortization table, mortgage schedule, Excel export" 
        />
        <link rel="canonical" href={`${SITE_URL}/finance/amortization-calculator`} />
        <meta property="og:title" content="Amortization Calculator — Loan Schedule & Interest Breakdown" />
        <meta property="og:description" content="Generate month-by-month loan amortization schedules with principal vs interest breakdown and prepayment analysis." />
        <meta property="og:url" content={`${SITE_URL}/finance/amortization-calculator`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Amortization Calculator — Loan Schedule & Interest Breakdown | Toolisk" />
        <meta name="twitter:description" content="Generate month-by-month amortization schedules. Track principal vs interest and analyze prepayment impact." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema]) }}
        />
      </Head>

      <AmortizationCalculator />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Lead */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 sm:p-10 text-white">
          <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold mb-3">Amortization Decoded</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Month-by-Month: Where Your Money Actually Goes</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            Your ₹43,000 home loan EMI isn't paying off ₹43,000 of your loan. In year one, roughly ₹35,000 goes to the bank as interest and only ₹8,000 reduces what you owe. The amortization schedule is the one document that shows you the truth behind every payment — and why <strong className="text-white">when</strong> you prepay matters as much as <strong className="text-white">how much</strong> you prepay.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold">₹35,400</p>
              <p className="text-slate-300 text-sm mt-1">Interest in month 1 of a ₹50L, 8.5%, 20-yr loan</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold">Only ₹7,600</p>
              <p className="text-slate-300 text-sm mt-1">Actual principal reduced in the same month</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-2xl font-bold">30%</p>
              <p className="text-slate-300 text-sm mt-1">Principal reduced after 10 years of payments</p>
            </div>
          </div>
        </div>

        {/* Front-loaded interest mechanics */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">How Amortization Front-Loads Interest</h2>
          <p className="text-slate-600 mb-6">Each EMI is the same amount, but the split between interest and principal shifts dramatically over time. Here's how your ₹50L, 8.5%, 20-year loan evolves:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Month 1 (Year 1)</p>
              <p className="text-slate-800 font-bold text-lg mb-1">₹35,400 interest · ₹7,600 principal</p>
              <p className="text-slate-500 text-sm">82% of your EMI disappears as interest. Outstanding balance barely moves.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Month 120 (Year 10)</p>
              <p className="text-slate-800 font-bold text-lg mb-1">₹26,900 interest · ₹16,100 principal</p>
              <p className="text-slate-500 text-sm">Balance is improving — you've crossed the halfway point on interest.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Month 180 (Year 15)</p>
              <p className="text-slate-800 font-bold text-lg mb-1">₹18,100 interest · ₹24,900 principal</p>
              <p className="text-slate-500 text-sm">Principal now outpaces interest. Equity builds much faster from here.</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-semibold text-amber-800 mb-1">⚠️ The 50% payment / 30% principal reality</p>
            <p className="text-amber-700 text-sm">After making 10 years of EMI payments on a 20-year loan — that's <strong>50% of your total payments</strong> — you've reduced your principal by only <strong>30–35%</strong>. This isn't a lender trick; it's just how compound interest math works. Knowing this upfront prevents the frustration of feeling "stuck" mid-loan.</p>
          </div>
        </div>

        {/* Prepayment timing */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Why Prepayment Timing Changes Everything</h2>
          <p className="text-slate-600 mb-6">The same ₹5 lakh prepayment delivers wildly different results depending on when in the loan you make it. Earlier is dramatically better.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border-2 border-emerald-400 p-6 shadow-sm">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">✅ Year 2 Prepayment of ₹5L</p>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex justify-between"><span>Interest saved</span><strong className="text-emerald-700">~₹9.5 lakhs</strong></li>
                <li className="flex justify-between"><span>Tenure cut</span><strong className="text-emerald-700">~4.5 years</strong></li>
                <li className="flex justify-between"><span>Remaining interest years eliminated</span><strong className="text-emerald-700">16 years</strong></li>
              </ul>
              <p className="text-slate-500 text-xs mt-3">The prepayment kills 16 years of compounding at 8.5%. Maximum leverage.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">📉 Year 15 Prepayment of ₹5L</p>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex justify-between"><span>Interest saved</span><strong className="text-slate-700">~₹2.8 lakhs</strong></li>
                <li className="flex justify-between"><span>Tenure cut</span><strong className="text-slate-700">~2.5 years</strong></li>
                <li className="flex justify-between"><span>Remaining interest years eliminated</span><strong className="text-slate-700">3–5 years</strong></li>
              </ul>
              <p className="text-slate-500 text-xs mt-3">Still helpful, but the interest savings are 3.4× smaller than the year-2 prepayment.</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <p className="font-semibold text-blue-800 mb-1">💡 The High-Impact Window</p>
            <p className="text-blue-700 text-sm">Aggressive prepayment in years 1–7 delivers the highest return per rupee. Bonuses, tax refunds, or investment maturities during this period should seriously be considered for loan prepayment — especially if your post-tax investment returns are lower than your loan interest rate.</p>
          </div>
        </div>

        {/* Tenure reduction vs EMI reduction */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Reduce Tenure or Reduce EMI?</h2>
          <p className="text-slate-600 mb-6">When you prepay, lenders give you a choice. Mathematically, reducing tenure always wins — but the right answer depends on your situation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-2xl border-2 border-blue-400 p-6 shadow-sm">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">⏱ Reduce Tenure (Recommended)</p>
              <p className="text-slate-700 text-sm mb-3">Keep EMI the same, clock out of debt earlier.</p>
              <ul className="space-y-1 text-slate-700 text-sm">
                <li>• Saves more total interest</li>
                <li>• Builds equity faster</li>
                <li>• Stronger financial discipline</li>
                <li>• Loan ends sooner (peace of mind)</li>
              </ul>
              <p className="text-slate-500 text-xs mt-3">On a ₹5L prepayment example above: saves ₹9.5L in interest.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">💸 Reduce EMI</p>
              <p className="text-slate-700 text-sm mb-3">Lower monthly obligation, but stay in debt longer.</p>
              <ul className="space-y-1 text-slate-700 text-sm">
                <li>• Lower monthly cash outflow</li>
                <li>• Good if EMI feels tight</li>
                <li>• More investing headroom</li>
                <li>• Useful if income is uncertain</li>
              </ul>
              <p className="text-slate-500 text-xs mt-3">Same ₹5L prepayment: saves only ₹7.2L — ₹2.3L less than tenure reduction.</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="font-semibold text-slate-800 mb-1">🔄 The Hybrid Strategy</p>
            <p className="text-slate-600 text-sm">Choose tenure reduction by default. If you hit financial stress later, you can request EMI reduction. The reverse — switching from EMI reduction back to tenure reduction — is much harder to arrange with lenders. Stay flexible by defaulting to the high-savings option first.</p>
          </div>
        </div>

        {/* Tax planning */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Using Your Schedule for Tax Planning</h2>
          <p className="text-slate-600 mb-6">Your amortization schedule is a tax planning document. It tells you exactly what deductions to claim each year.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Section 24 — Interest Deduction</p>
              <p className="text-slate-800 font-semibold mb-2">Up to ₹2L/year (old regime)</p>
              <p className="text-slate-600 text-sm">In the first 10–12 years of a ₹50L loan, your annual interest exceeds ₹2L — so you'll max this deduction. Around year 13–15, interest drops below ₹2L, making the old regime less attractive. Your schedule tells you exactly when this crossover happens.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Section 80C — Principal Repayment</p>
              <p className="text-slate-800 font-semibold mb-2">Up to ₹1.5L/year (old regime)</p>
              <p className="text-slate-600 text-sm">Annual principal repayment from your schedule counts toward your 80C limit — shared with ELSS, PPF, insurance, etc. Knowing the exact principal repaid each year lets you calculate remaining 80C room for other investments.</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-4">
            <p className="font-semibold text-amber-800 mb-1">⚠️ Rental Property Exception</p>
            <p className="text-amber-700 text-sm">If the property is rented out, the entire interest (no ₹2L cap) is deductible against rental income, and you can set off losses up to ₹2L against other income. Amortization schedules are essential for accurate rental property tax filing.</p>
          </div>
        </div>

        {/* Common mistakes */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Amortization Mistakes</h2>
          <div className="space-y-4">
            {[
              { n: "01", title: "Prepaying late in the loan", body: "Most borrowers prepay in their 40s when income peaks — but years 13–18 of a 20-year loan save a fraction of what year 2–5 prepayments save. Front-load your prepayments aggressively if your interest rate exceeds post-tax investment returns." },
              { n: "02", title: "Choosing EMI reduction by default", body: "Lenders default to EMI reduction because it keeps you in debt longer. Always ask explicitly for tenure reduction unless you genuinely need the lower monthly cash flow." },
              { n: "03", title: "Ignoring the tax crossover point", body: "When Section 24 interest drops below ₹2L (usually year 13–15), your old regime advantage shrinks. Many borrowers keep old regime out of habit past the point where new regime would save them more tax." },
              { n: "04", title: "Not reviewing after rate resets", body: "On floating rate loans, a rate change alters every future payment's principal-interest split. Download a fresh schedule after every rate reset to recalibrate prepayment strategy and tax estimates." },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-slate-300 font-black text-2xl leading-none shrink-0">{n}</span>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">{title}</p>
                  <p className="text-slate-600 text-sm">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <p className="font-semibold text-slate-800 mb-2">{faq.name}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Financial Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/finance/mortgage-calculator" className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-500 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-800 mb-1">🏠 Mortgage Calculator</p>
              <p className="text-slate-500 text-sm">Calculate home loan EMI and understand total interest costs over your loan tenure.</p>
            </Link>
            <Link href="/finance/buy-vs-rent-calculator" className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-500 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-800 mb-1">🏡 Buy vs Rent Calculator</p>
              <p className="text-slate-500 text-sm">Compare buying versus renting with complete cost analysis including amortization.</p>
            </Link>
            <Link href="/finance/income-tax-calculator" className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-500 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-800 mb-1">🧾 Income Tax Calculator</p>
              <p className="text-slate-500 text-sm">Calculate deductions from home loan interest (Section 24) and principal (Section 80C).</p>
            </Link>
            <Link href="/finance/compound-interest-calculator" className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-500 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-800 mb-1">📈 Compound Interest Calculator</p>
              <p className="text-slate-500 text-sm">See whether investing prepayment amounts beats the interest savings from a prepayment.</p>
            </Link>
          </div>
        </div>

      </div>


    </>
  );
}
