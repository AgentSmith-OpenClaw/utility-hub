import Head from 'next/head';
import Link from 'next/link';
import IncomeTaxCalculator from '../../components/IncomeTaxCalculator/IncomeTaxCalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function IncomeTaxCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/income-tax-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Should I choose old or new tax regime?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose based on your actual deductions. If you max out Section 80C (₹1.5 lakhs), have home loan interest, HRA, and other deductions exceeding ₹2.5-3 lakhs, the old regime typically saves more tax. Without significant deductions, the new regime's lower rates win. Run calculations with your specific numbers - the answer isn't universal."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best tax-saving investments under Section 80C?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ELSS mutual funds offer equity returns with 3-year lock-in, making them best for long-term wealth building. PPF provides safety with 7-7.5% returns and 15-year maturity. EPF contributions are mandatory but excellent for retirement. Avoid insurance-cum-investment products - they typically deliver poor returns. Choose based on your goals and risk appetite within the ₹1.5 lakh limit."
        }
      },
      {
        "@type": "Question",
        "name": "How can I reduce tax beyond Section 80C?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "HRA if you rent, Section 80D for health insurance premiums (₹25k-50k), NPS contributions under 80CCD(1B) (additional ₹50k), home loan interest (₹2 lakhs), and Section 24 for rental property losses. Education loan interest has no cap under Section 80E. Strategically structuring salary components like meal allowances and telephone reimbursements also helps."
        }
      },
      {
        "@type": "Question",
        "name": "What common tax-saving mistakes should I avoid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Buying insurance solely for tax saving (often poor investment returns), making rushed 80C investments in March without planning, ignoring HRA exemption by not collecting rent receipts, not opting for NPS (easy additional ₹50k deduction), and forgetting to claim deductions you're eligible for like education loan interest or donations. Plan tax saving year-round, not in the last quarter."
        }
      },
      {
        "@type": "Question",
        "name": "When should I switch between tax regimes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evaluate annually. Life changes affect optimal regime choice - buying a home, moving to non-HRA city, kids' education expenses, or income changes. The new regime makes sense when you can't or won't max out deductions. Young professionals often benefit from new regime initially, then switch to old regime after buying homes or having children when deductions increase substantially."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Income Tax Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Compare old vs new tax regimes and calculate income tax with deductions optimization for Indian taxpayers.",
    "url": `${SITE_URL}/finance/income-tax-calculator`
  };

  return (
    <>
      <Head>
        <title>Income Tax Calculator - Old vs New Regime Comparison | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate income tax for both old and new regimes. Compare tax liability, optimize deductions under Section 80C, HRA, and more. Find the best tax regime for your salary structure." 
        />
        <meta 
          name="keywords" 
          content="income tax calculator, tax regime comparison, Section 80C, HRA calculation, tax deductions, tax saving investments, salary tax" 
        />
        <link rel="canonical" href={`${SITE_URL}/finance/income-tax-calculator`} />
        <meta property="og:title" content="Income Tax Calculator - Old vs New Regime Comparison" />
        <meta property="og:description" content="Calculate and compare income tax under old vs new regimes with comprehensive deduction optimization." />
        <meta property="og:url" content={`${SITE_URL}/finance/income-tax-calculator`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema]) }}
        />
      </Head>

      <IncomeTaxCalculator />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Lead */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">India&apos;s Tax System, Made Clear</h2>
          <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl">
            Two regimes, dozens of deductions, and a decision that affects every rupee you earn. Run the numbers above — then read below to understand the strategy behind them.
          </p>
        </div>

        {/* Old vs New Regime */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">⚖️ Old vs New Regime: The Core Trade-off</h2>
          <p className="text-slate-500 mb-6">There&apos;s no universal winner — it depends entirely on your deduction profile.</p>
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Old Regime</div>
              <div className="font-semibold text-slate-800 text-lg mb-3">Higher rates, more deductions</div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>✅ Section 80C — up to ₹1.5L</li>
                <li>✅ HRA exemption</li>
                <li>✅ Home loan interest — up to ₹2L</li>
                <li>✅ Section 80D health insurance</li>
                <li>✅ NPS 80CCD(1B) — extra ₹50k</li>
              </ul>
              <div className="mt-4 bg-indigo-50 rounded-xl p-3 text-xs text-indigo-800">Best when total deductions exceed ₹3–4 lakhs</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">New Regime</div>
              <div className="font-semibold text-slate-800 text-lg mb-3">Lower rates, fewer deductions</div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>✅ Standard deduction ₹75,000</li>
                <li>✅ Lower slab rates</li>
                <li>✅ No lock-in investments needed</li>
                <li>❌ No 80C, HRA, home loan interest</li>
                <li>❌ No 80D deduction</li>
              </ul>
              <div className="mt-4 bg-emerald-50 rounded-xl p-3 text-xs text-emerald-800">Best for young earners with minimal deductions</div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-sm"><strong>Quick rule:</strong> If deductions exceed ~₹3.75L (at ₹10L income) or ~₹4.25L (at ₹15L+), old regime typically wins. Use the calculator above to find your exact crossover.</p>
          </div>
        </section>

        {/* Section 80C */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">💼 Maximising Section 80C (₹1.5 Lakh Limit)</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '📈', name: 'ELSS Mutual Funds', note: '3-yr lock-in', desc: 'Best for wealth creation — equity returns + 80C benefit combined.' },
              { icon: '🏦', name: 'PPF', note: '15-yr maturity', desc: 'Safe, tax-free returns at ~7.1%. Ideal for retirement corpus.' },
              { icon: '💼', name: 'EPF', note: 'Auto-deducted', desc: 'Exempt-Exempt-Exempt status. Best tax treatment available.' },
              { icon: '🏠', name: 'Home Loan Principal', note: 'Via loan statement', desc: 'Counts toward 80C automatically — no extra investment required.' },
              { icon: '🎓', name: "Children's Tuition", note: 'Up to 2 children', desc: 'School fees qualify — use naturally before topping up with ELSS.' },
              { icon: '🏧', name: 'NSC / Tax-Saver FD', note: '5-yr lock-in', desc: 'Predictable returns. Good for risk-averse investors near the limit.' },
            ].map(c => (
              <div key={c.name} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-slate-800 text-sm mb-0.5">{c.name}</div>
                <div className="text-xs text-indigo-600 font-medium mb-2">{c.note}</div>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-900 text-sm"><strong>Avoid:</strong> Insurance-cum-investment products sold only for 80C. They deliver 4–6% returns — poor compared to ELSS, even after tax savings.</p>
          </div>
        </section>

        {/* Other deductions */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🧩 Other High-Value Deductions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: '80D — Health Insurance', val: 'Up to ₹75k', desc: '₹25k self/family + ₹50k for senior citizen parents. Tax benefit on something you should have regardless.' },
              { label: '80CCD(1B) — NPS', val: 'Extra ₹50k', desc: 'Stacks on top of the ₹1.5L 80C limit. Often ignored — easy retirement saving with a meaningful tax break.' },
              { label: 'Section 24 — Home Loan Interest', val: 'Up to ₹2L', desc: 'Combined with 80C principal, home loans can provide ₹3.5L total deductions annually.' },
              { label: '80E — Education Loan Interest', val: 'No cap', desc: 'Entire interest deductible for 8 years. Underused — very valuable for those repaying education debt.' },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-slate-800 text-sm">{c.label}</div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2">{c.val}</span>
                </div>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Life stages */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🕐 Tax Strategy by Life Stage</h2>
          <div className="space-y-3">
            {[
              { stage: 'Early Career (20s)', regime: 'Often New Regime', desc: 'Minimal deductions — lower slab rates usually win. Focus on building income and savings habit.' },
              { stage: 'Mid Career (30s)', regime: 'Often Old Regime', desc: 'Home loan, HRA, 80C maxed, kids — deductions multiply. Old regime pulls ahead significantly.' },
              { stage: 'Pre-Retirement (40s–50s)', regime: 'Review Annually', desc: 'Home loan nears completion, deductions shrink. Re-run the comparison every year — the balance shifts.' },
            ].map(s => (
              <div key={s.stage} className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="w-36 flex-shrink-0">
                  <div className="font-semibold text-slate-800 text-sm">{s.stage}</div>
                  <div className="text-xs text-indigo-600 font-medium mt-0.5">{s.regime}</div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🚫 Tax Planning Mistakes to Avoid</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { t: 'March rush investments', d: 'Buying unsuitable policies under deadline pressure. Plan 80C year-round, allocate at the start of the financial year.' },
              { t: 'Ignoring HRA', d: 'Not collecting rent receipts forfeits one of the largest deductions available to salaried employees.' },
              { t: 'Skipping NPS 80CCD(1B)', d: 'Easy ₹50k extra deduction that stacks beyond 80C — most people leave it on the table every year.' },
              { t: 'No annual regime review', d: 'Life changes — income grows, loans end. Your optimal regime can shift. Recalculate before declaring every April.' },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
                <div className="font-semibold text-slate-800 mb-1 text-sm">❌ {m.t}</div>
                <p className="text-xs text-slate-500">{m.d}</p>
              </div>
            ))}
          </div>
        </section>
        
        <p>
          India's income tax system has become more complex with the introduction of the new tax regime alongside the existing old regime. Taxpayers must now choose between two fundamentally different approaches: the old regime with numerous deductions and exemptions at higher base rates, or the new regime with simplified lower rates but limited deductions. Making the optimal choice requires understanding both systems and your personal financial situation.
        </p>

        <p>
          Beyond just regime selection, strategic tax planning throughout the year can save lakhs over your career. The difference between reactive tax filing and proactive tax optimization compounds dramatically over 30-40 working years, potentially representing 10-15% of lifetime earnings. Yet most people make rushed decisions in March, missing opportunities for structured planning.
        </p>

        <h3>Old vs New Regime: Understanding the Fundamental Trade-off</h3>

        <p>
          The old tax regime offers multiple deductions - Section 80C (₹1.5 lakhs), HRA, home loan interest (₹2 lakhs), standard deduction (₹50k), and many others. However, it taxes income at higher base rates: 5% above ₹2.5 lakhs, 10% above ₹5 lakhs, 20% above ₹10 lakhs, and 30% above ₹15 lakhs (FY 2023-24 rates under old regime).
        </p>

        <p>
          The new regime simplifies with lower rates and higher exemption limits but eliminates most deductions. You retain standard deduction but lose 80C, HRA, home loan interest, and most other benefits. The trade-off is straightforward: if your total deductions exceed certain thresholds, old regime wins. Below those thresholds, new regime saves more.
        </p>

        <p>
          The breakeven point varies by income. For someone earning ₹10 lakhs, roughly ₹2.5-3 lakhs in deductions makes old regime preferable. At ₹15 lakhs income, you need ₹3-3.5 lakhs in deductions for old regime to win. Above ₹20 lakhs, even modest deductions favor old regime due to higher marginal rates under new regime applying to larger amounts.
        </p>

        <p>
          Don't rely on generic advice. Run calculations with your specific salary, available deductions, and compare resulting tax liability under both regimes. The optimal choice changes with life stages - young professionals often benefit from new regime, while homeowners with families typically prefer old regime due to accumulated deductions.
        </p>

        <h3>Maximizing Section 80C: Beyond Just Tax Saving</h3>

        <p>
          Section 80C allows ₹1.5 lakh annual deduction for specified investments and expenses. Most people know about ELSS mutual funds, PPF, and EPF. But 80C also covers life insurance premiums, children's tuition fees, home loan principal repayment, NSC, tax-saver fixed deposits, and even Sukanya Samriddhi Yojana for daughters.
        </p>

        <p>
          The critical mistake is choosing 80C investments purely for tax saving without considering returns and suitability. Traditional insurance policies marketed for tax saving often deliver 4-6% returns - terrible compared to alternatives. You save ₹46,500 in taxes at 30% bracket but sacrifice far more in opportunity cost over 10-20 years.
        </p>

        <p>
          ELSS funds offer the best combination of tax savings and wealth creation potential. With only 3-year lock-in (shortest among 80C options) and equity exposure providing 10-15% historical returns, ELSS helps you save tax while building wealth. Allocate a significant portion of your 80C limit here for long-term goals.
        </p>

        <p>
          PPF suits risk-averse investors, offering 7-7.5% returns with complete safety and 15-year maturity. It's excellent for retirement corpus building. EPF contributions are mandatory for salaried employees and provide similar benefits with even better tax treatment - Exempt-Exempt-Exempt status meaning contributions, growth, and withdrawals are all tax-free.
        </p>

        <p>
          Home loan principal repayment qualifies under 80C. This is automatic once you have a home loan and doesn't require additional investment. Children's tuition fees also qualify, making education expenses effectively tax-deductible. Strategic use involves filling 80C with these natural expenses first, then topping up with ELSS or PPF to reach ₹1.5 lakhs.
        </p>

        <h3>HRA Deduction: Don't Leave Money on the Table</h3>

        <p>
          House Rent Allowance exemption is among the largest deductions for salaried employees, yet many don't optimize it. The exemption is the minimum of: actual HRA received, rent paid minus 10% of salary, or 50% of salary in metros (40% in non-metros). This can easily be ₹2-3 lakhs annually depending on your salary and rent.
        </p>

        <p>
          If you're living with parents, pay them rent with proper documentation. It's legally valid and maximizes HRA benefit. Get a rent agreement, transfer rent via bank, and obtain receipts. Your parents declare it as rental income, but after standard deduction of 30%, the tax impact is often less than your HRA savings, creating net family benefit.
        </p>

        <p>
          For rent above ₹1 lakh annually, you need landlord's PAN. Below ₹1 lakh, just receipts suffice. Maintain systematic records - agreements, receipts, bank transfers. These documents prove the legitimacy if questioned during tax scrutiny. Many people lose substantial HRA benefits simply due to poor documentation.
        </p>

        <p>
          If you own property in one city but work in another, you can claim HRA on rent paid while earning rental income on your property. The rental income gets taxed (after 30% standard deduction), but HRA exemption often exceeds the rental income tax, creating net savings. This leverages both HRA and home loan interest deduction if applicable.
        </p>

        <h3>Beyond Basic Deductions: Advanced Tax Optimization</h3>

        <p>
          Section 80D allows deduction for health insurance premiums - ₹25,000 for self and family, plus another ₹25,000 for parents (₹50,000 if parents are senior citizens). This means up to ₹75,000-1 lakh deduction for health insurance, which you should have anyway. The tax benefit makes comprehensive coverage more affordable.
        </p>

        <p>
          National Pension System (NPS) offers additional ₹50,000 deduction under Section 80CCD(1B), over and above the ₹1.5 lakh 80C limit. This is easy tax saving often ignored. While NPS has withdrawal restrictions, for long-term retirement planning, it combines excellent tax benefits with disciplined saving and reasonable returns.
        </p>

        <p>
          Home loan interest qualifies for up to ₹2 lakh deduction under Section 24. This is separate from 80C principal deduction. Combined, home loans provide massive tax benefits - potentially ₹3.5 lakhs in deductions (₹1.5L principal + ₹2L interest) saving over ₹1 lakh tax at 30% bracket. This is why home loans remain attractive despite interest costs.
        </p>

        <p>
          Education loan interest has no deduction limit under Section 80E. If you're repaying education loans with ₹1.5 lakh annual interest, the entire amount is deductible. This applies only for loans taken for higher education and for up to 8 years. Less known but valuable for those with education debt.
        </p>

        <p>
          Donations under Section 80G provide 50-100% deduction depending on the institution. Contributing to eligible charities or political parties reduces tax while supporting causes. Ensure institutions qualify under 80G and maintain proper receipts. This helps those wanting to give back while optimizing taxes.
        </p>

        <h3>Salary Structure Optimization</h3>

        <p>
          How your salary is structured significantly affects tax liability beyond gross amount. Components like Leave Travel Allowance (LTA), meal coupons, telephone/internet reimbursements, and vehicle allowances receive favorable tax treatment. Work with your employer to restructure salary within the same CTC for better post-tax income.
        </p>

        <p>
          LTA exemption covers actual travel costs twice in a block of four years. Plan expensive family travel and claim LTA to offset costs with tax savings. Meal coupons up to ₹50 per meal are tax-free and widely acceptable. This can save ₹15-20k annually in taxes while covering actual food expenses.
        </p>

        <p>
          Telephone and internet reimbursements for work use are non-taxable. Vehicle allowance and driver salary have partial exemptions. Standard deduction of ₹50,000 applies automatically to salary income, reducing taxable income without any action. Understand each component's tax treatment and maximize favorable ones.
        </p>

        <p>
          Performance bonuses can be tax-optimized by timing. If you expect a bonus, having it paid after March but in the same financial year (April-May) when you've already maxed 80C investments means it gets taxed at your normal rate. Strategic timing of income receipt helps manage tax brackets and deduction utilization.
        </p>

        <h3>Common Tax Planning Mistakes That Cost You</h3>

        <p>
          Last-minute 80C investments in March lead to poor decisions. Insurance agents sell unsuitable policies purely for tax saving. People buy tax-saver FDs yielding 6% when ELSS could deliver 12-15%. Rushed planning costs far more in opportunity cost than the tax saved. Plan year-round, not quarter-end.
        </p>

        <p>
          Ignoring regime choice evaluation is another error. Many stick with old regime from habit without checking if new regime now saves more due to life changes. Similarly, some switch to new regime without calculating if their deductions actually make old regime better. Run annual comparisons.
        </p>

        <p>
          Not maintaining proper documentation for deductions causes problems during scrutiny. Keep rent receipts, investment proofs, loan statements, and medical insurance premium receipts systematically. Digital copies work fine. When you can't substantiate deductions, you lose them entirely, not just paying modest penalties.
        </p>

        <p>
          Failing to claim eligible deductions leaves money with the government. Many people don't realize education loan interest is deductible or that donations qualify. HRA goes unclaimed due to lack of receipts. Review all possible deductions annually and ensure you're claiming everything legitimately available.
        </p>

        <h3>Tax Planning Through Life Stages</h3>

        <p>
          In your 20s as a young professional, you likely have minimal deductions - some 80C via EPF and perhaps ELSS. New regime often wins here with lower rates outweighing lost deductions. Focus on building career income and developing saving habits. Tax minimization is secondary to wealth accumulation rate.
        </p>

        <p>
          In your 30s with marriage, home purchase, and children, deductions multiply. HRA, home loan interest and principal, children's education, and maxed-out 80C shift the advantage to old regime. This is when strategic tax planning delivers maximum benefit. Structure salary smartly, document everything, and optimize across all available sections.
        </p>

        <p>
          In your 40s and 50s approaching retirement, tax planning integrates with retirement planning. NPS contributions provide dual benefit of tax saving and retirement corpus. Health insurance for parents and self becomes significant expense and deduction. Home loans may be paid off, reducing deductions and potentially making new regime competitive again.
        </p>

        <p>
          Post-retirement, if you have pension or rental income, different strategies apply. Senior citizens get higher basic exemption limits and health insurance deduction limits. Interest income from savings accounts gets ₹50,000 exemption under Section 80TTB. Advance planning for post-retirement income sources helps minimize tax in retirement years.
        </p>

        <h3>Integrating Tax Planning With Financial Goals</h3>

        <p>
          The best tax planning aligns with broader financial objectives rather than just minimizing taxes. Tax-saving ELSS should be part of equity allocation for long-term goals, not standalone products. PPF should align with retirement planning. NPS should supplement retirement corpus building, leveraging the 80CCD(1B) benefit.
        </p>

        <p>
          Don't let tax tail wag the investment dog. Buying poor-return insurance just for ₹1.5 lakh 80C deduction saves ₹46,500 tax but costs you far more in lost returns over 20 years. Better to pay the tax and invest in higher-return vehicles, or use better 80C options like ELSS that combine tax saving with wealth building.
        </p>

        <p>
          Calculate after-tax returns when comparing investments. A tax-free bond yielding 5.5% may beat a taxable bond at 8% if you're in 30% bracket (8% becomes 5.6% after-tax). PPF at 7.1% tax-free beats many taxable options. Always compare on equal footing considering your marginal tax rate.
        </p>


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
              { href: '/finance/sip-calculator', title: 'SIP Calculator', desc: 'Calculate ELSS SIP returns for tax-saving and wealth creation.' },
              { href: '/finance/compound-interest-calculator', title: 'Compound Interest Calculator', desc: 'See how PPF, EPF, and NPS compound over decades.' },
              { href: '/finance/fire-calculator', title: 'FIRE Calculator', desc: 'Optimize post-retirement income for tax efficiency.' },
              { href: '/finance/mortgage-calculator', title: 'Mortgage Calculator', desc: 'Understand home loan EMI and Section 24 / 80C deductions.' },
              { href: '/finance/amortization-calculator', title: 'Amortization Calculator', desc: 'See yearly interest for Section 24 planning and principal for 80C.' },
            ].map(t => (
              <Link key={t.href} href={t.href} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all">
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
