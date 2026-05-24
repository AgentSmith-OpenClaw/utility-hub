import Head from 'next/head';
import AmortizationCalculator from '../../components/AmortizationCalculator/AmortizationCalculator';
import ToolShell from '../../components/Tools/ToolShell';
import ToolSEOContent from '../../components/Tools/ToolSEOContent';
import { generateBreadcrumbs, SITE_URL } from '../../utils/siteConfig';

export default function AmortizationCalculatorPage() {
  const breadcrumbSchema = generateBreadcrumbs('/finance/amortization-calculator');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An amortization schedule is a detailed table showing every payment over your loan life, breaking down how much goes to principal versus interest each month. It reveals that early payments are mostly interest while later payments are mostly principal. This schedule helps you understand true loan costs and optimal prepayment timing."
        }
      },
      {
        "@type": "Question",
        "name": "Why is most of my early EMI going to interest?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Loans calculate interest on outstanding principal balance. Early on, your principal is highest, so interest is highest. As you repay principal over time, interest charges decrease while your EMI stays constant, meaning more goes to principal. This front-loading of interest explains why prepaying early saves dramatically more than prepaying late."
        }
      },
      {
        "@type": "Question",
        "name": "How do prepayments affect my amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Prepayments directly reduce principal, which decreases interest on all future payments. You can either reduce EMI (keeping tenure same) or reduce tenure (keeping EMI same). Reducing tenure saves more total interest. A ₹5 lakh prepayment on a ₹50 lakh loan can cut years off your loan and save lakhs in interest."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use amortization schedules for tax planning?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, schedules show exactly how much interest you'll pay each year, helping you plan Section 24 deductions (up to ₹2 lakhs). You'll see when interest deduction drops below the limit, which might inform your new vs old tax regime choice. Schedules also show principal repayment for Section 80C planning within the ₹1.5 lakh limit."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I review my amortization schedule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Review annually or when making prepayments to track progress and plan future prepayments. After each prepayment, generate a new schedule reflecting reduced principal. This helps you visualize how much faster you're reducing debt and motivates continued prepayment. Some people review quarterly to stay engaged with their loan reduction progress."
        }
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Amortization Calculator",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Generate detailed amortization schedules showing principal and interest breakdown for every loan payment over the full tenure.",
    "operatingSystem": "All",
    "featureList": "Month-by-month amortization schedule, Principal vs interest breakdown, Yearly summary, Prepayment analysis, PDF export, Excel export",
    "url": `${SITE_URL}/finance/amortization-calculator`
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Generate a Loan Amortization Schedule",
    "description": "Use the free Toolisk Amortization Calculator to create a detailed month-by-month loan repayment schedule showing principal and interest breakdown.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter your loan details",
        "text": "Input your total loan amount, annual interest rate, and loan tenure in years. The calculator instantly generates a complete amortization schedule."
      },
      {
        "@type": "HowToStep",
        "name": "Review monthly breakdown",
        "text": "View the month-by-month table showing how each payment is split between principal repayment and interest, with running totals and remaining balance."
      },
      {
        "@type": "HowToStep",
        "name": "Analyze yearly summaries",
        "text": "Check the yearly summary to see annual principal paid, interest paid, and how the ratio shifts over time as more of each payment goes toward principal."
      },
      {
        "@type": "HowToStep",
        "name": "Compare different terms",
        "text": "Adjust the loan term or interest rate to compare schedules side by side and see how small changes affect total interest and monthly payments."
      },
      {
        "@type": "HowToStep",
        "name": "Export your schedule",
        "text": "Download the complete amortization table as an Excel spreadsheet or PDF report to share with your lender or financial advisor."
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Amortization Calculator — Loan Schedule | Toolisk</title>
        <meta 
          name="description" 
          content="Generate month-by-month amortization schedules. Track principal vs interest for every payment, see cumulative interest, and analyze how prepayments shorten your loan." 
        />
        <meta 
          name="keywords" 
          content="amortization calculator, loan schedule, principal interest breakdown, prepayment planning, loan amortization table, mortgage schedule, Excel export" 
        />
        <link rel="canonical" href={`${SITE_URL}/finance/amortization-calculator`} />
        <meta property="og:title" content="Amortization Calculator — Loan Schedule & Interest Breakdown" />
        <meta property="og:description" content="Generate month-by-month loan amortization schedules with principal vs interest breakdown and prepayment analysis." />
        <meta property="og:url" content={`${SITE_URL}/finance/amortization-calculator`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Amortization Calculator — Loan Schedule & Interest Breakdown | Toolisk" />
        <meta name="twitter:description" content="Generate month-by-month amortization schedules. Track principal vs interest and analyze prepayment impact." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, softwareSchema, howToSchema]) }}
        />
      </Head>

      <ToolShell parent="finance" icon="📋" title="Amortization Calculator" tagline="Generate month-by-month amortization schedules with principal vs interest breakdown." gradient="from-slate-700 via-slate-800 to-slate-900">
        <AmortizationCalculator />
      </ToolShell>

      <ToolSEOContent
        description="Generate detailed month-by-month loan repayment schedules showing exactly how much principal and interest you pay with each installment. Analyze prepayment impact and export to PDF or Excel."
        features={[
          '📅 Complete month-by-month schedule',
          '📊 Principal vs interest breakdown',
          '📈 Interactive amortization charts',
          '🔍 Yearly summaries & insights',
          '💾 Export full schedule to PDF & Excel',
          '🔄 Compare different loan terms',
        ]}
        steps={[
          { title: 'Enter your loan details', desc: 'Input your total loan amount, annual interest rate, and loan tenure in years.' },
          { title: 'Review monthly breakdown', desc: 'View the month-by-month table showing principal repayment and interest split.' },
          { title: 'Analyze yearly summaries', desc: 'Check the yearly summary to see how the principal-interest ratio shifts over time.' },
          { title: 'Export your schedule', desc: 'Download the complete amortization table as Excel or PDF.' },
        ]}
        faqs={[
          { q: 'What is an amortization schedule?', a: 'An amortization schedule is a detailed table showing every payment over your loan life, breaking down how much goes to principal versus interest each month. It reveals that early payments are mostly interest while later payments are mostly principal.' },
          { q: 'Why is most of my early EMI going to interest?', a: 'Loans calculate interest on outstanding principal balance. Early on, your principal is highest, so interest is highest. As you repay principal over time, interest charges decrease while your EMI stays constant, meaning more goes to principal.' },
          { q: 'How do prepayments affect my amortization schedule?', a: 'Prepayments directly reduce principal, which decreases interest on all future payments. You can either reduce EMI (keeping tenure same) or reduce tenure (keeping EMI same). Reducing tenure saves more total interest.' },
          { q: 'Can I use amortization schedules for tax planning?', a: 'Yes, schedules show exactly how much interest you\'ll pay each year, helping you plan Section 24 deductions (up to ₹2 lakhs). You\'ll see when interest deduction drops below the limit.' },
          { q: 'How often should I review my amortization schedule?', a: 'Review annually or when making prepayments to track progress and plan future prepayments. After each prepayment, generate a new schedule reflecting reduced principal.' },
        ]}
        body={
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">How Amortization Front-Loads Interest</h2>
            <p className="text-slate-600 leading-relaxed">Each EMI is the same amount, but the split between interest and principal shifts dramatically over time. Early payments are mostly interest — on a ₹50L, 8.5%, 20-year loan, roughly 82% of your first EMI disappears as interest. After 10 years (50% of payments), you've reduced principal by only 30–35%. This isn't a lender trick; it's just how compound interest math works.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Why Prepayment Timing Changes Everything</h3>
            <p className="text-slate-600 leading-relaxed">The same ₹5 lakh prepayment delivers wildly different results depending on when in the loan you make it. A year-2 prepayment on a ₹50L, 8.5%, 20-year loan saves ~₹9.5 lakhs in interest and cuts tenure by ~4.5 years. The same prepayment in year 15 saves only ~₹2.8 lakhs — 3.4× smaller. Aggressive prepayment in years 1–7 delivers the highest return per rupee.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Reduce Tenure or Reduce EMI?</h3>
            <p className="text-slate-600 leading-relaxed">When you prepay, lenders give you a choice. Mathematically, reducing tenure always wins — it saves more total interest and makes you debt-free faster. Reducing EMI gives monthly cashflow relief but keeps you in debt longer. Choose tenure reduction by default; switch to EMI reduction only if you hit financial stress.</p>
            <h3 className="text-xl font-bold text-slate-900 mt-6">Using Your Schedule for Tax Planning</h3>
            <p className="text-slate-600 leading-relaxed">Your amortization schedule is a tax planning document. It tells you exactly what deductions to claim each year. Section 24 allows up to ₹2L/year interest deduction (old regime). Section 80C counts principal repayment toward the ₹1.5L limit. When interest drops below ₹2L (usually year 13–15), the old regime advantage shrinks.</p>
          </section>
        }
        relatedTools={[
          { name: 'EMI Calculator', href: '/finance/emi-calculator', icon: '🏦' },
          { name: 'Buy vs Rent Calculator', href: '/finance/buy-vs-rent-calculator', icon: '🏡' },
          { name: 'Income Tax Calculator', href: '/finance/income-tax-calculator', icon: '🧾' },
          { name: 'Compound Interest Calculator', href: '/finance/compound-interest-calculator', icon: '📈' },
        ]}
        relatedArticles={[
          { title: 'Amortization Explained: Why Interest Is Heavy Early', href: '/finance/learn/amortization-explained-why-interest-heavy-early' },
        ]}
      />


    </>
  );
}
