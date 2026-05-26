import { VARIANT_BREADCRUMB_LABELS } from '../content/finance-variants/_labels';

export const SITE_URL = 'https://toolisk.com';

const STATIC_BREADCRUMB_LABELS: Record<string, string> = {
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
  'pdf': 'PDF Tools',
  'merge-pdf': 'Merge PDF',
  'split-pdf': 'Split PDF',
  'rotate-pdf': 'Rotate PDF',
  'jpg-to-pdf': 'JPG to PDF',
  'pdf-to-jpg': 'PDF to JPG',
  'pdf-to-png': 'PDF to PNG',
  'pdf-to-text': 'PDF to Text',
  'delete-pdf-pages': 'Delete Pages from PDF',
  'reorder-pdf-pages': 'Reorder PDF Pages',
  'compress-pdf': 'Compress PDF',
  'unlock-pdf': 'Unlock PDF',
  'protect-pdf': 'Protect PDF',
  'pdf-page-counter': 'PDF Page Counter',
  'pdf-metadata-editor': 'PDF Metadata Editor',
  'extract-pdf-pages': 'Extract Pages from PDF',
  'flatten-pdf-form': 'Flatten PDF Form',
  'resize-pdf': 'Resize PDF',
  'crop-pdf': 'Crop PDF',
  'add-page-numbers': 'Add Page Numbers',
  'add-watermark': 'Add Watermark',
  'combine-pdf-images': 'Combine PDF & Images',
  'n-up-pdf': 'N-up PDF',
  'pdf-signature': 'PDF Signature',
  'tools': 'Tools',
  'utilities': 'Everyday Tools',
  'health': 'Health Tools',
  'image': 'Image Tools',
  'bmi-calculator': 'BMI Calculator',
  'bmr-calculator': 'BMR Calculator',
  'protein-calculator': 'Protein Calculator',
  'body-fat-calculator': 'Body Fat Calculator',
  'calorie-deficit-calculator': 'Calorie Deficit Calculator',
  'tdee-calculator': 'TDEE Calculator',
  'calorie-calculator': 'Calorie Calculator',
  'sleep-calculator': 'Sleep Calculator',
  'waist-to-hip-calculator': 'Waist-to-Hip Ratio Calculator',
  'due-date-calculator': 'Pregnancy Due Date Calculator',
  'heart-rate-calculator': 'Target Heart Rate Calculator',
  'ideal-weight-calculator': 'Ideal Weight Calculator',
  'water-intake-calculator': 'Water Intake Calculator',
  'blood-pressure-calculator': 'Blood Pressure Calculator',
  'keto-calculator': 'Keto Calculator',
  'ovulation-calculator': 'Ovulation Calculator',
  'period-calculator': 'Period Calculator',
  'pregnancy-weight-gain-calculator': 'Pregnancy Weight Gain Calculator',
  'vitamin-d-calculator': 'Vitamin D Calculator',
  'bac-calculator': 'BAC Calculator',
  'anxiety-score-calculator': 'Anxiety Score Calculator',
  'caffeine-calculator': 'Caffeine Calculator',
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
  'jsonpath-tester': 'JSONPath Tester',
  'json-diff': 'JSON Diff',
  'jwt-generator': 'JWT Generator',
  'cidr-subnet-calculator': 'CIDR / Subnet Calculator',
  'qr-code-generator': 'QR Code Generator',
  'box-shadow-generator': 'CSS Box Shadow Generator',
  'color-contrast-checker': 'Color Contrast Checker',
  'curl-to-code': 'cURL to Code Converter',
  'user-agent-parser': 'User Agent Parser',
  'compress-image': 'Image Compressor',
  'resize-image': 'Image Resizer',
  'convert-to-jpg': 'Convert to JPG',
  'convert-to-avif': 'Convert to AVIF',
  'convert-to-png': 'Convert to PNG',
  'convert-to-webp': 'Convert to WebP',
  'heic-to-jpg': 'HEIC to JPG',
  'image-watermark': 'Image Watermark',
  'flip-image': 'Flip Image',
  'rotate-image': 'Rotate Image',
  'remove-background': 'Background Remover',
  'favicon-generator': 'Favicon Generator',
  'image-color-picker': 'Image Color Picker',
  'crop-image': 'Crop Image',
  'image-border': 'Image Border',
  'exif-remover': 'EXIF Remover',
  'round-image-corners': 'Round Image Corners',
  'image-format-detector': 'Image Format Detector',
'pixelate-image': 'Pixelate / Blur',
  'svg-to-png': 'SVG to PNG',
  'cholesterol-calculator': 'Cholesterol Calculator',
  'glycemic-index-calculator': 'Glycemic Index Calculator',
  'loan-comparison-calculator': 'Loan Comparison Calculator',
  'gradient-generator': 'CSS Gradient Generator',
};

// Merged label map: static labels + auto-generated labels from finance variants.
// Variant labels override static where slugs overlap, but the registry's
// collision guard prevents that from happening in practice.
export const BREADCRUMB_LABELS: Record<string, string> = {
  ...STATIC_BREADCRUMB_LABELS,
  ...VARIANT_BREADCRUMB_LABELS,
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
