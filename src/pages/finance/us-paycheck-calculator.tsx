import Head from 'next/head';
import USPaycheckCalculator from '../../components/USPaycheckCalculator/USPaycheckCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
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
    "operatingSystem": "All",
    "featureList": "Federal tax calculation, State tax for all 50 states, FICA breakdown, 401(k)/HSA/IRA deductions, Pay frequency support, PDF export, Excel export",
    "url": `${SITE_URL}/finance/us-paycheck-calculator`
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your US Take-Home Pay",
    "description": "Use the free Toolisk US Paycheck Calculator to estimate your net pay after federal tax, state tax, FICA, and pre-tax deductions.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter your gross income",
        "text": "Input your gross salary and select your pay frequency — annual, monthly, biweekly, weekly, or hourly. The calculator converts everything to annual for accurate tax computation."
      },
      {
        "@type": "HowToStep",
        "name": "Select filing status and state",
        "text": "Choose your tax filing status (Single, Married Filing Jointly, Head of Household, or Married Filing Separately) and select your state to include state income tax."
      },
      {
        "@type": "HowToStep",
        "name": "Add pre-tax deductions",
        "text": "Enter your annual 401(k), HSA, and Traditional IRA contributions. These pre-tax deductions reduce your taxable income and lower your tax bill."
      },
      {
        "@type": "HowToStep",
        "name": "Review your paycheck breakdown",
        "text": "View the complete breakdown showing federal tax, state tax, Social Security, Medicare, pre-tax deductions, and net take-home pay per paycheck and annually."
      },
      {
        "@type": "HowToStep",
        "name": "Analyze and export",
        "text": "Explore tax rate comparisons, monthly cash flow charts, and tax savings from deductions. Export your analysis as PDF or Excel, or share via URL."
      }
    ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema, howToSchema]) }}
        />
      </Head>

      <ToolShell parent="finance" icon="💵" title="US Paycheck & Tax Calculator" tagline="Estimate take-home pay with federal tax, state tax, FICA, and pre-tax deductions for all 50 states." gradient="from-emerald-600 via-teal-600 to-cyan-600">
        <USPaycheckCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Calculate your US take-home pay with federal income tax, state tax, FICA, and pre-tax deductions for all 50 states using 2025 tax brackets."
        features={[
          '🇺🇸 All 50 states + progressive tax brackets',
          '💰 FICA tax & deduction breakdowns',
          '🏦 401(k), HSA & Traditional IRA pre-tax planning',
          '📊 Effective vs marginal tax rate analysis',
          '💾 Export paycheck analysis to PDF & Excel',
          '🔄 Save & share via URL',
        ]}
        steps={[
          { title: 'Enter your gross income', desc: 'Input your gross salary and select your pay frequency — annual, monthly, biweekly, weekly, or hourly.' },
          { title: 'Select filing status and state', desc: 'Choose your tax filing status and select your state to include state income tax.' },
          { title: 'Add pre-tax deductions', desc: 'Enter your annual 401(k), HSA, and Traditional IRA contributions.' },
          { title: 'Review your paycheck breakdown', desc: 'View the complete breakdown showing federal tax, state tax, Social Security, Medicare, and net take-home pay.' },
        ]}
        faqs={[
          { q: 'How is my take-home pay calculated?', a: 'Your take-home pay starts with gross income, then subtracts federal income tax (based on progressive brackets), state income tax, Social Security tax (6.2%), Medicare tax (1.45%), and any pre-tax deductions like 401(k) or HSA contributions.' },
          { q: 'What is the FICA tax rate for 2025?', a: 'The FICA tax rate for 2025 is 7.65% for employees — 6.2% for Social Security (on income up to $176,100) and 1.45% for Medicare (no income cap). High earners pay an additional 0.9% Medicare surtax on wages exceeding $200,000.' },
          { q: 'Which states have no income tax?', a: 'Nine US states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming.' },
          { q: 'How does a 401(k) reduce my taxes?', a: 'Traditional 401(k) contributions are made pre-tax, meaning they reduce your taxable income for the year. At a 22% federal bracket, contributing $10,000 saves roughly $2,200 in federal taxes alone.' },
          { q: 'What is the difference between marginal and effective tax rate?', a: 'Your marginal tax rate is the rate applied to your last dollar of income — the highest bracket you fall into. Your effective tax rate is the average rate across all your income. Because the US tax system is progressive, your effective rate is always lower than your marginal rate.' },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Understanding Your US Paycheck: A Complete Gross-to-Net Guide</h2>
            <p className="text-slate-600 leading-relaxed">The gap between your gross salary — the number you negotiated — and your net pay — the amount that actually hits your bank account — can feel surprisingly large. Understanding that gap is the first step toward making smarter financial decisions.</p>
            <p className="text-slate-600 leading-relaxed">One of the biggest confusion points is the difference between your <strong>tax bracket</strong> and the <strong>actual percentage you pay</strong>. The US uses a progressive tax system, which means only the income within each bracket is taxed at that bracket's rate — not your entire salary. So even if you "jump into the 24% bracket," most of your income is still taxed at lower rates.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">How Federal Income Tax Works in 2025</h3>
            <p className="text-slate-600 leading-relaxed">The US federal income tax system is <strong>progressive</strong>, meaning your income is split into chunks, and each chunk is taxed at a progressively higher rate. For 2025, there are seven brackets: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. Before your income hits those brackets, you subtract the <strong>standard deduction</strong> — $15,000 for single filers and $30,000 for married filing jointly.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">FICA Taxes: Social Security and Medicare</h3>
            <p className="text-slate-600 leading-relaxed">FICA stands for the Federal Insurance Contributions Act. Unlike income tax, FICA is a flat-rate tax with no brackets, no standard deduction, and no filing-status adjustments. The combined employee rate is 7.65% (6.2% Social Security + 1.45% Medicare). On a $75,000 salary, that's about $5,738 per year before you even see income tax.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Pre-Tax Deductions: Your Tax-Shield Strategy</h3>
            <p className="text-slate-600 leading-relaxed">Pre-tax deductions reduce your taxable income dollar-for-dollar. A $10,000 401(k) contribution at a 22% marginal rate saves roughly $2,200 in federal taxes. HSA contributions are especially valuable because they offer a <strong>triple tax advantage</strong>: contributions are pre-tax, growth is tax-free, and withdrawals for qualified medical expenses are tax-free.</p>
          </section>
        }
        relatedTools={[
          { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🧾' },
          { name: '401(k) Calculator', href: '/finance/401k-calculator', icon: '🏦' },
          { name: 'HSA Calculator', href: '/finance/hsa-calculator', icon: '🏥' },
        ]}
        relatedArticles={[
          { title: 'US Tax Brackets, Deductions & Take-Home Pay', href: '/finance/learn/us-tax-brackets-deductions-take-home-pay' },
          { title: 'Gross Pay vs Net Pay', href: '/finance/learn/gross-pay-vs-net-pay' },
        ]}
      />
    </>
  );
}
