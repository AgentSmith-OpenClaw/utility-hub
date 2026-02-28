import Head from 'next/head';
import Link from 'next/link';
import USPaycheckCalculator from '../../components/USPaycheckCalculator/USPaycheckCalculator';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function USPaycheckCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/us-paycheck-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How is my take-home pay calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your take-home pay starts with gross income, then subtracts federal income tax (based on progressive brackets), state income tax (varies by state), Social Security tax (6.2%), Medicare tax (1.45%), and any pre-tax deductions like 401(k) or HSA contributions. The remaining amount is your net pay deposited into your bank account."
        }
      },
      {
        "@type": "Question",
        "name": "What is the FICA tax rate for 2025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The FICA tax rate for 2025 is 7.65% for employees — 6.2% for Social Security (on income up to $176,100) and 1.45% for Medicare (no income cap). High earners pay an additional 0.9% Medicare surtax on wages exceeding $200,000 for single filers or $250,000 for married filing jointly."
        }
      },
      {
        "@type": "Question",
        "name": "Which states have no income tax?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nine US states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. New Hampshire and Tennessee previously taxed investment income but have phased those out. Living in these states can significantly boost your take-home pay."
        }
      },
      {
        "@type": "Question",
        "name": "How does a 401(k) reduce my taxes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional 401(k) contributions are made pre-tax, meaning they reduce your taxable income for the year. For example, if you earn $75,000 and contribute $10,000 to your 401(k), you only pay federal and state income tax on $65,000. At a 22% federal bracket, that saves roughly $2,200 in federal taxes alone."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between marginal and effective tax rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your marginal tax rate is the rate applied to your last dollar of income — the highest bracket you fall into. Your effective tax rate is the average rate across all your income, calculated by dividing total tax owed by total taxable income. For example, a single filer earning $60,000 in 2025 has a 22% marginal rate but roughly a 12-13% effective rate because lower portions of income are taxed at 10% and 12%."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I check my paycheck withholding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Review your W-4 withholding at least once a year or after major life events — marriage, divorce, having a child, buying a home, or starting a side job. Incorrect withholding can lead to a large tax bill or an unnecessarily big refund (which means you gave the IRS an interest-free loan)."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "US Paycheck & Tax Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate your US take-home pay with federal income tax, state tax, FICA, and pre-tax deductions for all 50 states using 2025 tax brackets.",
    "url": `${SITE_URL}/finance/us-paycheck-calculator`
  };

  return (
    <>
      <Head>
        <title>US Paycheck &amp; Tax Calculator 2025 | Free Gross-to-Net Estimator | Toolisk</title>
        <meta
          name="description"
          content="Free US paycheck calculator for 2025. Estimate take-home pay with federal tax, state tax, FICA, Social Security, Medicare, 401(k), and HSA deductions for all 50 states."
        />
        <meta
          name="keywords"
          content="us paycheck calculator, take home pay calculator, gross to net calculator, federal tax calculator, state tax calculator, fica calculator, 401k tax savings"
        />
        <link rel="canonical" href={`${SITE_URL}/finance/us-paycheck-calculator`} />
        <meta property="og:title" content="US Paycheck & Tax Calculator 2025 | Free Gross-to-Net Estimator" />
        <meta property="og:description" content="Estimate your US take-home pay with federal & state tax, FICA, and pre-tax deductions. Covers all 50 states with 2025 brackets." />
        <meta property="og:url" content={`${SITE_URL}/finance/us-paycheck-calculator`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Toolisk" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="US Paycheck & Tax Calculator 2025 | Toolisk" />
        <meta name="twitter:description" content="Calculate your US take-home pay with federal tax, state tax, FICA, and pre-tax deductions for all 50 states." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema]) }}
        />
      </Head>

      <USPaycheckCalculator />

      <article className="max-w-5xl mx-auto px-4 py-12 bg-white">

        {/* Section 1: Understanding Your US Paycheck */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Understanding Your US Paycheck: A Complete Gross-to-Net Guide</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          If you&apos;ve ever looked at your paycheck and wondered where almost a third of your earnings went, you&apos;re not alone.
          The gap between your gross salary — the number you negotiated — and your net pay — the amount that actually hits your bank account — can feel
          surprisingly large. Understanding that gap is the first step toward making smarter financial decisions.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Gross-to-net is the journey your paycheck takes from the headline number on your offer letter to the deposit in your checking account.
          Along the way, money gets peeled off for federal income tax, state income tax (in most states), Social Security, Medicare, and any voluntary
          pre-tax deductions like retirement contributions or health savings accounts. Each of these deductions follows its own rules, rates, and caps —
          and they interact in ways that can either cost you or save you hundreds of dollars per paycheck.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          One of the biggest confusion points is the difference between your <strong>tax bracket</strong> and the <strong>actual percentage you pay</strong>.
          The US uses a progressive tax system, which means only the income within each bracket is taxed at that bracket&apos;s rate — not your entire salary.
          So even if you &quot;jump into the 24% bracket,&quot; most of your income is still taxed at lower rates. We&apos;ll break this down in detail below.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Another common surprise is FICA taxes — the combined Social Security and Medicare deductions that show up on every paycheck regardless of your income level.
          Unlike federal income tax, there&apos;s no standard deduction or bracket system for FICA. It&apos;s a flat percentage from dollar one, which means
          lower-income earners feel it proportionally more. Understanding these mechanics helps you plan better, whether you&apos;re evaluating a job offer,
          adjusting your W-4 withholding, or deciding how much to put into your 401(k).
        </p>

        {/* Section 2: Federal Income Tax */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-10">How Federal Income Tax Works in 2025</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          The US federal income tax system is <strong>progressive</strong>, meaning your income is split into chunks, and each chunk is taxed at a
          progressively higher rate. For 2025, there are seven brackets: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. The income thresholds for each bracket
          depend on your filing status — single, married filing jointly, married filing separately, or head of household.
        </p>
        <div className="bg-slate-50 rounded-xl p-6 my-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">2025 Federal Tax Brackets (Single Filer)</h3>
          <ul className="text-slate-600 space-y-1 text-sm">
            <li><strong>10%</strong> — $0 to $11,925</li>
            <li><strong>12%</strong> — $11,926 to $48,475</li>
            <li><strong>22%</strong> — $48,476 to $103,350</li>
            <li><strong>24%</strong> — $103,351 to $197,300</li>
            <li><strong>32%</strong> — $197,301 to $250,525</li>
            <li><strong>35%</strong> — $250,526 to $626,350</li>
            <li><strong>37%</strong> — Over $626,350</li>
          </ul>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          Before your income hits those brackets, you subtract the <strong>standard deduction</strong>. For 2025, the standard deduction is $15,000
          for single filers and $30,000 for married filing jointly. This means a single filer earning $60,000 only pays tax on $45,000
          of taxable income — not the full salary. That&apos;s a huge difference.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Your <strong>filing status</strong> has a major impact. Married filing jointly gets wider brackets and a larger standard deduction, which often
          results in lower total tax compared to two single filers with the same combined income. Head of household status — available to unmarried taxpayers
          who support a dependent — also offers more favorable brackets than single filing.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Here&apos;s the key insight: your <strong>marginal rate</strong> is the tax on your last dollar earned, while your <strong>effective rate</strong> is
          the average across all your income. Someone in the 22% bracket with $60,000 gross income might have an effective federal rate closer to 10-11%.
          This distinction matters when evaluating raises, side income, or retirement contributions — the tax impact of an extra dollar depends on your
          marginal rate, not your effective rate.
        </p>

        {/* Section 3: FICA Taxes */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-10">FICA Taxes: Social Security and Medicare Explained</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          FICA stands for the Federal Insurance Contributions Act, and it funds two programs: Social Security and Medicare. Unlike income tax, FICA is
          a flat-rate tax with no brackets, no standard deduction, and no filing-status adjustments. It applies to every dollar of earned income from
          the very first paycheck.
        </p>
        <div className="bg-slate-50 rounded-xl p-6 my-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">2025 FICA Breakdown</h3>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li><strong>Social Security:</strong> 6.2% on wages up to $176,100 (the wage base cap). Once you earn above this amount, Social Security tax stops.</li>
            <li><strong>Medicare:</strong> 1.45% on all wages with no income cap. Every dollar you earn is subject to Medicare tax.</li>
            <li><strong>Additional Medicare Tax:</strong> An extra 0.9% applies to wages over $200,000 (single) or $250,000 (married filing jointly).</li>
            <li><strong>Employer match:</strong> Your employer pays the same 7.65% on your behalf — so the total FICA contribution is actually 15.3% of your wages.</li>
          </ul>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          For most workers, the combined employee FICA rate is 7.65% (6.2% + 1.45%). On a $75,000 salary, that&apos;s about $5,738 per year taken
          before you even see income tax. If you&apos;re self-employed, you pay both the employee and employer halves — a total of 15.3% — though you
          can deduct the employer-equivalent portion on your tax return.
        </p>

        {/* Section 4: State Income Tax */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-10">State Income Tax: What You Need to Know</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          On top of federal taxes, most states impose their own income tax. The rates and structures vary dramatically — from zero to over 13%.
          Nine states charge <strong>no state income tax at all</strong>: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas,
          Washington, and Wyoming. If you live and work in one of these states, your take-home pay gets an automatic boost.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Among states that do tax income, some use a <strong>flat rate</strong> (like Illinois at 4.95% or Colorado at 4.4%), while others use
          <strong> progressive brackets</strong> similar to the federal system. The highest-tax states include California (top rate 13.3%),
          New York (top rate 10.9%), and New Jersey (top rate 10.75%). At the other end, states like North Dakota and Pennsylvania have rates under 4%.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Where you live can make a meaningful difference. A $100,000 salary in Texas keeps roughly $4,000-$5,000 more per year compared to the
          same salary in California, purely from state tax savings. That said, states without income tax often have higher sales taxes or property
          taxes to make up the difference — so it&apos;s worth looking at the full picture, not just income tax alone.
        </p>

        {/* Section 5: Pre-Tax Deductions */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-10">Pre-Tax Deductions: Your Tax-Shield Strategy</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Pre-tax deductions are one of the most powerful tools for reducing your tax bill — and they&apos;re available to almost every W-2 employee.
          When you contribute to a traditional 401(k), HSA, or other pre-tax benefit, that money comes out of your paycheck <em>before</em> income tax
          is calculated. The result? You pay less in taxes today while building savings for the future.
        </p>
        <div className="bg-slate-50 rounded-xl p-6 my-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">2025 Contribution Limits</h3>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li><strong>401(k):</strong> $23,500 employee contribution limit ($31,000 if age 50+, with catch-up contributions).</li>
            <li><strong>HSA:</strong> $4,300 for individual coverage, $8,550 for family coverage (requires a high-deductible health plan).</li>
            <li><strong>Traditional IRA:</strong> $7,000 limit ($8,000 if age 50+). Deductibility depends on income and employer plan availability.</li>
          </ul>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          These deductions reduce your <strong>taxable income</strong>, not your tax directly — but the savings add up fast. Consider this example:
          if you earn $75,000 and contribute $10,000 to your 401(k), your federal taxable income drops to $65,000 (after standard deduction, it&apos;s
          even lower). At a 22% marginal rate, that $10,000 contribution saves you roughly <strong>$2,200 in federal taxes</strong> alone — plus
          additional state tax savings if your state taxes income. And the money keeps growing tax-deferred until retirement.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          HSA contributions are especially valuable because they offer a <strong>triple tax advantage</strong>: contributions are pre-tax, growth
          is tax-free, and withdrawals for qualified medical expenses are tax-free too. If you have a high-deductible health plan, maxing out your
          HSA is often even more tax-efficient than your 401(k).
        </p>

        {/* Internal Links */}
        <div className="bg-slate-50 rounded-xl p-6 my-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">Related Calculators</h3>
          <p className="text-slate-600 text-sm mb-3">
            Planning your finances goes beyond just your paycheck. Explore these tools to get the full picture:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/finance/emi-calculator" className="text-blue-600 hover:underline">EMI Calculator</Link>
              {' '}— Plan loan repayments and see how EMIs fit into your monthly take-home pay.
            </li>
            <li>
              <Link href="/finance/mortgage-calculator" className="text-blue-600 hover:underline">Mortgage Calculator</Link>
              {' '}— Estimate your monthly house payment including taxes, insurance, and PMI.
            </li>
            <li>
              <Link href="/finance/compound-interest-calculator" className="text-blue-600 hover:underline">Compound Interest Calculator</Link>
              {' '}— See how your 401(k) and HSA investments grow over time with compound returns.
            </li>
          </ul>
        </div>

        {/* Section 6: FAQ */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-10">Frequently Asked Questions</h2>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">How is my take-home pay calculated?</h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          Your employer starts with your gross pay, then subtracts federal income tax withholding (based on your W-4 and the IRS tax brackets),
          state income tax (if applicable), Social Security tax (6.2%), Medicare tax (1.45%), and any pre-tax deductions like 401(k) contributions
          or health insurance premiums. What remains is your net pay — the amount deposited into your account each pay period.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">What is the FICA tax rate for 2025?</h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          The employee FICA rate for 2025 is 7.65% — split between 6.2% for Social Security (on wages up to $176,100) and 1.45% for Medicare
          (on all wages). High earners pay an additional 0.9% Medicare surtax on income above $200,000 (single) or $250,000 (married filing jointly).
          Your employer matches the base 7.65%, making the total FICA contribution 15.3%.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">Which states have no income tax?</h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming.
          Living in one of these states means your take-home pay is only reduced by federal income tax and FICA — no state income tax bite.
          However, some of these states may have higher sales or property taxes.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">How does a 401(k) reduce my taxes?</h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          Traditional 401(k) contributions are deducted from your paycheck before federal and state income taxes are calculated. This lowers
          your taxable income for the year. For example, contributing $10,000 at a 22% marginal tax rate saves you about $2,200 in federal taxes.
          The money grows tax-deferred until withdrawal in retirement, when it&apos;s taxed as ordinary income — ideally at a lower rate.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 mb-3">What is the difference between marginal and effective tax rate?</h3>
        <p className="text-slate-600 leading-relaxed mb-4">
          Your marginal tax rate is the percentage applied to your highest dollar of taxable income — it tells you the tax cost of earning
          one more dollar. Your effective tax rate is the overall average, calculated by dividing your total tax by your total income. Because
          the US tax system is progressive, your effective rate is always lower than your marginal rate. For instance, a single filer in the 22%
          bracket typically has an effective federal rate around 10-13%, depending on their exact income.
        </p>

      </article>
    </>
  );
}
