import Link from 'next/link';
import { BREADCRUMB_LABELS } from '../../utils/siteConfig';

interface BreadcrumbTrailProps {
  pathname: string;
  className?: string;
}

function labelFor(segment: string) {
  return BREADCRUMB_LABELS[segment] || segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function BreadcrumbTrail({ pathname, className = '' }: BreadcrumbTrailProps) {
  const cleanPath = pathname.split('?')[0].split('#')[0];
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  let currentPath = '';
  const items = segments.map((segment) => {
    currentPath += `/${segment}`;
    return {
      href: currentPath,
      label: labelFor(segment),
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={`bg-white border-b border-slate-100 ${className}`}
    >
      <ol className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <li>
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-slate-300">/</span>
              {isLast ? (
                <span className="font-medium text-slate-700">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
