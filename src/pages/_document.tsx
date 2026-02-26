import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#4f46e5" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
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
              logo: 'https://toolisk.com/logo.svg',
              description:
                'Free collection of high-performance online tools and utilities.',
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
                <a href="/finance/emi-calculator">EMI Calculator</a> — Advanced EMI
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
