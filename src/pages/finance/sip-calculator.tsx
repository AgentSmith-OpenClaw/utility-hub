import Head from 'next/head';
import SIPWealthPlanner from '../../components/SIPWealthPlanner/SIPWealthPlanner';

export default function SIPCalculatorPage() {
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a good expected rate of return for SIP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Historically, diversified Indian equity mutual funds have delivered 12-15% annualized returns over 10+ year periods. For conservative planning, use 10-12%. For debt funds, 6-8%.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much should I increase my SIP every year?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 10% annual step-up is a practical benchmark for most salaried individuals. It roughly matches the average salary hike in India.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between XIRR and CAGR for SIP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'XIRR accounts for the exact timing of each monthly SIP cashflow, giving the true annualized return. CAGR treats the total invested amount as a single lump sum at day one, drastically underestimating returns for SIP.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does inflation-adjusted return mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Inflation-adjusted (real) return shows the purchasing power of your future corpus in today\'s money. With 6% inflation, ₹1 crore in 20 years is worth approximately ₹31 lakhs in today\'s terms.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I export my SIP plan as PDF or Excel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, this planner supports both PDF and Excel export. PDF captures the visual layout, while Excel provides detailed year-wise data across multiple sheets for further analysis.',
        },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Advanced SIP Calculator with Step-Up & Inflation — Free Online Tool | Toolisk</title>
        <meta
          name="description"
          content="Free advanced SIP calculator with step-up SIP projections, XIRR computation, inflation-adjusted returns, goal-based planning, delay cost analysis, and PDF/Excel export. Plan your mutual fund SIP investment with interactive charts."
        />
        <meta
          name="keywords"
          content="sip calculator, step up sip calculator, wealth planner, inflation adjusted returns, mutual fund sip calculator, goal based sip, investment planner, xirr calculator, sip step up, sip return calculator, delay cost calculator, sip vs lumpsum, monthly sip calculator india, best sip calculator online"
        />
        <link rel="canonical" href="https://toolisk.com/finance/sip-calculator" />
        <meta property="og:title" content="Advanced SIP Calculator with Step-Up & Inflation — Toolisk" />
        <meta
          property="og:description"
          content="Plan SIP investments with annual step-up, inflation-adjusted projections, XIRR computation, delay cost analysis, and what-if comparisons. Export to PDF & Excel."
        />
        <meta property="og:url" content="https://toolisk.com/finance/sip-calculator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced SIP Calculator with Step-Up & Inflation" />
        <meta
          name="twitter:description"
          content="Step-up SIP + inflation-aware planning with XIRR, delay cost analysis, interactive charts, and shareable plan URLs."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      </Head>

      <SIPWealthPlanner />
    </>
  );
}
