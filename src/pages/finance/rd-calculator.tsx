import Head from 'next/head';
import RDCalculator from '../../components/Finance/RDCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/finance/rd-calculator';

const FAQS = [
  {
    q: 'How does a Recurring Deposit work?',
    a: 'An RD is a fixed monthly deposit into a bank account that earns FD-like interest (compounded quarterly), maturing at the end of a chosen tenure (6 months to 10 years). You commit to depositing the same amount every month — useful for building a disciplined savings habit toward a near-term goal like a holiday, gadget, or down payment.',
  },
  {
    q: 'RD vs FD — which is better?',
    a: 'FD is better if you have a lumpsum sitting idle and want it to compound fully from day one. RD is better when you only have monthly surplus to invest — the discipline forces you to save before you spend. For the same monthly cash flow over the same tenure, FD\'s lumpsum at the start earns more, but most people do not have that lumpsum available. The right answer matches your cash flow, not theoretical optimization.',
  },
  {
    q: 'What is the typical RD interest rate?',
    a: 'Indian RD rates as of 2026 range from 6.5% to 7.5% at most major banks for 1–5 year tenures. Senior citizens earn an additional 0.25–0.5%. Rates are nearly identical to FDs for the same tenure. Small finance banks sometimes offer 0.5–1% higher rates but check deposit insurance coverage (₹5 lakh per bank under DICGC).',
  },
  {
    q: 'Can I miss an RD installment?',
    a: 'Yes, but with a penalty. Most banks charge ₹1–2 per ₹100 of the missed installment as late fee, and three consecutive missed installments can trigger premature closure. Set up auto-debit from your savings account to your RD account to avoid this — the discipline is the entire point of the product.',
  },
  {
    q: 'Is RD interest taxable?',
    a: 'Yes — RD interest is added to your total income under "Income from Other Sources" and taxed at your slab rate. From 2020, TDS at 10% applies if your total RD interest from one bank exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). If your income is below taxable, submit Form 15G/15H to avoid TDS.',
  },
  {
    q: 'Can I break an RD before maturity?',
    a: 'Yes — premature closure is allowed but you lose 0.5–1% in interest as penalty, and the interest is recalculated at the lower rate for the actual tenure held. For example, a 5-year RD closed after 2 years gets the 2-year rate minus the penalty, not the original 5-year rate. Avoid premature closure unless absolutely necessary.',
  },
];

export default function RDCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Recurring Deposit (RD) Calculator',
    slug: SLUG,
    description:
      'Free RD calculator — compute maturity value, total interest, and month-by-month growth on Indian Recurring Deposits. Includes senior citizen rates and quarterly compounding.',
    category: 'FinanceApplication',
    featureList:
      'RD maturity value, Quarterly compounding, Senior citizen rates, Month-by-month growth, Multi-currency',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>RD Calculator — Recurring Deposit Maturity & Interest | Toolisk</title>
        <meta
          name="description"
          content="Free Recurring Deposit (RD) calculator. See maturity value, total interest earned, and a month-by-month growth chart. Senior citizen rates supported."
        />
        <meta
          name="keywords"
          content="rd calculator, recurring deposit calculator, rd maturity calculator, rd interest calculator india, sbi rd calculator, post office rd calculator, senior citizen rd"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="RD Calculator — Recurring Deposit Maturity | Toolisk" />
        <meta
          property="og:description"
          content="See maturity value, total interest, and month-by-month growth on any Recurring Deposit."
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
        icon="💰"
        title="Recurring Deposit (RD) Calculator"
        tagline="Monthly deposits compound quarterly — see your exact maturity value, interest earned, and the growth curve."
        gradient="from-amber-600 via-orange-600 to-rose-600"
      >
        <RDCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A Recurring Deposit calculator that mirrors how Indian banks actually credit RD interest — quarterly compounding on a steadily growing monthly balance. Get your maturity value, interest earned, and a month-by-month growth chart that shows the gap between what you invest and what you walk away with."
        features={[
          '💰 Quarterly compounding on monthly deposits',
          '👴 Senior citizen rate toggle (+0.5%)',
          '📈 Month-by-month growth chart',
          '📊 Invested vs maturity comparison',
          '⚡ Quick tenure presets (1y / 2y / 3y / 5y / 7y / 10y)',
          '💾 PDF / Excel export with full month-by-month sheet',
        ]}
        steps={[
          { title: 'Set monthly deposit', desc: 'The fixed amount you commit every month. Even ₹1,000/month builds meaningfully over 5 years.' },
          { title: 'Pick tenure', desc: 'Use a quick preset or enter custom months. 12, 24, 36, 60 are most common.' },
          { title: 'Add interest rate', desc: 'Current RD rates: 6.5–7.5%. Senior citizens add 0.5%.' },
          { title: 'Read maturity', desc: 'Total invested + interest earned = maturity value at the end of tenure.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The RD math, simplified</h2>
            <p className="text-slate-600 leading-relaxed">
              Each month you deposit a fixed amount. Every quarter, the bank computes interest on the running balance (which has grown by 3 deposits in that quarter) and adds it to the balance. The next quarter, interest is earned on a larger balance — including the previously credited interest. Over 60 months at 6.75%, ₹5,000/month grows to roughly ₹3.58 lakh — you deposited ₹3 lakh and earned ~₹58,000 of interest from the compounding mechanic.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">Why people pick RD over SIP</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Guaranteed return:</strong> No market risk — your maturity is locked at the chosen rate</li>
              <li><strong>Habit-building:</strong> Auto-debit forces discipline that beginners struggle with on SIPs</li>
              <li><strong>Short-term goals:</strong> 1–3 year horizons where equity is too volatile</li>
              <li><strong>Tax-bracket compatible:</strong> Lower slabs see most of the interest after TDS/tax</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mt-2">Why people pick SIP over RD</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Higher long-term returns:</strong> Equity SIPs have averaged 11–13% over 15+ year windows</li>
              <li><strong>Tax efficiency:</strong> 10% LTCG vs slab-rate on RD interest</li>
              <li><strong>Liquidity:</strong> Pause / withdraw anytime without RD-style penalty</li>
            </ul>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900">
              <strong>Practical split:</strong> Use an RD for goals 1–3 years away (down payment, vacation, gadget). Use SIP for goals 7+ years away (retirement, kid's college). For the 3–7 year zone, a hybrid mutual fund is often better than either.
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-4">RD scheme variants worth knowing</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Bank RD:</strong> Standard recurring deposit at any commercial bank</li>
              <li><strong>Post Office RD:</strong> 5-year tenure, typically 6.7% (govt-backed)</li>
              <li><strong>Senior Citizen RD:</strong> Same as regular but with 0.25–0.5% higher rate</li>
              <li><strong>Flexi RD:</strong> Allows variable monthly amounts (subject to bank's rules)</li>
              <li><strong>NRE RD:</strong> For NRIs — interest is tax-free in India but follows your country's tax rules</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'FD Calculator', href: '/finance/fd-calculator', icon: '🏦' },
          { name: 'SIP Calculator', href: '/finance/sip-calculator', icon: '💼' },
          { name: 'SIP vs FD Calculator', href: '/finance/sip-vs-fd-calculator', icon: '⚔️' },
        ]}
      />
    </>
  );
}
