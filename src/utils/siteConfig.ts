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
};

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
