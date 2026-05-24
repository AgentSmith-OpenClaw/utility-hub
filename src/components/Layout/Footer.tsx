import Link from 'next/link';

const footerSections = [
  {
    title: 'Finance',
    links: [
      { label: 'EMI Calculator', href: '/finance/emi-calculator' },
      { label: 'FIRE Calculator', href: '/finance/fire-calculator' },
      { label: 'SIP Calculator', href: '/finance/sip-calculator' },
      { label: 'Income Tax Calculator', href: '/finance/income-tax-calculator' },
      { label: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { label: 'Refi Break-Even Calculator', href: '/finance/mortgage-refinance-breakeven-calculator' },
      { label: 'Capital Gains Tax Calculator', href: '/finance/capital-gains-tax-calculator' },
      { label: 'All finance calculators', href: '/finance' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'JSON Viewer & Formatter', href: '/tools/json-viewer' },
      { label: 'URL Encoder / Decoder', href: '/tools/url-encoder' },
      { label: 'Word Counter', href: '/tools/word-counter' },
      { label: 'Base64 Encoder', href: '/tools/base64' },
      { label: 'Regex Tester', href: '/tools/regex-tester' },
      { label: 'All utilities', href: '/tools' },
    ],
  },
  {
    title: 'PDF Tools',
    links: [
      { label: 'Merge PDF', href: '/pdf/merge-pdf' },
      { label: 'Split PDF', href: '/pdf/split-pdf' },
      { label: 'Rotate PDF', href: '/pdf/rotate-pdf' },
      { label: 'Compress PDF', href: '/pdf/compress-pdf' },
      { label: 'JPG to PDF', href: '/pdf/jpg-to-pdf' },
      { label: 'All PDF tools', href: '/pdf' },
    ],
  },
  {
    title: 'Image Tools',
    links: [
      { label: 'Compress Image', href: '/image/compress-image' },
      { label: 'Resize Image', href: '/image/resize-image' },
      { label: 'Convert to JPG', href: '/image/convert-to-jpg' },
      { label: 'Remove Background', href: '/image/remove-background' },
      { label: 'All image tools', href: '/image' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Finance guides', href: '/finance/learn' },
      { label: 'Tools guides', href: '/tools/learn' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img
                src="/logo.svg"
                alt="Toolisk Logo"
                className="w-7 h-7"
                width={28}
                height={28}
              />
              <span className="text-lg font-bold text-slate-900">Toolisk</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Free, high-performance online tools. Fast, private, and all in one place.
            </p>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {currentYear} Toolisk — Free online tools for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
