import Link from 'next/link';

const footerSections = [
  {
    title: 'Tools',
    links: [
      { label: 'Income Tax Calculator', href: '/finance/income-tax-calculator' },
      { label: 'EMI Calculator', href: '/finance/emi-calculator' },
      { label: 'FIRE Calculator', href: '/finance/fire-calculator' },
      { label: 'SIP Calculator', href: '/finance/sip-calculator' },
      { label: 'Compound Interest', href: '/finance/compound-interest-calculator' },
      { label: 'Mortgage Payoff vs Invest', href: '/finance/mortgage-payoff-calculator' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Finance Blog Index', href: '/finance/learn' },
      { label: 'EMI & Loans', href: '/finance/learn/understanding-emi-calculations' },
      { label: 'FIRE & Retirement', href: '/finance/learn/fire-movement-explained' },
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-8">
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
