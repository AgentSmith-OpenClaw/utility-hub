import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#4f46e5" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8ZXGEHK3C0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8ZXGEHK3C0', { send_page_view: false });
            `,
          }}
        />

        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Toolisk',
              url: 'https://toolisk.com/',
              description:
                'Free online tools for daily use — fast, private, and feature-rich. A growing collection of utilities consolidated in one place.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://toolisk.com/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Toolisk',
              url: 'https://toolisk.com/',
              logo: 'https://toolisk.com/logo192.png',
              description:
                'Free, open-source collection of high-performance online tools and utilities.',
            }),
          }}
        />

        {/* JSON-LD: WebApplication — EMI Calculator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Mortgage Calculator',
              description:
                'Free mortgage calculator and home loan interest calculator for US, UK, Canada, and Europe. Calculate monthly payments, analyze prepayment impact, compare strategies, view 8 interactive charts, and export amortization schedules.',
              url: 'https://toolisk.com/emi-calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              browserRequirements: 'Requires JavaScript',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              featureList: [
                'Mortgage Payment Calculator for Home Loans',
                'Multiple Prepayment Strategies (One-time, Monthly, Quarterly, Yearly)',
                'Extra Payment Impact Analysis and Comparison',
                '8 Interactive Charts and Graphs',
                'Loan Amortization Schedule with Excel Export',
                'Calculate Interest Savings from Additional Payments',
                'Calculation History with LocalStorage Persistence',
              ],
              softwareVersion: '2.0',
              datePublished: '2026-02-01',
              inLanguage: 'en',
            }),
          }}
        />

        {/* JSON-LD: FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is a mortgage payment and how is it calculated?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A mortgage payment is the monthly amount paid to repay a home loan. It is calculated using the formula: Payment = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the principal loan amount, r is the monthly interest rate, and n is the total number of monthly payments (loan term in months).',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do extra mortgage payments reduce my loan?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Extra payments go directly toward your loan principal, reducing the amount you owe and the interest charged over time. You can either keep the same payment amount and shorten your loan term, or reduce your monthly payment while keeping the same term. The first option saves the most interest.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much can I save with mortgage prepayments?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'On a $400,000 mortgage at 6.5% for 30 years, making quarterly extra payments of $5,000 can save over $100,000 in interest and reduce the loan term by 8-10 years. Savings depend on your interest rate, loan amount, prepayment frequency, and how early you start making extra payments.',
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD: BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://toolisk.com/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Mortgage Calculator',
                  item: 'https://toolisk.com/emi-calculator',
                },
              ],
            }),
          }}
        />
      </Head>
      <body>
        <noscript>
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              padding: 20,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <h1>Toolisk — Free Online Tools</h1>
            <p>
              Toolisk is a collection of high-performance, free online tools with
              great features — fast, private, and consolidated in one place.
            </p>
            <h2>Available Tools</h2>
            <ul>
              <li>
                <a href="/emi-calculator">EMI Calculator</a> — Advanced EMI
                calculator for home loan, car loan &amp; personal loan with prepayment
                analysis, charts, and Excel export.
              </li>
            </ul>
            <p>
              <strong>
                Please enable JavaScript to use the interactive tools.
              </strong>
            </p>
          </div>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
