import Head from 'next/head';
import Link from 'next/link';
import SIPWealthPlanner from '../../components/SIPWealthPlanner/SIPWealthPlanner';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function SIPCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/sip-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a SIP and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Systematic Investment Plan (SIP) is a disciplined investment method where you invest a fixed amount regularly (monthly/quarterly) in mutual funds. It automates investing and leverages rupee cost averaging - buying more units when prices are low and fewer when high, reducing the impact of market volatility over time."
        }
      },
      {
        "@type": "Question",
        "name": "Should I increase my SIP amount every year?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, increasing your SIP by 10-15% annually (step-up SIP) significantly accelerates wealth creation. As your income grows, stepping up contributions helps you reach financial goals faster while maintaining the same lifestyle discipline. Even a 10% annual increase can nearly double your corpus over 20 years compared to a flat SIP."
        }
      },
      {
        "@type": "Question",
        "name": "What returns can I expect from SIP investments?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Historical equity mutual fund returns in India have averaged 12-15% annually over long periods, though past performance doesn't guarantee future results. Conservative planners use 10-12% for projections. Debt funds typically yield 6-8%, while hybrid funds fall between these ranges depending on their equity-debt mix."
        }
      },
      {
        "@type": "Question",
        "name": "How much should I invest in SIP monthly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Start with at least 20% of your take-home income if possible, allocating it across goals. Begin small if needed - even ₹1,000 monthly builds the habit. The key is consistency and gradual increases. Use this calculator to see how different amounts grow over time and align investments with specific financial goals."
        }
      },
      {
        "@type": "Question",
        "name": "Can I stop my SIP during market downturns?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Stopping SIP during downturns is counterproductive - that's when you accumulate more units at lower prices. Market volatility is your friend in SIPs through rupee cost averaging. Historical data shows investors who continued SIPs through crashes like 2008 or 2020 achieved significantly better returns than those who paused."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SIP Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate systematic investment plan returns with step-up options and visualize wealth accumulation over time.",
    "url": `${SITE_URL}/finance/sip-calculator`
  };

  return (
    <>
      <Head>
        <title>SIP Calculator — Mutual Fund Returns with Step-Up SIP | Toolisk</title>
        <meta 
          name="description" 
          content="Calculate SIP returns with annual step-up options. Visualize wealth growth from systematic investments, plan goal-based SIPs, and optimize monthly contributions." 
        />
        <meta 
          name="keywords" 
          content="SIP calculator, systematic investment plan, mutual fund calculator, step-up SIP, rupee cost averaging, wealth planning, investment calculator, goal planning" 
        />
        <link rel="canonical" href={`${SITE_URL}/finance/sip-calculator`} />
        <meta property="og:title" content="SIP Calculator — Mutual Fund Returns with Step-Up SIP" />
        <meta property="og:description" content="Calculate SIP returns with annual step-up options. Visualize wealth growth and plan goal-based investments." />
        <meta property="og:url" content={`${SITE_URL}/finance/sip-calculator`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="SIP Calculator — Mutual Fund Returns with Step-Up SIP | Toolisk" />
        <meta name="twitter:description" content="Calculate SIP returns with step-up options. Plan goal-based investments and visualize wealth growth over time." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema]) }}
        />
      </Head>

      <SIPWealthPlanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Lead */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white">
          <h2 className="text-3xl font-bold mb-3">The SIP Strategy Guide</h2>
          <p className="text-emerald-100 text-lg leading-relaxed max-w-3xl">
            SIPs remove the need to time the market. The real variables are how much you invest, how consistently you step it up, and how patiently you hold through volatility.
          </p>
        </div>

        {/* Step-up power */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">📈 The Step-Up That Changes Everything</h2>
          <p className="text-slate-500 mb-6">A flat SIP is a missed opportunity. Increasing by just 10% annually makes a massive difference.</p>
          <div className="grid sm:grid-cols-3 gap-5 mb-5">
            <div className="bg-slate-900 text-white rounded-2xl p-5">
              <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Flat SIP</div>
              <div className="text-2xl font-bold mb-1">~₹1 Cr</div>
              <p className="text-slate-400 text-sm">₹10,000/mo × 20 yrs @ 12% — no step-up.</p>
            </div>
            <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-lg scale-105">
              <div className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">10% Step-Up / Year</div>
              <div className="text-2xl font-bold mb-1">~₹1.8 Cr</div>
              <p className="text-emerald-100 text-sm">Same discipline, same income share — 80% more wealth.</p>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-5">
              <div className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2">15% Step-Up / Year</div>
              <div className="text-2xl font-bold mb-1">~₹2.5 Cr</div>
              <p className="text-slate-400 text-sm">Matches income growth in strong career trajectories.</p>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <p className="text-emerald-900 text-sm">Most fund houses offer automatic step-up in SIP mandates. Set it once and it compounds forever without requiring annual willpower.</p>
          </div>
        </section>

        {/* Volatility discipline */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">🏋️ Staying Invested Through Crashes</h2>
          <p className="text-slate-500 mb-6">Stopping SIPs during downturns is the single biggest mistake retail investors make.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-lg font-bold text-slate-800 mb-2">2008 Financial Crisis</div>
              <p className="text-sm text-slate-500 mb-3">Markets fell 60%+. SIP investors who continued accumulated units at generational lows. Those who paused missed the entire recovery rally.</p>
              <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-800 font-medium">Continued → significant outperformance over 5 years</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-lg font-bold text-slate-800 mb-2">2020 COVID Crash</div>
              <p className="text-sm text-slate-500 mb-3">Nifty fell 40% in weeks. Investors who maintained SIPs in March–April 2020 saw those units double within 12 months.</p>
              <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-800 font-medium">Temporary pain → accelerated wealth creation</div>
            </div>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-amber-900 text-sm"><strong>Expect:</strong> 10–20% corrections happen frequently. 30%+ crashes occur every few years. That&apos;s not a bug — it&apos;s what makes long-term SIPs effective.</p>
          </div>
        </section>

        {/* Horizon guide */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">⏳ Choosing the Right Fund for Your Timeline</h2>
          <div className="space-y-3">
            {[
              { horizon: 'Under 3 years', fund: 'Debt / Liquid funds', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200', desc: 'Equity volatility without enough time to average out. Use debt instruments instead.' },
              { horizon: '3–7 years', fund: 'Balanced / Hybrid funds', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', desc: 'Mix of equity and debt. Benefits from SIP averaging while limiting downside.' },
              { horizon: '10–20+ years', fund: 'Pure equity funds', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', desc: 'Long runway for compounding. Historical probability of positive 10-year returns is very high.' },
            ].map(row => (
              <div key={row.horizon} className={`flex gap-4 rounded-2xl border p-5 ${row.bg}`}>
                <div className="w-28 flex-shrink-0">
                  <div className="text-sm font-semibold text-slate-700">{row.horizon}</div>
                  <div className={`text-xs font-bold mt-0.5 ${row.color}`}>{row.fund}</div>
                </div>
                <p className="text-sm text-slate-600">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common mistakes */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🚫 Common SIP Mistakes</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { t: 'Starting too small and never increasing', d: 'A ₹500/mo SIP started in 2010 is still ₹500 in 2025 for most people. Build in step-ups from day one.' },
              { t: 'Too many funds (over-diversification)', d: 'Owning 12 funds doesn\'t add diversification — it just makes tracking harder. 3–5 well-chosen funds are enough.' },
              { t: 'Stopping during downturns', d: 'The worst time to pause is when prices are low. That\'s when you accumulate the most units per rupee.' },
              { t: 'No goal mapping', d: 'Generic SIPs get redeemed prematurely. Map each SIP to a specific goal (education, retirement, house) with a clear timeline.' },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
                <div className="font-semibold text-slate-800 mb-1 text-sm">❌ {m.t}</div>
                <p className="text-xs text-slate-500">{m.d}</p>
              </div>
            ))}
          </div>
        </section>
        
        <p>
          Systematic Investment Plans have revolutionized how Indians invest in mutual funds. Rather than trying to time the market with lump-sum investments, SIPs let you invest a fixed amount regularly - typically monthly - building wealth gradually through disciplined investing. This approach removes the psychological burden of market timing and makes investing accessible regardless of market conditions.
        </p>

        <p>
          The real power of SIPs lies in rupee cost averaging. When markets are high, your fixed investment amount buys fewer units. When markets drop, the same amount buys more units. Over time, this averages out your purchase cost, reducing the impact of volatility. Many investors who stayed disciplined through market crashes ultimately benefited because they accumulated units at depressed prices that later recovered.
        </p>

        <h3>Sizing Your Monthly Contribution</h3>

        <p>
          How much should you invest monthly? Financial advisors typically recommend allocating at least 20% of your take-home income toward investments, but this should be distributed across different goals - retirement, children's education, home down payment, and emergency funds. Your SIP amount depends on your goals, timeline, and current financial situation.
        </p>

        <p>
          Start by calculating what you need. If you're targeting ₹1 crore in 20 years and assume 12% returns, you'll need roughly ₹10,000 monthly. Need the same corpus in 15 years? That jumps to ₹18,000 monthly. The calculator above helps you reverse-engineer these numbers based on your specific goal and timeline.
        </p>

        <p>
          Don't let perfect be the enemy of good. If you can only afford ₹2,000 monthly right now, start there. Building the habit matters more than the amount initially. You can always increase contributions as your income grows. Many investors begin small and step up their SIP annually, ultimately building substantial wealth.
        </p>

        <h3>The Step-Up Strategy That Changes Everything</h3>

        <p>
          Here's where most investors leave money on the table: they start a SIP and never increase it. Your income likely grows 10-15% annually, but if your investments stay flat, you're actually becoming less disciplined relative to your earnings. Step-up SIPs solve this by automatically increasing your contribution annually.
        </p>

        <p>
          The math is compelling. Investing ₹10,000 monthly for 20 years at 12% returns generates about ₹1 crore. But if you increase that SIP by just 10% annually - going from ₹10,000 to ₹11,000 after year one, ₹12,100 after year two, and so on - your final corpus jumps to approximately ₹1.8 crores. That's 80% more wealth from the same disciplined percentage of your growing income.
        </p>

        <p>
          Implementing step-ups is straightforward. Most fund houses now offer automatic top-up facilities where your SIP increases by a preset percentage annually. Alternatively, manually increase your SIP after annual appraisals or bonuses. The key is making it systematic so it happens without requiring willpower each year.
        </p>

        <h3>Handling Market Volatility With Discipline</h3>

        <p>
          Every SIP investor faces moments when markets tank and doubts creep in. You see your statements in red and wonder if you should pause contributions until things improve. This thinking, while natural, undermines the entire premise of systematic investing.
        </p>

        <p>
          Market downturns are precisely when SIPs work hardest for you. Consider the 2008 financial crisis: investors who continued their SIPs through that brutal period bought units at rock-bottom prices that subsequently multiplied in value. Those who paused missed accumulating units at generational lows and had to buy back in at higher prices later.
        </p>

        <p>
          The 2020 COVID crash offers another lesson. Markets fell 40% in weeks, and many investors panicked. But those who maintained SIPs during March-April 2020 acquired units that doubled within a year. The temporary pain of seeing negative returns transformed into accelerated wealth creation because they continued buying during the sale.
        </p>

        <p>
          Building emotional resilience for such periods starts with proper expectations. Know that 10-20% corrections happen frequently, and 30%+ crashes occur every few years. If you're investing for 15-20 years, you'll definitely experience multiple downturns. That's not a bug - it's a feature that makes your SIP more effective.
        </p>

        <h3>Choosing Your Investment Horizon</h3>

        <p>
          SIPs work best over long periods - ideally 10 years or more. Short-term equity SIPs (under 3 years) expose you to market risk without enough time for rupee cost averaging to smooth returns. If you need money within 3 years, debt funds or liquid schemes make more sense despite lower returns.
        </p>

        <p>
          For 5-7 year goals, hybrid or balanced advantage funds offer a middle path, mixing equity exposure with debt stability. These still benefit from rupee cost averaging while reducing downside risk through automatic rebalancing based on market valuations.
        </p>

        <p>
          The sweet spot for pure equity SIPs is 10-20 years or longer. This timeframe has historically delivered positive returns with very high probability, regardless of when you started. The longer you invest, the more short-term volatility gets averaged out and the more compounding works in your favor.
        </p>

        <h3>Tax Considerations and Fund Selection</h3>

        <p>
          Equity mutual funds held over a year qualify for long-term capital gains tax at 10% on gains above ₹1 lakh annually. Short-term gains (under a year) face 15% tax. This creates a clear incentive for staying invested long-term. Many investors redeem and reinvest unnecessarily, triggering avoidable taxes.
        </p>

        <p>
          For SIPs specifically, each monthly instalment has its own purchase date, creating multiple tax lots. When you redeem, units are sold on a first-in-first-out basis. If you've been investing for years, early units are long-term holdings with lower tax rates, while recent units might be short-term. Good fund platforms track this automatically, but understanding the mechanics helps with tax planning.
        </p>

        <p>
          Fund selection matters tremendously for long-term results. A seemingly small 2% annual return difference compounds dramatically over 20 years. Focus on funds with consistent long-term track records rather than recent top performers. Low expense ratios also matter - every 0.5% saved in fees directly boosts your returns.
        </p>

        <h3>Common Mistakes to Avoid</h3>

        <p>
          Starting too conservatively is common. Many investors begin with ₹500-1,000 monthly, never to increase it. While starting small beats not starting, plan your step-up strategy from day one. Link SIP increases to annual raises so they happen automatically.
        </p>

        <p>
          Over-diversification dilutes returns. You don't need 15 funds; 3-5 covering large-cap, mid-cap, and maybe small-cap or international equity provides sufficient diversification. More funds just make portfolio monitoring harder without adding real diversification benefits.
        </p>

        <p>
          Stopping SIPs to book profits during market euphoria is another error. If your goal is years away, stay invested. Tax-loss harvesting or rebalancing might make sense, but completely exiting because markets seem high means trying to time the market - the very thing SIPs help you avoid.
        </p>

        <h3>Making SIPs Work for Multiple Goals</h3>

        <p>
          Rather than one generic SIP, map investments to specific goals with different timelines. Start dedicated SIPs for your child's education (15 years), retirement (25 years), and home down payment (7 years). This clarity helps you choose appropriate funds for each timeline and prevents premature redemptions.
        </p>

        <p>
          Use goal-based calculators to determine required monthly investments for each objective. The retirement goal might need aggressive equity exposure, while the 7-year down payment goal might warrant balanced funds. This targeted approach ensures you're making appropriate risk-return trade-offs for each goal.
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
              { href: '/finance/compound-interest-calculator', title: 'Compound Interest Calculator', desc: 'Model lump-sum investment growth alongside your SIP.' },
              { href: '/finance/fire-calculator', title: 'FIRE Calculator', desc: 'Plan your financial independence corpus and retirement timeline.' },
              { href: '/finance/income-tax-calculator', title: 'Income Tax Calculator', desc: 'Optimise ELSS for tax-saving within 80C while building wealth.' },
              { href: '/finance/amortization-calculator', title: 'Amortization Calculator', desc: 'See loan principal vs interest breakdown to decide: prepay or invest via SIP.' },
            ].map(t => (
              <Link key={t.href} href={t.href} className="block p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-400 hover:shadow-md transition-all">
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
