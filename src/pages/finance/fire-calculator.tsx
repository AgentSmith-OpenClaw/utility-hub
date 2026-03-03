import Head from 'next/head';
import Link from 'next/link';
import FIRECalculator from '../../components/FIRECalculator/FIRECalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function FIRECalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/fire-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the 4% rule for FIRE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 4% rule suggests you can withdraw 4% of your retirement corpus annually, adjusted for inflation, with high probability your money lasts 30+ years. It originates from US historical data. In India, conservative planners use 3-3.5% due to longer lifespans, higher inflation volatility, and less developed markets. A ₹1 crore corpus supports ₹3-4 lakh annual expenses safely."
        }
      },
      {
        "@type": "Question",
        "name": "How much corpus do I need to retire early in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Multiply your annual expenses by 25-33 depending on safety margin desired. For ₹10 lakh annual expenses, target ₹2.5-3.3 crores. This assumes 3-4% safe withdrawal rate. Factor in healthcare inflation, lifestyle changes, and no pension income. Most successful FIRE achievers in India target 30-35x annual expenses for comfortable early retirement."
        }
      },
      {
        "@type": "Question",
        "name": "What is sequence of returns risk?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Early portfolio losses during retirement are devastating because you're withdrawing simultaneously. A 30% crash in your first retirement year forces selling units at depressed prices, permanently reducing your corpus. The same average returns in different sequences produce vastly different outcomes. This is why retirees need conservative asset allocation and cash buffers."
        }
      },
      {
        "@type": "Question",
        "name": "Should I include my home value in my FIRE number?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, unless you plan to sell and downsize or rent. Your primary residence provides housing, not income. If you need ₹8 lakhs annually and own a ₹2 crore house, you still need separate corpus to generate that ₹8 lakhs. Only count home equity if you'll definitely liquidate it during retirement - which most people don't."
        }
      },
      {
        "@type": "Question",
        "name": "Is Coast FIRE more realistic than full FIRE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For many people, yes. Coast FIRE means accumulating enough that compound growth covers retirement without additional contributions, letting you work less stressfully for current expenses. Barista FIRE involves part-time work covering living costs while investments compound. These variants reduce the massive corpus needed for full early retirement while improving quality of life."
        }
      }
    ]
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FIRE Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate your Financial Independence Retire Early (FIRE) corpus based on expenses, withdrawal rate, and timeline.",
    "url": `${SITE_URL}/finance/fire-calculator`,
    "operatingSystem": "All",
    "featureList": "FIRE number calculation, Lean/Fat/Coast/Barista FIRE comparison, Portfolio projection, Milestone tracking, PDF export, Excel export"
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your FIRE Number",
    "description": "Use the free Toolisk FIRE Calculator to determine how much you need to retire early and compare FIRE strategies.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter your monthly expenses",
        "text": "Input your current monthly living expenses. This is the foundation for calculating your FIRE corpus — the amount needed to sustain your lifestyle without working."
      },
      {
        "@type": "HowToStep",
        "name": "Set your financial details",
        "text": "Enter your current age, target retirement age, existing savings, monthly investment amount, and expected return rate."
      },
      {
        "@type": "HowToStep",
        "name": "Adjust withdrawal rate",
        "text": "Choose a safe withdrawal rate (typically 3-4%). A lower rate means a larger corpus but more security. The calculator shows your target FIRE number."
      },
      {
        "@type": "HowToStep",
        "name": "Compare FIRE strategies",
        "text": "Review and compare Lean FIRE, Fat FIRE, Coast FIRE, and Barista FIRE strategies to find the approach that matches your goals and risk tolerance."
      },
      {
        "@type": "HowToStep",
        "name": "Track milestones and export",
        "text": "View your projected milestone timeline, review the year-by-year portfolio projection chart, and export your FIRE plan as PDF or Excel."
      }
    ]
  };

  return (
    <>
      <Head>
        <title>FIRE Calculator — Plan Early Retirement & Financial Freedom | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate your FIRE number and early retirement timeline. Compare Lean, Fat, Coast & Barista FIRE strategies with safe withdrawal rate analysis and milestone tracking." 
        />
        <meta 
          name="keywords" 
          content="FIRE calculator, financial independence, early retirement, safe withdrawal rate, Coast FIRE, Barista FIRE, Lean FIRE, retirement corpus" 
        />
        <link rel="canonical" href={`${SITE_URL}/finance/fire-calculator`} />
        <meta property="og:title" content="FIRE Calculator — Plan Early Retirement & Financial Freedom" />
        <meta property="og:description" content="Calculate your FIRE number and retirement timeline. Compare Lean, Fat, Coast & Barista FIRE strategies." />
        <meta property="og:url" content={`${SITE_URL}/finance/fire-calculator`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FIRE Calculator — Plan Early Retirement & Financial Freedom | Toolisk" />
        <meta name="twitter:description" content="Calculate your FIRE number. Compare Lean, Fat, Coast & Barista FIRE with safe withdrawal rate analysis." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema, howToSchema]) }}
        />
      </Head>

      <FIRECalculator />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* About This Tool */}
        <section className="bg-orange-50 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">About This FIRE Calculator</h2>
          <p className="text-slate-600 mb-6">The free Toolisk FIRE Calculator helps you determine your financial independence number, compare retirement strategies, and plan your path to early retirement with confidence.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              '🎯 Multiple FIRE strategy comparisons',
              '📊 4 interactive calculation modes',
              '💰 Safe withdrawal rate analysis',
              '📈 Milestone timeline tracking',
              '💾 Export plans to PDF & Excel',
              '🔄 Save & share FIRE goals via URL',
            ].map(f => <div key={f} className="flex gap-3 items-start"><span className="mt-0.5">{f.split(' ')[0]}</span><span className="text-slate-700 text-sm">{f.substring(2)}</span></div>)}
          </div>
        </section>

        {/* How to Use */}
        <section className="bg-slate-50 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">How to Use This Calculator</h2>
          <p className="text-slate-500 mb-6">Follow these steps to get accurate results in under a minute.</p>
          <ol className="space-y-5">
            {[
              { n: 1, title: 'Enter your monthly expenses', desc: 'Input your current monthly living expenses. This is the foundation for calculating your FIRE corpus — the amount needed to sustain your lifestyle without working.' },
              { n: 2, title: 'Set your financial details', desc: 'Enter your current age, target retirement age, existing savings, monthly investment amount, and expected return rate.' },
              { n: 3, title: 'Adjust withdrawal rate', desc: 'Choose a safe withdrawal rate (typically 3–4%). A lower rate means a larger corpus but more security. The calculator shows your target FIRE number.' },
              { n: 4, title: 'Compare FIRE strategies', desc: 'Review and compare Lean FIRE, Fat FIRE, Coast FIRE, and Barista FIRE strategies to find the approach that matches your goals and risk tolerance.' },
              { n: 5, title: 'Track milestones and export', desc: 'View your projected milestone timeline, review the year-by-year portfolio projection chart, and export your FIRE plan as PDF or Excel.' },
            ].map(s => (
              <li key={s.n} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{s.n}</span>
                <div>
                  <p className="font-semibold text-slate-900">{s.title}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Lead */}
        <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">Your FIRE Roadmap</h2>
          <p className="text-orange-100 text-lg leading-relaxed max-w-3xl">
            Financial independence doesn&apos;t mean you stop working — it means you work because you want to. The math is simple; the discipline is the hard part.
          </p>
        </div>

        {/* FIRE Number */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">🎯 Calculating Your FIRE Number</h2>
          <p className="text-slate-500 mb-6">Multiply annual expenses by a safe withdrawal multiplier. The right number depends on how conservative you want to be.</p>
          <div className="grid sm:grid-cols-3 gap-5 mb-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-orange-600 font-bold text-sm uppercase tracking-widest mb-2">Aggressive (4%)</div>
              <div className="text-lg font-bold text-slate-800 mb-1">25× annual spend</div>
              <p className="text-xs text-slate-500">Historical US market data. Works in stable, low-inflation environments. Less reliable for 40+ year retirements.</p>
            </div>
            <div className="bg-orange-500 text-white rounded-2xl p-6 shadow-lg scale-105">
              <div className="text-orange-100 font-bold text-sm uppercase tracking-widest mb-2">Balanced (3.3%)</div>
              <div className="text-lg font-bold mb-1">30× annual spend</div>
              <p className="text-orange-100 text-xs">Recommended for India — higher inflation volatility, longer horizons, no pension system.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-teal-600 font-bold text-sm uppercase tracking-widest mb-2">Conservative (3%)</div>
              <div className="text-lg font-bold text-slate-800 mb-1">33× annual spend</div>
              <p className="text-xs text-slate-500">For early retirees in their 40s, healthcare buffers, or those with volatile income history.</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-sm"><strong>Don&apos;t count your primary home.</strong> It provides shelter, not income. Only count assets that generate withdrawable returns in your FIRE number.</p>
          </div>
        </section>

        {/* FIRE Variants */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🔥 FIRE Is Not One Size Fits All</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Coast FIRE', color: 'bg-blue-50 border-blue-200', label: 'text-blue-700', desc: 'Accumulate enough that compound growth alone reaches full FIRE by traditional retirement age. Work only for living expenses — no more forced savings.' },
              { name: 'Barista FIRE', color: 'bg-purple-50 border-purple-200', label: 'text-purple-700', desc: 'Partial corpus + part-time/gig work covering expenses. Stay professionally active, reduce stress, let investments grow.' },
              { name: 'Lean FIRE', color: 'bg-orange-50 border-orange-200', label: 'text-orange-700', desc: 'Minimalist lifestyle in lower-cost cities. Lower corpus target, but thin margins can be strained by healthcare emergencies or family obligations.' },
            ].map(v => (
              <div key={v.name} className={`rounded-2xl border p-6 ${v.color}`}>
                <div className={`font-bold text-lg mb-2 ${v.label}`}>{v.name}</div>
                <p className="text-sm text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* India-specific */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🇮🇳 India-Specific FIRE Factors</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🏥', t: 'Healthcare is the biggest wildcard', d: 'No Medicare equivalent. Premiums rise to ₹80k–1.5L/yr by your 60s. Budget healthcare inflation at 10–12%, not 6%.' },
              { icon: '📈', t: 'Inflation is more volatile', d: 'Indian CPI averages 5–6% but spikes to 10%+ periodically. A rigid 4% withdrawal rule is riskier here than in developed markets.' },
              { icon: '👨‍👩‍👧', t: 'Family obligations are real', d: 'Supporting parents, extended-family expectations, and children beyond 18 are common costs many FIRE plans don\'t budget for.' },
              { icon: '🏠', t: 'Own your home before FIREing', d: 'Eliminating rent (30–40% of income) dramatically reduces required corpus. Prioritise debt-free homeownership first.' },
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

        {/* Common mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🚫 FIRE Planning Mistakes That Sink Plans</h2>
          <div className="space-y-3">
            {[
              { n: '01', t: 'Underestimating expenses', d: 'Retirees often spend more initially on travel and hobbies. Healthcare escalates. Add a 20–30% buffer above current spending in your FIRE number.' },
              { n: '02', t: 'Using today\'s rupees for future targets', d: '₹50k/mo today becomes ₹1.1L in 15 years at 5% inflation. Your FIRE number must be in future rupees, or you must use real (inflation-adjusted) returns.' },
              { n: '03', t: 'Optimistic return assumptions', d: 'Plan on 10–12% equity, 6–8% debt. Using 15% historical returns as your base risks a significant shortfall at the worst possible time.' },
              { n: '04', t: 'Ignoring withdrawal taxes', d: 'LTCG on equity (10%+ above ₹1L/yr), debt as income. Calculate post-tax withdrawals — not gross corpus returns — when sizing your corpus.' },
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
              { href: '/finance/sip-calculator', title: 'SIP Calculator', desc: 'Build your FIRE corpus with disciplined monthly SIPs and step-ups.' },
              { href: '/finance/compound-interest-calculator', title: 'Compound Interest Calculator', desc: 'See how your corpus grows during the withdrawal phase.' },
              { href: '/finance/income-tax-calculator', title: 'Income Tax Calculator', desc: 'Optimise taxes during accumulation to accelerate your FIRE date.' },
              { href: '/finance/mortgage-calculator', title: 'Mortgage Calculator', desc: 'Owning your home debt-free significantly lowers your FIRE corpus requirement.' },
            ].map(t => (
              <Link key={t.href} href={t.href} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-orange-400 hover:shadow-md transition-all">
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

