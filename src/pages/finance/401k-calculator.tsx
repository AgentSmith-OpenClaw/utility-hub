import Head from 'next/head';
import Retirement401kCalculator from '../../components/Finance/Retirement401kCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, generateFaqSchema, generateSoftwareAppSchema, SITE_URL } from '../../utils/siteConfig';

const SLUG = '/finance/401k-calculator';

const FAQS = [
  { q: 'What is the 401(k) contribution limit for 2026?', a: 'For 2026, employees under 50 can contribute up to $24,000 to a 401(k). Workers age 50 and older can add a $8,000 catch-up contribution, for a total of $32,000. The combined employee + employer limit is $71,000.' },
  { q: 'How much should I contribute to my 401(k)?', a: 'At minimum, contribute enough to capture your full employer match — that is a 100% return on the matched portion. After that, target 15% of gross income (including the match) toward retirement. If you can max out the IRS limit, even better.' },
  { q: 'What is a typical employer match?', a: 'The most common formula is 50¢ per $1 you contribute, up to 6% of your salary (a 3% maximum employer contribution). Some employers offer 100% matching up to 3–6%. Always read your plan documents — formulas vary widely.' },
  { q: 'Should I contribute to a Roth 401(k) or Traditional 401(k)?', a: 'Traditional 401(k) reduces your taxes today but you pay tax on withdrawal. Roth 401(k) is post-tax now but tax-free in retirement. If you expect to be in a higher tax bracket in retirement, Roth wins; lower bracket, Traditional wins. Many people split the difference.' },
  { q: 'What is the 4% safe withdrawal rule?', a: 'The 4% rule says you can withdraw 4% of your retirement balance in year 1, then adjust for inflation each year, with high probability your money lasts 30+ years. A $1.5M balance supports about $60,000/year ($5,000/month) in inflation-adjusted retirement income.' },
];

export default function Retirement401kCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs(SLUG);
  const softwareSchema = generateSoftwareAppSchema({
    name: '401(k) Retirement Calculator',
    slug: SLUG,
    description: 'Project your 401(k) balance at retirement with employer match, salary growth, and the 4% safe withdrawal rule.',
    category: 'FinanceApplication',
    featureList: 'Employer match modeling, Salary growth, 2026 contribution limits, 4% withdrawal income, Year-by-year chart',
  });
  const faqSchema = generateFaqSchema(FAQS);

  return (
    <>
      <Head>
        <title>401(k) Calculator — Project Retirement Balance with Employer Match | Toolisk</title>
        <meta name="description" content="Free 401(k) retirement calculator with employer match modeling, salary growth, and 2026 contribution limits. See your projected balance at retirement and 4% safe withdrawal income." />
        <meta name="keywords" content="401k calculator, 401k retirement calculator, employer match calculator, 401k contribution limits 2026, retirement savings calculator, roth 401k vs traditional, safe withdrawal rate" />
        <link rel="canonical" href={`${SITE_URL}${SLUG}`} />
        <meta property="og:title" content="401(k) Retirement Calculator | Toolisk" />
        <meta property="og:description" content="Project your 401(k) balance with employer match, salary growth, and the 4% rule." />
        <meta property="og:url" content={`${SITE_URL}${SLUG}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, softwareSchema, faqSchema]) }} />
      </Head>

      <ToolShell parent="finance" icon="🏦" title="401(k) Calculator" tagline="Project your retirement balance with employer match, salary growth, and the 4% safe withdrawal rule." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <Retirement401kCalculator />
      </ToolShell>

      <ToolSEOContent
        description="A complete 401(k) retirement calculator that models employer match, salary growth, and 2026 IRS contribution limits. See your projected balance at retirement, total contributions vs employer match vs investment growth, and your sustainable monthly retirement income at the 4% safe withdrawal rate."
        features={[
          '🏦 Models employer match with custom rate and salary cap',
          '📈 Salary growth and step-up contribution support',
          '⚠️ Warns when you are not capturing the full employer match',
          '🎯 2026 contribution limits ($24k under 50, +$8k catch-up)',
          '💰 4% safe withdrawal rate retirement income',
          '📊 Year-by-year balance chart with contributions vs growth',
        ]}
        steps={[
          { title: 'Enter your basics', desc: 'Age, retirement age, salary, and current 401(k) balance.' },
          { title: 'Set contribution & match', desc: 'Your % contribution, employer match rate, and the cap (e.g. 50% match up to 6%).' },
          { title: 'Choose return assumption', desc: 'Default 7% (S&P 500 long-term average minus inflation). Adjust for conservative or aggressive scenarios.' },
          { title: 'Read your retirement income', desc: 'The 4% withdrawal card shows the inflation-adjusted monthly income your balance can sustain for 30+ years.' },
        ]}
        faqs={FAQS}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Capturing the full employer match is the highest-return move in personal finance</h2>
            <p className="text-slate-600 leading-relaxed">
              An employer match is a 100% (or 50% if your match is 50¢ on the dollar) instant return on your contribution. No investment in the world reliably matches that. If your employer matches up to 6% and you only contribute 4%, you are leaving 2% of your salary in <em>free annual income</em> on the table. Over a 35-year career on an $85k salary with 3% raises, that costs roughly $300,000 in retirement balance.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Vesting matters</h3>
            <p className="text-slate-600 leading-relaxed">
              Your contributions are always 100% vested. The employer match may have a graded or cliff vesting schedule (typically 3–6 years). If you change jobs before fully vested, you forfeit the unvested portion. Check your plan&apos;s vesting schedule before declining a job offer with better match terms.
            </p>
          </section>
        }
        relatedTools={[
          { name: 'Roth vs Traditional IRA', href: '/finance/roth-vs-traditional-ira', icon: '⚖️' },
          { name: 'Investment Calculator', href: '/finance/investment-calculator', icon: '📈' },
          { name: 'FIRE Calculator', href: '/finance/fire-calculator', icon: '🔥' },
        ]}
        relatedArticles={[
          { title: 'Get the Full 401(k) Match', href: '/finance/learn/401k-employer-match-strategy' },
          { title: 'Roth IRA vs Traditional IRA', href: '/finance/learn/roth-vs-traditional-ira-decision' },
        ]}
      />
    </>
  );
}
