import Head from 'next/head';
import FDCalculator from '../../components/Finance/FDCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/finance/fd-calculator';

const FAQS = [
  {
    q: 'How is FD interest calculated?',
    a: 'Indian banks use compound interest, typically compounded quarterly. The formula is A = P × (1 + r/n)^(n×t), where P is principal, r is the annual rate, n is compounding periods per year (4 for quarterly), and t is years. Most bank FDs compound quarterly; some senior-citizen schemes and small finance banks compound monthly.',
  },
  {
    q: 'What is the difference between monthly and quarterly compounding?',
    a: 'Monthly compounding earns slightly more — about 0.1–0.2% extra effective yield over a 5-year FD at 7%. On a ₹1 lakh, 5-year FD, the difference is roughly ₹700–1,200. Quarterly compounding is the Indian banking standard; monthly is available at select banks and small finance banks but rarely worth switching for unless the rate is already competitive.',
  },
  {
    q: 'Do senior citizens really get 0.5% more interest?',
    a: 'Yes — almost every Indian bank offers an additional 0.25–0.75% (commonly 0.5%) on FDs for citizens above 60. Some small finance banks offer even higher senior premiums. The TDS exemption is also higher (₹50,000 of interest vs ₹40,000 for regular customers). Combined, senior FDs are one of the best risk-free yields available in India.',
  },
  {
    q: 'When is TDS deducted on FD interest?',
    a: 'TDS at 10% applies if your total FD interest from a single bank exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). If your total income is below the taxable threshold, submit Form 15G (or 15H for seniors) to your bank to avoid TDS. Note: TDS is deducted at 20% if you have not submitted your PAN to the bank.',
  },
  {
    q: 'Should I prefer cumulative or non-cumulative FDs?',
    a: 'Cumulative FDs reinvest the interest, so it compounds — best for wealth growth. Non-cumulative FDs pay interest monthly, quarterly, or annually to your bank account — useful if you need regular income (retirees, expense planning). Both earn similar gross interest; the difference is whether the interest compounds inside the FD or sits in your savings account at lower rates.',
  },
  {
    q: 'How is FD interest taxed?',
    a: 'FD interest is fully taxable at your slab rate — added to your total income under "Income from Other Sources". TDS is withheld at 10% (or 20% without PAN), but you still owe the difference if your slab is higher. A 30%-slab earner with ₹50,000 of FD interest owes ₹15,000 tax, of which ₹5,000 is already withheld as TDS — the remaining ₹10,000 is paid via your ITR.',
  },
];

