import Head from 'next/head';
import SalaryHikeCalculator from '../../components/Finance/SalaryHikeCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import {
  generateBreadcrumbs,
  generateFaqSchema,
  generateSoftwareAppSchema,
  SITE_URL,
} from '../../utils/siteConfig';

const SLUG = '/finance/salary-hike-calculator';

const FAQS = [
  {
    q: 'How is salary hike percentage calculated?',
    a: 'Salary hike % = (New salary − Old salary) ÷ Old salary × 100. Example: ₹8 lakh → ₹9.6 lakh is (1.6 / 8) × 100 = 20% hike. Always compare on the same component basis — both gross-to-gross, both CTC-to-CTC, or both take-home-to-take-home. Mixing components inflates or deflates the perceived hike.',
  },
  {
    q: 'What is a good annual salary hike percentage?',
    a: 'Industry averages in 2026: 8–10% for staying in role, 12–18% for an internal promotion, 25–40% for switching companies, 50–100% for a level jump while switching. Inflation runs 5–6%, so anything under 7% is effectively a real-terms pay cut. If your annual review keeps offering 5–7% year after year, it is a signal to start interviewing externally.',
  },
  {
    q: 'How much hike should I ask for in a job switch?',
    a: 'A working rule: 25–35% over your current CTC for a similar role at a slightly better company, 40–60% for a stretch role or top-tier brand jump, 70%+ if your current pay is significantly below market. Always do a market check on Glassdoor, levels.fyi, AmbitionBox, or salary surveys before naming a number. Anchoring low is the most common interviewing mistake — most recruiters expect you to negotiate up.',
  },
  {
    q: 'CTC hike vs in-hand hike — what is different?',
    a: 'CTC includes employer contributions (PF, gratuity, insurance, variable pay, ESOPs), which do not all show up in your monthly bank account. A 20% CTC hike might be only a 12–15% in-hand hike if the increase loads up retirals or variable pay. Always ask for the new gross monthly and net monthly figures during offer negotiation — not just the CTC number on the offer letter.',
  },
  {
    q: 'How does inflation affect my real hike?',
    a: 'Subtract inflation from your nominal hike to get the real hike. India\'s CPI inflation has averaged ~5–6% over the past decade. A 10% hike at 6% inflation is a 4% real raise. A 6% hike at 6% inflation is a flat real income. Anything under inflation is a real pay cut, even if the gross number is higher than last year.',
  },
  {
    q: 'Should I take a bigger title or bigger salary?',
    a: 'Bigger salary early career (under 5 years experience), bigger title later. A senior title compounds faster: it determines the band you negotiate from for your next role, and 2–3 strong titles can lift lifetime earnings by 30–50%. Early career, raw compensation matters more because your title leverage is still small. The exception: take the title if it unlocks a clearly different growth path (people management, P&L ownership).',
  },
];

