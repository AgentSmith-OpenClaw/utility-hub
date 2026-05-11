export const SITE_URL = 'https://toolisk.com';

export const BREADCRUMB_LABELS: Record<string, string> = {
  'finance': 'Finance Calculators',
  'emi-calculator': 'EMI Calculator',
  'sip-calculator': 'SIP Calculator',
  'compound-interest-calculator': 'Compound Interest Calculator',
  'fire-calculator': 'FIRE Calculator',
  'mortgage-calculator': 'Mortgage Calculator',
  'buy-vs-rent-calculator': 'Buy vs Rent Calculator',
  'income-tax-calculator': 'Income Tax Calculator',
  'amortization-calculator': 'Amortization Calculator',
  'us-paycheck-calculator': 'US Paycheck Calculator',
  'credit-card-payoff-calculator': 'Credit Card Payoff Calculator',
  '401k-calculator': '401(k) Retirement Calculator',
  'roth-vs-traditional-ira': 'Roth vs Traditional IRA Calculator',
  'auto-loan-calculator': 'Auto Loan Calculator',
  'student-loan-calculator': 'Student Loan Calculator',
  'investment-calculator': 'Investment Calculator',
  'rental-roi-calculator': 'Rental Property ROI Calculator',
  'net-worth-calculator': 'Net Worth Calculator',
  'inflation-calculator': 'US Inflation Calculator',
  'sales-tax-vat-gst-calculator': 'Sales Tax / VAT / GST Calculator',
  'tip-calculator': 'Tip Calculator',
  'tools': 'Tools',
  'url-encoder': 'URL Encoder / Decoder',
  'json-viewer': 'JSON Viewer & Formatter',
  'word-counter': 'Word Counter',
  'base64': 'Base64 Encoder / Decoder',
  'color-converter': 'Color Converter',
  'hash-generator': 'Hash Generator',
  'lorem-ipsum': 'Lorem Ipsum Generator',
  'case-converter': 'Case Converter',
  'regex-tester': 'Regex Tester',
  'timestamp-converter': 'Timestamp Converter',
  'uuid-generator': 'UUID Generator',
  'jwt-decoder': 'JWT Decoder',
  'password-generator': 'Password Generator',
  'html-entities': 'HTML Entities Encoder & Decoder',
  'sql-formatter': 'SQL Formatter',
  'slug-generator': 'URL Slug Generator',
  'css-unit-converter': 'CSS Unit Converter',
  'cron-parser': 'Cron Expression Parser',
  'text-diff': 'Text Diff Checker',
  'markdown-preview': 'Markdown Preview',
  'yaml-json-converter': 'YAML / JSON Converter',
  'number-base-converter': 'Number Base Converter',
  'image-base64': 'Image to Base64 Converter',
  'percentage-calculator': 'Percentage Calculator',
  'age-calculator': 'Age & Date Calculator',
  'unit-converter': 'Unit Converter',
  'color-palette': 'Color Palette Generator',
  'morse-code': 'Morse Code Converter',
  'text-binary': 'Text to Binary / Hex',
  'caesar-cipher': 'Caesar Cipher & ROT13',
  'xml-formatter': 'XML Formatter & Validator',
  'http-status-codes': 'HTTP Status Codes',
  'aspect-ratio': 'Aspect Ratio Calculator',
  'pomodoro-timer': 'Pomodoro Timer',
  'json-csv': 'JSON ↔ CSV Converter',
  'chmod-calculator': 'Chmod Calculator',
};

interface FaqEntry { q: string; a: string }

/**
 * SoftwareApplication JSON-LD for a tool/calculator page.
 * Pass `category: 'FinanceApplication'` for finance tools, default is DeveloperApplication.
 */
export function generateSoftwareAppSchema(opts: {
  name: string;
  slug: string;
  description: string;
  category?: 'DeveloperApplication' | 'FinanceApplication' | 'SecurityApplication' | 'UtilitiesApplication';
  featureList?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    applicationCategory: opts.category ?? 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: opts.description,
    url: `${SITE_URL}${opts.slug}`,
    ...(opts.featureList ? { featureList: opts.featureList } : {}),
  };
}

/**
 * FAQPage JSON-LD from a list of {q, a} entries.
 */
export function generateFaqSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": SITE_URL
    }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = BREADCRUMB_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      "@type": "ListItem",
      "position": breadcrumbs.length + 1,
      "name": label,
      "item": `${SITE_URL}${currentPath}`
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  };
}