export default function FDCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Fixed Deposit (FD) Calculator',
    slug: SLUG,
    description:
      'Free FD calculator — compute maturity value, total interest, and post-tax returns on Indian Fixed Deposits. Includes senior citizen rates, TDS modeling, and multiple compounding frequencies.',
    category: 'FinanceApplication',
    featureList:
      'Maturity value, Post-tax returns, Senior citizen rates, TDS modeling, Multiple compounding frequencies, Multi-currency',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>FD Calculator — Fixed Deposit Maturity & Interest | Toolisk</title>
        <meta
          name="description"
          content="Free Fixed Deposit (FD) calculator. Compute maturity value, total interest, and post-tax returns. Senior citizen rates, TDS modeling, and monthly/quarterly/annual compounding."
        />
        <meta
          name="keywords"
          content="fd calculator, fixed deposit calculator, fd maturity calculator, fd interest calculator india, sbi fd calculator, post tax fd calculator, senior citizen fd calculator"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="FD Calculator — Fixed Deposit Maturity & Interest | Toolisk" />
        <meta
          property="og:description"
          content="Calculate FD maturity, total interest, and post-tax returns instantly."
        />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]),
          }}
        />
      </Head>

      <ToolShell
        parent="finance"
        icon="🏦"
        title="Fixed Deposit (FD) Calculator"
        tagline="Compute FD maturity, total interest, senior citizen premium, and the real post-tax return — instantly."
        gradient="from-emerald-600 via-teal-600 to-cyan-600"
      >
        <FDCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A Fixed Deposit calculator built for the way Indian banks actually run FDs — quarterly compounding by default, a built-in senior citizen premium toggle, and full post-tax modeling including TDS thresholds. Get maturity value, total interest, and what you actually take home after tax, in seconds."
        features={[
          '🏦 Quarterly compounding (Indian banking default) + monthly/half-yearly/annual options',
          '👴 Senior citizen rate toggle (+0.5% on most schemes)',
          '💰 Post-tax maturity calculation with your slab rate',
          '⚠️ TDS threshold alerts (₹40,000 / ₹50,000 for seniors)',
          '📊 Principal vs interest breakdown chart',
          '💾 PDF / Excel export with full summary',
        ]}
        steps={[
          { title: 'Enter principal', desc: 'The lumpsum amount you plan to deposit.' },
          { title: 'Set interest rate', desc: 'Current FD rates in India range 5.5–7.5% for 1–5 year tenures.' },
          { title: 'Pick tenure', desc: 'Years and months — Indian banks support FDs from 7 days to 10 years.' },
          { title: 'Choose compounding', desc: 'Most banks compound quarterly; some senior schemes compound monthly.' },
          { title: 'Add tax slab', desc: 'Your income tax slab determines how much of the interest you keep after tax.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How FD compounding actually works</h2>
            <p className="text-slate-600 leading-relaxed">
              When a bank advertises "7% FD," they mean 7% per annum compounded quarterly — not simple interest. Each quarter, the interest earned is added to your principal, and the next quarter's interest is calculated on the new, larger balance. Over a 5-year FD at 7%, this quarterly compounding turns ₹1 lakh into about ₹1.41 lakh instead of the ₹1.35 lakh that simple interest would yield — roughly ₹6,000 of extra interest from the compounding mechanic alone.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">FD rates by tenure (typical 2026)</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>7–14 days:</strong> 3.5–4% — generally a parking option, not an investment</li>
              <li><strong>1–2 years:</strong> 6.5–7.25% — most popular tenure for short-term goals</li>
              <li><strong>3–5 years:</strong> 6.75–7.5% — best balance of rate and liquidity</li>
              <li><strong>5 years (tax-saving FD):</strong> 6.5–7% with 80C deduction up to ₹1.5L</li>
              <li><strong>5–10 years:</strong> 6.5–7% — locks rate but reinvestment risk if rates fall</li>
            </ul>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900">
              <strong>Tip:</strong> Split a large FD into 3–4 smaller ones with different maturity dates. If you need partial liquidity, breaking one smaller FD costs less in foreclosure penalty than breaking the entire amount.
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-4">When an FD makes sense (and when it does not)</h2>
            <p className="text-slate-600 leading-relaxed">
              FDs make sense for the part of your portfolio that absolutely cannot lose nominal value — emergency funds, money you need within 2–3 years, and the "fixed income" allocation that balances your equity. FDs do not make sense as the only investment vehicle for long-term goals (10+ years), where equity mutual funds historically beat FDs by 4–6 percentage points annually after tax and inflation.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">FD vs other options at a glance</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>FD vs RD:</strong> FD for a lumpsum; RD for monthly savings discipline</li>
              <li><strong>FD vs PPF:</strong> PPF has higher post-tax return and 80C benefit but 15-year lock-in</li>
              <li><strong>FD vs Debt mutual fund:</strong> Debt funds are more tax-efficient for 3+ year horizons; FDs win on simplicity and predictability</li>
              <li><strong>FD vs Liquid fund:</strong> Liquid funds for sub-6-month money (higher post-tax return, instant redemption)</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'RD Calculator', href: '/finance/rd-calculator', icon: '💰' },
          { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator', icon: '📊' },
          { name: 'SIP vs FD Calculator', href: '/finance/sip-vs-fd-calculator', icon: '⚔️' },
        ]}
      />
    </>
  );
}