export default function SalaryHikeCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: 'Salary Hike Calculator',
    slug: SLUG,
    description:
      'Free salary hike / increment calculator. Compute your new salary from a hike %, or back out the hike % from a new salary figure. Annual or monthly, multi-currency.',
    category: 'FinanceApplication',
    featureList:
      'Hike % to new salary, New salary to hike %, Monthly delta, Hike scenarios table, Multi-currency',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>Salary Hike Calculator — New Salary, Increment % & Monthly Delta | Toolisk</title>
        <meta
          name="description"
          content="Free salary hike calculator. Enter current salary and hike % to see new salary, or work the math in reverse. Includes monthly delta and quick comparison scenarios."
        />
        <meta
          name="keywords"
          content="salary hike calculator, salary increment calculator, new salary calculator, hike percentage calculator, salary increase calculator, ctc hike calculator"
        />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="Salary Hike Calculator — New Salary & Hike % | Toolisk" />
        <meta
          property="og:description"
          content="Compute new salary, hike %, and monthly delta in seconds."
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
        icon="📈"
        title="Salary Hike Calculator"
        tagline="Compute new salary from a hike %, or reverse-engineer the hike % from a new offer. Both directions, in seconds."
        gradient="from-blue-600 via-indigo-600 to-violet-600"
      >
        <SalaryHikeCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A two-way salary hike calculator. Enter a current salary and a hike % to see the new figure, or enter both current and new salaries to back out the implied hike %. Works for annual / CTC or monthly take-home — multi-currency, with a quick comparison table of 5–30% hike scenarios."
        features={[
          '📈 Two-way calculation (hike % ↔ new salary)',
          '🗓️ Annual / CTC or monthly modes',
          '💰 Monthly delta — exact extra income per month',
          '📊 Quick scenario table from 5% to 30% hike',
          '💱 Multi-currency (USD, INR, EUR, GBP, AUD, CAD)',
          '💾 PDF / Excel export with scenarios sheet',
        ]}
        steps={[
          { title: 'Pick frequency', desc: 'Annual / CTC for offer letter comparisons, monthly for take-home math.' },
          { title: 'Enter current salary', desc: 'Use the same component basis you will compare against (CTC-to-CTC, take-home-to-take-home).' },
          { title: 'Choose mode', desc: '"Enter hike %" to project forward, or "Enter new salary" to extract the implied hike %.' },
          { title: 'Read the result', desc: 'New salary, hike amount, hike %, and the per-month delta you actually take home.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What counts as a "good" hike</h2>
            <p className="text-slate-600 leading-relaxed">
              The honest answer depends on stage, industry, and market — but a few rough benchmarks help. Anything under inflation (~6% in India, ~3–4% in the US) is a real pay cut. The "I am being respected" floor in steady-state roles is roughly inflation + 4%, so 10% in India and 7–8% in the US. Internal promotions justify 12–18%. A company switch typically commands 25–40%. A level-up while switching can clear 70%+. Below these bands, you are either undervalued or in a slow-growth role — both are signals to test the market.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">Hike % benchmarks by scenario</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Same role, annual review:</strong> 6–10% typical, 10–12% strong</li>
              <li><strong>Internal promotion:</strong> 12–18% typical, 20%+ for a function change</li>
              <li><strong>External switch, same role:</strong> 25–35% typical, 40%+ for tier-1 brand</li>
              <li><strong>External switch + level up:</strong> 50–80% common, 100%+ if previously underpaid</li>
              <li><strong>Counter-offer to retain:</strong> 15–25% above current — but rarely sustainable culturally</li>
            </ul>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900">
              <strong>Negotiation tip:</strong> Always negotiate on the gross monthly and net monthly figures, not just the CTC. Two offers with identical CTC can differ by ₹15–25k/month in actual take-home depending on how the package is structured.
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-4">The compound power of early-career hikes</h2>
            <p className="text-slate-600 leading-relaxed">
              A 10% extra hike at age 25 — even just once — does not stay 10% forever. Future hikes are usually computed on the new base, so that 10% premium compounds into 30–50% extra cumulative earnings over a 30-year career, depending on hike frequency. This is why early-career negotiation is high-leverage: every percentage point you secure today compounds into your retirement number. Use this calculator to model two scenarios (a 12% hike vs the 15% you almost asked for) over a 20-year projection. The gap is rarely small.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-2">Three things to verify before celebrating a hike</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li><strong>Component split:</strong> What % is fixed, variable, retirals, stock?</li>
              <li><strong>In-hand impact:</strong> Run the new gross through a paycheck or income tax calculator</li>
              <li><strong>Total comp arc:</strong> Is the joining bonus / sign-on a one-time inflation? What is year-2 comp?</li>
            </ul>
          </section>
        }
        relatedTools={[
          { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🧾' },
          { name: 'US Paycheck Calculator', href: '/finance/us-paycheck-calculator', icon: '🇺🇸' },
          { name: 'Take-Home Pay Calculator', href: '/finance/take-home-pay-calculator', icon: '💵' },
        ]}
      />
    </>
  );
}
