import type { BlogArticle } from '../types';
import { Lead, H2, H3, ToolCTA, Callout, Comparison, KeyTakeaways } from '../components';

export const netWorthByAgeBenchmarks: BlogArticle = {
  slug: 'net-worth-by-age-benchmarks',
  category: 'Budgeting',
  title: 'Net Worth by Age: 2026 Benchmarks for US, UK, Australia, and Canada',
  description:
    'How does your net worth stack up against the median for your age and country? Honest benchmarks from official sources, plus the formulas and milestones to aim for.',
  publishedDate: '2026-05-11',
  readTime: '12 min read',
  keywords: 'net worth by age, average net worth, median net worth, wealth benchmarks, net worth calculator, financial milestones, net worth us uk australia canada',
  relatedTools: [
    { name: 'Net Worth Calculator', href: '/finance/net-worth-calculator' },
    { name: 'Investment Calculator', href: '/finance/investment-calculator' },
    { name: 'FIRE Calculator', href: '/finance/fire-calculator' },
  ],
  content: (
    <div className="prose prose-lg max-w-none">
      <Lead>
        "How am I doing?" is the most common money question that people are too embarrassed to ask out loud.
        Income comparisons are easy because everyone overshares those. Net worth — the actual measure of your
        financial life — is private, and the benchmarks are scattered. Here&apos;s the honest data, by age and
        country.
      </Lead>

      <H2>What counts as "net worth"</H2>
      <p>
        Net worth is everything you own (assets) minus everything you owe (liabilities):
      </p>
      <ul>
        <li><strong>Assets:</strong> cash, investments, retirement accounts, home equity, vehicles, business interests</li>
        <li><strong>Liabilities:</strong> mortgage, student loans, auto loans, credit cards, any other debt</li>
      </ul>
      <p>
        Most surveys include home equity (market value − mortgage) and vehicle value. Some financial planners
        prefer "investable net worth" — net worth excluding the primary residence and personal vehicles —
        because those aren&apos;t easy to liquidate.
      </p>

      <ToolCTA
        href="/finance/net-worth-calculator"
        label="Open the Net Worth Calculator"
        hint="Track your assets and liabilities, see allocation, and benchmark against US Federal Reserve data."
        accent="blue"
      />

      <H2>🇺🇸 United States — 2024 SCF data</H2>
      <p>
        The most authoritative US source is the Federal Reserve&apos;s Survey of Consumer Finances, last full
        survey 2022 (with 2024 supplement). Numbers are in 2024 dollars:
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Age</th><th className="text-left p-3 font-semibold">Median</th><th className="text-left p-3 font-semibold">Top 10%</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Under 35</td><td className="p-3 font-mono">$39,000</td><td className="p-3 font-mono">~$350,000</td><td className="p-3 text-gray-600">Many have negative net worth from student loans.</td></tr>
            <tr><td className="p-3">35–44</td><td className="p-3 font-mono">$135,600</td><td className="p-3 font-mono">~$1.1M</td><td className="p-3 text-gray-600">Career earnings + home equity start to show.</td></tr>
            <tr><td className="p-3">45–54</td><td className="p-3 font-mono">$247,200</td><td className="p-3 font-mono">~$2.35M</td><td className="p-3 text-gray-600">Peak earning years; retirement accounts grow fast.</td></tr>
            <tr><td className="p-3">55–64</td><td className="p-3 font-mono">$364,500</td><td className="p-3 font-mono">~$4.5M</td><td className="p-3 text-gray-600">Pre-retirement crunch — 8x salary by 60.</td></tr>
            <tr><td className="p-3">65–74</td><td className="p-3 font-mono">$410,000</td><td className="p-3 font-mono">~$5.2M</td><td className="p-3 text-gray-600">Drawdown begins; should support 25-30 years.</td></tr>
            <tr><td className="p-3">75+</td><td className="p-3 font-mono">$334,700</td><td className="p-3 font-mono">~$4.4M</td><td className="p-3 text-gray-600">Decumulation continues; healthcare costs accelerate.</td></tr>
          </tbody>
        </table>
      </div>

      <H3>The "average" is misleading</H3>
      <p>
        Mean (average) US net worth is about $1.06M because billionaires drag the number up. The <strong>median</strong> is
        the honest middle — half above, half below. Always compare yourself to the median, not the mean.
      </p>

      <H2>🇬🇧 United Kingdom — ONS Wealth and Assets Survey</H2>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Age</th><th className="text-left p-3 font-semibold">Median (£)</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Under 35</td><td className="p-3 font-mono">£35,000</td><td className="p-3 text-gray-600">Help to Buy ISA, workplace pensions; student debt drags down.</td></tr>
            <tr><td className="p-3">35–44</td><td className="p-3 font-mono">£185,000</td><td className="p-3 text-gray-600">First-time buyer surge; pension auto-enrolment maturing.</td></tr>
            <tr><td className="p-3">45–54</td><td className="p-3 font-mono">£385,000</td><td className="p-3 text-gray-600">Mortgage paydown + DC pension growth.</td></tr>
            <tr><td className="p-3">55–64</td><td className="p-3 font-mono">£565,000</td><td className="p-3 text-gray-600">Peak wealth; DB pensions still significant for older workers.</td></tr>
            <tr><td className="p-3">65–74</td><td className="p-3 font-mono">£525,000</td><td className="p-3 text-gray-600">Retirement drawdown; State Pension supplements.</td></tr>
          </tbody>
        </table>
      </div>

      <H2>🇦🇺 Australia — ABS Survey of Income and Housing</H2>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Age</th><th className="text-left p-3 font-semibold">Median (A$)</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Under 35</td><td className="p-3 font-mono">A$80,000</td><td className="p-3 text-gray-600">Superannuation building; HECS-HELP debt drags down.</td></tr>
            <tr><td className="p-3">35–44</td><td className="p-3 font-mono">A$385,000</td><td className="p-3 text-gray-600">First home + mortgage + super contributions compounding.</td></tr>
            <tr><td className="p-3">45–54</td><td className="p-3 font-mono">A$680,000</td><td className="p-3 text-gray-600">Peak earning + super accumulation.</td></tr>
            <tr><td className="p-3">55–64</td><td className="p-3 font-mono">A$895,000</td><td className="p-3 text-gray-600">Pre-retirement; super averaging A$300-400k for couples.</td></tr>
            <tr><td className="p-3">65+</td><td className="p-3 font-mono">A$1,100,000</td><td className="p-3 text-gray-600">Includes home + super; Age Pension supplements lower-balance retirees.</td></tr>
          </tbody>
        </table>
      </div>

      <H2>🇨🇦 Canada — StatCan Survey of Financial Security</H2>
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left p-3 font-semibold">Age</th><th className="text-left p-3 font-semibold">Median (C$)</th><th className="text-left p-3 font-semibold">Notes</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="p-3">Under 35</td><td className="p-3 font-mono">C$48,800</td><td className="p-3 text-gray-600">Student loans + early career; RRSP contributions starting.</td></tr>
            <tr><td className="p-3">35–44</td><td className="p-3 font-mono">C$234,400</td><td className="p-3 text-gray-600">Home purchase wave + RRSP growth.</td></tr>
            <tr><td className="p-3">45–54</td><td className="p-3 font-mono">C$521,100</td><td className="p-3 text-gray-600">Mortgage paydown + RRSP/TFSA accumulation.</td></tr>
            <tr><td className="p-3">55–64</td><td className="p-3 font-mono">C$873,400</td><td className="p-3 text-gray-600">Pre-retirement peak.</td></tr>
            <tr><td className="p-3">65+</td><td className="p-3 font-mono">C$762,700</td><td className="p-3 text-gray-600">Drawdown begins; CPP/OAS supplement.</td></tr>
          </tbody>
        </table>
      </div>

      <H2>The "age × income / 10" benchmark</H2>
      <p>
        Thomas Stanley&apos;s classic formula from <em>The Millionaire Next Door</em>:
      </p>
      <Callout accent="emerald">
        <strong>Expected net worth = (age × pre-tax annual income) ÷ 10</strong>
      </Callout>
      <p>
        Examples:
      </p>
      <ul>
        <li>30-year-old earning $80k → expected $240,000</li>
        <li>40-year-old earning $120k → expected $480,000</li>
        <li>50-year-old earning $150k → expected $750,000</li>
      </ul>
      <p>
        Stanley called those at 2× the expected number "PAWs" (prodigious accumulators of wealth) and those
        at half "UAWs" (under-accumulators). It&apos;s a rough benchmark but useful as a forcing function:
        if your number is way below, your savings rate is too low for your income.
      </p>

      <H2>Milestones to aim for</H2>
      <H3>The "first $100k" milestone</H3>
      <p>
        Charlie Munger famously said the first $100k is the hardest. Once you hit it, an 8% return adds
        $8k/year — about as much as someone saving $666/month from scratch. The compounding starts to feel
        meaningful. Most aggressive savers can hit $100k by age 30, $250k by 35, $500k by 40.
      </p>

      <H3>The "8x salary by 60" rule (Fidelity)</H3>
      <p>
        Fidelity&apos;s retirement readiness benchmarks: 1× salary by 30, 3× by 40, 6× by 50, 8× by 60, 10× by 67.
        These assume retirement at 67 with Social Security supplementing. FIRE-aspirants should target much higher
        multiples (25× annual expenses for a 4% safe withdrawal rate).
      </p>

      <H2>Why the benchmarks are imperfect</H2>
      <p>
        A few caveats before you panic or celebrate:
      </p>
      <ul>
        <li><strong>Cost of living varies wildly</strong>. $500k in Mississippi is materially different from $500k in San Francisco.</li>
        <li><strong>Inheritance and gifts skew the data</strong>. Some 30-year-olds are at the 90th percentile because of family money, not savings discipline.</li>
        <li><strong>Surveys self-report</strong>. Wealthy households often understate; aspirational households sometimes overstate.</li>
        <li><strong>Trajectory matters more than snapshot</strong>. Year-over-year change is the metric to watch, not single-point comparison.</li>
      </ul>

      <KeyTakeaways
        items={[
          'US median net worth: $39k (under 35), $135k (35-44), $247k (45-54), $364k (55-64).',
          'Use median, not mean — billionaires distort the average upward.',
          'Stanley\'s rule: expected net worth = (age × income) ÷ 10.',
          'Fidelity: 1x salary by 30, 3x by 40, 6x by 50, 8x by 60, 10x by 67.',
          'First $100k is the hardest milestone — compounding accelerates after that.',
          'Year-over-year trajectory matters more than any single benchmark.',
        ]}
      />
    </div>
  ),
};
